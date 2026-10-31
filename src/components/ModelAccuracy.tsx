import { useState, useEffect } from 'react';
import { actualResults, PredictionAccuracy } from '../data/modelAccuracy';
import { predictMatch } from '../utils/predictionEngine';

export function ModelAccuracy() {
  const [accuracy, setAccuracy] = useState<PredictionAccuracy>({
    totalPredictions: 0,
    correctPredictions: 0,
    accuracy: 0,
    homeWinCorrect: 0,
    homeWinTotal: 0,
    drawCorrect: 0,
    drawTotal: 0,
    awayWinCorrect: 0,
    awayWinTotal: 0
  });

  const [matchDetails, setMatchDetails] = useState<any[]>([]);

  useEffect(() => {
    // Calculate accuracy for all actual results
    const acc: PredictionAccuracy = {
      totalPredictions: 0,
      correctPredictions: 0,
      accuracy: 0,
      homeWinCorrect: 0,
      homeWinTotal: 0,
      drawCorrect: 0,
      drawTotal: 0,
      awayWinCorrect: 0,
      awayWinTotal: 0
    };

    const details: any[] = [];

    actualResults.forEach(actual => {
      const prediction = predictMatch(actual.homeTeam, actual.awayTeam);
      
      // Determine what the model predicted
      let predictedResult: 'H' | 'D' | 'A';
      let predictedResultText: string;
      let predictedProb: number;
      
      if (prediction.homeWinProb > prediction.drawProb && prediction.homeWinProb > prediction.awayWinProb) {
        predictedResult = 'H';
        predictedResultText = 'Home Win';
        predictedProb = prediction.homeWinProb;
        acc.homeWinTotal++;
      } else if (prediction.drawProb > prediction.homeWinProb && prediction.drawProb > prediction.awayWinProb) {
        predictedResult = 'D';
        predictedResultText = 'Draw';
        predictedProb = prediction.drawProb;
        acc.drawTotal++;
      } else {
        predictedResult = 'A';
        predictedResultText = 'Away Win';
        predictedProb = prediction.awayWinProb;
        acc.awayWinTotal++;
      }

      acc.totalPredictions++;

      // Check if prediction was correct
      const wasCorrect = predictedResult === actual.result;
      if (wasCorrect) {
        acc.correctPredictions++;
        
        if (actual.result === 'H') acc.homeWinCorrect++;
        else if (actual.result === 'D') acc.drawCorrect++;
        else if (actual.result === 'A') acc.awayWinCorrect++;
      }

      // Store match details
      details.push({
        homeTeam: actual.homeTeam,
        awayTeam: actual.awayTeam,
        actualScore: `${actual.homeGoals}-${actual.awayGoals}`,
        actualResult: actual.result === 'H' ? 'Home Win' : actual.result === 'D' ? 'Draw' : 'Away Win',
        predictedResult: predictedResultText,
        predictedProb: predictedProb.toFixed(1),
        predictedScore: `${prediction.mostLikelyScore.home}-${prediction.mostLikelyScore.away}`,
        homeWinProb: prediction.homeWinProb.toFixed(1),
        drawProb: prediction.drawProb.toFixed(1),
        awayWinProb: prediction.awayWinProb.toFixed(1),
        wasCorrect
      });
    });

    // Calculate overall accuracy percentage
    acc.accuracy = acc.totalPredictions > 0 
      ? (acc.correctPredictions / acc.totalPredictions) * 100 
      : 0;

    setAccuracy(acc);
    setMatchDetails(details);
  }, []);

  const getAccuracyColor = (acc: number) => {
    if (acc >= 70) return 'text-green-600';
    if (acc >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBgColor = (acc: number) => {
    if (acc >= 70) return 'bg-green-500';
    if (acc >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📊 Model Accuracy Tracker
      </h2>
      
      {accuracy.totalPredictions === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No completed matches yet. Accuracy will be calculated once matches are played.</p>
        </div>
      ) : (
        <>
          {/* Overall Accuracy */}
          <div className="bg-white rounded-lg p-6 mb-4 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Overall Prediction Accuracy</h3>
                <p className="text-sm text-gray-500">Match outcome predictions (Home/Draw/Away)</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${getAccuracyColor(accuracy.accuracy)}`}>
                  {accuracy.accuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">
                  {accuracy.correctPredictions}/{accuracy.totalPredictions} correct
                </div>
              </div>
            </div>
            
            {/* Accuracy Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full ${getAccuracyBgColor(accuracy.accuracy)} transition-all duration-500`}
                style={{ width: `${accuracy.accuracy}%` }}
              />
            </div>
          </div>

          {/* Breakdown by Prediction Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Home Win Predictions */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-600">Home Win</h4>
                <span className="text-sm text-gray-500">
                  {accuracy.homeWinCorrect}/{accuracy.homeWinTotal}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {accuracy.homeWinTotal > 0 
                  ? ((accuracy.homeWinCorrect / accuracy.homeWinTotal) * 100).toFixed(0)
                  : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Accuracy</div>
            </div>

            {/* Draw Predictions */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-600">Draw</h4>
                <span className="text-sm text-gray-500">
                  {accuracy.drawCorrect}/{accuracy.drawTotal}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-600">
                {accuracy.drawTotal > 0 
                  ? ((accuracy.drawCorrect / accuracy.drawTotal) * 100).toFixed(0)
                  : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Accuracy</div>
            </div>

            {/* Away Win Predictions */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-600">Away Win</h4>
                <span className="text-sm text-gray-500">
                  {accuracy.awayWinCorrect}/{accuracy.awayWinTotal}
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {accuracy.awayWinTotal > 0 
                  ? ((accuracy.awayWinCorrect / accuracy.awayWinTotal) * 100).toFixed(0)
                  : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Accuracy</div>
            </div>
          </div>

          {/* Match Details */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Match-by-Match Analysis</h3>
            <div className="space-y-3">
              {matchDetails.map((match, idx) => (
                <div 
                  key={idx} 
                  className={`border-2 rounded-lg p-4 ${
                    match.wasCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${match.wasCorrect ? '✅' : '❌'}`}>
                        {match.wasCorrect ? '✅' : '❌'}
                      </div>
                      <div>
                        <div className="font-bold text-lg">
                          {match.homeTeam} vs {match.awayTeam}
                        </div>
                        <div className="text-sm text-gray-600">
                          Actual: {match.actualScore} ({match.actualResult})
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        match.wasCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {match.wasCorrect ? 'CORRECT' : 'INCORRECT'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">Model Prediction</div>
                      <div className="font-semibold">
                        {match.predictedResult} ({match.predictedProb}%)
                      </div>
                      <div className="text-xs text-gray-500">
                        Predicted Score: {match.predictedScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Probabilities</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-blue-600">Home:</span>
                          <span className="font-semibold">{match.homeWinProb}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Draw:</span>
                          <span className="font-semibold">{match.drawProb}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-600">Away:</span>
                          <span className="font-semibold">{match.awayWinProb}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology Note */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">📈 About Model Accuracy</h4>
            <p className="text-sm text-blue-800">
              Model accuracy is calculated based on correct match outcome predictions (Home Win, Draw, or Away Win). 
              The model uses Expected Goals (xG), team form, fixture difficulty, and other factors to predict match outcomes. 
              As more matches are played, the accuracy metric will provide better insight into model performance.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
