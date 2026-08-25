import assert from 'node:assert/strict'
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { after, test } from 'node:test'

import { defaultTargets } from './check-forbidden-dashes.mjs'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const checkerPath = resolve(scriptDir, 'check-forbidden-dashes.mjs')
const blogRoot = resolve(scriptDir, '..')
const repoRoot = resolve(blogRoot, '../..')
const fixtureRoot = mkdtempSync(resolve(tmpdir(), 'forbidden-dashes-'))

after(() => {
  rmSync(fixtureRoot, { recursive: true, force: true })
})

const writeFixture = (relativePath, content) => {
  const filePath = resolve(fixtureRoot, relativePath)
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
  return filePath
}

const runChecker = (...targets) =>
  spawnSync(process.execPath, [checkerPath, ...targets], {
    encoding: 'utf8'
  })

test('기본 검사 대상에 블로그, 통합 원고, 챕터를 포함한다', () => {
  assert.deepEqual(defaultTargets, [
    blogRoot,
    resolve(repoRoot, '_workspace/book/manuscript.md'),
    resolve(repoRoot, '_workspace/book/chapters')
  ])
})

test('U+2014의 위치와 코드 포인트를 출력하고 실패한다', () => {
  const target = writeFixture('em-dash.md', `첫 줄\n문장\u2014대시`)
  const result = runChecker(target)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /em-dash\.md:2:3 U\+2014/u)
})

test('U+2013의 위치와 코드 포인트를 출력하고 실패한다', () => {
  const target = writeFixture('en-dash.md', `첫 줄\n범위\u2013표기`)
  const result = runChecker(target)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /en-dash\.md:2:3 U\+2013/u)
})

test('ASCII 하이픈, 물결표, 콜론은 허용한다', () => {
  const target = writeFixture('allowed.md', 'ASCII - --, 범위 1~3, 설명: 본문')
  const result = runChecker(target)

  assert.equal(result.status, 0)
  assert.match(result.stdout, /문장 대시 검사 통과/u)
})

test('하위 디렉터리를 검사하고 제외 디렉터리와 비텍스트 파일은 건너뛴다', () => {
  writeFixture('recursive/nested/found.md', `문장\u2014대시`)
  writeFixture('recursive/.cache/ignored.md', `문장\u2014대시`)
  writeFixture('recursive/node_modules/ignored.md', `문장\u2014대시`)
  writeFixture('recursive/public/ignored.md', `문장\u2014대시`)
  writeFixture('recursive/image.jpeg', `문장\u2014대시`)

  const result = runChecker(resolve(fixtureRoot, 'recursive'))

  assert.equal(result.status, 1)
  assert.match(result.stderr, /nested\/found\.md:1:3 U\+2014/u)
  assert.doesNotMatch(result.stderr, /ignored|image\.jpeg/u)
})
