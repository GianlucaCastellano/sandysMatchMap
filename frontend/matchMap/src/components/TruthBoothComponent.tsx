import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Star {
  id: string;
  name: string;
  image_url: string | null;
  gender: string;
}

const TruthBoothComponent: React.FC = () => {
  const [boys, setBoys] = useState<Star[]>([]);
  const [girls, setGirls] = useState<Star[]>([]);
  const [selectedBoy, setSelectedBoy] = useState<Star | null>(null);
  const [selectedGirl, setSelectedGirl] = useState<Star | null>(null);
  const [week, setWeek] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectorOpen, setSelectorOpen] = useState<{
    open: boolean;
    type: "boy" | "girl";
  }>({
    open: false,
    type: "boy",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bRes, gRes] = await Promise.all([
          fetch("http://localhost:8080/boys"),
          fetch("http://localhost:8080/girls"),
        ]);
        const bData = await bRes.json();
        const gData = await gRes.json();
        setBoys(bData);
        setGirls(gData);
      } catch (e) {
        console.error("Error loading stars:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveResult = async (isMatch: boolean) => {
    if (!selectedBoy || !selectedGirl) {
      alert("Bitte wähle erst einen Boy und ein Girl aus!");
      return;
    }

  
    const payload = {
      week: Number(week),
      boyId: selectedBoy.id,
      girlId: selectedGirl.id,
      result: isMatch,
    };

    try {
      const res = await fetch("http://localhost:8080/matchbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(
          `Ergebnis gespeichert: ${selectedBoy.name} & ${selectedGirl.name}`,
        );
        setSelectedBoy(null);
        setSelectedGirl(null);
      } else {
        const errorData = await res.json();
        alert("Fehler: " + (errorData.message || "Backend Error"));
      }
    } catch (e) {
      console.error(e);
      alert("Server nicht erreichbar.");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-white/20 uppercase font-black italic">
        Loading Match Box...
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 backdrop-blur-xl relative">
      <div className="flex justify-between items-start mb-12">
        <div className="text-left">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            Match Box
          </h2>
          <p className="text-cyan-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
            Gib hier das Matchbox Paar ein
          </p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
          <p className="text-[8px] font-black text-white/40 uppercase mb-1 text-center">
            Woche
          </p>
          <input
            type="number"
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            className="bg-transparent text-2xl font-black text-white outline-none w-12 text-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* BOY SLOT */}
        <button
          onClick={() => setSelectorOpen({ open: true, type: "boy" })}
          className="flex flex-col items-center gap-4 group focus:outline-none"
        >
          <div
            className={`w-32 h-32 rounded-[2.5rem] border-2 flex items-center justify-center overflow-hidden transition-all duration-500 ${selectedBoy ? "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]" : "border-dashed border-white/10 group-hover:border-white/30 bg-white/5"}`}
          >
            {selectedBoy?.image_url ? (
              <img
                src={selectedBoy.image_url}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <span className="text-white/20 font-black text-[10px] uppercase tracking-widest">
                Junge
              </span>
            )}
          </div>
          <span className="text-sm font-black uppercase italic text-white/40 group-hover:text-white">
            {selectedBoy ? selectedBoy.name : "Wähle Jungen aus"}
          </span>
        </button>

        <div className="text-center">
          <div className="text-4xl font-thin text-white/10 mb-4 italic">VS</div>
          <div
            className={`py-4 px-6 rounded-2xl border transition-all duration-700 ${selectedBoy && selectedGirl ? "bg-cyan-500/10 border-cyan-500/50" : "bg-white/5 border-white/10"}`}
          >
            <span
              className={`font-black uppercase italic text-xs tracking-widest ${selectedBoy && selectedGirl ? "text-cyan-400 animate-pulse" : "text-white/20"}`}
            >
              {selectedBoy && selectedGirl ? "Checke Match" : "Wähle Paar aus"}
            </span>
          </div>
        </div>

        {/* GIRL SLOT */}
        <button
          onClick={() => setSelectorOpen({ open: true, type: "girl" })}
          className="flex flex-col items-center gap-4 group focus:outline-none"
        >
          <div
            className={`w-32 h-32 rounded-[2.5rem] border-2 flex items-center justify-center overflow-hidden transition-all duration-500 ${selectedGirl ? "border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]" : "border-dashed border-white/10 group-hover:border-white/30 bg-white/5"}`}
          >
            {selectedGirl?.image_url ? (
              <img
                src={selectedGirl.image_url}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <span className="text-white/20 font-black text-[10px] uppercase tracking-widest">
                Mächen
              </span>
            )}
          </div>
          <span className="text-sm font-black uppercase italic text-white/40 group-hover:text-white">
            {selectedGirl ? selectedGirl.name : "Wähle Mädchen Aus"}
          </span>
        </button>
      </div>

      <div className="mt-16 flex justify-center gap-6">
        <button
          onClick={() => handleSaveResult(false)}
          className="flex-1 max-w-[220px] py-6 bg-rose-600 text-white rounded-3xl font-black uppercase italic hover:bg-rose-500 transition-all shadow-[0_10px_40px_rgba(225,29,72,0.3)] active:scale-95"
        >
          No Match
        </button>
        <button
          onClick={() => handleSaveResult(true)}
          className="flex-1 max-w-[220px] py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase italic hover:bg-emerald-500 transition-all shadow-[0_10px_40px_rgba(5,150,105,0.3)] active:scale-95"
        >
          Perfect Match
        </button>
      </div>

      <AnimatePresence>
        {selectorOpen.open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectorOpen({ ...selectorOpen, open: false })}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[999]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl p-10 z-[1000] bg-[#0a0a0c] border border-white/10 rounded-[4rem] shadow-2xl"
            >
              <h3 className="text-3xl font-black italic uppercase text-white mb-8 text-center tracking-tighter">
                Select {selectorOpen.type === "boy" ? "a Boy" : "a Girl"}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {(selectorOpen.type === "boy" ? boys : girls).map((star) => (
                  <button
                    key={star.id}
                    onClick={() => {
                      if (selectorOpen.type === "boy") setSelectedBoy(star);
                      else setSelectedGirl(star);
                      setSelectorOpen({ ...selectorOpen, open: false });
                    }}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-cyan-500 transition-all">
                      {star.image_url ? (
                        <img
                          src={star.image_url}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20 font-black uppercase">
                          {star.name.substring(0, 2)}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white transition-colors">
                      {star.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TruthBoothComponent;
