---
name: write-report
description: "세션/팟캐스트/컨퍼런스 내용을 구조화된 리포트 형식의 블로그 포스트로 생성한다. 트랜스크립트나 요약 텍스트를 받아 인용문 포함, 섹션별 정리, 키 테이크어웨이를 포함한 리포트를 작성. '리포트 써줘', '세션 요약', '세션 정리', '팅껨', '다이제스트', '팟캐스트 정리' 등의 요청 시 사용. 에세이 톤이 아닌 분석적/구조화된 톤으로 작성할 때 사용."
---

# 리포트 작성 스킬

세션, 팟캐스트, 컨퍼런스 등의 내용을 구조화된 리포트 형식의 블로그 포스트로 생성하는 스킬. write-essay와 파일 구조/썸네일 규칙은 공유하되, 톤과 본문 구조가 다르다.

## 입력 파라미터

| 파라미터 | 필수 | 기본값 | 설명 |
|----------|------|--------|------|
| title | O | - | 리포트 제목 |
| tags | X | ["에세이"] | 태그 목록 |
| source_type | X | "팟캐스트" | 소스 유형 (팟캐스트/세미나/컨퍼런스/밋업) |
| source_text | O | - | 트랜스크립트, 요약 텍스트, 또는 해당 파일 경로 |
| draft | X | true | 초안 여부 |

## 실행 절차

### 1단계: 입력 검증

1. 제목이 비어있으면 사용자에게 요청
2. 태그가 허용 목록에 있는지 확인
   - 허용: 에세이, 기술, 성장, 조직, 스타트업, 회고, 리뷰, 리포트
   - 불허 태그 입력 시 → 가장 유사한 허용 태그 제안
3. source_text가 파일 경로이면 해당 파일을 읽어서 내용 획득
4. source_text가 비어있으면 사용자에게 요청

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
description: "{리포트 내용을 1~2문장으로 요약. 소스 유형과 핵심 주제를 포함}"
image: ./assets/thumbnail.jpeg
tags:
  - {태그1}
  - {태그2}
date: {YYYY-MM-DD HH:mm:ss 형식의 현재 시각}
draft: {true|false}
---
```

- `date`는 `date '+%Y-%m-%d %H:%M:%S'` 명령으로 현재 시각 획득
- `description`은 본문 작성 후 내용에 맞게 작성

### 4단계: 본문 작성

**구조**:
```markdown
![제목](./assets/thumbnail.jpeg)

{세션 개요: 소스 유형, 일시, 주제, 참여자 등 1~2문단으로 배경 설명}

### {주제 섹션 1 제목}

{해당 주제에 대한 구조화된 정리}

> "인용문" — 화자명

{인용문에 대한 맥락 설명 또는 분석}

- 핵심 포인트 1
- 핵심 포인트 2

### {주제 섹션 2 제목}

...

### {주제 섹션 N 제목}

...

### 키 테이크어웨이

{리포트 전체를 관통하는 핵심 메시지 3~5개를 불릿포인트로 정리}

- **테이크어웨이 1**: 한 줄 요약
- **테이크어웨이 2**: 한 줄 요약
- ...
```

**톤 가이드라인**:
- 분석적이고 객관적인 서술 (에세이의 철학적 톤 X)
- 소스 내용을 충실히 구조화하여 전달
- 세션을 직접 듣지 않은 사람도 핵심을 파악할 수 있도록
- 불릿포인트, 볼드, 인용문을 적극 활용하여 스캔 가능하게 작성

**인용문 처리 규칙**:
- `>` 블록쿼트 사용
- 구어체를 약간 다듬되 원문의 뉘앙스와 어투를 보존
- 화자가 구별 가능하면 `— 화자명` 표기
- 화자가 불분명하면 화자명 생략
- 핵심 논점을 담은 발언만 선별 인용 (섹션당 1~2개)

### 5단계: 썸네일 이미지 생성

#### 5-1. 프롬프트 생성

리포트 주제를 반영한 시각적 메타포를 공통 스타일에 추가:

```
Minimalist editorial illustration, muted warm tones, soft grain texture, no text, 16:9 aspect ratio, blog thumbnail style, {리포트 주제를 시각화하는 구체적 묘사}
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
RESPONSE=$(curl -s -f \
  -X POST "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"instances\": [{\"prompt\": \"{5-1에서 생성한 전체 프롬프트}\"}],
    \"parameters\": {\"sampleCount\": 1, \"aspectRatio\": \"16:9\"}
  }" 2>/dev/null)

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

3. 응답에서 base64 이미지 데이터 추출 및 저장:
```bash
echo "$RESPONSE" | python3 -c "
import sys, json, base64
data = json.load(sys.stdin)
if 'predictions' in data:
    img_bytes = base64.b64decode(data['predictions'][0]['bytesBase64Encoded'])
else:
    for candidate in data.get('candidates', []):
        for part in candidate.get('content', {}).get('parts', []):
            if 'inlineData' in part:
                img_bytes = base64.b64decode(part['inlineData']['data'])
                break
with open('packages/blog/content/posts/{폴더명}/assets/thumbnail.jpeg', 'wb') as f:
    f.write(img_bytes)
print('SUCCESS')
" 2>/dev/null
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

**에러 처리**: 아래 모든 실패 시 리포트 작성은 중단하지 않고 폴백한다.

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
2. frontmatter 요약 (제목, 태그, draft 상태)
3. 본문 섹션 구조 (섹션 제목 목록)
4. 인용문 수
5. 썸네일 이미지 생성 프롬프트 (복사 가능한 형태)
6. 썸네일 상태:
   - **자동 생성 성공 시**: "thumbnail.jpeg가 자동 생성되어 assets/ 폴더에 저장되었습니다. 품질을 확인해주세요."
   - **폴백 시**: "thumbnail.jpeg 이미지를 아래 프롬프트로 생성하여 assets/ 폴더에 넣어주세요" + 실패 원인

## 주의사항

- 이미지 경로는 반드시 `./assets/thumbnail.jpeg`. 레거시 `1.jpeg` 패턴 사용 금지
- 본문에서 `#`(h1)이나 `##`(h2)를 섹션 제목으로 사용하지 않는다. `###`(h3)만 사용
- draft 기본값은 true. 사용자가 명시적으로 발행을 요청하지 않는 한 draft: true로 생성
- 인용문은 소스 텍스트에서 직접 발췌. 존재하지 않는 발언을 만들어내지 않는다
- 소스 텍스트가 길 경우 주제별로 분류한 후 섹션을 구성한다. 시간순이 아닌 주제순으로 정리
- 한글 글자와 `**bold**`를 공백 없이 붙이지 않는다. CommonMark의 flanking 규칙상 `**텍스트**한글` 처럼 양쪽이 한글/영문자면 닫는 `**`가 강조로 인식되지 않아 별표가 그대로 렌더링된다. 닫는 `**` 뒤에는 공백, 구두점(`.`, `,`, `:`, `)`), 또는 개행이 와야 한다. 닫히지 않는다면 해당 강조를 풀거나(`**핵심 결과**는` → `핵심 결과는`), 문장을 재구성한다. 예외: 앞쪽에 구두점이 있으면 뒤쪽이 한글이어도 닫힘 (`**상위 50%**에` OK)
