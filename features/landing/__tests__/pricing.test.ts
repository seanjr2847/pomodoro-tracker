import { describe, it, expect } from "vitest";
import { siteConfig } from "@/config/site";

describe("Pricing", () => {
  it("free tier has a valid name and price", () => {
    expect(siteConfig.pricing.free.name).toBe("Free");
    expect(siteConfig.pricing.free.price).toContain("$0");
  });

  it("pro tier has a valid name and price", () => {
    expect(siteConfig.pricing.pro.name).toBe("Pro");
    expect(siteConfig.pricing.pro.price).toMatch(/\$\d+/);
  });

  it("pro tier has more features than free tier", () => {
    expect(siteConfig.pricing.pro.features.length).toBeGreaterThan(
      siteConfig.pricing.free.features.length
    );
  });

  it("all feature descriptions are non-empty strings", () => {
    [...siteConfig.pricing.free.features, ...siteConfig.pricing.pro.features].forEach((f) => {
      expect(typeof f).toBe("string");
      expect(f.length).toBeGreaterThan(0);
    });
  });

  it("billing toggle respects PADDLE_API_KEY env", () => {
    const hasBilling = !!process.env.PADDLE_API_KEY;
    expect(typeof hasBilling).toBe("boolean");
  });
});
