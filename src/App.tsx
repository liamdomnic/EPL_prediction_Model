import { useState } from "react";
import { InjuryProvider } from "./context/InjuryContext";
import { InjuryManagement } from "./components/InjuryManagement";
import { GW9Fixtures } from "./components/GW9Fixtures";
import { MatchPredictorFPL, TeamComparison, TopPerformersByTeam } from "./components/MatchPredictorFPL";

type Tab = "predictions" | "fpl";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("predictions");

  return (
    <InjuryProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">⚽</div>
                <div>
                  <h1 className="text-3xl font-bold">EPL Predictor 2026/27</h1>
                  <p className="text-purple-200 text-sm mt-1">
                    Poisson Distribution Engine • Data-Driven Forecasts
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2">
                <span className="text-xs text-purple-200">GW8 Complete</span>
                <span className="text-white font-bold">→ GW9 Predictions</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("predictions")}
                className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === "predictions"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                📊 Match Predictions
              </button>
              <button
                onClick={() => setActiveTab("fpl")}
                className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === "fpl"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                🏆 Fantasy Premier League
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === "predictions" && (
            <div className="space-y-8">
              <MatchPredictorFPL />
              <TeamComparison />
              <TopPerformersByTeam />
            </div>
          )}

          {activeTab === "fpl" && (
            <div className="space-y-8">
              {/* Injury Management */}
              <InjuryManagement />
              
              {/* Best XI & Top 20 */}
              <GW9Fixtures />
              
              {/* Match Predictor */}
              <MatchPredictorFPL />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-12">
          <p className="text-sm">
            EPL Prediction Model 2026/27 • Poisson Distribution Engine • Based on GW1-GW8 data
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Predictions are statistical estimates. Not financial/gambling advice.
          </p>
        </footer>
      </div>
    </InjuryProvider>
  );
}
