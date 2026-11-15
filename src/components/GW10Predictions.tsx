import { gw10Fixtures } from '../data/matchData';
import { predictMatch } from '../utils/predictionEngine';

export function GW10Predictions() {
  const predictions = gw10Fixtures.map(fixture => {
    const prediction = predictMatch(fixture.homeTeam, fixture.awayTeam);
    return { fixture, prediction };
  });

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Gameweek 10 Predictions</h2>
      
      <div className="space-y-4">
        {predictions.map(({ fixture, prediction }, idx) => {
          const homeWinColor = prediction.homeWinProb > prediction.awayWinProb 
            ? 'border-blue-500 bg-blue-50' 
            : prediction.awayWinProb > prediction.homeWinProb 
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-400 bg-gray-50';

          return (
            <div key={idx} className={`border-2 rounded-lg p-4 ${homeWinColor}`}>
              {/* Match Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{fixture.homeTeam}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="font-bold text-lg">{fixture.awayTeam}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Predicted Score</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {prediction.mostLikelyScore.home} - {prediction.mostLikelyScore.away}
                  </div>
                </div>
              </div>

              {/* Probabilities */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Home Win</div>
                  <div className="text-xl font-bold text-blue-600">{prediction.homeWinProb}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${prediction.homeWinProb}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Draw</div>
                  <div className="text-xl font-bold text-gray-600">{prediction.drawProb}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gray-500 h-2 rounded-full" 
                      style={{ width: `${prediction.drawProb}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Away Win</div>
                  <div className="text-xl font-bold text-purple-600">{prediction.awayWinProb}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${prediction.awayWinProb}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Home xG</div>
                  <div className="font-bold text-sm">{prediction.homeExpectedGoals}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Away xG</div>
                  <div className="font-bold text-sm">{prediction.awayExpectedGoals}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Over 2.5</div>
                  <div className="font-bold text-sm text-green-600">{prediction.over25Prob}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">BTTS</div>
                  <div className="font-bold text-sm text-orange-600">{prediction.bttsYesProb}%</div>
                </div>
              </div>

              {/* Value Bet Indicator */}
              {prediction.valueBet !== 'none' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-2xl">💰</span>
                    <span className="font-semibold text-green-700">
                      Value Bet: {prediction.valueBet === 'home' ? fixture.homeTeam : prediction.valueBet === 'away' ? fixture.awayTeam : 'Draw'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">📊 GW10 Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Matches</div>
            <div className="text-2xl font-bold text-indigo-600">{predictions.length}</div>
          </div>
          <div>
            <div className="text-gray-600">Avg Home xG</div>
            <div className="text-2xl font-bold text-blue-600">
              {(predictions.reduce((sum, p) => sum + p.prediction.homeExpectedGoals, 0) / predictions.length).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Avg Away xG</div>
            <div className="text-2xl font-bold text-purple-600">
              {(predictions.reduce((sum, p) => sum + p.prediction.awayExpectedGoals, 0) / predictions.length).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Value Bets</div>
            <div className="text-2xl font-bold text-green-600">
              {predictions.filter(p => p.prediction.valueBet !== 'none').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
