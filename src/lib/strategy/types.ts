/**
 * Tipos del Motor IA — Estrategia ESG.
 * El payload (pasos 1-6) y el documento generado son datos estructurados,
 * no texto libre: así se referencian de forma consistente y se versionan.
 */

export type Pillar = "ambiental" | "social" | "gobernanza";
export type Maturity = "con_linea_base" | "con_diagnostico" | "sin_datos";
export type BudgetStatus = "si" | "no" | "en_evaluacion";
export type HrStatus = "si" | "no" | "parcial";

export const PILLAR_LABEL: Record<Pillar, string> = {
  ambiental: "Ambiental",
  social: "Social",
  gobernanza: "Gobernanza",
};

/** Un desafío seleccionado con su diagnóstico y definición de meta (pasos 2 y 3). */
export interface ChallengeInput {
  id?: string;
  pillar: Pillar;
  key: string;
  label: string;
  isCustom: boolean;
  hasBaseline: boolean;
  hasDiagnosis: boolean;
  hasHistorical: boolean;
  documents: { name: string; type: string; size: string }[];
  // Paso 3
  griStandard: string;
  griTitle: string;
  indicators: string[];
  sdgs: string[];
  goalText: string;
  budgetStatus: BudgetStatus;
  budgetAmount: number | null;
  budgetCurrency: "CLP" | "USD";
  budgetPeriod: "anual" | "total";
  hrStatus: HrStatus;
  hrNote: string;
}

/** Payload completo que alimenta al motor (pasos 1-6). */
export interface StrategyInput {
  orgName: string;
  sport: string;
  orgType: string;
  vigenciaInicio: number;
  vigenciaFin: number;
  respName: string;
  respRole: string;
  respEmail: string;
  isFirstStrategy: boolean;
  challenges: ChallengeInput[];
  objectives: string[]; // ordenados por prioridad
  alignGlobal: boolean;
  globalBody: string | null;
  additionalContext: string;
  reviewFrequency: string;
}

export interface Milestone {
  year: number;
  label: string;
  target: string;
}

export interface ProposedProject {
  title: string;
  description: string;
  investmentLevel: "bajo" | "medio" | "alto";
  estimatedBudget?: number;
  category: string; // ESGCategory compatible
}

export interface ChallengePlan {
  pillar: Pillar;
  key: string;
  label: string;
  maturity: Maturity;
  griStandard: string;
  griTitle: string;
  indicators: string[];
  sdgs: string[];
  goalText: string;
  goalPreliminary: boolean;
  requiresBaseline: boolean;
  milestones: Milestone[];
  budgetStatus: BudgetStatus;
  budgetAmount: number | null;
  budgetCurrency: string;
  hrStatus: HrStatus;
  hrRecommendation: string;
  proposedProjects: ProposedProject[];
  responsibleSuggested: string;
  globalAlignment?: string;
}

export interface MaturityScore {
  pillar: Pillar;
  score: number; // 0-100
  level: "bajo" | "en_desarrollo" | "consolidado";
  detail: string;
}

/** Documento final — 9 secciones del spec, como datos estructurados. */
export interface StrategyDocument {
  version: number;
  generatedAt: string;
  engine: "gri-engine" | "claude";
  cover: {
    title: string;
    orgName: string;
    sport: string;
    orgType: string;
    period: string;
    responsible: string;
    executiveSummary: string;
    keyGoals: string[];
  };
  diagnosis: {
    narrative: string;
    maturity: MaturityScore[];
    baselineGaps: string[];
  };
  methodology: string[];
  pillars: { pillar: Pillar; label: string; plans: ChallengePlan[] }[];
  roadmap: { year: number; items: { pillar: Pillar; label: string; milestone: string }[] }[];
  investment: {
    declaredTotal: number;
    currency: string;
    byPillar: { pillar: Pillar; declared: number; estimatedLevel: string }[];
    byYear: { year: number; declared: number }[];
    narrative: string;
  };
  strategicAlignment: { objective: string; how: string }[];
  globalAlignment: { organism: string; framework: string; links: string[] } | null;
  governance: {
    reviewFrequency: string;
    owner: string;
    cadence: string[];
    nextSteps: string[];
  };
}
