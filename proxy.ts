import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Passes the request path to the server components that render it.
 *
 * A layout cannot read its own pathname — it is rendered for many of them —
 * and `app/(admin)/admin/layout.tsx` needs it for exactly one reason: the login
 * page lives inside the segment it protects, so the layout has to recognise
 * and let that one path through.
 *
 * Authentication is NOT enforced here. Proxy runs on the edge, and the session
 * lives in SQLite on the origin, so this file could only ever check that a
 * cookie is present — not that it is valid. The real check is `currentUser()`
 * in the layout, and `guard()` at the top of every server action. This is a
 * plumbing shim, not a security boundary.
 */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: "/admin/:path*",
};
