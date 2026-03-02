import React, { useEffect, useState } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";

const BOYS = [
  "Max",
  "Lukas",
  "Chris",
  "Kevin",
  "Denis",
  "Tobi",
  "Marc",
  "Leo",
  "Jan",
  "Stoffl",
];
const GIRLS = [
  "Sandra",
  "Lea",
  "Mia",
  "Anna",
  "Zoe",
  "Sarah",
  "Kim",
  "Elena",
  "Paula",
  "Maren",
];

const Heatmap: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{
    b: number;
    g: number;
  } | null>(null);

  // Matrix Daten (Simuliert)
  const [matrixData] = useState(() =>
    BOYS.map((_, b) =>
      GIRLS.map((_, g) => {
        if (
          (b === 0 && g === 0) ||
          (b === 2 && g === 2) ||
          (b === 5 && g === 7)
        )
          return 100;
        return Math.floor(Math.random() * 95);
      }),
    ),
  );

  return (
    <div className="relative bg-[#05050a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
      {/* 1. FLOATING PREVIEW (Oben Rechts) */}
      <div className="absolute top-6 right-10 z-50 h-16 pointer-events-none">
        <AnimatePresence>
          {hoveredCell && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-white/5 backdrop-blur-2xl border border-cyan-500/30 p-4 rounded-xl flex items-center gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="text-right">
                <p className="text-[9px] text-cyan-400 font-black tracking-widest uppercase">
                  Target Match
                </p>
                <p className="text-lg font-black italic text-white uppercase tracking-tighter">
                  {BOYS[hoveredCell.b]} <span className="text-white/20">&</span>{" "}
                  {GIRLS[hoveredCell.g]}
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-3xl font-black italic text-cyan-400">
                {matrixData[hoveredCell.b][hoveredCell.g]}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="table-fixed border-separate border-spacing-2 w-full min-w-250">
          <thead>
            <tr>
              <th className="w-32"></th>
              {GIRLS.map((girl, gIndex) => (
                <th key={girl} className="w-24 h-24 relative">
                  <motion.div
                    animate={{
                      color:
                        hoveredCell?.g === gIndex
                          ? "#22d3ee"
                          : "rgba(255,255,255,0.3)",
                      scale: hoveredCell?.g === gIndex ? 1.15 : 1,
                      textShadow:
                        hoveredCell?.g === gIndex
                          ? "0 0 10px rgba(34,211,238,0.5)"
                          : "none",
                    }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-black tracking-[0.3em] uppercase rotate-[-35deg] origin-bottom-left whitespace-nowrap transition-all"
                  >
                    {girl}
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOYS.map((boy, bIndex) => (
              <tr key={boy}>
                {/* Mann Name (Linke Spalte) */}
                <td className="text-right pr-6 h-16">
                  <motion.span
                    animate={{
                      color:
                        hoveredCell?.b === bIndex
                          ? "#22d3ee"
                          : "rgba(255,255,255,0.5)",
                      x: hoveredCell?.b === bIndex ? 8 : 0,
                      textShadow:
                        hoveredCell?.b === bIndex
                          ? "0 0 10px rgba(34,211,238,0.5)"
                          : "none",
                    }}
                    className="text-xs font-black italic uppercase tracking-tighter block transition-all"
                  >
                    {boy}
                  </motion.span>
                </td>

                {GIRLS.map((girl, gIndex) => (
                  <HeatmapCell
                    key={`${boy}-${girl}`}
                    prob={matrixData[bIndex][gIndex]}
                    onHover={() => setHoveredCell({ b: bIndex, g: gIndex })}
                    onLeave={() => setHoveredCell(null)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- EINZELNE ZELLE ---
const HeatmapCell: React.FC<{
  prob: number;
  onHover: () => void;
  onLeave: () => void;
}> = ({ prob, onHover, onLeave }) => {
  const [count, setCount] = useState(0);
  const isMatch = prob === 100;
  const spring = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const delay = Math.random() * 600;
    const timer = setTimeout(() => spring.set(prob), delay);
    const unsub = spring.on("change", (latest) => setCount(Math.floor(latest)));
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, [spring, prob]);

  const getBgColor = (val: number) => {
    if (isMatch && val > 95)
      return "bg-yellow-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]";
    if (val >= 70) return "bg-green-600";
    if (val >= 30) return "bg-blue-600";
    return "bg-red-900/40";
  };

  return (
    <motion.td
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className={`relative w-24 h-16 rounded-xl border border-white/5 transition-colors duration-300 overflow-hidden cursor-pointer ${getBgColor(count)}`}
    >
      <div className="flex items-center justify-center h-full">
        <span className="text-lg font-black italic text-white drop-shadow-md">
          {isMatch && count > 95 ? "MATCH" : `${count}%`}
        </span>
      </div>

      {/* Subtiler Glow-Streifen für Perfect Matches */}
      {isMatch && count > 95 && (
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
        />
      )}
    </motion.td>
  );
};

export default Heatmap;
