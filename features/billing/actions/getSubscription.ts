"use server";

import { auth } from "@/features/auth";
import { getSubscriptionByUserId } from "../lib/subscription";

export async function fetchSubscription() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return getSubscriptionByUserId(session.user.id);
}
