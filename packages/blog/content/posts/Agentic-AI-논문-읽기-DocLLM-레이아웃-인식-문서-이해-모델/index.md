---
title: "Agentic AI 논문 읽기: DocLLM — 레이아웃 인식 문서 이해 모델"
description: "DocLLM 논문을 해설합니다. 비전 인코더 없이 바운딩 박스 좌표만으로 문서 레이아웃을 이해하는 경량 LLM 확장의 설계와, 16개 데이터셋 중 14개에서 SOTA를 달성한 분리된 공간 어텐션 메커니즘을 분석합니다."
image: ./assets/thumbnail.jpeg
tags:
  - 기술
  - 리포트
date: 2026-04-06 17:00:00
series: Agentic AI 논문 읽기
draft: false
---

![Agentic AI 논문 읽기: DocLLM — 레이아웃 인식 문서 이해 모델](./assets/thumbnail.jpeg)

> **논문 정보**
>
> - **제목**: DocLLM: A Layout-Aware Generative Language Model for Multimodal Document Understanding
> - **저자**: Dongsheng Wang, Natraj Raman 외 (JPMorgan AI Research)
> - **출판**: arXiv 2401.00908 (2024.01)

금융 에이전트가 실세계에서 작동하려면, 깔끔한 텍스트뿐 아니라 양식, 송장, 영수증, 계약서 같은 시각적으로 복잡한 문서를 이해해야 한다. 이런 문서에서 정보의 의미는 텍스트 내용뿐 아니라 공간적 위치에도 의존한다. "500,000"이라는 숫자가 "매출" 옆에 있는지 "비용" 옆에 있는지에 따라 의미가 완전히 달라진다.

JPMorgan AI Research가 2024년 1월 발표한 DocLLM은 이 문제를 경량으로 해결한다. 핵심 혁신은 비전 인코더를 사용하지 않는다는 점이다. 대신 OCR에서 추출한 바운딩 박스 좌표만으로 공간 레이아웃을 통합한다. 분리된 공간 어텐션(Disentangled Spatial Attention)이라는 메커니즘이 핵심으로, text-to-text, text-to-spatial, spatial-to-text, spatial-to-spatial 네 가지 교차 모달 상호작용을 분리하여 계산한다.

16개 데이터셋 중 14개에서 SOTA를 달성했고, 미지의 5개 데이터셋 중 4개에서도 잘 일반화되었다. 비전 인코더 없이 이 성능을 달성한 것은, 문서 이해에서 공간 좌표 정보가 이미지 픽셀보다 더 효율적인 신호일 수 있음을 시사한다.

### 마무리

다음 글에서는 금융 AI 에이전트의 실세계 역량을 검증하는 벤치마크를 읽는다. FINCH — Enron의 실제 스프레드시트에서 추출한 172개 복합 워크플로우로 현재 AI의 한계를 드러낸다.

---

*이 글은 "Agentic AI 논문 읽기" 시리즈의 열여덟 번째 글입니다. 시리즈 전체 목록은 시리즈 페이지에서 확인할 수 있습니다.*
