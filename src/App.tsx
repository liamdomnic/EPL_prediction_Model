import { useState, useEffect } from "react";
import { teams, upcomingFixtures, Team } from "./data/teams";
import { predictMatch, simulateSeason, MatchPrediction } from "./utils/predictionEngine";
import {
  FPLLeaderboard,
  TopScorers,
  TopAssisters,
  ValuePicks,
  DifferentialPicks,
  InFormPlayers,
  GWPointsBreakdown,
  FPLTeamBuilder,
  FPLStatsOverview,
} from "./components/FantasyComponents";

// GW8 Results
const gw8Results = [
  { home: "ips", away: "nfo", homeGoals: 1, awayGoals: 1 },
  { home: "avl", away: "mci", homeGoals: 2, awayGoals: 1 },
  { home: "cov", away: "ful", homeGoals: 0, awayGoals: 1 },
  { home: "ars", away: "eve", homeGoals: 2, awayGoals: 0 },
  { home: "che", away: "tot", homeGoals: 0, awayGoals: 2 },
  { home: "hul", away: "bre", homeGoals: 1, awayGoals: 1 },
  { home: "liv", away: "bri", homeGoals: 2, awayGoals: 0 },
  { home: "mun", away: "bou", homeGoals: 0, awayGoals: 3 },
  { home: "cry", away: "new", homeGoals: 0, awayGoals: 2 },
  { home: "sun", away: "lee", homeGoals: 0, awayGoals: 0 },
];

function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white py-6 px-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">⚽</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              EPL Prediction Model
            </h1>
            <p className="text-purple-200 text-sm">
              2026/27 Season • Poisson Distribution Engine • Data-Driven Forecasts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
          <span className="text-xs text-purple-200">GW8 Complete</span>
          <span className="text-white font-bold">→ GW9 Predictions</span>
        </div>
      </div>
    </header>
  );
}

function TeamBadge({ team, size = "md" }: { team: Team; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6 text-[8px]",
    md: "w-8 h-8 text-[10px]",
    lg: "w-12 h-12 text-xs",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white/20 flex-shrink-0`}
      style={{ backgroundColor: team.color, color: team.textColor }}
    >
      {team.shortName.slice(0, 3)}
    </div>
  );
}

function LeagueTable() {
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          📊 League Table
        </h2>
        <p className="text-indigo-200 text-sm">Standings after Gameweek 8</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-2 py-3 text-left font-semibold text-gray-600">#</th>
              <th className="px-2 py-3 text-left font-semibold text-gray-600">Team</th>
              <th className="px-2 py-3 text-center font-semibold text-gray-600">P</th>
              <th className="px-2 py-3 text-center font-semibold text-gray-600">W</th>
              <th className="px-2 py-3 text-center font-semibold text-gray-600">D</th>
              <th className="px-2 py-3 text-center font-semibold text-gray-600">L</th>
              <th className="px-2 py-3 text-center font-semibold text-gray-600">GD</th>
              <th className="px-2 py-3 text-center font-semibold text-gray-600">Pts</th>
              <th className="px-2 py-3 text-center font-semibold text-gray-600">Form</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr
                key={team.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index < 4
                    ? "border-l-4 border-l-blue-500"
                    : index < 6
                    ? "border-l-4 border-l-orange-400"
                    : index >= 17
                    ? "border-l-4 border-l-red-500"
                    : "border-l-4 border-l-transparent"
                }`}
              >
                <td className="px-2 py-2 font-bold text-gray-500">{index + 1}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={team} size="sm" />
                    <span className="font-medium text-gray-800 hidden md:inline">
                      {team.name}
                    </span>
                    <span className="font-medium text-gray-800 md:hidden">
                      {team.shortName}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2 text-center text-gray-600">{team.played}</td>
                <td className="px-2 py-2 text-center text-gray-600">{team.won}</td>
                <td className="px-2 py-2 text-center text-gray-600">{team.drawn}</td>
                <td className="px-2 py-2 text-center text-gray-600">{team.lost}</td>
                <td className="px-2 py-2 text-center font-medium text-gray-700">
                  {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}
                  {team.goalsFor - team.goalsAgainst}
                </td>
                <td className="px-2 py-2 text-center font-bold text-gray-900">{team.points}</td>
                <td className="px-2 py-2">
                  <div className="flex gap-0.5 justify-center">
                    {team.form.map((result, i) => (
                      <span
                        key={i}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          result === 3
                            ? "bg-green-500"
                            : result === 1
                            ? "bg-yellow-400"
                            : "bg-red-500"
                        }`}
                      >
                        {result === 3 ? "W" : result === 1 ? "D" : "L"}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Champions League
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-orange-400 rounded-sm"></span> Europa League
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-sm"></span> Relegation
        </span>
      </div>
    </div>
  );
}

function MatchPredictor() {
  const [homeTeamId, setHomeTeamId] = useState(teams[0].id);
  const [awayTeamId, setAwayTeamId] = useState(teams[1].id);
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);

  const homeTeam = teams.find((t) => t.id === homeTeamId)!;
  const awayTeam = teams.find((t) => t.id === awayTeamId)!;

  const handlePredict = () => {
    if (homeTeamId === awayTeamId) return;
    const result = predictMatch(homeTeam, awayTeam);
    setPrediction(result);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-700 to-emerald-800 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🔮 Match Predictor
        </h2>
        <p className="text-green-200 text-sm">
          Select teams for statistical predictions based on GW1-8 data
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              🏠 Home Team
            </label>
            <select
              value={homeTeamId}
              onChange={(e) => setHomeTeamId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none text-gray-800 font-medium"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <div className="mt-3 flex justify-center">
              <TeamBadge team={homeTeam} size="lg" />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handlePredict}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ⚡ Predict
            </button>
            <p className="text-gray-400 text-sm mt-2">VS</p>
          </div>

          <div className="text-center">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              ✈️ Away Team
            </label>
            <select
              value={awayTeamId}
              onChange={(e) => setAwayTeamId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none text-gray-800 font-medium"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <div className="mt-3 flex justify-center">
              <TeamBadge team={awayTeam} size="lg" />
            </div>
          </div>
        </div>

        {prediction && (
          <div className="mt-8 space-y-6">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-center text-white">
              <p className="text-gray-400 text-sm mb-2">Model Prediction</p>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <TeamBadge team={prediction.homeTeam} size="lg" />
                  <p className="text-xs mt-1 text-gray-300">{prediction.homeTeam.shortName}</p>
                </div>
                <div className="text-4xl font-bold">
                  {prediction.mostLikelyScore.home} - {prediction.mostLikelyScore.away}
                </div>
                <div className="text-center">
                  <TeamBadge team={prediction.awayTeam} size="lg" />
                  <p className="text-xs mt-1 text-gray-300">{prediction.awayTeam.shortName}</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                Most likely scoreline ({prediction.mostLikelyScore.prob.toFixed(1)}% probability)
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Expected Goals: {prediction.homeGoals.toFixed(2)} - {prediction.awayGoals.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-3">Match Outcome</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Home Win ({prediction.homeTeam.shortName})</span>
                      <span className="font-bold text-green-600">{prediction.homeWinProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full transition-all" style={{ width: `${prediction.homeWinProb}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Draw</span>
                      <span className="font-bold text-yellow-600">{prediction.drawProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-400 h-2.5 rounded-full transition-all" style={{ width: `${prediction.drawProb}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Away Win ({prediction.awayTeam.shortName})</span>
                      <span className="font-bold text-blue-600">{prediction.awayWinProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full transition-all" style={{ width: `${prediction.awayWinProb}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-3">Other Markets</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Over 2.5 Goals</span>
                      <span className="font-bold text-purple-600">{prediction.over25Prob.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full transition-all" style={{ width: `${prediction.over25Prob}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Both Teams To Score</span>
                      <span className="font-bold text-pink-600">{prediction.bttsProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-pink-500 h-2.5 rounded-full transition-all" style={{ width: `${prediction.bttsProb}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Model Confidence</span>
                      <span className="font-bold text-indigo-600">{prediction.confidence.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-indigo-500 h-2.5 rounded-full transition-all" style={{ width: `${prediction.confidence}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FixturesList() {
  const predictions = upcomingFixtures.map((fixture) => {
    const homeTeam = teams.find((t) => t.id === fixture.homeTeam)!;
    const awayTeam = teams.find((t) => t.id === fixture.awayTeam)!;
    const prediction = predictMatch(homeTeam, awayTeam);
    return { fixture, homeTeam, awayTeam, prediction };
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          📅 Gameweek 9 Predictions
        </h2>
        <p className="text-orange-200 text-sm">
          Model predictions based on GW1-GW8 performance data
        </p>
      </div>
      <div className="divide-y">
        {predictions.map(({ homeTeam, awayTeam, prediction }) => (
          <div key={`${homeTeam.id}-${awayTeam.id}`} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <TeamBadge team={homeTeam} size="md" />
                <span className="font-medium text-gray-800 text-sm hidden sm:inline">{homeTeam.name}</span>
                <span className="font-medium text-gray-800 text-sm sm:hidden">{homeTeam.shortName}</span>
              </div>
              <div className="bg-gray-900 text-white px-4 py-1.5 rounded-lg font-bold text-center min-w-[60px]">
                {prediction.mostLikelyScore.home} - {prediction.mostLikelyScore.away}
              </div>
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="font-medium text-gray-800 text-sm hidden sm:inline text-right">{awayTeam.name}</span>
                <span className="font-medium text-gray-800 text-sm sm:hidden text-right">{awayTeam.shortName}</span>
                <TeamBadge team={awayTeam} size="md" />
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
              <span className={prediction.homeWinProb > prediction.awayWinProb ? "text-green-600 font-semibold" : prediction.awayWinProb > prediction.homeWinProb ? "text-blue-600 font-semibold" : ""}>
                {prediction.homeWinProb > prediction.awayWinProb ? `Home (${prediction.homeWinProb.toFixed(0)}%)` : prediction.awayWinProb > prediction.homeWinProb ? `Away (${prediction.awayWinProb.toFixed(0)}%)` : "Toss-up"}
              </span>
              <span>•</span>
              <span>O2.5: {prediction.over25Prob.toFixed(0)}%</span>
              <span>•</span>
              <span>BTTS: {prediction.bttsProb.toFixed(0)}%</span>
              <span>•</span>
              <span>xG: {prediction.homeGoals.toFixed(1)}-{prediction.awayGoals.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GW8Results() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          ✅ Gameweek 8 Results
        </h2>
        <p className="text-slate-300 text-sm">Latest completed matchday</p>
      </div>
      <div className="divide-y">
        {gw8Results.map((match, idx) => {
          const homeTeam = teams.find(t => t.id === match.home)!;
          const awayTeam = teams.find(t => t.id === match.away)!;
          return (
            <div key={idx} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-2 flex-1">
                <TeamBadge team={homeTeam} size="sm" />
                <span className="text-sm text-gray-700 hidden sm:inline">{homeTeam.name}</span>
                <span className="text-sm text-gray-700 sm:hidden">{homeTeam.shortName}</span>
              </div>
              <div className={`px-3 py-1 rounded font-bold text-sm ${
                match.homeGoals > match.awayGoals ? "bg-green-100 text-green-800" :
                match.homeGoals < match.awayGoals ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {match.homeGoals} - {match.awayGoals}
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-sm text-gray-700 hidden sm:inline text-right">{awayTeam.name}</span>
                <span className="text-sm text-gray-700 sm:hidden text-right">{awayTeam.shortName}</span>
                <TeamBadge team={awayTeam} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeasonProjections() {
  const [projections, setProjections] = useState<Map<string, { avgPoints: number; titleProb: number; relegationProb: number; top4Prob: number }> | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = simulateSeason(teams, upcomingFixtures.map(f => ({ homeTeam: f.homeTeam, awayTeam: f.awayTeam })), 10000);
      setProjections(result);
      setIsSimulating(false);
    }, 100);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  if (!projections) return null;

  const sortedTeams = [...teams]
    .map(team => ({
      ...team,
      projected: projections.get(team.id)!,
    }))
    .sort((a, b) => (b.projected?.avgPoints || 0) - (a.projected?.avgPoints || 0));

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-violet-700 to-fuchsia-800 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🎯 Season Projections
        </h2>
        <p className="text-violet-200 text-sm">Monte Carlo simulation (10,000 runs) projecting final standings</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">Team</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">Current Pts</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">Proj. Final</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">Title %</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">Top 4 %</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">Releg. %</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr key={team.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index < 4 ? "bg-blue-50/30" : index >= 17 ? "bg-red-50/30" : ""}`}>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={team} size="sm" />
                    <span className="font-medium text-gray-800 hidden md:inline">{team.name}</span>
                    <span className="font-medium text-gray-800 md:hidden">{team.shortName}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-600">{team.points}</td>
                <td className="px-3 py-2 text-center font-bold text-gray-900">{team.projected.avgPoints}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`font-bold ${team.projected.titleProb > 10 ? "text-green-600" : team.projected.titleProb > 0 ? "text-yellow-600" : "text-gray-400"}`}>
                    {team.projected.titleProb}%
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`font-bold ${team.projected.top4Prob > 50 ? "text-blue-600" : team.projected.top4Prob > 10 ? "text-blue-400" : "text-gray-400"}`}>
                    {team.projected.top4Prob}%
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`font-bold ${team.projected.relegationProb > 50 ? "text-red-600" : team.projected.relegationProb > 10 ? "text-red-400" : "text-gray-400"}`}>
                    {team.projected.relegationProb}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t text-center">
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
        >
          {isSimulating ? "Simulating..." : "🔄 Re-run Simulation"}
        </button>
      </div>
    </div>
  );
}

function TeamAnalytics() {
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const team = teams.find((t) => t.id === selectedTeam)!;

  const sortedByAttack = [...teams].sort((a, b) => b.attackStrength - a.attackStrength);
  const sortedByDefense = [...teams].sort((a, b) => a.defenseStrength - b.defenseStrength);
  const attackRank = sortedByAttack.findIndex((t) => t.id === selectedTeam) + 1;
  const defenseRank = sortedByDefense.findIndex((t) => t.id === selectedTeam) + 1;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-700 to-teal-800 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          📈 Team Analytics
        </h2>
        <p className="text-cyan-200 text-sm">Performance metrics from GW1-GW8</p>
      </div>
      <div className="p-6">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:outline-none text-gray-800 font-medium mb-6"
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600 font-medium">Attack</p>
            <p className="text-2xl font-bold text-blue-800">{team.attackStrength.toFixed(2)}</p>
            <p className="text-xs text-blue-500">Rank #{attackRank}/20</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xs text-red-600 font-medium">Defense</p>
            <p className="text-2xl font-bold text-red-800">{team.defenseStrength.toFixed(2)}</p>
            <p className="text-xs text-red-500">Rank #{defenseRank}/20</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600 font-medium">Goals/Game</p>
            <p className="text-2xl font-bold text-green-800">{(team.goalsFor / team.played).toFixed(2)}</p>
            <p className="text-xs text-green-500">{team.goalsFor} total</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs text-purple-600 font-medium">Form</p>
            <p className="text-2xl font-bold text-purple-800">{team.form.reduce((s, r) => s + r, 0)}/15</p>
            <p className="text-xs text-purple-500">Last 5 games</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Attack Strength</span>
              <span className="font-bold">{team.attackStrength.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{ width: `${(team.attackStrength / 2.5) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Defense (lower = better)</span>
              <span className="font-bold">{team.defenseStrength.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full" style={{ width: `${(team.defenseStrength / 2) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Home Record (W-D-L)</span>
              <span className="font-bold">{team.homeWon}-{team.homeDrawn}-{team.homeLost}</span>
            </div>
            <div className="flex gap-1">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${(team.homeWon / team.homePlayed) * 100}%` }}></div>
              <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${(team.homeDrawn / team.homePlayed) * 100}%` }}></div>
              <div className="h-2 rounded-full bg-red-500" style={{ width: `${(team.homeLost / team.homePlayed) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Away Record (W-D-L)</span>
              <span className="font-bold">{team.awayWon}-{team.awayDrawn}-{team.awayLost}</span>
            </div>
            <div className="flex gap-1">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${(team.awayWon / team.awayPlayed) * 100}%` }}></div>
              <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${(team.awayDrawn / team.awayPlayed) * 100}%` }}></div>
              <div className="h-2 rounded-full bg-red-500" style={{ width: `${(team.awayLost / team.awayPlayed) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelInfo() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🧮 Model Methodology
        </h2>
        <p className="text-slate-300 text-sm">How predictions are calculated</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
          <div>
            <h3 className="font-semibold text-gray-800">Attack & Defense Ratings</h3>
            <p className="text-sm text-gray-600">
              Calculated from GW1-8 data. Attack = (team goals/game) ÷ league avg (1.375). Defense = (team conceded/game) ÷ league avg. Values above 1.0 = above average.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
          <div>
            <h3 className="font-semibold text-gray-800">Expected Goals (xG)</h3>
            <p className="text-sm text-gray-600">
              Home xG = Attack × Opp.Defense × League Home Avg (1.49) × Form × Home Advantage. Away xG uses league away avg (1.26) without home advantage bonus.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
          <div>
            <h3 className="font-semibold text-gray-800">Poisson Distribution</h3>
            <p className="text-sm text-gray-600">
              P(X=k) = (λ^k × e^-λ) / k! — We calculate probability of every scoreline (0-0 through 8-8) and aggregate into Win/Draw/Loss probabilities.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
          <div>
            <h3 className="font-semibold text-gray-800">Form & Context</h3>
            <p className="text-sm text-gray-600">
              Last 5 games form adjusts xG by up to ±15%. Home advantage multipliers are team-specific based on home/away splits. Monte Carlo simulations project season outcomes.
            </p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>League Averages (GW1-8):</strong> Home: 1.49 goals/game | Away: 1.26 goals/game | Total: 2.75 goals/match | 220 goals in 80 matches
          </p>
        </div>
      </div>
    </div>
  );
}

function TopPerformers() {
  const bestAttack = [...teams].sort((a, b) => b.attackStrength - a.attackStrength).slice(0, 5);
  const bestDefense = [...teams].sort((a, b) => a.defenseStrength - b.defenseStrength).slice(0, 5);
  const bestForm = [...teams].sort((a, b) => {
    const formA = a.form.reduce((s, r) => s + r, 0);
    const formB = b.form.reduce((s, r) => s + r, 0);
    return formB - formA;
  }).slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">🏆 Top Performers</h2>
        <p className="text-amber-200 text-sm">Best metrics across GW1-GW8</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-1">⚔️ Best Attack</h3>
          <div className="space-y-2">
            {bestAttack.map((team, i) => (
              <div key={team.id} className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <TeamBadge team={team} size="sm" />
                <span className="text-sm text-gray-700 flex-1">{team.shortName}</span>
                <span className="text-sm font-bold text-blue-600">{team.attackStrength.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-1">🛡️ Best Defense</h3>
          <div className="space-y-2">
            {bestDefense.map((team, i) => (
              <div key={team.id} className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <TeamBadge team={team} size="sm" />
                <span className="text-sm text-gray-700 flex-1">{team.shortName}</span>
                <span className="text-sm font-bold text-green-600">{team.defenseStrength.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-1">🔥 Best Form</h3>
          <div className="space-y-2">
            {bestForm.map((team, i) => (
              <div key={team.id} className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <TeamBadge team={team} size="sm" />
                <span className="text-sm text-gray-700 flex-1">{team.shortName}</span>
                <span className="text-sm font-bold text-purple-600">{team.form.reduce((s, r) => s + r, 0)}/15</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type Tab = "predictions" | "fpl";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("predictions");

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("predictions")}
              className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === "predictions"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ⚽ Match Predictions
            </button>
            <button
              onClick={() => setActiveTab("fpl")}
              className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
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

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {activeTab === "predictions" && <PredictionsTab />}
        {activeTab === "fpl" && <FPLTab />}
      </main>
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        <p>EPL Prediction Model 2026/27 • Poisson Distribution Engine • FPL Stats • Based on GW1-GW8 data</p>
        <p className="text-gray-500 mt-1">
          Predictions are statistical estimates. Not financial/gambling advice.
        </p>
      </footer>
    </div>
  );
}

function PredictionsTab() {
  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-3xl font-bold text-indigo-600">220</p>
          <p className="text-xs text-gray-500">Goals Scored (GW1-8)</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-3xl font-bold text-green-600">2.75</p>
          <p className="text-xs text-gray-500">Avg Goals/Match</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-3xl font-bold text-purple-600">80</p>
          <p className="text-xs text-gray-500">Matches Played</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-3xl font-bold text-orange-600">20</p>
          <p className="text-xs text-gray-500">Teams Competing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MatchPredictor />
        <TeamAnalytics />
      </div>

      <FixturesList />
      <GW8Results />

      <SeasonProjections />
      <TopPerformers />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LeagueTable />
        <ModelInfo />
      </div>
    </>
  );
}

function FPLTab() {
  return (
    <>
      <FPLStatsOverview />
      <FPLTeamBuilder />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopScorers />
        <TopAssisters />
      </div>
      <FPLLeaderboard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ValuePicks />
        <DifferentialPicks />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InFormPlayers />
        <GWPointsBreakdown />
      </div>
    </>
  );
}
