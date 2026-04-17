"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowUp, ArrowDown, Minus, Filter, DollarSign, Users, Target, Star } from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";

const brandsData = [
  { name: "GreenSport SA", score: 95, projects: 5, investment: 180000, reach: 45000, trend: 2, sector: "Ambiental" },
  { name: "EcoTech Iberia", score: 88, projects: 4, investment: 152000, reach: 32000, trend: -1, sector: "Ambiental" },
  { name: "SportInclusion", score: 86, projects: 3, investment: 95000, reach: 28000, trend: 3, sector: "Social" },
  { name: "Sustainable Pro", score: 81, projects: 3, investment: 78000, reach: 18000, trend: 0, sector: "Social" },
  { name: "ClimateGear", score: 74, projects: 2, investment: 62000, reach: 15000, trend: -2, sector: "Ambiental" },
  { name: "TransparenSport", score: 71, projects: 2, investment: 54000, reach: 9800, trend: 1, sector: "Gobernanza" },
  { name: "NatureRun", score: 68, projects: 1, investment: 35000, reach: 12000, trend: 0, sector: "Ambiental" },
  { name: "FairPlay Corp", score: 64, projects: 1, investment: 28000, reach: 7500, trend: -1, sector: "Gobernanza" },
];

const sectorFilters = ["Todos", "Ambiental", "Social", "Gobernanza"];

export default function BrandsRankingPage() {
  const [filter, setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? brandsData : brandsData.filter((b) => b.sector === filter);
  const totalInvestment = brandsData.reduce((s, b) => s + b.investment, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        icon={<Trophy size={22} className="text-amber-400" />}
        title="Ranking de Marcas"
        subtitle="Posicionamiento de marcas patrocinadoras por impacto ESG y alcance"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total marcas", value: brandsData.length.toString(), icon: <Star size={16} />, color: "#F59E0B" },
          { label: "Inversión total", value: `$${(totalInvestment / 1000).toFixed(0)}K`, icon: <DollarSign size={16} />, color: "#10B981" },
          { label: "Proyectos totales", value: brandsData.reduce((s, b) => s + b.projects, 0).toString(), icon: <Target size={16} />, color: "#3B82F6" },
          { label: "Alcance combinado", value: `${(brandsData.reduce((s, b) => s + b.reach, 0) / 1000).toFixed(0)}K`, icon: <Users size={16} />, color: "#8B5CF6" },
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
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div className="w-10 text-xs text-slate-400 uppercase tracking-wider text-center">#</div>
          <div className="flex-1 text-xs text-slate-400 uppercase tracking-wider">Marca</div>
          <div className="w-20 text-xs text-slate-400 uppercase tracking-wider text-center">Score</div>
          <div className="w-24 text-xs text-slate-400 uppercase tracking-wider text-center hidden md:block">ESG Bar</div>
          <div className="w-20 text-xs text-slate-400 uppercase tracking-wider text-center">Proyectos</div>
          <div className="w-24 text-xs text-slate-400 uppercase tracking-wider text-center hidden lg:block">Inversión</div>
          <div className="w-20 text-xs text-slate-400 uppercase tracking-wider text-center hidden lg:block">Alcance</div>
          <div className="w-20 text-xs text-slate-400 uppercase tracking-wider text-center">Sector</div>
          <div className="w-16 text-xs text-slate-400 uppercase tracking-wider text-center">Tend.</div>
        </div>
        {filtered.map((brand, i) => (
          <motion.div key={brand.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors" style={{ borderBottom: "1px solid #f8fafc" }}>
            <div className="w-10 text-center">
              <span className={`text-sm font-bold ${i === 0 ? "text-amber-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-slate-400"}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">{brand.name[0]}</div>
              <span className="text-sm font-semibold text-slate-800 truncate">{brand.name}</span>
            </div>
            <div className="w-20 text-center">
              <span className="text-sm font-bold" style={{ color: brand.score >= 85 ? "#10B981" : brand.score >= 70 ? "#F59E0B" : "#94a3b8" }}>{brand.score}</span>
            </div>
            <div className="w-24 hidden md:block">
              <ProgressBar value={brand.score} showPercent={false} height={4} color={brand.score >= 85 ? "#10B981" : brand.score >= 70 ? "#F59E0B" : "#94a3b8"} />
            </div>
            <div className="w-20 text-center text-sm text-slate-600">{brand.projects}</div>
            <div className="w-24 text-center text-sm font-medium text-slate-700 hidden lg:block">${(brand.investment / 1000).toFixed(0)}K</div>
            <div className="w-20 text-center text-sm text-slate-500 hidden lg:block">{(brand.reach / 1000).toFixed(1)}K</div>
            <div className="w-20 text-center">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: brand.sector === "Ambiental" ? "#ECFDF5" : brand.sector === "Social" ? "#EFF6FF" : "#FDF4FF", color: brand.sector === "Ambiental" ? "#059669" : brand.sector === "Social" ? "#2563EB" : "#7C3AED" }}>
                {brand.sector}
              </span>
            </div>
            <div className="w-16 flex justify-center">
              {brand.trend > 0 ? <span className="flex items-center gap-0.5 text-xs font-semibold text-teal-600"><ArrowUp size={12} />{brand.trend}</span>
                : brand.trend < 0 ? <span className="flex items-center gap-0.5 text-xs font-semibold text-red-400"><ArrowDown size={12} />{Math.abs(brand.trend)}</span>
                : <Minus size={14} className="text-slate-300" />}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
