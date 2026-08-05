import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const projects = await prisma.brandProject.findMany({
    where: { ownerId: ctx.user.id },
    orderBy: { createdAt: "desc" },
  });
  return json(projects);
}

export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;

  const b = await req.json().catch(() => ({}));
  if (!b.brand || !b.project || !b.category)
    return badRequest("Marca, proyecto y categoría son obligatorios");

  const project = await prisma.brandProject.create({
    data: {
      brand: String(b.brand),
      project: String(b.project),
      category: String(b.category),
      investment: Number(b.investment ?? 0),
      reach: Number(b.reach ?? 0),
      esgScore: Number(b.esgScore ?? 0),
      progress: Number(b.progress ?? 0),
      description: String(b.description ?? ""),
      status: String(b.status ?? "Propuesta"),
      ownerId: ctx.user.id,
    },
  });
  return json(project, { status: 201 });
}
