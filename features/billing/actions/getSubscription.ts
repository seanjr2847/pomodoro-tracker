"use server";

import { auth } from "@/features/auth";
import { getSubscriptionByUserId } from "../lib/subscription";
import { ok, fail } from "@/shared/lib/actionResult";

export async function fetchSubscription() {
  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const subscription = await getSubscriptionByUserId(session.user.id);
  return ok(subscription);
}
