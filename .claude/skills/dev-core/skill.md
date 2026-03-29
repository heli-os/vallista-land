---
name: dev-core
description: "@heli-os/vallista-core 디자인 시스템 컴포넌트를 추가하거나 수정한다. Emotion 11 + React 18 + TypeScript 기반의 컴포넌트 라이브러리 개발에 특화. '컴포넌트 추가', '디자인 시스템', '코어 라이브러리', 'Button 수정', 'ThemeProvider 변경', '새 UI 컴포넌트' 등 core 패키지 작업이 필요할 때 사용. 블로그 페이지/템플릿 수정이 아닌, 공유 컴포넌트 라이브러리 개발에 사용."
---

# 코어 라이브러리 개발 스킬

@heli-os/vallista-core 디자인 시스템 컴포넌트를 추가/수정하는 스킬. Emotion styled + ThemeProvider 패턴을 따르는 컴포넌트 개발에 필요한 프로젝트 지식을 제공한다.

## 프로젝트 구조

```
packages/core/
├── src/
│   ├── components/
│   │   ├── index.ts              # 모든 컴포넌트 re-export
│   │   ├── Badge/
│   │   ├── Button/               # 레퍼런스 패턴
│   │   ├── Capacity/
│   │   ├── Checkbox/
│   │   ├── Collapse/
│   │   ├── Container/
│   │   ├── Icon/
│   │   ├── Image/
│   │   ├── Input/
│   │   ├── LoadingDots/
│   │   ├── Modal/
│   │   ├── Note/
│   │   ├── Progress/
│   │   ├── Radio/
│   │   ├── SearchInput/
│   │   ├── Select/
│   │   ├── ShowMore/
│   │   ├── Snippet/
│   │   ├── Spacer/
│   │   ├── Spinner/
│   │   ├── Switch/
│   │   ├── Tabs/
│   │   ├── Tag/
│   │   ├── Tags/
│   │   ├── Text/
│   │   ├── ThemeProvider/        # 테마 관리 (LIGHT/DARK)
│   │   ├── Toast/
│   │   ├── Toggle/
│   │   ├── Tooltip/
│   │   └── Video/
│   ├── hooks/
│   │   ├── useControlledState.ts
│   │   ├── useDebounce.ts
│   │   ├── useMount.ts
│   │   ├── useRect.ts
│   │   ├── useUniqueId.ts
│   │   └── useWindowSize.ts
│   ├── constants/
│   ├── utils/clipboard/
│   ├── index.ts                  # export * from components + utils
│   └── types.ts                  # Emotion 테마 타입 확장
├── lib/                          # tsc 빌드 산출물
├── babel.config.js               # @emotion/babel-plugin
├── tsconfig.json                 # target: es5, module: esnext
└── package.json
```

## 컴포넌트 추가 절차

Button 패턴을 레퍼런스로 따른다:

### 1단계: 디렉토리 생성

```
packages/core/src/components/{ComponentName}/
```

### 2단계: 타입 정의 (`type.ts`)

```typescript
export interface {ComponentName}Props {
  // 필수 props
  children?: React.ReactNode
  // 컴포넌트 고유 props
}
```

### 3단계: 로직 훅 (`use{ComponentName}.ts`) — 선택

상태 관리나 이벤트 핸들링이 필요한 경우에만 생성:
```typescript
import { {ComponentName}Props } from './type'

export function use{ComponentName}(props: {ComponentName}Props) {
  // 로직 분리
  return { /* computed values, handlers */ }
}
```

### 4단계: 컴포넌트 구현 (`{ComponentName}.tsx`)

```typescript
import { FC } from 'react'
import styled from '@emotion/styled'
import { {ComponentName}Props } from './type'

export const {ComponentName}: FC<{ComponentName}Props> = (props) => {
  return <Styled{ComponentName}>{props.children}</Styled{ComponentName}>
}

const Styled{ComponentName} = styled.div`
  color: ${({ theme }) => theme.colors.PRIMARY.FOREGROUND};
`
```

### 5단계: Re-export (`index.tsx`)

```typescript
export { {ComponentName} } from './{ComponentName}'
export type { {ComponentName}Props } from './type'
```

### 6단계: 전역 export 등록

`packages/core/src/components/index.ts`에 추가:
```typescript
export * from './{ComponentName}'
```

### 7단계: 빌드 확인

```bash
yarn build:core
```

## 테마 구조

ThemeProvider가 제공하는 테마 객체:

```typescript
theme.colors.PRIMARY.ACCENT_1~8   // 밝기 순서 (DARK 모드에서 반전)
theme.colors.PRIMARY.BACKGROUND
theme.colors.PRIMARY.FOREGROUND
theme.colors.HIGHLIGHT.ORANGE / PINK / ...
theme.shadows[0~2]                 // 박스 그림자
theme.layers                       // z-index 레이어
```

LIGHT/DARK 모드 전환 시 ACCENT 순서가 반전된다. 컴포넌트 내에서 하드코딩된 색상값을 사용하지 않고 반드시 theme 객체를 참조한다.

## 명령어

| 작업 | 명령어 |
|------|--------|
| 빌드 | `yarn build:core` (rm -rf lib && tsc) |
| 워치 모드 | `yarn run:core` (tsc --watch) |

## 주의사항

- peerDependencies: @emotion/react, @emotion/styled, react, react-dom. 이 패키지들은 core에 번들하지 않고 사용처(blog, playground)에서 제공
- core 변경 후 blog에서 사용하려면 반드시 `yarn build:core` 실행. 이유: blog는 core의 lib/ (빌드 산출물)을 참조
- 인라인 스타일 사용 금지. 모든 스타일은 Emotion styled 또는 css prop으로 적용
