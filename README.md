# Factory Boilerplate

`config/site.ts` 하나만 수정하면 프로덕션 수준의 SaaS를 즉시 배포할 수 있는 Next.js 보일러플레이트.

## 주요 기능

- **랜딩페이지** — Hero, Feature Tabs, 후기, 가격, CTA 등 siteConfig로 구성
- **인증** — Google OAuth (Auth.js + JWT 세션)
- **결제** — Paddle 통합, 환경변수로 활성화/비활성화
- **블로그** — MDX 파일 기반, 코드 하이라이팅, 태그 필터
- **SEO** — 동적 메타데이터, OG 이미지 자동 생성, sitemap, robots.txt
- **대시보드** — 인증 가드, Sidebar/Topbar, 설정 페이지
- **다크모드** — 시스템 설정 자동 감지 (next-themes)
- **i18n** — Dashboard UI 다국어 지원 구조 (next-intl)
- **Legal** — Privacy Policy, Terms of Service 자동 생성

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | ^15.3.2 |
| Language | TypeScript (strict) | ^5 |
| UI | React + shadcn/ui + Tailwind CSS v4 | ^19.1.0 |
| Auth | Auth.js (NextAuth) + Google OAuth | 5.0.0-beta.30 |
| Database | Neon Serverless Postgres + Prisma | ^6.19.2 |
| Blog | next-mdx-remote + rehype-pretty-code | ^6.0.0 |
| Payments | Paddle (선택) | 환경변수 토글 |
| Deploy | Vercel | - |

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

| 변수 | 필수 | 설명 |
|------|------|------|
| `DATABASE_URL` | 필수 | PostgreSQL 연결 (Neon: `postgresql://...?sslmode=require`) |
| `NEXTAUTH_URL` | 필수 | 앱 URL (`http://localhost:3000`) |
| `NEXTAUTH_SECRET` | 필수 | JWT 서명 키 (`openssl rand -base64 32`로 생성) |
| `GOOGLE_CLIENT_ID` | 필수* | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | 필수* | Google OAuth Client Secret |
| `PADDLE_API_KEY` | 선택 | 설정 시 결제 기능 활성화 |
| `PADDLE_WEBHOOK_SECRET` | 선택 | Paddle webhook 서명 검증 |

\* 미설정 시 개발 모드에서 mock session으로 대체

## 프로젝트 구조

```
app/                 라우트 합성 (pages, layouts, API routes)
features/            비즈니스 로직 (9개 독립 모듈, barrel export)
  landing/           랜딩페이지 + Dashboard UI
  auth/              인증 (Google OAuth)
  billing/           결제 (Paddle)
  blog/              블로그 (MDX)
  database/          Prisma 클라이언트
  seo/               메타데이터
  og/                OG 이미지
  legal/             법적 문서
shared/              공용 UI, 유틸, 프로바이더
config/site.ts       중앙 설정 (단일 소스)
content/blog/        MDX 블로그 글
prisma/              DB 스키마
messages/            i18n 번역
```

## 커스터마이징

1. **`config/site.ts`** 수정 — 앱 이름, 테마 색상, Hero, Feature, Pricing, Legal 등
2. **환경변수** 설정 — 인증, DB, 결제
3. **`content/blog/`** — MDX 파일 추가로 블로그 글 작성
4. **배포** — Vercel에 push

`siteConfig`의 nullable 필드(`banner`, `value`, `social` 등)를 `null`로 설정하면 해당 섹션이 자동으로 숨겨집니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 |
| `pnpm dev:turbo` | 개발 서버 (Turbopack) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Prisma Client 생성 |
| `pnpm db:migrate` | DB 마이그레이션 |
| `pnpm db:studio` | Prisma Studio GUI |

## 배포

Vercel에 GitHub 저장소를 연결하면 Next.js를 자동 감지하여 배포합니다. 대시보드에서 환경변수를 설정하세요.

## 문서

| 문서 | 설명 |
|------|------|
| `CLAUDE.md` | AI 에이전트 동작 규칙 |
| `docs_canonical/` | 아키텍처, 워크플로우, 스타일가이드, 테스팅 전략 |
| `PRD.md` | 제품 요구사항 명세 (한국어) |
| `openspec/` | OpenSpec 변경 관리 아티팩트 |

## License

MIT
