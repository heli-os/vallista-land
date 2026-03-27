# Vallista Land

테오(Theo)의 기술 블로그 및 디자인 시스템 모노레포

https://dataportal.kr

## 기술 스택

- React 18, TypeScript 5, Gatsby 5
- Emotion 11 (CSS-in-JS)
- Yarn Workspaces (모노레포)
- GitHub Actions (CI/CD), GitHub Pages (배포)

## 프로젝트 구조

```
packages/
├── core/          # @heli-os/vallista-core - 디자인 시스템 컴포넌트 라이브러리
├── blog/          # @vallista-land/blog - Gatsby 블로그 (localhost:8000)
└── playground/    # @vallista-land/playground - 컴포넌트 테스트 환경 (localhost:3000)
```

- **core**: blog와 playground에서 공유하는 React 컴포넌트 라이브러리
- **blog**: 마크다운 기반 기술 블로그
- **playground**: core 컴포넌트를 독립적으로 테스트하는 환경

## 시작하기

### 사전 요구 사항

- Node.js 20.10.0 (`.tool-versions` 참고)
- Yarn 1.x

### 설치

```shell
yarn
```

### 실행

**블로그 개발**

```shell
yarn run:blog
```

http://localhost:8000 에서 확인

**코어 + 블로그 동시 개발** (터미널 2개 필요)

```shell
# 터미널 1: 코어 라이브러리 watch 모드
yarn run:core

# 터미널 2: 블로그 개발 서버
yarn run:blog
```

**플레이그라운드**

```shell
yarn run:playground
```

http://localhost:3000 에서 확인

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `yarn run:blog` | 블로그 개발 서버 실행 (:8000) |
| `yarn run:core` | 코어 라이브러리 watch 모드 |
| `yarn run:playground` | 플레이그라운드 실행 (:3000) |
| `yarn build:core` | 코어 라이브러리 빌드 |
| `yarn build:blog` | 블로그 프로덕션 빌드 |
| `yarn deploy:blog` | 블로그 배포 (GitHub Pages) |
| `yarn post:blog` | 새 블로그 포스트 생성 |
| `yarn clean:blog` | 블로그 캐시 정리 |
| `yarn clean:core` | 코어 캐시 정리 |
| `yarn clean:playground` | 플레이그라운드 캐시 정리 |

## 블로그 포스트 작성

### 포스트 생성

```shell
yarn post:blog "포스트 제목" "태그1,태그2"
```

다음 구조가 생성됩니다:

```
packages/blog/content/posts/포스트-제목/
├── index.md      # 마크다운 본문
└── assets/       # 이미지 등 에셋
```

### Frontmatter

```yaml
---
title: "포스트 제목"
image: ./assets/1.jpeg
tags:
  - 태그1
  - 태그2
date: 2026-03-28 12:00:00
draft: true
---
```

`draft: true`를 `false`로 변경하면 공개됩니다.

## 배포

### 로컬 배포

```shell
yarn deploy:blog
```

`gh-pages`를 통해 GitHub Pages에 배포됩니다.

### CI/CD

`main` 브랜치에 push 시 GitHub Actions가 자동으로 빌드 및 배포를 수행합니다.

## 개발 가이드

### 모듈 추가

```shell
# 전역 모듈 (루트에 설치)
yarn add {모듈명} -W

# 특정 패키지에 설치
yarn workspace {패키지명} add {모듈명}
```

### 코어 컴포넌트 개발

1. `packages/core/src/components/`에 컴포넌트 작성
2. `packages/core/src/components/index.ts`에 export 등록
3. `yarn build:core`로 빌드
4. blog 또는 playground에서 사용 확인

## 트러블슈팅

### 빌드 실패 시

```shell
yarn clean:blog
yarn build:core
yarn build:blog
```

### 의존성 문제 시

```shell
rm -rf node_modules packages/*/node_modules
yarn
```

### 코어 변경이 반영 안 될 때

`yarn build:core` 실행 후 blog/playground 개발 서버를 재시작합니다.
