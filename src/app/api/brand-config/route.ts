import prisma from "@/lib/prisma";
import { withUser, json } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const config = await prisma.brandConfig.findUnique({ where: { userId: ctx.user.id } });
  return json(config ?? null);
}

export async function PUT(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;

  const b = await req.json().catch(() => ({}));
  const data = {
    ...(b.brandName !== undefined && { brandName: String(b.brandName) }),
    ...(b.industry !== undefined && { industry: String(b.industry) }),
    ...(b.country !== undefined && { country: String(b.country) }),
    ...(b.website !== undefined && { website: String(b.website) }),
    ...(b.objectives !== undefined && {
      objectives: Array.isArray(b.objectives) ? b.objectives.map(String) : [],
    }),
    ...(b.sponsorshipName !== undefined && { sponsorshipName: String(b.sponsorshipName) }),
    ...(b.sponsorshipType !== undefined && { sponsorshipType: String(b.sponsorshipType) }),
    ...(b.startDate !== undefined && { startDate: String(b.startDate) }),
    ...(b.endDate !== undefined && { endDate: String(b.endDate) }),
    ...(b.budget !== undefined && { budget: String(b.budget) }),
    ...(b.territory !== undefined && { territory: String(b.territory) }),
    ...(b.sports !== undefined && { sports: Array.isArray(b.sports) ? b.sports.map(String) : [] }),
    ...(b.dataSources !== undefined && {
      dataSources: Array.isArray(b.dataSources) ? b.dataSources.map(String) : [],
    }),
    ...(b.kpis !== undefined && { kpis: b.kpis }),
  };

  const config = await prisma.brandConfig.upsert({
    where: { userId: ctx.user.id },
    create: { ...data, userId: ctx.user.id },
    update: data,
  });
  return json(config);
}
