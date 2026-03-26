# Repository Map

## 1. 프로젝트 개요

Next.js 15 기반 SaaS 보일러플레이트. `config/site.ts` 단일 파일 수정만으로 앱 이름, 테마, 랜딩페이지, Legal, SEO, 결제 등을 커스터마이징하여 프로덕션 수준의 SaaS 셸을 즉시 배포할 수 있다. Feature-Based 모듈러 아키텍처로 기능 추가/제거가 독립적이며, 환경변수로 선택적 기능(Paddle 결제)을 토글한다.

---

## 2. 기술 스택

| 분류 | 기술 | 버전 (package.json 기준) |
|------|------|------------------------|
| Framework | Next.js (App Router) | ^15.3.2 |
| Language | TypeScript | ^5 |
| UI Runtime | React + React DOM | ^19.1.0 |
| Styling | Tailwind CSS + @tailwindcss/postcss | ^4 |
| UI Components | shadcn/ui (radix-nova) + Radix UI | ^4.1.0 / ^1.4.3 |
| Icons | lucide-react | ^1.0.1 |
| Auth | NextAuth (Auth.js) + @auth/prisma-adapter | 5.0.0-beta.30 / ^2.11.1 |
| Database | Neon Serverless Postgres | @neondatabase/serverless ^1.0.2 |
| ORM | Prisma + @prisma/client | ^6.19.2 |
| Blog | next-mdx-remote + gray-matter + rehype-pretty-code + shiki | ^6.0.0 / ^4.0.3 / ^0.14.3 / ^4.0.2 |
| i18n | next-intl | ^4.8.3 |
| Dark Mode | next-themes | ^0.4.6 |
| OG Images | @vercel/og | ^0.11.1 |
| CSS Utilities | clsx + tailwind-merge + class-variance-authority | ^2.1.1 / ^3.5.0 / ^0.7.1 |
| Animations | tw-animate-css | ^1.4.0 |
| Package Manager | pnpm | - |
| Deployment | Vercel | - |

> **PRD와의 불일치**: PRD는 `contentlayer2`를 언급하나 실제로는 `next-mdx-remote` + `gray-matter` 사용. PRD는 `@paddle/paddle-node-sdk`를 언급하나 package.json에 미존재, webhook 서명 검증은 자체 구현.

---

## 3. 디렉토리 구조

```
factory-boilerplate/
├── app/                    # Next.js App Router — 라우트 합성 레이어 (23 파일)
│   ├── layout.tsx          # Root layout (Geist fonts, next-intl, ThemeProvider)
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Tailwind v4 테마 + CSS 변수
│   ├── sitemap.ts          # 동적 sitemap 생성
│   ├── robots.ts           # robots.txt 생성
│   ├── loading.tsx         # 글로벌 로딩 UI
│   ├── error.tsx           # 글로벌 에러 UI
│   ├── not-found.tsx       # 404 UI
│   ├── about/              # About 페이지
│   ├── blog/               # 블로그 목록 + [slug] 상세
│   ├── pricing/            # 가격 페이지
│   ├── privacy/            # 개인정보 처리방침
│   ├── terms/              # 이용약관
│   ├── dashboard/          # 인증 필요 영역
│   │   ├── layout.tsx      # 인증 가드 + Sidebar/Topbar
│   │   ├── page.tsx        # 대시보드 메인
│   │   ├── settings/       # 설정 페이지
│   │   ├── [...slug]/      # Catch-all 확장점
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   └── api/
│       ├── auth/[...nextauth]/  # Auth.js handler
│       ├── og/                  # OG 이미지 생성 (Edge Runtime)
│       └── webhook/paddle/      # Paddle webhook
│
├── features/               # Feature 모듈 — 비즈니스 로직 (9 모듈, 50 파일)
│   ├── landing/            # 랜딩페이지 + Dashboard UI
│   ├── auth/               # 인증 (Google OAuth)
│   ├── billing/            # 결제 (Paddle, 환경변수 토글)
│   ├── blog/               # 블로그 (MDX)
│   ├── database/           # Prisma 클라이언트
│   ├── seo/                # 메타데이터 생성
│   ├── og/                 # OG 이미지 템플릿
│   ├── legal/              # Privacy Policy, Terms of Service
│   └── [각 모듈]/index.ts  # Barrel export (공개 API)
│
├── shared/                 # 공용 UI, 유틸, 프로바이더 (22 파일)
│   ├── ui/                 # shadcn/ui 컴포넌트 + barrel export
│   ├── utils/cn.ts         # clsx + tailwind-merge
│   ├── hooks/              # useMediaQuery, useDarkMode
│   └── providers/          # ThemeProvider (next-themes)
│
├── config/
│   └── site.ts             # SiteConfig — 중앙 설정 단일 소스 (~307줄)
│
├── lib/
│   ├── utils.ts            # cn() 함수 (shared/utils/cn.ts와 중복)
│   └── theme.ts            # 테마 색상 계산 유틸
│
├── content/
│   └── blog/               # MDX 블로그 글 (content/posts/ 하위)
│
├── messages/
│   └── en.json             # i18n 번역 (Dashboard UI 전용)
│
├── i18n/
│   └── request.ts          # next-intl 서버 설정
│
├── prisma/
│   └── schema.prisma       # DB 스키마 (User, Account, Session, Subscription)
│
├── openspec/               # OpenSpec 변경 관리
│   ├── config.yaml
│   └── changes/nextjs-saas-boilerplate/
│       ├── proposal.md, design.md, tasks.md
│       └── specs/ (13 capability specs)
│
├── .claude/                # Claude Code 통합
│   ├── skills/ (4개)       # OpenSpec 워크플로우 스킬
│   └── commands/opsx/ (4개) # OpenSpec CLI 커맨드
│
├── PRD.md                  # 제품 요구사항 (~1118줄, 한국어)
├── package.json            # 의존성 + 스크립트
├── tsconfig.json           # TypeScript (strict, @/* alias)
├── next.config.ts          # Next.js (next-intl plugin, Turbopack)
├── components.json         # shadcn/ui 설정 (aliases → @/shared/)
├── eslint.config.mjs       # ESLint (next/core-web-vitals)
├── postcss.config.mjs      # PostCSS (Tailwind v4)
└── .env.example            # 환경변수 템플릿
```

---

## 4. Feature 모듈 맵

| 모듈 | 경로 | Barrel Export | 목적 |
|------|------|-------------|------|
| **landing** | `features/landing/` | `LandingPage`, `Navbar`, `Footer`, `PricingPlaceholder`, `DashboardSidebar`, `DashboardTopbar` | 랜딩페이지 전체 + Dashboard shell UI |
| **auth** | `features/auth/` | `auth`, `signIn`, `signOut`, `SignInButton`, `SignOutButton`, `UserMenu` | Google OAuth 인증, 세션 관리 |
| **billing** | `features/billing/` | `PricingCard`, `BillingStatus`, `isBillingEnabled`, `useSubscription` | Paddle 결제, 환경변수 토글 |
| **blog** | `features/blog/` | `BlogList`, `BlogPost`, `BlogCard`, `getAllPosts`, `getPostsByTag`, `getAllTags`, `getAdjacentPosts`, `getPostBySlug`, `extractHeadings`, `Post`, `Frontmatter` | MDX 파일 기반 블로그 |
| **database** | `features/database/` | `prisma` | Prisma 클라이언트 싱글턴 |
| **seo** | `features/seo/` | `generateSiteMetadata` | Next.js Metadata 객체 생성 |
| **og** | `features/og/` | `DefaultOG` | OG 이미지 JSX 템플릿 |
| **legal** | `features/legal/` | `LegalDocument`, `getPrivacyPolicy`, `getTermsOfService` | 법적 문서 동적 생성 |

---

## 5. App Routes

| 경로 | 파일 | 유형 | 인증 | 설명 |
|------|------|------|------|------|
| `/` | `app/page.tsx` | Page | - | 랜딩페이지 (LandingPage 렌더) |
| `/about` | `app/about/page.tsx` | Page | - | 소개 페이지 |
| `/blog` | `app/blog/page.tsx` | Page | - | 블로그 목록 (태그 필터 지원) |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Page | - | 블로그 상세 (MDX 렌더) |
| `/pricing` | `app/pricing/page.tsx` | Page | - | 가격 페이지 |
| `/privacy` | `app/privacy/page.tsx` | Page | - | 개인정보 처리방침 |
| `/terms` | `app/terms/page.tsx` | Page | - | 이용약관 |
| `/dashboard` | `app/dashboard/page.tsx` | Page | 필수 | 대시보드 메인 |
| `/dashboard/settings` | `app/dashboard/settings/page.tsx` | Page | 필수 | 사용자 설정 |
| `/dashboard/[...slug]` | `app/dashboard/[...slug]/page.tsx` | Page | 필수 | Catch-all 확장점 |
| `/api/auth/*` | `app/api/auth/[...nextauth]/route.ts` | API | - | Auth.js handler (GET, POST) |
| `/api/og` | `app/api/og/route.tsx` | API | - | OG 이미지 생성 (Edge Runtime) |
| `/api/webhook/paddle` | `app/api/webhook/paddle/route.ts` | API | - | Paddle webhook (POST, 서명 검증) |

추가 파일: `app/layout.tsx` (Root Layout), `app/dashboard/layout.tsx` (Dashboard Layout), `app/sitemap.ts`, `app/robots.ts`, `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`, `app/dashboard/loading.tsx`, `app/dashboard/error.tsx`, `app/dashboard/not-found.tsx`

---

## 6. 설정 진입점

| 파일 | 역할 |
|------|------|
| `config/site.ts` | SiteConfig 인터페이스 — 앱 이름, 테마, Hero, Feature, Pricing, Legal 등 전체 콘텐츠 |
| `.env.example` | 환경변수 템플릿 (필수: DATABASE_URL, NEXTAUTH_*, GOOGLE_*; 선택: GEMINI_API_KEY, PADDLE_*) |
| `components.json` | shadcn/ui 설정 — aliases가 `@/shared/ui`, `@/shared/utils/cn`, `@/shared/hooks`로 라우팅 |
| `next.config.ts` | Next.js — next-intl plugin, Turbopack 활성화 |
| `tsconfig.json` | TypeScript — strict mode, `@/*` path alias |
| `eslint.config.mjs` | ESLint — next/core-web-vitals + next/typescript (flat config) |
| `postcss.config.mjs` | PostCSS — @tailwindcss/postcss 플러그인 |
| `app/globals.css` | Tailwind v4 테마 — oklch CSS 변수, 다크모드, 커스텀 애니메이션 |

---

## 7. 의존성 그래프 (코드 검증 기준)

```
app/ ──────────────→ features/landing  (LandingPage, Navbar, Footer, DashboardSidebar, DashboardTopbar)
  ├─────────────────→ features/auth     (auth, SignInButton)
  ├─────────────────→ features/seo      (generateSiteMetadata)
  ├─────────────────→ features/blog     (getAllPosts — app/sitemap.ts에서)
  ├─────────────────→ features/billing  (deep import — app/api/webhook/paddle/route.ts에서)
  ├─────────────────→ features/legal    (LegalDocument)
  └─────────────────→ features/og       (DefaultOG — app/api/og/route.tsx에서)

features/auth ────→ features/database   (Prisma adapter)
features/landing ─→ features/auth       (SignInButton, UserMenu)

모든 features ────→ config/site.ts      (siteConfig 참조)
모든 features ────→ shared/ui           (UI 컴포넌트)
```

### PRD 의존성 주장 vs 실제 코드

| PRD/design.md 주장 | 실제 코드 (grep 검증) | 비고 |
|-------------------|---------------------|------|
| `seo → og, blog` | `features/seo/metadata.ts`는 `config/site`만 import | sitemap은 `app/sitemap.ts`에 위치 (features/seo 외부) |
| `billing → auth, database` | `features/billing/`에 cross-feature import 없음 | webhook route가 billing을 import하나 이는 app/ 레이어 |

---

## 8. 기존 문서 → 정규 문서 매핑

| 기존 문서 | 언어 | 정규 문서 대상 | 추출 내용 |
|-----------|------|-------------|----------|
| `PRD.md` (~1118줄) | 한국어 | REPO_MAP, ARCHITECTURE, STYLEGUIDE | 프로젝트 개요, 기술 스택, Feature 정의, 컴포넌트 패턴 |
| `openspec/.../design.md` | 한국어 | ARCHITECTURE | 9개 설계 결정 (ADR), 리스크, 제약사항 |
| `openspec/.../proposal.md` | 한국어 | ARCHITECTURE | 프로젝트 동기, 기능 목록, 영향 범위 |
| `openspec/.../specs/*.md` (13개) | 한국어 | ARCHITECTURE, STYLEGUIDE | Feature별 행동 명세, 컴포넌트 규칙 |
| `openspec/.../tasks.md` | 한국어 | TASKS | 완료 상태 (전체 완료), 아카이브 준비 |
| `.env.example` | 영어 | WORKFLOWS | 환경변수 목록, 필수/선택 구분 |
| `package.json` | - | REPO_MAP, WORKFLOWS | 의존성 버전, npm 스크립트 |

> 정규 문서는 기존 문서를 **대체하지 않으며**, AI 에이전트를 위한 정규화된 참조 레이어로 공존한다.
