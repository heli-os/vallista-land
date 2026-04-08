---
title: "Agentic AI 논문 읽기: FINCH — 스프레드시트 중심 재무 벤치마크"
description: "FINCH 논문을 해설합니다. Enron의 15,000개 스프레드시트에서 추출한 172개 실세계 워크플로우로, GPT 5.1 Pro조차 38.4%만 통과하는 엔터프라이즈 금융·회계의 극한 난이도를 드러냅니다."
image: ./assets/thumbnail.jpeg
tags:
  - 기술
  - 리포트
date: 2026-04-07 09:00:00
series: Agentic AI 논문 읽기
draft: false
---

![Agentic AI 논문 읽기: FINCH — 스프레드시트 중심 재무 벤치마크](./assets/thumbnail.jpeg)

> **논문 정보**
>
> - **제목**: FINCH: Benchmarking Finance & Accounting across Spreadsheet-Centric Enterprise Workflows
> - **저자**: Haoyu Dong 외 (University of Chinese Academy of Sciences, Harvest Fund, Hugging Face 등)
> - **출판**: arXiv 2512.13168 (2025.12)

HumanEval 91%, SWE-bench 40% — AI 에이전트의 코딩 능력은 매년 경신된다. 하지만 실세계 엔터프라이즈의 가장 일상적인 도구 — 스프레드시트 — 에서의 성능은 어떤가?

FINCH가 그 답을 보여준다. Enron의 15,000개 스프레드시트와 500,000개 이메일에서 추출한 172개 복합 워크플로우(384개 과제, 1,710개 스프레드시트, 2,700만 셀)로 구성된 벤치마크다. 데이터 입력, 구조화, 웹 검색, 교차 시트 검색, 계산, 모델링, 검증, 번역, 시각화, 보고 — 실제 재무·회계 업무의 전 과정을 포괄한다.

핵심 발견은 충격적이다. GPT 5.1 Pro가 워크플로우당 평균 16.8분을 소비하지만 38.4%만 통과한다. Claude Sonnet 4.5는 25.0%만 통과한다. 실세계 엔터프라이즈 F&A 워크플로우가 현재 최첨단 AI 에이전트에게도 극도로 도전적임을 실증한다.

이 벤치마크가 중요한 이유는, AI Agents That Matter가 제기한 "벤치마크가 실세계를 반영하는가"라는 질문에 정면으로 답하기 때문이다. FINCH의 과제들은 실제 기업 데이터에서 왔고, 실제 업무 프로세스를 반영한다.

### 마무리

다음 글에서는 금융 의사결정 에이전트의 평가를 다룬다. InvestorBench — 주식, 암호화폐, ETF에 걸친 투자 의사결정 벤치마크를 읽는다.

---

*이 글은 "Agentic AI 논문 읽기" 시리즈의 열아홉 번째 글입니다. 시리즈 전체 목록은 시리즈 페이지에서 확인할 수 있습니다.*
