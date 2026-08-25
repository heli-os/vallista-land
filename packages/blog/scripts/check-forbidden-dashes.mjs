#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const blogRoot = resolve(scriptDir, '..')
const repoRoot = resolve(blogRoot, '../..')

const textExtensions = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mdx',
  '.mjs',
  '.scss',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yaml',
  '.yml'
])
const ignoredDirectories = new Set(['.cache', 'node_modules', 'public'])
const forbiddenDashPattern = /[\u2013\u2014]/gu

export const defaultTargets = [
  blogRoot,
  resolve(repoRoot, '_workspace/book/manuscript.md'),
  resolve(repoRoot, '_workspace/book/chapters')
]

export const collectTextFiles = (target) => {
  const targetStat = statSync(target)

  if (targetStat.isFile()) {
    return textExtensions.has(extname(target)) ? [target] : []
  }

  return readdirSync(target, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return []

      const entryPath = resolve(target, entry.name)
      if (entry.isDirectory()) return collectTextFiles(entryPath)
      return entry.isFile() && textExtensions.has(extname(entry.name)) ? [entryPath] : []
    })
}

export const findForbiddenDashes = (targets) => {
  const findings = []

  for (const filePath of targets.flatMap(collectTextFiles)) {
    const lines = readFileSync(filePath, 'utf8').split(/\r?\n/u)

    lines.forEach((line, lineIndex) => {
      for (const match of line.matchAll(forbiddenDashPattern)) {
        const column = [...line.slice(0, match.index)].length + 1
        findings.push({
          file: relative(repoRoot, filePath),
          line: lineIndex + 1,
          column,
          codePoint: `U+${match[0].codePointAt(0).toString(16).toUpperCase()}`
        })
      }
    })
  }

  return findings
}

export const run = (requestedTargets = process.argv.slice(2)) => {
  const targets =
    requestedTargets.length > 0
      ? requestedTargets.map((target) => resolve(process.cwd(), target))
      : defaultTargets
  const findings = findForbiddenDashes(targets)

  if (findings.length > 0) {
    console.error('금지된 문장 대시를 발견했습니다.')
    findings.forEach(({ file, line, column, codePoint }) => {
      console.error(`${file}:${line}:${column} ${codePoint}`)
    })
    process.exitCode = 1
  } else {
    console.log('문장 대시 검사 통과: U+2014/U+2013 0건')
  }
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isDirectExecution) {
  run()
}
