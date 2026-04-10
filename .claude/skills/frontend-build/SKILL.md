---
name: frontend-build
description: "풀스택 개발 하네스의 프론트엔드 구현 스킬. frontend-dev 에이전트가 사용. Next.js 15 App Router + Tailwind CSS v4 + shadcn/ui로 spec.md의 기능 요구사항을 구현한다."
---

# Frontend Build Skill

## 목적

spec.md의 기능 요구사항과 구현 계획을 실제 Next.js 코드로 변환한다. 이 프로젝트의 컨벤션을 엄격히 따른다.

## 핵심 컨벤션

### Import 경로
```typescript
// 올바름
import { MyComponent } from "@/features/my-feature";
import { Button, Card } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { api } from "@/features/api-client";

// 금지 — deep import
import { MyComponent } from "@/features/my-feature/components/MyComponent";
```

### Server vs Client Component

기본은 Server Component (파일 상단에 아무것도 없음). 다음 경우에만 `"use client"` 추가:
- `useState`, `useEffect`, `useRef` 등 React hooks 사용
- 브라우저 API (window, document) 접근
- 이벤트 핸들러 (`onClick`, `onChange` 등)
- `useQuery`, `useMutation` (TanStack Query)

### 스타일링
```typescript
import { cn } from "@/shared/utils/cn";

// 좋음
<div className={cn("rounded-lg px-4 py-2", isActive && "bg-primary", className)} />

// 나쁨 — 하드코딩 색상
<div style={{ color: "#6366f1" }} />
```

CSS 변수 사용: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground` 등

## 구현 패턴

### 페이지 (Server Component)
```tsx
// app/dashboard/my-feature/page.tsx
import { MyFeatureBlock } from "@/features/my-feature";
import { auth } from "@/features/auth";
import { redirect } from "next/navigation";

export default async function MyFeaturePage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <main>
      <MyFeatureBlock userId={session.user.id} />
    </main>
  );
}
```

### 블록 (Server Component + 데이터 페칭)
```tsx
// features/my-feature/blocks/MyFeatureBlock.tsx
import { prisma } from "@/features/database";
import { MyFeatureList } from "../components/MyFeatureList";

export async function MyFeatureBlock({ userId }: { userId: string }) {
  const items = await prisma.item.findMany({ where: { userId } });
  return <MyFeatureList items={items} />;
}
```

### API 호출 훅 (Client Component에서 사용)
```typescript
// features/my-feature/hooks/useMyFeature.ts
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/features/api-client";
import { toast } from "sonner";

export function useMyItems() {
  return useQuery({
    queryKey: ["my-items"],
    queryFn: () => api.get<MyItem[]>("/api/my-feature"),
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemInput) => api.post<MyItem>("/api/my-feature", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-items"] });
      toast.success("생성 완료");
    },
    onError: (error) => toast.error(error.message),
  });
}
```

### Server Action 호출
```typescript
// Client Component에서
import { createItem } from "@/features/my-feature";

async function handleSubmit(data: FormValues) {
  const result = await createItem(data);
  if (!result.success) {
    toast.error(result.error);
    return;
  }
  toast.success("완료!");
  router.push("/dashboard/my-feature");
}
```

### 폼 (react-hook-form + Zod)
```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3"; // hookform 호환

const schema = z.object({
  name: z.string().min(1, "이름을 입력하세요"),
});
type FormValues = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { mutate, isPending } = useCreateItem();

  return (
    <form onSubmit={form.handleSubmit((data) => mutate(data))}>
      {/* ... */}
    </form>
  );
}
```

### shadcn/ui 컴포넌트 추가
```bash
pnpm dlx shadcn@latest add dialog
# → shared/ui/dialog.tsx 생성
# → shared/ui/index.ts에 export 추가 필요
```

## Barrel Export 필수 유지

```typescript
// features/my-feature/index.ts
export { MyFeatureBlock } from "./blocks/MyFeatureBlock";
export { MyFeatureList } from "./components/MyFeatureList";
export { useMyItems, useCreateItem } from "./hooks/useMyFeature";
export { createItem } from "./actions/createItem";
export type { MyItem } from "./types";
```

## 타입 안전 규칙

- `any` 금지 — 모르면 `unknown` 사용 후 타입 가드
- 비null 단언(`!`) 금지 — 옵셔널 체이닝(`?.`) 또는 조건부 렌더링 사용
- API 응답 타입: backend-dev로부터 받은 응답 shape 기반으로 interface/type 정의

## 에러 상태 처리

```tsx
// 로딩/에러 상태 처리
export function MyFeatureList() {
  const { data, isLoading, error } = useMyItems();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류가 발생했습니다.</div>;
  if (!data?.length) return <div>항목이 없습니다.</div>;

  return <ul>{data.map(item => <MyItem key={item.id} item={item} />)}</ul>;
}
```

## 시맨틱 HTML

`div` 남발 금지. 의미에 맞게 사용:
- 페이지 영역: `main`, `section`, `article`, `aside`
- 네비게이션: `nav`
- 헤더/푸터: `header`, `footer`
- 제목: `h1`-`h6` (계층 순서 유지)
- 목록: `ul`/`ol` + `li`
