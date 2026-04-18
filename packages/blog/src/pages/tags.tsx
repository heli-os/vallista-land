import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Container } from '@heli-os/vallista-core'
import { graphql, navigate, HeadProps } from 'gatsby'
import { FC, useMemo } from 'react'

import { Seo } from '../components/Seo'

interface TagsQuery {
  allMarkdownRemark: {
    group: { fieldValue: string; totalCount: number }[]
  }
}

interface TagsPageProps {
  data: TagsQuery
}

const SITE_URL = 'https://dataportal.kr'

const TagsPage: FC<TagsPageProps> = ({ data }) => {
  const tags = useMemo(
    () =>
      [...data.allMarkdownRemark.group]
        .filter((g) => Boolean(g.fieldValue))
        .sort((a, b) => b.totalCount - a.totalCount),
    [data]
  )

  return (
    <Container>
      <Wrapper>
        <PageTitle>태그</PageTitle>
        <Intro>글에 달린 태그 목록입니다. 태그를 누르면 해당 주제로 모인 글을 볼 수 있어요.</Intro>
        <TagList>
          {tags.map((tag) => (
            <TagItem key={tag.fieldValue} onClick={() => navigate(`/tags/${tag.fieldValue}/`)}>
              <TagName>{tag.fieldValue}</TagName>
              <TagCount>{tag.totalCount}개</TagCount>
            </TagItem>
          ))}
        </TagList>
      </Wrapper>
    </Container>
  )
}

export default TagsPage

export const Head = ({ location, data }: HeadProps<TagsQuery>) => {
  const tags = [...data.allMarkdownRemark.group].filter((g) => Boolean(g.fieldValue))

  const breadcrumbs = [
    { name: '홈', url: `${SITE_URL}/` },
    { name: '태그', url: `${SITE_URL}/tags/` }
  ]

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '태그 목록 · 테오 블로그',
    url: `${SITE_URL}/tags/`,
    hasPart: tags.map((t) => ({
      '@type': 'CollectionPage',
      name: t.fieldValue,
      url: `${SITE_URL}/tags/${encodeURIComponent(t.fieldValue)}/`
    }))
  }

  return (
    <>
      <Seo
        name='태그 목록'
        description='테오 블로그의 모든 태그 목록. 에세이, 기술, 성장, 조직, 스타트업, 회고, 리뷰, 리포트 등.'
        breadcrumbs={breadcrumbs}
        pathname={location.pathname}
      />
      <script type='application/ld+json'>{JSON.stringify(collectionJsonLd)}</script>
    </>
  )
}

export const pageQuery = graphql`
  query TagsIndexQuery {
    allMarkdownRemark(
      filter: { fields: { contentType: { eq: "posts" } }, frontmatter: { draft: { ne: true } } }
    ) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`

const Wrapper = styled.section`
  margin: 0 auto;
  width: 100%;
  max-width: 900px;
  padding: 2rem;
`

const PageTitle = styled.h1`
  ${({ theme }) => css`
    font-size: 2rem;
    font-weight: 800;
    color: ${theme.colors.PRIMARY.FOREGROUND};
    margin-bottom: 1rem;
  `}
`

const Intro = styled.p`
  ${({ theme }) => css`
    font-size: 1rem;
    color: ${theme.colors.PRIMARY.ACCENT_5};
    margin-bottom: 2rem;
    line-height: 1.6;
  `}
`

const TagList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`

const TagItem = styled.li`
  ${({ theme }) => css`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: ${theme.colors.HIGHLIGHT.ORANGE};
      background: ${theme.colors.PRIMARY.ACCENT_1};
    }
  `}
`

const TagName = styled.span`
  ${({ theme }) => css`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${theme.colors.PRIMARY.FOREGROUND};
  `}
`

const TagCount = styled.span`
  ${({ theme }) => css`
    font-size: 0.8rem;
    color: ${theme.colors.PRIMARY.ACCENT_4};
  `}
`
