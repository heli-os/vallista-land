---
title: "Agentic AI 논문 읽기: FinGPT — 오픈소스 금융 LLM 프레임워크"
description: "FinGPT 논문을 해설합니다. BloombergGPT의 독점적 접근 대신, 오픈소스 모델 + 경량 파인튜닝 + 자동화된 데이터 파이프라인으로 금융 LLM을 민주화하려는 프레임워크의 설계를 분석합니다."
image: ./assets/thumbnail.jpeg
tags:
  - 기술
  - 리포트
date: 2026-04-06 09:00:00
series: Agentic AI 논문 읽기
draft: false
---

![Agentic AI 논문 읽기: FinGPT — 오픈소스 금융 LLM 프레임워크](./assets/thumbnail.jpeg)

> **논문 정보**
>
> - **제목**: FinGPT: Open-Source Financial Large Language Models
> - **저자**: Hongyang Yang, Xiao-Yang Liu, Christina Dan Wang (AI4Finance Foundation, Columbia University, NYU Shanghai)
> - **출판**: FinLLM 2023@IJCAI / arXiv 2306.06031 (2023.06)

BloombergGPT는 40년의 독점 데이터와 대규모 인프라로 금융 특화 모델을 만들었다. 인상적이지만, 대부분의 조직이 재현할 수 없는 접근이다. 2023년 6월, AI4Finance Foundation의 연구팀이 정반대의 질문을 던졌다 — 오픈소스와 경량 기술로도 금융 LLM을 만들 수 있는가?

FinGPT의 핵심은 데이터 중심 접근이다. 모델을 처음부터 훈련하는 대신, Llama 같은 기존 오픈소스 모델에 LoRA로 경량 파인튜닝한다. 비용은 약 300달러. BloombergGPT의 훈련 비용과 비교하면 차원이 다르다. 5계층 프레임워크 — 데이터 소스, 데이터 엔지니어링, LLM, 과제, 응용 — 를 통해 자동화된 데이터 수집/정제 파이프라인을 구축한다.

Llama-3.1-8B 기반으로 62만 건 뉴스 데이터에서 감성 분석 82.1% 정확도를 달성했다. ChatGPT의 63.4%를 크게 앞선다. 물론 특정 과제에 특화된 결과이지만, 경량 파인튜닝의 가능성을 보여준다.

### BloombergGPT vs FinGPT — 두 가지 철학

| 차원 | BloombergGPT | FinGPT |
|------|-------------|--------|
| 데이터 | 독점 (FinPile 363B) | 공개 (뉴스, SEC, 소셜) |
| 훈련 | 처음부터 (50.6B) | 파인튜닝 (LoRA) |
| 비용 | 수백만 달러 | ~$300 |
| 접근성 | 비공개 | 오픈소스 |
| 업데이트 | 전체 재훈련 필요 | 경량 재파인튜닝 |

금융 데이터의 시간 민감성을 고려하면, FinGPT의 경량 업데이트 능력이 실용적 장점이 된다. 시장은 매일 바뀌고, 모델도 빠르게 적응해야 한다.

### 마무리

다음 글에서는 한국어 금융 NLP로 시선을 좁힌다. ₩on — 한국어 금융 벤치마크와 리더보드를 최초로 구축한 연구를 읽는다.

---

*이 글은 "Agentic AI 논문 읽기" 시리즈의 열여섯 번째 글입니다. 시리즈 전체 목록은 시리즈 페이지에서 확인할 수 있습니다.*
