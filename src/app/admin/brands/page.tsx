"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, BarChart3, Users, Tv, FileText, ClipboardList,
  Check, Save, CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Building2, Edit3,
} from "lucide-react";
import type { BrandConfig, DataSource, SponsorshipObjective, BrandKPI } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import toast from "react-hot-toast";

type BrandUser = {
  id: string;
  name: string;
  email: string;
  country?: string | null;
  org?: string | null;
  demo?: boolean;
  createdAt?: string;
  brandConfig?: (Partial<BrandConfig> & { kpis?: unknown }) | null;
  _count?: { brandProjects: number };
};

const EMPTY_USERS: BrandUser[] = [];

// ── constants ─────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  "Banca y finanzas","Telecomunicaciones","Bebidas y alimentos",
  "Retail y consumo","Tecnología","Seguros","Energía","Automotriz","Otro",
];
const COUNTRIES = ["Argentina","Brasil","Chile","Colombia","México","Perú","Uruguay","Otro"];
const SPONSORSHIP_TYPES = [
  "Torneo / competencia internacional","Liga nacional","Club deportivo",
  "Selección nacional","Atleta individual","Federación deportiva","Evento único",
];
const TERRITORIES = ["Nacional","Regional (Latinoamérica)","Global","Ciudad específica"];
const SPORTS = ["Fútbol","Básquetbol","Tenis","Automovilismo","Atletismo","Rugby","Ciclismo","Natación","Otro"];

const OBJECTIVE_LABELS: Record<SponsorshipObjective, string> = {
  reconocimiento_marca: "Reconocimiento de marca",
  engagement_digital:   "Engagement digital",
  generacion_leads:     "Generación de leads",
  ventas_directas:      "Ventas directas",
  reputacion_esg:       "Reputación / ESG",
  fidelizacion:         "Fidelización de clientes",
  lanzamiento_producto: "Lanzamiento de producto",
  expansion_mercados:   "Expansión a nuevos mercados",
};

const DATA_SOURCES: { id: DataSource; label: string; desc: string; Icon: React.ElementType }[] = [
  { id: "redes_sociales",       label: "Redes sociales",       desc: "Instagram, TikTok, X, YouTube",    Icon: Globe        },
  { id: "web_analytics",        label: "Web analytics",        desc: "Google Analytics, tráfico UTM",     Icon: BarChart3    },
  { id: "crm",                  label: "CRM",                  desc: "HubSpot, Salesforce, etc.",         Icon: Users        },
  { id: "medios_tradicionales", label: "Medios tradicionales", desc: "TV, radio, prensa digital",         Icon: Tv           },
  { id: "datos_evento",         label: "Datos del evento",     desc: "Asistencia, streaming, pantallas",  Icon: ClipboardList },
  { id: "encuestas",            label: "Encuestas",            desc: "Brand lift, NPS pre/post evento",   Icon: FileText     },
];

const DEFAULT_KPIS: BrandKPI[] = [
  { id: "impresiones", name: "Impresiones totales",                category: "visibilidad", badge: "reach",     enabled: true  },
  { id: "alcance",     name: "Alcance único",                      category: "visibilidad", badge: "reach",     enabled: true  },
  { id: "emv",         name: "Valor equivalente de medios (EMV)",  category: "visibilidad", badge: "roi",       enabled: true  },
  { id: "pantalla",    name: "Tiempo en pantalla del logo",        category: "visibilidad", badge: "TV/stream", enabled: false },
  { id: "frecuencia",  name: "Frecuencia promedio de exposición",  category: "visibilidad", badge: "reach",     enabled: false },
  { id: "engagements", name: "Engagements totales",                category: "engagement",  badge: "social",    enabled: true  },
  { id: "er",          name: "Tasa de engagement (ER)",            category: "engagement",  badge: "social",    enabled: true  },
  { id: "sov",         name: "Share of voice entre patrocinadores",category: "engagement",  badge: "medios",    enabled: false },
  { id: "menciones",   name: "Menciones orgánicas de marca",       category: "engagement",  badge: "social",    enabled: false },
  { id: "sentimiento", name: "Sentimiento positivo en menciones",  category: "reputacion",  badge: "NLP",       enabled: true  },
  { id: "brandlift",   name: "Brand lift (encuesta pre/post)",     category: "reputacion",  badge: "encuesta",  enabled: false },
  { id: "asociacion",  name: "Asociación positiva con el deporte", category: "reputacion",  badge: "encuesta",  enabled: false },
  { id: "visitas",     name: "Visitas web atribuidas al patrocinio",category:"conversion",   badge: "analytics", enabled: true  },
  { id: "leads",       name: "Leads generados",                    category: "conversion",  badge: "crm",       enabled: true  },
  { id: "conversiones",name: "Conversiones / ventas atribuidas",   category: "conversion",  badge: "crm",       enabled: false },
  { id: "cpc",         name: "Costo por conversión",               category: "conversion",  badge: "roi",       enabled: false },
  { id: "roi",         name: "ROI total del patrocinio",           category: "conversion",  badge: "roi",       enabled: true  },
];

const KPI_CATEGORY_LABELS = {
  visibilidad: "Visibilidad de marca",
  engagement:  "Engagement digital",
  reputacion:  "Reputación e imagen",
  conversion:  "Conversión y ROI",
};

const EMPTY_CONFIG: BrandConfig = {
  brandName: "", industry: "", country: "", website: "",
  objectives: [], sponsorshipName: "", sponsorshipType: "",
  startDate: "", endDate: "", budget: "", territory: "", sports: [],
  dataSources: [], kpis: DEFAULT_KPIS,
};

const TABS = [
  { id: "perfil",     label: "Perfil de marca" },
  { id: "patrocinio", label: "Patrocinio"       },
  { id: "fuentes",    label: "Fuentes"          },
  { id: "kpis",       label: "KPIs"             },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function normalizeConfig(raw: BrandUser["brandConfig"]): BrandConfig {
  if (!raw) return EMPTY_CONFIG;
  const kpis = Array.isArray(raw.kpis) && raw.kpis.length ? (raw.kpis as BrandKPI[]) : DEFAULT_KPIS;
  return {
    brandName: raw.brandName ?? "", industry: raw.industry ?? "", country: raw.country ?? "", website: raw.website ?? "",
    objectives: (raw.objectives ?? []) as SponsorshipObjective[],
    sponsorshipName: raw.sponsorshipName ?? "", sponsorshipType: raw.sponsorshipType ?? "",
    startDate: raw.startDate ?? "", endDate: raw.endDate ?? "", budget: raw.budget ?? "", territory: raw.territory ?? "",
    sports: raw.sports ?? [], dataSources: (raw.dataSources ?? []) as DataSource[], kpis,
  };
}

function completionOf(cfg: BrandConfig) {
  return [
    cfg.brandName && cfg.industry && cfg.country,
    cfg.sponsorshipName && cfg.sponsorshipType,
    cfg.dataSources.length > 0,
    cfg.kpis.some((k) => k.enabled),
  ].filter(Boolean).length;
}

// ── small UI atoms ────────────────────────────────────────────────────────────

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
      style={active
        ? { background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.4)", color: "#34d399" }
        : { backgroundColor: "#10151f", borderColor: "#232c3a", color: "#a8b3c4" }
      }>
      {children}
    </button>
  );
}

function ToggleSwitch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200"
      style={{ backgroundColor: on ? "#10B981" : "#2a3442" }}
      role="switch" aria-checked={on}>
      <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: on ? "translateX(16px)" : "translateX(0)" }} />
    </button>
  );
}

// ── brand config form ─────────────────────────────────────────────────────────

function BrandForm({
  cfg, setCfg, onSave, readOnly = false, saving = false,
}: {
  cfg: BrandConfig;
  setCfg: React.Dispatch<React.SetStateAction<BrandConfig>>;
  onSave: () => void;
  readOnly?: boolean;
  saving?: boolean;
}) {
  const [tab, setTab] = useState("perfil");

  const set = <K extends keyof BrandConfig>(k: K, v: BrandConfig[K]) => {
    if (readOnly) return;
    setCfg((c) => ({ ...c, [k]: v }));
  };

  const toggleKPI = (id: string) => {
    if (readOnly) return;
    setCfg((c) => ({ ...c, kpis: c.kpis.map((k) => k.id === id ? { ...k, enabled: !k.enabled } : k) }));
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={tab === t.id
              ? { backgroundColor: "#161d29", color: "#f4f7fb", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
              : { color: "#94A3B8" }}>
            {t.label}
          </button>
        ))}
      </div>

      <fieldset disabled={readOnly} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 disabled:opacity-80">

        {/* PERFIL */}
        {tab === "perfil" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Nombre de la marca *</label>
                <input className="input-field w-full" placeholder="Ej: Banco Itaú" value={cfg.brandName} onChange={(e) => set("brandName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Industria *</label>
                <select className="input-field w-full" value={cfg.industry} onChange={(e) => set("industry", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">País *</label>
                <select className="input-field w-full" value={cfg.country} onChange={(e) => set("country", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Sitio web</label>
                <input className="input-field w-full" placeholder="www.marca.com" value={cfg.website} onChange={(e) => set("website", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Objetivos del patrocinio</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(OBJECTIVE_LABELS) as SponsorshipObjective[]).map((obj) => (
                  <Chip key={obj} active={cfg.objectives.includes(obj)} onClick={() => set("objectives", toggle(cfg.objectives, obj))}>
                    {OBJECTIVE_LABELS[obj]}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PATROCINIO */}
        {tab === "patrocinio" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Nombre del patrocinio *</label>
                <input className="input-field w-full" placeholder="Ej: Copa Libertadores 2025" value={cfg.sponsorshipName} onChange={(e) => set("sponsorshipName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Tipo de propiedad *</label>
                <select className="input-field w-full" value={cfg.sponsorshipType} onChange={(e) => set("sponsorshipType", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {SPONSORSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Fecha inicio</label>
                <input className="input-field w-full" placeholder="Ej: Marzo 2025" value={cfg.startDate} onChange={(e) => set("startDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Fecha término</label>
                <input className="input-field w-full" placeholder="Ej: Noviembre 2025" value={cfg.endDate} onChange={(e) => set("endDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Inversión total (USD)</label>
                <input className="input-field w-full" placeholder="Ej: 1,250,000" value={cfg.budget} onChange={(e) => set("budget", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Territorio</label>
                <select className="input-field w-full" value={cfg.territory} onChange={(e) => set("territory", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {TERRITORIES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Deporte(s)</label>
              <div className="flex flex-wrap gap-2">
                {SPORTS.map((s) => (
                  <Chip key={s} active={cfg.sports.includes(s)} onClick={() => set("sports", toggle(cfg.sports, s))}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FUENTES */}
        {tab === "fuentes" && (
          <div className="grid grid-cols-2 gap-3">
            {DATA_SOURCES.map(({ id, label, desc, Icon }) => {
              const active = cfg.dataSources.includes(id);
              return (
                <button key={id}
                  onClick={() => set("dataSources", toggle(cfg.dataSources, id) as DataSource[])}
                  className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                  style={active
                    ? { backgroundColor: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.35)" }
                    : { backgroundColor: "#10151f", borderColor: "#232c3a" }
                  }>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={active
                      ? { background: "linear-gradient(135deg,#10B981,#06B6D4)", color: "#fff" }
                      : { backgroundColor: "#161d29", color: "#94A3B8" }
                    }>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{label}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={active ? { background: "#10B981", borderColor: "#10B981" } : { borderColor: "#2a3442" }}>
                    {active && <Check size={10} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* KPIS */}
        {tab === "kpis" && (
          <div className="space-y-5">
            {(["visibilidad","engagement","reputacion","conversion"] as const).map((cat) => (
              <div key={cat}>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-200 pb-1.5 mb-1">
                  {KPI_CATEGORY_LABELS[cat]}
                </p>
                {cfg.kpis.filter((k) => k.category === cat).map((kpi) => (
                  <div key={kpi.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                    <span className="flex-1 text-sm text-slate-700">{kpi.name}</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{kpi.badge}</span>
                    <ToggleSwitch on={kpi.enabled} onClick={() => toggleKPI(kpi.id)} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {readOnly ? (
        <p className="text-xs text-slate-400 text-right">Vista de solo lectura: solo la cuenta de la marca puede editar su configuración.</p>
      ) : (
        <div className="flex justify-end">
          <button onClick={onSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
            <Save size={14} /> {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── main admin page ───────────────────────────────────────────────────────────

export default function AdminBrandsPage() {
  const { activeUser, loaded } = useUser();

  const { data: brandUsers, loading, reload } = useResource<BrandUser[]>(
    loaded && activeUser ? "/api/admin/brands" : null, EMPTY_USERS,
  );

  const [configs, setConfigs] = useState<Record<string, BrandConfig>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Seed local editable configs from the fetched brand users
  useEffect(() => {
    if (!brandUsers.length) return;
    setConfigs((prev) => {
      const next = { ...prev };
      for (const u of brandUsers) {
        if (!next[u.id]) next[u.id] = normalizeConfig(u.brandConfig);
      }
      return next;
    });
  }, [brandUsers]);

  const handleSave = async (userId: string) => {
    const cfg = configs[userId];
    if (!cfg) return;
    if (userId !== activeUser?.id) {
      toast.error("Solo la cuenta de la marca puede editar su configuración");
      return;
    }
    setSaving(true);
    try {
      await apiSend("/api/brand-config", "PUT", cfg);
      await reload();
      toast.success("Configuración guardada correctamente");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const completeCount = brandUsers.filter((u) => u.brandConfig && u.brandConfig.brandName).length;

  const setUserCfg = (userId: string, cfg: BrandConfig) => {
    setConfigs((prev) => ({ ...prev, [userId]: cfg }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-mono tracking-widest uppercase text-teal-600 mb-1">Administración</p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de marcas</h1>
        <p className="text-sm text-slate-400 mt-1">
          Revisa y completa la configuración de patrocinio de cada marca en la plataforma
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Marcas registradas",       value: brandUsers.length,                     color: "#3B82F6" },
          { label: "Configuraciones completas", value: completeCount,                         color: "#10B981" },
          { label: "Pendientes de completar",   value: brandUsers.length - completeCount,     color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="card p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full rounded-l" style={{ backgroundColor: s.color }} />
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Brand list */}
      <div className="space-y-3">
        {brandUsers.length === 0 && (
          <div className="card p-10 text-center text-slate-400">
            <Building2 size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">{loading ? "Cargando cuentas de marca…" : "No hay cuentas de marca registradas todavía."}</p>
          </div>
        )}
        {brandUsers.map((user) => {
          const cfg = configs[user.id];
          if (!cfg) return null;
          const done  = completionOf(cfg);
          const total = TABS.length;
          const isOpen = expanded === user.id;
          const isMine = user.id === activeUser?.id;

          return (
            <motion.div
              key={user.id}
              layout
              className="card overflow-hidden"
            >
              {/* Brand row */}
              <button
                onClick={() => setExpanded(isOpen ? null : user.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#8B5CF6,#6366F1)" }}>
                  {user.name[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-400">
                    {user.email} · {cfg.brandName || <span className="text-amber-500">Sin nombre de marca</span>}
                    {typeof user._count?.brandProjects === "number" && <> · {user._count.brandProjects} proyecto{user._count.brandProjects === 1 ? "" : "s"}</>}
                  </p>
                </div>

                {/* Completion */}
                <div className="flex items-center gap-3 mr-2">
                  <div className="w-24 h-1.5 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(done / total) * 100}%`,
                        background: done === total ? "#10B981" : "#F59E0B",
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-16 text-right"
                    style={{ color: done === total ? "#34d399" : "#D97706" }}>
                    {done}/{total}
                  </span>
                  {done === total
                    ? <CheckCircle2 size={16} className="text-teal-500 flex-shrink-0" />
                    : <AlertCircle  size={16} className="text-amber-400 flex-shrink-0" />}
                </div>

                {/* Expand icon */}
                <div className="flex items-center gap-2 text-teal-600">
                  <Edit3 size={14} />
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Expanded form */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-slate-100"
                  >
                    <div className="px-6 py-5">
                      {/* Context info */}
                      <div className="flex items-center gap-3 mb-5 p-3 rounded-xl"
                        style={{ backgroundColor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
                        <Building2 size={16} className="text-indigo-500 flex-shrink-0" />
                        <p className="text-xs text-indigo-600">
                          {isMine ? "Editando" : "Viendo"} configuración de <strong>{user.name}</strong> ({user.email}){user.org ? ` · ${user.org}` : ""}{user.country ? ` · ${user.country}` : ""}
                        </p>
                      </div>

                      <BrandForm
                        cfg={cfg}
                        setCfg={(updater) => {
                          const next = typeof updater === "function" ? updater(cfg) : updater;
                          setUserCfg(user.id, next);
                        }}
                        onSave={() => handleSave(user.id)}
                        readOnly={!isMine}
                        saving={saving}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
