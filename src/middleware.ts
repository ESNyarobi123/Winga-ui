import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_DENIED = "/access-denied";
const ADMIN_LOGIN = "/admin/login";

/**
 * Role-based route protection:
 * - /client/** only for CLIENT
 * - /freelancer/** only for FREELANCER
 * - /admin/** (except /admin/login) only for ADMIN | SUPER_ADMIN
 * Role is set in cookie "winga_role" on login/register.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const roleCookie = request.cookies.get("winga_role")?.value ?? null;

  // Admin routes: only ADMIN or SUPER_ADMIN; allow /admin/login for everyone
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      return NextResponse.next();
    }
    if (roleCookie !== "ADMIN" && roleCookie !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }
    return NextResponse.next();
  }

  // Client-only routes: redirect FREELANCER (or no role) to access-denied
  if (pathname.startsWith("/client")) {
    if (roleCookie !== "CLIENT") {
      return NextResponse.redirect(new URL(ACCESS_DENIED, request.url));
    }
    return NextResponse.next();
  }

  // Freelancer-only routes: redirect CLIENT (or no role) to access-denied
  if (pathname.startsWith("/freelancer")) {
    if (roleCookie !== "FREELANCER") {
      return NextResponse.redirect(new URL(ACCESS_DENIED, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*", "/freelancer/:path*", "/admin/:path*"],
};
