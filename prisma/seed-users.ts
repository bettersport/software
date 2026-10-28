/**
 * Carga (o completa) las cuentas demo del login sin tocar el resto del catálogo.
 *
 * A diferencia de `db:seed`, no crea eventos, proyectos ni clubes: solo hace
 * upsert de `mockUsers`, así que sirve para agregar un perfil demo nuevo en
 * producción sin resucitar registros que alguien borró a propósito.
 *
 * Uso: npm run db:seed:users
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { mockUsers } from "../src/lib/data";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const DEMO_PASSWORD = "demo1234";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const clubIds = new Set((await prisma.club.findMany({ select: { id: true } })).map((c) => c.id));
  let created = 0;
  for (const u of mockUsers) {
    const existing = await prisma.user.findUnique({ where: { id: u.id }, select: { id: true } });
    if (existing) continue;
    await prisma.user.create({
      data: {
        id: u.id, name: u.name, email: u.email, passwordHash,
        role: u.role, avatar: u.avatar, country: u.country,
        org: u.role === "club" || u.role === "hincha" ? null : u.club,
        clubId: u.clubId && clubIds.has(u.clubId) ? u.clubId : null,
        demo: true,
      },
    });
    created++;
    console.log(`  + ${u.role.padEnd(11)} ${u.email}`);
  }
  console.log(`✔ ${created} cuentas demo nuevas (${mockUsers.length - created} ya existían)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
