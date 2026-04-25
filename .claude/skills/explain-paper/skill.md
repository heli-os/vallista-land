---
name: explain-paper
description: "논문을 해설하는 블로그 포스트를 생성한다. 번역본/요약본 파일 경로를 받아, 핵심 개념 해설 + 사례 분석 + 현재 시점의 재해석을 포함한 기술 리포트를 작성. '논문 해설', '논문 정리', '페이퍼 리뷰', '논문 읽기', '논문 블로그' 등의 요청 시 사용. write-essay(에세이 톤)나 write-report(세션 요약)와 다르게, 학술 논문을 개발자 독자를 위해 재구성하는 데 특화."
---

# 논문 해설 스킬

학술 논문을 블로그 포스트로 해설하는 스킬. 논문의 핵심 내용을 개발자 독자가 이해할 수 있도록 재구성하되, 논문이 쓰인 시점과 현재의 간극을 명확히 한다.

## 입력 파라미터

| 파라미터 | 필수 | 기본값 | 설명 |
|----------|------|--------|------|
| title | O | - | 포스트 제목 |
| paper_source | O | - | 논문 번역본/요약본 파일 경로 (또는 논문 정보를 직접 제공) |
| tags | X | ["기술", "리포트"] | 태그 목록 |
| series | X | - | 시리즈명 (예: "Agentic AI 논문 읽기") |
| draft | X | true | 초안 여부 |

## 실행 절차

### 1단계: 입력 검증 및 논문 읽기

1. 제목이 비어있으면 사용자에게 요청
2. 태그가 허용 목록에 있는지 확인
   - 허용: 에세이, 기술, 성장, 조직, 스타트업, 회고, 리뷰, 리포트
3. paper_source가 파일 경로이면 해당 파일을 읽어서 내용 획득
   - 같은 디렉토리에 summary 파일이 있으면 함께 참조
4. 논문의 기본 정보 추출: 제목, 저자, 소속, 출판 연도, arXiv ID 등
5. 논문 출판 시점과 현재 시점의 간격을 계산 → 시간적 맥락 작성에 활용

### 2단계: 폴더 생성

1. 제목을 kebab-case로 변환 (공백 → 하이픈, 특수문자 제거)
2. 기존 폴더와 중복 확인:
   ```bash
   ls packages/blog/content/posts/ | grep -i "{폴더명}"
   ```
3. 디렉토리 생성:
   ```bash
   mkdir -p packages/blog/content/posts/{폴더명}/assets
   ```

### 3단계: Frontmatter 생성

```yaml
---
title: "{제목}"
description: "{논문의 핵심 기여와 이 글에서 다루는 범위를 1~2문장으로 요약}"
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
- `description`은 본문 작성 후 내용에 맞게 작성

### 4단계: 본문 작성

**구조**:
```markdown
![제목](./assets/thumbnail.jpeg)

> **논문 정보**
>
> - **제목**: {원제}
> - **저자**: {저자} ({소속})
> - **출판**: {저널/학회명} ({출판년월})
> - **arXiv**: {arXiv ID} (있는 경우)

{도입부: 논문이 쓰인 시점의 맥락 설명. 당시 어떤 문제가 있었는지, 이 논문이 왜 필요했는지. 현재와의 시간적 거리를 명시. 이 글에서 다루는 범위 안내.}

### {배경/역사 섹션}

{논문이 다루는 분야의 배경 지식. 독자가 핵심 프레임워크를 이해하기 위한 선행 개념 설명.}

### {핵심 프레임워크/방법론 섹션 1}

{논문의 주요 기여를 해설. 표, 다이어그램, 코드 블록 등을 활용하여 구조적으로 설명.}

### {핵심 프레임워크/방법론 섹션 2} (필요 시)

{추가 기여나 세부 구조 해설.}

### {사례 분석/실험 결과 섹션}

{논문이 제시한 사례, 실험, 벤치마크 결과를 정리. 당시 기준의 성과임을 명시.}

### {현재 시점에서의 재해석 섹션}

{논문의 예측/제안 중 실현된 것, 여전히 열린 질문, 논문이 다루지 못한 발전을 분석. 이 섹션이 이 스킬의 핵심 차별점.}

### {마무리}

{논문의 의의와 한계를 균형 있게 정리. 시리즈의 다음 글 예고 (시리즈인 경우).}

---

*{시리즈 안내 문구}*
```

**톤 가이드라인**:
- 개념 설명은 비유와 메타포로 쉽게, 핵심 구조는 기술적으로 정확하게
- 논문을 요약·번역하는 것이 아니라 "해설"하는 톤. 원문 구조를 그대로 따르지 않고, 독자가 이해하기 쉬운 순서로 재구성
- 과거형/현재형 시제를 의식적으로 구분. 논문의 주장은 과거 시제("~했다", "~제안했다"), 여전히 유효한 원리는 현재 시제("~이다")

**용어 번역 규칙**:
- 영어 용어를 한국어로 옮길 때 최소 3가지 후보를 내부적으로 비교 평가한 뒤 채택
- 기술 분야에서 한국어로 정착된 표현이 있으면 그것을 우선 사용
- 영어 원문 병기는 첫 등장 시에만 `한국어(English)` 형식
- 번역투 문장("~하는 것이 가능합니다", "~에 의해 수행됩니다") 대신 능동적이고 간결한 한국어 문체
- `**한국어(English)**` 형태의 볼드 사용을 피한다. 영어 병기된 용어에 볼드를 걸면 일부 마크다운 렌더러에서 깨질 수 있다

**시간적 맥락 규칙**:
- 도입부에서 논문의 출판 시점을 반드시 명시
- 사례/실험 결과를 소개할 때 "당시 기준" 또는 "논문이 쓰인 시점에" 같은 시간 표지를 붙인다
- 마지막 섹션에서 논문의 예측을 현재 시점에서 검증한다 (실현된 것 / 아직 열린 것 / 예상과 다르게 전개된 것)
- "지금은 이렇다"가 아닌 "당시에는 이랬고, 지금은 이렇게 달라졌다"의 톤을 유지

### 5단계: 썸네일 이미지 생성

#### 5-1. 프롬프트 생성

논문 주제를 반영한 시각적 메타포를 공통 스타일에 추가:

```
Minimalist editorial illustration, muted warm tones, soft grain texture, no text no letters no words no labels, 16:9 aspect ratio, blog thumbnail style, {논문 주제를 시각화하는 구체적 묘사}
```

#### 5-2. Google AI Studio Imagen API로 이미지 자동 생성

환경변수 `GEMINI_API_KEY`가 설정되어 있으면 Imagen 4.0 API를 호출하여 썸네일을 자동 생성한다. 미설정이거나 실패 시 폴백(프롬프트만 출력)한다.

**실행 절차**:

1. API 키 확인:
```bash
if [ -z "$GEMINI_API_KEY" ]; then
  echo "GEMINI_API_KEY 미설정 — 폴백: 수동 생성 모드"
fi
```

2. API 호출 (키가 존재할 때만) — 우선순위: imagen-4.0 → gemini-2.5-flash-image 폴백:
```bash
# 1차 시도: imagen-4.0-generate-001
RESPONSE=$(curl -s -f "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict" \
  -H "x-goog-api-key: ${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{"prompt": "{5-1에서 생성한 전체 프롬프트}"}],
    "parameters": {"aspectRatio": "16:9", "sampleCount": 1}
  }' 2>/dev/null)

# imagen 실패 시 gemini-2.5-flash-image 폴백
if [ $? -ne 0 ] || echo "$RESPONSE" | grep -q '"error"'; then
  RESPONSE=$(curl -s \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"contents\": [{\"parts\": [{\"text\": \"{5-1에서 생성한 전체 프롬프트}\"}]}],
      \"generationConfig\": {\"responseModalities\": [\"IMAGE\"]}
    }")
fi
```

3. 응답에서 base64 이미지 추출 및 저장:
```bash
echo "$RESPONSE" | python3 -c "
import sys, json, base64
data = json.load(sys.stdin)
if 'predictions' in data:
    img = base64.b64decode(data['predictions'][0]['bytesBase64Encoded'])
else:
    for candidate in data.get('candidates', []):
        for part in candidate.get('content', {}).get('parts', []):
            if 'inlineData' in part:
                img = base64.b64decode(part['inlineData']['data'])
                break
with open('packages/blog/content/posts/{폴더명}/assets/thumbnail.jpeg', 'wb') as f:
    f.write(img)
print(f'Image saved: {len(img)} bytes')
"
```

4. **16:9 후처리 (필수)** — 비율이 16:9가 아니면 center-crop + 리사이즈:
```bash
python3 -c "
from PIL import Image
path = 'packages/blog/content/posts/{폴더명}/assets/thumbnail.jpeg'
img = Image.open(path)
w, h = img.size
target_ratio = 16 / 9
current_ratio = w / h
if abs(current_ratio - target_ratio) > 0.01:
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))
    img = img.resize((1536, 864), Image.LANCZOS)
    img.save(path, 'JPEG', quality=90)
    print(f'Resized to 1536x864 (16:9)')
else:
    print(f'Already 16:9: {w}x{h}')
"
```

5. 파일 검증 — 저장된 파일이 실제 이미지인지 확인:
```bash
file -b "packages/blog/content/posts/{폴더명}/assets/thumbnail.jpeg" | grep -qi "jpeg\|jpg\|png\|image"
```
검증 실패 시 파일 삭제 후 폴백.

6. 생성된 이미지에 텍스트가 포함되어 있으면 프롬프트에 "absolutely no text" 강화 후 재생성 (최대 1회 재시도)

**에러 처리**: 아래 모든 실패 시 포스트 작성은 중단하지 않고 폴백한다.

| 실패 시점 | 대응 |
|-----------|------|
| API 키 미설정 | API 호출 스킵, 6단계에서 프롬프트만 출력 |
| API 호출 실패 (인증/네트워크) | 에러 메시지 + 프롬프트 출력 |
| JSON 파싱 실패 / predictions 없음 | 원본 응답 일부 + 프롬프트 출력 |
| 이미지 디코딩/저장 실패 | 에러 메시지 + 프롬프트 출력 |
| 저장된 파일이 이미지 아님 | 파일 삭제 + 프롬프트 출력 |
| 비율 불일치 (16:9 아님) | Pillow center-crop + 1536x864 리사이즈 자동 적용 |

### 6단계: 결과 보고

사용자에게 다음을 출력:
1. 생성된 파일 경로
2. frontmatter 요약 (제목, 태그, 시리즈, draft 상태)
3. 본문 섹션 구조 (섹션 제목 목록)
4. 논문 출판 시점 ↔ 현재 시점 간격
5. 썸네일 이미지 생성 프롬프트 (복사 가능한 형태)
6. 썸네일 상태:
   - 자동 생성 성공 시: "thumbnail.jpeg가 자동 생성되어 assets/ 폴더에 저장되었습니다. 품질을 확인해주세요."
   - 폴백 시: "thumbnail.jpeg 이미지를 아래 프롬프트로 생성하여 assets/ 폴더에 넣어주세요" + 실패 원인

## 주의사항

- 이미지 경로는 반드시 `./assets/thumbnail.jpeg`. 레거시 `1.jpeg` 패턴 사용 금지
- 본문에서 `#`(h1)이나 `##`(h2)를 섹션 제목으로 사용하지 않는다. `###`(h3)만 사용
- draft 기본값은 true. 사용자가 명시적으로 발행을 요청하지 않는 한 draft: true로 생성
- 논문을 직역/요약하지 않는다. 원문의 섹션 구조를 그대로 따르지 않고, 독자가 이해하기 가장 쉬운 흐름으로 재구성한다
- 논문의 주장을 현재 사실처럼 서술하지 않는다. 논문이 쓰인 시점과 현재의 차이를 항상 의식한다
- 논문이 참조하는 다른 연구(사례, 벤치마크 등)가 당시 기준의 것임을 명시한다
- 영어 병기 용어에 `**볼드**`를 걸지 않는다. `한국어(English)` 형태 그대로 사용
- 한글 글자와 `**bold**`를 공백 없이 붙이지 않는다. CommonMark의 flanking 규칙상 `**텍스트**한글` 처럼 양쪽이 한글/영문자면 닫는 `**`가 강조로 인식되지 않아 별표가 그대로 렌더링된다. 닫는 `**` 뒤에는 공백, 구두점(`.`, `,`, `:`, `)`), 또는 개행이 와야 한다. 닫히지 않는다면 해당 강조를 풀거나(`**Attention 메커니즘**을` → `Attention 메커니즘을`), 문장을 재구성한다. 예외: 앞쪽에 구두점이 있으면 뒤쪽이 한글이어도 닫힘 (`**상위 50%**에` OK)
- 예상 분량: 8,000~15,000자 (논문 분량에 따라 유동적)
