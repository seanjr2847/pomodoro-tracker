---
name: integration-qa
description: "풀스택 개발 하네스의 통합 QA 검증 스킬. fullstack-qa 에이전트가 사용. spec.md 준수율, API↔Frontend 경계면 교차 비교, 빌드 검증을 수행하고 qa_report를 작성한다."
---

# Integration QA Skill

## 목적

구현 완료 후 **spec.md 준수율**과 **API↔Frontend 통합 정합성**을 검증한다. "존재 확인"이 아니라 **경계면 교차 비교** — API 응답 shape과 프론트엔드가 실제로 일치하는지 양쪽 코드를 동시에 읽고 비교한다.

## 검증 순서

1. spec 준수율 체크 → 미구현 항목 파악
2. API 스펙 정합성 → spec.md vs 실제 구현
3. 경계면 교차 비교 → API 응답 shape ↔ 프론트 타입
4. 라우팅 정합성 → 파일 경로 vs href/router.push
5. 데이터 흐름 → Prisma 필드 ↔ API ↔ 프론트 타입
6. 빌드/린트 실행
7. 컨벤션 준수 확인
8. qa_report 작성

## 검증 1: spec 준수율

spec.md의 기능 요구사항 항목을 하나씩 확인:

- 해당 기능이 실제로 구현됐는가?
- 어떤 파일에 구현됐는가? (파일:라인 수준 증거)
- stub/TODO/빈 핸들러는 미구현으로 처리

```markdown
| 기능 요구사항 | 구현 여부 | 증거 |
|-------------|---------|------|
| 사용자 프로필 조회 | ✅ | features/profile/lib/profile.ts:12 |
| 프로필 수정 | ✅ | features/profile/actions/updateProfile.ts:8 |
| 아바타 업로드 | ❌ | 미구현 |
```

## 검증 2: API 스펙 정합성

spec.md에 정의된 API vs 실제 `app/api/` 구현 비교:

| spec.md API | 실제 파일 | 메서드 일치 | 경로 일치 |
|------------|---------|-----------|---------|

경로 비교:
- spec: `GET /api/users/me` → 파일: `app/api/users/me/route.ts` + `export async function GET`
- spec: `PATCH /api/items/:id` → 파일: `app/api/items/[id]/route.ts` + `export async function PATCH`

## 검증 3: API↔Frontend 경계면 교차 비교

**API 응답 shape 추출**: `NextResponse.json()` 호출 읽기

```typescript
// app/api/items/route.ts
return NextResponse.json(result.data); // result.data 타입 확인
```

**프론트 소비 타입 추출**: `api.get<T>()` 또는 `useQuery` 타입 파라미터 읽기

```typescript
// features/items/hooks/useItems.ts
const { data } = useQuery({
  queryFn: () => api.get<Item[]>("/api/items"), // Item[] 타입 확인
});
```

**비교 체크리스트:**
- [ ] 페이지네이션 래핑: API가 `{ items: Item[] }`를 반환하는데 프론트가 `Item[]` 기대?
- [ ] 필드명: `user_id` (snake_case) vs `userId` (camelCase)
- [ ] 옵셔널 필드: API가 `null` 반환 가능한데 프론트가 항상 있다고 가정?
- [ ] 날짜 타입: API가 `string` 반환하는데 프론트가 `Date` 기대?
- [ ] 중첩 객체: API가 `{ user: { id, name } }` 반환하는데 프론트가 `{ userId }`로 flat하게 기대?

실제로 자주 발생하는 버그 패턴:
```
// API
return NextResponse.json({ items: result.data }); // { items: Item[] }

// 프론트 (버그)
queryFn: () => api.get<Item[]>("/api/items") // Item[] 직접 기대

// 수정
queryFn: () => api.get<{ items: Item[] }>("/api/items").then(r => r.items)
```

## 검증 4: 라우팅 정합성

`app/` 파일 구조에서 실제 URL 패턴 추출:

```
app/dashboard/items/page.tsx → /dashboard/items
app/dashboard/items/[id]/page.tsx → /dashboard/items/:id
app/(marketing)/about/page.tsx → /about (라우트 그룹 무시)
```

모든 `href`, `router.push()`, `redirect()`, `Link href` 값과 대조:

```typescript
// 이런 버그 찾기
<Link href="/items/123" /> // 실제 경로는 /dashboard/items/123
router.push("/profile"); // 실제 경로는 /dashboard/settings
```

## 검증 5: 데이터 흐름 일관성

Prisma 스키마 → API 응답 → 프론트 타입 필드명 추적:

```
prisma: model Item { userId String }
          ↓
API 응답: { userId: item.userId }  ← Prisma는 camelCase
          ↓
프론트 타입: interface Item { userId: string }  ← 일치해야 함
```

주의: Prisma는 기본적으로 camelCase 반환. DB 테이블은 snake_case지만 TypeScript에서는 camelCase.

## 검증 6: 빌드/린트

```bash
pnpm lint    # ESLint 검사
pnpm build   # TypeScript 타입체크 + Next.js 빌드
```

빌드 실패 시 에러 로그에서:
- TypeScript 타입 에러 → 어떤 파일:라인인지 파악 후 담당 에이전트에게 수정 요청
- Import 에러 → barrel export 누락 여부 확인
- Missing module → 설치 필요한 패키지 확인

## 검증 7: 컨벤션 준수

- [ ] feature 간 barrel export 경유 여부 (deep import 금지)
- [ ] Server Component vs Client Component 분리 (interactive 아닌데 `"use client"` 있음?)
- [ ] ActionResult 패턴 (`ok()/fail()`) — Server Action이 throw하거나 직접 값 반환?
- [ ] `any` 타입 사용 여부
- [ ] 하드코딩 색상 (CSS 변수 vs `#hexcode`)

## qa_report 작성

`_workspace/04_qa_report.md`:

```markdown
# QA 리포트

## 판정: PASS / FAIL

FAIL 조건: spec 미구현 항목 존재, 런타임 크래시 유발 경계면 버그, 빌드 실패

## spec 준수율: X/Y 항목 완료

[항목별 표]

## API 스펙 정합성

[비교 표]

## 경계면 검증 결과

[검증 항목별 PASS/FAIL + 증거]

## 빌드/린트 결과

- pnpm lint: PASS / FAIL (에러 목록)
- pnpm build: PASS / FAIL (에러 목록)

## 버그 목록

| # | 심각도 | 위치 | 내용 | 담당 |
|---|-------|------|------|------|
| 1 | Critical | features/items/hooks/useItems.ts:8 | API { items: [] } 반환인데 Item[] 직접 기대 | frontend-dev |

## 수정 우선순위

Critical → Major → Minor 순서로 작성
```

## 버그 발견 시 즉시 조치

Critical 버그 발견 시 qa_report 완성 전에도 즉시 SendMessage:

```
[fullstack-qa → frontend-dev]
Critical 버그 발견:
파일: features/items/hooks/useItems.ts:8
문제: api.get<Item[]>("/api/items")인데 API 응답은 { items: Item[] }
수정: api.get<{ items: Item[] }>("/api/items").then(r => r.items)
```
