import { predictMatch } from '../utils/predictionEngine';
import { gw9Results } from '../data/matchData';

export function ModelAccuracy() {
  // Analyze predictions vs actual results
  const analysis = gw9Results.map(result => {
    const prediction = predictMatch(result.homeTeam, result.awayTeam);
    
    // Determine predicted outcome
    let predictedOutcome: 'H' | 'D' | 'A';
    if (prediction.homeWinProb > prediction.drawProb && prediction.homeWinProb > prediction.awayWinProb) {
      predictedOutcome = 'H';
    } else if (prediction.drawProb > prediction.homeWinProb && prediction.drawProb > prediction.awayWinProb) {
      predictedOutcome = 'D';
    } else {
      predictedOutcome = 'A';
    }
    
    // Check if prediction was correct
    const correct = predictedOutcome === result.result;
    
    // Calculate confidence for the predicted outcome
    let confidence = 0;
    if (predictedOutcome === 'H') confidence = prediction.homeWinProb;
    else if (predictedOutcome === 'D') confidence = prediction.drawProb;
    else confidence = prediction.awayWinProb;
    
    return {
      fixture: `${result.homeTeam} vs ${result.awayTeam}`,
      actualScore: `${result.homeGoals}-${result.awayGoals}`,
      actualResult: result.result,
      predictedOutcome,
      prediction: {
        homeWin: prediction.homeWinProb,
        draw: prediction.drawProb,
        awayWin: prediction.awayWinProb,
        homeXG: prediction.homeExpectedGoals,
        awayXG: prediction.awayExpectedGoals,
        mostLikelyScore: `${prediction.mostLikelyScore.home}-${prediction.mostLikelyScore.away}`
      },
      correct,
      confidence
    };
  });
  
  // Calculate overall accuracy
  const totalPredictions = analysis.length;
  const correctPredictions = analysis.filter(a => a.correct).length;
  const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
  
  // Calculate average confidence
  const avgConfidence = totalPredictions > 0 
    ? analysis.reduce((sum, a) => sum + a.confidence, 0) / totalPredictions 
    : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🎯 Model Accuracy Tracker</h2>
        <div className="text-sm text-gray-500">GW9 Predictions vs Actual Results</div>
      </div>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Predictions</div>
          <div className="text-3xl font-bold text-blue-600">{totalPredictions}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Correct Predictions</div>
          <div className="text-3xl font-bold text-green-600">{correctPredictions}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Accuracy Rate</div>
          <div className="text-3xl font-bold text-purple-600">{accuracy.toFixed(1)}%</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Confidence</div>
          <div className="text-3xl font-bold text-orange-600">{avgConfidence.toFixed(1)}%</div>
        </div>
      </div>
      
      {/* Detailed Analysis */}
      <div className="space-y-4">
        {analysis.map((item, idx) => (
          <div 
            key={idx} 
            className={`border-2 rounded-lg p-4 ${
              item.correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${item.correct ? '✅' : '❌'}`}>
                  {item.correct ? '✅' : '❌'}
                </div>
                <div>
                  <div className="font-bold text-lg">{item.fixture}</div>
                  <div className="text-sm text-gray-600">
                    Actual: {item.actualScore} ({item.actualResult === 'H' ? 'Home Win' : item.actualResult === 'D' ? 'Draw' : 'Away Win'})
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Predicted</div>
                <div className={`font-bold text-lg ${
                  item.predictedOutcome === 'H' ? 'text-blue-600' :
                  item.predictedOutcome === 'D' ? 'text-gray-600' :
                  'text-purple-600'
                }`}>
                  {item.predictedOutcome === 'H' ? 'Home Win' : 
                   item.predictedOutcome === 'D' ? 'Draw' : 'Away Win'}
                </div>
              </div>
            </div>
            
            {/* Prediction Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Home Win</div>
                <div className="font-bold text-blue-600">{item.prediction.homeWin.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Draw</div>
                <div className="font-bold text-gray-600">{item.prediction.draw.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Away Win</div>
                <div className="font-bold text-purple-600">{item.prediction.awayWin.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Confidence</div>
                <div className="font-bold text-orange-600">{item.confidence.toFixed(1)}%</div>
              </div>
            </div>
            
            {/* xG and Score Prediction */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <span className="text-gray-600">
                  xG: <span className="font-bold">{item.prediction.homeXG}</span> - <span className="font-bold">{item.prediction.awayXG}</span>
                </span>
                <span className="text-gray-600">
                  Predicted Score: <span className="font-bold">{item.prediction.mostLikelyScore}</span>
                </span>
              </div>
              <div className={`font-bold ${item.correct ? 'text-green-600' : 'text-red-600'}`}>
                {item.correct ? '✓ CORRECT' : '✗ INCORRECT'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Model Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">📊 Model Insights</h3>
        <div className="text-sm text-gray-700 space-y-1">
          {accuracy >= 70 && (
            <p className="text-green-700">✓ Model performing well with {accuracy.toFixed(1)}% accuracy</p>
          )}
          {accuracy >= 50 && accuracy < 70 && (
            <p className="text-yellow-700">⚠ Model showing moderate performance at {accuracy.toFixed(1)}% accuracy</p>
          )}
          {accuracy < 50 && (
            <p className="text-red-700">⚠ Model accuracy below 50% - may need calibration</p>
          )}
          {avgConfidence > 70 && (
            <p className="text-blue-700">✓ High confidence predictions (avg {avgConfidence.toFixed(1)}%)</p>
          )}
          <p className="text-gray-600 mt-2">
            Note: Accuracy will improve as more match data is collected. Current sample size: {totalPredictions} matches.
          </p>
        </div>
      </div>
    </div>
  );
}
