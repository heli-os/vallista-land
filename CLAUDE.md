# 프로젝트 가이드

## 에세이 작성 규칙

### 썸네일 이미지
- 각 에세이에는 `./assets/thumbnail.jpeg` 썸네일이 필요
- 썸네일은 Google AI Studio Gemini API(`GEMINI_API_KEY` 환경변수)로 자동 생성
  - 모델: `imagen-4.0-generate-001` (aspectRatio: 16:9 지원)
  - API 키 미설정 또는 호출 실패 시: 프롬프트만 출력하고 수동 생성 안내 (폴백)
- 에세이 작성 시 반드시 이미지 생성 프롬프트를 함께 작성할 것
- 프롬프트 공통 스타일: `Minimalist editorial illustration, muted warm tones, soft grain texture, no text, 16:9 aspect ratio, blog thumbnail style`
- 이미지 사양: 1536x864 (HD, 16:9), JPEG 형식

### 파일 구조
- 경로: `packages/blog/content/posts/{에세이-제목}/index.md`
- 각 에세이 폴더에 `assets/` 디렉토리 포함
- Frontmatter: title, image, tags, date, draft 필수

### 태그
- 사용 가능한 태그: 에세이, 기술, 성장, 조직, 스타트업, 회고, 리뷰

### 콘텐츠 스타일
- 섹션 제목: `###` 사용
- 본문 첫 줄: `![제목](./assets/thumbnail.jpeg)`
- 톤: 철학적 + 실용적, 메타포 활용
