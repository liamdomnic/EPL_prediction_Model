// GW9 Match Results with Goalscorers and Assists
export interface GW9MatchEvent {
  match: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeCleanSheet: boolean;
  awayCleanSheet: boolean;
  goals: Array<{
    player: string;
    team: string;
    minute: string;
    type: 'goal' | 'own_goal';
  }>;
  assists: Array<{
    player: string;
    team: string;
  }>;
}

export const gw9MatchEvents: GW9MatchEvent[] = [
  {
    match: 'Chelsea vs Manchester United',
    homeTeam: 'Chelsea',
    awayTeam: 'Manchester United',
    homeScore: 2,
    awayScore: 0,
    homeCleanSheet: true,
    awayCleanSheet: false,
    goals: [
      { player: 'Rogers', team: 'Chelsea', minute: '50', type: 'goal' },
      { player: 'Palmer', team: 'Chelsea', minute: '64', type: 'goal' }
    ],
    assists: [
      { player: 'Lavia', team: 'Chelsea' }
    ]
  },
  {
    match: 'Bournemouth vs Leeds',
    homeTeam: 'Bournemouth',
    awayTeam: 'Leeds',
    homeScore: 2,
    awayScore: 0,
    homeCleanSheet: true,
    awayCleanSheet: false,
    goals: [
      { player: 'Evanilson', team: 'Bournemouth', minute: '31', type: 'goal' },
      { player: 'Adli', team: 'Bournemouth', minute: '90+4', type: 'goal' }
    ],
    assists: [
      { player: 'Kroupi.Jr', team: 'Bournemouth' }
    ]
  },
  {
    match: 'Brentford vs Nottingham Forest',
    homeTeam: 'Brentford',
    awayTeam: 'Nottingham Forest',
    homeScore: 2,
    awayScore: 0,
    homeCleanSheet: true,
    awayCleanSheet: false,
    goals: [
      { player: 'Thiago', team: 'Brentford', minute: '76', type: 'goal' },
      { player: 'Kayode', team: 'Brentford', minute: '68', type: 'goal' }
    ],
    assists: []
  },
  {
    match: 'Coventry vs Sunderland',
    homeTeam: 'Coventry',
    awayTeam: 'Sunderland',
    homeScore: 3,
    awayScore: 1,
    homeCleanSheet: false,
    awayCleanSheet: false,
    goals: [
      { player: 'Sakamoto', team: 'Coventry', minute: '17', type: 'goal' },
      { player: 'Awoniyi', team: 'Coventry', minute: '37', type: 'goal' },
      { player: 'Rudoni', team: 'Coventry', minute: '52', type: 'goal' }
    ],
    assists: [
      { player: 'Torp', team: 'Coventry' }
    ]
  },
  {
    match: 'Hull vs Ipswich',
    homeTeam: 'Hull',
    awayTeam: 'Ipswich',
    homeScore: 2,
    awayScore: 2,
    homeCleanSheet: false,
    awayCleanSheet: false,
    goals: [
      { player: 'Florentino', team: 'Hull', minute: '22', type: 'goal' },
      { player: 'McBurnie', team: 'Hull', minute: '68', type: 'goal' },
      { player: 'Iroegbunam', team: 'Ipswich', minute: '58', type: 'goal' },
      { player: 'Enciso', team: 'Ipswich', minute: '74', type: 'goal' }
    ],
    assists: [
      { player: 'Palacios', team: 'Ipswich' }
    ]
  },
  {
    match: 'Man City vs Brighton',
    homeTeam: 'Man City',
    awayTeam: 'Brighton',
    homeScore: 0,
    awayScore: 1,
    homeCleanSheet: false,
    awayCleanSheet: true,
    goals: [
      { player: 'Ayari', team: 'Brighton', minute: '11', type: 'goal' }
    ],
    assists: [
      { player: 'De Cuyper', team: 'Brighton' }
    ]
  },
  {
    match: 'Tottenham vs Crystal Palace',
    homeTeam: 'Tottenham',
    awayTeam: 'Crystal Palace',
    homeScore: 2,
    awayScore: 0,
    homeCleanSheet: true,
    awayCleanSheet: false,
    goals: [
      { player: 'Gray', team: 'Tottenham', minute: 'unknown', type: 'goal' },
      { player: 'Van Hecke', team: 'Tottenham', minute: '73', type: 'goal' }
    ],
    assists: [
      { player: 'Bergvall', team: 'Tottenham' }
    ]
  },
  {
    match: 'Aston Villa vs Fulham',
    homeTeam: 'Aston Villa',
    awayTeam: 'Fulham',
    homeScore: 1,
    awayScore: 1,
    homeCleanSheet: false,
    awayCleanSheet: false,
    goals: [
      { player: 'N.Jackson', team: 'Aston Villa', minute: '39', type: 'goal' },
      { player: 'Suzuki', team: 'Aston Villa', minute: '64', type: 'own_goal' }
    ],
    assists: [
      { player: 'Manzambi', team: 'Aston Villa' }
    ]
  },
  {
    match: 'Liverpool vs Arsenal',
    homeTeam: 'Liverpool',
    awayTeam: 'Arsenal',
    homeScore: 0,
    awayScore: 1,
    homeCleanSheet: false,
    awayCleanSheet: true,
    goals: [
      { player: 'Havertz', team: 'Arsenal', minute: 'unknown', type: 'goal' }
    ],
    assists: []
  },
  {
    match: 'Newcastle vs Everton',
    homeTeam: 'Newcastle',
    awayTeam: 'Everton',
    homeScore: 0,
    awayScore: 1,
    homeCleanSheet: false,
    awayCleanSheet: true,
    goals: [
      { player: 'Barry', team: 'Everton', minute: '49', type: 'goal' }
    ],
    assists: [
      { player: 'Röhl', team: 'Everton' }
    ]
  }
];

// Calculate GW9 points for each player
export function calculateGW9Points(): Map<string, { points: number; goals: number; assists: number; cleanSheet: boolean }> {
  const playerStats = new Map<string, { points: number; goals: number; assists: number; cleanSheet: boolean }>();

  // Initialize all players with 0 points
  const allTeams = ['Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton', 'Chelsea', 'Coventry', 'Crystal Palace', 'Everton', 'Fulham', 'Hull', 'Ipswich', 'Leeds', 'Liverpool', 'Man City', 'Man Utd', 'Newcastle', 'Nott\'m Forest', 'Sunderland', 'Tottenham'];
  
  // Process each match
  gw9MatchEvents.forEach(match => {
    // Award clean sheet points to defenders and goalkeepers
    if (match.homeCleanSheet) {
      // Home team kept clean sheet
      // We'll handle this in the player database update
    }
    if (match.awayCleanSheet) {
      // Away team kept clean sheet
      // We'll handle this in the player database update
    }

    // Award points for goals
    match.goals.forEach(goal => {
      if (goal.type === 'own_goal') {
        // Own goal: -2 points (not implemented in custom scoring, but noted)
        return;
      }
      
      const key = `${goal.player}_${goal.team}`;
      if (!playerStats.has(key)) {
        playerStats.set(key, { points: 0, goals: 0, assists: 0, cleanSheet: false });
      }
      const stats = playerStats.get(key)!;
      stats.goals += 1;
      stats.points += 6; // 6 points for goal
    });

    // Award points for assists
    match.assists.forEach(assist => {
      const key = `${assist.player}_${assist.team}`;
      if (!playerStats.has(key)) {
        playerStats.set(key, { points: 0, goals: 0, assists: 0, cleanSheet: false });
      }
      const stats = playerStats.get(key)!;
      stats.assists += 1;
      stats.points += 4; // 4 points for assist
    });
  });

  return playerStats;
}
