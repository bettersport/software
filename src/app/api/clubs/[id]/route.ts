import prisma from "@/lib/prisma";
import { withUser, json, notFound, forbidden, str, num } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const club = await prisma.club.findUnique({ where: { id } });
  if (!club) return notFound();
  // Real accounts can only read real clubs — plus their own, always.
  const visible = ctx.user.demo || !club.demo || ctx.user.clubId === club.id;
  if (!visible) return notFound();
  // No exponer config interna de Fan Zone salvo al propio club/admin.
  const own = ctx.user.clubId === club.id || ctx.user.role === "admin";
  const { fanActions, fanRewards, ...pub } = club;
  return json(own ? club : { ...pub, fanActions: undefined, fanRewards: undefined, _fa: fanActions ? true : false, _fr: fanRewards ? true : false });
}

/** PATCH: perfil del club (solo su propio club, roles de gestión). Nunca puntajes/ranking. */
export async function PATCH(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const isOwn = ctx.user.clubId === id && ["club", "manager"].includes(ctx.user.role);
  if (!isOwn && ctx.user.role !== "admin") return forbidden();
  const club = await prisma.club.findUnique({ where: { id } });
  if (!club) return notFound();
  const b = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (b.name !== undefined && str(b.name).trim()) data.name = str(b.name, 160).trim();
  if (b.description !== undefined) data.description = str(b.description, 4000) || null;
  if (b.sport !== undefined) data.sport = str(b.sport, 80) || club.sport;
  if (b.country !== undefined) data.country = str(b.country, 80) || club.country;
  if (b.region !== undefined) data.region = str(b.region, 120) || null;
  if (b.website !== undefined) data.website = str(b.website, 300) || null;
  if (b.flag !== undefined) data.flag = str(b.flag, 8);
  if (b.logo !== undefined) data.logo = b.logo ? str(b.logo, 500000) : null;
  if (b.banner !== undefined) data.banner = b.banner ? str(b.banner, 500000) : null;
  if (b.members !== undefined) data.members = num(b.members, { min: 0 }) ?? club.members;
  if (b.founded !== undefined) data.founded = num(b.founded, { min: 1800, max: 2100 }) ?? club.founded;
  const updated = await prisma.club.update({ where: { id }, data });
  return json(updated);
}
