import { Spinner, useMount } from '@heli-os/vallista-core'
import { VFC, useRef, useState } from 'react'

import * as Styled from './Comment.style'

export const Comment: VFC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<{ status: 'pending' | 'success' | 'failure' }>({ status: 'pending' })

  useMount(() => {
    const hasScript = ref.current?.children ?? []

    if (hasScript.length > 0) return

    const scriptEl = document.createElement('script')
    scriptEl.onload = () => {
      setState({ status: 'success' })
    }
    scriptEl.onerror = () => {
      setState({ status: 'failure' })
    }
    scriptEl.async = true
    scriptEl.src = 'https://giscus.app/client.js'
    scriptEl.setAttribute('data-repo', 'heli-os/profile-giscus')
    scriptEl.setAttribute('data-repo-id', 'R_kgDOK9PR3w')
    scriptEl.setAttribute('data-category', 'Comments')
    scriptEl.setAttribute('data-category-id', 'DIC_kwDOK9PR384Cb9um')
    scriptEl.setAttribute('data-mapping', 'pathname')
    scriptEl.setAttribute('data-strict', '0')
    scriptEl.setAttribute('data-reactions-enabled', '1')
    scriptEl.setAttribute('data-emit-metadata', '0')
    scriptEl.setAttribute('data-input-position', 'top')
    scriptEl.setAttribute('data-theme', 'light_high_contrast')
    scriptEl.setAttribute('data-lang', 'ko')
    scriptEl.setAttribute('data-loading', 'lazy')
    scriptEl.setAttribute('crossorigin', 'anonymous')
    ref.current?.appendChild(scriptEl)
  })

  return (
    <Styled._Wrapper>
      {state.status !== 'success' && <Spinner size={50} />}
      <div ref={ref}></div>
    </Styled._Wrapper>
  )
}
