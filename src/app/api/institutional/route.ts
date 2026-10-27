import { withUser, json, requireRole } from "@/lib/server-data";
import { getInstitutionalOverview } from "@/lib/institutional";

/** Roles con acceso al panel de organismos rectores. */
const INSTITUTIONAL_ROLES = ["institucion", "admin"] as const;

/** GET: agregados del deporte nacional para MINDEP y Comité Olímpico. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireRole(ctx.user, INSTITUTIONAL_ROLES);
  if (denied) return denied;

  return json(await getInstitutionalOverview());
}
