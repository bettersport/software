import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser, type SessionUser } from "./auth";
import prisma from "./prisma";

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
/** Recurso inexistente — o de otro tenant (no revelamos existencia). */
export function notFound(message = "No encontrado") {
  return NextResponse.json({ error: message }, { status: 404 });
}
export function forbidden(message = "Sin permisos para esta acción") {
  return NextResponse.json({ error: message }, { status: 403 });
}

// ── Roles ─────────────────────────────────────────────────────────────────────

/** Roles que pueden ESCRIBIR datos de un club (proyectos, KPIs, docs, estrategia, fan zone). */
export const CLUB_WRITER_ROLES = ["club", "admin", "manager"] as const;
export const ADMIN_ROLES = ["admin"] as const;

/**
 * Exige que el usuario pueda escribir en un club: rol de gestión + club asociado.
 * Un hincha vinculado a un club NO puede modificar los datos del club.
 */
export function requireClubWriter(user: SessionUser): NextResponse | null {
  if (!user.clubId) return badRequest("La cuenta no tiene un club asociado");
  if (!(CLUB_WRITER_ROLES as readonly string[]).includes(user.role)) return forbidden();
  return null;
}
export function requireRole(user: SessionUser, roles: readonly string[]): NextResponse | null {
  return roles.includes(user.role) ? null : forbidden();
}
export function requireAdmin(user: SessionUser) {
  return requireRole(user, ADMIN_ROLES);
}

// ── Visibilidad demo/real ─────────────────────────────────────────────────────

/**
 * Visibility filter for the shared catalogs (clubs, events, solutions).
 * Demo accounts see the seeded showcase plus real records; real accounts
 * only ever see real data — seeded demo rows stay hidden from them.
 */
export function catalogFilter(user: SessionUser) {
  return user.demo ? {} : { demo: false };
}

// ── Validadores de entrada (evitan que Prisma lance por datos basura) ─────────

/** Devuelve el valor si está en `allowed`, si no `fallback` (o null si no hay fallback). */
export function enumOr<T extends string>(value: unknown, allowed: readonly T[], fallback?: T): T | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : (fallback ?? null);
}
/** Número finito dentro de [min,max]; null si no es numérico. */
export function num(value: unknown, opts: { min?: number; max?: number } = {}): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const { min = -Infinity, max = Infinity } = opts;
  return Math.min(max, Math.max(min, n));
}
/** Fecha válida o null. */
export function date(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}
export const str = (v: unknown, max = 2000) => String(v ?? "").slice(0, max);
export const strArr = (v: unknown, max = 100) => (Array.isArray(v) ? v.slice(0, max).map((x) => String(x)) : []);

// ── Notificaciones ────────────────────────────────────────────────────────────

/** Crea una notificación real para un usuario (usada por los flujos de negocio). */
export async function notify(userId: string, n: { type?: "info" | "success" | "warning" | "error"; title: string; message: string }) {
  try {
    await prisma.notification.create({ data: { userId, type: n.type ?? "info", title: n.title, message: n.message } });
  } catch {
    /* las notificaciones nunca deben romper el flujo principal */
  }
}
/** Notifica a todos los usuarios gestores de un club. */
export async function notifyClub(clubId: string, n: { type?: "info" | "success" | "warning" | "error"; title: string; message: string }) {
  const users = await prisma.user.findMany({ where: { clubId, role: { in: [...CLUB_WRITER_ROLES] } }, select: { id: true } });
  await Promise.all(users.map((u) => notify(u.id, n)));
}
