"use server";

import { auth } from "@/features/auth";
import { db } from "@/features/database";
import type { DailyStats, CategoryStats } from "../types";

export async function getTodayStatsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessions = await db.pomodoroSession.findMany({
      where: {
        userId: session.user.id,
        type: "work",
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMin, 0);
    const sessionCount = sessions.length;

    return { success: true, data: { totalMinutes, sessionCount } };
  } catch (error) {
    console.error("Failed to fetch today stats:", error);
    return { success: false, error: "오늘의 통계를 불러오는데 실패했습니다." };
  }
}

export async function getWeeklyStatsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const sessions = await db.pomodoroSession.findMany({
      where: {
        userId: session.user.id,
        type: "work",
        completedAt: {
          gte: weekAgo,
          lt: today,
        },
      },
      orderBy: { completedAt: "asc" },
    });

    const dailyMap = new Map<string, DailyStats>();

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      dailyMap.set(dateStr, { date: dateStr, totalMinutes: 0, sessionCount: 0 });
    }

    sessions.forEach((s) => {
      const dateStr = s.completedAt.toISOString().split("T")[0];
      const existing = dailyMap.get(dateStr);
      if (existing) {
        existing.totalMinutes += s.durationMin;
        existing.sessionCount += 1;
      }
    });

    const dailyBreakdown = Array.from(dailyMap.values());

    return { success: true, data: dailyBreakdown };
  } catch (error) {
    console.error("Failed to fetch weekly stats:", error);
    return { success: false, error: "주간 통계를 불러오는데 실패했습니다." };
  }
}

export async function getCategoryStatsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await db.pomodoroSession.findMany({
      where: {
        userId: session.user.id,
        type: "work",
        completedAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        category: true,
      },
    });

    const categoryMap = new Map<string, CategoryStats>();

    sessions.forEach((s) => {
      const key = s.categoryId || "uncategorized";
      const existing = categoryMap.get(key);

      if (existing) {
        existing.totalMinutes += s.durationMin;
        existing.sessionCount += 1;
      } else {
        categoryMap.set(key, {
          categoryId: s.categoryId,
          categoryName: s.category?.name || "카테고리 없음",
          categoryColor: s.category?.color || "#9CA3AF",
          totalMinutes: s.durationMin,
          sessionCount: 1,
        });
      }
    });

    const categoryStats = Array.from(categoryMap.values()).sort(
      (a, b) => b.totalMinutes - a.totalMinutes
    );

    return { success: true, data: categoryStats };
  } catch (error) {
    console.error("Failed to fetch category stats:", error);
    return { success: false, error: "카테고리별 통계를 불러오는데 실패했습니다." };
  }
}

export async function getMonthlyTrendAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await db.pomodoroSession.findMany({
      where: {
        userId: session.user.id,
        type: "work",
        completedAt: {
          gte: thirtyDaysAgo,
          lt: today,
        },
      },
      orderBy: { completedAt: "asc" },
    });

    const dailyMap = new Map<string, number>();

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      dailyMap.set(dateStr, 0);
    }

    sessions.forEach((s) => {
      const dateStr = s.completedAt.toISOString().split("T")[0];
      const existing = dailyMap.get(dateStr) || 0;
      dailyMap.set(dateStr, existing + 1);
    });

    const trend = Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return { success: true, data: trend };
  } catch (error) {
    console.error("Failed to fetch monthly trend:", error);
    return { success: false, error: "월간 트렌드를 불러오는데 실패했습니다." };
  }
}
