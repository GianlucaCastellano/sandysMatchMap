import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Star {
  id: string;
  name: string;
  image_url: string | null;
  active: boolean;
}

interface MatchingNight {
  id: string;
  week: number;
  beams: number;
  seating: Record<string, string>;
}

const MatchingHistory: React.FC = () => {
  const [nights, setNights] = useState<MatchingNight[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [matrix, setMatrix] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPair, setSelectedPair] = useState<{
    boyId: string;
    girlId: string;
    week: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [nightsRes, boysRes, girlsRes, matrixRes] = await Promise.all([
          fetch("http://localhost:8080/matching_nights"),
          fetch("http://localhost:8080/boys"),
          fetch("http://localhost:8080/girls"),
          fetch("http://localhost:8080/probabilities/calculate"),
        ]);

        const nightsData = await nightsRes.json();
        const boys = await boysRes.json();
        const girls = await girlsRes.json();
        const matrixData = await matrixRes.json();

        setNights(nightsData.sort((a: any, b: any) => b.week - a.week));
        setStars([...boys, ...girls]);
        setMatrix(matrixData.data?.boysView);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStar = (id: string) => stars.find((s) => s.id === id);

  const getPairProbability = (boyId: string, girlId: string) => {
    if (!matrix || !matrix[boyId]) return 0;
    const match = matrix[boyId].matches.find(
      (m: any) => m.partnerId === girlId,
    );
    return match ? Math.round(match.probability) : 0;
  };

  const Avatar = ({
    star,
    color,
    size = "w-16 h-16",
  }: {
    star?: Star;
    color: string;
    size?: string;
  }) => (
    <div
      className={`${size} rounded-2xl border-2 ${color} overflow-hidden bg-zinc-900 shadow-xl flex items-center justify-center relative`}
    >
      {star?.image_url ? (
        <img
          src={star.image_url}
          className="w-full h-full object-cover"
          alt=""
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-white/10 to-transparent">
          <span className="text-xs font-black text-white/40 uppercase">
            {star?.name?.substring(0, 2)}
          </span>
        </div>
      )}
    </div>
  );

  if (loading)
    return (
      <div className="p-20 text-center text-cyan-500 font-black italic animate-pulse">
        ANALYZING SCENARIOS...
      </div>
    );

  return (
    <div className="space-y-10 p-6">
      <AnimatePresence>
        {nights.map((night) => (
          <motion.div
            key={night.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-6xl font-black italic text-white tracking-tighter uppercase">
                  Woche {night.week}
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-transparent mt-3" />
              </div>
              <div className="text-right">
                <div className="flex gap-2 mb-3 justify-end">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3.5 h-12 rounded-full ${i < night.beams ? "bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]" : "bg-white/5"}`}
                    />
                  ))}
                </div>
                <span className="text-cyan-400 font-black italic text-3xl uppercase">
                  {night.beams} Beams
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {Object.entries(night.seating).map(([boyId, girlId]) => {
                const boy = getStar(boyId);
                const girl = getStar(girlId);
                return (
                  <button
                    key={boyId}
                    onClick={() =>
                      setSelectedPair({ boyId, girlId, week: night.week })
                    }
                    className="group text-left bg-black/40 border border-white/5 p-5 rounded-[2.5rem] hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all duration-500 shadow-2xl"
                  >
                    <div className="flex justify-center items-center -space-x-8 mb-6">
                      <div className="rotate-[-6deg] group-hover:rotate-0 transition-transform duration-500">
                        <Avatar star={boy} color="border-blue-500/50" />
                      </div>
                      <div className="rotate-[6deg] group-hover:rotate-0 transition-transform duration-500 z-10">
                        <Avatar star={girl} color="border-pink-500/50" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-white uppercase truncate">
                        {boy?.name}
                      </p>
                      <p className="text-[9px] font-black text-cyan-500 italic my-1">
                        X
                      </p>
                      <p className="text-xs font-black text-white uppercase truncate">
                        {girl?.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPair && (
          <>
            {/* Das Backdrop - Hier liegt der Fehler meistens beim z-index oder fehlendem fixed */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPair(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[999] w-full h-full"
            />

            {/* Das Modal selbst */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-[#0a0a0c] border border-white/10 rounded-[3rem] p-10 z-[1000] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <div className="text-center mb-8">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em]">
                  Deep Dive // Woche {selectedPair.week}
                </span>
                <h3 className="text-3xl font-black italic text-white uppercase mt-2">
                  Pair Analysis
                </h3>
              </div>

              <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/5 mb-8">
                <Avatar
                  star={getStar(selectedPair.boyId)}
                  color="border-blue-500"
                  size="w-20 h-20"
                />
                <div className="text-center">
                  <p className="text-4xl font-black italic text-white">
                    {getPairProbability(
                      selectedPair.boyId,
                      selectedPair.girlId,
                    )}
                    %
                  </p>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                    Match Chance
                  </p>
                </div>
                <Avatar
                  star={getStar(selectedPair.girlId)}
                  color="border-pink-500"
                  size="w-20 h-20"
                />
              </div>

              <div className="space-y-4 px-2">
                <div className="flex justify-between text-xs font-bold uppercase italic">
                  <span className="text-white/40">
                    {getStar(selectedPair.boyId)?.name}
                  </span>
                  <span
                    className={
                      getStar(selectedPair.boyId)?.active
                        ? "text-emerald-400"
                        : "text-rose-500"
                    }
                  >
                    {getStar(selectedPair.boyId)?.active
                      ? "In Villa"
                      : "Matched Out"}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase italic">
                  <span className="text-white/40">
                    {getStar(selectedPair.girlId)?.name}
                  </span>
                  <span
                    className={
                      getStar(selectedPair.girlId)?.active
                        ? "text-emerald-400"
                        : "text-rose-500"
                    }
                  >
                    {getStar(selectedPair.girlId)?.active
                      ? "In Villa"
                      : "Matched Out"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPair(null)}
                className="w-full mt-10 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter hover:bg-cyan-400 transition-colors shadow-lg"
              >
                Close Analysis
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchingHistory;
