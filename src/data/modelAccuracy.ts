// Track actual match results and model accuracy

export interface ActualResult {
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  result: 'H' | 'D' | 'A'; // Home win, Draw, Away win
}

export interface PredictionAccuracy {
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  homeWinCorrect: number;
  homeWinTotal: number;
  drawCorrect: number;
  drawTotal: number;
  awayWinCorrect: number;
  awayWinTotal: number;
}

// Store actual results for completed matches
export const actualResults: ActualResult[] = [
  // GW9 - Chelsea vs Man United (Completed)
  {
    homeTeam: 'Chelsea',
    awayTeam: 'Man United',
    homeGoals: 2,
    awayGoals: 0,
    result: 'H'
  }
];

// Calculate model accuracy
export function calculateAccuracy(): PredictionAccuracy {
  const accuracy: PredictionAccuracy = {
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

  // Import predictMatch dynamically to avoid circular dependency
  import('../utils/predictionEngine').then(({ predictMatch }) => {
    actualResults.forEach(actual => {
      const prediction = predictMatch(actual.homeTeam, actual.awayTeam);
      
      // Determine what the model predicted
      let predictedResult: 'H' | 'D' | 'A';
      if (prediction.homeWinProb > prediction.drawProb && prediction.homeWinProb > prediction.awayWinProb) {
        predictedResult = 'H';
        accuracy.homeWinTotal++;
      } else if (prediction.drawProb > prediction.homeWinProb && prediction.drawProb > prediction.awayWinProb) {
        predictedResult = 'D';
        accuracy.drawTotal++;
      } else {
        predictedResult = 'A';
        accuracy.awayWinTotal++;
      }

      accuracy.totalPredictions++;

      // Check if prediction was correct
      if (predictedResult === actual.result) {
        accuracy.correctPredictions++;
        
        if (actual.result === 'H') accuracy.homeWinCorrect++;
        else if (actual.result === 'D') accuracy.drawCorrect++;
        else if (actual.result === 'A') accuracy.awayWinCorrect++;
      }
    });

    // Calculate overall accuracy percentage
    accuracy.accuracy = accuracy.totalPredictions > 0 
      ? (accuracy.correctPredictions / accuracy.totalPredictions) * 100 
      : 0;
  });

  return accuracy;
}

// Get detailed accuracy for a specific match
export function getMatchPredictionDetails(homeTeam: string, awayTeam: string) {
  return import('../utils/predictionEngine').then(({ predictMatch }) => {
    const prediction = predictMatch(homeTeam, awayTeam);
    
    let predictedResult: 'Home Win' | 'Draw' | 'Away Win';
    let predictedProb: number;
    
    if (prediction.homeWinProb > prediction.drawProb && prediction.homeWinProb > prediction.awayWinProb) {
      predictedResult = 'Home Win';
      predictedProb = prediction.homeWinProb;
    } else if (prediction.drawProb > prediction.homeWinProb && prediction.drawProb > prediction.awayWinProb) {
      predictedResult = 'Draw';
      predictedProb = prediction.drawProb;
    } else {
      predictedResult = 'Away Win';
      predictedProb = prediction.awayWinProb;
    }

    return {
      predictedResult,
      predictedProb,
      homeWinProb: prediction.homeWinProb,
      drawProb: prediction.drawProb,
      awayWinProb: prediction.awayWinProb,
      predictedScore: `${prediction.mostLikelyScore.home}-${prediction.mostLikelyScore.away}`
    };
  });
}
