import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get("token")

  if (request.nextUrl.pathname.startsWith("/admin_dashboard") && token?.role !== 'admin') {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (!token && request.nextUrl.pathname.startsWith("/users_dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
}

