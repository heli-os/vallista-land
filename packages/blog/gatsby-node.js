const path = require('path')
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
  const errorPage = path.resolve(`./src/pages/404.tsx`)

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        filter: { frontmatter: { draft: { ne: true } } }
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
      allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
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
}

// 노드 환경 생성될 때
exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({
      node,
      getNode
    })

    createNodeField({
      node,
      name: 'slug',
      value: `${value}`
    })

    // Git에서 파일의 마지막 수정일 추출
    try {
      const filePath = node.internal.contentFilePath
      const lastModified = execSync(
        `git log -1 --format=%aI -- "${filePath}"`
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
