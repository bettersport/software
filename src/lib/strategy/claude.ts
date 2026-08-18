import "server-only";
/**
 * Integración con Claude para el Motor IA.
 *
 * Dos roles con system prompts SEPARADOS (spec, sección 9):
 *  - Motor principal: enriquece la redacción del documento generado por el GRI
 *    engine (resumen ejecutivo, diagnóstico narrativo, metas). Trabaja sobre el
 *    JSON estructurado y devuelve el mismo esquema — nunca inventa datos.
 *  - Better Agent: guía del proceso. Explica campos, GRI, ayuda a elegir
 *    desafíos. NO redacta la estrategia.
 *
 * Si no hay ANTHROPIC_API_KEY, ambos degradan a respuestas del GRI engine.
 */
import type { StrategyDocument, StrategyInput } from "./types";

const MODEL = "claude-sonnet-5";
const API = "https://api.anthropic.com/v1/messages";

export function claudeAvailable() {
  return !!process.env.ANTHROPIC_API_KEY;
}

async function callClaude(system: string, user: string, maxTokens = 2000): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: "user", content: user }] }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.find((c: { type: string }) => c.type === "text")?.text;
    return typeof text === "string" ? text : null;
  } catch {
    return null;
  }
}

const STRATEGY_SYSTEM = `Eres un consultor ESG senior especializado en organizaciones deportivas (clubes, federaciones, ligas) en Latinoamérica.
Recibirás un documento de estrategia ESG en JSON generado por un motor determinista basado en estándares GRI, más el input estructurado del club.
Tu tarea: mejorar la REDACCIÓN de campos narrativos manteniendo EXACTAMENTE la estructura JSON y sin alterar cifras, años, estándares GRI, indicadores ni metas cuantitativas.
Puedes reescribir: cover.executiveSummary, diagnosis.narrative, investment.narrative, strategicAlignment[].how, governance.nextSteps[], y el campo goalText de cada plan SOLO para mejorar claridad manteniendo el sentido y las cifras.
Si una meta está marcada goalPreliminary=true debe seguir indicando explícitamente que es preliminar y sujeta a validación con datos.
Responde ÚNICAMENTE con el JSON completo, sin comentarios ni markdown.`;

/** Enriquece el documento con Claude. Devuelve el original si no está disponible o falla la validación. */
export async function enrichWithClaude(doc: StrategyDocument, input: StrategyInput): Promise<StrategyDocument> {
  const out = await callClaude(
    STRATEGY_SYSTEM,
    `INPUT DEL CLUB:\n${JSON.stringify(input)}\n\nDOCUMENTO A MEJORAR:\n${JSON.stringify(doc)}`,
    6000,
  );
  if (!out) return doc;
  try {
    const parsed = JSON.parse(out.replace(/^```json\s*|```\s*$/g, "")) as StrategyDocument;
    // Validación mínima de estructura para no romper el renderer.
    if (!parsed.cover || !parsed.pillars || !parsed.roadmap) return doc;
    return { ...parsed, engine: "claude", version: doc.version, generatedAt: doc.generatedAt };
  } catch {
    return doc;
  }
}

const AGENT_SYSTEM = `Eres "Better Agent", el asistente de proceso del Motor IA — Estrategia ESG de Bettersport.
Tu único rol es GUIAR al usuario mientras completa el flujo de creación de su estrategia ESG:
- Explicar qué significa cada campo o pregunta (ej. qué es una línea base, un diagnóstico, alcance 1/2/3).
- Explicar qué es un estándar GRI específico y por qué se vincula a un desafío.
- Ayudar a decidir qué desafíos seleccionar según el tipo de club (amateur, profesional, federación).
- Dar contexto sobre por qué se pide cierta información, generando confianza.
Restricciones estrictas: NO redactes la estrategia ESG ni las metas finales (eso lo hace el motor principal con toda la información). NO reemplaces la carga de documentos ni la validación de campos. Si te piden generar la estrategia, explica que se genera al final del flujo con los datos ingresados.
Responde en español, breve (máximo ~120 palabras), concreto y amable. Tienes el paso actual del usuario como contexto.`;

const STEP_NAMES: Record<number, string> = {
  0: "Inicio — Listo para crear tu estrategia ESG",
  1: "Paso 1 — Datos generales y período de vigencia",
  2: "Paso 2 — Selección de desafíos ESG y diagnóstico",
  3: "Paso 3 — Metas, estándar GRI, presupuesto y RR.HH.",
  4: "Paso 4 — Objetivos e intereses estratégicos",
  5: "Paso 5 — Alineación con lineamientos globales del deporte",
  6: "Paso 6 — Contexto adicional",
  7: "Documento — Estrategia ESG generada",
};

/** Respuestas locales del Better Agent cuando Claude no está disponible. */
function localAgentAnswer(question: string, step: number): string {
  const q = question.toLowerCase();
  if (/l[ií]nea base/.test(q)) return "Una línea base es la medición inicial de un indicador (por ejemplo, m³ de agua consumidos en 12 meses). Sirve como punto de comparación para fijar una meta cuantitativa. Si aún no la tienes, no te preocupes: el motor propondrá levantarla en el primer año y marcará la meta como preliminar.";
  if (/gri/.test(q)) return "GRI (Global Reporting Initiative) es el estándar internacional más usado para reportar sostenibilidad. Cada desafío se vincula automáticamente a un estándar GRI (ej. huella hídrica → GRI 303) con indicadores concretos, lo que hace tu estrategia verificable ante sponsors, auditores y organismos.";
  if (/diagn[oó]stico/.test(q)) return "Un diagnóstico es cualquier evaluación o auditoría previa sobre el tema (interna o externa). Si existe, cárgala como documento en ese desafío: el motor la usa para redactar una meta más precisa.";
  if (/alcance|scope/.test(q)) return "Alcance 1: emisiones directas (combustibles propios). Alcance 2: energía comprada (electricidad). Alcance 3: indirectas de la cadena, incluyendo el desplazamiento de hinchas a los eventos. Se miden bajo GRI 305.";
  if (/amateur|empezar|por d[oó]nde|cu[aá]l(es)? (elegir|seleccionar)/.test(q)) return "Para un club amateur recomiendo partir por 1 desafío por pilar, con foco en lo que ya haces: en Ambiental suele ser residuos o energía; en Social, comunidad o inclusión; en Gobernanza, transparencia y ética. Menos desafíos bien medidos valen más que muchos sin datos.";
  if (/presupuesto/.test(q)) return "Indica si hoy existe presupuesto asignado a esa iniciativa. Si dices 'no' o 'en evaluación', el motor estimará un nivel de inversión (bajo/medio/alto) por proyecto en vez de un monto exacto.";
  if (/rr\.?hh|recurso humano|equipo/.test(q)) return "Indica si cuentas con personas internas para ejecutar. Si es parcial o no, el plan sugerirá capacitación, contratación o apoyo de un proveedor del Directorio de Bettersport.";
  if (/fifa|world rugby|coi|organismo|lineamiento/.test(q)) return "Según tu deporte, puedes alinear la estrategia con el marco global correspondiente (FIFA, World Rugby, COI, etc.). Si activas la opción, el documento explicita qué metas locales se conectan con ese lineamiento — útil frente a federaciones y sponsors.";
  if (/generar|estrategia final|escribe la estrategia/.test(q)) return "La estrategia final se genera al terminar los 6 pasos, con toda la información estructurada. Yo te acompaño en el proceso, pero la redacción de metas la hace el motor principal para asegurar trazabilidad y consistencia con GRI.";
  return `Estás en ${STEP_NAMES[step] ?? "el flujo"}. Puedo explicarte qué significa cualquier campo, qué es un estándar GRI, o ayudarte a decidir qué desafíos seleccionar según tu tipo de club. ¿Sobre qué te ayudo?`;
}

export async function betterAgentAnswer(question: string, step: number, context: { orgType?: string; sport?: string } = {}): Promise<{ answer: string; engine: "claude" | "local" }> {
  const out = await callClaude(
    AGENT_SYSTEM,
    `Paso actual del usuario: ${STEP_NAMES[step] ?? step}.\nTipo de organización: ${context.orgType || "no indicado"}. Deporte: ${context.sport || "no indicado"}.\n\nPregunta: ${question}`,
    400,
  );
  if (out) return { answer: out.trim(), engine: "claude" };
  return { answer: localAgentAnswer(question, step), engine: "local" };
}
