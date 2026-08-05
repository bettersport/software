import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";
import type { ESGCategory, ProjectStatus } from "@/lib/types";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (!ctx.user.clubId) return json([]);
  const projects = await prisma.eSGProject.findMany({
    where: { clubId: ctx.user.clubId },
    orderBy: { createdAt: "asc" },
  });
  return json(projects);
}

export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (!ctx.user.clubId) return badRequest("La cuenta no tiene un club asociado");

  const b = await req.json().catch(() => ({}));
  if (!b.title || !b.category) return badRequest("Título y categoría son obligatorios");

  const project = await prisma.eSGProject.create({
    data: {
      title: String(b.title),
      category: b.category as ESGCategory,
      status: (b.status ?? "planning") as ProjectStatus,
      progress: Number(b.progress ?? 0),
      budget: Number(b.budget ?? 0),
      spent: Number(b.spent ?? 0),
      startDate: b.startDate ? new Date(b.startDate) : new Date(),
      endDate: b.endDate ? new Date(b.endDate) : new Date(),
      responsible: String(b.responsible ?? "Por asignar"),
      description: String(b.description ?? ""),
      milestones: b.milestones ?? [],
      kpis: b.kpis ?? [],
      clubId: ctx.user.clubId,
    },
  });
  return json(project, { status: 201 });
}
