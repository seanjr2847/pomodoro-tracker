import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth";
import {
  getTodayStatsAction,
  getWeeklyStatsAction,
  getCategoryStatsAction,
  TodayCard,
  WeeklyChart,
  CategoryPieChart,
} from "@/features/statistics";
import { BarChart3, Coffee } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export const metadata = {
  title: "통계 | Pomodoro Tracker",
  description: "포모도로 통계를 확인하고 집중도를 분석하세요",
};

async function DashboardContent() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/timer");
  }

  const [todayResult, weeklyResult, categoryResult] = await Promise.allSettled([
    getTodayStatsAction(),
    getWeeklyStatsAction(),
    getCategoryStatsAction(),
  ]);

  const todayStats =
    todayResult.status === "fulfilled" && todayResult.value.success
      ? todayResult.value.data
      : { totalMinutes: 0, sessionCount: 0 };

  const weeklyStats =
    weeklyResult.status === "fulfilled" && weeklyResult.value.success
      ? weeklyResult.value.data
      : [];

  const categoryStats =
    categoryResult.status === "fulfilled" && categoryResult.value.success
      ? categoryResult.value.data
      : [];

  const hasAnyData = todayStats.sessionCount > 0 || categoryStats.length > 0;

  if (!hasAnyData) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border border-dashed p-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Coffee className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              아직 완료한 포모도로가 없어요
            </h2>
            <p className="text-muted-foreground">
              타이머를 시작해서 첫 사이클을 완료해보세요
            </p>
          </div>
          <Link href="/timer">
            <Button size="lg">
              <BarChart3 className="mr-2 h-5 w-5" />
              타이머 시작
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">통계 대시보드</h1>
            <p className="text-muted-foreground">
              나의 집중력을 데이터로 확인하세요
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <TodayCard
          totalMinutes={todayStats.totalMinutes}
          sessionCount={todayStats.sessionCount}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <WeeklyChart data={weeklyStats} />
          <CategoryPieChart data={categoryStats} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
