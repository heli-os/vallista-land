const profile = require('../../config/profile.json')

const SITE_URL = profile.siteUrl.replace(/\/$/, '')
const FILE_PATH_PATTERN = /\/[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/

const normalizeInternalUrl = (input = '/') => {
  const parsed = new URL(input, SITE_URL)
  const isInternal = parsed.origin === SITE_URL

  if (isInternal && !FILE_PATH_PATTERN.test(parsed.pathname) && !parsed.pathname.endsWith('/')) {
    parsed.pathname = `${parsed.pathname}/`
  }

  return parsed
}

const toAbsoluteUrl = (input = '/') => normalizeInternalUrl(input).href

const toCanonicalPath = (input = '/') => {
  const parsed = normalizeInternalUrl(input)
  return `${parsed.pathname}${parsed.search}${parsed.hash}`
}

module.exports = {
  SITE_URL,
  toAbsoluteUrl,
  toCanonicalPath
}
