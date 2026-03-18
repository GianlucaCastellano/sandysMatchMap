import React from "react";
import { motion } from "framer-motion";

interface HeatmapCellProps {
  prob: number;
  onHover: () => void;
  onLeave: () => void;
}

const HeatmapCell: React.FC<HeatmapCellProps> = ({
  prob,
  onHover,
  onLeave,
}) => {
  const displayProb = Math.round(prob);
  const isMatch = displayProb === 100;

  const getBgColor = () => {
    if (isMatch)
      return "bg-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] border-amber-200 z-10";
    if (displayProb >= 70)
      return "bg-emerald-500 border-emerald-300/40 shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]";
    if (displayProb >= 40) return "bg-blue-600 border-blue-400/30";
    if (displayProb >= 1) return "bg-rose-600 border-rose-400/30";
    return "bg-zinc-950 border-white/5 opacity-40";
  };

  return (
    <motion.td
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.05, zIndex: 10, filter: "brightness(1.2)" }}
      className={`
        relative w-24 h-16 rounded-xl border transition-all duration-300 
        overflow-hidden cursor-crosshair 
        ${getBgColor()}
      `}
    >
      <div className="flex items-center justify-center h-full">
        <span
          className={`
            text-lg font-black italic tracking-tighter drop-shadow-lg 
            ${isMatch ? "text-black" : "text-white"}
            ${displayProb === 0 ? "opacity-10 text-white/5" : "opacity-100"}
            ${isMatch ? "animate-pulse" : ""}
          `}
        >
          {isMatch ? "MATCH" : displayProb > 0 ? `${displayProb}%` : "•"}
        </span>
      </div>

      {isMatch && (
        <motion.div
          animate={{ x: ["-150%", "150%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-24 pointer-events-none"
        />
      )}

      {displayProb >= 70 && !isMatch && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      )}
    </motion.td>
  );
};

export default React.memo(HeatmapCell);
