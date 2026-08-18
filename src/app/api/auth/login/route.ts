import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createSession, getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }

  await createSession(user.id, user.role);
  const me = await getCurrentUser();

  // Brands without a saved config still need onboarding.
  let needsOnboarding = false;
  if (user.role === "brand") {
    const cfg = await prisma.brandConfig.findUnique({ where: { userId: user.id } });
    needsOnboarding = !cfg;
  }

  return NextResponse.json({ user: me, needsOnboarding });
}
