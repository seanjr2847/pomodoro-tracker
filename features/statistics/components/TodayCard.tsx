"use client";

import { Card } from "@/shared/ui/card";
import { Timer, TrendingUp } from "lucide-react";

interface TodayCardProps {
  totalMinutes: number;
  sessionCount: number;
}

export function TodayCard({ totalMinutes, sessionCount }: TodayCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Timer className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold">오늘 완료한 포모도로</h3>
      </div>
      <div className="space-y-2">
        <div className="text-4xl font-bold text-primary">{sessionCount}개</div>
        <p className="text-sm text-muted-foreground">
          총 {totalMinutes}분 집중했습니다
        </p>
      </div>
    </Card>
  );
}
