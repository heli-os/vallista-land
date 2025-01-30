const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { default: readingTime } = require('reading-time')

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
  const postPage = path.resolve(`./src/template/post.tsx`)
  const errorPage = path.resolve(`./src/pages/404.tsx`)

  const result = await graphql(`
    {
      allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `)

  const mdxPosts = result.data.allMdx.nodes

  if (mdxPosts.length > 0) {
    mdxPosts.forEach((post) => {
      actions.createPage({
        path: post.fields.slug,
        component: postPage,
        context: {
          id: post.id
        }
      })
    })
  }
}

// 노드 환경 생성될 때
exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark' || node.internal.type === 'Mdx') {
    const value = createFilePath({
      node,
      getNode
    })

    createNodeField({
      node,
      name: 'timeToRead',
      value: readingTime(node.body)
    })

    createNodeField({
      node,
      name: 'slug',
      value: `${value}`
    })
  }
}
