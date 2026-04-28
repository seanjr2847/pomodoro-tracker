---
name: architecture-design
description: "spec.md 기반 풀스택 구현 계획 수립 스킬. fullstack-architect 에이전트가 사용. spec.md의 기능 요구사항과 API 스펙을 이 프로젝트의 컨벤션(feature 모듈, barrel export, App Router)에 맞는 구현 계획으로 변환한다."
---

# Architecture Design Skill

## 목적

spec.md를 읽고, 이 프로젝트 코드베이스에서 **어떻게 구현할지** 결정한다. API를 새로 설계하지 않는다 — spec에 이미 있다. 이 스킬의 가치는 "spec이 이 코드베이스의 컨벤션에서 어떻게 구현되어야 하는가"를 결정하는 것이다.

## 작업 순서

### Step 1: 코드베이스 파악

구현 계획 전에 반드시 기존 코드를 탐색한다. 없는 것을 만들지 않기 위해서다.

탐색 대상:
- `features/` 디렉토리 — 기존 모듈 목록 (새 기능이 기존 모듈에 속하는지 확인)
- `prisma/schema.prisma` — 기존 모델 (스키마 변경 범위 파악)
- `app/` 라우트 구조 — 기존 페이지 (새 라우트 결정)
- `shared/ui/index.ts` — 사용 가능한 공유 컴포넌트

### Step 2: spec.md 분석

spec.md에서 다음을 추출:

**기능 목록**: 무엇을 구현해야 하는가 (사용자 시나리오 기준)

**API 스펙**: 엔드포인트 경로, 메서드, 요청/응답 shape — 이것이 backend-dev의 구현 기준이 된다

**데이터 모델**: API 스펙에서 필요한 DB 모델을 역추적한다:
- 응답에 `userId`, `createdAt`이 있으면 User 관련 테이블
- spec에 없는 필드는 Prisma에 추가하지 않는다

### Step 3: 구현 계획 작성

`_workspace/01_implementation_plan.md`에 다음 섹션으로 작성:

#### 3-1. 페이지 구조

| 라우트 경로 | 파일 위치 | 레이아웃 | 인증 필요 | 설명 |
|------------|---------|---------|---------|------|

결정 기준:
- 대시보드 기능 → `app/dashboard/<name>/page.tsx`
- 공개 기능 → `app/<name>/page.tsx`
- 인증 필요 여부는 spec 또는 기존 대시보드 layout.tsx 패턴 참조

#### 3-2. Prisma 스키마 변경

기존 `prisma/schema.prisma`와 비교해서 **변경이 필요한 부분만** 명시:

```prisma
// 신규 모델
model NewModel {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@map("new_models")
}

// 기존 모델 필드 추가
// User 모델에 추가:
// newModels  NewModel[]
```

변경 없으면 "변경 없음"으로 명시.

#### 3-3. Feature 모듈 계획

| 모듈명 | 신규/기존 | 추가 파일 | 역할 |
|-------|---------|---------|------|

각 모듈 내부 구조:
```
features/<name>/
├── index.ts              ← barrel export (필수)
├── components/           ← 프레젠테이션 컴포넌트
├── blocks/               ← 복합 UI 블록
├── hooks/                ← 커스텀 훅 (API 호출)
├── actions/              ← Server Actions
├── lib/                  ← 비즈니스 로직
└── types/                ← TypeScript 타입
```

필요한 것만 생성. 과도한 디렉토리 생성 금지.

#### 3-4. 컴포넌트 계층

```
페이지 (app/dashboard/xxx/page.tsx)
  └── 블록 (features/xxx/blocks/XxxBlock.tsx)
        ├── 컴포넌트 (features/xxx/components/XxxCard.tsx)
        └── 공유 컴포넌트 (@/shared/ui)
```

#### 3-5. 구현 순서 및 의존성

backend-dev와 frontend-dev가 어떤 순서로 진행해야 하는지:

- backend-dev 먼저 완료해야 할 항목: [API 응답 shape이 프론트 타입에 영향을 주는 부분]
- 병렬 진행 가능 항목: [API 계약이 명확해서 동시에 진행 가능한 부분]
- frontend-dev가 마지막에 처리할 항목: [API 완성 후 연동]

#### 3-6. 주의사항 / 모호한 스펙

spec.md에서:
- 불분명한 부분 → 어떤 가정을 했는지 명시
- 기존 코드와 충돌하는 부분 → 어떻게 처리할 것인지
- backend-dev가 알아야 할 spec 해석 → 명시

## 컨벤션 요약 (구현 계획 작성 시 준수)

| 규칙 | 내용 |
|------|------|
| feature import | 반드시 `@/features/<name>` (barrel export) |
| DB 테이블명 | snake_case (`@@map`) |
| ID 타입 | `cuid()` |
| 관계 삭제 | `onDelete: Cascade` (User 하위 모델) |
| API 경로 | `/api/<feature>/<action>` |
| Server Action 위치 | `features/<name>/actions/` |
