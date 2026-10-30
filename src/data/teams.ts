export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  textColor: string;
  attackStrength: number;
  defenseStrength: number;
  homeAdvantage: number;
  form: number[]; // last 5 results: 3=win, 1=draw, 0=loss
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  homePlayed: number;
  homeWon: number;
  homeDrawn: number;
  homeLost: number;
  homeGF: number;
  homeGA: number;
  awayPlayed: number;
  awayWon: number;
  awayDrawn: number;
  awayLost: number;
  awayGF: number;
  awayGA: number;
}

// Calculated from GW1-GW8 data (80 matches)
export const LEAGUE_AVG_GOALS_HOME = 1.49; // 119 home goals / 80 matches
export const LEAGUE_AVG_GOALS_AWAY = 1.26; // 101 away goals / 80 matches
export const LEAGUE_AVG_GOALS = 1.375; // 220 total / 160 team-games

export const teams: Team[] = [
  {
    id: "mci",
    name: "Manchester City",
    shortName: "MCI",
    color: "#6CABDD",
    textColor: "#1C2C5B",
    attackStrength: 1.82,  // 2.5 goals/game / 1.375
    defenseStrength: 0.82, // 1.125 conceded/game / 1.375
    homeAdvantage: 1.25,
    form: [3, 3, 3, 3, 0], // GW4-8: W,W,W,W,L
    played: 8, won: 7, drawn: 0, lost: 1,
    goalsFor: 20, goalsAgainst: 9, points: 21,
    homePlayed: 4, homeWon: 4, homeDrawn: 0, homeLost: 0, homeGF: 11, homeGA: 6,
    awayPlayed: 4, awayWon: 3, awayDrawn: 0, awayLost: 1, awayGF: 9, awayGA: 3,
  },
  {
    id: "ars",
    name: "Arsenal",
    shortName: "ARS",
    color: "#EF0107",
    textColor: "#FFFFFF",
    attackStrength: 1.18,  // 1.625 / 1.375
    defenseStrength: 0.45, // 0.625 / 1.375
    homeAdvantage: 1.30,
    form: [3, 0, 3, 3, 3], // GW4-8: W,L,W,W,W
    played: 8, won: 7, drawn: 0, lost: 1,
    goalsFor: 13, goalsAgainst: 5, points: 21,
    homePlayed: 4, homeWon: 4, homeDrawn: 0, homeLost: 0, homeGF: 9, homeGA: 2,
    awayPlayed: 4, awayWon: 3, awayDrawn: 0, awayLost: 1, awayGF: 4, awayGA: 3,
  },
  {
    id: "bri",
    name: "Brighton & Hove Albion",
    shortName: "BHA",
    color: "#0057B8",
    textColor: "#FFFFFF",
    attackStrength: 2.09,  // 2.875 / 1.375 - BEST ATTACK
    defenseStrength: 0.64, // 0.875 / 1.375
    homeAdvantage: 1.20,
    form: [3, 3, 3, 3, 0], // GW4-8: W,W,W,W,L
    played: 8, won: 6, drawn: 1, lost: 1,
    goalsFor: 23, goalsAgainst: 7, points: 19,
    homePlayed: 4, homeWon: 3, homeDrawn: 1, homeLost: 0, homeGF: 13, homeGA: 1,
    awayPlayed: 4, awayWon: 3, awayDrawn: 0, awayLost: 1, awayGF: 10, awayGA: 6,
  },
  {
    id: "liv",
    name: "Liverpool",
    shortName: "LIV",
    color: "#C8102E",
    textColor: "#FFFFFF",
    attackStrength: 1.0,   // 1.375 / 1.375
    defenseStrength: 0.73, // 1.0 / 1.375
    homeAdvantage: 1.30,
    form: [1, 3, 0, 3, 3], // GW4-8: D,W,L,W,W
    played: 8, won: 4, drawn: 3, lost: 1,
    goalsFor: 11, goalsAgainst: 8, points: 15,
    homePlayed: 4, homeWon: 1, homeDrawn: 2, homeLost: 1, homeGF: 4, homeGA: 5,
    awayPlayed: 4, awayWon: 3, awayDrawn: 1, awayLost: 0, awayGF: 7, awayGA: 3,
  },
  {
    id: "che",
    name: "Chelsea",
    shortName: "CHE",
    color: "#034694",
    textColor: "#FFFFFF",
    attackStrength: 1.55,  // 2.125 / 1.375
    defenseStrength: 1.36, // 1.875 / 1.375
    homeAdvantage: 1.22,
    form: [1, 0, 3, 3, 0], // GW4-8: D,L,W,W,L
    played: 8, won: 4, drawn: 1, lost: 3,
    goalsFor: 17, goalsAgainst: 15, points: 13,
    homePlayed: 4, homeWon: 2, homeDrawn: 1, homeLost: 1, homeGF: 11, homeGA: 8,
    awayPlayed: 4, awayWon: 2, awayDrawn: 0, awayLost: 2, awayGF: 6, awayGA: 7,
  },
  {
    id: "bre",
    name: "Brentford",
    shortName: "BRE",
    color: "#E30613",
    textColor: "#FFFFFF",
    attackStrength: 1.27,  // 1.75 / 1.375
    defenseStrength: 0.82, // 1.125 / 1.375
    homeAdvantage: 1.28,
    form: [3, 1, 0, 1, 1], // GW4-8: D,W,D,L,D
    played: 8, won: 2, drawn: 5, lost: 1,
    goalsFor: 14, goalsAgainst: 9, points: 11,
    homePlayed: 4, homeWon: 1, homeDrawn: 2, homeLost: 1, homeGF: 8, homeGA: 4,
    awayPlayed: 4, awayWon: 1, awayDrawn: 3, awayLost: 0, awayGF: 6, awayGA: 5,
  },
  {
    id: "lee",
    name: "Leeds United",
    shortName: "LEE",
    color: "#FFFFFF",
    textColor: "#1D428A",
    attackStrength: 0.82,  // 1.125 / 1.375
    defenseStrength: 0.55, // 0.75 / 1.375
    homeAdvantage: 1.25,
    form: [1, 0, 1, 1, 1], // GW4-8: W,D,L,D,D
    played: 8, won: 2, drawn: 5, lost: 1,
    goalsFor: 9, goalsAgainst: 6, points: 11,
    homePlayed: 4, homeWon: 1, homeDrawn: 3, homeLost: 0, homeGF: 6, homeGA: 3,
    awayPlayed: 4, awayWon: 1, awayDrawn: 2, awayLost: 1, awayGF: 3, awayGA: 3,
  },
  {
    id: "avl",
    name: "Aston Villa",
    shortName: "AVL",
    color: "#670E36",
    textColor: "#95BFE5",
    attackStrength: 0.82,  // 1.125 / 1.375
    defenseStrength: 1.09, // 1.5 / 1.375
    homeAdvantage: 1.20,
    form: [0, 3, 1, 3, 3], // GW4-8: L,W,D,W,W
    played: 8, won: 3, drawn: 2, lost: 3,
    goalsFor: 9, goalsAgainst: 12, points: 11,
    homePlayed: 4, homeWon: 1, homeDrawn: 1, homeLost: 2, homeGF: 3, homeGA: 5,
    awayPlayed: 4, awayWon: 2, awayDrawn: 1, awayLost: 1, awayGF: 6, awayGA: 7,
  },
  {
    id: "new",
    name: "Newcastle United",
    shortName: "NEW",
    color: "#241F20",
    textColor: "#FFFFFF",
    attackStrength: 1.09,  // 1.5 / 1.375
    defenseStrength: 1.27, // 1.75 / 1.375
    homeAdvantage: 1.25,
    form: [0, 3, 0, 0, 3], // GW4-8: L,W,L,L,W
    played: 8, won: 3, drawn: 2, lost: 3,
    goalsFor: 12, goalsAgainst: 14, points: 11,
    homePlayed: 4, homeWon: 2, homeDrawn: 1, homeLost: 1, homeGF: 6, homeGA: 4,
    awayPlayed: 4, awayWon: 1, awayDrawn: 1, awayLost: 2, awayGF: 6, awayGA: 10,
  },
  {
    id: "hul",
    name: "Hull City",
    shortName: "HUL",
    color: "#F0AB00",
    textColor: "#000000",
    attackStrength: 0.82,  // 1.125 / 1.375
    defenseStrength: 0.73, // 1.0 / 1.375
    homeAdvantage: 1.18,
    form: [0, 1, 0, 1, 1], // GW4-8: D,L,D,L,D
    played: 8, won: 2, drawn: 4, lost: 2,
    goalsFor: 9, goalsAgainst: 8, points: 10,
    homePlayed: 4, homeWon: 1, homeDrawn: 2, homeLost: 1, homeGF: 5, homeGA: 4,
    awayPlayed: 4, awayWon: 1, awayDrawn: 2, awayLost: 1, awayGF: 4, awayGA: 4,
  },
  {
    id: "eve",
    name: "Everton",
    shortName: "EVE",
    color: "#003399",
    textColor: "#FFFFFF",
    attackStrength: 0.73,  // 1.0 / 1.375
    defenseStrength: 0.82, // 1.125 / 1.375
    homeAdvantage: 1.22,
    form: [1, 3, 1, 0, 0], // GW4-8: D,W,D,L,L
    played: 8, won: 2, drawn: 4, lost: 2,
    goalsFor: 8, goalsAgainst: 9, points: 10,
    homePlayed: 4, homeWon: 2, homeDrawn: 1, homeLost: 1, homeGF: 5, homeGA: 2,
    awayPlayed: 4, awayWon: 0, awayDrawn: 3, awayLost: 1, awayGF: 3, awayGA: 7,
  },
  {
    id: "ips",
    name: "Ipswich Town",
    shortName: "IPS",
    color: "#3A64A3",
    textColor: "#FFFFFF",
    attackStrength: 1.09,  // 1.5 / 1.375
    defenseStrength: 1.45, // 2.0 / 1.375
    homeAdvantage: 1.15,
    form: [3, 0, 3, 0, 1], // GW4-8: W,L,W,L,D
    played: 8, won: 3, drawn: 1, lost: 4,
    goalsFor: 12, goalsAgainst: 16, points: 10,
    homePlayed: 4, homeWon: 2, homeDrawn: 1, homeLost: 1, homeGF: 5, homeGA: 5,
    awayPlayed: 4, awayWon: 1, awayDrawn: 0, awayLost: 3, awayGF: 7, awayGA: 11,
  },
  {
    id: "bou",
    name: "AFC Bournemouth",
    shortName: "BOU",
    color: "#DA291C",
    textColor: "#000000",
    attackStrength: 1.09,  // 1.5 / 1.375
    defenseStrength: 1.18, // 1.625 / 1.375
    homeAdvantage: 1.18,
    form: [1, 0, 0, 3, 3], // GW4-8: D,L,L,W,W
    played: 8, won: 2, drawn: 3, lost: 3,
    goalsFor: 12, goalsAgainst: 13, points: 9,
    homePlayed: 4, homeWon: 1, homeDrawn: 2, homeLost: 1, homeGF: 6, homeGA: 6,
    awayPlayed: 4, awayWon: 1, awayDrawn: 1, awayLost: 2, awayGF: 6, awayGA: 7,
  },
  {
    id: "tot",
    name: "Tottenham Hotspur",
    shortName: "TOT",
    color: "#132257",
    textColor: "#FFFFFF",
    attackStrength: 0.73,  // 1.0 / 1.375
    defenseStrength: 0.91, // 1.25 / 1.375
    homeAdvantage: 1.20,
    form: [1, 0, 1, 3, 3], // GW4-8: D,L,D,W,W
    played: 8, won: 2, drawn: 3, lost: 3,
    goalsFor: 8, goalsAgainst: 10, points: 9,
    homePlayed: 4, homeWon: 1, homeDrawn: 2, homeLost: 1, homeGF: 5, homeGA: 6,
    awayPlayed: 4, awayWon: 1, awayDrawn: 1, awayLost: 2, awayGF: 3, awayGA: 4,
  },
  {
    id: "ful",
    name: "Fulham",
    shortName: "FUL",
    color: "#000000",
    textColor: "#FFFFFF",
    attackStrength: 0.73,  // 1.0 / 1.375
    defenseStrength: 0.91, // 1.25 / 1.375
    homeAdvantage: 1.20,
    form: [1, 1, 0, 3, 3], // GW4-8: D,D,L,W,W
    played: 8, won: 2, drawn: 2, lost: 4,
    goalsFor: 8, goalsAgainst: 10, points: 8,
    homePlayed: 4, homeWon: 1, homeDrawn: 1, homeLost: 2, homeGF: 4, homeGA: 6,
    awayPlayed: 4, awayWon: 1, awayDrawn: 1, awayLost: 2, awayGF: 4, awayGA: 4,
  },
  {
    id: "mun",
    name: "Manchester United",
    shortName: "MUN",
    color: "#DA291C",
    textColor: "#FBE122",
    attackStrength: 0.91,  // 1.25 / 1.375
    defenseStrength: 1.18, // 1.625 / 1.375
    homeAdvantage: 1.18,
    form: [1, 1, 1, 0, 0], // GW4-8: D,D,D,L,L
    played: 8, won: 1, drawn: 4, lost: 3,
    goalsFor: 10, goalsAgainst: 13, points: 7,
    homePlayed: 4, homeWon: 1, homeDrawn: 1, homeLost: 2, homeGF: 6, homeGA: 7,
    awayPlayed: 4, awayWon: 0, awayDrawn: 3, awayLost: 1, awayGF: 4, awayGA: 6,
  },
  {
    id: "cry",
    name: "Crystal Palace",
    shortName: "CRY",
    color: "#1B458F",
    textColor: "#C4122E",
    attackStrength: 0.82,  // 1.125 / 1.375
    defenseStrength: 1.73, // 2.375 / 1.375 - WORST DEFENSE
    homeAdvantage: 1.15,
    form: [1, 3, 0, 0, 0], // GW4-8: D,W,L,L,L
    played: 8, won: 2, drawn: 1, lost: 5,
    goalsFor: 9, goalsAgainst: 19, points: 7,
    homePlayed: 4, homeWon: 1, homeDrawn: 0, homeLost: 3, homeGF: 6, homeGA: 10,
    awayPlayed: 4, awayWon: 1, awayDrawn: 1, awayLost: 2, awayGF: 3, awayGA: 9,
  },
  {
    id: "nfo",
    name: "Nottingham Forest",
    shortName: "NFO",
    color: "#DD0000",
    textColor: "#FFFFFF",
    attackStrength: 0.55,  // 0.75 / 1.375
    defenseStrength: 0.91, // 1.25 / 1.375
    homeAdvantage: 1.10,
    form: [3, 0, 0, 0, 1], // GW4-8: W,L,L,L,D
    played: 8, won: 1, drawn: 3, lost: 4,
    goalsFor: 6, goalsAgainst: 10, points: 6,
    homePlayed: 4, homeWon: 0, homeDrawn: 1, homeLost: 3, homeGF: 0, homeGA: 4,
    awayPlayed: 4, awayWon: 1, awayDrawn: 2, awayLost: 1, awayGF: 6, awayGA: 6,
  },
  {
    id: "cov",
    name: "Coventry City",
    shortName: "COV",
    color: "#123456",
    textColor: "#FFFFFF",
    attackStrength: 0.55,  // 0.75 / 1.375
    defenseStrength: 1.36, // 1.875 / 1.375
    homeAdvantage: 1.12,
    form: [0, 3, 3, 0, 0], // GW4-8: L,W,W,L,L
    played: 8, won: 2, drawn: 0, lost: 6,
    goalsFor: 6, goalsAgainst: 15, points: 6,
    homePlayed: 4, homeWon: 1, homeDrawn: 0, homeLost: 3, homeGF: 4, homeGA: 8,
    awayPlayed: 4, awayWon: 1, awayDrawn: 0, awayLost: 3, awayGF: 2, awayGA: 7,
  },
  {
    id: "sun",
    name: "Sunderland",
    shortName: "SUN",
    color: "#FF0000",
    textColor: "#FFFFFF",
    attackStrength: 0.55,  // 0.75 / 1.375
    defenseStrength: 1.27, // 1.75 / 1.375
    homeAdvantage: 1.10,
    form: [0, 0, 0, 0, 1], // GW4-8: L,L,L,L,D
    played: 8, won: 1, drawn: 2, lost: 5,
    goalsFor: 6, goalsAgainst: 14, points: 5,
    homePlayed: 4, homeWon: 1, homeDrawn: 1, homeLost: 2, homeGF: 1, homeGA: 4,
    awayPlayed: 4, awayWon: 0, awayDrawn: 1, awayLost: 3, awayGF: 5, awayGA: 10,
  },
];



export interface Fixture {
  homeTeam: string;
  awayTeam: string;
  week: number;
}

// Gameweek 9 fixtures (projected matchups)
export const upcomingFixtures: Fixture[] = [
  { homeTeam: "che", awayTeam: "mun", week: 9 },
  { homeTeam: "bou", awayTeam: "lee", week: 9 },
  { homeTeam: "bre", awayTeam: "nfo", week: 9 },
  { homeTeam: "cov", awayTeam: "sun", week: 9 },
  { homeTeam: "hul", awayTeam: "ips", week: 9 },
  { homeTeam: "mci", awayTeam: "bri", week: 9 },
  { homeTeam: "tot", awayTeam: "cry", week: 9 },
  { homeTeam: "avl", awayTeam: "ful", week: 9 },
  { homeTeam: "liv", awayTeam: "ars", week: 9 },
  { homeTeam: "new", awayTeam: "eve", week: 9 },
];
