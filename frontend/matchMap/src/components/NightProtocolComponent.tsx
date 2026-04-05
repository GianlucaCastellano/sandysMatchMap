import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Star {
  id: string;
  name: string;
  image_url: string | null;
  gender: string;
}

const NightProtocolComponent: React.FC = () => {
  const [boys, setBoys] = useState<Star[]>([]);
  const [girls, setGirls] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);

  const [week, setWeek] = useState(1);
  const [beams, setBeams] = useState(0);
  const [money, setMoney] = useState(200000);
  const [seating, setSeating] = useState<Record<string, string>>({});

  const [activeBoyForSelection, setActiveBoyForSelection] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadStars = async () => {
      try {
        const [bRes, gRes, mRes] = await Promise.all([
          fetch("http://localhost:8080/boys"),
          fetch("http://localhost:8080/girls"),
          fetch("http://localhost:8080/matching_nights/money"),
        ]);
        const bData = await bRes.json();
        const gData = await gRes.json();
        const mData = await mRes.json();

        setBoys(bData);
        setGirls(gData);
        setWeek((mData.week || 0) + 1);
        setMoney(mData.money || 200000);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadStars();
  }, []);

  const getStar = (id: string, group: Star[]) => group.find((s) => s.id === id);

  const handleSeatSelect = (girlId: string) => {
    if (!activeBoyForSelection) return;

    setSeating((prev) => {
      const newSeating = { ...prev };
      Object.keys(newSeating).forEach((bId) => {
        if (newSeating[bId] === girlId) delete newSeating[bId];
      });
      newSeating[activeBoyForSelection] = girlId;
      return newSeating;
    });

    setActiveBoyForSelection(null);
  };

  const saveMatchingNight = async () => {
    if (Object.keys(seating).length !== boys.length) {
      alert(
        `Stopp! Erst ${Object.keys(seating).length} von ${boys.length} Paaren zugeordnet.`,
      );
      return;
    }

    const payload = {
      week: Number(week),
      beams: Number(beams),
      money: Number(money),
      seating,
    };

    try {
      const response = await fetch("http://localhost:8080/matching_nights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Speichern");
      }

      alert("Protokoll erfolgreich injiziert!");
    } catch (error: any) {
      console.error(error);
      alert(`Fehler: ${error.message}`);
    }
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
      className={`${size} rounded-2xl border-2 ${color} overflow-hidden bg-zinc-900 shadow-xl flex items-center justify-center relative group`}
    >
      {star?.image_url ? (
        <img
          src={star.image_url}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={star.name}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-white/10 to-transparent">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
            {star?.name?.substring(0, 2) || "??"}
          </span>
        </div>
      )}
    </div>
  );

  if (loading)
    return (
      <div className="p-20 text-cyan-500 font-black animate-pulse uppercase tracking-widest">
        Loading Command Center...
      </div>
    );

  return (
    <div className="space-y-10 p-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              Night
            </p>
            <input
              type="number"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="bg-transparent text-4xl font-black text-white outline-none w-20"
            />
          </div>
          <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white/20">
            W
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              Prize Pool
            </p>
            <input
              type="number"
              value={money}
              onChange={(e) => setMoney(Number(e.target.value))}
              className="bg-transparent text-4xl font-black text-yellow-500 outline-none w-40"
            />
          </div>
          <div className="h-12 w-12 rounded-full border border-yellow-500/20 text-yellow-500 flex items-center justify-center font-black">
            €
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
              Beams
            </p>
            <select
              value={beams}
              onChange={(e) => setBeams(Number(e.target.value))}
              className="bg-transparent text-4xl font-black text-cyan-400 outline-none w-20 appearance-none cursor-pointer"
            >
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i} className="bg-[#0a0a0c] text-xl">
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-8 rounded-full ${i < beams / 3 ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee]" : "bg-white/10"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-md relative z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">
              Pairing Protocol
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
              Assign matches for the current week
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-pink-500">
              {Object.keys(seating).length} / 10 Paired
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {boys.map((boy) => {
            const assignedGirlId = seating[boy.id];
            const girl = assignedGirlId ? getStar(assignedGirlId, girls) : null;
            return (
              <div
                key={boy.id}
                className="relative bg-black/40 border border-white/5 rounded-[2rem] p-4 flex flex-col items-center gap-4 hover:border-white/10 transition-colors"
              >
                <div className="w-full flex justify-between items-center">
                  <Avatar star={boy} color="border-blue-500/30" />
                  <div className="flex-1 flex flex-col items-center px-2">
                    <div className="h-[2px] w-full bg-gradient-to-r from-blue-500/20 via-white/10 to-pink-500/20 rounded-full" />
                    <span className="text-[8px] font-black text-white/20 uppercase mt-1">
                      Match
                    </span>
                  </div>
                  {girl ? (
                    <button
                      onClick={() => setActiveBoyForSelection(boy.id)}
                      className="relative group"
                    >
                      <Avatar
                        star={girl}
                        color="border-pink-500/80 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[9px] font-black text-white uppercase">
                          Swap
                        </span>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveBoyForSelection(boy.id)}
                      className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/20 hover:border-pink-500 hover:bg-pink-500/10 flex items-center justify-center transition-all group"
                    >
                      <span className="text-2xl font-light text-white/30 group-hover:text-pink-500 group-hover:scale-125 transition-all">
                        +
                      </span>
                    </button>
                  )}
                </div>
                <div className="w-full flex justify-between px-1">
                  <span className="text-[10px] font-black text-white uppercase truncate w-16">
                    {boy.name}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase truncate w-16 text-right ${girl ? "text-pink-400" : "text-white/20"}`}
                  >
                    {girl ? girl.name : "Empty"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={saveMatchingNight}
          className="w-full mt-12 py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all"
        >
          Inject Protocol
        </button>
      </section>

      <AnimatePresence>
        {activeBoyForSelection && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBoyForSelection(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-[3rem] p-8 z-[110] shadow-2xl"
            >
              <div className="text-center mb-8">
                <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.5em]">
                  Select Partner
                </p>
                <h3 className="text-2xl font-black italic text-white uppercase mt-2">
                  Match for {getStar(activeBoyForSelection, boys)?.name}
                </h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {girls.map((girl) => {
                  const isSelectedBySomeoneElse =
                    Object.values(seating).includes(girl.id) &&
                    seating[activeBoyForSelection] !== girl.id;
                  return (
                    <button
                      key={girl.id}
                      onClick={() => handleSeatSelect(girl.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${seating[activeBoyForSelection] === girl.id ? "bg-pink-500/20 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]" : isSelectedBySomeoneElse ? "bg-white/5 border-white/5 opacity-50 hover:opacity-100 hover:border-yellow-500" : "bg-white/5 border-white/10 hover:border-pink-500/50 hover:bg-white/10"}`}
                    >
                      <Avatar
                        star={girl}
                        color={
                          seating[activeBoyForSelection] === girl.id
                            ? "border-pink-500"
                            : "border-white/10"
                        }
                        size="w-12 h-12"
                      />
                      <span className="text-[10px] font-black text-white uppercase truncate w-full text-center">
                        {girl.name}
                      </span>
                      {isSelectedBySomeoneElse && (
                        <span className="text-[8px] font-bold text-yellow-500 uppercase">
                          Steal
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NightProtocolComponent;
