"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Trophy, Gift, Star, CheckCircle2, Lock,
  ChevronRight, Users, TrendingUp, Award,
} from "lucide-react";
import { fanTiers, fanActions as defaultActions, fanRewards as defaultRewards, mockFans } from "@/lib/data";
import { useUser } from "@/lib/userContext";
import type { FanTierName, FanActionCategory, FanAction, FanReward } from "@/lib/types";
import toast from "react-hot-toast";

// ── helpers ──────────────────────────────────────────────────────────────────

function getTier(tierName: FanTierName) {
  return fanTiers.find((t) => t.name === tierName)!;
}

function getNextTier(tierName: FanTierName) {
  const idx = fanTiers.findIndex((t) => t.name === tierName);
  return idx < fanTiers.length - 1 ? fanTiers[idx + 1] : null;
}

function progressToNext(points: number, tierName: FanTierName) {
  const tier = getTier(tierName);
  const next = getNextTier(tierName);
  if (!next) return 100;
  const range = next.minPoints - tier.minPoints;
  const done  = points - tier.minPoints;
  return Math.min(100, Math.round((done / range) * 100));
}

const categoryConfig: Record<FanActionCategory, { label: string; color: string; bg: string }> = {
  fisica:  { label: "Física",  color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
  digital: { label: "Digital", color: "#3B82F6", bg: "rgba(59,130,246,0.1)"  },
  social:  { label: "Social",  color: "#8B5CF6", bg: "rgba(139,92,246,0.1)"  },
};

// ── FAN CARD ─────────────────────────────────────────────────────────────────

function FanCard({ fan, pct, tier, nextTier }: {
  fan: typeof mockFans[0];
  pct: number;
  tier: ReturnType<typeof getTier>;
  nextTier: ReturnType<typeof getNextTier>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B1628 0%, #0D1F3C 40%, #0A2818 100%)",
        boxShadow: `0 0 60px ${tier.glowColor}, 0 20px 60px rgba(0,0,0,0.5)`,
        border: `1px solid ${tier.color}30`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${tier.color}08 1px, transparent 1px), linear-gradient(90deg, ${tier.color}08 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${tier.color}, transparent)`, filter: "blur(40px)" }} />

      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
              style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}88)` }}>
              {fan.clubName[0]}
            </div>
            <span className="text-xs font-semibold" style={{ color: `${tier.color}cc` }}>{fan.clubName}</span>
            <span className="text-xs" style={{ color: "#3d5270" }}>{fan.flag}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${tier.color}18`, border: `1px solid ${tier.color}35` }}>
            <span className="text-sm">{tier.emoji}</span>
            <span className="text-xs font-bold" style={{ color: tier.color }}>{tier.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-5 mb-8">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
              style={{
                background: `linear-gradient(135deg, ${tier.color}40, ${tier.color}15)`,
                border: `2px solid ${tier.color}50`,
                boxShadow: `0 0 24px ${tier.glowColor}`,
              }}>
              {fan.name === "Tú" ? "👤" : fan.name[0]}
            </div>
            <div className="absolute -inset-1 rounded-2xl pointer-events-none"
              style={{ border: `1px solid ${tier.color}30` }} />
          </div>
          <div>
            <p className="text-2xl font-black text-white tracking-tight">{fan.name === "Tú" ? "Mi Perfil" : fan.name}</p>
            <p className="text-sm mt-0.5" style={{ color: "#5a7fa8" }}>Fan Zone · {fan.clubName}</p>
            <p className="text-xs mt-1 font-mono" style={{ color: "#3d5270" }}>Miembro desde {fan.joinedAt}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-end gap-3 mb-3">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: "#3d5270" }}>Puntos ESG</p>
              <p className="text-5xl font-black leading-none tracking-tight"
                style={{ color: tier.color, textShadow: `0 0 30px ${tier.glowColor}` }}>
                {fan.points.toLocaleString()}
              </p>
            </div>
            {nextTier && (
              <div className="pb-1">
                <p className="text-xs font-mono" style={{ color: "#3d5270" }}>
                  +{(nextTier.minPoints - fan.points).toLocaleString()} pts para
                </p>
                <p className="text-sm font-bold" style={{ color: nextTier.color }}>
                  {nextTier.emoji} {nextTier.label}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${tier.color}, ${nextTier?.color ?? tier.color})` }}
              />
            </div>
            <span className="text-xs font-mono font-bold" style={{ color: tier.color, minWidth: "36px" }}>{pct}%</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Zap size={14} />,    label: "Retos",    value: fan.actionsCompleted,      color: "#10B981" },
            { icon: <Award size={14} />,  label: "Badges",   value: fan.badgesEarned,          color: "#F59E0B" },
            { icon: <Trophy size={14} />, label: "Posición", value: `#${fan.rankingPosition}`, color: "#8B5CF6" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3 text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-center mb-1" style={{ color: stat.color }}>{stat.icon}</div>
              <p className="text-lg font-black text-white">{stat.value}</p>
              <p className="text-[10px] font-mono uppercase tracking-wide" style={{ color: "#3d5270" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────

const ACTION_TABS: { id: FanActionCategory | "todos"; label: string }[] = [
  { id: "todos",   label: "Todos" },
  { id: "fisica",  label: "Física" },
  { id: "digital", label: "Digital" },
  { id: "social",  label: "Social" },
];

const REWARD_TABS = [
  { id: "todos",   label: "Todos" },
  { id: "club",    label: "Club" },
  { id: "sponsor", label: "Sponsor" },
  { id: "badge",   label: "Badges" },
];

export default function FanZonePage() {
  const { activeUser } = useUser();
  const [actionTab, setActionTab] = useState<string>("todos");
  const [rewardTab, setRewardTab] = useState<string>("todos");
  const [completed, setCompleted] = useState<Set<string>>(new Set(["a2","a5","a6","a8","a11"]));
  const [claimed,   setClaimed]   = useState<Set<string>>(new Set(["r7"]));

  // Load club-specific fan zone config from localStorage
  const [fanActions, setFanActions] = useState<FanAction[]>(defaultActions);
  const [fanRewards, setFanRewards] = useState<FanReward[]>(defaultRewards);

  useEffect(() => {
    const clubId = activeUser?.clubId;
    if (!clubId) return;
    const raw = localStorage.getItem(`bettersport_fanzone_config_${clubId}`);
    if (raw) {
      try {
        const cfg = JSON.parse(raw);
        if (cfg.actions?.length) setFanActions(cfg.actions);
        if (cfg.rewards?.length) setFanRewards(cfg.rewards);
      } catch {}
    }
  }, [activeUser?.clubId]);

  const fan    = mockFans.find((f) => f.id === "f-hincha")!;
  const tier   = getTier(fan.tier);
  const next   = getNextTier(fan.tier);
  const pct    = progressToNext(fan.points, fan.tier);

  const visibleActions = fanActions.filter((a) => actionTab === "todos" || a.category === actionTab);
  const visibleRewards = fanRewards.filter((r) => rewardTab === "todos" || r.type === rewardTab);

  const handleComplete = (id: string) => {
    if (completed.has(id)) return;
    setCompleted((prev) => new Set([...prev, id]));
    toast.success("¡Acción registrada! Tus puntos serán confirmados pronto 🌱");
  };

  const handleClaim = (id: string, pts: number) => {
    if (claimed.has(id) || pts > fan.points) return;
    setClaimed((prev) => new Set([...prev, id]));
    toast.success("¡Recompensa canjeada! Revisa tu correo para más detalles 🎁");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-teal-600 mb-1">Fan Zone</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mi espacio de fan sostenible</h1>
          <p className="text-sm text-slate-400 mt-1">Completa acciones ESG, sube de nivel y gana recompensas de tu club</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-semibold text-teal-700">Temporada 2025 activa</span>
        </div>
      </div>

      {/* Main grid: fan card + leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Fan card */}
        <div className="lg:col-span-2">
          <FanCard fan={fan} pct={pct} tier={tier} nextTier={next} />

          {/* Tier roadmap */}
          <div className="mt-4 card p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Niveles de Fan</p>
            <div className="space-y-3">
              {fanTiers.map((t, i) => {
                const isCurrent  = t.name === fan.tier;
                const isUnlocked = fanTiers.findIndex((x) => x.name === fan.tier) >= i;
                return (
                  <div key={t.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={isUnlocked
                        ? { background: `${t.color}20`, border: `1px solid ${t.color}40` }
                        : { backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0" }
                      }>
                      {t.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: isCurrent ? t.color : isUnlocked ? "#0F172A" : "#94A3B8" }}>
                        {t.label} {isCurrent && "← actual"}
                      </p>
                      <p className="text-xs text-slate-400">{t.minPoints.toLocaleString()}+ puntos</p>
                    </div>
                    {isUnlocked && !isCurrent && <CheckCircle2 size={15} className="text-teal-500 flex-shrink-0" />}
                    {isCurrent && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: leaderboard */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Users size={16} />,      label: "Fans en el club",  value: "1,284",  color: "#3B82F6" },
              { icon: <TrendingUp size={16} />, label: "Participación",    value: "38.2%",  color: "#10B981" },
              { icon: <Star size={16} />,       label: "Score colectivo",  value: "892K",   color: "#F59E0B" },
            ].map((s) => (
              <div key={s.label} className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900">{s.value}</p>
                  <p className="text-[11px] text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Trophy size={15} className="text-amber-500" /> Ranking de fans · Temporada 2025
              </p>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
            <div className="divide-y divide-slate-50">
              {mockFans.slice(0, 10).map((f, i) => {
                const t   = getTier(f.tier);
                const isMe = f.id === "f-hincha";
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                    style={isMe ? { backgroundColor: "rgba(16,185,129,0.05)" } : {}}
                  >
                    <div className="w-7 text-center flex-shrink-0">
                      {i === 0 ? <span className="text-base">🥇</span>
                      : i === 1 ? <span className="text-base">🥈</span>
                      : i === 2 ? <span className="text-base">🥉</span>
                      : <span className="text-xs font-mono text-slate-400">#{i + 1}</span>}
                    </div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
                      {isMe ? "👤" : f.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {isMe ? "Tú" : f.name}
                        {isMe && <span className="ml-1.5 text-xs text-teal-600 font-normal">(tú)</span>}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs">{t.emoji}</span>
                        <span className="text-[10px] font-semibold" style={{ color: t.color }}>{t.label}</span>
                      </div>
                    </div>
                    <span className="text-sm font-black font-mono" style={{ color: t.color }}>
                      {f.points.toLocaleString()}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Acciones ESG disponibles</h2>
            <p className="text-sm text-slate-400">Completa acciones para sumar puntos y subir de nivel</p>
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {ACTION_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActionTab(tab.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={actionTab === tab.id
                  ? { backgroundColor: "#fff", color: "#0F172A", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                  : { color: "#94A3B8" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={actionTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {visibleActions.map((action, i) => {
              const done = completed.has(action.id);
              const cat  = categoryConfig[action.category];
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-5 flex flex-col gap-3"
                  style={done ? { borderColor: "rgba(16,185,129,0.3)", backgroundColor: "rgba(16,185,129,0.03)" } : {}}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{action.icon}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: cat.bg, color: cat.color }}>
                        {cat.label}
                      </span>
                    </div>
                    <span className="text-lg font-black font-mono text-teal-600">+{action.points}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{action.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{action.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                    <span className="text-xs text-slate-400">{action.frequency}</span>
                    {done ? (
                      <div className="flex items-center gap-1.5 text-teal-600 text-xs font-semibold">
                        <CheckCircle2 size={14} /> Completado
                      </div>
                    ) : (
                      <button onClick={() => handleComplete(action.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:scale-105"
                        style={{ background: "linear-gradient(135deg,#10B981,#06B6D4)" }}>
                        Completar
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rewards section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Gift size={18} className="text-amber-500" /> Recompensas disponibles
            </h2>
            <p className="text-sm text-slate-400">Canjea tus puntos por beneficios exclusivos · {fan.points.toLocaleString()} pts disponibles</p>
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {REWARD_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setRewardTab(tab.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={rewardTab === tab.id
                  ? { backgroundColor: "#fff", color: "#0F172A", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                  : { color: "#94A3B8" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={rewardTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {visibleRewards.map((reward, i) => {
              const isClaimed   = claimed.has(reward.id);
              const canAfford   = fan.points >= reward.points;
              const isAvailable = reward.available && !isClaimed;
              const isBadge     = reward.type === "badge";

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-5 flex flex-col gap-3"
                  style={
                    isClaimed
                      ? { borderColor: "rgba(16,185,129,0.3)", backgroundColor: "rgba(16,185,129,0.04)" }
                      : !isAvailable
                      ? { opacity: 0.6 }
                      : {}
                  }
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{reward.icon}</span>
                    {isBadge ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Badge</span>
                    ) : (
                      <span className="text-sm font-black font-mono text-slate-800">
                        {reward.points === 0 ? "Gratis" : `${reward.points.toLocaleString()} pts`}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{reward.name}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{reward.description}</p>
                    {reward.quota && (
                      <p className="text-xs text-amber-600 mt-1">{reward.quota} cupos disponibles</p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-50">
                    {isClaimed ? (
                      <div className="flex items-center gap-1.5 text-teal-600 text-xs font-semibold">
                        <CheckCircle2 size={13} /> Canjeado
                      </div>
                    ) : !isAvailable ? (
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Lock size={12} /> No disponible
                      </div>
                    ) : !canAfford && !isBadge ? (
                      <div className="text-xs text-slate-400 font-mono">
                        Te faltan {(reward.points - fan.points).toLocaleString()} pts
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaim(reward.id, reward.points)}
                        className="w-full text-xs font-semibold py-2 rounded-lg text-white transition-all hover:scale-105"
                        style={{ background: isBadge ? "linear-gradient(135deg,#F59E0B,#EF4444)" : "linear-gradient(135deg,#10B981,#06B6D4)" }}
                      >
                        {isBadge ? "Obtener badge" : "Canjear ahora"}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
