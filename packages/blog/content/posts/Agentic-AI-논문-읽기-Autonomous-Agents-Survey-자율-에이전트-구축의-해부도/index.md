---
title: "Agentic AI 논문 읽기: Autonomous Agents Survey — 자율 에이전트 구축의 해부도"
description: "LLM 기반 자율 에이전트 서베이를 해설합니다. 프로파일링, 메모리, 계획, 행동의 4가지 핵심 모듈로 에이전트 구축을 체계적으로 분류하고, 사회 시뮬레이션에서 소프트웨어 개발까지 응용을 조망합니다."
image: ./assets/thumbnail.jpeg
tags:
  - 기술
  - 리포트
date: 2026-04-08 12:00:00
series: Agentic AI 논문 읽기
draft: false
---

![Agentic AI 논문 읽기: Autonomous Agents Survey — 자율 에이전트 구축의 해부도](./assets/thumbnail.jpeg)

> **논문 정보**
>
> - **제목**: A Survey on Large Language Model based Autonomous Agents
> - **저자**: Lei Wang, Chen Ma, Xueyang Feng 외 (Renmin University of China, Tencent)
> - **출판**: Frontiers of Computer Science, 2024 / arXiv 2308.11432

시리즈의 첫 글에서 CoALA가 에이전트의 인지 아키텍처를 기억-행동-판단의 세 축으로 그렸다. 일곱 번째 글에서 Multi-Agent Survey가 다중 에이전트의 지형을 네 축으로 분류했다. 이 서베이는 그 사이를 메운다 — 단일 에이전트의 구축(Construction)과 응용(Application)을 체계적으로 분류한다.

에이전트 구축의 4가지 핵심 모듈: 프로파일링(에이전트의 역할과 성격 정의), 메모리(단기/장기 경험 관리), 계획(과제 분해와 피드백 기반 정제), 행동(도구와 환경 상호작용). 시리즈에서 읽은 논문들이 이 네 모듈의 어디에 위치하는지 배치하면, CoT와 ReAct는 계획과 행동을, Reflexion은 메모리와 계획을, LATS는 계획을, Toolformer는 행동을 다뤘다.

응용 영역은 사회 시뮬레이션(Generative Agents), 소프트웨어 개발(MetaGPT, AutoGen), 게임(Voyager), 과학 연구 등으로 분류된다.

CoALA가 추상적 좌표계였다면, 이 서베이는 구체적 구현 가이드에 가깝다. 에이전트를 실제로 만들 때 어떤 설계 결정이 필요한지를 모듈별로 정리한다.

### 마무리

다음 글에서는 에이전트를 다른 렌즈로 바라보는 또 다른 서베이를 읽는다. Rise and Potential — 뇌, 지각, 행동의 세 축으로 에이전트의 미래를 전망한다.

---

*이 글은 "Agentic AI 논문 읽기" 시리즈의 스물세 번째 글입니다. 시리즈 전체 목록은 시리즈 페이지에서 확인할 수 있습니다.*
