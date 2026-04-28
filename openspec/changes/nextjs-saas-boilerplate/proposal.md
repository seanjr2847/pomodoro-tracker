## Why

새로운 SaaS 프로젝트를 빠르게 런칭하기 위한 Next.js 보일러플레이트가 필요하다. `config/site.ts` 하나만 수정하면 랜딩페이지, Legal 문서, OG 이미지, 인증이 모두 반영되는 범용 구조를 구축하여, 반복적인 SaaS 초기 셋업 시간을 제거한다. dub.co의 디자인 톤을 기반으로 하되 콘텐츠를 설정 파일에서 주입하여 아무 SaaS에나 적용 가능하게 한다.

## What Changes

- Feature-Based 모듈러 아키텍처 도입 (`features/`, `shared/`, `config/` 구조)
- 중앙 설정 시스템 (`config/site.ts`) — 앱 이름, 테마, 히어로, 섹션, 가격, Legal 정보 등 모든 콘텐츠를 단일 파일에서 관리
- dub.co 스타일 랜딩페이지 (Navbar, Banner, Hero, Feature Tabs, Logo Cloud, Testimonials, CTA, Footer)
- 동적 OG 이미지 생성 (`@vercel/og` 기반)
- Legal 문서 자동 생성 (Privacy Policy, Terms of Service)
- Google OAuth 인증 (Auth.js + Prisma Adapter + Neon DB)
- Prisma + Neon Serverless Postgres 데이터베이스 레이어
- Paddle 결제 통합 (환경변수 기반 선택적 활성화)
- MDX 기반 블로그 시스템 (SEO 최적화, 자동 sitemap)
- SEO 메타데이터 자동 생성 (sitemap, robots.txt, JSON-LD)
- 대시보드 레이아웃 (인증 가드, 사이드바, 탑바, 빈 상태 UI, Settings)
- 다크모드 지원 (시스템 설정 따름, `next-themes`)
- i18n 구조 (`next-intl`, Dashboard UI 대상)
- 에러 핸들링 및 로딩 상태 (loading.tsx, error.tsx, not-found.tsx)

## Capabilities

### New Capabilities
- `site-config`: 중앙 설정 시스템 — siteConfig 인터페이스, 테마 CSS 변수 생성, 다크모드 색상 자동 계산
- `landing-page`: dub.co 스타일 랜딩페이지 — Navbar, Banner, Hero, Feature Tabs, Logo Cloud, Value Proposition, Feature Sections, Testimonials, Integration, CTA, Footer. 섹션 조건부 렌더링 및 교차 배치
- `og-image`: 동적 OG 이미지 생성 — @vercel/og, siteConfig 기반 기본값, 쿼리 파라미터 오버라이드
- `legal-docs`: Legal 문서 자동 생성 — Privacy Policy, Terms of Service, siteConfig 변수 치환, Google OAuth 심사 대응
- `auth-system`: Google OAuth 인증 — Auth.js, JWT 세션, Prisma Adapter, 로그인/로그아웃 플로우, 세션 관리
- `database-layer`: Prisma + Neon 데이터베이스 — Client 인스턴스 관리, Auth.js 기본 테이블, 스키마 확장 패턴
- `billing-integration`: Paddle 결제 통합 — 환경변수 기반 Feature 토글, 웹훅 보안, 구독 상태 관리
- `blog-system`: MDX 블로그 — 글 목록/상세, frontmatter, 코드 하이라이팅, 목차, 커스텀 컴포넌트(Callout, CodeBlock, Image)
- `seo-metadata`: SEO 메타데이터 — 동적 sitemap, robots.txt, JSON-LD Article, OG 연동, 블로그 글 자동 포함
- `dashboard-layout`: 대시보드 UI — 인증 가드, 사이드바, 탑바, 빈 상태 UI, Settings, catch-all 확장
- `shared-ui`: 공통 UI 레이어 — shadcn/ui 기반 컴포넌트, cn() 유틸, hooks, 디자인 시스템
- `i18n-support`: 다국어 구조 — next-intl, Dashboard UI 대상, en.json 기본 포함
- `error-handling`: 에러/로딩 상태 — 글로벌 및 대시보드별 loading.tsx, error.tsx, not-found.tsx

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- **새 파일 구조**: `features/`, `shared/`, `config/`, `content/`, `messages/`, `prisma/` 디렉토리 전체 생성
- **의존성 추가**: next, react, typescript, tailwindcss, shadcn/ui, auth.js, prisma, @neondatabase/serverless, @vercel/og, next-themes, next-intl, next-mdx-remote/contentlayer2, rehype-pretty-code, @paddle/paddle-node-sdk
- **환경변수**: DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, NEXTAUTH_SECRET, GEMINI_API_KEY, PADDLE_API_KEY(선택), PADDLE_WEBHOOK_SECRET(선택)
- **API 라우트**: /api/auth/[...nextauth], /api/og, /api/webhook/paddle
- **배포**: Vercel 최적화 (pnpm, App Router, Serverless Functions)
