# Factory Boilerplate

`config/site.ts` 하나만 수정하면 프로덕션 수준의 SaaS를 즉시 배포할 수 있는 Next.js 보일러플레이트.

---

## For AI Agents: How to Use This Boilerplate

이 섹션은 **AI 에이전트(Claude, GPT, Copilot 등)가 이 보일러플레이트를 기반으로 SaaS를 구축할 때** 따라야 할 가이드입니다.

### Step 1: 프로젝트 이해

작업 전 반드시 읽어야 할 문서 (우선순위 순):

| 문서 | 용도 | 언제 읽는가 |
|------|------|-----------|
| `CLAUDE.md` | 작업 규칙, 금지 사항, 커맨드 | **항상 최우선** |
| `docs/REPO_MAP.md` | 디렉토리 구조, Feature 모듈 맵, 라우트 테이블, 의존성 그래프 | 파일 위치를 모를 때 |
| `docs/STYLEGUIDE.md` | import 규칙, 컴포넌트 패턴, 네이밍, 공통 패턴 (Form, DataTable, Toast 등) | 코드 작성 시 |
| `docs/WORKFLOWS.md` | 환경 셋업, npm 스크립트, Feature 추가 절차, 블로그 글 추가, 배포 | 환경/배포 작업 시 |
| `docs/TESTING.md` | 테스트 파일 위치 규칙, Vitest/Playwright 설정 | 테스트 작성 시 |
| `config/site.ts` | SiteConfig 인터페이스 — 모든 콘텐츠의 단일 소스 | 랜딩페이지/브랜딩 변경 시 |

### Step 2: 핵심 아키텍처 규칙

#### 절대 금지 (NEVER)

```
- feature 모듈 간 직접 import 금지 → index.ts barrel export 통해서만
- 클라이언트 컴포넌트에서 DB 직접 접근 금지 → Server Actions 사용
- .env 파일 커밋 금지
- 기존 prisma/migrations/ 수정 금지
- 테스트/린트 삭제 금지 (예외: docs/TESTING.md에 이유 기록)
```

#### Import 규칙

```typescript
// 올바름 — barrel export
import { auth, SignInButton } from "@/features/auth";
import { Button, Card } from "@/shared/ui";
import { siteConfig } from "@/config/site";

// 금지 — deep import
import { SignInButton } from "@/features/auth/components/SignInButton";

// Feature 내부에서는 상대 경로
import { Navbar } from "./components/Navbar";
```

#### 레이어 구조

```
app/           → 라우트 합성만. 비즈니스 로직 없음
features/      → 독립 모듈. barrel export(index.ts)로만 외부 노출
shared/        → 공용 UI, 유틸, hooks. 모든 곳에서 자유롭게 import
config/        → siteConfig 단일 소스
```

#### 의존성 방향 (반드시 준수)

```
app/ → features/ → shared/, config/
         ↓
      features/database  (Prisma)

금지: features/A → features/B 직접 import
허용: features/auth → features/database (하위→상위만)
결합 필요 시: app/ 레이어에서 slot prop 패턴 사용
```

### Step 3: 새 SaaS 구축 체크리스트

#### 1. 브랜딩 변경 (config/site.ts)

```typescript
export const siteConfig: SiteConfig = {
  name: "Your App",                    // 앱 이름
  description: "Your description",      // SEO + OG 메타
  url: "https://yourapp.com",          // 프로덕션 URL
  creator: "Your Name",
  email: "hello@yourapp.com",
  theme: {
    primary: "#6366f1",                // 메인 색상 (hex)
    gradient: "linear-gradient(...)",
  },
  // hero, featureTabs, sections, testimonials, pricing, legal, about...
  // nullable 필드를 null로 설정하면 해당 섹션 자동 숨김
};
```

#### 2. 환경변수 설정 (.env)

```bash
cp .env.example .env
# 필수: DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID/SECRET
# 선택: PADDLE_*, RESEND_*, NEXT_PUBLIC_POSTHOG_*, NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_SENTRY_DSN
```

**환경변수 토글 패턴**: 선택 기능은 환경변수 유무로 자동 활성화/비활성화됨. 코드 수정 불필요.

| 환경변수 | 기능 | 없을 때 |
|---------|------|--------|
| `PADDLE_API_KEY` | 결제 | 결제 UI 숨김 |
| `RESEND_API_KEY` | 이메일 | console 로그 |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog | 완전 비활성 |
| `NEXT_PUBLIC_GA_ID` | GA4 | 완전 비활성 |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry | console 폴백 |
| `UPSTASH_REDIS_REST_URL` | Redis rate limit | 인메모리 폴백 |

#### 3. Feature 모듈 추가

```bash
mkdir -p features/my-feature/components
```

```
features/my-feature/
├── index.ts          # 필수 — 외부 공개 API만 export
├── components/       # React 컴포넌트
├── hooks/            # 커스텀 hooks
├── lib/              # 유틸리티, 비즈니스 로직
├── actions/          # Server Actions
├── types/            # TypeScript 타입
├── __tests__/        # Unit 테스트 (.test.ts)
└── __e2e__/          # E2E 테스트 (.spec.ts)
```

**barrel export 예시** (`index.ts`):
```typescript
export { MyComponent } from "./components/MyComponent";
export { useMyHook } from "./hooks/useMyHook";
export type { MyType } from "./types";
```

#### 4. API 라우트 추가

```typescript
// app/api/my-resource/route.ts
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/features/auth";

export async function GET(request: Request) {
  const authResult = await authenticateRequest(request);
  if (!authResult) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // authResult.userId 사용 가능
}
```

`authenticateRequest`는 세션(auth())과 API 키(X-API-Key 헤더) 모두 지원.

#### 5. Server Action 추가

```typescript
"use server";

import { z } from "zod/v4";
import { auth } from "@/features/auth";
import { ok, fail, type ActionResult } from "@/shared/lib/actionResult";

const schema = z.object({ title: z.string().min(1).max(200) });

export async function createItemAction(
  input: z.infer<typeof schema>
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(`Validation: ${parsed.error.message}`);

  // ... Prisma 쿼리
  return ok({ id: "created-id" });
}
```

**에러 패턴**: 모든 Server Action은 `ActionResult<T>` 반환. throw 대신 `fail()` 사용.

#### 6. RBAC (역할 기반 접근 제어)

```typescript
import { requireRole } from "@/shared/lib/requireRole";

export async function adminOnlyAction() {
  const result = await requireRole("ADMIN");
  if (!result.success) return fail(result.error);
  // result.userId, result.role 사용 가능
}
```

#### 7. 페이지 추가 (Dashboard)

```typescript
// app/dashboard/my-page/page.tsx
import { MyComponent } from "@/features/my-feature";

export default function MyPage() {
  return <MyComponent />;
}
```

대시보드 사이드바에 메뉴 추가: `config/site.ts`의 `dashboardMenu` 배열에 항목 추가.

#### 8. 블로그 글 추가

`content/blog/<slug>.mdx` 파일 생성:

```mdx
---
title: "글 제목"
description: "간단한 설명"
date: "2026-04-06"
tags: ["nextjs", "tutorial"]
published: true
---

본문...
```

`published: false` → 목록/sitemap에서 자동 제외.

### Step 4: 검증

```bash
pnpm lint          # ESLint
pnpm test          # Unit 테스트 (Vitest, 215개)
pnpm build         # 타입체크 + 프로덕션 빌드
```

커밋 전 반드시 `pnpm build` 성공 확인.

### Step 5: 자주 쓰는 공통 패턴

#### Toast 알림
```typescript
import { toast } from "sonner";
toast.success("저장 완료");
toast.error("실패");
```

#### Copy to Clipboard
```typescript
import { copyToClipboard } from "@/shared/utils/clipboard";
await copyToClipboard(text, "Copied!"); // toast 자동 표시
```

#### Form (react-hook-form + zod)
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3"; // hookform 호환 위해 zod/v3 사용

const schema = z.object({ name: z.string().min(2) });
const form = useForm({ resolver: zodResolver(schema) });
```

> **주의**: Form 스키마는 `zod/v3`에서 import. Server Action 등 다른 용도는 `zod/v4` 사용.

#### DataTable
```typescript
import { DataTable, SortableHeader } from "@/shared/ui";
```

#### Transactional Email
```typescript
import { sendEmail, WelcomeEmail } from "@/features/email";
await sendEmail({ to: "user@email.com", subject: "Welcome", react: WelcomeEmail({ name: "John" }) });
```

#### Analytics
```typescript
import { trackEvent } from "@/features/analytics";
trackEvent("button_click", { page: "/pricing" });
```

### 주의사항 for AI Agents

1. **파일 읽기 우선**: 수정 전 반드시 해당 파일을 읽어 현재 상태를 확인하라
2. **barrel export 준수**: 새 컴포넌트/함수 추가 시 반드시 해당 feature의 `index.ts`에 export 추가
3. **환경변수 추가 시**: `.env.example`에도 추가하고, 없을 때의 폴백 동작 구현
4. **Prisma 스키마 변경 시**: `pnpm db:generate` 실행. 마이그레이션은 `pnpm db:migrate`
5. **shadcn/ui 컴포넌트 추가 시**: `npx shadcn@latest add <name>` → `shared/ui/index.ts`에 export 추가
6. **테스트 작성**: `features/<name>/__tests__/<name>.test.ts` (unit), `features/<name>/__e2e__/<name>.spec.ts` (E2E)
7. **i18n**: Dashboard UI만 `next-intl` 적용. 랜딩페이지는 `siteConfig`에서 관리
8. **에러 패턴**: Server Actions는 `ActionResult<T>` (`ok()`/`fail()`). throw 금지

---

## 주요 기능

### Core

- **랜딩페이지** — Hero, Feature Tabs, 후기, 가격, CTA 등 siteConfig로 구성
- **인증** — Google OAuth (Auth.js + JWT 세션) + API 키 인증
- **결제** — Paddle 통합, 환경변수로 활성화/비활성화
- **블로그** — MDX 파일 기반, 코드 하이라이팅, 태그 필터
- **대시보드** — 미들웨어 인증 가드, Sidebar/Topbar, 설정, API 키 관리, 사용량 추적
- **SEO** — 동적 메타데이터, OG 이미지 자동 생성, sitemap, robots.txt, JSON-LD
- **Legal** — Privacy Policy, Terms of Service 자동 생성
- **다크모드** — 시스템 설정 자동 감지 (next-themes)
- **i18n** — Dashboard UI 다국어 지원 (next-intl, en/ko)
- **PWA** — 서비스 워커, manifest, 오프라인 지원 (환경변수 토글)

### SaaS 인프라

- **API 인증** — 세션 + API 키 이중 인증 (`authenticateRequest`)
- **RBAC** — `requireRole()` guard 유틸리티 (USER, ADMIN)
- **API 키 관리** — SHA-256 해싱, 생성/폐기 UI, 만료/사용 추적
- **사용량 미터링** — Free/Pro 요금제별 한도 추적
- **속도 제한** — Upstash Redis (프로덕션) / 인메모리 (개발) 자동 전환
- **에러 패턴** — `ActionResult<T>` 통일된 Server Action 응답

### 커뮤니케이션

- **Transactional Email** — Resend + React Email 템플릿
- **Contact 폼** — react-hook-form + zod 검증 → Resend로 발송
- **Toast 알림** — Sonner 전역 활성화
- **Copy to Clipboard** — 유틸 + toast 자동 연동

### 운영

- **Analytics** — PostHog + GA4, 환경변수 토글
- **Error Monitoring** — Sentry, 환경변수 토글
- **Cookie Consent** — GDPR 동의 배너
- **CI/CD** — GitHub Actions (lint → build)
- **Docker** — 멀티스테이지 Dockerfile + docker-compose.dev.yml

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
| Rate Limiting | @upstash/ratelimit + @upstash/redis (인메모리 폴백) |
| Analytics | posthog-js / GA4 (환경변수 토글) |
| Monitoring | @sentry/browser (환경변수 토글) |
| PWA | @serwist/next (환경변수 토글) |
| Testing | Vitest + @playwright/test |
| CI/CD | GitHub Actions |
| Deploy | Vercel / Docker |

## Quick Start

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일을 편집하여 값 입력

# 3. Prisma Client 생성
pnpm db:generate

# 4. DB 마이그레이션
pnpm db:migrate

# 5. 개발 서버 실행
pnpm dev
```

> **OAuth 없이 테스트**: `GOOGLE_CLIENT_ID`를 설정하지 않으면 개발 모드에서 mock session이 자동 활성화되어 대시보드를 바로 테스트할 수 있습니다.

## 프로젝트 구조

```
app/                  라우트 합성 (pages, layouts, API routes)
features/             비즈니스 로직 (독립 모듈, barrel export)
  landing/            랜딩페이지 + Dashboard shell UI
  auth/               인증 (Google OAuth + API Key)
  billing/            결제 (Paddle)
  blog/               블로그 (MDX)
  contact/            문의 폼 → 이메일 발송
  feedback/           피드백 폼
  email/              Resend 이메일 + React Email 템플릿
  analytics/          PostHog + GA4 통합
  monitoring/         Sentry 에러 모니터링
  cookie-consent/     GDPR 쿠키 동의 배너
  api-client/         typed fetch 래퍼
  api-keys/           API 키 관리
  usage/              사용량 미터링
  rate-limit/         API 속도 제한 (Upstash Redis / 인메모리)
  changelog/          체인지로그 (MDX)
  ai-generation/      AI 텍스트 생성 (Gemini)
  share/              콘텐츠 공유 링크
  pwa/                PWA (서비스 워커, manifest)
  database/           Prisma 클라이언트
  seo/                메타데이터 + JSON-LD
  og/                 OG 이미지
  legal/              법적 문서
shared/               공용 UI, 유틸, 프로바이더, hooks
  ui/                 shadcn/ui 컴포넌트 + DataTable + SortableHeader
  utils/              cn(), copyToClipboard()
  hooks/              useMediaQuery, useDarkMode, useCursorPagination
  lib/                actionResult, requireRole, logger
config/site.ts        중앙 설정 (단일 소스)
content/blog/         MDX 블로그 글
prisma/               DB 스키마
messages/             i18n 번역 (en.json, ko.json)
tests/e2e/            Core E2E 테스트
```

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
| `pnpm analyze` | 번들 분석 |
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

## 배포

### Vercel
GitHub 저장소 연결 → Next.js 자동 감지 → 환경변수 설정 → 배포.

### Docker
```bash
docker compose -f docker-compose.dev.yml up  # 개발 환경 (PostgreSQL 포함)
docker build -t my-saas .                     # 프로덕션 이미지
```

## 문서

| 문서 | 설명 |
|------|------|
| `CLAUDE.md` | AI 에이전트 동작 규칙, 작업 루프 |
| `docs/REPO_MAP.md` | 디렉토리 구조, Feature 모듈 맵, 의존성 그래프 |
| `docs/STYLEGUIDE.md` | 코드 스타일, 컴포넌트 패턴, 공통 사용법 |
| `docs/WORKFLOWS.md` | 환경 셋업, 배포, DB 마이그레이션 |
| `docs/TESTING.md` | 테스트 전략, 파일 위치 규칙 |

## License

MIT
