/**
 * Seeds the production database with the catalog data and demo accounts.
 * Run with: npm run db:seed
 *
 * Demo accounts all share the password below so the /login showcase keeps working.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  mockUsers,
  mockClubs,
  mockEvents,
  mockESGProjects,
  mockDocuments,
  mockSolutionProviders,
  mockFans,
  mockNotifications,
} from "../src/lib/data";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const DEMO_PASSWORD = "demo1234";

// Club-level ESG KPIs seeded for the demo club.
const demoKpis = [
  { name: "Emisiones CO2", category: "Ambiental", current: 24, target: 18, unit: "ton/año", trend: "down", color: "#10B981", icon: "🌱", description: "Reducción de emisiones de carbono" },
  { name: "Energía renovable", category: "Ambiental", current: 65, target: 100, unit: "%", trend: "up", color: "#06B6D4", icon: "⚡", description: "% de energía de fuentes renovables" },
  { name: "Consumo agua", category: "Ambiental", current: 1200, target: 800, unit: "m³/mes", trend: "down", color: "#F59E0B", icon: "💧", description: "Consumo mensual de agua" },
  { name: "Personas incluidas", category: "Social", current: 160, target: 200, unit: "personas", trend: "up", color: "#8B5CF6", icon: "🤝", description: "Personas en programas de inclusión" },
  { name: "Tasa retención", category: "Social", current: 82, target: 80, unit: "%", trend: "up", color: "#EC4899", icon: "👥", description: "Retención de participantes" },
  { name: "Puntaje gobernanza", category: "Gobernanza", current: 83, target: 90, unit: "pts", trend: "up", color: "#3B82F6", icon: "⚖️", description: "Puntaje de buenas prácticas" },
];

const demoBrandProjects = [
  { brand: "GreenSport SA", project: "Reforestación Campus Deportivo", status: "Activo", investment: 48000, reach: 12500, esgScore: 91, category: "Ambiental", progress: 72, description: "Reforestación de 12 hectáreas alrededor del campus deportivo." },
  { brand: "EcoTech Iberia", project: "Paneles Solares Estadio Norte", status: "Activo", investment: 75000, reach: 8200, esgScore: 88, category: "Ambiental", progress: 45, description: "Instalación de 240 paneles solares en la cubierta del estadio." },
  { brand: "Sustainable Pro", project: "Programa de Reciclaje", status: "Evaluación", investment: 22000, reach: 5400, esgScore: 76, category: "Social", progress: 0, description: "Estaciones de reciclaje inteligentes en todas las instalaciones." },
];

const demoSponsorLeads = [
  { brand: "Banco Estado", category: "Finanzas", amount: 45000, stage: "Cierre", color: "#1E40AF" },
  { brand: "Entel", category: "Telecom", amount: 38000, stage: "Negociación", color: "#0EA5E9" },
  { brand: "Falabella", category: "Retail", amount: 55000, stage: "Propuesta", color: "#10B981" },
  { brand: "CCU", category: "Bebidas", amount: 28000, stage: "Primer Contacto", color: "#F59E0B" },
];

async function main() {
  console.log("Seeding database…");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ── Clubs ──
  for (const c of mockClubs) {
    await prisma.club.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id, name: c.name, sport: c.sport, country: c.country, flag: c.flag,
        logo: c.logo, esgScore: c.esgScore, ranking: c.ranking,
        environmental: c.environmental, social: c.social, governance: c.governance,
        transparency: c.transparency, members: c.members, founded: c.founded,
        description: c.description, demo: true,
      },
    });
  }
  const clubIds = new Set(mockClubs.map((c) => c.id));
  console.log(`  ${mockClubs.length} clubs`);

  // ── Demo users (hashed password) ──
  for (const u of mockUsers) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id, name: u.name, email: u.email, passwordHash,
        role: u.role, avatar: u.avatar, country: u.country,
        org: u.role === "club" || u.role === "hincha" ? null : u.club,
        clubId: u.clubId && clubIds.has(u.clubId) ? u.clubId : null,
        demo: true,
      },
    });
  }
  console.log(`  ${mockUsers.length} demo users (password: ${DEMO_PASSWORD})`);

  const demoClubId = "c4"; // Rugby Verde — Felipe's club

  // ── ESG projects (demo club) ──
  for (const p of mockESGProjects) {
    await prisma.eSGProject.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id, title: p.title, category: p.category, status: p.status,
        progress: p.progress, budget: p.budget, spent: p.spent,
        startDate: new Date(p.startDate), endDate: new Date(p.endDate),
        responsible: p.responsible, description: p.description,
        milestones: p.milestones as object, kpis: p.kpis as object,
        clubId: demoClubId,
      },
    });
  }
  console.log(`  ${mockESGProjects.length} ESG projects`);

  // ── Club KPIs (demo club) ──
  const existingKpis = await prisma.kpi.count({ where: { clubId: demoClubId } });
  if (existingKpis === 0) {
    await prisma.kpi.createMany({ data: demoKpis.map((k) => ({ ...k, clubId: demoClubId })) });
  }
  console.log(`  ${demoKpis.length} club KPIs`);

  // ── Documents (demo club) ──
  const existingDocs = await prisma.document.count({ where: { clubId: demoClubId } });
  if (existingDocs === 0) {
    await prisma.document.createMany({
      data: mockDocuments.map((d) => ({
        name: d.name, type: d.type, category: d.category, size: d.size,
        version: d.version, uploadedBy: d.uploadedBy,
        uploadedAt: new Date(d.uploadedAt), clubId: demoClubId,
      })),
    });
  }
  console.log(`  ${mockDocuments.length} documents`);

  // ── Marketplace events ──
  for (const e of mockEvents) {
    await prisma.event.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id: e.id, title: e.title, clubName: e.clubName, country: e.country,
        flag: e.flag, sport: e.sport, category: e.category, image: e.image,
        description: e.description, sustainableImpact: e.sustainableImpact,
        budget: e.budget, funded: e.funded, daysLeft: e.daysLeft,
        sponsoredBy: e.sponsoredBy ?? [], mediaPartner: e.mediaPartner,
        sealEsg: e.sealEsg ?? false, featured: e.featured ?? false, demo: true,
        audience: e.audience, status: e.status,
        clubId: e.clubId && clubIds.has(e.clubId) ? e.clubId : null,
      },
    });
  }
  console.log(`  ${mockEvents.length} marketplace events`);

  // ── Solution providers ──
  for (const s of mockSolutionProviders) {
    await prisma.solutionProvider.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id, name: s.name, logo: s.logo, initials: s.initials, color: s.color,
        category: s.category, country: s.country, flag: s.flag, description: s.description,
        services: s.services, projectsCount: s.projectsCount,
        associatedBrand: s.associatedBrand, associatedBrandLogo: s.associatedBrandLogo,
        associatedClub: s.associatedClub, associatedClubLogo: s.associatedClubLogo,
        stars: s.stars, verified: s.verified, featured: s.featured ?? false, tags: s.tags ?? [], demo: true,
      },
    });
  }
  console.log(`  ${mockSolutionProviders.length} solution providers`);

  // ── Demo brand config + projects (brand user u3) ──
  const brandUser = mockUsers.find((u) => u.role === "brand");
  if (brandUser) {
    await prisma.brandConfig.upsert({
      where: { userId: brandUser.id },
      update: {},
      create: {
        userId: brandUser.id, brandName: brandUser.club ?? "GreenSport SA",
        industry: "Deporte sostenible", country: brandUser.country ?? "Argentina",
        objectives: ["reputacion_esg", "engagement_digital"], sports: ["Fútbol", "Rugby"],
        dataSources: ["redes_sociales", "web_analytics"], kpis: [] as object,
      },
    });
    const hasBrandProjects = await prisma.brandProject.count({ where: { ownerId: brandUser.id } });
    if (hasBrandProjects === 0) {
      await prisma.brandProject.createMany({
        data: demoBrandProjects.map((p) => ({ ...p, ownerId: brandUser.id })),
      });
    }
  }
  console.log(`  demo brand config + projects`);

  // ── Demo sponsor leads (club user u2) ──
  const clubUser = mockUsers.find((u) => u.role === "club");
  if (clubUser) {
    const hasLeads = await prisma.sponsorLead.count({ where: { ownerId: clubUser.id } });
    if (hasLeads === 0) {
      await prisma.sponsorLead.createMany({
        data: demoSponsorLeads.map((l) => ({ ...l, ownerId: clubUser.id })),
      });
    }
  }
  console.log(`  demo sponsor leads`);

  // ── Demo fan profile (hincha user u7) ──
  const fanUser = mockUsers.find((u) => u.role === "hincha");
  const demoFan = mockFans.find((f) => f.id === "f-hincha");
  if (fanUser && demoFan) {
    await prisma.fanProfile.upsert({
      where: { userId: fanUser.id },
      update: {},
      create: {
        userId: fanUser.id, clubId: fanUser.clubId && clubIds.has(fanUser.clubId) ? fanUser.clubId : null,
        points: demoFan.points, tier: demoFan.tier, badgesEarned: demoFan.badgesEarned,
        completedActionIds: demoFan.completedActionIds, claimedRewardIds: demoFan.claimedRewardIds,
      },
    });
  }
  console.log(`  demo fan profile`);

  // ── Notifications for demo users ──
  for (const u of mockUsers) {
    const has = await prisma.notification.count({ where: { userId: u.id } });
    if (has === 0) {
      await prisma.notification.createMany({
        data: mockNotifications.map((n) => ({
          type: n.type, title: n.title, message: n.message, read: n.read, userId: u.id,
        })),
      });
    }
  }
  console.log(`  notifications`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
