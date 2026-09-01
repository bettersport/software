"use client";

import type { LucideIcon } from "lucide-react";
import {
  Droplets, Sprout, Recycle, Zap, BookOpen, HeartHandshake, Scale,
  Users, Target, Trophy, Wallet, BarChart3, Flame, Waves, Star,
  Rocket, Leaf, Sparkles, Goal, Activity, Bike, Dumbbell, Medal,
} from "lucide-react";

/* ============================================================================
   Iconografía del design system — reemplaza los emojis "viejos" por glifos
   lucide dentro de chips glass con glow, para el look futurista del tema.
   ========================================================================= */

/** Glifo por categoría ESG (slugs de la BD). */
export const CATEGORY_GLYPHS: Record<string, LucideIcon> = {
  huella_hidrica: Droplets,
  huella_carbono: Sprout,
  gestion_residuos: Recycle,
  eficiencia_energetica: Zap,
  educacion: BookOpen,
  inclusion: HeartHandshake,
  equidad_genero: Scale,
};

/** Glifo por emoji legado (los KPIs guardan el emoji en la BD). */
export const EMOJI_GLYPHS: Record<string, LucideIcon> = {
  "💧": Droplets,
  "🌱": Sprout,
  "♻️": Recycle,
  "⚡": Zap,
  "📚": BookOpen,
  "🤝": HeartHandshake,
  "⚖️": Scale,
  "👥": Users,
  "🎯": Target,
  "🏆": Trophy,
  "💰": Wallet,
  "📊": BarChart3,
  "🔥": Flame,
  "🌊": Waves,
  "⭐": Star,
  "🚀": Rocket,
  "🍃": Leaf,
};

/** Glifo por deporte (labels en español de la BD). */
export const SPORT_GLYPHS: Record<string, LucideIcon> = {
  "Fútbol": Goal,
  "Atletismo": Activity,
  "Ciclismo": Bike,
  "Natación": Waves,
  "Tenis": Target,
  "Rugby": Trophy,
  "Básquetbol": Dumbbell,
  "Pádel": Target,
};

/** Glifo inline de un deporte. */
export function SportIcon({ sport, size = 16, className }: {
  sport: string;
  size?: number;
  className?: string;
}) {
  const Icon = SPORT_GLYPHS[sport] ?? Medal;
  return <Icon size={size} className={className} strokeWidth={2.2} />;
}

/** Glifo inline de una categoría ESG (para badges y tabs). */
export function CategoryIcon({ category, size = 12, className }: {
  category: string;
  size?: number;
  className?: string;
}) {
  const Icon = CATEGORY_GLYPHS[category] ?? Sparkles;
  return <Icon size={size} className={className} strokeWidth={2.2} />;
}

/**
 * Chip de icono futurista: glifo lucide sobre lavado del color del KPI,
 * borde hairline y glow sutil. Si el emoji no está mapeado, lo muestra tal
 * cual como fallback.
 */
export function IconChip({ emoji, color = "#22d3ee", size = 18, chip = 38 }: {
  emoji: string;
  color?: string;
  size?: number;
  chip?: number;
}) {
  const Icon = EMOJI_GLYPHS[emoji?.trim() ?? ""];
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl flex-shrink-0"
      style={{
        width: chip,
        height: chip,
        color,
        backgroundColor: `${color}14`,
        border: `1px solid ${color}33`,
        boxShadow: `0 0 18px -6px ${color}80, inset 0 1px 0 rgba(244,247,251,0.06)`,
      }}
    >
      {Icon ? <Icon size={size} strokeWidth={2.2} /> : <span style={{ fontSize: size }}>{emoji}</span>}
    </span>
  );
}
