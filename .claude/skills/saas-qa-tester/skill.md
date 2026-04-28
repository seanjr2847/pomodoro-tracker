---
name: saas-qa-tester
description: >
  완성된 Next.js SaaS 앱을 8단계로 자동 테스트하고 4개 카테고리(기능 완성도 30%·디자인 품질 30%·사용성 20%·코드 품질 20%)로 10점 만점 채점한다.
  서버 실행→spec 확인→curl API 테스트→Playwright 브라우저 테스트→규약 검사→코드 검토→빌드 검증→feedback.md+JSON 결과 저장.
  Playwright MCP 도구로 실제 브라우저 렌더링, 스크린샷, 콘솔 에러, 반응형 레이아웃을 검증한다.
  SaaS 앱 QA, 테스트, 검증, 채점, 피드백, 점수, 평가, 리뷰, 보일러플레이트 앱 검사 요청 시 반드시 saas-qa 에이전트와 함께 이 스킬을 사용할 것.
  다시 테스트, 재검증, 업데이트 후 재채점 요청도 이 스킬로 처리한다.
---

# SaaS QA Tester — 8단계 자동화 테스트 스킬

완성된 Next.js SaaS 앱을 실행하고 엄격하게 검증한다. 관대하지 않게 채점한다.

---

## 하네스 컨텍스트 로드

시작 전 `.claude/agents/saas-qa/CLAUDE.md`를 읽어라. 채점 루브릭, 자동 실패 조건, 산출물 형식을 파악한다.

---

## 사전 확인

시작 전 다음 파일 존재 여부를 확인한다:
- `spec.md` 또는 `docs/spec.md` — 기능 요구사항
- `.env.example` — 필수 환경변수 목록
- `prisma/schema.prisma` — DB 스키마
- `playwright.config.ts` — E2E 테스트 설정

---

## Step 0: 라우트 수집 및 검증 계획 수립

### 0-1. 전체 라우트 수집

`app/` 하위의 모든 `page.tsx`를 glob으로 찾아 라우트 목록을 만든다.

```bash
find app/ -name "page.tsx" | sed 's|app||; s|/page.tsx||; s|^$|/|' | sort
```

`docs/REPO_MAP.md`의 "App Routes" 테이블과 대조하여 누락 없이 정리한다.
각 라우트에 `AUTH_REQUIRED` 여부를 태깅한다 (예: `/dashboard/*` → AUTH_REQUIRED).

### 0-2. F-항목 × 라우트 검증 매핑표 초안 작성

Step 2에서 채울 F-항목 행을 아래 표 형식으로 미리 준비한다.
**Step 4 종료 전 이 표의 모든 "결과" 열을 채워야 채점으로 진행할 수 있다.**
채우지 못한 행은 자동 `[SKIP-감점]` 처리한다.

| ID | 기능명 | 검증 라우트 | 검증 방법 | 결과 |
|----|--------|-----------|---------|------|
| F-01 | (Step 2에서 채움) | (Step 2에서 채움) | (Step 2에서 채움) | 미검증 |

---

## Step 1: 서버 실행

```bash
# 포트 3000 프로세스 종료
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# 의존성 설치 및 개발 서버 기동
pnpm install
pnpm dev &

# 20초 대기 후 기동 확인
sleep 20
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

HTTP 200 반환 시 통과. 5xx 또는 연결 거부 시 → 에러 로그 분석 후 **자동 실패** 판정.

---

## Step 2: 스펙 확인

`spec.md`(또는 `docs/spec.md`)를 읽고 Step 0에서 만든 매핑표의 **"기능명"**, **"검증 라우트"**, **"검증 방법"** 열을 채운다.
없으면 `README.md`에서 기능을 유추하고 "spec.md 없음" -1pt 감점을 기록한다.
매핑표 작성이 완료된 후 Step 3으로 진행한다.

---

## Step 3: API 테스트 (curl)

### 3-1. 인증 없는 보호 엔드포인트 → 401 확인

```bash
curl -s -w "\n%{http_code}" http://localhost:3000/api/{endpoint}
# 기대값: 401 Unauthorized
```

### 3-2. CRUD 흐름 검증

```bash
# CREATE
curl -s -X POST http://localhost:3000/api/{resource} \
  -H "Content-Type: application/json" \
  -d '{"name":"QA Test"}' -w "\n%{http_code}"

# READ, UPDATE, DELETE도 동일하게
```

### 3-3. 응답 shape 검증

표준: `{ data: ..., error: null }` (성공) / `{ data: null, error: { code, message } }` (실패)  
비표준 응답 발견 시 기록.

### 3-4. Prisma 마이그레이션 상태

```bash
npx prisma migrate status 2>&1
# "No pending migrations" = 통과, 미적용 마이그레이션 존재 = 감점
```

---

## Step 4: Playwright 브라우저 테스트

### 4-0. 인증 필요 페이지 접근 전략 수립

Step 0에서 `AUTH_REQUIRED`로 태깅된 라우트가 있으면, 브라우저 검사 시작 전 아래 순서로 우회를 시도한다.
**우회를 시도하지 않고 포기하면 해당 라우트의 모든 F-항목은 자동 FAIL.**

**시도 1 — middleware.ts dev 우회 조건 추가**
`middleware.ts`를 읽어 인증 가드 로직을 파악한 뒤, 개발 환경 우회 조건이 없으면 임시로 추가한다.
```ts
// 예시 패턴
if (process.env.NODE_ENV === 'development' && !process.env.GOOGLE_CLIENT_ID) {
  return NextResponse.next(); // dashboard/* 접근 허용
}
```
수정 후 서버를 재시작하고 테스트를 진행한다. **테스트 완료 후 원복 필수.**

**시도 2 — Playwright 쿠키 inject**
시도 1이 불가하면 `browser_evaluate`로 NextAuth 세션 쿠키를 직접 주입한 뒤 재방문한다.

**시도 3 — 코드 레벨 분석 (폴백)**
두 방법 모두 불가하면 컴포넌트 코드를 직접 읽고 `[CODE-REVIEW]` 태그로 기록한다.
이 경우 해당 페이지 관련 B/C 항목은 만점의 50%로 cap한다.

---

### 4-1. 기존 E2E 테스트 실행

```bash
pnpm test:e2e 2>&1
```

`playwright.config.ts`의 패턴(`tests/e2e/**/*.spec.ts` + `features/**/__e2e__/**/*.spec.ts`) 모두 실행.
실패한 테스트 목록을 기록하고 채점에 반영한다.
**주의**: 테스트가 PASS여도 URL 검증 없이 `<main>` 존재만 확인하는 경우 false positive일 수 있다. 테스트 코드를 직접 읽어 검증 로직이 충분한지 확인한다.

---

### 4-2. Playwright MCP — 전체 라우트 순회 검증

**Step 0에서 수집한 모든 라우트를 빠짐없이 방문한다.**
`AUTH_REQUIRED` 라우트는 4-0에서 확보한 접근 방법으로 진입한다.

각 페이지 검사 순서:

```
1. browser_navigate(url)
2. browser_console_messages()        — JS 에러/경고 수집
3. browser_take_screenshot()         — screenshots/{slug}.png 저장 (fullPage: true)

4. [이상 징후 체크 — 5가지를 반드시 확인, 하나라도 해당하면 [ISSUE] 태그 후 원인 파악]
   □ 빈 공백이 viewport 높이의 20% 이상인 영역이 있는가?
     → 있으면: browser_snapshot()으로 해당 영역 요소 파악 후 원인 기록
   □ 요소가 컨테이너 밖으로 잘리거나 overflow되었는가?
   □ 텍스트가 "undefined" / "[object Object]" / 빈 문자열로 표시되는가?
   □ 콘솔 에러가 1건 이상인가? → 에러 메시지와 발생 컴포넌트 위치 기록
   □ 레이아웃이 명백히 깨졌는가?
   이상 없는 항목은 기록 생략. 이상이 있을 때만 [ISSUE]/[FAIL]/[WARN]/[BUG] 태그로 기록한다.

5. browser_resize(375, 812)          — 모바일 뷰
6. browser_take_screenshot()         — screenshots/{slug}-mobile.png 저장
7. 모바일에서도 이상 징후 체크 4번 반복
8. browser_resize(1440, 900)         — 데스크톱 복귀
```

---

### 4-3. 인터랙션 테스트 (페이지당 의무)

각 페이지에서 다음을 의무적으로 수행한다:
- `browser_snapshot()`으로 클릭 가능한 요소(button, a, input) 목록 파악
- **페이지당 최소 2개 이상의 인터랙션 테스트** 실행 (클릭 → 결과 스크린샷 → 콘솔 에러 확인)
- **Form이 있는 페이지**: 반드시 ① 유효하지 않은 값 제출 → 에러 메시지 표시 확인, ② 유효한 값 제출 → 성공 피드백 확인
- 인터랙션이 전혀 없는 정보성 페이지(예: `/privacy`, `/terms`)는 `[STATIC]` 태그로 기록하고 생략 가능

---

### 4-4. 404/에러 페이지 확인

```
browser_navigate("{BASE_URL}/nonexistent-xyz-page")
browser_take_screenshot()   → screenshots/404.png
```

커스텀 `not-found.tsx`가 렌더링되는지 시각적으로 확인한다.

---

### 4-5. 빈 상태 UI 확인

목록/데이터 페이지를 방문하여 빈 상태(Empty State) UI 존재 여부를 시각적으로 확인한다.

---

### 4-6. F-항목 매핑표 완성 확인

**Step 4를 종료하기 전**, Step 0에서 만든 매핑표의 모든 "결과" 열을 채운다.
`미검증` 상태로 남은 행이 있으면 안 된다.
채우지 못한 행은 SKIP 이유를 기록하고 해당 F-항목은 FAIL로 처리한다.

---

## Step 5: 보일러플레이트 규약 확인

```bash
# barrel export 누락 검사
for dir in features/*/; do
  [ ! -f "${dir}index.ts" ] && echo "MISSING barrel: ${dir}index.ts"
done

# app/ DB 직접 접근 금지 (route.ts 제외)
grep -rn "await prisma" app/ --include="*.tsx" | grep -v "route.ts"

# Server Action 위치 규칙 위반 (features/ 밖에 "use server" 금지)
grep -rn '"use server"' app/ --include="*.ts" --include="*.tsx"

# features 간 deep import (barrel export 우회)
grep -rn 'from "@/features/' features/ --include="*.ts" --include="*.tsx" | grep -v '"/index"'
```

---

## Step 6: 코드 검토

### 6-1. 필수 파일 확인

- `app/layout.tsx` — metadata 설정, 글로벌 Provider, 폰트 로딩
- `app/page.tsx` — 랜딩 or 리다이렉트 로직, 불필요한 `"use client"` 없어야 함
- `config/site.ts` — siteConfig 값이 실제 UI에 반영되는지

### 6-2. Prisma → Server Action → UI 연결

각 핵심 리소스에 대해:
1. `prisma/schema.prisma` 모델 필드
2. `features/*/actions/*.ts` 반환 타입
3. `features/*/components/*.tsx` props 타입

세 곳의 타입이 일치하는지 확인한다.

### 6-3. 불필요한 `"use client"` 검사

```bash
grep -rl '"use client"' features/ --include="*.tsx" | while read f; do
  grep -qE 'use(State|Effect|Ref|Callback|Memo|Context|Reducer)' "$f" || echo "UNNECESSARY: $f"
done
```

### 6-4. TypeScript any 금지

```bash
grep -rn ': any\|as any' features/ app/ --include="*.ts" --include="*.tsx" | grep -v '.d.ts'
```

### 6-5. stub/TODO 잔존

```bash
grep -rn 'TODO\|FIXME\|STUB' features/ app/ --include="*.ts" --include="*.tsx" | grep -v 'test\|spec'
```

---

## Step 7: 빌드 테스트

```bash
# 서버 종료
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

pnpm lint 2>&1
pnpm build 2>&1
```

- `pnpm lint` 에러 → 채점 D 감점
- `pnpm build` 실패 → **자동 FAIL 확정** (점수 무관)

---

## Step 8: 결과 저장

아래 채점 루브릭으로 각 영역 점수를 산출하고 `feedback.md`를 작성한다.  
마지막으로 표준 출력에 `###RESULT###` JSON 블록을 출력한다.

---

## 채점 루브릭

### A. 기능 완성도 (30%)

| 항목 | 만점 | 감점 기준 |
|------|------|---------|
| spec 기능 모두 동작 | 4pt | 미동작 1개당 -1pt |
| API 응답 shape 표준 준수 | 2pt | 비표준 1개당 -0.5pt |
| stub/TODO 0개 | 2pt | 1개당 -0.5pt |
| 빌드 통과 | 1pt | 실패 시 0pt (자동 FAIL) |
| Prisma 마이그레이션 적용 | 1pt | 미적용 시 0pt |

### B. 디자인 품질 (30%)

| 항목 | 만점 | 감점 기준 |
|------|------|---------|
| AI 디자인 패턴 회피 | 3pt | 무의미한 그라데이션/그림자 발견 1개당 -1pt |
| config/site.ts 값 UI 반영 | 2pt | 불일치 1곳당 -1pt |
| shadcn/ui 프리셋 활용 | 3pt | 불필요한 커스텀 CSS 1개당 -1pt |
| 색상 일관성/다크모드 | 2pt | 하드코딩 색상 또는 다크모드 미지원 -1pt씩 |

> Playwright 스크린샷(`screenshots/`)을 참조하여 시각적으로 판단한다.

### C. 사용성 (20%)

| 항목 | 만점 | 감점 기준 |
|------|------|---------|
| 온보딩/첫 화면 명확성 | 3pt | CTA/설명 부재 시 -1pt씩 |
| 빈 상태(Empty State) UI | 2pt | 목록 화면에 빈 상태 없으면 -1pt씩 |
| 에러 피드백 | 3pt | 에러 메시지 없거나 불명확 시 -1pt씩 |
| 로딩 처리 | 1pt | loading.tsx 미존재 -0.5pt |
| 404/에러 페이지 | 1pt | not-found.tsx/error.tsx 각 -0.5pt |

### D. 코드 품질 (20%)

| 항목 | 만점 | 감점 기준 |
|------|------|---------|
| Feature-Based 규약 준수 | 3pt | 위반 1개당 -0.5pt |
| TypeScript any 금지 | 3pt | 발견 1개당 -0.5pt |
| lint 통과 (error 0) | 2pt | error 1개당 -0.5pt |
| 에러 핸들링 구현 | 2pt | try/catch 미사용 API route 1개당 -0.5pt |

**최종 점수** = A×0.30 + B×0.30 + C×0.20 + D×0.20

### 검증 불가 처리 규칙

- `AUTH_REQUIRED` 페이지를 4-0 우회 없이 포기한 경우: 해당 페이지 관련 A/C 항목 FAIL, B 항목 만점의 50%로 cap
- 매핑표에 `[SKIP]`으로 남은 F-항목: 미동작(-1pt)과 동일하게 처리
- `[ISSUE]` 태그로 기록됐으나 원인을 파악하지 못한 경우: 이상 징후 1건당 -0.5pt 추가 감점

**자동 실패 조건** (점수 무관 FAIL):
- `pnpm build` 실패
- 서버 기동 실패
- spec 기능 50% 이상 미동작
- 블로킹 버그(앱 전체 접근 불가) 존재

---

## feedback.md 포맷

```markdown
# QA 리포트 — {프로젝트명}

**판정:** PASS / FAIL
**최종 점수:** {점수}/10
**검사 일시:** {날짜}

---

## 점수 요약

| 카테고리 | 점수 | 가중치 | 기여 |
|---------|------|--------|------|
| A. 기능 완성도 | {a}/10 | 30% | {a×0.3} |
| B. 디자인 품질 | {b}/10 | 30% | {b×0.3} |
| C. 사용성 | {c}/10 | 20% | {c×0.2} |
| D. 코드 품질 | {d}/10 | 20% | {d×0.2} |
| **합계** | — | 100% | **{total}/10** |

---

## 스크린샷

| 페이지 | 데스크톱 | 모바일 |
|--------|---------|--------|
| 랜딩 | screenshots/landing.png | screenshots/landing-mobile.png |
| 대시보드 | screenshots/dashboard.png | screenshots/dashboard-mobile.png |

---

## 상세 피드백

### A. 기능 완성도
- [FAIL] F-01: {기능명} — {파일명}:{줄번호} {문제 설명}
- [WARN] F-02: {기능명} — {문제 설명}
(문제가 없는 항목은 기록하지 않는다)

### B. 디자인 품질
...

### C. 사용성
...

### D. 코드 품질
...

---

## 수정 우선순위

### P0 (즉시 수정 — 자동 실패 원인)
1. {파일}:{줄}: {문제} → {수정 방법}

### P1 (높음 — UX 저해)
...

### P2 (중간 — 코드 품질)
...

### P3 (낮음 — 개선 권장)
...
```

---

## ###RESULT### JSON 포맷

feedback.md 저장 후 표준 출력에 다음 형식으로 출력한다:

```
###RESULT###
{
  "verdict": "PASS",
  "score": 7.4,
  "scores": {
    "functionality": 8,
    "design": 7,
    "usability": 7,
    "code_quality": 8
  },
  "playwright": {
    "e2e_tests_passed": 7,
    "e2e_tests_failed": 0,
    "console_errors": [],
    "screenshots": ["screenshots/landing.png", "screenshots/dashboard.png"]
  },
  "auto_fail": false,
  "summary": "전반적으로 안정적인 보일러플레이트 앱. 빌드 통과, E2E 7개 모두 통과. 빈 상태 UI 누락과 TypeScript any 2건이 주요 개선 항목.",
  "priority_fixes": [
    { "priority": "P1", "file": "features/tasks/components/TaskList.tsx", "issue": "빈 상태 UI 없음" },
    { "priority": "P2", "file": "features/tasks/actions/create.ts:15", "issue": "as any 사용" }
  ]
}
###END###
```

---

## 에러 핸들링

| 상황 | 처리 |
|------|------|
| spec.md 없음 | README.md에서 기능 유추 후 진행, "spec.md 없음" 감점 기록 |
| 서버 기동 실패 | 에러 로그 분석 → 자동 실패 판정 |
| Playwright MCP 도구 불가 | curl 기반으로 폴백, 디자인 채점은 코드 분석으로 전환 |
| DB 미연결 | .env 확인 → 기능 완성도 A 0점 처리 |
| 빌드 60초 초과 | 타임아웃으로 빌드 실패 판정 → 자동 FAIL |
