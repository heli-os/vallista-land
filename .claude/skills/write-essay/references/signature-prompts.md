# 시그니처 모드 — 시리즈 시각 코드 & 변주 풀 프롬프트

`write-essay` 스킬 5-1단계에서 **모드 B (시그니처)**를 선택했을 때 참조한다. 시리즈/깊이 있는 에세이를 위한 A24 × Apple keynote × Kurzgesagt editorial 3D 톤. Imagen 4.0 / Gemini 2.5 Flash Image 어느 쪽이든 그대로 입력 가능.

## 시리즈 시각 코드 (모든 변주에 공통)

이 7가지는 변주가 달라져도 절대 깨지 않는다. 새 변주를 작성할 때 체크리스트로 사용.

1. **카메라**: Editorial cinematic 3D render, 16:9 frame (또는 ultra-wide cinematic frame). Symmetric head-on 또는 slight three-quarter.
2. **인물**: Faceless humanoid figure(s) — rounded matte white helmet, dark glossy visor, soft charcoal knit. 표정·실제 얼굴·드라마틱 포즈 금지.
3. **재질**: 매트(matte)만. glossy plastic, chrome, glow lines 금지.
4. **라이팅**: 부드러운 탑 키 라이트 + soft contact shadow. 두 번째 키 라이트나 림 글로우 자제.
5. **팔레트**: 두 톤 중 하나로 통일.
   - 밝은 톤: pure off-white cyclorama
   - 어두운 톤: deep charcoal-navy
   액센트 컬러는 *픽셀 단위* 또는 없음.
6. **레이아웃**: 좌측 1/3 구간을 의도적인 네거티브 스페이스로 비워둔다 (텍스트 오버레이를 위한 자리라고 프롬프트에 적지 않는다 — 모델이 텍스트를 그릴 신호로 해석함).
7. **텍스처**: subtle film grain, shallow depth of field.

**Negative (모든 변주 공통, 반드시 포함)**: `absolutely no text of any kind anywhere in the frame — no letters, no numbers, no Korean characters, no captions, no signage, no labels, no glyphs, no typography, no watermarks`; no realistic faces, no logos, no clutter, no scattered papers, no glow lines beyond what's specified, no motion blur.

**중요**: `Korean headline overlay`, `headline space`, `text overlay` 같은 표현을 프롬프트에 절대 쓰지 않는다. 그 자체가 모델에게 한국어/영문 텍스트를 그리도록 지시하는 신호가 됨. 책·간판·모니터·라벨 등 텍스트가 들어가기 쉬운 객체가 장면에 있으면 `the {object} appears blank without any printed content` 절을 추가로 넣는다.

## 변주 인덱스

| # | 슬러그 | 컨셉 한 줄 | 어울리는 본문 메타포 |
|---|---|---|---|
| 1 | two-track | 무빙워크 vs 러닝머신 위 두 figure | 같은 거리/다른 강박, 속도 비교, 접근 차이 |
| 2 | dimmer-console | 거대 매트 콘솔의 작은 슬라이더 | 강도 조절, 감정 점유율, 스위치 |
| 3 | empty-desk | figure 부재, 닫힌 노트북, 가마 잔불 | 자리 비움, 자동화, 손 놓아도 굴러감 |
| 4 | three-readers | 세 의자 위 세 figure가 같은 책 | 같은 텍스트의 다른 해석/관점/직위 |
| 5 | mirror | 매트 패널 앞 figure, 비치지 않음 | 자기 검열 해제, 화면 뒤로 |

## 풀 프롬프트

### 변주 1 — Two-Track Cyclorama

```
Editorial cinematic 3D render, ultra-wide cinematic frame.

A bright pure off-white seamless cyclorama studio. Two long parallel tracks running side by side from foreground to background, perfectly horizontal. Left track is a smooth matte off-white moving walkway — a faceless humanoid figure in a rounded matte white helmet and soft charcoal knit stands upright on it, hands at sides, completely still. Right track is an identical-length matte treadmill — an identical figure mid-stride, leaning slightly forward, running. Both figures are at the exact same distance from the camera plane.

Symmetric head-on composition with shallow depth of field. Soft top key light, gentle contact shadows under each track. Pure off-white palette throughout — no accent color anywhere. The tracks are completely smooth matte surfaces from end to end with no display panels, no consoles, no readouts, no buttons, no LED dots, no markings of any kind. Subtle film grain.

Left third of the frame intentionally empty as composition negative space.

Mood: same distance, different density. The cost of grip.

Style: A24 × Apple keynote × Kurzgesagt editorial 3D, Octane render quality, matte materials only.

Negative: absolutely no text of any kind anywhere in the frame — no letters, no numbers, no Korean characters, no captions, no signage, no labels, no glyphs, no typography, no watermarks; no display panels at track ends, no console faces, no readouts, no buttons, no LED dots, no green color, no glow lines, no motion blur lines, no sweat or strain expression, no realistic faces, no logos, no clutter.
```

### 변주 2 — Dimmer Console

```
Editorial cinematic 3D render, slightly low-angle three-quarter perspective.

A monolithic matte off-white wall-sized control console fills the frame, perfectly flat and clean except for a single small recessed slider channel running vertically near the right side. A faceless humanoid figure in a rounded matte white helmet and soft charcoal knit stands beside it, one gloved hand calmly lowering the small slider. The slider's tiny indicator glows a single green pixel.

Behind the figure: a deep charcoal-navy seamless wall, subtle ambient gradient. Single key light from upper left, gentle warm fill, soft contact shadow under the figure. Shallow depth of field. Subtle film grain.

Left third of the frame intentionally empty as composition negative space.

Mood: deliberate, quiet, "turning the grip down." The vector remains; only the scalar changes.

Style: A24 × Apple keynote × Kurzgesagt editorial 3D, matte materials only, Octane render quality.

Negative: absolutely no text of any kind anywhere in the frame — no letters, no numbers, no Korean characters, no captions, no signage, no labels, no glyphs, no typography, no watermarks; no glow lines beyond the slider indicator, no buttons, no accent color elsewhere, no dramatic gesture, no realistic faces, no logos.
```

### 변주 3 — Empty Desk + Quiet Kiln

```
Editorial cinematic 3D render, ultra-wide cinematic frame.

A warm walnut wooden executive desk in a deep charcoal-navy room. On the desk: only a slim closed laptop with a completely plain unbranded matte aluminum lid (no Apple logo, no manufacturer mark, no embossed brand of any kind), perfectly centered, lid flush. The chair behind the desk is empty, slightly turned away. On the far right wall, a small recessed alcove holds a low matte ceramic kiln; inside the kiln, a single small ember glows a faint warm orange — the room's only color accent, barely a pixel.

Symmetric head-on composition, generous negative space above the desk. Soft single key light from upper left, gentle warm fill from the kiln, soft contact shadow under the desk and chair. Desaturated palette: charcoal, walnut, off-white, with one tiny ember glow. Shallow depth of field. Subtle film grain.

Left third of the frame intentionally empty as composition negative space.

Mood: the work is handled. Absence as competence.

Style: A24 film still × Apple product render × Kurzgesagt editorial, Blender Cycles quality.

Negative: absolutely no text of any kind anywhere in the frame — no letters, no numbers, no Korean characters, no captions, no signage, no glyphs, no typography, no watermarks; no figure, no scattered papers, no open laptop, no glow lines, no logos, no clutter, no second light source beyond the kiln ember.
```

### 변주 4 — Three Readers, Same Book

```
Editorial cinematic 3D render, ultra-wide frame, head-on symmetric composition.

A bright pure off-white seamless cyclorama studio. Three faceless humanoid figures in rounded matte white helmets and soft charcoal knits, each seated on a different matte chair — left: a low utilitarian stool, center: a mid-century lounge chair, right: a tall executive chair. All three hold an identical small matte off-white hardcover book, open to the same page, at the same angle. Equal spacing, equal scale, all looking down at their books in identical posture.

Soft top key light, soft contact shadows under each chair. Pure off-white palette with one tiny green pixel glow on each book's page edge. Shallow depth of field with the center figure in sharpest focus. Subtle film grain.

Left third of the frame intentionally empty as composition negative space.

Mood: same text, three altitudes. Reading as relocation.

Style: A24 × Apple keynote × Kurzgesagt editorial 3D, Octane render quality, matte materials only.

Negative: absolutely no text of any kind anywhere in the frame — no letters, no numbers, no Korean characters, no captions, no signage, no glyphs, no typography, no watermarks; the books appear blank without any printed content; no glow lines beyond page edges, no expression difference, no accent color elsewhere, no realistic faces, no logos, no clutter.
```

### 변주 5 — Mirror Without Reflection

```
Editorial cinematic 3D render, head-on symmetric composition.

A faceless humanoid figure in a rounded matte white helmet with dark glossy visor and soft charcoal knit stands centered before a large matte vertical panel — a clean off-white surface filling two-thirds of the frame behind the figure. The panel is perfectly flat and shows nothing: no reflection, no figure, only its own matte surface. The figure stands completely still, hands at sides.

Behind: a deep charcoal-navy seamless floor and ceiling. Soft single key light from upper left, soft contact shadow under the figure, faint cool rim along the panel edge. Desaturated palette: charcoal, off-white. Subtle film grain.

Left third of the frame intentionally empty as composition negative space.

Mood: the screen no longer watches back. Released from self-audit.

Style: A24 film still × Apple product render × Kurzgesagt editorial, Blender Cycles quality, matte materials only.

Negative: absolutely no text of any kind anywhere in the frame — no letters, no numbers, no Korean characters, no captions, no signage, no labels, no glyphs, no typography, no watermarks; no actual mirror reflection, no glow lines, no accent color, no second figure, no logos, no realistic face beneath the visor.
```

## 새 변주 작성 가이드

5종이 모두 본문 메타포와 맞지 않을 때만 새 변주를 작성한다. 절차:

1. **본문에서 핵심 메타포 1개 추출** — 너무 많으면 시각 노이즈가 됨
2. **시리즈 시각 코드 7항목 모두 준수** — 그래야 시리즈 통일감 유지
3. **프롬프트 구조** (위 변주들과 동일):
   - L1: `Editorial cinematic 3D render, {16:9 / ultra-wide} frame, {composition}.`
   - L2~3: 장면 묘사 (figure 위치/포즈/소품)
   - L4: 라이팅·팔레트·DoF
   - L5: `Left third of the frame intentionally empty as composition negative space.`
   - L6: `Mood: ...`
   - L7: `Style: A24 × Apple keynote × Kurzgesagt editorial 3D, ...`
   - L8: `Negative: ...` (시리즈 공통 + 이 변주 고유 부정문)
4. **금지 토큰**: 미드저니 전용 `--ar`, `--style raw`, `--v 6` 같은 파라미터는 Imagen/Gemini에 무의미하므로 제외 (aspect ratio는 API parameter로 전달)

## 운영 메모

- Imagen 4.0의 `aspectRatio`는 16:9까지 지원. 21:9는 후처리 크롭이 필요하지만 실용상 16:9로 통일하는 것이 단순함.
- 한 변주에서 마음에 드는 결과가 안 나오면 같은 프롬프트로 재시도 (Imagen은 시드 차이로 다른 결과를 줌).
- 시리즈 글이 5편 이상 쌓이면 동일 변주 반복 사용을 피해 시리즈 안에서도 시각 변화를 준다.
