---
title: "Agentic AI 논문 읽기: InvestorBench — 금융 의사결정 에이전트 벤치마크"
description: "InvestorBench 논문을 해설합니다. 주식·암호화폐·ETF 세 가지 자산에 걸쳐 13개 LLM의 투자 의사결정 능력을 평가하고, 계층적 장기 메모리 모델의 설계를 분석합니다."
image: ./assets/thumbnail.jpeg
tags:
  - 기술
  - 리포트
date: 2026-04-07 13:00:00
series: Agentic AI 논문 읽기
draft: false
---

![Agentic AI 논문 읽기: InvestorBench — 금융 의사결정 에이전트 벤치마크](./assets/thumbnail.jpeg)

> **논문 정보**
>
> - **제목**: InvestorBench: A Benchmark for Financial Decision-Making Tasks with LLM-based Agent
> - **저자**: Haohang Li, Yupeng Cao, Yangyang Yu 외 (Stevens Institute of Technology, Columbia University, Harvard University)
> - **출판**: ACL 2025 / arXiv 2412.18174 (2024.12)

FINCH가 스프레드시트 업무의 자동화를 평가했다면, InvestorBench는 한 단계 더 야심적인 질문을 던진다 — LLM이 투자 의사결정을 내릴 수 있는가?

InvestorBench는 3가지 자산 유형(주식, 암호화폐, ETF)에 걸쳐 13개 LLM을 Buy/Sell/Hold 의사결정으로 평가한다. 흥미로운 설계는 계층적 장기 메모리(Layered Long-Term Memory)다. 얕은/중간/깊은 3계층으로 정보 감쇠율을 차등화하여, 최근 뉴스는 빠르게 반영하고 장기 펀더멘털은 천천히 반영한다. OHLCV 가격 데이터, 뉴스, 10-K/10-Q 보고서, 감성 분석을 통합한 다중 소스 환경이다.

핵심 발견: 독점 모델(GPT-4, GPT-o1)이 복잡한 시장 조건에서 오픈소스를 일관되게 능가하며, 모델 크기가 클수록 금융 의사결정의 품질과 견고성이 향상된다. 이는 금융 의사결정이 단순한 패턴 매칭이 아니라, 다중 정보원의 복잡한 추론을 요구하기 때문이다.

### 마무리

다음 글에서는 금융 AI를 떠나, AI 시스템의 안전성으로 넘어간다. Constitutional AI — 원칙 기반 자기 개선으로 유해한 출력을 제어하는 Anthropic의 접근을 읽는다.

---

*이 글은 "Agentic AI 논문 읽기" 시리즈의 스무 번째 글입니다. 시리즈 전체 목록은 시리즈 페이지에서 확인할 수 있습니다.*
