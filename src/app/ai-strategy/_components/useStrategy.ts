"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@/lib/userContext";
import { apiSend } from "@/lib/useResource";
import type { ChallengeInput, StrategyDocument, Pillar } from "@/lib/strategy/types";

export interface GriRow { key: string; pillar: Pillar; label: string; griStandard: string; griTitle: string; indicators: string[]; sdgs: string[]; metricUnit: string; metricVerb: string }
export interface FrameworkRow { sport: string; organism: string; framework: string; summary: string }

export interface Strategy {
  id: string; status: "draft" | "generated" | "active" | "archived"; version: number; currentStep: number;
  orgName: string; sport: string; orgType: string; vigenciaInicio: number | null; vigenciaFin: number | null;
  respName: string; respRole: string; respEmail: string; isFirstStrategy: boolean;
  objectives: string[]; alignGlobal: boolean; globalBody: string | null; additionalContext: string; reviewFrequency: string;
  maturityScores: unknown; generatedDoc: StrategyDocument | null; generatedAt: string | null;
  challenges: (ChallengeInput & { id: string; maturity: string; goalPreliminary: boolean; milestones: unknown; proposedProjects: unknown; documents: { id?: string; name: string; type: string; size: string }[] })[];
}

export function useStrategy() {
  const { activeUser, loaded } = useUser();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [config, setConfig] = useState<{ gri: GriRow[]; frameworks: FrameworkRow[] }>({ gri: [], frameworks: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loaded || !activeUser) return;
    (async () => {
      try {
        const [s, c] = await Promise.all([
          fetch("/api/strategy", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/strategy/config", { cache: "no-store" }).then((r) => r.json()),
        ]);
        setStrategy(s.data ?? null);
        setConfig(c.data ?? { gri: [], frameworks: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, [loaded, activeUser]);

  const create = useCallback(async () => {
    const r = await apiSend<{ data: Strategy }>("/api/strategy", "POST");
    setStrategy(r.data);
    return r.data;
  }, []);

  // Autosave: los patches se ACUMULAN y se envían juntos; el estado local es la
  // fuente de verdad mientras haya cambios pendientes (evita que una respuesta
  // tardía del servidor pise un campo escrito después).
  const pending = useRef<Record<string, unknown>>({});
  const strategyRef = useRef<Strategy | null>(null);
  useEffect(() => { strategyRef.current = strategy; }, [strategy]);

  const flush = useCallback(async () => {
    const cur = strategyRef.current;
    const patch = pending.current;
    if (!cur || Object.keys(patch).length === 0) return;
    pending.current = {};
    setSaving(true);
    try {
      const r = await apiSend<{ data: Strategy }>("/api/strategy", "PATCH", { id: cur.id, ...patch });
      // Mezclar: servidor + lo que el usuario haya escrito mientras tanto.
      setStrategy(() => ({ ...r.data, ...(pending.current as Partial<Strategy>) }) as Strategy);
    } catch {
      // Reintentar en el próximo save conservando el patch.
      pending.current = { ...patch, ...pending.current };
    } finally {
      setSaving(false);
    }
  }, []);

  /** Autosave con debounce; `immediate` fuerza el envío (al cambiar de paso). */
  const save = useCallback(async (patch: Record<string, unknown>, immediate = false) => {
    if (!strategyRef.current) return;
    setStrategy((prev) => (prev ? ({ ...prev, ...patch } as Strategy) : prev));
    pending.current = { ...pending.current, ...patch };
    if (timer.current) clearTimeout(timer.current);
    if (immediate) return flush();
    timer.current = setTimeout(flush, 700);
  }, [flush]);

  const generate = useCallback(async () => {
    if (!strategy) return;
    const r = await apiSend<{ data: Strategy }>("/api/strategy/generate", "POST", { id: strategy.id });
    setStrategy(r.data);
    return r.data;
  }, [strategy]);

  const materialize = useCallback(async () => {
    if (!strategy) return { created: 0 };
    const r = await apiSend<{ data: { created: number } }>("/api/strategy/materialize", "POST", { id: strategy.id });
    setStrategy((prev) => (prev ? { ...prev, status: "active" } : prev));
    return r.data;
  }, [strategy]);

  return { activeUser, loaded, loading, saving, strategy, config, create, save, generate, materialize, setStrategy };
}
