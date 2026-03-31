import { describe, it, expect } from "vitest";
import { paddleConfig, paddleClientConfig, isBillingEnabled } from "../config/paddle";

describe("paddle config", () => {
  it("exports isBillingEnabled flag", () => {
    expect(typeof isBillingEnabled).toBe("boolean");
  });

  it("exports paddleConfig with defaults", () => {
    expect(paddleConfig).toHaveProperty("apiKey");
    expect(paddleConfig).toHaveProperty("webhookSecret");
  });

  it("exports paddleClientConfig with defaults", () => {
    expect(paddleClientConfig).toHaveProperty("clientToken");
    expect(paddleClientConfig).toHaveProperty("priceId");
    expect(paddleClientConfig.environment).toMatch(/^(sandbox|production)$/);
  });
});
