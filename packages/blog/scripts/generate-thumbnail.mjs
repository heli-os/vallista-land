import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const BLOG_ROOT = resolve(SCRIPT_DIR, '..')
const COMMON_STYLE =
  'Minimalist editorial illustration, muted warm tones, soft grain texture, no text, 16:9 aspect ratio, blog thumbnail style'

const getArgument = (name) => {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const unquote = (value) => value.trim().replace(/^(["'])(.*)\1$/, '$2')

const readPrompt = (markdown) => {
  const match = markdown.match(/^imagePrompt:\s*(.+)$/m)
  return match ? unquote(match[1]) : undefined
}

const requestImagen = async (apiKey, prompt) => {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: '16:9' }
      })
    }
  )

  if (!response.ok) throw new Error(`Imagen 요청 실패 (${response.status}): ${await response.text()}`)
  const payload = await response.json()
  const encoded = payload.predictions?.[0]?.bytesBase64Encoded
  if (!encoded) throw new Error('Imagen 응답에서 이미지 데이터를 찾지 못했습니다.')
  return Buffer.from(encoded, 'base64')
}

const requestGemini = async (apiKey, prompt) => {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
      })
    }
  )

  if (!response.ok) throw new Error(`Gemini 요청 실패 (${response.status}): ${await response.text()}`)
  const payload = await response.json()
  const imagePart = payload.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData?.data || part.inline_data?.data
  )
  const encoded = imagePart?.inlineData?.data || imagePart?.inline_data?.data
  if (!encoded) throw new Error('Gemini 응답에서 이미지 데이터를 찾지 못했습니다.')
  return Buffer.from(encoded, 'base64')
}

const main = async () => {
  const postArgument = getArgument('--post')
  if (!postArgument) {
    throw new Error('사용법: node scripts/generate-thumbnail.mjs --post <글 폴더 또는 index.md 경로>')
  }

  const suppliedPath = resolve(process.cwd(), postArgument)
  const markdownPath = suppliedPath.endsWith('.md') ? suppliedPath : join(suppliedPath, 'index.md')
  if (!existsSync(markdownPath)) throw new Error(`글 파일을 찾지 못했습니다: ${markdownPath}`)

  const markdown = readFileSync(markdownPath, 'utf8')
  const configuredPrompt = getArgument('--prompt') || readPrompt(markdown)
  if (!configuredPrompt) throw new Error('frontmatter의 imagePrompt 또는 --prompt 인자가 필요합니다.')
  const prompt = configuredPrompt.includes(COMMON_STYLE) ? configuredPrompt : `${configuredPrompt}. ${COMMON_STYLE}`
  const outputPath = join(dirname(markdownPath), 'assets', 'thumbnail.jpeg')
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error('[generate-thumbnail] GEMINI_API_KEY가 없습니다. 아래 프롬프트로 수동 생성하세요.')
    console.error(prompt)
    process.exitCode = 2
    return
  }

  // 이미지 생성 비용을 쓰기 전에 저장 경로를 확보한다. sharp의 toFile은 상위 디렉터리를 만들지 않는다.
  mkdirSync(dirname(outputPath), { recursive: true })

  let source
  try {
    source = await requestImagen(apiKey, prompt)
    console.log('✓ imagen-4.0-generate-001 생성 완료')
  } catch (imagenError) {
    console.warn(`[generate-thumbnail] Imagen 실패: ${imagenError.message}`)
    source = await requestGemini(apiKey, prompt)
    console.log('✓ gemini-2.5-flash-image 폴백 완료')
  }

  await sharp(source)
    .resize(1536, 864, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outputPath)

  console.log(`✓ ${outputPath.replace(`${BLOG_ROOT}/`, '')} (1536x864 JPEG)`)
}

main().catch((error) => {
  console.error(`[generate-thumbnail] ${error.message}`)
  process.exit(1)
})
