# Testing

## 1. 테스트 인프라

| 프레임워크 | 버전 | 용도 | 명령어 |
|-----------|------|------|--------|
| Vitest | ^4.1.1 | Unit 테스트 | `pnpm test` / `pnpm test:watch` |
| @vitest/coverage-v8 | ^4.1.1 | 커버리지 | `pnpm test -- --coverage` |
| Playwright | ^1.58.2 | E2E 테스트 | `pnpm test:e2e` |

---

## 2. 테스트 파일 위치 규칙

**핵심 원리**: Feature 폴더 삭제 → 테스트 자동 삭제 (glob 패턴이 자동 수집/제외)

### Core 테스트 (항상 존재, 삭제 불가)

```
tests/e2e/                      # Core E2E — 사이트 전반 크로스커팅 테스트
├── landing.spec.ts             # 랜딩페이지 + 네비게이션
└── auth.spec.ts                # 인증 플로우 (mock session → 대시보드)

shared/__tests__/               # Core Unit — 공유 인프라 테스트
├── cn.test.ts                  # clsx + tailwind-merge 유틸
├── logger.test.ts              # JSON 로거
├── site-config.test.ts         # siteConfig 검증
└── theme.test.ts               # 테마 색상 변환 유틸
```

### Feature 테스트 (Feature와 co-locate)

```
features/{feature-name}/
├── components/
├── hooks/
├── __tests__/                  # Unit 테스트
│   └── {name}.test.ts
└── __e2e__/                    # E2E 테스트
    └── {name}.spec.ts
```

### 현재 Feature 테스트 현황

| Feature | Unit | E2E |
|---------|------|-----|
| auth | `dev-session.test.ts`, `sign-in-button.test.ts` | - |
| billing | `verify-signature.test.ts`, `webhook-schema.test.ts` | `pricing.spec.ts` |
| blog | `mdx.test.ts` | `blog.spec.ts` |
| landing | `footer.test.ts`, `interleave.test.ts`, `pricing.test.ts` | - |

---

## 3. 설정 파일

### Vitest (`vitest.config.ts`)

```ts
include: [
  "shared/**/__tests__/**/*.test.ts",       // Core Unit
  "features/**/__tests__/**/*.test.ts",      // Feature Unit
],
```

### Playwright (`playwright.config.ts`)

```ts
testDir: ".",
testMatch: [
  "tests/e2e/**/*.spec.ts",                 // Core E2E
  "features/**/__e2e__/**/*.spec.ts",        // Feature E2E
],
testIgnore: ["**/node_modules/**"],
```

---

## 4. 새 Feature 테스트 추가 가이드

### Unit 테스트

```bash
# 1. __tests__ 디렉토리 생성
mkdir -p features/my-feature/__tests__

# 2. 테스트 파일 생성 (kebab-case, .test.ts)
# features/my-feature/__tests__/my-logic.test.ts
```

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "@/features/my-feature/lib/myLogic";

describe("myFunction", () => {
  it("does the expected thing", () => {
    expect(myFunction("input")).toBe("output");
  });
});
```

### E2E 테스트

```bash
# 1. __e2e__ 디렉토리 생성
mkdir -p features/my-feature/__e2e__

# 2. 테스트 파일 생성 (kebab-case, .spec.ts)
# features/my-feature/__e2e__/my-feature.spec.ts
```

```typescript
import { test, expect } from "@playwright/test";

test.describe("My Feature", () => {
  test("loads and renders correctly", async ({ page }) => {
    await page.goto("/my-feature");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
```

---

## 5. 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 테스트 디렉토리 | `__tests__/` (unit), `__e2e__/` (E2E) | `features/blog/__tests__/` |
| Unit 테스트 파일 | kebab-case + `.test.ts` | `verify-signature.test.ts` |
| E2E 테스트 파일 | kebab-case + `.spec.ts` | `blog.spec.ts` |
| Import 경로 | `@/` alias (상대 경로 아님) | `@/features/blog/lib/mdx` |

---

## 6. 검증 명령어

```bash
# Unit 테스트 실행
pnpm test

# Unit 테스트 (watch 모드)
pnpm test:watch

# E2E 테스트 실행 (dev 서버 자동 시작)
pnpm test:e2e

# 커버리지 포함
pnpm test -- --coverage

# 전체 검증 (커밋 전)
pnpm lint && pnpm test && pnpm build
```

---

## 7. 향후 테스트 확대 대상

### Unit (Feature co-locate)

| 대상 | Feature | 파일 |
|------|---------|------|
| `getAllPosts()`, `getPostsByTag()` | blog | `features/blog/__tests__/posts.test.ts` |
| `generateApiKey()`, `hashKey()` | api-keys | `features/api-keys/__tests__/key-generation.test.ts` |
| `rateLimit()`, `getIdentifier()` | rate-limit | `features/rate-limit/__tests__/rate-limiter.test.ts` |
| `generateSiteMetadata()` | seo | `features/seo/__tests__/metadata.test.ts` |

### E2E (Feature co-locate)

| 시나리오 | Feature | 파일 |
|----------|---------|------|
| API Key 생성/삭제 플로우 | api-keys | `features/api-keys/__e2e__/key-management.spec.ts` |
| Settings 페이지 조작 | landing | `features/landing/__e2e__/settings.spec.ts` |

### Core E2E (tests/e2e/)

| 시나리오 | 파일 |
|----------|------|
| 라우팅 + 404 처리 | `tests/e2e/navigation.spec.ts` |
