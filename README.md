# Factory Boilerplate

`config/site.ts` 하나만 수정하면 프로덕션 수준의 SaaS를 즉시 배포할 수 있는 Next.js 보일러플레이트.

## 주요 기능

### Core

- **랜딩페이지** — Hero, Feature Tabs, 후기, 가격, CTA 등 siteConfig로 구성
- **인증** — Google OAuth (Auth.js + JWT 세션)
- **결제** — Paddle 통합, 환경변수로 활성화/비활성화
- **블로그** — MDX 파일 기반, 코드 하이라이팅, 태그 필터
- **대시보드** — 인증 가드, Sidebar/Topbar, 설정, API 키 관리, 사용량 추적
- **SEO** — 동적 메타데이터, OG 이미지 자동 생성, sitemap, robots.txt
- **Legal** — Privacy Policy, Terms of Service 자동 생성
- **다크모드** — 시스템 설정 자동 감지 (next-themes)
- **i18n** — Dashboard UI 다국어 지원 구조 (next-intl)

### SaaS 인프라

- **API 클라이언트** — typed fetch 래퍼 (`api.get`, `api.post`, ...)
- **API 키 관리** — SHA-256 해싱, 생성/폐기 UI, React Query 연동
- **사용량 미터링** — Free/Pro 요금제별 한도 추적, 프로그레스 바 대시보드
- **속도 제한** — 슬라이딩 윈도우 in-memory rate limiter, 미들웨어 적용

### 커뮤니케이션

- **Transactional Email** — Resend + React Email 템플릿 (환영, 결제 확인, 문의)
- **Contact 폼** — react-hook-form + zod 검증 → Resend로 이메일 발송
- **피드백 폼** — react-hook-form + zod 패턴 레퍼런스 구현
- **Toast 알림** — Sonner, 전역 활성화 (`toast.success("msg")`)
- **Copy to Clipboard** — 유틸 + toast 자동 연동

### 데이터 & UI

- **DataTable** — @tanstack/react-table 래핑, 정렬/필터/페이지네이션 내장
- **커서 페이지네이션 훅** — `useCursorPagination` (loadNext/loadPrev + 페이지 캐싱)
- **Changelog** — MDX 기반, 버전별 변경 기록

### 운영

- **Analytics** — PostHog + GA4, 환경변수 토글, 자동 pageview 추적
- **Error Monitoring** — Sentry (@sentry/browser), 환경변수 토글
- **Cookie Consent** — GDPR 동의 배너, localStorage 영속화

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) + TypeScript 5 (strict) |
| UI | React 19 + shadcn/ui + Tailwind CSS v4 + Radix UI |
| Auth | Auth.js (NextAuth) + Google OAuth + Prisma Adapter |
| Database | Neon Serverless Postgres + Prisma |
| Blog | next-mdx-remote + rehype-pretty-code + gray-matter |
| Payments | Paddle (환경변수 토글) |
| Email | Resend + @react-email/components (환경변수 토글) |
| Forms | react-hook-form + @hookform/resolvers + zod |
| Data Table | @tanstack/react-table |
| Data Fetching | @tanstack/react-query |
| Analytics | posthog-js / GA4 (환경변수 토글) |
| Monitoring | @sentry/browser (환경변수 토글) |
| Testing | Vitest + @playwright/test |
| Deploy | Vercel |

## Quick Start

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일을 편집하여 값 입력 (아래 환경변수 표 참조)

# 3. Prisma Client 생성
pnpm db:generate

# 4. DB 마이그레이션
pnpm db:migrate

# 5. 개발 서버 실행
pnpm dev
```

> **OAuth 없이 테스트**: `GOOGLE_CLIENT_ID`를 설정하지 않으면 개발 모드에서 mock session이 자동 활성화되어 대시보드를 바로 테스트할 수 있습니다.

## 환경변수

### 필수

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | PostgreSQL 연결 (Neon: `postgresql://...?sslmode=require`) |
| `NEXTAUTH_URL` | 앱 URL (`http://localhost:3000`) |
| `NEXTAUTH_SECRET` | JWT 서명 키 (`openssl rand -base64 32`로 생성) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (미설정 시 mock session) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

### 선택 (환경변수 유무로 자동 토글)

| 변수 | 기능 | 없을 때 |
|------|------|--------|
| `PADDLE_API_KEY` | Paddle 결제 | 결제 UI 숨김 |
| `PADDLE_WEBHOOK_SECRET` | Paddle webhook 검증 | - |
| `RESEND_API_KEY` | Transactional Email | console 로그 |
| `RESEND_FROM_EMAIL` | 발신 이메일 주소 | `onboarding@resend.dev` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog Analytics | 완전 비활성 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 | 완전 비활성 |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry Error Monitoring | console 폴백 |

## 프로젝트 구조

```
app/                  라우트 합성 (pages, layouts, API routes)
features/             비즈니스 로직 (19개 독립 모듈, barrel export)
  landing/            랜딩페이지 + Dashboard shell UI
  auth/               인증 (Google OAuth)
  billing/            결제 (Paddle)
  blog/               블로그 (MDX)
  contact/            문의 폼 → 이메일 발송
  feedback/           피드백 폼 (react-hook-form + zod 패턴)
  email/              Resend 이메일 + React Email 템플릿
  analytics/          PostHog + GA4 통합
  monitoring/         Sentry 에러 모니터링
  cookie-consent/     GDPR 쿠키 동의 배너
  api-client/         typed fetch 래퍼
  api-keys/           API 키 관리
  usage/              사용량 미터링
  rate-limit/         API 속도 제한
  changelog/          체인지로그 (MDX)
  database/           Prisma 클라이언트
  seo/                메타데이터
  og/                 OG 이미지
  legal/              법적 문서
shared/               공용 UI, 유틸, 프로바이더, hooks
  ui/                 shadcn/ui 컴포넌트 + DataTable + SortableHeader
  utils/              cn(), copyToClipboard()
  hooks/              useMediaQuery, useDarkMode, useCursorPagination, useToast
config/site.ts        중앙 설정 (단일 소스)
content/blog/         MDX 블로그 글
prisma/               DB 스키마
messages/             i18n 번역
tests/e2e/            Core E2E 테스트
```

## 커스터마이징

1. **`config/site.ts`** 수정 — 앱 이름, 테마 색상, Hero, Feature, Pricing, Legal 등
2. **환경변수** 설정 — 인증, DB, 결제, 이메일, 분석, 모니터링
3. **`content/blog/`** — MDX 파일 추가로 블로그 글 작성
4. **배포** — Vercel에 push

`siteConfig`의 nullable 필드(`banner`, `value`, `social` 등)를 `null`로 설정하면 해당 섹션이 자동으로 숨겨집니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 |
| `pnpm dev:turbo` | 개발 서버 (Turbopack) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit 테스트 (Vitest) |
| `pnpm test:watch` | Unit 테스트 (watch 모드) |
| `pnpm test:e2e` | E2E 테스트 (Playwright) |
| `pnpm db:generate` | Prisma Client 생성 |
| `pnpm db:migrate` | DB 마이그레이션 |
| `pnpm db:studio` | Prisma Studio GUI |

## 테스트

테스트는 Feature 폴더에 co-locate. Feature 삭제 시 테스트도 자동 삭제.

```
features/{name}/__tests__/*.test.ts    # Unit (Vitest)
features/{name}/__e2e__/*.spec.ts      # E2E (Playwright)
shared/__tests__/*.test.ts             # Core unit
tests/e2e/*.spec.ts                    # Core E2E
```

```bash
pnpm test                    # 171 unit tests
pnpm test -- --coverage      # 커버리지 리포트
pnpm test:e2e                # E2E (dev 서버 자동 시작)
```

## 배포

Vercel에 GitHub 저장소를 연결하면 Next.js를 자동 감지하여 배포합니다. 대시보드에서 환경변수를 설정하세요.

## 문서

| 문서 | 설명 |
|------|------|
| `docs/REPO_MAP.md` | 디렉토리 구조, Feature 모듈 맵, 의존성 그래프 |
| `docs/STYLEGUIDE.md` | 코드 스타일, 컴포넌트 패턴, 공통 사용법 |
| `docs/WORKFLOWS.md` | 환경 셋업, 배포, DB 마이그레이션 |
| `docs/TESTING.md` | 테스트 전략, 파일 위치 규칙, 커버리지 |
| `docs/TASKS.md` | 작업 현황, 미완료 항목 |
| `CLAUDE.md` | AI 에이전트 동작 규칙 |
| `PRD.md` | 제품 요구사항 명세 (한국어) |

## License

MIT
