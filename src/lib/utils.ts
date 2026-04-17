import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "$") {
  return `${amount.toLocaleString("es-CL")} ${currency}`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function getProgressColor(value: number) {
  if (value >= 80) return "#10B981";
  if (value >= 60) return "#F59E0B";
  return "#EF4444";
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    in_progress: "badge-cyan",
    completed: "badge-green",
    planning: "badge-blue",
    paused: "badge-orange",
    open: "badge-green",
    negotiating: "badge-orange",
    funded: "badge-cyan",
    closed: "badge-red",
  };
  return map[status] || "badge-blue";
}

export function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    in_progress: "En progreso",
    completed: "Completado",
    planning: "Planificación",
    paused: "Pausado",
    open: "Abierto",
    negotiating: "En negociación",
    funded: "Financiado",
    closed: "Cerrado",
    received: "Recibido",
    accepted: "Aceptado",
    rejected: "Rechazado",
  };
  return map[status] || status;
}

export function getRankingMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}
