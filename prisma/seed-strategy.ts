/**
 * Tablas de configuración del Motor IA — Estrategia ESG.
 * Anexo A: Desafío → estándar GRI (+ ODS). Anexo B: Deporte → organismo global.
 * Editables en backend; este seed solo crea/actualiza los valores base.
 * Run: npm run db:seed:strategy
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type P = "ambiental" | "social" | "gobernanza";
const gri: {
  pillar: P; key: string; label: string; griStandard: string; griTitle: string;
  indicators: string[]; sdgs: string[]; metricUnit: string; metricVerb: string; sortOrder: number;
}[] = [
  // ── Ambiental ──
  { pillar: "ambiental", key: "huella_hidrica", label: "Reducción de huella hídrica", griStandard: "GRI 303", griTitle: "Agua y Efluentes", indicators: ["303-3 Extracción de agua", "303-5 Consumo de agua"], sdgs: ["ODS 6", "ODS 12"], metricUnit: "m³ de consumo de agua", metricVerb: "reducir", sortOrder: 1 },
  { pillar: "ambiental", key: "huella_carbono", label: "Reducción de huella de carbono / gestión de emisiones (alcance 1, 2 y 3)", griStandard: "GRI 305", griTitle: "Emisiones", indicators: ["305-1 Emisiones directas (alcance 1)", "305-2 Emisiones indirectas por energía (alcance 2)", "305-3 Otras emisiones indirectas (alcance 3)", "305-5 Reducción de emisiones"], sdgs: ["ODS 13", "ODS 7"], metricUnit: "tCO₂e", metricVerb: "reducir", sortOrder: 2 },
  { pillar: "ambiental", key: "residuos", label: "Gestión y reducción de residuos (economía circular en el recinto)", griStandard: "GRI 306", griTitle: "Residuos", indicators: ["306-3 Residuos generados", "306-4 Residuos no destinados a eliminación"], sdgs: ["ODS 12", "ODS 11"], metricUnit: "% de residuos valorizados", metricVerb: "aumentar", sortOrder: 3 },
  { pillar: "ambiental", key: "energia", label: "Eficiencia energética / transición a energías renovables", griStandard: "GRI 302", griTitle: "Energía", indicators: ["302-1 Consumo energético dentro de la organización", "302-4 Reducción del consumo energético"], sdgs: ["ODS 7", "ODS 13"], metricUnit: "% de energía renovable", metricVerb: "aumentar", sortOrder: 4 },
  { pillar: "ambiental", key: "biodiversidad", label: "Gestión de la biodiversidad en instalaciones deportivas", griStandard: "GRI 304", griTitle: "Biodiversidad", indicators: ["304-1 Instalaciones en áreas de alto valor para la biodiversidad", "304-2 Impactos significativos en la biodiversidad"], sdgs: ["ODS 15"], metricUnit: "hectáreas gestionadas", metricVerb: "aumentar", sortOrder: 5 },
  { pillar: "ambiental", key: "movilidad", label: "Movilidad sostenible de hinchas/staff hacia eventos", griStandard: "GRI 305", griTitle: "Emisiones (alcance 3 — desplazamientos)", indicators: ["305-3 Otras emisiones indirectas (alcance 3)"], sdgs: ["ODS 11", "ODS 13"], metricUnit: "% de asistentes en transporte sostenible", metricVerb: "aumentar", sortOrder: 6 },
  // ── Social ──
  { pillar: "social", key: "inclusion", label: "Inclusión y accesibilidad (discapacidad, deporte adaptado)", griStandard: "GRI 405 / GRI 406", griTitle: "Diversidad e Igualdad / No Discriminación", indicators: ["405-1 Diversidad en órganos de gobierno y empleados", "406-1 Casos de discriminación y acciones correctivas"], sdgs: ["ODS 10", "ODS 4"], metricUnit: "beneficiarios de programas inclusivos", metricVerb: "aumentar", sortOrder: 7 },
  { pillar: "social", key: "equidad_genero", label: "Equidad de género en la organización y en el deporte", griStandard: "GRI 405", griTitle: "Diversidad e Igualdad de Oportunidades", indicators: ["405-1 Diversidad en órganos de gobierno y empleados", "405-2 Ratio del salario base y remuneración de mujeres frente a hombres"], sdgs: ["ODS 5", "ODS 10"], metricUnit: "% de mujeres en cargos directivos", metricVerb: "aumentar", sortOrder: 8 },
  { pillar: "social", key: "seguridad_hinchas", label: "Seguridad y bienestar de hinchas/comunidad en eventos", griStandard: "GRI 416", griTitle: "Salud y Seguridad de los Clientes", indicators: ["416-1 Evaluación de impactos en salud y seguridad", "416-2 Incidentes de incumplimiento"], sdgs: ["ODS 3", "ODS 11"], metricUnit: "incidentes por evento", metricVerb: "reducir", sortOrder: 9 },
  { pillar: "social", key: "comunidad", label: "Desarrollo comunitario y responsabilidad social con el entorno", griStandard: "GRI 413", griTitle: "Comunidades Locales", indicators: ["413-1 Operaciones con participación de la comunidad local, evaluaciones de impacto y programas de desarrollo"], sdgs: ["ODS 11", "ODS 1", "ODS 17"], metricUnit: "beneficiarios de programas comunitarios", metricVerb: "aumentar", sortOrder: 10 },
  { pillar: "social", key: "laboral", label: "Condiciones laborales y bienestar de trabajadores/deportistas", griStandard: "GRI 403", griTitle: "Salud y Seguridad en el Trabajo", indicators: ["403-9 Lesiones por accidente laboral", "403-6 Fomento de la salud de los trabajadores"], sdgs: ["ODS 8", "ODS 3"], metricUnit: "tasa de lesiones laborales", metricVerb: "reducir", sortOrder: 11 },
  { pillar: "social", key: "talento_local", label: "Formación y desarrollo de talento local / canteras", griStandard: "GRI 401 / GRI 404", griTitle: "Empleo / Formación y Enseñanza", indicators: ["404-1 Media de horas de formación por empleado", "401-1 Nuevas contrataciones y rotación"], sdgs: ["ODS 4", "ODS 8"], metricUnit: "horas de formación por persona", metricVerb: "aumentar", sortOrder: 12 },
  // ── Gobernanza ──
  { pillar: "gobernanza", key: "etica", label: "Transparencia y ética institucional (código de ética, canal de denuncias)", griStandard: "GRI 205", griTitle: "Anticorrupción", indicators: ["205-1 Operaciones evaluadas para riesgos de corrupción", "205-2 Comunicación y formación sobre políticas anticorrupción", "205-3 Casos de corrupción confirmados"], sdgs: ["ODS 16"], metricUnit: "% de colaboradores capacitados en ética", metricVerb: "aumentar", sortOrder: 13 },
  { pillar: "gobernanza", key: "gobierno_corporativo", label: "Estructura de gobierno corporativo (directorio, comités, independencia)", griStandard: "GRI 2", griTitle: "Contenidos Generales (2021) — Gobernanza", indicators: ["2-9 Estructura y composición de la gobernanza", "2-10 Designación y selección del máximo órgano de gobierno", "2-12 Función del máximo órgano de gobierno en la supervisión de impactos"], sdgs: ["ODS 16"], metricUnit: "% de directores independientes", metricVerb: "aumentar", sortOrder: 14 },
  { pillar: "gobernanza", key: "riesgos", label: "Gestión de riesgos ESG y cumplimiento normativo", griStandard: "GRI 2 / GRI 206", griTitle: "Gestión de impactos / Competencia Desleal", indicators: ["2-25 Procesos para remediar impactos negativos", "2-27 Cumplimiento de la legislación y las normativas"], sdgs: ["ODS 16"], metricUnit: "riesgos ESG identificados y con plan", metricVerb: "aumentar", sortOrder: 15 },
  { pillar: "gobernanza", key: "anticorrupcion", label: "Política anticorrupción y prevención de delitos", griStandard: "GRI 205", griTitle: "Anticorrupción", indicators: ["205-1 Operaciones evaluadas para riesgos de corrupción", "205-3 Casos de corrupción confirmados"], sdgs: ["ODS 16"], metricUnit: "% de operaciones evaluadas", metricVerb: "aumentar", sortOrder: 16 },
  { pillar: "gobernanza", key: "reporting", label: "Reporting y comunicación de sostenibilidad", griStandard: "GRI 1 / GRI 2-3", griTitle: "Fundamentos / Periodo, frecuencia y punto de contacto", indicators: ["2-3 Periodo objeto del informe, frecuencia y punto de contacto", "2-14 Función del máximo órgano de gobierno en la presentación de informes"], sdgs: ["ODS 12", "ODS 16"], metricUnit: "reportes de sostenibilidad publicados", metricVerb: "aumentar", sortOrder: 17 },
  { pillar: "gobernanza", key: "datos", label: "Gobernanza de datos y protección de información de socios/hinchas", griStandard: "GRI 418", griTitle: "Privacidad del Cliente", indicators: ["418-1 Reclamaciones fundamentadas relativas a violaciones de la privacidad y pérdida de datos"], sdgs: ["ODS 16"], metricUnit: "incidentes de privacidad", metricVerb: "reducir", sortOrder: 18 },
];

const frameworks = [
  { sport: "Fútbol", organism: "FIFA", framework: "Estrategia de Sostenibilidad Climática FIFA / lineamientos ESG de FIFA y CONMEBOL", summary: "Compromiso de reducción del 50% de emisiones al 2030 y neutralidad al 2040; estándares de sostenibilidad para eventos, derechos humanos y salvaguarda." },
  { sport: "Rugby", organism: "World Rugby", framework: "Lineamientos de sostenibilidad ambiental y social de World Rugby", summary: "Marco de sostenibilidad ambiental para eventos y uniones; foco en bienestar del jugador, inclusión y reducción de huella de torneos." },
  { sport: "Multidisciplinario / Olímpico", organism: "Comité Olímpico Internacional (COI)", framework: "Estrategia de Sostenibilidad del COI (Olympic Agenda 2020+5)", summary: "Cinco focos: infraestructura, abastecimiento, movilidad, clima y fuerza laboral; carbono-positivo para Juegos desde 2030." },
  { sport: "Tenis", organism: "ITF", framework: "Lineamientos de sostenibilidad de la International Tennis Federation", summary: "Guía de sostenibilidad para torneos y federaciones nacionales; residuos, energía y compromiso comunitario." },
  { sport: "Básquetbol", organism: "FIBA", framework: "Iniciativas de sostenibilidad de FIBA", summary: "Programa de sostenibilidad para competiciones; inclusión, comunidad y gestión ambiental de eventos." },
  { sport: "Ciclismo", organism: "UCI", framework: "Estrategia de sostenibilidad de la Union Cycliste Internationale", summary: "Lineamientos climáticos y de sostenibilidad para eventos y equipos; movilidad activa como impacto positivo." },
  { sport: "Deporte adaptado / Paralímpico", organism: "Comité Paralímpico Internacional (IPC)", framework: "Lineamientos de inclusión y sostenibilidad del IPC", summary: "Accesibilidad, inclusión y sostenibilidad como pilares transversales de la actividad paralímpica." },
];

async function main() {
  console.log("Seeding Motor IA config…");
  for (const g of gri) {
    await prisma.griMapping.upsert({ where: { key: g.key }, update: g, create: g });
  }
  console.log(`  ${gri.length} mapeos GRI`);
  for (const f of frameworks) {
    await prisma.sportFramework.upsert({ where: { sport: f.sport }, update: f, create: f });
  }
  console.log(`  ${frameworks.length} marcos globales por deporte`);
  console.log("Listo.");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
