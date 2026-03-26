# Next.js SaaS 보일러플레이트 기능명세서

## 1. 개요

### 1.1 목적

새로운 SaaS 프로젝트를 빠르게 런칭하기 위한 Next.js 보일러플레이트 템플릿.
`config/site.ts` 하나만 수정하면 랜딩페이지, Legal 문서, OG 이미지, 인증이 모두 반영되는 구조를 목표로 한다.

### 1.2 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| UI 컴포넌트 | shadcn/ui |
| 인증 | Auth.js (NextAuth) + Google OAuth |
| 데이터베이스 | Neon (Serverless Postgres) |
| ORM | Prisma |
| 결제 | Paddle (선택) |
| AI | Google Gemini API |
| 배포 | Vercel |
| 패키지 매니저 | pnpm |

### 1.3 디자인 레퍼런스

dub.co (https://dub.co) 의 랜딩페이지 구조와 디자인 톤을 기반으로 한다.
dub.co는 오픈소스(https://github.com/dubinc/dub)이므로 디자인 토큰, 컴포넌트, 레이아웃을 직접 참고한다.
모든 섹션의 콘텐츠를 `siteConfig`에서 주입하여 아무 SaaS에나 적용 가능한 범용 구조로 설계한다.

**dub.co 레포에서 참고할 핵심 파일:**

| 용도 | 경로 |
|------|------|
| Tailwind 커스텀 설정 (색상, 폰트, 간격 등) | `packages/tailwind-config/tailwind.config.ts` |
| 공통 UI 컴포넌트 (Button, Card, Modal 등) | `packages/ui/src/` |
| 아이콘 세트 (Nucleo 커스텀 아이콘) | `packages/ui/src/icons/` |
| 네비게이션 컴포넌트 (Navbar, Footer) | `packages/ui/src/nav/` |
| 네비게이션 콘텐츠 정의 (메뉴 구조) | `packages/ui/src/content.ts` |
| 랜딩페이지 라우트 | `apps/web/app/dub.co/` |
| 글로벌 스타일 | `apps/web/styles/` |
| 웹앱 Tailwind 설정 (확장) | `apps/web/tailwind.config.ts` |

**레포 구조 (모노레포, Turborepo):**

```
dubinc/dub/
├── apps/
│   └── web/                    # Next.js 웹앱 (dub.co + app.dub.co)
│       ├── app/                # App Router 라우트
│       ├── styles/             # 글로벌 CSS
│       ├── ui/                 # 웹앱 전용 컴포넌트
│       └── tailwind.config.ts  # 웹앱 Tailwind (shared config 확장)
├── packages/
│   ├── tailwind-config/        # ⭐ 공유 Tailwind 설정 (디자인 토큰)
│   ├── ui/                     # ⭐ 공유 UI 컴포넌트 (Radix + Tailwind)
│   └── utils/                  # 공유 유틸리티
```

**보일러플레이트 작업 시 참고 방법:**

1. `packages/tailwind-config/`에서 색상 팔레트, 폰트(Inter), 간격, 애니메이션 설정을 가져온다.
2. `packages/ui/src/nav/`에서 Navbar/Footer 구조와 스타일을 참고한다.
3. `apps/web/app/dub.co/`에서 랜딩페이지 섹션 레이아웃과 컴포넌트 조합을 참고한다.
4. 하드코딩된 dub.co 고유 콘텐츠(링크 관련 텍스트, 스크린샷 등)는 `siteConfig`에서 주입하는 구조로 변환한다.

### 1.4 아키텍처: Feature-Based 모듈러 구조

기능(Feature) 단위로 코드를 응집하는 모듈러 구조를 채택한다.

**핵심 규칙:**
- 기능별 폴더가 독립적으로 동작한다.
- 각 Feature 폴더는 `index.ts`를 통해 public API만 노출한다.
- 새 기능 추가 = 새 폴더 추가. 기존 코드 수정 최소화.
- Feature 간 공유가 필요한 코드는 `shared/`에 배치한다.

**Feature 간 의존성 정책:**
- **단방향 의존은 허용한다.** 순환 의존만 금지.
- 의존 방향은 상위 → 하위만 허용: `landing → auth` (O), `auth → landing` (X).
- Feature 간 import는 반드시 `index.ts`의 public API를 통해서만.
- 선택적 의존(billing 등)은 `app/` 레이어에서 조합한다.

**의존성 계층:**

```
app/ (라우팅 + Feature 조합)
  ↓
features/ (비즈니스 로직)
  ├── landing   → auth, shared/ui
  ├── billing   → auth, database
  ├── auth      → database
  ├── seo       → og
  ├── og        → (독립)
  ├── legal     → (독립)
  └── database  → (독립, 최하위)
  ↓
shared/ (공통 유틸, 어떤 Feature도 import 안 함)
```

**선택적 Feature 조합 패턴 (app/ 레이어):**

Billing처럼 환경변수에 따라 활성/비활성되는 Feature는 `app/`에서 조합한다.

```tsx
// app/page.tsx — landing에 billing 컴포넌트를 주입
import { LandingPage } from '@/features/landing';
import { PricingCard } from '@/features/billing';  // 있을 때만
// 또는 fallback
import { PricingPlaceholder } from '@/features/landing';

export default function Home() {
  const hasBilling = !!process.env.PADDLE_API_KEY;
  return <LandingPage pricingSlot={hasBilling ? <PricingCard /> : <PricingPlaceholder />} />;
}
```

이렇게 하면 landing Feature가 billing을 직접 import하지 않아도 된다.

### 1.5 프로젝트별 Input

**환경변수 (n8n → Vercel 자동 주입)**

| 변수명 | 출처 |
|--------|------|
| `DATABASE_URL` | Neon 프로젝트 생성 시 |
| `GOOGLE_CLIENT_ID` | GCP OAuth 발급 시 |
| `GOOGLE_CLIENT_SECRET` | GCP OAuth 발급 시 |
| `NEXTAUTH_URL` | Vercel 기본 도메인 |
| `NEXTAUTH_SECRET` | 자동 생성 (`crypto.randomBytes(32).toString('hex')`) |
| `GEMINI_API_KEY` | 수동 1회 설정 (공통) |

**수동 설정 파일**: `config/site.ts` — 앱별 콘텐츠를 이 파일 하나에서 관리한다.

---

## 2. 중앙 설정 (`config/site.ts`)

### 2.1 전체 인터페이스

```
siteConfig
├── name: string                          # 앱 이름
├── description: string                   # 한 줄 설명
├── url: string                           # 배포 URL
├── creator: string                       # 만든 사람
├── email: string                         # 연락처
│
├── theme
│   ├── primary: string (hex)             # 라이트 모드 메인 색상
│   ├── primaryDark: string (hex, 선택)   # 다크 모드 메인 색상 (없으면 primary에서 자동 계산)
│   └── gradient: string (CSS gradient)   # 그라디언트
│
├── banner (nullable)                     # 상단 공지 바
│   ├── text: string
│   └── href: string
│
├── hero                                  # 히어로 섹션
│   ├── title: string
│   ├── subtitle: string
│   └── cta
│       ├── primary: { text, href }
│       └── secondary: { text, href } (nullable)
│
├── featureTabs[]                         # 탭형 기능 소개
│   ├── tab: string
│   ├── title: string
│   ├── description: string
│   ├── href: string
│   └── image: string (nullable)
│
├── logos[]                               # 고객사 로고
│   ├── src: string
│   ├── alt: string
│   └── href: string (nullable)
│
├── value (nullable)                      # 가치 제안 텍스트
│   ├── title: string
│   ├── description: string
│   └── highlights: string[]
│
├── sections[]                            # 기능 상세 섹션 (반복)
│   ├── badge: string
│   ├── title: string
│   ├── description: string
│   ├── cta: { text, href }
│   ├── image: string (nullable)
│   └── cards[]
│       ├── icon: string
│       ├── title: string
│       ├── description: string
│       └── href: string (nullable)
│
├── testimonials[]                        # 추천사 (반복)
│   ├── quote: string
│   ├── name: string
│   ├── role: string
│   ├── company: string
│   ├── companyLogo: string (nullable)
│   └── avatar: string (nullable)
│
├── integrations (nullable)               # 연동 서비스
│   ├── title: string
│   ├── description: string
│   ├── cta: { text, href }
│   └── items[]: { name, icon, href }
│
├── cta                                   # 하단 CTA
│   ├── title: string
│   ├── subtitle: string (nullable)
│   └── button: { text, href }
│
├── pricing                               # 가격 (빈 껍데기)
│   ├── free: { name, price, features[] }
│   └── pro: { name, price, features[] }
│
├── legal                                 # Legal 문서용
│   ├── companyName: string
│   ├── country: string
│   └── effectiveDate: string
│
└── social (nullable)                     # 소셜 링크
    ├── twitter: string
    ├── github: string
    └── discord: string
```

### 2.2 설정 사용 규칙

- 모든 컴포넌트는 `siteConfig`에서 텍스트를 읽는다. 하드코딩 금지.
- `siteConfig.theme`을 기반으로 Tailwind CSS 변수를 생성하여 앱 전체 컬러를 제어한다.
- `siteConfig.url`은 OG 이미지 URL, Auth.js 콜백 URL, 메타데이터에 사용된다.

### 2.3 다크모드 전략

시스템 설정을 따르는 다크모드를 지원한다. Tailwind의 `class` 전략 + `next-themes`를 사용.

**색상 생성 규칙:**
- `theme.primaryDark`가 지정되면 그대로 사용.
- `theme.primaryDark`가 없으면 `theme.primary`에서 자동 계산: HSL 변환 후 lightness를 +20% 보정 (어두운 배경에서 가독성 확보).
- 앱 빌드 시 `tailwind.config.ts`에서 CSS 변수로 주입:

```
:root          { --color-primary: {theme.primary} }
.dark          { --color-primary: {theme.primaryDark 또는 자동 계산값} }
```

**적용 범위:**
- 랜딩페이지: CTA 버튼, 배지, 하이라이트 텍스트, 그라디언트.
- 대시보드: 사이드바 활성 메뉴, 버튼, 링크.
- 공통 UI: shadcn/ui 기본 다크모드 + primary 변수 오버라이드.

---

## 3. Feature: Landing (`features/landing/`)

### 3.1 모듈 구조

```
features/landing/
├── index.ts
├── components/
│   ├── Navbar.tsx
│   ├── Banner.tsx
│   ├── Hero.tsx
│   ├── FeatureTabs.tsx
│   ├── LogoCloud.tsx
│   ├── ValueProposition.tsx
│   ├── FeatureSection.tsx
│   ├── Testimonial.tsx
│   ├── Integration.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
├── hooks/
│   └── useScrollSection.ts
└── lib/
    └── renderSections.ts       # Section + Testimonial 교차 배치 로직
```

### 3.2 섹션 구성 및 렌더링 순서

```
1. Navbar
2. Banner (선택)
3. Hero
4. Feature Tabs (선택)
5. Logo Cloud (선택)
6. Value Proposition (선택)
7. Feature Section × N + Testimonial × N (교차 배치)
8. Integration (선택)
9. CTA
10. Footer
```

**교차 배치 규칙:**
```
Section[0] → Testimonial[0] → Section[1] → Testimonial[1] → Section[2] → ...
```

### 3.3 섹션별 기능 요구사항

**Navbar**
- 왼쪽: 앱 이름/로고, 중앙: 네비 링크, 오른쪽: Log in + Sign Up.
- 스크롤 시 배경 blur 효과.
- 모바일: 햄버거 메뉴.

**Banner (선택)**
- 얇은 공지 바. 닫기 버튼 포함.
- `banner === null`이면 렌더링하지 않음.

**Hero**
- 중앙 정렬. 대형 헤드라인 + 서브타이틀 + CTA 버튼 2개.
- 배경: 미세한 그라디언트 또는 그리드 패턴.
- Secondary CTA가 null이면 Primary만 표시.

**Feature Tabs (선택)**
- 3개 탭 전환. 탭 선택 시 콘텐츠 슬라이드/페이드 전환.
- 탭이 1개면 탭 UI 없이 단일 카드 표시.
- `featureTabs.length === 0`이면 숨김.

**Logo Cloud (선택)**
- 고객사 로고 나열. 그레이스케일, 호버 시 컬러 전환.
- `logos.length === 0`이면 숨김.

**Value Proposition (선택)**
- 순수 텍스트. 큰 폰트, 키워드 하이라이트.
- `value === null`이면 숨김.

**Feature Section (반복)**
- 배지 + 대형 제목 + 스크린샷 + 하단 3열 카드.
- 카드가 없으면 이미지 + 텍스트만.
- `sections.length === 0`이면 숨김.

**Testimonial (반복)**
- 인용문 + 회사 로고 + 이름/직함/아바타.
- Feature Section 사이에 교차 삽입.
- `testimonials.length === 0`이면 전부 생략.

**Integration (선택)**
- 연동 서비스 아이콘 그리드.
- `integrations === null`이면 숨김.

**CTA**
- 그라디언트 배경, 중앙 정렬 텍스트 + 버튼. 항상 표시.

**Footer**
- 4컬럼: Product, Company, Legal, Social.
- Company 컬럼에 Blog 링크 포함.
- 하단 카피라이트 자동 생성.

### 3.4 섹션 숨김 규칙 요약

| 섹션 | 숨김 조건 |
|------|----------|
| Banner | `banner === null` |
| Feature Tabs | `featureTabs.length === 0` |
| Logo Cloud | `logos.length === 0` |
| Value Proposition | `value === null` |
| Feature Sections | `sections.length === 0` |
| Testimonials | `testimonials.length === 0` |
| Integration | `integrations === null` |

**최소 구성 (MVP):** Navbar + Hero + CTA + Footer만으로 동작.
**풀 구성:** 모든 섹션 채우면 dub.co 수준의 랜딩페이지.

### 3.5 디자인 요구사항

- 디자인 레퍼런스: dub.co.
- 모바일 반응형 기본 적용 (Tailwind breakpoints).
- 다크모드 지원 (시스템 설정 따름).
- `siteConfig.theme`의 primary 색상과 gradient를 전체 랜딩에 반영.
- CTA 버튼 클릭 → Google 로그인 → 대시보드 이동.

---

## 4. Feature: OG Image (`features/og/`)

### 4.1 모듈 구조

```
features/og/
├── index.ts
├── api/
│   └── route.tsx               # GET /api/og
├── templates/
│   └── DefaultOG.tsx           # 기본 OG 템플릿
└── utils/
    └── fonts.ts
```

### 4.2 엔드포인트

```
GET /api/og
GET /api/og?title={커스텀제목}&description={커스텀설명}
```

### 4.3 기능 요구사항

- `@vercel/og`를 사용하여 동적 OG 이미지 생성.
- 기본값: `siteConfig.name` + `siteConfig.description`.
- 쿼리 파라미터로 오버라이드 가능.
- 이미지 크기: 1200 x 630px.
- 디자인: `siteConfig.theme.gradient` 기반 배경 + 앱 이름 + 설명 + URL.
- `app/layout.tsx`의 `openGraph.images`에 자동 연결.

---

## 5. Feature: Legal (`features/legal/`)

### 5.1 모듈 구조

```
features/legal/
├── index.ts
├── components/
│   ├── PrivacyPolicy.tsx
│   └── TermsOfService.tsx
├── content/
│   ├── privacy.ts              # 템플릿 + siteConfig 변수 치환
│   └── terms.ts
└── types/
    └── index.ts
```

### 5.2 페이지 라우트

| 경로 | 내용 |
|------|------|
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

### 5.3 동적 치환 항목

`siteConfig`에서 자동으로 채워지는 값: 앱 이름, 운영자, 연락처, 시행일, 서비스 URL, 국가.

### 5.4 Privacy Policy 포함 섹션

1. 수집하는 정보 (Google OAuth: 이메일, 이름, 프로필 사진).
2. 정보 사용 목적.
3. 제3자 서비스 (Google, Neon, Vercel, Paddle).
4. 쿠키 정책.
5. 데이터 보관 및 삭제.
6. 데이터 보안.
7. 아동 보호 (13세 미만 이용 불가).
8. 정책 변경.
9. 연락처.

### 5.5 Terms of Service 포함 섹션

1. 서비스 설명.
2. 이용 조건.
3. 지적 재산권.
4. 결제 및 환불.
5. 서비스 변경 및 종료.
6. 면책 조항.
7. 책임 제한.
8. 관할 법원.
9. 연락처.

### 5.6 Google OAuth 심사 필수 항목

Privacy Policy에 반드시 포함: 수집하는 Google 데이터 종류, 사용 목적, 제3자 공유 여부, 데이터 삭제 요청 방법.

---

## 6. Feature: Auth (`features/auth/`)

### 6.1 모듈 구조

```
features/auth/
├── index.ts
├── config/
│   └── auth.ts                 # Auth.js 설정
├── components/
│   ├── SignInButton.tsx
│   ├── SignOutButton.tsx
│   └── UserMenu.tsx
├── hooks/
│   └── useSession.ts
├── actions/
│   └── auth.ts                 # 서버 액션
└── types/
    └── index.ts
```

### 6.2 인증 플로우

```
"Google로 로그인" 클릭
  → Google OAuth 동의 화면
  → /api/auth/callback/google
  → Auth.js 세션 생성 + DB 유저 저장
  → 대시보드 리다이렉트
```

### 6.3 기능 요구사항

- Google OAuth 단일 Provider.
- 세션 전략: JWT.
- 유저 데이터 Neon DB에 저장 (Prisma Adapter).
- 미인증 유저 → 로그인 리다이렉트.
- 로그아웃 → 랜딩페이지 이동.

---

## 7. Feature: Database (`features/database/`)

### 7.1 모듈 구조

```
features/database/
├── index.ts
├── client.ts                   # Prisma Client 인스턴스 생성 + export
└── seed/
    └── index.ts
```

Prisma 스키마 파일은 프로젝트 루트 `prisma/schema.prisma`에 위치한다 (Prisma 기본 컨벤션).
`features/database/`는 스키마를 소유하지 않고, Prisma Client 인스턴스를 생성하여 다른 Feature에 제공하는 역할만 한다.

### 7.2 기능 요구사항

- Neon Serverless Postgres 사용.
- Prisma ORM으로 타입 안전한 쿼리.
- 스키마 source of truth: `prisma/schema.prisma` (프로젝트 루트).
- 환경변수 `DATABASE_URL`로 연결.
- Auth.js 기본 4개 테이블: `users`, `accounts`, `sessions`, `verification_tokens`.

### 7.3 스키마 확장 패턴

프로젝트별 모델은 `prisma/schema.prisma`에 추가하여 정의. Prisma는 단일 스키마 파일을 사용하므로, 새 Feature의 모델도 이 파일에 추가한다.

### 7.4 마이그레이션 스크립트

```
pnpm db:generate    # Prisma Client 생성
pnpm db:migrate     # Neon에 마이그레이션 적용
pnpm db:studio      # Prisma Studio 실행
```

---

## 8. Feature: Billing (`features/billing/`) — 선택

### 8.1 모듈 구조

```
features/billing/
├── index.ts
├── api/
│   └── webhook.ts              # Paddle 웹훅 핸들러
├── components/
│   ├── PricingCard.tsx
│   ├── CheckoutButton.tsx
│   └── BillingStatus.tsx
├── hooks/
│   └── useSubscription.ts
├── actions/
│   └── billing.ts
├── config/
│   └── paddle.ts
└── types/
    └── index.ts
```

### 8.2 기능 요구사항

- `PADDLE_API_KEY` 없으면 Feature 전체 비활성화.
- 비활성 시: Pricing 카드 Pro 버튼 → "Coming Soon".
- 활성 시: Paddle.js 로드 → Checkout 오버레이 → 웹훅 수신 → 구독 상태 관리.

**필요 환경변수:**
| 변수명 | 설명 |
|--------|------|
| `PADDLE_API_KEY` | Paddle API 키 (없으면 Feature 비활성) |
| `PADDLE_WEBHOOK_SECRET` | 웹훅 signature 검증용 시크릿 |

### 8.3 웹훅 보안

Paddle 웹훅 수신 시 반드시 **signature 검증**을 수행한다.

- Paddle은 모든 웹훅 요청에 `Paddle-Signature` 헤더를 포함한다.
- `webhook.ts`에서 `PADDLE_WEBHOOK_SECRET`을 사용하여 HMAC-SHA256 signature를 검증한다.
- signature 불일치 시 `401 Unauthorized` 응답 후 처리 중단.
- 검증 로직은 Paddle SDK(`@paddle/paddle-node-sdk`)의 내장 검증 메서드를 사용한다.

### 8.4 Feature 토글 패턴

환경변수 존재 여부로 자동 활성화/비활성화.

```
Landing/Pricing → PADDLE_API_KEY 존재? → CheckoutButton
                                       → "Coming Soon" fallback
```

---

## 9. Feature: SEO (`features/seo/`)

### 9.1 모듈 구조

```
features/seo/
├── index.ts
├── metadata.ts                 # siteConfig 기반 메타데이터 생성
├── sitemap.ts                  # 동적 sitemap
└── robots.ts                   # robots.txt
```

### 9.2 기능 요구사항

- `app/layout.tsx`에서 `siteConfig` 기반 메타데이터 자동 생성.
- 동적 sitemap, robots.txt 생성.
- OG Feature와 연동하여 `openGraph.images` 자동 설정.
- Blog Feature의 글 목록을 sitemap에 자동 포함.

---

## 10. Feature: Blog (`features/blog/`)

### 10.1 개요

SEO 트래픽 확보를 위한 블로그 기능. MDX 기반으로 코드 안에서 글을 관리하며, 별도 CMS 없이 Git으로 콘텐츠를 관리한다. 새 글 작성 = MDX 파일 추가 + Git push.

### 10.2 모듈 구조

```
features/blog/
├── index.ts                    # public API
├── components/
│   ├── BlogList.tsx            # 글 목록 (카드 그리드)
│   ├── BlogPost.tsx            # 글 상세 레이아웃
│   ├── BlogCard.tsx            # 개별 카드 (썸네일 + 제목 + 날짜 + 태그)
│   ├── TableOfContents.tsx     # 목차 (h2/h3 기반 자동 생성)
│   └── MDXComponents.tsx       # MDX 커스텀 컴포넌트 매핑
├── lib/
│   ├── mdx.ts                  # MDX 파싱 + frontmatter 추출
│   └── posts.ts                # 글 목록 조회, 정렬, 태그 필터
└── types/
    └── index.ts                # Post, Frontmatter 타입
```

### 10.3 콘텐츠 구조

```
content/
└── blog/
    ├── my-first-post.mdx
    ├── how-to-use-this-app.mdx
    └── ...
```

**Frontmatter 스키마:**

```yaml
---
title: "글 제목"
description: "SEO용 설명 (meta description)"
date: "2026-03-23"
tags: ["saas", "tutorial"]
image: "/blog/my-first-post/cover.png"   # OG 이미지 (선택)
published: true                            # false면 목록에서 숨김
---
```

### 10.4 페이지 라우트

| 경로 | 내용 |
|------|------|
| `/blog` | 글 목록 (최신순, 태그 필터) |
| `/blog/[slug]` | 글 상세 |

### 10.5 기능 요구사항

**글 목록 (`/blog`)**
- 카드 그리드 레이아웃 (썸네일 + 제목 + 날짜 + 태그).
- `published: true`인 글만 표시. 날짜 역순 정렬.
- 태그 필터 (선택).

**글 상세 (`/blog/[slug]`)**
- MDX 렌더링 (코드 하이라이팅, 이미지, 테이블 등).
- 자동 목차 (h2/h3 기준).
- 이전/다음 글 네비게이션.
- 글별 OG 이미지: frontmatter `image`가 있으면 사용, 없으면 `/api/og?title={글 제목}`으로 자동 생성.

**SEO 연동**
- 각 글의 메타데이터 자동 생성 (title, description, openGraph).
- sitemap에 모든 published 글 자동 포함.
- JSON-LD structured data (Article 스키마).

**MDX 커스텀 컴포넌트**
- `<Callout>`: 정보/경고/팁 박스.
- `<CodeBlock>`: 코드 하이라이팅 (shiki 또는 rehype-pretty-code).
- `<Image>`: Next.js Image 컴포넌트 래퍼 (최적화).

### 10.6 기술 선택

| 항목 | 선택 |
|------|------|
| MDX 처리 | `contentlayer2` 또는 `next-mdx-remote` |
| 코드 하이라이팅 | `rehype-pretty-code` (shiki 기반) |
| 콘텐츠 저장 | 파일시스템 (Git 관리) |
| CMS | 없음 (MDX 파일 직접 작성) |

### 10.7 보일러플레이트 포함 범위

- 블로그 목록/상세 페이지 컴포넌트.
- MDX 파싱 + frontmatter 추출 유틸.
- 예시 글 1개 (`content/blog/hello-world.mdx`).
- MDX 커스텀 컴포넌트 (Callout, CodeBlock, Image).
- SEO 메타데이터 + sitemap 연동.
- 프로젝트별 실제 글 작성은 수동.

---

## 11. Shared (`shared/`)

### 10.1 구조

```
shared/
├── ui/                         # 공통 UI (shadcn/ui 기반)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   └── index.ts
├── hooks/
│   ├── useMediaQuery.ts
│   └── useDarkMode.ts
├── utils/
│   ├── cn.ts                   # clsx + tailwind-merge
│   └── format.ts
└── types/
    └── index.ts
```

### 10.2 규칙

- `shared/`는 어떤 Feature도 import하지 않는다.
- 특정 Feature에서만 쓰이는 컴포넌트는 해당 Feature 폴더에 둔다.
- `shared/ui/`는 디자인 시스템 역할. 비즈니스 로직 없는 순수 UI만 포함.

---

## 12. 프로젝트 전체 구조

```
{appName}/
├── app/                                    # 라우팅 + Feature 조합 (thin layer)
│   ├── layout.tsx                          # 루트 레이아웃 + SEO 메타데이터
│   ├── page.tsx                            # → features/landing (billing slot 조합)
│   ├── loading.tsx                         # 글로벌 로딩
│   ├── error.tsx                           # 글로벌 에러 바운더리
│   ├── not-found.tsx                       # 글로벌 404
│   ├── pricing/page.tsx                    # → features/landing (Pricing 섹션)
│   ├── privacy/page.tsx                    # → features/legal
│   ├── terms/page.tsx                      # → features/legal
│   ├── blog/
│   │   ├── page.tsx                        # → features/blog (글 목록)
│   │   └── [slug]/page.tsx                 # → features/blog (글 상세)
│   ├── dashboard/
│   │   ├── layout.tsx                      # 인증 가드 + 사이드바 + 탑바
│   │   ├── page.tsx                        # 대시보드 홈 (빈 상태 UI)
│   │   ├── loading.tsx                     # 대시보드 스켈레톤
│   │   ├── error.tsx                       # 대시보드 에러 (사이드바 유지)
│   │   ├── not-found.tsx                   # 대시보드 404
│   │   ├── settings/page.tsx               # 계정 설정
│   │   └── [...slug]/page.tsx              # 프로젝트별 확장용
│   └── api/
│       ├── auth/[...nextauth]/route.ts     # → features/auth
│       ├── og/route.tsx                    # → features/og
│       └── webhook/paddle/route.ts         # → features/billing (선택)
│
├── features/
│   ├── landing/                            # 랜딩페이지 (dub.co 구조)
│   ├── og/                                 # OG 이미지 생성
│   ├── legal/                              # Privacy Policy, Terms
│   ├── auth/                               # Google OAuth + Auth.js
│   ├── database/                           # Prisma Client 제공
│   ├── billing/                            # Paddle (선택)
│   ├── blog/                               # MDX 블로그
│   └── seo/                                # SEO 메타데이터
│
├── shared/
│   ├── ui/                                 # shadcn/ui 기반 공통 컴포넌트
│   ├── hooks/
│   ├── utils/
│   └── types/
│
├── config/
│   └── site.ts                             # ⭐ 앱별 설정 (이것만 수정)
│
├── messages/                               # i18n 번역 파일
│   └── en.json                             # 영어 (기본)
│
├── content/                                # MDX 콘텐츠
│   └── blog/                               # 블로그 글
│       └── hello-world.mdx                 # 예시 글
│
├── prisma/                                 # Prisma 스키마 (source of truth)
│   └── schema.prisma
│
├── public/
│   └── favicon.ico
├── .env.example
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

### 12.1 app/ 디렉토리 규칙

`page.tsx`는 thin layer. Feature 컴포넌트를 import하고, 선택적 Feature는 slot으로 조합한다.

```tsx
// app/page.tsx — Feature 조합 예시
import { LandingPage } from '@/features/landing';

export default function Home() {
  return <LandingPage />;
}
```

```tsx
// app/dashboard/layout.tsx — 인증 가드 + 레이아웃
import { auth } from '@/features/auth';
import { DashboardShell } from '@/features/landing'; // 사이드바+탑바
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/');
  return <DashboardShell>{children}</DashboardShell>;
}
```

### 12.2 Feature 간 의존성 맵

단방향 의존만 허용. 순환 의존 금지. 선택적 의존은 `app/` 레이어에서 slot 패턴으로 조합.

```
[단방향 의존 (index.ts를 통해서만)]
landing  → auth (SignInButton), shared/ui
billing  → auth (유저 식별), database (구독 테이블)
auth     → database (Prisma adapter)
seo      → og (이미지 URL), blog (글 목록 → sitemap)

[독립 (외부 의존 없음)]
og       → config/site
legal    → config/site
blog     → config/site (MDX 파싱은 자체 처리)
database → (최하위 계층)

[app/ 레이어에서 조합 (직접 의존 아님)]
app/page.tsx → landing + billing (PricingCard를 slot으로 주입)
```

---

## 13. Dashboard

### 13.1 라우팅 구조 (Nested Layout)

```
app/dashboard/
├── layout.tsx              # 인증 가드 + 사이드바 + 탑바 레이아웃
├── page.tsx                # 대시보드 홈 (빈 상태 UI 포함)
├── settings/
│   └── page.tsx            # 계정 설정 (프로필, 구독 상태)
└── [...slug]/
    └── page.tsx            # 프로젝트별 확장용 catch-all
```

### 13.2 레이아웃 구성

```
┌─────────────────────────────────────────┐
│ 탑바 (앱 이름 + 유저 메뉴)               │
├──────────┬──────────────────────────────┤
│          │                              │
│ 사이드바  │     메인 콘텐츠 영역          │
│          │                              │
│ - Home   │     (프로젝트별 구현)          │
│ - Settings│                             │
│          │                              │
└──────────┴──────────────────────────────┘
```

### 13.3 기능 요구사항

**인증 가드**
- `dashboard/layout.tsx`에서 세션 체크.
- 미로그인 시 랜딩페이지로 리다이렉트.

**사이드바**
- 접을 수 있는 사이드바 (모바일: 오버레이).
- 기본 메뉴: Home, Settings.
- `siteConfig`에서 추가 메뉴 항목을 정의할 수 있는 구조.

**탑바**
- 왼쪽: 앱 이름 또는 로고.
- 오른쪽: 유저 메뉴 (아바타 + 드롭다운: 프로필, 설정, 로그아웃).

**빈 상태 UI (Empty State)**
- 대시보드 홈에 데이터가 없을 때 표시할 빈 상태 템플릿 포함.
- 구조: 아이콘 + 메시지 + CTA 버튼.
- 프로젝트별로 메시지와 CTA만 바꾸면 됨.

**Settings 페이지**
- 프로필 정보 표시 (이름, 이메일, 아바타 — Auth.js 세션에서).
- 구독 상태 표시 (Billing Feature 활성 시).
- 계정 삭제 요청 (GDPR/Privacy Policy 대응).

---

## 14. npm 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm db:generate` | Prisma Client 생성 |
| `pnpm db:migrate` | Neon에 마이그레이션 적용 |
| `pnpm db:studio` | Prisma Studio 실행 |
| `pnpm lint` | ESLint 실행 |

---

## 15. i18n (다국어 지원)

### 15.1 방향

글로벌 SaaS를 빠르게 찍어내기 위해, 초기부터 다국어 구조를 잡아둔다. 당장 번역하지 않더라도, 나중에 리팩토링 없이 다국어를 추가할 수 있는 구조를 목표로 한다.

### 15.2 기술 선택

`next-intl` 사용. Next.js App Router와 가장 잘 통합되며, 서버 컴포넌트에서도 동작한다.

### 15.3 구조

```
messages/
├── en.json                 # 영어 (기본)
└── ko.json                 # 한국어
```

### 15.4 적용 범위

| 대상 | i18n 적용 | 설명 |
|------|-----------|------|
| 랜딩페이지 | ❌ | `siteConfig`에서 직접 관리 (언어별 siteConfig 분기) |
| Legal (Privacy, Terms) | ❌ | 영어 고정 (법적 문서) |
| Dashboard UI | ✅ | 버튼, 라벨, 에러 메시지 등 |
| Auth UI | ✅ | 로그인/로그아웃 텍스트 |
| 에러/빈 상태 메시지 | ✅ | 사용자 대면 메시지 |

### 15.5 규칙

- 보일러플레이트에는 `en.json`만 포함. 다른 언어는 프로젝트별 추가.
- 랜딩페이지는 `siteConfig`가 이미 중앙 관리하므로, i18n을 별도로 적용하지 않는다. 다국어 랜딩이 필요하면 locale별 `siteConfig`를 분기한다.
- Dashboard 내 모든 사용자 대면 텍스트는 하드코딩 금지. `next-intl`의 `useTranslations` 훅 사용.

---

## 16. 에러 핸들링 및 로딩 상태

### 16.1 Next.js App Router 파일 컨벤션

각 라우트 세그먼트에 다음 파일을 배치한다.

| 파일 | 역할 |
|------|------|
| `loading.tsx` | 서버 컴포넌트 로딩 중 표시할 스켈레톤/스피너 |
| `error.tsx` | 런타임 에러 발생 시 폴백 UI |
| `not-found.tsx` | 404 페이지 |

### 16.2 배치 전략

```
app/
├── loading.tsx              # 글로벌 로딩 (랜딩용)
├── error.tsx                # 글로벌 에러 바운더리
├── not-found.tsx            # 글로벌 404
├── dashboard/
│   ├── loading.tsx          # 대시보드 전용 스켈레톤 (사이드바 유지)
│   ├── error.tsx            # 대시보드 전용 에러 (사이드바 유지, 재시도 버튼)
│   └── not-found.tsx        # 대시보드 내 404
```

### 16.3 에러 UI 요구사항

**글로벌 에러 (`app/error.tsx`)**
- 심플한 에러 메시지 + "홈으로 돌아가기" 버튼.
- `siteConfig.name` 표시.

**대시보드 에러 (`app/dashboard/error.tsx`)**
- 사이드바/탑바 레이아웃 유지.
- 에러 메시지 + "다시 시도" 버튼 (`reset()` 호출).
- 에러 상세는 개발 환경에서만 표시.

**404 페이지 (`app/not-found.tsx`)**
- 미니멀 디자인. 랜딩페이지로 돌아가는 링크.

### 16.4 API 에러 처리

- API Route에서 발생하는 에러는 일관된 JSON 형식으로 응답.
- 형식: `{ error: string, code: string }`.
- 클라이언트에서는 `shared/utils/api.ts`에 에러 파싱 유틸 제공.

### 16.5 로딩 상태

- 글로벌 로딩: 풀스크린 스피너 또는 프로그레스 바.
- 대시보드 로딩: 사이드바 유지 + 콘텐츠 영역만 스켈레톤.
- 컴포넌트 레벨 로딩: 각 Feature 내에서 자체 처리 (React Suspense 또는 상태 관리).

---

## 17. 테스트 전략

### 17.1 방향

보일러플레이트 단계에서는 최소한의 테스트 구조만 포함한다. 프로젝트별 비즈니스 로직 테스트는 개발 시 추가.

### 17.2 테스트 레벨

| 레벨 | 도구 | 보일러플레이트에 포함 | 대상 |
|------|------|---------------------|------|
| Unit | Vitest | ✅ 설정 + 예시 1개 | 유틸 함수, 순수 로직 |
| Component | Vitest + Testing Library | ✅ 설정만 | UI 컴포넌트 |
| E2E | Playwright | ✅ 설정 + 예시 1개 | 인증 플로우, 핵심 경로 |

### 17.3 포함 범위

**Vitest (Unit)**
- `shared/utils/` 유틸 함수 테스트 예시 1개.
- `vitest.config.ts` 설정 파일.

**Playwright (E2E)**
- 랜딩페이지 접속 → 로그인 버튼 클릭 → 대시보드 도달 플로우 1개.
- `playwright.config.ts` 설정 파일.

### 17.4 npm 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm test` | Vitest 실행 |
| `pnpm test:e2e` | Playwright E2E 실행 |

---

## 18. n8n 자동화 연동

### 18.1 자동 (n8n 워크플로우)

| 단계 | 서비스 | 결과물 |
|------|--------|--------|
| 1 | GitHub | 템플릿에서 레포 생성 |
| 2 | Neon | DB 프로젝트 생성 → `DATABASE_URL` |
| 3 | GCP | OAuth 클라이언트 → `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| 4 | — | `NEXTAUTH_SECRET` 자동 생성 |
| 5 | Vercel | 프로젝트 생성 + Git 연결 + 환경변수 주입 → 자동 배포 |

**`NEXTAUTH_SECRET` 자동 생성 방식:**

n8n Code 노드에서 Node.js `crypto` 모듈로 생성한다.

```js
const secret = require('crypto').randomBytes(32).toString('hex');
// 결과: 64자 hex 문자열 (256bit)
```

Auth.js가 요구하는 최소 보안 수준(256bit)을 충족한다. 워크플로우 내에서 생성 후 Vercel 환경변수에 주입한다.

**워크플로우 Input:** `appName` 하나. 나머지는 전부 파생.

| 파생값 | 규칙 |
|--------|------|
| GitHub 레포명 | `{appName}` |
| Neon 프로젝트명 | `{appName}` |
| GCP 프로젝트 ID | `{appName}-{랜덤4자리}` (중복 시 자동 재시도) |
| Vercel 프로젝트명 | `{appName}` |
| Redirect URI | `https://{appName}.vercel.app/api/auth/callback/google` |
| NEXTAUTH_URL | `https://{appName}.vercel.app` |

### 18.2 수동 (사람)

| 작업 | 소요 시간 |
|------|-----------|
| `config/site.ts` 작성 | 10~15분 |
| 대시보드 기능 구현 | 프로젝트별 상이 |
| Paddle 상품 생성 (필요 시) | 5분 |
| Google OAuth 앱 인증 심사 제출 | 10분 |

---

## 19. 새 Feature 추가 가이드

### 19.1 절차

1. `features/{feature-name}/` 폴더 생성.
2. 내부에 `components/`, `hooks/`, `actions/`, `types/` 중 필요한 것만 생성.
3. `index.ts`에서 public API만 export.
4. DB 모델 필요 시 `prisma/schema.prisma`에 추가.
5. `app/` 디렉토리에 라우트 추가.
6. `pnpm db:generate && pnpm db:migrate`.

### 19.2 체크리스트

- [ ] 의존 방향이 단방향인가? (순환 의존 없는가?)
- [ ] 다른 Feature의 `index.ts` public API만 사용하는가?
- [ ] `app/` 라우트 파일이 thin하게 유지되는가?
- [ ] 선택적 Feature라면 `app/` 레이어에서 slot 패턴으로 조합하는가?