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
