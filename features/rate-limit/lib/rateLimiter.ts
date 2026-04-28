import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

// --- In-memory fallback store ---
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function getIdentifier(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"
  );
}

// --- Upstash Redis rate limiter (lazy-initialized) ---
const isRedisEnabled =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

let upstashLimiter: {
  limit: (identifier: string) => Promise<{ success: boolean; remaining: number; reset: number }>;
} | null = null;

function getUpstashLimiter(config: RateLimitConfig) {
  if (upstashLimiter) return upstashLimiter;

  // Dynamic import is avoided; these are top-level requires guarded by env check
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Ratelimit } = require("@upstash/ratelimit") as typeof import("@upstash/ratelimit");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require("@upstash/redis") as typeof import("@upstash/redis");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const windowSec = Math.max(1, Math.ceil(config.windowMs / 1000));

  upstashLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(config.max, `${windowSec} s`),
    analytics: false,
    prefix: "ratelimit",
  });

  return upstashLimiter;
}

// --- In-memory rate limit check ---
function checkMemory(id: string, config: RateLimitConfig): NextResponse | null {
  const now = Date.now();
  const entry = memoryStore.get(id);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(id, { count: 1, resetAt: now + config.windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > config.max) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
          "X-RateLimit-Limit": String(config.max),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}

// --- Public API ---
export function rateLimit(config: RateLimitConfig = { windowMs: 60_000, max: 60 }) {
  return function check(request: NextRequest): NextResponse | null | Promise<NextResponse | null> {
    const id = getIdentifier(request);

    if (!isRedisEnabled) {
      return checkMemory(id, config);
    }

    // Upstash path — returns a Promise
    const limiter = getUpstashLimiter(config);
    return limiter.limit(id).then(({ success, remaining, reset }) => {
      if (success) return null;

      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(config.max),
            "X-RateLimit-Remaining": String(remaining),
          },
        }
      );
    });
  };
}

// Cleanup stale in-memory entries
export function cleanupStaleEntries(): void {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (now > entry.resetAt) memoryStore.delete(key);
  }
}

// Periodically run cleanup
if (typeof globalThis !== "undefined" && !isRedisEnabled) {
  setInterval(cleanupStaleEntries, 30_000).unref?.();
}
