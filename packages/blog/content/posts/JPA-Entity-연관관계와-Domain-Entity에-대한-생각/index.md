---
title: JPA Entity 연관관계와 Domain Entity에 대한 생각
image: ./assets/1.jpeg
tags:
- Web Backend
series: JPA
date: 2024-01-01 15:48:47
draft: true
---

![hero](assets/1.jpeg)

얼마 전 [JPA Entity 연관관계 어떻게 걸까요? + 엔티티 연관관계 PTSD](https://youtu.be/vgNHW_nb2mg)이라는 영상이 올라왔습니다. 평소 비슷한 질문을 많이 받고 있기도 하고, 최근에 관련하여 고민했던 경험이 있어 글로 해당 생각을 남겨보려고 합니다.

## Agenda

이번 글에서 이야기 해보려는 주요 아젠다는 아래와 같습니다.

1. Domain Entity는 무엇인가?
2. JPA Entity 연관관계는 어떻게 활용하는가
3. 도메인/비즈니스 로직 기반 개발

## Appendix

- [DB 의존 개발을 하지말자](https://youtu.be/gRrOUT-VeZ4)