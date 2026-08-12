import prisma from "@/lib/prisma";
import { json } from "@/lib/server-data";

/**
 * Public list of clubs for the registration club picker.
 * Only real clubs — seeded showcase clubs are never offered to new sign-ups.
 */
export async function GET() {
  const clubs = await prisma.club.findMany({
    where: { demo: false },
    orderBy: { name: "asc" },
    select: { id: true, name: true, sport: true, flag: true },
  });
  return json(clubs);
}
