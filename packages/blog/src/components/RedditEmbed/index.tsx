import { FC, forwardRef } from 'react'
import { RedditEmbedProps } from './type'
import React from 'react'

export const RedditEmbed: FC<RedditEmbedProps> = forwardRef<HTMLIFrameElement, RedditEmbedProps>(
  ({ url, height, ...props }) => {
    React.useEffect(() => {
      // Reddit 위젯 스크립트 동적 로드
      const script = document.createElement('script')
      script.src = 'https://embed.reddit.com/widgets.js'
      script.async = true
      script.charset = 'UTF-8'
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }, [])
    return (
      <blockquote
        className='reddit-embed-bq'
        data-embed-height={height || '316'}
        style={{ height: `${height || 316}px` }}
      >
        <a href={url}>{url}</a>
      </blockquote>
    )
  }
)
