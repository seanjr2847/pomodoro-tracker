FAIL

# QA Report - Factory Boilerplate

- **Date**: 2026-03-26
- **Frontend**: http://localhost:3000
- **Backend**: N/A (Next.js API Routes로 통합)
- **Weighted Score**: **6.6 / 10.0** (PASS 기준: 7.0)

---

## 1. 기능 완성도 — 7.0 / 10 (가중치 30%)

### 작동 확인된 기능

| 기능 | 상태 | 비고 |
|------|------|------|
| Landing - Navbar (스크롤 blur, 반응형) | OK | 데스크톱 nav links + 모바일 햄버거 메뉴 |
| Landing - Banner (닫기) | OK | dismiss 동작 확인 |
| Landing - Hero (CTA 2개) | OK | primary + secondary 버튼 |
| Landing - FeatureTabs (탭 전환) | OK | 3탭 전환 동작. 단, 이미지 없음 (config null) |
| Landing - ValueProposition | OK | highlights 3개 표시 |
| Landing - FeatureSection + Cards | OK | 배지, 제목, 3열 카드 |
| Landing - Testimonial (교차 배치) | OK | section-testimonial 교차 렌더링 |
| Landing - CTA | OK | 그라디언트 배경 + 버튼 |
| Landing - Footer (4컬럼) | OK | Product, Company, Legal, Social |
| Blog 목록 (태그 필터) | OK | All / getting-started / tutorial 필터 |
| Blog 상세 (MDX, 코드 하이라이팅, TOC) | OK | rehype-pretty-code, sticky TOC (lg+) |
| Blog - Callout 컴포넌트 | OK | Tip callout 렌더링 확인 |
| Pricing (Free / Pro) | OK | 기능 목록 + Coming Soon fallback |
| About (story, mission, values, team) | OK | siteConfig 기반 렌더링 |
| Privacy Policy (9개 섹션) | OK | siteConfig 변수 치환 정상 |
| Terms of Service | OK | (브라우저 테스트 미진행, 구조 동일) |
| Dashboard 빈 상태 UI | OK | i18n 한국어 ("아직 프로젝트가 없습니다") |
| Dashboard 사이드바 + 탑바 | OK | 홈, 설정 메뉴 |
| Dev mock session | OK | GOOGLE_CLIENT_ID 미설정 시 자동 활성 |
| OG Image (/api/og) | OK | HTTP 200, 동적 생성 |
| Sitemap / robots.txt | OK | 코드 확인 |
| 다크모드 | OK | next-themes + class 전략 |

### 이슈

| 심각도 | 이슈 | 위치 | 증상 |
|--------|------|------|------|
| **Critical** | Settings 페이지 auth 크래시 | `app/dashboard/settings/page.tsx:20` | `auth()` 직접 호출 → MissingSecret 에러 → 랜딩으로 리다이렉트. dashboard layout은 `devSession` fallback 사용하지만 settings page는 이를 무시하고 `auth()` 직접 호출 |
| **Major** | Navbar 버튼 텍스트 동일 | `features/auth/components/SignInButton.tsx:19` | 두 버튼 모두 "Get Started" 하드코딩. PRD 요구: "Log in" + "Sign Up" 구분 |
| **Major** | PRD 기술스택 Gemini API 미구현 | PRD 1.2 | tech stack에 Google Gemini API 명시되어 있으나 관련 코드 없음 |
| **Minor** | "프로젝트 만들기" 버튼 no-op | `app/dashboard/page.tsx` | href="#" — 클릭 시 아무 동작 없음 |
| **Minor** | FeatureTabs 이미지 전부 null | `config/site.ts:163,171,179` | 탭 콘텐츠가 텍스트만으로 구성, 시각적으로 빈약 |
| **Minor** | Blog 썸네일 없음 | BlogCard 컴포넌트 | 카드에 image 필드 미사용 |
| **Minor** | favicon.ico 404 | 콘솔 에러 | `Failed to load resource: 404` |

---

## 2. 디자인 품질 — 6.0 / 10 (가중치 30%)

### 긍정적 요소

- dub.co 레퍼런스에 맞는 클린하고 미니멀한 디자인 톤
- 일관된 neutral 컬러 팔레트 (white/neutral-100~900)
- shadcn/ui 컴포넌트의 적절한 활용
- 다크모드 CSS 변수 체계적 구성
- Feature Section 카드의 컬러 아이콘 배경 처리 양호

### 감점 요소

| 항목 | 감점 | 상세 |
|------|------|------|
| AI 슬롭 그라디언트 | -0.5 | `theme.gradient`가 `#6366f1 → #a855f7 → #ec4899` (보라-핑크). Hero와 CTA에 사용. 전형적 AI 생성 패턴이지만 configurable하므로 경감 |
| 뷰포트 활용도 | -1.0 | `max-w-screen-lg` (1024px)으로 1440px 데스크톱에서 좌우 200px+ 빈 공간. 특히 FeatureTabs, ValueProposition 섹션에서 콘텐츠가 좁게 몰림 |
| 시각적 빈약함 | -1.5 | FeatureTabs 이미지 없음, Blog 썸네일 없음, Team 아바타 없음 (이니셜만), Testimonial 아바타 없음. 보일러플레이트로서 데모 이미지 최소 1개는 필요 |
| 레이아웃 단조로움 | -0.5 | 대부분 중앙 정렬 텍스트 + 카드 반복. 비대칭 레이아웃이나 시각적 변화가 부족 |
| Footer 더블 피리어드 | -0.5 | "Acme Inc.." (`companyName` "Acme Inc." + ". All rights reserved.") — `Footer.tsx:107` |

---

## 3. 사용성 — 6.5 / 10 (가중치 20%)

### 긍정적 요소

- 명확한 네비게이션 구조 (Navbar, Footer, Sidebar)
- CTA 버튼이 잘 보이고 동작 경로가 직관적
- Blog 태그 필터가 즉시 작동
- Dashboard 빈 상태가 다음 행동을 안내
- Banner가 닫기 가능
- Blog 상세에서 "Back to blog" 링크 제공

### 감점 요소

| 항목 | 감점 | 상세 |
|------|------|------|
| Settings 크래시 | -1.5 | 사이드바 "설정" 클릭 → 에러 없이 랜딩으로 리다이렉트. 사용자는 왜 설정이 안 열리는지 알 수 없음 |
| Navbar 버튼 혼동 | -0.5 | "Get Started" 2개가 나란히 있어 역할 구분 불가 |
| 다크모드 토글 부재 | -0.5 | 시스템 설정만 따름. 수동 토글 UI 없음 (PRD: "시스템 설정을 따르는 다크모드" — 토글은 미명시이므로 경미) |
| Footer 데드링크 | -0.5 | "Features" → `#features`는 /pricing, /blog 등 비랜딩 페이지에서 작동 안 함 |
| 프로젝트 만들기 no-op | -0.5 | 버튼 클릭 시 아무 반응 없음. 최소한 toast나 modal이라도 필요 |

---

## 4. 코드 품질 — 7.0 / 10 (가중치 20%)

### 긍정적 요소

- Feature-based 모듈 아키텍처가 PRD 설계대로 잘 구현됨
- 의존성 방향 준수: `app/ → features/ → shared/ → config/`
- TypeScript strict mode + consistent barrel exports
- siteConfig single source of truth 패턴 충실
- 조건부 렌더링 (billing toggle, nullable sections) 깔끔
- Prisma 스키마 구조 적절
- 에러 바운더리, 로딩 상태, 404 페이지 구비
- i18n 구조 (next-intl) 올바르게 설정

### 이슈

| 심각도 | 이슈 | 위치 | 상세 |
|--------|------|------|------|
| **Bug** | Settings devSession 불일치 | `app/dashboard/settings/page.tsx:20` | layout은 `devSession ?? auth()` 패턴 사용하나 settings page는 `auth()` 직접 호출. dev 환경에서 NEXTAUTH_SECRET 없으면 크래시 |
| **Convention** | Deep import 위반 | `app/dashboard/settings/page.tsx:6` | `@/features/billing/lib/subscription` — barrel export(`index.ts`) 우회. CLAUDE.md "deep import 금지" 규칙 위반 |
| **Bug** | SignInButton 텍스트 하드코딩 | `features/auth/components/SignInButton.tsx:19` | "Get Started" 고정. props로 label 받아야 함 |
| **Bug** | Footer 더블 피리어드 | `features/landing/components/Footer.tsx:107` | `{siteConfig.legal.companyName}. All rights reserved.` — companyName이 "Acme Inc."로 끝나서 "Acme Inc.." |
| **Missing** | favicon.ico 누락 | `app/` 또는 `public/` | 콘솔 404 에러 |
| **Minor** | FeatureTabs `img` 태그 | `features/landing/components/FeatureTabs.tsx:47` | `<img>` 사용 — Next.js `next/image` 권장 |

---

## 점수 요약

| 기준 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 기능 완성도 | 7.0 | 30% | 2.10 |
| 디자인 품질 | 6.0 | 30% | 1.80 |
| 사용성 | 6.5 | 20% | 1.30 |
| 코드 품질 | 7.0 | 20% | 1.40 |
| **합계** | | | **6.60** |

---

## 우선 수정 사항 (PASS 달성을 위한 최소 작업)

1. **Settings page devSession 수정** — `auth()` 대신 layout과 동일한 devSession fallback 적용 (+0.3)
2. **SignInButton label prop 추가** — "Log in" / "Sign Up" 구분 가능하도록 (+0.2)
3. **Footer 더블 피리어드 수정** — companyName 끝 마침표 처리 (+0.1)
4. **favicon.ico 추가** — 콘솔 에러 제거 (+0.05)
5. **FeatureTabs에 데모 이미지 1개 이상 추가** — 시각적 완성도 향상 (+0.2)
6. **"프로젝트 만들기" 버튼에 최소한의 피드백 추가** — toast 또는 coming soon (+0.1)
7. **Deep import 수정** — billing barrel export에 `getSubscriptionByUserId` 추가 (+0.05)
