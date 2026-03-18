import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeatmapCell from "./HeatmapCell";

interface HeatmapProps {
  boysView: any;
  isLoading: boolean;
}

const Heatmap: React.FC<HeatmapProps> = ({ boysView, isLoading }) => {
  const [hoveredCell, setHoveredCell] = useState<{
    bId: string;
    gId: string;
  } | null>(null);

  // --- STABILE DATENAUFBEREITUNG ---
  const { boyIds, girlsList } = useMemo(() => {
    if (!boysView) return { boyIds: [], girlsList: [] };

    // 1. Alle Boy-IDs holen
    const bIds = Object.keys(boysView);

    // 2. Eine feste Liste von Mädchen erstellen (alphabetisch sortiert)
    // Wir nehmen die Matches vom ersten Boy und sortieren sie nach Name
    const firstBoyId = bIds[0];
    const stableGirls = [...boysView[firstBoyId].matches].sort((a, b) =>
      a.partnerName.localeCompare(b.partnerName),
    );

    return { boyIds: bIds, girlsList: stableGirls };
  }, [boysView]);

  if (isLoading || !boysView || boyIds.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-cyan-500 font-black italic animate-pulse">
        INITIALIZING MATRIX...
      </div>
    );
  }

  return (
    <div className="relative bg-[#05050a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
      {/* Tooltip Overlay */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-6 right-10 z-50 bg-black/60 backdrop-blur-2xl border border-cyan-500/30 p-4 rounded-xl flex items-center gap-6 shadow-2xl"
          >
            <div className="text-right">
              <p className="text-lg font-black italic text-white uppercase tracking-tighter">
                {boysView[hoveredCell.bId].name}{" "}
                <span className="text-pink-500">&</span>{" "}
                {
                  boysView[hoveredCell.bId].matches.find(
                    (m: any) => m.partnerId === hoveredCell.gId,
                  )?.partnerName
                }
              </p>
            </div>
            <div className="text-3xl font-black italic text-cyan-400">
              {Math.round(
                boysView[hoveredCell.bId].matches.find(
                  (m: any) => m.partnerId === hoveredCell.gId,
                )?.probability || 0,
              )}
              %
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="table-fixed border-separate border-spacing-2 w-full min-w-[1000px]">
          <thead>
            <tr>
              <th className="w-32"></th>
              {girlsList.map((girl: any) => (
                <th key={girl.partnerId} className="w-24 h-24 relative">
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-black tracking-[0.3em] uppercase rotate-[-35deg] origin-bottom-left whitespace-nowrap text-white/30">
                    {girl.partnerName}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {boyIds.map((bId) => (
              <tr key={bId}>
                <td className="text-right pr-6 h-16">
                  <span className="text-xs font-black italic uppercase tracking-tighter text-white/50">
                    {boysView[bId].name}
                  </span>
                </td>

                {/* WICHTIG: Wir mappen über die STABILE girlsList, nicht über das matches-Array des Boys */}
                {girlsList.map((stableGirl: any) => {
                  const match = boysView[bId].matches.find(
                    (m: any) => m.partnerId === stableGirl.partnerId,
                  );
                  return (
                    <HeatmapCell
                      key={stableGirl.partnerId}
                      prob={match ? match.probability : 0}
                      onHover={() =>
                        setHoveredCell({ bId: bId, gId: stableGirl.partnerId })
                      }
                      onLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Heatmap;
