import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const club = await prisma.club.findUnique({ where: { id } });
  if (!club) return badRequest("No encontrado");
  return json(club);
}
