import { NextResponse } from "next/server";
import {
  verifyPaddleSignature,
  isBillingEnabled,
  upsertSubscription,
  findUserByEmail,
  paddleWebhookEventSchema,
  ALLOWED_WEBHOOK_EVENTS,
} from "@/features/billing";
import { prisma } from "@/features/database";
import { logger } from "@/shared/lib/logger";

export async function POST(request: Request) {
  if (!isBillingEnabled) {
    return NextResponse.json({ error: "Billing not enabled" }, { status: 404 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature");

  if (!verifyPaddleSignature(rawBody, signature)) {
    logger.warn("webhook:signature-failed");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    logger.warn("webhook:parse-failed");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = paddleWebhookEventSchema.safeParse(parsed);
  if (!result.success) {
    logger.warn("webhook:validation-failed", {
      errors: result.error.issues.map((i) => i.message),
    });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const event = result.data;
  logger.info("webhook:received", { eventType: event.event_type });

  // Allowlist filter: ignore unknown event types
  if (
    !ALLOWED_WEBHOOK_EVENTS.includes(
      event.event_type as (typeof ALLOWED_WEBHOOK_EVENTS)[number]
    )
  ) {
    return NextResponse.json({ received: true });
  }

  const data = event.data;
  if (!data?.id) {
    return NextResponse.json({ received: true });
  }

  // Resolve userId: custom_data > existing record > email fallback
  let userId: string | null = data.custom_data?.user_id ?? null;

  if (!userId) {
    const existing = await prisma.subscription.findUnique({
      where: { paddleSubscriptionId: data.id },
      select: { userId: true },
    });
    userId = existing?.userId ?? null;
  }

  if (!userId && data.customer?.email) {
    const user = await findUserByEmail(data.customer.email);
    userId = user?.id ?? null;
  }

  if (!userId) {
    logger.warn("webhook:user-not-found", { subscriptionId: data.id });
    return NextResponse.json({ error: "User not found" }, { status: 500 });
  }

  const status =
    event.event_type === "subscription.canceled"
      ? "canceled"
      : (data.status ?? "active");

  await upsertSubscription({
    userId,
    paddleSubscriptionId: data.id,
    paddleCustomerId: data.customer_id ?? data.customer?.id,
    plan: data.items?.[0]?.price?.product_id ?? "pro",
    status,
    currentPeriodEnd: data.current_billing_period?.ends_at
      ? new Date(data.current_billing_period.ends_at)
      : undefined,
  });

  logger.info("webhook:processed", {
    eventType: event.event_type,
    subscriptionId: data.id,
  });

  return NextResponse.json({ received: true });
}
