import { FC } from 'react'

import { getTopicForSlug } from '../../config/topics'
import * as Styled from './RelatedPosts.style'

interface RelatedPost {
  fields: { slug: string }
  frontmatter: { title: string }
}

interface RelatedPostsProps {
  currentSlug: string
  posts: RelatedPost[]
}

export const RelatedPosts: FC<RelatedPostsProps> = ({ currentSlug, posts }) => {
  const match = getTopicForSlug(currentSlug)
  if (!match) return null

  const current = decodeURIComponent(currentSlug).replace(/^\/+|\/+$/g, '')
  const postMap = new Map(posts.map((post) => [decodeURIComponent(post.fields.slug).replace(/^\/+|\/+$/g, ''), post]))
  const fallbackSlugs = match.topic.sections.flatMap((section) => section.slugs)
  const relatedSlugs = [...match.section.slugs, ...fallbackSlugs]
    .filter((slug, index, all) => slug !== current && all.indexOf(slug) === index)
    .filter((slug) => postMap.has(slug))
    .slice(0, 4)

  return (
    <Styled._Section aria-labelledby='related-posts-title'>
      <h2 id='related-posts-title'>이어서 읽을 글</h2>
      <p>{match.section.title} 주제를 더 깊이 살펴보려면 아래 글을 함께 읽어보세요.</p>
      <ul>
        {relatedSlugs.map((slug) => {
          const post = postMap.get(slug)
          if (!post) return null
          return (
            <li key={slug}>
              <Styled._PostLink to={post.fields.slug}>{post.frontmatter.title}</Styled._PostLink>
            </li>
          )
        })}
      </ul>
      <Styled._HubLink to={match.topic.path}>{match.topic.title} 전체 읽기 →</Styled._HubLink>
    </Styled._Section>
  )
}
