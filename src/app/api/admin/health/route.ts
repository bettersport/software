import { withUser, json, requireAdmin } from "@/lib/server-data";
import { storageReady } from "@/lib/storage";
import prisma from "@/lib/prisma";

/** Salud del sistema (admin): DB + almacenamiento de archivos. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const d = requireAdmin(ctx.user); if (d) return d;
  const storage = await storageReady();
  let db = false;
  try { await prisma.$queryRawUnsafe("SELECT 1"); db = true; } catch {}
  return json({ db, storage, claude: !!process.env.ANTHROPIC_API_KEY });
}
