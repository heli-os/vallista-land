import { useEffect, useState } from 'react'

import { localStorage } from '../utils'

interface UseTextSizeReturn {
  textSize: number
  changeTextSize: (size: number) => void
}

export const useTextSize = (): UseTextSizeReturn => {
  const [textSize, setTextSize] = useState(() => {
    let localTextSize = localStorage.get('text-size')

    if (!localTextSize) {
      localStorage.set('text-size', '16')
      localTextSize = '16'
    }

    return parseInt(localTextSize, 10) || 16
  })

  useEffect(() => {
    if (!document?.body?.parentElement) return
    if (textSize === 16) {
      const { fontSize, ...otherProps } = document.body.parentElement.style
      ;(document.body.parentElement as any).style = otherProps
      return
    }

    document.body.parentElement.style.fontSize = `${textSize}px`
  }, [textSize])

  function changeTextSize(size: number): void {
    localStorage.set('text-size', size.toString())
    setTextSize(size)
  }

  return { textSize, changeTextSize }
}
