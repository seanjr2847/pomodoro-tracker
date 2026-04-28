import { describe, it, expect } from "vitest";
import { buildCsp, mergeDirectives } from "../csp";

describe("buildCsp", () => {
  it("returns a non-empty CSP string", () => {
    const csp = buildCsp();
    expect(csp).toBeTruthy();
    expect(typeof csp).toBe("string");
  });

  it("includes base directives", () => {
    const csp = buildCsp();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src");
    expect(csp).toContain("style-src");
    expect(csp).toContain("img-src");
    expect(csp).toContain("font-src");
    expect(csp).toContain("connect-src");
  });

  it("includes billing (Paddle) sources", () => {
    const csp = buildCsp();
    expect(csp).toContain("https://cdn.paddle.com");
    expect(csp).toContain("https://checkout.paddle.com");
    expect(csp).toContain("https://sandbox-checkout.paddle.com");
  });

  it("includes analytics (PostHog + GA4) sources", () => {
    const csp = buildCsp();
    expect(csp).toContain("https://www.googletagmanager.com");
    expect(csp).toContain("https://us-assets.i.posthog.com");
    expect(csp).toContain("https://us.i.posthog.com");
    expect(csp).toContain("https://www.google-analytics.com");
  });

  it("includes monitoring (Sentry) sources", () => {
    const csp = buildCsp();
    expect(csp).toContain("https://*.sentry.io");
  });

  it("deduplicates values across sources", () => {
    const csp = buildCsp();
    // 'self' appears in many base directives but should not be duplicated within one directive
    const selfMatches = csp.match(/default-src[^;]*/)?.[0];
    expect(selfMatches).toBeDefined();
    const selfCount = selfMatches!.split("'self'").length - 1;
    expect(selfCount).toBe(1);
  });

  it("omits empty directives (worker-src has only 'self')", () => {
    const csp = buildCsp();
    expect(csp).toContain("worker-src 'self'");
  });

  it("separates directives with semicolons", () => {
    const csp = buildCsp();
    expect(csp).toContain("; ");
  });
});

describe("mergeDirectives", () => {
  it("deduplicates identical values within the same directive key", () => {
    const a = { "script-src": ["'self'", "https://a.com"] };
    const b = { "script-src": ["'self'", "https://b.com"] };
    const merged = mergeDirectives(a, b);
    expect(merged["script-src"]).toEqual(["'self'", "https://a.com", "https://b.com"]);
  });

  it("merges empty sources", () => {
    const merged = mergeDirectives({}, {});
    expect(merged).toEqual({});
  });
});
