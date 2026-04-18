const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const { createFilePath } = require('gatsby-source-filesystem')

// Babel 설정 시
// @babel/plugin-transform-react-jsx를 추가해야 emotion.jsx등 런타임을 확인해서 변경함
exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-transform-react-jsx',
    options: {
      runtime: 'automatic'
    }
  })
}

// You can delete this file if you're not using it
exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions

  const postPage = path.resolve(`./src/template/post.tsx`)

  // === 블로그 포스트 페이지 생성 ===
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        filter: { frontmatter: { draft: { ne: true } }, fields: { contentType: { eq: "posts" } } }
      ) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `)

  const posts = result.data.allMarkdownRemark.nodes

  if (posts.length > 0) {
    posts.forEach((post) => {
      actions.createPage({
        path: post.fields.slug,
        component: postPage,
        context: {
          id: post.id
        }
      })
    })
  }

  // 태그별 정적 페이지 생성
  const tagResult = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { draft: { ne: true } }, fields: { contentType: { eq: "posts" } } }
      ) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  const tagPage = path.resolve(`./src/template/tag.tsx`)
  const tags = tagResult.data.allMarkdownRemark.group

  tags.forEach((tag) => {
    actions.createPage({
      path: `/tags/${tag.fieldValue}/`,
      component: tagPage,
      context: {
        tag: tag.fieldValue
      }
    })
  })

  // === 책 페이지 생성 ===
  const bookChapterTemplate = path.resolve('./src/template/book-chapter.tsx')
  const bookLandingTemplate = path.resolve('./src/template/book-landing.tsx')

  const bookResult = await graphql(`
    {
      allMarkdownRemark(
        filter: { fields: { contentType: { eq: "books" } }, frontmatter: { draft: { ne: true } } }
        sort: { frontmatter: { chapter: ASC } }
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            chapter
          }
        }
      }
    }
  `)

  const chapters = bookResult.data?.allMarkdownRemark?.nodes || []
  if (chapters.length > 0) {
    // 책 slug별 그룹핑
    const bookGroups = {}
    chapters.forEach((ch) => {
      const bookSlug = ch.fields.slug.split('/')[2]
      if (!bookGroups[bookSlug]) bookGroups[bookSlug] = []
      bookGroups[bookSlug].push(ch)
    })

    Object.entries(bookGroups).forEach(([bookSlug, bookChapters]) => {
      // book.json에서 책 제목 읽기
      let bookTitle = bookSlug
      try {
        const bookJson = JSON.parse(
          fs.readFileSync(path.resolve(`./content/books/${bookSlug}/book.json`), 'utf8')
        )
        bookTitle = bookJson.title || bookSlug
      } catch (_) {}

      // 챕터 페이지 생성
      bookChapters.forEach((ch, index) => {
        actions.createPage({
          path: ch.fields.slug,
          component: bookChapterTemplate,
          context: {
            id: ch.id,
            bookSlug,
            bookTitle
          }
        })
      })

      // 책 랜딩 페이지 생성
      actions.createPage({
        path: `/books/${bookSlug}/`,
        component: bookLandingTemplate,
        context: {
          bookSlug: `/${bookSlug}/`,
          bookTitle
        }
      })
    })
  }
}

// 빌드 완료 시 AI 크롤러용 llms.txt 생성
exports.onPostBuild = async ({ graphql, reporter }) => {
  const result = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
          title
          description
        }
      }
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        filter: {
          fields: { contentType: { eq: "posts" } }
          frontmatter: { draft: { ne: true } }
        }
      ) {
        nodes {
          excerpt(pruneLength: 180)
          fields {
            slug
          }
          frontmatter {
            title
            date
            tags
            description
          }
        }
      }
      bookChapters: allMarkdownRemark(
        sort: { frontmatter: { chapter: ASC } }
        filter: {
          fields: { contentType: { eq: "books" } }
          frontmatter: { draft: { ne: true } }
        }
      ) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            chapter
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('llms.txt 생성 실패', result.errors)
    return
  }

  const { siteUrl, title, description } = result.data.site.siteMetadata
  const posts = result.data.allMarkdownRemark.nodes
  const bookChapters = result.data.bookChapters.nodes

  const encodeUrl = (slug) => `${siteUrl}${encodeURI(slug)}`

  const lines = []
  lines.push(`# ${title}`)
  lines.push('')
  lines.push(`> ${description}`)
  lines.push('')
  lines.push('이 파일은 LLM·AI 검색 엔진(ChatGPT, Perplexity, Claude, Gemini 등)이 사이트를 효율적으로 이해하도록 돕는 가이드입니다.')
  lines.push('')
  lines.push('## 주요 리소스')
  lines.push(`- 전체 글 목록: ${siteUrl}/posts/`)
  lines.push(`- 태그 목록: ${siteUrl}/tags/`)
  lines.push(`- 책 목록: ${siteUrl}/books/`)
  lines.push(`- 저자 소개: ${siteUrl}/about/`)
  lines.push(`- 저자 이력서: ${siteUrl}/resume/`)
  lines.push(`- 사이트맵: ${siteUrl}/sitemap-index.xml`)
  lines.push(`- RSS: ${siteUrl}/rss.xml`)
  lines.push(`- 책 RSS: ${siteUrl}/books/rss.xml`)
  lines.push('')

  // 태그별 그룹
  const byTag = {}
  posts.forEach((p) => {
    (p.frontmatter.tags || []).forEach((t) => {
      if (!byTag[t]) byTag[t] = []
      byTag[t].push(p)
    })
  })
  const tagOrder = Object.keys(byTag).sort((a, b) => byTag[b].length - byTag[a].length)

  lines.push('## 글 (최신순)')
  lines.push('')
  posts.forEach((p) => {
    const summary = p.frontmatter.description || p.excerpt || ''
    lines.push(`- [${p.frontmatter.title}](${encodeUrl(p.fields.slug)}) — ${summary}`)
  })
  lines.push('')

  lines.push('## 태그별')
  lines.push('')
  tagOrder.forEach((tag) => {
    lines.push(`### ${tag} (${byTag[tag].length}개)`)
    byTag[tag].slice(0, 20).forEach((p) => {
      lines.push(`- [${p.frontmatter.title}](${encodeUrl(p.fields.slug)})`)
    })
    if (byTag[tag].length > 20) {
      lines.push(`- … 외 ${byTag[tag].length - 20}개`)
    }
    lines.push('')
  })

  if (bookChapters.length > 0) {
    lines.push('## 책 챕터')
    lines.push('')
    bookChapters.forEach((c) => {
      lines.push(`- [${c.frontmatter.title}](${encodeUrl(c.fields.slug)})`)
    })
    lines.push('')
  }

  const outputPath = path.resolve(__dirname, 'public', 'llms.txt')
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8')
  reporter.info(`[llms.txt] 생성 완료: ${outputPath} (${posts.length}개 글)`)
}

// 노드 환경 생성될 때
exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent)
    const sourceInstanceName = fileNode?.sourceInstanceName || 'posts'

    // contentType 필드 추가 (posts / books 구분)
    createNodeField({
      node,
      name: 'contentType',
      value: sourceInstanceName
    })

    // slug 생성 (books는 /books/ 접두사)
    const filePath = createFilePath({ node, getNode })
    if (sourceInstanceName === 'books') {
      createNodeField({
        node,
        name: 'slug',
        value: `/books${filePath}`
      })
    } else {
      createNodeField({
        node,
        name: 'slug',
        value: `${filePath}`
      })
    }

    // Git에서 파일의 마지막 수정일 추출
    try {
      const fp = node.internal.contentFilePath
      const lastModified = execSync(
        `git log -1 --format=%aI -- "${fp}"`
      ).toString().trim()
      createNodeField({
        node,
        name: 'lastModified',
        value: lastModified || node.frontmatter.date
      })
    } catch {
      createNodeField({
        node,
        name: 'lastModified',
        value: node.frontmatter.date
      })
    }
  }
}
