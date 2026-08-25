import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { SITE_URL } from '../src/utils/seo-url.js'

const aliases = {
  page: ['page', '페이지', 'url'],
  query: ['query', '검색어', 'queries'],
  clicks: ['clicks', '클릭수', '클릭'],
  impressions: ['impressions', '노출수', '노출'],
  ctr: ['ctr'],
  position: ['position', '평균 게재순위', '게재순위', '평균 순위']
}

const getArgument = (name, fallback) => {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : fallback
}

const parseCsv = (input) => {
  const rows = []
  let row = []
  let value = ''
  let quoted = false

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    const next = input[index + 1]
    if (char === '"' && quoted && next === '"') {
      value += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      row.push(value)
      value = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1
      row.push(value)
      if (row.some((cell) => cell.length > 0)) rows.push(row)
      row = []
      value = ''
    } else {
      value += char
    }
  }

  row.push(value)
  if (row.some((cell) => cell.length > 0)) rows.push(row)
  return rows
}

const findColumn = (headers, key) => {
  const normalized = headers.map((header) => header.trim().toLocaleLowerCase())
  return normalized.findIndex((header) => aliases[key].includes(header))
}

const numberValue = (value) => {
  const normalized = String(value || '').replace(/[,%\s]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const loadRows = (path) => {
  if (!existsSync(path)) throw new Error(`파일을 찾지 못했습니다: ${path}`)
  const [headers, ...records] = parseCsv(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''))
  const indexes = Object.fromEntries(Object.keys(aliases).map((key) => [key, findColumn(headers, key)]))

  for (const required of ['page', 'clicks', 'impressions', 'ctr', 'position']) {
    if (indexes[required] < 0) throw new Error(`${path}에 ${required} 열이 없습니다.`)
  }

  return records
    .map((record) => ({
      page: record[indexes.page]?.trim() || '',
      query: indexes.query >= 0 ? record[indexes.query]?.trim() || '' : '',
      clicks: numberValue(record[indexes.clicks]),
      impressions: numberValue(record[indexes.impressions]),
      ctr: numberValue(record[indexes.ctr]) / (String(record[indexes.ctr]).includes('%') ? 100 : 1),
      position: numberValue(record[indexes.position])
    }))
    .filter((row) => row.page)
}

const topics = [
  {
    name: 'Agentic AI',
    matches: (page) => decodeURIComponent(page).includes('Agentic-AI-논문-읽기')
  },
  {
    name: '조직·스타트업',
    matches: (page) =>
      [
        '같이-일한다는',
        '리더십팀',
        '여섯-가지-질문',
        '우리다움',
        '조직이라는',
        '회사의-모든-정보',
        '빨라진-실행',
        '스타트업-채용',
        '채용되는-것은',
        '행동을-지적',
        '공정하다는',
        '불편한-지적',
        '버튼-다음의-제품',
        '프로토타입이라는',
        '지루함을-설계',
        '명령이-아니라',
        '금융-데이터',
        '프로덕트에서-플레이어',
        '떠날-수-있어서',
        '책상-바깥',
        '미션-선언문'
      ].some((fragment) => decodeURIComponent(page).includes(fragment))
  }
]

const aggregatePages = (rows) => {
  const pages = new Map()
  rows.forEach((row) => {
    const current = pages.get(row.page) || { ...row, query: '', weightedPosition: 0 }
    if (pages.has(row.page)) {
      current.clicks += row.clicks
      current.impressions += row.impressions
    }
    current.weightedPosition += row.position * row.impressions
    pages.set(row.page, current)
  })

  return [...pages.values()].map((page) => ({
    ...page,
    ctr: page.impressions ? page.clicks / page.impressions : 0,
    position: page.impressions ? page.weightedPosition / page.impressions : 0
  }))
}

const selectTargets = (rows, maximum) => {
  const pageRows = aggregatePages(rows)
  const rankBuckets = new Map()
  pageRows.forEach((row) => {
    const bucket = Math.floor(row.position / 5) * 5
    const values = rankBuckets.get(bucket) || []
    values.push(row.ctr)
    rankBuckets.set(bucket, values)
  })
  const bucketAverages = new Map(
    [...rankBuckets].map(([bucket, values]) => [bucket, values.reduce((sum, value) => sum + value, 0) / values.length])
  )
  const scored = pageRows.map((row) => {
    const bucket = Math.floor(row.position / 5) * 5
    return { ...row, ctrGap: (bucketAverages.get(bucket) || 0) - row.ctr }
  })
  const qualified = scored
    .filter((row) => row.position >= 4 && row.position <= 20)
    .sort((a, b) => b.impressions - a.impressions || b.ctrGap - a.ctrGap)
  const fallback = scored
    .filter((row) => !qualified.some((candidate) => candidate.page === row.page))
    .sort((a, b) => b.impressions - a.impressions)
  return [...qualified, ...fallback].slice(0, maximum)
}

const toPathname = (page) => decodeURIComponent(new URL(page, SITE_URL).pathname)

const formatDelta = (current, previous) => {
  if (previous === undefined) return '—'
  const value = current - previous
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}`
}

const currentPath = resolve(process.cwd(), getArgument('--current', '../../.context/seo/current.csv'))
const previousPath = resolve(process.cwd(), getArgument('--previous', '../../.context/seo/previous.csv'))
const outputPath = resolve(process.cwd(), getArgument('--out', '../../.context/seo/targets.md'))
const maximum = Number(getArgument('--max', '10'))

try {
  const current = loadRows(currentPath)
  const previous = existsSync(previousPath) ? loadRows(previousPath) : []
  const previousPages = new Map(aggregatePages(previous).map((row) => [row.page, row]))
  const lines = ['# GSC 본문 개선 대상', '', `생성일: ${new Date().toISOString()}`, '']

  topics.forEach((topic) => {
    const topicRows = current.filter((row) => topic.matches(row.page))
    const targets = selectTargets(topicRows, maximum)
    lines.push(`## ${topic.name}`, '')
    lines.push('| 우선순위 | 페이지 | 클릭 | 노출 | CTR | 평균 순위 | 직전 순위 대비 |')
    lines.push('| ---: | --- | ---: | ---: | ---: | ---: | ---: |')
    targets.forEach((row, index) => {
      const previousRow = previousPages.get(row.page)
      lines.push(
        `| ${index + 1} | ${toPathname(row.page)} | ${row.clicks} | ${row.impressions} | ${(row.ctr * 100).toFixed(2)}% | ${row.position.toFixed(1)} | ${formatDelta(row.position, previousRow?.position)} |`
      )
    })
    if (targets.length === 0) lines.push('| - | 대상 없음 | - | - | - | - | - |')
    lines.push('')

    const competingQueries = new Map()
    topicRows
      .filter((row) => row.query)
      .forEach((row) => {
        const pages = competingQueries.get(row.query) || []
        pages.push(row)
        competingQueries.set(row.query, pages)
      })
    const collisions = [...competingQueries]
      .filter(([, rows]) => new Set(rows.map((row) => row.page)).size > 1)
      .sort(
        (a, b) =>
          b[1].reduce((sum, row) => sum + row.impressions, 0) - a[1].reduce((sum, row) => sum + row.impressions, 0)
      )
      .slice(0, 10)
    lines.push('### 검색어 경쟁', '')
    if (collisions.length === 0) {
      lines.push('- 확인된 경쟁 검색어가 없습니다.', '')
    } else {
      collisions.forEach(([query, rows]) => {
        const representative = [...rows].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)[0]
        lines.push(`- ${query}: 대표 글 ${toPathname(representative.page)}`)
      })
      lines.push('')
    }
  })

  writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8')
  console.log(`✓ ${outputPath}`)
} catch (error) {
  console.error(`[analyze-gsc] ${error.message}`)
  process.exit(1)
}
