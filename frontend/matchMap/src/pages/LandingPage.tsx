import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

// --- ULTRA FAST DRAMATIC COUNTER ---
const DramaticCounter: React.FC<{ to: number; onComplete: () => void }> = ({
  to,
  onComplete,
}) => {
  const spring = useSpring(0, { stiffness: 35, damping: 15 });
  const display = useTransform(spring, (value) =>
    Math.floor(value).toLocaleString("de-DE"),
  );

  useEffect(() => {
    // Kurze Verzögerung für den Fokus, dann High-Speed-Lauf
    const t = setTimeout(() => spring.set(to), 500);
    const unsub = spring.on("change", (latest) => {
      if (latest >= to) onComplete();
    });
    return () => {
      clearTimeout(t);
      unsub();
    };
  }, [spring, to, onComplete]);

  return <motion.span>{display}</motion.span>;
};

const LandingPage: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#020205] text-white overflow-hidden font-sans">
      {/* 1. DYNAMISCHE BEAMS (Bewegen sich wie Studio-Lights) */}
      <div className="absolute inset-0 flex justify-around pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, rotate: -20 }}
            animate={{
              opacity: isReady ? [0.2, 0.6, 0.2] : 0.2,
              rotate: [-15, 15, -15], // Sweeping Motion
              backgroundColor: isReady ? "#d946ef" : "#06b6d4",
            }}
            transition={{
              rotate: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              },
              opacity: { duration: 2, repeat: Infinity },
            }}
            className="w-[2px] h-[150%] origin-top blur-[2px] shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          />
        ))}
      </div>

      {/* 2. THE BIG REVEAL FLASH */}
      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 3. MAIN STAGE */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Logo oben - Dezent aber Glamourös */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-10 flex flex-col items-center"
        >
          <span className="text-[10px] tracking-[0.8em] uppercase text-white/30 mb-2">
            Presented by
          </span>
          <h2 className="text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white">
            SANDYS<span className="text-pink-500">MATCHMAP</span>
          </h2>
        </motion.div>

        {/* Branding: ARE YOU THE ONE (Erscheint beim Impact) */}
        <div className="h-20 mb-4 overflow-hidden">
          <AnimatePresence>
            {isReady && (
              <motion.h1
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="text-2xl md:text-4xl font-black tracking-[1.2em] uppercase italic text-white/90"
              >
                Are You The One?
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* --- CENTRAL JACKPOT (Kein Kasten, Pure Light) --- */}
        <motion.div
          animate={isReady ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="relative text-center cursor-default"
        >
          <motion.p
            animate={{ opacity: isReady ? 1 : 0.5 }}
            className="text-xs font-black tracking-[0.5em] uppercase text-cyan-400 mb-6"
          >
            Match Jackpot
          </motion.p>

          <h3 className="text-[20vw] md:text-[14rem] font-black leading-none tracking-tighter italic flex items-center justify-center">
            <span className="text-yellow-500 mr-4 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]">
              €
            </span>
            <span className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              <DramaticCounter
                to={200000}
                onComplete={() => setIsReady(true)}
              />
            </span>
          </h3>

          {/* Glühende Aura unter der Zahl nach dem Load */}
          {isReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-yellow-500/20 to-cyan-500/20 blur-[120px] -z-10"
            />
          )}
        </motion.div>

        {/* 4. FINAL ACTIONS (Erscheinen nach dem Blitz) */}
        <div className="h-32 mt-12 flex flex-col items-center">
          <AnimatePresence>
            {isReady && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-10"
              >
                <button
                  onClick={() => navigate("/dashboard")}
                  className="relative group px-20 py-6 bg-white overflow-hidden skew-x-[-15deg] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="relative z-10 text-black group-hover:text-white font-black text-2xl uppercase italic tracking-[0.2em] transition-colors">
                    Crack the Matrix
                  </span>
                </button>

                <button className="text-[10px] font-black tracking-[0.5em] uppercase text-white/20 hover:text-white transition-colors border-b border-white/10 pb-2">
                  Open Command Center
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* VIGNETTE */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
};

export default LandingPage;
