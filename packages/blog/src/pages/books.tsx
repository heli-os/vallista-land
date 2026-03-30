import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Container } from '@heli-os/vallista-core'
import { graphql, navigate, HeadProps } from 'gatsby'
import { FC, useMemo } from 'react'

import { Seo } from '../components/Seo'

interface BookChapterNode {
  fields: { slug: string }
  frontmatter: { title: string; chapter: number }
  timeToRead: number
}

interface BooksQuery {
  allMarkdownRemark: {
    nodes: BookChapterNode[]
  }
}

interface BooksPageProps {
  data: BooksQuery
}

const BooksPage: FC<BooksPageProps> = ({ data }) => {
  const nodes = data.allMarkdownRemark.nodes

  const books = useMemo(() => {
    const groups: Record<string, { slug: string; chapters: BookChapterNode[] }> = {}
    nodes.forEach((n) => {
      const bookSlug = n.fields.slug.split('/')[2]
      if (!groups[bookSlug]) groups[bookSlug] = { slug: bookSlug, chapters: [] }
      groups[bookSlug].chapters.push(n)
    })
    return Object.values(groups).map((g) => ({
      slug: g.slug,
      chapterCount: g.chapters.length,
      totalReadTime: g.chapters.reduce((sum, c) => sum + c.timeToRead, 0)
    }))
  }, [nodes])

  const BOOK_META: Record<
    string,
    { title: string; subtitle: string; description: string; coverImage: string }
  > = {
    'the-art-of-small-teams': {
      title: '작은 팀의 기술',
      subtitle: '개발자 출신 창업자의 조직 운영기',
      description:
        '100개 이상의 제품을 만들며 깨달은 것 — 결국 가장 잘 작동하는 건 작은 팀이었다.',
      coverImage: '/book/cover.jpeg'
    }
  }

  return (
    <Container>
      <Wrapper>
        <PageTitle>책</PageTitle>
        <BookGrid>
          {books.map((book) => {
            const meta = BOOK_META[book.slug]
            if (!meta) return null
            return (
              <BookCard key={book.slug} onClick={() => navigate(`/books/${book.slug}/`)}>
                <BookCardInner>
                  <BookCoverThumb src={meta.coverImage} alt={meta.title} />
                  <BookCardText>
                    <CardTitle>{meta.title}</CardTitle>
                    <CardSubtitle>{meta.subtitle}</CardSubtitle>
                    <CardDescription>{meta.description}</CardDescription>
                    <CardMeta>
                      전 {book.chapterCount}장 · 약 {book.totalReadTime}분
                    </CardMeta>
                  </BookCardText>
                </BookCardInner>
              </BookCard>
            )
          })}
        </BookGrid>
      </Wrapper>
    </Container>
  )
}

export default BooksPage

export const Head = ({ location }: HeadProps) => (
  <Seo name='책' description='테오가 쓴 책 목록' isPost={false} pathname={location.pathname} />
)

export const pageQuery = graphql`
  query BooksListQuery {
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
    margin-bottom: 2rem;
  `}
`

const BookGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const BookCard = styled.div`
  ${({ theme }) => css`
    padding: 2rem;
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      border-color: ${theme.colors.HIGHLIGHT.ORANGE};
      box-shadow: ${theme.shadows.EXTRA_SMALL};
    }
  `}
`

const BookCardInner = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`

const BookCoverThumb = styled.img`
  ${({ theme }) => css`
    width: 120px;
    height: auto;
    border-radius: 6px;
    box-shadow: ${theme.shadows.EXTRA_SMALL};
    flex-shrink: 0;
  `}
`

const BookCardText = styled.div`
  display: flex;
  flex-direction: column;
`

const CardTitle = styled.h2`
  ${({ theme }) => css`
    font-size: 1.5rem;
    font-weight: 800;
    color: ${theme.colors.PRIMARY.FOREGROUND};
    margin-bottom: 0.3rem;
  `}
`

const CardSubtitle = styled.p`
  ${({ theme }) => css`
    font-size: 0.95rem;
    color: ${theme.colors.PRIMARY.ACCENT_4};
    margin-bottom: 0.8rem;
  `}
`

const CardDescription = styled.p`
  ${({ theme }) => css`
    font-size: 0.9rem;
    line-height: 1.6;
    color: ${theme.colors.PRIMARY.ACCENT_5};
    margin-bottom: 1rem;
  `}
`

const CardMeta = styled.div`
  ${({ theme }) => css`
    font-size: 0.8rem;
    color: ${theme.colors.PRIMARY.ACCENT_3};
  `}
`
