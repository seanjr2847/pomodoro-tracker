"use server";

import { auth } from "@/features/auth";
import { db } from "@/features/database";
import { revalidatePath } from "next/cache";
import type { CreateSessionInput } from "../types";

export async function createSessionAction(input: CreateSessionInput) {
  // 로그인 선택 사항 (로그인하지 않아도 localStorage 데이터로 사용 가능)
  const session = await auth();
  const userId = session?.user?.id || null;

  try {
    const pomodoroSession = await db.pomodoroSession.create({
      data: {
        userId,
        categoryId: input.categoryId || null,
        durationMin: input.durationMin,
        type: input.type,
        note: input.note || null,
        startedAt: input.startedAt,
        completedAt: input.completedAt,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: pomodoroSession };
  } catch (error) {
    console.error("Failed to create session:", error);
    return { success: false, error: "세션 저장에 실패했습니다." };
  }
}

export async function getRecentSessionsAction(limit = 20) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    const sessions = await db.pomodoroSession.findMany({
      where: { userId: session.user.id },
      include: {
        category: true,
      },
      orderBy: { completedAt: "desc" },
      take: limit,
    });

    return { success: true, data: sessions };
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return { success: false, error: "세션 목록을 불러오는데 실패했습니다." };
  }
}

export async function getSessionsInRangeAction(startDate: Date, endDate: Date) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    const sessions = await db.pomodoroSession.findMany({
      where: {
        userId: session.user.id,
        completedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: { completedAt: "asc" },
    });

    return { success: true, data: sessions };
  } catch (error) {
    console.error("Failed to fetch sessions in range:", error);
    return { success: false, error: "세션 데이터를 불러오는데 실패했습니다." };
  }
}
