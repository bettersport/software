"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
  green:  { bg: "#ecfdf5", border: "#a7f3d0", text: "#059669" },
  cyan:   { bg: "#ecfeff", border: "#a5f3fc", text: "#0891b2" },
  orange: { bg: "#fffbeb", border: "#fde68a", text: "#d97706" },
  purple: { bg: "#f5f3ff", border: "#ddd6fe", text: "#7c3aed" },
  blue:   { bg: "#eff6ff", border: "#bfdbfe", text: "#2563eb" },
  red:    { bg: "#fef2f2", border: "#fecaca", text: "#dc2626" },
};

export function StatCard({ title, value, subtitle, icon, trend, color = "green", className, delay = 0 }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn("card p-5 md:px-8 md:py-7 flex flex-col gap-3 md:gap-4", className)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94A3B8" }}>{title}</p>
          <p className="text-[26px] md:text-[32px] font-extrabold leading-none" style={{ color: "#0F172A", letterSpacing: "-0.03em" }}>
            {value}
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
        <div className="flex items-center gap-2.5 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
          {trend.value > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: "#ECFDF5" }}>
              <TrendingUp size={12} style={{ color: "#059669" }} />
              <span className="text-xs font-bold" style={{ color: "#059669" }}>+{trend.value}%</span>
            </div>
          ) : trend.value < 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: "#FEF2F2" }}>
              <TrendingDown size={12} style={{ color: "#DC2626" }} />
              <span className="text-xs font-bold" style={{ color: "#DC2626" }}>{trend.value}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: "#F1F5F9" }}>
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
          {label && <span className="text-xs font-medium" style={{ color: "#64748b" }}>{label}</span>}
          {showPercent && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>{percent.toFixed(0)}%</span>}
        </div>
      )}
      <div className="rounded-full overflow-hidden" style={{ height, backgroundColor: "#F1F5F9" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color || "linear-gradient(90deg, #10B981, #06B6D4)" }}
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
        {subtitle && <p className="text-sm mt-1.5 ml-9" style={{ color: "#64748b" }}>{subtitle}</p>}
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
    <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap" style={{ backgroundColor: "#F1F5F9" }}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
          )}
          style={
            active === tab.value
              ? { background: "#ffffff", color: "#0F172A", fontWeight: 600, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }
              : { background: "transparent", color: "#64748B" }
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
        style={{ width: size, height: size, borderColor: "#E2E8F0", borderTopColor: "#10B981" }}
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
      <p className="font-semibold text-base" style={{ color: "#0f172a" }}>{title}</p>
      {description && <p className="text-sm mt-2 max-w-sm" style={{ color: "#94a3b8" }}>{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
