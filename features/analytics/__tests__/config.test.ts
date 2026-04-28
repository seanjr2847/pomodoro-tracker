import { describe, it, expect } from "vitest";
import { analyticsConfig, isPostHogEnabled, isGAEnabled, isAnalyticsEnabled } from "../lib/config";

describe("analytics config", () => {
  it("exports config with defaults", () => {
    expect(analyticsConfig.posthogHost).toBe("https://us.i.posthog.com");
    expect(typeof analyticsConfig.posthogKey).toBe("string");
    expect(typeof analyticsConfig.gaId).toBe("string");
  });

  it("exports boolean flags", () => {
    expect(typeof isPostHogEnabled).toBe("boolean");
    expect(typeof isGAEnabled).toBe("boolean");
    expect(typeof isAnalyticsEnabled).toBe("boolean");
  });

  it("isAnalyticsEnabled is OR of posthog and ga", () => {
    expect(isAnalyticsEnabled).toBe(isPostHogEnabled || isGAEnabled);
  });
});
