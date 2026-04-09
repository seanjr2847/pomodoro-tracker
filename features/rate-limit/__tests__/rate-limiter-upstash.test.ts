import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import Module from "module";

describe("rateLimit (Upstash Redis path)", () => {
  let origRequire: typeof Module.prototype.require;
  let mockLimit: ReturnType<typeof vi.fn>;

  // Track constructor calls
  let ratelimitCtorCalls: unknown[];
  let redisCtorCalls: unknown[];
  let fixedWindowCalls: unknown[];

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://test.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");

    mockLimit = vi.fn();
    ratelimitCtorCalls = [];
    redisCtorCalls = [];
    fixedWindowCalls = [];

    origRequire = Module.prototype.require;

    Module.prototype.require = function (id: string) {
      if (id === "@upstash/ratelimit") {
        class FakeRatelimit {
          limit: typeof mockLimit;
          constructor(opts: unknown) {
            ratelimitCtorCalls.push(opts);
            this.limit = mockLimit;
          }
          static fixedWindow(...args: unknown[]) {
            fixedWindowCalls.push(args);
            return "fixed-window-config";
          }
        }
        return { Ratelimit: FakeRatelimit };
      }
      if (id === "@upstash/redis") {
        class FakeRedis {
          constructor(opts: unknown) {
            redisCtorCalls.push(opts);
          }
        }
        return { Redis: FakeRedis };
      }
      return origRequire.call(this, id);
    };
  });

  afterEach(() => {
    Module.prototype.require = origRequire;
    vi.unstubAllGlobals();
    vi.resetModules();
    vi.restoreAllMocks();
  });

  function createMockRequest(headers: Record<string, string> = {}) {
    return {
      headers: {
        get: (key: string) => headers[key] ?? null,
      },
    } as unknown as import("next/server").NextRequest;
  }

  it("allows request when Upstash says success", async () => {
    mockLimit.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60000,
    });

    const { rateLimit } = await import("../lib/rateLimiter");
    const check = rateLimit({ windowMs: 60_000, max: 10 });
    const req = createMockRequest({ "x-forwarded-for": "1.2.3.4" });

    const result = await check(req);
    expect(result).toBeNull();
    expect(mockLimit).toHaveBeenCalledWith("1.2.3.4");
  });

  it("returns 429 when Upstash says rate limited", async () => {
    const now = Date.now();
    mockLimit.mockResolvedValue({
      success: false,
      remaining: 0,
      reset: now + 30000,
    });

    const { rateLimit } = await import("../lib/rateLimiter");
    const check = rateLimit({ windowMs: 60_000, max: 10 });
    const req = createMockRequest({ "x-forwarded-for": "5.6.7.8" });

    const result = await check(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(429);
    expect(result!.headers.get("X-RateLimit-Limit")).toBe("10");
    expect(result!.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(result!.headers.get("Retry-After")).toBeTruthy();
  });

  it("reuses cached limiter on subsequent calls", async () => {
    mockLimit.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60000,
    });

    const { rateLimit } = await import("../lib/rateLimiter");
    const check = rateLimit({ windowMs: 60_000, max: 10 });
    const req = createMockRequest({ "x-forwarded-for": "cache-test" });

    // First call creates the limiter
    await check(req);
    // Second call should reuse cached limiter (hits line 29)
    await check(req);

    // Redis should only be instantiated once
    expect(redisCtorCalls).toHaveLength(1);
    expect(ratelimitCtorCalls).toHaveLength(1);
    // But limit should be called twice
    expect(mockLimit).toHaveBeenCalledTimes(2);
  });

  it("creates Redis and Ratelimit with correct config", async () => {
    mockLimit.mockResolvedValue({
      success: true,
      remaining: 5,
      reset: Date.now() + 60000,
    });

    const { rateLimit } = await import("../lib/rateLimiter");
    const check = rateLimit({ windowMs: 10_000, max: 5 });
    const req = createMockRequest({ "x-forwarded-for": "10.0.0.1" });
    await check(req);

    expect(redisCtorCalls).toHaveLength(1);
    expect(redisCtorCalls[0]).toEqual({
      url: "https://test.upstash.io",
      token: "test-token",
    });

    expect(fixedWindowCalls).toHaveLength(1);
    expect(fixedWindowCalls[0]).toEqual([5, "10 s"]);

    expect(ratelimitCtorCalls).toHaveLength(1);
    expect(ratelimitCtorCalls[0]).toEqual(
      expect.objectContaining({
        limiter: "fixed-window-config",
        analytics: false,
        prefix: "ratelimit",
      })
    );
  });
});
