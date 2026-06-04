import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@heli-os/vallista-core'
import React, { useEffect } from 'react'

import { Layout } from './src/components/Layout'
import { BookLayout } from './src/components/BookLayout'

require('prismjs')
require('prismjs/themes/prism-tomorrow.css')
require('prismjs/plugins/line-numbers/prism-line-numbers.css')
require('prismjs/components/prism-kotlin')

/**
 * 클라이언트 랜더링이 첫 시작될 때
 *
 * - Modal Root를 생성한다. 이 root는 모달을 관리하는데 쓰인다.
 * - AdSense 스크립트를 로드한다.
 */
export function onInitialClientRender() {
  let modalRoot = document?.getElementById('modal-root') || null

  if (!modalRoot) {
    modalRoot = document.createElement('div')
    modalRoot.id = 'modal-root'
    document.body.appendChild(modalRoot)
  }

  // AdSense 스크립트 로드
  if (!document.querySelector('script[src*="adsbygoogle"]')) {
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1462947422010620'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)
  }
}

/** 서버사이드에서 전체 틀 요소를 제작할 때 호출 */
export function wrapRootElement({ element }) {
  return (
    <ThemeProvider>
      <Loader>{element}</Loader>
    </ThemeProvider>
  )
}

/** 클라이언트 사이드에서 페이지 단위로 요소를 제작할 때 호출 */
export function wrapPageElement({ element, props }) {
  return <InitializeElement element={element} pathname={props.location.pathname} pageContext={props.pageContext} />
}

const Loader = ({ children }) => {
  return <Loading>{children}</Loading>
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

// JS 없이도 콘텐츠가 보이도록 CSS 애니메이션으로 페이드인한다.
// (이전 구현은 useEffect로 opacity를 토글해 JS가 꺼지면 opacity:0으로 고정됐다)
const Loading = styled.div`
  animation: ${fadeIn} 0.2s ease forwards;
`

const InitializeElement = ({ element, pathname, pageContext }) => {
  useEffect(() => {
    document.body.style.backgroundColor = '#fff'
  }, [])

  const isBookPage = pathname?.startsWith('/books/')

  if (isBookPage) {
    return (
      <BookLayout bookTitle={pageContext?.bookTitle} bookSlug={pageContext?.bookSlug} pathname={pathname}>
        {element}
      </BookLayout>
    )
  }

  return <Layout>{element}</Layout>
}
