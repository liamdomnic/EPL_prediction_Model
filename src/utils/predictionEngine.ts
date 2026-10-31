import { TeamStats, calculateTeamStats } from './teamStats';

export interface MatchPrediction {
  homeTeam: string;
  awayTeam: string;
  homeExpectedGoals: number;
  awayExpectedGoals: number;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  over25Prob: number;
  bttsProb: number;
  confidence: number;
  mostLikelyScore: { home: number; away: number; prob: number };
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

// Predict expected goals for home team
function predictHomeGoals(homeTeam: TeamStats, awayTeam: TeamStats): number {
  // Base: home team's attack strength * away team's defense weakness
  let expectedGoals = homeTeam.attackStrength * (2 - awayTeam.defenseStrength);
  
  // Apply home advantage
  expectedGoals *= homeTeam.homeAdvantage;
  
  // Apply form factor
  expectedGoals *= getFormFactor(homeTeam.form);
  
  // League average adjustment (typically 1.5 goals per home game)
  expectedGoals *= 1.5;
  
  return Math.max(0.3, Math.min(4.0, expectedGoals));
}

// Predict expected goals for away team
function predictAwayGoals(homeTeam: TeamStats, awayTeam: TeamStats): number {
  // Base: away team's attack strength * home team's defense weakness
  let expectedGoals = awayTeam.attackStrength * (2 - homeTeam.defenseStrength);
  
  // Away teams typically score less (no home advantage)
  expectedGoals *= 0.85;
  
  // Apply form factor
  expectedGoals *= getFormFactor(awayTeam.form);
  
  // League average adjustment (typically 1.2 goals per away game)
  expectedGoals *= 1.2;
  
  return Math.max(0.2, Math.min(3.5, expectedGoals));
}

// Calculate match outcome probabilities using Poisson distribution
function calculateProbabilities(homeLambda: number, awayLambda: number): {
  homeWin: number;
  draw: number;
  awayWin: number;
  over25: number;
  btts: number;
} {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let over25 = 0;
  let btts = 0;
  
  // Calculate probabilities for all possible scorelines (0-0 to 7-7)
  for (let i = 0; i <= 7; i++) {
    for (let j = 0; j <= 7; j++) {
      const prob = poisson(homeLambda, i) * poisson(awayLambda, j);
      
      if (i > j) homeWin += prob;
      else if (i === j) draw += prob;
      else awayWin += prob;
      
      if (i + j > 2.5) over25 += prob;
      if (i > 0 && j > 0) btts += prob;
    }
  }
  
  return { homeWin, draw, awayWin, over25, btts };
}

// Find most likely scoreline
function findMostLikelyScore(homeLambda: number, awayLambda: number): {
  home: number;
  away: number;
  prob: number;
} {
  let maxProb = 0;
  let mostLikely = { home: 0, away: 0, prob: 0 };
  
  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j <= 5; j++) {
      const prob = poisson(homeLambda, i) * poisson(awayLambda, j);
      if (prob > maxProb) {
        maxProb = prob;
        mostLikely = { home: i, away: j, prob };
      }
    }
  }
  
  return mostLikely;
}

// Main prediction function
export function predictMatch(homeTeamName: string, awayTeamName: string): MatchPrediction {
  const homeTeam = calculateTeamStats(homeTeamName);
  const awayTeam = calculateTeamStats(awayTeamName);
  
  // Calculate expected goals
  const homeExpectedGoals = predictHomeGoals(homeTeam, awayTeam);
  const awayExpectedGoals = predictAwayGoals(homeTeam, awayTeam);
  
  // Calculate probabilities
  const probs = calculateProbabilities(homeExpectedGoals, awayExpectedGoals);
  
  // Find most likely score
  const mostLikelyScore = findMostLikelyScore(homeExpectedGoals, awayExpectedGoals);
  
  // Calculate confidence based on how decisive the prediction is
  const maxProb = Math.max(probs.homeWin, probs.draw, probs.awayWin);
  const confidence = Math.round(maxProb * 100);
  
  return {
    homeTeam: homeTeamName,
    awayTeam: awayTeamName,
    homeExpectedGoals: Math.round(homeExpectedGoals * 100) / 100,
    awayExpectedGoals: Math.round(awayExpectedGoals * 100) / 100,
    homeWinProb: Math.round(probs.homeWin * 10000) / 100,
    drawProb: Math.round(probs.draw * 10000) / 100,
    awayWinProb: Math.round(probs.awayWin * 10000) / 100,
    over25Prob: Math.round(probs.over25 * 10000) / 100,
    bttsProb: Math.round(probs.btts * 10000) / 100,
    confidence,
    mostLikelyScore: {
      home: mostLikelyScore.home,
      away: mostLikelyScore.away,
      prob: Math.round(mostLikelyScore.prob * 10000) / 100,
    },
  };
}
