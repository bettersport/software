"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Minus, Plus, X, Building2, CheckCheck, Bell, Copy, Trash2, Save, Pencil } from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";
import { IconChip } from "@/components/ui/icons";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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

interface SponsorLead {
  id: string;
  brand: string;
  category: string;
  amount: number;
  stage: string;
  color: string;
}

interface ClubScores {
  id: string;
  name: string;
  environmental: number;
  social: number;
  governance: number;
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

const EMPTY: Kpi[] = [];
const EMPTY_LEADS: SponsorLead[] = [];

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";

export default function KPIsPage() {
  const { activeUser, loaded, isDemo } = useUser();
  const { data: kpis, reload } = useResource<Kpi[]>(
    loaded && activeUser ? "/api/kpis" : null, EMPTY,
  );
  const { data: leads } = useResource<SponsorLead[]>(
    loaded && activeUser ? "/api/sponsor-leads" : null, EMPTY_LEADS,
  );
  const clubId = activeUser?.clubId ?? null;
  const { data: club } = useResource<ClubScores | null>(
    loaded && activeUser && clubId ? `/api/clubs/${clubId}` : null, null,
  );
  const [showForm, setShowForm] = useState(false);
  const [newKpi, setNewKpi] = useState({ name: "", description: "", category: "Ambiental", current: "", target: "", unit: "" });
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedSponsors, setSelectedSponsors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Sponsors vinculados = leads cerrados en Gestión Sponsorship
  const sponsors = leads.filter((l) => l.stage === "Cierre");

  const scores = [
    { label: "Ambiental", score: club?.environmental, color: "#10B981" },
    { label: "Social", score: club?.social, color: "#06B6D4" },
    { label: "Gobernanza", score: club?.governance, color: "#8B5CF6" },
  ];

  const toggleSponsor = (id: string) =>
    setSelectedSponsors((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const copySummary = async () => {
    const chosen = sponsors.filter((s) => selectedSponsors.includes(s.id));
    const lines: string[] = [];
    lines.push(`Resumen ESG — ${club?.name ?? activeUser?.club ?? activeUser?.name ?? "Club"}`);
    lines.push(`Fecha: ${new Date().toLocaleDateString("es-CL")}`);
    if (chosen.length) lines.push(`Para: ${chosen.map((s) => s.brand).join(", ")}`);
    lines.push("");
    lines.push("Puntajes ESG:");
    scores.forEach((d) => lines.push(`  - ${d.label}: ${d.score ?? "—"}`));
    lines.push("");
    lines.push(`Indicadores (${kpis.length}):`);
    if (kpis.length === 0) lines.push("  (sin KPIs registrados)");
    kpis.forEach((k) => {
      const pct = k.target ? Math.min((k.current / k.target) * 100, 100) : 0;
      lines.push(`  - ${k.name} [${k.category}]: ${k.current.toLocaleString()} / ${k.target.toLocaleString()} ${k.unit} (${pct.toFixed(0)}%)`);
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      toast.success("Resumen copiado — pégalo en tu correo a sponsors");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar al portapapeles");
    }
  };

  const addKpi = async () => {
    if (!newKpi.name) return;
    try {
      await apiSend("/api/kpis", "POST", {
        name: newKpi.name,
        category: newKpi.category,
        current: parseFloat(newKpi.current) || 0,
        target: parseFloat(newKpi.target) || 100,
        unit: newKpi.unit.trim() || "-",
        description: newKpi.description,
      });
      await reload();
      setShowForm(false);
      setNewKpi({ name: "", description: "", category: "Ambiental", current: "", target: "", unit: "" });
      toast.success("KPI agregado correctamente");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo crear el KPI");
    }
  };

  const startEdit = (kpi: Kpi) => {
    setEditingId(kpi.id);
    setEditValue(String(kpi.current));
  };

  const saveValue = async (id: string) => {
    const value = parseFloat(editValue);
    if (Number.isNaN(value)) { toast.error("Ingresa un valor numérico"); return; }
    setSaving(true);
    try {
      await apiSend(`/api/kpis/${id}`, "PATCH", { current: value });
      await reload();
      setEditingId(null);
      toast.success("Valor actualizado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo actualizar el KPI");
    } finally {
      setSaving(false);
    }
  };

  const deleteKpi = async (kpi: Kpi) => {
    if (!confirm(`¿Eliminar el KPI "${kpi.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await apiSend(`/api/kpis/${kpi.id}`, "DELETE");
      await reload();
      toast.success("KPI eliminado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar el KPI");
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
              <CartesianGrid strokeDasharray="3 3" stroke="#232c3a" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[65, 95]} />
              <Tooltip contentStyle={{ backgroundColor: "#10151f", border: "1px solid #232c3a", borderRadius: "12px", color: "#f4f7fb", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#a8b3c4" }} />
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
              <PolarGrid stroke="#232c3a" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: "#a8b3c4", fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ backgroundColor: "#10151f", border: "1px solid #232c3a", borderRadius: "12px", color: "#f4f7fb", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      )}

      {/* New KPI form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Nuevo KPI</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Nombre</label>
              <input className="input-field" placeholder="Nombre del indicador" value={newKpi.name} onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Categoría</label>
              <select className="input-field" value={newKpi.category} onChange={(e) => setNewKpi({ ...newKpi, category: e.target.value })}>
                {["Ambiental", "Social", "Gobernanza"].map((c) => (
                  <option key={c} value={c} style={{ backgroundColor: "#10151f" }}>{c}</option>
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
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Unidad</label>
              <input className="input-field" placeholder="Ej: m3, kWh, %" value={newKpi.unit} onChange={(e) => setNewKpi({ ...newKpi, unit: e.target.value })} />
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

      {/* Sponsor summary modal */}
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
            className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(59,130,246,0.1)" }}>
                  <Building2 size={18} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Actualizar Sponsors ESG</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Prepara un resumen ESG para compartir con tus marcas</p>
                </div>
              </div>
              <button onClick={() => setShowSponsorModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            {/* ESG summary preview */}
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Resumen a compartir</p>
                <div className="grid grid-cols-3 gap-3">
                  {scores.map((d) => (
                    <div key={d.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: d.color + "10", border: `1px solid ${d.color}25` }}>
                      <span className="text-xl font-black" style={{ color: d.color }}>{d.score ?? "—"}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sponsor selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sponsors vinculados</p>
                  {sponsors.length > 0 && (
                    <button
                      onClick={() => setSelectedSponsors(selectedSponsors.length === sponsors.length ? [] : sponsors.map((s) => s.id))}
                      className="text-xs text-blue-500 font-medium hover:underline"
                    >
                      {selectedSponsors.length === sponsors.length ? "Deseleccionar todos" : "Seleccionar todos"}
                    </button>
                  )}
                </div>
                {sponsors.length === 0 ? (
                  <div className="rounded-xl p-5 text-center" style={{ backgroundColor: "#10151f", border: "1.5px dashed #232c3a" }}>
                    <p className="text-sm text-slate-500">Aún no tienes sponsors vinculados</p>
                    <p className="text-xs text-slate-400 mt-1">Cierra un lead en Gestión Sponsorship para verlo aquí.</p>
                  </div>
                ) : (
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
                          : { backgroundColor: "#10151f", border: "1.5px solid #232c3a" }
                        }
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: sp.color }}
                        >
                          {initials(sp.brand)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{sp.brand}</p>
                          <p className="text-xs text-slate-400 truncate">{sp.category}</p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                          style={active
                            ? { backgroundColor: sp.color, border: `2px solid ${sp.color}` }
                            : { border: "2px solid #2a3442", backgroundColor: "transparent" }
                          }
                        >
                          {active && <CheckCheck size={10} className="text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                )}
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
                  onClick={copySummary}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{ backgroundColor: copied ? "#10B981" : "#3B82F6" }}
                >
                  {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
                  {copied ? "Copiado" : "Copiar resumen ESG"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => {
          const pct = kpi.target ? Math.min((kpi.current / kpi.target) * 100, 100) : 0;
          const achieved = pct >= 100;
          const editing = editingId === kpi.id;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-7"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <IconChip emoji={kpi.icon} color={kpi.color} />
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
                <div className="flex items-center gap-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp size={16} className="text-teal-600" />
                  ) : kpi.trend === "down" ? (
                    <TrendingDown size={16} className="text-red-400" />
                  ) : (
                    <Minus size={16} className="text-slate-400" />
                  )}
                  <button
                    onClick={() => deleteKpi(kpi)}
                    title="Eliminar KPI"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
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

              {/* Update value */}
              <div className="mt-3">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="input-field text-sm py-1.5"
                      type="number"
                      value={editValue}
                      autoFocus
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveValue(kpi.id); if (e.key === "Escape") setEditingId(null); }}
                    />
                    <button
                      onClick={() => saveValue(kpi.id)}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                      style={{ backgroundColor: "#10B981" }}
                    >
                      <Save size={12} /> Guardar
                    </button>
                    <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(kpi)}
                    className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:underline"
                  >
                    <Pencil size={12} /> Actualizar valor
                  </button>
                )}
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
