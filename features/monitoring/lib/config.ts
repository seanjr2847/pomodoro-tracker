import { isProduction, nodeEnv } from "@/shared/lib/env";

export const sentryConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
  environment: nodeEnv,
  tracesSampleRate: isProduction ? 0.1 : 1.0,
};

export const isSentryEnabled = sentryConfig.dsn.length > 0;
