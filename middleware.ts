import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Rate limit headers for API routes (informational)
  // For distributed enforcement, integrate Upstash Redis:
  // https://upstash.com/docs/oss/sdks/ts/ratelimit/overview
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set("X-RateLimit-Remaining", "99");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
