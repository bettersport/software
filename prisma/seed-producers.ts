/**
 * Catálogo inicial de productoras — FICHAS DE MUESTRA.
 *
 * No corresponden a empresas reales: existen para que el motor de match tenga
 * contra qué evaluar y el flujo se pueda demostrar. Van con `demo: true`, así
 * que solo las ven las cuentas demo; una marca real nunca recibe estas
 * recomendaciones (ver catalogFilter en los endpoints).
 *
 * Para cargar el catálogo real de productoras nacionales, reemplaza esta lista
 * y vuelve a correr el script: los `demo` quedan en false y pasan a verse en
 * todas las cuentas.
 *
 * Uso: npm run db:seed:producers
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

type Seed = {
  id: string;
  name: string;
  initials: string;
  color: string;
  description: string;
  regions: string[];
  specialties: string[];
  capabilities: string[];
  certifications: string[];
  maxCapacity: number;
  eventsProduced: number;
  reportsOnPlatform: boolean;
};

const producers: Seed[] = [
  {
    id: "prod-muestra-altura",
    name: "Altura Eventos (muestra)",
    initials: "AE",
    color: "#22d3ee",
    description: "Ficha de muestra. Productora de corridas y maratones urbanas con protocolo de cero residuos y medición de huella de carbono por evento.",
    regions: ["Metropolitana", "Valparaíso", "O'Higgins"],
    specialties: ["Corrida", "Maratón", "Trail"],
    capabilities: ["cero_residuos", "carbono_neutral", "certificacion_oficial", "reporte_bettersport", "proveedores_locales"],
    certifications: ["ISO 20121", "HuellaChile"],
    maxCapacity: 8000,
    eventsProduced: 64,
    reportsOnPlatform: true,
  },
  {
    id: "prod-muestra-austral",
    name: "Austral Sport Lab (muestra)",
    initials: "AS",
    color: "#34d399",
    description: "Ficha de muestra. Especialista en trail y eventos de montaña en el sur, con logística de bajo impacto y gestión hídrica en ruta.",
    regions: ["Los Lagos", "Los Ríos", "La Araucanía", "Aysén"],
    specialties: ["Trail", "Corrida", "Clínica deportiva"],
    capabilities: ["cero_residuos", "huella_hidrica", "proveedores_locales", "movilidad"],
    certifications: ["HuellaChile"],
    maxCapacity: 2500,
    eventsProduced: 38,
    reportsOnPlatform: false,
  },
  {
    id: "prod-muestra-circular",
    name: "Circular Producciones (muestra)",
    initials: "CP",
    color: "#a78bfa",
    description: "Ficha de muestra. Torneos y campeonatos con economía circular: reutilización de montaje, energía renovable y compensación de emisiones.",
    regions: ["Nacional"],
    specialties: ["Torneo", "Campeonato", "Copa", "Evento corporativo"],
    capabilities: ["cero_residuos", "carbono_neutral", "energia_renovable", "certificacion_oficial", "reporte_bettersport"],
    certifications: ["ISO 20121", "Empresa B"],
    maxCapacity: 15000,
    eventsProduced: 120,
    reportsOnPlatform: true,
  },
  {
    id: "prod-muestra-inclusiva",
    name: "Inclusiva Eventos (muestra)",
    initials: "IE",
    color: "#60a5fa",
    description: "Ficha de muestra. Producción con foco en accesibilidad universal y equidad de género, para eventos deportivos inclusivos.",
    regions: ["Metropolitana", "Biobío", "Maule"],
    specialties: ["Corrida", "Torneo", "Exhibición", "Clínica deportiva"],
    capabilities: ["inclusion", "equidad_genero", "cero_residuos", "proveedores_locales", "reporte_bettersport"],
    certifications: ["Sello Inclusivo"],
    maxCapacity: 4000,
    eventsProduced: 45,
    reportsOnPlatform: true,
  },
  {
    id: "prod-muestra-norte",
    name: "Norte Grande Deportes (muestra)",
    initials: "NG",
    color: "#fbbf24",
    description: "Ficha de muestra. Eventos deportivos en el norte con energía solar en faena y gestión de agua en zonas áridas.",
    regions: ["Antofagasta", "Atacama", "Tarapacá", "Arica y Parinacota", "Coquimbo"],
    specialties: ["Corrida", "Trail", "Torneo"],
    capabilities: ["energia_renovable", "huella_hidrica", "cero_residuos"],
    certifications: [],
    maxCapacity: 3000,
    eventsProduced: 27,
    reportsOnPlatform: false,
  },
  {
    id: "prod-muestra-metropolitana",
    name: "Metropolitana Live (muestra)",
    initials: "ML",
    color: "#f87171",
    description: "Ficha de muestra. Gran formato urbano: cierres de calle, cronometraje y movilidad sostenible para públicos masivos.",
    regions: ["Metropolitana", "Valparaíso"],
    specialties: ["Maratón", "Corrida", "Evento corporativo", "Exhibición"],
    capabilities: ["movilidad", "cero_residuos", "certificacion_oficial"],
    certifications: ["ISO 20121"],
    maxCapacity: 25000,
    eventsProduced: 180,
    reportsOnPlatform: false,
  },
];

async function main() {
  for (const p of producers) {
    const { id, ...rest } = p;
    const data = { ...rest, country: "Chile", flag: "🇨🇱", website: null, verified: false, demo: true };
    await prisma.producer.upsert({ where: { id }, update: data, create: { id, ...data } });
  }
  console.log(`✔ ${producers.length} fichas de muestra de productoras cargadas (demo: true)`);
  console.log("  Reemplaza la lista por el catálogo real y vuelve a correr el script.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
