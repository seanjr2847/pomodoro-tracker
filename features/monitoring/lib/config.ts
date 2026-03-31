export const sentryConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
};

export const isSentryEnabled = sentryConfig.dsn.length > 0;
