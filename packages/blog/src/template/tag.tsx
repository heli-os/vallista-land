import styled from '@emotion/styled'
import { Container, Spacer } from '@heli-os/vallista-core'
import { graphql, HeadProps } from 'gatsby'
import { useMemo, FC } from 'react'

import { ListTable } from '../components/ListTable'
import { Seo } from '../components/Seo'
import { PageProps } from '../types/type'
import { toDate, getTime } from '../utils'

const SITE_URL = 'https://dataportal.kr'

interface TagPageContext {
  tag: string
}

interface TagPost {
  fields: {
    slug: string
  }
  frontmatter: {
    title: string
    date: string
  }
}

interface TagQuery {
  allMarkdownRemark: {
    nodes: TagPost[]
    totalCount: number
  }
}

const TagPage: FC<PageProps<TagQuery> & { pageContext: TagPageContext }> = (props) => {
  const { tag } = props.pageContext
  const { nodes } = props.data.allMarkdownRemark

  const views = useMemo(() => {
    const sorted = [...nodes].sort((a, b) => {
      return toDate(b.frontmatter.date).getTime() - toDate(a.frontmatter.date).getTime()
    })

    const remake = sorted.reduce<Record<string, Array<{ name: string; date: string; slug: string }>>>((acc, curr) => {
      const { slug } = curr.fields
      const { date, title: name } = curr.frontmatter
      const [year, month, day] = getTime(date)

      if (!acc[year]) acc[year] = []

      acc[year].push({
        name,
        date: `${Number(month)}월 ${Number(day)}일`,
        slug
      })

      return acc
    }, {})

    const values = Object.values(remake)
    return Object.keys(remake)
      .map((it, idx) => ({
        year: it,
        posts: values[idx]
      }))
      .sort((a, b) => Number(b.year) - Number(a.year))
  }, [nodes])

  return (
    <Container>
      <Wrapper>
        {views.map((it) => (
          <Container key={it.year}>
            <div>
              <ListTable title={it.year} list={it.posts} underline />
            </div>
            <Spacer y={2} />
          </Container>
        ))}
      </Wrapper>
    </Container>
  )
}

const Wrapper = styled.section`
  margin: 0 auto;
  width: 100%;
  max-width: 900px;
  padding: 2rem;
`

export default TagPage

export const Head = ({ location, pageContext }: HeadProps<TagQuery, TagPageContext>) => {
  const { tag } = pageContext

  const breadcrumbs = [
    { name: '홈', url: `${SITE_URL}/` },
    { name: tag, url: `${SITE_URL}/tags/${tag}/` }
  ]

  return (
    <Seo
      name={`${tag} — 테오 블로그`}
      description={`${tag} 태그가 포함된 글 모음`}
      breadcrumbs={breadcrumbs}
      pathname={location.pathname}
    />
  )
}

export const pageQuery = graphql`
  query TagPageQuery($tag: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } }, fields: { contentType: { eq: "posts" } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date
        }
      }
      totalCount
    }
  }
`
