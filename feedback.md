# FAIL

**가중 평균: 5.5 / 10.0** (PASS 기준: 7.0)

| 기준 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 기능 완성도 | 6.0 | 30% | 1.80 |
| 디자인 품질 | 5.0 | 30% | 1.50 |
| 사용성 | 4.0 | 20% | 0.80 |
| 코드 품질 | 7.0 | 20% | 1.40 |

---

## 1. 기능 완성도 — 6.0 / 10 (가중치 30%)

### 정상 작동하는 기능 (SSR HTML 기준)

| 페이지 | 상태 | 비고 |
|--------|------|------|
| `/` (Landing) | OK | Navbar, Banner, Hero, FeatureTabs(3탭), ValueProposition, FeatureSection+Testimonial 교차배치, CTA, Footer |
| `/pricing` | OK | Free/Pro 카드, Pro "Coming Soon" (PADDLE_API_KEY 미설정) |
| `/blog` | OK | 글 목록, 태그 필터(All/getting-started/tutorial), 1개 예시 글 |
| `/blog/hello-world` | OK | MDX 렌더링, 코드 하이라이팅, TOC 자동 생성, Callout 컴포넌트 |
| `/privacy` | OK | 9개 섹션 Privacy Policy, siteConfig 변수 치환 정상 |
| `/terms` | OK | 9개 섹션 Terms of Service |
| `/about` | OK | headline, story, mission, values(3개), team(2명) |
| `/dashboard/settings` | OK | devSession fallback, 프로필 카드, 위험 영역, i18n 한국어 |
| `sitemap.ts` / `robots.ts` | OK | 파일 존재 확인 |
| `loading.tsx` | OK | 글로벌 + 대시보드 loading 존재 |
| `error.tsx` / `not-found.tsx` | OK | 에러 바운더리 + 404 페이지 구비 |

### 이전 QA 대비 수정 완료

| 이슈 | 수정 위치 | 상태 |
|------|----------|------|
| Settings devSession 불일치 | `app/dashboard/settings/page.tsx:19-30` | **수정됨** |
| SignInButton label 하드코딩 | `features/auth/components/SignInButton.tsx:9` + `Navbar.tsx:57,62,85,86` | **수정됨** — "Log in"/"Sign Up" 구분 |
| Footer 더블 피리어드 | `features/landing/components/Footer.tsx:107` | **수정됨** — `.replace(/\.$/, "")` |
| Deep import 위반 | `app/dashboard/settings/page.tsx:4` | **수정됨** — `@/features/billing`에서 import |

### 현재 깨진 기능

| 심각도 | 이슈 | 위치 | 증상 |
|--------|------|------|------|
| **Critical** | Dashboard 메인 500 에러 | `app/dashboard/page.tsx` | `Cannot find module './219.js'` — webpack 서버사이드 청크 에러. 페이지 완전 불능 |
| **Critical** | CSS/JS 리소스 404 | 전체 페이지 | `layout.css`, `main-app.js`, `app-pages-internals.js` 등 모든 페이지에서 5개+ 리소스 404. SSR HTML은 렌더링되나 스타일/인터랙션 미작동 |
| **Major** | 블로그 태그 연결 표시 | `/blog` BlogCard | "getting-startedtutorial" — 태그 사이 구분자 없이 연결 출력 |
| **Major** | Feature 링크 데드 | `config/site.ts:162,169,176,198` | `/features/analytics`, `/features/automation`, `/features/collaboration` → 404 |
| **Minor** | favicon 미존재 | `public/` 비어있음 | PRD에 `public/favicon.ico` 명시 |
| **Minor** | FeatureTabs 이미지 전부 null | `config/site.ts:163,171,179` | 이모지 플레이스홀더(📊, ⚡, 👥)만 표시 |

### 참고: CSS/JS 404에 대하여

`layout.css?v=1774510653316` 형태의 URL에서 timestamp가 매 요청마다 변경됨. 이는 **dev 서버 HMR 캐시 불일치** 가능성이 높음. `.next` 캐시 삭제 후 dev 서버 재시작으로 해결될 수 있음. 단, 현재 실행 중인 상태에서는 모든 페이지의 CSS/JS가 로드되지 않아 앱이 사실상 사용 불가.

---

## 2. 디자인 품질 — 5.0 / 10 (가중치 30%)

### CSS 미로드로 시각적 평가 제한

모든 페이지에서 Tailwind CSS가 적용되지 않은 unstyled HTML로 렌더링됨. 코드 기반으로만 디자인 의도를 평가.

### 코드 기반 평가

| 항목 | 평가 | 파일 |
|------|------|------|
| **AI 슬롭 그라디언트** | `#6366f1 → #a855f7 → #ec4899` (인디고-보라-핑크) — 전형적 AI 생성 패턴. configurable하므로 경감 | `config/site.ts:138` |
| **폰트** | Geist Sans + Geist Mono — 현대적, Vercel 생태계 표준 | `app/layout.tsx:1-2` |
| **Hero 배경** | dub.co 스타일 GridPattern + 멀티컬러 gradient blob (하드코딩 색상) | `Hero.tsx:13-29` |
| **Navbar** | 스크롤 시 backdrop-blur + 반응형 Sheet 메뉴 — 잘 설계됨 | `Navbar.tsx:29-33` |
| **다크모드** | next-themes + CSS 변수 체계적 구성 | `ThemeProvider.tsx` |
| **이모지 사용** | FeatureTabs 플레이스홀더에 📊, ⚡, 👥 — 감점 대상 | `FeatureTabs.tsx:53` |
| **시각 자산** | logos[], avatars=null, images=null — 실제 이미지 전무 | `config/site.ts` 전체 |

### 점수 산출

| 요인 | 점수 영향 |
|------|----------|
| CSS 404 — 디자인 확인 불가 | -2.0 |
| AI 슬롭 그라디언트 (보라-핑크) | -1.0 |
| 이미지/에셋 전무 (빈 플레이스홀더) | -1.0 |
| 이모지 플레이스홀더 | -0.5 |
| dub.co 스타일 Hero 패턴 (GridPattern + blur) | +1.0 |
| Navbar 디자인 (blur, responsive) | +0.5 |
| 일관된 neutral 팔레트 + 간격 | +0.5 |
| Geist 폰트 + shadcn/ui 컴포넌트 | +0.5 |
| 다크모드 체계적 구성 | +0.5 |
| 기저 | 6.5 |
| **합계** | **5.0** |

---

## 3. 사용성 — 4.0 / 10 (가중치 20%)

### 치명적 UX 결함

| 이슈 | 심각도 | 설명 |
|------|--------|------|
| **핵심 CTA 플로우 파괴** | Critical | "Get Started Free" / "Start for free" → `/dashboard` → 500 에러. 첫 방문자의 핵심 전환 경로가 완전히 깨짐 |
| **CSS 미로드** | Critical | 모든 페이지가 unstyled HTML — 일반 유저 기준 사용 불가 |
| **데드 Feature 링크** | Major | FeatureTabs/FeatureSection의 "Learn more" → `/features/*` 404 |

### 양호한 UX 요소

| 항목 | 설명 |
|------|------|
| Navbar 구성 | Features, Pricing, Blog — 명확한 3단 네비게이션 |
| 로그인/회원가입 분리 | "Log in"(ghost) / "Sign Up"(filled) 시각적+텍스트 구분 (**이전 QA에서 수정됨**) |
| 대시보드 i18n | 사이드바 한국어 (홈, 설정) |
| 블로그 태그 필터 | 즉시 동작하는 필터 탭 |
| 블로그 TOC | 우측 "On this page" 목차 자동 생성 |
| 모바일 메뉴 | Sheet 기반 햄버거 + 올바른 label ("Log in"/"Sign Up") |
| Banner dismiss | 닫기 버튼으로 공지 숨기기 |
| devSession | OAuth 미설정 시 자동 목업 세션으로 개발 편의성 |
| Settings 정상 | 이전 QA 크래시 이슈 수정됨. 프로필 표시 + 위험 영역 정상 |

### 점수 산출

| 요인 | 점수 영향 |
|------|----------|
| 기저 (구조적 UX 양호) | 7.0 |
| Dashboard 500으로 핵심 플로우 파괴 | -2.0 |
| CSS 미로드로 시각적 사용 불가 | -1.5 |
| 데드 Feature 링크 | -0.5 |
| 이전 QA 이슈 4건 수정 | +1.0 |
| **합계** | **4.0** |

---

## 4. 코드 품질 — 7.0 / 10 (가중치 20%)

### 강점

| 항목 | 설명 | 파일 |
|------|------|------|
| **Feature 아키텍처** | 9개 Feature 모듈 독립 구성, barrel export 일관 적용 | `features/*/index.ts` |
| **의존성 방향** | `app/ → features/ → shared/ → config/` 계층 준수 | 전체 |
| **siteConfig 중앙화** | 모든 콘텐츠 `config/site.ts` 경유, 하드코딩 없음 | `config/site.ts` |
| **TypeScript 타입** | `SiteConfig` 인터페이스 127줄, 전체 설정 타입 안전 | `config/site.ts:1-127` |
| **Server/Client 분리** | `"use client"` 필요한 컴포넌트만 선언 | `Navbar.tsx`, `FeatureTabs.tsx` |
| **Feature 토글** | `isBillingEnabled`으로 환경변수 기반 조건부 활성화 | `features/billing/` |
| **에러 바운더리** | 글로벌 `error.tsx` + `not-found.tsx` + 대시보드별 로딩/에러 | `app/` |
| **i18n** | `next-intl` 기반 대시보드 번역 | `messages/` |
| **interleave 유틸** | Section + Testimonial 교차 배치 로직 깔끔 분리 | `features/landing/lib/renderSections.ts` |
| **devSession 패턴** | 환경변수 기반 개발 모드 인증 우회 — 실용적 | `dashboard/layout.tsx:7-18` |
| **이전 QA 이슈 수정** | deep import 위반, auth crash, label 하드코딩, 더블 피리어드 모두 수정됨 | 각 파일 |

### 문제점

| 심각도 | 이슈 | 파일:라인 | 설명 |
|--------|------|-----------|------|
| **High** | Dashboard 런타임 에러 | `app/dashboard/page.tsx` | `Cannot find module './219.js'` — 서버사이드 webpack 청크 에러 |
| **Medium** | Deep import (layout) | `app/layout.tsx:5` | `@/features/billing/components/PaddleProvider` — barrel export 우회 |
| **Low** | `<img>` 태그 사용 | `features/landing/components/LogoCloud.tsx:17` | `<img>` 대신 `next/image` 권장 |
| **Low** | 계정 삭제 미구현 | `app/dashboard/settings/page.tsx:81` | onClick 핸들러 없음, 확인 다이얼로그 없음 |

---

## 콘솔 에러 요약

### 전체 페이지 공통 (CSS/JS 404)
```
[ERROR] layout.css?v=... → 404 Not Found
[ERROR] main-app.js?v=... → 404 Not Found
[ERROR] app-pages-internals.js → 404 Not Found
[ERROR] app/{route}/page.js → 404 Not Found
[ERROR] app/error.js → 404 Not Found
```

### `/dashboard` 전용 (500)
```
[ERROR] 500 Internal Server Error
Error: Cannot find module './219.js'
Require stack: ...next/dist/server/lib/start-server.js:226:13
```

---

## 개선 우선순위

| 순서 | 작업 | 예상 점수 영향 | 난이도 |
|------|------|---------------|--------|
| 1 | **`.next` 캐시 삭제 + dev 서버 재시작** — CSS/JS 404 및 dashboard 500 해결 | +2.5~3.0 | 1분 |
| 2 | **Feature 링크 수정** — `/features/*` → 유효한 경로나 `#` 앵커 | +0.3 | 5분 |
| 3 | **블로그 태그 구분자** — BlogCard에서 태그 사이 공백/배지 추가 | +0.2 | 5분 |
| 4 | **favicon.ico 추가** | +0.1 | 2분 |
| 5 | **PaddleProvider deep import 수정** — barrel export 경유 | +0.1 | 2분 |
| 6 | **AI 슬롭 그라디언트 교체** — 보라-핑크 → 절제된 단색 | +0.5 | 10분 |
| 7 | **FeatureTabs 플레이스홀더 개선** — 이모지 → SVG 일러스트 | +0.3 | 15분 |

> **PASS 달성 전략**: 1번(서버 재시작)만으로 CSS/사용성 점수가 대폭 개선되어 7.0+ 도달 가능성 높음.
> 서버 재시작 후 재평가 권장.

---

*QA 수행일: 2026-03-26*
*평가 환경: localhost:3000 (Next.js dev server)*
*평가 기준: prd.md 스펙 대비*
*이전 QA: 2026-03-26 (점수 6.6, 7건 이슈 중 4건 수정 확인)*
