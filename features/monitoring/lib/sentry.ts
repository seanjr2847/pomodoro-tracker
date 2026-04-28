import * as Sentry from "@sentry/browser";
import { sentryConfig, isSentryEnabled } from "./config";

let initialized = false;

export function initSentry() {
  if (initialized || !isSentryEnabled) return;
  Sentry.init({
    dsn: sentryConfig.dsn,
    environment: sentryConfig.environment,
    tracesSampleRate: sentryConfig.tracesSampleRate,
    debug: false,
  });
  initialized = true;
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  if (!isSentryEnabled) {
    console.error("[monitoring]", error);
    return;
  }
  initSentry();
  Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  if (!isSentryEnabled) {
    console.log(`[monitoring:${level}]`, message);
    return;
  }
  initSentry();
  Sentry.captureMessage(message, level);
}

export function setUser(user: { id: string; email?: string; username?: string } | null) {
  if (!isSentryEnabled) return;
  initSentry();
  Sentry.setUser(user);
}
