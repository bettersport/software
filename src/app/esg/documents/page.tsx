"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, Trash2, FileLock2, Search, FileSpreadsheet, Image } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import type { Document } from "@/lib/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText size={20} className="text-red-400" />,
  xls: <FileSpreadsheet size={20} className="text-teal-600" />,
  img: <Image size={20} className="text-blue-400" />,
  doc: <FileText size={20} className="text-blue-300" />,
};

const categories = ["Todos", "Política ESG", "Ambiental", "Social", "Gobernanza", "Certificaciones", "Financiero", "Sin categoría"];
const uploadCategories = categories.filter((c) => c !== "Todos");

const EMPTY: Document[] = [];

export default function DocumentsPage() {
  const { activeUser, loaded } = useUser();
  const { data: docs, reload } = useResource<Document[]>(
    loaded && activeUser ? "/api/documents" : null, EMPTY,
  );
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");
  const [dragging, setDragging] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Sin categoría");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    try {
      for (const file of files) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "doc";
        const type = ["pdf"].includes(ext) ? "pdf" : ["xlsx", "xls", "csv"].includes(ext) ? "xls" : ["jpg", "png", "jpeg", "zip"].includes(ext) ? "img" : "doc";
        await apiSend("/api/documents", "POST", {
          name: file.name,
          type,
          category: uploadCategory,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          version: "v1.0",
        });
      }
      await reload();
      toast.success(`${files.length} archivo(s) subido(s) correctamente`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo subir el documento");
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    await uploadFiles(Array.from(input.files ?? []));
    input.value = "";
  };

  const filtered = docs.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "Todos" || d.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    await uploadFiles(Array.from(e.dataTransfer.files));
  };

  const deleteDoc = async (id: string) => {
    try {
      await apiSend(`/api/documents/${id}`, "DELETE");
      await reload();
      toast.success("Documento eliminado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar el documento");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hidden file input for button click */}
      <input ref={fileInputRef} type="file" multiple accept=".pdf,.xls,.xlsx,.csv,.jpg,.png,.jpeg,.zip" className="hidden" onChange={handleFileInput} />

      <SectionHeader
        icon={<FileText size={22} className="text-blue-400" />}
        title="Gesti\u00f3n Documental"
        subtitle="Sube, organiza y archiva documentos ESG con trazabilidad"
        action={
          <button className="btn-primary flex items-center gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} /> Subir documento
          </button>
        }
      />

      {/* Drop zone + category */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex-1 border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer",
            dragging ? "border-emerald-400 bg-teal-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <Upload size={32} className={cn("mx-auto mb-3", dragging ? "text-teal-600" : "text-slate-300")} />
          <p className="text-sm font-medium text-slate-600">
            {dragging ? "Suelta aquí los archivos" : "Arrastra archivos o haz clic para subir"}
          </p>
          <p className="text-xs text-slate-300 mt-1">PDF, XLS, XLSX, PNG, JPG, ZIP — máx. 50MB por archivo</p>
        </motion.div>
        <div className="card p-5 md:w-64 flex flex-col justify-center">
          <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Categoría del documento</label>
          <select className="input-field" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)}>
            {uploadCategories.map((c) => (
              <option key={c} value={c} style={{ backgroundColor: "#fff" }}>{c}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-2">Se aplicará a los archivos que subas a continuación.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            className="input-field pl-8 h-9 text-xs"
            placeholder="Buscar documentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                catFilter === c ? "text-slate-900" : "text-slate-400 hover:text-slate-700"
              )}
              style={catFilter === c
                ? { background: "linear-gradient(135deg, #10B981, #06B6D4)" }
                : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total documentos", value: docs.length, color: "#10B981" },
          { label: "PDFs", value: docs.filter((d) => d.type === "pdf").length, color: "#EF4444" },
          { label: "Hojas de cálculo", value: docs.filter((d) => d.type === "xls").length, color: "#10B981" },
          { label: "Imágenes/otros", value: docs.filter((d) => d.type === "img").length, color: "#3B82F6" },
        ].map((s) => (
          <div key={s.label} className="card p-6 text-center">
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Documents table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">{filtered.length} documentos</span>
        </div>
        <div className="divide-y divide-white/5">
          <AnimatePresence>
            {filtered.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  {fileIcons[doc.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-400">{doc.category}</span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{doc.size}</span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{doc.uploadedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="badge-blue text-xs">{doc.version}</span>
                  <span className="text-xs text-slate-300">{new Date(doc.uploadedAt).toLocaleDateString("es-CL")}</span>
                  <div className="flex items-center gap-1">
                    <button
                      className="btn-ghost p-1.5 opacity-50 cursor-not-allowed"
                      title="Almacenamiento de archivos aún no habilitado"
                      onClick={() => toast.error("Almacenamiento de archivos aún no habilitado")}
                    >
                      <FileLock2 size={14} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-300 hover:text-red-400 transition-colors"
                      onClick={() => deleteDoc(doc.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <FileText size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm">No se encontraron documentos</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
