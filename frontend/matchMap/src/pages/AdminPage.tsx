import React, { useState } from "react";
import { motion } from "framer-motion";
import NightProtocolComponent from "../components/NightProtocolComponent";
import TruthBoothComponent from "../components/TruthBoothComponent";
import StarManagerComponent from "../components/StarManagerComponent";

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"nights" | "truth" | "stars">(
    "nights",
  );

  const tabs = [
    { id: "nights", label: "Matching Nights", icon: "🌙" },
    { id: "truth", label: "Match Box", icon: "📦" },
    { id: "stars", label: "Stars", icon: "✨" },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white p-4 md:p-10">
      <div className="flex flex-wrap gap-4 mb-12 bg-white/5 p-2 rounded-[2.5rem] border border-white/10 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 rounded-[2rem] font-black uppercase italic tracking-widest transition-all flex items-center gap-3 ${
              activeTab === tab.id
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === "nights" && <NightProtocolComponent />}
        {activeTab === "truth" && <TruthBoothComponent />}
        {activeTab === "stars" && <StarManagerComponent />}
      </motion.div>
    </div>
  );
};

export default AdminPage;
