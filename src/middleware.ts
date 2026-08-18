import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "bettersport_session";

// Public paths that never require a session.
const PUBLIC_PREFIXES = ["/login", "/register", "/home", "/api/auth", "/api/public"];
const PUBLIC_EXACT = new Set(["/"]);

function isPublic(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function sessionRole(req: NextRequest): Promise<string | null | false> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return (payload.role as string) ?? null;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const role = await sessionRole(req);
  if (role === false) {
    // API routes get a 401; pages redirect to login.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  // Área de administración: solo admin (el rol viaja en el JWT; los endpoints /api/admin re-verifican en DB).
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (role !== "admin") {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
