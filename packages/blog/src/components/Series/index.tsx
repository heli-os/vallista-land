import { Collapse, Container } from '@heli-os/vallista-core'
import { navigate } from 'gatsby'
import { FC } from 'react'

import * as Styled from './Series.style'

interface SeriesProps {
  name: string
  currentSlug: string
  posts: {
    name: string
    timeToRead: number
    slug: string
  }[]
}

export const Series: FC<SeriesProps> = (props) => {
  const { name, posts, currentSlug } = props

  return (
    <Collapse title={name} card size='medium' subtitle={`시리즈의 글 (${posts.length}개)`}>
      <Container>
        <Styled._List>
          {posts.map((it) => (
            <Styled._Item timeToRead={it.timeToRead} active={it.slug === currentSlug} key={it.name}>
              <span onClick={() => it.slug !== currentSlug && moveToLocation(it.slug)}>{it.name}</span>
            </Styled._Item>
          ))}
        </Styled._List>
      </Container>
    </Collapse>
  )

  function moveToLocation(slug: string): void {
    navigate(slug)
  }
}
