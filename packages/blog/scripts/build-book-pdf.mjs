#!/usr/bin/env node
import { execSync } from 'child_process'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..')
const MANUSCRIPT = resolve(PROJECT_ROOT, '../../_workspace/book/manuscript.md')
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'static/book')
const OUTPUT_FILE = resolve(OUTPUT_DIR, '작은-팀의-기술.pdf')

// 출력 디렉토리 생성
mkdirSync(OUTPUT_DIR, { recursive: true })

// manuscript.md 존재 확인
if (!existsSync(MANUSCRIPT)) {
  console.error(`Error: manuscript.md not found at ${MANUSCRIPT}`)
  process.exit(1)
}

console.log('Building PDF from manuscript.md...')

// md-to-pdf로 변환 (npx로 실행)
const mdContent = readFileSync(MANUSCRIPT, 'utf-8')

// HTML 주석 제거
const cleanContent = mdContent.replace(/<!--[\s\S]*?-->/g, '')

// 임시 설정을 포함한 마크다운 작성
const styledContent = `---
pdf_options:
  format: A4
  margin: 25mm
  printBackground: true
  displayHeaderFooter: true
  headerTemplate: '<span></span>'
  footerTemplate: '<div style="width:100%;text-align:center;font-size:9px;color:#999;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
stylesheet: https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.min.css
body_class: markdown-body
css: |-
  body { font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif; }
  .markdown-body { max-width: 720px; margin: 0 auto; }
  h1 { page-break-before: always; margin-top: 2em; }
  h1:first-of-type { page-break-before: avoid; }
  h2 { margin-top: 1.5em; }
  blockquote { border-left: 4px solid #e67e22; padding-left: 1em; color: #555; }
  hr { page-break-after: always; border: none; }
---

${cleanContent}`

// 임시 파일에 작성
import { writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const tempFile = join(tmpdir(), `book-${Date.now()}.md`)
writeFileSync(tempFile, styledContent, 'utf-8')

try {
  execSync(`npx --yes md-to-pdf "${tempFile}"`, {
    stdio: 'inherit',
    timeout: 120000
  })

  // md-to-pdf는 같은 디렉토리에 .pdf를 생성함
  const generatedPdf = tempFile.replace('.md', '.pdf')
  if (existsSync(generatedPdf)) {
    execSync(`mv "${generatedPdf}" "${OUTPUT_FILE}"`)
    const size = (readFileSync(OUTPUT_FILE).length / 1024).toFixed(0)
    console.log(`PDF generated: ${OUTPUT_FILE}`)
    console.log(`Size: ${size}KB`)
  } else {
    console.error('Error: PDF was not generated')
    process.exit(1)
  }
} finally {
  if (existsSync(tempFile)) unlinkSync(tempFile)
}
