import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const _Wrapper = styled.div`
  min-height: 100vh;
  ${({ theme }) => css`
    color: ${theme.colors.PRIMARY.FOREGROUND};
    background: ${theme.colors.PRIMARY.BACKGROUND};
  `}
`

export const _Main = styled.main<{ fold: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100vw - 400px);
  min-height: calc(100vh - 43px);
  margin-top: 43px;
  margin-left: 400px;

  ${({ theme, fold }) => css`
    background: ${theme.colors.PRIMARY.BACKGROUND};
    ${fold &&
    css`
      width: calc(100vw - 80px);
      margin-left: 80px;
    `}
  `}

  @media screen and (max-width: 1024px) {
    margin-left: 0;
    margin-top: 123px;
    width: 100%;
  }
`

export const _Article = styled.article`
  ${({ theme }) => css`
    /* 마크다운 본문과 JSX 산문에 그대로 놓인 링크에만 기본 색을 준다.
       styled 링크는 emotion 클래스를 달고 나오므로 :not([class])에 걸리지 않고,
       자기 색을 그대로 쓴다. 이 조건이 없으면 '.클래스 a'가 컴포넌트의
       단일 클래스 규칙을 항상 이겨서 CTA와 허브 링크 색이 무시된다. */
    a:not([class]) {
      cursor: pointer;
      color: ${theme.colors.PRIMARY.FOREGROUND};
    }
  `}
`
