# Testing

## 1. 현재 상태

테스트 인프라가 **구축되지 않은 상태**:

- 테스트 프레임워크 미설치 (vitest, jest, playwright 모두 `package.json`에 없음)
- 테스트 파일 없음 (프로젝트 전체에 `*.test.*`, `*.spec.*` 파일 부재)
- `tests/`, `__tests__/` 디렉토리 없음

---

## 2. Placeholder 스크립트

```json
{
  "test": "echo \"No tests configured yet — install vitest and add your tests\"",
  "test:e2e": "echo \"No E2E tests configured yet — install playwright and add your tests\""
}
```

스크립트 이름(`test`, `test:e2e`)은 예약되어 있어 프레임워크 설치 시 즉시 교체 가능.

---

## 3. 현재 검증 수단

| 명령어 | 검증 내용 |
|--------|----------|
| `pnpm build` | TypeScript 타입 체크 + Next.js 프로덕션 빌드 |
| `pnpm lint` | ESLint (next/core-web-vitals + next/typescript) |

코드 변경 후 최소한 `pnpm build && pnpm lint` 실행 필요.

---

## 4. 권장 테스트 전략 (향후)

### Unit Tests — vitest

순수 함수와 유틸리티를 대상으로 한 빠른 단위 테스트:

```bash
# 설치
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Component Tests — vitest + React Testing Library

Client Component의 상호작용과 렌더링 검증.

### E2E Tests — Playwright

사용자 흐름 전체를 브라우저에서 검증:

```bash
# 설치
pnpm add -D @playwright/test
npx playwright install
```

### Architecture Tests

Import 경계 검증 (순환 의존 감지, Feature 간 barrel export 준수):

```bash
# 도구 예시
pnpm add -D dependency-cruiser
```

---

## 5. 우선 테스트 대상

### P0: 보안/핵심 (즉시)

| 대상 | 위치 | 유형 | 이유 |
|------|------|------|------|
| `verifyPaddleSignature()` | `features/billing/api/webhook.ts` | Unit | 결제 보안 핵심, HMAC-SHA256 서명 검증 |
| `interleave()` | `features/landing/lib/renderSections.ts` | Unit | 랜딩페이지 렌더링 로직 핵심 |

### P1: 데이터 레이어 (단기)

| 대상 | 위치 | 유형 | 이유 |
|------|------|------|------|
| `getAllPosts()` | `features/blog/lib/posts.ts` | Unit | 블로그 데이터 파이프라인 |
| `getPostsByTag()` | `features/blog/lib/posts.ts` | Unit | 태그 필터링 로직 |
| `extractHeadings()` | `features/blog/lib/mdx.ts` | Unit | TOC 생성 로직 |
| `generateSiteMetadata()` | `features/seo/metadata.ts` | Unit | SEO 메타데이터 정합성 |

### P2: 통합 테스트 (중기)

| 대상 | 유형 | 이유 |
|------|------|------|
| Dashboard auth guard | Integration | 미인증 사용자 redirect 검증 |
| Billing feature toggle | Integration | `PADDLE_API_KEY` 유무에 따른 UI 분기 |
| Blog listing + filtering | Integration | 태그 필터, 정렬, published 필터링 |

### P3: E2E (장기)

| 시나리오 | 이유 |
|----------|------|
| Landing → Sign In → Dashboard → Settings → Sign Out | 핵심 사용자 흐름 |
| Blog list → Blog detail → Navigation | 콘텐츠 탐색 흐름 |
| Pricing page 렌더링 (billing 활성/비활성) | Feature toggle 검증 |
