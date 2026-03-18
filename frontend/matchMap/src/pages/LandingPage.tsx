import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";

const DramaticCounter: React.FC<{ to: number; onComplete: () => void }> = ({
  to,
  onComplete,
}) => {
  const spring = useSpring(0, { stiffness: 35, damping: 15 });
  const display = useTransform(spring, (value) =>
    Math.floor(value).toLocaleString("de-DE"),
  );

  useEffect(() => {
    const t = setTimeout(() => spring.set(to), 500);

    const unsub = spring.on("change", (latest) => {
      if (latest >= to - 50) onComplete();
    });
    return () => {
      clearTimeout(t);
      unsub();
    };
  }, [spring, to, onComplete]);

  return <motion.span>{display}</motion.span>;
};

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#020205] text-white overflow-hidden font-sans flex flex-col items-center justify-center">
      <div className="absolute inset-0 flex justify-around pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, rotate: -20 }}
            animate={{
              opacity: isReady ? [0.1, 0.4, 0.1] : 0.1,
              rotate: [-15, 15, -15],
              backgroundColor: isReady ? "#d946ef" : "#06b6d4",
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              },
              opacity: { duration: 3, repeat: Infinity },
            }}
            className="w-[1px] h-[150%] origin-top blur-[3px] shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          />
        ))}
      </div>

      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-[-120px] flex flex-col items-center"
        >
          <span className="text-[9px] tracking-[1em] uppercase text-white/20 mb-3">
            Strategy Engine
          </span>
          <h2 className="text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white uppercase">
            Sandys<span className="text-pink-500">Matchmap</span>
          </h2>
        </motion.div>

        <div className="h-16 mb-2 overflow-hidden flex items-center justify-center">
          <AnimatePresence>
            {isReady && (
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="text-2xl md:text-4xl font-black tracking-[1.1em] uppercase italic text-white/80 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Are You The One?
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          animate={isReady ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.4 }}
          className="relative text-center cursor-default"
        >
          <motion.p
            animate={{ opacity: isReady ? 1 : 0.4 }}
            className="text-[10px] font-black tracking-[0.6em] uppercase text-cyan-400 mb-4"
          >
            Potential Prize Pool
          </motion.p>

          <h3 className="text-[22vw] md:text-[14rem] font-black leading-none tracking-tighter italic flex items-center justify-center select-none">
            <span className="text-yellow-500 mr-4 drop-shadow-[0_0_35px_rgba(234,179,8,0.5)]">
              €
            </span>
            <span className="text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]">
              <DramaticCounter
                to={200000}
                onComplete={() => setIsReady(true)}
              />
            </span>
          </h3>

          {isReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-yellow-500/10 to-cyan-500/10 blur-[140px] -z-10"
            />
          )}
        </motion.div>

        <div className="h-40 mt-10 flex flex-col items-center justify-start">
          <AnimatePresence>
            {isReady && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-8"
              >
                <button
                  onClick={onStart}
                  className="relative group px-24 py-7 bg-white overflow-hidden skew-x-[-15deg] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />

                  <span className="relative z-10 text-black group-hover:text-white font-black text-2xl uppercase italic tracking-[0.15em] transition-colors">
                    Crack the Matrix
                  </span>
                </button>

                <button
                  onClick={onStart}
                  className="text-[9px] font-black tracking-[0.5em] uppercase text-white/30 hover:text-white transition-all border-b border-white/5 hover:border-white/20 pb-1"
                >
                  Enter Command Center
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,4px_100%]" />
    </div>
  );
};

export default LandingPage;
