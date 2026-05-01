import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Container } from '@heli-os/vallista-core'
import { navigate } from 'gatsby'
import { FC, PropsWithChildren } from 'react'

import { Footer } from '../Footer'
import { TextSizeControl } from '../TextSizeControl'

interface BookLayoutProps {
  bookTitle?: string
  bookSlug?: string
  pathname?: string
}

export const BookLayout: FC<PropsWithChildren<BookLayoutProps>> = ({ children, bookTitle, bookSlug, pathname }) => {
  const bookPath = bookSlug
    ? `/books/${bookSlug.replace(/^\/|\/$/g, '')}/`
    : undefined
  const isLandingPage = pathname === bookPath

  return (
    <Wrapper>
      <Container>
        <TopNav>
          <BreadcrumbGroup>
            <NavLink onClick={() => navigate('/')}>블로그 홈</NavLink>
            <NavDivider>/</NavDivider>
            <NavLink onClick={() => navigate('/books/')}>책 목록</NavLink>
            {bookTitle && (
              <>
                <NavDivider>/</NavDivider>
                {bookPath && !isLandingPage ? (
                  <NavLink onClick={() => navigate(bookPath)}>{bookTitle}</NavLink>
                ) : (
                  <NavCurrent>{bookTitle}</NavCurrent>
                )}
              </>
            )}
          </BreadcrumbGroup>
          <TextSizeControlWrapper>
            <TextSizeControl />
          </TextSizeControlWrapper>
        </TopNav>
        <Main>
          <Article>{children}</Article>
        </Main>
      </Container>
      <Footer />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fff;
  color: #000;
`

const TopNav = styled.nav`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    border-bottom: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
  `}
`

const BreadcrumbGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const TextSizeControlWrapper = styled.div`
  @media screen and (max-width: 1024px) {
    display: none;
  }
`

const NavLink = styled.span`
  ${({ theme }) => css`
    cursor: pointer;
    font-size: 0.85rem;
    color: ${theme.colors.PRIMARY.ACCENT_4};
    transition: color 0.2s;
    &:hover {
      color: ${theme.colors.HIGHLIGHT.ORANGE};
    }
  `}
`

const NavDivider = styled.span`
  ${({ theme }) => css`
    font-size: 0.8rem;
    color: ${theme.colors.PRIMARY.ACCENT_3};
  `}
`

const NavCurrent = styled.span`
  ${({ theme }) => css`
    font-size: 0.85rem;
    color: ${theme.colors.PRIMARY.FOREGROUND};
    font-weight: 600;
  `}
`

const Main = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 0;
`

const Article = styled.article`
  padding: 2rem 0;
`
