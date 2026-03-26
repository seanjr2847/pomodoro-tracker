import { describe, it, expect } from "vitest";
import {
  paddleWebhookEventSchema,
  ALLOWED_WEBHOOK_EVENTS,
} from "@/features/billing/lib/webhookSchema";

describe("paddleWebhookEventSchema", () => {
  it("accepts a valid subscription.created event", () => {
    const event = {
      event_type: "subscription.created",
      data: {
        id: "sub_123",
        status: "active",
        customer: { id: "ctm_1", email: "test@example.com" },
        items: [{ price: { product_id: "pro" } }],
      },
    };
    const result = paddleWebhookEventSchema.safeParse(event);
    expect(result.success).toBe(true);
  });

  it("accepts a valid subscription.canceled event", () => {
    const event = {
      event_type: "subscription.canceled",
      data: {
        id: "sub_456",
        status: "canceled",
      },
    };
    const result = paddleWebhookEventSchema.safeParse(event);
    expect(result.success).toBe(true);
  });

  it("rejects event with missing data.id", () => {
    const event = {
      event_type: "subscription.created",
      data: { status: "active" },
    };
    const result = paddleWebhookEventSchema.safeParse(event);
    expect(result.success).toBe(false);
  });

  it("rejects completely invalid payload", () => {
    const result = paddleWebhookEventSchema.safeParse("not an object");
    expect(result.success).toBe(false);
  });

  it("accepts unknown event types (schema passes, route filters)", () => {
    const event = {
      event_type: "transaction.completed",
      data: { id: "txn_1" },
    };
    const result = paddleWebhookEventSchema.safeParse(event);
    expect(result.success).toBe(true);
  });

  it("ALLOWED_WEBHOOK_EVENTS contains expected event types", () => {
    expect(ALLOWED_WEBHOOK_EVENTS).toContain("subscription.created");
    expect(ALLOWED_WEBHOOK_EVENTS).toContain("subscription.updated");
    expect(ALLOWED_WEBHOOK_EVENTS).toContain("subscription.canceled");
    expect(ALLOWED_WEBHOOK_EVENTS).toHaveLength(3);
  });
});
