import { prisma } from "@/features/database";

export const PLAN_LIMITS = {
  free: { requests: 100, tokens: 10_000 },
  pro: { requests: 10_000, tokens: 1_000_000 },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export async function recordUsage(
  userId: string,
  action: string,
  tokens: number = 0,
  cost: number = 0,
  metadata?: string
) {
  return prisma.usageRecord.create({
    data: { userId, action, tokens, cost, metadata },
  });
}

export async function getMonthlyUsage(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const records = await prisma.usageRecord.aggregate({
    where: { userId, createdAt: { gte: startOfMonth } },
    _count: true,
    _sum: { tokens: true, cost: true },
  });

  return {
    requests: records._count,
    tokens: records._sum.tokens ?? 0,
    cost: records._sum.cost ?? 0,
  };
}

export async function getUsageHistory(userId: string, days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return prisma.usageRecord.findMany({
    where: { userId, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      action: true,
      tokens: true,
      cost: true,
      createdAt: true,
    },
  });
}

export async function checkUsageLimit(userId: string, plan: PlanType) {
  const usage = await getMonthlyUsage(userId);
  const limits = PLAN_LIMITS[plan];

  return {
    allowed: usage.requests < limits.requests && usage.tokens < limits.tokens,
    usage,
    limits,
    requestsRemaining: Math.max(0, limits.requests - usage.requests),
    tokensRemaining: Math.max(0, limits.tokens - usage.tokens),
  };
}
