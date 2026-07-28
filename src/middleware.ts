import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Runs on the server for every matched request, before any page renders or
// any API route executes. There is nothing in the browser to bypass — if
// the cookie doesn't verify, no data or HTML ever leaves the server.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow the login page and the login API itself, or nobody could
  // ever log in.
  if (pathname === "/login" || pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isValid = await verifySessionToken(token);

  if (isValid) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Everything except Next's internal assets and favicon. Static assets
  // don't need protecting and excluding them keeps the dashboard fast.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
