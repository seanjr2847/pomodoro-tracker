---
name: dashboard-builder
description: "Next.js 15 App Router 기반 SaaS 대시보드 UI를 구현한다. 페이지, 레이아웃, Feature 모듈 컴포넌트, shadcn/ui 통합, 반응형 디자인. 대시보드 생성, 페이지 추가, UI 컴포넌트 구현, 프론트엔드 작업 요청 시 사용."
---

# Dashboard Builder -- Next.js SaaS UI 구현 스킬

SaaS 대시보드의 프론트엔드를 구현한다. architect의 계약을 참조하여 타입 안전한 UI를 작성한다.

## 사전 확인

```
1. Read _workspace/01_architect_contracts.ts -- 공유 타입
2. Read _workspace/01_architect_plan.md -- 아키텍처 결정
3. Read app/layout.tsx -- 기존 루트 레이아웃
4. Read app/dashboard/layout.tsx -- 기존 대시보드 레이아웃
5. Read shared/ui/index.ts -- 사용 가능한 UI 컴포넌트
```

## 페이지 생성 패턴

### Server Component 페이지 (기본)

```tsx
// app/dashboard/[feature]/page.tsx
import { auth } from "@/features/auth";
import { FeatureComponent } from "@/features/[feature-name]";

export default async function FeaturePage() {
  const session = await auth();
  // Server-side data fetching
  return <FeatureComponent />;
}
```

### Client Component (상호작용 필요 시)

```tsx
"use client";
import { useState } from "react";
import { Button, Card } from "@/shared/ui";

export function InteractiveWidget() {
  const [state, setState] = useState(false);
  return <Button onClick={() => setState(!state)}>Toggle</Button>;
}
```

## Feature 모듈 구조

새 feature 생성 시 반드시 따를 구조:

```
features/{name}/
├── index.ts          # barrel export (필수)
├── components/       # React 컴포넌트
│   └── FeatureName.tsx
├── hooks/            # 커스텀 hooks (선택)
├── lib/              # 유틸리티 (선택)
└── types/            # 타입 정의 (선택)
```

barrel export 예시:
```typescript
// features/{name}/index.ts
export { FeatureComponent } from "./components/FeatureComponent";
export type { FeatureType } from "./types";
```

## 스타일링 규칙

- cn() 유틸: `import { cn } from "@/shared/utils/cn"`
- 테마 토큰: bg-background, text-foreground, bg-primary
- 반응형: `mx-auto max-w-5xl px-3 lg:px-4 xl:px-0`
- 다크모드: 자동 (next-themes + .dark 클래스)

## DataTable 패턴

관리 화면의 데이터 목록:

```tsx
import { DataTable, SortableHeader } from "@/shared/ui";
import { type ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
  },
];

<DataTable columns={columns} data={items} searchKey="name" pageSize={10} />
```

## Form 패턴

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3"; // hookform 호환

const schema = z.object({ name: z.string().min(2) });
type FormValues = z.infer<typeof schema>;
```

## 산출물

구현 완료 후 `_workspace/02_frontend_pages.md`에 기록:
- 생성/수정한 파일 목록
- 각 페이지의 라우트 경로
- 사용한 Feature 모듈과 barrel export 확인
- 필요한 API 엔드포인트 목록 (backend에 전달)
