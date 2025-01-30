const profile = require('./config/profile.json')
const defaultOpenGraphImage = '/open-graph.jpeg'

module.exports = {
  flags: {
    FAST_DEV: true
  },
  siteMetadata: {
    title: profile.title,
    titleTemplate: profile.titleTemplate,
    siteUrl: profile.siteUrl,
    description: profile.description,
    author: profile.author,
    url: profile.siteUrl,
    image: defaultOpenGraphImage,
    twitterUsername: ''
  },
  plugins: [
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title,
                description,
                siteUrl,
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map((node) => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: encodeURI(site.siteMetadata.siteUrl + node.fields.slug),
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ 'content:encoded': node.html }]
                })
              })
            },
            query: `
              {
                allMdx(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            // 최종 rss feed파일 입니다. 디렉토리가 다르거나, 이름이 다른경우 설정 가능합니다.
            output: '/rss.xml',
            // 본인의 blog rss feed용 타이틀을 명시합니다.
            title: "Theo's Blog RSS Feed"
          }
        ]
      }
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-typescript',
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/'
      },
      __key: 'pages'
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
        extensions: ['md', 'mdx']
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1024,
              linkImagesToOriginal: false
            }
          },
          `gatsby-remark-gifs`,
          {
            resolve: 'gatsby-remark-vscode',
            options: {
              theme: 'Dark+ (default dark)'
            }
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow'
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`]
      }
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `#FF6600`,
        // Disable the loading spinner.
        showSpinner: false
      }
    },
    {
      resolve: `gatsby-plugin-google-adsense`,
      options: {
        publisherId: `ca-pub-1462947422010620`
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: profile.description,
        short_name: profile.author,
        start_url: `/`,
        icon: `static/favicons/favicon-96x96.png`,
        icons: [
          {
            src: '/favicons/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    }
  ]
}
