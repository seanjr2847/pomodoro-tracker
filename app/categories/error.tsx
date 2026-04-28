"use client";

import { Coffee } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function CategoriesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border border-dashed p-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Coffee className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-semibold">
            카테고리를 불러오는데 실패했습니다
          </h2>
          <p className="text-muted-foreground">
            {error.message || "잠시 후 다시 시도해주세요"}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={reset} variant="outline">
            다시 시도
          </Button>
          <Link href="/timer">
            <Button>타이머로 이동</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
