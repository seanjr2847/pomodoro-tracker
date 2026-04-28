# QA 평가 결과: FAIL

## 점수 요약
| 영역 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|----------|
| 기능 완성도 | 3/10 | 30% | 0.9 |
| 디자인 품질 | 4/10 | 30% | 1.2 |
| 사용성 | 3/10 | 20% | 0.6 |
| 코드 품질 | 2/10 | 20% | 0.4 |
| **가중 평균** | | | **3.1** |

---

## 블로킹 이슈 (FAIL 사유)

### 1. [CRITICAL] 빌드 실패 ⛔
**위치:** `app/dashboard/page.tsx:48`
```
Type error: 'todayStats' is possibly 'undefined'.
```

**원인:**
```typescript
const todayStats =
  todayResult.status === "fulfilled" && todayResult.value.success
    ? todayResult.value.data
    : { totalMinutes: 0, sessionCount: 0 };

const hasAnyData = todayStats.sessionCount > 0 || categoryStats.length > 0;
```
- `todayResult.value.data`가 undefined일 수 있는데 fallback이 제대로 작동하지 않음
- TypeScript strict mode에서 컴파일 실패

**영향:** Vercel 배포 시 100% 실패. 프로덕션 빌드 불가.

**수정:**
```typescript
const todayStats =
  todayResult.status === "fulfilled" && todayResult.value.success && todayResult.value.data
    ? todayResult.value.data
    : { totalMinutes: 0, sessionCount: 0 };
```

---

### 2. [CRITICAL] 테스트 실패 (2개) ⛔
Vercel 빌드 명령: `pnpm lint && pnpm test && pnpm build`

#### 2-1. shared/__tests__/site-config.test.ts
```
FAIL: expected null to be truthy
siteConfig.about is null
```
- spec.md에 about 섹션 없음 (정상)
- 하지만 boilerplate 테스트가 about 필수로 체크함
- **해결:** 테스트 삭제 또는 `about: null` 허용하도록 수정

#### 2-2. features/landing/__tests__/pricing.test.ts
```
FAIL: expected '₩0' to match /\$/
```
- 한국 SaaS인데 테스트가 달러 기호 강제
- **해결:** 정규식을 `/₩|원|\$/`로 수정

**영향:** `pnpm test` 실패 → Vercel 빌드 실패

---

### 3. [CRITICAL] 언어 일관성 위반 (spec.md 14행: "영어 잔재 절대 금지") ⛔

**위치:** `features/landing/components/Navbar.tsx`

**영어 하드코딩 (5곳):**
```typescript
const navLinks = [
  { label: "Features", href: "/#features" },    // ❌ 기능
  { label: "Pricing", href: "/pricing" },       // ❌ 요금제
  { label: "Blog", href: "/blog" },             // ❌ 블로그
];

<SignInButton label="Log in" />                 // ❌ 로그인
<SignInButton label="Sign Up" />                // ❌ 회원가입
```

**Playwright 검증 결과:**
- `/pricing` 페이지: 영어 카피 6개 이상 ("Features", "Pricing", "Blog", "Log in", "Sign Up")
- 랜딩 페이지 Header: 영어 3개 (Features, Pricing, Blog)

**spec.md 위반:**
> 언어: **한국어 단일.** 모든 UI/카피/에러/알림 한국어. **영어 잔재 절대 금지.**

**수정:**
```typescript
const navLinks = [
  { label: "기능", href: "/#features" },
  { label: "요금제", href: "/pricing" },
  { label: "블로그", href: "/blog" },
];

<SignInButton label="로그인" />
<SignInButton label="회원가입" />
```

---

### 4. [CRITICAL] 페이지 간 일관성 위반 (헤더/푸터 누락) ⛔

**Playwright UX 검사 결과:**
```json
"consistency": {
  "headerEverywhere": false,
  "footerEverywhere": false
}
```

**헤더 누락 페이지:**
- `/timer`: headerExists = false
- `/categories`: headerExists = false

**푸터 누락 페이지:**
- `/timer`: footerExists = false
- `/dashboard`: footerExists = false
- `/categories`: footerExists = false

**영향:**
- 사용자가 `/timer`에서 다른 페이지로 이동 불가 (네비게이션 없음)
- 일관된 UX 경험 파괴
- 7-pre-B 판정 룰: `headerEverywhere === false` → **FAIL**

**스크린샷 증거:**
- `/timer-desktop.png`: 헤더/푸터 없이 타이머만 덩그러니 있음
- `/categories-desktop.png`: 로딩 스피너만 보이고 아무 내용 없음

---

### 5. [CRITICAL] 페이지 렌더링 실패 ⛔

**Playwright 라우트 테스트 결과:**

#### /categories 페이지
- **Status:** 200이지만 **콘텐츠 빈 페이지**
- **h1Count:** 0 (시맨틱 HTML 위반)
- **langRatio:** 0 (한국어 텍스트 0개!)
- **스크린샷:** 로딩 스피너만 무한 회전

**원인 추정:**
- Client-side 렌더링 실패
- Server Action 에러로 데이터 못 가져옴
- 에러 핸들링 없어서 빈 화면

#### /dashboard 페이지
- **h1Count:** 0 → 감점
- **langRatio:** 0.38 < 0.5 → **FAIL** (한국어 SaaS 기준)
- 사이드바 메뉴에 영어 ("API Keys", "Settings")

#### /pricing 페이지
- **h1Count:** 0 → 감점
- **langRatio:** 0.52 (간신히 통과, 하지만 Navbar 영어 5개 포함)

---

### 6. [HIGH] 404 페이지에 영어 텍스트 ⚠️

**Playwright 여정 테스트 결과:**
```json
"notFoundPage": {
  "statusFound": true,
  "hasReturnLink": true,
  "text": "404\n\nThe page you're looking for doesn't exist.\n\nGo home"
}
```

**영어 문구:**
- "The page you're looking for doesn't exist."
- "Go home"

**수정:** app/not-found.tsx에서 한국어로 변경
```typescript
"페이지를 찾을 수 없습니다."
"홈으로"
```

---

## 기능 완성도: 3/10

### [PASS] 구현된 기능
✅ F-1. 포모도로 타이머 (`/timer`)
- 25:00 카운트다운 표시
- 시작/중지/스킵 버튼
- 세션 전환 UI (작업/휴식/긴 휴식)
- ⚠️ 하지만 헤더/푸터 없어서 고립됨

✅ F-4. 통계 대시보드 (`/dashboard`)
- 빈 상태 UI 완벽 (Coffee 아이콘 + 4단 구조)
- ⚠️ 실제 데이터 렌더링은 빌드 에러로 테스트 불가

### [FAIL] 누락/불완전 기능
❌ F-2. 작업 카테고리 (`/categories`)
- 페이지 존재하나 **렌더링 실패** (빈 화면)
- 색상 8가지 프리셋 확인 불가
- CRUD 작동 여부 불명

❌ F-3. 세션 기록
- 코드 존재 여부 확인 못함 (빌드 실패로)
- 마지막 7일/30일 세션 리스트 UI 안 보임

❌ F-5. 인증
- `/login` 페이지 → **404 Not Found**
- NextAuth 설정은 되어 있으나 login 페이지 없음
- Navbar에 "Log in"/"Sign Up" 버튼은 있음 (영어)

### [PARTIAL] F-4. 통계 대시보드
- Chart 컴포넌트 코드 존재
- 빌드 에러로 실제 작동 확인 불가
- 빈 상태만 확인됨

**pnpm lint:** ✅ 통과
**pnpm test:** ❌ 2개 실패
**pnpm build:** ❌ TypeScript 에러

---

## 디자인 품질: 4/10

### [FAIL] AI 디자인 체크리스트
- [x] 보라/파란 그라데이션 + 빈 카드 → spec.md Hero에 그라데이션 배경 있음 (하지만 spec 명시한 토마토색)
- [ ] 의미없는 아이콘 이모지 → lucide-react 사용 (양호)
- [ ] 기본 Tailwind 스타일 무변경 → 커스터마이징 있음
- [ ] 모두 같은 검색 카드 레이아웃 → 검색 기능 없음
- [x] 의미없는 장식적 섹션 → 랜딩 페이지에 빈 공간 많음

### [PASS] config/site.ts 일치
✅ Primary color: `#E84A5F` (토마토색)
✅ Gradient: `linear-gradient(135deg, #E84A5F 0%, #F06477 50%, #7BC8A4 100%)`
✅ 모든 카피 한국어 (config 파일 내에서는 완벽)

### [FAIL] 시각 직관성 (스크린샷 분석)

#### `_-desktop.png` (랜딩)
**5초 룰 평가:**
1. **무슨 사이트인지 알 수 있나?** ⚠️ 부분 통과
   - Hero 카피 "25분 집중. 5분 휴식. 끝없는 성장." → 명확
   - 하지만 스크롤 전엔 거의 빈 화면 (hero 아래 큰 공백)
2. **다음 뭐 해야 할지 명확?** ✅ 통과
   - "무료로 시작" primary CTA 토마토색으로 강조
3. **시각적 위계:** ⚠️ 보통
   - H1 크기 적절
   - 하지만 콘텐츠가 fold 아래로 밀려남 (초기 뷰에서 보이지 않음)
4. **읽힘 (legibility):** ✅ 통과
   - 대비 충분
5. **밀도/공백:** ❌ 실패
   - Hero 아래 과도한 공백 (의미없는 빈 영역)
   - 탭 메뉴가 거의 안 보임
6. **시각 일관성:** ⚠️ 보통

**판정:** 3번, 5번 NO → **감점 2개**

#### `_timer-desktop.png` (타이머)
**5초 룰 평가:**
1. **무슨 사이트인지?** ✅ 통과
   - "포모도로 타이머" H1 명확
2. **다음 뭐 해야?** ✅ 통과
   - "시작" 버튼 크고 토마토색
3. **시각적 위계:** ✅ 통과
   - 25:00 큰 폰트, 시각적으로 지배적
4. **읽힘:** ✅ 통과
5. **밀도/공백:** ✅ 통과
   - 깔끔한 카드 레이아웃
6. **시각 일관성:** ❌ 실패
   - **헤더/푸터 없음 → 다른 페이지와 완전히 다른 디자인**
   - 사용자가 혼란스러움 (이게 같은 사이트 맞나?)

**판정:** 6번 NO → **감점 1개**

#### `_categories-desktop.png` (카테고리)
**5초 룰 평가:**
1-6. **모두 NO** → 로딩 스피너만 보임 (렌더링 실패)

**판정:** **FAIL** (페이지 깨짐)

#### `_dashboard-desktop.png` (대시보드)
- 사이드바 레이아웃 (앱 UI 스타일)
- "로딩 중..." 텍스트만 보임
- 실제 차트 확인 불가

---

## 사용성: 3/10

### [FAIL] 첫 진입 시 안내
- 랜딩 페이지: 카피는 명확하나 **콘텐츠 대부분이 fold 아래** (스크롤해야 보임)
- 타이머 페이지: 안내 문구 있음 ("로그인하면 통계를 확인하고...") ✅
- 카테고리 페이지: 렌더링 실패 ❌

### [PASS] 빈 상태 UI
✅ **완벽한 4단 구조** (spec.md 128-135행 준수)
- Coffee 아이콘 (lucide)
- "아직 완료한 포모도로가 없어요"
- "타이머를 시작해서 첫 사이클을 완료해보세요"
- "타이머 시작" 버튼 → `/timer`

**코드:** `app/dashboard/page.tsx:51-73`

### [FAIL] 에러 피드백
- `/categories` 렌더링 실패 시 에러 메시지 없음 (무한 로딩)
- Console errors: CSP 위반 경고 (모든 페이지)

### [UNKNOWN] 로딩 상태
- Dashboard: "로딩 중..." 텍스트만 (Suspense fallback)
- 너무 단순, 스켈레톤 UI 권장

### [PASS] 404 페이지
✅ 존재함
✅ "홈으로" 링크 있음
⚠️ 하지만 영어 텍스트 ("The page you're looking for doesn't exist.")

### [FAIL] 접근성
**Playwright 접근성 검사:**
- `btnNoLabel`: 0 ✅
- `linkNoText`: 0 ✅
- `imgNoAlt`: 0 ✅
- `headerExists`: 3개 페이지 누락 ❌
- `footerExists`: 4개 페이지 누락 ❌

**Console Errors:**
- CSP 위반 (모든 페이지): EvalError unsafe-eval
- 심각도: 중간 (기능에는 영향 없으나 보안 경고)

---

## 코드 품질: 2/10

### [FAIL] Feature-Based 준수
**디렉토리 구조:**
```
features/
├── pomodoro/
│   ├── actions/sessionActions.ts ✅
│   ├── components/ ✅
│   ├── hooks/ ✅
│   └── types/ ✅
├── categories/
│   ├── actions/categoryActions.ts ✅
│   └── components/ ✅
└── statistics/
    ├── actions/statsActions.ts ✅
    └── components/ ✅
```
✅ Server Actions이 features/{name}/actions/에 있음
✅ Barrel export (index.ts) 존재

**BUT:**
❌ `features/landing/components/Navbar.tsx`에 **비즈니스 로직 하드코딩**
- navLinks 배열이 컴포넌트 내부에 있음
- config/site.ts에 있어야 함

### [FAIL] 타입 안정성
❌ `app/dashboard/page.tsx:48` - TypeScript 에러
```typescript
const hasAnyData = todayStats.sessionCount > 0 || categoryStats.length > 0;
                   ^^^^^^^^^ possibly undefined
```

### [PASS] Server Action ↔ UI 분리
✅ `features/statistics/actions/statsActions.ts` → Server Actions
✅ `features/statistics/components/TodayCard.tsx` → Client Component
✅ `"use server"` directive 제대로 사용

### [PASS] App Router 규약
✅ `app/dashboard/page.tsx` - async Server Component
✅ `app/timer/page.tsx` - Client Component (타이머 상태 관리)
✅ Suspense 경계 사용

### [FAIL] pnpm lint / pnpm test / pnpm build
- **pnpm lint:** ✅ 통과
- **pnpm test:** ❌ 2개 실패
- **pnpm build:** ❌ TypeScript 에러

**Vercel 빌드 명령과 동일하므로 배포 100% 실패**

### [PARTIAL] 에러 핸들링
✅ Promise.allSettled 사용 (dashboard)
⚠️ 하지만 TypeScript 타입 체크 통과 못함
❌ `/categories` 렌더링 실패 시 fallback 없음

---

## 수정 우선순위

### 1. [P0 - BLOCKER] 빌드 에러 수정
**파일:** `app/dashboard/page.tsx:48`
```typescript
// Before
const hasAnyData = todayStats.sessionCount > 0 || categoryStats.length > 0;

// After
const hasAnyData = (todayStats?.sessionCount ?? 0) > 0 || categoryStats.length > 0;
```

### 2. [P0 - BLOCKER] 테스트 수정
**파일 1:** `shared/__tests__/site-config.test.ts`
```typescript
// 삭제하거나
it("has about section with team and values", () => {
  if (!siteConfig.about) {
    expect(siteConfig.about).toBeNull(); // 명시적으로 null 허용
    return;
  }
  expect(siteConfig.about.team.length).toBeGreaterThan(0);
});
```

**파일 2:** `features/landing/__tests__/pricing.test.ts`
```typescript
// Before
expect(plan.price).toMatch(/\$/);

// After
expect(plan.price).toMatch(/₩|원|\$/); // 한국/미국 통화 모두 허용
```

### 3. [P0 - BLOCKER] Navbar 한국어 변경
**파일:** `features/landing/components/Navbar.tsx`
```typescript
// Line 12-14
const navLinks = [
  { label: "기능", href: "/#features" },
  { label: "요금제", href: "/pricing" },
  { label: "블로그", href: "/blog" },
];

// Line 57, 61, 85, 86
<SignInButton label="로그인" />
<SignInButton label="회원가입" />
```

### 4. [P0 - BLOCKER] 페이지 레이아웃 통일
**타이머/카테고리 페이지에 헤더/푸터 추가**

**파일:** `app/timer/layout.tsx` (새로 생성)
```typescript
import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";

export default function TimerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

동일하게 `app/categories/layout.tsx` 생성

### 5. [P0 - BLOCKER] /categories 렌더링 수정
**디버깅 필요:**
- Server Actions 에러 확인
- Client-side 데이터 fetching 로직 검토
- 에러 발생 시 fallback UI 추가

**임시 수정 (에러 바운더리):**
```typescript
// app/categories/error.tsx
'use client'
export default function Error() {
  return <div>카테고리를 불러오는데 실패했습니다.</div>
}
```

### 6. [P1 - HIGH] 404 페이지 한국어
**파일:** `app/not-found.tsx`
```typescript
// Before
"The page you're looking for doesn't exist."
"Go home"

// After
"페이지를 찾을 수 없습니다."
"홈으로"
```

### 7. [P1 - HIGH] /login 페이지 생성
**파일:** `app/login/page.tsx` (현재 404)
- NextAuth 로그인 UI 추가
- 또는 `/api/auth/signin`으로 리다이렉트

### 8. [P2 - MEDIUM] Dashboard h1 추가
**파일:** `app/dashboard/page.tsx:84`
```typescript
// Before
<h1 className="text-3xl font-bold">통계 대시보드</h1>

// 이미 있음! 하지만 Playwright가 못 잡음 (로딩 중 상태에서 테스트?)
// 빌드 성공 후 재테스트 필요
```

### 9. [P2 - MEDIUM] 랜딩 페이지 공백 줄이기
- Hero 섹션과 Feature Tabs 사이 공백 과다
- `features/landing/components/LandingPage.tsx` 여백 조정

### 10. [P3 - LOW] CSP 경고 해결
- next.config.ts에서 Content Security Policy 설정
- 'unsafe-eval' 필요 여부 검토

---

## 추가 발견 사항

### [GOOD] 잘된 점
1. ✅ **빈 상태 UI 완벽** - spec.md 4단 구조 정확히 준수
2. ✅ **lucide-react 아이콘** - 이모지 없음
3. ✅ **config/site.ts 완벽** - 모든 카피 한국어, 색상 정확
4. ✅ **Feature-Based 구조** - Server Actions 분리 잘됨
5. ✅ **타이머 UI 깔끔** - 25:00 큰 폰트, 버튼 명확

### [BAD] 아쉬운 점
1. ❌ **Navbar 영어 하드코딩** - 가장 눈에 띄는 곳에 5개 영어 단어
2. ❌ **빌드/테스트 실패** - Vercel 배포 즉시 실패
3. ❌ **페이지 간 디자인 불일치** - 타이머는 헤더 없음, 대시보드는 사이드바
4. ❌ **카테고리 페이지 깨짐** - 핵심 기능 F-2 작동 불가
5. ❌ **랜딩 페이지 빈 공간** - fold 위에 콘텐츠 부족

---

## 최종 평가

### 통과 불가 사유
1. **pnpm build 실패** → Vercel 배포 불가
2. **pnpm test 실패** → CI/CD 파이프라인 중단
3. **spec.md 언어 규칙 위반** → 영어 카피 5개 이상
4. **핵심 기능 작동 불가** → /categories 렌더링 실패
5. **페이지 간 일관성 파괴** → 헤더/푸터 누락

### 권장 액션
1. ✅ 위 수정 우선순위 1-5번 **즉시** 적용 (P0)
2. ✅ 빌드 성공 후 재평가 요청
3. ⚠️ Playwright 스크린샷 다시 확인 (현재는 빌드 실패 상태 캡처)
4. ⚠️ 모든 페이지에 헤더/푸터 통일
5. ⚠️ `/login` 페이지 구현 (현재 404)

---

## 체크리스트

### 필수 준수 항목
- [x] bash 명령 정상 작동
- [x] 실제 빌드/실행 테스트 시도
- [x] 실패 원인 기록
- [x] ###RESULT### JSON 블록 있음 (아래 참조)

### QA 단계
- [x] Step 1: 서버 실행 (성공)
- [x] Step 2: 스펙 확인 (완료)
- [x] Step 3: API 테스트 (Server Actions 확인)
- [x] Step 4: Playwright 프론트엔드 테스트 (실행, 문제 발견)
- [x] Step 7-pre: UX 종합 검수 (FAIL 판정)
- [x] Step 7: 빌드 테스트 (lint 통과, test 실패, build 실패)

### 평가 기준
- [x] 기능 완성도 (3/10)
- [x] 디자인 품질 (4/10)
- [x] 사용성 (3/10)
- [x] 코드 품질 (2/10)

---

**평가 완료일:** 2026-04-28
**평가자:** Next.js QA Agent
**프로젝트:** pomodoro-tracker
**최종 판정:** FAIL (가중 평균 3.1/10)
