"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Filter, ShieldCheck, Users, Target, Star } from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";
import type { Club } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import { useResource } from "@/lib/useResource";

const EMPTY: Club[] = [];

const sectorFilters = ["Todos", "Ambiental", "Social", "Gobernanza"];

// Derive a club's dominant ESG pillar so the sector filter + pills work off real data.
function dominantSector(c: Club): "Ambiental" | "Social" | "Gobernanza" {
  const max = Math.max(c.environmental, c.social, c.governance);
  if (max === c.environmental) return "Ambiental";
  if (max === c.social) return "Social";
  return "Gobernanza";
}

export default function BrandsRankingPage() {
  const { activeUser, loaded } = useUser();
  const { data: clubs } = useResource<Club[]>(
    loaded && activeUser ? "/api/clubs" : null, EMPTY,
  );

  const [filter, setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? clubs : clubs.filter((c) => dominantSector(c) === filter);

  const totalMembers = clubs.reduce((s, c) => s + c.members, 0);
  const avgScore = clubs.length ? Math.round(clubs.reduce((s, c) => s + c.esgScore, 0) / clubs.length) : 0;
  const avgTransparency = clubs.length ? Math.round(clubs.reduce((s, c) => s + c.transparency, 0) / clubs.length) : 0;

  if (!loaded) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        icon={<Trophy size={22} className="text-amber-400" />}
        title="Ranking de Clubes"
        subtitle="Posicionamiento de clubes y federaciones por impacto ESG y alcance"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total clubes", value: clubs.length.toString(), icon: <Star size={16} />, color: "#F59E0B" },
          { label: "Score promedio", value: avgScore.toString(), icon: <Target size={16} />, color: "#10B981" },
          { label: "Miembros totales", value: `${(totalMembers / 1000).toFixed(0)}K`, icon: <Users size={16} />, color: "#8B5CF6" },
          { label: "Transparencia prom.", value: `${avgTransparency}%`, icon: <ShieldCheck size={16} />, color: "#3B82F6" },
        ].map((s) => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "10" }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-lg font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-slate-400" />
        {sectorFilters.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === c ? "bg-amber-50 text-amber-600 border border-amber-200" : "text-slate-400 hover:text-slate-800 hover:bg-slate-50 border border-transparent"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: "1px solid #161d29" }}>
          <div className="w-10 text-xs text-slate-400 uppercase tracking-wider text-center">#</div>
          <div className="flex-1 text-xs text-slate-400 uppercase tracking-wider">Club</div>
          <div className="w-20 text-xs text-slate-400 uppercase tracking-wider text-center">Score</div>
          <div className="w-24 text-xs text-slate-400 uppercase tracking-wider text-center hidden md:block">ESG Bar</div>
          <div className="w-20 text-xs text-slate-400 uppercase tracking-wider text-center">Miembros</div>
          <div className="w-24 text-xs text-slate-400 uppercase tracking-wider text-center hidden lg:block">País</div>
          <div className="w-20 text-xs text-slate-400 uppercase tracking-wider text-center hidden lg:block">Transp.</div>
          <div className="w-20 text-xs text-slate-400 uppercase tracking-wider text-center">Sector</div>
          <div className="w-16 text-xs text-slate-400 uppercase tracking-wider text-center">Deporte</div>
        </div>
        {filtered.map((club, i) => {
          const sector = dominantSector(club);
          return (
          <motion.div key={club.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors" style={{ borderBottom: "1px solid #10151f" }}>
            <div className="w-10 text-center">
              <span className={`text-sm font-bold ${i === 0 ? "text-amber-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-slate-400"}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">{club.name[0]}</div>
              <span className="text-sm font-semibold text-slate-800 truncate">{club.name}</span>
            </div>
            <div className="w-20 text-center">
              <span className="text-sm font-bold" style={{ color: club.esgScore >= 85 ? "#10B981" : club.esgScore >= 70 ? "#F59E0B" : "#94a3b8" }}>{club.esgScore}</span>
            </div>
            <div className="w-24 hidden md:block">
              <ProgressBar value={club.esgScore} showPercent={false} height={4} color={club.esgScore >= 85 ? "#10B981" : club.esgScore >= 70 ? "#F59E0B" : "#94a3b8"} />
            </div>
            <div className="w-20 text-center text-sm text-slate-600">{(club.members / 1000).toFixed(1)}K</div>
            <div className="w-24 text-center text-sm font-medium text-slate-700 hidden lg:block">{club.flag} {club.country}</div>
            <div className="w-20 text-center text-sm text-slate-500 hidden lg:block">{club.transparency}%</div>
            <div className="w-20 text-center">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sector === "Ambiental" ? "rgba(52,211,153,0.12)" : sector === "Social" ? "rgba(96,165,250,0.12)" : "rgba(167,139,250,0.12)", color: sector === "Ambiental" ? "#34d399" : sector === "Social" ? "#60a5fa" : "#a78bfa" }}>
                {sector}
              </span>
            </div>
            <div className="w-16 text-center text-xs text-slate-500 truncate">{club.sport}</div>
          </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
