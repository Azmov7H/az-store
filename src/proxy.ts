import { NextResponse, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { globalRateLimiter } from "@/lib/rate-limit";
import { authUtils } from "@/lib/auth";

// Middleware i18next
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. API Rate Limiting
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const isAllowed = globalRateLimiter.check(ip);

    if (!isAllowed) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Too many requests" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 2. Dashboard Protection (JWT-based)
  // Check for dashboard in path (handles /dashboard and /en/dashboard, /ar/dashboard)
  if (pathname.includes("/dashboard")) {
    const token = request.cookies.get("admin_token")?.value || "";

    if (!token || !authUtils.verifyJWT(token)) {
      const url = request.nextUrl.clone();
      // Preserve locale in redirect
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || "en";
      url.pathname = `/${locale}/auth/login`;
      return NextResponse.redirect(url);
    }

    // Token is valid, continue to i18n middleware
  }

  // 3. i18n Middleware (for non-API routes)
  if (!pathname.startsWith("/api")) {
    const response = intlMiddleware(request);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/api/:path*"
  ],
};
