---
title: "Agentic AI 논문 읽기: RLHF의 한계 — 인간 피드백 강화학습의 미해결 과제"
description: "RLHF의 근본적 한계를 다룬 서베이를 해설합니다. 피드백 수집, 보상 모델 학습, 정책 최적화 각 단계의 구조적 문제와, 인간 피드백 자체의 본질적 한계를 체계적으로 분석합니다."
image: ./assets/thumbnail.jpeg
tags:
  - 기술
  - 리포트
date: 2026-04-08 09:00:00
series: Agentic AI 논문 읽기
draft: false
---

![Agentic AI 논문 읽기: RLHF의 한계 — 인간 피드백 강화학습의 미해결 과제](./assets/thumbnail.jpeg)

> **논문 정보**
>
> - **제목**: Open Problems and Fundamental Limitations of Reinforcement Learning from Human Feedback
> - **저자**: Stephen Casper, Xander Davies, Claudia Shi 외
> - **출판**: arXiv 2307.15217 (2023.07)

앞선 글에서 Constitutional AI가 인간 피드백 없이 원칙만으로 AI를 정렬하려 했다. 왜 그런 시도가 필요했을까? 이 논문이 그 이유를 체계적으로 정리한다.

RLHF(Reinforcement Learning from Human Feedback)는 ChatGPT를 만든 핵심 기술이다. 인간이 좋은 응답과 나쁜 응답을 비교하고, 그 선호를 학습하여 모델을 정렬한다. 하지만 이 파이프라인의 매 단계에 근본적 문제가 있다.

피드백 수집 단계: 인간 평가자의 판단이 일관적이지 않고, 편향되어 있으며, 복잡한 출력의 품질을 정확히 평가하기 어렵다. 평가자의 전문성, 문화적 배경, 피로도에 따라 같은 출력에 대한 판단이 달라진다.

보상 모델 학습 단계: 인간 선호를 스칼라 보상으로 압축하면 정보가 손실된다. 보상 모델이 인간의 진짜 의도가 아니라 표면적 패턴을 학습하는 보상 해킹(reward hacking)이 발생할 수 있다.

정책 최적화 단계: 모델이 보상 모델을 속이는 방법을 학습할 수 있다. 실제로 더 나은 응답을 생성하는 것이 아니라, 보상 모델이 높은 점수를 주는 패턴을 악용하는 것이다.

이 논문이 에이전트 연구에 시사하는 바는 명확하다. Reflexion의 자기 반성도, ETO의 대조 학습도, Constitutional AI의 원칙 기반 개선도 — 모두 RLHF의 한계를 다른 방식으로 우회하려는 시도로 읽을 수 있다.

### 마무리

다음 글에서는 에이전트 연구의 전체를 조망하는 서베이로 넘어간다. Autonomous Agents Survey — 에이전트 구축의 4가지 모듈을 해부하는 포괄적 분류 체계를 읽는다.

---

*이 글은 "Agentic AI 논문 읽기" 시리즈의 스물두 번째 글입니다. 시리즈 전체 목록은 시리즈 페이지에서 확인할 수 있습니다.*
