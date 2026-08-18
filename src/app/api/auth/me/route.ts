import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { str } from "@/lib/server-data";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

/** PATCH: actualizar el perfil propio (nunca role, demo, clubId, email). */
export async function PATCH(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (b.name !== undefined && str(b.name).trim()) data.name = str(b.name, 120).trim();
  if (b.avatar !== undefined) data.avatar = b.avatar ? str(b.avatar, 2000) : null;
  if (b.country !== undefined) data.country = b.country ? str(b.country, 80) : null;
  if (b.sport !== undefined) data.sport = b.sport ? str(b.sport, 80) : null;
  if (b.org !== undefined && (me.role === "brand" || me.role === "solucion")) data.org = b.org ? str(b.org, 160) : null;
  if (b.notificationPrefs !== undefined && typeof b.notificationPrefs === "object") data.notificationPrefs = b.notificationPrefs;
  await prisma.user.update({ where: { id: me.id }, data });
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
