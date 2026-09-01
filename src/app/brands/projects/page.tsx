"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Handshake, Plus, Filter, TrendingUp, DollarSign, Users, Target, X, ExternalLink } from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import toast from "react-hot-toast";

type Project = {
  id: string;
  brand: string;
  project: string;
  status: string;
  investment: number;
  reach: number;
  esgScore: number;
  category: string;
  progress: number;
  description: string;
};

const emptyForm = { brand: "", project: "", category: "Ambiental", investment: "", reach: "", description: "" };

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

const statusColors: Record<string, string> = { Activo: "#10B981", Evaluación: "#F59E0B", Propuesta: "#06B6D4" };
const categoryFilters = ["Todos", "Ambiental", "Social", "Gobernanza"];

const NO_PROJECTS: Project[] = [];

export default function BrandsProjectsPage() {
  const { activeUser, loaded } = useUser();
  const { data: projects, reload } = useResource<Project[]>(
    loaded && activeUser ? "/api/brand-projects" : null, NO_PROJECTS,
  );
  const [filter, setFilter] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editStatus, setEditStatus] = useState("Propuesta");
  const [editProgress, setEditProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  const openProject = (p: Project) => {
    setSelectedProject(p);
    setEditStatus(p.status);
    setEditProgress(p.progress);
  };

  const handleSaveProject = async () => {
    if (!selectedProject) return;
    setSaving(true);
    try {
      await apiSend(`/api/brand-projects/${selectedProject.id}`, "PATCH", { status: editStatus, progress: editProgress });
      await reload();
      setSelectedProject(null);
      toast.success("Proyecto actualizado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    if (!window.confirm(`¿Eliminar el proyecto "${selectedProject.project}"?`)) return;
    setSaving(true);
    try {
      await apiSend(`/api/brand-projects/${selectedProject.id}`, "DELETE");
      await reload();
      setSelectedProject(null);
      toast.success("Proyecto eliminado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
    } finally {
      setSaving(false);
    }
  };

  const filtered = filter === "Todos" ? projects : projects.filter((p) => p.category === filter);
  const totalInvestment = projects.reduce((s, p) => s + p.investment, 0);
  const totalReach = projects.reduce((s, p) => s + p.reach, 0);
  const activeCount = projects.filter((p) => p.status === "Activo").length;
  const scoredProjects = projects.filter((p) => p.esgScore > 0);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.brand.trim()) errs.brand = "Obligatorio";
    if (!form.project.trim()) errs.project = "Obligatorio";
    if (!form.description.trim()) errs.description = "Obligatorio";
    if (!form.investment || isNaN(Number(form.investment)) || Number(form.investment) <= 0)
      errs.investment = "Ingresa un monto válido";
    if (!form.reach || isNaN(Number(form.reach)) || Number(form.reach) <= 0)
      errs.reach = "Ingresa un alcance válido";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    const projectName = form.project.trim();
    try {
      await apiSend("/api/brand-projects", "POST", {
        brand: form.brand.trim(),
        project: projectName,
        status: "Propuesta",
        investment: Number(form.investment),
        reach: Number(form.reach),
        esgScore: 0,
        category: form.category,
        progress: 0,
        description: form.description.trim(),
      });
      await reload();
      setShowNewModal(false);
      setForm(emptyForm);
      setFormErrors({});
      toast.success(`Propuesta "${projectName}" enviada correctamente`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo enviar la propuesta");
    }
  };

  const closeNewModal = () => { setShowNewModal(false); setForm(emptyForm); setFormErrors({}); };

  if (!loaded) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        icon={<Handshake size={22} className="text-teal-600" />}
        title="Proyectos con Clubes y Federaciones"
        subtitle="Colaboraciones y patrocinios con impacto ESG verificado"
        action={
          <button className="btn-primary" onClick={() => setShowNewModal(true)}>
            <Plus size={16} /> Nueva propuesta
          </button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Inversión total", value: `$${(totalInvestment / 1000).toFixed(0)}K`, icon: <DollarSign size={16} />, color: "#10B981" },
          { label: "Proyectos activos", value: activeCount.toString(), icon: <Target size={16} />, color: "#3B82F6" },
          { label: "Alcance total", value: `${(totalReach / 1000).toFixed(1)}K`, icon: <Users size={16} />, color: "#8B5CF6" },
          { label: "Score prom.", value: scoredProjects.length ? `${Math.round(scoredProjects.reduce((s: number, p: Project) => s + p.esgScore, 0) / scoredProjects.length)}` : "—", icon: <TrendingUp size={16} />, color: "#F59E0B" },
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
        {categoryFilters.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === c ? "bg-teal-50 text-teal-600 border border-teal-200" : "text-slate-400 hover:text-slate-800 hover:bg-slate-50 border border-transparent"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Empty states — distinguish "no projects at all" from "none in this filter" */}
      {filtered.length === 0 && projects.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-sm font-medium text-slate-600">Aún no tienes proyectos de patrocinio.</p>
          <p className="text-xs text-slate-400 mt-1.5">Crea tu primer proyecto con el botón &quot;Nueva propuesta&quot; o explora el marketplace para patrocinar eventos.</p>
        </div>
      )}
      {filtered.length === 0 && projects.length > 0 && (
        <div className="card p-10 text-center">
          <p className="text-sm font-medium text-slate-600">No hay proyectos en esta categoría.</p>
          <p className="text-xs text-slate-400 mt-1.5">Prueba con otro filtro o selecciona &quot;Todos&quot;.</p>
        </div>
      )}

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => openProject(p)}
            className="card p-7 card-hover cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 border border-slate-200 flex items-center justify-center font-bold text-teal-600 text-sm">{p.brand[0]}</div>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: statusColors[p.status] + "15", color: statusColors[p.status], border: `1px solid ${statusColors[p.status]}30` }}>{p.status}</span>
            </div>
            <p className="text-xs text-teal-600 font-semibold mb-0.5">{p.brand}</p>
            <h4 className="font-semibold text-slate-800 text-sm mb-1">{p.project}</h4>
            <p className="text-xs text-slate-400 mb-4 line-clamp-2">{p.description}</p>
            {p.progress > 0 && (
              <div className="mb-4">
                <ProgressBar value={p.progress} showPercent={true} height={5} />
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-xs text-slate-400 mb-0.5">Inversión</p>
                <p className="text-sm font-bold" style={{ color: "#F59E0B" }}>${(p.investment / 1000).toFixed(0)}k</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-xs text-slate-400 mb-0.5">Alcance</p>
                <p className="text-sm font-bold text-slate-900">{(p.reach / 1000).toFixed(1)}k</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-xs text-slate-400 mb-0.5">ESG</p>
                <p className="text-sm font-bold text-teal-600">{p.esgScore > 0 ? p.esgScore : "—"}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid #161d29" }}>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{p.category}</span>
              <span className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Ver detalle <ExternalLink size={10} /></span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail modal */}
      <Portal>
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 border border-slate-200 flex items-center justify-center font-bold text-teal-600 text-lg">{selectedProject.brand[0]}</div>
                  <div>
                    <p className="text-xs text-teal-600 font-semibold">{selectedProject.brand}</p>
                    <h3 className="font-bold text-slate-900">{selectedProject.project}</h3>
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><X size={18} className="text-slate-400" /></button>
              </div>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">{selectedProject.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-400">Inversión</p>
                  <p className="text-lg font-bold" style={{ color: "#F59E0B" }}>${selectedProject.investment.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-400">Score ESG</p>
                  <p className="text-lg font-bold text-teal-600">{selectedProject.esgScore > 0 ? `${selectedProject.esgScore}/100` : "Pendiente"}</p>
                </div>
              </div>
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Estado</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="input-field w-full">
                    <option value="Propuesta">Propuesta</option>
                    <option value="Evaluación">Evaluación</option>
                    <option value="Activo">Activo</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Progreso del proyecto</label>
                    <span className="text-xs font-semibold text-slate-600">{editProgress}%</span>
                  </div>
                  <input type="range" min={0} max={100} step={1} value={editProgress} onChange={(e) => setEditProgress(Number(e.target.value))} className="w-full accent-teal-600" />
                  <div className="mt-2">
                    <ProgressBar value={editProgress} showPercent={false} height={8} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mb-6">
                <span className="badge badge-green">{selectedProject.status}</span>
                <span className="badge badge-cyan">{selectedProject.category}</span>
                <span className="badge badge-purple">{(selectedProject.reach / 1000).toFixed(1)}K alcance</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDeleteProject} disabled={saving} className="btn-secondary flex-1 text-red-600 disabled:opacity-50">Eliminar</button>
                <button onClick={handleSaveProject} disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? "Guardando…" : "Guardar"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>

      {/* New proposal modal */}
      <Portal>
      <AnimatePresence>
        {showNewModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeNewModal}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Nueva propuesta</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Completa los datos para enviar tu propuesta de colaboración</p>
                </div>
                <button onClick={closeNewModal} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><X size={18} className="text-slate-400" /></button>
              </div>

              <div className="space-y-4">
                {/* Brand */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Nombre de la marca *</label>
                  <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Ej. EcoSport Solutions" className="input-field w-full" />
                  {formErrors.brand && <p className="text-xs text-red-500 mt-1">{formErrors.brand}</p>}
                </div>

                {/* Project name */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Nombre del proyecto *</label>
                  <input type="text" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Ej. Energía Renovable Estadio" className="input-field w-full" />
                  {formErrors.project && <p className="text-xs text-red-500 mt-1">{formErrors.project}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Categoría ESG *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field w-full">
                    <option value="Ambiental">Ambiental</option>
                    <option value="Social">Social</option>
                    <option value="Gobernanza">Gobernanza</option>
                  </select>
                </div>

                {/* Investment + Reach */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Inversión (USD) *</label>
                    <input type="number" min="0" value={form.investment} onChange={(e) => setForm({ ...form, investment: e.target.value })} placeholder="Ej. 25000" className="input-field w-full" />
                    {formErrors.investment && <p className="text-xs text-red-500 mt-1">{formErrors.investment}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Alcance estimado *</label>
                    <input type="number" min="0" value={form.reach} onChange={(e) => setForm({ ...form, reach: e.target.value })} placeholder="Ej. 5000" className="input-field w-full" />
                    {formErrors.reach && <p className="text-xs text-red-500 mt-1">{formErrors.reach}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Descripción del proyecto *</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe el impacto ESG esperado..." className="input-field w-full resize-none" />
                  {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={closeNewModal} className="btn-secondary flex-1">Cancelar</button>
                <button onClick={handleSubmit} className="btn-primary flex-1">Enviar propuesta</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </div>
  );
}
