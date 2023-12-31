import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Button, Container, Text } from '@heli-os/vallista-core'
import { graphql, navigate } from 'gatsby'
import { VFC } from 'react'

import { ListTable } from '../components/ListTable'
import { Seo } from '../components/Seo'
import { IndexQuery, PageProps, Post } from '../types/type'
import { filteredByDraft, getTime } from '../utils'

const IndexPage: VFC<PageProps<IndexQuery>> = (props) => {
  const { data } = props
  const { nodes } = data.allMarkdownRemark

  return (
    <Container>
      <Seo name='홈' />
      <Header>
        <Wrapper>
          <Title>
            <Text as='span' size={48} weight={800}>
              어서오세요!
            </Text>
            <Text as='h1' size={48} weight={800} lineHeight={56}>
              저는 진태양입니다.
            </Text>
          </Title>
          <SubTitle>
            <Text as='p' size={20} weight={400} lineHeight={40}>
              대한민국 서울에서 <strong>소프트웨어 엔지니어</strong>로 일하고 있습니다. 서비스 개발이란 개발과
              비즈니스와의 커뮤니케이션이 가장 중요하다고 생각하기에 항상 능동적이고 적극적인 커뮤니케이션으로 문제
              해결과 비즈니스 발전을 위해 뛰어듭니다. 이러한 점을 바탕으로 더 좋은 개발자로서 성장하기 위해 더 치열하게
              학습하고, 경험하고, 노력하고 있습니다.
            </Text>
          </SubTitle>
          <Button size='large' color='alert' onClick={() => moveToLocation('/posts')}>
            <Text size={16} weight={800}>
              블로그 글 보러갈까요?
            </Text>
          </Button>
        </Wrapper>
      </Header>
      <Contents>
        <ListTable title='최근 글' list={filteredNewestPosts(nodes)} />
      </Contents>
    </Container>
  )

  function getSimpleDate(target: string): string {
    const [, month, day] = getTime(target)

    return `${Number(month)}월 ${Number(day)}일`
  }

  function moveToLocation(target: string): void {
    navigate(target)
  }

  function filteredNewestPosts(posts: Post[]): { name: string; slug: string; date: string }[] {
    const cuttingCount = 5

    return filteredByDraft(posts)
      .filter((_, idx) => idx < cuttingCount + 1)
      .map((it) => ({
        name: it.frontmatter.title,
        slug: it.fields.slug,
        date: getSimpleDate(it.frontmatter.date)
      }))
  }
}

const HandAnimation = keyframes`
  0% {
    transform: rotateZ(0);
  }

  50% {
    transform: rotateZ(30deg);
  }

  100% {
    transform: rotateZ(0deg);
  }
`

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 900px;
  padding: 2rem;
`

const Header = styled.header`
  padding: 2rem 0;
`

const Title = styled.div`
  margin-bottom: 1.5rem;
  max-width: 550px;

  & > span:first-of-type {
    position: relative;

    &::after {
      position: absolute;
      right: -4rem;
      top: -0.5rem;
      content: '✋';
      display: block;
      animation: ${HandAnimation} 1s ease-in-out infinite;
    }
  }
`

const SubTitle = styled.div`
  max-width: 550px;
  margin-bottom: 2rem;
`

const Contents = styled.section`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 900px;
  padding: 2rem;
`

export default IndexPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date
          image {
            publicURL
          }
          draft
        }
      }
    }
  }
`
