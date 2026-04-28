import { describe, it, expect, vi, beforeEach } from "vitest";
import { rateLimit, cleanupStaleEntries } from "../lib/rateLimiter";

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

  it("allows requests under the limit", async () => {
    const check = rateLimit({ windowMs: 60_000, max: 5 });
    const req = createMockRequest({ "x-forwarded-for": "1.2.3.4" });
    for (let i = 0; i < 5; i++) {
      expect(await check(req)).toBeNull();
    }
  });

  it("blocks requests over the limit with 429", async () => {
    const check = rateLimit({ windowMs: 60_000, max: 2 });
    const req = createMockRequest({ "x-forwarded-for": "5.6.7.8" });
    await check(req); // 1
    await check(req); // 2
    const response = await check(req); // 3 -> blocked
    expect(response).not.toBeNull();
    expect(response!.status).toBe(429);
  });

  it("includes rate limit headers on 429", async () => {
    const check = rateLimit({ windowMs: 60_000, max: 1 });
    const req = createMockRequest({ "x-forwarded-for": "9.0.1.2" });
    await check(req);
    const response = (await check(req))!;
    expect(response.headers.get("X-RateLimit-Limit")).toBe("1");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });

  it("resets after window expires", async () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const check = rateLimit({ windowMs: 1000, max: 1 });
    const req = createMockRequest({ "x-forwarded-for": "10.0.0.1" });
    await check(req); // 1
    expect(await check(req)).not.toBeNull(); // blocked

    vi.spyOn(Date, "now").mockReturnValue(now + 1001);
    expect(await check(req)).toBeNull(); // reset, allowed
  });

  it("uses x-real-ip when x-forwarded-for is absent", async () => {
    const check = rateLimit({ windowMs: 60_000, max: 1 });
    const req = createMockRequest({ "x-real-ip": "192.168.1.1" });
    expect(await check(req)).toBeNull();
    expect(await check(req)).not.toBeNull(); // same IP, blocked
  });

  it("falls back to anonymous when no IP headers", async () => {
    const check = rateLimit({ windowMs: 60_000, max: 1 });
    const req = createMockRequest();
    expect(await check(req)).toBeNull();
    expect(await check(req)).not.toBeNull();
  });

  it("uses first IP from x-forwarded-for chain", async () => {
    const check = rateLimit({ windowMs: 60_000, max: 1 });
    const req = createMockRequest({
      "x-forwarded-for": "11.22.33.44, 55.66.77.88",
    });
    expect(await check(req)).toBeNull();

    // Different first IP -> different client -> allowed
    const req2 = createMockRequest({
      "x-forwarded-for": "99.88.77.66, 55.66.77.88",
    });
    expect(await check(req2)).toBeNull();
  });

  it("uses default config when none provided", async () => {
    const check = rateLimit();
    const req = createMockRequest({ "x-forwarded-for": "default-test" });
    // Default: 60 requests per 60s — should allow first request
    expect(await check(req)).toBeNull();
  });

  it("cleanupStaleEntries removes expired entries", async () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const check = rateLimit({ windowMs: 1000, max: 1 });
    const req = createMockRequest({ "x-forwarded-for": "cleanup-test-ip" });
    await check(req); // adds entry
    expect(await check(req)).not.toBeNull(); // blocked

    // Advance time past the window
    vi.spyOn(Date, "now").mockReturnValue(now + 1001);

    // Run cleanup directly
    cleanupStaleEntries();

    // After cleanup, entry should be gone — next request should be allowed
    expect(await check(req)).toBeNull();
  });

  it("cleanupStaleEntries keeps non-expired entries", async () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const check = rateLimit({ windowMs: 60_000, max: 1 });
    const req = createMockRequest({ "x-forwarded-for": "keep-test-ip" });
    await check(req);

    // Cleanup within window should NOT remove the entry
    cleanupStaleEntries();
    expect(await check(req)).not.toBeNull(); // still blocked
  });
});
