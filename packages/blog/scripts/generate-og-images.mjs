// 빌드타임 OG 이미지 생성기.
//
// 페이지 매니페스트(아래 PAGES)를 받아 satori(JSX→SVG, 한글 폰트 임베드)로
// 브랜드 카드를 그리고 sharp로 1200x630 JPEG로 변환한다.
//
// 출력:
//   - 페이지별: static/og/<name>.jpeg
//   - 사이트 기본: static/open-graph.jpeg  (JSON-LD 로고 겸용이라 경로/파일명 고정)
//
// 새 페이지가 생기면 PAGES에 한 줄 추가하고 해당 페이지 Head 의
// <Seo image='/og/<name>.jpeg' /> 만 지정하면 자동 적용된다.

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import satori from 'satori'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BLOG_ROOT = join(__dirname, '..')
const STATIC_DIR = join(BLOG_ROOT, 'static')
const OG_DIR = join(STATIC_DIR, 'og')
const ASSETS_DIR = join(__dirname, 'assets')

const WIDTH = 1200
const HEIGHT = 630

// 브랜드 팔레트 (packages/core/.../ThemeProvider/type.ts 토큰을 참고해 하드코딩)
const COLOR = {
  bg: '#0A0A0A',
  fg: '#FFFFFF',
  muted: '#999999',
  accent: '#0070F3'
}

// 페이지 매니페스트 — name 이 곧 /og/<name>.jpeg, 그리고 default 는 open-graph.jpeg 도 겸한다.
const PAGES = [
  { name: 'default', title: '테오 블로그', subtitle: '제품 엔지니어링과 조직·성장, Agentic AI를 다루는 블로그.' },
  { name: 'index', title: '테오 블로그', subtitle: '제품을 만들어온 스타트업 CTO가 보고 겪은 것을 적는 블로그.' },
  {
    name: 'coffee-chat',
    title: '커피챗',
    subtitle: '제품과 개발, AI에 대한 질문을 일대일로 함께 이야기하는 자리.'
  },
  {
    name: 'about',
    title: '소개',
    subtitle: '블로그가 무엇을 다루고 누가 쓰는지에 대한 소개.'
  },
  { name: 'resume', title: '이력서', subtitle: '제품을 만들고 팀을 꾸려온 진태양(Theo)의 이력.' },
  { name: 'books', title: '책', subtitle: "'작은 팀의 기술' — 개발자 출신 창업자의 조직 운영기." },
  { name: 'posts', title: '글 목록', subtitle: '지금까지 쓴 글을 연도별로 모아둔 곳.' },
  {
    name: 'tags',
    title: '태그 목록',
    subtitle: '주제별로 글을 모아 보는 곳.'
  },
  {
    name: '404',
    title: '페이지를 찾을 수 없습니다',
    subtitle: '찾는 페이지가 없어요. 주소가 바뀌었거나 글이 사라졌을 수 있어요.'
  }
]

const fonts = [
  { name: 'Pretendard', data: readFileSync(join(ASSETS_DIR, 'Pretendard-Regular.ttf')), weight: 400, style: 'normal' },
  { name: 'Pretendard', data: readFileSync(join(ASSETS_DIR, 'Pretendard-Bold.ttf')), weight: 700, style: 'normal' }
]

// satori 는 React 없이 VDOM 형태의 plain object 를 받는다.
const el = (type, style, children) => ({ type, props: { style, ...(children !== undefined ? { children } : {}) } })

const titleFontSize = (title) => {
  const len = [...title].length
  if (len <= 8) return 92
  if (len <= 16) return 76
  if (len <= 28) return 60
  return 48
}

const truncate = (text, max) => ([...text].length <= max ? text : `${[...text].slice(0, max - 1).join('')}…`)

const card = ({ title, subtitle }) =>
  el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: WIDTH,
      height: HEIGHT,
      padding: '80px',
      backgroundColor: COLOR.bg,
      color: COLOR.fg,
      fontFamily: 'Pretendard'
    },
    [
      el('div', { display: 'flex', width: '72px', height: '10px', borderRadius: '5px', backgroundColor: COLOR.accent }),
      el('div', { display: 'flex', flexDirection: 'column' }, [
        el(
          'div',
          { display: 'flex', fontSize: titleFontSize(title), fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
          title
        ),
        el(
          'div',
          { display: 'flex', marginTop: '28px', fontSize: '30px', fontWeight: 400, lineHeight: 1.45, color: COLOR.muted },
          truncate(subtitle, 88)
        )
      ]),
      el('div', { display: 'flex', fontSize: '26px', fontWeight: 700 }, [
        el('div', { display: 'flex' }, '테오 블로그'),
        el('div', { display: 'flex', color: COLOR.muted, fontWeight: 400, marginLeft: '14px' }, '· dataportal.kr')
      ])
    ]
  )

const toJpeg = async (svg, outPath) => {
  await sharp(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outPath)
}

const main = async () => {
  mkdirSync(OG_DIR, { recursive: true })

  for (const page of PAGES) {
    const svg = await satori(card(page), { width: WIDTH, height: HEIGHT, fonts })
    const out = join(OG_DIR, `${page.name}.jpeg`)
    await toJpeg(svg, out)
    console.log(`✓ static/og/${page.name}.jpeg`)

    // 사이트 기본 이미지(JSON-LD 로고 겸용)도 default 카드로 재생성
    if (page.name === 'default') {
      const defaultOut = join(STATIC_DIR, 'open-graph.jpeg')
      await toJpeg(svg, defaultOut)
      console.log('✓ static/open-graph.jpeg')
    }
  }
}

main().catch((err) => {
  console.error('[generate-og-images] 실패:', err)
  process.exit(1)
})
