"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign, X } from "lucide-react";
import { SectionHeader, ProgressBar } from "@/components/ui";
import { mockESGProjects } from "@/lib/data";
import {
  PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import toast from "react-hot-toast";

const COLORS = ["#10B981", "#06B6D4", "#8B5CF6", "#F59E0B", "#EF4444"];

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

const emptyGasto = { projectId: "", amount: "", description: "" };

export default function BudgetPage() {
  const [projects, setProjects] = useState(mockESGProjects.map((p) => ({ ...p })));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyGasto);

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const totalAvailable = totalBudget - totalSpent;
  const spentPct = (totalSpent / totalBudget) * 100;

  const budgetData = projects.map((p) => ({
    name: p.title.length > 20 ? p.title.slice(0, 20) + "…" : p.title,
    presupuesto: p.budget,
    gastado: p.spent,
  }));

  const pieData = projects.map((p, i) => ({
    name: p.title.length > 18 ? p.title.slice(0, 18) + "…" : p.title,
    value: p.budget,
    color: COLORS[i % COLORS.length],
  }));

  const handleRegistrar = () => {
    if (!form.projectId) { toast.error("Selecciona un proyecto"); return; }
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) { toast.error("Ingresa un monto válido"); return; }
    const project = projects.find((p) => p.id === form.projectId);
    if (!project) return;
    if (project.spent + amount > project.budget) {
      toast.error("El gasto supera el presupuesto disponible");
      return;
    }
    setProjects((prev) =>
      prev.map((p) => p.id === form.projectId ? { ...p, spent: p.spent + amount } : p)
    );
    setForm(emptyGasto);
    setShowModal(false);
    toast.success(`Gasto de $${amount.toLocaleString()} registrado en "${project.title}"`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <SectionHeader
        icon={<Wallet size={22} className="text-amber-400" />}
        title="Gestión Presupuestaria ESG"
        subtitle="Control de presupuestos, gastos y fuentes de financiamiento por proyecto"
        action={
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Registrar gasto
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Presupuesto total", value: `$${totalBudget.toLocaleString()}`, icon: <DollarSign size={18} />, color: "#F59E0B" },
          { label: "Total gastado", value: `$${totalSpent.toLocaleString()}`, icon: <TrendingDown size={18} />, color: "#EF4444", sub: `${spentPct.toFixed(0)}% del presupuesto` },
          { label: "Disponible", value: `$${totalAvailable.toLocaleString()}`, icon: <TrendingUp size={18} />, color: "#10B981" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold mt-1.5" style={{ color: s.color, fontFamily: "'Manrope', sans-serif" }}>{s.value}</p>
                {s.sub && <p className="text-xs text-slate-400 mt-1">{s.sub}</p>}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "18", color: s.color, border: `1px solid ${s.color}30` }}>
                {s.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-7">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Presupuesto vs. Gasto por proyecto</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
              <Bar dataKey="presupuesto" name="Presupuesto" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastado" name="Gastado" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-7">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Distribución presupuestaria</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={200}>
              <RechartsPie>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-slate-500 truncate">{d.name}</span>
                  <span className="text-xs font-semibold ml-auto" style={{ color: d.color }}>${d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project budgets table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800 text-sm">Detalle por proyecto</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {projects.map((project) => {
            const pct = (project.spent / project.budget) * 100;
            const remaining = project.budget - project.spent;
            return (
              <div key={project.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{project.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Resp: {project.responsible}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900">${project.budget.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">presupuesto</p>
                  </div>
                </div>
                <ProgressBar value={project.spent} max={project.budget} showPercent={false} height={5} color={pct > 90 ? "#EF4444" : "#F59E0B"} />
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-amber-400 font-semibold">${project.spent.toLocaleString()} gastado ({pct.toFixed(0)}%)</span>
                  <span className="text-teal-600 font-semibold">${remaining.toLocaleString()} disponible</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Registrar gasto modal */}
      <Portal>
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowModal(false)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="card w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Registrar gasto ESG</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Proyecto *</label>
                  <select className="input-field w-full" value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                    <option value="">Selecciona un proyecto</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} — disponible: ${(p.budget - p.spent).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Monto (USD) *</label>
                  <input type="number" min="1" placeholder="Ej: 5000" className="input-field w-full"
                    value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Descripción</label>
                  <input type="text" placeholder="Ej: Compra de paneles solares" className="input-field w-full"
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="btn-primary flex-1" onClick={handleRegistrar}>Registrar gasto</button>
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
