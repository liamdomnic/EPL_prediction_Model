import { matchData, MatchData, teams, gw9Results } from '../data/matchData';

export interface TeamStats {
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  
  // Home/Away splits
  homePlayed: number;
  homeWins: number;
  homeGoalsFor: number;
  homeGoalsAgainst: number;
  awayPlayed: number;
  awayWins: number;
  awayGoalsFor: number;
  awayGoalsAgainst: number;
  
  // Expected Goals (xG)
  xgFor: number;
  xgAgainst: number;
  xgPerGame: number;
  xgAgainstPerGame: number;
  
  // Shooting stats
  shotsPerGame: number;
  shotsOnTargetPerGame: number;
  shootingAccuracy: number;
  
  // Defensive stats
  tacklesPerGame: number;
  interceptionsPerGame: number;
  
  // Discipline
  yellowCards: number;
  redCards: number;
  foulsPerGame: number;
  
  // Set pieces
  cornersPerGame: number;
  
  // Recent form (last 5 games)
  form: ('W' | 'D' | 'L')[];
  formPoints: number;
  
  // Calculated metrics
  attackStrength: number;
  defenseStrength: number;
  homeAdvantage: number;
  
  // Betting market implied probabilities
  marketWinProb: number;
  marketDrawProb: number;
  marketLossProb: number;
}

// Calculate comprehensive team statistics
export function calculateTeamStats(teamName: string): TeamStats {
  const homeMatches = matchData.filter(m => m.homeTeam === teamName);
  const awayMatches = matchData.filter(m => m.awayTeam === teamName);
  const allMatches = [...homeMatches, ...awayMatches];
  
  // Add GW9 results
  const gw9HomeMatches = gw9Results.filter(m => m.homeTeam === teamName);
  const gw9AwayMatches = gw9Results.filter(m => m.awayTeam === teamName);
  
  // Sort by date to get recent form
  allMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Overall stats
  let wins = 0, draws = 0, losses = 0;
  let goalsFor = 0, goalsAgainst = 0;
  let xgFor = 0, xgAgainst = 0;
  let shots = 0, shotsOnTarget = 0;
  let corners = 0, fouls = 0;
  let yellowCards = 0, redCards = 0;
  
  // Home stats
  let homeWins = 0, homeGoalsFor = 0, homeGoalsAgainst = 0;
  
  // Away stats
  let awayWins = 0, awayGoalsFor = 0, awayGoalsAgainst = 0;
  
  // Calculate overall stats
  allMatches.forEach(match => {
    const isHome = match.homeTeam === teamName;
    const teamGoals = isHome ? match.fthg : match.ftag;
    const opponentGoals = isHome ? match.ftag : match.fthg;
    const teamXg = isHome ? match.hxg : match.axg;
    const opponentXg = isHome ? match.axg : match.hxg;
    const teamShots = isHome ? match.hs : match.as;
    const teamSot = isHome ? match.hst : match.ast;
    const teamCorners = isHome ? match.hc : match.ac;
    const teamFouls = isHome ? match.hf : match.af;
    const teamYellows = isHome ? match.hy : match.ay;
    const teamReds = isHome ? match.hr : match.ar;
    
    goalsFor += teamGoals;
    goalsAgainst += opponentGoals;
    xgFor += teamXg;
    xgAgainst += opponentXg;
    shots += teamShots;
    shotsOnTarget += teamSot;
    corners += teamCorners;
    fouls += teamFouls;
    yellowCards += teamYellows;
    redCards += teamReds;
    
    if (teamGoals > opponentGoals) {
      wins++;
      if (isHome) homeWins++;
      else awayWins++;
    } else if (teamGoals === opponentGoals) {
      draws++;
    } else {
      losses++;
    }
    
    if (isHome) {
      homeGoalsFor += teamGoals;
      homeGoalsAgainst += opponentGoals;
    } else {
      awayGoalsFor += teamGoals;
      awayGoalsAgainst += opponentGoals;
    }
  });
  
  // Process GW9 results
  gw9HomeMatches.forEach(match => {
    const teamGoals = match.homeGoals;
    const opponentGoals = match.awayGoals;
    
    goalsFor += teamGoals;
    goalsAgainst += opponentGoals;
    homeGoalsFor += teamGoals;
    homeGoalsAgainst += opponentGoals;
    
    if (match.result === 'H') {
      wins++;
      homeWins++;
    } else if (match.result === 'D') {
      draws++;
    } else {
      losses++;
    }
  });
  
  gw9AwayMatches.forEach(match => {
    const teamGoals = match.awayGoals;
    const opponentGoals = match.homeGoals;
    
    goalsFor += teamGoals;
    goalsAgainst += opponentGoals;
    awayGoalsFor += teamGoals;
    awayGoalsAgainst += opponentGoals;
    
    if (match.result === 'A') {
      wins++;
      awayWins++;
    } else if (match.result === 'D') {
      draws++;
    } else {
      losses++;
    }
  });
  
  // Recent form (last 5 games including GW9)
  const form: ('W' | 'D' | 'L')[] = [];
  let formPoints = 0;
  
  // Get last 4 games from GW1-8
  const recentGW1to8 = allMatches.slice(-4);
  recentGW1to8.forEach(match => {
    const isHome = match.homeTeam === teamName;
    const teamGoals = isHome ? match.fthg : match.ftag;
    const opponentGoals = isHome ? match.ftag : match.fthg;
    
    if (teamGoals > opponentGoals) {
      form.push('W');
      formPoints += 3;
    } else if (teamGoals === opponentGoals) {
      form.push('D');
      formPoints += 1;
    } else {
      form.push('L');
    }
  });
  
  // Add GW9 result
  const gw9Match = gw9Results.find(m => m.homeTeam === teamName || m.awayTeam === teamName);
  if (gw9Match) {
    const isHome = gw9Match.homeTeam === teamName;
    const teamGoals = isHome ? gw9Match.homeGoals : gw9Match.awayGoals;
    const opponentGoals = isHome ? gw9Match.awayGoals : gw9Match.homeGoals;
    
    if (teamGoals > opponentGoals) {
      form.push('W');
      formPoints += 3;
    } else if (teamGoals === opponentGoals) {
      form.push('D');
      formPoints += 1;
    } else {
      form.push('L');
    }
  }
  
  // Calculate per-game averages (including GW9)
  const gw9MatchesPlayed = gw9HomeMatches.length + gw9AwayMatches.length;
  const played = allMatches.length + gw9MatchesPlayed;
  const xgPerGame = played > 0 ? xgFor / played : 0;
  const xgAgainstPerGame = played > 0 ? xgAgainst / played : 0;
  const shotsPerGame = played > 0 ? shots / played : 0;
  const shotsOnTargetPerGame = played > 0 ? shotsOnTarget / played : 0;
  const shootingAccuracy = shots > 0 ? (shotsOnTarget / shots) * 100 : 0;
  const cornersPerGame = played > 0 ? corners / played : 0;
  const foulsPerGame = played > 0 ? fouls / played : 0;
  
  // League averages (for strength calculations) - including GW9
  const totalGoalsGW1to8 = matchData.reduce((sum, m) => sum + m.fthg + m.ftag, 0);
  const totalGoalsGW9 = gw9Results.reduce((sum, m) => sum + m.homeGoals + m.awayGoals, 0);
  const totalGoals = totalGoalsGW1to8 + totalGoalsGW9;
  const totalMatches = matchData.length + gw9Results.length;
  const avgGoalsPerGame = totalMatches > 0 ? totalGoals / totalMatches : 0;
  
  const totalXg = matchData.reduce((sum, m) => sum + m.hxg + m.axg, 0);
  const avgXgPerGame = matchData.length > 0 ? totalXg / matchData.length : 0;
  
  // Attack and defense strength (relative to league average)
  const goalsPerGame = played > 0 ? goalsFor / played : 0;
  const goalsAgainstPerGame = played > 0 ? goalsAgainst / played : 0;
  
  const attackStrength = avgGoalsPerGame > 0 ? goalsPerGame / avgGoalsPerGame : 1;
  const defenseStrength = avgGoalsPerGame > 0 ? goalsAgainstPerGame / avgGoalsPerGame : 1;
  
  // Home advantage (including GW9)
  const homeGamesPlayed = homeMatches.length + gw9HomeMatches.length;
  const awayGamesPlayed = awayMatches.length + gw9AwayMatches.length;
  const homeGoalsPerGame = homeGamesPlayed > 0 ? homeGoalsFor / homeGamesPlayed : 0;
  const awayGoalsPerGame = awayGamesPlayed > 0 ? awayGoalsFor / awayGamesPlayed : 0;
  const homeAdvantage = awayGoalsPerGame > 0 ? homeGoalsPerGame / awayGoalsPerGame : 1;
  
  // Market implied probabilities (from average betting odds)
  let marketWinProb = 0, marketDrawProb = 0, marketLossProb = 0;
  let marketCount = 0;
  
  allMatches.forEach(match => {
    const isHome = match.homeTeam === teamName;
    if (match.avgh > 0 && match.avgd > 0 && match.avga > 0) {
      // Convert odds to probabilities (removing overround)
      const homeProb = 1 / match.avgh;
      const drawProb = 1 / match.avgd;
      const awayProb = 1 / match.avga;
      const total = homeProb + drawProb + awayProb;
      
      if (isHome) {
        marketWinProb += homeProb / total;
        marketDrawProb += drawProb / total;
        marketLossProb += awayProb / total;
      } else {
        marketWinProb += awayProb / total;
        marketDrawProb += drawProb / total;
        marketLossProb += homeProb / total;
      }
      marketCount++;
    }
  });
  
  if (marketCount > 0) {
    marketWinProb /= marketCount;
    marketDrawProb /= marketCount;
    marketLossProb /= marketCount;
  }
  
  return {
    name: teamName,
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    points: wins * 3 + draws,
    
    homePlayed: homeMatches.length,
    homeWins,
    homeGoalsFor,
    homeGoalsAgainst,
    awayPlayed: awayMatches.length,
    awayWins,
    awayGoalsFor,
    awayGoalsAgainst,
    
    xgFor: Math.round(xgFor * 100) / 100,
    xgAgainst: Math.round(xgAgainst * 100) / 100,
    xgPerGame: Math.round(xgPerGame * 100) / 100,
    xgAgainstPerGame: Math.round(xgAgainstPerGame * 100) / 100,
    
    shotsPerGame: Math.round(shotsPerGame * 10) / 10,
    shotsOnTargetPerGame: Math.round(shotsOnTargetPerGame * 10) / 10,
    shootingAccuracy: Math.round(shootingAccuracy),
    
    tacklesPerGame: 0, // Not in dataset
    interceptionsPerGame: 0, // Not in dataset
    
    yellowCards,
    redCards,
    foulsPerGame: Math.round(foulsPerGame * 10) / 10,
    
    cornersPerGame: Math.round(cornersPerGame * 10) / 10,
    
    form,
    formPoints,
    
    attackStrength: Math.round(attackStrength * 100) / 100,
    defenseStrength: Math.round(defenseStrength * 100) / 100,
    homeAdvantage: Math.round(homeAdvantage * 100) / 100,
    
    marketWinProb: Math.round(marketWinProb * 100) / 100,
    marketDrawProb: Math.round(marketDrawProb * 100) / 100,
    marketLossProb: Math.round(marketLossProb * 100) / 100,
  };
}

// Get stats for all teams
export function getAllTeamStats(): TeamStats[] {
  return teams.map(team => calculateTeamStats(team));
}

// Get league table (sorted by points, then goal difference)
export function getLeagueTable(): TeamStats[] {
  const allStats = getAllTeamStats();
  return allStats.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });
}

// Get top scorers by xG
export function getTopXgTeams(limit: number = 5): TeamStats[] {
  const allStats = getAllTeamStats();
  return allStats
    .sort((a, b) => b.xgPerGame - a.xgPerGame)
    .slice(0, limit);
}

// Get best defenses by xG against
export function getBestDefenses(limit: number = 5): TeamStats[] {
  const allStats = getAllTeamStats();
  return allStats
    .sort((a, b) => a.xgAgainstPerGame - b.xgAgainstPerGame)
    .slice(0, limit);
}

// Get best shooting teams
export function getBestShootingTeams(limit: number = 5): TeamStats[] {
  const allStats = getAllTeamStats();
  return allStats
    .sort((a, b) => b.shotsOnTargetPerGame - a.shotsOnTargetPerGame)
    .slice(0, limit);
}

// Get most disciplined teams (fewest cards)
export function getMostDisciplinedTeams(limit: number = 5): TeamStats[] {
  const allStats = getAllTeamStats();
  return allStats
    .sort((a, b) => (a.yellowCards + a.redCards * 2) - (b.yellowCards + b.redCards * 2))
    .slice(0, limit);
}
