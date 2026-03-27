import { Container, LoadingDots } from '@heli-os/vallista-core'
import { FC } from 'react'

const ProgressPlayground: FC = () => {
  return (
    <Container>
      <LoadingDots size={2} />
      <LoadingDots size={4} />
      <LoadingDots size={4}>로딩..</LoadingDots>
    </Container>
  )
}

export default ProgressPlayground
