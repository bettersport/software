"use client";

import { motion } from "framer-motion";
import { Medal, TrendingUp, TrendingDown, Target, Award, ChevronUp, ChevronDown } from "lucide-react";
import { mockClubs } from "@/lib/data";
import { ProgressBar } from "@/components/ui";
import { useUser } from "@/lib/userContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from "recharts";

const evolutionData = [
  { mes: "Ago", posicion: 8, score: 72,  benchmarkCategoria: 3, benchmarkLatam: 1 },
  { mes: "Sep", posicion: 7, score: 74,  benchmarkCategoria: 3, benchmarkLatam: 1 },
  { mes: "Oct", posicion: 6, score: 77,  benchmarkCategoria: 2, benchmarkLatam: 1 },
  { mes: "Nov", posicion: 5, score: 79,  benchmarkCategoria: 2, benchmarkLatam: 1 },
  { mes: "Dic", posicion: 5, score: 81,  benchmarkCategoria: 2, benchmarkLatam: 1 },
  { mes: "Ene", posicion: 4, score: 84,  benchmarkCategoria: 2, benchmarkLatam: 1 },
  { mes: "Feb", posicion: 4, score: 86,  benchmarkCategoria: 1, benchmarkLatam: 1 },
  { mes: "Mar", posicion: 4, score: 85.3, benchmarkCategoria: 1, benchmarkLatam: 1 },
];

export default function RankingPositionPage() {
  const { activeUser } = useUser();
  const myClub = mockClubs.find((c) => c.id === activeUser.clubId) ?? mockClubs[3];
  const prevPos = evolutionData[evolutionData.length - 2].posicion;
  const trend = prevPos - myClub.ranking;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <Medal size={18} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Mi Posición en el Ranking</h1>
          <p className="text-sm text-slate-400">Evolución y análisis comparativo de tu posición ESG</p>
        </div>
      </div>

      {/* Current position hero */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5 border-amber-500/15">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Posición actual</p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-8xl font-black text-gradient" style={{ fontFamily: "'Manrope', sans-serif" }}>#{myClub.ranking}</span>
          {trend > 0 ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-teal-600 flex items-center gap-1 text-sm font-bold"><ChevronUp size={18} />+{trend} posiciones</span>
              <span className="text-xs text-slate-300">este mes</span>
            </div>
          ) : trend < 0 ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-red-400 flex items-center gap-1 text-sm font-bold"><ChevronDown size={18} />{trend} posiciones</span>
              <span className="text-xs text-slate-300">este mes</span>
            </div>
          ) : null}
        </div>
        <p className="text-slate-400 text-sm mt-2">Score ESG: <span className="text-teal-600 font-bold">{myClub.esgScore}/100</span></p>
      </motion.div>

      {/* Charts + nearby clubs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Evolution chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-7">
          <h3 className="font-semibold text-slate-800 text-sm mb-1 flex items-center gap-2"><TrendingUp size={15} className="text-teal-600" /> Evolución de posición</h3>
          <p className="text-xs text-slate-400 mb-4">Comparado con benchmark de categoría y LATAM</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={evolutionData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis reversed tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[1, 10]} tickFormatter={(v) => `#${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 12 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any, name: string) => {
                  const labels: Record<string, string> = { posicion: "Mi posición", benchmarkCategoria: "Benchmark categoría", benchmarkLatam: "Benchmark LATAM" };
                  return [`#${v ?? ""}`, labels[name] ?? name];
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(value) => {
                  const labels: Record<string, string> = { posicion: "Mi posición", benchmarkCategoria: "1º Categoría", benchmarkLatam: "1º LATAM" };
                  return <span style={{ color: "#64748b" }}>{labels[value] ?? value}</span>;
                }}
              />
              <Line type="monotone" dataKey="posicion" name="posicion" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: "#F59E0B", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="benchmarkCategoria" name="benchmarkCategoria" stroke="#10B981" strokeWidth={1.5} strokeDasharray="5 3" dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="benchmarkLatam" name="benchmarkLatam" stroke="#8B5CF6" strokeWidth={1.5} strokeDasharray="2 2" dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend pills */}
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-5 h-0.5 rounded-full inline-block" style={{ backgroundColor: "#F59E0B" }} /> Mi posición
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-5 h-0.5 rounded-full inline-block opacity-80" style={{ background: "repeating-linear-gradient(90deg,#10B981 0,#10B981 5px,transparent 5px,transparent 8px)" }} /> 1º Categoría (Rugby)
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-5 h-0.5 rounded-full inline-block opacity-80" style={{ background: "repeating-linear-gradient(90deg,#8B5CF6 0,#8B5CF6 2px,transparent 2px,transparent 4px)" }} /> 1º LATAM
            </div>
          </div>
        </motion.div>

        {/* Nearby clubs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-7">
          <h3 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2"><Target size={15} className="text-teal-600" /> Clubes cercanos</h3>
          <div className="space-y-2.5">
            {mockClubs.slice(0, 5).map((club, i) => {
              const isMe = club.id === myClub.id;
              return (
                <div key={club.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isMe ? "bg-teal-50 border border-teal-200" : "hover:bg-slate-50"}`}>
                  <span className={`text-xs font-bold w-6 ${isMe ? "text-teal-600" : "text-slate-400"}`}>#{i + 1}</span>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">{club.name[0]}</div>
                  <span className={`text-xs flex-1 font-medium truncate ${isMe ? "text-teal-600" : "text-slate-600"}`}>
                    {club.name} {isMe && "(Tú)"}
                  </span>
                  <span className={`text-xs font-bold ${isMe ? "text-teal-600" : "text-slate-400"}`}>{club.esgScore}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Gap analysis */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-7">
        <h3 className="font-semibold text-slate-800 text-sm mb-5 flex items-center gap-2"><Award size={15} className="text-amber-400" /> Análisis de brechas vs. líder</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { dim: "Ambiental", myScore: 78, leaderScore: 95, color: "#10B981" },
            { dim: "Social", myScore: 82, leaderScore: 90, color: "#06B6D4" },
            { dim: "Gobernanza", myScore: 75, leaderScore: 92, color: "#8B5CF6" },
          ].map((d) => (
            <div key={d.dim}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">{d.dim}</span>
                <span className="text-slate-800 font-semibold">{d.myScore} / {d.leaderScore}</span>
              </div>
              <div className="relative h-2 bg-slate-50 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full opacity-30" style={{ width: `${d.leaderScore}%`, backgroundColor: d.color }} />
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${d.myScore}%`, backgroundColor: d.color }} />
              </div>
              <p className="text-xs text-slate-300 mt-1">Brecha: {d.leaderScore - d.myScore} puntos</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
