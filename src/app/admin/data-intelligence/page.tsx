"use client";

import { useState, useMemo } from "react";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import {
  Database,
  BarChart3,
  Brain,
  Download,
  FileText,
  GitBranch,
  Code2,
  ChevronRight,
  TrendingUp,
  Users,
  Building2,
  Handshake,
  RefreshCw,
  Filter,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
type AdminStats = {
  clubs: number;
  brands: number;
  fans: number;
  esgAvg: { esgScore: number | null; environmental: number | null; social: number | null; governance: number | null; transparency: number | null };
  projects: number;
  projectsByStatus: { status: string; _count: number }[];
  events: number;
  kpis: number;
  docs: number;
  countries: number;
  sports: number;
  byCountry: { country: string; _count: number }[];
  bySport: { sport: string; _count: number }[];
  brandInvestment: number;
  brandProjects: number;
  sponsorLeads: number;
  growth: { month: string; clubs: number }[];
};

const PROJECT_STATUS_LABELS: Record<string, string> = {
  planning: "Planificando", in_progress: "En curso", completed: "Completados", paused: "Pausados",
};

const fmtNum = (n: number | null | undefined, digits = 0) =>
  n === null || n === undefined || Number.isNaN(n) ? "—" : n.toLocaleString("es-CL", { maximumFractionDigits: digits, minimumFractionDigits: digits });
const fmtScore = (n: number | null | undefined) => (n === null || n === undefined ? "—" : n.toFixed(1));

const csvCell = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function toCsv(header: string[], rows: unknown[][]) {
  return [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
}

const compareEngagementData = [
  { initiative: "Iniciativa 1", clubA: 18200, clubB: 14300 },
  { initiative: "Iniciativa 2", clubA: 9400, clubB: 10200 },
  { initiative: "Iniciativa 3", clubA: 8100, clubB: 6100 },
];

const roiData = [
  { name: "Club A", inversion: 80000, roi: 5.8 },
  { name: "Club B", inversion: 60000, roi: 4.2 },
  { name: "Club C", inversion: 40000, roi: 3.9 },
  { name: "Club D", inversion: 0, roi: 0 },
];

const TABS = [
  { id: "intelligence", label: "Intelligence Center", icon: <Database size={15} />, demoOnly: false },
  { id: "export", label: "Export Manager", icon: <Download size={15} />, demoOnly: false },
  { id: "ai", label: "Asistente ESG", icon: <Brain size={15} />, demoOnly: false },
  { id: "report", label: "Reporte IA Demo", icon: <FileText size={15} />, demoOnly: true },
  { id: "schema", label: "Data Schema", icon: <GitBranch size={15} />, demoOnly: true },
  { id: "crosses", label: "Cruces Estratégicos", icon: <BarChart3 size={15} />, demoOnly: true },
  { id: "api", label: "API Reference", icon: <Code2 size={15} />, demoOnly: true },
];

function ProposalBanner() {
  return (
    <div className="mb-5 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm font-medium flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">Especificación propuesta</span>
      Contenido ilustrativo (no implementado). Los datos y estructuras aquí mostrados no provienen de la plataforma.
    </div>
  );
}

const SUGGESTED_PROMPTS = [
  {
    label: "Ministerio del Deporte",
    text: "Genera un informe nacional sobre el avance de sostenibilidad en clubes deportivos por región, deporte y categoría. Identifica brechas y recomendaciones de política pública.",
  },
  {
    label: "Ministerio Medio Ambiente",
    text: "Analiza los KPIs ambientales acumulados: consumo hídrico, energía, residuos y emisiones. Identifica qué deportes y regiones muestran mayor potencial de reducción.",
  },
  {
    label: "Pacto Global ONU",
    text: "Genera un reporte de contribución del ecosistema deportivo a los ODS, cruzando iniciativas, KPIs, clubes, marcas y engagement ciudadano.",
  },
  {
    label: "Marca Sponsor",
    text: "Identifica los clubes con mejor combinación entre ranking ESG, engagement de hinchas y oportunidad reputacional para una marca interesada en sostenibilidad.",
  },
  {
    label: "Bettersport Comercial",
    text: "Prioriza los 10 clubes con mayor potencial para levantar sponsorship ESG en los próximos 90 días, considerando score, audiencia y sector.",
  },
];

const SCHEMA_TABLES = [
  {
    name: "clubs",
    tag: "core entity",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "name", type: "text", kind: "" },
      { name: "country_id", type: "FK", kind: "fk" },
      { name: "sport_id", type: "FK", kind: "fk" },
      { name: "federation_id", type: "FK", kind: "fk" },
      { name: "members_count", type: "int", kind: "" },
      { name: "esg_score", type: "decimal idx", kind: "idx" },
      { name: "created_at", type: "timestamp", kind: "" },
    ],
  },
  {
    name: "esg_scores",
    tag: "versioned",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "club_id", type: "FK", kind: "fk" },
      { name: "score_total", type: "decimal", kind: "idx" },
      { name: "score_env", type: "decimal", kind: "" },
      { name: "score_social", type: "decimal", kind: "" },
      { name: "score_gov", type: "decimal", kind: "" },
      { name: "season", type: "varchar", kind: "" },
      { name: "calculated_at", type: "timestamp", kind: "" },
    ],
  },
  {
    name: "brands",
    tag: "sponsors",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "name", type: "text", kind: "" },
      { name: "industry", type: "varchar", kind: "" },
      { name: "country_id", type: "FK", kind: "fk" },
      { name: "esg_focus", type: "text[]", kind: "" },
      { name: "annual_budget", type: "decimal", kind: "" },
      { name: "active", type: "boolean", kind: "" },
    ],
  },
  {
    name: "sponsorships",
    tag: "junction",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "brand_id", type: "FK", kind: "fk" },
      { name: "club_id", type: "FK", kind: "fk" },
      { name: "investment_usd", type: "decimal", kind: "" },
      { name: "start_date", type: "date", kind: "" },
      { name: "status", type: "enum", kind: "" },
      { name: "roi_reputational", type: "decimal", kind: "" },
    ],
  },
  {
    name: "initiatives",
    tag: "ESG actions",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "club_id", type: "FK", kind: "fk" },
      { name: "name", type: "text", kind: "" },
      { name: "category", type: "enum", kind: "" },
      { name: "ods_tags", type: "int[]", kind: "" },
      { name: "impact_score", type: "decimal", kind: "" },
      { name: "verified", type: "boolean", kind: "" },
    ],
  },
  {
    name: "engagements",
    tag: "analytics",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "fan_id", type: "FK anon", kind: "fk" },
      { name: "initiative_id", type: "FK", kind: "fk" },
      { name: "type", type: "enum", kind: "" },
      { name: "value", type: "decimal", kind: "" },
      { name: "timestamp", type: "timestamp", kind: "" },
    ],
  },
  {
    name: "fans",
    tag: "privacy-first",
    fields: [
      { name: "id", type: "uuid PK anon", kind: "pk" },
      { name: "club_id", type: "FK", kind: "fk" },
      { name: "age_bracket", type: "varchar", kind: "" },
      { name: "region", type: "varchar", kind: "" },
      { name: "consent", type: "jsonb", kind: "" },
      { name: "esg_interest", type: "decimal", kind: "" },
      { name: "nps_score", type: "int", kind: "" },
    ],
  },
  {
    name: "ai_queries",
    tag: "audit log",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "prompt", type: "text", kind: "" },
      { name: "response", type: "text", kind: "" },
      { name: "model", type: "varchar", kind: "" },
      { name: "destination", type: "enum", kind: "" },
      { name: "tokens_used", type: "int", kind: "" },
      { name: "created_at", type: "timestamp", kind: "" },
    ],
  },
  {
    name: "esg_kpis",
    tag: "metrics",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "club_id", type: "FK", kind: "fk" },
      { name: "kpi_type", type: "enum", kind: "" },
      { name: "value", type: "decimal", kind: "" },
      { name: "unit", type: "varchar", kind: "" },
      { name: "period", type: "daterange", kind: "" },
      { name: "verified_by", type: "uuid", kind: "" },
    ],
  },
  {
    name: "reports",
    tag: "generated",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "type", type: "enum", kind: "" },
      { name: "destination", type: "enum", kind: "" },
      { name: "format", type: "enum", kind: "" },
      { name: "filters", type: "jsonb", kind: "" },
      { name: "file_url", type: "text", kind: "" },
      { name: "created_at", type: "timestamp", kind: "" },
    ],
  },
  {
    name: "campaigns",
    tag: "brands",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "brand_id", type: "FK", kind: "fk" },
      { name: "club_id", type: "FK", kind: "fk" },
      { name: "name", type: "text", kind: "" },
      { name: "budget", type: "decimal", kind: "" },
      { name: "engagement", type: "int", kind: "" },
      { name: "active", type: "boolean", kind: "" },
    ],
  },
  {
    name: "rankings",
    tag: "versioned",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "club_id", type: "FK", kind: "fk" },
      { name: "position", type: "int", kind: "" },
      { name: "category", type: "enum", kind: "" },
      { name: "season", type: "varchar", kind: "" },
      { name: "delta", type: "int", kind: "" },
    ],
  },
  {
    name: "federations",
    tag: "governance",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "name", type: "text", kind: "" },
      { name: "country_id", type: "FK", kind: "fk" },
      { name: "sport_id", type: "FK", kind: "fk" },
      { name: "clubs_count", type: "int", kind: "" },
    ],
  },
  {
    name: "documents",
    tag: "verifiers",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "entity_id", type: "polymorphic", kind: "fk" },
      { name: "doc_type", type: "enum", kind: "" },
      { name: "file_hash", type: "varchar", kind: "" },
      { name: "verified", type: "boolean", kind: "" },
      { name: "expires_at", type: "date", kind: "" },
    ],
  },
  {
    name: "events",
    tag: "activities",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "club_id", type: "FK", kind: "fk" },
      { name: "name", type: "text", kind: "" },
      { name: "date", type: "date", kind: "" },
      { name: "attendance", type: "int", kind: "" },
      { name: "co2_footprint", type: "decimal", kind: "" },
    ],
  },
  {
    name: "countries",
    tag: "geo",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "name", type: "text", kind: "" },
      { name: "code", type: "varchar(2)", kind: "" },
      { name: "region", type: "varchar", kind: "" },
    ],
  },
  {
    name: "sports",
    tag: "catalog",
    fields: [
      { name: "id", type: "uuid PK", kind: "pk" },
      { name: "name", type: "text", kind: "" },
      { name: "category", type: "enum", kind: "" },
    ],
  },
];

const STRATEGIC_CROSSES = [
  {
    num: "01",
    audience: "Para sponsors",
    title: "Ranking ESG × Inversión sponsor × ROI",
    desc: "Identifica qué clubes generan mayor retorno reputacional por dólar invertido. Permite al sponsor optimizar su portfolio.",
    query: "clubs JOIN sponsorships JOIN esg_scores ORDER BY roi_reputational DESC",
    color: "emerald",
  },
  {
    num: "02",
    audience: "Para gestión",
    title: "Iniciativas × Engagement × Tipo de acción",
    desc: "Revela qué tipo de iniciativas generan más participación real por deporte y región.",
    query: "initiatives JOIN engagements GROUP BY category, region",
    color: "teal",
  },
  {
    num: "03",
    audience: "Para gobierno",
    title: "Score ESG × Región × Deporte × Temporada",
    desc: "Permite al Ministerio del Deporte visualizar el avance regional y por disciplina, identificar brechas y priorizar política pública.",
    query: "clubs JOIN esg_scores JOIN countries GROUP BY region, sport",
    color: "amber",
  },
  {
    num: "04",
    audience: "Para Pacto Global",
    title: "Iniciativas × ODS × Impacto acumulado",
    desc: "Mapea la contribución del deporte a los 17 ODS. Genera evidencia verificable para reportes internacionales.",
    query: "initiatives JOIN esg_kpis WHERE ods_tags @> '{3,11,13}'",
    color: "violet",
  },
  {
    num: "05",
    audience: "Inversión ESG → Fans",
    title: "Presupuesto ESG × Crecimiento fans × NPS",
    desc: "Demuestra que los clubes que invierten en sostenibilidad tienen fans más leales y mayor NPS.",
    query: "clubs JOIN esg_kpis JOIN fans GROUP BY club_id",
    color: "slate",
  },
  {
    num: "06",
    audience: "Score ESG → Sponsors",
    title: "Ranking ESG × Cantidad de sponsors × Inversión recibida",
    desc: "Muestra que a mayor score ESG, mayor inversión de sponsors. Prueba el ROI del ESG.",
    query: "clubs JOIN sponsorships WHERE esg_score > 80 ORDER BY investment_usd DESC",
    color: "slate",
  },
  {
    num: "07",
    audience: "Medio Ambiente",
    title: "KPIs ambientales × Deporte × Región",
    desc: "Consolida consumo hídrico, energía, residuos y emisiones por tipo de deporte y territorio.",
    query: "esg_kpis JOIN clubs JOIN countries WHERE kpi_type IN ('water','energy','waste')",
    color: "slate",
  },
  {
    num: "08",
    audience: "Mejora temporal",
    title: "Evolución ESG anual × Inversión × Iniciativas nuevas",
    desc: "Identifica qué clubes mejoran más rápido y qué acciones lo explican. Genera benchmarks.",
    query: "esg_scores JOIN initiatives WHERE season IN ('2025','2026') ORDER BY delta DESC",
    color: "slate",
  },
  {
    num: "09",
    audience: "Fans + Marcas",
    title: "Preferencia de marca fans × Categoría sponsor × NPS",
    desc: "Permite a una marca ver cómo sus fans la perciben en el contexto ESG.",
    query: "fans JOIN engagements JOIN campaigns GROUP BY brand_id, nps_score",
    color: "slate",
  },
  {
    num: "10",
    audience: "Oportunidad comercial",
    title: "Clubes sin sponsor × Score ESG alto × Engagement",
    desc: "Detecta automáticamente clubes con alto score y audiencia comprometida pero sin sponsor activo.",
    query: "clubs LEFT JOIN sponsorships WHERE sponsorships.id IS NULL AND esg_score > 75",
    color: "slate",
  },
  {
    num: "11",
    audience: "Comparativa regional",
    title: "Benchmarking inter-país × Deporte × Score × Inversión",
    desc: "Compara el ecosistema deportivo de Chile vs Colombia vs México vs Argentina.",
    query: "clubs JOIN esg_scores JOIN countries GROUP BY country_id, sport_id",
    color: "slate",
  },
];

const EXPORT_FORMATS = [
  {
    icon: "📄",
    name: "CSV",
    tag: "Operativo",
    tagColor: "bg-emerald-100 text-emerald-700",
    desc: "Agregados por país y deporte (según filtros aplicados) para Excel, BI o scripts.",
    btnClass: "btn-primary",
  },
  {
    icon: "{ }",
    name: "JSON",
    tag: "Developers",
    tagColor: "bg-violet-100 text-violet-700",
    desc: "Snapshot completo de los agregados de la plataforma para integraciones.",
    btnClass: "btn-secondary",
  },
];

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function KpiCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-mono text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function SchemaTableCard({
  table,
}: {
  table: (typeof SCHEMA_TABLES)[number];
}) {
  const tagColors: Record<string, string> = {
    "core entity": "bg-emerald-100 text-emerald-700",
    versioned: "bg-teal-100 text-teal-700",
    sponsors: "bg-amber-100 text-amber-700",
    junction: "bg-violet-100 text-violet-700",
    "ESG actions": "bg-green-100 text-green-700",
    analytics: "bg-blue-100 text-blue-700",
    "privacy-first": "bg-rose-100 text-rose-700",
    "audit log": "bg-slate-100 text-slate-600",
    metrics: "bg-cyan-100 text-cyan-700",
    generated: "bg-indigo-100 text-indigo-700",
    brands: "bg-orange-100 text-orange-700",
    governance: "bg-purple-100 text-purple-700",
    verifiers: "bg-yellow-100 text-yellow-700",
    activities: "bg-lime-100 text-lime-700",
    geo: "bg-sky-100 text-sky-700",
    catalog: "bg-pink-100 text-pink-700",
  };

  const fieldKindClass = (kind: string) => {
    if (kind === "pk") return "text-emerald-600 font-semibold";
    if (kind === "fk") return "text-teal-600";
    if (kind === "idx") return "text-amber-600";
    return "text-slate-600";
  };

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <span className="font-mono text-sm font-semibold text-slate-700">{table.name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[table.tag] ?? "bg-slate-100 text-slate-600"}`}>
          {table.tag}
        </span>
      </div>
      <div className="divide-y divide-slate-50">
        {table.fields.map((f) => (
          <div key={f.name} className="flex items-center justify-between px-4 py-1.5">
            <span className={`font-mono text-xs ${fieldKindClass(f.kind)}`}>{f.name}</span>
            <span className="font-mono text-xs text-slate-400">{f.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

const AI_DESTINATIONS = [
  { value: "ministerio_deporte", label: "🏛️ Ministerio del Deporte" },
  { value: "ministerio_medio", label: "🌿 Ministerio del Medio Ambiente" },
  { value: "pacto_global", label: "🌐 Pacto Global ONU" },
  { value: "marca_sponsor", label: "💼 Marca Sponsor" },
  { value: "club", label: "🏟️ Club / Federación" },
  { value: "directorio", label: "📋 Directorio Bettersport" },
];

export default function DataIntelligencePage() {
  const { activeUser, loaded, isDemo } = useUser();
  const { data: stats, loading: statsLoading, reload: reloadStats } = useResource<AdminStats | null>(
    loaded && activeUser ? "/api/admin/stats" : null, null,
  );

  const [activeTab, setActiveTab] = useState("intelligence");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiDestination, setAiDestination] = useState("ministerio_deporte");
  const [aiState, setAiState] = useState<"idle" | "thinking" | "done" | "error">("idle");
  const [aiResult, setAiResult] = useState("");
  const [aiEngine, setAiEngine] = useState<"claude" | "local" | null>(null);
  const [aiError, setAiError] = useState("");

  // Export filters (draft + applied)
  const [countryFilter, setCountryFilter] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [applied, setApplied] = useState<{ country: string; sport: string }>({ country: "", sport: "" });

  const visibleTabs = TABS.filter((t) => !t.demoOnly || isDemo);

  const filteredByCountry = useMemo(
    () => (stats?.byCountry ?? []).filter((r) => !applied.country || r.country === applied.country),
    [stats, applied.country],
  );
  const filteredBySport = useMemo(
    () => (stats?.bySport ?? []).filter((r) => !applied.sport || r.sport === applied.sport),
    [stats, applied.sport],
  );
  const selectedCount = applied.country
    ? filteredByCountry.reduce((s, r) => s + r._count, 0)
    : applied.sport
      ? filteredBySport.reduce((s, r) => s + r._count, 0)
      : (stats?.clubs ?? 0);

  const growthData = useMemo(
    () => (stats?.growth ?? []).map((g) => ({ month: g.month, clubes: g.clubs })),
    [stats],
  );
  const radarData = useMemo(() => {
    const e = stats?.esgAvg;
    if (!e) return [];
    return [
      { pillar: "Ambiental", score: Math.round(e.environmental ?? 0) },
      { pillar: "Social", score: Math.round(e.social ?? 0) },
      { pillar: "Gobernanza", score: Math.round(e.governance ?? 0) },
      { pillar: "Transparencia", score: Math.round(e.transparency ?? 0) },
    ];
  }, [stats]);

  const stamp = () => new Date().toISOString().slice(0, 10);

  const exportClubsCsv = () => {
    if (!stats) return;
    const rows: unknown[][] = [
      ...filteredByCountry.map((r) => ["pais", r.country, r._count]),
      ...filteredBySport.map((r) => ["deporte", r.sport, r._count]),
    ];
    downloadBlob(toCsv(["dimension", "valor", "clubes"], rows), `bettersport-clubes-${stamp()}.csv`, "text/csv;charset=utf-8");
  };
  const exportBrandsCsv = () => {
    if (!stats) return;
    const rows: unknown[][] = [
      ["marcas_registradas", stats.brands],
      ["proyectos_de_marca", stats.brandProjects],
      ["inversion_total_usd", stats.brandInvestment],
      ["leads_patrocinio", stats.sponsorLeads],
    ];
    downloadBlob(toCsv(["metrica", "valor"], rows), `bettersport-marcas-${stamp()}.csv`, "text/csv;charset=utf-8");
  };
  const exportFansCsv = () => {
    if (!stats) return;
    downloadBlob(toCsv(["metrica", "valor"], [["fans_registrados", stats.fans]]), `bettersport-fans-${stamp()}.csv`, "text/csv;charset=utf-8");
  };
  const exportJson = () => {
    if (!stats) return;
    downloadBlob(JSON.stringify(stats, null, 2), `bettersport-stats-${stamp()}.json`, "application/json");
  };
  const handleExport = (name: string) => {
    if (name === "CSV") exportClubsCsv();
    else if (name === "JSON") exportJson();
  };

  const handleRunAI = async () => {
    const q = aiPrompt.trim();
    if (!q) return;
    setAiState("thinking");
    setAiResult("");
    setAiError("");
    try {
      const destLabel = AI_DESTINATIONS.find((d) => d.value === aiDestination)?.label.replace(/^\S+\s/, "") ?? "";
      const question = destLabel ? `${q}\n\n(Destinatario del reporte: ${destLabel})` : q;
      const res = await apiSend<{ data?: { answer: string; engine: "claude" | "local" } }>(
        "/api/strategy/agent", "POST", { question, step: 7 },
      );
      setAiResult(res.data?.answer ?? "");
      setAiEngine(res.data?.engine ?? null);
      setAiState("done");
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "No se pudo obtener respuesta");
      setAiState("error");
    }
  };

  const projectsByStatus = stats?.projectsByStatus ?? [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
          <Database size={12} />
          <span>Admin</span>
          <ChevronRight size={10} />
          <span>Data Intelligence Center</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Data Intelligence Center</h1>
        <p className="text-sm text-slate-500 mt-1">
          Panel centralizado de datos, exportación y asistente ESG
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap mb-6 border-b border-slate-200 pb-0">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? "text-emerald-700 border-emerald-500 bg-emerald-50"
                : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          TAB 1: INTELLIGENCE CENTER
         ══════════════════════════════════════ */}
      {activeTab === "intelligence" && (
        <div>
          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard
              icon={<Building2 size={20} className="text-emerald-600" />}
              label="Total clubes"
              value={stats ? fmtNum(stats.clubs) : "—"}
              sub={stats ? `${stats.countries} países · ${stats.sports} deportes` : statsLoading ? "Cargando…" : "Sin datos"}
              color="bg-emerald-50"
            />
            <KpiCard
              icon={<Handshake size={20} className="text-teal-600" />}
              label="Marcas registradas"
              value={stats ? fmtNum(stats.brands) : "—"}
              sub={stats ? `${fmtNum(stats.brandProjects)} proyectos · USD ${fmtNum(stats.brandInvestment)}` : ""}
              color="bg-teal-50"
            />
            <KpiCard
              icon={<Users size={20} className="text-amber-600" />}
              label="Fans registrados"
              value={stats ? fmtNum(stats.fans) : "—"}
              sub={stats ? `${fmtNum(stats.events)} eventos publicados` : ""}
              color="bg-amber-50"
            />
            <KpiCard
              icon={<TrendingUp size={20} className="text-violet-600" />}
              label="Score ESG promedio"
              value={stats ? fmtScore(stats.esgAvg.esgScore) : "—"}
              sub={stats ? `${fmtNum(stats.projects)} proyectos ESG registrados` : ""}
              color="bg-violet-50"
            />
          </div>

          {/* Data Source Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Clubes */}
            <div className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-2xl mb-1">🏟️</p>
                  <p className="font-semibold text-slate-700">Clubes & Organizaciones</p>
                  <p className="text-2xl font-bold text-emerald-600 font-mono mt-1">{stats ? fmtNum(stats.clubs) : "—"}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">Activo</span>
              </div>
              <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                {[
                  ["Países cubiertos", stats ? fmtNum(stats.countries) : "—"],
                  ["Deportes", stats ? fmtNum(stats.sports) : "—"],
                  ["Score ESG prom.", stats ? fmtScore(stats.esgAvg.esgScore) : "—"],
                  ["Proyectos ESG", stats ? fmtNum(stats.projects) : "—"],
                  ["KPIs reportados", stats ? fmtNum(stats.kpis) : "—"],
                  ["Documentos", stats ? fmtNum(stats.docs) : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-semibold text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn-secondary text-xs py-1.5 px-3 flex-1" onClick={exportClubsCsv} disabled={!stats}>📤 Exportar CSV</button>
                <button className="btn-primary text-xs py-1.5 px-3 flex-1" onClick={() => setActiveTab("ai")}>🤖 Consultar</button>
              </div>
            </div>

            {/* Marcas */}
            <div className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-2xl mb-1">🤝</p>
                  <p className="font-semibold text-slate-700">Marcas & Sponsors</p>
                  <p className="text-2xl font-bold text-teal-600 font-mono mt-1">{stats ? fmtNum(stats.brands) : "—"}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">Activo</span>
              </div>
              <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                {[
                  ["Inversión total registrada", stats ? `USD ${fmtNum(stats.brandInvestment)}` : "—"],
                  ["Proyectos de marca", stats ? fmtNum(stats.brandProjects) : "—"],
                  ["Leads de patrocinio", stats ? fmtNum(stats.sponsorLeads) : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-semibold text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn-secondary text-xs py-1.5 px-3 flex-1" onClick={exportBrandsCsv} disabled={!stats}>📤 Exportar CSV</button>
                <button className="btn-primary text-xs py-1.5 px-3 flex-1" onClick={() => setActiveTab("ai")}>🤖 Consultar</button>
              </div>
            </div>

            {/* Fans */}
            <div className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-2xl mb-1">👥</p>
                  <p className="font-semibold text-slate-700">Fans & Hinchas</p>
                  <p className="text-2xl font-bold text-amber-600 font-mono mt-1">{stats ? fmtNum(stats.fans) : "—"}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">Activo</span>
              </div>
              <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                {[
                  ["Fans registrados", stats ? fmtNum(stats.fans) : "—"],
                  ["Eventos publicados", stats ? fmtNum(stats.events) : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-semibold text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn-secondary text-xs py-1.5 px-3 flex-1" onClick={exportFansCsv} disabled={!stats}>📤 Exportar CSV</button>
                <button className="btn-primary text-xs py-1.5 px-3 flex-1" onClick={() => setActiveTab("ai")}>🤖 Consultar</button>
              </div>
            </div>
          </div>

          {/* Projects by status */}
          {projectsByStatus.length > 0 && (
            <div className="card p-5 mb-6">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Proyectos ESG por estado</p>
              <div className="flex flex-wrap gap-3">
                {projectsByStatus.map((s) => (
                  <div key={s.status} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-lg font-bold text-slate-800">{fmtNum(s._count)}</p>
                    <p className="text-xs text-slate-500">{PROJECT_STATUS_LABELS[s.status] ?? s.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="card p-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
                Clubes registrados por mes
              </p>
              {growthData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">Sin registros todavía</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clubes" stroke="#10b981" strokeWidth={2} dot={false} name="Clubes" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="card p-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
                Promedio ESG por pilar — Clubes registrados
              </p>
              {radarData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">Sin datos todavía</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 11 }} />
                    <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Data Flow Diagram */}
          <div className="card p-5">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-5">
              Flujo de datos — Captura → Agregación → Asistente → Output
            </p>
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {[
                { icon: "🏟️", label: "Clubes", sub: "ESG + KPIs", color: "bg-emerald-50 border-emerald-200" },
                { icon: "🤝", label: "Marcas", sub: "Proyectos + Leads", color: "bg-teal-50 border-teal-200" },
                { icon: "👥", label: "Fans", sub: "Fan Zone", color: "bg-amber-50 border-amber-200" },
                { icon: "🧠", label: "Data Layer", sub: "PostgreSQL", color: "bg-violet-50 border-violet-200" },
                { icon: "🤖", label: "Better Agent", sub: "Asistente ESG", color: "bg-purple-50 border-purple-200" },
                { icon: "📊", label: "Outputs", sub: "CSV · JSON", color: "bg-emerald-50 border-emerald-200" },
              ].map((node, i, arr) => (
                <div key={node.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5 min-w-[88px] text-center">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl ${node.color}`}>
                      {node.icon}
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{node.label}</p>
                    <p className="font-mono text-[9px] text-slate-400">{node.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-slate-300 min-w-[20px] mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB 2: EXPORT MANAGER
         ══════════════════════════════════════ */}
      {activeTab === "export" && (
        <div>
          {/* Filter Bar */}
          <div className="card p-5 mb-5">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
              <Filter size={10} className="inline mr-1" />
              Filtros de exportación
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-1 min-w-[180px]">
                <label className="text-xs text-slate-500 font-medium">País</label>
                <select className="input-field text-sm py-1.5" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
                  <option value="">Todos los países</option>
                  {(stats?.byCountry ?? []).map((r) => (
                    <option key={r.country} value={r.country}>{r.country}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 min-w-[180px]">
                <label className="text-xs text-slate-500 font-medium">Deporte</label>
                <select className="input-field text-sm py-1.5" value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}>
                  <option value="">Todos los deportes</option>
                  {(stats?.bySport ?? []).map((r) => (
                    <option key={r.sport} value={r.sport}>{r.sport}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  className="btn-primary text-sm py-1.5 px-4 flex items-center gap-2"
                  onClick={() => setApplied({ country: countryFilter, sport: sportFilter })}
                >
                  <RefreshCw size={13} /> Aplicar filtros
                </button>
                {(applied.country || applied.sport) && (
                  <button
                    className="btn-secondary text-sm py-1.5 px-3"
                    onClick={() => { setCountryFilter(""); setSportFilter(""); setApplied({ country: "", sport: "" }); }}
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="card p-4 mb-5 flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-slate-600">
              Clubes seleccionados:{" "}
              <strong className="text-emerald-600 font-mono text-base">{stats ? fmtNum(selectedCount) : "—"}</strong>
              <span className="ml-4 text-xs text-slate-400">
                {applied.country || "Todos los países"} · {applied.sport || "Todos los deportes"}
              </span>
            </div>
            <button className="font-mono text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1" onClick={() => reloadStats()}>
              <RefreshCw size={11} /> {statsLoading ? "Actualizando…" : "Actualizar"}
            </button>
          </div>

          {/* Aggregate tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="card p-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Clubes por país</p>
              {filteredByCountry.length === 0 ? (
                <p className="text-sm text-slate-400">Sin registros</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {filteredByCountry.map((r) => (
                      <tr key={r.country} className="border-b border-slate-50 last:border-0">
                        <td className="py-1.5 text-slate-600">{r.country}</td>
                        <td className="py-1.5 text-right font-semibold text-slate-800 font-mono">{fmtNum(r._count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="card p-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Clubes por deporte</p>
              {filteredBySport.length === 0 ? (
                <p className="text-sm text-slate-400">Sin registros</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {filteredBySport.map((r) => (
                      <tr key={r.sport} className="border-b border-slate-50 last:border-0">
                        <td className="py-1.5 text-slate-600">{r.sport}</td>
                        <td className="py-1.5 text-right font-semibold text-slate-800 font-mono">{fmtNum(r._count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Export Format Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
            {EXPORT_FORMATS.map((fmt) => (
              <div key={fmt.name} className="card p-5 flex flex-col gap-3">
                <div className="text-2xl">{fmt.icon}</div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-700">{fmt.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fmt.tagColor}`}>{fmt.tag}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{fmt.desc}</p>
                <button
                  className={`${fmt.btnClass} text-sm py-2 w-full`}
                  onClick={() => handleExport(fmt.name)}
                  disabled={!stats}
                >
                  Exportar {fmt.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB 3: ASISTENTE ESG (Better Agent)
         ══════════════════════════════════════ */}
      {activeTab === "ai" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5">
          {/* Left Panel */}
          <div className="flex flex-col gap-4">
            {/* Prompt Input */}
            <div className="card p-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Tu consulta</p>
              <textarea
                className="input-field w-full text-sm resize-none"
                rows={5}
                placeholder="Ej: ¿Cómo priorizo los proyectos ESG de los clubes con menor puntaje ambiental?"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono text-xs text-slate-400">{aiPrompt.length}/1000</span>
                <div className="flex gap-2">
                  <button
                    className="btn-secondary text-xs py-1.5 px-3"
                    onClick={() => { setAiPrompt(""); setAiState("idle"); setAiResult(""); setAiError(""); }}
                  >
                    Limpiar
                  </button>
                  <button
                    className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 disabled:opacity-60"
                    onClick={handleRunAI}
                    disabled={aiState === "thinking" || !aiPrompt.trim()}
                  >
                    <Zap size={12} /> Consultar
                  </button>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="card p-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Destinatario del reporte</p>
              <div className="space-y-1.5">
                {AI_DESTINATIONS.map((d) => (
                  <label
                    key={d.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                      aiDestination === d.value
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "hover:bg-slate-50 text-slate-600 border border-transparent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="dest"
                      value={d.value}
                      checked={aiDestination === d.value}
                      onChange={() => setAiDestination(d.value)}
                      className="accent-emerald-500"
                    />
                    {d.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Suggested Prompts */}
            <div className="card p-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Prompts sugeridos</p>
              <div className="space-y-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <div
                    key={p.label}
                    className="p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 cursor-pointer transition-colors"
                    onClick={() => setAiPrompt(p.text)}
                  >
                    <p className="text-xs font-semibold text-emerald-700 mb-1">{p.label}</p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel — Output */}
          <div className="card p-0 flex flex-col overflow-hidden min-h-[600px]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                  <div className={`w-1.5 h-1.5 rounded-full ${aiState === "thinking" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                  Asistente ESG (Better Agent)
                </div>
                {aiState === "done" && aiEngine && (
                  <span className="font-mono text-xs text-slate-400">{aiEngine === "claude" ? "motor: Claude" : "motor: guía local"}</span>
                )}
              </div>
            </div>
            <div className="flex-1 p-5 overflow-y-auto">
              {aiState === "idle" && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-20">
                  <div className="text-5xl">🤖</div>
                  <p className="font-semibold text-slate-700">Asistente ESG (Better Agent)</p>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Escribe una consulta sobre el proceso ESG o selecciona un prompt sugerido para comenzar.
                  </p>
                </div>
              )}
              {aiState === "thinking" && (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                  <p className="font-mono text-xs text-slate-400">Consultando al Better Agent...</p>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {aiState === "error" && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-20">
                  <p className="font-semibold text-red-600">No se pudo obtener respuesta</p>
                  <p className="text-sm text-slate-400 max-w-xs">{aiError}</p>
                  <button className="btn-secondary text-xs py-1.5 px-3" onClick={handleRunAI}>Reintentar</button>
                </div>
              )}
              {aiState === "done" && (
                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {aiResult.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**"))
                      return <p key={i} className="font-bold text-slate-800 mt-4 mb-1">{line.replace(/\*\*/g, "")}</p>;
                    if (line.startsWith("→") || line.startsWith("- ") || line.startsWith("• "))
                      return <p key={i} className="flex gap-2"><span className="text-emerald-500 shrink-0">→</span>{line.replace(/^(→|-|•)\s*/, "")}</p>;
                    if (/^\d+\./.test(line))
                      return <p key={i} className="text-slate-600 ml-2">{line}</p>;
                    return line ? <p key={i}>{line}</p> : <br key={i} />;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB 4: REPORTE IA DEMO (solo demo)
         ══════════════════════════════════════ */}
      {/* ══════════════════════════════════════
          TAB 4: REPORTE IA DEMO
         ══════════════════════════════════════ */}
      {isDemo && activeTab === "report" && (
        <div>
          <ProposalBanner />
          {/* Report Header */}
          <div className="card p-5 mb-5 border-l-4 border-emerald-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-mono text-emerald-600 uppercase tracking-widest mb-1">Prompt ejecutado</p>
                <p className="text-sm text-slate-600 italic max-w-2xl">
                  &ldquo;Crúzame los datos de los clubes con mejor ranking ESG con la inversión de sus sponsors y dime cuáles fueron las 3 iniciativas que más engagement generaron en los hinchas.&rdquo;
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="btn-secondary text-xs py-1.5 px-3">📥 PDF</button>
                <button className="btn-secondary text-xs py-1.5 px-3">📊 XLSX</button>
                <button className="btn-primary text-xs py-1.5 px-3">🎯 PPT</button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                ["bg-emerald-100 text-emerald-700", "Score ESG: TOP 2"],
                ["bg-teal-100 text-teal-700", "Fuente: Dataset Chile 2026"],
                ["bg-amber-100 text-amber-700", "Destinatario: Marca Sponsor"],
                ["bg-violet-100 text-violet-700", "Modelo: Claude Sonnet 4"],
              ].map(([cls, label]) => (
                <span key={label} className={`text-xs px-2.5 py-1 rounded-full font-medium ${cls}`}>{label}</span>
              ))}
            </div>
          </div>

          {/* Club Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] gap-4 mb-6 items-start">
            {/* Club A */}
            <div className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-slate-800">🏉 Club A · Cox Rugby Club</p>
                  <p className="font-mono text-xs text-slate-400 mt-1">Chile · Rugby · Sponsor: Colbún</p>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-emerald-400 flex items-center justify-center shrink-0">
                  <div className="text-center">
                    <p className="font-mono font-bold text-emerald-600 text-sm leading-none">94.2</p>
                    <p className="font-mono text-[8px] text-slate-400">ESG</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs mb-4">
                {[
                  ["Sponsor principal", "Colbún"],
                  ["Inversión sponsor", "USD 80,000"],
                  ["Engagement fans", "42,500 interac."],
                  ["Socios activos", "1,240"],
                  ["ROI reputacional", "5.8x"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <strong className="text-slate-700">{v}</strong>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-2">Top 3 iniciativas</p>
              <div className="space-y-1.5">
                {[
                  ["1°", "Reciclaje en estadio · 18,200 participantes", "bg-emerald-500"],
                  ["2°", "Escuela deportiva inclusiva · 9,400 interac.", "bg-teal-500"],
                  ["3°", "Campaña energía limpia · 8,100 interac.", "bg-amber-500"],
                ].map(([pos, text, color]) => (
                  <div key={pos} className="flex items-center gap-2 text-xs">
                    <span className={`${color} text-white text-[9px] font-bold px-1.5 py-0.5 rounded`}>{pos}</span>
                    <span className="text-slate-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">VS</div>
              <div className="text-center">
                <p className="font-mono text-[9px] text-slate-400">Score diff</p>
                <p className="font-mono text-xs font-bold text-emerald-600">+2.4 pts</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-[9px] text-slate-400">Inversión</p>
                <p className="font-mono text-xs font-bold text-emerald-600">+$20K</p>
              </div>
            </div>

            {/* Club B */}
            <div className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-slate-800">⚽ Club B · Coquimbo Unido</p>
                  <p className="font-mono text-xs text-slate-400 mt-1">Chile · Fútbol · Sponsor: Banco Regional</p>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-teal-400 flex items-center justify-center shrink-0">
                  <div className="text-center">
                    <p className="font-mono font-bold text-teal-600 text-sm leading-none">91.8</p>
                    <p className="font-mono text-[8px] text-slate-400">ESG</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs mb-4">
                {[
                  ["Sponsor principal", "Banco Regional"],
                  ["Inversión sponsor", "USD 60,000"],
                  ["Engagement fans", "31,200 interac."],
                  ["Socios activos", "3,840"],
                  ["ROI reputacional", "4.2x"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <strong className="text-slate-700">{v}</strong>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-2">Top 3 iniciativas</p>
              <div className="space-y-1.5">
                {[
                  ["1°", "Reforestación comunitaria · 14,300 partic.", "bg-emerald-500"],
                  ["2°", "Deporte femenino · 10,200 interac.", "bg-teal-500"],
                  ["3°", "Reducción de plásticos · 6,100 interac.", "bg-amber-500"],
                ].map(([pos, text, color]) => (
                  <div key={pos} className="flex items-center gap-2 text-xs">
                    <span className={`${color} text-white text-[9px] font-bold px-1.5 py-0.5 rounded`}>{pos}</span>
                    <span className="text-slate-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="card p-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Engagement por iniciativa — Comparativa</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={compareEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="initiative" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clubA" name="Club A" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="clubB" name="Club B" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Relación Inversión → ROI Reputacional</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="roi" name="ROI Rep." fill="#a78bfa" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Conclusion */}
          <div className="card p-5 border-l-4 border-violet-400 bg-violet-50 mb-5">
            <p className="text-xs font-mono text-violet-600 uppercase tracking-widest mb-3">🤖 Conclusión estratégica — Bettersport AI</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              El <strong>Club A (Cox Rugby)</strong> presenta una mejor relación entre inversión ESG y engagement ciudadano, mostrando un{" "}
              <strong>ROI reputacional de 5.8x</strong> frente al 4.2x del Club B. La iniciativa de{" "}
              <strong>Reciclaje en Estadio</strong> generó el mayor nivel de participación directa (18,200 personas), lo que indica que las
              acciones visibles y participativas tienen mayor poder de conexión con hinchas.
              <br />
              <br />
              Para una <strong>marca sponsor interesada en sostenibilidad ambiental</strong>, el Club A ofrece mayor retorno por dólar
              invertido. El Club B, sin embargo, presenta una <strong>base de socios 3x mayor</strong> y mayor penetración en el ecosistema
              futbolístico, ideal para marcas con foco en alcance masivo.
            </p>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="card p-5 border-l-4 border-emerald-400">
              <p className="text-xs font-mono text-emerald-600 uppercase tracking-widest mb-3">Recomendación comercial</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Para una marca de <strong className="text-slate-800">energía renovable o medioambiente</strong>: priorizar Club A. Proponer
                co-producción de la campaña de reciclaje como activo compartido con medición de impacto en CO₂ evitado.
                <br />
                <br />
                Budget sugerido:{" "}
                <strong className="text-emerald-600">USD 80K–120K/año</strong> con acceso al panel ESG de Bettersport para reporting
                automático.
              </p>
            </div>
            <div className="card p-5 border-l-4 border-teal-400">
              <p className="text-xs font-mono text-teal-600 uppercase tracking-widest mb-3">Oportunidades detectadas por IA</p>
              <div className="space-y-2 text-sm text-slate-600">
                {[
                  "Ningún sponsor actual de Club A cubre el deporte femenino. Gap disponible para marca inclusiva.",
                  "Club B tiene reforestación sin sponsor visible. Oportunidad de naming para empresa forestal.",
                  "Ambos clubes tienen audiencias con 67%+ de preferencia por marcas sostenibles.",
                  "El engagement del Club A creció +34% en el último trimestre. Momento de entrada ideal.",
                ].map((item) => (
                  <div key={item} className="flex gap-2">
                    <span className="text-emerald-500 shrink-0">→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="card p-5">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
              Datos completos — Cruce ESG × Sponsor × Engagement
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    {["Club", "Deporte", "Score ESG", "Pilar A", "Pilar S", "Pilar G", "Sponsor", "Inversión USD", "Engagement", "ROI Rep.", "Top Iniciativa"].map(
                      (h) => (
                        <th key={h} className="text-left py-2 px-2 font-mono text-slate-400 font-medium whitespace-nowrap">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Cox Rugby Club", "Rugby", "94.2", "91.4", "96.8", "94.1", "Colbún", "80,000", "42,500", "5.8x", "Reciclaje Estadio"],
                    ["Coquimbo Unido", "Fútbol", "91.8", "88.2", "94.1", "93.2", "Banco Regional", "60,000", "31,200", "4.2x", "Reforestación"],
                    ["Club Deportivo X", "Tenis", "88.4", "85.1", "90.2", "89.8", "Sin sponsor", "0", "12,400", "—", "Energía solar"],
                    ["Fed. Rugby Chile", "Rugby", "86.9", "90.2", "84.1", "86.5", "Scotiabank", "40,000", "28,700", "3.9x", "Carbono neutro"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-slate-50 hover:bg-slate-50">
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          className={`py-2 px-2 ${i === 2 || i === 7 || i === 8 || i === 9 ? "font-semibold text-emerald-600" : "text-slate-600"} ${i === 0 ? "font-medium text-slate-800" : ""}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB 5: DATA SCHEMA (solo demo)
         ══════════════════════════════════════ */}
      {/* ══════════════════════════════════════
          TAB 5: DATA SCHEMA
         ══════════════════════════════════════ */}
      {isDemo && activeTab === "schema" && (
        <div>
          <ProposalBanner />
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">
              17 entidades principales · PostgreSQL · Relaciones y trazabilidad histórica
            </p>
            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {SCHEMA_TABLES.length} tablas
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SCHEMA_TABLES.map((t) => (
              <SchemaTableCard key={t.name} table={t} />
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB 6: CRUCES ESTRATÉGICOS (solo demo)
         ══════════════════════════════════════ */}
      {/* ══════════════════════════════════════
          TAB 6: CRUCES ESTRATÉGICOS
         ══════════════════════════════════════ */}
      {isDemo && activeTab === "crosses" && (
        <div>
          <ProposalBanner />
          <p className="text-sm text-slate-500 mb-5">
            11 cruces clave que generan valor para sponsors, gobierno y clubes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STRATEGIC_CROSSES.map((c) => {
              const colorMap: Record<string, string> = {
                emerald: "border-l-emerald-400 bg-emerald-50",
                teal: "border-l-teal-400 bg-teal-50",
                amber: "border-l-amber-400 bg-amber-50",
                violet: "border-l-violet-400 bg-violet-50",
                slate: "",
              };
              const labelMap: Record<string, string> = {
                emerald: "text-emerald-600",
                teal: "text-teal-600",
                amber: "text-amber-600",
                violet: "text-violet-600",
                slate: "text-slate-400",
              };

              return (
                <div key={c.num} className={`card p-5 border-l-4 ${colorMap[c.color]}`}>
                  <p className={`text-xs font-mono uppercase tracking-widest mb-1 ${labelMap[c.color]}`}>
                    {c.num} · {c.audience}
                  </p>
                  <p className="font-semibold text-slate-800 mb-2">{c.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3">{c.desc}</p>
                  <div className="bg-slate-800 rounded-lg px-3 py-2">
                    <code className="font-mono text-xs text-teal-300">{c.query}</code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB 7: API REFERENCE (solo demo)
         ══════════════════════════════════════ */}
      {/* ══════════════════════════════════════
          TAB 7: API REFERENCE
         ══════════════════════════════════════ */}
      {isDemo && activeTab === "api" && (
        <div>
          <ProposalBanner />
          <p className="text-sm text-slate-500 mb-5">
            REST API v1 · Base URL: <code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">https://api.bettersport.app/v1</code>
          </p>
          <div className="space-y-4">
            {[
              {
                method: "GET",
                path: "/clubs",
                desc: "Lista clubes con filtros de país, deporte, score ESG mínimo y temporada",
                params: ["country (ISO2)", "sport (slug)", "esg_min (int)", "season (year)", "include (comma list)", "format (json|csv)"],
                response: '{ "total": 1247, "data": [{ "id": "...", "name": "...", "esg_score": 94.2 }] }',
              },
              {
                method: "GET",
                path: "/clubs/:id/esg",
                desc: "Score ESG detallado de un club por temporada con historial",
                params: ["season (year)", "include=history,pillars"],
                response: '{ "club_id": "...", "score": 94.2, "env": 91.4, "social": 96.8, "gov": 94.1 }',
              },
              {
                method: "GET",
                path: "/brands",
                desc: "Lista marcas sponsors con inversión activa y campañas",
                params: ["industry (slug)", "country (ISO2)", "active (bool)", "esg_focus (slug)"],
                response: '{ "total": 183, "data": [{ "id": "...", "name": "...", "investment": 80000 }] }',
              },
              {
                method: "POST",
                path: "/ai/query",
                desc: "Ejecuta una consulta en lenguaje natural contra el dataset completo",
                params: ["prompt (string)", "destination (enum)", "format (json|pdf|xlsx)", "context (object)"],
                response: '{ "result": "...", "tokens_used": 1240, "model": "claude-sonnet-4" }',
              },
              {
                method: "GET",
                path: "/exports/:id",
                desc: "Estado y descarga de un export generado previamente",
                params: ["format (csv|xlsx|json|pdf|ppt)"],
                response: '{ "status": "ready", "file_url": "https://...", "expires_at": "..." }',
              },
              {
                method: "GET",
                path: "/rankings",
                desc: "Ranking ESG global o filtrado por país, deporte, temporada",
                params: ["country (ISO2)", "sport (slug)", "season (year)", "limit (int)"],
                response: '{ "season": "2026", "data": [{ "position": 1, "club_id": "...", "score": 94.2 }] }',
              },
            ].map((ep) => (
              <div key={ep.path} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                      ep.method === "GET"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <code className="font-mono text-sm text-slate-700">{ep.path}</code>
                </div>
                <p className="text-sm text-slate-500 mb-3">{ep.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">Parámetros</p>
                    <div className="space-y-1">
                      {ep.params.map((p) => (
                        <div key={p} className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">Respuesta ejemplo</p>
                    <pre className="font-mono text-xs text-teal-600 bg-slate-800 p-3 rounded-lg overflow-x-auto leading-relaxed whitespace-pre-wrap">
                      {ep.response}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
