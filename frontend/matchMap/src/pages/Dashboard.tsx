import React, { useState } from "react";
import { motion } from "framer-motion";

const Dashboard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("matrix");

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans flex overflow-hidden">
      {/* SIDEBAR */}
      <nav className="w-20 md:w-72 border-r border-white/5 flex flex-col py-10 bg-black/40 backdrop-blur-2xl z-50">
        <div className="px-8 mb-12">
          <h2 className="text-xl font-black italic tracking-tighter uppercase">
            Sandys<span className="text-pink-500">Map</span>
          </h2>
        </div>

        <div className="flex flex-col gap-2 px-4">
          {["matrix", "stars", "history", "admin"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`group relative px-6 py-4 rounded-xl text-left text-xs font-black uppercase tracking-[0.2em] transition-all
                ${activeTab === tab ? "text-white bg-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" : "text-white/30 hover:text-white"}`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="navGlow"
                  className="absolute inset-0 border border-white/10 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto px-8">
          <div className="p-4 rounded-2xl bg-linear-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">
              Live Engine
            </p>
            <p className="text-[9px] text-white/40 leading-relaxed">
              Processing 75k scenarios for Sandra...
            </p>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Beams */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/3 w-px h-full bg-cyan-400 blur-[2px] animate-pulse" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-pink-500 blur-[2px] animate-pulse delay-1000" />
        </div>

        {/* TOP NAVIGATION / STATS */}
        <header className="px-10 py-8 flex justify-between items-center bg-black/20 border-b border-white/5 backdrop-blur-md z-10">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              The Matrix
            </h1>
            <p className="text-[10px] font-bold tracking-[0.4em] text-white/20 mt-2 uppercase italic">
              Are You The One? // Analysis Mode
            </p>
          </div>

          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                Perfect Matches
              </p>
              <p className="text-2xl font-black text-pink-500 italic">2 / 10</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <button className="bg-white text-black px-8 py-3 rounded-lg font-black uppercase italic tracking-tighter hover:bg-cyan-400 transition-colors">
              Simulate
            </button>
          </div>
        </header>

        {/* INSERT CONTENT HERE */}
        <div className="flex-1 relative overflow-y-auto p-10">{children}</div>
      </main>
    </div>
  );
};

export default Dashboard;
