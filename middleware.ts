import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("admin_session")?.value;

    if (pathname === "/admin/login") {
      if (adminToken) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
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

    if (pathname === "/portal/login" || pathname === "/portal/signup") {
      if (customerToken) {
        return NextResponse.redirect(new URL("/portal", request.url));
      }
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
