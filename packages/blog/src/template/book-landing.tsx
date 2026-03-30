import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { graphql, navigate, HeadProps } from 'gatsby'
import { FC } from 'react'

import { Seo } from '../components/Seo'

interface BookChapterNode {
  fields: { slug: string }
  frontmatter: { title: string; chapter: number; description: string | null }
  timeToRead: number
}

interface BookLandingData {
  allMarkdownRemark: {
    nodes: BookChapterNode[]
  }
}

interface BookLandingPageProps {
  data: BookLandingData
  pageContext: { bookSlug: string }
}

const ACTS = [
  { title: '제1막: 왜 작은 팀인가', chapters: [0, 1, 2] },
  { title: '제2막: 작은 팀을 작동시키는 기술', chapters: [3, 4, 5, 6, 7, 8, 9] },
  { title: '제3막: 작은 팀의 미래', chapters: [10, 11, 12, 13] }
]

const BookLanding: FC<BookLandingPageProps> = ({ data }) => {
  const nodes = [...data.allMarkdownRemark.nodes].sort(
    (a, b) => a.frontmatter.chapter - b.frontmatter.chapter
  )
  const totalReadTime = nodes.reduce((sum, n) => sum + n.timeToRead, 0)

  return (
    <Wrapper>
      <Header>
        <CoverImage src="/book/cover.jpeg" alt="작은 팀의 기술 표지" />
        <BookTitle>작은 팀의 기술</BookTitle>
        <Subtitle>개발자 출신 창업자의 조직 운영기</Subtitle>
        <Meta>전 {nodes.length}장 · 약 {totalReadTime}분</Meta>
      </Header>

      <Description>
        100개 이상의 제품을 만들며 깨달은 것 — 결국 가장 잘 작동하는 건 작은 팀이었다.
        <br />
        채용부터 AI 시대의 조직까지, 작은 팀 위에 쌓아 올린 운영의 기술.
      </Description>

      {/* TODO: PDF 준비 완료 후 다운로드 버튼 노출
      <DownloadSection>
        <DownloadLink href='/book/작은-팀의-기술.pdf' download>
          PDF 다운로드
        </DownloadLink>
      </DownloadSection>
      */}

      <TOC>
        {ACTS.map((act) => (
          <Act key={act.title}>
            <ActTitle>{act.title}</ActTitle>
            <ChapterList>
              {act.chapters.map((chNum) => {
                const node = nodes.find((n) => n.frontmatter.chapter === chNum)
                if (!node) return null
                return (
                  <ChapterItem key={chNum} onClick={() => navigate(node.fields.slug)}>
                    <ChapterTitle>{node.frontmatter.title}</ChapterTitle>
                    <ChapterMeta>{node.timeToRead}분</ChapterMeta>
                  </ChapterItem>
                )
              })}
            </ChapterList>
          </Act>
        ))}
      </TOC>

      <StartReading onClick={() => nodes[0] && navigate(nodes[0].fields.slug)}>
        처음부터 읽기
      </StartReading>
    </Wrapper>
  )
}

export default BookLanding

export const Head = ({ location }: HeadProps) => (
  <Seo
    name='작은 팀의 기술'
    description='개발자 출신 창업자의 조직 운영기. 채용, 리더십, 피드백, 실행 구조, AI 시대의 조직까지.'
    image='/book/og-book.jpeg'
    isPost={false}
    pathname={location.pathname}
  />
)

export const pageQuery = graphql`
  query BookLandingQuery($bookSlug: String!) {
    allMarkdownRemark(
      filter: {
        fields: { contentType: { eq: "books" }, slug: { regex: $bookSlug } }
        frontmatter: { draft: { ne: true } }
      }
      sort: { frontmatter: { chapter: ASC } }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          chapter
          description
        }
        timeToRead
      }
    }
  }
`

const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
  `}
`

const CoverImage = styled.img`
  ${({ theme }) => css`
    width: 240px;
    height: auto;
    border-radius: 8px;
    box-shadow: ${theme.shadows.MEDIUM};
    margin-bottom: 1.5rem;
  `}
`

const BookTitle = styled.h1`
  ${({ theme }) => css`
    font-size: 2.5rem;
    font-weight: 800;
    color: ${theme.colors.PRIMARY.FOREGROUND};
    margin-bottom: 0.5rem;
  `}
`

const Subtitle = styled.p`
  ${({ theme }) => css`
    font-size: 1.1rem;
    color: ${theme.colors.PRIMARY.ACCENT_4};
    margin-bottom: 0.5rem;
  `}
`

const Meta = styled.p`
  ${({ theme }) => css`
    font-size: 0.9rem;
    color: ${theme.colors.PRIMARY.ACCENT_3};
  `}
`

const Description = styled.p`
  ${({ theme }) => css`
    font-size: 1rem;
    line-height: 1.8;
    color: ${theme.colors.PRIMARY.ACCENT_5};
    margin-bottom: 2rem;
    text-align: center;
  `}
`

const DownloadSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`

const DownloadLink = styled.a`
  ${({ theme }) => css`
    display: inline-block;
    padding: 0.8rem 2rem;
    background: ${theme.colors.HIGHLIGHT.ORANGE};
    color: ${theme.colors.PRIMARY.BACKGROUND};
    font-weight: 700;
    border-radius: 6px;
    text-decoration: none;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.85;
    }
  `}
`

const TOC = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
`

const Act = styled.section``

const ActTitle = styled.h2`
  ${({ theme }) => css`
    font-size: 1rem;
    font-weight: 700;
    color: ${theme.colors.HIGHLIGHT.ORANGE};
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
  `}
`

const ChapterList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ChapterItem = styled.li`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
    transition: all 0.2s;
    &:hover {
      border-color: ${theme.colors.HIGHLIGHT.ORANGE};
      background: ${theme.colors.PRIMARY.ACCENT_1};
    }
  `}
`

const ChapterTitle = styled.span`
  ${({ theme }) => css`
    font-weight: 600;
    color: ${theme.colors.PRIMARY.FOREGROUND};
  `}
`

const ChapterMeta = styled.span`
  ${({ theme }) => css`
    font-size: 0.8rem;
    color: ${theme.colors.PRIMARY.ACCENT_3};
    flex-shrink: 0;
    margin-left: 1rem;
  `}
`

const StartReading = styled.button`
  ${({ theme }) => css`
    display: block;
    width: 100%;
    padding: 1rem;
    background: ${theme.colors.PRIMARY.FOREGROUND};
    color: ${theme.colors.PRIMARY.BACKGROUND};
    font-size: 1.1rem;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.85;
    }
  `}
`
