import { describe, it, expect } from "vitest";
import { emailConfig, isEmailEnabled } from "../lib/config";

describe("email config", () => {
  it("exports config with defaults", () => {
    expect(emailConfig.from).toBe("onboarding@resend.dev");
    expect(typeof emailConfig.apiKey).toBe("string");
  });

  it("isEmailEnabled reflects apiKey presence", () => {
    expect(isEmailEnabled).toBe(emailConfig.apiKey.length > 0);
  });
});
