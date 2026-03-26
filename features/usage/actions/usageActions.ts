"use server";

import { auth } from "@/features/auth";
import { getMonthlyUsage, getUsageHistory, checkUsageLimit, type PlanType } from "../lib/usage";

export async function getMonthlyUsageAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return getMonthlyUsage(session.user.id);
}

export async function getUsageHistoryAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return getUsageHistory(session.user.id);
}

export async function checkUsageLimitAction(plan: PlanType) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return checkUsageLimit(session.user.id, plan);
}
