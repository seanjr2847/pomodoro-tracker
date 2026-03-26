# Workflows

## 1. 개발 환경 설정

### Prerequisites

- Node.js 20.9+
- pnpm
- PostgreSQL 접근 (Neon Serverless 권장)

### 초기 설정

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일 편집하여 값 입력

# 3. Prisma Client 생성
pnpm db:generate

# 4. DB 마이그레이션 (PostgreSQL 실행 중이어야 함)
pnpm db:migrate

# 5. 개발 서버 실행
pnpm dev          # 또는 pnpm dev:turbo (Turbopack)
```

### 환경변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `DATABASE_URL` | 필수 | PostgreSQL 연결 문자열 (Neon: `postgresql://user:pw@host/db?sslmode=require`) |
| `NEXTAUTH_URL` | 필수 | 앱 URL (`http://localhost:3000` for dev) |
| `NEXTAUTH_SECRET` | 필수 | JWT 서명 키 (생성: `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | 필수* | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | 필수* | Google OAuth Client Secret |
| `GEMINI_API_KEY` | 선택 | Google Gemini API 키 (현재 코드에서 미사용) |
| `PADDLE_API_KEY` | 선택 | Paddle API 키 — 존재 시 결제 기능 자동 활성화 |
| `PADDLE_WEBHOOK_SECRET` | 선택 | Paddle webhook 서명 검증 키 (`PADDLE_API_KEY` 설정 시 필요) |

> *`GOOGLE_CLIENT_ID` 없이 `pnpm dev` 실행 시 **mock session**이 자동 활성화되어 OAuth 없이 대시보드 테스트 가능. (`app/dashboard/layout.tsx`의 `devSession` 로직)

---

## 2. npm 스크립트

| 스크립트 | 명령어 | 설명 |
|----------|--------|------|
| `dev` | `next dev` | 개발 서버 (Webpack) |
| `dev:turbo` | `next dev --turbopack` | 개발 서버 (Turbopack — 더 빠른 HMR) |
| `build` | `next build` | 프로덕션 빌드 (TypeScript 타입 체크 포함) |
| `start` | `next start` | 프로덕션 서버 실행 |
| `lint` | `next lint` | ESLint 검사 |
| `db:generate` | `prisma generate` | Prisma Client 코드 생성 |
| `db:migrate` | `prisma migrate dev` | DB 마이그레이션 (개발용) |
| `db:studio` | `prisma studio` | Prisma Studio GUI |
| `test` | `echo "No tests..."` | **Placeholder** — vitest 미설치 |
| `test:e2e` | `echo "No E2E tests..."` | **Placeholder** — playwright 미설치 |

---

## 3. 커스터마이징 워크플로우

### Step 1: 사이트 설정 수정

`config/site.ts`의 `siteConfig` 객체를 수정:

```typescript
export const siteConfig: SiteConfig = {
  name: "Your App",           // 앱 이름
  description: "...",          // 설명 (SEO 메타 + OG)
  url: "https://yourapp.com", // 프로덕션 URL
  creator: "Your Name",
  email: "hello@yourapp.com",
  theme: {
    primary: "#6366f1",        // 주요 색상 (hex)
    gradient: "linear-gradient(...)",
  },
  hero: { ... },               // 히어로 섹션
  featureTabs: [ ... ],        // 기능 탭
  sections: [ ... ],           // Feature 섹션
  testimonials: [ ... ],       // 후기
  pricing: { free: {...}, pro: {...} },
  // ... 기타 nullable 섹션
};
```

SiteConfig 인터페이스의 nullable 필드(`banner`, `value`, `social` 등)는 `null` 설정 시 해당 섹션이 렌더링되지 않음.

### Step 2: 환경변수 설정

위 환경변수 표 참조.

### Step 3: (선택) 블로그 글 추가

`content/blog/<slug>.mdx` 파일 생성 → 5절 참조.

### Step 4: (선택) 결제 활성화

`.env`에 `PADDLE_API_KEY`와 `PADDLE_WEBHOOK_SECRET` 추가 → 결제 UI 자동 활성화.

### Step 5: (선택) i18n 언어 추가

1. `messages/<locale>.json` 파일 생성 (예: `messages/ko.json`)
2. `i18n/request.ts`에서 locale 로직 수정
3. 현재 locale은 `"en"` 하드코딩 상태

---

## 4. Feature 모듈 추가 절차

### 새 Feature 생성

```bash
# 1. 디렉토리 생성
mkdir -p features/my-feature/components

# 2. barrel export 생성
# features/my-feature/index.ts
export { MyComponent } from "./components/MyComponent";
```

### 내부 구조 (필요한 것만)

```
features/my-feature/
├── index.ts          # 필수 — 공개 API
├── components/       # React 컴포넌트
├── hooks/            # 커스텀 hooks
├── lib/              # 유틸리티
└── types/            # TypeScript 타입
```

### 규칙

- `index.ts` barrel export를 통해서만 외부에 노출
- Feature 내부에서는 상대 경로 import
- 의존성 방향: 하위 → 상위만 허용 (auth → database OK, database → auth 금지)
- `config/site.ts`와 `shared/` 모듈은 자유롭게 사용 가능
- Feature 간 결합이 필요하면 `app/` 레이어에서 slot prop 패턴 사용

---

## 5. 블로그 글 추가

### MDX 파일 생성

`content/blog/<slug>.mdx` (또는 `content/posts/<slug>.mdx`):

```mdx
---
title: "글 제목"
description: "간단한 설명"
date: "2026-03-24"
tags: ["nextjs", "tutorial"]
published: true
---

본문 내용 (Markdown + React 컴포넌트)...
```

### Frontmatter 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | 필수 | 글 제목 |
| `description` | string | 필수 | 짧은 설명 (SEO + 카드) |
| `date` | string | 필수 | 발행일 (ISO 형식) |
| `tags` | string[] | 필수 | 태그 목록 |
| `published` | boolean | 필수 | `false`면 목록에서 제외 |
| `image` | string | 선택 | 커버 이미지 URL |

### 자동 처리

- `published: false` → 목록/sitemap에서 자동 제외
- 날짜 역순 정렬
- sitemap에 자동 포함 (`app/sitemap.ts`)
- JSON-LD Article 구조화 데이터 생성
- OG 이미지: frontmatter `image` || `/api/og?title=...` 자동 생성

---

## 6. shadcn/ui 컴포넌트 추가

```bash
# shadcn CLI로 컴포넌트 추가
npx shadcn@latest add dialog

# components.json aliases가 @/shared/ui/로 라우팅
# → shared/ui/dialog.tsx 자동 생성
```

생성 후 `shared/ui/index.ts` barrel export에 추가:

```typescript
export { Dialog, DialogContent, DialogTrigger, ... } from "./dialog";
```

---

## 7. 배포

### Vercel 배포

1. GitHub 저장소 연결
2. Vercel가 Next.js 자동 감지
3. 환경변수 설정 (Vercel Dashboard 또는 `vercel env`)
4. `pnpm build` → 자동 배포

### 런타임 구성

- **Serverless Functions**: 모든 API routes, Server Components
- **Edge Runtime**: `app/api/og/route.tsx` (OG 이미지 생성)
- **Static**: 랜딩페이지, 블로그 (ISR 가능)

---

## 8. 데이터베이스 마이그레이션

### 스키마 파일

`prisma/schema.prisma` — PostgreSQL (Neon Serverless)

### 모델

| 모델 | 테이블명 | 용도 |
|------|---------|------|
| User | `users` | 사용자 (Auth.js) |
| Account | `accounts` | OAuth 계정 연결 |
| Session | `sessions` | 세션 (JWT 전략 시 실질 미사용) |
| VerificationToken | `verification_tokens` | 이메일 인증 토큰 |
| Subscription | `subscriptions` | Paddle 구독 상태 |

### 커맨드

```bash
pnpm db:generate   # Prisma Client 재생성 (스키마 변경 후)
pnpm db:migrate    # 마이그레이션 생성 + 적용 (개발용)
pnpm db:studio     # Prisma Studio GUI (브라우저에서 DB 탐색)

# 프로덕션 마이그레이션
npx prisma migrate deploy
```

---

## 9. OpenSpec 워크플로우

프로젝트는 OpenSpec을 사용하여 변경 관리:

### 4단계 라이프사이클

```
/opsx:explore → /opsx:propose → /opsx:apply → /opsx:archive
   탐색/조사      변경 제안       구현 실행      완료 아카이브
```

### 사용 가능한 스킬/커맨드

| 스킬 | 커맨드 | 용도 |
|------|--------|------|
| `openspec-explore` | `/opsx:explore <topic>` | 아이디어 탐색, 조사, 요구사항 명확화 |
| `openspec-propose` | `/opsx:propose <topic>` | 새 변경 제안 (proposal + design + specs + tasks) |
| `openspec-apply-change` | `/opsx:apply <change>` | 태스크 목록에서 구현 실행 |
| `openspec-archive-change` | `/opsx:archive <change>` | 완료된 변경 아카이브 |

### 현재 상태

- `nextjs-saas-boilerplate` change: **전체 태스크 완료** (15 섹션)
- 아카이브 준비 완료

---

## 10. 검증 절차

현재 사용 가능한 검증 수단:

```bash
# TypeScript 타입 체크 + Next.js 빌드
pnpm build

# ESLint 코드 품질 검사
pnpm lint
```

> 자동화된 테스트는 아직 구축되지 않음 (TESTING.md 참조). 코드 변경 후 최소한 `pnpm build && pnpm lint`를 실행하여 검증.
