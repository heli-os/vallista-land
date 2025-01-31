---
title: "동시성 패턴: Fail-fast와 Single Flight 패턴 비교"
image: ./assets/concurrency-patterns.jpg
tags:
- IT 이모저모
series: "레딧에서는 무슨 이야기를 나눌까?"
date: 2025-01-31 02:58:12
draft: false
---

<iframe src="https://embed.reddit.com/r/Kotlin/comments/1icz7k8/whats_the_name_of_this_concurrency_concept"    scrolling="no" width="100%" height="316"></iframe>

## 원문 상황

- OP가 설명한 상황: 여러 비동기 작업이 있고, 그 중 하나라도 실패하면 다른 작업들을 취소하고 싶은 상황
- 구체적인 예시: 여러 API를 동시에 호출하는데, 하나라도 실패하면 다른 호출들을 취소

## 제안된 해결 방식들

![concurrency patterns](./assets/concurrency-patterns.jpg)

### 1. Structured Concurrency 활용

- coroutineScope 사용: `all-or-nothing` 방식으로 동작.
  - 하나의 자식 코루틴이 실패하면 모든 자식 코루틴을 즉시 취소함.
  - 실패를 상위로 전파하며, 트랜잭션과 같은 원자적 작업에 적합함.
- supervisorScope와는 차이점이 있음: 각 자식 코루틴이 독립적으로 동작함.
  - 실패를 격리시키고 부분적 실패를 허용함.
  - 독립적인 작업들을 실행할 때 적합함.

### 2. Single Flight 패턴

- 동일한 작업이 동시에 요청될 때 중복 실행을 방지
- 첫 번째 요청만 실제로 실행하고 나머지는 그 결과를 공유
- 실제 사용 사례:
  - 캐시가 없을 때 여러 요청이 동시에 들어오는 상황
  - API 호출 중복 방지
  - 리소스 낭비 방지
- Reference: [Golang의 singleflight](https://pkg.go.dev/golang.org/x/sync/singleflight)

## Conclusion

This discussion covers two important concurrency patterns in Programming(e.g. Kotlin):

1. The fail-fast pattern using coroutineScope, which cancels all operations when one fails
2. The Single Flight pattern, which deduplicates concurrent requests for the same operation

While they serve different purposes:

- Fail-fast focuses on error propagation and maintaining consistency
- Single Flight optimizes resource usage by preventing duplicate operations

Both patterns are valuable tools in building robust concurrent systems with Kotlin.
