import { z } from "zod/v4";

const envSchema = z.object({
  // ── Required ────────────────────────────────
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // ── Auth (optional — mock session active when absent in dev) ─
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // ── AI (optional) ───────────────────────────
  GEMINI_API_KEY: z.string().optional(),

  // ── Billing — Paddle (optional) ─────────────
  PADDLE_API_KEY: z.string().optional(),
  PADDLE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_PADDLE_PRICE_ID: z.string().optional(),
  NEXT_PUBLIC_PADDLE_ENV: z.enum(["sandbox", "production"]).optional(),

  // ── Email — Resend (optional) ───────────────
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // ── Analytics (optional) ────────────────────
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // ── Monitoring — Sentry (optional) ──────────
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),

  // ── Rate Limiting — Upstash Redis (optional) ─
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // ── CORS (optional) ─────────────────────────
  CORS_ORIGIN: z.string().optional(),

  // ── PWA (optional) ──────────────────────────
  NEXT_PUBLIC_PWA_ENABLED: z
    .enum(["true", "false"])
    .optional(),

  // ── Google Maps (optional) ──────────────────
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const formatted = result.error.issues
    .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Environment variable validation failed:\n${formatted}`);
}

export const env = result.data;
