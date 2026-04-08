import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "@/features/rate-limit";

const apiLimiter = rateLimit({ windowMs: 60_000, max: 60 });

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit API routes
  if (pathname.startsWith("/api/")) {
    const blocked = await apiLimiter(request);
    if (blocked) return blocked;
  }

  // Dashboard auth guard — skip auth endpoints themselves
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw\\.js|serwist-worker.*\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
