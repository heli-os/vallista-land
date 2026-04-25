---
title: "채용 추천 시스템은 어떻게 '상위 지원자'를 가려내는가"
description: "리크루트먼트 추천 시스템의 3단계 파이프라인(Retrieval → Ranking → Re-ranking)과 Person-Job Fit 계열 모델, 그리고 '채용될 가능성' 스코어의 실체를 LinkedIn 사례와 학계 논문을 교차 참조해 정리한다."
image: ./assets/thumbnail.jpeg
tags:
  - 기술
  - 리포트
date: 2026-04-25 10:00:00
draft: false
---

![채용 추천 시스템은 어떻게 '상위 지원자'를 가려내는가](./assets/thumbnail.jpeg)

어느 저녁, LinkedIn에서 푸시 알림이 왔다. *"회원님은 Senior Java Engineer 외 채용공고 80+개에 채용될 가능성이 가장 높습니다."* 얼핏 반가운 문장이지만, 엔지니어의 눈으로 다시 읽으면 두 가지 질문이 따라붙는다. **이 80+개는 어떻게 선정되었는가.** 그리고 **"채용될 가능성이 가장 높다"는 점수는 무엇을 측정한 것인가.**

이 글은 두 질문을 리크루트먼트 추천 시스템(Recruitment Recommender System)의 문제로 옮겨 놓고, 공개된 산업 사례와 학계 논문을 교차 참조해 답을 구성하는 기술 리포트다. LinkedIn의 엔지니어링 블로그와 논문들이 가장 많은 구체성을 제공하므로 예시의 대부분을 그쪽에서 가져오지만, 기법 자체는 Indeed, BOSS Zhipin, 그리고 학계의 Person-Job Fit 계열 연구에 공통적으로 적용되는 것들이다. 용어가 낯설면 글 끝의 "더 알면 좋은 개념" 섹션을 먼저 훑어도 좋다.

## 리크루트먼트 RecSys는 왜 일반 추천과 다른가

상품 추천과 영상 추천은 대체로 사용자의 선호라는 한 축을 최적화한다. 클릭이 발생하면 그 자체로 보상이고, 추천의 결과는 소비 시간으로 환산된다. 리크루트먼트 추천에는 두 가지가 다르다.

첫째, 양방향 매칭(reciprocal matching)이다. 지원자가 공고를 좋아해도 채용담당자가 그 지원자를 뽑지 않으면 추천은 실패다. 반대 방향도 마찬가지다. 데이팅 앱이 양쪽 호감을 동시에 봐야 성사되는 것과 같은 구조다. 시스템은 지원자 선호와 채용담당자 선호를 동시에 모델링해야 한다. LinkedIn의 리쿠르터 검색/추천 시스템은 이 비대칭을 명시적으로 다루며 공고-지원자 양쪽을 각각 임베딩(embedding)으로 학습한다 ([LinkedIn Engineering — AI Behind Recruiter Search and Recommendation Systems](https://www.linkedin.com/blog/engineering/recommendations/ai-behind-linkedin-recruiter-search-and-recommendation-systems)).

둘째, 라벨 희소성이다. 클릭(CTR, Click-Through Rate)은 넘쳐나지만 최종 채용(confirmed hire)은 수백에서 수천 번의 노출에 한 번 정도 발생하는 이벤트다. 게다가 "누가 실제로 채용되었는가"는 시스템 내부에 명시적으로 기록되지 않고, 대개 지원자의 프로필 직책 변화 같은 간접 신호로 추정된다. 이 때문에 리크루트먼트 RecSys는 클릭/지원 같은 밀도 높은 신호로 모델을 학습하되, 희소한 downstream 신호로 목적함수를 보정하는 다중 신호 설계를 거의 예외 없이 채택한다.

## 3단계 파이프라인 -- Retrieval, Ranking, Re-ranking

대규모 리크루트먼트 RecSys는 대부분 세 단계의 계단식 파이프라인으로 동작한다. 수백만 공고에서 출발해 수백 개로 좁히고, 수십 개로 랭킹하고, 최종 화면에서 다양성·공정성 제약을 반영해 재배열한다. LinkedIn의 공식 블로그와 [LiRank (arXiv:2402.06859)](https://arxiv.org/abs/2402.06859) 논문이 이 구조를 가장 명확하게 기록하고 있다.

| 단계 | 후보 수 | 대표 기법 | 목적 |
|------|:---:|---|---|
| Retrieval (L0) | 수억 → 수백 | Two-tower 임베딩, ANN, 그래프 워크, 휴리스틱 | 빠른 리콜 |
| Ranking (L1/L2) | 수백 → 수십 | XGBoost, DCNv2, MTL, GDMix | 정밀한 스코어 |
| Re-ranking | 수십 → 화면 | 베이지안 가중합, 다양성·공정성 제약 | 최종 배열 |

Retrieval은 "후보 풀을 만드는" 넓고 거친 단계, Ranking은 "소수의 후보를 정밀하게 줄세우는" 단계, Re-ranking은 "줄 세운 결과를 비즈니스 규칙에 맞춰 매만지는" 후처리 단계다. 각 단계가 해결하는 문제가 다르고, 따라서 모델이 예측하는 "확률"의 의미도 다르다. "채용될 가능성" 이라는 한 문장이 사실은 이 세 단계가 포갠 점수의 투영이다.

## Retrieval -- 수억 공고에서 수백 개로

Retrieval 단계의 표준은 Two-tower 모델이다. 지원자 타워는 프로필·스킬·행동 시퀀스를 벡터로 압축하고, 공고 타워는 JD·회사·직무를 벡터로 압축한다. 두 벡터의 내적(dot product)이 매칭 스코어이며, 공고 벡터들은 미리 인덱싱해 ANN(Approximate Nearest Neighbor) 검색으로 수백 개의 후보를 상수 시간에 뽑는다. 산업 공통의 기법이다 ([LinkedIn Engineering — Using Embeddings to Up Its Match Game for Job Seekers](https://www.linkedin.com/blog/engineering/platform-platformization/using-embeddings-to-up-its-match-game-for-job-seekers)).

2024년 LinkedIn이 공개한 JUDE는 이 구조에 LLM을 얹은 사례다. 7B 파라미터 Mistral을 LoRA로 파인튜닝하여 지원자·공고 타워를 각각 구축하고, 해시 기반 디듀플리케이션으로 추론량을 약 6배 줄였다. A/B 테스트 결과는 qualified application +2.07%, dismiss-to-apply -5.13%, 전체 application +1.91%로 보고되었다 ([LinkedIn Engineering — JUDE: LLM-Based Representation Learning for Job Recommendations](https://www.linkedin.com/blog/engineering/ai/jude-llm-based-representation-learning-for-linkedin-job-recommendations)).

주의할 점은, Retrieval은 정확한 랭킹이 아니라 리콜을 맡는다는 것이다. 여기서의 스코어는 "이 공고가 지원자의 관심 공간에 들어오는가"를 판정하는 대략적 좌표이지, 채용 확률이 아니다. 사용자가 받은 알림의 "80+개"는 이 단계를 통과한 모수에 가깝다.

## Ranking -- 클릭, 지원, 채용을 동시에 예측한다

Ranking 단계는 두 겹으로 쪼개져 있다. L1 Ranking에서 로지스틱 회귀나 XGBoost 같은 가벼운 모델로 후보 점수를 캘리브레이션(calibration)하고, L2 Ranking에서 심층 다중 작업 학습(Multi-Task Learning, MTL) 모델이 CTR·지원·소셜 액션 등 여러 타워를 동시에 예측한다. LinkedIn의 최신 공개 아키텍처는 LiRank로, DCNv2(Deep & Cross Network v2)에 어텐션과 잔차 연결(residual connection)을 결합한 Residual DCN을 중심에 둔다 ([LiRank (arXiv:2402.06859)](https://arxiv.org/abs/2402.06859)).

피처 측면에서는 세 갈래의 신호가 합류한다.

- **콘텐츠 신호**: 프로필 임베딩, 스킬 벡터, JD 임베딩, 회사·직무 카테고리.
- **활동 신호**: apply, save, dismiss 시퀀스를 순차 모델로 요약한 활동 임베딩. 2022년 LinkedIn 공개 실험에서 이 임베딩 하나만으로 confirmed hire가 약 5% 개선된 것으로 보고되었다 ([LinkedIn Engineering — Improving Job Matching with Machine-Learned Activity Features](https://engineering.linkedin.com/blog/2022/improving-job-matching-with-machine-learned-activity-features-)).
- **개인화 층**: GDMix가 전역 고정효과(fixed effect) 모델 위에 멤버·공고별 랜덤 효과(random effect) 모델을 얹는 혼합 효과(mixed effects) 구조로, 글로벌 모델과 개인 모델을 동시에 운영한다 ([LinkedIn Engineering — GDMix: A Deep Ranking Personalization Framework](https://www.linkedin.com/blog/engineering/member-customer-experience/gdmix-a-deep-ranking-personalization-framework)).

학계 선행 연구로는 LinkedIn이 2018년 공개한 [Towards Deep Learning for Talent Search (arXiv:1809.06473)](https://arxiv.org/abs/1809.06473)와 [Personalized Job Recommendation System at LinkedIn (RecSys 2017)](https://dl.acm.org/doi/10.1145/3109859.3109921)이 이 파이프라인의 초기 뼈대를 제시한다. engagement label(클릭·지원)과 relevance label(전문 평가자 주석)을 이중 감독으로 사용하는 설계가 RecSys 2017 논문에서 이미 정립되어 있다.

## Person-Job Fit -- 이력서와 JD의 의미론적 매칭

Ranking 내부의 핵심 서브 모듈 중 하나가 **Person-Job Fit(PJF)** 이다. 지원자의 이력서 텍스트와 공고 JD 텍스트를 각각 인코더로 표현한 뒤, 두 표현의 상호작용으로 매칭 점수를 계산하는 계열의 모델이다. 검색에서의 쿼리-문서 매칭을 "사람-공고" 쌍에 맞춰 변형한 분야에 가깝다.

학계 계보는 대략 다음과 같다.

- **PJFNN** -- CNN(Convolutional Neural Network) 기반 이중 인코더로 이력서와 JD의 표현을 학습. 리크루트먼트 NLP의 사실상 베이스라인 ([Person-Job Fit: Joint Representation Learning (arXiv:1810.04040)](https://arxiv.org/abs/1810.04040)).
- **APJFNN / BPJFNN** -- "어떤 요건을 충족시키는가"에 가중치를 두는 ability-aware 어텐션으로 확장.
- **PJFCANN** -- Co-Attention으로 이력서와 JD의 교차 참조를 명시적으로 다룸 ([PJFCANN (Neurocomputing 2022)](https://www.sciencedirect.com/science/article/abs/pii/S0925231222007299)).
- **도메인 적응 PJF** -- BOSS Zhipin이 EMNLP 2019에서 제안한 문장 수준 어텐션 + 도메인 적응 구조 ([BOSS Zhipin Domain Adaptation (EMNLP 2019)](https://aclanthology.org/D19-1487.pdf)).

LinkedIn의 프로덕션 시스템은 공식적으로 PJFNN 이름을 쓰지 않지만, co-attention과 활동 임베딩의 결합은 같은 사상을 대규모 스케일에 재구현한 것에 가깝다. 한국어권 구직 플랫폼이 이 계열을 응용할 때 대부분 참조하는 원형 논문들이 PJFNN과 그 확장들이다.

## Re-ranking -- 가중치, 다양성, 공정성

Ranking이 뽑아낸 수십 개 후보는 그대로 화면에 뿌려지지 않는다. Re-ranking 단계에서 여러 타워의 점수를 베이지안 최적화로 가중 결합하고, 동일 회사·동일 직무 중복 노출을 억제하며, 콜드 공고에 탐색 예산을 배정한다. 특히 **공정성(fairness)** 제약은 LinkedIn이 프로덕션 랭킹에 공식적으로 도입한 모듈 중 하나로, [Fairness-Aware Ranking in Search & Recommendation Systems with Application to LinkedIn Talent Search (KDD 2019, arXiv:1905.01989)](https://arxiv.org/abs/1905.01989)에서 성별 등 보호속성 기반의 분포 제약을 Top-k 결과에 주입하는 방법을 공개했다.

Re-ranking의 관점에서 보면, 최종 리스트에 오른 지원자·공고의 순서는 **"가장 확률이 높은 것"이 아니라 "제약 조건을 반영한 것"** 이다. 이 구간을 이해하지 못하면 확률 해석에 큰 오차가 생긴다.

## "채용될 가능성" 스코어의 실체

이제 사용자가 받은 알림 문장으로 돌아가자. LinkedIn이 [Help 문서](https://www.linkedin.com/help/linkedin/answer/a548337)에서 밝히는 Top Applicant의 정의는 다음과 같다.

- Premium 전용 기능이다.
- 특정 공고에 지원자가 10명 이상일 때만 활성화된다.
- 해당 공고 지원자 기준 **상위 50%**에 들면 Top Applicant로 분류된다.

즉 Top Applicant는 확률 보정된 채용 예측이 아니라, 공고 단위의 상대 랭킹이다. 사용자가 받은 푸시("80+개 공고에서 가능성이 가장 높다")는 이 공고별 상대 랭킹을 여러 공고에 걸쳐 집계한 메시지로, 공식 문서에는 이 집계 로직의 세부는 공개되어 있지 않다. 엔지니어링 블로그와 학계 논문을 종합해 합리적으로 추정하면, 다음 계층의 스코어가 합산된 결과다.

1. **매칭 스코어**: Two-tower 임베딩 유사도(JUDE)로 뽑은 후보 공고별 의미론적 적합도.
2. **클릭·지원 예측**: LiRank 계열 다중 작업 모델이 내놓는 apply 확률.
3. **프록시 채용 라벨**: 프로필 직책 업데이트 감지로 구성한 confirmed hire 신호에 학습된 downstream 예측치.
4. **공정성·다양성 보정**: Re-ranking 단계에서의 제약 반영.

알림에 등장하는 "가능성"은 채용으로 이어질 확률의 보정된 값이 아니라, apply 확률과 상대 순위에 프록시 채용 라벨을 얇게 덮은 종합 점수다. Confirmed hire 자체가 직접 관측되지 않고 프로필 업데이트 같은 간접 신호로 근사되기 때문에, 이 스코어는 구조적으로 과거 채용 패턴을 재현할 뿐 미래 채용 확률을 보장하지는 못한다.

## 목적함수가 바꾸는 "가능성"의 정의

같은 지원자·공고 쌍에 대해 시스템이 내놓는 점수는 어떤 목적함수를 최적화했는가에 따라 달라진다. 대표적인 후보들을 비교하면 다음과 같다.

| 목적함수 | 밀도 | 실제로 예측하는 것 |
|---|:---:|---|
| CTR | 매우 높음 | 제목과 회사명이 지원자의 주의를 끄는가 |
| Apply | 높음 | 지원자가 지원 버튼을 누를 만한가 |
| InMail 수락률 | 중간 | 채용담당자의 메시지에 지원자가 응답하는가 |
| Qualified Application | 낮음 | 지원이 유효한 서류 심사까지 도달하는가 |
| Confirmed Hire | 매우 낮음 | 실제로 채용으로 이어지는가 |

[LinkedIn Engineering — Building the Next Generation of Job Search](https://www.linkedin.com/blog/engineering/ai/building-the-next-generation-of-job-search-at-linkedin)는 최근 몇 년의 흐름이 CTR·Apply 같은 상위 깔때기 신호에서 qualified application·confirmed hire 같은 downstream outcome으로 목적함수가 내려가고 있음을 명시적으로 서술한다. 같은 "상위 지원자" 라벨이라도 2020년과 2026년의 그것이 같은 것을 의미하지 않는다.

## 스코어와 기회 사이의 간극

정리하면, "채용될 가능성이 가장 높다"는 한 문장 뒤에는 다음이 쌓여 있다.

- Retrieval이 수억 공고에서 수백 개로 좁힌 **리콜 스코어**.
- Multi-task ranking이 계산한 **apply 확률과 소셜 액션 확률**.
- Person-Job Fit 계열 인코더가 추정한 **텍스트 적합도**.
- GDMix의 개인화 레이어가 얹은 **멤버별 조정**.
- 프로필 업데이트로 추정한 **프록시 채용 라벨에 대한 예측**.
- Re-ranking의 공정성·다양성 제약과 상대 랭킹 임계값(상위 50%).

이 중 어느 하나도 "채용 확률"로 직접 해석되도록 캘리브레이션되어 있지 않다. 그럼에도 알림 문장은 수학적 확률인 것처럼 말한다. 이는 플랫폼이 사용자에게 제공하는 단일한 요약 메시지의 성격이지, 시스템 내부에서 실제로 사용되는 변수명이 아니다.

편향과 한계는 여러 문헌이 지적해 왔다. 행동 신호를 학습에 쓰는 순간 성별·연령 같은 보호속성이 행동 패턴을 통해 간접적으로 재현될 수 있으며 ([MIT Technology Review (2021)](https://www.technologyreview.com/2021/06/23/1026825/linkedin-ai-bias-ziprecruiter-monster-artificial-intelligence/)), 그래서 [Fairness-Aware Ranking (KDD 2019)](https://arxiv.org/abs/1905.01989) 같은 재랭킹 모듈이 요구된다. "상위 지원자"가 객관적 확률이 아니라 정책 선택이 녹아든 랭킹 지표라는 사실을 인식하는 것 자체가, 이 시스템을 읽는 가장 기본적인 출발점이다.

알림이 말하는 "가능성" 은 과거 데이터에 포착된 패턴의 투영이다. 그 투영이 유용한 신호라는 것과, 그 투영이 곧 기회라는 것은 다른 이야기다. 리크루트먼트 RecSys의 구조를 이해한다는 것은, 그 두 문장을 분리해 읽을 수 있게 된다는 뜻이기도 하다.

## 더 알면 좋은 개념

본문에서 가볍게만 언급한 용어의 배경. 필요에 따라 참조하면 된다.

### 임베딩(embedding)

사람·문서 같은 대상을 수백~수천 차원의 실수 벡터로 압축한 표현. 벡터 사이의 거리가 의미론적 유사도가 되도록 훈련된다. 추천·검색에서 모든 대상을 "좌표로 바꾼 다음 가까운 것을 찾는" 접근의 출발점.

### Two-tower 모델

지원자 쪽과 공고 쪽을 각각 독립된 두 신경망 "타워"로 따로 임베딩하는 구조. 두 타워의 출력 벡터를 내적해 매칭 스코어를 낸다. 공고 벡터를 미리 인덱싱해 두면 지원자 벡터 하나만 실시간으로 계산해 ANN 검색으로 상수 시간에 후보를 뽑을 수 있다. 리크루트먼트뿐 아니라 광고·영상 추천의 Retrieval 단계 표준.

### ANN (Approximate Nearest Neighbor)

수억 개 벡터 중 가장 가까운 소수를 근사적으로 빠르게 찾는 검색 기법. 정확한 최근접 검색은 비용이 크기 때문에 약간의 정확도를 양보하고 속도를 얻는다.

### LoRA

대형 모델의 원본 가중치는 고정한 채 저차원 어댑터만 덧붙여 학습하는 파인튜닝 기법. 풀파인튜닝 대비 학습·저장 비용이 훨씬 작아 LLM 기반 임베딩 타워를 현실 비용으로 운영할 수 있게 한다.

### 로지스틱 회귀 / XGBoost

전자는 확률 분류의 고전적인 선형 모델, 후자는 의사결정 나무를 여러 개 앙상블하는 고성능 테이블 모델. 둘 다 심층 신경망보다 가볍고 해석도 쉬워 Ranking 파이프라인의 L1 단계에서 자주 쓰인다.

### 캘리브레이션(calibration)

서로 다른 후보 소스가 매긴 점수를 같은 척도로 맞추는 보정 작업. 넓게는 모델이 낸 점수 0.7이 실제 빈도로도 70%에 해당하도록 맞추는 확률 보정까지 포함한다. 여러 모델의 출력을 합치려면 반드시 필요하다.

### 다중 작업 학습(MTL)

여러 목표를 하나의 네트워크로 동시에 예측하며 공유 표현을 학습하는 기법. 라벨이 희소한 태스크가 밀도 높은 태스크로부터 간접적으로 배울 수 있다는 장점이 있다. 리크루트먼트 Ranking에서 클릭·지원·confirmed hire를 한 모델로 동시에 예측하는 이유.

### DCNv2 / 잔차 연결

DCNv2(Deep & Cross Network v2)는 피처끼리의 교차 조합을 명시적으로 학습하도록 설계된 신경망. 잔차 연결(residual connection)은 입력을 출력에 더해 깊은 네트워크에서 학습을 안정화하는 구조로, ResNet에서 처음 대중화됐다. 둘을 결합한 Residual DCN이 LinkedIn LiRank의 중심.

### 고정 효과 / 랜덤 효과 / 혼합 효과

통계학의 혼합 효과(mixed effects) 모형에서 유래한 개념. 모든 관측에 공통으로 적용되는 전역 파라미터가 고정 효과, 그룹(사용자·공고 등) 단위로 개별 편차를 잡는 파라미터가 랜덤 효과. LinkedIn의 GDMix는 이 두 층을 분리해 글로벌 모델과 개인화 모델을 한 시스템에서 운영한다.

### engagement label / relevance label

전자는 클릭·지원 같은 사용자 행동에서 얻는 암묵적 학습 신호, 후자는 전문 평가자가 "이 매칭이 적합한가"를 주석한 명시적 학습 신호. 전자는 풍부하지만 편향되기 쉽고, 후자는 편향은 적지만 수가 적다. 두 신호를 함께 쓰는 이중 감독이 대규모 리크루트먼트 랭킹의 표준 설계.

### 인코더

텍스트·이미지·사용자 프로필 같은 입력을 벡터 표현으로 바꾸는 신경망. Person-Job Fit 계열 모델은 이력서 인코더와 JD 인코더를 따로 두는 이중 인코더 구조를 기본으로 한다.

### Co-Attention

한쪽 텍스트를 해석할 때 다른 쪽의 어느 부분을 참고할지 서로 계산해 주고받는 양방향 어텐션. 이력서 각 문장이 JD의 어느 요건에 대응하는지, 그 역방향까지 함께 학습된다.

### 도메인 적응(domain adaptation)

source 도메인에서 학습한 모델을 target 도메인에서도 잘 작동하도록 적응시키는 기법. 직군·산업이 달라지면 이력서와 JD의 어휘 분포도 달라지는데, 이 간극을 좁히기 위해 쓰인다.

### 베이지안 최적화

적은 횟수의 실험으로 최적 조합을 찾는 탐색 기법. 매번 결과를 관찰해 다음 실험 지점을 확률적으로 선택한다. Re-ranking의 타워 가중치 튜닝처럼 실험 비용이 큰 하이퍼파라미터 탐색에 자주 쓰인다.

### 콜드 공고 / Top-k

콜드 공고는 이력이 거의 없어 학습 신호가 부족한 신규 공고. 추천 시스템은 이런 공고에 별도의 탐색 예산을 배정해야 랭킹의 장기 다양성을 유지한다. Top-k는 추천 리스트의 상위 k개 결과를 가리키며, 공정성 제약은 대개 Top-k 단위로 적용된다.

### A/B 테스트

같은 기간 트래픽을 둘로 나눠 한쪽만 새 모델로 서빙하며 효과를 측정하는 온라인 실험 방법. 리크루트먼트 추천에서는 qualified application, dismiss-to-apply, confirmed hire 같은 downstream 지표의 변화량을 기준으로 판정한다.

## 참고문헌

**LinkedIn Engineering Blog**

- [AI Behind LinkedIn Recruiter Search and Recommendation Systems](https://www.linkedin.com/blog/engineering/recommendations/ai-behind-linkedin-recruiter-search-and-recommendation-systems)
- [Using Embeddings to Up Its Match Game for Job Seekers](https://www.linkedin.com/blog/engineering/platform-platformization/using-embeddings-to-up-its-match-game-for-job-seekers)
- [JUDE: LLM-Based Representation Learning for LinkedIn Job Recommendations](https://www.linkedin.com/blog/engineering/ai/jude-llm-based-representation-learning-for-linkedin-job-recommendations)
- [GDMix: A Deep Ranking Personalization Framework](https://www.linkedin.com/blog/engineering/member-customer-experience/gdmix-a-deep-ranking-personalization-framework)
- [Improving Job Matching with Machine-Learned Activity Features](https://engineering.linkedin.com/blog/2022/improving-job-matching-with-machine-learned-activity-features-)
- [Building the Next Generation of Job Search at LinkedIn](https://www.linkedin.com/blog/engineering/ai/building-the-next-generation-of-job-search-at-linkedin)
- [Pensieve -- Embedding Feature Platform](https://www.linkedin.com/blog/engineering/ai/pensieve)

**학술 논문**

- [LiRank: Industrial Large Scale Ranking Models at LinkedIn (arXiv:2402.06859)](https://arxiv.org/abs/2402.06859)
- [Towards Deep Learning for Talent Search (arXiv:1809.06473)](https://arxiv.org/abs/1809.06473)
- [Personalized Job Recommendation System at LinkedIn (RecSys 2017)](https://dl.acm.org/doi/10.1145/3109859.3109921)
- [Person-Job Fit: Joint Representation Learning (arXiv:1810.04040)](https://arxiv.org/abs/1810.04040)
- [PJFCANN: Person-Job Fit via Co-Attention (Neurocomputing 2022)](https://www.sciencedirect.com/science/article/abs/pii/S0925231222007299)
- [Fairness-Aware Ranking in Search & Recommendation Systems (KDD 2019, arXiv:1905.01989)](https://arxiv.org/abs/1905.01989)
- [Domain Adaptive Person-Job Fit at BOSS Zhipin (EMNLP 2019)](https://aclanthology.org/D19-1487.pdf)

**공식 문서 / 미디어**

- [LinkedIn Help -- Top Applicant Jobs](https://www.linkedin.com/help/linkedin/answer/a548337)
- [MIT Technology Review -- LinkedIn AI Bias (2021)](https://www.technologyreview.com/2021/06/23/1026825/linkedin-ai-bias-ziprecruiter-monster-artificial-intelligence/)
