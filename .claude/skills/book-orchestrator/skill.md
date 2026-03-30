---
name: book-orchestrator
description: "블로그 포스트를 책으로 변환하는 전체 워크플로우를 오케스트레이션한다. 분석→구조 설계→집필→편집의 4단계 파이프라인을 관리하고, 각 단계에서 적절한 에이전트를 호출하여 결과를 연결. '책 만들어줘', '블로그를 책으로', '출판 프로젝트', '원고 프로젝트', '책 쓰기 시작', '책 작업 이어서' 등의 요청 시 반드시 이 스킬을 사용. 이 스킬은 다른 책 관련 스킬(analyze-blog-content, design-book-structure, write-chapter, edit-book)을 직접 실행하지 않고, 해당 에이전트들을 통해 실행한다. 블로그 에세이 작성은 write-essay, 포스트 리뷰는 review-post를 사용할 것."
---

# 책 오케스트레이터

블로그 포스트를 책으로 변환하는 4-Phase 파이프라인을 관리하는 오케스트레이터 스킬.

## 실행 모드: 서브 에이전트

에이전트 간 직접 통신이 불필요한 순차 파이프라인. 오케스트레이터가 Agent 도구로 서브 에이전트를 호출하고, 결과를 파일로 전달한다. Phase 3에서 챕터별 병렬 실행은 `run_in_background=true`로 처리.

## Workspace 초기화

첫 실행 시 다음 디렉토리 구조를 생성한다:

```bash
mkdir -p _workspace/book/analysis
mkdir -p _workspace/book/blueprint/chapter-specs
mkdir -p _workspace/book/chapters
```

프로젝트 상태 파일도 생성한다:

```markdown
# 책 프로젝트 상태
## 현재 Phase: 1
## 선택된 후보: 미선택
## 챕터 진행: -
## 편집 라운드: 0
## 사용자 대기 사항: Phase 1 분석 진행 중
```

파일명: `_workspace/book/project-status.md`

## Phase 1: 콘텐츠 분석

### 에이전트 호출

```
Agent(
  description: "블로그 포스트 전량 분석",
  prompt: "
    당신은 content-analyst 에이전트입니다.
    .claude/agents/content-analyst.md의 역할과 원칙을 따릅니다.
    .claude/skills/analyze-blog-content/skill.md를 읽고 절차를 따릅니다.

    작업: 블로그 전체 포스트를 분석하여 책 후보를 제안하라
    포스트 경로: packages/blog/content/posts/

    프로젝트 루트는 이 저장소의 루트 디렉토리입니다.
  ",
  model: "opus"
)
```

### 완료 후 처리

1. `_workspace/book/analysis/book-candidates.md`에서 후보 목록 읽기
2. 사용자에게 후보 목록을 요약하여 제시 (제목, 대상 독자, 총점, 강점/약점)
3. `project-status.md` 업데이트: Phase 1 완료, 사용자 선택 대기

### 사용자 선택 수신

사용자가 후보 번호를 선택하면 Phase 2로 전환. 추가 방향성 지시가 있으면 함께 기록.

## Phase 2: 책 구조 설계

### 에이전트 호출

```
Agent(
  description: "책 구조 및 서사 아크 설계",
  prompt: "
    당신은 book-architect 에이전트입니다.
    .claude/agents/book-architect.md의 역할과 원칙을 따릅니다.
    .claude/skills/design-book-structure/skill.md를 읽고 절차를 따릅니다.

    작업: 선택된 책 후보의 챕터 구조와 서사 아크를 설계하라
    입력:
    - candidate_id: {사용자가 선택한 번호}
    - analysis_path: _workspace/book/analysis/book-candidates.md
    - user_direction: {사용자 추가 방향성, 없으면 생략}

    프로젝트 루트는 이 저장소의 루트 디렉토리입니다.
  ",
  model: "opus"
)
```

### 완료 후 처리

1. `_workspace/book/blueprint/book-blueprint.md` 요약을 사용자에게 제시
   - 책 제목, 부제, 대상 독자
   - 서사 아크 3막 요약
   - 챕터 목록 (제목 + 핵심 논지)
   - 예상 총 분량
2. 사용자 승인/수정 요청 대기
3. `project-status.md` 업데이트

수정 요청 시: `user_direction`에 피드백을 담아 book-architect를 재호출 (기존 blueprint를 `book-blueprint-v{N}.md`로 백업).

## Phase 3: 챕터 집필

### 챕터 목록 파악

`book-blueprint.md`에서 챕터 목록과 번호를 추출한다.

### 본문 챕터 병렬 집필

서론(프롤로그)과 결론(에필로그)을 제외한 본문 챕터를 병렬로 실행한다:

```
# 챕터별로 반복
Agent(
  description: "챕터 {NN} 집필",
  prompt: "
    당신은 chapter-writer 에이전트입니다.
    .claude/agents/chapter-writer.md의 역할과 원칙을 따릅니다.
    .claude/skills/write-chapter/skill.md를 읽고 절차를 따릅니다.

    작업: 챕터 {NN}을 집필하라
    입력:
    - chapter_number: {NN}
    - spec_path: _workspace/book/blueprint/chapter-specs/ch-{NN}-spec.md
    - blueprint_path: _workspace/book/blueprint/book-blueprint.md

    프로젝트 루트는 이 저장소의 루트 디렉토리입니다.
  ",
  model: "opus",
  run_in_background: true
)
```

### 서론/결론 순차 작성

본문 챕터가 모두 완료된 후, 프롤로그와 에필로그를 순차 작성한다:
1. 프롤로그: `ch-00-prologue-spec.md` 기반, 본문 챕터 내용을 참고
2. 에필로그: `ch-{NN}-epilogue-spec.md` 기반, 전체 내용을 참고

### 완료 후 처리

1. 모든 챕터 파일이 `_workspace/book/chapters/`에 있는지 확인
2. `project-status.md` 업데이트: 챕터별 완료 상태
3. Phase 4로 자동 전환

## Phase 4: 편집

### 에이전트 호출

```
Agent(
  description: "전체 원고 편집",
  prompt: "
    당신은 book-editor 에이전트입니다.
    .claude/agents/book-editor.md의 역할과 원칙을 따릅니다.
    .claude/skills/edit-book/skill.md를 읽고 절차를 따릅니다.

    작업: 전체 원고를 4축 편집하라
    입력:
    - chapters_dir: _workspace/book/chapters/
    - blueprint_path: _workspace/book/blueprint/book-blueprint.md

    프로젝트 루트는 이 저장소의 루트 디렉토리입니다.
  ",
  model: "opus"
)
```

### MAJOR 반려 루프

`edit-report.md`를 읽어 MAJOR 판정 챕터가 있는지 확인한다.

MAJOR 챕터가 있으면:

```
Agent(
  description: "챕터 {NN} 재작성",
  prompt: "
    당신은 chapter-writer 에이전트입니다.
    .claude/agents/chapter-writer.md의 역할과 원칙을 따릅니다.
    .claude/skills/write-chapter/skill.md를 읽고 절차를 따릅니다.

    작업: 편집자 피드백을 반영하여 챕터 {NN}을 재작성하라
    입력:
    - chapter_number: {NN}
    - spec_path: _workspace/book/blueprint/chapter-specs/ch-{NN}-spec.md
    - blueprint_path: _workspace/book/blueprint/book-blueprint.md
    - revision_feedback: {edit-report에서 추출한 반려 사유 + 수정 방향}

    프로젝트 루트는 이 저장소의 루트 디렉토리입니다.
  ",
  model: "opus"
)
```

재작성 완료 후 book-editor를 재호출하여 해당 챕터만 재검토:
- `target_chapters: [{NN}]`

**최대 2회 반복**. 3회째에도 MAJOR이면:
1. `project-status.md`에 "수동 개입 필요" 기록
2. 사용자에게 보고: 어떤 챕터가 어떤 이유로 반복 반려되었는지
3. 사용자 지시 대기

### 완료 후 처리

모든 챕터가 PASS/MINOR → `manuscript.md` 생성 확인

사용자에게 최종 보고:
- 책 제목, 총 챕터 수, 총 분량
- 편집 결과 요약 (PASS/MINOR/MAJOR 수)
- `manuscript.md` 경로
- 편집 리포트 경로

## 프로젝트 재개

사용자가 "이어서 해줘", "책 작업 계속" 등으로 요청하면:

1. `_workspace/book/project-status.md`를 읽어 현재 Phase 파악
2. 중단된 Phase부터 재개
3. 이미 완료된 산출물은 재활용

## 에러 핸들링

| 상황 | 대응 |
|------|------|
| Phase 1 후 사용자가 후보 변경 | Phase 2부터 재실행 (analysis 재사용) |
| Phase 2 후 구조 변경 요청 | book-architect 재호출 (기존 blueprint 백업) |
| Phase 3 writer 실패 | 해당 챕터만 1회 재시도. 재실패 시 사용자 보고 |
| Phase 4 MAJOR 3회 초과 | 사용자에게 보고, 수동 개입 요청 |
| 사용자가 책 주제 완전 변경 | `_workspace/book/` → `_workspace/book-v{N}/` 백업, Phase 1부터 재실행 |
| 중간에 세션 종료 | project-status.md로 상태 보존, 재개 시 활용 |
| 에이전트 호출 실패 | 1회 재시도. 재실패 시 에러 내용을 사용자에게 보고 |

## 기존 하네스와의 연동

`vallista-orchestrator`에서 책 관련 요청이 들어오면 이 스킬로 라우팅된다:
- 키워드: 책, 원고, 출판, 블로그를 책으로, book, manuscript, 챕터

이 스킬은 블로그 에세이/리뷰/개발 워크플로우와 완전히 독립된 `_workspace/book/` 경로를 사용한다.

## 테스트 시나리오

### 정상 흐름: 전체 파이프라인

**입력**: "블로그 글을 책으로 만들어줘"

**기대 결과**:
1. Phase 1: content-analyst가 88개 포스트를 분석, 3~5개 후보 제안
2. 사용자가 후보 1을 선택
3. Phase 2: book-architect가 10개 챕터 구조 설계
4. 사용자가 blueprint 승인
5. Phase 3: chapter-writer x 10이 병렬 집필 → 서론/결론 순차 작성
6. Phase 4: book-editor가 편집, MINOR 2개 직접 수정, manuscript.md 생성
7. 사용자에게 최종 보고

### 에러 흐름: MAJOR 반려 루프

**입력**: Phase 4에서 book-editor가 챕터 3을 MAJOR 판정

**기대 결과**:
1. edit-report.md에 챕터 3 반려 사유 + 수정 방향 기록
2. chapter-writer에게 챕터 3 재작성 요청 (revision_feedback 전달)
3. 재작성 완료 후 book-editor 재호출 (target_chapters: [3])
4. 재검토 후 MINOR로 판정 → 직접 수정 → manuscript.md 생성
