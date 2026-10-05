# 프로젝트 가이드

## 에세이 작성 규칙

### 썸네일 이미지
- 각 에세이에는 `./assets/thumbnail.jpeg` 썸네일이 필요
- 썸네일은 Codex CLI로 생성한다. 직접 API를 호출하지 말고 `packages/blog/scripts/generate-thumbnail.mjs`를 쓴다
  - 실행: `node packages/blog/scripts/generate-thumbnail.mjs --post packages/blog/content/posts/{폴더} --prompt "<프롬프트>"`
  - 스크립트가 `codex exec` 별도 세션에서 내장 `image_gen`으로 생성하고, sharp로 center-crop 해서 1536x864 JPEG로 저장한다
  - Codex 미설치, 로그인 만료, 생성 실패 시(종료 코드 2): 프롬프트만 출력하고 수동 생성 안내 (폴백)
- 에세이 작성 시 반드시 이미지 생성 프롬프트를 함께 작성할 것
- 프롬프트 공통 스타일: `Minimalist editorial illustration, muted warm tones, soft grain texture, no text, 16:9 aspect ratio, blog thumbnail style`
- 이미지 사양: 1536x864 (HD, 16:9), JPEG 형식

### 파일 구조
- 경로: `packages/blog/content/posts/{에세이-제목}/index.md`
- 각 에세이 폴더에 `assets/` 디렉토리 포함
- Frontmatter: title, image, tags, date, draft 필수

### 태그
- 사용 가능한 태그: 에세이, 작문, 기술, 성장, 조직, 스타트업, 회고, 리뷰, 리포트
  - 에세이: 필자 본인의 경험과 생각을 쓰는 글
  - 작문: 가상의 화자와 장면으로 쓰는 창작 산문 (단편, 콩트 등). 작문 글에는 에세이 태그를 함께 달지 않는다
- 허용 태그 목록은 이 절에만 둔다. 스킬과 에이전트 문서는 목록을 복사하지 말고 이 절을 참조한다

### 콘텐츠 스타일
- 섹션 제목: `##` 사용 (H2 기준. 예전 포스트의 `###`는 Markdown 렌더러가 자동으로 H2로 승격하므로 신규 글부터 `##` 사용)
- 본문 첫 줄: `![제목](./assets/thumbnail.jpeg)`
- 톤: 철학적 + 실용적, 메타포 활용
- 제목, 설명, 이미지 대체 텍스트, 본문, UI 문구에 U+2014와 U+2013 문자를 쓰지 않는다. 삽입구는 괄호나 쉼표로, 문장 경계는 콜론이나 문장 분리로 바꾼다. 숫자 범위는 `~`로 표기한다. URL, 파일명, 코드 식별자의 ASCII 하이픈은 유지한다.
