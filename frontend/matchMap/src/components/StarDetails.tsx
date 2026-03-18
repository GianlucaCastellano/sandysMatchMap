import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface StarDetailsProps {
  starId: string;
  gender: "boy" | "girl";
  onClose: () => void;
}

// Heatmap-Farben-Logik
const getHeatmapColor = (prob: number) => {
  if (prob < 25) return "#ef4444"; // Rot
  if (prob < 50) return "#f59e0b"; // Gelb/Orange
  if (prob < 75) return "#10b981"; // Grün
  return "#06b6d4"; // Cyan
};

const StarDetails: React.FC<StarDetailsProps> = ({
  starId,
  gender,
  onClose,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async () => {
      setLoading(true);
      try {
        const [starRes, boysRes, girlsRes, nightsRes, probRes] =
          await Promise.all([
            fetch(`http://localhost:8080/${gender}s/${starId}`),
            fetch(`http://localhost:8080/boys`),
            fetch(`http://localhost:8080/girls`),
            fetch(`http://localhost:8080/matching_nights`),
            fetch(`http://localhost:8080/probabilities/calculate`),
          ]);

        const starData = await starRes.json();
        const allStars = [
          ...(await boysRes.json()),
          ...(await girlsRes.json()),
        ];
        const nightsData = await nightsRes.json();
        const probData = await probRes.json();

        const getName = (id: string) =>
          allStars.find((s) => s.id === id)?.name || "Unknown";

        // History
        const myHistory = nightsData.map((night: any) => {
          const pId =
            gender === "boy"
              ? night.seating[starId]
              : Object.keys(night.seating).find(
                  (k) => night.seating[k] === starId,
                );
          return {
            week: night.week,
            beams: night.beams,
            partnerName: getName(pId || ""),
          };
        });

        // Alle Partner-Prozente
        let matches = [];
        if (gender === "boy") {
          matches = probData.data.boysView[starId]?.matches || [];
        } else {
          Object.keys(probData.data.boysView).forEach((bId) => {
            const m = probData.data.boysView[bId].matches.find(
              (m: any) => m.partnerId === starId,
            );
            if (m)
              matches.push({
                partnerName: getName(bId),
                probability: m.probability,
              });
          });
        }

        // Nach Wahrscheinlichkeit sortieren
        matches.sort((a: any, b: any) => b.probability - a.probability);

        setData({ ...starData, matches, history: myHistory });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFullProfile();
  }, [starId, gender]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Dark Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />

      {/* Modal Container (Zwei-Spalten-Layout) */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-5xl bg-[#07070a] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-[85vh] overflow-hidden"
      >
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/5 border-t-cyan-500 rounded-full animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 animate-pulse">
              Decrypting Profile...
            </p>
          </div>
        ) : (
          <>
            {/* ---------------- LINKER BEREICH: PROFIL ---------------- */}
            <div className="w-full md:w-[35%] bg-black/40 border-r border-white/5 p-8 flex flex-col items-center text-center relative">
              {/* Close Button Mobile */}
              <button
                onClick={onClose}
                className="md:hidden absolute top-6 right-6 text-white/40 hover:text-white"
              >
                ✕
              </button>

              {/* Image / Placeholder */}
              <div className="w-full aspect-[4/5] rounded-[2rem] relative bg-[#0a0a0f] overflow-hidden shadow-inner mb-8 border border-white/5">
                {data.image_url ? (
                  <img
                    src={data.image_url}
                    alt={data.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <>
                    <div
                      className={`absolute inset-0 opacity-20 bg-gradient-to-br ${gender === "boy" ? "from-cyan-500 to-transparent" : "from-pink-600/60 to-transparent"}`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-6xl grayscale opacity-30">
                      {gender === "boy" ? "👤" : "💃"}
                    </div>
                  </>
                )}

                {/* Active Badge on Image */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${data.active ? "bg-cyan-400 animate-pulse" : "bg-red-500"}`}
                  />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/80">
                    {data.active ? "Active" : "Out"}
                  </span>
                </div>
              </div>

              {/* Name & Infos */}
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none mb-2">
                {data.name}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8">
                {gender} // Age: {data.age || "Unknown"}
              </p>
            </div>

            {/* ---------------- RECHTER BEREICH: DATEN ---------------- */}
            <div className="w-full md:w-[65%] flex flex-col relative">
              {/* Header Bar Desktop */}
              <div className="hidden md:flex justify-between items-center p-8 pb-0">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">
                  Analysis Terminal
                </p>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* Grid der Wahrscheinlichkeiten */}
                <section className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-sm font-black italic uppercase tracking-widest text-white/80">
                      Probability
                    </h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  {/* Clean Grid für die Kreise */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {data.matches.map((m: any, i: number) => {
                      const prob = Math.round(m.probability);
                      const color = getHeatmapColor(prob);
                      const radius = 18; // Kleinerer, eleganterer Radius
                      const circ = 2 * Math.PI * radius;
                      const offset = circ - (prob / 100) * circ;

                      return (
                        <div
                          key={i}
                          className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl group hover:bg-white/[0.05] transition-colors"
                        >
                          {/* Mini Kreis-Ladebalken */}
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <svg className="w-full h-full rotate-[-90deg]">
                              <circle
                                cx="24"
                                cy="24"
                                r={radius}
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="text-white/5"
                              />
                              <motion.circle
                                cx="24"
                                cy="24"
                                r={radius}
                                fill="transparent"
                                stroke={color}
                                strokeWidth="3"
                                strokeDasharray={circ}
                                initial={{ strokeDashoffset: circ }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{
                                  duration: 1,
                                  delay: i * 0.03,
                                  ease: "easeOut",
                                }}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white/90">
                              {prob}%
                            </span>
                          </div>
                          {/* Name rechts daneben */}
                          <div className="flex-1 truncate">
                            <p className="text-sm font-bold text-white/90 italic truncate">
                              {m.partnerName}
                            </p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/30">
                              Potential Match
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Seating History Timeline */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-sm font-black italic uppercase tracking-widest text-white/80">
                      Matching Nights
                    </h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.history.map((h: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-2xl"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-pink-500 bg-pink-500/10 px-2 py-1 rounded-md">
                            W{h.week}
                          </span>
                          <p className="text-sm font-bold text-white/90 italic">
                            {h.partnerName}
                          </p>
                        </div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                          {h.beams} Beams
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default StarDetails;
