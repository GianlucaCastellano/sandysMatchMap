import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Heatmap from "./components/Heatmap";
import StarsPage from "./pages/StarPage";

// Platzhalter für zukünftige Seiten, damit die App nicht crasht
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-[2rem]">
    <p className="text-white/20 font-black uppercase tracking-[0.5em]">
      {title} coming soon
    </p>
  </div>
);

const AnimatedRoutes = ({
  triggerFlash,
  matrixData,
  isLoading,
}: {
  triggerFlash: (nav: () => void) => void;
  matrixData: any;
  isLoading: boolean;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* LANDING PAGE */}
        <Route
          path="/"
          element={
            <LandingPage
              onStart={() => triggerFlash(() => navigate("/dashboard"))}
            />
          }
        />

        {/* MATRIX / DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <Dashboard>
              <Heatmap boysView={matrixData} isLoading={isLoading} />
            </Dashboard>
          }
        />

        {/* STARS DATABASE */}
        <Route
          path="/stars"
          element={
            <Dashboard>
              <StarsPage />
            </Dashboard>
          }
        />

        {/* HISTORY (Zukünftig) */}
        <Route
          path="/history"
          element={
            <Dashboard>
              <Placeholder title="Matching History" />
            </Dashboard>
          }
        />

        {/* ADMIN (Zukünftig) */}
        <Route
          path="/admin"
          element={
            <Dashboard>
              <Placeholder title="Admin Terminal" />
            </Dashboard>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [matrixData, setMatrixData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Daten vom Backend laden
  const loadData = async () => {
    try {
      setLoading(true);
      // Wichtig: Hier ggf. den Proxy oder die volle URL nutzen (CORS!)
      const response = await fetch(
        "http://localhost:8080/probabilities/calculate",
      );
      const result = await response.json();

      if (result.success && result.data) {
        setMatrixData(result.data.boysView);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Matrix:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerFlash = (navCallback: () => void) => {
    setIsFlashActive(true);
    // Schneller Flash-In
    setTimeout(navCallback, 100);
    // Flash-Out
    setTimeout(() => setIsFlashActive(false), 500);
  };

  return (
    <Router>
      <div className="relative min-h-screen bg-[#020205] overflow-hidden">
        {/* GLOBALER ÜBERGANGS-BLITZ */}
        <AnimatePresence>
          {isFlashActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="fixed inset-0 bg-white z-[9999] pointer-events-none"
            />
          )}
        </AnimatePresence>

        <AnimatedRoutes
          triggerFlash={triggerFlash}
          matrixData={matrixData}
          isLoading={loading}
        />
      </div>
    </Router>
  );
};

export default App;
