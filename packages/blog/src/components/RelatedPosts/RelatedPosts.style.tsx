import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'

export const _Section = styled.aside`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
  `}

  /* post.tsx 의 형제들(Markdown._Wrapper, AdSense._Wrapper)과 같은 본문 폭을 쓴다.
     없으면 이 섹션만 아티클 전체 폭으로 퍼져 제목이 사이드바에 붙는다. */
  box-sizing: border-box;
  width: 100%;
  max-width: 900px;
  margin: 56px auto 0;
  padding: 36px 2rem 0;

  @media screen and (max-width: 1024px) {
    padding: 36px 1rem 0;
  }

  h2 {
    margin: 0 0 10px;
    font-size: 26px;
  }

  p {
    margin: 0 0 18px;
    line-height: 1.6;
  }

  ul {
    margin: 0 0 20px;
    padding-left: 22px;
    /* core 리셋이 ol, ul 의 list-style 을 없앤다. 들여쓰기만 남지 않도록 되살린다. */
    list-style: disc;
  }

  li + li {
    margin-top: 10px;
  }
`

export const _PostLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`

export const _HubLink = styled(Link)`
  ${({ theme }) => css`
    color: ${theme.colors.HIGHLIGHT.ORANGE};
  `}

  font-weight: 700;
  text-decoration: none;
`
