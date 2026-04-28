import { Suspense } from "react";
import { auth } from "@/features/auth";
import { PomodoroTimer } from "@/features/pomodoro";
import { getCategoriesAction } from "@/features/categories";
import { Timer as TimerIcon } from "lucide-react";

export const metadata = {
  title: "타이머 | Pomodoro Tracker",
  description: "포모도로 타이머로 25분 집중 사이클을 시작하세요",
};

async function TimerContent() {
  const session = await auth();
  let categories: Array<{
    id: string;
    userId: string;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  if (session?.user?.id) {
    const result = await getCategoriesAction();
    if (result.success && result.data) {
      categories = result.data;
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <TimerIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-bold">포모도로 타이머</h1>
        <p className="text-muted-foreground">
          25분 집중. 5분 휴식. 끝없는 성장.
        </p>
      </div>

      <PomodoroTimer categories={categories} />

      {!session?.user && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          로그인하면 통계를 확인하고 카테고리를 관리할 수 있습니다.
        </p>
      )}
    </div>
  );
}

export default function TimerPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <TimerContent />
    </Suspense>
  );
}
