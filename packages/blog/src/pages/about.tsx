import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Container } from '@heli-os/vallista-core'
import { HeadProps, Link } from 'gatsby'
import { FC } from 'react'

import { Seo } from '../components/Seo'

const SITE_URL = 'https://dataportal.kr'

const AboutPage: FC = () => {
  return (
    <Container>
      <Wrapper>
        <PageTitle>소개</PageTitle>
        <Section>
          <h2>테오 블로그는</h2>
          <p>
            스타트업에서 CTO로 일하며 오랫동안 제품을 만들어온 엔지니어 <strong>진태양(Theo)</strong>이
            글을 쓰는 곳입니다. 제품 엔지니어링, 조직과 성장, Agentic AI 논문 읽기, 작은 팀의 기술에 대한
            관찰과 생각을 담습니다.
          </p>
          <p>
            기술은 도구일 뿐, 결국 사람과 팀과 제품이 어떻게 맞물리는지가 더 중요하다고 믿습니다. 그래서
            이 블로그는 프레임워크·라이브러리 튜토리얼보다는 <em>왜 그렇게 만들게 되었는지</em>에 대한
            이야기가 더 많습니다.
          </p>
        </Section>

        <Section>
          <h2>주요 카테고리</h2>
          <ul>
            <li>
              <strong>에세이</strong> — 일, 조직, 성장, 삶에 대한 짧은 관찰 기록
            </li>
            <li>
              <strong>기술</strong> — 제품 엔지니어링과 아키텍처, 개발 방법론
            </li>
            <li>
              <strong>Agentic AI 논문 읽기</strong> — LLM 에이전트·툴 사용·멀티에이전트 관련 주요 논문 리뷰
            </li>
            <li>
              <strong>작은 팀의 기술 (책)</strong> — 개발자 출신 창업자의 조직 운영기
            </li>
          </ul>
        </Section>

        <Section>
          <h2>탐색하기</h2>
          <LinkList>
            <li>
              <Link to='/posts/'>전체 글 목록</Link> — 지금까지 쓴 모든 글
            </li>
            <li>
              <Link to='/tags/'>태그 목록</Link> — 주제별로 모아 보기
            </li>
            <li>
              <Link to='/books/'>책</Link> — 연재 중인 책
            </li>
            <li>
              <Link to='/resume/'>이력 / 저자 소개</Link> — 커리어와 활동
            </li>
          </LinkList>
        </Section>

        <Section>
          <h2>연락과 구독</h2>
          <ul>
            <li>
              RSS: <a href='/rss.xml'>전체 글 피드</a> · <a href='/books/rss.xml'>책 피드</a>
            </li>
            <li>
              GitHub: <a href='https://github.com/heli-os' target='_blank' rel='noopener noreferrer'>@heli-os</a>
            </li>
            <li>
              채용 중인 회사: <a href='https://careers.bolta.io' target='_blank' rel='noopener noreferrer'>bolta.io</a>
            </li>
          </ul>
        </Section>
      </Wrapper>
    </Container>
  )
}

export default AboutPage

export const Head = ({ location }: HeadProps) => {
  const breadcrumbs = [
    { name: '홈', url: `${SITE_URL}/` },
    { name: '소개', url: `${SITE_URL}/about/` }
  ]

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: '소개 · 테오 블로그',
    url: `${SITE_URL}/about/`,
    mainEntity: { '@id': `${SITE_URL}/#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` }
  }

  return (
    <>
      <Seo
        name='소개'
        description='테오 블로그와 저자 진태양(Theo)에 대한 소개. 제품 엔지니어링·Agentic AI·조직·성장 에세이.'
        breadcrumbs={breadcrumbs}
        pathname={location.pathname}
      />
      <script type='application/ld+json'>{JSON.stringify(aboutPageJsonLd)}</script>
    </>
  )
}

const Wrapper = styled.section`
  margin: 0 auto;
  width: 100%;
  max-width: 760px;
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

const Section = styled.section`
  ${({ theme }) => css`
    margin-bottom: 2.5rem;

    & > h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: ${theme.colors.PRIMARY.FOREGROUND};
      margin: 0 0 0.8rem;
    }

    & > p {
      font-size: 1rem;
      line-height: 1.8;
      color: ${theme.colors.PRIMARY.ACCENT_6};
      margin: 0 0 0.8rem;
    }

    & > ul {
      list-style: disc;
      padding-left: 1.3rem;
      font-size: 1rem;
      line-height: 1.9;
      color: ${theme.colors.PRIMARY.ACCENT_6};
    }

    & > ul li {
      margin-bottom: 0.3rem;
    }

    a {
      color: ${theme.colors.HIGHLIGHT.ORANGE};
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  `}
`

const LinkList = styled.ul`
  ${({ theme }) => css`
    list-style: disc;
    padding-left: 1.3rem;
    font-size: 1rem;
    line-height: 1.9;
    color: ${theme.colors.PRIMARY.ACCENT_6};

    a {
      color: ${theme.colors.HIGHLIGHT.ORANGE};
      font-weight: 600;
    }
  `}
`
