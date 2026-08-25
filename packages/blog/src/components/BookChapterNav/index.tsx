import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
import { FC, HTMLAttributes, ComponentType } from 'react'

interface ChapterInfo {
  title: string
  slug: string
}

interface BookChapterNavProps {
  prev: ChapterInfo | null
  next: ChapterInfo | null
  tocLink: string
}

export const BookChapterNav: FC<BookChapterNavProps> = ({ prev, next, tocLink }) => {
  return (
    <Wrapper>
      {prev ? (
        <NavItem align='left' to={prev.slug}>
          <>
            <Label>← 이전 챕터</Label>
            <Title>{prev.title}</Title>
          </>
        </NavItem>
      ) : (
        <DisabledNavItem align='left'>
          <Label>&nbsp;</Label>
        </DisabledNavItem>
      )}
      <NavItem align='right' to={next ? next.slug : tocLink}>
        {next ? (
          <>
            <Label>다음 챕터 →</Label>
            <Title>{next.title}</Title>
          </>
        ) : (
          <>
            <Label>목차로 돌아가기</Label>
            <Title>작은 팀의 기술</Title>
          </>
        )}
      </NavItem>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 3rem 0 2rem;
  padding: 0 2rem;
`

const NavItem = styled(Link)<{ align: 'left' | 'right' }>`
  ${({ theme, align }) => css`
    flex: 1;
    cursor: pointer;
    text-align: ${align};
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
    transition: all 0.2s;
    text-decoration: none;

    &:hover {
      border-color: ${theme.colors.HIGHLIGHT.ORANGE};
      background: ${theme.colors.PRIMARY.ACCENT_1};
    }
  `}
`

const DisabledNavItem = NavItem.withComponent('span') as unknown as ComponentType<
  HTMLAttributes<HTMLSpanElement> & { align: 'left' | 'right' }
>

const Label = styled.div`
  ${({ theme }) => css`
    font-size: 0.8rem;
    color: ${theme.colors.PRIMARY.ACCENT_4};
    margin-bottom: 0.3rem;
  `}
`

const Title = styled.div`
  ${({ theme }) => css`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${theme.colors.PRIMARY.FOREGROUND};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`
