"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Play, Pause, SquareIcon, SkipForward } from "lucide-react";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { createSessionAction } from "../actions/sessionActions";
import { toast } from "sonner";
import type { Category } from "@/features/categories/types";

interface PomodoroTimerProps {
  categories?: Category[];
}

export function PomodoroTimer({ categories = [] }: PomodoroTimerProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const handleSessionComplete = async (type: "work" | "break" | "long-break", duration: number) => {
    if (type === "work" && startTime) {
      const completedAt = new Date();
      const result = await createSessionAction({
        categoryId: selectedCategoryId,
        durationMin: duration,
        type,
        startedAt: startTime,
        completedAt,
      });

      if (result.success) {
        toast.success(`포모도로 완료! ${duration}분 집중했습니다.`);
      }
    }
    setStartTime(null);
  };

  const { timeLeft, isRunning, sessionType, cycleCount, start, pause, reset, skip, switchSession } =
    usePomodoroTimer({ onSessionComplete: handleSessionComplete });

  const handleStart = () => {
    if (!isRunning && sessionType === "work" && !startTime) {
      setStartTime(new Date());
    }
    start();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const sessionLabel = {
    work: "작업",
    break: "휴식",
    "long-break": "긴 휴식",
  }[sessionType];

  const sessionColor = {
    work: "bg-primary",
    break: "bg-secondary",
    "long-break": "bg-secondary",
  }[sessionType];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className={`inline-block rounded-full px-4 py-1 text-sm font-medium text-white ${sessionColor}`}>
              {sessionLabel} {sessionType === "work" && `(${cycleCount + 1}번째 사이클)`}
            </div>
          </div>

          <div className="text-center">
            <div className="text-8xl font-bold tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          </div>

          {sessionType === "work" && categories.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">카테고리 선택 (선택사항)</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategoryId(undefined)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                    selectedCategoryId === undefined
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                  disabled={isRunning}
                >
                  없음
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                      selectedCategoryId === cat.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    }`}
                    disabled={isRunning}
                  >
                    <span
                      className="mr-1.5 inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg" className="min-w-32">
                <Play className="mr-2 h-5 w-5" />
                시작
              </Button>
            ) : (
              <Button onClick={pause} size="lg" variant="secondary" className="min-w-32">
                <Pause className="mr-2 h-5 w-5" />
                일시정지
              </Button>
            )}
            <Button onClick={reset} size="lg" variant="outline">
              <SquareIcon className="mr-2 h-5 w-5" />
              중지
            </Button>
            <Button onClick={skip} size="lg" variant="outline" disabled={!isRunning}>
              <SkipForward className="mr-2 h-5 w-5" />
              스킵
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-3 font-semibold">세션 전환</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => switchSession("work")}
            variant={sessionType === "work" ? "default" : "outline"}
            disabled={isRunning}
          >
            작업 (25분)
          </Button>
          <Button
            onClick={() => switchSession("break")}
            variant={sessionType === "break" ? "default" : "outline"}
            disabled={isRunning}
          >
            휴식 (5분)
          </Button>
          <Button
            onClick={() => switchSession("long-break")}
            variant={sessionType === "long-break" ? "default" : "outline"}
            disabled={isRunning}
          >
            긴 휴식 (15분)
          </Button>
        </div>
      </Card>
    </div>
  );
}
