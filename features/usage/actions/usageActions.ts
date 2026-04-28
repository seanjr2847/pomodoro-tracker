"use server";

import { z } from "zod/v4";
import { auth } from "@/features/auth";
import { getMonthlyUsage, getUsageHistory, checkUsageLimit, type PlanType } from "../lib/usage";
import { ok, fail } from "@/shared/lib/actionResult";

const planSchema = z.enum(["free", "pro"]);

export async function getMonthlyUsageAction() {
  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const usage = await getMonthlyUsage(session.user.id);
  return ok(usage);
}

export async function getUsageHistoryAction() {
  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const history = await getUsageHistory(session.user.id);
  return ok(history);
}

export async function checkUsageLimitAction(plan: PlanType) {
  const parsed = planSchema.safeParse(plan);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const result = await checkUsageLimit(session.user.id, parsed.data);
  return ok(result);
}
