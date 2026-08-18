import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireClubWriter, enumOr, num, date, str } from "@/lib/server-data";
import { recomputeClubScore } from "@/lib/scoring-server";

const CATEGORIES = ["huella_hidrica", "huella_carbono", "gestion_residuos", "educacion", "inclusion", "equidad_genero"] as const;
const STATUSES = ["planning", "in_progress", "completed", "paused"] as const;

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (!ctx.user.clubId) return json([]);
  const projects = await prisma.eSGProject.findMany({ where: { clubId: ctx.user.clubId }, orderBy: { createdAt: "asc" } });
  return json(projects);
}

export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const clubId = ctx.user.clubId!;

  const b = await req.json().catch(() => ({}));
  const category = enumOr(b.category, CATEGORIES);
  if (!str(b.title).trim() || !category) return badRequest("Título y categoría válidos son obligatorios");
  const startDate = date(b.startDate) ?? new Date();
  const endDate = date(b.endDate) ?? new Date(startDate.getTime() + 180 * 86400000);

  const project = await prisma.eSGProject.create({
    data: {
      title: str(b.title, 200).trim(), category,
      status: enumOr(b.status, STATUSES, "planning")!,
      progress: num(b.progress, { min: 0, max: 100 }) ?? 0,
      budget: num(b.budget, { min: 0 }) ?? 0,
      spent: num(b.spent, { min: 0 }) ?? 0,
      startDate, endDate,
      responsible: str(b.responsible, 120) || "Por asignar",
      description: str(b.description, 4000),
      milestones: Array.isArray(b.milestones) ? b.milestones : [],
      kpis: Array.isArray(b.kpis) ? b.kpis : [],
      clubId,
    },
  });
  await recomputeClubScore(clubId);
  return json(project, { status: 201 });
}
