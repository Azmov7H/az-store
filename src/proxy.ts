// src/proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Middleware i18next
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // تنفيذ الـ i18next أولًا
  const intlResponse = intlMiddleware(request);
  if (intlResponse) return intlResponse;

  // حماية Dashboard
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("dashboard-auth")?.value || "";
    if (token !== process.env.DASHBOARD_SECRET) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)", // i18next
    "/dashboard/:path*",                        // حماية Dashboard
  ],
};
