/**
 * Motor de generación de la Estrategia ESG (GRI engine).
 *
 * Toma el payload estructurado de los pasos 1-6 y produce el documento de las
 * 9 secciones. Es determinista y auditable: cada meta se deriva del estándar GRI
 * del desafío, la madurez de datos y el período de vigencia. Cuando hay una
 * API key de Claude disponible, `generateWithClaude` enriquece la redacción sobre
 * esta misma base — nunca la reemplaza, así el output siempre queda trazable.
 */
import type {
  StrategyInput, ChallengeInput, ChallengePlan, StrategyDocument, MaturityScore,
  Milestone, ProposedProject, Pillar, Maturity,
} from "./types";
import { PILLAR_LABEL } from "./types";

export interface GriRow {
  key: string; pillar: Pillar; label: string; griStandard: string; griTitle: string;
  indicators: string[]; sdgs: string[]; metricUnit: string; metricVerb: string;
}
export interface FrameworkRow { sport: string; organism: string; framework: string; summary: string }

/** Madurez de datos → cómo se redacta la meta (spec, nota dev Paso 2). */
export function maturityOf(c: Pick<ChallengeInput, "hasBaseline" | "hasDiagnosis" | "hasHistorical">): Maturity {
  if (c.hasBaseline) return "con_linea_base";
  if (c.hasDiagnosis || c.hasHistorical) return "con_diagnostico";
  return "sin_datos";
}

/** Categoría ESGProject compatible para materializar proyectos. */
const CATEGORY_BY_KEY: Record<string, string> = {
  huella_hidrica: "huella_hidrica", huella_carbono: "huella_carbono", residuos: "gestion_residuos",
  energia: "huella_carbono", biodiversidad: "gestion_residuos", movilidad: "huella_carbono",
  inclusion: "inclusion", equidad_genero: "equidad_genero", seguridad_hinchas: "inclusion",
  comunidad: "inclusion", laboral: "inclusion", talento_local: "educacion",
  etica: "equidad_genero", gobierno_corporativo: "equidad_genero", riesgos: "equidad_genero",
  anticorrupcion: "equidad_genero", reporting: "educacion", datos: "equidad_genero",
};
const PILLAR_FALLBACK_CATEGORY: Record<Pillar, string> = {
  ambiental: "huella_carbono", social: "inclusion", gobernanza: "equidad_genero",
};
export function categoryFor(c: { key: string; pillar: Pillar }) {
  return CATEGORY_BY_KEY[c.key] ?? PILLAR_FALLBACK_CATEGORY[c.pillar];
}

// ── Metas SMART ───────────────────────────────────────────────────────────────

function yearsOf(input: StrategyInput) {
  const ys: number[] = [];
  for (let y = input.vigenciaInicio; y <= input.vigenciaFin; y++) ys.push(y);
  return ys;
}

/** Porcentaje objetivo razonable según el horizonte y verbo. */
function targetPct(years: number, verb: string) {
  const base = verb === "reducir" ? 8 : 10;
  return Math.min(50, base * Math.max(1, years - 1) + 10);
}

function smartGoal(c: ChallengeInput, gri: GriRow | undefined, input: StrategyInput, maturity: Maturity): { text: string; preliminary: boolean; requiresBaseline: boolean } {
  const unit = gri?.metricUnit || "el indicador principal";
  const verb = gri?.metricVerb || "mejorar";
  const span = input.vigenciaFin - input.vigenciaInicio + 1;
  const pct = targetPct(span, verb);
  const std = c.griStandard || gri?.griStandard || "GRI";
  const std1 = c.indicators[0] || gri?.indicators[0] || std;

  if (maturity === "con_linea_base") {
    return {
      preliminary: false, requiresBaseline: false,
      text: `${cap(verb)} en un ${pct}% ${unit} respecto de la línea base ${input.vigenciaInicio - 1}, alcanzando la meta al cierre de ${input.vigenciaFin}, medido según ${std1} (${std}).`,
    };
  }
  if (maturity === "con_diagnostico") {
    return {
      preliminary: true, requiresBaseline: true,
      text: `Consolidar la línea base de ${unit} durante ${input.vigenciaInicio} a partir del diagnóstico existente y, sobre ella, ${verb} un ${Math.round(pct * 0.8)}% al ${input.vigenciaFin}, medido según ${std1} (${std}). Meta preliminar — sujeta a validación con la línea base.`,
    };
  }
  return {
    preliminary: true, requiresBaseline: true,
    text: `Levantar la línea base de ${unit} durante el primer año (${input.vigenciaInicio}) conforme a ${std}, y fijar en ${input.vigenciaInicio + 1} una meta cuantitativa de ${verb} hacia ${input.vigenciaFin}. Meta preliminar — requiere levantamiento de datos base.`,
  };
}

// ── Hitos por año ─────────────────────────────────────────────────────────────

function milestones(c: ChallengeInput, gri: GriRow | undefined, input: StrategyInput, maturity: Maturity): Milestone[] {
  const ys = yearsOf(input);
  const unit = gri?.metricUnit || "indicador";
  const verb = gri?.metricVerb || "mejorar";
  const span = ys.length;
  const pct = targetPct(span, verb);
  const out: Milestone[] = [];
  ys.forEach((y, i) => {
    const frac = (i + 1) / span;
    if (maturity === "sin_datos" && i === 0) {
      out.push({ year: y, label: "Levantamiento de línea base", target: `Medición inicial de ${unit} y validación de la meta` });
    } else if (maturity === "con_diagnostico" && i === 0) {
      out.push({ year: y, label: "Consolidación de línea base", target: `Estandarizar el diagnóstico existente como línea base ${gri?.griStandard ?? ""}`.trim() });
    } else if (i === span - 1) {
      out.push({ year: y, label: "Meta de cierre", target: `${cap(verb)} ${pct}% acumulado en ${unit}` });
    } else {
      out.push({ year: y, label: `Hito intermedio ${i + 1}`, target: `${cap(verb)} ${Math.round(pct * frac)}% acumulado en ${unit}` });
    }
  });
  return out;
}

// ── Proyectos propuestos ──────────────────────────────────────────────────────

const PROJECT_TEMPLATES: Record<string, { title: string; description: string }[]> = {
  huella_hidrica: [
    { title: "Auditoría hídrica y sistema de medición", description: "Instalar medidores por zona y establecer la línea base de consumo de agua." },
    { title: "Riego eficiente y reutilización", description: "Riego inteligente en canchas y captura de aguas grises/lluvia para uso no potable." },
  ],
  huella_carbono: [
    { title: "Inventario de emisiones (alcances 1, 2 y 3)", description: "Cuantificar emisiones conforme a GRI 305 y priorizar fuentes de reducción." },
    { title: "Plan de descarbonización operacional", description: "Eficiencia, electrificación y compensación residual de emisiones." },
  ],
  residuos: [
    { title: "Programa Estadio Cero Residuos", description: "Separación en origen, alianzas de reciclaje y eliminación de plásticos de un solo uso." },
  ],
  energia: [
    { title: "Auditoría energética y LED", description: "Diagnóstico de consumo e iluminación eficiente en recintos." },
    { title: "Generación renovable en instalaciones", description: "Paneles solares o contrato de energía renovable certificada." },
  ],
  biodiversidad: [{ title: "Plan de manejo de áreas verdes", description: "Gestión de flora nativa y control de impactos en el entorno del recinto." }],
  movilidad: [{ title: "Plan de movilidad sostenible a eventos", description: "Transporte colectivo, bicicleta y estacionamientos preferentes; medición de alcance 3." }],
  inclusion: [{ title: "Programa de deporte adaptado y accesibilidad", description: "Infraestructura accesible y disciplinas inclusivas con beneficiarios medidos." }],
  equidad_genero: [{ title: "Política de equidad de género y plan de acción", description: "Metas de representación, brecha salarial y desarrollo de talento femenino." }],
  seguridad_hinchas: [{ title: "Protocolo de seguridad y bienestar en eventos", description: "Evaluación de riesgos, capacitación y monitoreo de incidentes por evento." }],
  comunidad: [{ title: "Programa comunitario del club", description: "Iniciativas con la comunidad del entorno, con beneficiarios y resultados medidos." }],
  laboral: [{ title: "Sistema de salud y seguridad ocupacional", description: "Protocolos, capacitación y seguimiento de lesiones para trabajadores y deportistas." }],
  talento_local: [{ title: "Academia y formación de talento local", description: "Plan de formación con horas y trayectorias medidas." }],
  etica: [{ title: "Código de ética y canal de denuncias", description: "Formalización, difusión y capacitación anticorrupción." }],
  gobierno_corporativo: [{ title: "Fortalecimiento del gobierno corporativo", description: "Comités, independencia y roles del directorio en la supervisión ESG." }],
  riesgos: [{ title: "Matriz de riesgos ESG y cumplimiento", description: "Identificación, planes de mitigación y seguimiento normativo." }],
  anticorrupcion: [{ title: "Modelo de prevención de delitos", description: "Políticas, evaluación de operaciones y controles anticorrupción." }],
  reporting: [{ title: "Primera memoria de sostenibilidad", description: "Reporte anual bajo GRI con indicadores de la estrategia." }],
  datos: [{ title: "Gobernanza de datos y privacidad", description: "Política de datos, consentimiento y gestión de incidentes de socios/hinchas." }],
};

function proposedProjects(c: ChallengeInput, maturity: Maturity): ProposedProject[] {
  const tpl = PROJECT_TEMPLATES[c.key] ?? [{ title: `Iniciativa: ${c.label}`, description: `Plan de acción para abordar "${c.label}" con indicadores ${c.griStandard || "GRI"}.` }];
  const cat = categoryFor(c);
  const level: ProposedProject["investmentLevel"] = c.budgetStatus === "si" && c.budgetAmount ? (c.budgetAmount > 50_000_000 ? "alto" : c.budgetAmount > 10_000_000 ? "medio" : "bajo") : "medio";
  const list: ProposedProject[] = tpl.map((t) => ({ ...t, investmentLevel: level, category: cat }));
  if (maturity !== "con_linea_base") {
    list.unshift({ title: `Levantamiento de línea base — ${c.label}`, description: "Acción previa: medir y documentar el punto de partida para validar la meta.", investmentLevel: "bajo", category: cat });
  }
  if (c.budgetStatus === "si" && c.budgetAmount) {
    const per = Math.round(c.budgetAmount / list.length);
    list.forEach((p) => (p.estimatedBudget = per));
  }
  return list;
}

function hrRecommendation(c: ChallengeInput) {
  if (c.hrStatus === "si") return "Ejecución con equipo interno; designar un responsable de la meta y reportar avances en el ciclo de revisión.";
  if (c.hrStatus === "parcial") return "Complementar el equipo con capacitación específica y/o apoyo puntual de un proveedor especializado (Directorio de Proveedores Sostenibles de Bettersport).";
  return "Se requiere contratación o proveedor externo para ejecutar el plan; evaluar alianzas con proveedores del Directorio de Bettersport.";
}

function responsibleFor(p: Pillar) {
  return p === "ambiental" ? "Gerencia de Operaciones / Sostenibilidad" : p === "social" ? "Gerencia de Personas / Fundación del club" : "Directorio / Gerencia General y Cumplimiento";
}

// ── Maturity score (mejora #2) ────────────────────────────────────────────────

function maturityScores(challenges: ChallengeInput[]): MaturityScore[] {
  return (["ambiental", "social", "gobernanza"] as Pillar[]).map((pillar) => {
    const cs = challenges.filter((c) => c.pillar === pillar);
    if (!cs.length) return { pillar, score: 0, level: "bajo", detail: "Sin desafíos seleccionados en este pilar." };
    const pts = cs.reduce((a, c) => a + (c.hasBaseline ? 50 : 0) + (c.hasDiagnosis ? 30 : 0) + (c.hasHistorical ? 20 : 0), 0) / cs.length;
    const score = Math.round(pts);
    const level = score >= 70 ? "consolidado" : score >= 35 ? "en_desarrollo" : "bajo";
    const withBase = cs.filter((c) => c.hasBaseline).length;
    return { pillar, score, level, detail: `${cs.length} desafío(s); ${withBase} con línea base; ${cs.filter((c) => c.hasDiagnosis).length} con diagnóstico previo.` };
  });
}

// ── Objetivos estratégicos (paso 4) ───────────────────────────────────────────

const OBJECTIVE_HOW: Record<string, string> = {
  patrocinios: "Cada meta incluye indicadores GRI verificables y un plan de inversión, lo que permite empaquetar iniciativas como activos de patrocinio para marcas con criterios ESG.",
  iso: "La trazabilidad de metas, indicadores y documentos de respaldo prepara al club para procesos de certificación (ISO 20121 / 14001 / 26000).",
  ranking: "Las metas alimentan directamente los pilares E, S y G del Ranking Sostenible de Bettersport; el avance real vs. meta se refleja en la posición.",
  medios: "Hitos anuales y resultados medibles generan contenido verificable para prensa especializada.",
  regulatorio: "La estructura GRI anticipa exigencias regulatorias ESG emergentes en Chile y LatAm.",
  financiamiento: "Metas SMART y plan de inversión estructurado facilitan acceder a fondos con criterios ESG.",
  comunidad: "El pilar social y la gobernanza de seguimiento fortalecen la relación con socios, hinchas y entorno.",
  organismos: "La alineación con el marco global del deporte posiciona al club frente a federaciones y organismos internacionales.",
};
export const OBJECTIVE_LABEL: Record<string, string> = {
  patrocinios: "Atraer y retener patrocinios con marcas alineadas a sostenibilidad",
  iso: "Obtener certificaciones ISO relacionadas (20121, 14001, 26000)",
  ranking: "Mejorar posición en el Ranking Sostenible / Bettersport Ranking",
  medios: "Exposición y cobertura en medios especializados",
  regulatorio: "Cumplimiento regulatorio anticipado (normativa ESG Chile/LatAm)",
  financiamiento: "Acceso a financiamiento o fondos con criterios ESG",
  comunidad: "Fortalecer relación con la comunidad y los socios/hinchas",
  organismos: "Posicionamiento frente a organismos internacionales del deporte",
};

// ── Generación ────────────────────────────────────────────────────────────────

export function buildPlans(input: StrategyInput, griRows: GriRow[], framework: FrameworkRow | null): ChallengePlan[] {
  const byKey = new Map(griRows.map((g) => [g.key, g]));
  return input.challenges.map((c) => {
    const gri = byKey.get(c.key);
    const maturity = maturityOf(c);
    const goal = c.goalText?.trim() ? { text: c.goalText.trim(), preliminary: maturity !== "con_linea_base", requiresBaseline: maturity !== "con_linea_base" } : smartGoal(c, gri, input, maturity);
    const plan: ChallengePlan = {
      pillar: c.pillar, key: c.key, label: c.label, maturity,
      griStandard: c.griStandard || gri?.griStandard || "GRI (por definir)",
      griTitle: c.griTitle || gri?.griTitle || "",
      indicators: c.indicators.length ? c.indicators : gri?.indicators ?? [],
      sdgs: c.sdgs.length ? c.sdgs : gri?.sdgs ?? [],
      goalText: goal.text, goalPreliminary: goal.preliminary, requiresBaseline: goal.requiresBaseline,
      milestones: milestones(c, gri, input, maturity),
      budgetStatus: c.budgetStatus, budgetAmount: c.budgetAmount, budgetCurrency: c.budgetCurrency,
      hrStatus: c.hrStatus, hrRecommendation: hrRecommendation(c),
      proposedProjects: proposedProjects(c, maturity),
      responsibleSuggested: responsibleFor(c.pillar),
    };
    if (input.alignGlobal && framework) {
      plan.globalAlignment = `Esta meta se alinea con ${framework.framework} (${framework.organism}).`;
    }
    return plan;
  });
}

export function generateStrategyDocument(input: StrategyInput, griRows: GriRow[], framework: FrameworkRow | null, version = 1): StrategyDocument {
  const plans = buildPlans(input, griRows, framework);
  const years = yearsOf(input);
  const period = `${input.vigenciaInicio}–${input.vigenciaFin}`;
  const mat = maturityScores(input.challenges);
  const gaps = plans.filter((p) => p.requiresBaseline).map((p) => `${PILLAR_LABEL[p.pillar]} · ${p.label}: requiere levantamiento de línea base.`);

  const pillars = (["ambiental", "social", "gobernanza"] as Pillar[])
    .map((pillar) => ({ pillar, label: PILLAR_LABEL[pillar], plans: plans.filter((p) => p.pillar === pillar) }))
    .filter((p) => p.plans.length);

  const roadmap = years.map((year) => ({
    year,
    items: plans.flatMap((p) => p.milestones.filter((m) => m.year === year).map((m) => ({ pillar: p.pillar, label: p.label, milestone: `${m.label}: ${m.target}` }))),
  }));

  const declared = (p: ChallengePlan) => (p.budgetStatus === "si" && p.budgetAmount ? p.budgetAmount : 0);
  const declaredTotal = plans.reduce((a, p) => a + declared(p), 0);
  const currency = plans.find((p) => p.budgetAmount)?.budgetCurrency ?? "CLP";
  const byPillar = pillars.map((pp) => ({
    pillar: pp.pillar,
    declared: pp.plans.reduce((a, p) => a + declared(p), 0),
    estimatedLevel: mostCommon(pp.plans.flatMap((p) => p.proposedProjects.map((x) => x.investmentLevel))) ?? "medio",
  }));
  const byYear = years.map((year) => ({ year, declared: Math.round(declaredTotal / years.length) }));

  const objectives = input.objectives.map((o) => ({ objective: OBJECTIVE_LABEL[o] ?? o, how: OBJECTIVE_HOW[o] ?? "La estrategia aporta a este objetivo mediante metas medibles y trazables." }));

  const primaryObjective = input.objectives[0] ? OBJECTIVE_LABEL[input.objectives[0]] ?? input.objectives[0] : null;
  const executiveSummary =
    `${input.orgName}${input.orgType ? ` (${input.orgType})` : ""} define su estrategia ESG para el período ${period}, ` +
    `abordando ${plans.length} desafío(s) en ${pillars.length} pilar(es) bajo los estándares GRI` +
    `${input.alignGlobal && framework ? ` y alineada con ${framework.organism}` : ""}. ` +
    `${primaryObjective ? `Su propósito principal es: ${primaryObjective.toLowerCase()}. ` : ""}` +
    `${gaps.length ? `${gaps.length} meta(s) se presentan como preliminares hasta contar con línea base. ` : "Todas las metas cuentan con línea base declarada. "}` +
    `${declaredTotal ? `El plan de inversión declarado asciende a ${fmt(declaredTotal, currency)}.` : "El plan de inversión se estima por nivel (bajo/medio/alto) al no existir presupuesto declarado."}`;

  const methodology = [
    "Metas y indicadores basados en los estándares GRI (Global Reporting Initiative), referenciados por desafío en el Anexo A de la especificación.",
    "Metas redactadas en formato SMART; cuando no existe línea base se marcan como preliminares y se antepone su levantamiento.",
    "Cada meta se vincula a los Objetivos de Desarrollo Sostenible (ODS) relacionados.",
    ...(input.alignGlobal && framework ? [`Alineación explícita con ${framework.framework} (${framework.organism}).`] : []),
    "Las metas se materializan como proyectos ESG trackeables en la plataforma; su avance alimenta el Ranking Sostenible.",
  ];

  const nextSteps = [
    "Aprobar la estrategia en el directorio y designar responsables por meta.",
    ...(gaps.length ? ["Ejecutar los levantamientos de línea base del primer año para validar las metas preliminares."] : []),
    "Convertir las metas en proyectos ESG dentro de Bettersport para el seguimiento de avance real vs. planificado.",
    `Revisar avances con periodicidad ${input.reviewFrequency}; actualizar la estrategia al menos una vez por año.`,
  ];

  return {
    version, generatedAt: new Date().toISOString(), engine: "gri-engine",
    cover: {
      title: `Estrategia ESG ${period}`, orgName: input.orgName, sport: input.sport, orgType: input.orgType, period,
      responsible: [input.respName, input.respRole].filter(Boolean).join(" · "),
      executiveSummary, keyGoals: plans.map((p) => `${PILLAR_LABEL[p.pillar]} — ${p.label}`),
    },
    diagnosis: {
      narrative: `Nivel de madurez ESG inicial: ${mat.map((m) => `${PILLAR_LABEL[m.pillar]} ${m.level.replace("_", " ")} (${m.score}/100)`).join(", ")}. ${input.isFirstStrategy ? "Es la primera estrategia ESG formal de la organización." : "Actualiza una estrategia anterior."}${input.additionalContext ? ` Contexto adicional declarado: ${input.additionalContext}` : ""}`,
      maturity: mat, baselineGaps: gaps,
    },
    methodology, pillars, roadmap,
    investment: { declaredTotal, currency, byPillar, byYear, narrative: declaredTotal ? `Presupuesto declarado de ${fmt(declaredTotal, currency)} distribuido en el período; los desafíos sin presupuesto se estiman por nivel de inversión.` : "No hay presupuesto declarado; cada iniciativa indica un nivel de inversión estimado (bajo/medio/alto) para orientar la decisión." },
    strategicAlignment: objectives,
    globalAlignment: input.alignGlobal && framework ? { organism: framework.organism, framework: framework.framework, links: plans.map((p) => `${p.label} → ${framework.framework}`) } : null,
    governance: { reviewFrequency: input.reviewFrequency, owner: input.respName || "Responsable ESG designado", cadence: [`Revisión ${input.reviewFrequency} de avances por meta`, "Reporte anual al directorio", "Actualización de la estrategia al cierre de cada año"], nextSteps },
  };
}

// ── utils ─────────────────────────────────────────────────────────────────────
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function fmt(n: number, cur: string) { return `${cur === "USD" ? "US$" : "$"}${Math.round(n).toLocaleString("es-CL")}${cur === "USD" ? "" : " CLP"}`; }
function mostCommon<T>(arr: T[]): T | undefined {
  const m = new Map<T, number>(); arr.forEach((x) => m.set(x, (m.get(x) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}
