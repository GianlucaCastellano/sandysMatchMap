import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarCard from "../components/StarCard";
import StarDetails from "../components/StarDetails";

interface Star {
  id: string;
  name: string;
  age: number | null;
  image_url: string | null;
  active: boolean;
  gender: "boy" | "girl";
}

type SortOption = "name" | "ageAsc" | "ageDesc";
type StatusFilter = "active" | "out" | "all";

const StarsPage: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "boy" | "girl">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [loading, setLoading] = useState(true);
  const [selectedStar, setSelectedStar] = useState<{
    id: string;
    gender: "boy" | "girl";
  } | null>(null);

  useEffect(() => {
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
          ...boys.map((b: any) => ({ ...b, gender: "boy" })),
          ...girls.map((g: any) => ({ ...g, gender: "girl" })),
        ];
        setStars(combined);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processedStars = useMemo(() => {
    const filtered = stars.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchesGender = filter === "all" || s.gender === filter;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? s.active
            : !s.active;

      return matchesSearch && matchesGender && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "ageAsc") return (a.age || 99) - (b.age || 99);
      if (sortBy === "ageDesc") return (b.age || 0) - (a.age || 0);
      return a.name.localeCompare(b.name);
    });
  }, [stars, search, filter, statusFilter, sortBy]);

  return (
    <div className="relative min-h-full pb-20">
      <div className="space-y-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md shadow-2xl">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Star suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-14 py-4 text-white focus:outline-none focus:border-cyan-500/40 transition-all italic font-bold placeholder:text-white/20"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 text-xl text-cyan-400">
              🔍
            </span>
          </div>

          <div className="flex flex-wrap items-center bg-black/60 p-1.5 rounded-2xl border border-white/5 shadow-2xl gap-2">
            <div className="flex items-center gap-1 px-3 border-r border-white/10 mr-1">
              <button
                onClick={() => setSortBy("name")}
                className={`p-2.5 rounded-xl transition-all ${sortBy === "name" ? "bg-cyan-500/20 text-cyan-400" : "text-white/30 hover:bg-white/5"}`}
              >
                <span className="text-xs font-black italic">A-Z</span>
              </button>
              <button
                onClick={() => setSortBy("ageAsc")}
                className={`p-2.5 rounded-xl transition-all flex items-center gap-1 ${sortBy === "ageAsc" ? "bg-cyan-500/20 text-cyan-400" : "text-white/30 hover:bg-white/5"}`}
              >
                <span className="text-[10px] font-black italic">AGE</span>
                <span className="text-xs">↑</span>
              </button>
              <button
                onClick={() => setSortBy("ageDesc")}
                className={`p-2.5 rounded-xl transition-all flex items-center gap-1 ${sortBy === "ageDesc" ? "bg-cyan-500/20 text-cyan-400" : "text-white/30 hover:bg-white/5"}`}
              >
                <span className="text-[10px] font-black italic">AGE</span>
                <span className="text-xs">↓</span>
              </button>
            </div>

            <div className="flex gap-1 px-3 border-r border-white/10 mr-1">
              {(["active", "out", "all"] as const).map((sf) => (
                <button
                  key={sf}
                  onClick={() => setStatusFilter(sf)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    statusFilter === sf
                      ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                      : "text-white/30 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {sf === "active"
                    ? "Villa"
                    : sf === "out"
                      ? "Matched"
                      : "Alle"}
                </button>
              ))}
            </div>

            <div className="flex gap-1">
              {(["all", "boy", "girl"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                    filter === f
                      ? "bg-white text-black shadow-lg"
                      : "text-white/30 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {f === "all" ? "Alle" : `${f}s`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-t-transparent border-cyan-500 rounded-full animate-spin mb-4" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {processedStars.map((star) => (
                <motion.div
                  key={star.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <StarCard
                    star={star}
                    onClick={() =>
                      setSelectedStar({ id: star.id, gender: star.gender })
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedStar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStar(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90]"
            />
            <StarDetails
              starId={selectedStar.id}
              gender={selectedStar.gender}
              onClose={() => setSelectedStar(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StarsPage;
