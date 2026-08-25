# SEO 배포 운영 절차

## HTTPS 강제

`dataportal.kr`은 Cloudflare 프록시를 거칩니다. apex와 `www` 모두 Cloudflare IP로 해석되고 엣지 인증서도 Cloudflare가 발급한 것입니다. TLS를 Cloudflare가 종료하므로 클라이언트가 보는 리다이렉트는 Cloudflare에서만 정할 수 있습니다.

**Cloudflare 대시보드 → `dataportal.kr` → SSL/TLS → Edge Certificates → Always Use HTTPS를 켜세요.** 이 토글 하나로 아래 세 경우가 모두 정리됩니다. 하위 경로와 쿼리 문자열은 자동으로 보존되므로 Bulk Redirects를 따로 등록할 필요가 없습니다. 같은 화면의 HSTS도 함께 켜면 헤더 수준에서 고정됩니다.

API로 켜려면 `Zone` → `Zone Settings` → `Edit` 권한을 `dataportal.kr` 존에만 부여한 토큰으로 아래를 호출합니다.

```sh
curl -X PATCH \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/always_use_https" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H 'Content-Type: application/json' \
  --data '{"value":"on"}'
```

### 검증

```sh
for u in \
  'http://dataportal.kr/posts/?utm_source=redirect-test' \
  'http://www.dataportal.kr/posts/?utm_source=redirect-test' \
  'https://www.dataportal.kr/posts/?utm_source=redirect-test'; do
  printf '%s\n  code=%s location=%s\n' "$u" \
    "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$u")" \
    "$(curl -sS -o /dev/null -w '%{redirect_url}' --max-time 15 "$u")"
done
```

세 요청 모두 `301`이고 `location`이 `https://dataportal.kr/posts/?utm_source=redirect-test`여야 합니다. 이어서 아래로 최종 응답까지 리다이렉트가 한 번인지 확인합니다.

```sh
curl -sS -o /dev/null -L -w 'redirects=%{num_redirects} final=%{url_effective}\n' \
  'http://dataportal.kr/posts/?utm_source=redirect-test'
```

`www` 에서 apex로 가는 규칙은 이미 동작합니다(2026-08-25 확인). 남은 것은 HTTP를 HTTPS로 올리는 한 단계입니다. 그때까지는 같은 문서가 http와 https 양쪽에서 200으로 서빙되며, 정본은 문서의 canonical 태그만으로 표시됩니다.

### GitHub Pages 설정은 대안이 아닙니다

Pages 저장소의 `https_enforced`를 켜는 것은 같은 문제의 해법이 아닙니다. DNS가 Pages를 직접 가리키지 않아 GitHub이 `dataportal.kr` 인증서를 발급한 적이 없고(`https_certificate` 객체 없음), 이 설정은 Cloudflare에서 오리진으로 가는 구간에만 영향을 줍니다. Cloudflare의 SSL 모드가 Flexible인 상태에서 켜면 리다이렉트 루프가 생깁니다. 손대지 마세요.

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
