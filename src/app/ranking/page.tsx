"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Filter, ChevronDown, Info, TrendingUp, BarChart3,
  Globe, Users, Award, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import { SectionHeader, ProgressBar, Tabs } from "@/components/ui";
import { mockClubs } from "@/lib/data";
import { cn, getRankingMedal } from "@/lib/utils";
import type { Club } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const entityTypes = ["Clubes", "Federaciones", "Eventos", "Venues / Recintos"] as const;
type EntityType = typeof entityTypes[number];

const countryFilters = ["Todos", "Chile", "Argentina", "España", "Colombia", "México", "Uruguay", "Perú"];
const sportFilters = ["Todos", "Fútbol", "Rugby", "Pádel", "Natación", "Tenis", "Atletismo"];

const entityTypeConfig: Record<EntityType, { icon: string; color: string; placeholder: string }> = {
  Clubes: { icon: "🏅", color: "#10B981", placeholder: "" },
  Federaciones: { icon: "🏛️", color: "#06B6D4", placeholder: "El ranking de Federaciones estará disponible próximamente." },
  Eventos: { icon: "📅", color: "#8B5CF6", placeholder: "El ranking de Eventos sostenibles estará disponible próximamente." },
  "Venues / Recintos": { icon: "🏟️", color: "#F59E0B", placeholder: "El ranking de Venues y Recintos estará disponible próximamente." },
};

const ponderacion = [
  { name: "Impacto ambiental", weight: 40, color: "#10B981" },
  { name: "Impacto social", weight: 30, color: "#06B6D4" },
  { name: "Gobernanza", weight: 20, color: "#8B5CF6" },
  { name: "Transparencia", weight: 10, color: "#F59E0B" },
];

export default function RankingPage() {
  const [entityType, setEntityType] = useState<EntityType>("Clubes");
  const [countryFilter, setCountryFilter] = useState("Todos");
  const [sportFilter, setSportFilter] = useState("Todos");
  const [showMethodology, setShowMethodology] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const filtered = mockClubs.filter((c) => {
    const matchCountry = countryFilter === "Todos" || c.country === countryFilter;
    const matchSport = sportFilter === "Todos" || c.sport === sportFilter;
    return matchCountry && matchSport;
  });

  const topClub = filtered[0];

  const getRankChange = (rank: number) => {
    const changes = [0, 1, -1, 2, 0, -2, 1, 0];
    return changes[rank - 1] || 0;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        icon={<Trophy size={22} className="text-amber-400" />}
        title="Ranking de Clubes Sostenibles"
        subtitle="Clasificación basada en desempeño ESG verificado"
        action={
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="btn-secondary gap-2"
          >
            <Info size={15} />
            Metodología
          </button>
        }
      />

      {/* Entity type tabs */}
      <div className="flex gap-2 flex-wrap">
        {entityTypes.map((type) => {
          const cfg = entityTypeConfig[type];
          const active = entityType === type;
          return (
            <button
              key={type}
              onClick={() => setEntityType(type)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={active
                ? { backgroundColor: cfg.color + "18", border: `1.5px solid ${cfg.color}`, color: cfg.color }
                : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b" }
              }
            >
              <span>{cfg.icon}</span> {type}
            </button>
          );
        })}
      </div>

      {/* Placeholder for non-club entity types */}
      {entityType !== "Clubes" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-16 text-center">
          <div className="text-5xl mb-4">{entityTypeConfig[entityType].icon}</div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">{entityType}</h3>
          <p className="text-slate-400 text-sm">{entityTypeConfig[entityType].placeholder}</p>
        </motion.div>
      )}

      {/* Methodology panel (only for Clubes) */}
      {entityType === "Clubes" && (<>
      {showMethodology && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Info size={16} className="text-teal-600" />
            Metodología de ponderación ESG
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ponderacion.map((p) => (
              <div key={p.name} className="p-4 rounded-xl text-center" style={{ backgroundColor: "#f8fafc", border: `1px solid ${p.color}30` }}>
                <div className="text-3xl font-bold mb-1" style={{ color: p.color }}>{p.weight}%</div>
                <p className="text-xs text-slate-500">{p.name}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            El puntaje se calcula automáticamente cada mes considerando evidencias documentadas, KPIs registrados en la plataforma
            y verificaciones de terceros. Los criterios pueden ser auditados por cualquier club participante.
          </p>
        </motion.div>
      )}

      {/* Podium top 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 2nd place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 10 }}
          transition={{ delay: 0.1 }}
          className="card p-7 text-center flex flex-col items-center gap-2 pt-10"
          style={{ border: "1px solid rgba(192,192,192,0.3)" }}
        >
          <div className="text-4xl">🥈</div>
          <p className="text-lg">{mockClubs[1].flag}</p>
          <p className="font-bold text-slate-800 text-sm">{mockClubs[1].name}</p>
          <p className="text-xs text-slate-400">{mockClubs[1].sport}</p>
          <div className="text-2xl font-bold text-slate-800 mt-1">{mockClubs[1].esgScore}</div>
          <p className="text-xs text-slate-400">puntos ESG</p>
        </motion.div>

        {/* 1st place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="card p-7 text-center flex flex-col items-center gap-2 relative overflow-hidden -mt-4"
          style={{ border: "1px solid rgba(255,215,0,0.4)", boxShadow: "0 0 30px rgba(255,215,0,0.15)" }}
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-300" />
          <div className="text-5xl">🥇</div>
          <p className="text-xl">{mockClubs[0].flag}</p>
          <p className="font-bold text-slate-900">{mockClubs[0].name}</p>
          <p className="text-xs text-slate-400">{mockClubs[0].sport}</p>
          <div className="text-3xl font-bold text-amber-400 mt-1">{mockClubs[0].esgScore}</div>
          <p className="text-xs text-slate-400">puntos ESG</p>
          <span className="badge-orange mt-1">Líder mundial</span>
        </motion.div>

        {/* 3rd place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 15 }}
          transition={{ delay: 0.2 }}
          className="card p-7 text-center flex flex-col items-center gap-2 pt-10"
          style={{ border: "1px solid rgba(205,127,50,0.3)" }}
        >
          <div className="text-4xl">🥉</div>
          <p className="text-lg">{mockClubs[2].flag}</p>
          <p className="font-bold text-slate-800 text-sm">{mockClubs[2].name}</p>
          <p className="text-xs text-slate-400">{mockClubs[2].sport}</p>
          <div className="text-2xl font-bold text-slate-800 mt-1">{mockClubs[2].esgScore}</div>
          <p className="text-xs text-slate-400">puntos ESG</p>
        </motion.div>
      </div>

      {/* Chart + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-7 lg:col-span-2"
        >
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Top 8 — Puntaje ESG comparado</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockClubs.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} domain={[0, 100]} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                formatter={(value) => [`${value} pts`, "Puntaje ESG"]}
              />
              <Bar dataKey="esgScore" radius={[0, 6, 6, 0]}>
                {mockClubs.slice(0, 8).map((_, index) => (
                  <Cell
                    key={index}
                    fill={index === 0 ? "#F59E0B" : index === 1 ? "#94A3B8" : index === 2 ? "#CD7F32" : "#10B981"}
                    opacity={index > 2 ? 0.85 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Filters card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-7"
        >
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Filtrar ranking</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">País</label>
              <select className="input-field" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
                {countryFilters.map((c) => <option key={c} value={c} style={{ backgroundColor: "#fff" }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Deporte</label>
              <select className="input-field" value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}>
                {sportFilters.map((s) => <option key={s} value={s} style={{ backgroundColor: "#fff" }}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="divider" />
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Distribución por dimensión</p>
            {ponderacion.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{p.name}</span>
                  <span className="font-semibold" style={{ color: p.color }}>{p.weight}%</span>
                </div>
                <ProgressBar value={p.weight} showPercent={false} height={4} color={p.color} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Full ranking table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card overflow-hidden"
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <BarChart3 size={15} className="text-teal-600" />
            Tabla completa · {filtered.length} clubes
          </h3>
          <button className="btn-ghost text-xs">Exportar</button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Club</div>
          <div className="col-span-2 hidden md:block">Deporte / País</div>
          <div className="col-span-2 text-center">ESG Total</div>
          <div className="col-span-1 text-center hidden lg:block">Ambiental</div>
          <div className="col-span-1 text-center hidden lg:block">Social</div>
          <div className="col-span-1 text-center hidden lg:block">Gob.</div>
          <div className="col-span-1 text-right">Tendencia</div>
        </div>

        {filtered.map((club, i) => {
          const change = getRankChange(club.ranking);
          const isMyClub = club.id === "c4";
          return (
            <motion.div
              key={club.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "grid grid-cols-12 gap-2 px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer items-center",
                isMyClub && "relative"
              )}
              style={isMyClub ? { backgroundColor: "rgba(16,185,129,0.06)", borderLeft: "3px solid #10B981" } : {}}
              onClick={() => setSelectedClub(club)}
            >
              <div className="col-span-1">
                <span className="text-base">{getRankingMedal(club.ranking)}</span>
              </div>

              <div className="col-span-3 flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #10B98130, #06B6D430)", border: "1px solid #e2e8f0" }}>
                  {club.flag}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-sm font-semibold truncate", isMyClub ? "text-teal-600" : "text-slate-900")}>
                    {club.name}
                    {isMyClub && <span className="ml-2 text-xs opacity-70">(Mi club)</span>}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{club.members.toLocaleString()} miembros</p>
                </div>
              </div>

              <div className="col-span-2 hidden md:block">
                <p className="text-xs text-slate-500">{club.sport}</p>
                <p className="text-xs text-slate-400">{club.flag} {club.country}</p>
              </div>

              <div className="col-span-2 text-center">
                <p className={cn("text-lg font-bold", isMyClub ? "text-teal-600" : "text-slate-900")}>{club.esgScore}</p>
                <ProgressBar value={club.esgScore} showPercent={false} height={3} color={isMyClub ? "#10B981" : "#10B981"} />
              </div>

              <div className="col-span-1 text-center hidden lg:block">
                <span className="text-sm font-semibold text-teal-600">{club.environmental}</span>
              </div>
              <div className="col-span-1 text-center hidden lg:block">
                <span className="text-sm font-semibold text-teal-600">{club.social}</span>
              </div>
              <div className="col-span-1 text-center hidden lg:block">
                <span className="text-sm font-semibold text-purple-400">{club.governance}</span>
              </div>

              <div className="col-span-1 text-right">
                {change > 0 ? (
                  <span className="flex items-center justify-end gap-0.5 text-teal-600 text-xs font-semibold">
                    <ArrowUpRight size={13} /> {change}
                  </span>
                ) : change < 0 ? (
                  <span className="flex items-center justify-end gap-0.5 text-red-400 text-xs font-semibold">
                    <ArrowDownRight size={13} /> {Math.abs(change)}
                  </span>
                ) : (
                  <span className="flex items-center justify-end text-slate-300 text-xs">
                    <Minus size={13} />
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      </>)}

      {/* Club detail modal — only within Clubes tab */}
      {entityType === "Clubes" && selectedClub && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={() => setSelectedClub(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="card max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{selectedClub.flag}</div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedClub.name}</h2>
                  <p className="text-sm text-slate-400">{selectedClub.sport} · {selectedClub.country}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClub(null)} className="text-slate-400 hover:text-slate-800 text-xl">×</button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: "ESG Total", value: selectedClub.esgScore, color: "#F59E0B" },
                { label: "Ambiental", value: selectedClub.environmental, color: "#10B981" },
                { label: "Social", value: selectedClub.social, color: "#06B6D4" },
                { label: "Gobernanza", value: selectedClub.governance, color: "#8B5CF6" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: "#f8fafc" }}>
                  <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {[
                { label: "Ambiental", value: selectedClub.environmental, color: "#10B981" },
                { label: "Social", value: selectedClub.social, color: "#06B6D4" },
                { label: "Gobernanza", value: selectedClub.governance, color: "#8B5CF6" },
                { label: "Transparencia", value: selectedClub.transparency, color: "#F59E0B" },
              ].map((d) => (
                <ProgressBar key={d.label} value={d.value} label={d.label} color={d.color} />
              ))}
            </div>

            <div className="divider" />
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Miembros", value: selectedClub.members.toLocaleString() },
                { label: "Fundado", value: selectedClub.founded },
                { label: "Ranking", value: `#${selectedClub.ranking}` },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-bold text-slate-800 text-base">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
