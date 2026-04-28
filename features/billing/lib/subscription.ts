import { prisma } from "@/features/database";

export async function upsertSubscription(params: {
  userId: string;
  paddleSubscriptionId: string;
  paddleCustomerId?: string;
  plan: string;
  status: string;
  currentPeriodEnd?: Date;
}) {
  return prisma.subscription.upsert({
    where: { paddleSubscriptionId: params.paddleSubscriptionId },
    update: {
      status: params.status,
      plan: params.plan,
      paddleCustomerId: params.paddleCustomerId ?? undefined,
      currentPeriodEnd: params.currentPeriodEnd ?? undefined,
    },
    create: {
      userId: params.userId,
      paddleSubscriptionId: params.paddleSubscriptionId,
      paddleCustomerId: params.paddleCustomerId,
      plan: params.plan,
      status: params.status,
      currentPeriodEnd: params.currentPeriodEnd,
    },
  });
}

export async function getSubscriptionByUserId(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}
