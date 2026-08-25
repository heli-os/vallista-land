import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'

export const _Section = styled.aside`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
  `}

  margin-top: 56px;
  padding-top: 36px;

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
  }

  li + li {
    margin-top: 10px;
  }
`

export const _PostLink = styled(Link)`
  color: inherit;
`

export const _HubLink = styled(Link)`
  ${({ theme }) => css`
    color: ${theme.colors.HIGHLIGHT.ORANGE};
  `}

  font-weight: 700;
`
