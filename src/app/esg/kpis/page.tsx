"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Minus, Plus, Target, Send, X, Building2, CheckCheck, Bell } from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend,
} from "recharts";
import toast from "react-hot-toast";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";

interface Kpi {
  id: string;
  name: string;
  category: string;
  current: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  color: string;
  icon: string;
  description: string;
}

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

const sponsors = [
  { id: "s1", name: "Coca-Cola Chile", initials: "CC", color: "#EF4444", email: "sponsor@coca-cola.cl" },
  { id: "s2", name: "Banco Santander", initials: "BS", color: "#EC4899", email: "esg@santander.cl" },
  { id: "s3", name: "Entel", initials: "EN", color: "#3B82F6", email: "sostenibilidad@entel.cl" },
  { id: "s4", name: "Falabella", initials: "FA", color: "#10B981", email: "esg@falabella.com" },
];

const EMPTY: Kpi[] = [];

export default function KPIsPage() {
  const { activeUser, loaded, isDemo } = useUser();
  const { data: kpis, reload } = useResource<Kpi[]>(
    loaded && activeUser ? "/api/kpis" : null, EMPTY,
  );
  const [showForm, setShowForm] = useState(false);
  const [newKpi, setNewKpi] = useState({ name: "", description: "", category: "Ambiental", current: "", target: "", unit: "" });
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedSponsors, setSelectedSponsors] = useState<string[]>(["s1", "s2", "s3", "s4"]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const toggleSponsor = (id: string) =>
    setSelectedSponsors((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const sendToSponsors = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1600));
    setSending(false);
    setSent(true);
    toast.success(`Notificación enviada a ${selectedSponsors.length} sponsor${selectedSponsors.length > 1 ? "s" : ""}`);
    setTimeout(() => { setSent(false); setShowSponsorModal(false); }, 1200);
  };

  const addKpi = async () => {
    if (!newKpi.name) return;
    try {
      await apiSend("/api/kpis", "POST", {
        name: newKpi.name,
        category: newKpi.category,
        current: parseFloat(newKpi.current) || 0,
        target: parseFloat(newKpi.target) || 100,
        unit: newKpi.unit || "-",
        trend: "up",
        color: "#10B981",
        icon: "📊",
        description: newKpi.name,
      });
      await reload();
      setShowForm(false);
      setNewKpi({ name: "", description: "", category: "Ambiental", current: "", target: "", unit: "" });
      toast.success("KPI agregado correctamente");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo crear el KPI");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        icon={<BarChart3 size={22} className="text-teal-600" />}
        title="KPIs y Performance ESG"
        subtitle="Monitorea el desempeño de tus indicadores de sostenibilidad"
        action={
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowSponsorModal(true)}
              whileHover={{ scale: 1.04, backgroundColor: "rgba(59,130,246,0.18)", boxShadow: "0 0 18px rgba(59,130,246,0.3)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border cursor-pointer"
              style={{ backgroundColor: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.35)", color: "#3B82F6" }}
            >
              <Bell size={15} />
              Actualizar Sponsor
            </motion.button>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              <Plus size={16} /> Nuevo KPI
            </button>
          </div>
        }
      />

      {/* No indicators yet — shown until the account has KPIs */}
      {kpis.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-sm font-medium text-slate-600">Aún no tienes historial de indicadores.</p>
          <p className="text-xs text-slate-400 mt-1.5">Agrega tu primer KPI con el botón &quot;Nuevo KPI&quot; para comenzar a medir tu desempeño ESG.</p>
        </div>
      )}

      {/* Illustrative trend/radar charts — sample data, demo accounts only */}
      {isDemo && (
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
      )}

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
          <div className="mt-4">
            <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Descripción</label>
            <textarea
              className="input-field w-full resize-none"
              rows={2}
              placeholder="Ej: Reducción 20% consumo hídrico sobre línea base 2025, valor actual m3, valor meta m3"
              value={newKpi.description}
              onChange={(e) => setNewKpi({ ...newKpi, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            <button onClick={addKpi} className="btn-primary">Agregar KPI</button>
          </div>
        </motion.div>
      )}

      {/* Sponsor Notification Modal */}
      {showSponsorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowSponsorModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(59,130,246,0.1)" }}>
                  <Building2 size={18} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Actualizar Sponsors ESG</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Notifica a tus marcas con el reporte actualizado</p>
                </div>
              </div>
              <button onClick={() => setShowSponsorModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            {/* ESG summary preview */}
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Resumen a enviar</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Ambiental", score: 85, color: "#10B981" },
                    { label: "Social", score: 84, color: "#06B6D4" },
                    { label: "Gobernanza", score: 83, color: "#8B5CF6" },
                  ].map((d) => (
                    <div key={d.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: d.color + "10", border: `1px solid ${d.color}25` }}>
                      <span className="text-xl font-black" style={{ color: d.color }}>{d.score}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sponsor selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sponsors a notificar</p>
                  <button
                    onClick={() => setSelectedSponsors(selectedSponsors.length === sponsors.length ? [] : sponsors.map((s) => s.id))}
                    className="text-xs text-blue-500 font-medium hover:underline"
                  >
                    {selectedSponsors.length === sponsors.length ? "Deseleccionar todos" : "Seleccionar todos"}
                  </button>
                </div>
                <div className="space-y-2">
                  {sponsors.map((sp) => {
                    const active = selectedSponsors.includes(sp.id);
                    return (
                      <button
                        key={sp.id}
                        onClick={() => toggleSponsor(sp.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150"
                        style={active
                          ? { backgroundColor: sp.color + "0d", border: `1.5px solid ${sp.color}30` }
                          : { backgroundColor: "#f8fafc", border: "1.5px solid #e2e8f0" }
                        }
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: sp.color }}
                        >
                          {sp.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{sp.name}</p>
                          <p className="text-xs text-slate-400 truncate">{sp.email}</p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                          style={active
                            ? { backgroundColor: sp.color, border: `2px solid ${sp.color}` }
                            : { border: "2px solid #cbd5e1", backgroundColor: "transparent" }
                          }
                        >
                          {active && <CheckCheck size={10} className="text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between p-6 pt-0">
              <p className="text-xs text-slate-400">
                {selectedSponsors.length} sponsor{selectedSponsors.length !== 1 ? "s" : ""} seleccionado{selectedSponsors.length !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowSponsorModal(false)} className="btn-secondary text-sm">Cancelar</button>
                <button
                  onClick={sendToSponsors}
                  disabled={selectedSponsors.length === 0 || sending || sent}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
                  style={{ backgroundColor: sent ? "#10B981" : "#3B82F6" }}
                >
                  {sent ? <CheckCheck size={15} /> : <Send size={15} />}
                  {sending ? "Enviando..." : sent ? "Enviado" : "Enviar notificación"}
                </button>
              </div>
            </div>
          </motion.div>
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
