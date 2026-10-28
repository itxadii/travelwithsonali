import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("admin_session")?.value;

    // The login page checks the session itself: a stale cookie must not bounce it back to /admin
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /portal routes
  if (pathname.startsWith("/portal")) {
    const customerToken = request.cookies.get("customer_session")?.value;

    if (
      pathname === "/portal/login" ||
      pathname === "/portal/signup" ||
      pathname === "/portal/forgot-password" ||
      pathname === "/portal/reset-password" ||
      pathname === "/portal/verify-email"
    ) {
      return NextResponse.next();
    }

    if (!customerToken) {
      const loginUrl = new URL("/portal/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
