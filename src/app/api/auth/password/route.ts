import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";

/** POST { currentPassword, newPassword } */
export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const current = String(b.currentPassword ?? "");
  const next = String(b.newPassword ?? "");
  if (next.length < 8) return NextResponse.json({ error: "La nueva contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { id: me.id } });
  if (!user || !(await verifyPassword(current, user.passwordHash))) {
    return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 400 });
  }
  await prisma.user.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(next) } });
  return NextResponse.json({ ok: true });
}
