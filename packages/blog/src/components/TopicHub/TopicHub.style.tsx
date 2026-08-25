import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'

// 다른 페이지(posts, about)와 같은 본문 폭과 여백을 쓴다. 없으면 뷰포트 오른쪽 끝까지 붙는다.
export const _Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 900px;
  padding: 2rem;
`

export const _Header = styled.header`
  margin-bottom: 48px;

  h1 {
    margin: 0 0 18px;
    font-size: clamp(36px, 6vw, 60px);
    line-height: 1.12;
    letter-spacing: -0.04em;
  }

  p {
    max-width: 760px;
    margin: 12px 0;
    font-size: 18px;
    line-height: 1.8;
    word-break: keep-all;
  }
`

export const _Updated = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.PRIMARY.ACCENT_4};
  `}

  margin-top: 20px !important;
  font-size: 14px !important;
`

export const _ReadingOrder = styled.section`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
    background: ${theme.colors.PRIMARY.ACCENT_1};
  `}

  margin: 0 0 56px;
  padding: 28px;
  border-radius: 12px;

  h2 {
    margin: 0 0 8px;
    font-size: 24px;
  }

  p {
    margin: 0 0 18px;
    line-height: 1.7;
  }

  ol {
    margin: 0;
    padding-left: 24px;
    /* core 리셋이 ol, ul 의 list-style 을 없앤다. 읽는 순서를 안내하는
       자리라 번호를 되살린다. */
    list-style: decimal;
  }

  li + li {
    margin-top: 10px;
  }
`

export const _Section = styled.section`
  margin: 0 0 52px;

  h2 {
    margin: 0 0 8px;
    font-size: 28px;
    letter-spacing: -0.03em;
  }

  > p {
    max-width: 720px;
    margin: 0 0 20px;
    line-height: 1.7;
  }
`

export const _PostList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media screen and (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

export const _PostLink = styled(Link)`
  ${({ theme }) => css`
    color: ${theme.colors.PRIMARY.FOREGROUND};
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_2};

    &:hover {
      background: ${theme.colors.PRIMARY.ACCENT_1};
      border-color: ${theme.colors.HIGHLIGHT.ORANGE};
    }
  `}

  display: block;
  /* height 100% 와 패딩을 함께 쓴다. border-box 가 없으면 패딩과 보더가
     그리드 셀 높이 위에 더해져 다음 행 카드와 겹친다. */
  box-sizing: border-box;
  height: 100%;
  padding: 18px;
  border-radius: 10px;
  line-height: 1.55;
  text-decoration: none;
  word-break: keep-all;
`

export const _ReadingLink = styled(Link)`
  ${({ theme }) => css`
    color: ${theme.colors.PRIMARY.FOREGROUND};
  `}

  text-decoration: none;
`
