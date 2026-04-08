---
title: "Agentic AI 논문 읽기: Constitutional AI — 원칙 기반 자기 개선"
description: "Constitutional AI 논문을 해설합니다. 인간 피드백 레이블 없이 원칙(헌법)만으로 AI를 자기 개선시키는 Anthropic의 2단계 프로세스 — 비판-수정의 지도학습과 RLAIF — 를 분석합니다."
image: ./assets/thumbnail.jpeg
tags:
  - 기술
  - 리포트
date: 2026-04-07 17:00:00
series: Agentic AI 논문 읽기
draft: false
---

![Agentic AI 논문 읽기: Constitutional AI — 원칙 기반 자기 개선](./assets/thumbnail.jpeg)

> **논문 정보**
>
> - **제목**: Constitutional AI: Harmlessness from AI Feedback
> - **저자**: Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Amanda Askell 외 (Anthropic)
> - **출판**: arXiv 2212.08073 (2022.12)

시리즈가 다시 방향을 전환한다. 금융 AI에서 에이전트의 안전성으로. 에이전트가 강력해질수록, "에이전트가 잘못된 일을 하지 않도록 어떻게 보장하는가"라는 질문이 더 중요해진다.

2022년 12월, Anthropic이 Constitutional AI(CAI)를 발표했다. 핵심 아이디어는 인간의 감독을 원칙(constitution) — AI 행동을 지배해야 하는 규칙 목록 — 으로 추상화하는 것이다. 인간이 매번 유해한 출력에 라벨을 다는 대신, "이런 원칙을 따르라"고 한 번 정의하면, AI가 스스로 자기 출력을 비판하고 수정한다.

2단계 프로세스다. 지도학습(SL) 단계에서 모델이 자기 응답을 원칙에 비추어 비판(critique)하고 수정(revision)한다. 이 수정된 데이터로 파인튜닝한다. 강화학습(RL) 단계에서는 AI가 두 응답 중 어느 것이 원칙에 더 부합하는지 판단하여 선호 데이터를 생성하고, 이로 RLAIF(RL from AI Feedback)를 수행한다.

결과는 놀랍다. RL-CAI 모델이 유해성 면에서 인간 피드백 기반 RLHF에 필적하거나 능가하면서, 회피적이지 않고 투명하게 유해한 요청에 대한 반대 이유를 설명한다.

에이전트 시스템에서 CAI의 의미는 크다. Reflexion이 과제 실패에 대한 자기 반성이었다면, CAI는 안전성에 대한 자기 반성이다. 에이전트가 도구를 사용하고 실세계에 영향을 미칠 때, 원칙 기반 자기 검열이 안전장치가 된다.

### 마무리

다음 글에서는 CAI의 기반이 되는 RLHF 자체의 근본적 한계를 파헤친다. RLHF의 미해결 과제들을 체계적으로 정리한 서베이를 읽는다.

---

*이 글은 "Agentic AI 논문 읽기" 시리즈의 스물한 번째 글입니다. 시리즈 전체 목록은 시리즈 페이지에서 확인할 수 있습니다.*
