import { FC, useMemo } from 'react'

import { Topic } from '../../config/topics'
import { formatKoreanDate } from '../../utils'
import * as Styled from './TopicHub.style'

interface TopicPost {
  fields: { slug: string }
  frontmatter: { title: string }
}

interface TopicHubProps {
  topic: Topic
  posts: TopicPost[]
}

export const TopicHub: FC<TopicHubProps> = ({ topic, posts }) => {
  const postsBySlug = useMemo(
    () => new Map(posts.map((post) => [decodeURIComponent(post.fields.slug).replace(/^\/+|\/+$/g, ''), post])),
    [posts]
  )

  const updatedDate = formatKoreanDate(topic.updated)

  return (
    <Styled._Wrapper>
      <Styled._Header>
        <h1>{topic.title}</h1>
        {topic.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Styled._Updated>최근 업데이트 {updatedDate}</Styled._Updated>
      </Styled._Header>

      <Styled._ReadingOrder aria-labelledby={`${topic.id}-reading-order`}>
        <h2 id={`${topic.id}-reading-order`}>처음 읽는다면</h2>
        <p>아래 순서로 읽으면 개념과 판단 기준을 차례로 연결하기 좋습니다.</p>
        <ol>
          {topic.readingOrder.map((slug) => {
            const post = postsBySlug.get(slug)
            if (!post) return null
            return (
              <li key={slug}>
                <Styled._ReadingLink to={post.fields.slug}>{post.frontmatter.title}</Styled._ReadingLink>
              </li>
            )
          })}
        </ol>
      </Styled._ReadingOrder>

      {topic.sections.map((section, index) => (
        <Styled._Section key={section.title} aria-labelledby={`${topic.id}-section-${index + 1}`}>
          <h2 id={`${topic.id}-section-${index + 1}`}>{section.title}</h2>
          <p>{section.description}</p>
          <Styled._PostList>
            {section.slugs.map((slug) => {
              const post = postsBySlug.get(slug)
              if (!post) return null
              return (
                <li key={slug}>
                  <Styled._PostLink to={post.fields.slug}>{post.frontmatter.title}</Styled._PostLink>
                </li>
              )
            })}
          </Styled._PostList>
        </Styled._Section>
      ))}
    </Styled._Wrapper>
  )
}
