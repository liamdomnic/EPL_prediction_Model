export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface PlayerGWStats {
  goals: number;
  assists: number;
  minutes: number; // estimated minutes played
  cleanSheet: boolean;
  goalsConceded: number;
  saves: number; // for GK
  yellowCard: boolean;
  redCard: boolean;
  bonus: number; // 0-3 BPS bonus
  ownGoal: boolean;
  penSaved: boolean;
  penMissed: boolean;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  price: number; // in millions
  gwStats: PlayerGWStats[]; // GW1-GW8
  totalGoals: number;
  totalAssists: number;
  totalCleanSheets: number;
  totalYellowCards: number;
  totalRedCards: number;
  totalSaves: number;
  totalBonus: number;
  totalMinutes: number;
  totalGoalsConceded: number;
}

// Official FPL Points Calculation
export function calculateGWPoints(player: Player, gw: number): {
  total: number;
  breakdown: { label: string; pts: number }[];
} {
  const stats = player.gwStats[gw - 1];
  if (!stats) return { total: 0, breakdown: [] };

  const breakdown: { label: string; pts: number }[] = [];
  let total = 0;

  // Appearance
  if (stats.minutes >= 60) {
    total += 2;
    breakdown.push({ label: "Played 60+ min", pts: 2 });
  } else if (stats.minutes > 0) {
    total += 1;
    breakdown.push({ label: "Played <60 min", pts: 1 });
  }

  // Goals (position-dependent)
  if (stats.goals > 0) {
    const goalPts =
      player.position === "GK" ? 10 :
      player.position === "DEF" ? 6 :
      player.position === "MID" ? 5 : 4;
    const pts = stats.goals * goalPts;
    total += pts;
    breakdown.push({ label: `${stats.goals} Goal${stats.goals > 1 ? "s" : ""} (${goalPts}pts each)`, pts });
  }

  // Assists (3pts all positions)
  if (stats.assists > 0) {
    const pts = stats.assists * 3;
    total += pts;
    breakdown.push({ label: `${stats.assists} Assist${stats.assists > 1 ? "s" : ""}`, pts });
  }

  // Clean Sheet (GK/DEF: 4pts, MID: 1pt)
  if (stats.cleanSheet && stats.minutes >= 60) {
    const csPts = (player.position === "GK" || player.position === "DEF") ? 4 :
                  player.position === "MID" ? 1 : 0;
    if (csPts > 0) {
      total += csPts;
      breakdown.push({ label: "Clean Sheet", pts: csPts });
    }
  }

  // Goals Conceded (-1 per 2, GK/DEF only)
  if ((player.position === "GK" || player.position === "DEF") && stats.goalsConceded > 0 && stats.minutes > 0) {
    const penalty = -Math.floor(stats.goalsConceded / 2);
    if (penalty < 0) {
      total += penalty;
      breakdown.push({ label: `${stats.goalsConceded} Goals Conceded`, pts: penalty });
    }
  }

  // Saves (GK only, 1pt per 3 saves)
  if (player.position === "GK" && stats.saves > 0) {
    const savePts = Math.floor(stats.saves / 3);
    if (savePts > 0) {
      total += savePts;
      breakdown.push({ label: `${stats.saves} Saves`, pts: savePts });
    }
  }

  // Penalty Save (GK, 5pts)
  if (stats.penSaved) {
    total += 5;
    breakdown.push({ label: "Penalty Save", pts: 5 });
  }

  // Yellow Card (-1)
  if (stats.yellowCard) {
    total -= 1;
    breakdown.push({ label: "Yellow Card", pts: -1 });
  }

  // Red Card (-3)
  if (stats.redCard) {
    total -= 3;
    breakdown.push({ label: "Red Card", pts: -3 });
  }

  // Own Goal (-2)
  if (stats.ownGoal) {
    total -= 2;
    breakdown.push({ label: "Own Goal", pts: -2 });
  }

  // Missed Penalty (-2)
  if (stats.penMissed) {
    total -= 2;
    breakdown.push({ label: "Penalty Missed", pts: -2 });
  }

  // Bonus
  if (stats.bonus > 0) {
    total += stats.bonus;
    breakdown.push({ label: `Bonus (BPS)`, pts: stats.bonus });
  }

  return { total, breakdown };
}

export function getTotalFPLPoints(player: Player): number {
  let total = 0;
  for (let gw = 1; gw <= 8; gw++) {
    total += calculateGWPoints(player, gw).total;
  }
  return total;
}

// Helper to create player data
function p(
  id: string, name: string, teamId: string, position: Position, price: number,
  gwStats: [number, number, number, boolean, number, number, boolean, boolean, number][]
  // [goals, assists, minutes, cleanSheet, goalsConceded, saves, yellowCard, redCard, bonus]
): Player {
  const stats: PlayerGWStats[] = gwStats.map(g => ({
    goals: g[0], assists: g[1], minutes: g[2], cleanSheet: g[3],
    goalsConceded: g[4], saves: g[5], yellowCard: g[6], redCard: g[7],
    bonus: g[8], ownGoal: false, penSaved: false, penMissed: false,
  }));
  
  return {
    id, name, teamId, position, price,
    gwStats: stats,
    totalGoals: stats.reduce((s, g) => s + g.goals, 0),
    totalAssists: stats.reduce((s, g) => s + g.assists, 0),
    totalCleanSheets: stats.reduce((s, g) => s + (g.cleanSheet && g.minutes >= 60 ? 1 : 0), 0),
    totalYellowCards: stats.reduce((s, g) => s + (g.yellowCard ? 1 : 0), 0),
    totalRedCards: stats.reduce((s, g) => s + (g.redCard ? 1 : 0), 0),
    totalSaves: stats.reduce((s, g) => s + g.saves, 0),
    totalBonus: stats.reduce((s, g) => s + g.bonus, 0),
    totalMinutes: stats.reduce((s, g) => s + g.minutes, 0),
    totalGoalsConceded: stats.reduce((s, g) => s + g.goalsConceded, 0),
  };
}

// Team goals conceded per GW (for defensive stats)
// Format: [GW1, GW2, GW3, GW4, GW5, GW6, GW7, GW8]
const teamGoalsConceded: Record<string, number[]> = {
  mci: [1, 1, 0, 0, 3, 0, 2, 1],
  ars: [0, 0, 1, 0, 3, 1, 0, 0],
  bri: [0, 3, 1, 0, 0, 0, 0, 2],
  liv: [2, 2, 0, 0, 0, 3, 1, 0],
  che: [3, 4, 2, 2, 3, 1, 0, 2],
  avl: [4, 1, 0, 1, 2, 2, 0, 1],
  tot: [3, 2, 0, 0, 3, 1, 1, 0],
  new: [2, 0, 2, 4, 1, 1, 1, 0],
  bre: [0, 1, 1, 2, 0, 2, 2, 1],
  lee: [0, 1, 1, 1, 0, 2, 1, 0],
  hul: [0, 0, 0, 2, 2, 2, 1, 1],
  eve: [0, 1, 2, 0, 0, 2, 2, 2],
  ips: [1, 5, 2, 3, 1, 1, 3, 1],
  bou: [2, 1, 2, 2, 1, 5, 0, 0],
  cry: [2, 4, 3, 3, 0, 1, 5, 2],
  mun: [2, 2, 2, 1, 1, 1, 1, 3],
  ful: [3, 1, 3, 0, 1, 2, 0, 0],
  sun: [2, 0, 1, 2, 5, 2, 2, 0],
  nfo: [1, 2, 0, 2, 1, 3, 1, 1],
  cov: [3, 1, 1, 5, 0, 1, 3, 1],
};

// Clean sheets per team per GW
const teamCleanSheets: Record<string, boolean[]> = {
  mci: [false, false, true, true, false, true, false, false],
  ars: [true, true, false, true, false, false, true, true],
  bri: [true, false, false, true, true, true, true, false],
  liv: [false, false, true, true, true, false, false, true],
  che: [false, false, false, false, false, false, true, false],
  avl: [false, false, true, false, false, false, true, false],
  tot: [false, false, true, true, false, false, false, true],
  new: [false, true, false, false, false, false, false, true],
  bre: [true, false, false, false, true, false, false, false],
  lee: [true, false, false, false, true, false, false, true],
  hul: [true, true, true, false, false, false, false, false],
  eve: [true, false, false, true, true, false, false, false],
  ips: [false, false, false, false, false, false, false, false],
  bou: [false, false, false, false, false, false, true, true],
  cry: [false, false, false, false, true, false, false, false],
  mun: [false, false, false, false, false, false, false, false],
  ful: [false, false, false, true, false, false, true, true],
  sun: [false, true, false, false, false, false, false, true],
  nfo: [false, false, true, false, false, false, false, false],
  cov: [false, false, false, false, true, false, false, false],
};

// === ALL PLAYERS with accurate GW-by-GW stats ===
// Format: [goals, assists, minutes, cleanSheet, goalsConceded, saves, yellowCard, redCard, bonus]
export const players: Player[] = [
  // === MANCHESTER CITY ===
  p("haaland", "Erling Haaland", "mci", "FWD", 14.5, [
    [2,0,90,false,1,0,false,false,3],[3,0,90,false,1,0,false,false,3],[1,0,90,true,0,0,false,false,2],
    [1,0,90,true,0,0,false,false,2],[3,0,90,false,3,0,false,false,3],[2,0,90,true,0,0,false,false,3],
    [2,0,85,false,2,0,false,false,3],[1,0,90,false,1,0,false,false,2],
  ]),
  p("foden", "Phil Foden", "mci", "MID", 9.0, [
    [0,1,90,false,1,0,false,false,1],[1,0,90,false,1,0,false,false,2],[0,1,90,true,0,0,false,false,1],
    [0,0,90,true,0,0,false,false,0],[1,0,85,false,3,0,false,false,2],[1,0,90,true,0,0,false,false,2],
    [1,0,80,false,2,0,false,false,2],[0,0,90,false,1,0,false,false,0],
  ]),
  p("debruyne", "Kevin De Bruyne", "mci", "MID", 10.0, [
    [0,1,85,false,1,0,false,false,2],[0,2,88,false,1,0,false,false,3],[0,0,80,true,0,0,false,false,1],
    [0,1,85,true,0,0,false,false,2],[1,0,75,false,3,0,false,false,3],[0,2,80,true,0,0,false,false,3],
    [0,1,70,false,2,0,false,false,2],[0,1,85,false,1,0,false,false,2],
  ]),
  p("grealish", "Jack Grealish", "mci", "MID", 6.5, [
    [0,0,70,false,1,0,false,false,0],[0,0,60,false,1,0,false,false,0],[0,0,65,true,0,0,false,false,0],
    [0,0,70,true,0,0,false,false,0],[0,1,60,false,3,0,false,false,1],[0,1,65,true,0,0,false,false,1],
    [0,0,50,false,2,0,false,false,0],[0,0,70,false,1,0,false,false,0],
  ]),
  p("doku", "Jérémy Doku", "mci", "MID", 6.5, [
    [0,0,60,false,1,0,false,false,0],[0,1,70,false,1,0,false,false,1],[0,0,55,true,0,0,false,false,0],
    [0,0,60,true,0,0,false,false,0],[0,1,65,false,3,0,false,false,1],[0,0,70,true,0,0,false,false,0],
    [0,1,60,false,2,0,false,false,1],[0,0,50,false,1,0,false,false,0],
  ]),
  p("bernardo", "Bernardo Silva", "mci", "MID", 7.5, [
    [0,0,80,false,1,0,false,false,0],[0,1,85,false,1,0,false,false,1],[0,0,75,true,0,0,false,false,0],
    [0,0,80,true,0,0,false,false,0],[0,2,85,false,3,0,false,false,3],[0,1,80,true,0,0,false,false,2],
    [0,0,70,false,2,0,false,false,0],[0,0,80,false,1,0,false,false,0],
  ]),
  p("gvardiol", "Joško Gvardiol", "mci", "DEF", 5.5, [
    [0,0,90,false,1,0,false,false,1],[0,0,90,false,1,0,false,false,0],[0,0,90,true,0,0,false,false,1],
    [0,0,90,true,0,0,false,false,1],[0,1,90,false,3,0,false,false,1],[0,0,90,true,0,0,false,false,1],
    [0,1,90,false,2,0,false,false,1],[0,0,90,false,1,0,false,false,0],
  ]),

  // === ARSENAL ===
  p("saka", "Bukayo Saka", "ars", "MID", 10.5, [
    [1,1,90,true,0,0,false,false,3],[0,1,90,true,0,0,false,false,1],[0,1,90,false,1,0,false,false,1],
    [1,0,90,true,0,0,false,false,2],[0,0,90,false,3,0,false,false,0],[1,0,90,false,1,0,false,false,2],
    [1,0,90,true,0,0,false,false,2],[1,0,90,true,0,0,false,false,2],
  ]),
  p("havertz", "Kai Havertz", "ars", "FWD", 8.5, [
    [1,0,90,true,0,0,false,false,2],[0,0,90,true,0,0,false,false,0],[1,0,90,false,1,0,false,false,1],
    [0,0,85,true,0,0,false,false,0],[0,0,90,false,3,0,false,false,0],[1,0,90,false,1,0,false,false,2],
    [0,0,90,true,0,0,false,false,0],[1,0,90,true,0,0,false,false,2],
  ]),
  p("odegaard", "Martin Ødegaard", "ars", "MID", 8.0, [
    [0,1,90,true,0,0,false,false,2],[0,0,90,true,0,0,false,false,0],[0,0,90,false,1,0,false,false,0],
    [0,1,90,true,0,0,false,false,1],[0,0,90,false,3,0,false,false,0],[0,1,90,false,1,0,false,false,1],
    [0,1,90,true,0,0,false,false,2],[0,1,90,true,0,0,false,false,2],
  ]),
  p("rice", "Declan Rice", "ars", "MID", 6.5, [
    [0,1,90,true,0,0,false,false,1],[0,0,90,true,0,0,false,false,0],[0,1,90,false,1,0,false,false,1],
    [0,1,90,true,0,0,false,false,1],[0,0,90,false,3,0,true,false,0],[0,1,90,false,1,0,false,false,1],
    [0,0,90,true,0,0,false,false,0],[0,1,90,true,0,0,false,false,1],
  ]),
  p("martinelli", "Gabriel Martinelli", "ars", "MID", 7.0, [
    [1,0,85,true,0,0,false,false,2],[0,0,80,true,0,0,false,false,0],[0,0,75,false,1,0,false,false,0],
    [1,0,85,true,0,0,false,false,2],[0,0,70,false,3,0,false,false,0],[0,0,60,false,1,0,false,false,0],
    [0,0,70,true,0,0,false,false,0],[0,0,75,true,0,0,false,false,0],
  ]),
  p("gabriel_g", "Gabriel Magalhães", "ars", "DEF", 5.5, [
    [0,0,90,true,0,0,false,false,1],[0,0,90,true,0,0,false,false,1],[1,0,90,false,1,0,false,false,3],
    [0,0,90,true,0,0,false,false,1],[0,0,90,false,3,0,false,false,0],[0,0,90,false,1,0,false,false,0],
    [0,0,90,true,0,0,false,false,1],[0,0,90,true,0,0,false,false,1],
  ]),
  p("trossard", "Leandro Trossard", "ars", "MID", 6.5, [
    [0,0,60,true,0,0,false,false,0],[1,0,70,true,0,0,false,false,2],[0,0,55,false,1,0,false,false,0],
    [0,0,60,true,0,0,false,false,0],[0,0,50,false,3,0,false,false,0],[0,0,55,false,1,0,false,false,0],
    [0,0,60,true,0,0,false,false,0],[0,0,65,true,0,0,false,false,0],
  ]),

  // === BRIGHTON ===
  p("joaopedro", "João Pedro", "bri", "FWD", 7.5, [
    [2,0,90,true,0,0,false,false,3],[2,0,90,false,3,0,false,false,3],[0,0,85,false,1,0,false,false,0],
    [2,0,90,true,0,0,false,false,3],[2,0,90,true,0,0,false,false,3],[1,0,90,true,0,0,false,false,2],
    [2,0,90,true,0,0,false,false,3],[0,0,85,false,2,0,false,false,0],
  ]),
  p("mitoma", "Kaoru Mitoma", "bri", "MID", 7.0, [
    [1,0,88,true,0,0,false,false,2],[0,0,80,false,3,0,false,false,0],[1,0,85,false,1,0,false,false,2],
    [1,0,90,true,0,0,false,false,2],[0,1,85,true,0,0,false,false,1],[1,0,88,true,0,0,false,false,2],
    [1,0,85,true,0,0,false,false,2],[0,0,80,false,2,0,false,false,0],
  ]),
  p("gross", "Pascal Groß", "bri", "MID", 5.5, [
    [0,2,90,true,0,0,false,false,3],[0,1,90,false,3,0,false,false,2],[0,1,90,false,1,0,false,false,1],
    [0,2,90,true,0,0,false,false,3],[0,1,90,true,0,0,false,false,2],[0,1,90,true,0,0,false,false,2],
    [0,2,90,true,0,0,false,false,3],[0,0,85,false,2,0,false,false,0],
  ]),
  p("minteh", "Yankuba Minteh", "bri", "MID", 5.0, [
    [0,1,75,true,0,0,false,false,1],[0,1,70,false,3,0,false,false,1],[0,0,65,false,1,0,false,false,0],
    [1,0,80,true,0,0,false,false,2],[1,0,75,true,0,0,false,false,2],[0,0,70,true,0,0,false,false,0],
    [1,0,80,true,0,0,false,false,2],[0,0,65,false,2,0,false,false,0],
  ]),
  p("adingra", "Simon Adingra", "bri", "MID", 5.5, [
    [1,0,70,true,0,0,false,false,2],[0,0,65,false,3,0,false,false,0],[0,0,60,false,1,0,false,false,0],
    [1,0,80,true,0,0,false,false,2],[0,0,65,true,0,0,false,false,0],[0,0,70,true,0,0,false,false,0],
    [1,0,80,true,0,0,false,false,2],[0,1,65,false,2,0,false,false,1],
  ]),
  p("baleba", "Carlos Baleba", "bri", "MID", 4.5, [
    [0,0,85,true,0,0,false,false,0],[1,0,90,false,3,0,false,false,2],[0,0,80,false,1,0,false,false,0],
    [0,1,90,true,0,0,false,false,1],[0,1,85,true,0,0,false,false,1],[0,0,80,true,0,0,false,false,0],
    [0,0,85,true,0,0,false,false,0],[0,1,80,false,2,0,false,false,1],
  ]),
  p("rutter", "Georginio Rutter", "bri", "FWD", 5.5, [
    [0,0,50,true,0,0,false,false,0],[0,0,45,false,3,0,false,false,0],[0,0,40,false,1,0,false,false,0],
    [0,1,70,true,0,0,false,false,1],[0,0,55,true,0,0,false,false,0],[0,0,60,true,0,0,false,false,0],
    [0,1,70,true,0,0,false,false,1],[0,0,50,false,2,0,false,false,0],
  ]),
  p("estupinan_p", "Pervis Estupiñán", "bri", "DEF", 5.0, [
    [0,0,88,true,0,0,false,false,0],[0,0,85,false,3,0,false,false,0],[0,0,80,false,1,0,false,false,0],
    [0,1,90,true,0,0,false,false,2],[0,0,85,true,0,0,false,false,0],[0,0,88,true,0,0,false,false,0],
    [0,1,90,true,0,0,false,false,2],[0,0,80,false,2,0,false,false,0],
  ]),

  // === LIVERPOOL ===
  p("salah", "Mohamed Salah", "liv", "MID", 12.5, [
    [1,0,90,false,2,0,false,false,2],[1,0,90,false,2,0,false,false,2],[1,0,90,true,0,0,false,false,2],
    [0,0,90,true,0,0,false,false,0],[0,0,90,true,0,0,false,false,0],[0,0,90,false,3,0,false,false,0],
    [1,0,90,false,1,0,false,false,2],[1,0,90,true,0,0,false,false,2],
  ]),
  p("jota", "Diogo Jota", "liv", "FWD", 7.5, [
    [0,0,70,false,2,0,false,false,0],[1,0,80,false,2,0,false,false,2],[1,0,85,true,0,0,false,false,2],
    [0,0,80,true,0,0,false,false,0],[0,0,75,true,0,0,false,false,0],[0,0,60,false,3,0,false,false,0],
    [1,0,85,false,1,0,false,false,2],[1,0,80,true,0,0,false,false,2],
  ]),
  p("szoboszlai", "Dominik Szoboszlai", "liv", "MID", 7.0, [
    [0,1,90,false,2,0,false,false,1],[0,0,85,false,2,0,false,false,0],[0,1,90,true,0,0,false,false,1],
    [0,0,90,true,0,0,false,false,0],[1,0,88,true,0,0,false,false,2],[0,0,85,false,3,0,false,false,0],
    [0,1,85,false,1,0,false,false,1],[0,1,90,true,0,0,false,false,2],
  ]),
  p("trent", "Trent Alexander-Arnold", "liv", "DEF", 7.0, [
    [0,1,90,false,2,0,false,false,2],[0,0,90,false,2,0,false,false,0],[0,0,90,true,0,0,false,false,1],
    [0,0,90,true,0,0,false,false,0],[0,0,90,true,0,0,false,false,0],[0,0,90,false,3,0,false,false,0],
    [0,1,90,false,1,0,false,false,2],[0,1,90,true,0,0,false,false,2],
  ]),
  p("gakpo", "Cody Gakpo", "liv", "MID", 6.5, [
    [1,0,75,false,2,0,false,false,2],[0,0,60,false,2,0,false,false,0],[0,1,80,true,0,0,false,false,1],
    [0,0,70,true,0,0,false,false,0],[0,1,75,true,0,0,false,false,1],[0,0,55,false,3,0,false,false,0],
    [0,0,65,false,1,0,false,false,0],[0,0,70,true,0,0,false,false,0],
  ]),
  p("macallister", "Alexis Mac Allister", "liv", "MID", 6.0, [
    [0,0,85,false,2,0,false,false,0],[0,1,90,false,2,0,false,false,2],[0,0,85,true,0,0,false,false,0],
    [0,0,90,true,0,0,false,false,0],[0,0,85,true,0,0,false,false,0],[0,0,80,false,3,0,false,false,0],
    [0,0,80,false,1,0,false,false,0],[0,0,85,true,0,0,false,false,0],
  ]),

  // === CHELSEA ===
  p("palmer", "Cole Palmer", "che", "MID", 10.5, [
    [2,0,90,false,3,0,false,false,3],[2,0,90,false,4,0,false,false,3],[1,0,90,false,2,0,false,false,2],
    [1,0,90,false,2,0,false,false,2],[0,0,85,false,3,0,false,false,0],[2,0,90,false,1,0,false,false,3],
    [1,0,90,true,0,0,false,false,2],[0,0,85,false,2,0,false,false,0],
  ]),
  p("jackson", "Nicolas Jackson", "che", "FWD", 7.5, [
    [1,0,85,false,3,0,false,false,2],[1,0,80,false,4,0,false,false,1],[0,0,75,false,2,0,false,false,0],
    [1,0,85,false,2,0,false,false,2],[0,0,70,false,3,0,false,false,0],[2,0,90,false,1,0,false,false,3],
    [1,0,85,true,0,0,false,false,2],[0,0,80,false,2,0,false,false,0],
  ]),
  p("nkunku", "Christopher Nkunku", "che", "FWD", 7.0, [
    [1,0,70,false,3,0,false,false,2],[1,0,75,false,4,0,false,false,2],[0,0,60,false,2,0,false,false,0],
    [0,0,65,false,2,0,false,false,0],[0,0,55,false,3,0,false,false,0],[1,0,80,false,1,0,false,false,2],
    [0,0,70,true,0,0,false,false,0],[0,0,60,false,2,0,false,false,0],
  ]),
  p("neto", "Pedro Neto", "che", "MID", 6.5, [
    [0,1,85,false,3,0,false,false,1],[0,0,80,false,4,0,false,false,0],[0,1,85,false,2,0,false,false,1],
    [0,1,85,false,2,0,false,false,1],[0,0,70,false,3,0,false,false,0],[0,2,90,false,1,0,false,false,3],
    [0,1,85,true,0,0,false,false,2],[0,0,80,false,2,0,false,false,0],
  ]),
  p("enzo", "Enzo Fernández", "che", "MID", 6.0, [
    [0,0,90,false,3,0,false,false,0],[0,1,90,false,4,0,false,false,1],[0,0,85,false,2,0,false,false,0],
    [0,1,90,false,2,0,false,false,1],[0,0,85,false,3,0,false,false,0],[0,1,90,false,1,0,false,false,1],
    [0,1,90,true,0,0,false,false,2],[0,0,85,false,2,0,false,false,0],
  ]),

  // === ASTON VILLA ===
  p("watkins", "Ollie Watkins", "avl", "FWD", 8.5, [
    [0,0,90,false,4,0,false,false,0],[0,0,90,false,1,0,false,false,0],[0,0,90,true,0,0,false,false,0],
    [1,0,90,false,1,0,false,false,2],[2,0,90,false,2,0,false,false,3],[1,0,90,false,2,0,false,false,2],
    [1,0,90,true,0,0,false,false,2],[1,0,90,false,1,0,false,false,2],
  ]),
  p("mcginn", "John McGinn", "avl", "MID", 6.0, [
    [0,0,90,false,4,0,false,false,0],[0,0,90,false,1,0,false,false,0],[0,0,90,true,0,0,false,false,0],
    [0,1,90,false,1,0,false,false,1],[0,2,90,false,2,0,false,false,3],[1,0,90,false,2,0,false,false,2],
    [0,1,90,true,0,0,false,false,2],[0,1,90,false,1,0,false,false,2],
  ]),
  p("rogers", "Morgan Rogers", "avl", "MID", 5.0, [
    [0,0,60,false,4,0,false,false,0],[0,0,55,false,1,0,false,false,0],[0,0,50,true,0,0,false,false,0],
    [0,0,60,false,1,0,false,false,0],[1,0,75,false,2,0,false,false,2],[0,0,65,false,2,0,false,false,0],
    [0,0,70,true,0,0,false,false,0],[1,0,80,false,1,0,false,false,2],
  ]),
  p("tielemans", "Youri Tielemans", "avl", "MID", 5.5, [
    [0,0,85,false,4,0,false,false,0],[0,0,85,false,1,0,false,false,0],[0,0,80,true,0,0,false,false,0],
    [0,0,85,false,1,0,false,false,0],[0,1,85,false,2,0,false,false,1],[0,1,85,false,2,0,false,false,1],
    [0,0,80,true,0,0,false,false,0],[0,1,85,false,1,0,false,false,1],
  ]),

  // === TOTTENHAM ===
  p("son", "Son Heung-min", "tot", "MID", 9.5, [
    [0,0,90,false,3,0,false,false,0],[0,0,90,false,2,0,false,false,0],[0,0,90,true,0,0,false,false,0],
    [0,0,90,true,0,0,false,false,0],[1,0,88,false,3,0,false,false,2],[0,1,85,false,1,0,false,false,1],
    [2,0,90,false,1,0,false,false,3],[1,0,90,true,0,0,false,false,2],
  ]),
  p("maddison", "James Maddison", "tot", "MID", 7.0, [
    [0,0,80,false,3,0,false,false,0],[0,0,75,false,2,0,false,false,0],[0,0,70,true,0,0,false,false,0],
    [0,0,75,true,0,0,false,false,0],[1,0,85,false,3,0,false,false,2],[0,0,80,false,1,0,false,false,0],
    [0,1,85,false,1,0,false,false,1],[0,1,88,true,0,0,false,false,2],
  ]),
  p("kulusevski", "Dejan Kulusevski", "tot", "MID", 6.5, [
    [0,0,75,false,3,0,false,false,0],[0,0,70,false,2,0,false,false,0],[0,0,65,true,0,0,false,false,0],
    [0,0,70,true,0,0,false,false,0],[0,1,80,false,3,0,false,false,1],[0,0,75,false,1,0,false,false,0],
    [1,0,85,false,1,0,false,false,2],[0,1,88,true,0,0,false,false,2],
  ]),
  p("johnson_b", "Brennan Johnson", "tot", "MID", 5.0, [
    [0,0,60,false,3,0,false,false,0],[0,0,55,false,2,0,false,false,0],[0,0,50,true,0,0,false,false,0],
    [0,0,55,true,0,0,false,false,0],[0,0,60,false,3,0,false,false,0],[1,0,75,false,1,0,false,false,2],
    [0,1,80,false,1,0,false,false,1],[1,0,85,true,0,0,false,false,2],
  ]),
  p("porro", "Pedro Porro", "tot", "DEF", 5.5, [
    [0,0,90,false,3,0,false,false,0],[0,0,90,false,2,0,false,false,0],[0,0,90,true,0,0,false,false,1],
    [0,0,90,true,0,0,false,false,0],[0,1,90,false,3,0,false,false,1],[0,0,90,false,1,0,false,false,0],
    [0,1,90,false,1,0,false,false,1],[0,0,90,true,0,0,false,false,0],
  ]),

  // === NEWCASTLE ===
  p("isak", "Alexander Isak", "new", "FWD", 9.0, [
    [1,0,90,false,2,0,false,false,2],[1,0,90,true,0,0,false,false,2],[1,0,90,false,2,0,false,false,2],
    [1,0,90,false,4,0,false,false,2],[1,0,90,false,1,0,false,false,2],[0,0,85,false,1,0,false,false,0],
    [0,0,85,false,1,0,false,false,0],[1,0,90,true,0,0,false,false,2],
  ]),
  p("gordon", "Anthony Gordon", "new", "MID", 7.0, [
    [1,0,90,false,2,0,false,false,2],[0,1,90,true,0,0,false,false,1],[1,0,90,false,2,0,false,false,2],
    [0,1,90,false,4,0,false,false,1],[1,0,90,false,1,0,false,false,2],[0,0,85,false,1,0,false,false,0],
    [0,0,85,false,1,0,false,false,0],[1,0,90,true,0,0,false,false,2],
  ]),
  p("bruno_g", "Bruno Guimarães", "new", "MID", 6.5, [
    [0,1,90,false,2,0,false,false,1],[0,0,90,true,0,0,false,false,0],[0,1,90,false,2,0,false,false,1],
    [0,0,90,false,4,0,false,false,0],[0,1,90,false,1,0,false,false,1],[0,0,90,false,1,0,false,false,0],
    [0,0,90,false,1,0,false,false,0],[0,1,90,true,0,0,false,false,1],
  ]),
  p("trippier", "Kieran Trippier", "new", "DEF", 5.5, [
    [0,0,90,false,2,0,false,false,0],[0,0,90,true,0,0,false,false,1],[0,1,90,false,2,0,false,false,1],
    [0,0,90,false,4,0,false,false,0],[0,1,90,false,1,0,false,false,1],[0,0,90,false,1,0,false,false,0],
    [0,0,90,false,1,0,false,false,0],[0,1,90,true,0,0,false,false,2],
  ]),

  // === BRENTFORD ===
  p("mbeumo", "Bryan Mbeumo", "bre", "MID", 6.5, [
    [2,0,90,true,0,0,false,false,3],[1,0,90,false,1,0,false,false,2],[0,1,85,false,1,0,false,false,1],
    [1,0,90,false,2,0,false,false,2],[1,0,90,true,0,0,false,false,2],[1,0,90,false,2,0,false,false,2],
    [1,0,90,false,2,0,false,false,2],[1,0,90,false,1,0,false,false,2],
  ]),
  p("wissa", "Yoane Wissa", "bre", "FWD", 6.0, [
    [0,1,80,true,0,0,false,false,1],[0,0,75,false,1,0,false,false,0],[1,0,85,false,1,0,false,false,2],
    [1,0,85,false,2,0,false,false,2],[1,0,80,true,0,0,false,false,2],[0,1,85,false,2,0,false,false,1],
    [0,0,70,false,2,0,false,false,0],[0,0,75,false,1,0,false,false,0],
  ]),
  p("janelt", "Vitaly Janelt", "bre", "MID", 5.0, [
    [0,1,90,true,0,0,false,false,2],[0,1,90,false,1,0,false,false,1],[0,0,85,false,1,0,false,false,0],
    [0,1,90,false,2,0,false,false,1],[0,1,90,true,0,0,false,false,2],[0,0,85,false,2,0,false,false,0],
    [0,1,90,false,2,0,false,false,1],[0,1,90,false,1,0,false,false,2],
  ]),
  p("schade", "Kevin Schade", "bre", "MID", 5.0, [
    [1,0,75,true,0,0,false,false,2],[0,0,65,false,1,0,false,false,0],[0,0,60,false,1,0,false,false,0],
    [0,1,80,false,2,0,false,false,1],[1,0,80,true,0,0,false,false,2],[1,0,85,false,2,0,false,false,2],
    [0,0,70,false,2,0,false,false,0],[0,0,75,false,1,0,false,false,0],
  ]),
  p("norgaard", "Christian Nørgaard", "bre", "MID", 4.5, [
    [0,0,85,true,0,0,false,false,0],[0,0,80,false,1,0,false,false,0],[0,0,75,false,1,0,false,false,0],
    [0,0,85,false,2,0,false,false,0],[0,1,80,true,0,0,false,false,1],[0,1,85,false,2,0,false,false,1],
    [0,0,75,false,2,0,false,false,0],[0,0,80,false,1,0,false,false,0],
  ]),
  p("damsgaard", "Mikkel Damsgaard", "bre", "MID", 4.5, [
    [0,1,65,true,0,0,false,false,1],[0,0,55,false,1,0,false,false,0],[0,0,50,false,1,0,false,false,0],
    [0,0,60,false,2,0,false,false,0],[0,1,65,true,0,0,false,false,1],[0,0,55,false,2,0,false,false,0],
    [0,0,50,false,2,0,false,false,0],[0,0,60,false,1,0,false,false,0],
  ]),

  // === LEEDS UNITED ===
  p("dcl", "Dominic Calvert-Lewin", "lee", "FWD", 6.5, [
    [1,0,90,true,0,0,false,false,2],[0,0,85,false,1,0,false,false,0],[1,0,90,false,1,0,false,false,2],
    [2,0,90,false,1,0,false,false,3],[1,0,90,true,0,0,false,false,2],[1,0,90,false,2,0,false,false,2],
    [1,0,90,false,1,0,false,false,2],[0,0,85,true,0,0,false,false,0],
  ]),
  p("ramazani", "Largie Ramazani", "lee", "MID", 5.0, [
    [0,1,85,true,0,0,false,false,1],[0,0,80,false,1,0,false,false,0],[0,0,75,false,1,0,false,false,0],
    [0,2,90,false,1,0,false,false,3],[0,0,80,true,0,0,false,false,0],[0,1,85,false,2,0,false,false,1],
    [0,1,85,false,1,0,false,false,1],[0,0,80,true,0,0,false,false,0],
  ]),
  p("aaronson", "Brenden Aaronson", "lee", "MID", 5.0, [
    [0,0,75,true,0,0,false,false,0],[0,0,70,false,1,0,false,false,0],[0,1,80,false,1,0,false,false,1],
    [1,1,85,false,1,0,false,false,3],[0,0,70,true,0,0,false,false,0],[0,0,75,false,2,0,false,false,0],
    [0,0,75,false,1,0,false,false,0],[0,0,70,true,0,0,false,false,0],
  ]),

  // === BOURNEMOUTH ===
  p("semenyo", "Antoine Semenyo", "bou", "MID", 5.5, [
    [1,0,85,false,2,0,false,false,2],[0,0,80,false,1,0,false,false,0],[1,0,85,false,2,0,false,false,2],
    [0,1,85,false,2,0,false,false,1],[0,0,80,false,1,0,false,false,0],[1,0,85,false,5,0,false,false,2],
    [1,0,90,true,0,0,false,false,2],[1,0,90,true,0,0,false,false,2],
  ]),
  p("tavernier_m", "Marcus Tavernier", "bou", "MID", 5.5, [
    [0,1,90,false,2,0,false,false,1],[0,0,85,false,1,0,false,false,0],[0,1,90,false,2,0,false,false,1],
    [0,1,90,false,2,0,false,false,1],[0,0,85,false,1,0,false,false,0],[0,1,90,false,5,0,false,false,1],
    [1,0,90,true,0,0,false,false,2],[2,0,90,true,0,0,false,false,3],
  ]),
  p("evanilson", "Evanilson", "bou", "FWD", 6.0, [
    [0,0,70,false,2,0,false,false,0],[1,0,80,false,1,0,false,false,2],[1,0,85,false,2,0,false,false,2],
    [1,0,85,false,2,0,false,false,2],[0,0,75,false,1,0,false,false,0],[0,0,65,false,5,0,false,false,0],
    [0,0,70,true,0,0,false,false,0],[0,1,85,true,0,0,false,false,1],
  ]),
  p("kluivert", "Justin Kluivert", "bou", "MID", 5.0, [
    [0,0,65,false,2,0,false,false,0],[0,0,60,false,1,0,false,false,0],[0,0,55,false,2,0,false,false,0],
    [1,0,80,false,2,0,false,false,2],[0,0,65,false,1,0,false,false,0],[0,0,60,false,5,0,false,false,0],
    [0,1,85,true,0,0,false,false,1],[0,1,80,true,0,0,false,false,1],
  ]),

  // === CRYSTAL PALACE ===
  p("mateta", "Jean-Philippe Mateta", "cry", "FWD", 6.0, [
    [0,0,85,false,2,0,false,false,0],[1,0,90,false,4,0,false,false,2],[2,0,90,false,3,0,false,false,3],
    [1,0,90,false,3,0,false,false,2],[0,0,80,true,0,0,false,false,0],[2,0,90,false,1,0,false,false,3],
    [0,0,85,false,5,0,false,false,0],[0,0,80,false,2,0,false,false,0],
  ]),
  p("eze", "Eberechi Eze", "cry", "MID", 6.5, [
    [0,0,85,false,2,0,false,false,0],[0,0,85,false,4,0,false,false,0],[1,0,90,false,3,0,false,false,2],
    [1,0,90,false,3,0,false,false,2],[0,0,80,true,0,0,false,false,0],[1,0,90,false,1,0,false,false,2],
    [0,0,80,false,5,0,false,false,0],[0,0,75,false,2,0,false,false,0],
  ]),
  p("kamada", "Daichi Kamada", "cry", "MID", 5.5, [
    [0,0,80,false,2,0,false,false,0],[0,0,80,false,4,0,false,false,0],[0,2,90,false,3,0,false,false,2],
    [0,1,90,false,3,0,false,false,1],[0,0,75,true,0,0,false,false,0],[0,2,90,false,1,0,false,false,3],
    [0,0,80,false,5,0,false,false,0],[0,0,75,false,2,0,false,false,0],
  ]),
  p("mitchell", "Tyrick Mitchell", "cry", "DEF", 4.5, [
    [0,0,90,false,2,0,false,false,0],[0,1,90,false,4,0,false,false,1],[0,0,90,false,3,0,false,false,0],
    [0,0,90,false,3,0,false,false,0],[0,0,90,true,0,0,false,false,1],[0,1,90,false,1,0,false,false,1],
    [0,0,90,false,5,0,false,false,0],[0,0,90,false,2,0,false,false,0],
  ]),

  // === MANCHESTER UNITED ===
  p("zirkzee", "Joshua Zirkzee", "mun", "FWD", 6.5, [
    [0,0,75,false,2,0,false,false,0],[2,0,85,false,2,0,false,false,3],[1,0,80,false,2,0,false,false,2],
    [0,0,70,false,1,0,false,false,0],[0,0,75,false,1,0,false,false,0],[1,0,85,false,1,0,false,false,2],
    [1,0,85,false,1,0,false,false,2],[0,0,80,false,3,0,false,false,0],
  ]),
  p("rashford", "Marcus Rashford", "mun", "MID", 7.0, [
    [0,0,70,false,2,0,false,false,0],[2,0,85,false,2,0,false,false,3],[0,0,75,false,2,0,false,false,0],
    [0,0,65,false,1,0,false,false,0],[0,0,70,false,1,0,false,false,0],[0,0,75,false,1,0,false,false,0],
    [0,0,70,false,1,0,false,false,0],[0,0,75,false,3,0,false,false,0],
  ]),
  p("bruno_f", "Bruno Fernandes", "mun", "MID", 8.5, [
    [0,0,90,false,2,0,false,false,0],[0,2,90,false,2,0,false,false,3],[1,0,90,false,2,0,false,false,2],
    [0,0,85,false,1,0,false,false,0],[0,0,85,false,1,0,false,false,0],[0,1,90,false,1,0,false,false,1],
    [0,0,85,false,1,0,false,false,0],[0,0,90,false,3,0,false,false,0],
  ]),
  p("amad", "Amad Diallo", "mun", "MID", 5.0, [
    [0,0,60,false,2,0,false,false,0],[0,1,70,false,2,0,false,false,1],[0,1,75,false,2,0,false,false,1],
    [0,0,65,false,1,0,false,false,0],[0,1,70,false,1,0,false,false,1],[0,0,65,false,1,0,false,false,0],
    [0,1,75,false,1,0,false,false,1],[0,0,70,false,3,0,false,false,0],
  ]),

  // === HULL CITY ===
  p("philogene", "Jaden Philogene", "hul", "MID", 6.0, [
    [1,0,88,true,0,0,false,false,2],[0,1,85,true,0,0,false,false,1],[0,0,80,true,0,0,false,false,0],
    [1,0,85,false,2,0,false,false,2],[1,0,85,false,2,0,false,false,2],[1,0,90,false,2,0,false,false,2],
    [0,0,80,false,1,0,false,false,0],[1,0,85,false,1,0,false,false,2],
  ]),
  p("estupinan_o", "Óscar Estupiñán", "hul", "FWD", 5.5, [
    [1,0,75,true,0,0,false,false,2],[0,0,70,true,0,0,false,false,0],[0,0,65,true,0,0,false,false,0],
    [0,0,70,false,2,0,false,false,0],[0,0,65,false,2,0,false,false,0],[1,0,80,false,2,0,false,false,2],
    [0,0,65,false,1,0,false,false,0],[0,0,70,false,1,0,false,false,0],
  ]),
  p("slater", "Regan Slater", "hul", "MID", 4.5, [
    [0,1,88,true,0,0,false,false,1],[0,0,85,true,0,0,false,false,0],[0,0,80,true,0,0,false,false,0],
    [0,1,85,false,2,0,false,false,1],[0,1,85,false,2,0,false,false,1],[0,1,90,false,2,0,false,false,1],
    [0,0,80,false,1,0,false,false,0],[0,1,85,false,1,0,false,false,1],
  ]),

  // === EVERTON ===
  p("mcneil", "Dwight McNeil", "eve", "MID", 5.5, [
    [1,0,88,true,0,0,false,false,2],[1,0,85,false,1,0,false,false,2],[1,1,90,false,2,0,false,false,3],
    [0,0,85,true,0,0,false,false,0],[0,1,85,true,0,0,false,false,1],[1,0,90,false,2,0,false,false,2],
    [0,0,80,false,2,0,false,false,0],[0,0,80,false,2,0,false,false,0],
  ]),
  p("beto", "Beto", "eve", "FWD", 5.0, [
    [0,0,65,true,0,0,false,false,0],[0,0,60,false,1,0,false,false,0],[1,0,75,false,2,0,false,false,2],
    [0,0,60,true,0,0,false,false,0],[0,0,55,true,0,0,false,false,0],[1,0,80,false,2,0,false,false,2],
    [0,0,65,false,2,0,false,false,0],[0,0,60,false,2,0,false,false,0],
  ]),
  p("harrison_j", "Jack Harrison", "eve", "MID", 4.5, [
    [0,1,85,true,0,0,false,false,1],[0,1,80,false,1,0,false,false,1],[0,0,75,false,2,0,false,false,0],
    [0,0,70,true,0,0,false,false,0],[0,0,65,true,0,0,false,false,0],[0,1,85,false,2,0,false,false,1],
    [0,0,70,false,2,0,false,false,0],[0,0,70,false,2,0,false,false,0],
  ]),
  p("tarkowski", "James Tarkowski", "eve", "DEF", 4.5, [
    [0,1,90,true,0,0,false,false,2],[0,0,90,false,1,0,false,false,0],[0,1,90,false,2,0,false,false,1],
    [0,0,90,true,0,0,false,false,1],[0,0,90,true,0,0,false,false,0],[0,1,90,false,2,0,false,false,1],
    [0,0,90,false,2,0,false,false,0],[0,0,90,false,2,0,false,false,0],
  ]),

  // === IPSWICH TOWN ===
  p("delap", "Liam Delap", "ips", "FWD", 5.5, [
    [1,0,88,false,1,0,false,false,2],[1,0,85,false,5,0,false,false,2],[0,0,80,false,2,0,false,false,0],
    [2,0,90,false,3,0,false,false,3],[0,0,75,false,1,0,false,false,0],[1,0,85,false,1,0,false,false,2],
    [1,0,85,false,3,0,false,false,2],[1,0,90,false,1,0,false,false,2],
  ]),
  p("hutchinson", "Omari Hutchinson", "ips", "MID", 5.0, [
    [1,0,85,false,1,0,false,false,2],[1,0,80,false,5,0,false,false,2],[0,0,75,false,2,0,false,false,0],
    [0,1,85,false,3,0,false,false,1],[0,0,70,false,1,0,false,false,0],[1,0,85,false,1,0,false,false,2],
    [1,0,85,false,3,0,false,false,2],[0,0,80,false,1,0,false,false,0],
  ]),
  p("davis_l", "Leif Davis", "ips", "DEF", 5.0, [
    [0,1,90,false,1,0,false,false,1],[0,0,90,false,5,0,false,false,0],[0,0,90,false,2,0,false,false,0],
    [0,2,90,false,3,0,false,false,3],[0,0,85,false,1,0,false,false,0],[0,1,90,false,1,0,false,false,1],
    [0,1,90,false,3,0,false,false,1],[0,1,90,false,1,0,false,false,2],
  ]),
  p("chaplin", "Conor Chaplin", "ips", "MID", 5.0, [
    [0,1,80,false,1,0,false,false,1],[0,0,75,false,5,0,false,false,0],[0,0,70,false,2,0,false,false,0],
    [0,0,80,false,3,0,false,false,0],[0,0,65,false,1,0,false,false,0],[0,1,85,false,1,0,false,false,1],
    [0,1,80,false,3,0,false,false,1],[0,0,75,false,1,0,false,false,0],
  ]),

  // === FULHAM ===
  p("muniz", "Rodrigo Muniz", "ful", "FWD", 5.5, [
    [1,0,85,false,3,0,false,false,2],[0,0,75,false,1,0,false,false,0],[1,0,85,false,3,0,false,false,2],
    [0,0,80,true,0,0,false,false,0],[1,0,80,false,1,0,false,false,2],[0,0,75,false,2,0,false,false,0],
    [1,0,85,true,0,0,false,false,2],[1,0,80,true,0,0,false,false,2],
  ]),
  p("smithrowe", "Emile Smith Rowe", "ful", "MID", 5.5, [
    [1,0,75,false,3,0,false,false,2],[0,0,65,false,1,0,false,false,0],[0,0,70,false,3,0,false,false,0],
    [0,0,65,true,0,0,false,false,0],[0,0,60,false,1,0,false,false,0],[0,0,65,false,2,0,false,false,0],
    [0,0,70,true,0,0,false,false,0],[0,0,65,true,0,0,false,false,0],
  ]),
  p("robinson_a", "Antonee Robinson", "ful", "DEF", 5.0, [
    [0,1,90,false,3,0,false,false,1],[0,0,85,false,1,0,false,false,0],[0,1,90,false,3,0,false,false,1],
    [0,0,90,true,0,0,false,false,1],[0,1,85,false,1,0,false,false,1],[0,1,90,false,2,0,false,false,1],
    [0,0,90,true,0,0,false,false,0],[0,0,90,true,0,0,false,false,0],
  ]),
  p("pereira", "Andreas Pereira", "ful", "MID", 6.0, [
    [0,0,85,false,3,0,false,false,0],[0,0,80,false,1,0,false,false,0],[0,1,85,false,3,0,false,false,1],
    [0,0,80,true,0,0,false,false,0],[0,0,75,false,1,0,false,false,0],[0,0,80,false,2,0,false,false,0],
    [0,1,85,true,0,0,false,false,1],[0,1,85,true,0,0,false,false,1],
  ]),

  // === SUNDERLAND ===
  p("isidor", "Wilson Isidor", "sun", "FWD", 5.0, [
    [1,0,80,false,2,0,false,false,2],[0,0,70,true,0,0,false,false,0],[0,0,65,false,1,0,false,false,0],
    [0,0,65,false,2,0,false,false,0],[2,0,85,false,5,0,false,false,3],[0,0,60,false,2,0,false,false,0],
    [0,0,65,false,2,0,false,false,0],[0,0,70,true,0,0,false,false,0],
  ]),
  p("roberts_p", "Patrick Roberts", "sun", "MID", 4.5, [
    [0,0,70,false,2,0,false,false,0],[0,1,75,true,0,0,false,false,1],[0,1,80,false,1,0,false,false,1],
    [0,0,65,false,2,0,false,false,0],[1,0,80,false,5,0,false,false,2],[0,0,60,false,2,0,false,false,0],
    [0,0,65,false,2,0,false,false,0],[0,0,70,true,0,0,false,false,0],
  ]),
  p("rigg", "Chris Rigg", "sun", "MID", 4.5, [
    [0,1,75,false,2,0,false,false,1],[0,0,70,true,0,0,false,false,0],[0,0,65,false,1,0,false,false,0],
    [0,0,60,false,2,0,false,false,0],[0,1,75,false,5,0,false,false,1],[0,0,55,false,2,0,false,false,0],
    [0,0,60,false,2,0,false,false,0],[0,0,65,true,0,0,false,false,0],
  ]),

  // === NOTTINGHAM FOREST ===
  p("wood", "Chris Wood", "nfo", "FWD", 6.0, [
    [0,0,85,false,1,0,false,false,0],[1,0,85,false,2,0,false,false,2],[0,0,80,true,0,0,false,false,0],
    [1,0,90,false,1,0,false,false,2],[0,0,75,false,1,0,false,false,0],[1,0,85,false,3,0,false,false,2],
    [0,0,80,false,1,0,false,false,0],[1,0,85,false,1,0,false,false,2],
  ]),
  p("gibbswhite", "Morgan Gibbs-White", "nfo", "MID", 6.5, [
    [0,0,85,false,1,0,false,false,0],[0,1,85,false,2,0,false,false,1],[0,0,80,true,0,0,false,false,0],
    [0,1,90,false,1,0,false,false,1],[0,0,75,false,1,0,false,false,0],[0,1,85,false,3,0,false,false,1],
    [0,0,80,false,1,0,false,false,0],[0,0,80,false,1,0,false,false,0],
  ]),
  p("elanga", "Anthony Elanga", "nfo", "MID", 5.5, [
    [0,0,80,false,1,0,false,false,0],[1,1,85,false,2,0,false,false,3],[0,0,75,true,0,0,false,false,0],
    [0,1,85,false,1,0,false,false,1],[0,0,70,false,1,0,false,false,0],[0,0,75,false,3,0,false,false,0],
    [0,0,75,false,1,0,false,false,0],[0,1,85,false,1,0,false,false,1],
  ]),

  // === COVENTRY CITY ===
  p("wright", "Haji Wright", "cov", "FWD", 5.5, [
    [0,0,80,false,3,0,false,false,0],[0,0,75,false,1,0,false,false,0],[0,0,70,false,1,0,false,false,0],
    [0,0,70,false,5,0,false,false,0],[1,0,80,true,0,0,false,false,2],[2,0,85,false,1,0,false,false,3],
    [1,0,85,false,3,0,false,false,2],[0,0,75,false,1,0,false,false,0],
  ]),
  p("sakamoto", "Tatsuhiro Sakamoto", "cov", "MID", 4.5, [
    [0,0,70,false,3,0,false,false,0],[0,0,65,false,1,0,false,false,0],[0,0,60,false,1,0,false,false,0],
    [0,0,60,false,5,0,false,false,0],[0,1,75,true,0,0,false,false,1],[1,0,80,false,1,0,false,false,2],
    [0,0,75,false,3,0,false,false,0],[0,0,70,false,1,0,false,false,0],
  ]),

  // === GOALKEEPERS ===
  p("raya", "David Raya", "ars", "GK", 5.5, [
    [0,0,90,true,0,0,false,false,1],[0,0,90,true,0,1,false,false,1],[0,0,90,false,1,3,false,false,0],
    [0,0,90,true,0,2,false,false,1],[0,0,90,false,3,4,false,false,0],[0,0,90,false,1,3,false,false,0],
    [0,0,90,true,0,1,false,false,1],[0,0,90,true,0,1,false,false,1],
  ]),
  p("ederson", "Ederson", "mci", "GK", 5.5, [
    [0,0,90,false,1,2,false,false,0],[0,0,90,false,1,1,false,false,0],[0,0,90,true,0,1,false,false,1],
    [0,0,90,true,0,0,false,false,1],[0,0,90,false,3,3,false,false,0],[0,0,90,true,0,1,false,false,1],
    [0,0,90,false,2,2,false,false,0],[0,0,90,false,1,2,false,false,0],
  ]),
  p("verbruggen", "Bart Verbruggen", "bri", "GK", 4.5, [
    [0,0,90,true,0,1,false,false,1],[0,0,90,false,3,4,false,false,0],[0,0,90,false,1,2,false,false,0],
    [0,0,90,true,0,0,false,false,1],[0,0,90,true,0,1,false,false,1],[0,0,90,true,0,0,false,false,1],
    [0,0,90,true,0,0,false,false,1],[0,0,90,false,2,3,false,false,0],
  ]),
  p("alisson", "Alisson", "liv", "GK", 5.0, [
    [0,0,90,false,2,3,false,false,0],[0,0,90,false,2,2,false,false,0],[0,0,90,true,0,1,false,false,1],
    [0,0,90,true,0,0,false,false,1],[0,0,90,true,0,1,false,false,1],[0,0,90,false,3,4,false,false,0],
    [0,0,90,false,1,2,false,false,0],[0,0,90,true,0,1,false,false,1],
  ]),
  p("sanchez", "Robert Sánchez", "che", "GK", 4.5, [
    [0,0,90,false,3,4,false,false,0],[0,0,90,false,4,5,false,false,0],[0,0,90,false,2,3,false,false,0],
    [0,0,90,false,2,3,false,false,0],[0,0,90,false,3,4,false,false,0],[0,0,90,false,1,2,false,false,0],
    [0,0,90,true,0,1,false,false,1],[0,0,90,false,2,3,false,false,0],
  ]),
  p("flekken", "Mark Flekken", "bre", "GK", 4.5, [
    [0,0,90,true,0,1,false,false,1],[0,0,90,false,1,2,false,false,0],[0,0,90,false,1,2,false,false,0],
    [0,0,90,false,2,3,false,false,0],[0,0,90,true,0,0,false,false,1],[0,0,90,false,2,3,false,false,0],
    [0,0,90,false,2,2,false,false,0],[0,0,90,false,1,2,false,false,0],
  ]),
  p("pickford", "Jordan Pickford", "eve", "GK", 4.5, [
    [0,0,90,true,0,2,false,false,1],[0,0,90,false,1,3,false,false,0],[0,0,90,false,2,3,false,false,0],
    [0,0,90,true,0,1,false,false,1],[0,0,90,true,0,1,false,false,1],[0,0,90,false,2,3,false,false,0],
    [0,0,90,false,2,4,false,false,0],[0,0,90,false,2,3,false,false,0],
  ]),
  p("onana", "André Onana", "mun", "GK", 4.5, [
    [0,0,90,false,2,3,false,false,0],[0,0,90,false,2,3,false,false,0],[0,0,90,false,2,3,false,false,0],
    [0,0,90,false,1,2,false,false,0],[0,0,90,false,1,2,false,false,0],[0,0,90,false,1,2,false,false,0],
    [0,0,90,false,1,2,false,false,0],[0,0,90,false,3,5,false,false,0],
  ]),
  p("palmer_gk", "Alex Palmer", "sun", "GK", 4.0, [
    [0,0,90,false,2,4,false,false,0],[0,0,90,true,0,1,false,false,1],[0,0,90,false,1,3,false,false,0],
    [0,0,90,false,2,3,false,false,0],[0,0,90,false,5,6,false,false,0],[0,0,90,false,2,3,false,false,0],
    [0,0,90,false,2,4,false,false,0],[0,0,90,true,0,1,false,false,1],
  ]),
];

// Get players sorted by total FPL points
export function getPlayersByFPL(position?: Position): Player[] {
  const filtered = position ? players.filter(p => p.position === position) : [...players];
  return filtered.sort((a, b) => getTotalFPLPoints(b) - getTotalFPLPoints(a));
}

export function getTopScorers(limit = 10): Player[] {
  return [...players].sort((a, b) => b.totalGoals - a.totalGoals).slice(0, limit);
}

export function getTopAssisters(limit = 10): Player[] {
  return [...players].sort((a, b) => b.totalAssists - a.totalAssists).slice(0, limit);
}

export function getBestValue(limit = 10): Player[] {
  return [...players].sort((a, b) => 
    (getTotalFPLPoints(b) / b.price) - (getTotalFPLPoints(a) / a.price)
  ).slice(0, limit);
}

export function getInFormPlayers(limit = 10): Player[] {
  return [...players].sort((a, b) => {
    const formA = [6,7,8].reduce((s, gw) => s + calculateGWPoints(a, gw).total, 0);
    const formB = [6,7,8].reduce((s, gw) => s + calculateGWPoints(b, gw).total, 0);
    return formB - formA;
  }).slice(0, limit);
}

export function getDifferentials(limit = 10): Player[] {
  return players
    .filter(p => p.price >= 4.5 && p.price <= 6.5 && getTotalFPLPoints(p) > 30)
    .sort((a, b) => (getTotalFPLPoints(b) / b.price) - (getTotalFPLPoints(a) / a.price))
    .slice(0, limit);
}
