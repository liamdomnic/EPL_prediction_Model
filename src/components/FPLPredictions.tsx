import { useState, useMemo } from 'react';
import { fplPlayers, FPLPlayer } from '../data/fplData';
import { calculateAllGW9Points, PlayerGW9Stats } from '../utils/fplScoring';
import { ModelAccuracy } from './ModelAccuracy';

export function FPLPredictions() {
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');
  const [sortBy, setSortBy] = useState<'gw9' | 'season' | 'value'>('gw9');

  // Calculate GW9 points for all players using custom scoring
  const gw9StatsMap = useMemo(() => {
    return calculateAllGW9Points(fplPlayers);
  }, []);

  // Create player predictions with actual GW9 results
  const predictions = useMemo(() => {
    const results: Array<{
      player: FPLPlayer;
      gw9Stats: PlayerGW9Stats;
      predictedPoints: number;
      confidence: number;
    }> = [];

    fplPlayers.forEach(player => {
      const gw9Stats = gw9StatsMap.get(player.name);
      if (!gw9Stats) return;

      // Use actual GW9 points if player played
      const predictedPoints = gw9Stats.played ? gw9Stats.gw9Points : 0;
      
      // Confidence is 95% if player played (actual data), 0% if didn't play
      const confidence = gw9Stats.played ? 95 : 0;

      results.push({
        player,
        gw9Stats,
        predictedPoints,
        confidence
      });
    });

    return results;
  }, [gw9StatsMap]);

  // Filter and sort predictions
  const filteredPredictions = useMemo(() => {
    let filtered = positionFilter === 'ALL' 
      ? predictions 
      : predictions.filter(p => p.player.position === positionFilter);

    // Only show players who actually played in GW9
    filtered = filtered.filter(p => p.gw9Stats.played);

    // Sort based on selected criteria
    if (sortBy === 'gw9') {
      filtered.sort((a, b) => b.predictedPoints - a.predictedPoints);
    } else if (sortBy === 'season') {
      filtered.sort((a, b) => b.player.points - a.player.points);
    } else if (sortBy === 'value') {
      filtered.sort((a, b) => {
        const valueA = a.predictedPoints / a.player.cost;
        const valueB = b.predictedPoints / b.player.cost;
        return valueB - valueA;
      });
    }

    return filtered.slice(0, 20); // Top 20
  }, [predictions, positionFilter, sortBy]);

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-500';
    if (difficulty <= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty <= 3) return 'Medium';
    return 'Hard';
  };

  return (
    <div className="space-y-6">
      {/* Model Accuracy Section */}
      <ModelAccuracy />
      
      {/* Top 20 FPL Picks */}
      <div className="bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🏆 Top 20 FPL Picks for GW9</h2>
        <p className="text-sm text-gray-600 mb-6">Based on actual GW9 results with custom scoring: 6pts/goal, 4pts/assist, 6pts/clean sheet (DEF/GK), 2pts base</p>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value as any)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Positions</option>
            <option value="GK">Goalkeepers</option>
            <option value="DEF">Defenders</option>
            <option value="MID">Midfielders</option>
            <option value="FWD">Forwards</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
            <option value="gw9">GW9 Points</option>
            <option value="season">Season Form</option>
            <option value="value">Value (Points/£m)</option>
          </select>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-3">
        {filteredPredictions.map((pred, idx) => (
          <div
            key={pred.player.name}
            className={`border-2 rounded-lg p-4 transition-all hover:shadow-lg ${
              idx < 3 ? 'border-yellow-400 bg-yellow-50' :
              idx < 10 ? 'border-green-400 bg-green-50' :
              'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  idx < 3 ? 'bg-yellow-500' : idx < 10 ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-lg">{pred.player.name}</div>
                  <div className="text-sm text-gray-600">
                    {pred.player.team} • {pred.player.position} • £{pred.player.cost}m
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{pred.gw9Stats.gw9Points}</div>
                <div className="text-xs text-gray-500">GW9 pts</div>
              </div>
            </div>

            {/* GW9 Performance Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
              <div className="bg-blue-50 rounded p-2">
                <div className="text-gray-600 text-xs mb-1">⚽ Goals</div>
                <div className="font-bold text-blue-600 text-lg">{pred.gw9Stats.goals}</div>
                <div className="text-xs text-gray-500">{pred.gw9Stats.breakdown.goalPoints} pts</div>
              </div>

              <div className="bg-green-50 rounded p-2">
                <div className="text-gray-600 text-xs mb-1">🎯 Assists</div>
                <div className="font-bold text-green-600 text-lg">{pred.gw9Stats.assists}</div>
                <div className="text-xs text-gray-500">{pred.gw9Stats.breakdown.assistPoints} pts</div>
              </div>

              <div className="bg-purple-50 rounded p-2">
                <div className="text-gray-600 text-xs mb-1">🧤 Clean Sheet</div>
                <div className="font-bold text-purple-600 text-lg">{pred.gw9Stats.cleanSheet ? '✓' : '✗'}</div>
                <div className="text-xs text-gray-500">{pred.gw9Stats.breakdown.cleanSheetPoints} pts</div>
              </div>

              <div className="bg-gray-50 rounded p-2">
                <div className="text-gray-600 text-xs mb-1">📊 Base</div>
                <div className="font-bold text-gray-600 text-lg">{pred.gw9Stats.breakdown.basePoints}</div>
                <div className="text-xs text-gray-500">appearance</div>
              </div>
            </div>

            {/* Points Breakdown */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-4">
                  <span className="text-gray-600">
                    Total: <span className="font-bold text-indigo-600">{pred.gw9Stats.breakdown.total} pts</span>
                  </span>
                  <span className="text-gray-600">
                    Value: <span className="font-bold">{(pred.gw9Stats.gw9Points / pred.player.cost).toFixed(2)}</span> pts/£m
                  </span>
                </div>
                {idx < 3 && (
                  <span className="text-yellow-600 font-bold">⭐ TOP PICK</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-3">📊 GW9 FPL Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Players Played</div>
            <div className="text-2xl font-bold text-indigo-600">{predictions.filter(p => p.gw9Stats.played).length}</div>
          </div>
          <div>
            <div className="text-gray-600">Total Goals</div>
            <div className="text-2xl font-bold text-blue-600">
              {predictions.reduce((sum, p) => sum + p.gw9Stats.goals, 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Total Assists</div>
            <div className="text-2xl font-bold text-green-600">
              {predictions.reduce((sum, p) => sum + p.gw9Stats.assists, 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Clean Sheets</div>
            <div className="text-2xl font-bold text-purple-600">
              {predictions.filter(p => p.gw9Stats.cleanSheet).length}
            </div>
          </div>
        </div>
      </div>

      {/* Scoring System */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <h4 className="font-bold text-gray-800 mb-2">📈 GW9 Custom Scoring System</h4>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Goal:</strong> 6 points (any position)</li>
          <li>• <strong>Assist:</strong> 4 points (any position)</li>
          <li>• <strong>Clean Sheet:</strong> 6 points (DEF/GK only)</li>
          <li>• <strong>Base Appearance:</strong> 2 points (if played, no other points)</li>
          <li>• <strong>Total:</strong> Sum of all applicable points</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          Note: This is a custom scoring system for GW9 analysis. Official FPL scoring differs.
        </p>
      </div>
      </div>
    </div>
  );
}
