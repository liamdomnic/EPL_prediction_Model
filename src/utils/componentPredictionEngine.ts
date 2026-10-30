import { fplPlayers, type FPLPlayer, type Position } from '../data/fplDatabase';
import { teams, type Team } from '../data/teams';

// Component-based prediction model following FPL best practices
// Predicts building blocks separately, then converts to FPL points

export interface PlayerPrediction {
  playerId: string;
  playerName: string;
  teamId: string;
  position: Position;
  
  // Component predictions
  expectedMinutes: number;
  startProbability: number;
  expectedGoals: number;
  expectedAssists: number;
  expectedCleanSheet: number;
  expectedBonus: number;
  expectedSaves: number;
  expectedCards: number;
  
  // Derived FPL points
  expectedPoints: number;
  
  // Confidence metrics
  confidence: number;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  name: string;
  value: number;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
}

// Historical data from GW1-8
interface TeamStats {
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  gamesPlayed: number;
  homeGoalsScored: number;
  homeGoalsConceded: number;
  awayGoalsScored: number;
  awayGoalsConceded: number;
}

// Calculate team stats from match results
function getTeamStats(teamId: string): TeamStats {
  const team = teams.find(t => t.id === teamId);
  if (!team) {
    return {
      goalsScored: 0, goalsConceded: 0, cleanSheets: 0, gamesPlayed: 0,
      homeGoalsScored: 0, homeGoalsConceded: 0, awayGoalsScored: 0, awayGoalsConceded: 0
    };
  }
  
  return {
    goalsScored: team.goalsFor,
    goalsConceded: team.goalsAgainst,
    cleanSheets: team.goalsFor > 0 ? Math.round((team.goalsFor / team.played) * 2) : 0, // Estimate
    gamesPlayed: team.played,
    homeGoalsScored: team.homeGF,
    homeGoalsConceded: team.homeGA,
    awayGoalsScored: team.awayGF,
    awayGoalsConceded: team.awayGA
  };
}

// Calculate start probability based on player status and recent form
function predictStartProbability(player: FPLPlayer, isKeyPlayer: boolean): number {
  let probability = 0.7; // Base probability
  
  // Key players (high FPL points) more likely to start
  if (player.points > 40) probability += 0.2;
  else if (player.points > 25) probability += 0.1;
  else if (player.points < 10) probability -= 0.2;
  
  // Position-based adjustments
  if (player.position === 'GK') probability += 0.15; // Goalkeepers rarely rotated
  if (player.position === 'DEF') probability += 0.05;
  if (player.position === 'FWD' && player.points < 15) probability -= 0.1; // Strugglers rotated
  
  // Price as proxy for importance
  if (player.price > 8.0) probability += 0.1;
  else if (player.price < 4.5) probability -= 0.1;
  
  return Math.max(0.3, Math.min(0.95, probability));
}

// Predict expected minutes
function predictMinutes(player: FPLPlayer, startProbability: number): number {
  if (startProbability < 0.5) return 0; // Likely benched
  
  let minutes = 90 * startProbability;
  
  // Adjust based on player type
  if (player.position === 'GK') {
    minutes = startProbability > 0.7 ? 90 : 0; // GKs play full 90 or don't play
  } else if (player.points > 40) {
    minutes = Math.min(90, minutes + 5); // Key players play more
  } else if (player.points < 10) {
    minutes = Math.max(0, minutes - 15); // Low performers get subbed off
  }
  
  return Math.round(minutes);
}

// Predict goals based on attacking threat and opponent
function predictGoals(
  player: FPLPlayer,
  opponentTeamId: string,
  isHome: boolean,
  formFactor: number
): number {
  if (player.position === 'GK') return 0;
  
  const playerTeam = getTeamStats(player.teamId);
  const opponentTeam = getTeamStats(opponentTeamId);
  
  // Base xG per 90 for position
  let baseXG = 0;
  if (player.position === 'FWD') baseXG = 0.4;
  else if (player.position === 'MID') baseXG = 0.15;
  else if (player.position === 'DEF') baseXG = 0.05;
  
  // Adjust for team attacking strength
  const teamAttackStrength = playerTeam.goalsScored / playerTeam.gamesPlayed / 1.5; // Normalize
  baseXG *= teamAttackStrength;
  
  // Adjust for opponent defensive weakness
  const opponentDefWeakness = opponentTeam.goalsConceded / opponentTeam.gamesPlayed / 1.5;
  baseXG *= opponentDefWeakness;
  
  // Home/away adjustment
  if (isHome) baseXG *= 1.15;
  else baseXG *= 0.85;
  
  // Form adjustment
  baseXG *= formFactor;
  
  // Player-specific adjustment based on FPL points (proxy for goal threat)
  if (player.points > 40) baseXG *= 1.3;
  else if (player.points > 25) baseXG *= 1.1;
  else if (player.points < 10) baseXG *= 0.7;
  
  // Price as proxy for attacking role
  if (player.price > 10.0) baseXG *= 1.2;
  else if (player.price < 5.0) baseXG *= 0.8;
  
  return Math.max(0, baseXG);
}

// Predict assists
function predictAssists(
  player: FPLPlayer,
  opponentTeamId: string,
  isHome: boolean,
  formFactor: number
): number {
  if (player.position === 'GK') return 0;
  
  const playerTeam = getTeamStats(player.teamId);
  const opponentTeam = getTeamStats(opponentTeamId);
  
  // Base xA per 90 for position
  let baseXA = 0;
  if (player.position === 'MID') baseXA = 0.25;
  else if (player.position === 'FWD') baseXA = 0.15;
  else if (player.position === 'DEF') baseXA = 0.1;
  
  // Team attacking strength
  const teamAttackStrength = playerTeam.goalsScored / playerTeam.gamesPlayed / 1.5;
  baseXA *= teamAttackStrength;
  
  // Opponent defensive weakness
  const opponentDefWeakness = opponentTeam.goalsConceded / opponentTeam.gamesPlayed / 1.5;
  baseXA *= opponentDefWeakness;
  
  // Home/away
  if (isHome) baseXA *= 1.1;
  else baseXA *= 0.9;
  
  // Form
  baseXA *= formFactor;
  
  // Player-specific (FPL points as proxy for creativity)
  if (player.points > 40) baseXA *= 1.4;
  else if (player.points > 25) baseXA *= 1.2;
  else if (player.points < 10) baseXA *= 0.6;
  
  // Price adjustment
  if (player.price > 8.0) baseXA *= 1.15;
  
  return Math.max(0, baseXA);
}

// Predict clean sheet probability
function predictCleanSheet(
  player: FPLPlayer,
  opponentTeamId: string,
  isHome: boolean
): number {
  if (player.position === 'FWD' || player.position === 'MID') return 0;
  
  const playerTeam = getTeamStats(player.teamId);
  const opponentTeam = getTeamStats(opponentTeamId);
  
  // Base clean sheet probability
  let csProb = 0.3;
  
  // Team defensive strength
  const teamDefStrength = 1 - (playerTeam.goalsConceded / playerTeam.gamesPlayed / 2);
  csProb *= (1 + teamDefStrength);
  
  // Opponent attacking weakness
  const opponentAttackWeakness = 1 - (opponentTeam.goalsScored / opponentTeam.gamesPlayed / 2);
  csProb *= (1 + opponentAttackWeakness);
  
  // Home advantage
  if (isHome) csProb *= 1.2;
  else csProb *= 0.8;
  
  // Team-specific clean sheet rates (from our pattern analysis)
  const cleanSheetRates: Record<string, number> = {
    'ars': 0.625, 'bri': 0.50, 'mci': 0.375, 'liv': 0.375,
    'lee': 0.375, 'bre': 0.25, 'eve': 0.25, 'nfo': 0.125,
    'mun': 0.125, 'cry': 0.125, 'ips': 0.0, 'shu': 0.0, 'bur': 0.0
  };
  
  if (cleanSheetRates[player.teamId] !== undefined) {
    csProb = cleanSheetRates[player.teamId];
    
    // Adjust for opponent
    if (opponentTeam.goalsScored / opponentTeam.gamesPlayed > 2) {
      csProb *= 0.7; // Strong opponent
    } else if (opponentTeam.goalsScored / opponentTeam.gamesPlayed < 1) {
      csProb *= 1.3; // Weak opponent
    }
    
    // Home/away adjustment
    if (isHome) csProb *= 1.15;
    else csProb *= 0.85;
  }
  
  return Math.max(0, Math.min(0.8, csProb));
}

// Predict bonus points
function predictBonus(player: FPLPlayer, expectedMinutes: number): number {
  if (expectedMinutes < 60) return 0;
  
  let bonus = 0;
  
  // High performers more likely to get bonus
  if (player.points > 50) bonus = 2.5;
  else if (player.points > 35) bonus = 1.8;
  else if (player.points > 20) bonus = 1.2;
  else if (player.points > 10) bonus = 0.6;
  
  // Position adjustment (defenders and midfielders get more bonus for defensive work)
  if (player.position === 'DEF') bonus *= 1.1;
  else if (player.position === 'MID') bonus *= 1.05;
  
  // Price as proxy for influence
  if (player.price > 8.0) bonus *= 1.2;
  
  return Math.min(3, bonus);
}

// Predict saves (for goalkeepers)
function predictSaves(player: FPLPlayer, opponentTeamId: string): number {
  if (player.position !== 'GK') return 0;
  
  const opponentTeam = getTeamStats(opponentTeamId);
  
  // Expected shots faced based on opponent attacking strength
  const opponentShotsPerGame = opponentTeam.goalsScored / opponentTeam.gamesPlayed * 8; // Rough estimate
  const savesPerShot = 0.7; // Average save rate
  
  return opponentShotsPerGame * savesPerShot;
}

// Calculate form factor from recent performance
function calculateFormFactor(player: FPLPlayer): number {
  // Use FPL points as proxy for recent form
  // Normalize to 0.5 - 1.5 range
  if (player.points > 50) return 1.4;
  if (player.points > 35) return 1.2;
  if (player.points > 20) return 1.0;
  if (player.points > 10) return 0.8;
  return 0.6;
}

// Main prediction function
export function predictPlayerPerformance(
  player: FPLPlayer,
  opponentTeamId: string,
  isHome: boolean
): PlayerPrediction {
  const factors: PredictionFactor[] = [];
  
  // 1. Predict minutes (most important factor)
  const isKeyPlayer = player.points > 30 || player.price > 7.0;
  const startProbability = predictStartProbability(player, isKeyPlayer);
  const expectedMinutes = predictMinutes(player, startProbability);
  
  factors.push({
    name: 'Start Probability',
    value: startProbability,
    impact: startProbability > 0.7 ? 'positive' : startProbability < 0.5 ? 'negative' : 'neutral',
    weight: 0.25
  });
  
  // 2. Calculate form factor
  const formFactor = calculateFormFactor(player);
  
  // 3. Predict attacking components
  const expectedGoals = predictGoals(player, opponentTeamId, isHome, formFactor);
  const expectedAssists = predictAssists(player, opponentTeamId, isHome, formFactor);
  
  if (expectedGoals > 0.3) {
    factors.push({
      name: 'Goal Threat',
      value: expectedGoals,
      impact: 'positive',
      weight: 0.20
    });
  }
  
  if (expectedAssists > 0.2) {
    factors.push({
      name: 'Assist Potential',
      value: expectedAssists,
      impact: 'positive',
      weight: 0.15
    });
  }
  
  // 4. Predict defensive components
  const expectedCleanSheet = predictCleanSheet(player, opponentTeamId, isHome);
  const expectedSaves = predictSaves(player, opponentTeamId);
  
  if (expectedCleanSheet > 0.3) {
    factors.push({
      name: 'Clean Sheet Probability',
      value: expectedCleanSheet,
      impact: 'positive',
      weight: 0.15
    });
  }
  
  // 5. Predict bonus
  const expectedBonus = predictBonus(player, expectedMinutes);
  
  // 6. Predict cards (negative)
  const expectedCards = player.points > 30 ? 0.1 : 0.2; // Higher performers get fewer cards
  
  // 7. Calculate FPL points using official scoring rules
  let expectedPoints = 0;
  
  // Appearance points
  if (expectedMinutes >= 60) expectedPoints += 2;
  else if (expectedMinutes > 0) expectedPoints += 1;
  
  // Goals (position-dependent)
  if (player.position === 'GK') expectedPoints += expectedGoals * 10;
  else if (player.position === 'DEF') expectedPoints += expectedGoals * 6;
  else if (player.position === 'MID') expectedPoints += expectedGoals * 5;
  else if (player.position === 'FWD') expectedPoints += expectedGoals * 4;
  
  // Assists (3 points each)
  expectedPoints += expectedAssists * 3;
  
  // Clean sheet (GK/DEF: 4pts, MID: 1pt)
  if (player.position === 'GK' || player.position === 'DEF') {
    expectedPoints += expectedCleanSheet * 4;
  } else if (player.position === 'MID') {
    expectedPoints += expectedCleanSheet * 1;
  }
  
  // Saves (GK only, 1pt per 3 saves)
  if (player.position === 'GK') {
    expectedPoints += (expectedSaves / 3);
  }
  
  // Bonus
  expectedPoints += expectedBonus;
  
  // Cards (negative)
  expectedPoints -= expectedCards;
  
  // Calculate confidence
  let confidence = 0.5;
  if (startProbability > 0.8) confidence += 0.2;
  if (player.points > 30) confidence += 0.2;
  if (player.price > 7.0) confidence += 0.1;
  confidence = Math.min(0.95, confidence);
  
  return {
    playerId: player.id,
    playerName: player.name,
    teamId: player.teamId,
    position: player.position,
    expectedMinutes,
    startProbability,
    expectedGoals,
    expectedAssists,
    expectedCleanSheet,
    expectedBonus,
    expectedSaves,
    expectedCards,
    expectedPoints: Math.round(expectedPoints * 10) / 10,
    confidence,
    factors
  };
}

// Get all player predictions for a fixture
export function getFixturePredictions(
  homeTeamId: string,
  awayTeamId: string,
  injuredPlayerIds: string[] = []
): PlayerPrediction[] {
  const homePlayers = fplPlayers.filter(
    p => p.teamId === homeTeamId && !injuredPlayerIds.includes(p.id)
  );
  const awayPlayers = fplPlayers.filter(
    p => p.teamId === awayTeamId && !injuredPlayerIds.includes(p.id)
  );
  
  const predictions: PlayerPrediction[] = [];
  
  homePlayers.forEach(player => {
    predictions.push(predictPlayerPerformance(player, awayTeamId, true));
  });
  
  awayPlayers.forEach(player => {
    predictions.push(predictPlayerPerformance(player, homeTeamId, false));
  });
  
  return predictions.sort((a, b) => b.expectedPoints - a.expectedPoints);
}
