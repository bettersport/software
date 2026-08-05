"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Leaf, Calendar, ChevronDown, ChevronUp, CheckCircle, Circle,
  Trash2, Target, DollarSign, Users, Clock, Zap, Lock,
  AlertTriangle, SlidersHorizontal, X, Shield,
} from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";
import { categoryLabels, categoryColors, categoryIcons } from "@/lib/data";
import { getStatusColor, getStatusLabel, cn } from "@/lib/utils";
import type { ESGProject, Club } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import { computeClubScore } from "@/lib/scoring";
import { useMemo } from "react";
import toast from "react-hot-toast";

const NO_PROJECTS: ESGProject[] = [];

/* ── Permission tiers ── */
const CAN_MANAGE = ["admin", "club", "manager"];
const CAN_READ   = ["auditor"];

const ROLE_LABELS: Record<string, string> = {
  admin:    "Administrador",
  club:     "Club Deportivo",
  brand:    "Marca / Sponsor",
  manager:  "Consultor ESG",
  auditor:  "Auditor ESG",
  solucion: "Proveedor de soluciones",
  hincha:   "Fan / Hincha",
};

/* ── Category → ESG dimension display ── */
const CATEGORY_DIM: Record<string, { label: string; color: string }> = {
  huella_carbono:   { label: "Ambiental",  color: "#10B981" },
  huella_hidrica:   { label: "Ambiental",  color: "#10B981" },
  gestion_residuos: { label: "Ambiental",  color: "#10B981" },
  educacion:        { label: "Social",     color: "#06B6D4" },
  inclusion:        { label: "Social",     color: "#06B6D4" },
  equidad_genero:   { label: "Gobernanza", color: "#8B5CF6" },
};

const STATUS_OPTIONS = [
  { value: "planning",    label: "Planificación" },
  { value: "in_progress", label: "En progreso"   },
  { value: "completed",   label: "Completado"    },
  { value: "paused",      label: "Pausado"       },
] as const;

const CATEGORIES = [
  "huella_carbono", "huella_hidrica", "gestion_residuos",
  "educacion", "inclusion", "equidad_genero",
];

export default function ESGProjectsPage() {
  const { activeUser, loaded } = useUser();
  const role = activeUser?.role ?? "hincha";
  const clubId = activeUser?.clubId ?? null;

  const { data: rawProjects, setData: setProjects, reload } = useResource<ESGProject[]>(
    loaded && activeUser ? "/api/projects" : null, NO_PROJECTS,
  );
  const { data: club } = useResource<Club | null>(
    loaded && clubId ? `/api/clubs/${clubId}` : null, null,
  );

  // Normalize nested JSON (milestones/kpis can be null coming from the DB).
  const projects = useMemo(
    () => rawProjects.map((p) => ({ ...p, milestones: p.milestones ?? [], kpis: p.kpis ?? [] })),
    [rawProjects],
  );

  // Live ESG score: recompute from the club baseline + current projects.
  const liveClub = useMemo(() => (club ? computeClubScore(club, projects) : null), [club, projects]);

  const canManage  = CAN_MANAGE.includes(role);
  const isReadOnly = CAN_READ.includes(role);
  const noAccess   = !canManage && !isReadOnly;

  /* ── UI state ── */
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState<ESGProject | null>(null);
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus,   setEditStatus]   = useState<ESGProject["status"]>("planning");
  const [pendingDel,   setPendingDel]   = useState<string | null>(null);

  /* ── New-project form state ── */
  const [newTitle,       setNewTitle]       = useState("");
  const [newCategory,    setNewCategory]    = useState("huella_carbono");
  const [newBudget,      setNewBudget]      = useState("");
  const [newResponsible, setNewResponsible] = useState("");
  const [newDesc,        setNewDesc]        = useState("");

  /* ── Handlers ── */
  const handleToggleMilestone = async (projectId: string, milestoneId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const milestones = (project.milestones ?? []).map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m,
    );
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, milestones } : p)));
    try {
      await apiSend(`/api/projects/${projectId}`, "PATCH", { milestones });
    } catch {
      reload();
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await apiSend("/api/projects", "POST", {
        title: newTitle,
        category: newCategory,
        status: "planning",
        budget: parseInt(newBudget) || 0,
        responsible: newResponsible || "Por asignar",
        description: newDesc,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 180 * 86400000).toISOString(),
        milestones: [],
        kpis: [],
      });
      await reload();
      setShowForm(false);
      setNewTitle(""); setNewCategory("huella_carbono");
      setNewBudget(""); setNewResponsible(""); setNewDesc("");
      toast.success("¡Proyecto ESG creado! El puntaje se ha recalculado.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo crear el proyecto");
    }
  };

  const openEdit = (project: ESGProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTarget(project);
    setEditProgress(project.progress);
    setEditStatus(project.status);
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    const id = editTarget.id;
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, progress: editProgress, status: editStatus } : p)));
    setEditTarget(null);
    try {
      await apiSend(`/api/projects/${id}`, "PATCH", { progress: editProgress, status: editStatus });
      toast.success("Proyecto actualizado · Puntaje ESG recalculado");
    } catch {
      reload();
      toast.error("No se pudo actualizar el proyecto");
    }
  };

  const confirmDelete = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setPendingDel(null);
    try {
      await apiSend(`/api/projects/${id}`, "DELETE");
      toast.success("Proyecto eliminado");
    } catch {
      reload();
      toast.error("No se pudo eliminar el proyecto");
    }
  };

  const statusStats = {
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    completed:   projects.filter((p) => p.status === "completed").length,
    planning:    projects.filter((p) => p.status === "planning").length,
  };

  /* ── No-access screen ── */
  if (noAccess) {
    return (
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          icon={<Leaf size={22} className="text-teal-600" />}
          title="Proyectos ESG"
          subtitle="Gestiona y monitorea tus iniciativas de sostenibilidad"
        />
        <div className="card p-16 text-center mt-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#f1f5f9" }}>
            <Lock size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">Acceso restringido</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            El perfil <strong>{ROLE_LABELS[role] ?? role}</strong> no tiene
            permisos para gestionar proyectos ESG.
          </p>
          <p className="text-xs text-slate-300 mt-4">
            Roles con acceso: Administrador · Club Deportivo · Consultor ESG · Auditor ESG (lectura)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SectionHeader
        icon={<Leaf size={22} className="text-teal-600" />}
        title="Proyectos ESG"
        subtitle="Gestiona y monitorea tus iniciativas de sostenibilidad"
        action={
          canManage ? (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              <Plus size={16} /> Nuevo proyecto
            </button>
          ) : undefined
        }
      />

      {/* ── Role / permission banner ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background: isReadOnly ? "rgba(59,130,246,0.06)" : "rgba(16,185,129,0.06)",
          border: isReadOnly ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(16,185,129,0.2)",
        }}
      >
        <Shield size={15} style={{ color: isReadOnly ? "#3B82F6" : "#10B981" }} />
        <p className="text-xs font-medium" style={{ color: isReadOnly ? "#3B82F6" : "#10B981" }}>
          Accediendo como <strong>{ROLE_LABELS[role] ?? role}</strong>
          {" — "}
          {isReadOnly
            ? "Modo solo lectura. Puedes ver proyectos pero no editarlos."
            : "Puedes crear, editar y eliminar proyectos ESG."}
        </p>
      </div>

      {/* ── Live ESG score banner (only when user has a linked club) ── */}
      {liveClub && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 flex items-center gap-4"
          style={{ borderLeft: "3px solid #10B981" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.1)" }}>
            <Zap size={18} className="text-teal-600" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Puntaje ESG en tiempo real · {liveClub.name}
            </p>
            <p className="text-2xl font-black text-teal-600">
              {liveClub.esgScore}{" "}
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-5">
            {[
              { label: "Ambiental",  value: liveClub.environmental, color: "#10B981" },
              { label: "Social",     value: liveClub.social,        color: "#06B6D4" },
              { label: "Gobernanza", value: liveClub.governance,    color: "#8B5CF6" },
            ].map((d) => (
              <div key={d.label} className="text-center">
                <p className="text-base font-black" style={{ color: d.color }}>{d.value}</p>
                <p className="text-[10px] text-slate-400">{d.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-300 hidden lg:block ml-2 max-w-[120px] text-right leading-snug">
            Se actualiza con el progreso de tus proyectos
          </p>
        </motion.div>
      )}

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "En progreso",  count: statusStats.in_progress, color: "#06B6D4", icon: <Clock size={16} /> },
          { label: "Planificación",count: statusStats.planning,    color: "#F59E0B", icon: <Target size={16} /> },
          { label: "Completados",  count: statusStats.completed,   color: "#10B981", icon: <CheckCircle size={16} /> },
        ].map((s) => (
          <div key={s.label} className="card p-6 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: s.color + "18", color: s.color, border: `1px solid ${s.color}30` }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.count}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── New project form ── */}
      <AnimatePresence>
        {showForm && canManage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 overflow-hidden"
          >
            <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <Plus size={16} className="text-teal-600" /> Nuevo Proyecto ESG
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Nombre del proyecto *</label>
                <input className="input-field" placeholder="Ej: Reducción huella de carbono 2026"
                  value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Categoría ESG</label>
                <select className="input-field" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{categoryIcons[c]} {categoryLabels[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Presupuesto ($)</label>
                <input className="input-field" type="number" placeholder="50000"
                  value={newBudget} onChange={(e) => setNewBudget(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Responsable</label>
                <input className="input-field" placeholder="Nombre del responsable"
                  value={newResponsible} onChange={(e) => setNewResponsible(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Descripción</label>
                <textarea className="input-field resize-none" rows={3}
                  placeholder="Descripción del proyecto y sus objetivos..."
                  value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleCreate} className="btn-primary">Crear proyecto</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Projects list ── */}
      <div className="space-y-3">
        {projects.map((project, i) => {
          const dim = CATEGORY_DIM[project.category];
          return (
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
                        <span className={getStatusColor(project.status)}>
                          {getStatusLabel(project.status)}
                        </span>
                        {dim && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: dim.color + "15", color: dim.color }}
                          >
                            → {dim.label}
                          </span>
                        )}
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
                    {canManage && (
                      <div className="flex items-center gap-1">
                        <button
                          className="btn-ghost p-2 hover:text-teal-600 transition-colors"
                          onClick={(e) => openEdit(project, e)}
                          title="Editar progreso"
                        >
                          <SlidersHorizontal size={14} />
                        </button>
                        <button
                          className="btn-ghost p-2 hover:text-red-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingDel(pendingDel === project.id ? null : project.id);
                          }}
                          title="Eliminar proyecto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    {expanded === project.id
                      ? <ChevronUp size={16} className="text-slate-400" />
                      : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                <div className="mt-3">
                  <ProgressBar value={project.progress} showPercent={false} />
                </div>

                {/* Inline delete confirmation */}
                <AnimatePresence>
                  {pendingDel === project.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                        style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
                      >
                        <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                        <p className="text-xs text-red-500 flex-1">
                          ¿Eliminar &quot;{project.title}&quot;? Esta acción no se puede deshacer.
                        </p>
                        <button
                          className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                          onClick={() => confirmDelete(project.id)}
                        >
                          Eliminar
                        </button>
                        <button
                          className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg transition-colors"
                          onClick={() => setPendingDel(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Hitos del proyecto
                          </h4>
                          <div className="space-y-2.5">
                            {project.milestones.map((m) => (
                              <div
                                key={m.id}
                                className={cn("flex items-center gap-3 group", canManage && "cursor-pointer")}
                                onClick={() => canManage && handleToggleMilestone(project.id, m.id)}
                              >
                                <div className="flex-shrink-0">
                                  {m.completed ? (
                                    <CheckCircle size={16} className="text-teal-600" />
                                  ) : (
                                    <Circle size={16} className={cn("text-slate-300", canManage && "group-hover:text-slate-400 transition-colors")} />
                                  )}
                                </div>
                                <span className={cn("text-sm flex-1", m.completed ? "line-through text-slate-400" : "text-slate-700")}>
                                  {m.title}
                                </span>
                                <span className="text-xs text-slate-300">
                                  {new Date(m.date).toLocaleDateString("es-CL")}
                                </span>
                              </div>
                            ))}
                            {project.milestones.length === 0 && (
                              <p className="text-xs text-slate-300 italic">No hay hitos definidos</p>
                            )}
                          </div>
                        </div>

                        {/* KPIs + Budget */}
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            KPIs e indicadores
                          </h4>
                          <div className="space-y-3">
                            {project.kpis.map((kpi) => (
                              <div key={kpi.id} className="p-3 rounded-xl"
                                style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-xs font-medium text-slate-700">{kpi.name}</span>
                                  <span className={cn("text-xs font-semibold",
                                    kpi.trend === "up" ? "text-teal-600"
                                    : kpi.trend === "down" ? "text-red-400"
                                    : "text-slate-500"
                                  )}>
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
                          <div className="mt-4 p-3 rounded-xl"
                            style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                              Presupuesto
                            </h5>
                            <ProgressBar value={project.spent} max={project.budget}
                              showPercent={false} height={4} color="#F59E0B" />
                            <div className="flex justify-between mt-1.5">
                              <span className="text-xs text-amber-400 font-semibold">
                                ${project.spent.toLocaleString()} gastado
                              </span>
                              <span className="text-xs text-slate-400">
                                ${project.budget.toLocaleString()} total
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── Edit-progress modal ── */}
      <AnimatePresence>
        {editTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
            onClick={() => setEditTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-16 px-5 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal size={16} className="text-teal-400" />
                  <h2 className="text-sm font-bold text-white">Actualizar progreso</h2>
                </div>
                <button
                  onClick={() => setEditTarget(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={13} className="text-white" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Project reference */}
                <div className="p-3 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <p className="text-xs text-slate-400 mb-0.5">Proyecto</p>
                  <p className="text-sm font-semibold text-slate-800">{editTarget.title}</p>
                  {CATEGORY_DIM[editTarget.category] && (
                    <p className="text-xs mt-1" style={{ color: CATEGORY_DIM[editTarget.category].color }}>
                      Impacta en: <strong>{CATEGORY_DIM[editTarget.category].label}</strong>
                    </p>
                  )}
                </div>

                {/* Status pills */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Estado</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setEditStatus(s.value)}
                        className={cn(
                          "py-2 px-3 rounded-xl text-xs font-semibold transition-all border",
                          editStatus === s.value
                            ? "border-teal-400 text-teal-600 bg-teal-50"
                            : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Progreso</label>
                    <span className="text-lg font-black text-teal-600">{editProgress}%</span>
                  </div>
                  <input
                    type="range" min={0} max={100} step={1}
                    value={editProgress}
                    onChange={(e) => setEditProgress(Number(e.target.value))}
                    className="w-full accent-teal-500 h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                    <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                  </div>
                </div>

                {/* Live ESG impact preview */}
                {liveClub && CATEGORY_DIM[editTarget.category] && (
                  <div className="p-3 rounded-xl"
                    style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap size={12} className="text-teal-600" />
                      <p className="text-xs font-semibold text-teal-700">Impacto en puntaje ESG</p>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Al <strong>{editProgress}%</strong> de progreso, este proyecto aporta{" "}
                      <strong>+{((editProgress / 100) * (10 / 3)).toFixed(1)} pts</strong> al pilar de{" "}
                      <strong style={{ color: CATEGORY_DIM[editTarget.category].color }}>
                        {CATEGORY_DIM[editTarget.category].label}
                      </strong>{" "}
                      de {liveClub.name}.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button onClick={saveEdit} className="btn-primary flex-1">Guardar cambios</button>
                  <button onClick={() => setEditTarget(null)} className="btn-secondary">Cancelar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
