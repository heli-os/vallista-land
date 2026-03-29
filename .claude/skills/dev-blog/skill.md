---
name: dev-blog
description: "Gatsby 5 블로그의 페이지, 컴포넌트, 템플릿, GraphQL 쿼리, 플러그인 설정을 수정한다. 프로젝트의 Gatsby 5 + React 18 + Emotion + TypeScript 아키텍처에 특화. '블로그 기능', '페이지 추가', '컴포넌트 수정', 'GraphQL 쿼리', 'SEO 개선', 'RSS 수정', '사이드바 변경', '레이아웃 변경', '마크다운 렌더링' 등 블로그 코드 수정이 필요할 때 사용. 에세이 콘텐츠 작성이 아닌, 블로그 애플리케이션 코드 개발에 사용."
---

# 블로그 기능 개발 스킬

Gatsby 5 블로그 애플리케이션의 코드를 수정하는 스킬. 페이지, 컴포넌트, 템플릿, GraphQL 쿼리, 플러그인 설정 등 블로그 기능 개발에 필요한 프로젝트 지식을 제공한다.

## 프로젝트 구조 맵

```
packages/blog/
├── config/
│   ├── profile.json         # 블로그 메타데이터 (이름, 소개, 소셜 링크)
│   └── navbar.ts            # NavBar 카테고리 설정
├── content/posts/            # 85개 마크다운 포스트
├── gatsby-config.js          # 플러그인 체인, siteMetadata
├── gatsby-node.js            # createPages, onCreateNode
├── gatsby-browser.js         # ThemeProvider 래핑, AdSense
├── gatsby-ssr.js             # SSR용 ThemeProvider
├── scripts/
│   ├── create-post-file.js   # 포스트 생성 (레거시)
│   └── deploy.js             # gh-pages 배포
├── src/
│   ├── components/
│   │   ├── AdSense/          # Google AdSense 컴포넌트
│   │   ├── Comment/          # Disqus 댓글
│   │   ├── Footer/           # 페이지 하단
│   │   ├── Header/           # 상단 헤더 (Sidebar 토글)
│   │   ├── Layout/           # 전체 레이아웃 (핵심)
│   │   ├── ListTable/        # 글 목록 테이블
│   │   ├── Markdown/         # 마크다운 렌더링 + 스타일 (550줄)
│   │   ├── NavBar/           # 좌측 네비게이션
│   │   ├── PostHeader/       # 포스트 메타 (제목, 날짜, 태그, 읽기시간)
│   │   ├── Seo/              # SEO 메타태그 + JSON-LD
│   │   ├── Series/           # 시리즈 글 목록
│   │   └── Sidebar/          # 우측 글 목록 + 검색
│   ├── hooks/
│   │   └── useConfig.ts      # profile.json 로드
│   ├── pages/
│   │   ├── index.tsx          # 홈 (최근 5개 글)
│   │   ├── posts.tsx          # 전체 글 목록 + 검색
│   │   ├── resume.tsx         # 이력서
│   │   └── 404.tsx            # 404 페이지
│   ├── template/
│   │   ├── post.tsx           # 개별 포스트 (가장 중요한 템플릿)
│   │   └── tag.tsx            # 태그별 글 목록
│   ├── types/
│   │   ├── type.ts            # GraphQL 결과 타입 정의
│   │   └── type.d.ts          # 글로벌 타입
│   └── utils/
│       ├── index.ts           # toDate, getTime, filteredByDraft
│       ├── theme.ts           # isDarkMode, onChangeThemeEvent
│       ├── storage.ts         # localStorage 래퍼
│       └── throttle.ts        # throttle 유틸
└── static/                    # 파비콘, OG 이미지
```

## 핵심 패턴

### GraphQL 쿼리

**페이지 쿼리** (pages/, template/):
```typescript
export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      nodes {
        fields { slug }
        frontmatter { title, date, image { publicURL }, tags }
      }
    }
  }
`
```

**포스트 쿼리** (template/post.tsx):
```typescript
query BlogPostBySlug($id: String!) {
  markdownRemark(id: { eq: $id }) {
    html
    excerpt(pruneLength: 160)
    timeToRead
    fields { slug, lastModified }
    frontmatter { title, date, image { publicURL }, tags, series, description }
  }
}
```

### 페이지 컴포넌트 패턴

```typescript
const Page: FC<PageProps<QueryType>> = ({ data }) => {
  // data에서 GraphQL 결과 추출
  // Layout 컴포넌트로 감싸서 반환
}

export default Page

export const Head = ({ location }: HeadProps) => (
  <Seo name="제목" url={location.href} />
)

export const pageQuery = graphql`...`
```

### gatsby-node.js 페이지 생성

```javascript
// createPages에서 포스트 페이지 동적 생성
const result = await graphql(`query { allMarkdownRemark { nodes { id, fields { slug } } } }`)
result.data.allMarkdownRemark.nodes.forEach(node => {
  createPage({
    path: node.fields.slug,
    component: path.resolve('./src/template/post.tsx'),
    context: { id: node.id }
  })
})
```

### Emotion 스타일링 패턴

```typescript
import styled from '@emotion/styled'
import { css } from '@emotion/react'

const StyledDiv = styled.div`
  color: ${({ theme }) => theme.colors.PRIMARY.FOREGROUND};
  ${({ active }) => active && css`opacity: 1;`}
`
```

## 코어 라이브러리 연동

블로그에서 `@heli-os/vallista-core`의 컴포넌트를 import하여 사용:
```typescript
import { Container, Text, Button, Spacer, SearchInput } from '@heli-os/vallista-core'
```

core 변경 시 반드시 `yarn build:core` 후 blog 작업을 진행한다. 이유: blog는 core의 빌드 산출물(lib/)을 참조하므로, core 소스 변경만으로는 blog에 반영되지 않음.

## 명령어

| 작업 | 명령어 |
|------|--------|
| 개발 서버 | `yarn run:blog` (port 8000) |
| 빌드 | `yarn build:blog` |
| 캐시 초기화 | `cd packages/blog && npx gatsby clean` |
| 코어 빌드 (선행) | `yarn build:core` |
