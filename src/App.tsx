import { useState } from 'react';
import { teams } from './data/matchData';
import { predictMatch, MatchPrediction } from './utils/predictionEngine';
import { getLeagueTable, getTopXgTeams, getBestDefenses, getBestShootingTeams } from './utils/teamStats';
import { TeamRatings } from './components/TeamRatings';
import { GW9Predictions } from './components/GW9Predictions';
import { FPLPredictions } from './components/FPLPredictions';
import { ModelAccuracy } from './components/ModelAccuracy';

function App() {
  const [activeTab, setActiveTab] = useState<'predict' | 'table' | 'stats' | 'ratings' | 'gw9' | 'fpl'>('predict');
  const [homeTeam, setHomeTeam] = useState('Chelsea');
  const [awayTeam, setAwayTeam] = useState('Man United');
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);

  const handlePredict = () => {
    if (homeTeam === awayTeam) {
      alert('Please select different teams');
      return;
    }
    const result = predictMatch(homeTeam, awayTeam);
    setPrediction(result);
  };

  const leagueTable = getLeagueTable();
  const topXgTeams = getTopXgTeams(5);
  const bestDefenses = getBestDefenses(5);
  const bestShooting = getBestShootingTeams(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">EPL Match Predictor</h1>
          <p className="text-center text-indigo-100 mt-2">
            Advanced xG Model • Poisson Distribution • GW1-8 Data
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('predict')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'predict'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🎯 Match Predictor
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'table'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📊 League Table
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'stats'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📈 Team Statistics
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'ratings'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⚔️ Team Ratings
          </button>
          <button
            onClick={() => setActiveTab('gw9')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'gw9'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📅 GW9 Fixtures
          </button>
          <button
            onClick={() => setActiveTab('fpl')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'fpl'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🏆 Fantasy Predictions
          </button>
        </div>

        {/* Model Accuracy Tracker */}
        <ModelAccuracy />

        {/* Match Predictor Tab */}
        {activeTab === 'predict' && (
          <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Predict Match Outcome</h2>
            
            {/* Team Selection */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Home Team
                </label>
                <select
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-center">
                <button
                  onClick={handlePredict}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  🎯 Predict Match
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Away Team
                </label>
                <select
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prediction Results */}
            {prediction && (
              <div className="border-t-2 border-gray-200 pt-6 space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {prediction.homeTeam} vs {prediction.awayTeam}
                </h3>

                {/* Expected Goals (xG) */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">{prediction.homeTeam}</div>
                    <div className="text-4xl font-bold text-blue-600">
                      {prediction.homeExpectedGoals}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Expected Goals (xG)</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">{prediction.awayTeam}</div>
                    <div className="text-4xl font-bold text-purple-600">
                      {prediction.awayExpectedGoals}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Expected Goals (xG)</div>
                  </div>
                </div>

                {/* Match Outcome Probabilities */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Match Outcome Probabilities</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-blue-600">{prediction.homeTeam} Win</span>
                        <span className="font-bold">{prediction.homeWinProb}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${prediction.homeWinProb}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-600">Draw</span>
                        <span className="font-bold">{prediction.drawProb}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-gray-400 to-gray-500 h-3 rounded-full transition-all"
                          style={{ width: `${prediction.drawProb}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-purple-600">{prediction.awayTeam} Win</span>
                        <span className="font-bold">{prediction.awayWinProb}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${prediction.awayWinProb}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Goals Markets */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Over 2.5 Goals</div>
                    <div className="text-3xl font-bold text-green-600">
                      {prediction.over25Prob}%
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Both Teams to Score</div>
                    <div className="text-3xl font-bold text-orange-600">
                      {prediction.bttsYesProb}%
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Total xG</div>
                    <div className="text-3xl font-bold text-indigo-600">
                      {prediction.totalExpectedGoals}
                    </div>
                  </div>
                </div>

                {/* Most Likely Scorelines */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Most Likely Scorelines</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {prediction.topScorelines.map((scoreline, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">#{idx + 1}</div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {scoreline.home}-{scoreline.away}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {scoreline.prob}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value Bet Detection */}
                {prediction.valueBet !== 'none' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">💰</div>
                      <div>
                        <div className="text-lg font-bold text-green-800">Value Bet Detected!</div>
                        <div className="text-sm text-green-700">
                          Model suggests {prediction.valueBet === 'home' ? prediction.homeTeam : prediction.valueBet === 'away' ? prediction.awayTeam : 'Draw'} is undervalued by the market
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confidence Meter */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Prediction Confidence</span>
                    <span className="text-2xl font-bold text-indigo-600">{prediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        prediction.confidence >= 70
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : prediction.confidence >= 50
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* League Table Tab */}
        {activeTab === 'table' && (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">League Table (GW1-8)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="px-4 py-3 text-left">Pos</th>
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-center">P</th>
                    <th className="px-4 py-3 text-center">W</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">L</th>
                    <th className="px-4 py-3 text-center">GF</th>
                    <th className="px-4 py-3 text-center">GA</th>
                    <th className="px-4 py-3 text-center">GD</th>
                    <th className="px-4 py-3 text-center">xG</th>
                    <th className="px-4 py-3 text-center">xGA</th>
                    <th className="px-4 py-3 text-center">Pts</th>
                    <th className="px-4 py-3 text-center">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {leagueTable.map((team, index) => (
                    <tr
                      key={team.name}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index < 4 ? 'bg-blue-50' : index >= 17 ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold">{index + 1}</td>
                      <td className="px-4 py-3 font-semibold">{team.name}</td>
                      <td className="px-4 py-3 text-center">{team.played}</td>
                      <td className="px-4 py-3 text-center text-green-600 font-semibold">{team.wins}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{team.draws}</td>
                      <td className="px-4 py-3 text-center text-red-600">{team.losses}</td>
                      <td className="px-4 py-3 text-center">{team.goalsFor}</td>
                      <td className="px-4 py-3 text-center">{team.goalsAgainst}</td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}
                        {team.goalsFor - team.goalsAgainst}
                      </td>
                      <td className="px-4 py-3 text-center text-blue-600 font-semibold">{team.xgFor}</td>
                      <td className="px-4 py-3 text-center text-red-600">{team.xgAgainst}</td>
                      <td className="px-4 py-3 text-center font-bold text-indigo-600">{team.points}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-1 justify-center">
                          {team.form.map((result, idx) => (
                            <span
                              key={idx}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                result === 'W'
                                  ? 'bg-green-500'
                                  : result === 'D'
                                  ? 'bg-gray-400'
                                  : 'bg-red-500'
                              }`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Team Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Top xG Teams */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Top 5 Attacking Teams (xG per game)</h2>
              <div className="space-y-3">
                {topXgTeams.map((team, idx) => (
                  <div key={team.name} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{team.name}</div>
                        <div className="text-sm text-gray-600">{team.shotsPerGame} shots/game • {team.shotsOnTargetPerGame} on target/game</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{team.xgPerGame}</div>
                      <div className="text-xs text-gray-500">xG per game</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Defenses */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🛡️ Top 5 Defenses (xG Against per game)</h2>
              <div className="space-y-3">
                {bestDefenses.map((team, idx) => (
                  <div key={team.name} className="flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-green-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{team.name}</div>
                        <div className="text-sm text-gray-600">{team.goalsAgainst} goals conceded • {team.yellowCards} yellows</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{team.xgAgainstPerGame}</div>
                      <div className="text-xs text-gray-500">xGA per game</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Shooting Teams */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Top 5 Shooting Teams (Shots on Target per game)</h2>
              <div className="space-y-3">
                {bestShooting.map((team, idx) => (
                  <div key={team.name} className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-purple-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{team.name}</div>
                        <div className="text-sm text-gray-600">{team.shotsPerGame} shots/game • {team.shootingAccuracy}% accuracy</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">{team.shotsOnTargetPerGame}</div>
                      <div className="text-xs text-gray-500">SoT per game</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Ratings Tab */}
        {activeTab === 'ratings' && (
          <TeamRatings />
        )}

        {/* GW9 Predictions Tab */}
        {activeTab === 'gw9' && (
          <GW9Predictions />
        )}

        {/* FPL Predictions Tab */}
        {activeTab === 'fpl' && (
          <FPLPredictions />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-gray-800 text-gray-300 text-center">
        <p className="text-sm">
          EPL Match Predictor • Advanced xG Model • Based on GW1-8 2026/27 season data
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Uses Expected Goals (xG), shots data, and Poisson distribution for predictions
        </p>
      </footer>
    </div>
  );
}

export default App;
