import { TeamStats, calculateTeamStats } from './teamStats';

export interface MatchPrediction {
  homeTeam: string;
  awayTeam: string;
  
  // Expected goals (using xG data)
  homeExpectedGoals: number;
  awayExpectedGoals: number;
  
  // Match outcome probabilities
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  
  // Goals markets
  over25Prob: number;
  under25Prob: number;
  over15Prob: number;
  under15Prob: number;
  over35Prob: number;
  under35Prob: number;
  
  // Both teams to score
  bttsYesProb: number;
  bttsNoProb: number;
  
  // Most likely scorelines
  mostLikelyScore: { home: number; away: number; prob: number };
  topScorelines: Array<{ home: number; away: number; prob: number }>;
  
  // Additional metrics
  confidence: number;
  totalExpectedGoals: number;
  
  // Market comparison
  marketHomeWin: number;
  marketDraw: number;
  marketAwayWin: number;
  valueBet: 'home' | 'draw' | 'away' | 'none';
}

// Poisson probability mass function
function poisson(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Calculate form factor based on recent results
function getFormFactor(form: ('W' | 'D' | 'L')[]): number {
  if (form.length === 0) return 1.0;
  
  const pointsMap = { W: 3, D: 1, L: 0 };
  const totalPoints = form.reduce((sum, result) => sum + pointsMap[result], 0);
  const maxPoints = form.length * 3;
  
  // Normalize to 0.85 - 1.15 range
  return 0.85 + (totalPoints / maxPoints) * 0.3;
}

// Predict expected goals using multiple factors
function predictExpectedGoals(
  team: TeamStats,
  opponent: TeamStats,
  isHome: boolean
): number {
  // Start with team's xG per game
  let xg = team.xgPerGame;
  
  // Adjust for opponent's defensive strength (using xG against)
  const opponentDefenseWeakness = 2 - opponent.defenseStrength;
  xg *= opponentDefenseWeakness;
  
  // Apply home/away factor
  if (isHome) {
    xg *= team.homeAdvantage;
  } else {
    xg *= 0.85; // Away penalty
  }
  
  // Apply form factor
  xg *= getFormFactor(team.form);
  
  // Blend with shooting stats (shots on target per game)
  const shotBasedXg = team.shotsOnTargetPerGame * 0.3; // ~30% conversion rate
  xg = xg * 0.7 + shotBasedXg * 0.3; // 70% xG-based, 30% shot-based
  
  return Math.max(0.3, Math.min(4.0, xg));
}

// Calculate match outcome probabilities using Poisson distribution
function calculateProbabilities(homeLambda: number, awayLambda: number): {
  homeWin: number;
  draw: number;
  awayWin: number;
  over25: number;
  under25: number;
  over15: number;
  under15: number;
  over35: number;
  under35: number;
  bttsYes: number;
  bttsNo: number;
  topScorelines: Array<{ home: number; away: number; prob: number }>;
} {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let over25 = 0;
  let under25 = 0;
  let over15 = 0;
  let under15 = 0;
  let over35 = 0;
  let under35 = 0;
  let bttsYes = 0;
  let bttsNo = 0;
  
  const scorelines: Array<{ home: number; away: number; prob: number }> = [];
  
  // Calculate probabilities for all possible scorelines (0-0 to 7-7)
  for (let i = 0; i <= 7; i++) {
    for (let j = 0; j <= 7; j++) {
      const prob = poisson(homeLambda, i) * poisson(awayLambda, j);
      
      scorelines.push({ home: i, away: j, prob });
      
      if (i > j) homeWin += prob;
      else if (i === j) draw += prob;
      else awayWin += prob;
      
      const totalGoals = i + j;
      if (totalGoals > 2.5) over25 += prob;
      else under25 += prob;
      
      if (totalGoals > 1.5) over15 += prob;
      else under15 += prob;
      
      if (totalGoals > 3.5) over35 += prob;
      else under35 += prob;
      
      if (i > 0 && j > 0) bttsYes += prob;
      else bttsNo += prob;
    }
  }
  
  // Sort scorelines by probability
  scorelines.sort((a, b) => b.prob - a.prob);
  
  return {
    homeWin,
    draw,
    awayWin,
    over25,
    under25,
    over15,
    under15,
    over35,
    under35,
    bttsYes,
    bttsNo,
    topScorelines: scorelines.slice(0, 5),
  };
}

// Determine if there's a value bet
function detectValueBet(
  modelProb: number,
  marketProb: number
): boolean {
  // Value if model probability is 5%+ higher than market
  return (modelProb - marketProb) >= 0.05;
}

// Main prediction function
export function predictMatch(homeTeamName: string, awayTeamName: string): MatchPrediction {
  const homeTeam = calculateTeamStats(homeTeamName);
  const awayTeam = calculateTeamStats(awayTeamName);
  
  // Calculate expected goals using comprehensive model
  const homeExpectedGoals = predictExpectedGoals(homeTeam, awayTeam, true);
  const awayExpectedGoals = predictExpectedGoals(awayTeam, homeTeam, false);
  
  // Calculate all probabilities
  const probs = calculateProbabilities(homeExpectedGoals, awayExpectedGoals);
  
  // Find most likely scoreline
  const mostLikelyScore = probs.topScorelines[0];
  
  // Calculate confidence based on how decisive the prediction is
  const maxProb = Math.max(probs.homeWin, probs.draw, probs.awayWin);
  const confidence = Math.round(maxProb * 100);
  
  // Calculate total expected goals
  const totalExpectedGoals = homeExpectedGoals + awayExpectedGoals;
  
  // Detect value bets
  let valueBet: 'home' | 'draw' | 'away' | 'none' = 'none';
  if (detectValueBet(probs.homeWin, homeTeam.marketWinProb)) {
    valueBet = 'home';
  } else if (detectValueBet(probs.draw, homeTeam.marketDrawProb)) {
    valueBet = 'draw';
  } else if (detectValueBet(probs.awayWin, awayTeam.marketWinProb)) {
    valueBet = 'away';
  }
  
  return {
    homeTeam: homeTeamName,
    awayTeam: awayTeamName,
    
    homeExpectedGoals: Math.round(homeExpectedGoals * 100) / 100,
    awayExpectedGoals: Math.round(awayExpectedGoals * 100) / 100,
    
    homeWinProb: Math.round(probs.homeWin * 10000) / 100,
    drawProb: Math.round(probs.draw * 10000) / 100,
    awayWinProb: Math.round(probs.awayWin * 10000) / 100,
    
    over25Prob: Math.round(probs.over25 * 10000) / 100,
    under25Prob: Math.round(probs.under25 * 10000) / 100,
    over15Prob: Math.round(probs.over15 * 10000) / 100,
    under15Prob: Math.round(probs.under15 * 10000) / 100,
    over35Prob: Math.round(probs.over35 * 10000) / 100,
    under35Prob: Math.round(probs.under35 * 10000) / 100,
    
    bttsYesProb: Math.round(probs.bttsYes * 10000) / 100,
    bttsNoProb: Math.round(probs.bttsNo * 10000) / 100,
    
    mostLikelyScore: {
      home: mostLikelyScore.home,
      away: mostLikelyScore.away,
      prob: Math.round(mostLikelyScore.prob * 10000) / 100,
    },
    topScorelines: probs.topScorelines.map(s => ({
      home: s.home,
      away: s.away,
      prob: Math.round(s.prob * 10000) / 100,
    })),
    
    confidence,
    totalExpectedGoals: Math.round(totalExpectedGoals * 100) / 100,
    
    marketHomeWin: Math.round(homeTeam.marketWinProb * 10000) / 100,
    marketDraw: Math.round(homeTeam.marketDrawProb * 10000) / 100,
    marketAwayWin: Math.round(awayTeam.marketWinProb * 10000) / 100,
    valueBet,
  };
}

// Get prediction summary for quick display
export function getPredictionSummary(prediction: MatchPrediction): string {
  const outcome = prediction.homeWinProb > prediction.awayWinProb
    ? `${prediction.homeTeam} win`
    : prediction.awayWinProb > prediction.homeWinProb
    ? `${prediction.awayTeam} win`
    : 'Draw';
  
  return `${outcome} • ${prediction.mostLikelyScore.home}-${prediction.mostLikelyScore.away} • ${prediction.confidence}% confidence`;
}
