import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/features/rate-limit";

const apiLimiter = rateLimit({ windowMs: 60_000, max: 60 });

export function middleware(request: NextRequest) {
  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const blocked = apiLimiter(request);
    if (blocked) return blocked;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
