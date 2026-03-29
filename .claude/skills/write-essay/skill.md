---
name: write-essay
description: "블로그 에세이를 CLAUDE.md 규칙에 맞춰 생성한다. 제목과 주제를 받아 frontmatter, 본문 구조, 썸네일 이미지 생성 프롬프트를 포함한 완성된 마크다운 포스트를 생성. '에세이 써줘', '글 작성해줘', '포스트 만들어줘', '블로그 글', '새 글' 등의 요청이 들어오면 반드시 이 스킬을 사용할 것. 단순히 마크다운 파일을 읽거나 수정하는 것이 아닌, 새로운 에세이를 처음부터 생성할 때 사용."
---

# 에세이 작성 스킬

블로그 에세이를 프로젝트 규칙에 맞춰 생성하는 스킬. 이 스킬은 CLAUDE.md의 에세이 작성 규칙을 내재화하여, 매번 규칙을 확인하지 않아도 올바른 포스트를 생성한다.

## 입력 파라미터

| 파라미터 | 필수 | 기본값 | 설명 |
|----------|------|--------|------|
| title | O | - | 에세이 제목 |
| tags | X | ["에세이"] | 태그 목록 |
| topic | X | - | 주제 설명, 키워드, 또는 글의 방향성 |
| series | X | - | 시리즈명 |
| draft | X | true | 초안 여부 |

## 실행 절차

### 1단계: 입력 검증

1. 제목이 비어있으면 사용자에게 요청
2. 태그가 허용 목록에 있는지 확인
   - 허용: 에세이, 기술, 성장, 조직, 스타트업, 회고, 리뷰
   - 불허 태그 입력 시 → 가장 유사한 허용 태그 제안
3. 시리즈가 지정되었으면 기존 시리즈 목록과 대조
   - 기존: "좌뇌의 소설", "생각이 세계가 되는 순간들", "레딧에서는 무슨 이야기를 나눌까?", "볼타 이야기", "Vallista-land", "JPA", "장인 정신"
   - 새 시리즈면 사용자에게 확인

### 2단계: 폴더 생성

1. 제목을 kebab-case로 변환 (공백 → 하이픈, 특수문자 제거)
2. 기존 폴더와 중복 확인:
   ```
   ls packages/blog/content/posts/ | grep -i "{폴더명}"
   ```
3. 디렉토리 생성:
   ```
   mkdir -p packages/blog/content/posts/{폴더명}/assets
   ```

### 3단계: Frontmatter 생성

```yaml
---
title: "{제목}"
description: "{에세이 내용을 1~2문장으로 요약. SEO에 최적화된 명확한 설명}"
image: ./assets/thumbnail.jpeg
tags:
  - {태그1}
  - {태그2}
series: "{시리즈명}"
date: {YYYY-MM-DD HH:mm:ss 형식의 현재 시각}
draft: {true|false}
---
```

- `series` 필드는 시리즈에 속할 때만 포함
- `date`는 `date '+%Y-%m-%d %H:%M:%S'` 명령으로 현재 시각 획득
- `description`은 에세이 본문을 작성한 후 내용에 맞게 작성

### 4단계: 본문 작성

**구조**:
```markdown
![제목](./assets/thumbnail.jpeg)

{도입부: 주제에 대한 문제 제기 또는 경험 서술. 독자의 관심을 끄는 질문이나 메타포로 시작}

### {섹션 1 제목}

{본론 전개. 구체적 사례, 분석, 또는 통찰}

### {섹션 2 제목}

{심화 전개. 다른 각도의 분석 또는 실용적 적용}

### {섹션 3 제목} (선택)

{추가 전개. 필요한 경우에만}

### {마무리 제목}

{결론. 핵심 메시지 요약 + 독자에게 남기는 여운. 열린 질문이나 행동 촉구}
```

**톤 가이드라인**:
- 철학적 사유와 실용적 통찰의 균형
- 일상의 경험에서 보편적 원리를 끌어내는 메타포 활용
- 단정적 주장보다 탐구적 서술 ("~이다"보다 "~가 아닐까")
- 독자와 함께 생각하는 느낌의 서술

### 5단계: 썸네일 이미지 프롬프트 생성

에세이 주제를 반영한 시각적 메타포를 공통 스타일에 추가:

```
Minimalist editorial illustration, muted warm tones, soft grain texture, no text, 16:9 aspect ratio, blog thumbnail style, {에세이 주제를 시각화하는 구체적 묘사}
```

**예시**:
- 주제: 기술 부채 → `...a person carefully stacking wooden blocks on an unstable tower, with cracks forming at the base`
- 주제: 리더십 → `...a lighthouse beam cutting through dense fog over a calm sea at dusk`

### 6단계: 결과 보고

사용자에게 다음을 출력:
1. 생성된 파일 경로
2. frontmatter 요약 (제목, 태그, 시리즈, draft 상태)
3. 본문 섹션 구조
4. 썸네일 이미지 생성 프롬프트 (복사 가능한 형태)
5. "thumbnail.jpeg 이미지를 생성하여 assets/ 폴더에 넣어주세요" 안내

## 주의사항

- 이미지 경로는 반드시 `./assets/thumbnail.jpeg`. 레거시 `1.jpeg` 패턴 사용 금지. 이유: CLAUDE.md에서 `thumbnail.jpeg`를 명시적으로 규정했으며, 기존 스크립트(create-post-file.js)의 `1.jpeg`는 구버전 규칙
- 본문에서 `#`(h1)이나 `##`(h2)를 섹션 제목으로 사용하지 않는다. `###`(h3)만 사용. 이유: Gatsby 템플릿에서 포스트 제목이 h1으로 렌더링되므로 본문 섹션은 h3부터 시작해야 계층 구조가 올바름
- draft 기본값은 true. 사용자가 명시적으로 발행을 요청하지 않는 한 draft: true로 생성
