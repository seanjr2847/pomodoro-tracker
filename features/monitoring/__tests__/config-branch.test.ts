import { describe, it, expect, vi, afterEach } from "vitest";

describe("monitoring config branches", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("uses production tracesSampleRate in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "https://test@sentry.io/123");
    const mod = await import("../lib/config");
    expect(mod.sentryConfig.tracesSampleRate).toBe(0.1);
    expect(mod.sentryConfig.environment).toBe("production");
    expect(mod.isSentryEnabled).toBe(true);
  });

  it("uses full tracesSampleRate in non-production", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "https://test@sentry.io/123");
    const mod = await import("../lib/config");
    expect(mod.sentryConfig.tracesSampleRate).toBe(1.0);
  });

  it("is disabled when DSN is empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "");
    const mod = await import("../lib/config");
    expect(mod.isSentryEnabled).toBe(false);
    expect(mod.sentryConfig.dsn).toBe("");
  });
});
