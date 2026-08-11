# NINEWORKS SEO 운영 메모

## 확인된 사이트 정보

- 브랜드: NINEWORKS / 나인웍스
- 운영 도메인: `https://9works.kr/`
- GitHub 저장소: `jyhome1228-cyber/nineworks-website`
- GitHub Pages 기본 주소: `https://jyhome1228-cyber.github.io/nineworks-website/`
- 대표 언어: 한국어 (`ko` / `ko-KR`)
- 운영 방식: GitHub Pages + custom domain (`CNAME`)

## Google Search Console

1. `https://search.google.com/search-console`에서 `https://9works.kr/` 속성을 등록합니다.
2. HTML 메타 태그 방식으로 인증할 경우 Google이 발급한 실제 값을 `index.html`의 `<head>` 안에 추가합니다.

```html
<meta name="google-site-verification" content="GOOGLE에서 발급한 실제 값">
```

3. 인증 후 아래 사이트맵을 제출합니다.
   - `https://9works.kr/sitemap.xml`
   - `https://9works.kr/sitemap-services.xml`
4. URL 검사에서 `/`, `/about.html`, `/solutions.html`, `/portfolio.html`, `/develop.html` 등 핵심 페이지를 우선 확인합니다.

> 실제 인증값이 없기 때문에 저장소에는 가짜 verification 값을 넣지 않습니다.

## Naver Search Advisor

1. `https://searchadvisor.naver.com/`에서 `https://9works.kr/` 사이트를 등록합니다.
2. HTML 메타 태그 방식으로 인증할 경우 네이버가 발급한 실제 값을 `index.html`의 `<head>` 안에 추가합니다.

```html
<meta name="naver-site-verification" content="NAVER에서 발급한 실제 값">
```

3. 인증 후 `robots.txt`와 사이트맵 수집 상태를 확인합니다.
4. 요청 > 사이트맵 제출에서 아래 파일을 제출합니다.
   - `https://9works.kr/sitemap.xml`
   - `https://9works.kr/sitemap-services.xml`

## IndexNow

현재 저장소에는 IndexNow 실제 키를 넣지 않았습니다. GitHub Pages에서 IndexNow를 자동화하려면 실제 인증키 파일이 운영 도메인의 루트에서 접근 가능해야 하므로 키 없이 임의 자동화를 배포하지 않는 것이 안전합니다.

추후 적용 시 권장 설정:

- GitHub Secret: `INDEXNOW_KEY`
- 루트 인증 파일: `https://9works.kr/<INDEXNOW_KEY>.txt`
- 파일 내용: 실제 IndexNow key와 동일한 문자열
- 배포 완료 후 `https://api.indexnow.org/indexnow` 또는 지원 검색엔진 엔드포인트로 변경 URL 제출

GitHub Push → GitHub Pages Deploy → IndexNow URL Submit 순서로 연결하되, 실제 키가 준비된 뒤 적용합니다.

## Canonical 기준

- 홈 대표 URL: `https://9works.kr/`
- 하위 페이지: `https://9works.kr/<page>.html`
- 포트폴리오 상세: `https://9works.kr/portfolio-detail.html?work=<id>`
- 매거진 상세: `https://9works.kr/magazine-detail.html?article=<id>`
- `/index.html` 및 GitHub Pages 기본 주소는 대표 URL로 사용하지 않습니다.

## 검색 제외 페이지

아래 유형은 사이트맵에 넣지 않습니다.

- `admin.html`
- `privacy.html`
- `404.html`
- `research.html` → `solutions.html` 이동용
- `production.html` → `print.html` 이동용
- `digital-build.html` → `develop.html` 이동용
- 테스트/개발용 페이지

## 운영 시 체크

새 페이지를 추가할 때는 다음을 확인합니다.

- 고유한 `<title>`과 meta description
- `assets/js/seo.js`의 pageMap 등록
- canonical URL
- sitemap 등록 여부
- H1 1개를 중심으로 자연스러운 H2/H3 계층
- 의미 있는 이미지의 alt
- 내부 링크가 실제 `<a href="...">`인지 확인
- 관리자/테스트 페이지의 `noindex`
- 공유 이미지가 `assets/kakao-preview.png` 또는 실제 프로젝트 대표 이미지로 연결되는지 확인
