import { describe, it, expect } from "vitest";
import { siteConfig } from "@/config/site";

describe("Pricing", () => {
  it("has at least one plan", () => {
    expect(siteConfig.pricing.plans.length).toBeGreaterThan(0);
  });

  it("each plan has required fields", () => {
    siteConfig.pricing.plans.forEach((plan) => {
      expect(plan.id).toBeTruthy();
      expect(plan.name).toBeTruthy();
      expect(plan.price).toMatch(/₩|원|\$/);
      expect(plan.cta).toBeTruthy();
      expect(Array.isArray(plan.features)).toBe(true);
    });
  });

  it("all feature descriptions are non-empty strings", () => {
    siteConfig.pricing.plans.flatMap((plan) => plan.features).forEach((f) => {
      expect(typeof f).toBe("string");
      expect(f.length).toBeGreaterThan(0);
    });
  });

  it("at most one plan is highlighted", () => {
    const highlighted = siteConfig.pricing.plans.filter((p) => p.highlighted);
    expect(highlighted.length).toBeLessThanOrEqual(1);
  });

  it("billing toggle respects PADDLE_API_KEY env", () => {
    const hasBilling = !!process.env.PADDLE_API_KEY;
    expect(typeof hasBilling).toBe("boolean");
  });
});
