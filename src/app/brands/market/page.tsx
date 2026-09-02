"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LineChart, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { Marquee, CountUp } from "@/components/fx";
import { Sparkline } from "@/components/viz";
import { useUser } from "@/lib/userContext";
import { useResource } from "@/lib/useResource";
import type { Club } from "@/lib/types";
import { cn } from "@/lib/utils";

const EMPTY: Club[] = [];

/* Colores de movimiento: paleta validada de series (s3 verde / s8 rojo). */
const UP = "#199e70";
const DOWN = "#e66767";

/* ── RNG determinista por club: el "historial" demo es estable entre visitas ── */
function seedFrom(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface MarketClub {
  club: Club;
  spark: number[];
  /** Cambio % de la sesión; null cuando la cuenta real aún no tiene historial. */
  delta: number | null;
}

/** Caminata de 30 días que TERMINA en el puntaje real actual del club. */
function buildMarket(clubs: Club[], demo: boolean): MarketClub[] {
  return clubs.map((club) => {
    if (!demo) {
      return { club, spark: Array(30).fill(club.esgScore), delta: null };
    }
    const rnd = mulberry32(seedFrom(club.id));
    const walk: number[] = [club.esgScore];
    for (let i = 0; i < 29; i++) {
      const prev = walk[0] - (rnd() - 0.48) * 1.1;
      walk.unshift(Math.max(30, Math.min(100, prev)));
    }
    const prevDay = walk[walk.length - 2];
    const delta = prevDay ? ((club.esgScore - prevDay) / prevDay) * 100 : 0;
    return { club, spark: walk, delta };
  });
}

function abbr(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function DeltaTag({ delta }: { delta: number | null }) {
  if (delta === null) return <span className="font-mono text-xs text-slate-300">—</span>;
  const up = delta >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex items-center gap-0.5 font-mono text-xs font-semibold tnum" style={{ color: up ? UP : DOWN }}>
      <Icon size={13} /> {up ? "+" : ""}{delta.toFixed(2)}%
    </span>
  );
}

function MoverBadge({ delta, side }: { delta: number | null; side: "up" | "down" }) {
  if (delta === null) return null;
  const cfg = side === "up"
    ? Math.abs(delta) >= 1.2
      ? { label: "oportunidad", color: "#34d399" }
      : { label: "vigilar", color: "#fbbf24" }
    : Math.abs(delta) >= 1.2
      ? { label: "riesgo", color: "#f87171" }
      : { label: "vigilar", color: "#fbbf24" };
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, backgroundColor: `${cfg.color}18`, border: `1px solid ${cfg.color}35` }}
    >
      {cfg.label}
    </span>
  );
}

function MoversTable({ title, subtitle, rows, side, delay }: {
  title: string; subtitle: string; rows: MarketClub[]; side: "up" | "down"; delay: number;
}) {
  const Icon = side === "up" ? TrendingUp : TrendingDown;
  const color = side === "up" ? UP : DOWN;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="card p-7">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ color, backgroundColor: `${color}14`, border: `1px solid ${color}30` }}>
          <Icon size={18} />
        </span>
        <div>
          <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>{title}</h3>
          <p className="text-xs" style={{ color: "#6b7789" }}>{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-5 items-center">
        {["CLUB", "PUNTAJE", "SESIÓN", "30 DÍAS", "MIEMBROS"].map((h, i) => (
          <span key={h} className={cn("eyebrow pb-3", i > 0 && "text-right")}>{h}</span>
        ))}
        {rows.map(({ club, spark, delta }) => (
          <div key={club.id} className="contents">
            <div className="flex items-center gap-3 py-3 min-w-0" style={{ borderTop: "1px solid #161d29" }}>
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}35` }}>
                {abbr(club.name)}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: "#f4f7fb" }}>{club.name}</p>
                  <MoverBadge delta={delta} side={side} />
                </div>
                <p className="text-[11px] truncate" style={{ color: "#6b7789" }}>{club.flag} {club.country} · {club.sport}</p>
              </div>
            </div>
            <span className="py-3 text-right font-mono text-sm font-bold tnum" style={{ color: "#f4f7fb", borderTop: "1px solid #161d29" }}>
              {club.esgScore.toFixed(1)}
            </span>
            <span className="py-3 text-right" style={{ borderTop: "1px solid #161d29" }}>
              <DeltaTag delta={delta} />
            </span>
            <span className="py-3 flex justify-end" style={{ borderTop: "1px solid #161d29" }}>
              <Sparkline data={spark} color={delta === null ? "#566173" : color} width={84} height={26} label={`Tendencia 30 días de ${club.name}`} />
            </span>
            <span className="py-3 text-right font-mono text-xs tnum" style={{ color: "#8b95a5", borderTop: "1px solid #161d29" }}>
              {club.members >= 1000 ? `${(club.members / 1000).toFixed(1)}K` : club.members}
            </span>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="col-span-5 py-8 text-center text-sm" style={{ color: "#6b7789" }}>
            Sin movimientos registrados todavía — el historial se construye con cada recálculo ESG.
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function EsgMarketPage() {
  const { activeUser, loaded, isDemo } = useUser();
  const { data: clubs } = useResource<Club[]>(loaded && activeUser ? "/api/clubs" : null, EMPTY);

  // Solo cotizan clubes con puntaje: los recién registrados aún no tienen historial.
  const listed = useMemo(() => clubs.filter((c) => c.esgScore > 0), [clubs]);
  const market = useMemo(() => buildMarket(listed, isDemo), [listed, isDemo]);
  const withDelta = market.filter((m) => m.delta !== null) as (MarketClub & { delta: number })[];
  const gainers = [...withDelta].filter((m) => m.delta >= 0).sort((a, b) => b.delta - a.delta).slice(0, 5);
  const losers = [...withDelta].filter((m) => m.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 5);
  const fallback = market.slice(0, 5);

  const avg = listed.length ? listed.reduce((s, c) => s + c.esgScore, 0) / listed.length : 0;
  const topMove = withDelta.length ? Math.max(...withDelta.map((m) => Math.abs(m.delta))) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        icon={<LineChart size={22} className="text-teal-600" />}
        title="Mercado ESG"
        subtitle="Comportamiento del puntaje ESG de los clubes, como una bolsa de sostenibilidad"
        action={
          <span className="eyebrow flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full animate-pulse-ring" style={{ backgroundColor: UP }} />
              <span className="relative inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: UP }} />
            </span>
            EN VIVO · {new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long" })}
          </span>
        }
      />

      {/* Cinta de cotizaciones */}
      <div className="card !rounded-xl px-0 py-2.5 overflow-hidden">
        <Marquee speed={38}>
          {market.map(({ club, delta }) => (
            <span key={club.id} className="flex items-center gap-2 px-5 whitespace-nowrap">
              <span className="font-mono text-[11px] font-bold" style={{ color: "#a8b3c4" }}>{abbr(club.name)}</span>
              <span className="font-mono text-[11px] tnum" style={{ color: "#f4f7fb" }}>{club.esgScore.toFixed(1)}</span>
              {delta !== null && (
                <span className="font-mono text-[11px] tnum" style={{ color: delta >= 0 ? UP : DOWN }}>
                  {delta >= 0 ? "↗ +" : "↘ "}{delta.toFixed(2)}%
                </span>
              )}
              <span style={{ color: "#232c3a" }}>|</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Tiles de resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Clubes listados", value: listed.length, decimals: 0, suffix: "" },
          { label: "Promedio ESG", value: avg, decimals: 1, suffix: "" },
          { label: "Al alza hoy", value: gainers.length, decimals: 0, suffix: "" },
          { label: "Mayor movimiento", value: topMove, decimals: 2, suffix: "%" },
        ].map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card p-5">
            <p className="eyebrow mb-2">{t.label}</p>
            <p className="text-2xl font-extrabold tnum" style={{ color: "#f4f7fb" }}>
              <CountUp to={t.value} decimals={t.decimals} suffix={t.suffix} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Alzas / Bajas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-7">
        <MoversTable
          title="Mayores alzas"
          subtitle={isDemo ? `Sesión del ${new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long" })}` : "Historial en construcción"}
          rows={gainers.length ? gainers : fallback}
          side="up"
          delay={0.15}
        />
        <MoversTable
          title="Mayores bajas"
          subtitle={isDemo ? `Sesión del ${new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long" })}` : "Historial en construcción"}
          rows={losers}
          side="down"
          delay={0.25}
        />
      </div>

      <p className="flex items-center gap-2 text-xs" style={{ color: "#6b7789" }}>
        <Minus size={12} /> El puntaje se recalcula con cada avance de proyectos ESG verificado. Las variaciones de sesión reflejan el último recálculo.
      </p>
    </div>
  );
}
