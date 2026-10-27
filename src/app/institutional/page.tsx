"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Landmark, Building2, Trophy, CalendarDays, KeyRound, Download,
  FileText, Globe2, Info, Leaf, Users, Scale,
} from "lucide-react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { SectionHeader } from "@/components/ui";
import { CountUp } from "@/components/fx";
import { TipShell, TipRow, TipTitle, RankBar } from "@/components/viz";
import { useUser } from "@/lib/userContext";
import { useResource } from "@/lib/useResource";
import { cn } from "@/lib/utils";

interface Overview {
  reporting: { clubs: number; federations: number; events: number };
  registered: { clubs: number; federations: number; events: number };
  licenses: { active: number; investment: number };
  investment: {
    total: number;
    executed: number;
    byPillar: { pillar: "ambiental" | "social" | "gobernanza"; amount: number }[];
  };
  ranking: {
    clubs: { id: string; name: string; sport: string; country: string; flag: string; esgScore: number }[];
    federations: { id: string; name: string; sport: string; country: string; flag: string; esgScore: number }[];
  };
  benchmark: { country: string; flag: string; score: number; isChile: boolean; reference: boolean }[];
  regionAverage: number;
  generatedAt: string;
}

const clp = (n: number) => `$${Math.round(n).toLocaleString("es-CL")}`;

const PILLARS = {
  ambiental: { label: "Ambiental", color: "#34d399", Icon: Leaf },
  social: { label: "Social", color: "#60a5fa", Icon: Users },
  gobernanza: { label: "Gobernanza", color: "#a78bfa", Icon: Scale },
} as const;

type PillarKey = keyof typeof PILLARS | "todos";

export default function InstitutionalPage() {
  const { activeUser, loaded } = useUser();
  const { data } = useResource<Overview | null>(loaded && activeUser ? "/api/institutional" : null, null);
  const [pillar, setPillar] = useState<PillarKey>("todos");
  const [rankTab, setRankTab] = useState<"clubs" | "federations">("clubs");

  const shown = data?.investment.byPillar.filter((p) => pillar === "todos" || p.pillar === pillar) ?? [];
  const shownTotal = shown.reduce((s, p) => s + p.amount, 0);

  const tiles = [
    { label: "Clubes reportando", value: data?.reporting.clubs ?? 0, of: data?.registered.clubs ?? 0, Icon: Building2, color: "#22d3ee" },
    { label: "Federaciones reportando", value: data?.reporting.federations ?? 0, of: data?.registered.federations ?? 0, Icon: Trophy, color: "#34d399" },
    { label: "Eventos reportando", value: data?.reporting.events ?? 0, of: data?.registered.events ?? 0, Icon: CalendarDays, color: "#fbbf24" },
    { label: "Licencias activas", value: data?.licenses.active ?? 0, of: null, Icon: KeyRound, color: "#a78bfa" },
  ];

  const ranking = rankTab === "clubs" ? data?.ranking.clubs ?? [] : data?.ranking.federations ?? [];
  const maxScore = ranking[0]?.esgScore || 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        icon={<Landmark size={22} className="text-teal-600" />}
        title="Panel institucional"
        subtitle="Estado del deporte sostenible nacional — Ministerio del Deporte y Comité Olímpico"
        action={
          <span className="eyebrow">
            {data ? `Actualizado ${new Date(data.generatedAt).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}` : "Cargando…"}
          </span>
        }
      />

      {/* ── Conteos ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card glass-hover p-6">
            <div className="flex items-start justify-between mb-3">
              <p className="eyebrow">{t.label}</p>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ color: t.color, backgroundColor: `${t.color}14`, border: `1px solid ${t.color}30` }}>
                <t.Icon size={16} />
              </span>
            </div>
            <p className="text-3xl font-extrabold tnum" style={{ color: "#f4f7fb" }}>
              <CountUp to={t.value} />
            </p>
            {t.of !== null && (
              <p className="text-xs mt-1" style={{ color: "#6b7789" }}>de {t.of} registrados</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Inversión en deporte sostenible ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
          <div>
            <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Inversión en deporte sostenible</h3>
            <p className="text-xs mt-1" style={{ color: "#6b7789" }}>Presupuesto comprometido en proyectos ESG, abierto por pilar</p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["todos", "ambiental", "social", "gobernanza"] as PillarKey[]).map((p) => {
              const active = pillar === p;
              const color = p === "todos" ? "#22d3ee" : PILLARS[p].color;
              return (
                <button
                  key={p}
                  onClick={() => setPillar(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={active
                    ? { color, backgroundColor: `${color}1f`, border: `1px solid ${color}55` }
                    : { color: "#8b95a5", backgroundColor: "#10151f", border: "1px solid #232c3a" }}
                >
                  {p === "todos" ? "Todos" : PILLARS[p].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center">
          <div>
            <p className="eyebrow mb-2">{pillar === "todos" ? "Total comprometido" : PILLARS[pillar].label}</p>
            <p className="text-4xl font-extrabold tnum" style={{ color: "#f4f7fb" }}>
              <CountUp to={shownTotal} prefix="$" />
            </p>
            <p className="text-xs mt-2" style={{ color: "#6b7789" }}>
              Ejecutado a la fecha: <span className="font-mono" style={{ color: "#2dd4bf" }}>{clp(data?.investment.executed ?? 0)}</span>
            </p>
          </div>

          <div className="space-y-4">
            {shown.map((p, i) => {
              const cfg = PILLARS[p.pillar];
              const max = Math.max(...(data?.investment.byPillar.map((x) => x.amount) ?? [1]), 1);
              return (
                <div key={p.pillar} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ color: cfg.color, backgroundColor: `${cfg.color}14`, border: `1px solid ${cfg.color}30` }}>
                    <cfg.Icon size={13} />
                  </span>
                  <span className="w-24 text-xs font-medium flex-shrink-0" style={{ color: "#a8b3c4" }}>{cfg.label}</span>
                  <RankBar pct={(p.amount / max) * 100} color={cfg.color} delay={0.3 + i * 0.1} />
                  <span className="w-28 text-right font-mono text-xs font-semibold tnum flex-shrink-0" style={{ color: "#f4f7fb" }}>
                    {clp(p.amount)}
                  </span>
                </div>
              );
            })}
            {shownTotal === 0 && (
              <p className="text-sm" style={{ color: "#6b7789" }}>
                Aún no hay presupuesto ESG registrado para este pilar.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Ranking + Benchmark ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-7">
        {/* Ranking */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-7">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Ranking ESG</h3>
            <div className="flex gap-1.5">
              {([["clubs", "Clubes"], ["federations", "Federaciones"]] as const).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setRankTab(k)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={rankTab === k
                    ? { color: "#22d3ee", backgroundColor: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.35)" }
                    : { color: "#8b95a5", backgroundColor: "#10151f", border: "1px solid #232c3a" }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {ranking.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="w-6 text-right flex-shrink-0 font-mono text-[11px] tnum" style={{ color: i < 3 ? "#22d3ee" : "#6b7789" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="w-40 text-xs font-medium truncate flex-shrink-0" style={{ color: "#a8b3c4" }}>{c.name}</span>
                <RankBar pct={(c.esgScore / maxScore) * 100} color="#22d3ee" delay={0.4 + i * 0.05} />
                <span className="w-11 text-right font-mono text-xs font-semibold tnum flex-shrink-0" style={{ color: "#f4f7fb" }}>
                  {c.esgScore.toFixed(1)}
                </span>
              </div>
            ))}
            {ranking.length === 0 && (
              <p className="text-sm py-6 text-center" style={{ color: "#6b7789" }}>
                {rankTab === "clubs" ? "Aún no hay clubes con puntaje ESG." : "Aún no hay federaciones registradas con puntaje ESG."}
              </p>
            )}
          </div>
        </motion.div>

        {/* Benchmark regional */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-7">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "#f4f7fb" }}>
                <Globe2 size={16} className="text-teal-600" /> Benchmark regional
              </h3>
              <p className="text-xs mt-1" style={{ color: "#6b7789" }}>Chile frente a Sudamérica y al promedio</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.benchmark ?? []} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="#1c2431" vertical={false} />
              <XAxis dataKey="country" tick={{ fill: "#8b95a5", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "#2a3442" }} tickLine={false} interval={0} />
              <YAxis tick={{ fill: "#8b95a5", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} domain={[0, 100]} width={34} />
              <Tooltip
                cursor={{ fill: "rgba(34,211,238,0.06)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as Overview["benchmark"][number];
                  return (
                    <TipShell>
                      <TipTitle>{d.flag} {d.country}</TipTitle>
                      <TipRow color={d.isChile ? "#22d3ee" : "#566173"} label="Puntaje ESG" value={d.score.toFixed(1)} />
                      {d.reference && <p className="text-[10px] mt-1.5" style={{ color: "#6b7789" }}>Valor de referencia</p>}
                    </TipShell>
                  );
                }}
              />
              <ReferenceLine y={data?.regionAverage ?? 0} stroke="#fbbf24" strokeDasharray="4 4" />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {(data?.benchmark ?? []).map((b) => (
                  <Cell key={b.country} fill={b.isChile ? "#22d3ee" : "#2a3442"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#8b95a5" }}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#22d3ee" }} /> Chile (datos de la plataforma)
            </span>
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#8b95a5" }}>
              <span className="w-4 h-0.5" style={{ backgroundColor: "#fbbf24" }} /> Promedio regional {data?.regionAverage ?? 0}
            </span>
          </div>

          <p className="flex items-start gap-2 text-[11px] mt-4 pt-4" style={{ color: "#6b7789", borderTop: "1px solid #161d29" }}>
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            Los puntajes de los demás países son valores de referencia, a la espera de una fuente oficial acordada. El de Chile se calcula con los datos reales de la plataforma.
          </p>
        </motion.div>
      </div>

      {/* ── Reportes Bettersport Index ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ color: "#a78bfa", backgroundColor: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.28)" }}>
              <FileText size={22} />
            </span>
            <div>
              <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Reportes Bettersport Index</h3>
              <p className="text-sm mt-1 max-w-xl" style={{ color: "#8b95a5" }}>
                Informes consolidados del desempeño ESG del deporte nacional, listos para descargar y presentar.
              </p>
            </div>
          </div>
          <button
            disabled
            className={cn("btn-secondary !rounded-xl opacity-60 cursor-not-allowed")}
            title="Disponible cuando se defina la metodología del índice"
          >
            <Download size={15} /> Descargar informe
          </button>
        </div>
        <p className="flex items-start gap-2 text-[11px] mt-5 pt-5" style={{ color: "#6b7789", borderTop: "1px solid #161d29" }}>
          <Info size={12} className="flex-shrink-0 mt-0.5" />
          Pendiente la definición de la metodología del índice. La sección queda lista para conectar los informes cuando esté acordada.
        </p>
      </motion.div>
    </div>
  );
}
