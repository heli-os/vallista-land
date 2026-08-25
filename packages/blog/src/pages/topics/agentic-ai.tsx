import { graphql, HeadProps } from 'gatsby'
import { FC } from 'react'

import { TopicHub } from '../../components/TopicHub'
import { Seo } from '../../components/Seo'
import { getTopicById } from '../../config/topics'

interface TopicQuery {
  allMarkdownRemark: {
    nodes: Array<{
      fields: { slug: string }
      frontmatter: { title: string }
    }>
  }
}

const topic = getTopicById('agentic-ai')!

const AgenticAiTopicPage: FC<{ data: TopicQuery }> = ({ data }) => (
  <TopicHub topic={topic} posts={data.allMarkdownRemark.nodes} />
)

export default AgenticAiTopicPage

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
      image='/og/topic-agentic-ai.jpeg'
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
  query AgenticAiTopicQuery {
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
