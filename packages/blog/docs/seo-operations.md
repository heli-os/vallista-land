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

세 요청 모두 `301`이어야 합니다. 이어서 아래로 최종 응답까지 몇 번 거치는지 확인합니다.

```sh
curl -sS -o /dev/null -L --max-time 20 \
  -w 'redirects=%{num_redirects} final=%{url_effective}\n' \
  'http://dataportal.kr/posts/?utm_source=redirect-test'
```

2026-08-25 기준 실측값입니다.

| 요청 | 홉 | 최종 |
| --- | ---: | --- |
| `http://dataportal.kr/posts/` | 1 | `https://dataportal.kr/posts/` |
| `http://www.dataportal.kr/posts/` | 2 | `https://dataportal.kr/posts/` |
| `https://www.dataportal.kr/posts/` | 1 | `https://dataportal.kr/posts/` |

쿼리 문자열은 세 경우 모두 보존됩니다.

`www` 에 HTTP로 들어오는 경우만 두 번 거칩니다. Always Use HTTPS가 먼저 같은 호스트의 HTTPS로 올리고, 그다음 `www` 에서 apex로 가는 기존 규칙이 걸리기 때문입니다. 이 홉을 줄이지 않기로 한 이유는 아래 HSTS 절에 적었습니다.

위 표는 첫 방문자 기준입니다. HSTS를 받은 브라우저는 요청을 보내기 전에 `http://`를 `https://`로 바꾸므로 재방문자는 첫 홉이 사라집니다. `curl` 에는 이 동작이 보이지 않습니다.

### HSTS

SSL/TLS → Edge Certificates → HTTP Strict Transport Security 에서 켭니다. 2026-08-25 적용값입니다.

```
strict-transport-security: max-age=2592000; includeSubDomains
```

| 항목 | 값 | 근거 |
| --- | --- | --- |
| Max Age | 1개월 (2592000) | 드롭다운의 최소 유효값. 최대 잠금 기간이 곧 최대 복구 시간이라 짧게 시작한다 |
| Apply HSTS policy to subdomains | 켬 | 아래 서브도메인이 모두 HTTPS 정상 |
| Preload | 끔 | 목록에서 빼는 데 몇 달이 걸린다. 사실상 되돌릴 수 없다 |
| No-Sniff header | 임의 | `X-Content-Type-Options: nosniff`, 부작용 없음 |

한 달간 문제가 없으면 6개월이나 1년으로 올립니다. Preload는 1년 이상을 요구하므로 그때 따로 판단합니다.

**되돌리는 법**: Max Age를 0으로 바꾸면 `max-age=0` 을 내보내고, 이후 재방문하는 브라우저부터 해제됩니다. 그동안 방문하지 않은 브라우저는 원래 기간이 끝나야 풀립니다.

#### includeSubDomains 의 조건

apex가 이 헤더를 내보내면 브라우저는 모든 서브도메인에 HTTPS를 강제합니다. 앞으로 만드는 서브도메인은 첫날부터 유효한 HTTPS를 갖춰야 합니다. 2026-08-25 확인 결과입니다.

| 호스트 | HTTPS | 헤더 |
| --- | --- | --- |
| `www` | 301로 apex | 있음 |
| `docs` | 200 | 있음 |
| `mail` | 301로 Dooray | 있음 |
| `cdn` | 404 (CloudFront, 인증서 정상) | 없음 |

`cdn` 은 Cloudflare 프록시를 거치지 않고 CloudFront로 바로 가서 헤더를 내보내지 않습니다. 그래도 apex의 `includeSubDomains` 때문에 브라우저는 이 호스트에도 HTTPS를 강제합니다. HTTPS가 정상 동작하므로 문제는 없습니다.

### www 에 HTTP로 들어오는 2홉은 두었습니다

Redirect Rule로 1홉으로 줄일 수 있지만 하지 않았습니다. Cloudflare에서 Redirect Rules와 Always Use HTTPS 중 무엇이 먼저 도는지에 따라 결과가 갈리고, 확실히 1홉으로 만들려면 Always Use HTTPS를 끄고 규칙 하나로 둘 다 처리해야 합니다.

```
expression: (http.host eq "www.dataportal.kr") or (not ssl)
target:     concat("https://dataportal.kr", http.request.uri.path)
```

검증된 토글을 직접 만든 규칙으로 대체하는 셈이라, 리다이렉트 한 홉을 줄이려고 지기에는 위험이 큽니다. HSTS를 켜면 재방문자 기준으로 이 홉이 사라지므로 실익도 작습니다.

### GitHub Pages 설정은 대안이 아닙니다

Pages 저장소의 `https_enforced`를 켜는 것은 같은 문제의 해법이 아닙니다. DNS가 Pages를 직접 가리키지 않아 GitHub이 `dataportal.kr` 인증서를 발급한 적이 없고(`https_certificate` 객체 없음), 이 설정은 Cloudflare에서 오리진으로 가는 구간에만 영향을 줍니다. Cloudflare의 SSL 모드가 Flexible인 상태에서 켜면 리다이렉트 루프가 생깁니다. 손대지 마세요.

## 배포 전 검사

```sh
corepack yarn workspace @vallista-land/blog build:blog
corepack yarn workspace @vallista-land/blog seo:check
```

`seo:check`는 indexable 페이지의 title, description, canonical, H1과 canonical 경로, 본문 링크 수를 검사합니다. 링크는 `article` 안쪽만 셉니다. 내비와 사이드바, 푸터는 모든 페이지에 같은 개수가 붙어서 전체 개수로 재면 본문이 아니라 크롬을 재게 됩니다. 구조화 데이터는 JSON-LD 블록이 최소 하나 있는지, 글 페이지에 `BlogPosting`이 있는지, 그 필수 필드가 채워졌는지를 문법 검사와 함께 봅니다. 마지막으로 draft 노출과 RSS 분리를 확인합니다.

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
