import { FC, useEffect } from 'react'

import * as Styled from './AdSense.style'

interface Props {
  slotId: string
}

export const AdSense: FC<Props> = ({ slotId }: Props) => {
  const currentPath = window ? window.location.pathname : null

  useEffect(() => {
    if (window) {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    }
  }, [currentPath])

  return (
    <Styled._Wrapper key={currentPath}>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client='ca-pub-1462947422010620'
        data-ad-slot={slotId}
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
    </Styled._Wrapper>
  )
}
