import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createSession, getCurrentUser } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

const PUBLIC_ROLES: UserRole[] = ["club", "brand", "solucion", "hincha"];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const role = String(body.role ?? "club") as UserRole;
  const country = body.country ? String(body.country) : null;
  const sport = body.sport ? String(body.sport) : null;
  const org = body.org ? String(body.org) : null;
  const clubId = body.clubId ? String(body.clubId) : null;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nombre, email y contraseña son obligatorios" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }
  if (!PUBLIC_ROLES.includes(role)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  // Club accounts get their own (empty) Club record so relations work from day one.
  let newClubId: string | null = null;
  if (role === "club") {
    const club = await prisma.club.create({
      data: {
        name: org || name, sport: sport || "—", country: country || "—",
        flag: "", founded: new Date().getFullYear(),
      },
    });
    newClubId = club.id;
  } else if (role === "hincha" && clubId) {
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    newClubId = club ? clubId : null;
  }

  const user = await prisma.user.create({
    data: {
      name, email, passwordHash, role, country, sport,
      org: role === "brand" || role === "solucion" ? org : null,
      clubId: newClubId,
      demo: false,
    },
    include: { club: true },
  });

  await createSession(user.id);
  const me = await getCurrentUser();
  return NextResponse.json({ user: me }, { status: 201 });
}
