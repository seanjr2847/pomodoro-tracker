---
name: api-build
description: "풀스택 개발 하네스의 백엔드 구현 스킬. backend-dev 에이전트가 사용. spec.md의 API 스펙을 Next.js API 라우트, Server Actions, Prisma 스키마로 구현한다."
---

# API Build Skill

## 목적

spec.md에 정의된 API 스펙을 이 프로젝트의 백엔드 패턴에 맞게 구현한다. API를 새로 설계하지 않는다 — spec의 경로, 메서드, 요청/응답 shape을 그대로 구현한다.

## 구현 순서

1. Prisma 스키마 변경 (구현 계획에 있는 경우) → `pnpm db:generate`
2. 비즈니스 로직 (`features/<name>/lib/`) 구현
3. API 라우트 또는 Server Action 구현
4. `features/<name>/index.ts` barrel export 업데이트
5. frontend-dev에게 완성된 API 응답 shape 전달

## Prisma 스키마 패턴

```prisma
model NewModel {
  id        String   @id @default(cuid())
  name      String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("new_models")  // 테이블명은 snake_case
}

// User 모델에 추가:
// newModels  NewModel[]
```

스키마 변경 후: `pnpm db:generate` (마이그레이션 실행 필요 시 `pnpm db:migrate`)

## API 라우트 패턴

```typescript
// app/api/my-feature/route.ts
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/features/api-keys";
import { getItems, createItem } from "@/features/my-feature";

export async function GET(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await getItems(user.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.data);
}

export async function POST(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await createItem(user.id, body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.data, { status: 201 });
}
```

동적 라우트:
```typescript
// app/api/my-feature/[id]/route.ts
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

## Server Action 패턴

```typescript
// features/my-feature/actions/createItem.ts
"use server";
import { ok, fail } from "@/shared/lib/actionResult";
import { prisma } from "@/features/database";
import { z } from "zod/v3"; // hookform resolver 호환 시 /v3, 다른 용도는 /v4

const createItemSchema = z.object({
  name: z.string().min(1, "이름을 입력하세요").max(100),
  description: z.string().optional(),
});

export async function createItem(userId: string, input: unknown) {
  const parsed = createItemSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0].message);
  }

  try {
    const item = await prisma.item.create({
      data: {
        ...parsed.data,
        userId,
      },
    });
    return ok(item);
  } catch (error) {
    // Prisma 에러는 사용자 친화적으로 래핑
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return fail("이미 존재하는 항목입니다.");
    }
    return fail("생성에 실패했습니다.");
  }
}
```

## 비즈니스 로직 (`features/<name>/lib/`)

```typescript
// features/my-feature/lib/items.ts
import { prisma } from "@/features/database";
import { ok, fail } from "@/shared/lib/actionResult";

export async function getItems(userId: string) {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return ok(items);
}

export async function getItemById(userId: string, id: string) {
  const item = await prisma.item.findFirst({
    where: { id, userId }, // userId 조건 필수 — 소유권 확인
  });
  if (!item) return fail("항목을 찾을 수 없습니다.");
  return ok(item);
}
```

## Zod 사용 규칙

- **Form resolvers (react-hook-form 연동)**: `import { z } from "zod/v3"` — hookform/resolvers 호환
- **API 검증, webhook 검증 등 나머지**: `import { z } from "zod/v4"` 사용 가능

## 인증 패턴

`authenticateRequest(req)` 는 NextAuth 세션 또는 `X-API-Key` 헤더를 모두 처리한다:

```typescript
import { authenticateRequest } from "@/features/api-keys";

const user = await authenticateRequest(req);
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// user.id, user.email 사용 가능
```

## 응답 규칙

- 성공: `NextResponse.json(data)` (status 200) 또는 `NextResponse.json(data, { status: 201 })` (생성)
- 실패: `NextResponse.json({ error: "메시지" }, { status: 4xx })`
- 내부 오류 노출 금지: SQL 에러, 스택 트레이스 절대 클라이언트에게 전달하지 않음

## Barrel Export

```typescript
// features/my-feature/index.ts
export { createItem, updateItem, deleteItem } from "./actions/createItem";
export { getItems, getItemById } from "./lib/items";
export type { Item, CreateItemInput } from "./types";
```

## frontend-dev에게 전달할 응답 shape

API 완성 후 반드시 SendMessage로 정확한 TypeScript 타입 전달:

```typescript
// 예시: 전달 형식
type Item = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
};

// GET /api/my-feature → Item[]
// POST /api/my-feature → Item (status 201)
// DELETE /api/my-feature/[id] → { success: true }
```
