import { describe, it, expect } from "vitest";
import { sentryConfig, isSentryEnabled } from "../lib/config";

describe("monitoring config", () => {
  it("exports config with defaults", () => {
    expect(typeof sentryConfig.dsn).toBe("string");
    // vitest는 보통 NODE_ENV=test이지만 Vercel/CI 빌드는 NODE_ENV=production 강제 주입.
    // 환경 값 자체를 hardcode 검증하지 말고 타입과 허용 값만 확인.
    expect(typeof sentryConfig.environment).toBe("string");
    expect(["test", "development", "production"]).toContain(sentryConfig.environment);
    expect(typeof sentryConfig.tracesSampleRate).toBe("number");
  });

  it("isSentryEnabled reflects DSN presence", () => {
    expect(isSentryEnabled).toBe(sentryConfig.dsn.length > 0);
  });
});
