"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Users, Star, Camera, Edit3, Trophy, TreePine, Zap, Recycle, X, Save, Upload, ImageIcon } from "lucide-react";
import { ProgressBar } from "@/components/ui";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend, apiUpload } from "@/lib/useResource";
import { clubImageUrl } from "@/lib/clubImage";
import type { Club } from "@/lib/types";
import toast from "react-hot-toast";

/** Placeholder shown when the club has no description yet — never rendered as real content. */
const DESC_PLACEHOLDER = "Añade una descripción de tu club";

/** Club with the profile fields the API exposes (region/banner) that the shared type omits. */
type ClubProfile = Club & { region?: string | null; banner?: string | null };

export default function ClubProfilePage() {
  const { activeUser, loaded, isDemo } = useUser();
  const clubId = activeUser?.clubId ?? null;
  const { data: fetchedClub } = useResource<ClubProfile | null>(
    loaded && clubId ? `/api/clubs/${clubId}` : null, null,
  );

  // Local editable copy of the club, seeded from the fetched club
  const [club, setClub] = useState<ClubProfile | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    country: "",
    region: "",
    sport: "",
  });
  const [saving, setSaving] = useState(false);

  // Sync the local copy + form when the fetched club arrives
  useEffect(() => {
    if (!fetchedClub) return;
    setClub(fetchedClub);
    setBannerUrl(clubImageUrl(fetchedClub.id, "banner", fetchedClub.banner));
    setAvatarUrl(clubImageUrl(fetchedClub.id, "logo", fetchedClub.logo));
    setEditForm({
      name: fetchedClub.name,
      description: fetchedClub.description ?? "",
      country: fetchedClub.country,
      region: fetchedClub.region ?? "",
      sport: fetchedClub.sport,
    });
  }, [fetchedClub]);

  // File refs
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !clubId) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("La imagen no puede superar 5MB"); return; }
    try {
      const r = await apiUpload<{ data: { url: string } }>(`/api/clubs/${clubId}/image/banner`, file);
      setBannerUrl(r.data.url);
      toast.success("Banner actualizado correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar el banner");
    }
  };

  const handleRemoveBanner = async () => {
    if (!clubId) return;
    try {
      await apiSend(`/api/clubs/${clubId}/image/banner`, "DELETE");
      setBannerUrl(null);
      toast.success("Banner eliminado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar el banner");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !clubId) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("La imagen no puede superar 2MB"); return; }
    try {
      const r = await apiUpload<{ data: { url: string } }>(`/api/clubs/${clubId}/image/logo`, file);
      setAvatarUrl(r.data.url);
      toast.success("Foto de perfil actualizada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar la foto de perfil");
    }
  };

  const handleSaveProfile = async () => {
    if (!clubId) return;
    if (!editForm.name.trim()) {
      toast.error("El nombre del club es obligatorio");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        country: editForm.country.trim(),
        sport: editForm.sport.trim(),
        region: editForm.region.trim(),
      };
      const { data: updated } = await apiSend<{ data: ClubProfile }>(`/api/clubs/${clubId}`, "PATCH", payload);
      setClub((prev) => {
        const base = prev ?? updated ?? null;
        if (!base) return base;
        return {
          ...base,
          name: updated?.name ?? payload.name,
          description: (updated ? updated.description : payload.description) || undefined,
          country: updated?.country ?? payload.country,
          sport: updated?.sport ?? payload.sport,
          region: (updated ? updated.region : payload.region) || null,
        };
      });
      setEditForm(payload);
      setEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: club?.name ?? "",
      description: club?.description ?? "",
      country: club?.country ?? "",
      region: club?.region ?? "",
      sport: club?.sport ?? "",
    });
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hidden file inputs */}
      <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div
          className="h-40 border-b border-slate-200 relative group transition-all"
          style={{
            background: bannerUrl
              ? `url(${bannerUrl}) center/cover no-repeat`
              : "linear-gradient(135deg, #ECFDF5 0%, #ECFEFF 50%, #EFF6FF 100%)",
          }}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 rounded-lg transition-colors text-white text-xs font-medium backdrop-blur-sm"
          >
            <Camera size={14} />
            Cambiar banner
          </button>
          {bannerUrl && (
            <button
              onClick={handleRemoveBanner}
              className="absolute top-3 right-40 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12 mb-4">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 border-4 border-white flex items-center justify-center text-3xl font-black text-white shadow-lg">
                  {club?.name?.[0]}
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex-1 pb-2">
              {editing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-field text-xl font-bold mb-1"
                />
              ) : (
                <h1 className="text-xl font-bold text-slate-900">{club?.name}</h1>
              )}
              <div className="flex items-center gap-3 mt-1 text-slate-400 text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={13} />{club?.country}</span>
                <span className="flex items-center gap-1.5"><Users size={13} />{club?.members?.toLocaleString()} miembros</span>
              </div>
            </div>
            {editing ? (
              <div className="flex items-center gap-2">
                <button onClick={handleCancelEdit} className="btn-secondary flex items-center gap-2">
                  <X size={14} /> Cancelar
                </button>
                <button onClick={handleSaveProfile} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                  <Save size={14} /> {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
                <Edit3 size={14} /> Editar perfil
              </button>
            )}
          </div>

          {/* Edit form or description */}
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 mt-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">País</label>
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">Región</label>
                    <input
                      type="text"
                      value={editForm.region}
                      onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                      className="input-field"
                      placeholder="ej. Metropolitana, Cataluña..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">Deporte</label>
                    <input
                      type="text"
                      value={editForm.sport}
                      onChange={(e) => setEditForm({ ...editForm, sport: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Descripción</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="input-field resize-none"
                    placeholder={DESC_PLACEHOLDER}
                  />
                </div>
              </motion.div>
            ) : (
              club?.description ? (
                <motion.p key="description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-500 leading-relaxed">
                  {club.description}
                </motion.p>
              ) : (
                <motion.p key="description-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-400 italic leading-relaxed">
                  {DESC_PLACEHOLDER}
                </motion.p>
              )
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ESG score + dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-7">
          <h3 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2"><Star size={16} className="text-amber-400" /> Score ESG Global</h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke="rgba(255,255,255,0.08)" />
                <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke="url(#scoreGrad)"
                  strokeDasharray={`${((club?.esgScore ?? 0) / 100) * 100.53} 100.53`} strokeLinecap="round" />
                <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#10B981" /><stop offset="1" stopColor="#06B6D4" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gradient">{club?.esgScore ?? 0}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gradient">{club?.esgScore ?? 0}/100</p>
              <p className="text-xs text-slate-400 mt-1">{(club?.ranking ?? 0) > 0 ? `Ranking: #${club?.ranking} nacional` : "Aún sin posición en el ranking"}</p>
            </div>
          </div>
          {[
            { key: "ambiental", value: club?.environmental ?? 0, color: "#10B981" },
            { key: "social", value: club?.social ?? 0, color: "#06B6D4" },
            { key: "gobernanza", value: club?.governance ?? 0, color: "#8B5CF6" },
          ].map(({ key, value, color }) => (
            <div key={key} className="mb-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500 capitalize">{key}</span>
                <span className="text-slate-800 font-semibold">{value}</span>
              </div>
              <ProgressBar value={value} max={100} height={4} color={color} />
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-7">
          <h3 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2"><Trophy size={16} className="text-amber-400" /> Logros & Certificaciones</h3>
          {!isDemo && (
            <p className="text-sm text-slate-400 py-6 text-center">Aún no tienes logros ni certificaciones. Se mostrarán aquí a medida que tu club avance en su gestión ESG.</p>
          )}
          <div className="space-y-3">
            {(isDemo ? [
              { icon: <TreePine size={16} className="text-teal-600" />, title: "Club Verde Certificado", year: "2024", color: "#10B981" },
              { icon: <Zap size={16} className="text-amber-400" />, title: "100% Energía Renovable", year: "2023", color: "#F59E0B" },
              { icon: <Recycle size={16} className="text-teal-600" />, title: "Cero Residuos Estadio", year: "2024", color: "#06B6D4" },
            ] : []).map((ach) => (
              <div key={ach.title} className="flex items-center gap-4 p-5 rounded-xl" style={{ backgroundColor: ach.color + "10", border: `1px solid ${ach.color}20` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: ach.color + "18" }}>
                  {ach.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{ach.title}</p>
                  <p className="text-xs text-slate-400">Obtenido en {ach.year}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
