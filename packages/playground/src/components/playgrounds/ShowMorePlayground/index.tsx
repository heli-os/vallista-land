import { Container, ShowMore } from '@heli-os/vallista-core'
import { useState, FC } from 'react'

const TogglePlayground: FC = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Container>
      <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />
    </Container>
  )
}

export default TogglePlayground
