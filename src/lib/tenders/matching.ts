/**
 * Motor de match entre licitaciones y productoras.
 *
 * El ranking es DETERMINISTA y explicable: cada punto del puntaje viene de un
 * criterio verificable del perfil de la productora frente a los requisitos de
 * la licitación. Una adjudicación mueve dinero, así que nada queda librado a
 * una caja negra — Claude solo agrega una lectura cualitativa por encima,
 * nunca altera el orden (ver tenders/claude.ts).
 */

/** Vocabulario compartido de requisitos sostenibles. */
export const SUSTAINABILITY_TAGS = [
  { id: "cero_residuos", label: "Cero residuos", icon: "♻️" },
  { id: "carbono_neutral", label: "Huella de carbono neutral", icon: "🌱" },
  { id: "huella_hidrica", label: "Gestión hídrica", icon: "💧" },
  { id: "energia_renovable", label: "Energía renovable", icon: "⚡" },
  { id: "movilidad", label: "Movilidad sostenible", icon: "🚲" },
  { id: "inclusion", label: "Inclusión y accesibilidad", icon: "🤝" },
  { id: "equidad_genero", label: "Equidad de género", icon: "⚖️" },
  { id: "proveedores_locales", label: "Proveedores locales", icon: "🏘️" },
  { id: "certificacion_oficial", label: "Certificación oficial", icon: "🏅" },
  { id: "reporte_bettersport", label: "Reporte en plataforma Bettersport", icon: "📊" },
] as const;

export type SustainabilityTag = (typeof SUSTAINABILITY_TAGS)[number]["id"];

export const EVENT_TYPES = [
  "Corrida", "Maratón", "Trail", "Torneo", "Campeonato", "Copa",
  "Clínica deportiva", "Evento corporativo", "Exhibición", "Otro",
];

export const REGIONS = [
  "Nacional", "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío",
  "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes",
];

export interface TenderInput {
  eventType: string;
  sport: string;
  participants: number;
  region: string;
  sustainability: string[];
}

export interface ProducerInput {
  id: string;
  name: string;
  initials: string;
  color: string;
  description: string;
  website: string | null;
  regions: string[];
  specialties: string[];
  capabilities: string[];
  certifications: string[];
  maxCapacity: number;
  eventsProduced: number;
  reportsOnPlatform: boolean;
  verified: boolean;
}

export interface MatchReason {
  criterion: string;
  got: number;
  max: number;
  detail: string;
}

export interface ProducerMatch {
  producer: ProducerInput;
  score: number;
  reasons: MatchReason[];
  /** Requisitos sostenibles exigidos que la productora NO declara cubrir. */
  gaps: string[];
}

/** Pesos del puntaje; suman 100. */
const WEIGHTS = {
  sustainability: 45,
  experience: 20,
  capacity: 15,
  coverage: 10,
  trust: 10,
};

const labelOf = (tag: string) => SUSTAINABILITY_TAGS.find((t) => t.id === tag)?.label ?? tag;

/**
 * Ordena las productoras por ajuste a la licitación y devuelve las mejores.
 * Todas las productoras reciben puntaje; el corte lo decide quien llama.
 */
export function matchProducers(tender: TenderInput, producers: ProducerInput[], limit = 4): ProducerMatch[] {
  const required = tender.sustainability ?? [];

  const scored = producers.map((p): ProducerMatch => {
    const reasons: MatchReason[] = [];

    // 1. Requisitos sostenibles — el criterio que más pesa.
    const covered = required.filter((r) => p.capabilities.includes(r));
    const gaps = required.filter((r) => !p.capabilities.includes(r));
    const sustScore = required.length
      ? (covered.length / required.length) * WEIGHTS.sustainability
      : WEIGHTS.sustainability * 0.6; // sin exigencias declaradas, no se premia ni castiga
    reasons.push({
      criterion: "Requisitos sostenibles",
      got: Math.round(sustScore),
      max: WEIGHTS.sustainability,
      detail: required.length
        ? `Cubre ${covered.length} de ${required.length}: ${covered.map(labelOf).join(", ") || "ninguno"}`
        : "La licitación no declara requisitos sostenibles específicos",
    });

    // 2. Experiencia en el tipo de evento o el deporte.
    const matchesType = p.specialties.some((s) => s.toLowerCase() === tender.eventType.toLowerCase());
    const matchesSport = !!tender.sport && p.specialties.some((s) => s.toLowerCase() === tender.sport.toLowerCase());
    const expScore = matchesType && matchesSport ? WEIGHTS.experience
      : matchesType ? WEIGHTS.experience * 0.8
      : matchesSport ? WEIGHTS.experience * 0.5
      : 0;
    reasons.push({
      criterion: "Experiencia",
      got: Math.round(expScore),
      max: WEIGHTS.experience,
      detail: matchesType || matchesSport
        ? `Produce ${[matchesType && tender.eventType, matchesSport && tender.sport].filter(Boolean).join(" y ")}`
        : `No declara experiencia en ${tender.eventType}`,
    });

    // 3. Capacidad para el tamaño del evento.
    const ratio = tender.participants > 0 && p.maxCapacity > 0 ? p.maxCapacity / tender.participants : 0;
    const capScore = ratio >= 1 ? WEIGHTS.capacity
      : ratio >= 0.7 ? WEIGHTS.capacity * 0.6
      : ratio > 0 ? WEIGHTS.capacity * 0.25
      : WEIGHTS.capacity * 0.3; // sin dato, no se castiga del todo
    reasons.push({
      criterion: "Capacidad",
      got: Math.round(capScore),
      max: WEIGHTS.capacity,
      detail: p.maxCapacity
        ? `Ha producido eventos de hasta ${p.maxCapacity.toLocaleString("es-CL")} participantes` +
          (tender.participants ? ` · se requieren ${tender.participants.toLocaleString("es-CL")}` : "")
        : "No declara capacidad máxima",
    });

    // 4. Cobertura territorial.
    const national = p.regions.includes("Nacional");
    const inRegion = national || p.regions.includes(tender.region);
    const covScore = inRegion ? WEIGHTS.coverage : 0;
    reasons.push({
      criterion: "Cobertura",
      got: covScore,
      max: WEIGHTS.coverage,
      detail: inRegion
        ? national ? "Cobertura nacional" : `Opera en ${tender.region}`
        : `No declara operación en ${tender.region}`,
    });

    // 5. Respaldo: certificaciones, verificación y reporte en plataforma.
    let trust = 0;
    const trustBits: string[] = [];
    if (p.certifications.length) { trust += 4; trustBits.push(`${p.certifications.length} certificación(es)`); }
    if (p.reportsOnPlatform) { trust += 4; trustBits.push("reporta en Bettersport"); }
    if (p.verified) { trust += 2; trustBits.push("perfil verificado"); }
    reasons.push({
      criterion: "Respaldo",
      got: trust,
      max: WEIGHTS.trust,
      detail: trustBits.join(" · ") || "Sin certificaciones ni verificación declaradas",
    });

    const score = reasons.reduce((s, r) => s + r.got, 0);
    return { producer: p, score: Math.min(100, Math.round(score)), reasons, gaps: gaps.map(labelOf) };
  });

  return scored
    .sort((a, b) => b.score - a.score || b.producer.eventsProduced - a.producer.eventsProduced)
    .slice(0, limit);
}
