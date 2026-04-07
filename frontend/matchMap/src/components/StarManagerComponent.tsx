import React, { useState, useEffect } from "react";
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

  // Form State für neuen Star
  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState<"boy" | "girl">("boy");
  const [newAge, setNewAge] = useState<number>(20);
  const [newImageUrl, setNewImageUrl] = useState("");

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

  const handleAddStar = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = newGender === "boy" ? "boys" : "girls";

    try {
      const res = await fetch(`http://localhost:8080/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          age: newAge,
          image_url: newImageUrl,
          active: true,
        }),
      });

      if (res.ok) {
        setNewName("");
        setNewImageUrl("");
        fetchData(); // Liste neu laden
      }
    } catch (e) {
      alert("Fehler beim Hinzufügen");
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
    } catch (e) {
      alert("Fehler beim Löschen");
    }
  };

  return (
    <div className="space-y-10">
      {/* FORMULAR: ADD NEW STAR */}
      <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-md">
        <h2 className="text-2xl font-black italic uppercase mb-8 text-cyan-400">
          Füge neuen Star hinzu
        </h2>
        <form
          onSubmit={handleAddStar}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={newName}
            required
            onChange={(e) => setNewName(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
          <input
            type="number"
            placeholder="Age"
            value={newAge}
            onChange={(e) => setNewAge(Number(e.target.value))}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
          <div className="flex gap-2">
            <select
              value={newGender}
              onChange={(e) => setNewGender(e.target.value as any)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none flex-1"
            >
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
            </select>
            <button
              type="submit"
              className="bg-cyan-500 text-black font-black px-6 rounded-xl hover:bg-white transition-all uppercase italic text-xs"
            >
              Save
            </button>
          </div>
        </form>
      </section>

      {/* LISTE: ALL STARS */}
      <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-md">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black italic uppercase">Aktuelle Stars</h2>
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
                  className="group relative bg-black/40 border border-white/5 rounded-3xl p-4 flex flex-col items-center gap-3 hover:border-white/20 transition-all"
                >
                  <div
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 ${star.gender === "boy" ? "border-blue-500/30" : "border-pink-500/30"}`}
                  >
                    <img
                      src={star.image_url || ""}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt=""
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase italic text-white">
                      {star.name}
                    </p>
                    <p className="text-[8px] font-bold uppercase text-white/20 tracking-widest">
                      {star.gender} • {star.age}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(star.id, star.gender)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 shadow-xl"
                  >
                    <span className="text-[10px]">✕</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};

export default StarManagerComponent;
