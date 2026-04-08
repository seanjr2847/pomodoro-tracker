---
name: schema-design
description: "SaaS 보일러플레이트의 Prisma 스키마, 인증 구조, 멀티테넌시 전략, 공유 타입/계약을 설계한다. DB 모델링, NextAuth 설정, RBAC 역할 모델, 환경변수 명세 생성. 스키마 설계, 데이터 모델, 아키텍처 설계 요청 시 사용."
---

# Schema Design -- SaaS 아키텍처 설계 스킬

SaaS 보일러플레이트의 기반 아키텍처를 설계하고, 다른 에이전트들이 참조할 공유 계약을 생성한다.

## 기존 스키마 확인

작업 전 반드시 현재 상태를 확인한다:

```
1. Read prisma/schema.prisma -- 기존 모델 확인
2. Read config/site.ts -- SiteConfig 구조 확인
3. Read .env.example -- 기존 환경변수 확인
4. Read features/ 디렉토리 -- 기존 feature 모듈 확인
```

## Prisma 스키마 설계 규칙

### 기존 모델 (수정 가능, 삭제 금지)
- User, Account, Session, VerificationToken -- NextAuth 필수
- Subscription -- Paddle 빌링

### 새 모델 추가 패턴

```prisma
// 멀티테넌시: Organization 모델
model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  members   Member[]
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("organizations")
}

// RBAC: Member 모델 (User-Organization 중간 테이블)
model Member {
  id             String       @id @default(cuid())
  role           MemberRole   @default(MEMBER)
  userId         String       @map("user_id")
  organizationId String       @map("organization_id")
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now()) @map("created_at")

  @@unique([userId, organizationId])
  @@map("members")
}

enum MemberRole {
  OWNER
  ADMIN
  MEMBER
}
```

### 네이밍 규칙
- 모델명: PascalCase (Organization, Member)
- 필드명: camelCase (organizationId)
- DB 컬럼: snake_case (@map("organization_id"))
- DB 테이블: snake_case 복수형 (@@map("organizations"))

## 공유 계약 (Shared Contract) 생성

`_workspace/01_architect_contracts.ts`에 다른 에이전트가 참조할 타입을 정의:

```typescript
// === API Response Types ===
export interface ApiResponse<T> {
  data: T;
  error: null;
  meta?: { page?: number; total?: number };
}

export interface ApiError {
  data: null;
  error: { code: string; message: string };
}

// === Feature Module Interfaces ===
// 각 feature가 export해야 하는 공개 API 정의

// === Environment Variables ===
// 필수/선택 구분, 설명 포함
```

## 환경변수 명세

`_workspace/01_architect_env.md`에 환경변수를 정리:

| 변수 | 필수 | 용도 | 토글 대상 |
|------|------|------|----------|
| DATABASE_URL | 필수 | PostgreSQL 연결 | - |
| NEXTAUTH_SECRET | 필수 | JWT 서명 | - |
| PADDLE_API_KEY | 선택 | 빌링 | 결제 기능 |

## 아키텍처 결정 문서 (ADR)

`_workspace/01_architect_plan.md`에 주요 결정과 근거를 기록:

```markdown
## ADR-001: 멀티테넌시 전략
- 결정: Row-level isolation with Organization model
- 근거: Solo founder 대상이므로 단순한 구조 우선
- 트레이드오프: 대규모 테넌트 분리에는 부적합

## ADR-002: RBAC 모델
- 결정: Organization-scoped roles (OWNER/ADMIN/MEMBER)
- 근거: SaaS 초기에 충분한 3단계 역할
```

## 산출물 검증

계약 생성 후 자체 검증:
1. Prisma 스키마가 기존 모델과 호환되는지 확인
2. 타입 정의가 Prisma 생성 타입과 일관되는지 확인
3. 환경변수 목록이 .env.example의 기존 변수와 중복/충돌 없는지 확인
