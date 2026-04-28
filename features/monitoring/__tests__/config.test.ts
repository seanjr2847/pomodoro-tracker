import { describe, it, expect } from "vitest";
import { sentryConfig, isSentryEnabled } from "../lib/config";

describe("monitoring config", () => {
  it("exports config with defaults", () => {
    expect(typeof sentryConfig.dsn).toBe("string");
    expect(sentryConfig.environment).toBe("test");
    expect(typeof sentryConfig.tracesSampleRate).toBe("number");
  });

  it("isSentryEnabled reflects DSN presence", () => {
    expect(isSentryEnabled).toBe(sentryConfig.dsn.length > 0);
  });
});
