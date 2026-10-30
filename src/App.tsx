import { useState } from "react";
import { teams, upcomingFixtures } from "./data/teams";
import { predictMatch, MatchPrediction } from "./utils/predictionEngine";

function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white py-6 px-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">⚽</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              EPL Prediction Model
            </h1>
            <p className="text-purple-200 text-sm">
              Statistical Match Predictor • Poisson Distribution Engine
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
          <span className="text-xs text-purple-200">Season 2024/25</span>
          <span className="text-white font-bold">Matchweek 29</span>
        </div>
      </div>
    </header>
  );
}

function TeamBadge({ team, size = "md" }: { team: typeof teams[0]; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6 text-[8px]",
    md: "w-8 h-8 text-[10px]",
    lg: "w-12 h-12 text-xs",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white/20`}
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
        <p className="text-indigo-200 text-sm">Current standings after 28 matchweeks</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">#</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">Team</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">P</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">W</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">D</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">L</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">GF</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">GA</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">GD</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">Pts</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600">Form</th>
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
                <td className="px-3 py-2.5 font-bold text-gray-500">{index + 1}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={team} size="sm" />
                    <span className="font-medium text-gray-800 hidden sm:inline">
                      {team.name}
                    </span>
                    <span className="font-medium text-gray-800 sm:hidden">
                      {team.shortName}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center text-gray-600">{team.played}</td>
                <td className="px-3 py-2.5 text-center text-gray-600">{team.won}</td>
                <td className="px-3 py-2.5 text-center text-gray-600">{team.drawn}</td>
                <td className="px-3 py-2.5 text-center text-gray-600">{team.lost}</td>
                <td className="px-3 py-2.5 text-center text-gray-600">{team.goalsFor}</td>
                <td className="px-3 py-2.5 text-center text-gray-600">{team.goalsAgainst}</td>
                <td className="px-3 py-2.5 text-center font-medium text-gray-700">
                  {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}
                  {team.goalsFor - team.goalsAgainst}
                </td>
                <td className="px-3 py-2.5 text-center font-bold text-gray-900">{team.points}</td>
                <td className="px-3 py-2.5">
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
          Select teams to generate statistical predictions
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Home Team */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Home Team
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

          {/* VS */}
          <div className="text-center">
            <button
              onClick={handlePredict}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ⚡ Predict
            </button>
            <p className="text-gray-400 text-sm mt-2">VS</p>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Away Team
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

        {/* Prediction Results */}
        {prediction && (
          <div className="mt-8 space-y-6">
            {/* Score Prediction */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-center text-white">
              <p className="text-gray-400 text-sm mb-2">Predicted Score</p>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <TeamBadge team={prediction.homeTeam} size="lg" />
                  <p className="text-xs mt-1 text-gray-300">{prediction.homeTeam.shortName}</p>
                </div>
                <div className="text-4xl font-bold">
                  {Math.round(prediction.homeGoals)} - {Math.round(prediction.awayGoals)}
                </div>
                <div className="text-center">
                  <TeamBadge team={prediction.awayTeam} size="lg" />
                  <p className="text-xs mt-1 text-gray-300">{prediction.awayTeam.shortName}</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                Expected Goals: {prediction.homeGoals} - {prediction.awayGoals}
              </p>
            </div>

            {/* Probabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Win Probabilities */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-3">Match Outcome</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Home Win ({prediction.homeTeam.shortName})</span>
                      <span className="font-bold text-green-600">{prediction.homeWinProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${prediction.homeWinProb}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Draw</span>
                      <span className="font-bold text-yellow-600">{prediction.drawProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full transition-all"
                        style={{ width: `${prediction.drawProb}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Away Win ({prediction.awayTeam.shortName})</span>
                      <span className="font-bold text-blue-600">{prediction.awayWinProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${prediction.awayWinProb}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Markets */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-3">Other Markets</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Over 2.5 Goals</span>
                      <span className="font-bold text-purple-600">{prediction.over25Prob.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${prediction.over25Prob}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Both Teams To Score</span>
                      <span className="font-bold text-pink-600">{prediction.bttsProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-pink-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${prediction.bttsProb}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Model Confidence</span>
                      <span className="font-bold text-indigo-600">{prediction.confidence.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
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
          📅 Matchweek 29 Predictions
        </h2>
        <p className="text-orange-200 text-sm">
          AI-predicted scores for upcoming fixtures
        </p>
      </div>
      <div className="divide-y">
        {predictions.map(({ homeTeam, awayTeam, prediction }) => (
          <div
            key={`${homeTeam.id}-${awayTeam.id}`}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <TeamBadge team={homeTeam} size="md" />
                <span className="font-medium text-gray-800 text-sm hidden sm:inline">
                  {homeTeam.name}
                </span>
                <span className="font-medium text-gray-800 text-sm sm:hidden">
                  {homeTeam.shortName}
                </span>
              </div>
              <div className="bg-gray-900 text-white px-4 py-1.5 rounded-lg font-bold text-center min-w-[60px]">
                {Math.round(prediction.homeGoals)} - {Math.round(prediction.awayGoals)}
              </div>
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="font-medium text-gray-800 text-sm hidden sm:inline text-right">
                  {awayTeam.name}
                </span>
                <span className="font-medium text-gray-800 text-sm sm:hidden text-right">
                  {awayTeam.shortName}
                </span>
                <TeamBadge team={awayTeam} size="md" />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
              <span>
                Win: {prediction.homeWinProb > prediction.awayWinProb ? "Home" : prediction.awayWinProb > prediction.homeWinProb ? "Away" : "Toss-up"}
              </span>
              <span>•</span>
              <span>O2.5: {prediction.over25Prob.toFixed(0)}%</span>
              <span>•</span>
              <span>BTTS: {prediction.bttsProb.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelInfo() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🧮 How The Model Works
        </h2>
        <p className="text-slate-300 text-sm">Statistical methodology explained</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            1
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Attack & Defense Ratings</h3>
            <p className="text-sm text-gray-600">
              Each team has an attack strength (goals scored relative to league average) and defense strength (goals conceded relative to league average). Values above 1.0 are above average.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            2
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Expected Goals Calculation</h3>
            <p className="text-sm text-gray-600">
              Expected goals = Attack Strength × Opposition Defense Strength × League Average × Form Factor × Home Advantage. This gives us the λ (lambda) parameter for the Poisson distribution.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            3
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Poisson Distribution</h3>
            <p className="text-sm text-gray-600">
              Using the Poisson distribution with calculated λ values, we determine the probability of each possible scoreline (0-0, 1-0, 2-1, etc.) and aggregate them into win/draw/loss probabilities.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            4
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Form & Context Factors</h3>
            <p className="text-sm text-gray-600">
              Recent form (last 5 games) adjusts expected goals by up to ±20%. Home advantage provides an additional boost. These factors make predictions more responsive to current team performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamComparison() {
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
        <p className="text-cyan-200 text-sm">Deep-dive into team statistics</p>
      </div>
      <div className="p-6">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:outline-none text-gray-800 font-medium mb-6"
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600 font-medium">Attack Rating</p>
            <p className="text-2xl font-bold text-blue-800">{team.attackStrength}</p>
            <p className="text-xs text-blue-500">Rank: #{attackRank}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xs text-red-600 font-medium">Defense Rating</p>
            <p className="text-2xl font-bold text-red-800">{team.defenseStrength}</p>
            <p className="text-xs text-red-500">Rank: #{defenseRank}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600 font-medium">Home Advantage</p>
            <p className="text-2xl font-bold text-green-800">{team.homeAdvantage}</p>
            <p className="text-xs text-green-500">× multiplier</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs text-purple-600 font-medium">Form Points</p>
            <p className="text-2xl font-bold text-purple-800">
              {team.form.reduce((s, r) => s + r, 0)}/15
            </p>
            <p className="text-xs text-purple-500">Last 5 games</p>
          </div>
        </div>

        {/* Visual bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Attack Strength</span>
              <span className="font-bold">{team.attackStrength.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                style={{ width: `${(team.attackStrength / 2) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Defense (lower is better)</span>
              <span className="font-bold">{team.defenseStrength.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full"
                style={{ width: `${(team.defenseStrength / 2) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Goals Per Game</span>
              <span className="font-bold">{(team.goalsFor / team.played).toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                style={{ width: `${(team.goalsFor / team.played / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Goals Conceded Per Game</span>
              <span className="font-bold">{(team.goalsAgainst / team.played).toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full"
                style={{ width: `${(team.goalsAgainst / team.played / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MatchPredictor />
          <TeamComparison />
        </div>
        <FixturesList />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LeagueTable />
          <ModelInfo />
        </div>
      </main>
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        <p>EPL Prediction Model • Poisson Distribution Engine • Statistical Analysis</p>
        <p className="text-gray-500 mt-1">
          Predictions are based on statistical models and should not be used for gambling.
        </p>
      </footer>
    </div>
  );
}
