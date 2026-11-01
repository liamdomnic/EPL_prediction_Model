// Comprehensive match data from football-data.co.uk
export interface MatchData {
  date: string;
  homeTeam: string;
  awayTeam: string;
  // Full time results
  fthg: number; // Full time home goals
  ftag: number; // Full time away goals
  ftr: 'H' | 'D' | 'A'; // Full time result
  // Half time results
  hthg: number;
  htag: number;
  htr: 'H' | 'D' | 'A';
  // Referee
  referee: string;
  // Expected goals
  hxg: number; // Home xG
  axg: number; // Away xG
  // Shots
  hs: number; // Home shots
  as: number; // Away shots
  hst: number; // Home shots on target
  ast: number; // Away shots on target
  // Fouls & Cards
  hf: number; // Home fouls
  af: number; // Away fouls
  hc: number; // Home corners
  ac: number; // Away corners
  hy: number; // Home yellow cards
  ay: number; // Away yellow cards
  hr: number; // Home red cards
  ar: number; // Away red cards
  // Betting odds (average)
  avgh: number; // Average home win odds
  avgd: number; // Average draw odds
  avga: number; // Average away win odds
  avgOver25: number; // Average over 2.5 goals odds
  avgUnder25: number; // Average under 2.5 goals odds
  // Asian handicap
  ahLine: number; // Asian handicap line
}

export const matchData: MatchData[] = [
  // GW1
  { date: "21/08/2026", homeTeam: "Arsenal", awayTeam: "Coventry", fthg: 3, ftag: 0, ftr: "H", hthg: 2, htag: 0, htr: "H", referee: "T Bramall", hxg: 1.88, axg: 0.2, hs: 20, as: 4, hst: 6, ast: 1, hf: 10, af: 13, hc: 8, ac: 2, hy: 1, ay: 1, hr: 0, ar: 0, avgh: 1.19, avgd: 7, avga: 15, avgOver25: 1.57, avgUnder25: 2.38, ahLine: -2 },
  { date: "22/08/2026", homeTeam: "Hull", awayTeam: "Man United", fthg: 2, ftag: 0, ftr: "H", hthg: 2, htag: 0, htr: "H", referee: "D England", hxg: 1.01, axg: 1.83, hs: 8, as: 21, hst: 4, ast: 5, hf: 10, af: 9, hc: 1, ac: 6, hy: 2, ay: 1, hr: 0, ar: 0, avgh: 8.37, avgd: 4.93, avga: 1.36, avgOver25: 1.67, avgUnder25: 2.2, ahLine: 1.5 },
  { date: "22/08/2026", homeTeam: "Everton", awayTeam: "Crystal Palace", fthg: 2, ftag: 0, ftr: "H", hthg: 1, htag: 0, htr: "H", referee: "P Tierney", hxg: 1.12, axg: 1.96, hs: 16, as: 11, hst: 5, ast: 4, hf: 5, af: 15, hc: 4, ac: 0, hy: 0, ay: 1, hr: 0, ar: 0, avgh: 2.15, avgd: 3.5, avga: 3.3, avgOver25: 1.95, avgUnder25: 1.9, ahLine: -0.25 },
  { date: "22/08/2026", homeTeam: "Ipswich", awayTeam: "Sunderland", fthg: 2, ftag: 1, ftr: "H", hthg: 1, htag: 1, htr: "D", referee: "F Hallam", hxg: 1.8, axg: 0.66, hs: 10, as: 11, hst: 3, ast: 4, hf: 12, af: 14, hc: 3, ac: 5, hy: 0, ay: 3, hr: 0, ar: 0, avgh: 2.68, avgd: 3.29, avga: 2.6, avgOver25: 1.98, avgUnder25: 1.88, ahLine: 0 },
  { date: "22/08/2026", homeTeam: "Nott'm Forest", awayTeam: "Leeds", fthg: 0, ftag: 1, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "R Jones", hxg: 0.66, axg: 0.47, hs: 12, as: 11, hst: 2, ast: 3, hf: 15, af: 14, hc: 3, ac: 2, hy: 2, ay: 1, hr: 0, ar: 0, avgh: 2.27, avgd: 3.35, avga: 3.1, avgOver25: 1.98, avgUnder25: 1.88, ahLine: -0.25 },
  { date: "22/08/2026", homeTeam: "Brentford", awayTeam: "Tottenham", fthg: 3, ftag: 0, ftr: "H", hthg: 2, htag: 0, htr: "H", referee: "M Oliver", hxg: 3.88, axg: 0.57, hs: 26, as: 9, hst: 8, ast: 4, hf: 17, af: 14, hc: 7, ac: 3, hy: 1, ay: 1, hr: 0, ar: 0, avgh: 2.48, avgd: 3.58, avga: 2.69, avgOver25: 1.67, avgUnder25: 2.2, ahLine: -0.5 },
  { date: "23/08/2026", homeTeam: "Brighton", awayTeam: "Aston Villa", fthg: 4, ftag: 0, ftr: "H", hthg: 4, htag: 0, htr: "H", referee: "P Bankes", hxg: 3.77, axg: 0.28, hs: 21, as: 6, hst: 6, ast: 0, hf: 12, af: 11, hc: 5, ac: 2, hy: 2, ay: 3, hr: 0, ar: 1, avgh: 2.19, avgd: 3.54, avga: 3.08, avgOver25: 1.73, avgUnder25: 2.1, ahLine: -0.25 },
  { date: "23/08/2026", homeTeam: "Man City", awayTeam: "Bournemouth", fthg: 2, ftag: 1, ftr: "H", hthg: 0, htag: 1, htr: "A", referee: "J Gillett", hxg: 2.36, axg: 0.63, hs: 13, as: 5, hst: 6, ast: 4, hf: 11, af: 11, hc: 8, ac: 3, hy: 1, ay: 2, hr: 0, ar: 0, avgh: 1.45, avgd: 4.72, avga: 5.93, avgOver25: 1.44, avgUnder25: 2.75, ahLine: -1.25 },
  { date: "23/08/2026", homeTeam: "Newcastle", awayTeam: "Liverpool", fthg: 2, ftag: 2, ftr: "D", hthg: 1, htag: 0, htr: "H", referee: "S Attwell", hxg: 1.57, axg: 2.98, hs: 13, as: 27, hst: 4, ast: 7, hf: 16, af: 15, hc: 2, ac: 6, hy: 5, ay: 3, hr: 0, ar: 0, avgh: 2.5, avgd: 3.66, avga: 3.82, avgOver25: 1.5, avgUnder25: 2.63, ahLine: 0.5 },
  { date: "24/08/2026", homeTeam: "Fulham", awayTeam: "Chelsea", fthg: 2, ftag: 3, ftr: "A", hthg: 1, htag: 2, htr: "A", referee: "J Brooks", hxg: 1.35, axg: 1.7, hs: 14, as: 18, hst: 6, ast: 6, hf: 12, af: 7, hc: 6, ac: 4, hy: 2, ay: 3, hr: 0, ar: 0, avgh: 3.66, avgd: 3.76, avga: 1.89, avgOver25: 1.67, avgUnder25: 2.2, ahLine: 0.5 },
  
  // GW2
  { date: "28/08/2026", homeTeam: "Crystal Palace", awayTeam: "Man City", fthg: 1, ftag: 4, ftr: "A", hthg: 0, htag: 1, htr: "A", referee: "A Madley", hxg: 0.66, axg: 2.21, hs: 9, as: 18, hst: 1, ast: 9, hf: 8, af: 11, hc: 2, ac: 6, hy: 1, ay: 2, hr: 0, ar: 0, avgh: 4.83, avgd: 3.95, avga: 1.67, avgOver25: 1.73, avgUnder25: 2.1, ahLine: 0.75 },
  { date: "29/08/2026", homeTeam: "Liverpool", awayTeam: "Nott'm Forest", fthg: 2, ftag: 2, ftr: "D", hthg: 0, htag: 1, htr: "A", referee: "S Barrott", hxg: 1.75, axg: 2.3, hs: 13, as: 12, hst: 4, ast: 3, hf: 13, af: 10, hc: 3, ac: 5, hy: 4, ay: 2, hr: 0, ar: 0, avgh: 1.57, avgd: 4.39, avga: 5.53, avgOver25: 1.62, avgUnder25: 2.3, ahLine: -1 },
  { date: "29/08/2026", homeTeam: "Bournemouth", awayTeam: "Everton", fthg: 1, ftag: 1, ftr: "D", hthg: 1, htag: 0, htr: "H", referee: "C Kavanagh", hxg: 2.15, axg: 1.84, hs: 17, as: 13, hst: 5, ast: 7, hf: 11, af: 14, hc: 10, ac: 7, hy: 3, ay: 2, hr: 0, ar: 0, avgh: 2.1, avgd: 3.5, avga: 3.41, avgOver25: 1.91, avgUnder25: 1.91, ahLine: -0.5 },
  { date: "29/08/2026", homeTeam: "Coventry", awayTeam: "Hull", fthg: 0, ftag: 1, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "J Smith", hxg: 1.28, axg: 0.73, hs: 11, as: 6, hst: 3, ast: 2, hf: 11, af: 8, hc: 6, ac: 2, hy: 1, ay: 4, hr: 0, ar: 0, avgh: 1.87, avgd: 3.53, avga: 4.19, avgOver25: 1.91, avgUnder25: 1.91, ahLine: -0.5 },
  { date: "29/08/2026", homeTeam: "Tottenham", awayTeam: "Newcastle", fthg: 0, ftag: 2, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "P Bankes", hxg: 1.04, axg: 0.75, hs: 17, as: 11, hst: 6, ast: 2, hf: 15, af: 9, hc: 9, ac: 7, hy: 1, ay: 2, hr: 0, ar: 0, avgh: 2.25, avgd: 3.65, avga: 2.88, avgOver25: 1.62, avgUnder25: 2.3, ahLine: -0.25 },
  { date: "30/08/2026", homeTeam: "Chelsea", awayTeam: "Brighton", fthg: 4, ftag: 3, ftr: "H", hthg: 3, htag: 1, htr: "H", referee: "M Oliver", hxg: 2.93, axg: 1.4, hs: 17, as: 15, hst: 6, ast: 6, hf: 6, af: 12, hc: 4, ac: 7, hy: 1, ay: 3, hr: 0, ar: 0, avgh: 1.82, avgd: 3.85, avga: 3.93, avgOver25: 1.62, avgUnder25: 2.3, ahLine: -0.5 },
  { date: "30/08/2026", homeTeam: "Leeds", awayTeam: "Brentford", fthg: 1, ftag: 1, ftr: "D", hthg: 0, htag: 1, htr: "A", referee: "T Harrington", hxg: 1.43, axg: 1.56, hs: 12, as: 22, hst: 2, ast: 5, hf: 5, af: 13, hc: 5, ac: 6, hy: 0, ay: 4, hr: 0, ar: 0, avgh: 2.58, avgd: 3.36, avga: 2.67, avgOver25: 1.9, avgUnder25: 1.95, ahLine: 0 },
  { date: "30/08/2026", homeTeam: "Sunderland", awayTeam: "Fulham", fthg: 1, ftag: 0, ftr: "H", hthg: 0, htag: 0, htr: "D", referee: "M Salisbury", hxg: 2.02, axg: 0.95, hs: 12, as: 11, hst: 4, ast: 0, hf: 10, af: 15, hc: 3, ac: 4, hy: 0, ay: 2, hr: 0, ar: 0, avgh: 2.39, avgd: 3.24, avga: 2.96, avgOver25: 2, avgUnder25: 1.8, ahLine: -0.25 },
  { date: "30/08/2026", homeTeam: "Man United", awayTeam: "Ipswich", fthg: 5, ftag: 2, ftr: "H", hthg: 1, htag: 1, htr: "D", referee: "C Pawson", hxg: 4.56, axg: 2.01, hs: 33, as: 9, hst: 11, ast: 5, hf: 7, af: 12, hc: 8, ac: 4, hy: 1, ay: 3, hr: 0, ar: 0, avgh: 1.4, avgd: 4.82, avga: 6.94, avgOver25: 1.57, avgUnder25: 2.38, ahLine: -1.25 },
  { date: "31/08/2026", homeTeam: "Aston Villa", awayTeam: "Arsenal", fthg: 0, ftag: 1, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "J Gillett", hxg: 0.32, axg: 1.05, hs: 7, as: 7, hst: 0, ast: 2, hf: 17, af: 6, hc: 2, ac: 4, hy: 3, ay: 1, hr: 0, ar: 0, avgh: 5.99, avgd: 4.11, avga: 1.52, avgOver25: 1.83, avgUnder25: 2.03, ahLine: 1 },
  
  // GW3
  { date: "4/9/2026", homeTeam: "Ipswich", awayTeam: "Liverpool", fthg: 0, ftag: 2, ftr: "A", hthg: 0, htag: 2, htr: "A", referee: "D England", hxg: 0.76, axg: 0.68, hs: 14, as: 10, hst: 5, ast: 7, hf: 6, af: 13, hc: 4, ac: 3, hy: 1, ay: 3, hr: 0, ar: 0, avgh: 5.48, avgd: 4.8, avga: 1.5, avgOver25: 1.4, avgUnder25: 3, ahLine: 1.25 },
  { date: "5/9/2026", homeTeam: "Newcastle", awayTeam: "Bournemouth", fthg: 2, ftag: 2, ftr: "D", hthg: 1, htag: 2, htr: "A", referee: "R Jones", hxg: 0.71, axg: 1.37, hs: 8, as: 17, hst: 2, ast: 5, hf: 19, af: 17, hc: 4, ac: 3, hy: 2, ay: 3, hr: 0, ar: 0, avgh: 2.1, avgd: 3.64, avga: 3.19, avgOver25: 1.57, avgUnder25: 2.38, ahLine: -0.25 },
  { date: "5/9/2026", homeTeam: "Brentford", awayTeam: "Sunderland", fthg: 1, ftag: 1, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "T Bramall", hxg: 1.2, axg: 1.71, hs: 12, as: 14, hst: 2, ast: 5, hf: 19, af: 9, hc: 4, ac: 3, hy: 3, ay: 2, hr: 0, ar: 0, avgh: 1.62, avgd: 3.9, avga: 5.29, avgOver25: 1.8, avgUnder25: 2, ahLine: -0.75 },
  { date: "5/9/2026", homeTeam: "Brighton", awayTeam: "Leeds", fthg: 1, ftag: 1, ftr: "D", hthg: 0, htag: 1, htr: "A", referee: "S Attwell", hxg: 2.2, axg: 2.5, hs: 20, as: 10, hst: 5, ast: 5, hf: 13, af: 16, hc: 7, ac: 6, hy: 3, ay: 3, hr: 0, ar: 0, avgh: 1.98, avgd: 3.52, avga: 3.68, avgOver25: 1.91, avgUnder25: 1.91, ahLine: -0.5 },
  { date: "5/9/2026", homeTeam: "Fulham", awayTeam: "Crystal Palace", fthg: 2, ftag: 3, ftr: "A", hthg: 2, htag: 1, htr: "H", referee: "S Barrott", hxg: 3.14, axg: 1.97, hs: 25, as: 10, hst: 6, ast: 5, hf: 6, af: 7, hc: 7, ac: 1, hy: 0, ay: 0, hr: 0, ar: 0, avgh: 2.32, avgd: 3.37, avga: 3.03, avgOver25: 1.91, avgUnder25: 1.91, ahLine: -0.25 },
  { date: "5/9/2026", homeTeam: "Man City", awayTeam: "Coventry", fthg: 1, ftag: 0, ftr: "H", hthg: 1, htag: 0, htr: "H", referee: "P Tierney", hxg: 2.12, axg: 1.37, hs: 15, as: 12, hst: 4, ast: 3, hf: 7, af: 17, hc: 4, ac: 5, hy: 1, ay: 2, hr: 0, ar: 0, avgh: 1.17, avgd: 7.64, avga: 13.85, avgOver25: 1.36, avgUnder25: 3.2, ahLine: -2.25 },
  { date: "5/9/2026", homeTeam: "Nott'm Forest", awayTeam: "Tottenham", fthg: 0, ftag: 0, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "C Pawson", hxg: 0.92, axg: 1.07, hs: 12, as: 11, hst: 2, ast: 0, hf: 22, af: 14, hc: 2, ac: 10, hy: 2, ay: 2, hr: 0, ar: 0, avgh: 2.4, avgd: 3.36, avga: 2.86, avgOver25: 1.91, avgUnder25: 1.91, ahLine: -0.25 },
  { date: "5/9/2026", homeTeam: "Hull", awayTeam: "Aston Villa", fthg: 0, ftag: 0, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "M Oliver", hxg: 0.57, axg: 1.93, hs: 11, as: 13, hst: 4, ast: 1, hf: 10, af: 5, hc: 3, ac: 4, hy: 2, ay: 0, hr: 0, ar: 0, avgh: 4.04, avgd: 3.62, avga: 1.86, avgOver25: 1.95, avgUnder25: 1.88, ahLine: 0.5 },
  { date: "6/9/2026", homeTeam: "Everton", awayTeam: "Man United", fthg: 2, ftag: 2, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "J Brooks", hxg: 1.01, axg: 0.69, hs: 18, as: 14, hst: 6, ast: 3, hf: 7, af: 11, hc: 4, ac: 3, hy: 3, ay: 3, hr: 0, ar: 0, avgh: 3.21, avgd: 3.54, avga: 2.12, avgOver25: 2.22, avgUnder25: 1.73, ahLine: 0.25 },
  { date: "6/9/2026", homeTeam: "Arsenal", awayTeam: "Chelsea", fthg: 2, ftag: 1, ftr: "H", hthg: 1, htag: 1, htr: "D", referee: "C Kavanagh", hxg: 2.05, axg: 0.39, hs: 16, as: 13, hst: 9, ast: 5, hf: 13, af: 16, hc: 5, ac: 3, hy: 2, ay: 4, hr: 0, ar: 0, avgh: 1.69, avgd: 3.8, avga: 4.82, avgOver25: 1.73, avgUnder25: 2.1, ahLine: -0.75 },
  
  // GW4
  { date: "12/9/2026", homeTeam: "Aston Villa", awayTeam: "Nott'm Forest", fthg: 1, ftag: 2, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "A Madley", hxg: 0.82, axg: 2.28, hs: 7, as: 22, hst: 5, ast: 7, hf: 11, af: 16, hc: 6, ac: 1, hy: 2, ay: 5, hr: 0, ar: 0, avgh: 2.22, avgd: 3.39, avga: 3.17, avgOver25: 1.98, avgUnder25: 1.88, ahLine: -0.25 },
  { date: "12/9/2026", homeTeam: "Bournemouth", awayTeam: "Brentford", fthg: 2, ftag: 2, ftr: "D", hthg: 1, htag: 1, htr: "D", referee: "J Gillett", hxg: 1.75, axg: 0.5, hs: 20, as: 8, hst: 10, ast: 2, hf: 10, af: 13, hc: 2, ac: 1, hy: 5, ay: 1, hr: 0, ar: 0, avgh: 2.45, avgd: 3.58, avga: 2.68, avgOver25: 1.62, avgUnder25: 2.3, ahLine: 0 },
  { date: "12/9/2026", homeTeam: "Chelsea", awayTeam: "Hull", fthg: 2, ftag: 2, ftr: "D", hthg: 1, htag: 2, htr: "A", referee: "F Hallam", hxg: 0.9, axg: 1.38, hs: 12, as: 14, hst: 7, ast: 5, hf: 7, af: 12, hc: 10, ac: 4, hy: 1, ay: 5, hr: 0, ar: 0, avgh: 1.21, avgd: 6.5, avga: 11.92, avgOver25: 1.4, avgUnder25: 3, ahLine: -2 },
  { date: "12/9/2026", homeTeam: "Crystal Palace", awayTeam: "Ipswich", fthg: 2, ftag: 3, ftr: "A", hthg: 1, htag: 2, htr: "A", referee: "C Kavanagh", hxg: 0.61, axg: 1.68, hs: 11, as: 12, hst: 4, ast: 6, hf: 6, af: 16, hc: 6, ac: 3, hy: 1, ay: 3, hr: 1, ar: 0, avgh: 1.84, avgd: 3.74, avga: 3.98, avgOver25: 1.8, avgUnder25: 2, ahLine: -0.5 },
  { date: "12/9/2026", homeTeam: "Liverpool", awayTeam: "Fulham", fthg: 0, ftag: 0, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "T Bramall", hxg: 1.28, axg: 0.68, hs: 14, as: 10, hst: 3, ast: 4, hf: 11, af: 8, hc: 5, ac: 8, hy: 0, ay: 1, hr: 0, ar: 0, avgh: 1.44, avgd: 4.85, avga: 6.37, avgOver25: 1.44, avgUnder25: 2.75, ahLine: -1.25 },
  { date: "12/9/2026", homeTeam: "Tottenham", awayTeam: "Everton", fthg: 0, ftag: 0, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "D England", hxg: 0.69, axg: 1.11, hs: 14, as: 12, hst: 2, ast: 3, hf: 14, af: 8, hc: 5, ac: 6, hy: 0, ay: 2, hr: 0, ar: 0, avgh: 2.02, avgd: 3.53, avga: 3.55, avgOver25: 1.91, avgUnder25: 1.91, ahLine: -0.5 },
  { date: "12/9/2026", homeTeam: "Sunderland", awayTeam: "Arsenal", fthg: 0, ftag: 2, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "J Brooks", hxg: 1.8, axg: 1.88, hs: 12, as: 11, hst: 3, ast: 5, hf: 18, af: 11, hc: 4, ac: 2, hy: 6, ay: 2, hr: 1, ar: 0, avgh: 7.36, avgd: 4.12, avga: 1.46, avgOver25: 2.1, avgUnder25: 1.73, ahLine: 1 },
  { date: "13/9/2026", homeTeam: "Coventry", awayTeam: "Brighton", fthg: 0, ftag: 5, ftr: "A", hthg: 0, htag: 1, htr: "A", referee: "T Harrington", hxg: 1.34, axg: 2.8, hs: 14, as: 22, hst: 6, ast: 7, hf: 9, af: 15, hc: 5, ac: 3, hy: 0, ay: 0, hr: 1, ar: 0, avgh: 3.91, avgd: 3.73, avga: 1.85, avgOver25: 1.94, avgUnder25: 1.73, ahLine: 0.5 },
  { date: "13/9/2026", homeTeam: "Man United", awayTeam: "Man City", fthg: 0, ftag: 1, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "M Oliver", hxg: 1, axg: 1.1, hs: 16, as: 6, hst: 3, ast: 2, hf: 17, af: 10, hc: 6, ac: 7, hy: 1, ay: 2, hr: 0, ar: 1, avgh: 3.08, avgd: 3.78, avga: 2.1, avgOver25: 1.53, avgUnder25: 2.5, ahLine: 0.25 },
  { date: "14/9/2026", homeTeam: "Leeds", awayTeam: "Newcastle", fthg: 4, ftag: 1, ftr: "H", hthg: 3, htag: 0, htr: "H", referee: "M Salisbury", hxg: 1.91, axg: 0.85, hs: 15, as: 7, hst: 6, ast: 5, hf: 8, af: 13, hc: 5, ac: 5, hy: 1, ay: 2, hr: 0, ar: 0, avgh: 2.38, avgd: 3.45, avga: 2.81, avgOver25: 1.8, avgUnder25: 2, ahLine: -0.25 },
  
  // GW5
  { date: "18/9/2026", homeTeam: "Brentford", awayTeam: "Chelsea", fthg: 3, ftag: 0, ftr: "H", hthg: 0, htag: 0, htr: "D", referee: "A Madley", hxg: 2.65, axg: 0.85, hs: 13, as: 12, hst: 6, ast: 2, hf: 10, af: 7, hc: 4, ac: 12, hy: 2, ay: 0, hr: 0, ar: 0, avgh: 2.62, avgd: 3.7, avga: 2.48, avgOver25: 1.5, avgUnder25: 2.63, ahLine: 0 },
  { date: "19/9/2026", homeTeam: "Tottenham", awayTeam: "Aston Villa", fthg: 2, ftag: 3, ftr: "A", hthg: 0, htag: 1, htr: "A", referee: "S Barrott", hxg: 1.56, axg: 1.16, hs: 20, as: 15, hst: 7, ast: 6, hf: 9, af: 13, hc: 11, ac: 1, hy: 1, ay: 2, hr: 0, ar: 0, avgh: 1.99, avgd: 3.59, avga: 3.62, avgOver25: 1.83, avgUnder25: 2.03, ahLine: -0.5 },
  { date: "19/9/2026", homeTeam: "Brighton", awayTeam: "Arsenal", fthg: 3, ftag: 0, ftr: "H", hthg: 2, htag: 0, htr: "H", referee: "D England", hxg: 1.31, axg: 1.63, hs: 17, as: 11, hst: 5, ast: 2, hf: 13, af: 11, hc: 5, ac: 6, hy: 4, ay: 1, hr: 0, ar: 0, avgh: 5, avgd: 3.9, avga: 1.67, avgOver25: 1.73, avgUnder25: 2.1, ahLine: 0.75 },
  { date: "19/9/2026", homeTeam: "Everton", awayTeam: "Ipswich", fthg: 1, ftag: 0, ftr: "H", hthg: 1, htag: 0, htr: "H", referee: "S Attwell", hxg: 2.24, axg: 1.44, hs: 21, as: 13, hst: 2, ast: 4, hf: 6, af: 12, hc: 4, ac: 4, hy: 2, ay: 1, hr: 0, ar: 1, avgh: 1.76, avgd: 3.79, avga: 4.36, avgOver25: 1.73, avgUnder25: 2.1, ahLine: -0.75 },
  { date: "19/9/2026", homeTeam: "Newcastle", awayTeam: "Hull", fthg: 2, ftag: 1, ftr: "H", hthg: 2, htag: 0, htr: "H", referee: "T Harrington", hxg: 1.44, axg: 1.59, hs: 12, as: 22, hst: 5, ast: 4, hf: 4, af: 10, hc: 4, ac: 7, hy: 1, ay: 4, hr: 0, ar: 0, avgh: 1.58, avgd: 4.26, avga: 5.1, avgOver25: 1.62, avgUnder25: 2.3, ahLine: -1 },
  { date: "19/9/2026", homeTeam: "Nott'm Forest", awayTeam: "Coventry", fthg: 0, ftag: 1, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "J Gillett", hxg: 1.1, axg: 0.67, hs: 24, as: 10, hst: 3, ast: 3, hf: 12, af: 10, hc: 6, ac: 2, hy: 2, ay: 0, hr: 0, ar: 0, avgh: 1.58, avgd: 4.02, avga: 5.54, avgOver25: 1.8, avgUnder25: 2.05, ahLine: -1 },
  { date: "20/9/2026", homeTeam: "Bournemouth", awayTeam: "Liverpool", fthg: 0, ftag: 1, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "M Oliver", hxg: 0.79, axg: 1.65, hs: 9, as: 12, hst: 2, ast: 3, hf: 11, af: 13, hc: 3, ac: 3, hy: 1, ay: 2, hr: 0, ar: 0, avgh: 3.05, avgd: 3.78, avga: 2.13, avgOver25: 1.5, avgUnder25: 2.63, ahLine: 0.25 },
  { date: "20/9/2026", homeTeam: "Leeds", awayTeam: "Crystal Palace", fthg: 0, ftag: 0, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "A Herczeg", hxg: 1.31, axg: 1.06, hs: 13, as: 12, hst: 2, ast: 4, hf: 10, af: 12, hc: 4, ac: 3, hy: 2, ay: 3, hr: 0, ar: 0, avgh: 1.74, avgd: 3.79, avga: 4.49, avgOver25: 1.73, avgUnder25: 2.1, ahLine: -0.75 },
  { date: "20/9/2026", homeTeam: "Man City", awayTeam: "Sunderland", fthg: 5, ftag: 3, ftr: "H", hthg: 3, htag: 2, htr: "H", referee: "R Jones", hxg: 2.82, axg: 3.57, hs: 16, as: 17, hst: 6, ast: 9, hf: 14, af: 14, hc: 6, ac: 5, hy: 0, ay: 1, hr: 0, ar: 0, avgh: 1.29, avgd: 5.56, avga: 9.39, avgOver25: 1.57, avgUnder25: 2.38, ahLine: -1.5 },
  { date: "20/9/2026", homeTeam: "Fulham", awayTeam: "Man United", fthg: 1, ftag: 1, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "P Bankes", hxg: 1.62, axg: 1.6, hs: 12, as: 29, hst: 6, ast: 6, hf: 9, af: 5, hc: 3, ac: 13, hy: 3, ay: 0, hr: 0, ar: 0, avgh: 3.36, avgd: 3.71, avga: 2.05, avgOver25: 1.62, avgUnder25: 2.3, ahLine: 0.5 },
  
  // GW6
  { date: "10/10/2026", homeTeam: "Arsenal", awayTeam: "Leeds", fthg: 2, ftag: 1, ftr: "H", hthg: 0, htag: 0, htr: "D", referee: "P Tierney", hxg: 2.33, axg: 0.62, hs: 13, as: 11, hst: 6, ast: 5, hf: 12, af: 20, hc: 2, ac: 4, hy: 1, ay: 4, hr: 0, ar: 0, avgh: 1.38, avgd: 4.78, avga: 7.89, avgOver25: 1.85, avgUnder25: 2, ahLine: -1.25 },
  { date: "10/10/2026", homeTeam: "Aston Villa", awayTeam: "Brentford", fthg: 2, ftag: 2, ftr: "D", hthg: 1, htag: 1, htr: "D", referee: "C Pawson", hxg: 2.28, axg: 1.06, hs: 20, as: 14, hst: 7, ast: 4, hf: 7, af: 24, hc: 2, ac: 2, hy: 2, ay: 5, hr: 0, ar: 0, avgh: 2.62, avgd: 3.5, avga: 2.54, avgOver25: 1.73, avgUnder25: 2.1, ahLine: 0 },
  { date: "10/10/2026", homeTeam: "Chelsea", awayTeam: "Bournemouth", fthg: 5, ftag: 1, ftr: "H", hthg: 2, htag: 0, htr: "H", referee: "S Barrott", hxg: 1.1, axg: 1.38, hs: 10, as: 9, hst: 6, ast: 4, hf: 7, af: 15, hc: 1, ac: 7, hy: 0, ay: 4, hr: 0, ar: 0, avgh: 1.66, avgd: 4.21, avga: 4.53, avgOver25: 1.5, avgUnder25: 2.63, ahLine: -0.75 },
  { date: "10/10/2026", homeTeam: "Ipswich", awayTeam: "Fulham", fthg: 2, ftag: 1, ftr: "H", hthg: 0, htag: 0, htr: "D", referee: "L Smith", hxg: 1.15, axg: 1.81, hs: 11, as: 13, hst: 5, ast: 5, hf: 8, af: 10, hc: 2, ac: 5, hy: 2, ay: 4, hr: 0, ar: 0, avgh: 2.75, avgd: 3.48, avga: 2.42, avgOver25: 1.73, avgUnder25: 2.1, ahLine: 0 },
  { date: "10/10/2026", homeTeam: "Sunderland", awayTeam: "Brighton", fthg: 0, ftag: 2, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "T Bramall", hxg: 0.72, axg: 1.41, hs: 12, as: 13, hst: 3, ast: 4, hf: 8, af: 12, hc: 7, ac: 5, hy: 0, ay: 1, hr: 0, ar: 1, avgh: 2.94, avgd: 3.47, avga: 2.33, avgOver25: 1.8, avgUnder25: 2, ahLine: 0.25 },
  { date: "10/10/2026", homeTeam: "Man United", awayTeam: "Tottenham", fthg: 1, ftag: 1, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "S Attwell", hxg: 0.8, axg: 1.62, hs: 12, as: 12, hst: 4, ast: 3, hf: 13, af: 16, hc: 4, ac: 4, hy: 4, ay: 3, hr: 0, ar: 1, avgh: 4.16, avgd: 4.37, avga: 1.69, avgOver25: 1.53, avgUnder25: 2.5, ahLine: -0.75 },
  { date: "11/10/2026", homeTeam: "Crystal Palace", awayTeam: "Nott'm Forest", fthg: 3, ftag: 1, ftr: "H", hthg: 2, htag: 1, htr: "H", referee: "P Bankes", hxg: 2.41, axg: 3.34, hs: 13, as: 24, hst: 7, ast: 6, hf: 11, af: 10, hc: 5, ac: 8, hy: 2, ay: 2, hr: 0, ar: 0, avgh: 2.59, avgd: 3.33, avga: 2.64, avgOver25: 1.91, avgUnder25: 1.91, ahLine: 0 },
  { date: "11/10/2026", homeTeam: "Hull", awayTeam: "Everton", fthg: 2, ftag: 2, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "M Salisbury", hxg: 1.33, axg: 1.68, hs: 9, as: 15, hst: 5, ast: 7, hf: 15, af: 4, hc: 7, ac: 6, hy: 2, ay: 0, hr: 0, ar: 0, avgh: 3.58, avgd: 3.4, avga: 2.04, avgOver25: 2.16, avgUnder25: 2, ahLine: 0.5 },
  { date: "11/10/2026", homeTeam: "Liverpool", awayTeam: "Man City", fthg: 0, ftag: 3, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "C Kavanagh", hxg: 0.94, axg: 1.29, hs: 13, as: 15, hst: 6, ast: 4, hf: 19, af: 14, hc: 5, ac: 6, hy: 4, ay: 2, hr: 1, ar: 0, avgh: 2.62, avgd: 3.64, avga: 2.44, avgOver25: 1.57, avgUnder25: 2.38, ahLine: 0 },
  { date: "12/10/2026", homeTeam: "Coventry", awayTeam: "Newcastle", fthg: 4, ftag: 1, ftr: "H", hthg: 1, htag: 0, htr: "H", referee: "J Brooks", hxg: 1.43, axg: 1.84, hs: 9, as: 19, hst: 6, ast: 6, hf: 3, af: 10, hc: 2, ac: 6, hy: 1, ay: 1, hr: 0, ar: 0, avgh: 3.25, avgd: 3.58, avga: 2.08, avgOver25: 1.67, avgUnder25: 2.2, ahLine: 0.5 },
  
  // GW7
  { date: "17/10/2026", homeTeam: "Everton", awayTeam: "Chelsea", fthg: 0, ftag: 2, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "P Tierney", hxg: 0.43, axg: 1.47, hs: 6, as: 18, hst: 5, ast: 7, hf: 8, af: 15, hc: 5, ac: 7, hy: 3, ay: 4, hr: 0, ar: 0, avgh: 3.13, avgd: 3.62, avga: 2.12, avgOver25: 1.67, avgUnder25: 2.2, ahLine: 0.25 },
  { date: "17/10/2026", homeTeam: "Fulham", awayTeam: "Hull", fthg: 1, ftag: 0, ftr: "H", hthg: 1, htag: 0, htr: "H", referee: "C Kavanagh", hxg: 1.38, axg: 0.16, hs: 18, as: 5, hst: 6, ast: 0, hf: 13, af: 11, hc: 10, ac: 2, hy: 2, ay: 2, hr: 1, ar: 0, avgh: 1.7, avgd: 3.89, avga: 4.51, avgOver25: 1.73, avgUnder25: 2.1, ahLine: -0.75 },
  { date: "17/10/2026", homeTeam: "Man City", awayTeam: "Ipswich", fthg: 3, ftag: 2, ftr: "H", hthg: 2, htag: 1, htr: "H", referee: "F Hallam", hxg: 3.53, axg: 1.66, hs: 19, as: 8, hst: 6, ast: 3, hf: 8, af: 16, hc: 2, ac: 3, hy: 1, ay: 2, hr: 0, ar: 0, avgh: 1.24, avgd: 6.47, avga: 10.08, avgOver25: 1.4, avgUnder25: 3, ahLine: -1.75 },
  { date: "17/10/2026", homeTeam: "Brentford", awayTeam: "Liverpool", fthg: 1, ftag: 2, ftr: "A", hthg: 1, htag: 0, htr: "H", referee: "J Brooks", hxg: 0.88, axg: 1.64, hs: 10, as: 21, hst: 2, ast: 5, hf: 7, af: 13, hc: 3, ac: 9, hy: 4, ay: 3, hr: 2, ar: 0, avgh: 2.34, avgd: 3.62, avga: 2.76, avgOver25: 1.57, avgUnder25: 2.38, ahLine: 0 },
  { date: "17/10/2026", homeTeam: "Newcastle", awayTeam: "Aston Villa", fthg: 0, ftag: 1, ftr: "A", hthg: 0, htag: 1, htr: "A", referee: "J Gillett", hxg: 0.99, axg: 1.57, hs: 16, as: 15, hst: 1, ast: 3, hf: 14, af: 11, hc: 4, ac: 5, hy: 6, ay: 2, hr: 0, ar: 0, avgh: 2.22, avgd: 3.63, avga: 2.93, avgOver25: 1.62, avgUnder25: 2.3, ahLine: -0.25 },
  { date: "18/10/2026", homeTeam: "Brighton", awayTeam: "Crystal Palace", fthg: 5, ftag: 0, ftr: "H", hthg: 3, htag: 0, htr: "H", referee: "R Jones", hxg: 2, axg: 0.77, hs: 17, as: 5, hst: 9, ast: 1, hf: 13, af: 11, hc: 8, ac: 5, hy: 2, ay: 1, hr: 0, ar: 0, avgh: 1.53, avgd: 4.42, avga: 5.35, avgOver25: 1.57, avgUnder25: 2.38, ahLine: -1 },
  { date: "18/10/2026", homeTeam: "Bournemouth", awayTeam: "Sunderland", fthg: 2, ftag: 0, ftr: "H", hthg: 1, htag: 0, htr: "H", referee: "C Pawson", hxg: 4.23, axg: 0.07, hs: 29, as: 3, hst: 6, ast: 0, hf: 16, af: 7, hc: 5, ac: 3, hy: 3, ay: 2, hr: 0, ar: 1, avgh: 2.04, avgd: 3.51, avga: 3.44, avgOver25: 1.83, avgUnder25: 2.03, ahLine: -0.5 },
  { date: "18/10/2026", homeTeam: "Leeds", awayTeam: "Man United", fthg: 1, ftag: 1, ftr: "D", hthg: 0, htag: 1, htr: "A", referee: "D England", hxg: 1.41, axg: 0.92, hs: 12, as: 13, hst: 5, ast: 3, hf: 16, af: 5, hc: 2, ac: 3, hy: 2, ay: 2, hr: 0, ar: 0, avgh: 2.32, avgd: 3.55, avga: 2.82, avgOver25: 1.67, avgUnder25: 2.2, ahLine: -0.25 },
  { date: "18/10/2026", homeTeam: "Nott'm Forest", awayTeam: "Arsenal", fthg: 0, ftag: 1, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "M Oliver", hxg: 0.9, axg: 1.14, hs: 14, as: 9, hst: 2, ast: 1, hf: 14, af: 8, hc: 8, ac: 6, hy: 1, ay: 1, hr: 0, ar: 0, avgh: 5.59, avgd: 3.82, avga: 1.6, avgOver25: 1.93, avgUnder25: 1.93, ahLine: 0.75 },
  { date: "19/10/2026", homeTeam: "Tottenham", awayTeam: "Coventry", fthg: 3, ftag: 1, ftr: "H", hthg: 1, htag: 0, htr: "H", referee: "A Madley", hxg: 0.87, axg: 0.82, hs: 16, as: 12, hst: 5, ast: 1, hf: 15, af: 14, hc: 4, ac: 4, hy: 1, ay: 3, hr: 0, ar: 0, avgh: 1.46, avgd: 4.55, avga: 6.23, avgOver25: 1.57, avgUnder25: 2.38, ahLine: -1.25 },
  
  // GW8
  { date: "23/10/2026", homeTeam: "Ipswich", awayTeam: "Nott'm Forest", fthg: 1, ftag: 1, ftr: "D", hthg: 1, htag: 1, htr: "D", referee: "T Bramall", hxg: 0.46, axg: 2.31, hs: 7, as: 17, hst: 3, ast: 5, hf: 9, af: 11, hc: 0, ac: 5, hy: 1, ay: 1, hr: 0, ar: 0, avgh: 3.01, avgd: 3.44, avga: 2.28, avgOver25: 1.73, avgUnder25: 2.1, ahLine: 0.25 },
  { date: "24/10/2026", homeTeam: "Aston Villa", awayTeam: "Man City", fthg: 2, ftag: 1, ftr: "H", hthg: 1, htag: 0, htr: "H", referee: "P Bankes", hxg: 0.61, axg: 1.56, hs: 8, as: 15, hst: 2, ast: 7, hf: 21, af: 17, hc: 4, ac: 7, hy: 4, ay: 4, hr: 0, ar: 0, avgh: 4.73, avgd: 4.26, avga: 1.62, avgOver25: 1.53, avgUnder25: 2.5, ahLine: 1 },
  { date: "24/10/2026", homeTeam: "Arsenal", awayTeam: "Everton", fthg: 2, ftag: 0, ftr: "H", hthg: 1, htag: 0, htr: "H", referee: "T Harrington", hxg: 1.96, axg: 0.63, hs: 20, as: 8, hst: 4, ast: 3, hf: 11, af: 13, hc: 12, ac: 3, hy: 1, ay: 3, hr: 0, ar: 0, avgh: 1.43, avgd: 4.41, avga: 7.27, avgOver25: 1.8, avgUnder25: 2, ahLine: -1.25 },
  { date: "24/10/2026", homeTeam: "Coventry", awayTeam: "Fulham", fthg: 0, ftag: 1, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "A Herczeg", hxg: 0.51, axg: 0.55, hs: 13, as: 12, hst: 2, ast: 3, hf: 9, af: 11, hc: 4, ac: 6, hy: 0, ay: 2, hr: 0, ar: 0, avgh: 3.04, avgd: 3.46, avga: 2.23, avgOver25: 1.73, avgUnder25: 2.1, ahLine: 0.25 },
  { date: "24/10/2026", homeTeam: "Chelsea", awayTeam: "Tottenham", fthg: 0, ftag: 2, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "C Kavanagh", hxg: 0.47, axg: 0.74, hs: 7, as: 15, hst: 4, ast: 4, hf: 14, af: 14, hc: 4, ac: 6, hy: 4, ay: 3, hr: 1, ar: 0, avgh: 4.12, avgd: 4.35, avga: 1.69, avgOver25: 1.53, avgUnder25: 2.5, ahLine: -0.75 },
  { date: "25/10/2026", homeTeam: "Crystal Palace", awayTeam: "Newcastle", fthg: 0, ftag: 2, ftr: "A", hthg: 0, htag: 0, htr: "D", referee: "P Tierney", hxg: 1.59, axg: 0.95, hs: 17, as: 10, hst: 4, ast: 2, hf: 12, af: 10, hc: 7, ac: 4, hy: 3, ay: 3, hr: 0, ar: 0, avgh: 2.86, avgd: 3.58, avga: 2.28, avgOver25: 1.57, avgUnder25: 2.38, ahLine: 0.25 },
  { date: "25/10/2026", homeTeam: "Hull", awayTeam: "Brentford", fthg: 1, ftag: 1, ftr: "D", hthg: 1, htag: 0, htr: "H", referee: "R Jones", hxg: 1.57, axg: 1.74, hs: 12, as: 14, hst: 2, ast: 6, hf: 10, af: 9, hc: 5, ac: 6, hy: 0, ay: 1, hr: 0, ar: 0, avgh: 4.86, avgd: 4.03, avga: 1.64, avgOver25: 1.67, avgUnder25: 2.2, ahLine: 0.75 },
  { date: "25/10/2026", homeTeam: "Liverpool", awayTeam: "Brighton", fthg: 2, ftag: 0, ftr: "H", hthg: 2, htag: 0, htr: "H", referee: "S Barrott", hxg: 1.2, axg: 1.32, hs: 13, as: 17, hst: 4, ast: 1, hf: 13, af: 9, hc: 4, ac: 2, hy: 0, ay: 2, hr: 0, ar: 0, avgh: 2.09, avgd: 3.76, avga: 3.13, avgOver25: 1.53, avgUnder25: 2.5, ahLine: -0.25 },
  { date: "25/10/2026", homeTeam: "Man United", awayTeam: "Bournemouth", fthg: 0, ftag: 3, ftr: "A", hthg: 0, htag: 2, htr: "A", referee: "J Gillett", hxg: 1.17, axg: 2.15, hs: 17, as: 10, hst: 5, ast: 4, hf: 13, af: 17, hc: 5, ac: 4, hy: 4, ay: 1, hr: 0, ar: 0, avgh: 3.63, avgd: 3.19, avga: 2.1, avgOver25: 1.62, avgUnder25: 2.3, ahLine: -0.25 },
  { date: "25/10/2026", homeTeam: "Sunderland", awayTeam: "Leeds", fthg: 0, ftag: 0, ftr: "D", hthg: 0, htag: 0, htr: "D", referee: "S Attwell", hxg: 0.83, axg: 0.76, hs: 15, as: 11, hst: 4, ast: 4, hf: 10, af: 14, hc: 4, ac: 5, hy: 1, ay: 2, hr: 0, ar: 0, avgh: 3.04, avgd: 3.21, avga: 2.35, avgOver25: 2.54, avgUnder25: 2.1, ahLine: 0 },
];

// GW9 Fixtures (upcoming)
export const gw9Fixtures = [
  { homeTeam: "Chelsea", awayTeam: "Man United" },
  { homeTeam: "Bournemouth", awayTeam: "Leeds" },
  { homeTeam: "Brentford", awayTeam: "Nott'm Forest" },
  { homeTeam: "Coventry", awayTeam: "Sunderland" },
  { homeTeam: "Hull", awayTeam: "Ipswich" },
  { homeTeam: "Man City", awayTeam: "Brighton" },
  { homeTeam: "Tottenham", awayTeam: "Crystal Palace" },
  { homeTeam: "Aston Villa", awayTeam: "Fulham" },
  { homeTeam: "Liverpool", awayTeam: "Arsenal" },
  { homeTeam: "Newcastle", awayTeam: "Everton" },
];

// GW9 Actual Results (completed matches)
export const gw9Results = [
  { homeTeam: "Chelsea", awayTeam: "Man United", homeGoals: 2, awayGoals: 0, result: "H" as const },
  { homeTeam: "Bournemouth", awayTeam: "Leeds", homeGoals: 2, awayGoals: 0, result: "H" as const },
  { homeTeam: "Coventry", awayTeam: "Sunderland", homeGoals: 3, awayGoals: 1, result: "H" as const },
  { homeTeam: "Man City", awayTeam: "Brighton", homeGoals: 0, awayGoals: 1, result: "A" as const },
  { homeTeam: "Brentford", awayTeam: "Nott'm Forest", homeGoals: 2, awayGoals: 0, result: "H" as const },
  { homeTeam: "Hull", awayTeam: "Ipswich", homeGoals: 2, awayGoals: 2, result: "D" as const },
  { homeTeam: "Tottenham", awayTeam: "Crystal Palace", homeGoals: 2, awayGoals: 0, result: "H" as const },
  { homeTeam: "Aston Villa", awayTeam: "Fulham", homeGoals: 1, awayGoals: 1, result: "D" as const },
  { homeTeam: "Liverpool", awayTeam: "Arsenal", homeGoals: 0, awayGoals: 1, result: "A" as const },
];

// Get all unique teams
export const teams = Array.from(new Set([
  ...matchData.map(m => m.homeTeam),
  ...matchData.map(m => m.awayTeam)
])).sort();

// Get team name mapping for consistency
export const teamNameMap: Record<string, string> = {
  "Arsenal": "Arsenal",
  "Aston Villa": "Aston Villa",
  "Bournemouth": "Bournemouth",
  "Brentford": "Brentford",
  "Brighton": "Brighton",
  "Chelsea": "Chelsea",
  "Coventry": "Coventry",
  "Crystal Palace": "Crystal Palace",
  "Everton": "Everton",
  "Fulham": "Fulham",
  "Hull": "Hull",
  "Ipswich": "Ipswich",
  "Leeds": "Leeds",
  "Liverpool": "Liverpool",
  "Man City": "Man City",
  "Man United": "Man United",
  "Newcastle": "Newcastle",
  "Nott'm Forest": "Nott'm Forest",
  "Sunderland": "Sunderland",
  "Tottenham": "Tottenham",
};
