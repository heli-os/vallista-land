import { useLocation } from '@reach/router'
import { Text, Tooltip, useWindowSize } from '@heli-os/vallista-core'
import { useEffect, useMemo, useState, FC } from 'react'

import { NavCategory, NavFooter } from '../../../config/navbar'
import * as Styled from './NavBar.style'

export const NavBar: FC = () => {
  const { pathname } = useLocation()

  const categories = useMemo(() => Object.values(NavCategory), [])
  const footer = useMemo(() => Object.values(NavFooter), [])
  const [visibleTooltip, setVisibleTooltip] = useState(true)
  const windowSize = useWindowSize()

  useEffect(() => {
    setVisibleTooltip(!((windowSize.width ?? 0) <= 1024))
  }, [windowSize])

  return (
    <Styled._Container>
      <Styled._Section>
        <Styled._Wrapper>
          {categories.map((it) => (
            <Styled._Category checked={isCategoryActive(it.link)} key={it.name} to={it.link} aria-label={it.name}>
              {visibleTooltip ? (
                <Tooltip text={<Text>{it.name}</Text>} position='right'>
                  <div>{it.icon}</div>
                </Tooltip>
              ) : (
                it.icon
              )}
            </Styled._Category>
          ))}
        </Styled._Wrapper>
        <Styled._Wrapper>
          {footer.map((it) =>
            it.link === '' ? undefined : (
              <Styled._ExternalCategory
                key={it.name}
                href={it.link}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={it.name}
              >
                {visibleTooltip ? (
                  <Tooltip text={<Text>{it.name}</Text>} position='right'>
                    <div>{it.icon}</div>
                  </Tooltip>
                ) : (
                  it.icon
                )}
              </Styled._ExternalCategory>
            )
          )}
        </Styled._Wrapper>
      </Styled._Section>
    </Styled._Container>
  )

  function isCategoryActive(target: string): boolean {
    const normalize = (p: string) => (p.endsWith('/') ? p : `${p}/`)
    return normalize(pathname) === normalize(target)
  }
}
