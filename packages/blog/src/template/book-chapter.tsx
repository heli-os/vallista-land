import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { graphql, HeadProps } from 'gatsby'
import { useMemo, FC } from 'react'

import { BookChapterNav } from '../components/BookChapterNav'
import { Markdown } from '../components/Markdown'
import { Seo } from '../components/Seo'

interface BookChapterNode {
  fields: { slug: string }
  frontmatter: { title: string; chapter: number }
  timeToRead: number
}

interface BookChapterData {
  markdownRemark: {
    html: string
    excerpt: string
    timeToRead: number
    fields: { slug: string }
    frontmatter: {
      title: string
      chapter: number
      description: string | null
    }
  }
  allMarkdownRemark: {
    nodes: BookChapterNode[]
  }
}

interface BookChapterPageProps {
  data: BookChapterData
  pageContext: {
    bookSlug: string
  }
}

const BookChapter: FC<BookChapterPageProps> = ({ data, pageContext }) => {
  const { html, frontmatter, timeToRead } = data.markdownRemark
  const { title, chapter } = frontmatter
  const allChapters = data.allMarkdownRemark.nodes

  const nav = useMemo(() => {
    const sorted = [...allChapters].sort((a, b) => a.frontmatter.chapter - b.frontmatter.chapter)
    const idx = sorted.findIndex((ch) => ch.frontmatter.chapter === chapter)
    return {
      prev: idx > 0 ? { title: sorted[idx - 1].frontmatter.title, slug: sorted[idx - 1].fields.slug } : null,
      next:
        idx < sorted.length - 1
          ? { title: sorted[idx + 1].frontmatter.title, slug: sorted[idx + 1].fields.slug }
          : null
    }
  }, [allChapters, chapter])

  const chapterLabel = chapter === 0 ? '프롤로그' : chapter === 13 ? '에필로그' : `${chapter}장`

  return (
    <Wrapper>
      <ChapterHeader>
        <ChapterLabel>{chapterLabel}</ChapterLabel>
        <ChapterTitle>{title}</ChapterTitle>
        <ChapterMeta>{timeToRead}분 읽기</ChapterMeta>
      </ChapterHeader>
      <Markdown html={html} />
      <BookChapterNav prev={nav.prev} next={nav.next} tocLink={`/books/${pageContext.bookSlug}/`} />
    </Wrapper>
  )
}

export default BookChapter

export const Head = ({ data, location }: HeadProps<BookChapterData>) => {
  const { title, description } = data.markdownRemark.frontmatter
  const { excerpt } = data.markdownRemark

  return (
    <Seo
      name={`${title} — 작은 팀의 기술`}
      description={description || excerpt}
      image='/book/og-book.jpeg'
      isPost={false}
      pathname={location.pathname}
    />
  )
}

export const pageQuery = graphql`
  query BookChapterBySlug($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      excerpt(pruneLength: 160)
      timeToRead
      fields {
        slug
      }
      frontmatter {
        title
        chapter
        description
      }
    }
    allMarkdownRemark(
      filter: { fields: { contentType: { eq: "books" } }, frontmatter: { draft: { ne: true } } }
      sort: { frontmatter: { chapter: ASC } }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          chapter
        }
        timeToRead
      }
    }
  }
`

const Wrapper = styled.div``

const ChapterHeader = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 0 2rem 1.5rem;
  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
  `}
`

const ChapterLabel = styled.div`
  ${({ theme }) => css`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${theme.colors.HIGHLIGHT.ORANGE};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  `}
`

const ChapterTitle = styled.h1`
  ${({ theme }) => css`
    font-size: 2rem;
    font-weight: 800;
    color: ${theme.colors.PRIMARY.FOREGROUND};
    margin-bottom: 0.5rem;
  `}
`

const ChapterMeta = styled.div`
  ${({ theme }) => css`
    font-size: 0.85rem;
    color: ${theme.colors.PRIMARY.ACCENT_3};
  `}
`
