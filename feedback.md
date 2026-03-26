# PASS

**가중 평균: 7.6 / 10.0** (PASS 기준: 7.0)

| 기준 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 기능 완성도 | 8.0 | 30% | 2.40 |
| 디자인 품질 | 7.0 | 30% | 2.10 |
| 사용성 | 7.5 | 20% | 1.50 |
| 코드 품질 | 8.0 | 20% | 1.60 |

> **참고**: 이전 QA(동일 날짜)에서 5.5점 FAIL 판정을 받았으나, `.next` 캐시 오염으로 인한 CSS/JS 404 및 dashboard 500이 원인이었음. 캐시 삭제 후 재시작(port 3001)하여 clean state에서 재평가함.

---

## 1. 기능 완성도 — 8.0 / 10 (가중치 30%)

### 정상 작동 확인된 기능

| 페이지 / 기능 | 상태 | 검증 방법 |
|--------------|------|----------|
| Landing - Navbar (blur, 반응형) | OK | 스크린샷 + 스냅샷 |
| Landing - Banner (닫기) | OK | 클릭 테스트 |
| Landing - Hero (CTA 2개, GridPattern) | OK | 스크린샷 |
| Landing - FeatureTabs (3탭 전환) | OK | 스냅샷 확인 |
| Landing - ValueProposition (highlights 3개) | OK | 스크린샷 |
| Landing - FeatureSection + Cards (3열) | OK | 스크린샷 |
| Landing - Testimonial (교차 배치) | OK | 스크린샷 |
| Landing - CTA (그라디언트 배경) | OK | 스크린샷 |
| Landing - Footer (4컬럼) | OK | 스크린샷 + 스냅샷 |
| Pricing (Free/Pro + Coming Soon) | OK | 스크린샷 — Pro 버튼 disabled |
| Blog 목록 (태그 필터) | OK | 스크린샷 — 배지 분리 표시 정상 |
| Blog 상세 (MDX, 코드 하이라이팅, TOC) | OK | 스크린샷 — shiki 코드블록, sticky TOC |
| Blog - Callout 컴포넌트 | OK | 스크린샷 — "Tip" 박스 정상 |
| About (headline, story, mission, values, team) | OK | 스냅샷 |
| Privacy Policy (9개 섹션) | OK | 스냅샷 — siteConfig 변수 치환 정상 |
| Terms of Service (9개 섹션) | OK | 스냅샷 |
| Dashboard 빈 상태 UI (i18n 한국어) | OK | 스크린샷 — "아직 프로젝트가 없습니다" |
| Dashboard 사이드바 + 탑바 | OK | 스크린샷 — 홈/설정, DU 아바타 |
| Dashboard Settings (프로필 + 위험 영역) | OK | 스크린샷 — devSession "Dev User" |
| "프로젝트 만들기" 버튼 피드백 | OK | 클릭 테스트 — "Coming Soon!" 2초 표시 |
| Dev mock session | OK | GOOGLE_CLIENT_ID 미설정 시 자동 활성 |
| OG Image (`/api/og`) | OK | 서버 로그 200 확인 |
| icon.svg (파비콘) | OK | 서버 로그 200 — SVG 아이콘 사용 |
| Sitemap / robots.txt | OK | 파일 존재 확인 |
| 다크모드 (next-themes) | OK | 코드 확인 |
| 콘솔 에러 | **0건** | 모든 페이지에서 에러 없음 |

### 이전 QA 대비 수정 확인

| 이전 이슈 | 수정 상태 | 위치 |
|----------|----------|------|
| Settings devSession 불일치 | **수정됨** | `app/dashboard/settings/page.tsx:19-30` |
| SignInButton label 하드코딩 | **수정됨** | `SignInButton.tsx:9` — label prop |
| Footer 더블 피리어드 | **수정됨** | `Footer.tsx:107` — `.replace(/\.$/, "")` |
| Deep import (settings) | **수정됨** | `settings/page.tsx:4` — barrel export 경유 |

### 남은 이슈

| 심각도 | 이슈 | 위치 | 감점 |
|--------|------|------|------|
| Minor | Feature 링크 데드 | `config/site.ts:162,169,176,198` — `/features/*` 라우트 미존재 | -0.5 |
| Minor | FeatureTabs 이미지 null | `config/site.ts:163,171,179` — 이모지 플레이스홀더 | -0.3 |
| Minor | Deep import (layout) | `app/layout.tsx:5` — PaddleProvider barrel export 미경유 | -0.2 |

---

## 2. 디자인 품질 — 7.0 / 10 (가중치 30%)

### 긍정적 요소

| 항목 | 평가 | 증거 |
|------|------|------|
| **전체 톤** | dub.co 레퍼런스에 충실한 클린 미니멀 디자인 | 스크린샷 전체 |
| **Hero 섹션** | GridPattern + 미세 gradient blob — 프로페셔널하고 차별화됨 | `qa-landing-styled.png` 상단 |
| **Navbar** | 깔끔한 구성, "Log in"(텍스트) + "Sign Up"(검정 버튼) 시각적 구분 명확 | 스크린샷 헤더 |
| **타이포그래피** | Geist Sans/Mono, 일관된 크기/무게 계층 | 전체 |
| **컬러 팔레트** | neutral(white/gray/black) 기반, primary 색상 절제된 사용 | 스크린샷 |
| **블로그 상세** | 코드 블록(dark theme), Callout(amber accent), TOC — 높은 가독성 | `qa-blog-detail-styled.png` |
| **Dashboard** | 사이드바/메인 분리 깔끔, i18n 한국어 자연스러움 | `qa-dashboard-styled.png` |
| **Footer** | 4컬럼 그리드, 둥근 카드 스타일, backdrop-blur | 스크린샷 하단 |

### 감점 요소

| 항목 | 감점 | 상세 |
|------|------|------|
| AI 슬롭 그라디언트 | -0.5 | CTA 배경 `#6366f1→#a855f7→#ec4899` (보라-핑크). 다만 Hero에서는 opacity 40%로 절제되어 사용되고, configurable하므로 경감 |
| 시각적 에셋 부재 | -1.0 | FeatureTabs 이모지 📊, testimonial avatar 이니셜만, team 사진 없음. 보일러플레이트로서 최소 1개 데모 이미지 필요 |
| FeatureSection 이미지 없음 | -0.5 | `image: null`이라 이미지 영역 자체가 없음. 카드만으로 구성되어 시각적 밀도 낮음 |
| 뷰포트 활용도 | -0.5 | `max-w-screen-lg`(1024px)로 와이드 스크린에서 좌우 빈 공간 |
| Pricing 카드 단조 | -0.5 | 두 카드 크기/강조 동일. Pro에 "추천" 배지나 크기 차이 없어 구분 약함 |

---

## 3. 사용성 — 7.5 / 10 (가중치 20%)

### 긍정적 요소

| 항목 | 설명 |
|------|------|
| 핵심 플로우 정상 | "Get Started Free" → dashboard → 빈 상태 UI 정상 도달 |
| 네비게이션 명확 | Navbar 3개 링크 + 2개 auth 버튼, 역할 구분 명확 |
| Dashboard 안내 | 빈 상태에서 "첫 번째 프로젝트를 만들어 보세요" + CTA |
| 버튼 피드백 | "프로젝트 만들기" → "Coming Soon!" 2초간 표시 후 원복 |
| Blog UX | 태그 필터 즉시 동작, "Back to blog" 링크, sticky TOC |
| i18n 한국어 | 대시보드 UI 자연스러운 한국어 번역 |
| 모바일 대응 | 햄버거 메뉴(Sheet), 반응형 레이아웃 |
| Auth 분기 | "Log in" / "Sign Up" 텍스트 구분으로 사용자 혼란 방지 |

### 감점 요소

| 항목 | 감점 | 상세 |
|------|------|------|
| Feature 데드 링크 | -0.5 | "Learn more" → `/features/analytics` 등 → 404 |
| "계정 삭제" 무확인 | -0.5 | `settings/page.tsx:81` — 확인 다이얼로그 없음 (현재 미구현이라 무동작이긴 하나 UX 결함) |
| Footer "Features" 앵커 | -0.3 | `#features`는 랜딩 외 페이지에서 작동 안 함 |
| Topbar 정보 부족 | -0.2 | 현재 페이지명/앱 이름 표시 없이 아바타 버튼만 존재 |

---

## 4. 코드 품질 — 8.0 / 10 (가중치 20%)

### 강점

| 항목 | 설명 |
|------|------|
| **Feature 아키텍처** | 9개 Feature 모듈, 일관된 barrel export, 의존성 방향 준수 |
| **siteConfig 패턴** | 모든 콘텐츠 중앙 집중, 127줄 TypeScript 인터페이스로 타입 안전 |
| **Server/Client 분리** | `"use client"` 최소 사용 (Navbar, FeatureTabs, DashboardPage만) |
| **devSession** | 환경변수 기반 개발 모드 인증 우회 — layout과 settings 모두 일관 적용 |
| **Feature 토글** | `isBillingEnabled`, `PADDLE_API_KEY` 기반 조건부 UI — 깔끔 |
| **에러 경계** | `error.tsx`, `not-found.tsx`, `loading.tsx` — 글로벌 + 대시보드별 |
| **i18n** | `next-intl` 서버/클라이언트 양쪽 정상 사용 |
| **MDX 파이프라인** | rehype-pretty-code + Callout + TableOfContents — 잘 구성됨 |
| **이전 QA 수정** | 4건 버그 모두 수정, 코드 품질 개선 확인 |

### 감점 요소

| 심각도 | 이슈 | 파일:라인 | 감점 |
|--------|------|-----------|------|
| Medium | Deep import 위반 | `app/layout.tsx:5` — `@/features/billing/components/PaddleProvider` | -0.3 |
| Medium | 테스트 미구축 | 프로젝트 전체 | -0.4 (CLAUDE.md에 "테스트 미구축 상태" 명시) |
| Low | `<img>` 태그 사용 | `LogoCloud.tsx:17`, `FeatureTabs.tsx:47` | -0.1 |
| Low | "계정 삭제" 미구현 | `settings/page.tsx:81` — handler 없음 | -0.2 |

---

## 콘솔 에러 요약

| 페이지 | 에러 수 |
|--------|---------|
| `/` (Landing) | 0 |
| `/pricing` | 0 |
| `/blog` | 0 |
| `/blog/hello-world` | 0 |
| `/dashboard` | 0 |
| `/dashboard/settings` | 0 |

---

## 이전 QA와의 비교

| 항목 | 이전 (stale cache) | 현재 (clean restart) |
|------|-------------------|---------------------|
| CSS 로딩 | 404 전체 실패 | 정상 로드 |
| Dashboard `/dashboard` | 500 에러 | 200 정상 |
| 콘솔 에러 | 5~8개/페이지 | 0개/페이지 |
| 가중 평균 | 5.5 (FAIL) | **7.6 (PASS)** |

**근본 원인**: `.next` 캐시 디렉토리의 webpack 청크 파일 오염. `rm -rf .next && pnpm dev`로 해결.

---

## 추가 개선 권장사항

| 우선순위 | 작업 | 예상 효과 |
|---------|------|----------|
| 1 | Feature 링크 수정 (`/features/*` → `/#features` 또는 제거) | 데드 링크 제거 |
| 2 | PaddleProvider barrel export 경유로 변경 | CLAUDE.md 컨벤션 준수 |
| 3 | "계정 삭제"에 AlertDialog 추가 | UX 안전성 |
| 4 | FeatureTabs 데모 이미지 1개 추가 | 시각적 완성도 |
| 5 | Pricing Pro 카드에 "추천" 배지 추가 | 전환율 향상 |
| 6 | AI 슬롭 그라디언트 → 단색 또는 neutral 톤으로 교체 | 디자인 차별화 |
| 7 | E2E 테스트 추가 (`playwright.config.ts` 존재하나 테스트 없음) | 회귀 방지 |

---

*QA 수행일: 2026-03-26*
*평가 환경: localhost:3001 (Next.js 15.5.14 dev server, clean `.next` restart)*
*평가 기준: prd.md 스펙 대비*
*스크린샷: qa-landing-styled.png, qa-pricing-styled.png, qa-dashboard-styled.png, qa-settings-styled.png, qa-blog-styled.png, qa-blog-detail-styled.png*
