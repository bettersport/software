import prisma from "@/lib/prisma";
import { withUser, json, requireRole, catalogFilter } from "@/lib/server-data";
import { getBrandLicenseReport } from "@/lib/licenses";

const BRAND_ROLES = ["brand", "admin"] as const;

/** GET: licencias de la marca, su uso y el impacto del portafolio patrocinado. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireRole(ctx.user, BRAND_ROLES);
  if (denied) return denied;

  const [report, orgs] = await Promise.all([
    getBrandLicenseReport(ctx.user.id),
    // Organizaciones a las que se puede entregar una licencia.
    prisma.club.findMany({
      where: catalogFilter(ctx.user),
      select: { id: true, name: true, orgType: true, sport: true, flag: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return json({ ...report, organizations: orgs });
}
