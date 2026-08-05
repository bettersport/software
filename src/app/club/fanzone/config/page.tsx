"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Save, Edit2, X, Check,
  Zap, Gift, ChevronDown, ChevronUp, AlertCircle, CheckCircle2,
} from "lucide-react";
import type { FanAction, FanReward, FanActionCategory, FanRewardType } from "@/lib/types";
import { fanActions as defaultActions, fanRewards as defaultRewards } from "@/lib/data";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import toast from "react-hot-toast";

// ── config defaults ────────────────────────────────────────────────────────────

const EMPTY_CONFIG: { actions: FanAction[] | null; rewards: FanReward[] | null } = {
  actions: null, rewards: null,
};

// ── constants ─────────────────────────────────────────────────────────────────

const ACTION_CATEGORIES: { value: FanActionCategory; label: string; color: string }[] = [
  { value: "fisica",   label: "Física",   color: "#10B981" },
  { value: "digital",  label: "Digital",  color: "#6366F1" },
  { value: "social",   label: "Social",   color: "#F59E0B" },
];

const REWARD_TYPES: { value: FanRewardType; label: string; color: string }[] = [
  { value: "club",    label: "Club",    color: "#10B981" },
  { value: "sponsor", label: "Sponsor", color: "#06B6D4" },
  { value: "badge",   label: "Badge",   color: "#8B5CF6" },
];

const FREQUENCIES = [
  "Por partido", "Por evento", "Mensual", "Única vez", "Por referido", "Por proyecto", "Por post",
];

const EMOJI_SUGGESTIONS = [
  "♻️","🚲","📸","🌱","🧴","👤","📊","🎯","🗳️","🔗","📱","🏷️",
  "🎫","👕","🏟️","⭐","🛍️","🥤","🏅","🌟","🌍","🏆","💚","🤝",
];

// ── empty templates ────────────────────────────────────────────────────────────

const emptyAction = (): Omit<FanAction, "id"> => ({
  title: "", description: "", points: 50, category: "fisica", icon: "🌱", frequency: "Por partido",
});

const emptyReward = (): Omit<FanReward, "id"> => ({
  name: "", description: "", points: 500, type: "club", icon: "🎫", available: true,
});

function uid() { return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

// ── sub-components ────────────────────────────────────────────────────────────

function CategoryBadge({ cat }: { cat: FanActionCategory }) {
  const c = ACTION_CATEGORIES.find((x) => x.value === cat)!;
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${c.color}18`, color: c.color }}>
      {c.label}
    </span>
  );
}

function TypeBadge({ type }: { type: FanRewardType }) {
  const c = REWARD_TYPES.find((x) => x.value === type)!;
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${c.color}18`, color: c.color }}>
      {c.label}
    </span>
  );
}

// ── action form modal ─────────────────────────────────────────────────────────

interface ActionFormProps {
  initial: Omit<FanAction, "id"> & { id?: string };
  onSave: (a: FanAction) => void;
  onClose: () => void;
}

function ActionForm({ initial, onSave, onClose }: ActionFormProps) {
  const [form, setForm] = useState(initial);
  const [showEmoji, setShowEmoji] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) { toast.error("El título es obligatorio"); return; }
    if (form.points <= 0)    { toast.error("Los puntos deben ser mayores a 0"); return; }
    onSave({ ...form, id: initial.id ?? uid() } as FanAction);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{initial.id ? "Editar acción" : "Nueva acción ESG"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Icon picker */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Icono</label>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="text-2xl w-12 h-12 rounded-xl border-2 border-slate-200 hover:border-teal-400 flex items-center justify-center transition-colors"
              >
                {form.icon}
              </button>
              <span className="text-xs text-slate-400">Haz clic para cambiar el emoji</span>
            </div>
            {showEmoji && (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-2">
                {EMOJI_SUGGESTIONS.map((e) => (
                  <button key={e} onClick={() => { set("icon", e); setShowEmoji(false); }}
                    className="text-xl hover:scale-125 transition-transform">
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Título *</label>
            <input className="input-field w-full" placeholder="Ej: Reciclar en el estadio"
              value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Descripción</label>
            <textarea className="input-field w-full resize-none" rows={2}
              placeholder="Explica cómo completar esta acción"
              value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          {/* Category + Points */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Categoría</label>
              <select className="input-field w-full" value={form.category}
                onChange={(e) => set("category", e.target.value as FanActionCategory)}>
                {ACTION_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Puntos</label>
              <input type="number" min={1} max={500} className="input-field w-full"
                value={form.points} onChange={(e) => set("points", parseInt(e.target.value) || 0)} />
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Frecuencia</label>
            <select className="input-field w-full" value={form.frequency}
              onChange={(e) => set("frequency", e.target.value)}>
              {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
            <Save size={14} /> Guardar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── reward form modal ─────────────────────────────────────────────────────────

interface RewardFormProps {
  initial: Omit<FanReward, "id"> & { id?: string };
  onSave: (r: FanReward) => void;
  onClose: () => void;
}

function RewardForm({ initial, onSave, onClose }: RewardFormProps) {
  const [form, setForm] = useState(initial);
  const [showEmoji, setShowEmoji] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    onSave({ ...form, id: initial.id ?? uid() } as FanReward);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{initial.id ? "Editar recompensa" : "Nueva recompensa"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Icon */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Icono</label>
            <div className="flex gap-3 items-center">
              <button onClick={() => setShowEmoji(!showEmoji)}
                className="text-2xl w-12 h-12 rounded-xl border-2 border-slate-200 hover:border-teal-400 flex items-center justify-center transition-colors">
                {form.icon}
              </button>
              <span className="text-xs text-slate-400">Haz clic para cambiar el emoji</span>
            </div>
            {showEmoji && (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-2">
                {EMOJI_SUGGESTIONS.map((e) => (
                  <button key={e} onClick={() => { set("icon", e); setShowEmoji(false); }}
                    className="text-xl hover:scale-125 transition-transform">
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Nombre *</label>
            <input className="input-field w-full" placeholder="Ej: 20% descuento en entradas"
              value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Descripción</label>
            <textarea className="input-field w-full resize-none" rows={2}
              placeholder="Condiciones del canje"
              value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          {/* Type + Points */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Tipo</label>
              <select className="input-field w-full" value={form.type}
                onChange={(e) => set("type", e.target.value as FanRewardType)}>
                {REWARD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                {form.type === "badge" ? "Puntos (0 = gratis)" : "Puntos requeridos"}
              </label>
              <input type="number" min={0} className="input-field w-full"
                value={form.points} onChange={(e) => set("points", parseInt(e.target.value) || 0)} />
            </div>
          </div>

          {/* Quota + Available */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Cupos (vacío = ilimitado)</label>
              <input type="number" min={0} className="input-field w-full" placeholder="Ej: 20"
                value={form.quota ?? ""} onChange={(e) => set("quota", e.target.value ? parseInt(e.target.value) : undefined)} />
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={form.available}
                    onChange={(e) => set("available", e.target.checked)} />
                  <div className="w-10 h-5 rounded-full transition-colors"
                    style={{ backgroundColor: form.available ? "#10B981" : "#CBD5E1" }}>
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                      style={{ transform: form.available ? "translateX(20px)" : "translateX(0)" }} />
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700">Disponible</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
            <Save size={14} /> Guardar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

type Tab = "actions" | "rewards";

export default function FanZoneConfigPage() {
  const { activeUser, loaded } = useUser();

  const { data: config } = useResource(
    loaded && activeUser ? "/api/fan-config" : null, EMPTY_CONFIG,
  );

  const [tab, setTab] = useState<Tab>("actions");
  const [actions, setActions] = useState<FanAction[]>([]);
  const [rewards, setRewards] = useState<FanReward[]>([]);
  const [saved, setSaved] = useState(false);

  // Modals
  const [actionModal, setActionModal] = useState<{ open: boolean; item?: FanAction }>({ open: false });
  const [rewardModal, setRewardModal] = useState<{ open: boolean; item?: FanReward }>({ open: false });

  // Confirm delete
  const [deleteTarget, setDeleteTarget] = useState<{ type: "action" | "reward"; id: string } | null>(null);

  // Seed the editable lists from the fetched config, falling back to defaults
  useEffect(() => {
    setActions((config.actions ?? defaultActions).map((a) => ({ ...a })));
    setRewards((config.rewards ?? defaultRewards).map((r) => ({ ...r })));
  }, [config]);

  const handleSaveAll = async () => {
    try {
      await apiSend("/api/fan-config", "PUT", { actions, rewards });
      setSaved(true);
      toast.success("Fan Zone guardada — los fans verán los cambios al recargar");
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar la configuración");
    }
  };

  // Actions CRUD
  const upsertAction = (a: FanAction) => {
    setActions((prev) => prev.some((x) => x.id === a.id)
      ? prev.map((x) => x.id === a.id ? a : x)
      : [...prev, a]
    );
    setActionModal({ open: false });
    toast.success("Acción guardada");
  };

  const deleteAction = (id: string) => {
    setActions((prev) => prev.filter((x) => x.id !== id));
    setDeleteTarget(null);
    toast.success("Acción eliminada");
  };

  // Rewards CRUD
  const upsertReward = (r: FanReward) => {
    setRewards((prev) => prev.some((x) => x.id === r.id)
      ? prev.map((x) => x.id === r.id ? r : x)
      : [...prev, r]
    );
    setRewardModal({ open: false });
    toast.success("Recompensa guardada");
  };

  const deleteReward = (id: string) => {
    setRewards((prev) => prev.filter((x) => x.id !== id));
    setDeleteTarget(null);
    toast.success("Recompensa eliminada");
  };

  // Stats
  const actionsByCategory = ACTION_CATEGORIES.map((c) => ({
    ...c, count: actions.filter((a) => a.category === c.value).length,
  }));
  const totalActionPts = actions.reduce((s, a) => s + a.points, 0);
  const rewardsByType = REWARD_TYPES.map((t) => ({
    ...t, count: rewards.filter((r) => r.type === t.value).length,
  }));

  if (!loaded) return null;

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-teal-600 mb-1">Mi Club</p>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configurar Fan Zone</h1>
            <p className="text-sm text-slate-400 mt-1">
              Define las acciones ESG y recompensas que verán los fans de tu club
            </p>
          </div>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: saved ? "#059669" : "linear-gradient(135deg,#10B981,#059669)" }}
          >
            {saved ? <><CheckCircle2 size={14} /> Guardado</> : <><Save size={14} /> Publicar cambios</>}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="card p-4">
            <p className="text-2xl font-black text-slate-900">{actions.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Acciones totales</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-black text-teal-600">{totalActionPts.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-0.5">Puntos máx. posibles</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-black text-slate-900">{rewards.filter((r) => r.available).length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Recompensas activas</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-black text-slate-900">{rewards.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Recompensas totales</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl"
          style={{ backgroundColor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <AlertCircle size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-indigo-700">
            Los cambios se aplican al instante. Haz clic en <strong>Publicar cambios</strong> cuando termines
            para que los fans de tu club los vean la próxima vez que abran la Fan Zone.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          {[
            { id: "actions" as Tab, label: `Acciones ESG (${actions.length})`, Icon: Zap  },
            { id: "rewards" as Tab, label: `Recompensas (${rewards.length})`, Icon: Gift },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={tab === id
                ? { backgroundColor: "#fff", color: "#0F172A", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                : { color: "#94A3B8" }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* ── ACTIONS TAB ── */}
        {tab === "actions" && (
          <div className="space-y-4">
            {/* Category breakdown */}
            <div className="flex gap-3">
              {actionsByCategory.map((c) => (
                <div key={c.value} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${c.color}12`, color: c.color, border: `1px solid ${c.color}30` }}>
                  {c.label}: <strong>{c.count}</strong>
                </div>
              ))}
            </div>

            {/* Add button */}
            <button onClick={() => setActionModal({ open: true })}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-teal-400 hover:text-teal-600 transition-all text-sm font-medium">
              <Plus size={16} /> Añadir nueva acción ESG
            </button>

            {/* Actions list */}
            <div className="space-y-2">
              <AnimatePresence>
                {actions.map((action) => (
                  <motion.div key={action.id}
                    layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="card flex items-center gap-4 px-5 py-4 hover:shadow-md transition-shadow">
                    <span className="text-2xl flex-shrink-0">{action.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-slate-900 text-sm">{action.title}</p>
                        <CategoryBadge cat={action.category} />
                      </div>
                      <p className="text-xs text-slate-400 truncate">{action.description}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-black text-teal-600">+{action.points}</p>
                        <p className="text-[10px] text-slate-400">{action.frequency}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setActionModal({ open: true, item: action })}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget({ type: "action", id: action.id })}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {actions.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Zap size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No hay acciones configuradas aún</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── REWARDS TAB ── */}
        {tab === "rewards" && (
          <div className="space-y-4">
            {/* Type breakdown */}
            <div className="flex gap-3">
              {rewardsByType.map((t) => (
                <div key={t.value} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${t.color}12`, color: t.color, border: `1px solid ${t.color}30` }}>
                  {t.label}: <strong>{t.count}</strong>
                </div>
              ))}
            </div>

            {/* Add button */}
            <button onClick={() => setRewardModal({ open: true })}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-teal-400 hover:text-teal-600 transition-all text-sm font-medium">
              <Plus size={16} /> Añadir nueva recompensa
            </button>

            {/* Rewards list */}
            <div className="space-y-2">
              <AnimatePresence>
                {rewards.map((reward) => (
                  <motion.div key={reward.id}
                    layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="card flex items-center gap-4 px-5 py-4 hover:shadow-md transition-shadow">
                    <span className="text-2xl flex-shrink-0">{reward.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-slate-900 text-sm">{reward.name}</p>
                        <TypeBadge type={reward.type} />
                        {!reward.available && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">
                            Inactiva
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{reward.description}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        {reward.points === 0 && reward.type === "badge"
                          ? <p className="text-sm font-bold text-purple-500">Badge</p>
                          : <p className="text-lg font-black text-amber-500">{reward.points.toLocaleString()} pts</p>
                        }
                        {reward.quota && <p className="text-[10px] text-slate-400">{reward.quota} cupos</p>}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setRewardModal({ open: true, item: reward })}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget({ type: "reward", id: reward.id })}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {rewards.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Gift size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No hay recompensas configuradas aún</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {actionModal.open && (
          <ActionForm
            initial={actionModal.item ?? emptyAction()}
            onSave={upsertAction}
            onClose={() => setActionModal({ open: false })}
          />
        )}
        {rewardModal.open && (
          <RewardForm
            initial={rewardModal.item ?? emptyReward()}
            onSave={upsertReward}
            onClose={() => setRewardModal({ open: false })}
          />
        )}

        {/* Delete confirm */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">¿Eliminar?</h3>
              <p className="text-sm text-slate-500 mb-5">Esta acción no se puede deshacer</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={() => deleteTarget.type === "action"
                    ? deleteAction(deleteTarget.id)
                    : deleteReward(deleteTarget.id)
                  }
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
