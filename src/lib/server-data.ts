import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser, type SessionUser } from "./auth";

/** Resolve the authenticated user or return a 401 response to short-circuit the route. */
export async function withUser(): Promise<{ user: SessionUser } | { res: NextResponse }> {
  const user = await getCurrentUser();
  if (!user) return { res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { user };
}

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Visibility filter for the shared catalogs (clubs, events, solutions).
 * Demo accounts see the seeded showcase plus real records; real accounts
 * only ever see real data — seeded demo rows stay hidden from them.
 */
export function catalogFilter(user: SessionUser) {
  return user.demo ? {} : { demo: false };
}
