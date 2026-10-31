import { matchResults, teams, MatchResult } from '../data/matchResults';

export interface TeamStats {
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  
  // Home stats
  homePlayed: number;
  homeWins: number;
  homeDraws: number;
  homeLosses: number;
  homeGoalsFor: number;
  homeGoalsAgainst: number;
  
  // Away stats
  awayPlayed: number;
  awayWins: number;
  awayDraws: number;
  awayLosses: number;
  awayGoalsFor: number;
  awayGoalsAgainst: number;
  
  // Recent form (last 5 games)
  form: ('W' | 'D' | 'L')[];
  
  // Calculated metrics
  goalsScoredPerGame: number;
  goalsConcededPerGame: number;
  attackStrength: number; // Goals scored per game / league average
  defenseStrength: number; // Goals conceded per game / league average
  homeAdvantage: number; // Home goals per game / away goals per game
}

// Calculate league averages
function calculateLeagueAverages() {
  const totalHomeGoals = matchResults.reduce((sum: number, m: MatchResult) => sum + m.homeGoals, 0);
  const totalAwayGoals = matchResults.reduce((sum: number, m: MatchResult) => sum + m.awayGoals, 0);
  const totalGames = matchResults.length;
  
  return {
    avgGoalsPerGame: (totalHomeGoals + totalAwayGoals) / totalGames,
    avgHomeGoals: totalHomeGoals / totalGames,
    avgAwayGoals: totalAwayGoals / totalGames,
  };
}

// Calculate stats for a specific team
export function calculateTeamStats(teamName: string): TeamStats {
  const homeMatches = matchResults.filter((m: MatchResult) => m.homeTeam === teamName);
  const awayMatches = matchResults.filter((m: MatchResult) => m.awayTeam === teamName);
  const allMatches = [...homeMatches, ...awayMatches];
  
  // Sort by gameweek to get recent form
  allMatches.sort((a, b) => a.gameweek - b.gameweek);
  
  // Overall stats
  let wins = 0, draws = 0, losses = 0;
  let goalsFor = 0, goalsAgainst = 0;
  
  // Home stats
  let homeWins = 0, homeDraws = 0, homeLosses = 0;
  let homeGoalsFor = 0, homeGoalsAgainst = 0;
  
  // Away stats
  let awayWins = 0, awayDraws = 0, awayLosses = 0;
  let awayGoalsFor = 0, awayGoalsAgainst = 0;
  
  // Calculate overall stats
  allMatches.forEach((match: MatchResult) => {
    const isHome = match.homeTeam === teamName;
    const teamGoals = isHome ? match.homeGoals : match.awayGoals;
    const opponentGoals = isHome ? match.awayGoals : match.homeGoals;
    
    goalsFor += teamGoals;
    goalsAgainst += opponentGoals;
    
    if (teamGoals > opponentGoals) {
      wins++;
      if (isHome) homeWins++;
      else awayWins++;
    } else if (teamGoals === opponentGoals) {
      draws++;
      if (isHome) homeDraws++;
      else awayDraws++;
    } else {
      losses++;
      if (isHome) homeLosses++;
      else awayLosses++;
    }
  });
  
  // Calculate home stats
  homeMatches.forEach((match: MatchResult) => {
    homeGoalsFor += match.homeGoals;
    homeGoalsAgainst += match.awayGoals;
  });
  
  // Calculate away stats
  awayMatches.forEach((match: MatchResult) => {
    awayGoalsFor += match.awayGoals;
    awayGoalsAgainst += match.homeGoals;
  });
  
  // Recent form (last 5 games)
  const form: ('W' | 'D' | 'L')[] = [];
  const recentMatches = allMatches.slice(-5);
  recentMatches.forEach((match: MatchResult) => {
    const isHome = match.homeTeam === teamName;
    const teamGoals = isHome ? match.homeGoals : match.awayGoals;
    const opponentGoals = isHome ? match.awayGoals : match.homeGoals;
    
    if (teamGoals > opponentGoals) form.push('W');
    else if (teamGoals === opponentGoals) form.push('D');
    else form.push('L');
  });
  
  // Calculate per-game averages
  const played = allMatches.length;
  const goalsScoredPerGame = played > 0 ? goalsFor / played : 0;
  const goalsConcededPerGame = played > 0 ? goalsAgainst / played : 0;
  
  // League averages
  const leagueAvg = calculateLeagueAverages();
  
  // Attack and defense strength
  const attackStrength = leagueAvg.avgGoalsPerGame > 0 
    ? goalsScoredPerGame / leagueAvg.avgGoalsPerGame 
    : 1;
  const defenseStrength = leagueAvg.avgGoalsPerGame > 0 
    ? goalsConcededPerGame / leagueAvg.avgGoalsPerGame 
    : 1;
  
  // Home advantage
  const homeGamesPlayed = homeMatches.length;
  const awayGamesPlayed = awayMatches.length;
  const homeGoalsPerGame = homeGamesPlayed > 0 ? homeGoalsFor / homeGamesPlayed : 0;
  const awayGoalsPerGame = awayGamesPlayed > 0 ? awayGoalsFor / awayGamesPlayed : 0;
  const homeAdvantage = awayGoalsPerGame > 0 ? homeGoalsPerGame / awayGoalsPerGame : 1;
  
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
    homeDraws,
    homeLosses,
    homeGoalsFor,
    homeGoalsAgainst,
    
    awayPlayed: awayMatches.length,
    awayWins,
    awayDraws,
    awayLosses,
    awayGoalsFor,
    awayGoalsAgainst,
    
    form,
    
    goalsScoredPerGame,
    goalsConcededPerGame,
    attackStrength,
    defenseStrength,
    homeAdvantage,
  };
}

// Get stats for all teams
export function getAllTeamStats(): TeamStats[] {
  return teams.map((team: string) => calculateTeamStats(team));
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
