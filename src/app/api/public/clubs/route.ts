import prisma from "@/lib/prisma";
import { json } from "@/lib/server-data";

/** Public list of clubs (id, name, sport, flag) for the registration club picker. */
export async function GET() {
  const clubs = await prisma.club.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, sport: true, flag: true },
  });
  return json(clubs);
}
