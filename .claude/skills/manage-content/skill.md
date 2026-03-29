---
name: manage-content
description: "기존 블로그 포스트의 메타데이터를 실제로 수정/변경한다. 태그 변경, draft 상태 토글(발행/비발행), 시리즈 할당/해제, description 추가/수정, 포스트 검색/통계 조회. '태그 바꿔줘', '발행해줘', 'draft 해제', '시리즈 변경', '포스트 목록', '글 검색', '통계' 등의 요청 시 사용. 검증만 하고 수정하지 않는 경우에는 review-post를 사용할 것. 새 에세이를 처음부터 생성하는 경우에는 write-essay를 사용할 것."
---

# 콘텐츠 관리 스킬

블로그 포스트의 frontmatter 메타데이터를 관리한다. 검색, 필터, 일괄 수정, 통계 조회 기능을 제공한다.

## 포스트 경로

모든 포스트: `packages/blog/content/posts/*/index.md`

## 기능별 절차

### 포스트 검색

**제목으로 검색**:
```bash
grep -rl "title:.*{검색어}" packages/blog/content/posts/*/index.md
```

**태그로 필터**:
```bash
grep -rl "- {태그}" packages/blog/content/posts/*/index.md
```

**시리즈로 필터**:
```bash
grep -rl "series:.*{시리즈명}" packages/blog/content/posts/*/index.md
```

**draft 상태로 필터**:
```bash
grep -rl "draft: true" packages/blog/content/posts/*/index.md
```

### 태그 변경

1. 대상 포스트 식별
2. 현재 태그 확인
3. 새 태그가 허용 목록에 있는지 검증
   - 허용: 에세이, 기술, 성장, 조직, 스타트업, 회고, 리뷰
4. frontmatter의 tags 섹션 수정
5. 변경 전/후 보고

### 발행 (draft 토글)

1. 대상 포스트의 draft 상태 확인
2. `draft: true` → `draft: false` 또는 반대로 변경
3. 발행(true→false) 시 review-post 검증을 권장
4. 변경 확인

### 시리즈 관리

**기존 시리즈 목록 조회**:
```bash
grep "^series:" packages/blog/content/posts/*/index.md | sed 's/.*series: //' | sort -u
```

**시리즈 할당**: frontmatter에 `series: "{시리즈명}"` 추가
**시리즈 해제**: frontmatter에서 series 행 제거

### description 관리

**누락된 description 찾기**:
frontmatter에 description 필드가 없는 포스트를 검색한다.

**description 추가/수정**: frontmatter의 description 필드를 추가하거나 수정한다. SEO에 적합한 1~2문장으로 작성.

### 포스트 통계

다음 정보를 집계하여 보고:
- 전체 포스트 수
- 발행/초안 비율
- 태그별 포스트 수
- 시리즈별 포스트 수
- 연도별 포스트 수

## 일괄 수정 안전 규칙

- 5개 이상 포스트를 수정할 때는 대상 목록을 먼저 사용자에게 보여주고 확인을 받는다. 이유: 의도하지 않은 대량 변경을 방지
- 수정 전 원본 frontmatter를 기록해두고, 수정 후 변경 내역을 보고한다
- tags 필드 수정 시 YAML 배열 형식을 유지한다 (인라인 `[a, b]` 형식이 아닌 `- a\n- b` 형식)
