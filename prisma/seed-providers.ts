/**
 * Directorio de Soluciones Sostenibles — proveedores REALES (Chile).
 * Fuente: "Bettersport — Directorio de Soluciones Sostenibles" (Sep 2026).
 *
 * Reglas aplicadas según las notas editoriales del documento:
 *  - `demo: false` → visibles para todas las cuentas, también las reales.
 *  - `verified: false` y `stars: 0` → las descripciones son orientativas y
 *    deben ser confirmadas por cada entidad; no se publica una valoración
 *    hasta definir origen, escala y criterios.
 *  - No se cargan contactos personales (nombre, teléfono, correo) porque el
 *    documento indica que requieren autorización previa para publicarse.
 *  - La mención a ISO 14041 de AQUA4D no se publica como certificación
 *    vigente hasta confirmarla con la empresa.
 *
 * Idempotente: `upsert` por id, así que puede correrse las veces que sea.
 * Uso: npm run db:seed:providers
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

type Provider = {
  id: string;
  name: string;
  initials: string;
  color: string;
  category: string;
  description: string;
  services: string[];
  tags: string[];
  website: string;
  isEmpresaB?: boolean;
};

const CL = { country: "Chile", flag: "🇨🇱" };

const providers: Provider[] = [
  /* ── Ambiental ── */
  {
    id: "prov-aqua4d",
    name: "AQUA4D",
    initials: "A4",
    color: "#0EA5E9",
    category: "eficiencia_hidrica",
    description:
      "Empresa de origen suizo especialista en gestión eficiente del agua, con tecnología propia y servicio de Gestión Hídrica Sostenible (GHS). Aplicable a diagnóstico y optimización de consumo en canchas, riego de áreas verdes y recintos deportivos.",
    services: ["Diagnósticos hídricos", "Gestión Hídrica Sostenible (GHS)", "Proyectos de eficiencia hídrica"],
    tags: ["Agua", "Riego", "Recintos deportivos"],
    website: "https://www.aqua4d.com",
  },
  {
    id: "prov-enelx",
    name: "Enel X Chile",
    initials: "EX",
    color: "#F59E0B",
    category: "eficiencia_energetica",
    description:
      "Eficiencia energética, electrificación y soluciones de energía. Iluminación, electromovilidad y gestión energética de recintos.",
    services: ["Eficiencia energética", "Iluminación", "Gestión energética de recintos"],
    tags: ["Energía", "Iluminación", "Electrificación"],
    website: "https://www.enelx.com/cl/es",
  },
  {
    id: "prov-terralink",
    name: "Terralink",
    initials: "TL",
    color: "#F59E0B",
    category: "eficiencia_energetica",
    description: "Soluciones de energía solar para instalaciones y recintos.",
    services: ["Energía solar"],
    tags: ["Solar", "Energía renovable"],
    website: "https://www.terralink.cl",
  },
  {
    id: "prov-ruuf",
    name: "Ruuf",
    initials: "RF",
    color: "#F59E0B",
    category: "eficiencia_energetica",
    description: "Soluciones de energía solar para instalaciones y recintos.",
    services: ["Energía solar"],
    tags: ["Solar", "Energía renovable"],
    website: "https://ruuf.cl",
  },
  {
    id: "prov-beeok",
    name: "Beeok",
    initials: "BK",
    color: "#34d399",
    category: "huella_carbono",
    description: "Servicios de medición de huella de carbono y huella de plástico.",
    services: ["Medición de huella de carbono", "Medición de huella de plástico"],
    tags: ["Huella de carbono", "Medición"],
    website: "https://www.beeok.com",
  },
  {
    id: "prov-triciclos",
    name: "TriCiclos",
    initials: "TC",
    color: "#10B981",
    category: "gestion_residuos",
    description:
      "Soluciones de economía circular y gestión de residuos: puntos limpios, educación y circularidad en eventos y recintos.",
    services: ["Economía circular", "Puntos limpios", "Gestión de residuos en eventos"],
    tags: ["Residuos", "Economía circular", "Eventos"],
    website: "https://triciclos.net",
  },
  {
    id: "prov-resimple",
    name: "ReSimple",
    initials: "RS",
    color: "#10B981",
    category: "gestion_residuos",
    description:
      "Sistema de gestión de envases y embalajes bajo Ley REP. Articulación de reciclaje y gestión de envases.",
    services: ["Gestión de envases y embalajes", "Cumplimiento Ley REP", "Reciclaje"],
    tags: ["Residuos", "Ley REP", "Reciclaje"],
    website: "https://resimple.cl",
  },
  {
    id: "prov-copec-voltex",
    name: "Copec Voltex",
    initials: "CV",
    color: "#06B6D4",
    category: "movilidad_sostenible",
    description: "Soluciones integrales de electromovilidad.",
    services: ["Electromovilidad", "Infraestructura de carga"],
    tags: ["Electromovilidad", "Carga"],
    website: "https://copecvoltex.cl",
  },

  /* ── Social ── */
  {
    id: "prov-educacion2020",
    name: "Fundación Educación 2020",
    initials: "E20",
    color: "#8B5CF6",
    category: "educacion_ambiental",
    description: "Programas y proyectos de mejora educativa. Alianzas educativas y programas de impacto social.",
    services: ["Programas educativos", "Alianzas educativas"],
    tags: ["Educación", "Fundación"],
    website: "https://educacion2020.cl",
  },
  {
    id: "prov-miparque",
    name: "Fundación Mi Parque",
    initials: "MP",
    color: "#EC4899",
    category: "impacto_social",
    description:
      "Recuperación participativa de espacios públicos y áreas verdes. Proyectos comunitarios y mejoramiento de espacios deportivos.",
    services: ["Recuperación de espacios públicos", "Áreas verdes", "Proyectos comunitarios"],
    tags: ["Comunidades", "Espacios deportivos", "Fundación"],
    website: "https://miparque.cl",
  },
  {
    id: "prov-futbolmas",
    name: "Fundación Fútbol Más",
    initials: "FM",
    color: "#EC4899",
    category: "impacto_social",
    description:
      "Programas de desarrollo social mediante el deporte: intervenciones comunitarias, infancia y cohesión social.",
    services: ["Desarrollo social por el deporte", "Programas de infancia", "Intervención comunitaria"],
    tags: ["Comunidades", "Infancia", "Deporte"],
    website: "https://futbolmas.org",
  },
  {
    id: "prov-teleton",
    name: "Fundación Teletón",
    initials: "TT",
    color: "#EC4899",
    category: "impacto_social",
    description:
      "Rehabilitación e inclusión de niños, niñas y jóvenes con discapacidad. Deporte adaptado y alianzas de inclusión.",
    services: ["Rehabilitación", "Deporte adaptado", "Alianzas de inclusión"],
    tags: ["Inclusión", "Deporte adaptado", "Fundación"],
    website: "https://www.teleton.cl",
  },
  {
    id: "prov-iguales",
    name: "Fundación Iguales",
    initials: "FI",
    color: "#EC4899",
    category: "impacto_social",
    description:
      "Promoción de la inclusión y la no discriminación. Formación y políticas de diversidad y trato inclusivo.",
    services: ["Formación en diversidad", "Políticas de inclusión"],
    tags: ["Equidad", "Diversidad", "Fundación"],
    website: "https://www.iguales.cl",
  },

  /* ── Gobernanza ── */
  {
    id: "prov-carey",
    name: "Carey",
    initials: "CY",
    color: "#60a5fa",
    category: "regulatorio",
    description:
      "Asesoría jurídica corporativa, regulatoria y de cumplimiento: contratos, compliance y gobierno corporativo.",
    services: ["Asesoría legal corporativa", "Compliance", "Gobierno corporativo"],
    tags: ["Legal", "Compliance"],
    website: "https://www.carey.cl",
  },
  {
    id: "prov-az",
    name: "Albagli Zaliasnik",
    initials: "AZ",
    color: "#60a5fa",
    category: "regulatorio",
    description: "Asesoría legal, compliance y gestión de riesgos: cumplimiento, integridad y asesoría corporativa.",
    services: ["Asesoría legal", "Compliance", "Gestión de riesgos"],
    tags: ["Legal", "Riesgos"],
    website: "https://www.az.cl",
  },
  {
    id: "prov-kpmg",
    name: "KPMG Chile",
    initials: "KP",
    color: "#60a5fa",
    category: "regulatorio",
    description:
      "Auditoría, riesgos, compliance y reportabilidad. Controles, auditoría y fortalecimiento de gobernanza.",
    services: ["Auditoría", "Gestión de riesgos", "Reportabilidad ESG"],
    tags: ["Transparencia", "Auditoría"],
    website: "https://kpmg.com/cl/es.html",
  },
  {
    id: "prov-pwc",
    name: "PwC Chile",
    initials: "PW",
    color: "#60a5fa",
    category: "regulatorio",
    description:
      "Auditoría, aseguramiento y consultoría de riesgos y sostenibilidad: reportes, controles internos y aseguramiento.",
    services: ["Auditoría y aseguramiento", "Consultoría de sostenibilidad", "Control interno"],
    tags: ["Transparencia", "Aseguramiento"],
    website: "https://www.pwc.com/cl/es.html",
  },
  {
    id: "prov-bhcompliance",
    name: "BH Compliance",
    initials: "BH",
    color: "#60a5fa",
    category: "regulatorio",
    description:
      "Servicios de compliance y certificación de modelos de prevención de delitos. Integridad y evaluación de sistemas de cumplimiento.",
    services: ["Compliance", "Modelos de prevención de delitos", "Evaluación de cumplimiento"],
    tags: ["Transparencia", "Compliance"],
    website: "https://www.bhcompliance.com",
  },

  /* ── Certificaciones ── */
  {
    id: "prov-cert-azul",
    name: "Certificado Azul — AQUA4D",
    initials: "CA",
    color: "#a78bfa",
    category: "certificaciones",
    description:
      "Acompañamiento especializado para obtener el Certificado Azul del Ministerio del Medio Ambiente en sus tres niveles, con evaluación de huella de agua bajo la norma ISO 14046 (consumo directo e indirecto y sus efectos en ecosistemas).",
    services: ["Certificado Azul (3 niveles)", "Huella hídrica ISO 14046"],
    tags: ["Certificación", "Huella hídrica", "MMA"],
    website: "https://www.aqua4d.com",
  },
  {
    id: "prov-cert-proyecta",
    name: "Proyecta Impacto",
    initials: "PR",
    color: "#a78bfa",
    category: "certificaciones",
    description:
      "Acompañamiento en el proceso de certificación de Empresa B bajo los nuevos estándares, destacando los compromisos ASG hasta obtener la certificación.",
    services: ["Certificación Empresa B", "Acompañamiento ASG"],
    tags: ["Certificación", "Empresa B"],
    website: "https://www.proyectaimpacto.com",
  },
  {
    id: "prov-cert-huellacarbono",
    name: "Huella Carbono Chile",
    initials: "HC",
    color: "#a78bfa",
    category: "certificaciones",
    description:
      "Acompañamiento desde el cálculo de emisiones hasta el Diploma y Sello HuellaChile oficial del Ministerio del Medio Ambiente.",
    services: ["Cálculo de emisiones", "Sello HuellaChile"],
    tags: ["Certificación", "Huella de carbono", "MMA"],
    website: "https://huellacarbonochile.cl",
  },
];

async function main() {
  for (const p of providers) {
    const data = {
      name: p.name,
      initials: p.initials,
      color: p.color,
      category: p.category,
      ...CL,
      description: p.description,
      services: p.services,
      tags: p.tags,
      website: p.website,
      isEmpresaB: p.isEmpresaB ?? false,
      projectsCount: 0,
      // Sin valoración ni verificación hasta que cada entidad confirme su ficha.
      stars: 0,
      verified: false,
      featured: false,
      demo: false,
    };
    await prisma.solutionProvider.upsert({
      where: { id: p.id },
      update: data,
      create: { id: p.id, ...data },
    });
  }
  console.log(`✔ ${providers.length} proveedores reales del directorio ESG cargados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
