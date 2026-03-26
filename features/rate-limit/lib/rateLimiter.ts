import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const store = new Map<string, { count: number; resetAt: number }>();

function getIdentifier(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"
  );
}

export function rateLimit(config: RateLimitConfig = { windowMs: 60_000, max: 60 }) {
  return function check(request: NextRequest): NextResponse | null {
    const id = getIdentifier(request);
    const now = Date.now();
    const entry = store.get(id);

    if (!entry || now > entry.resetAt) {
      store.set(id, { count: 1, resetAt: now + config.windowMs });
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
  };
}

// Cleanup stale entries periodically
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 60_000).unref?.();
}
