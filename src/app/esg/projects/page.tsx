"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Leaf, Calendar, ChevronDown, ChevronUp, CheckCircle, Circle,
  Edit, Trash2, Target, DollarSign, Users, Clock,
} from "lucide-react";
import { SectionHeader, ProgressBar, Badge } from "@/components/ui";
import { mockESGProjects, categoryLabels, categoryColors, categoryIcons } from "@/lib/data";
import { getStatusColor, getStatusLabel, cn } from "@/lib/utils";
import type { ESGProject } from "@/lib/types";
import toast from "react-hot-toast";

export default function ESGProjectsPage() {
  const [projects, setProjects] = useState<ESGProject[]>(mockESGProjects);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("huella_carbono");
  const [newBudget, setNewBudget] = useState("");
  const [newResponsible, setNewResponsible] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const categories = [
    "huella_carbono", "huella_hidrica", "gestion_residuos",
    "educacion", "inclusion", "equidad_genero",
  ];

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              milestones: p.milestones.map((m) =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m
              ),
            }
          : p
      )
    );
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const id = `p${Date.now()}`;
    const newProject: ESGProject = {
      id,
      title: newTitle,
      category: newCategory as ESGProject["category"],
      status: "planning",
      progress: 0,
      budget: parseInt(newBudget) || 0,
      spent: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0],
      responsible: newResponsible || "Por asignar",
      description: newDesc,
      milestones: [],
      kpis: [],
    };
    setProjects((prev) => [newProject, ...prev]);
    setShowForm(false);
    setNewTitle("");
    toast.success("¡Proyecto ESG creado exitosamente!");
  };

  const statusStats = {
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
    planning: projects.filter((p) => p.status === "planning").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <SectionHeader
        icon={<Leaf size={22} className="text-teal-600" />}
        title="Proyectos ESG"
        subtitle="Gestiona y monitorea tus iniciativas de sostenibilidad"
        action={
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={16} />
            Nuevo proyecto
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "En progreso", count: statusStats.in_progress, color: "#06B6D4", icon: <Clock size={16} /> },
          { label: "Planificación", count: statusStats.planning, color: "#F59E0B", icon: <Target size={16} /> },
          { label: "Completados", count: statusStats.completed, color: "#10B981", icon: <CheckCircle size={16} /> },
        ].map((s) => (
          <div key={s.label} className="card p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: s.color + "18", color: s.color, border: `1px solid ${s.color}30` }}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.count}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* New project form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 overflow-hidden"
          >
            <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <Plus size={16} className="text-teal-600" />
              Nuevo Proyecto ESG
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Nombre del proyecto *</label>
                <input className="input-field" placeholder="Ej: Reducción huella de carbono 2026" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Categoría ESG</label>
                <select className="input-field" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c} style={{ backgroundColor: "#fff" }}>{categoryIcons[c]} {categoryLabels[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Presupuesto ($)</label>
                <input className="input-field" type="number" placeholder="50000" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Responsable</label>
                <input className="input-field" placeholder="Nombre del responsable" value={newResponsible} onChange={(e) => setNewResponsible(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Descripción</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Descripción del proyecto y sus objetivos..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleCreate} className="btn-primary">Crear proyecto</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects list */}
      <div className="space-y-3">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card overflow-hidden"
          >
            {/* Header */}
            <div
              className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setExpanded(expanded === project.id ? null : project.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    {categoryIcons[project.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-sm">{project.title}</h3>
                      <span className={cn("badge", categoryColors[project.category])}>
                        {categoryLabels[project.category]}
                      </span>
                      <span className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{project.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Users size={11} /> {project.responsible}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={11} /> {new Date(project.endDate).toLocaleDateString("es-CL")}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <DollarSign size={11} /> ${project.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">{project.progress}%</p>
                    <p className="text-xs text-slate-400">completado</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="btn-ghost p-2" onClick={(e) => e.stopPropagation()}>
                      <Edit size={14} />
                    </button>
                    {expanded === project.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar value={project.progress} showPercent={false} />
              </div>
            </div>

            {/* Expanded content */}
            <AnimatePresence>
              {expanded === project.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                      {/* Milestones */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Hitos del proyecto</h4>
                        <div className="space-y-2.5">
                          {project.milestones.map((m) => (
                            <div key={m.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleToggleMilestone(project.id, m.id)}>
                              <div className="flex-shrink-0">
                                {m.completed ? (
                                  <CheckCircle size={16} className="text-teal-600" />
                                ) : (
                                  <Circle size={16} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                                )}
                              </div>
                              <span className={cn("text-sm flex-1", m.completed ? "line-through text-slate-400" : "text-slate-700")}>
                                {m.title}
                              </span>
                              <span className="text-xs text-slate-300">{new Date(m.date).toLocaleDateString("es-CL")}</span>
                            </div>
                          ))}
                          {project.milestones.length === 0 && (
                            <p className="text-xs text-slate-300 italic">No hay hitos definidos</p>
                          )}
                        </div>
                      </div>

                      {/* KPIs */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs e indicadores</h4>
                        <div className="space-y-3">
                          {project.kpis.map((kpi) => (
                            <div key={kpi.id} className="p-3 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs font-medium text-slate-700">{kpi.name}</span>
                                <span className={cn("text-xs font-semibold", kpi.trend === "up" ? "text-teal-600" : kpi.trend === "down" ? "text-red-400" : "text-slate-500")}>
                                  {kpi.current} / {kpi.target} {kpi.unit}
                                </span>
                              </div>
                              <ProgressBar value={kpi.current} max={kpi.target} showPercent={false} height={4} />
                            </div>
                          ))}
                          {project.kpis.length === 0 && (
                            <p className="text-xs text-slate-300 italic">Sin KPIs configurados</p>
                          )}
                        </div>
                        {/* Budget */}
                        <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Presupuesto</h5>
                          <ProgressBar value={project.spent} max={project.budget} showPercent={false} height={4} color="#F59E0B" />
                          <div className="flex justify-between mt-1.5">
                            <span className="text-xs text-amber-400 font-semibold">${project.spent.toLocaleString()} gastado</span>
                            <span className="text-xs text-slate-400">${project.budget.toLocaleString()} total</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
