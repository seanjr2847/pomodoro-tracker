import { NextResponse } from "next/server";
import { verifyPaddleSignature } from "@/features/billing/api/webhook";
import { isBillingEnabled } from "@/features/billing/config/paddle";
import {
  upsertSubscription,
  findUserByEmail,
} from "@/features/billing/lib/subscription";
import { prisma } from "@/features/database";

export async function POST(request: Request) {
  if (!isBillingEnabled) {
    return NextResponse.json({ error: "Billing not enabled" }, { status: 404 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature");

  if (!verifyPaddleSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event_type) {
    case "subscription.created":
    case "subscription.updated":
    case "subscription.canceled": {
      const data = event.data;
      if (!data?.id) break;

      // Resolve userId: custom_data > existing record > email fallback
      let userId: string | null =
        data.custom_data?.user_id ?? null;

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
        console.warn(
          `[paddle-webhook] Cannot resolve userId for subscription ${data.id}`
        );
        break;
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
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
