---
name: api-builder
description: "Next.js API 라우트, Server Actions, RBAC 미들웨어, 빌링 통합, Rate Limiting을 구현한다. Prisma ORM, NextAuth 인증, Paddle webhook. 백엔드 API 생성, 서버 액션 구현, 인증/권한 설정 요청 시 사용."
---

# API Builder -- SaaS 백엔드 구현 스킬

SaaS 보일러플레이트의 백엔드를 구현한다. architect의 스키마와 계약을 기반으로 API를 작성한다.

## 사전 확인

```
1. Read _workspace/01_architect_schema.prisma -- DB 스키마
2. Read _workspace/01_architect_contracts.ts -- 공유 타입/API 계약
3. Read _workspace/01_architect_env.md -- 환경변수 명세
4. Read middleware.ts -- 기존 미들웨어
5. Read features/auth/config/auth.ts -- 기존 인증 설정
```

## API Route 패턴

### 표준 CRUD

```typescript
// app/api/{resource}/route.ts
import { auth } from "@/features/auth";
import { prisma } from "@/features/database";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ data: null, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
  }

  const items = await prisma.resource.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ data: items, error: null });
}
```

### API 응답 일관성

모든 API는 architect 계약의 ApiResponse/ApiError 형태를 따른다:
```typescript
// 성공
{ data: T, error: null, meta?: { page, total } }

// 실패
{ data: null, error: { code: string, message: string } }
```

## Server Action 패턴

```typescript
// features/{name}/actions/create.ts
"use server";
import { auth } from "@/features/auth";
import { prisma } from "@/features/database";
import { revalidatePath } from "next/cache";

export async function createResource(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.resource.create({
    data: { name: formData.get("name") as string, userId: session.user.id },
  });

  revalidatePath("/dashboard/resources");
}
```

## RBAC 미들웨어 패턴

```typescript
// features/auth/lib/rbac.ts
import { auth } from "../config/auth";
import { prisma } from "@/features/database";

export async function requireRole(orgId: string, minRole: "MEMBER" | "ADMIN" | "OWNER") {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const member = await prisma.member.findUnique({
    where: { userId_organizationId: { userId: session.user.id, organizationId: orgId } },
  });

  const roleHierarchy = { MEMBER: 0, ADMIN: 1, OWNER: 2 };
  if (!member || roleHierarchy[member.role] < roleHierarchy[minRole]) {
    throw new Error("Forbidden");
  }

  return member;
}
```

## 빌링 통합

환경변수 토글 패턴:
```typescript
export const isBillingEnabled = !!process.env.PADDLE_API_KEY;
```

Paddle webhook은 기존 `app/api/webhook/paddle/route.ts` 패턴을 따른다.

## Rate Limiting

기존 `features/rate-limit/` 모듈 활용:
```typescript
import { rateLimit } from "@/features/rate-limit";
```

## 산출물

구현 완료 후 `_workspace/02_backend_api.md`에 기록:
- API 엔드포인트 목록 (메서드 + 경로 + 인증 요구)
- Server Action 목록
- 필요한 환경변수 (devops에 전달)
- API 응답 shape 상세 (frontend/QA에 전달)
