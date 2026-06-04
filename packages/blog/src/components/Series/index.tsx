import { Collapse, Container } from '@heli-os/vallista-core'
import { Link } from 'gatsby'
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
              {it.slug === currentSlug ? <span>{it.name}</span> : <Link to={it.slug}>{it.name}</Link>}
            </Styled._Item>
          ))}
        </Styled._List>
      </Container>
    </Collapse>
  )
}
