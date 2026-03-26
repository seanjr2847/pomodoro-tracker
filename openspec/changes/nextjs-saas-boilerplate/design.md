## Context

새 SaaS 프로젝트를 시작할 때마다 인증, 결제, 랜딩페이지, Legal, SEO 등 동일한 코드를 반복 구축한다. 이 보일러플레이트는 `config/site.ts` 단일 파일 수정만으로 프로덕션 수준의 SaaS 셸을 즉시 배포 가능하게 만드는 것이 목표다.

기술 스택: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Auth.js, Prisma, Neon Postgres, Paddle, Vercel.
디자인 레퍼런스: dub.co (오픈소스) — Tailwind 설정, 컴포넌트, 레이아웃 구조를 참고.

## Goals / Non-Goals

**Goals:**
- `config/site.ts` 하나로 앱 이름, 테마, 콘텐츠, Legal 정보 등 모든 커스터마이징 가능
- Feature-Based 모듈러 구조로 기능 추가/제거가 독립적
- 환경변수 기반 Feature 토글 (Billing 등 선택적 Feature)
- 다크모드, 반응형, i18n 구조를 초기부터 내장
- MVP(Navbar + Hero + CTA + Footer)부터 풀 구성까지 점진적 확장 가능
- Vercel 최적화 배포 (pnpm, App Router, Serverless)

**Non-Goals:**
- 멀티테넌시 지원
- 커스텀 이메일 인증 (Google OAuth 단일)
- CMS 통합 (블로그는 MDX 파일 기반)
- A/B 테스팅 프레임워크
- 모바일 앱 (웹 전용)
- AI 기능 구현 (GEMINI_API_KEY는 프로젝트별 사용을 위한 준비)

## Decisions

### 1. Feature-Based 모듈러 아키텍처

**선택**: `features/` 디렉토리 하위에 기능별 독립 폴더
**대안**: Domain-Driven 계층 구조, Monorepo 패키지 분리
**근거**: 단일 Next.js 앱에서 기능 응집도를 높이면서도 복잡한 빌드 설정(Turborepo 등) 없이 유지 가능. `index.ts`를 통한 public API 패턴으로 의존성 경계를 명확히 한다. 순환 의존 금지, 단방향만 허용.

### 2. 중앙 설정 시스템 (`config/site.ts`)

**선택**: 단일 TypeScript 객체로 모든 앱 설정 관리
**대안**: JSON 설정 파일, 환경변수 기반 설정, CMS 기반 콘텐츠
**근거**: 타입 안전성(TypeScript 인터페이스), IDE 자동완성, 빌드 타임 검증. 동적 변경이 불필요한 설정이므로 런타임 오버헤드 없음. 테마 색상은 빌드 시 CSS 변수로 변환.

### 3. Auth.js + JWT 세션 전략

**선택**: Auth.js(NextAuth) + Google OAuth + JWT 세션 + Prisma Adapter
**대안**: Clerk, Supabase Auth, Firebase Auth
**근거**: 무료, 셀프호스팅, Next.js 네이티브 통합. JWT 전략으로 세션 조회 시 DB 호출 불필요. Prisma Adapter로 유저 데이터 자동 영속화.

### 4. Neon + Prisma 데이터베이스

**선택**: Neon Serverless Postgres + Prisma ORM
**대안**: Supabase Postgres, PlanetScale, Turso
**근거**: Vercel과의 네이티브 통합, 서버리스 아키텍처 최적화, 브랜칭 지원. Prisma로 타입 안전한 쿼리와 마이그레이션 관리. 단일 `prisma/schema.prisma` 파일이 스키마 source of truth.

### 5. Paddle 결제 (환경변수 토글)

**선택**: Paddle + 환경변수 기반 Feature 토글
**대안**: Stripe, LemonSqueezy
**근거**: Paddle은 MoR(Merchant of Record)로 세금/규정 처리를 대행하여 글로벌 SaaS에 적합. `PADDLE_API_KEY` 존재 여부로 전체 Feature를 자동 활성화/비활성화. 비활성 시 Pricing 카드에 "Coming Soon" fallback.

### 6. MDX 블로그 (파일시스템 기반)

**선택**: MDX + contentlayer2/next-mdx-remote + rehype-pretty-code
**대안**: CMS(Sanity, Contentful), 데이터베이스 기반 블로그
**근거**: Git 기반 콘텐츠 관리로 별도 서비스 없이 블로그 운영. MDX로 React 컴포넌트를 글 안에 삽입 가능. SEO 최적화(JSON-LD, sitemap 자동 포함).

### 7. i18n 전략 (next-intl, 선택적 적용)

**선택**: next-intl, Dashboard UI에만 적용
**대안**: next-i18next, 자체 i18n
**근거**: App Router 서버 컴포넌트와 최상의 통합. 랜딩페이지는 siteConfig가 이미 중앙 관리하므로 별도 i18n 불요. 초기에는 en.json만 포함하되 구조를 갖춰두어 리팩토링 없이 언어 추가 가능.

### 8. 다크모드 (next-themes + CSS 변수)

**선택**: next-themes (시스템 설정 따름) + Tailwind class 전략
**대안**: 수동 다크모드 토글, CSS media query
**근거**: shadcn/ui의 기본 다크모드 지원과 완벽 호환. siteConfig.theme.primary에서 다크모드 색상 자동 계산(HSL lightness +20%). CSS 변수로 런타임 테마 전환.

### 9. 의존성 주입 패턴 (app/ 레이어)

**선택**: app/ 라우트에서 Feature 간 slot 패턴으로 조합
**대안**: Feature 간 직접 import, DI 컨테이너
**근거**: landing이 billing을 직접 의존하지 않고, app/page.tsx에서 PricingCard를 slot prop으로 주입. 이로써 billing Feature 제거 시 landing 코드 변경 불필요.

## Risks / Trade-offs

- **[단일 설정 파일 한계]** → siteConfig가 커지면 관리 어려움. 섹션별 분리 패턴을 README에 문서화하여 대응.
- **[Google OAuth 단일 제공자]** → 이메일 로그인 불가. Auth.js 프로바이더 추가는 설정 변경만으로 가능하도록 구조화.
- **[Paddle 의존성]** → Paddle 장애 시 결제 불가. 웹훅 재시도 메커니즘과 구독 상태 캐싱으로 완화.
- **[MDX 빌드 타임]** → 글 수 증가 시 빌드 시간 증가. ISR/SSG 전략과 contentlayer2 캐싱으로 대응.
- **[Prisma 콜드 스타트]** → 서버리스 환경에서 Prisma Client 초기화 지연. 글로벌 인스턴스 패턴(`globalThis`)으로 완화.
- **[CSS 변수 기반 테마]** → 빌드 타임에 Tailwind JIT가 동적 색상을 감지 못할 수 있음. safelist 또는 CSS 변수 직접 참조 패턴 사용.
