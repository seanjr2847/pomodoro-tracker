# Feature 삭제 가이드

각 Feature 삭제 시 함께 정리해야 할 파일/코드 목록.

## 편집 포인트 (개선 후)

| 목적 | 파일 | 설명 |
|------|------|------|
| Provider/오버레이 | `app/providers.tsx` | Feature import + JSX 제거 |
| CSP 도메인 | `config/csp.ts` | Feature 섹션 + merge 호출 제거 |
| Next.js 플러그인 | `next.config.ts` | import + plugin chain 제거 |
| DB 모델 | `prisma/schema.prisma` | 모델 + User relation 제거 |
| 환경변수 | `.env.example` | 해당 변수 제거 |

---

## billing

```bash
rm -rf features/billing/
rm -rf app/pricing/
rm -rf app/api/webhook/paddle/
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/providers.tsx` | `PaddleProvider` import + JSX 제거 |
| `app/dashboard/settings/page.tsx` | billing 관련 import + UI 제거 |
| `config/csp.ts` | `billing` 변수 + mergeDirectives에서 제거 |
| `config/site.ts` | `pricing` 객체 제거 |
| `prisma/schema.prisma` | `Subscription` 모델 제거 |
| `.env.example` | `PADDLE_*` 변수 제거 |

---

## blog

```bash
rm -rf features/blog/
rm -rf app/blog/
rm -rf content/blog/
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/sitemap.ts` | `getAllPosts` import + 블로그 URL 생성 로직 제거 |
| `config/site.ts` | `banner.href`가 `/blog`이면 수정 |

패키지 (changelog도 삭제 시에만): `pnpm remove next-mdx-remote gray-matter rehype-pretty-code shiki`

---

## email

```bash
rm -rf features/email/
rm -f app/contact/actions.ts  # email 연결 action
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/contact/page.tsx` | `action={submitContactWithEmail}` prop 제거 + actions import 제거 |
| `.env.example` | `RESEND_*` 변수 제거 |

패키지: `pnpm remove resend @react-email/components`

> contact Feature는 email 없이도 동작 (console 로그 폴백)

---

## contact

```bash
rm -rf features/contact/
rm -rf app/contact/
```

---

## ai-generation

```bash
rm -rf features/ai-generation/
rm -rf app/api/generate/
```

| 편집 파일 | 작업 |
|-----------|------|
| `.env.example` | `GEMINI_API_KEY` 제거 |
| `prisma/schema.prisma` | `Generation` 모델 제거 (result-history도 삭제 시) |

패키지: `pnpm remove @google/generative-ai`

---

## kanban (현재 미사용)

```bash
rm -rf features/kanban/
```

| 편집 파일 | 작업 |
|-----------|------|
| `prisma/schema.prisma` | `KanbanCard` 모델 제거 |

패키지: `pnpm remove @hello-pangea/dnd`

---

## result-history (현재 미사용)

```bash
rm -rf features/result-history/
```

| 편집 파일 | 작업 |
|-----------|------|
| `prisma/schema.prisma` | `Generation` 모델 제거 (ai-generation도 삭제 시) |

---

## share

```bash
rm -rf features/share/
rm -rf app/s/
```

| 편집 파일 | 작업 |
|-----------|------|
| `prisma/schema.prisma` | `SharedLink` 모델 제거 |

패키지: `pnpm remove html2canvas jspdf`

---

## analytics

```bash
rm -rf features/analytics/
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/providers.tsx` | `AnalyticsProvider`, `GAScript` import + JSX 제거 |
| `config/csp.ts` | `analytics` 변수 + mergeDirectives에서 제거 |
| `.env.example` | `NEXT_PUBLIC_POSTHOG_*`, `NEXT_PUBLIC_GA_ID` 제거 |

패키지: `pnpm remove posthog-js @vercel/analytics @vercel/speed-insights`

---

## monitoring

```bash
rm -rf features/monitoring/
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/providers.tsx` | `MonitoringProvider` import + JSX 제거 |
| `config/csp.ts` | `monitoring` 변수 + mergeDirectives에서 제거 |
| `next.config.ts` | Sentry webpack 블록 제거 |
| `.env.example` | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_*` 변수 제거 |

패키지: `pnpm remove @sentry/browser @sentry/webpack-plugin`

---

## cookie-consent

```bash
rm -rf features/cookie-consent/
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/providers.tsx` | `CookieBanner` import + JSX 제거 |
| `features/analytics/components/GAScript.tsx` | consent 관련 코드 제거 (선택) |

---

## pwa

```bash
rm -rf features/pwa/
rm -f app/manifest.ts
rm -rf app/offline/
rm -rf public/icons/
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/providers.tsx` | `PwaUpdater`, `isPwaEnabled` import + JSX 제거 |
| `next.config.ts` | `withSerwist` import + plugin chain에서 제거 |
| `middleware.ts` | matcher에서 `sw\\.js\|serwist-worker` 제거 |
| `.env.example` | `NEXT_PUBLIC_PWA_ENABLED` 제거 |
| `.gitignore` | sw.js 관련 줄 제거 |

패키지: `pnpm remove @serwist/next serwist`

---

## feedback

```bash
rm -rf features/feedback/
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/dashboard/page.tsx` | `FeedbackForm` import + 컴포넌트 제거 |

---

## changelog

```bash
rm -rf features/changelog/
rm -rf app/changelog/
rm -rf content/changelog/
```

패키지 (blog도 삭제 시에만): `pnpm remove next-mdx-remote gray-matter rehype-pretty-code shiki`

---

## usage

```bash
rm -rf features/usage/
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/dashboard/page.tsx` | `UsageDashboard` import + 컴포넌트 제거 |
| `prisma/schema.prisma` | `UsageRecord` 모델 제거 |

---

## api-keys

```bash
rm -rf features/api-keys/
rm -rf app/dashboard/api-keys/
```

| 편집 파일 | 작업 |
|-----------|------|
| `app/dashboard/page.tsx` | `ApiKeyManager` import + 컴포넌트 제거 |
| `prisma/schema.prisma` | `ApiKey` 모델 제거 |

---

## rate-limit

```bash
rm -rf features/rate-limit/
```

| 편집 파일 | 작업 |
|-----------|------|
| `middleware.ts` | `rateLimit` import + API rate limiting 로직 제거 |

---

## 삭제 후 공통 절차

```bash
pnpm db:generate    # Prisma 모델 삭제 시
pnpm lint && pnpm build
pnpm prune
```

## 함께 삭제되는 세트

| 세트 | Feature 목록 |
|------|-------------|
| AI 전체 | ai-generation + result-history + usage |
| 블로그 전체 | blog + changelog |
| 이메일 전체 | email (contact는 독립 동작) |
| SaaS 결제 | billing |
