import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Star {
  id: string;
  name: string;
  age: number | null;
  image_url: string | null;
  gender: "boy" | "girl";
  active: boolean;
}

const StarManagerComponent: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Form State
  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState<"boy" | "girl">("boy");
  const [newAge, setNewAge] = useState<number>(20);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal State
  const [editingStar, setEditingStar] = useState<Star | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState<number>(20);
  const [editGender, setEditGender] = useState<"boy" | "girl">("boy");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [editIsDragging, setEditIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [boysRes, girlsRes] = await Promise.all([
        fetch("http://localhost:8080/boys"),
        fetch("http://localhost:8080/girls"),
      ]);
      const boys = await boysRes.json();
      const girls = await girlsRes.json();
      const combined = [
        ...boys.map((b: any) => ({ ...b, gender: "boy" as const })),
        ...girls.map((g: any) => ({ ...g, gender: "girl" as const })),
      ];
      setStars(combined);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Add handlers ──────────────────────────────────────────────
  const handleFileSelect = (file: File) => {
    setNewImageFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const handleAddStar = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = newGender === "boy" ? "boys" : "girls";
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("age", String(newAge));
    formData.append("active", "true");
    if (newImageFile) formData.append("image", newImageFile);
    try {
      const res = await fetch(`http://localhost:8080/${endpoint}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setNewName("");
        setNewAge(20);
        setNewImageFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        fetchData();
      }
    } catch {
      alert("Fehler beim Hinzufügen");
    }
  };

  // ── Edit handlers ─────────────────────────────────────────────
  const openEditModal = (star: Star) => {
    setEditingStar(star);
    setEditName(star.name);
    setEditAge(star.age ?? 20);
    setEditGender(star.gender);
    setEditImageFile(null);
    setEditPreviewUrl(star.image_url);
  };

  const closeEditModal = () => {
    setEditingStar(null);
    setEditImageFile(null);
    setEditPreviewUrl(null);
  };

  const handleEditFileSelect = (file: File) => {
    setEditImageFile(file);
    setEditPreviewUrl(URL.createObjectURL(file));
  };

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setEditIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleEditFileSelect(file);
  };

  const handleSaveEdit = async () => {
    if (!editingStar) return;
    setIsSaving(true);
    const endpoint = editGender === "boy" ? "boys" : "girls";
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("age", String(editAge));
    formData.append("active", String(editingStar.active));
    if (editImageFile) formData.append("image", editImageFile);
    try {
      const res = await fetch(
        `http://localhost:8080/${endpoint}/${editingStar.id}`,
        { method: "PUT", body: formData },
      );
      if (res.ok) {
        closeEditModal();
        fetchData();
      }
    } catch {
      alert("Fehler beim Speichern");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, gender: string) => {
    if (!window.confirm("Star wirklich löschen?")) return;
    const endpoint = gender === "boy" ? "boys" : "girls";
    try {
      await fetch(`http://localhost:8080/${endpoint}/${id}`, {
        method: "DELETE",
      });
      setStars((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Fehler beim Löschen");
    }
  };

  return (
    <div className="space-y-10">
      {/* ── ADD FORM ─────────────────────────────────────────── */}
      <section className="bg-white/2 border border-white/5 rounded-[3rem] p-10 backdrop-blur-md">
        <h2 className="text-2xl font-black italic uppercase mb-8 text-cyan-400">
          Füge neuen Star hinzu
        </h2>
        <form onSubmit={handleAddStar} className="flex gap-4 items-start">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative cursor-pointer shrink-0 w-[88px] h-[88px] rounded-2xl overflow-hidden border-2 border-dashed transition-all flex items-center justify-center
              ${isDragging ? "border-cyan-400 bg-cyan-400/10" : previewUrl ? "border-cyan-500/40" : "border-white/10 hover:border-white/25"}`}
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <span className="text-base">⟳</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">
                    Ändern
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-white/25 select-none">
                <span className="text-2xl leading-none">⬆</span>
                <span className="text-[8px] font-black uppercase tracking-wider">
                  Foto
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
                e.target.value = "";
              }}
            />
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={newName}
              required
              onChange={(e) => setNewName(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors text-sm"
            />
            <input
              type="number"
              placeholder="Age"
              value={newAge}
              onChange={(e) => setNewAge(Number(e.target.value))}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors text-sm"
            />
            <div className="col-span-full flex gap-2">
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as "boy" | "girl")}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none flex-1 text-sm"
              >
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>
              <button
                type="submit"
                className="bg-cyan-500 text-black font-black px-6 rounded-xl hover:bg-white transition-all uppercase italic text-xs whitespace-nowrap"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* ── STAR LIST ────────────────────────────────────────── */}
      <section className="bg-white/2 border border-white/5 rounded-[3rem] p-10 backdrop-blur-md">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black italic uppercase">
            Aktuelle Stars
          </h2>
          <span className="text-white/20 font-black uppercase text-xs tracking-widest">
            {stars.length} Members
          </span>
        </div>

        {loading ? (
          <div className="text-cyan-500 animate-pulse font-black uppercase italic">
            Updating Database...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <AnimatePresence>
              {stars.map((star) => (
                <motion.div
                  key={star.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => openEditModal(star)}
                  className="group relative bg-black/40 border border-white/5 rounded-3xl p-4 flex flex-col items-center gap-3 hover:border-white/20 transition-all cursor-pointer overflow-hidden"
                >
                  {/* Image */}
                  <div
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all
                    ${star.gender === "boy" ? "border-blue-500/30 group-hover:border-blue-400/60" : "border-pink-500/30 group-hover:border-pink-400/60"}`}
                  >
                    <img
                      src={star.image_url || ""}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt=""
                    />
                  </div>

                  {/* Name & info */}
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase italic text-white">
                      {star.name}
                    </p>
                    <p className="text-[8px] font-bold uppercase text-white/20 tracking-widest">
                      {star.gender} • {star.age}
                    </p>
                  </div>

                  {/* Edit hint bar – slides up from bottom on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-7 bg-cyan-500/90
                    flex items-center justify-center
                    opacity-0 group-hover:opacity-100
                    translate-y-full group-hover:translate-y-0
                    transition-all duration-200 ease-out"
                  >
                    <span className="text-[8px] font-black uppercase tracking-widest text-black">
                      ✎ Bearbeiten
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(star.id, star.gender);
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 shadow-xl z-10"
                  >
                    <span className="text-[10px]">✕</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ── EDIT MODAL ───────────────────────────────────────── */}
      <AnimatePresence>
        {editingStar && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-md bg-[#0d1117] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black italic uppercase text-white leading-none">
                      Star bearbeiten
                    </h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mt-1">
                      {editingStar.name}
                    </p>
                  </div>
                  <button
                    onClick={closeEditModal}
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Image upload with preview */}
                <div
                  onClick={() => editFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setEditIsDragging(true);
                  }}
                  onDragLeave={() => setEditIsDragging(false)}
                  onDrop={handleEditDrop}
                  className={`relative cursor-pointer w-full h-56 rounded-2xl overflow-hidden border-2 border-dashed mb-5 flex items-center justify-center transition-all
                    ${editIsDragging ? "border-cyan-400 bg-cyan-400/10" : editPreviewUrl ? "border-white/8" : "border-white/10 hover:border-white/20"}`}
                >
                  {editPreviewUrl ? (
                    <>
                      <img
                        src={editPreviewUrl}
                        className="w-full h-full object-cover object-top"
                        alt="preview"
                      />
                      <div className="absolute inset-0 bg-black/55 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <span className="text-xl text-white">⟳</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">
                          Bild ändern
                        </span>
                      </div>
                      {editImageFile && (
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[8px] font-black px-3 py-0.5 rounded-full truncate max-w-[80%] pointer-events-none">
                          {editImageFile.name}
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/25 select-none">
                      <span className="text-3xl">⬆</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Foto hochladen
                      </span>
                    </div>
                  )}
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleEditFileSelect(f);
                      e.target.value = "";
                    }}
                  />
                </div>

                {/* Fields */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors text-sm"
                  />
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Age"
                      value={editAge}
                      onChange={(e) => setEditAge(Number(e.target.value))}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors text-sm"
                    />
                    <select
                      value={editGender}
                      onChange={(e) =>
                        setEditGender(e.target.value as "boy" | "girl")
                      }
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-sm"
                    >
                      <option value="boy">Boy</option>
                      <option value="girl">Girl</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeEditModal}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-all text-xs font-black uppercase italic"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-xl bg-cyan-500 text-black font-black text-xs uppercase italic hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Speichern..." : "Speichern"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StarManagerComponent;
