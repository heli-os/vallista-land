---
name: vallista-orchestrator
description: "2개 이상의 스킬이 연쇄적으로 필요한 복합 작업을 오케스트레이션한다. 예: '에세이 쓰고 리뷰까지 해줘', '코어에 컴포넌트 추가하고 블로그에 적용해줘', 'draft 글 전부 리뷰하고 발행해줘'. 단일 스킬로 해결 가능한 명확한 요청(에세이만 쓰기, 태그만 변경, 리뷰만)에는 사용하지 않음 — 해당 개별 스킬을 직접 사용할 것. 어떤 스킬을 써야 할지 불명확한 모호한 요청에서도 이 스킬이 라우팅을 담당."
---

# Vallista 오케스트레이터

Vallista Land 프로젝트의 모든 작업을 라우팅하고 오케스트레이션하는 스킬. 사용자 요청을 분석하여 적절한 에이전트를 서브 에이전트로 호출한다.

## 실행 모드: 서브 에이전트

에이전트 간 직접 통신이 불필요한 구조. 오케스트레이터가 Agent 도구로 서브 에이전트를 호출하고 결과를 받아 다음 단계로 전달한다.

## 작업 라우팅

사용자 요청을 다음 기준으로 분류하여 적절한 에이전트+스킬 조합을 선택한다:

| 요청 유형 | 키워드/의도 | 에이전트 | 스킬 |
|----------|-----------|---------|------|
| 에세이 작성 | 글 써줘, 에세이, 포스트 작성, 새 글 | essay-writer | write-essay |
| 리포트 작성 | 리포트, 세션 요약, 세션 정리, 팅껨, 다이제스트, 팟캐스트 정리 | report-writer | write-report |
| 포스트 윤문 | 윤문, AI 티 빼줘, 휴머나이즈, 자연스럽게 다듬어줘 | content-reviewer | humanize-post |
| 포스트 리뷰 | 검토, 리뷰, 점검, 확인 | content-reviewer | review-post |
| 콘텐츠 관리 | 태그 변경, 발행, draft, 시리즈, 목록, 통계 | content-reviewer | manage-content |
| 블로그 개발 | 페이지, 컴포넌트, GraphQL, SEO, 레이아웃 | blog-developer | dev-blog |
| 코어 개발 | 디자인 시스템, 코어, 새 컴포넌트 | blog-developer | dev-core |
| 책 프로젝트 | 책 만들어줘, 블로그를 책으로, 출판, 원고, 챕터, 집필, 책 분석 | → book-orchestrator 스킬로 위임 | book-orchestrator |

## 복합 워크플로우

### 워크플로우 1: 에세이 작성 + 윤문 + 리뷰 (가장 빈번)

```
[오케스트레이터]
    ├── 1. Agent(essay-writer, model: "opus")
    │     → 에세이 생성, 파일 경로 반환
    │     → write-essay 6단계에서 humanize-post 자체검증·핀포인트 윤문 자동 수행
    ├── 2. Agent(content-reviewer, model: "opus")
    │     → 생성된 파일 검증, PASS/WARN/FAIL 리포트
    └── 3. 사용자에게 종합 보고
          - 생성된 파일 경로
          - humanize-post 윤문 결과 (S1 finding/수정/등급)
          - 리뷰 결과
          - 썸네일 이미지 상태 + 프롬프트
          - 수정 필요 사항 (있을 경우)
```

### 워크플로우 2: 리포트 작성 + 윤문 + 리뷰

```
[오케스트레이터]
    ├── 1. Agent(report-writer, model: "opus")
    │     → 리포트 생성, 파일 경로 반환
    │     → write-report 마지막 단계에서 humanize-post 자체검증·핀포인트 윤문 자동 수행
    ├── 2. Agent(content-reviewer, model: "opus")
    │     → 생성된 파일 검증, PASS/WARN/FAIL 리포트
    └── 3. 사용자에게 종합 보고
          - 생성된 파일 경로
          - humanize-post 윤문 결과 (S1 finding/수정/등급)
          - 리뷰 결과
          - 썸네일 이미지 상태 + 프롬프트
          - 수정 필요 사항 (있을 경우)
```

### 워크플로우 3: 단독 윤문 (이미 작성된 글)

```
[오케스트레이터]
    ├── 1. 대상 파일 결정 (사용자 인자 or 가장 최근 modified)
    ├── 2. Agent(content-reviewer, model: "opus", prompt: "humanize-post 스킬로 ...")
    │     → S1 패턴 검출 + 핀포인트 윤문 (S1 1~5건) 또는 정밀 윤문 권고 (S1 6건+)
    └── 3. 사용자에게 결과 보고 (등급, 변경률, diff 요약)
```

### 워크플로우 4: 기능 개발

```
[오케스트레이터]
    ├── 1. 영향 범위 분석 (core? blog? 둘 다?)
    ├── 2. core 변경 필요 시:
    │     Agent(blog-developer, model: "opus", prompt: "dev-core 스킬로 ...")
    ├── 3. blog 변경:
    │     Agent(blog-developer, model: "opus", prompt: "dev-blog 스킬로 ...")
    └── 4. 빌드 검증 (yarn build:core && yarn build:blog)
```

### 워크플로우 5: 콘텐츠 일괄 관리

```
[오케스트레이터]
    ├── 1. Agent(content-reviewer, model: "opus", prompt: "manage-content 스킬로 ...")
    │     → 대상 파일 목록 + 변경 계획
    ├── 2. 사용자 확인 (5개 이상 수정 시)
    └── 3. Agent(content-reviewer, model: "opus", prompt: "확인된 변경 실행")
```

## 에이전트 호출 패턴

서브 에이전트 호출 시 반드시 다음을 포함:

```
Agent(
  description: "작업 설명 (3~5단어)",
  prompt: "
    당신은 {에이전트명} 에이전트입니다.
    .claude/agents/{에이전트명}.md의 역할과 원칙을 따릅니다.
    .claude/skills/{스킬명}/skill.md를 읽고 절차를 따릅니다.

    작업: {구체적 작업 내용}
    입력: {필요한 데이터}

    프로젝트 루트는 이 저장소의 루트 디렉토리입니다.
  ",
  model: "opus"
)
```

**model: "opus" 필수**. 하네스의 품질은 에이전트의 추론 능력에 직결되며, opus가 최고 품질을 보장한다.

## 에러 핸들링

| 상황 | 대응 |
|------|------|
| 서브 에이전트 실패 | 1회 재시도. 재실패 시 에러 내용을 사용자에게 보고하고 수동 개입 요청 |
| 빌드 실패 | `gatsby clean` 후 재빌드. 재실패 시 에러 로그와 함께 사용자에게 보고 |
| 파일 충돌 | 기존 파일 덮어쓰지 않고 사용자에게 확인 |
| 요청 모호 | 작업 유형을 추정하여 사용자에게 확인. "에세이 작성을 원하시는 건가요?" |

## 프로젝트 규칙 (전역)

- 모든 출력은 한국어
- 커밋 메시지: 한국어, `[NONE-ISSUE] 제목` 형식
- develop/main 브랜치에 직접 머지 금지
- 에세이 작성 시 썸네일 이미지 자동 생성 (실패 시 프롬프트 필수 포함)

## 테스트 시나리오

### 정상 흐름: 에세이 작성 + 리뷰

**입력**: "기술 부채에 대한 에세이 써줘. 태그는 기술, 성장으로."

**기대 결과**:
1. essay-writer가 `packages/blog/content/posts/기술-부채에-대한-에세이/index.md` 생성
2. frontmatter에 title, description, image, tags(기술, 성장), date, draft:true 포함
3. 본문 첫줄 `![...](./assets/thumbnail.jpeg)`, 섹션 `###` 사용
4. content-reviewer가 리뷰하여 PASS 결과
5. 사용자에게 파일 경로 + 리뷰 결과 + 썸네일 프롬프트 보고

### 에러 흐름: 중복 폴더

**입력**: "하고 싶은 것의 부재라는 제목으로 에세이 써줘"

**기대 결과**:
1. essay-writer가 기존 폴더 `하고-싶은-것의-부재/` 감지
2. 사용자에게 중복 알림 + 대안 제안 (제목 변경 또는 기존 글 수정)
3. 사용자 선택에 따라 진행
