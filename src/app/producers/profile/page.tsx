"use client";

import { useEffect, useState } from "react";
import { Factory, Save, Info } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import { SUSTAINABILITY_TAGS, EVENT_TYPES, REGIONS } from "@/lib/tenders/matching";
import toast from "react-hot-toast";

interface Producer {
  id: string; name: string; description: string; website: string | null;
  regions: string[]; specialties: string[]; capabilities: string[]; certifications: string[];
  maxCapacity: number; eventsProduced: number; reportsOnPlatform: boolean; verified: boolean;
}

const empty = {
  name: "", description: "", website: "", maxCapacity: "", eventsProduced: "",
  reportsOnPlatform: false, regions: [] as string[], specialties: [] as string[],
  capabilities: [] as string[], certifications: "" as string,
};

export default function ProducerProfilePage() {
  const { activeUser, loaded } = useUser();
  const { data, reload } = useResource<{ mine: Producer | null } | null>(
    loaded && activeUser ? "/api/producers" : null, null,
  );
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!data?.mine || hydrated) return;
    const m = data.mine;
    setForm({
      name: m.name, description: m.description, website: m.website ?? "",
      maxCapacity: String(m.maxCapacity || ""), eventsProduced: String(m.eventsProduced || ""),
      reportsOnPlatform: m.reportsOnPlatform, regions: m.regions, specialties: m.specialties,
      capabilities: m.capabilities, certifications: m.certifications.join(", "),
    });
    setHydrated(true);
  }, [data, hydrated]);

  const toggle = (key: "regions" | "specialties" | "capabilities", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((x) => x !== value) : [...f[key], value],
    }));

  const save = async () => {
    if (!form.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    setSaving(true);
    try {
      await apiSend("/api/producers", "POST", {
        ...form,
        maxCapacity: parseInt(form.maxCapacity, 10) || 0,
        eventsProduced: parseInt(form.eventsProduced, 10) || 0,
        certifications: form.certifications.split(",").map((c) => c.trim()).filter(Boolean),
      });
      await reload();
      toast.success("Perfil guardado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const Chips = ({ label, options, selected, onToggle, hint }: {
    label: string; options: readonly string[]; selected: string[]; onToggle: (v: string) => void; hint?: string;
  }) => (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button key={o} type="button" onClick={() => onToggle(o)}
              className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
              style={on
                ? { color: "#04121a", backgroundColor: "#2dd4bf", border: "1px solid #2dd4bf" }
                : { color: "#8b95a5", backgroundColor: "#10151f", border: "1px solid #232c3a" }}>
              {o}
            </button>
          );
        })}
      </div>
      {hint && <p className="text-[11px] mt-2" style={{ color: "#6b7789" }}>{hint}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-7">
      <SectionHeader
        icon={<Factory size={22} className="text-teal-600" />}
        title="Perfil de productora"
        subtitle="Tu ficha es lo que evalúa el motor al recomendar productoras para cada licitación"
      />

      <div className="card p-8 space-y-6">
        <div>
          <label className="eyebrow block mb-2">Nombre de la productora *</label>
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div>
          <label className="eyebrow block mb-2">Descripción</label>
          <textarea rows={3} className="input-field resize-none" placeholder="Qué produce tu empresa y qué la distingue"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="eyebrow block mb-2">Sitio web</label>
            <input className="input-field" placeholder="https://" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <div>
            <label className="eyebrow block mb-2">Capacidad máxima</label>
            <input type="number" min="0" className="input-field" placeholder="5000"
              value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })} />
          </div>
          <div>
            <label className="eyebrow block mb-2">Eventos producidos</label>
            <input type="number" min="0" className="input-field" placeholder="40"
              value={form.eventsProduced} onChange={(e) => setForm({ ...form, eventsProduced: e.target.value })} />
          </div>
        </div>

        <Chips label="Tipos de evento que produces" options={EVENT_TYPES} selected={form.specialties}
          onToggle={(v) => toggle("specialties", v)} hint="También puedes marcar deportes escribiéndolos en la descripción." />

        <div>
          <label className="eyebrow block mb-2">Capacidades sostenibles</label>
          <div className="flex flex-wrap gap-2">
            {SUSTAINABILITY_TAGS.map((t) => {
              const on = form.capabilities.includes(t.id);
              return (
                <button key={t.id} type="button" onClick={() => toggle("capabilities", t.id)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                  style={on
                    ? { color: "#04121a", backgroundColor: "#2dd4bf", border: "1px solid #2dd4bf" }
                    : { color: "#8b95a5", backgroundColor: "#10151f", border: "1px solid #232c3a" }}>
                  {t.icon} {t.label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] mt-2" style={{ color: "#6b7789" }}>
            Es el criterio de mayor peso: marca solo lo que puedes acreditar.
          </p>
        </div>

        <Chips label="Regiones donde operas" options={REGIONS} selected={form.regions} onToggle={(v) => toggle("regions", v)} />

        <div>
          <label className="eyebrow block mb-2">Certificaciones</label>
          <input className="input-field" placeholder="ISO 20121, Empresa B, HuellaChile… (separadas por coma)"
            value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.reportsOnPlatform}
            onChange={(e) => setForm({ ...form, reportsOnPlatform: e.target.checked })}
            className="w-4 h-4 rounded accent-teal-500" />
          <span className="text-sm" style={{ color: "#a8b3c4" }}>Reporto el impacto de mis eventos en la plataforma Bettersport</span>
        </label>

        <button className="btn-primary w-full justify-center" onClick={save} disabled={saving}>
          {saving ? "Guardando…" : "Guardar perfil"} <Save size={15} />
        </button>

        <p className="flex items-start gap-2 text-[11px] pt-5" style={{ color: "#6b7789", borderTop: "1px solid #161d29" }}>
          <Info size={12} className="flex-shrink-0 mt-0.5" />
          Las capacidades declaradas se muestran como tales. Bettersport puede verificar el perfil tras revisar los respaldos.
        </p>
      </div>
    </div>
  );
}
