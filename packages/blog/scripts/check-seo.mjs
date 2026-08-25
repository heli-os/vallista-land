import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SITE_URL, toAbsoluteUrl } from '../src/utils/seo-url.js'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const BLOG_ROOT = resolve(SCRIPT_DIR, '..')
const PUBLIC_DIR = resolve(BLOG_ROOT, 'public')
const POSTS_DIR = resolve(BLOG_ROOT, 'content/posts')
const failures = []

const walk = (directory, predicate) =>
  readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    return statSync(path).isDirectory() ? walk(path, predicate) : predicate(path) ? [path] : []
  })

const count = (html, pattern) => (html.match(pattern) || []).length
const metaContent = (html, name) => {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["'][^>]*>`, 'i')
  ]
  return patterns.map((pattern) => html.match(pattern)?.[1]).find(Boolean)
}

const canonicalHref = (html) => {
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
  return tag?.match(/href=["']([^"']+)["']/i)?.[1]
}

const outputPathname = (file) => {
  const local = relative(PUBLIC_DIR, file).split(sep).join('/')
  if (local === 'index.html') return '/'
  return `/${local.replace(/index\.html$/, '')}`
}

const expectedCanonical = (pathname) => toAbsoluteUrl(pathname)

const findTypes = (value, types = []) => {
  if (!value || typeof value !== 'object') return types
  if (typeof value['@type'] === 'string') types.push({ type: value['@type'], value })
  Object.values(value).forEach((child) => findTypes(child, types))
  return types
}

const postDirectories = readdirSync(POSTS_DIR).filter((name) => existsSync(join(POSTS_DIR, name, 'index.md')))
const postSlugs = new Set(postDirectories)

if (!existsSync(PUBLIC_DIR)) {
  console.error('[check-seo] public 디렉터리가 없습니다. 먼저 프로덕션 빌드를 실행하세요.')
  process.exit(1)
}

const htmlFiles = walk(PUBLIC_DIR, (path) => path.endsWith('index.html'))
htmlFiles.forEach((file) => {
  const html = readFileSync(file, 'utf8')
  const pathname = outputPathname(file)
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
  if (noindex) return

  const rules = [
    ['title', count(html, /<title(?:\s|>)/gi)],
    ['description', metaContent(html, 'description') ? 1 : 0],
    ['canonical', canonicalHref(html) ? 1 : 0],
    ['H1', count(html, /<h1(?:\s|>)/gi)]
  ]
  rules.forEach(([label, actual]) => {
    if (actual !== 1) failures.push(`${pathname}: ${label} ${actual}개`)
  })

  const canonical = canonicalHref(html)
  if (canonical && canonical !== expectedCanonical(pathname)) {
    failures.push(`${pathname}: canonical 불일치 (${canonical})`)
  }

  const hrefCount = count(html, /<a(?:\s|>)/gi)
  const isCollectionIndex = pathname === '/posts/' || pathname.startsWith('/tags/')
  if (!isCollectionIndex && hrefCount > 100) failures.push(`${pathname}: 링크 ${hrefCount}개`)

  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  const schemas = []
  scripts.forEach((match) => {
    try {
      schemas.push(JSON.parse(match[1]))
    } catch (error) {
      failures.push(`${pathname}: JSON-LD 파싱 실패 (${error.message})`)
    }
  })

  if (schemas.length === 0) failures.push(`${pathname}: JSON-LD 없음`)

  const blogPosting = schemas
    .flatMap((schema) => findTypes(schema))
    .find((schema) => schema.type === 'BlogPosting')?.value
  if (postSlugs.has(pathname.replace(/^\/|\/$/g, '')) && !blogPosting) {
    failures.push(`${pathname}: BlogPosting 없음`)
  }
  if (blogPosting) {
    for (const field of ['headline', 'author', 'datePublished', 'dateModified', 'image', 'mainEntityOfPage']) {
      if (!blogPosting[field]) failures.push(`${pathname}: BlogPosting.${field} 누락`)
    }
  }
})

const draftSlugs = postDirectories.filter((name) =>
  /^draft:\s*true\s*$/m.test(readFileSync(join(POSTS_DIR, name, 'index.md'), 'utf8'))
)

const sitemapFiles = walk(PUBLIC_DIR, (path) => /sitemap.*\.xml$/.test(path))
const sitemap = sitemapFiles.map((file) => readFileSync(file, 'utf8')).join('\n')
draftSlugs.forEach((slug) => {
  const encodedPath = new URL(`/${slug}/`, SITE_URL).pathname
  const outputDirectory = join(PUBLIC_DIR, slug)
  if (existsSync(outputDirectory)) failures.push(`draft 페이지 노출: /${slug}/`)
  if (sitemap.includes(encodedPath)) failures.push(`sitemap에 draft 포함: /${slug}/`)
})

const rssPath = join(PUBLIC_DIR, 'rss.xml')
if (existsSync(rssPath) && /<item>[\s\S]*?<link>[^<]*\/books\//i.test(readFileSync(rssPath, 'utf8'))) {
  failures.push('기본 RSS에 책 챕터가 포함됐습니다.')
}

if (failures.length > 0) {
  failures.forEach((failure) => console.error(`실패: ${failure}`))
  console.error(`[check-seo] ${failures.length}건 실패`)
  process.exit(1)
}

console.log(`[check-seo] ${htmlFiles.length}개 index 페이지 통과`)
