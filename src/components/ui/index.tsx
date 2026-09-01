"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CountUp } from "@/components/fx";

/** Anima la parte numérica de un valor ("91.3", "#4", "$90K", "340%"). */
function AnimatedValue({ value }: { value: string | number }) {
  const s = String(value);
  const m = /^([^\d-]*)(-?[\d.,]+)([^\d]*)$/.exec(s);
  if (!m) return <>{s}</>;
  const num = parseFloat(m[2].replace(/,/g, ""));
  if (Number.isNaN(num)) return <>{s}</>;
  const decimals = (m[2].split(".")[1] ?? "").length;
  return <CountUp to={num} decimals={decimals} prefix={m[1]} suffix={m[3]} />;
}

/* ——— Stat Card ——— */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: "green" | "cyan" | "orange" | "purple" | "blue" | "red";
  className?: string;
  delay?: number;
}

const colorMap = {
  green:  { bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.28)", text: "#34d399" },
  cyan:   { bg: "rgba(34,211,238,0.10)", border: "rgba(34,211,238,0.28)", text: "#22d3ee" },
  orange: { bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.28)", text: "#fbbf24" },
  purple: { bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.28)", text: "#a78bfa" },
  blue:   { bg: "rgba(96,165,250,0.10)", border: "rgba(96,165,250,0.28)", text: "#60a5fa" },
  red:    { bg: "rgba(248,113,113,0.10)", border: "rgba(248,113,113,0.28)", text: "#f87171" },
};

export function StatCard({ title, value, subtitle, icon, trend, color = "green", className, delay = 0 }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn("card glass-hover p-5 md:px-8 md:py-7 flex flex-col gap-3 md:gap-4", className)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94A3B8" }}>{title}</p>
          <p className="text-[26px] md:text-[32px] font-extrabold leading-none" style={{ color: "#f4f7fb", letterSpacing: "-0.03em" }}>
            <AnimatedValue value={value} />
          </p>
          {subtitle && <p className="text-[13px] mt-1" style={{ color: "#94A3B8" }}>{subtitle}</p>}
        </div>
        {icon && (
          <div
            className="w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-2.5 pt-4" style={{ borderTop: "1px solid #161d29" }}>
          {trend.value > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(52,211,153,0.12)" }}>
              <TrendingUp size={12} style={{ color: "#34d399" }} />
              <span className="text-xs font-bold" style={{ color: "#34d399" }}>+{trend.value}%</span>
            </div>
          ) : trend.value < 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(248,113,113,0.12)" }}>
              <TrendingDown size={12} style={{ color: "#f87171" }} />
              <span className="text-xs font-bold" style={{ color: "#f87171" }}>{trend.value}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: "#161d29" }}>
              <Minus size={12} style={{ color: "#94A3B8" }} />
              <span className="text-xs font-bold" style={{ color: "#94A3B8" }}>{trend.value}%</span>
            </div>
          )}
          <span className="text-xs" style={{ color: "#94A3B8" }}>{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}

/* ——— Progress Bar ——— */
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  height?: number;
  color?: string;
}

export function ProgressBar({ value, max = 100, label, showPercent = true, height = 6, color }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-xs font-medium" style={{ color: "#a8b3c4" }}>{label}</span>}
          {showPercent && <span className="text-xs font-bold" style={{ color: "#f4f7fb" }}>{percent.toFixed(0)}%</span>}
        </div>
      )}
      <div className="rounded-full overflow-hidden" style={{ height, backgroundColor: "#161d29" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color || "linear-gradient(90deg, #67e8f9, #22d3ee 55%, #a78bfa)" }}
        />
      </div>
    </div>
  );
}

/* ——— Badge ——— */
interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "cyan" | "orange" | "purple" | "blue" | "red";
  className?: string;
}

export function Badge({ children, variant = "green", className }: BadgeProps) {
  return <span className={cn(`badge-${variant}`, className)}>{children}</span>;
}

/* ——— Section Header ——— */
interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ icon, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6 lg:mb-8">
      <div>
        <h1 className="section-title text-lg lg:text-xl">
          {icon && <span>{icon}</span>}
          {title}
        </h1>
        {subtitle && <p className="text-sm mt-1.5 ml-9" style={{ color: "#a8b3c4" }}>{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/* ——— Tabs ——— */
interface TabsProps {
  tabs: { label: string; value: string; icon?: React.ReactNode }[];
  active: string;
  onChange: (value: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap" style={{ backgroundColor: "#161d29" }}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
          )}
          style={
            active === tab.value
              ? { background: "#10151f", color: "#f4f7fb", fontWeight: 600, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }
              : { background: "transparent", color: "#a8b3c4" }
          }
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ——— Loading Spinner ——— */
export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-2"
        style={{ width: size, height: size, borderColor: "#232c3a", borderTopColor: "#22d3ee" }}
      />
    </div>
  );
}

/* ——— Empty State ——— */
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="text-4xl mb-4 opacity-50">{icon}</div>}
      <p className="font-semibold text-base" style={{ color: "#f4f7fb" }}>{title}</p>
      {description && <p className="text-sm mt-2 max-w-sm" style={{ color: "#94a3b8" }}>{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
