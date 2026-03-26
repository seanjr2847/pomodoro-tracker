# Architecture

## 1. 시스템 개요

4계층 구조의 Next.js 15 SaaS 보일러플레이트:

```
┌─────────────────────────────────────────────────┐
│  app/           라우트 합성 레이어               │
│  (pages, layouts, API routes)                    │
│  Feature를 조합하고 slot prop으로 주입           │
├─────────────────────────────────────────────────┤
│  features/      비즈니스 로직 레이어             │
│  (9 독립 모듈, barrel export)                    │
│  각 모듈은 index.ts를 통해 공개 API만 노출      │
├─────────────────────────────────────────────────┤
│  shared/        공용 레이어                      │
│  (UI 컴포넌트, 유틸, 프로바이더, 훅)            │
│  Feature 의존성 없음, 순수 재사용 코드           │
├─────────────────────────────────────────────────┤
│  config/        데이터 레이어                    │
│  (site.ts = 단일 설정 소스)                      │
│  모든 콘텐츠와 테마의 원천                       │
└─────────────────────────────────────────────────┘
```

배포 대상: Vercel (Serverless Functions + Edge Runtime for OG images)

---

## 2. 아키텍처 원칙

1. **Feature-Based 모듈러 구조**: 각 Feature는 `features/<name>/index.ts`를 통해 공개 API만 노출. 내부 구현은 캡슐화.
2. **단방향 의존만 허용**: 순환 의존 금지. `app/ → features/ → shared/ → config/` 방향만 허용.
3. **중앙 설정 단일 소스**: `config/site.ts`의 `siteConfig` 객체가 앱 전체 콘텐츠/테마의 유일한 진입점.
4. **Slot Prop 합성**: Feature 간 직접 의존 대신 `app/` 레이어에서 `ReactNode` slot prop으로 합성 (예: `LandingPage({ pricingSlot })`).
5. **환경변수 Feature 토글**: `PADDLE_API_KEY` 존재 여부로 결제 기능 전체 활성화/비활성화. 코드 삭제 없이 기능 제거.

---

## 3. 모듈 경계와 책임

### features/landing

- **책임**: 랜딩페이지 전체 렌더링 + Dashboard shell UI (Sidebar, Topbar)
- **내부 구조**: `components/` (13개), `hooks/` (useScrollSection), `lib/` (renderSections)
- **공개 API**: LandingPage, Navbar, Footer, PricingPlaceholder, DashboardSidebar, DashboardTopbar
- **의존**: `features/auth` (SignInButton, UserMenu), `shared/ui`, `config/site`
- **핵심 패턴**: `LandingPage`가 `pricingSlot?: ReactNode`을 받아 billing과의 직접 결합 회피

### features/auth

- **책임**: Google OAuth 인증, JWT 세션 관리, 사용자 UI
- **내부 구조**: `config/` (auth.ts — NextAuth 설정), `components/` (3개), `hooks/` (useSession)
- **공개 API**: auth, signIn, signOut, SignInButton, SignOutButton, UserMenu
- **의존**: `features/database` (Prisma adapter)
- **핵심 패턴**: JWT 전략으로 세션 조회 시 DB 호출 불필요

### features/billing

- **책임**: Paddle 결제, 구독 관리, Feature 토글
- **내부 구조**: `config/` (paddle.ts), `components/` (2개), `hooks/` (useSubscription), `api/` (webhook.ts)
- **공개 API**: PricingCard, BillingStatus, isBillingEnabled, useSubscription
- **의존**: `config/site` (가격 정보), `shared/ui`
- **핵심 패턴**: `isBillingEnabled = !!process.env.PADDLE_API_KEY`로 전체 기능 토글

### features/blog

- **책임**: MDX 파일 기반 블로그 시스템
- **내부 구조**: `components/` (5개), `lib/` (mdx.ts, posts.ts), `types/` (Post, Frontmatter)
- **공개 API**: BlogList, BlogPost, BlogCard, getAllPosts, getPostsByTag, getAllTags, getAdjacentPosts, getPostBySlug, extractHeadings, Post, Frontmatter
- **의존**: `shared/ui`, `config/site`

### features/database

- **책임**: Prisma 클라이언트 싱글턴 인스턴스 관리
- **내부 구조**: `client.ts` (globalThis 패턴)
- **공개 API**: prisma
- **의존**: 없음 (최하위 모듈)

### features/seo

- **책임**: Next.js Metadata 객체 생성
- **내부 구조**: `metadata.ts` 단일 파일
- **공개 API**: generateSiteMetadata
- **의존**: `config/site` (siteConfig만 참조)
- **참고**: PRD는 og, blog 의존을 주장하나 실제로는 config/site만 import

### features/og

- **책임**: OG 이미지 JSX 템플릿
- **내부 구조**: `templates/` (DefaultOG), `utils/` (fonts)
- **공개 API**: DefaultOG
- **의존**: `config/site`

### features/legal

- **책임**: 동적 법적 문서 생성 (Privacy Policy, Terms of Service)
- **내부 구조**: `components/` (LegalDocument), `content/` (privacy.ts, terms.ts)
- **공개 API**: LegalDocument, getPrivacyPolicy, getTermsOfService
- **의존**: `config/site` (회사명, 이메일 등 동적 치환)

### shared/

- **책임**: Feature 독립적인 공용 코드
- **ui/**: shadcn/ui 컴포넌트 (Button, Card, Input, Badge, Avatar 등 17개) + 커스텀 (grid-pattern, lucide-icon, animate-on-scroll) + `index.ts` barrel export
- **utils/cn.ts**: `clsx` + `tailwind-merge` 조합 유틸
- **hooks/**: useMediaQuery, useDarkMode
- **providers/**: ThemeProvider (next-themes 래퍼)
- **참고**: `components.json` aliases가 `@/shared/ui`, `@/shared/utils/cn`, `@/shared/hooks`를 가리킴. shadcn CLI 설치 시 `shared/ui/`에 직접 생성됨.

---

## 4. 주요 설계 결정

### ADR-1: Feature-Based 모듈러 아키텍처

- **결정**: `features/` 하위에 기능별 독립 폴더, `index.ts` barrel export
- **대안**: Domain-Driven 계층 구조, Monorepo 패키지 분리
- **근거**: 단일 Next.js 앱에서 기능 응집도를 높이면서 복잡한 빌드 설정 없이 유지. `index.ts` public API 패턴으로 의존성 경계 명확화. 순환 의존 금지, 단방향만 허용.

### ADR-2: 중앙 설정 시스템 (config/site.ts)

- **결정**: 단일 TypeScript 객체(`siteConfig`)로 모든 앱 설정 관리
- **대안**: JSON 설정, 환경변수 기반, CMS 기반 콘텐츠
- **근거**: 타입 안전성(TypeScript 인터페이스), IDE 자동완성, 빌드 타임 검증. 동적 변경 불필요한 설정이므로 런타임 오버헤드 없음.

### ADR-3: Auth.js + JWT 세션 전략

- **결정**: Auth.js(NextAuth) + Google OAuth + JWT 세션 + Prisma Adapter
- **대안**: Clerk, Supabase Auth, Firebase Auth
- **근거**: 무료, 셀프호스팅, Next.js 네이티브 통합. JWT 전략으로 세션 조회 시 DB 호출 불필요. Prisma Adapter로 유저 데이터 자동 영속화.

### ADR-4: Neon + Prisma 데이터베이스

- **결정**: Neon Serverless Postgres + Prisma ORM
- **대안**: Supabase Postgres, PlanetScale, Turso
- **근거**: Vercel 네이티브 통합, 서버리스 최적화, 브랜칭 지원. Prisma로 타입 안전한 쿼리와 마이그레이션. `prisma/schema.prisma`가 스키마 source of truth.

### ADR-5: Paddle 결제 (환경변수 토글)

- **결정**: Paddle + `PADDLE_API_KEY` 환경변수 기반 Feature 토글
- **대안**: Stripe, LemonSqueezy
- **근거**: Paddle은 MoR(Merchant of Record)로 세금/규정 처리 대행. 환경변수 존재 여부로 전체 Feature 자동 활성화/비활성화. 비활성 시 "Coming Soon" fallback.

### ADR-6: MDX 블로그 (파일시스템 기반)

- **결정**: MDX + next-mdx-remote + gray-matter + rehype-pretty-code
- **대안**: CMS(Sanity, Contentful), 데이터베이스 기반 블로그
- **근거**: Git 기반 콘텐츠 관리로 별도 서비스 없이 블로그 운영. MDX로 React 컴포넌트 삽입 가능. SEO 최적화(JSON-LD, sitemap 자동 포함).

### ADR-7: next-intl i18n (Dashboard UI 전용)

- **결정**: next-intl, Dashboard UI에만 적용
- **대안**: next-i18next, 자체 i18n
- **근거**: App Router 서버 컴포넌트와 최적 통합. 랜딩페이지는 siteConfig가 중앙 관리하므로 별도 i18n 불요. 초기에는 en.json만 포함, 구조를 갖춰두어 리팩토링 없이 언어 추가 가능.

### ADR-8: next-themes + CSS 변수 다크모드

- **결정**: next-themes (시스템 설정 따름) + Tailwind `class` 전략
- **대안**: 수동 다크모드 토글, CSS media query
- **근거**: shadcn/ui의 기본 다크모드 지원과 완벽 호환. CSS 변수로 런타임 테마 전환. oklch 색상 공간 사용.

### ADR-9: Slot Prop 의존성 주입

- **결정**: `app/` 라우트에서 Feature 간 slot 패턴으로 합성
- **대안**: Feature 간 직접 import, DI 컨테이너
- **근거**: landing이 billing을 직접 의존하지 않고, `app/page.tsx`에서 PricingCard를 slot prop으로 주입. billing Feature 제거 시 landing 코드 변경 불필요.

---

## 5. 데이터 흐름

### 인증 흐름

```
Landing (SignInButton)
  → Google OAuth 동의
    → Auth.js callback
      → JWT 세션 생성 + Prisma adapter로 User 영속화
        → /dashboard redirect

Dashboard Layout
  → auth() 호출 (JWT 디코딩, DB 미접근)
    → 세션 있음: Sidebar + Topbar + children 렌더
    → 세션 없음: / redirect
```

**Dev 모드**: `NODE_ENV=development && !GOOGLE_CLIENT_ID` → mock session 자동 활성화 (OAuth 없이 대시보드 테스트)

### 콘텐츠 흐름

```
config/site.ts (siteConfig 객체)
  → LandingPage: hero, featureTabs, logos, sections, testimonials, pricing
  → Footer: social links, site name
  → Legal: 회사명, 이메일 등 동적 치환
  → SEO: metadata, OG images
```

### 블로그 흐름

```
content/blog/*.mdx (파일)
  → gray-matter: frontmatter 파싱 (title, date, tags, published)
  → next-mdx-remote: MDX → React 렌더
  → rehype-pretty-code + shiki: 코드 하이라이팅
  → app/sitemap.ts: 자동 sitemap 포함
```

### 결제 흐름

```
PADDLE_API_KEY 확인
  → 존재: PricingCard 활성화 → Paddle.js checkout → webhook POST
  → 미존재: PricingPlaceholder ("Coming Soon") 렌더

Paddle Webhook (POST /api/webhook/paddle)
  → 서명 검증 (verifyPaddleSignature)
    → event 파싱
      → subscription.created/updated/canceled
        → TODO: DB 업데이트 (미구현)
```

---

## 6. 렌더링 전략

### Server Components (기본)

대부분의 컴포넌트. 서버에서만 실행, 클라이언트 JS 없음:
- 모든 `page.tsx`, `layout.tsx` 파일
- LandingPage, Hero, CTA, Footer, FeatureSection, LogoCloud, ValueProposition, Integration
- BlogList, BlogPost, BlogCard
- LegalDocument

### Client Components (`"use client"` 선언, 12개)

| 컴포넌트 | 이유 |
|----------|------|
| `features/landing/components/Navbar.tsx` | 스크롤 이벤트, 모바일 메뉴 상태 |
| `features/landing/components/Banner.tsx` | 닫기 상태 관리 |
| `features/landing/components/FeatureTabs.tsx` | 탭 상호작용 |
| `features/landing/components/DashboardSidebar.tsx` | 접기/펼치기 상태 |
| `features/landing/components/DashboardTopbar.tsx` | UserMenu 상호작용 |
| `features/auth/components/SignInButton.tsx` | onClick handler |
| `features/auth/components/SignOutButton.tsx` | onClick handler |
| `features/auth/components/UserMenu.tsx` | Dropdown 상호작용 |
| `features/auth/hooks/useSession.ts` | React hook |
| `features/billing/components/BillingStatus.tsx` | 구독 상태 표시 |
| `features/billing/hooks/useSubscription.ts` | React hook |
| `features/blog/components/TableOfContents.tsx` | 스크롤 추적 |

### Edge Runtime

- `app/api/og/route.tsx` — @vercel/og 이미지 생성

---

## 7. 제약 사항

- **Google OAuth 단일**: 이메일/비밀번호 인증 없음 (Auth.js 프로바이더 추가로 확장 가능)
- **멀티테넌시 미지원**: 단일 테넌트 SaaS 전용
- **CMS 통합 없음**: 블로그는 MDX 파일 기반만 지원
- **GEMINI_API_KEY**: `.env.example`에 존재하나 코드에서 미사용 (프로젝트별 AI 기능 준비용)
- **테스트 미구축**: placeholder 스크립트만 존재, 자동화된 검증 수단 없음

---

## 8. 리스크와 트레이드오프

| 리스크 | 완화 전략 | 현재 상태 |
|--------|----------|----------|
| siteConfig 비대화 | 섹션별 분리 패턴 문서화 | ~307줄, 관리 가능 범위 |
| Google OAuth 단일 제공자 | Auth.js 프로바이더 추가 가능 구조 | 확장 미구현 |
| Paddle 장애 시 결제 불가 | 웹훅 재시도 + 구독 상태 캐싱 | **TODO: DB 업데이트 미구현** |
| MDX 빌드 타임 증가 | ISR/SSG + 캐싱 | 현재 글 수 소량 |
| Prisma 콜드 스타트 | globalThis 싱글턴 패턴 | 구현 완료 |
| 테스트 부재 | vitest + playwright 도입 예정 | **미구축** |
| `lib/utils.ts`와 `shared/utils/cn.ts` 중복 | 통합 필요 | 기술 부채 |

---

## 9. Prisma 데이터 모델

```
User (users)
  ├── id, name, email, emailVerified, image
  ├── createdAt, updatedAt
  ├── accounts    → Account[] (cascade delete)
  ├── sessions    → Session[] (cascade delete)
  └── subscription → Subscription? (cascade delete)

Account (accounts)
  ├── userId, type, provider, providerAccountId
  ├── OAuth tokens (refresh_token, access_token, etc.)
  └── PK: [provider, providerAccountId]

Session (sessions)
  ├── sessionToken (unique), userId, expires
  └── JWT 전략 사용 시 실질적으로 미사용

VerificationToken (verification_tokens)
  ├── identifier, token, expires
  └── PK: [identifier, token]

Subscription (subscriptions)
  ├── id, userId (unique), paddleSubscriptionId (unique)
  ├── paddleCustomerId, plan, status, currentPeriodEnd
  └── TODO: webhook에서 업데이트 로직 미구현
```
