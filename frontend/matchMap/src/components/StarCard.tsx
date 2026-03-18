import React from "react";
import { motion } from "framer-motion";

interface StarCardProps {
  star: {
    id: string;
    name: string;
    gender: "boy" | "girl";
    active: boolean;
    age?: number | null;
    image_url?: string | null;
  };
  onClick: () => void;
}

const StarCard: React.FC<StarCardProps> = ({ star, onClick }) => {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden p-5 transition-colors hover:bg-white/[0.06] cursor-pointer"
    >
      <div className="aspect-[4/5] rounded-[2rem] mb-5 relative bg-[#0a0a0f] overflow-hidden shadow-inner border border-white/5">
        {star.image_url ? (
          <img
            src={star.image_url}
            alt={star.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div
              className={`absolute inset-0 opacity-10 bg-gradient-to-br ${star.gender === "boy" ? "from-cyan-500 to-transparent" : "from-pink-600/60 to-transparent"}`}
            />
            <div className="absolute inset-0 flex items-center justify-center text-3xl grayscale opacity-30 group-hover:scale-110 transition-all duration-700">
              {star.gender === "boy" ? "👤" : "💃"}
            </div>
          </>
        )}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/5">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${star.active ? "bg-cyan-400 animate-pulse" : "bg-red-500"}`}
            />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/60">
              {star.active ? "Active" : "Out"}
            </span>
          </div>
        </div>
      </div>

      <div className="px-2">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white/90 group-hover:text-white transition-colors">
            {star.name}
          </h3>
          {star.age && (
            <span className="text-[10px] font-black text-cyan-500/40 italic">
              {star.age}
            </span>
          )}
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/20 mt-2">
          {star.gender} contestant
        </p>
      </div>
    </motion.div>
  );
};

export default React.memo(StarCard);
