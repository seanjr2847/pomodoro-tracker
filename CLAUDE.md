# Factory Boilerplate

## 빌드 & 검증

```bash
pnpm build          # TypeScript 타입 체크 + Next.js 빌드 (필수 검증)
pnpm lint           # ESLint (next/core-web-vitals + next/typescript)
pnpm db:generate    # Prisma Client 재생성 (schema 변경 후)
pnpm db:migrate     # DB 마이그레이션 (개발)
```

테스트 미구축 상태. 코드 변경 후 반드시 `pnpm build && pnpm lint` 실행.

## 코딩 컨벤션

- TypeScript strict mode. `@/*` path alias 사용 (`@/features/auth`, `@/shared/ui`, `@/config/site`).
- Feature 모듈은 `features/<name>/index.ts` barrel export를 통해서만 import. deep import 금지.
- Server Component 기본. `"use client"`는 hooks/이벤트 핸들러/브라우저 API 필요 시에만 선언.
- 컴포넌트 파일명 PascalCase, 훅/유틸 파일명 camelCase, 디렉토리 kebab-case.
- 스타일링은 Tailwind 유틸리티 + `cn()` (`@/shared/utils/cn`). 커스텀 CSS 파일 생성 금지.
- shadcn/ui 컴포넌트는 `@/shared/ui`에서 import. `components.json` aliases가 `@/shared/`를 가리킴.
- 모든 사이트 콘텐츠는 `config/site.ts`의 `siteConfig` 경유. 컴포넌트에 하드코딩 금지.
- i18n은 Dashboard UI만 적용 (`messages/en.json`). Landing은 siteConfig가 관리.

## 금지 패턴

- features/ 간 순환 의존 금지. 의존 방향: `app/ → features/ → shared/ → config/`.
- Feature 간 직접 결합 금지. 필요 시 `app/` 레이어에서 slot prop (`ReactNode`)으로 합성.
- `shared/`에 Feature 비즈니스 로직 넣지 않기. 순수 재사용 코드만.
- `app/` 레이어에 비즈니스 로직 넣지 않기. 라우트 합성과 데이터 전달만.
- 환경변수 직접 참조하는 컴포넌트 금지. Feature config 모듈 경유 (예: `isBillingEnabled`).

## 디렉토리 경계

| 디렉토리 | 역할 | 규칙 |
|----------|------|------|
| `app/` | 라우트 합성 | Feature를 import하고 조합만. 로직 금지. |
| `features/` | 비즈니스 로직 | 각 모듈 `index.ts`가 공개 API. 내부는 상대경로. |
| `shared/` | 공용 UI/유틸 | Feature 독립. 어떤 Feature도 import하지 않음. |
| `config/` | 중앙 설정 | `site.ts` = 단일 소스. |
| `content/` | 정적 콘텐츠 | 블로그 MDX 파일. |
| `messages/` | i18n | Dashboard UI 번역. |
| `prisma/` | DB 스키마 | `schema.prisma`가 source of truth. |

## 환경변수 Feature 토글

`PADDLE_API_KEY` 존재 → 결제 기능 활성화. 미존재 → "Coming Soon" fallback.
`GOOGLE_CLIENT_ID` 미존재 + dev → mock session 자동 활성화.

## 상세 문서

아키텍처, 워크플로우, 스타일가이드 상세는 `docs_canonical/` 참조.
