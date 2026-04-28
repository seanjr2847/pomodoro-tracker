import { z } from "zod/v4";

export const ALLOWED_WEBHOOK_EVENTS = [
  "subscription.created",
  "subscription.updated",
  "subscription.canceled",
] as const;

const subscriptionDataSchema = z.object({
  id: z.string().min(1),
  status: z.string().optional(),
  customer_id: z.string().optional(),
  customer: z
    .object({
      id: z.string().optional(),
      email: z.email().optional(),
    })
    .optional(),
  custom_data: z
    .object({
      user_id: z.string().optional(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        price: z
          .object({
            product_id: z.string().optional(),
          })
          .optional(),
      })
    )
    .optional(),
  current_billing_period: z
    .object({
      ends_at: z.string().optional(),
    })
    .optional(),
});

export const paddleWebhookEventSchema = z.object({
  event_type: z.string(),
  data: subscriptionDataSchema.optional(),
});

export type PaddleWebhookEvent = z.infer<typeof paddleWebhookEventSchema>;
