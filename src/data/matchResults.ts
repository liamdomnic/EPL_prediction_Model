// Match results from GW1-8
export interface MatchResult {
  gameweek: number;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
}

export const matchResults: MatchResult[] = [
  // GW1
  { gameweek: 1, homeTeam: "Arsenal", awayTeam: "Coventry City", homeGoals: 3, awayGoals: 0 },
  { gameweek: 1, homeTeam: "Hull City", awayTeam: "Manchester United", homeGoals: 2, awayGoals: 0 },
  { gameweek: 1, homeTeam: "Everton", awayTeam: "Crystal Palace", homeGoals: 2, awayGoals: 0 },
  { gameweek: 1, homeTeam: "Ipswich Town", awayTeam: "Sunderland", homeGoals: 2, awayGoals: 1 },
  { gameweek: 1, homeTeam: "Nottingham Forest", awayTeam: "Leeds United", homeGoals: 0, awayGoals: 1 },
  { gameweek: 1, homeTeam: "Brentford", awayTeam: "Tottenham Hotspur", homeGoals: 3, awayGoals: 0 },
  { gameweek: 1, homeTeam: "Brighton & Hove Albion", awayTeam: "Aston Villa", homeGoals: 4, awayGoals: 0 },
  { gameweek: 1, homeTeam: "Manchester City", awayTeam: "AFC Bournemouth", homeGoals: 2, awayGoals: 1 },
  { gameweek: 1, homeTeam: "Newcastle United", awayTeam: "Liverpool", homeGoals: 2, awayGoals: 2 },
  { gameweek: 1, homeTeam: "Fulham", awayTeam: "Chelsea", homeGoals: 2, awayGoals: 3 },
  
  // GW2
  { gameweek: 2, homeTeam: "Crystal Palace", awayTeam: "Manchester City", homeGoals: 1, awayGoals: 4 },
  { gameweek: 2, homeTeam: "Liverpool", awayTeam: "Nottingham Forest", homeGoals: 2, awayGoals: 2 },
  { gameweek: 2, homeTeam: "AFC Bournemouth", awayTeam: "Everton", homeGoals: 1, awayGoals: 1 },
  { gameweek: 2, homeTeam: "Coventry City", awayTeam: "Hull City", homeGoals: 0, awayGoals: 1 },
  { gameweek: 2, homeTeam: "Tottenham Hotspur", awayTeam: "Newcastle United", homeGoals: 0, awayGoals: 2 },
  { gameweek: 2, homeTeam: "Chelsea", awayTeam: "Brighton & Hove Albion", homeGoals: 4, awayGoals: 3 },
  { gameweek: 2, homeTeam: "Leeds United", awayTeam: "Brentford", homeGoals: 1, awayGoals: 1 },
  { gameweek: 2, homeTeam: "Sunderland", awayTeam: "Fulham", homeGoals: 1, awayGoals: 0 },
  { gameweek: 2, homeTeam: "Manchester United", awayTeam: "Ipswich Town", homeGoals: 5, awayGoals: 2 },
  { gameweek: 2, homeTeam: "Aston Villa", awayTeam: "Arsenal", homeGoals: 0, awayGoals: 1 },
  
  // GW3
  { gameweek: 3, homeTeam: "Ipswich Town", awayTeam: "Liverpool", homeGoals: 0, awayGoals: 2 },
  { gameweek: 3, homeTeam: "Newcastle United", awayTeam: "AFC Bournemouth", homeGoals: 2, awayGoals: 2 },
  { gameweek: 3, homeTeam: "Brentford", awayTeam: "Sunderland", homeGoals: 1, awayGoals: 1 },
  { gameweek: 3, homeTeam: "Brighton & Hove Albion", awayTeam: "Leeds United", homeGoals: 1, awayGoals: 1 },
  { gameweek: 3, homeTeam: "Fulham", awayTeam: "Crystal Palace", homeGoals: 2, awayGoals: 3 },
  { gameweek: 3, homeTeam: "Manchester City", awayTeam: "Coventry City", homeGoals: 1, awayGoals: 0 },
  { gameweek: 3, homeTeam: "Nottingham Forest", awayTeam: "Tottenham Hotspur", homeGoals: 0, awayGoals: 0 },
  { gameweek: 3, homeTeam: "Hull City", awayTeam: "Aston Villa", homeGoals: 0, awayGoals: 0 },
  { gameweek: 3, homeTeam: "Everton", awayTeam: "Manchester United", homeGoals: 2, awayGoals: 2 },
  { gameweek: 3, homeTeam: "Arsenal", awayTeam: "Chelsea", homeGoals: 2, awayGoals: 1 },
  
  // GW4
  { gameweek: 4, homeTeam: "Aston Villa", awayTeam: "Nottingham Forest", homeGoals: 1, awayGoals: 2 },
  { gameweek: 4, homeTeam: "AFC Bournemouth", awayTeam: "Brentford", homeGoals: 2, awayGoals: 2 },
  { gameweek: 4, homeTeam: "Chelsea", awayTeam: "Hull City", homeGoals: 2, awayGoals: 2 },
  { gameweek: 4, homeTeam: "Crystal Palace", awayTeam: "Ipswich Town", homeGoals: 2, awayGoals: 3 },
  { gameweek: 4, homeTeam: "Liverpool", awayTeam: "Fulham", homeGoals: 0, awayGoals: 0 },
  { gameweek: 4, homeTeam: "Tottenham Hotspur", awayTeam: "Everton", homeGoals: 0, awayGoals: 0 },
  { gameweek: 4, homeTeam: "Sunderland", awayTeam: "Arsenal", homeGoals: 0, awayGoals: 2 },
  { gameweek: 4, homeTeam: "Coventry City", awayTeam: "Brighton & Hove Albion", homeGoals: 0, awayGoals: 5 },
  { gameweek: 4, homeTeam: "Manchester United", awayTeam: "Manchester City", homeGoals: 0, awayGoals: 1 },
  { gameweek: 4, homeTeam: "Leeds United", awayTeam: "Newcastle United", homeGoals: 4, awayGoals: 1 },
  
  // GW5
  { gameweek: 5, homeTeam: "Brentford", awayTeam: "Chelsea", homeGoals: 3, awayGoals: 0 },
  { gameweek: 5, homeTeam: "Tottenham Hotspur", awayTeam: "Aston Villa", homeGoals: 2, awayGoals: 3 },
  { gameweek: 5, homeTeam: "Brighton & Hove Albion", awayTeam: "Arsenal", homeGoals: 3, awayGoals: 0 },
  { gameweek: 5, homeTeam: "Everton", awayTeam: "Ipswich Town", homeGoals: 1, awayGoals: 0 },
  { gameweek: 5, homeTeam: "Newcastle United", awayTeam: "Hull City", homeGoals: 2, awayGoals: 1 },
  { gameweek: 5, homeTeam: "Nottingham Forest", awayTeam: "Coventry City", homeGoals: 0, awayGoals: 1 },
  { gameweek: 5, homeTeam: "AFC Bournemouth", awayTeam: "Liverpool", homeGoals: 0, awayGoals: 1 },
  { gameweek: 5, homeTeam: "Leeds United", awayTeam: "Crystal Palace", homeGoals: 0, awayGoals: 0 },
  { gameweek: 5, homeTeam: "Manchester City", awayTeam: "Sunderland", homeGoals: 5, awayGoals: 3 },
  { gameweek: 5, homeTeam: "Fulham", awayTeam: "Manchester United", homeGoals: 1, awayGoals: 1 },
  
  // GW6
  { gameweek: 6, homeTeam: "Arsenal", awayTeam: "Leeds United", homeGoals: 2, awayGoals: 1 },
  { gameweek: 6, homeTeam: "Aston Villa", awayTeam: "Brentford", homeGoals: 2, awayGoals: 2 },
  { gameweek: 6, homeTeam: "Chelsea", awayTeam: "AFC Bournemouth", homeGoals: 5, awayGoals: 1 },
  { gameweek: 6, homeTeam: "Ipswich Town", awayTeam: "Fulham", homeGoals: 2, awayGoals: 1 },
  { gameweek: 6, homeTeam: "Sunderland", awayTeam: "Brighton & Hove Albion", homeGoals: 0, awayGoals: 2 },
  { gameweek: 6, homeTeam: "Manchester United", awayTeam: "Tottenham Hotspur", homeGoals: 1, awayGoals: 1 },
  { gameweek: 6, homeTeam: "Crystal Palace", awayTeam: "Nottingham Forest", homeGoals: 3, awayGoals: 1 },
  { gameweek: 6, homeTeam: "Hull City", awayTeam: "Everton", homeGoals: 2, awayGoals: 2 },
  { gameweek: 6, homeTeam: "Liverpool", awayTeam: "Manchester City", homeGoals: 0, awayGoals: 3 },
  { gameweek: 6, homeTeam: "Coventry City", awayTeam: "Newcastle United", homeGoals: 4, awayGoals: 1 },
  
  // GW7
  { gameweek: 7, homeTeam: "Everton", awayTeam: "Chelsea", homeGoals: 0, awayGoals: 2 },
  { gameweek: 7, homeTeam: "Fulham", awayTeam: "Hull City", homeGoals: 1, awayGoals: 0 },
  { gameweek: 7, homeTeam: "Manchester City", awayTeam: "Ipswich Town", homeGoals: 3, awayGoals: 2 },
  { gameweek: 7, homeTeam: "Brentford", awayTeam: "Liverpool", homeGoals: 1, awayGoals: 2 },
  { gameweek: 7, homeTeam: "Newcastle United", awayTeam: "Aston Villa", homeGoals: 0, awayGoals: 1 },
  { gameweek: 7, homeTeam: "Brighton & Hove Albion", awayTeam: "Crystal Palace", homeGoals: 5, awayGoals: 0 },
  { gameweek: 7, homeTeam: "AFC Bournemouth", awayTeam: "Sunderland", homeGoals: 2, awayGoals: 0 },
  { gameweek: 7, homeTeam: "Leeds United", awayTeam: "Manchester United", homeGoals: 1, awayGoals: 1 },
  { gameweek: 7, homeTeam: "Nottingham Forest", awayTeam: "Arsenal", homeGoals: 0, awayGoals: 1 },
  { gameweek: 7, homeTeam: "Tottenham Hotspur", awayTeam: "Coventry City", homeGoals: 3, awayGoals: 1 },
  
  // GW8
  { gameweek: 8, homeTeam: "Ipswich Town", awayTeam: "Nottingham Forest", homeGoals: 1, awayGoals: 1 },
  { gameweek: 8, homeTeam: "Aston Villa", awayTeam: "Manchester City", homeGoals: 2, awayGoals: 1 },
  { gameweek: 8, homeTeam: "Coventry City", awayTeam: "Fulham", homeGoals: 0, awayGoals: 1 },
  { gameweek: 8, homeTeam: "Arsenal", awayTeam: "Everton", homeGoals: 2, awayGoals: 0 },
  { gameweek: 8, homeTeam: "Chelsea", awayTeam: "Tottenham Hotspur", homeGoals: 0, awayGoals: 2 },
  { gameweek: 8, homeTeam: "Hull City", awayTeam: "Brentford", homeGoals: 1, awayGoals: 1 },
  { gameweek: 8, homeTeam: "Liverpool", awayTeam: "Brighton & Hove Albion", homeGoals: 2, awayGoals: 0 },
  { gameweek: 8, homeTeam: "Manchester United", awayTeam: "AFC Bournemouth", homeGoals: 0, awayGoals: 3 },
  { gameweek: 8, homeTeam: "Crystal Palace", awayTeam: "Newcastle United", homeGoals: 0, awayGoals: 2 },
  { gameweek: 8, homeTeam: "Sunderland", awayTeam: "Leeds United", homeGoals: 0, awayGoals: 0 },
];

// Get all unique teams
export const teams = Array.from(new Set([
  ...matchResults.map(m => m.homeTeam),
  ...matchResults.map(m => m.awayTeam)
])).sort();
