# Style Guide

## 1. TypeScript 설정

- **Strict mode** 활성화 (`"strict": true`)
- **Target**: ES2017
- **Module resolution**: bundler
- **JSX**: preserve (Next.js가 컴파일)
- **Path alias**: `@/*` → 프로젝트 루트 (예: `@/features/auth`, `@/shared/ui`, `@/config/site`)

---

## 2. Import 규칙

### Barrel Export 원칙

Feature 모듈은 반드시 `index.ts` barrel export를 통해서만 import:

```typescript
// 올바름
import { LandingPage, Navbar } from "@/features/landing";
import { auth, SignInButton } from "@/features/auth";
import { Button, Card } from "@/shared/ui";

// 금지 — barrel 우회 deep import
import { Navbar } from "@/features/landing/components/Navbar";
```

### Import 경로 패턴

| 대상 | Import 경로 |
|------|------------|
| Feature 모듈 | `@/features/<name>` (barrel export) |
| UI 컴포넌트 | `@/shared/ui` (barrel export) |
| 유틸리티 | `@/shared/utils/cn`, `@/shared/utils/clipboard` |
| 커스텀 훅 | `@/shared/hooks/<hookName>` |
| 설정 | `@/config/site` |
| Feature 내부 | 상대 경로 (`./components/Navbar`, `../lib/renderSections`) |

### 알려진 예외

- `app/api/webhook/paddle/route.ts`가 `@/features/billing/api/webhook`과 `@/features/billing/config/paddle`을 deep import (barrel 우회). 이는 API route에서의 실용적 선택이나 이상적으로는 barrel export에 추가해야 함.

---

## 3. 컴포넌트 패턴

### Server Component (기본)

모든 컴포넌트는 기본적으로 Server Component. `"use client"` 선언 없음:

```typescript
// Server Component — async 가능, 서버 데이터 직접 접근
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### Client Component (최소화)

`"use client"`는 파일 첫 줄에 선언. 상호작용, 브라우저 API, React hooks 필요 시에만 사용:

```typescript
"use client";
import { useState, useEffect } from "react";

export function InteractiveComponent() {
  const [state, setState] = useState(false);
  // ...
}
```

### Props 패턴

```typescript
// children/slot에는 ReactNode
interface LandingPageProps {
  pricingSlot?: ReactNode;
}

// Layout children은 Readonly 래퍼
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {}

// Page의 async params/searchParams
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {}
```

---

## 4. Feature 모듈 내부 구조

### 표준 디렉토리

```
features/<name>/
├── index.ts          # 공개 API barrel export (필수)
├── components/       # React 컴포넌트
├── hooks/            # 커스텀 React hooks
├── config/           # 설정, 상수
├── lib/              # 유틸리티, 비즈니스 로직
├── actions/          # Server Actions
├── api/              # API 관련 유틸 (webhook 검증 등)
├── types/            # TypeScript 타입 정의
├── templates/        # 템플릿 컴포넌트 (이메일, OG 이미지)
├── content/          # 정적 콘텐츠 (법적 문서 텍스트)
├── __tests__/        # Unit 테스트 (Feature co-locate)
└── __e2e__/          # E2E 테스트 (Feature co-locate)
```

모든 하위 디렉토리는 선택적 — 필요한 것만 생성.

### Barrel Export 규칙

`index.ts`에는 외부에 노출할 공개 API만 포함:

```typescript
// features/auth/index.ts
export { auth, signIn, signOut } from "./config/auth";
export { SignInButton } from "./components/SignInButton";
export { SignOutButton } from "./components/SignOutButton";
export { UserMenu } from "./components/UserMenu";
```

Type export는 `export type` 사용:

```typescript
// features/blog/index.ts
export type { Post, Frontmatter } from "./types";
```

---

## 5. 스타일링 규칙

### Tailwind CSS v4

- PostCSS 플러그인: `@tailwindcss/postcss`
- CSS 변수: oklch 색상 공간으로 정의 (`app/globals.css`)
- 다크모드: `@custom-variant dark (&:is(.dark *));` + `.dark` 클래스 토글

### 클래스 합성

`cn()` 유틸리티 사용 (clsx + tailwind-merge):

```typescript
import { cn } from "@/shared/utils/cn";

<div className={cn(
  "rounded-lg px-4 py-2 text-sm",
  isActive && "bg-primary text-primary-foreground",
  className
)} />
```

### shadcn/ui 설정

- **Style**: radix-nova
- **Base color**: neutral
- **CSS variables**: 활성화
- **Icon library**: lucide
- **Aliases**: components → `@/shared`, ui → `@/shared/ui`, utils → `@/shared/utils/cn`, hooks → `@/shared/hooks`

### Font

- **Geist Sans**: 인터페이스 텍스트 (`--font-geist-sans`)
- **Geist Mono**: 코드, 메트릭 (`--font-geist-mono`)
- `next/font/google`로 로드, `app/layout.tsx`의 `<html>` 태그에 CSS 변수 적용

### 색상 시스템

- 테마 토큰 사용: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground` 등
- 사이트 테마 색상: `--site-primary`, `--site-gradient` (globals.css `:root`에서 정의)
- 다크모드 색상: `.dark` 클래스에서 자동 전환

### 반응형 패턴

```typescript
// Container — max-width + 반응형 padding
<div className="mx-auto max-w-5xl px-3 lg:px-4 xl:px-0">

// Grid — 반응형 columns
<div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-4">

// 모바일 숨김
<div className="hidden lg:flex">
```

### 커스텀 애니메이션

`globals.css`에 정의된 dub.co 영감 애니메이션:
- `animate-slide-up-fade` — 아래에서 위로 슬라이드 + 페이드
- `animate-fade-in` — 페이드 인
- `animate-scale-fade` — 스케일 + 페이드

---

## 6. 네이밍 컨벤션

| 대상 | 컨벤션 | 예시 |
|------|--------|------|
| 디렉토리 | kebab-case | `features/landing/`, `shared/ui/` |
| 컴포넌트 파일 | PascalCase | `SignInButton.tsx`, `LandingPage.tsx` |
| 유틸/훅/설정 파일 | camelCase | `useSession.ts`, `renderSections.ts`, `auth.ts` |
| 타입 정의 파일 | camelCase 또는 디렉토리 | `types/index.ts` |
| Unit 테스트 파일 | kebab-case + `.test.ts` | `verify-signature.test.ts`, `mdx.test.ts` |
| E2E 테스트 파일 | kebab-case + `.spec.ts` | `blog.spec.ts`, `pricing.spec.ts` |
| 테스트 디렉토리 | `__tests__/` (unit), `__e2e__/` (E2E) | `features/blog/__tests__/` |
| 컴포넌트 export | PascalCase | `export function SignInButton()` |
| 훅 export | camelCase (use prefix) | `export function useSubscription()` |
| 유틸 export | camelCase | `export function getAllPosts()` |
| 환경변수 | SCREAMING_SNAKE_CASE | `PADDLE_API_KEY`, `DATABASE_URL` |
| CSS 변수 | kebab-case (-- prefix) | `--color-primary`, `--font-sans` |
| DB 테이블 | snake_case (@@map) | `users`, `accounts`, `subscriptions` |

---

## 7. 공통 패턴

### Toast 알림 (Sonner)

```typescript
import { toast } from "sonner";

toast.success("완료!");
toast.error("실패!");
toast("일반 메시지");
```

`<SonnerToaster>` 는 `app/layout.tsx`에서 전역 렌더링. 별도 설정 불필요.

### Copy to Clipboard

```typescript
import { copyToClipboard } from "@/shared/utils/clipboard";

// toast.success 자동 호출
await copyToClipboard(text);
await copyToClipboard(apiKey, "API key copied");
```

### Form 패턴 (react-hook-form + zod)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3"; // hookform 호환 위해 zod/v3 사용

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "" },
});
```

> **주의**: `@hookform/resolvers`는 `zod/v3` 호환 레이어를 기대함. Form 스키마는 `"zod/v3"`에서 import. 다른 용도(webhook 등)는 `"zod/v4"` 사용 가능.

참조 구현: `features/feedback/` (FeedbackForm), `features/contact/` (ContactForm)

### DataTable (정렬/필터/페이지네이션)

```typescript
import { DataTable, SortableHeader } from "@/shared/ui";
import { type ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
  },
  // ...
];

<DataTable columns={columns} data={items} searchKey="name" pageSize={10} />
```

### 커서 기반 페이지네이션

```typescript
import { useCursorPagination } from "@/shared/hooks/useCursorPagination";

const { items, isLoading, hasNextPage, hasPrevPage, loadFirst, loadNext, loadPrev } =
  useCursorPagination({
    fetcher: (cursor) => fetch(`/api/items?cursor=${cursor ?? ""}`).then(r => r.json()),
  });
```

### Transactional Email (Resend)

```typescript
// Server-side only
import { sendEmail, WelcomeEmail } from "@/features/email";

await sendEmail({
  to: "user@example.com",
  subject: "Welcome!",
  react: WelcomeEmail({ name: "John" }),
});
```

환경변수 없으면 console에 로그만 출력 (개발 모드 안전).

### Analytics 이벤트 추적

```typescript
import { trackEvent, identifyUser } from "@/features/analytics";

trackEvent("button_click", { page: "/pricing" });
identifyUser(userId, { plan: "pro" });
```

PostHog(`NEXT_PUBLIC_POSTHOG_KEY`) 또는 GA4(`NEXT_PUBLIC_GA_ID`) 환경변수 없으면 완전 비활성.

### Error Monitoring (Sentry)

```typescript
import { captureException, captureMessage, setUser } from "@/features/monitoring";

captureException(error, { context: "checkout" });
captureMessage("deploy complete", "info");
setUser({ id: userId, email });
```

`NEXT_PUBLIC_SENTRY_DSN` 없으면 console 출력으로 폴백.

### Cookie Consent

`<CookieBanner />`는 `app/layout.tsx`에서 전역 렌더링. 사용자 응답은 localStorage에 저장.

```typescript
import { hasConsented, hasResponded } from "@/features/cookie-consent";

if (hasConsented()) { /* 쿠키/트래킹 활성화 */ }
```

---

## 8. 환경변수 토글 패턴

선택적 기능은 환경변수 유무로 자동 활성화/비활성화:

| Feature | 환경변수 | 없을 때 동작 |
|---------|---------|-------------|
| Paddle 결제 | `PADDLE_API_KEY` | 결제 UI 숨김 |
| Transactional Email | `RESEND_API_KEY` | console 로그 |
| PostHog Analytics | `NEXT_PUBLIC_POSTHOG_KEY` | 완전 비활성 |
| GA4 Analytics | `NEXT_PUBLIC_GA_ID` | 완전 비활성 |
| Sentry Monitoring | `NEXT_PUBLIC_SENTRY_DSN` | console 폴백 |
| Google OAuth | `GOOGLE_CLIENT_ID` | Mock session (dev) |

각 Feature의 `lib/config.ts`에 `is<Feature>Enabled` 플래그가 정의됨.

---

## 9. i18n 규칙

### 적용 범위

| 영역 | i18n 적용 | 콘텐츠 소스 |
|------|----------|------------|
| Dashboard UI | `next-intl` (messages/en.json) | 버튼, 라벨, 메시지, 에러 |
| Landing page | 미적용 | `config/site.ts` (siteConfig) |
| Legal pages | 미적용 (영어 고정) | `features/legal/content/` |
| Blog | 미적용 | MDX 파일 직접 작성 |

### 사용 패턴

```typescript
// Server Component
import { getTranslations } from "next-intl/server";
const t = await getTranslations("dashboard");

// Client Component
import { useTranslations } from "next-intl";
const t = useTranslations("dashboard");
```

### 번역 키 구조 (messages/en.json)

```json
{
  "auth": { "signIn": "...", "signOut": "..." },
  "dashboard": { "home": "...", "settings": "...", "empty": { ... } },
  "settings": { "profile": "...", "subscription": "...", "danger": { ... } },
  "errors": { "default": "...", "notFound": "..." }
}
```

---

## 10. ESLint 설정

- **Config format**: Flat config (ESLint 9)
- **Extends**: `next/core-web-vitals`, `next/typescript`
- **커스텀 규칙**: 없음
- **Formatter**: Prettier 미설정 (Tailwind + ESLint만 사용)
