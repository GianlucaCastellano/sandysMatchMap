import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Import deiner Komponenten (Pfade ggf. anpassen)
import LandingPage from "./pages/LandingPage";

import Heatmap from "./components/Heatmap";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      {/* AnimatePresence ermöglicht smooth Transitions beim Routen-Wechsel */}
      <AnimatePresence mode="wait">
        <Routes>
          {/* 1. LANDING PAGE (Intro) */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. DASHBOARD BEREICH (Mit dem Layout-Gerüst) */}
          <Route
            path="/dashboard"
            element={
              <Dashboard>
                <Heatmap />
              </Dashboard>
            }
          />

          {/* Platzhalter für weitere Seiten im Dashboard */}
          <Route
            path="/stars"
            element={
              <Dashboard>
                <div className="text-white p-10">Star Files - Coming Soon</div>
              </Dashboard>
            }
          />

          {/* FALLBACK: Zurück zur Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;
