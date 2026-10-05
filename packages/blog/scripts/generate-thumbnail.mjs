import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const BLOG_ROOT = resolve(SCRIPT_DIR, '..')
const COMMON_STYLE =
  'Minimalist editorial illustration, muted warm tones, soft grain texture, no text, 16:9 aspect ratio, blog thumbnail style'
// Codex가 생성 원본을 복사해 두는 임시 파일. sharp 후처리 뒤 지운다.
const SOURCE_FILE_NAME = 'thumbnail-source.png'

const getArgument = (name) => {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const unquote = (value) => value.trim().replace(/^(["'])(.*)\1$/, '$2')

const readPrompt = (markdown) => {
  const match = markdown.match(/^imagePrompt:\s*(.+)$/m)
  return match ? unquote(match[1]) : undefined
}

const buildCodexInstruction = (prompt) =>
  [
    'Generate exactly ONE landscape 16:9 image with your built-in image_gen tool. Do not draw it with code, SVG, or HTML.',
    `Image prompt: ${prompt}`,
    `After generation, copy the generated file without any conversion to ./${SOURCE_FILE_NAME} in the current directory.`,
    'Do not create, modify, or delete any other file.'
  ].join('\n\n')

// Codex CLI 별도 세션에 생성을 맡긴다. 쓰기 권한은 assets 디렉터리로 한정한다.
const requestCodex = (assetsDir, prompt) => {
  const result = spawnSync(
    'codex',
    ['exec', '-s', 'workspace-write', '--skip-git-repo-check', '-C', assetsDir, buildCodexInstruction(prompt)],
    { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' }
  )

  if (result.error) throw new Error(`codex 실행 실패: ${result.error.message}`)
  if (result.status !== 0) throw new Error(`codex 종료 코드 ${result.status}: ${result.stderr.trim().slice(-500)}`)

  const sourcePath = join(assetsDir, SOURCE_FILE_NAME)
  if (!existsSync(sourcePath)) throw new Error(`codex가 ${SOURCE_FILE_NAME}를 만들지 않았습니다.`)
  return sourcePath
}

const main = async () => {
  const postArgument = getArgument('--post')
  if (!postArgument) {
    throw new Error('사용법: node scripts/generate-thumbnail.mjs --post <글 폴더 또는 index.md 경로> [--prompt "<프롬프트>"]')
  }

  const suppliedPath = resolve(process.cwd(), postArgument)
  const markdownPath = suppliedPath.endsWith('.md') ? suppliedPath : join(suppliedPath, 'index.md')
  if (!existsSync(markdownPath)) throw new Error(`글 파일을 찾지 못했습니다: ${markdownPath}`)

  const markdown = readFileSync(markdownPath, 'utf8')
  const configuredPrompt = getArgument('--prompt') || readPrompt(markdown)
  if (!configuredPrompt) throw new Error('frontmatter의 imagePrompt 또는 --prompt 인자가 필요합니다.')
  const prompt = configuredPrompt.includes(COMMON_STYLE) ? configuredPrompt : `${configuredPrompt}. ${COMMON_STYLE}`
  const assetsDir = join(dirname(markdownPath), 'assets')
  const outputPath = join(assetsDir, 'thumbnail.jpeg')

  mkdirSync(assetsDir, { recursive: true })

  let sourcePath
  try {
    sourcePath = requestCodex(assetsDir, prompt)
    console.log('✓ codex image_gen 생성 완료')
  } catch (codexError) {
    console.error(`[generate-thumbnail] ${codexError.message}`)
    console.error('[generate-thumbnail] 아래 프롬프트로 수동 생성하세요.')
    console.error(prompt)
    process.exitCode = 2
    return
  }

  try {
    await sharp(sourcePath)
      .resize(1536, 864, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(outputPath)
  } finally {
    rmSync(sourcePath, { force: true })
  }

  console.log(`✓ ${outputPath.replace(`${BLOG_ROOT}/`, '')} (1536x864 JPEG)`)
}

main().catch((error) => {
  console.error(`[generate-thumbnail] ${error.message}`)
  process.exit(1)
})
