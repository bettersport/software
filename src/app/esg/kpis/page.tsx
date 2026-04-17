"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Minus, Plus, Target } from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend,
} from "recharts";
import toast from "react-hot-toast";

const kpiData = [
  { id: "k1", name: "Emisiones CO2", category: "Ambiental", current: 24, target: 18, unit: "ton/año", trend: "down" as const, color: "#10B981", icon: "🌱", description: "Reducción de emisiones de carbono" },
  { id: "k2", name: "Energía renovable", category: "Ambiental", current: 65, target: 100, unit: "%", trend: "up" as const, color: "#06B6D4", icon: "⚡", description: "% de energía de fuentes renovables" },
  { id: "k3", name: "Consumo agua", category: "Ambiental", current: 1200, target: 800, unit: "m³/mes", trend: "down" as const, color: "#F59E0B", icon: "💧", description: "Consumo mensual de agua" },
  { id: "k4", name: "Personas incluidas", category: "Social", current: 160, target: 200, unit: "personas", trend: "up" as const, color: "#8B5CF6", icon: "🤝", description: "Personas en programas de inclusión" },
  { id: "k5", name: "Tasa retención", category: "Social", current: 82, target: 80, unit: "%", trend: "up" as const, color: "#EC4899", icon: "👥", description: "Retención de participantes" },
  { id: "k6", name: "Puntaje gobernanza", category: "Gobernanza", current: 83, target: 90, unit: "pts", trend: "up" as const, color: "#3B82F6", icon: "⚖️", description: "Puntaje de buenas prácticas" },
];

const monthlyData = [
  { month: "Ene", Ambiental: 72, Social: 78, Gobernanza: 80 },
  { month: "Feb", Ambiental: 74, Social: 79, Gobernanza: 81 },
  { month: "Mar", Ambiental: 76, Social: 81, Gobernanza: 82 },
  { month: "Abr", Ambiental: 79, Social: 82, Gobernanza: 82 },
  { month: "May", Ambiental: 82, Social: 83, Gobernanza: 83 },
  { month: "Jun", Ambiental: 85, Social: 84, Gobernanza: 83 },
];

const radarData = [
  { dimension: "Ambiental", score: 87 },
  { dimension: "Social", score: 84 },
  { dimension: "Gobernanza", score: 83 },
  { dimension: "Transparencia", score: 87 },
  { dimension: "Innovación", score: 75 },
];

export default function KPIsPage() {
  const [kpis, setKpis] = useState(kpiData);
  const [showForm, setShowForm] = useState(false);
  const [newKpi, setNewKpi] = useState({ name: "", category: "Ambiental", current: "", target: "", unit: "" });

  const addKpi = () => {
    if (!newKpi.name) return;
    const kpi = {
      id: `k${Date.now()}`,
      ...newKpi,
      current: parseFloat(newKpi.current) || 0,
      target: parseFloat(newKpi.target) || 100,
      trend: "up" as const,
      color: "#10B981",
      icon: "📊",
      description: newKpi.name,
    };
    setKpis((prev) => [...prev, kpi]);
    setShowForm(false);
    setNewKpi({ name: "", category: "Ambiental", current: "", target: "", unit: "" });
    toast.success("KPI agregado correctamente");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        icon={<BarChart3 size={22} className="text-teal-600" />}
        title="KPIs e Indicadores ESG"
        subtitle="Monitorea el desempeño de tus indicadores de sostenibilidad"
        action={
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={16} /> Nuevo KPI
          </button>
        }
      />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-7">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Evolución por dimensión ESG</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[65, 95]} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
              <Line type="monotone" dataKey="Ambiental" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Social" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Gobernanza" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-7">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Perfil ESG actual</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: "#64748b", fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* New KPI form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Nuevo KPI</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Nombre</label>
              <input className="input-field" placeholder="Nombre del indicador" value={newKpi.name} onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Categoría</label>
              <select className="input-field" value={newKpi.category} onChange={(e) => setNewKpi({ ...newKpi, category: e.target.value })}>
                {["Ambiental", "Social", "Gobernanza"].map((c) => (
                  <option key={c} value={c} style={{ backgroundColor: "#fff" }}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Valor actual</label>
              <input className="input-field" type="number" placeholder="0" value={newKpi.current} onChange={(e) => setNewKpi({ ...newKpi, current: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Meta</label>
              <input className="input-field" type="number" placeholder="100" value={newKpi.target} onChange={(e) => setNewKpi({ ...newKpi, target: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            <button onClick={addKpi} className="btn-primary">Agregar KPI</button>
          </div>
        </motion.div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => {
          const pct = Math.min((kpi.current / kpi.target) * 100, 100);
          const achieved = pct >= 100;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-7"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{kpi.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{kpi.name}</p>
                    <span
                      className="badge text-xs"
                      style={{ backgroundColor: kpi.color + "20", color: kpi.color, border: `1px solid ${kpi.color}30` }}
                    >
                      {kpi.category}
                    </span>
                  </div>
                </div>
                <div>
                  {kpi.trend === "up" ? (
                    <TrendingUp size={16} className="text-teal-600" />
                  ) : kpi.trend === "down" ? (
                    <TrendingDown size={16} className="text-red-400" />
                  ) : (
                    <Minus size={16} className="text-slate-400" />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold text-slate-900">{kpi.current.toLocaleString()}</span>
                  <span className="text-sm text-slate-400">/ {kpi.target.toLocaleString()} {kpi.unit}</span>
                </div>
                <ProgressBar value={kpi.current} max={kpi.target} showPercent={false} height={6} color={kpi.color} />
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-slate-400">{kpi.description}</span>
                  <span className="text-xs font-bold" style={{ color: kpi.color }}>{pct.toFixed(0)}%</span>
                </div>
              </div>

              {achieved && (
                <div className="mt-3 py-1.5 px-3 rounded-lg text-xs text-teal-600 font-medium" style={{ backgroundColor: "rgba(16,185,129,0.1)" }}>
                  ✓ Meta alcanzada
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
