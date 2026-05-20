"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Building2, CalendarDays, Landmark, Info, BarChart3,
  ArrowUpRight, ArrowDownRight, Minus, ShieldCheck, Medal,
  Leaf, Users, Scale, Eye, X, ChevronDown, ChevronLeft, ChevronRight, ExternalLink,
} from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";
import { mockClubs } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Club } from "@/lib/types";
import { useUser } from "@/lib/userContext";

/* ── Entity type config with Lucide icons ── */
const entityTypes = ["Clubes", "Federaciones", "Eventos", "Venues / Recintos"] as const;
type EntityType = typeof entityTypes[number];

type EntityConfig = { icon: React.ElementType; color: string; placeholder: string };
const entityTypeConfig: Record<EntityType, EntityConfig> = {
  Clubes:            { icon: Trophy,      color: "#F59E0B", placeholder: "" },
  Federaciones:      { icon: Building2,   color: "#06B6D4", placeholder: "El ranking de Federaciones estará disponible próximamente." },
  Eventos:           { icon: CalendarDays,color: "#8B5CF6", placeholder: "El ranking de Eventos sostenibles estará disponible próximamente." },
  "Venues / Recintos":{ icon: Landmark,   color: "#10B981", placeholder: "El ranking de Venues y Recintos estará disponible próximamente." },
};

const countryFilters = ["Todos", "Chile", "Argentina", "España", "Colombia", "México", "Uruguay", "Perú"];
const countryFlags: Record<string, string> = { Todos: "🌎", Chile: "🇨🇱", Argentina: "🇦🇷", España: "🇪🇸", Colombia: "🇨🇴", México: "🇲🇽", Uruguay: "🇺🇾", Perú: "🇵🇪" };
const sportFilters   = ["Todos", "Fútbol", "Rugby", "Pádel", "Natación", "Tenis", "Atletismo"];
const federationFilters = ["Todas", "ANFP", "RFEF", "AFA", "FEF", "FCF"];
const seasons = ["2020/21", "2021/22", "2022/23", "2023/24", "2024/25"];

const ponderacion = [
  { name: "Impacto ambiental", weight: 40, color: "#10B981", icon: Leaf },
  { name: "Impacto social",    weight: 30, color: "#06B6D4", icon: Users },
  { name: "Gobernanza",        weight: 20, color: "#8B5CF6", icon: Scale },
  { name: "Transparencia",     weight: 10, color: "#F59E0B", icon: Eye },
];

const medals = [
  { place: 2, color: "#94A3B8", glow: "#94A3B855", label: "Plata", size: "normal" },
  { place: 1, color: "#F59E0B", glow: "#F59E0B55", label: "Oro",   size: "hero"   },
  { place: 3, color: "#CD7F32", glow: "#CD7F3255", label: "Bronce",size: "normal" },
] as const;

const getRankChange = (rank: number) => [0, 1, -1, 2, 0, -2, 1, 0][rank - 1] ?? 0;

/* ── Custom Top-8 animated bar ── */
function ESGBar({ club, index, maxScore }: { club: Club; index: number; maxScore: number }) {
  const pct = (club.esgScore / maxScore) * 100;
  const barColor =
    index === 0 ? "#F59E0B" :
    index === 1 ? "#94A3B8" :
    index === 2 ? "#CD7F32" : "#10B981";
  const opacity = index > 2 ? 0.85 : 1;

  return (
    <div className="group flex items-center gap-3 py-1.5">
      {/* Rank number */}
      <span className="w-5 text-xs font-bold text-slate-400 text-right flex-shrink-0">{index + 1}</span>

      {/* Club avatar */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${barColor}, ${barColor}88)`, opacity }}
      >
        {club.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
      </div>

      {/* Name */}
      <span className="w-28 text-xs font-semibold text-slate-700 truncate flex-shrink-0 group-hover:text-teal-600 transition-colors">
        {club.name.split(" ").slice(0, 2).join(" ")}
      </span>

      {/* Bar */}
      <div className="flex-1 h-7 rounded-lg bg-slate-100 overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: index * 0.07 + 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-lg flex items-center justify-end pr-2.5"
          style={{
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
            opacity,
            boxShadow: `0 0 16px ${barColor}44`,
          }}
        >
          <span className="text-[11px] font-bold text-white">{club.esgScore}</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Figma-style filter dropdown ── */
function FilterSelect({ label, value, options, onChange, icon }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-8 pr-8 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 cursor-pointer min-w-[140px] transition-all"
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function RankingPage() {
  const { activeUser, liveClub } = useUser();
  const router = useRouter();
  const [entityType, setEntityType] = useState<EntityType>("Clubes");
  const [countryFilter, setCountryFilter] = useState("Todos");
  const [sportFilter, setSportFilter] = useState("Todos");
  const [federationFilter, setFederationFilter] = useState("Todas");
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [showMethodology, setShowMethodology] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const activeSeason = seasons[seasonIndex];

  /** Swap the user's own club with the live (project-adjusted) version */
  const resolveClub = (club: Club): Club =>
    liveClub && club.id === activeUser.clubId ? liveClub : club;

  const filtered = mockClubs
    .filter((c) => {
      const matchCountry = countryFilter === "Todos" || c.country === countryFilter;
      const matchSport   = sportFilter   === "Todos" || c.sport   === sportFilter;
      return matchCountry && matchSport;
    })
    .map(resolveClub);

  const maxScore = Math.max(...mockClubs.slice(0, 8).map((c) => c.esgScore));

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)" }}>
            <Trophy size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Ranking clubes</h1>
            <p className="text-xs text-slate-400">Clasificación basada en desempeño ESG verificado</p>
          </div>
        </div>

        {/* Right: Patrocinado + Metodología */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Patrocinado por</span>
            <div className="h-7 px-3 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#E31E2D" }}>
              Claro
            </div>
          </div>
          <motion.button
            onClick={() => setShowMethodology(!showMethodology)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
            style={showMethodology
              ? { background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)", color: "#10B981" }
              : { background: "#f8fafc", borderColor: "#e2e8f0", color: "#64748b" }
            }
          >
            <Info size={14} /> Metodología
          </motion.button>
        </div>
      </div>

      {/* ── Figma filter bar ── */}
      <div className="card p-5 space-y-4">
        {/* Row 1: dropdowns */}
        <div className="flex items-end gap-4 flex-wrap">
          <FilterSelect
            label="Selecciona país"
            value={countryFilter}
            options={countryFilters}
            onChange={setCountryFilter}
            icon={<span className="text-sm">{countryFlags[countryFilter] ?? "🌎"}</span>}
          />
          <FilterSelect
            label="Selecciona deporte"
            value={sportFilter}
            options={sportFilters}
            onChange={setSportFilter}
            icon={<span className="text-slate-400">⚽</span>}
          />
          <FilterSelect
            label="Selecciona federación"
            value={federationFilter}
            options={federationFilters}
            onChange={setFederationFilter}
            icon={<span className="text-slate-400">🏛</span>}
          />
        </div>

        {/* Row 2: season selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Selecciona temporada</span>
          <button
            onClick={() => setSeasonIndex((i) => Math.max(0, i - 1))}
            disabled={seasonIndex === 0}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          {seasons.map((s, idx) => (
            <motion.button
              key={s}
              onClick={() => setSeasonIndex(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150"
              style={seasonIndex === idx
                ? { background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#fff", boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }
                : { background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }
              }
            >
              {s}
            </motion.button>
          ))}
          <button
            onClick={() => setSeasonIndex((i) => Math.min(seasons.length - 1, i + 1))}
            disabled={seasonIndex === seasons.length - 1}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Placeholder for non-club tabs ── */}
      {entityType !== "Clubes" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-16 text-center">
          {(() => { const Icon = entityTypeConfig[entityType].icon; return (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: entityTypeConfig[entityType].color + "18" }}>
              <Icon size={26} style={{ color: entityTypeConfig[entityType].color }} />
            </div>
          ); })()}
          <h3 className="text-lg font-bold text-slate-700 mb-2">{entityType}</h3>
          <p className="text-slate-400 text-sm">{entityTypeConfig[entityType].placeholder}</p>
        </motion.div>
      )}

      {entityType === "Clubes" && (<>

        {/* ── Methodology ── */}
        <AnimatePresence>
          {showMethodology && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="card p-6 overflow-hidden"
            >
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                <Info size={15} className="text-teal-600" /> Metodología de ponderación ESG
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ponderacion.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.name} className="p-4 rounded-xl text-center space-y-2" style={{ backgroundColor: p.color + "0d", border: `1px solid ${p.color}25` }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto" style={{ background: p.color + "20" }}>
                        <Icon size={15} style={{ color: p.color }} />
                      </div>
                      <div className="text-2xl font-black" style={{ color: p.color }}>{p.weight}%</div>
                      <p className="text-xs text-slate-500 leading-snug">{p.name}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                El puntaje se calcula automáticamente cada mes considerando evidencias documentadas, KPIs registrados en la plataforma
                y verificaciones de terceros. Los criterios pueden ser auditados por cualquier club participante.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Podium top 3 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {medals.map(({ place, color, glow, label, size }) => {
            const club = resolveClub(mockClubs[place - 1]);
            const isHero = size === "hero";
            return (
              <motion.div
                key={place}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: isHero ? 0 : 12 }}
                transition={{ delay: place === 1 ? 0 : place === 2 ? 0.1 : 0.2 }}
                className={cn("card p-6 text-center flex flex-col items-center gap-2 relative overflow-hidden cursor-pointer", isHero && "-mt-2")}
                style={{ border: `1.5px solid ${color}40`, boxShadow: isHero ? `0 0 32px ${glow}` : undefined }}
                onClick={() => setSelectedClub(club)}
              >
                {isHero && <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />}
                {/* Medal icon */}
                <div
                  className={cn("rounded-2xl flex items-center justify-center", isHero ? "w-14 h-14" : "w-11 h-11")}
                  style={{ background: `linear-gradient(135deg, ${color}30, ${color}15)`, border: `1.5px solid ${color}40` }}
                >
                  <Medal size={isHero ? 26 : 20} style={{ color }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
                {/* Club initials avatar */}
                <div
                  className={cn("rounded-xl flex items-center justify-center font-black text-white", isHero ? "w-12 h-12 text-base" : "w-10 h-10 text-sm")}
                  style={{ background: `linear-gradient(135deg, ${color}cc, ${color}88)` }}
                >
                  {club.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                </div>
                <p className={cn("font-bold text-slate-800", isHero ? "text-base" : "text-sm")}>{club.name}</p>
                <p className="text-xs text-slate-400">{club.sport}</p>
                <div className={cn("font-black mt-1", isHero ? "text-3xl" : "text-2xl")} style={{ color }}>{club.esgScore}</div>
                <p className="text-xs text-slate-400">puntos ESG</p>
                {isHero && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full mt-1" style={{ background: color + "18", color, border: `1px solid ${color}30` }}>
                    Líder mundial
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── Top 8 chart ── */}
        <div>
          {/* Custom animated bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Top 8 — Puntaje ESG comparado</h3>
                <p className="text-xs text-slate-400 mt-0.5">Clasificación de mejores clubes por puntaje global</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#FEF3C7", color: "#D97706" }}>
                <Trophy size={12} /> Top 8
              </div>
            </div>
            <div className="space-y-0.5">
              {mockClubs.slice(0, 8).map(resolveClub).map((club, i) => (
                <ESGBar key={club.id} club={club} index={i} maxScore={maxScore} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Full ranking table ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 size={15} className="text-teal-600" />
              Tabla completa
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">{filtered.length}</span>
            </h3>
            <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">Exportar</button>
          </div>

          {/* Table header */}
          <div
            className="grid gap-2 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
            style={{ gridTemplateColumns: "48px 1fr 160px 100px 80px 60px 60px 70px" }}
          >
            <span>#</span>
            <span>Club</span>
            <span className="hidden md:block">Deporte / País</span>
            <span className="text-center">ESG Total</span>
            <span className="text-center hidden lg:block">Amb.</span>
            <span className="text-center hidden lg:block">Soc.</span>
            <span className="text-center hidden lg:block">Gob.</span>
            <span className="text-right">Δ</span>
          </div>

          <div className="divide-y divide-slate-50">
            {filtered.map((club, i) => {
              const change  = getRankChange(club.ranking);
              const isMyClub = club.id === activeUser.clubId;
              const medalColor = club.ranking === 1 ? "#F59E0B" : club.ranking === 2 ? "#94A3B8" : club.ranking === 3 ? "#CD7F32" : null;
              return (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.035 }}
                  className={cn(
                    "group grid gap-2 px-6 py-3.5 hover:bg-slate-50 transition-all duration-150 cursor-pointer items-center",
                  )}
                  style={{
                    gridTemplateColumns: "48px 1fr 160px 100px 80px 60px 60px 70px",
                    ...(isMyClub ? { backgroundColor: "rgba(16,185,129,0.05)", borderLeft: "3px solid #10B981" } : {}),
                  }}
                  onClick={() => setSelectedClub(club)}
                >
                  {/* Rank */}
                  <div>
                    {medalColor ? (
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: medalColor + "20" }}>
                        <Medal size={14} style={{ color: medalColor }} />
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-slate-300">{club.ranking}</span>
                    )}
                  </div>

                  {/* Club name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${isMyClub ? "#10B981" : "#475569"}, ${isMyClub ? "#06B6D4" : "#64748b"})` }}
                    >
                      {club.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={cn("text-sm font-semibold truncate transition-colors", isMyClub ? "text-teal-600" : "text-slate-800 group-hover:text-teal-600")}>
                          {club.name}
                        </p>
                        {isMyClub && <ShieldCheck size={12} className="text-teal-500 flex-shrink-0" />}
                        {isMyClub && liveClub && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{club.members.toLocaleString()} miembros</p>
                    </div>
                  </div>

                  {/* Sport / country */}
                  <div className="hidden md:block">
                    <p className="text-xs font-medium text-slate-600">{club.sport}</p>
                    <p className="text-xs text-slate-400">{club.flag} {club.country}</p>
                  </div>

                  {/* ESG total */}
                  <div className="text-center">
                    <span className={cn("text-lg font-black", isMyClub ? "text-teal-600" : "text-slate-900")}>{club.esgScore}</span>
                    <div className="h-1 mt-1 rounded-full overflow-hidden bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${club.esgScore}%`, background: isMyClub ? "linear-gradient(90deg,#10B981,#06B6D4)" : "linear-gradient(90deg,#64748b,#94a3b8)" }}
                      />
                    </div>
                  </div>

                  {/* Dim scores */}
                  <div className="text-center hidden lg:block">
                    <span className="text-sm font-semibold text-emerald-500">{club.environmental}</span>
                  </div>
                  <div className="text-center hidden lg:block">
                    <span className="text-sm font-semibold text-cyan-500">{club.social}</span>
                  </div>
                  <div className="text-center hidden lg:block">
                    <span className="text-sm font-semibold text-violet-400">{club.governance}</span>
                  </div>

                  {/* Trend */}
                  <div className="text-right">
                    {change > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-500 text-xs font-bold">
                        <ArrowUpRight size={13} />{change}
                      </span>
                    ) : change < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-red-400 text-xs font-bold">
                        <ArrowDownRight size={13} />{Math.abs(change)}
                      </span>
                    ) : (
                      <Minus size={13} className="text-slate-200 inline" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </>)}

      {/* ── Club detail modal ── */}
      <AnimatePresence>
        {entityType === "Clubes" && selectedClub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelectedClub(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient header */}
              <div
                className="h-24 relative flex items-end p-5"
                style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
              >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #10B981 0%, transparent 70%)" }} />
                <div className="relative flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}>
                    {selectedClub.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-white truncate">{selectedClub.name}</h2>
                    <p className="text-white/60 text-xs">{selectedClub.sport} · {selectedClub.flag} {selectedClub.country}</p>
                  </div>
                  <button
                    onClick={() => setSelectedClub(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X size={15} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Score grid */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "ESG Total",  value: selectedClub.esgScore,     color: "#F59E0B" },
                    { label: "Ambiental",  value: selectedClub.environmental, color: "#10B981" },
                    { label: "Social",     value: selectedClub.social,        color: "#06B6D4" },
                    { label: "Gobernanza", value: selectedClub.governance,    color: "#8B5CF6" },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: s.color + "0d", border: `1px solid ${s.color}25` }}>
                      <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bars */}
                <div className="space-y-3">
                  {[
                    { label: "Ambiental",    value: selectedClub.environmental, color: "#10B981", icon: Leaf },
                    { label: "Social",       value: selectedClub.social,        color: "#06B6D4", icon: Users },
                    { label: "Gobernanza",   value: selectedClub.governance,    color: "#8B5CF6", icon: Scale },
                    { label: "Transparencia",value: selectedClub.transparency,  color: "#F59E0B", icon: Eye },
                  ].map((d) => {
                    const Icon = d.icon;
                    return (
                      <div key={d.label} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: d.color + "20" }}>
                          <Icon size={12} style={{ color: d.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500 font-medium">{d.label}</span>
                            <span className="font-bold" style={{ color: d.color }}>{d.value}</span>
                          </div>
                          <ProgressBar value={d.value} showPercent={false} height={5} color={d.color} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-3 gap-3 pt-1 border-t border-slate-100">
                  {[
                    { label: "Miembros", value: selectedClub.members.toLocaleString() },
                    { label: "Fundado",  value: selectedClub.founded },
                    { label: "Ranking",  value: `#${selectedClub.ranking}` },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="font-bold text-slate-800">{s.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Admin: full detail link */}
                {activeUser.role === "admin" && (
                  <button
                    onClick={() => router.push(`/admin/clubs/${selectedClub.id}`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}
                  >
                    <ExternalLink size={14} /> Ver ficha completa del club
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
