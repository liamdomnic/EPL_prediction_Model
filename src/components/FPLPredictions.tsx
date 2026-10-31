import { useState, useMemo } from 'react';
import { fplPlayers, FPLPlayer } from '../data/fplData';
import { gw9Fixtures } from '../data/matchData';
import { predictMatch } from '../utils/predictionEngine';

interface PlayerPrediction {
  player: FPLPlayer;
  fixture: { homeTeam: string; awayTeam: string };
  isHome: boolean;
  predictedPoints: number;
  fixtureDifficulty: number; // 1-5 scale
  confidence: number;
  factors: {
    formFactor: number;
    fixtureFactor: number;
    positionFactor: number;
    teamStrengthFactor: number;
  };
}

export function FPLPredictions() {
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');
  const [sortBy, setSortBy] = useState<'predicted' | 'form' | 'value'>('predicted');

  const predictions = useMemo(() => {
    const results: PlayerPrediction[] = [];

    // Get predictions for all GW9 fixtures
    const fixturePredictions = gw9Fixtures.map(fixture => ({
      fixture,
      prediction: predictMatch(fixture.homeTeam, fixture.awayTeam)
    }));

    // Analyze each player
    fplPlayers.forEach(player => {
      // Find which GW9 fixture this player is in
      const playerFixture = fixturePredictions.find(
        fp => fp.fixture.homeTeam === player.team || fp.fixture.awayTeam === player.team
      );

      if (!playerFixture) return; // Player's team not in GW9

      const isHome = playerFixture.fixture.homeTeam === player.team;
      const opponentTeam = isHome ? playerFixture.fixture.awayTeam : playerFixture.fixture.homeTeam;

      // Calculate form factor (points per game, normalized)
      const pointsPerGame = player.points / 8; // 8 games played
      const formFactor = Math.min(2.0, pointsPerGame / 5); // Normalize to 0-2 scale

      // Calculate fixture difficulty (1-5 scale, 5 = hardest)
      let fixtureDifficulty = 3; // Default medium
      if (isHome) {
        // Home team
        if (playerFixture.prediction.homeWinProb > 60) fixtureDifficulty = 1; // Easy
        else if (playerFixture.prediction.homeWinProb > 45) fixtureDifficulty = 2;
        else if (playerFixture.prediction.homeWinProb > 35) fixtureDifficulty = 3;
        else if (playerFixture.prediction.homeWinProb > 25) fixtureDifficulty = 4;
        else fixtureDifficulty = 5; // Hard
      } else {
        // Away team
        if (playerFixture.prediction.awayWinProb > 60) fixtureDifficulty = 1; // Easy
        else if (playerFixture.prediction.awayWinProb > 45) fixtureDifficulty = 2;
        else if (playerFixture.prediction.awayWinProb > 35) fixtureDifficulty = 3;
        else if (playerFixture.prediction.awayWinProb > 25) fixtureDifficulty = 4;
        else fixtureDifficulty = 5; // Hard
      }

      // Fixture factor (easier fixture = higher factor)
      const fixtureFactor = (6 - fixtureDifficulty) / 5; // 0.2 to 1.0

      // Position factor (attackers score more than defenders)
      let positionFactor = 1.0;
      if (player.position === 'FWD') positionFactor = 1.3;
      else if (player.position === 'MID') positionFactor = 1.2;
      else if (player.position === 'DEF') positionFactor = 0.9;
      else if (player.position === 'GK') positionFactor = 0.8;

      // Team strength factor (based on xG)
      const teamXG = isHome 
        ? playerFixture.prediction.homeExpectedGoals 
        : playerFixture.prediction.awayExpectedGoals;
      const teamStrengthFactor = Math.min(1.5, teamXG / 1.5); // Normalize

      // Calculate predicted points
      // Base: current form + fixture difficulty + position + team strength
      let predictedPoints = pointsPerGame;
      
      // Apply multipliers
      predictedPoints *= fixtureFactor;
      predictedPoints *= positionFactor;
      predictedPoints *= teamStrengthFactor;

      // Home advantage bonus
      if (isHome) {
        predictedPoints *= 1.1;
      }

      // Position-specific adjustments
      if (player.position === 'GK' || player.position === 'DEF') {
        // Defenders and keepers benefit from clean sheets
        const cleanSheetProb = isHome 
          ? playerFixture.prediction.homeWinProb * 0.3 // Rough estimate
          : playerFixture.prediction.awayWinProb * 0.3;
        predictedPoints += cleanSheetProb * 0.1; // Small bonus
      }

      // Confidence based on data quality
      const confidence = Math.min(95, Math.max(40, 
        (player.points > 30 ? 80 : 60) + 
        (fixtureDifficulty <= 2 ? 10 : 0) +
        (player.cost > 7 ? 5 : 0)
      ));

      results.push({
        player,
        fixture: playerFixture.fixture,
        isHome,
        predictedPoints: Math.round(predictedPoints * 10) / 10,
        fixtureDifficulty,
        confidence,
        factors: {
          formFactor,
          fixtureFactor,
          positionFactor,
          teamStrengthFactor
        }
      });
    });

    return results;
  }, []);

  // Filter and sort predictions
  const filteredPredictions = useMemo(() => {
    let filtered = positionFilter === 'ALL' 
      ? predictions 
      : predictions.filter(p => p.player.position === positionFilter);

    // Sort based on selected criteria
    if (sortBy === 'predicted') {
      filtered.sort((a, b) => b.predictedPoints - a.predictedPoints);
    } else if (sortBy === 'form') {
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
    <div className="bg-white rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Top 20 FPL Picks for GW9</h2>
      
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
            <option value="predicted">Predicted Points</option>
            <option value="form">Current Form</option>
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
                <div className="text-2xl font-bold text-indigo-600">{pred.predictedPoints}</div>
                <div className="text-xs text-gray-500">predicted pts</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Fixture</div>
                <div className="font-semibold">
                  {pred.isHome ? pred.player.team : pred.fixture.awayTeam}
                  {' vs '}
                  {pred.isHome ? pred.fixture.awayTeam : pred.player.team}
                </div>
                <div className="text-xs text-gray-500">
                  {pred.isHome ? '🏠 Home' : '✈️ Away'}
                </div>
              </div>

              <div>
                <div className="text-gray-600 mb-1">Difficulty</div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getDifficultyColor(pred.fixtureDifficulty)}`}></div>
                  <span className="font-semibold">{getDifficultyText(pred.fixtureDifficulty)}</span>
                </div>
                <div className="text-xs text-gray-500">{pred.fixtureDifficulty}/5</div>
              </div>

              <div>
                <div className="text-gray-600 mb-1">Current Form</div>
                <div className="font-semibold text-blue-600">{pred.player.points} pts</div>
                <div className="text-xs text-gray-500">{(pred.player.points / 8).toFixed(1)}/game</div>
              </div>

              <div>
                <div className="text-gray-600 mb-1">Confidence</div>
                <div className="font-semibold text-green-600">{pred.confidence}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${pred.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Value indicator */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
              <div className="flex gap-4">
                <span className="text-gray-600">
                  Value: <span className="font-bold">{(pred.predictedPoints / pred.player.cost).toFixed(2)}</span> pts/£m
                </span>
                <span className="text-gray-600">
                  Form Factor: <span className="font-bold">{pred.factors.formFactor.toFixed(2)}</span>
                </span>
              </div>
              {idx < 3 && (
                <span className="text-yellow-600 font-bold">⭐ TOP PICK</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-3">📊 GW9 FPL Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Players Analyzed</div>
            <div className="text-2xl font-bold text-indigo-600">{predictions.length}</div>
          </div>
          <div>
            <div className="text-gray-600">Avg Predicted Points</div>
            <div className="text-2xl font-bold text-blue-600">
              {(predictions.reduce((sum, p) => sum + p.predictedPoints, 0) / predictions.length).toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Easy Fixtures</div>
            <div className="text-2xl font-bold text-green-600">
              {predictions.filter(p => p.fixtureDifficulty <= 2).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">High Confidence</div>
            <div className="text-2xl font-bold text-purple-600">
              {predictions.filter(p => p.confidence >= 80).length}
            </div>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <h4 className="font-bold text-gray-800 mb-2">📈 Prediction Methodology</h4>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Form Factor:</strong> Current season points per game (normalized)</li>
          <li>• <strong>Fixture Difficulty:</strong> Based on win probability from xG model (1-5 scale)</li>
          <li>• <strong>Position Factor:</strong> Attackers weighted higher than defenders</li>
          <li>• <strong>Team Strength:</strong> Based on expected goals for the fixture</li>
          <li>• <strong>Home Advantage:</strong> 10% bonus for home fixtures</li>
          <li>• <strong>Clean Sheet Bonus:</strong> Small bonus for defenders/keepers in favorable fixtures</li>
        </ul>
      </div>
    </div>
  );
}
