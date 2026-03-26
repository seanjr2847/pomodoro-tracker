# Tasks

## 1. OpenSpec 태스크 상태

`openspec/changes/nextjs-saas-boilerplate/` change:

- **15 섹션**, 전체 태스크 **완료**
- **아카이브 준비 완료** (`/opsx:archive nextjs-saas-boilerplate`)

---

## 2. 최근 완료된 작업

### Paddle Checkout 연동 (완료)

- **PaddleProvider** (`features/billing/components/PaddleProvider.tsx`) — Paddle.js v2 스크립트 로드 + 초기화
- **PricingCard** → client component 전환, `Paddle.Checkout.open()` 핸들러 + `useSession` 유저 정보 전달
- **타입 선언** (`features/billing/types/paddle.d.ts`) — `window.Paddle` 글로벌 타입
- **환경변수** — `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, `NEXT_PUBLIC_PADDLE_PRICE_ID`, `NEXT_PUBLIC_PADDLE_ENV`

### Paddle Subscription DB 영속화 (완료)

- Webhook handler → DB upsert, Server Action, Settings 페이지 실제 구독 표시

### 테스팅 인프라 (완료)

- **Unit**: vitest — 5개 파일, 35개 테스트 (`pnpm test`)
- **E2E**: Playwright — 4개 파일, 12개 테스트 (`pnpm test:e2e`)
- 대상: landing, pricing, blog, dashboard 페이지

### CI/CD 파이프라인 (완료)

- `vercel.json` — `pnpm lint && pnpm test && pnpm build` 체이닝, lint/test 실패 시 배포 거부

### 하네스 문서 (완료)

- `CLAUDE.md`, `README.md`, `docs_canonical/` (6개 정규 문서)

---

## 3. 미완료 구현

### Dashboard 계정 삭제

- **위치**: `app/dashboard/settings/page.tsx`
- **현재**: "Delete Account" UI 버튼만 존재
- **미구현**: 실제 삭제 Server Action 또는 API route
- **우선순위**: 낮음

---

## 4. 향후 개선 기회

| 항목 | 설명 | 우선순위 |
|------|------|---------|
| OAuth 프로바이더 추가 | GitHub, Discord 등 Auth.js 프로바이더 | 중간 |
| 계정 삭제 백엔드 | Server Action + Prisma cascade delete | 낮음 |
| i18n 언어 추가 | 한국어 등 `messages/<locale>.json` | 낮음 |
| 테스트 커버리지 확대 | DB 의존 함수 mock 테스트, 컴포넌트 테스트 (RTL) | 낮음 |
