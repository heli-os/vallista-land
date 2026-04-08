import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const _List = styled.ol`
  padding-left: 2.5rem;
  box-sizing: border-box;
  line-height: 1.6;
  list-style: decimal;
`

export const _Item = styled.li<{ timeToRead: number; active: boolean }>`
  ${({ theme, timeToRead, active }) => css`
    margin-bottom: 0.5rem;
    &::marker {
      font-weight: 600;
      color: ${theme.colors.HIGHLIGHT.ORANGE};
    }

    &::after {
      content: '- ${timeToRead}분';
      margin-left: 0.2rem;
      font-size: 0.8rem;
    }

    & > span {
      cursor: ${active ? 'default' : 'pointer'};
      border-bottom: 2px solid ${theme.colors.HIGHLIGHT.ORANGE};
      font-weight: 600;
      text-decoration: none;
      color: ${active ? theme.colors.HIGHLIGHT.ORANGE : theme.colors.PRIMARY.FOREGROUND};
      background: transparent;
      border-left: ${active ? `4px solid ${theme.colors.HIGHLIGHT.ORANGE}` : 'none'};
      padding-left: ${active ? '6px' : '0'};
      transition: all 0.1s ease-out;

      &:hover {
        background: ${active ? 'transparent' : theme.colors.HIGHLIGHT.ORANGE};
        color: ${active ? theme.colors.HIGHLIGHT.ORANGE : theme.colors.PRIMARY.BACKGROUND};
      }
    }
  `}
`
