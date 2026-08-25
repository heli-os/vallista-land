import { graphql, HeadProps } from 'gatsby'
import { FC } from 'react'

import { Seo } from '../../components/Seo'
import { TopicHub } from '../../components/TopicHub'
import { getTopicById } from '../../config/topics'

interface TopicQuery {
  allMarkdownRemark: {
    nodes: Array<{
      fields: { slug: string }
      frontmatter: { title: string }
    }>
  }
}

const topic = getTopicById('organization-startup')!

const OrganizationStartupTopicPage: FC<{ data: TopicQuery }> = ({ data }) => (
  <TopicHub topic={topic} posts={data.allMarkdownRemark.nodes} />
)

export default OrganizationStartupTopicPage

export const Head = ({ data, location }: HeadProps<TopicQuery>) => {
  const postMap = new Map(
    data.allMarkdownRemark.nodes.map((post) => [decodeURIComponent(post.fields.slug).replace(/^\/+|\/+$/g, ''), post])
  )
  const items = topic.sections
    .flatMap((section) => section.slugs)
    .map((slug) => postMap.get(slug))
    .filter((post): post is TopicQuery['allMarkdownRemark']['nodes'][number] => Boolean(post))
    .map((post) => ({ name: post.frontmatter.title, url: post.fields.slug }))

  return (
    <Seo
      name={topic.title}
      seoTitle={topic.seoTitle}
      description={topic.description}
      image='/og/topic-organization-startup.jpeg'
      pageType='collection'
      collectionItems={items}
      breadcrumbs={[
        { name: '홈', url: '/' },
        { name: topic.title, url: topic.path }
      ]}
      pathname={location.pathname}
    />
  )
}

export const pageQuery = graphql`
  query OrganizationStartupTopicQuery {
    allMarkdownRemark(filter: { fields: { contentType: { eq: "posts" } }, frontmatter: { draft: { ne: true } } }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }
`
