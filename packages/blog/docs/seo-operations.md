# SEO 배포 운영 절차

## Cloudflare 리다이렉트

Cloudflare 대시보드의 **Rules → Redirect Rules → Bulk Redirects**에서 아래 세 항목을 영구 리다이렉트(301)로 등록합니다.

| 원본                         | 대상                     |
| ---------------------------- | ------------------------ |
| `http://dataportal.kr/`      | `https://dataportal.kr/` |
| `http://www.dataportal.kr/`  | `https://dataportal.kr/` |
| `https://www.dataportal.kr/` | `https://dataportal.kr/` |

세 항목 모두 하위 경로 일치와 쿼리 문자열 보존을 켜세요. 그러면 HTTP와 `www` 요청이 중간 호스트를 거치지 않고 한 번의 301로 HTTPS apex에 도착합니다.

배포 뒤 아래 명령으로 상태 코드, `Location`, 쿼리 문자열을 확인합니다.

```sh
curl -sSI 'http://dataportal.kr/posts/?utm_source=redirect-test'
curl -sSI 'http://www.dataportal.kr/posts/?utm_source=redirect-test'
curl -sSI 'https://www.dataportal.kr/posts/?utm_source=redirect-test'
```

각 응답은 `301`이어야 하며 `Location`은 `https://dataportal.kr/posts/?utm_source=redirect-test`여야 합니다. 이어서 `curl -sSIL`로 최종 응답까지 리다이렉트가 한 번인지 확인하세요.

## 배포 전 검사

```sh
corepack yarn workspace @vallista-land/blog build:blog
corepack yarn workspace @vallista-land/blog seo:check
```

`seo:check`는 indexable 페이지의 title, description, canonical, H1과 canonical 경로, 페이지별 링크 수를 검사합니다. 구조화 데이터는 JSON-LD 블록이 최소 하나 있는지, 글 페이지에 `BlogPosting`이 있는지, 그 필수 필드가 채워졌는지를 문법 검사와 함께 봅니다. 마지막으로 draft 노출과 RSS 분리를 확인합니다.

홈, 두 주제 허브, 일반 글, 책 챕터는 다음 도구에도 각각 입력합니다.

- Schema.org Validator: `https://validator.schema.org/`
- Google Rich Results Test: `https://search.google.com/test/rich-results`

## GSC 대상 선정

Search Console에서 최근 90일과 직전 90일의 페이지, 검색어, 클릭, 노출, CTR, 평균 순위를 CSV로 내보냅니다. 원본은 저장소에 올라가지 않는 `.context/seo/`에 저장하세요.

```sh
corepack yarn workspace @vallista-land/blog seo:gsc \
  --current ../../.context/seo/current.csv \
  --previous ../../.context/seo/previous.csv \
  --out ../../.context/seo/targets.md
```

분석기는 평균 순위 4~20위에 있는 페이지를 먼저 고르고, 노출과 같은 순위대의 CTR 차이를 반영해 주제별 최대 10개를 제안합니다. 대상이 모자라면 노출순으로 채웁니다. `query` 열이 있으면 같은 검색어에 걸린 글도 찾아 대표 글을 표시합니다.

## 배포 뒤 측정

1. Search Console에서 두 허브와 수정한 글을 URL 검사로 확인합니다.
2. `https://dataportal.kr/sitemap-index.xml`을 다시 제출합니다.
3. PageSpeed Insights나 Search Console Core Web Vitals에서 LCP, INP, CLS의 배포 전 기준값을 기록합니다.
4. 4주, 8주, 12주에 같은 길이의 직전 기간과 클릭, 노출, CTR, 평균 순위를 비교합니다.
5. 두 번 연속 28일 구간에서 클릭 또는 노출이 늘고, 4~20위 검색어가 상위 10위로 이동했는지 확인합니다.

GSC 원본이 없는 상태에서는 기존 글 본문을 일괄 수정하지 않습니다. `targets.md`가 나온 뒤 최대 20개만 골라 문제와 접근법과 결과, 실제 경험과 적용 조건과 반례를 필요한 만큼 보완하세요.
