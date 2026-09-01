"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   Piezas de dataviz — portadas de Spec Research.
   ========================================================================= */

/** Tooltip glass compartido para recharts (usar con content={...}). */
export function TipShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="pointer-events-none min-w-36 rounded-xl px-3 py-2.5"
      style={{
        backgroundColor: "rgba(16,21,31,0.95)",
        border: "1px solid rgba(244,247,251,0.12)",
        boxShadow: "0 18px 44px -18px rgb(0 0 0 / 0.9)",
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}

export function TipTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 font-mono text-[0.625rem] tracking-wider text-slate-400 uppercase">
      {children}
    </div>
  );
}

export function TipRow({
  color, label, value, shape = "dot",
}: {
  color?: string; label: string; value: string; shape?: "dot" | "line" | "swatch";
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-[0.75rem] leading-6">
      <span className="flex min-w-0 items-center gap-2 text-slate-500">
        {color && (shape === "line" ? (
          <span aria-hidden className="h-[2px] w-3.5 shrink-0 rounded-full" style={{ background: color }} />
        ) : (
          <span aria-hidden className={cn("w-2 h-2 shrink-0", shape === "swatch" ? "rounded-[2px]" : "rounded-full")} style={{ background: color }} />
        ))}
        <span className="truncate">{label}</span>
      </span>
      <span className="tnum shrink-0 font-semibold text-slate-900">{value}</span>
    </div>
  );
}

/**
 * Miniatura de tendencia para filas y stat tiles: línea 2px, aguada al 10%,
 * punto final con anillo. El valor va siempre en texto junto a ella.
 */
export function Sparkline({
  data, color = "var(--color-neon)", width = 88, height = 30, className, label, animate = true,
}: {
  data: number[]; color?: string; width?: number; height?: number;
  className?: string; label?: string; animate?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const x = (i: number) => (i / (data.length - 1)) * (width - 2) + 1;
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);

  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(2)},${height} L${x(0).toFixed(2)},${height} Z`;

  return (
    <svg
      width={width} height={height} viewBox={`0 0 ${width} ${height}`}
      className={cn("shrink-0 overflow-visible", className)}
      role="img" aria-label={label ?? "Tendencia"}
    >
      <defs>
        <linearGradient id={`sp-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sp-${uid})`} />
      <motion.path
        d={line} fill="none" stroke={color} strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round"
        initial={animate ? { pathLength: 0 } : false}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <circle
        cx={x(data.length - 1)} cy={y(data[data.length - 1])} r={3}
        fill={color} stroke="var(--color-surface-1)" strokeWidth={2}
      />
    </svg>
  );
}

/**
 * Barra de ranking estilo spec: pista hairline de 6px, relleno en gradiente
 * animado con punto final luminoso, valor tabular fuera de la barra.
 */
export function RankBar({
  pct, color, delay = 0, height = 6, glow = false,
}: {
  pct: number; color: string; delay?: number; height?: number; glow?: boolean;
}) {
  return (
    <div className="flex-1 rounded-full overflow-visible relative" style={{ height, backgroundColor: "var(--color-grid)" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: `linear-gradient(90deg, color-mix(in oklab, ${color} 55%, transparent), ${color})`,
          boxShadow: glow ? `0 0 14px -2px ${color}` : `0 0 8px -4px ${color}`,
        }}
      >
        <span
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full"
          style={{
            width: height + 2, height: height + 2,
            background: color,
            border: "2px solid var(--color-surface-1)",
          }}
        />
      </motion.div>
    </div>
  );
}
