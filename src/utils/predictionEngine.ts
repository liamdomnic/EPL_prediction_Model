import { Team, LEAGUE_AVG_GOALS_HOME, LEAGUE_AVG_GOALS_AWAY } from "../data/teams";

export interface MatchPrediction {
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  over25Prob: number;
  bttsProb: number;
  confidence: number;
}

// Poisson distribution probability
function poissonProbability(lambda: number, k: number): number {
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

// Calculate form factor from last 5 games
function getFormFactor(team: Team): number {
  const maxPoints = 15; // 5 games * 3 points
  const currentPoints = team.form.reduce((sum, r) => sum + r, 0);
  return 0.8 + (currentPoints / maxPoints) * 0.4; // Range: 0.8 to 1.2
}

// Predict expected goals for home team
function predictHomeGoals(homeTeam: Team, awayTeam: Team): number {
  const homeAttack = homeTeam.attackStrength * LEAGUE_AVG_GOALS_HOME;
  const awayDefense = awayTeam.defenseStrength;
  const homeForm = getFormFactor(homeTeam);
  const homeAdv = homeTeam.homeAdvantage;

  return homeAttack * awayDefense * homeForm * homeAdv;
}

// Predict expected goals for away team
function predictAwayGoals(homeTeam: Team, awayTeam: Team): number {
  const awayAttack = awayTeam.attackStrength * LEAGUE_AVG_GOALS_AWAY;
  const homeDefense = homeTeam.defenseStrength;
  const awayForm = getFormFactor(awayTeam);
  // Away teams don't get home advantage bonus
  const awayPenalty = 0.9;

  return awayAttack * homeDefense * awayForm * awayPenalty;
}

// Calculate match outcome probabilities using Poisson distribution
function calculateProbabilities(
  homeExpectedGoals: number,
  awayExpectedGoals: number
): { homeWin: number; draw: number; awayWin: number } {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  const maxGoals = 8;

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      const prob =
        poissonProbability(homeExpectedGoals, i) *
        poissonProbability(awayExpectedGoals, j);

      if (i > j) {
        homeWin += prob;
      } else if (i === j) {
        draw += prob;
      } else {
        awayWin += prob;
      }
    }
  }

  // Normalize
  const total = homeWin + draw + awayWin;
  return {
    homeWin: homeWin / total,
    draw: draw / total,
    awayWin: awayWin / total,
  };
}

// Calculate Over 2.5 goals probability
function calculateOver25(
  homeExpectedGoals: number,
  awayExpectedGoals: number
): number {
  let under25 = 0;
  const maxGoals = 5;

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      if (i + j <= 2) {
        under25 +=
          poissonProbability(homeExpectedGoals, i) *
          poissonProbability(awayExpectedGoals, j);
      }
    }
  }

  return 1 - under25;
}

// Calculate BTTS (Both Teams To Score) probability
function calculateBTTS(
  homeExpectedGoals: number,
  awayExpectedGoals: number
): number {
  const homeNoGoal = poissonProbability(homeExpectedGoals, 0);
  const awayNoGoal = poissonProbability(awayExpectedGoals, 0);

  // P(both score) = 1 - P(home doesn't score) - P(away doesn't score) + P(neither scores)
  return 1 - homeNoGoal - awayNoGoal + homeNoGoal * awayNoGoal;
}

// Main prediction function
export function predictMatch(homeTeam: Team, awayTeam: Team): MatchPrediction {
  const homeExpectedGoals = predictHomeGoals(homeTeam, awayTeam);
  const awayExpectedGoals = predictAwayGoals(homeTeam, awayTeam);

  const probabilities = calculateProbabilities(homeExpectedGoals, awayExpectedGoals);
  const over25 = calculateOver25(homeExpectedGoals, awayExpectedGoals);
  const btts = calculateBTTS(homeExpectedGoals, awayExpectedGoals);

  // Calculate confidence based on how clear the favorite is
  const maxProb = Math.max(probabilities.homeWin, probabilities.draw, probabilities.awayWin);
  const confidence = Math.min(95, Math.max(40, (maxProb - 0.33) * 200 + 50));

  return {
    homeTeam,
    awayTeam,
    homeGoals: Math.round(homeExpectedGoals * 10) / 10,
    awayGoals: Math.round(awayExpectedGoals * 10) / 10,
    homeWinProb: probabilities.homeWin * 100,
    drawProb: probabilities.draw * 100,
    awayWinProb: probabilities.awayWin * 100,
    over25Prob: over25 * 100,
    bttsProb: btts * 100,
    confidence,
  };
}

// Simulate a single match result
export function simulateMatch(homeTeam: Team, awayTeam: Team): { homeGoals: number; awayGoals: number } {
  const prediction = predictMatch(homeTeam, awayTeam);
  
  // Use Poisson random generation
  const homeGoals = poissonRandom(prediction.homeGoals);
  const awayGoals = poissonRandom(prediction.awayGoals);
  
  return { homeGoals, awayGoals };
}

function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  
  return k - 1;
}

// Simulate remaining season
export function simulateSeason(
  teams: Team[],
  fixtures: { homeTeam: string; awayTeam: string }[],
  simulations: number = 10000
): Map<string, { avgPoints: number; titleProb: number; relegationProb: number; top4Prob: number }> {
  const results = new Map<string, { totalPoints: number; titles: number; relegated: number; top4: number }>();
  
  teams.forEach(team => {
    results.set(team.id, { totalPoints: 0, titles: 0, relegated: 0, top4: 0 });
  });

  for (let sim = 0; sim < simulations; sim++) {
    const standings = new Map<string, number>();
    
    teams.forEach(team => {
      standings.set(team.id, team.points);
    });

    fixtures.forEach(fixture => {
      const homeTeam = teams.find(t => t.id === fixture.homeTeam)!;
      const awayTeam = teams.find(t => t.id === fixture.awayTeam)!;
      
      const result = simulateMatch(homeTeam, awayTeam);
      
      standings.set(fixture.homeTeam, standings.get(fixture.homeTeam)! + getPoints(result.homeGoals, result.awayGoals));
      standings.set(fixture.awayTeam, standings.get(fixture.awayTeam)! + getPoints(result.awayGoals, result.homeGoals));
    });

    // Sort standings
    const sorted = [...standings.entries()].sort((a, b) => b[1] - a[1]);
    
    // Title winner
    results.get(sorted[0][0])!.titles += 1;
    
    // Top 4
    for (let i = 0; i < 4; i++) {
      results.get(sorted[i][0])!.top4 += 1;
    }
    
    // Relegation (bottom 3)
    for (let i = sorted.length - 3; i < sorted.length; i++) {
      results.get(sorted[i][0])!.relegated += 1;
    }

    // Accumulate points
    sorted.forEach(([teamId, points]) => {
      results.get(teamId)!.totalPoints += points;
    });
  }

  // Calculate averages
  const finalResults = new Map<string, { avgPoints: number; titleProb: number; relegationProb: number; top4Prob: number }>();
  
  results.forEach((data, teamId) => {
    finalResults.set(teamId, {
      avgPoints: Math.round((data.totalPoints / simulations) * 10) / 10,
      titleProb: Math.round((data.titles / simulations) * 1000) / 10,
      relegationProb: Math.round((data.relegated / simulations) * 1000) / 10,
      top4Prob: Math.round((data.top4 / simulations) * 1000) / 10,
    });
  });

  return finalResults;
}

function getPoints(goalsFor: number, goalsAgainst: number): number {
  if (goalsFor > goalsAgainst) return 3;
  if (goalsFor === goalsAgainst) return 1;
  return 0;
}
