"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Info, BarChart3,
  ArrowUpRight, ArrowDownRight, Minus, ShieldCheck, Medal,
  Leaf, Users, Scale, Eye, X, ChevronDown, ExternalLink,
} from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";
import { SportIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Club } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import { useResource } from "@/lib/useResource";

type RankedClub = Club & { previousRanking?: number | null };

const EMPTY: RankedClub[] = [];

const countryFilters = ["Todos", "Chile", "Argentina", "España", "Colombia", "México", "Uruguay", "Perú"];
const countryFlags: Record<string, string> = { Todos: "🌎", Chile: "🇨🇱", Argentina: "🇦🇷", España: "🇪🇸", Colombia: "🇨🇴", México: "🇲🇽", Uruguay: "🇺🇾", Perú: "🇵🇪" };
const sportFilters   = ["Todos", "Fútbol", "Rugby", "Pádel", "Natación", "Tenis", "Atletismo"];

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

const csvCell = (v: string | number) => {
  const str = String(v ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

/* ── Club team colors lookup ── */
const TEAM_COLORS: Record<string, { bg: string; text: string; abbr?: string }> = {
  "Colo-Colo":              { bg: "linear-gradient(135deg, #1a1a1a, #444)", text: "#fff", abbr: "CC" },
  "Universidad de Chile":   { bg: "linear-gradient(135deg, #003087, #0055cc)", text: "#fff", abbr: "U" },
  "Universidad Católica":   { bg: "linear-gradient(135deg, #CC0000, #FF3333)", text: "#fff", abbr: "UC" },
  "Padel Eco Club":         { bg: "linear-gradient(135deg, #0EA5E9, #38BDF8)", text: "#fff" },
  "Rugby Verde":            { bg: "linear-gradient(135deg, #166534, #22c55e)", text: "#fff", abbr: "RV" },
  "Deportes Temuco":        { bg: "linear-gradient(135deg, #7C2D12, #C2410C)", text: "#fff", abbr: "DT" },
};

function getTeamAbbr(name: string): string {
  if (TEAM_COLORS[name]?.abbr) return TEAM_COLORS[name].abbr!;
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ── Custom Top-10 animated bar ── */
function ESGBar({ club, index, maxScore }: { club: Club; index: number; maxScore: number }) {
  const [hovered, setHovered] = useState(false);
  const pct = (club.esgScore / maxScore) * 100;
  const barColor =
    index === 0 ? "#F59E0B" :
    index === 1 ? "#94A3B8" :
    index === 2 ? "#CD7F32" : "#10B981";

  const teamStyle = TEAM_COLORS[club.name];

  return (
    <motion.div
      className="flex items-center gap-3 py-1.5 px-2 rounded-xl cursor-pointer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ backgroundColor: hovered ? "rgba(16,185,129,0.05)" : "rgba(0,0,0,0)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Rank number */}
      <span className="w-5 text-xs font-bold text-slate-400 text-right flex-shrink-0">{index + 1}</span>

      {/* Club logo / avatar */}
      <motion.div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-sm"
        style={{
          background: teamStyle?.bg ?? `linear-gradient(135deg, ${barColor}, ${barColor}88)`,
          color: teamStyle?.text ?? "#fff",
        }}
        animate={{ scale: hovered ? 1.12 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {getTeamAbbr(club.name)}
      </motion.div>

      {/* Name */}
      <motion.span
        className="w-32 text-xs font-semibold truncate flex-shrink-0 transition-colors"
        animate={{ color: hovered ? "#2dd4bf" : "#c0c9d6" }}
      >
        {club.name.split(" ").slice(0, 3).join(" ")}
      </motion.span>

      {/* Bar */}
      <div className="flex-1 h-7 rounded-lg bg-slate-100 overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: index * 0.07 + 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-lg flex items-center justify-end pr-2.5"
          style={{
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
            boxShadow: hovered ? `0 0 20px ${barColor}66` : `0 0 10px ${barColor}33`,
          }}
        >
          <motion.span
            className="text-[11px] font-bold text-white"
            animate={{ scale: hovered ? 1.1 : 1 }}
          >
            {club.esgScore}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
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
  const { activeUser, loaded } = useUser();
  const clubId = activeUser?.clubId ?? null;
  const { data: clubs } = useResource<RankedClub[]>(
    loaded && activeUser ? "/api/clubs" : null, EMPTY,
  );
  const router = useRouter();
  const [countryFilter, setCountryFilter] = useState("Todos");
  const [sportFilter, setSportFilter] = useState("Todos");
  const [showMethodology, setShowMethodology] = useState(false);
  const [selectedClub, setSelectedClub] = useState<RankedClub | null>(null);

  const exportCsv = () => {
    const header = ["rank", "name", "country", "sport", "esgScore", "environmental", "social", "governance"];
    const rows = filtered.map((c) => [c.ranking, c.name, c.country, c.sport, c.esgScore, c.environmental, c.social, c.governance]);
    const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ranking-esg-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const filtered = clubs.filter((c) => {
    const matchCountry = countryFilter === "Todos" || c.country === countryFilter;
    const matchSport   = sportFilter   === "Todos" || c.sport   === sportFilter;
    return matchCountry && matchSport;
  });

  const maxScore = Math.max(1, ...clubs.slice(0, 10).map((c) => c.esgScore));

  if (!loaded) return null;

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

        {/* Right: Metodología */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setShowMethodology(!showMethodology)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
            style={showMethodology
              ? { background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)", color: "#10B981" }
              : { background: "#10151f", borderColor: "#232c3a", color: "#a8b3c4" }
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
            icon={<SportIcon sport="Fútbol" size={15} className="text-slate-400" />}
          />
        </div>
      </div>

      <>

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
                El puntaje ESG se calcula ponderando los cuatro pilares registrados por cada club (Ambiental 40%, Social 30%,
                Gobernanza 20% y Transparencia 10%), más un bono por el progreso de sus proyectos ESG activos en la plataforma.
                Se recalcula cada vez que un club actualiza sus proyectos.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Podium top 3 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {medals.map(({ place, color, glow, label, size }) => {
            const club = clubs[place - 1];
            if (!club) return null;
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
                    1º del ranking
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
                <Trophy size={12} /> Top 10
              </div>
            </div>
            <div className="space-y-0.5">
              {clubs.slice(0, 10).map((club, i) => (
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
            <button onClick={exportCsv} disabled={filtered.length === 0} className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors disabled:opacity-40">Exportar</button>
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
              const change: number | null = club.previousRanking ? club.previousRanking - club.ranking : null;
              const isMyClub = club.id === clubId;
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
                      style={{ background: `linear-gradient(135deg, ${isMyClub ? "#10B981" : "#475569"}, ${isMyClub ? "#06B6D4" : "#a8b3c4"})` }}
                    >
                      {club.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={cn("text-sm font-semibold truncate transition-colors", isMyClub ? "text-teal-600" : "text-slate-800 group-hover:text-teal-600")}>
                          {club.name}
                        </p>
                        {isMyClub && <ShieldCheck size={12} className="text-teal-500 flex-shrink-0" />}
                        {isMyClub && (
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
                    {change !== null && change > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-500 text-xs font-bold">
                        <ArrowUpRight size={13} />{change}
                      </span>
                    ) : change !== null && change < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-red-400 text-xs font-bold">
                        <ArrowDownRight size={13} />{Math.abs(change)}
                      </span>
                    ) : (
                      <Minus size={13} className="text-slate-300 inline" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </>

      {/* ── Club detail modal ── */}
      <AnimatePresence>
        {selectedClub && (
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
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)" }}>
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
                {activeUser?.role === "admin" && (
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
