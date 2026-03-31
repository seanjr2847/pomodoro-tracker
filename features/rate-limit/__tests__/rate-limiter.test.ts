import { describe, it, expect, vi, beforeEach } from "vitest";
import { rateLimit } from "../lib/rateLimiter";

function createMockRequest(headers: Record<string, string> = {}) {
  return {
    headers: {
      get: (key: string) => headers[key] ?? null,
    },
  } as unknown as import("next/server").NextRequest;
}

describe("rateLimit", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("allows requests under the limit", () => {
    const check = rateLimit({ windowMs: 60_000, max: 5 });
    const req = createMockRequest({ "x-forwarded-for": "1.2.3.4" });
    for (let i = 0; i < 5; i++) {
      expect(check(req)).toBeNull();
    }
  });

  it("blocks requests over the limit with 429", () => {
    const check = rateLimit({ windowMs: 60_000, max: 2 });
    const req = createMockRequest({ "x-forwarded-for": "5.6.7.8" });
    check(req); // 1
    check(req); // 2
    const response = check(req); // 3 → blocked
    expect(response).not.toBeNull();
    expect(response!.status).toBe(429);
  });

  it("includes rate limit headers on 429", async () => {
    const check = rateLimit({ windowMs: 60_000, max: 1 });
    const req = createMockRequest({ "x-forwarded-for": "9.0.1.2" });
    check(req);
    const response = check(req)!;
    expect(response.headers.get("X-RateLimit-Limit")).toBe("1");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });

  it("resets after window expires", () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const check = rateLimit({ windowMs: 1000, max: 1 });
    const req = createMockRequest({ "x-forwarded-for": "10.0.0.1" });
    check(req); // 1
    expect(check(req)).not.toBeNull(); // blocked

    vi.spyOn(Date, "now").mockReturnValue(now + 1001);
    expect(check(req)).toBeNull(); // reset, allowed
  });

  it("uses x-real-ip when x-forwarded-for is absent", () => {
    const check = rateLimit({ windowMs: 60_000, max: 1 });
    const req = createMockRequest({ "x-real-ip": "192.168.1.1" });
    expect(check(req)).toBeNull();
    expect(check(req)).not.toBeNull(); // same IP, blocked
  });

  it("falls back to anonymous when no IP headers", () => {
    const check = rateLimit({ windowMs: 60_000, max: 1 });
    const req = createMockRequest();
    expect(check(req)).toBeNull();
    expect(check(req)).not.toBeNull();
  });

  it("uses first IP from x-forwarded-for chain", () => {
    const check = rateLimit({ windowMs: 60_000, max: 1 });
    const req = createMockRequest({
      "x-forwarded-for": "11.22.33.44, 55.66.77.88",
    });
    expect(check(req)).toBeNull();

    // Different first IP → different client → allowed
    const req2 = createMockRequest({
      "x-forwarded-for": "99.88.77.66, 55.66.77.88",
    });
    expect(check(req2)).toBeNull();
  });

  it("uses default config when none provided", () => {
    const check = rateLimit();
    const req = createMockRequest({ "x-forwarded-for": "default-test" });
    // Default: 60 requests per 60s — should allow first request
    expect(check(req)).toBeNull();
  });

  it("cleanup interval removes stale entries", () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);

    const check = rateLimit({ windowMs: 1000, max: 1 });
    const req = createMockRequest({ "x-forwarded-for": "cleanup-test-ip" });
    check(req); // adds entry

    // Advance past the rate limit window + cleanup interval (60s)
    vi.setSystemTime(now + 61_000);
    vi.advanceTimersByTime(60_000); // trigger the setInterval

    // After cleanup, entry should be gone — next request should be allowed
    expect(check(req)).toBeNull();

    vi.useRealTimers();
  });
});
