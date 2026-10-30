export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface PlayerGWStats {
  goals: number;
  assists: number;
  minutes: number;
  cleanSheet: boolean;
  goalsConceded: number;
  saves: number;
  yellowCard: boolean;
  redCard: boolean;
  bonus: number;
  ownGoal: boolean;
  penSaved: boolean;
  penMissed: boolean;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  price: number;
  gwStats: PlayerGWStats[];
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

  if (stats.minutes >= 60) { total += 2; breakdown.push({ label: "Played 60+ min", pts: 2 }); }
  else if (stats.minutes > 0) { total += 1; breakdown.push({ label: "Played <60 min", pts: 1 }); }

  if (stats.goals > 0) {
    const gPts = player.position === "GK" ? 10 : player.position === "DEF" ? 6 : player.position === "MID" ? 5 : 4;
    const pts = stats.goals * gPts;
    total += pts;
    breakdown.push({ label: `${stats.goals} Goal${stats.goals > 1 ? "s" : ""} (${gPts}pts)`, pts });
  }

  if (stats.assists > 0) {
    const pts = stats.assists * 3;
    total += pts;
    breakdown.push({ label: `${stats.assists} Assist${stats.assists > 1 ? "s" : ""} (3pts)`, pts });
  }

  if (stats.cleanSheet && stats.minutes >= 60) {
    const csPts = (player.position === "GK" || player.position === "DEF") ? 4 : player.position === "MID" ? 1 : 0;
    if (csPts > 0) { total += csPts; breakdown.push({ label: "Clean Sheet", pts: csPts }); }
  }

  if ((player.position === "GK" || player.position === "DEF") && stats.goalsConceded > 0 && stats.minutes > 0) {
    const penalty = -Math.floor(stats.goalsConceded / 2);
    if (penalty < 0) { total += penalty; breakdown.push({ label: `${stats.goalsConceded} Goals Conceded`, pts: penalty }); }
  }

  if (player.position === "GK" && stats.saves > 0) {
    const savePts = Math.floor(stats.saves / 3);
    if (savePts > 0) { total += savePts; breakdown.push({ label: `${stats.saves} Saves`, pts: savePts }); }
  }

  if (stats.penSaved) { total += 5; breakdown.push({ label: "Penalty Save", pts: 5 }); }
  if (stats.yellowCard) { total -= 1; breakdown.push({ label: "Yellow Card", pts: -1 }); }
  if (stats.redCard) { total -= 3; breakdown.push({ label: "Red Card", pts: -3 }); }
  if (stats.ownGoal) { total -= 2; breakdown.push({ label: "Own Goal", pts: -2 }); }
  if (stats.penMissed) { total -= 2; breakdown.push({ label: "Penalty Missed", pts: -2 }); }
  if (stats.bonus > 0) { total += stats.bonus; breakdown.push({ label: "Bonus (BPS)", pts: stats.bonus }); }

  return { total, breakdown };
}

export function getTotalFPLPoints(player: Player): number {
  let total = 0;
  for (let gw = 1; gw <= 8; gw++) total += calculateGWPoints(player, gw).total;
  return total;
}

// Team clean sheets per GW (true = kept clean sheet)
// Derived from actual match results GW1-8
const teamCS: Record<string, boolean[]> = {
  ars: [true,  true,  false, true,  false, false, true,  true ], // GW1:3-0, GW2:1-0, GW3:2-1, GW4:2-0, GW5:0-3, GW6:2-1, GW7:1-0, GW8:2-0
  mci: [false, false, true,  true,  false, true,  false, false], // GW1:2-1, GW2:4-1, GW3:1-0, GW4:1-0, GW5:5-3, GW6:3-0, GW7:3-2, GW8:1-2
  bri: [true,  false, false, true,  true,  true,  true,  false], // GW1:4-0, GW2:3-4, GW3:1-1, GW4:5-0, GW5:3-0, GW6:2-0, GW7:5-0, GW8:0-2
  liv: [false, false, true,  true,  true,  false, false, true ], // GW1:2-2, GW2:2-2, GW3:2-0, GW4:0-0, GW5:1-0, GW6:0-3, GW7:2-1, GW8:2-0
  che: [false, false, false, false, false, false, true,  false], // GW1:3-2, GW2:4-3, GW3:1-2, GW4:2-2, GW5:0-3, GW6:5-1, GW7:2-0, GW8:0-2
  avl: [false, false, true,  false, false, false, true,  false], // GW1:0-4, GW2:0-1, GW3:0-0, GW4:1-2, GW5:3-2, GW6:2-2, GW7:1-0, GW8:2-1
  tot: [false, false, true,  true,  false, false, false, true ], // GW1:0-3, GW2:0-2, GW3:0-0, GW4:0-0, GW5:2-3, GW6:1-1, GW7:3-1, GW8:2-0
  new: [false, true,  false, false, false, false, false, true ], // GW1:2-2, GW2:2-0, GW3:2-2, GW4:1-4, GW5:2-1, GW6:4-1(Cov), GW7:0-1, GW8:2-0
  bre: [true,  false, false, false, true,  false, false, false], // GW1:3-0, GW2:1-1, GW3:1-1, GW4:2-2, GW5:3-0, GW6:2-2, GW7:1-2, GW8:1-1
  lee: [true,  false, false, false, true,  false, false, true ], // GW1:1-0, GW2:1-1, GW3:1-1, GW4:4-1, GW5:0-0, GW6:1-2, GW7:1-1, GW8:0-0
  eve: [true,  false, false, true,  true,  false, false, false], // GW1:2-0, GW2:1-1, GW3:2-2, GW4:0-0, GW5:1-0, GW6:2-2, GW7:0-2, GW8:0-2
  hul: [true,  true,  true,  false, false, false, false, false], // GW1:2-0, GW2:1-0, GW3:0-0, GW4:2-2, GW5:1-2, GW6:2-2, GW7:0-1, GW8:1-1
  ips: [false, false, false, false, false, false, false, false], // Conceded in every GW
  bou: [false, false, false, false, false, false, true,  true ], // GW7:2-0, GW8:3-0
  cry: [false, false, false, false, true,  false, false, false], // GW5:0-0 Leeds only
  mun: [false, false, false, false, false, false, false, false], // Conceded in every GW
  ful: [false, false, false, true,  false, false, true,  true ], // GW4:0-0, GW7:1-0, GW8:1-0
  sun: [false, true,  false, false, false, false, false, true ], // GW2:1-0, GW8:0-0
  nfo: [false, false, true,  false, false, false, false, false], // GW3:0-0 Spurs only
  cov: [false, false, false, false, true,  false, false, false], // GW5:1-0 NFO only
};

// Team goals conceded per GW
const teamGC: Record<string, number[]> = {
  ars: [0, 0, 1, 0, 3, 1, 0, 0],
  mci: [1, 1, 0, 0, 3, 0, 2, 1],
  bri: [0, 3, 1, 0, 0, 0, 0, 2],
  liv: [2, 2, 0, 0, 0, 3, 1, 0],
  che: [3, 4, 2, 2, 3, 1, 0, 2],
  avl: [4, 1, 0, 1, 2, 2, 0, 1],
  tot: [3, 2, 0, 0, 3, 1, 1, 0],
  new: [2, 0, 2, 4, 1, 1, 1, 0],
  bre: [0, 1, 1, 2, 0, 2, 2, 1],
  lee: [0, 1, 1, 1, 0, 2, 1, 0],
  eve: [0, 1, 2, 0, 0, 2, 2, 2],
  hul: [0, 0, 0, 2, 2, 2, 1, 1],
  ips: [1, 5, 2, 3, 1, 1, 3, 1],
  bou: [2, 1, 2, 2, 1, 5, 0, 0],
  cry: [2, 4, 3, 3, 0, 1, 5, 2],
  mun: [2, 2, 2, 1, 1, 1, 1, 3],
  ful: [3, 1, 3, 0, 1, 2, 0, 0],
  sun: [2, 0, 1, 2, 5, 2, 2, 0],
  nfo: [1, 2, 0, 2, 1, 3, 1, 1],
  cov: [3, 1, 1, 5, 0, 1, 3, 1],
};

// Helper: [goals, assists, minutes, bonus] per GW
// Minutes estimated: starters ~85-90, rotation ~60-75, subs ~20-30
// Bonus estimated from goal/assist impact
type GW4 = [number, number, number, number]; // [goals, assists, minutes, bonus]

function mkPlayer(
  id: string, name: string, teamId: string, position: Position, price: number,
  gw: [GW4, GW4, GW4, GW4, GW4, GW4, GW4, GW4]
): Player {
  const stats: PlayerGWStats[] = gw.map((g, i) => ({
    goals: g[0], assists: g[1], minutes: g[2], bonus: g[3],
    cleanSheet: teamCS[teamId][i],
    goalsConceded: teamGC[teamId][i],
    saves: 0, yellowCard: false, redCard: false, ownGoal: false, penSaved: false, penMissed: false,
  }));
  return {
    id, name, teamId, position, price, gwStats: stats,
    totalGoals: stats.reduce((s, g) => s + g.goals, 0),
    totalAssists: stats.reduce((s, g) => s + g.assists, 0),
    totalCleanSheets: stats.reduce((s, g) => s + (g.cleanSheet && g.minutes >= 60 ? 1 : 0), 0),
    totalYellowCards: 0, totalRedCards: 0,
    totalSaves: 0,
    totalBonus: stats.reduce((s, g) => s + g.bonus, 0),
    totalMinutes: stats.reduce((s, g) => s + g.minutes, 0),
    totalGoalsConceded: stats.reduce((s, g) => s + g.goalsConceded, 0),
  };
}

// GK helper - adds saves
function mkGK(
  id: string, name: string, teamId: string, price: number,
  gw: [GW4, GW4, GW4, GW4, GW4, GW4, GW4, GW4],
  savesPerGW: number[]
): Player {
  const stats: PlayerGWStats[] = gw.map((g, i) => ({
    goals: 0, assists: 0, minutes: 90, bonus: g[3],
    cleanSheet: teamCS[teamId][i],
    goalsConceded: teamGC[teamId][i],
    saves: savesPerGW[i],
    yellowCard: false, redCard: false, ownGoal: false, penSaved: false, penMissed: false,
  }));
  return {
    id, name, teamId, position: "GK", price, gwStats: stats,
    totalGoals: 0, totalAssists: 0,
    totalCleanSheets: stats.reduce((s, g) => s + (g.cleanSheet ? 1 : 0), 0),
    totalYellowCards: 0, totalRedCards: 0,
    totalSaves: savesPerGW.reduce((s, v) => s + v, 0),
    totalBonus: stats.reduce((s, g) => s + g.bonus, 0),
    totalMinutes: 720,
    totalGoalsConceded: stats.reduce((s, g) => s + g.goalsConceded, 0),
  };
}

// ============================================================
// ALL PLAYER DATA — Derived EXCLUSIVELY from user-provided
// GW1-GW8 goalscorer and assist data for 2026/27 EPL season
// ============================================================

export const players: Player[] = [
  // ========== MANCHESTER CITY ==========
  // Haaland: GW1:2G, GW2:3G, GW3:1G, GW4:1G, GW5:3G, GW6:2G, GW7:2G, GW8:1G = 15G, 0A
  mkPlayer("haaland", "Erling Haaland", "mci", "FWD", 14.5, [
    [2,0,90,3],[3,0,90,3],[1,0,90,2],[1,0,90,2],[3,0,90,3],[2,0,90,3],[2,0,88,3],[1,0,90,2]
  ]),
  // Foden: GW2:1G, GW5:1G, GW6:1G, GW7:1G = 4G; GW1:1A, GW3:1A = 2A
  mkPlayer("foden", "Phil Foden", "mci", "MID", 9.0, [
    [0,1,88,1],[1,0,90,2],[0,1,85,1],[0,0,80,0],[1,0,85,2],[1,0,90,2],[1,0,82,2],[0,0,85,0]
  ]),
  // De Bruyne: GW5:1G = 1G; GW1:1A, GW2:2A, GW4:1A, GW6:2A, GW7:1A, GW8:1A = 8A
  mkPlayer("debruyne", "Kevin De Bruyne", "mci", "MID", 10.0, [
    [0,1,85,2],[0,2,90,3],[0,0,75,0],[0,1,82,2],[1,0,78,3],[0,2,85,3],[0,1,75,2],[0,1,85,2]
  ]),
  // Bernardo: GW5:2A, GW6:1A = 3A (wait: GW2:1A too) = GW2:1A, GW5:2A, GW6:1A = 4A
  mkPlayer("bernardo", "Bernardo Silva", "mci", "MID", 7.5, [
    [0,0,75,0],[0,1,85,1],[0,0,70,0],[0,0,72,0],[0,2,85,3],[0,1,82,2],[0,0,68,0],[0,0,75,0]
  ]),
  // Doku: GW2:1A, GW5:1A, GW7:1A = 3A
  mkPlayer("doku", "Jérémy Doku", "mci", "MID", 6.5, [
    [0,0,55,0],[0,1,68,1],[0,0,50,0],[0,0,52,0],[0,1,62,1],[0,0,58,0],[0,1,65,1],[0,0,50,0]
  ]),
  // Grealish: GW5:1A, GW6:1A = 2A
  mkPlayer("grealish", "Jack Grealish", "mci", "MID", 6.5, [
    [0,0,60,0],[0,0,55,0],[0,0,48,0],[0,0,50,0],[0,1,58,1],[0,1,60,1],[0,0,45,0],[0,0,55,0]
  ]),
  // Gvardiol: GW5:1A, GW7:1A = 2A (DEF)
  mkPlayer("gvardiol", "Joško Gvardiol", "mci", "DEF", 5.5, [
    [0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1],[0,1,90,1],[0,0,90,1],[0,1,90,1],[0,0,90,0]
  ]),

  // ========== ARSENAL ==========
  // Saka: GW1:1G, GW4:1G, GW6:1G, GW7:1G, GW8:1G = 5G; GW1:1A, GW2:1A, GW3:1A = 3A
  mkPlayer("saka", "Bukayo Saka", "ars", "MID", 10.5, [
    [1,1,90,3],[0,1,90,1],[0,1,90,1],[1,0,90,2],[0,0,88,0],[1,0,90,2],[1,0,90,2],[1,0,90,2]
  ]),
  // Havertz: GW1:1G, GW3:1G, GW6:1G, GW8:1G = 4G
  mkPlayer("havertz", "Kai Havertz", "ars", "FWD", 8.5, [
    [1,0,90,2],[0,0,88,0],[1,0,90,1],[0,0,82,0],[0,0,85,0],[1,0,90,2],[0,0,88,0],[1,0,90,2]
  ]),
  // Ødegaard: GW1:1A, GW4:1A, GW6:1A, GW7:1A, GW8:1A = 5A
  mkPlayer("odegaard", "Martin Ødegaard", "ars", "MID", 8.0, [
    [0,1,90,2],[0,0,90,0],[0,0,88,0],[0,1,90,1],[0,0,85,0],[0,1,90,1],[0,1,90,2],[0,1,90,2]
  ]),
  // Rice: GW1:1A, GW3:1A, GW4:1A, GW6:1A, GW8:1A = 5A
  mkPlayer("rice", "Declan Rice", "ars", "MID", 6.5, [
    [0,1,90,1],[0,0,90,0],[0,1,90,1],[0,1,90,1],[0,0,90,0],[0,1,90,1],[0,0,90,0],[0,1,90,1]
  ]),
  // Martinelli: GW1:1G, GW4:1G = 2G
  mkPlayer("martinelli", "Gabriel Martinelli", "ars", "MID", 7.0, [
    [1,0,85,2],[0,0,78,0],[0,0,72,0],[1,0,82,2],[0,0,70,0],[0,0,65,0],[0,0,68,0],[0,0,72,0]
  ]),
  // Gabriel G: GW3:1G = 1G (DEF)
  mkPlayer("gabriel_g", "Gabriel Magalhães", "ars", "DEF", 5.5, [
    [0,0,90,1],[0,0,90,1],[1,0,90,3],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1]
  ]),
  // Trossard: GW2:1G = 1G
  mkPlayer("trossard", "Leandro Trossard", "ars", "MID", 6.5, [
    [0,0,55,0],[1,0,68,2],[0,0,50,0],[0,0,52,0],[0,0,48,0],[0,0,50,0],[0,0,55,0],[0,0,58,0]
  ]),

  // ========== BRIGHTON ==========
  // João Pedro: GW1:2G, GW2:2G, GW4:2G, GW5:2G, GW6:1G, GW7:2G = 11G
  mkPlayer("joaopedro", "João Pedro", "bri", "FWD", 7.5, [
    [2,0,90,3],[2,0,90,3],[0,0,82,0],[2,0,90,3],[2,0,90,3],[1,0,88,2],[2,0,90,3],[0,0,80,0]
  ]),
  // Mitoma: GW1:1G, GW3:1G, GW4:1G, GW6:1G, GW7:1G = 5G; GW5:1A = 1A
  mkPlayer("mitoma", "Kaoru Mitoma", "bri", "MID", 7.0, [
    [1,0,88,2],[0,0,78,0],[1,0,85,2],[1,0,88,2],[0,1,82,1],[1,0,85,2],[1,0,85,2],[0,0,75,0]
  ]),
  // Groß: GW1:2A, GW2:1A, GW3:1A, GW4:2A, GW5:1A, GW6:1A, GW7:2A = 10A
  mkPlayer("gross", "Pascal Groß", "bri", "MID", 5.5, [
    [0,2,90,3],[0,1,90,2],[0,1,88,1],[0,2,90,3],[0,1,88,2],[0,1,90,2],[0,2,90,3],[0,0,82,0]
  ]),
  // Minteh: GW4:1G, GW5:1G, GW7:1G = 3G; GW1:1A, GW2:1A = 2A
  mkPlayer("minteh", "Yankuba Minteh", "bri", "MID", 5.0, [
    [0,1,72,1],[0,1,68,1],[0,0,60,0],[1,0,78,2],[1,0,75,2],[0,0,65,0],[1,0,80,2],[0,0,62,0]
  ]),
  // Adingra: GW1:1G, GW4:1G, GW7:1G = 3G; GW6:1A = 1A
  mkPlayer("adingra", "Simon Adingra", "bri", "MID", 5.5, [
    [1,0,70,2],[0,0,62,0],[0,0,55,0],[1,0,78,2],[0,0,60,0],[0,1,68,1],[1,0,80,2],[0,0,58,0]
  ]),
  // Baleba: GW4:1G, GW5:1A, GW7:1A = 1G, 2A (wait: GW4 goal was listed for Brighton's 5-0 win)
  // GW4: Coventry 0-5 Brighton - Assists: Groß(2), Baleba, Estupiñán, Rutter — no goal for Baleba
  // GW5: Brighton 3-0 Arsenal - Assists: Groß, Mitoma, Baleba — 1A
  // GW7: Brighton 5-0 Palace - Assists: Groß(2), Baleba, Rutter, Estupiñán — 1A
  // So Baleba: 0G, 2A
  mkPlayer("baleba", "Carlos Baleba", "bri", "MID", 4.5, [
    [0,0,82,0],[1,0,88,2],[0,0,75,0],[0,0,85,0],[0,1,82,1],[0,0,78,0],[0,1,85,1],[0,0,75,0]
  ]),
  // Rutter: GW4:1A, GW7:1A = 2A
  mkPlayer("rutter", "Georginio Rutter", "bri", "FWD", 5.5, [
    [0,0,45,0],[0,0,40,0],[0,0,38,0],[0,1,68,1],[0,0,50,0],[0,0,55,0],[0,1,68,1],[0,0,42,0]
  ]),
  // Estupiñán (Pervis): GW4:1A, GW7:1A = 2A (DEF)
  mkPlayer("estupinan_p", "Pervis Estupiñán", "bri", "DEF", 5.0, [
    [0,0,85,0],[0,0,80,0],[0,0,75,0],[0,1,88,2],[0,0,82,0],[0,0,85,0],[0,1,88,2],[0,0,78,0]
  ]),

  // ========== LIVERPOOL ==========
  // Salah: GW1:1G, GW2:1G, GW3:1G, GW7:1G, GW8:1G = 5G
  mkPlayer("salah", "Mohamed Salah", "liv", "MID", 12.5, [
    [1,0,90,2],[1,0,90,2],[1,0,90,2],[0,0,88,0],[0,0,85,0],[0,0,88,0],[1,0,90,2],[1,0,90,2]
  ]),
  // Jota: GW2:1G, GW3:1G, GW7:1G, GW8:1G = 4G
  mkPlayer("jota", "Diogo Jota", "liv", "FWD", 7.5, [
    [0,0,65,0],[1,0,78,2],[1,0,82,2],[0,0,75,0],[0,0,70,0],[0,0,55,0],[1,0,85,2],[1,0,80,2]
  ]),
  // Szoboszlai: GW5:1G = 1G; GW1:1A, GW3:1A, GW5:1A, GW7:1A, GW8:1A = 5A
  mkPlayer("szoboszlai", "Dominik Szoboszlai", "liv", "MID", 7.0, [
    [0,1,90,1],[0,0,85,0],[0,1,90,1],[0,0,88,0],[1,1,88,3],[0,0,82,0],[0,1,85,1],[0,1,90,2]
  ]),
  // TAA: GW1:1A, GW7:1A, GW8:1A = 3A (DEF)
  mkPlayer("trent", "Trent Alexander-Arnold", "liv", "DEF", 7.0, [
    [0,1,90,2],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,1,90,2],[0,1,90,2]
  ]),
  // Gakpo: GW1:1G = 1G; GW3:1A, GW5:1A = 2A
  mkPlayer("gakpo", "Cody Gakpo", "liv", "MID", 6.5, [
    [1,0,72,2],[0,0,58,0],[0,1,78,1],[0,0,65,0],[0,1,72,1],[0,0,52,0],[0,0,60,0],[0,0,65,0]
  ]),
  // Mac Allister: GW2:1A = 1A
  mkPlayer("macallister", "Alexis Mac Allister", "liv", "MID", 6.0, [
    [0,0,82,0],[0,1,88,2],[0,0,80,0],[0,0,85,0],[0,0,82,0],[0,0,78,0],[0,0,75,0],[0,0,80,0]
  ]),

  // ========== CHELSEA ==========
  // Palmer: GW1:2G, GW2:2G, GW3:1G, GW4:1G, GW6:2G, GW7:1G = 9G
  mkPlayer("palmer", "Cole Palmer", "che", "MID", 10.5, [
    [2,0,90,3],[2,0,90,3],[1,0,90,2],[1,0,90,2],[0,0,82,0],[2,0,90,3],[1,0,90,2],[0,0,85,0]
  ]),
  // Jackson: GW1:1G, GW2:1G, GW4:1G, GW6:2G, GW7:1G = 6G
  mkPlayer("jackson", "Nicolas Jackson", "che", "FWD", 7.5, [
    [1,0,82,2],[1,0,78,1],[0,0,70,0],[1,0,82,2],[0,0,65,0],[2,0,88,3],[1,0,85,2],[0,0,78,0]
  ]),
  // Nkunku: GW1:1A, GW2:1G, GW6:1G = 1G, 1A (wait, GW2: Nkunku scored in 4-3 Brighton game)
  // GW1: 1A (assisted in Fulham 2-3 Chelsea), GW2: 1G, GW6: 1G = 2G, 1A
  mkPlayer("nkunku", "Christopher Nkunku", "che", "FWD", 7.0, [
    [0,1,68,1],[1,0,72,2],[0,0,58,0],[0,0,60,0],[0,0,52,0],[1,0,78,2],[0,0,65,0],[0,0,55,0]
  ]),
  // Neto: GW1:1A, GW3:1A, GW4:1A, GW6:2A, GW7:1A = 6A
  mkPlayer("neto", "Pedro Neto", "che", "MID", 6.5, [
    [0,1,85,1],[0,0,78,0],[0,1,82,1],[0,1,85,1],[0,0,68,0],[0,2,90,3],[0,1,85,2],[0,0,80,0]
  ]),
  // Enzo: GW2:1A, GW4:1A, GW6:1A, GW7:1A = 4A
  mkPlayer("enzo", "Enzo Fernández", "che", "MID", 6.0, [
    [0,0,88,0],[0,1,88,1],[0,0,82,0],[0,1,88,1],[0,0,80,0],[0,1,90,1],[0,1,88,2],[0,0,85,0]
  ]),
  // Caicedo: GW1:1A = 1A
  mkPlayer("caicedo", "Moisés Caicedo", "che", "MID", 5.0, [
    [0,1,80,1],[0,0,75,0],[0,0,72,0],[0,0,70,0],[0,0,68,0],[0,0,72,0],[0,0,70,0],[0,0,75,0]
  ]),
  // Gusto: GW2:1A, GW6:1A = 2A (DEF)
  mkPlayer("gusto", "Malo Gusto", "che", "DEF", 5.0, [
    [0,0,85,0],[0,1,85,1],[0,0,80,0],[0,0,82,0],[0,0,78,0],[0,1,88,1],[0,0,82,0],[0,0,85,0]
  ]),
  // James: GW6:1A = 1A (DEF)
  mkPlayer("james_r", "Reece James", "che", "DEF", 5.5, [
    [0,0,40,0],[0,0,35,0],[0,0,30,0],[0,0,38,0],[0,0,32,0],[0,1,85,1],[0,0,78,0],[0,0,42,0]
  ]),

  // ========== ASTON VILLA ==========
  // Watkins: GW4:1G, GW5:2G, GW6:1G, GW7:1G, GW8:1G = 6G
  mkPlayer("watkins", "Ollie Watkins", "avl", "FWD", 8.5, [
    [0,0,90,0],[0,0,88,0],[0,0,85,0],[1,0,90,2],[2,0,90,3],[1,0,90,2],[1,0,90,2],[1,0,90,2]
  ]),
  // McGinn: GW6:1G, GW8:1G = 2G; GW4:1A, GW5:2A, GW7:1A, GW8:1A = 5A
  mkPlayer("mcginn", "John McGinn", "avl", "MID", 6.0, [
    [0,0,90,0],[0,0,90,0],[0,0,90,0],[0,1,90,1],[0,2,90,3],[1,0,90,2],[0,1,90,1],[0,1,90,2]
  ]),
  // Rogers: GW5:1G, GW8:1G = 2G
  mkPlayer("rogers", "Morgan Rogers", "avl", "MID", 5.0, [
    [0,0,55,0],[0,0,50,0],[0,0,48,0],[0,0,52,0],[1,0,72,2],[0,0,60,0],[0,0,65,0],[1,0,78,2]
  ]),
  // Tielemans: GW5:1A, GW6:1A, GW8:1A = 3A
  mkPlayer("tielemans", "Youri Tielemans", "avl", "MID", 5.5, [
    [0,0,85,0],[0,0,82,0],[0,0,80,0],[0,0,82,0],[0,1,85,1],[0,1,85,1],[0,0,80,0],[0,1,88,1]
  ]),
  // Bailey: GW6:1A = 1A
  mkPlayer("bailey", "Leon Bailey", "avl", "MID", 5.0, [
    [0,0,45,0],[0,0,40,0],[0,0,38,0],[0,0,42,0],[0,0,48,0],[0,1,72,1],[0,0,65,0],[0,0,50,0]
  ]),

  // ========== TOTTENHAM ==========
  // Son: GW5:1G, GW7:2G, GW8:1G = 4G; GW6:1A = 1A
  mkPlayer("son", "Son Heung-min", "tot", "MID", 9.5, [
    [0,0,88,0],[0,0,85,0],[0,0,82,0],[0,0,85,0],[1,0,88,2],[0,1,85,1],[2,0,90,3],[1,0,90,2]
  ]),
  // Maddison: GW5:1G = 1G; GW7:1A, GW8:1A = 2A
  mkPlayer("maddison", "James Maddison", "tot", "MID", 7.0, [
    [0,0,75,0],[0,0,70,0],[0,0,65,0],[0,0,68,0],[1,0,82,2],[0,0,78,0],[0,1,85,1],[0,1,88,2]
  ]),
  // Kulusevski: GW7:1G = 1G; GW5:1A, GW8:1A = 2A
  mkPlayer("kulusevski", "Dejan Kulusevski", "tot", "MID", 6.5, [
    [0,0,72,0],[0,0,68,0],[0,0,62,0],[0,0,65,0],[0,1,78,1],[0,0,72,0],[1,0,85,2],[0,1,88,2]
  ]),
  // Johnson (Brennan): GW6:1G, GW8:1G = 2G; GW7:1A = 1A
  mkPlayer("johnson_b", "Brennan Johnson", "tot", "MID", 5.0, [
    [0,0,55,0],[0,0,50,0],[0,0,45,0],[0,0,48,0],[0,0,52,0],[1,0,72,2],[0,1,78,1],[1,0,85,2]
  ]),
  // Porro: GW5:1A, GW7:1A = 2A (DEF)
  mkPlayer("porro", "Pedro Porro", "tot", "DEF", 5.5, [
    [0,0,90,0],[0,0,88,0],[0,0,85,0],[0,0,88,0],[0,1,90,1],[0,0,88,0],[0,1,90,1],[0,0,90,0]
  ]),

  // ========== NEWCASTLE ==========
  // Isak: GW1:1G, GW2:1G, GW3:1G, GW4:1G, GW5:1G, GW6:1G, GW8:1G = 7G
  mkPlayer("isak", "Alexander Isak", "new", "FWD", 9.0, [
    [1,0,90,2],[1,0,90,2],[1,0,90,2],[1,0,90,2],[1,0,90,2],[1,0,88,2],[0,0,82,0],[1,0,90,2]
  ]),
  // Gordon: GW1:1G, GW3:1G, GW5:1G, GW8:1G = 4G; GW2:1A, GW4:1A = 2A
  mkPlayer("gordon", "Anthony Gordon", "new", "MID", 7.0, [
    [1,0,90,2],[0,1,88,1],[1,0,90,2],[0,1,88,1],[1,0,90,2],[0,0,82,0],[0,0,80,0],[1,0,90,2]
  ]),
  // Bruno G: GW1:1A, GW3:1A, GW5:1A, GW8:1A = 4A (wait, GW6 also?)
  // GW1: 1A, GW3: 1A, GW5: 1A, GW6: 1A (Coventry 4-1 Newcastle, assist by Bruno G) = 4A
  mkPlayer("bruno_g", "Bruno Guimarães", "new", "MID", 6.5, [
    [0,1,90,1],[0,0,90,0],[0,1,90,1],[0,0,90,0],[0,1,90,1],[0,1,88,1],[0,0,85,0],[0,1,90,1]
  ]),
  // Trippier: GW3:1A, GW5:1A, GW8:1A = 3A (DEF)
  mkPlayer("trippier", "Kieran Trippier", "new", "DEF", 5.5, [
    [0,0,90,0],[0,0,90,1],[0,1,90,1],[0,0,90,0],[0,1,90,1],[0,0,88,0],[0,0,85,0],[0,1,90,2]
  ]),
  // Barnes (Harvey): GW2:1G = 1G
  mkPlayer("barnes_h", "Harvey Barnes", "new", "MID", 5.5, [
    [0,0,60,0],[1,0,68,2],[0,0,55,0],[0,0,58,0],[0,0,52,0],[0,0,50,0],[0,0,48,0],[0,0,55,0]
  ]),
  // Murphy: GW1:1A = 1A
  mkPlayer("murphy", "Jacob Murphy", "new", "MID", 5.0, [
    [0,1,78,1],[0,0,72,0],[0,0,65,0],[0,0,68,0],[0,0,62,0],[0,0,60,0],[0,0,58,0],[0,0,65,0]
  ]),
  // Tonali: GW2:1A, GW8:1A = 2A
  mkPlayer("tonali", "Sandro Tonali", "new", "MID", 5.5, [
    [0,0,70,0],[0,1,82,1],[0,0,68,0],[0,0,72,0],[0,0,65,0],[0,0,62,0],[0,0,60,0],[0,1,85,1]
  ]),

  // ========== BRENTFORD ==========
  // Mbeumo: GW1:2G, GW2:1G, GW4:1G, GW5:1G, GW6:1G, GW7:1G, GW8:1G = 8G; GW3:1A = 1A
  mkPlayer("mbeumo", "Bryan Mbeumo", "bre", "MID", 6.5, [
    [2,0,90,3],[1,0,88,2],[0,1,85,1],[1,0,88,2],[1,0,90,2],[1,0,88,2],[1,0,90,2],[1,0,88,2]
  ]),
  // Wissa: GW1:1A, GW4:1G, GW5:1G, GW6:1A = 2G, 2A
  mkPlayer("wissa", "Yoane Wissa", "bre", "FWD", 6.0, [
    [0,1,78,1],[0,0,72,0],[1,0,82,2],[1,0,85,2],[1,0,80,2],[0,1,82,1],[0,0,68,0],[0,0,70,0]
  ]),
  // Janelt: GW1:1A, GW2:1A, GW4:1A, GW5:1A, GW7:1A, GW8:1A = 6A
  mkPlayer("janelt", "Vitaly Janelt", "bre", "MID", 5.0, [
    [0,1,90,2],[0,1,88,1],[0,0,82,0],[0,1,88,1],[0,1,88,2],[0,0,82,0],[0,1,88,1],[0,1,90,2]
  ]),
  // Schade: GW1:1G, GW4:1A, GW5:1G, GW6:1G = 3G, 1A
  mkPlayer("schade", "Kevin Schade", "bre", "MID", 5.0, [
    [1,0,75,2],[0,0,62,0],[0,0,58,0],[0,1,78,1],[1,0,80,2],[1,0,85,2],[0,0,65,0],[0,0,68,0]
  ]),
  // Nørgaard: GW5:1A, GW6:1A = 2A
  mkPlayer("norgaard", "Christian Nørgaard", "bre", "MID", 4.5, [
    [0,0,82,0],[0,0,78,0],[0,0,72,0],[0,0,80,0],[0,1,80,1],[0,1,82,1],[0,0,70,0],[0,0,75,0]
  ]),
  // Damsgaard: GW1:1A, GW5:1A = 2A
  mkPlayer("damsgaard", "Mikkel Damsgaard", "bre", "MID", 4.5, [
    [0,1,62,1],[0,0,52,0],[0,0,48,0],[0,0,55,0],[0,1,62,1],[0,0,50,0],[0,0,48,0],[0,0,55,0]
  ]),

  // ========== LEEDS UNITED ==========
  // DCL: GW1:1G, GW3:1G, GW4:2G, GW5:1G, GW6:1G, GW7:1G = 7G
  mkPlayer("dcl", "Dominic Calvert-Lewin", "lee", "FWD", 6.5, [
    [1,0,90,2],[0,0,82,0],[1,0,88,2],[2,0,90,3],[1,0,90,2],[1,0,88,2],[1,0,90,2],[0,0,85,0]
  ]),
  // Ramazani: GW1:1A, GW4:2A, GW6:1A, GW7:1A = 5A
  mkPlayer("ramazani", "Largie Ramazani", "lee", "MID", 5.0, [
    [0,1,82,1],[0,0,78,0],[0,0,72,0],[0,2,88,3],[0,0,75,0],[0,1,82,1],[0,1,85,1],[0,0,78,0]
  ]),
  // Aaronson: GW4:1G, GW4:1A = 1G, 1A; GW3:1A = 1A total 1G, 2A
  mkPlayer("aaronson", "Brenden Aaronson", "lee", "MID", 5.0, [
    [0,0,72,0],[0,0,68,0],[0,1,78,1],[1,1,88,3],[0,0,68,0],[0,0,72,0],[0,0,70,0],[0,0,68,0]
  ]),
  // Joseph: GW1:1G = 1G
  mkPlayer("joseph", "Mateo Joseph", "lee", "FWD", 4.5, [
    [0,0,25,0],[0,0,68,1],[0,0,60,0],[0,0,55,0],[0,0,50,0],[0,0,48,0],[0,0,45,0],[0,0,52,0]
  ]),
  // Piroe: GW2:1G = 1G
  mkPlayer("piroe", "Joel Piroe", "lee", "FWD", 4.5, [
    [0,0,20,0],[1,0,65,2],[0,0,55,0],[0,0,50,0],[0,0,48,0],[0,0,45,0],[0,0,42,0],[0,0,48,0]
  ]),
  // James (Dan): GW2:1A = 1A; GW4:1G = 1G (total: 1G, 1A)
  mkPlayer("danjames", "Dan James", "lee", "MID", 4.5, [
    [0,0,65,0],[0,1,72,1],[0,0,60,0],[1,0,78,2],[0,0,58,0],[0,0,55,0],[0,0,52,0],[0,0,60,0]
  ]),
  // Bogle: GW4:1A = 1A (DEF)
  mkPlayer("bogle", "Jayden Bogle", "lee", "DEF", 4.0, [
    [0,0,85,0],[0,0,82,0],[0,0,78,0],[0,1,88,1],[0,0,80,0],[0,0,78,0],[0,0,75,0],[0,0,80,0]
  ]),

  // ========== BOURNEMOUTH ==========
  // Semenyo: GW1:1G, GW3:1G, GW6:1G, GW7:1G, GW8:1G = 5G; GW4:1A = 1A
  mkPlayer("semenyo", "Antoine Semenyo", "bou", "MID", 5.5, [
    [1,0,85,2],[0,0,78,0],[1,0,85,2],[0,1,82,1],[0,0,78,0],[1,0,85,2],[1,0,88,2],[1,0,90,2]
  ]),
  // Tavernier (M): GW7:1G, GW8:2G = 3G; GW1:1A, GW3:1A, GW4:1A, GW6:1A = 4A
  mkPlayer("tavernier_m", "Marcus Tavernier", "bou", "MID", 5.5, [
    [0,1,88,1],[0,0,82,0],[0,1,85,1],[0,1,85,1],[0,0,80,0],[0,1,88,1],[1,0,90,2],[2,0,90,3]
  ]),
  // Evanilson: GW2:1G, GW3:1G, GW4:1G = 3G; GW8:1A = 1A
  mkPlayer("evanilson", "Evanilson", "bou", "FWD", 6.0, [
    [0,0,68,0],[1,0,80,2],[1,0,82,2],[1,0,85,2],[0,0,72,0],[0,0,65,0],[0,0,68,0],[0,1,82,1]
  ]),
  // Kluivert: GW4:1G = 1G; GW7:1A, GW8:1A = 2A
  mkPlayer("kluivert", "Justin Kluivert", "bou", "MID", 5.0, [
    [0,0,62,0],[0,0,58,0],[0,0,55,0],[1,0,78,2],[0,0,65,0],[0,0,60,0],[0,1,82,1],[0,1,85,1]
  ]),
  // Kerkez: GW3:1A = 1A (DEF)
  mkPlayer("kerkez", "Milos Kerkez", "bou", "DEF", 4.5, [
    [0,0,82,0],[0,0,78,0],[0,1,85,1],[0,0,80,0],[0,0,78,0],[0,0,75,0],[0,0,72,0],[0,0,80,0]
  ]),
  // Christie: GW7:1A, GW8:1A = 2A
  mkPlayer("christie", "Ryan Christie", "bou", "MID", 4.5, [
    [0,0,60,0],[0,0,55,0],[0,0,52,0],[0,0,58,0],[0,0,55,0],[0,0,52,0],[0,1,78,1],[0,1,82,1]
  ]),

  // ========== CRYSTAL PALACE ==========
  // Mateta: GW2:1G, GW3:2G, GW4:1G, GW6:2G = 6G
  mkPlayer("mateta", "Jean-Philippe Mateta", "cry", "FWD", 6.0, [
    [0,0,82,0],[1,0,88,2],[2,0,90,3],[1,0,88,2],[0,0,78,0],[2,0,90,3],[0,0,82,0],[0,0,80,0]
  ]),
  // Eze: GW3:1G, GW4:1G, GW6:1G = 3G
  mkPlayer("eze", "Eberechi Eze", "cry", "MID", 6.5, [
    [0,0,82,0],[0,0,80,0],[1,0,88,2],[1,0,88,2],[0,0,75,0],[1,0,88,2],[0,0,78,0],[0,0,75,0]
  ]),
  // Kamada: GW3:2A, GW4:1A, GW6:2A = 5A
  mkPlayer("kamada", "Daichi Kamada", "cry", "MID", 5.5, [
    [0,0,78,0],[0,0,75,0],[0,2,88,3],[0,1,85,1],[0,0,72,0],[0,2,90,3],[0,0,75,0],[0,0,72,0]
  ]),
  // Mitchell: GW2:1A, GW3:1A, GW6:1A = 3A (DEF)
  mkPlayer("mitchell", "Tyrick Mitchell", "cry", "DEF", 4.5, [
    [0,0,90,0],[0,1,88,1],[0,1,90,1],[0,0,88,0],[0,0,85,0],[0,1,90,1],[0,0,82,0],[0,0,85,0]
  ]),
  // Sarr: GW4:1A = 1A
  mkPlayer("sarr", "Ismaila Sarr", "cry", "MID", 5.0, [
    [0,0,55,0],[0,0,52,0],[0,0,48,0],[0,1,72,1],[0,0,50,0],[0,0,48,0],[0,0,45,0],[0,0,52,0]
  ]),

  // ========== MANCHESTER UNITED ==========
  // Zirkzee: GW2:2G, GW3:1G, GW6:1G, GW7:1G = 5G
  mkPlayer("zirkzee", "Joshua Zirkzee", "mun", "FWD", 6.5, [
    [0,0,72,0],[2,0,85,3],[1,0,82,2],[0,0,68,0],[0,0,70,0],[1,0,85,2],[1,0,85,2],[0,0,78,0]
  ]),
  // Rashford: GW2:2G = 2G
  mkPlayer("rashford", "Marcus Rashford", "mun", "MID", 7.0, [
    [0,0,68,0],[2,0,85,3],[0,0,72,0],[0,0,65,0],[0,0,62,0],[0,0,68,0],[0,0,65,0],[0,0,70,0]
  ]),
  // Bruno F: GW2:2A, GW3:1G, GW6:1A = 1G, 3A
  mkPlayer("bruno_f", "Bruno Fernandes", "mun", "MID", 8.5, [
    [0,0,90,0],[0,2,90,3],[1,0,90,2],[0,0,85,0],[0,0,82,0],[0,1,90,1],[0,0,85,0],[0,0,88,0]
  ]),
  // Amad: GW2:1A, GW3:1A, GW5:1A, GW7:1A = 4A
  mkPlayer("amad", "Amad Diallo", "mun", "MID", 5.0, [
    [0,0,55,0],[0,1,68,1],[0,1,72,1],[0,0,60,0],[0,1,68,1],[0,0,62,0],[0,1,72,1],[0,0,65,0]
  ]),
  // Garnacho: GW2:1G = 1G
  mkPlayer("garnacho", "Alejandro Garnacho", "mun", "MID", 6.0, [
    [0,0,50,0],[1,0,65,2],[0,0,55,0],[0,0,52,0],[0,0,48,0],[0,0,55,0],[0,0,52,0],[0,0,58,0]
  ]),
  // Dalot: GW2:1A = 1A (DEF)
  mkPlayer("dalot", "Diogo Dalot", "mun", "DEF", 5.0, [
    [0,0,85,0],[0,1,88,1],[0,0,82,0],[0,0,80,0],[0,0,78,0],[0,0,82,0],[0,0,80,0],[0,0,85,0]
  ]),
  // Mainoo: GW3:1A = 1A
  mkPlayer("mainoo", "Kobbie Mainoo", "mun", "MID", 5.0, [
    [0,0,45,0],[0,0,50,0],[0,1,72,1],[0,0,65,0],[0,0,60,0],[0,0,62,0],[0,0,58,0],[0,0,65,0]
  ]),

  // ========== HULL CITY ==========
  // Philogene: GW1:1G, GW4:1G, GW5:1G, GW6:1G, GW8:1G = 5G; GW2:1A = 1A
  mkPlayer("philogene", "Jaden Philogene", "hul", "MID", 6.0, [
    [1,0,88,2],[0,1,85,1],[0,0,80,0],[1,0,88,2],[1,0,85,2],[1,0,90,2],[0,0,78,0],[1,0,88,2]
  ]),
  // Estupiñán (Óscar): GW1:1G, GW6:1G = 2G
  mkPlayer("estupinan_o", "Óscar Estupiñán", "hul", "FWD", 5.5, [
    [1,0,75,2],[0,0,68,0],[0,0,62,0],[0,0,65,0],[0,0,60,0],[1,0,80,2],[0,0,62,0],[0,0,68,0]
  ]),
  // Slater: GW1:1A, GW4:1A, GW5:1A, GW6:1A, GW8:1A = 5A
  mkPlayer("slater", "Regan Slater", "hul", "MID", 4.5, [
    [0,1,88,1],[0,0,82,0],[0,0,78,0],[0,1,85,1],[0,1,82,1],[0,1,88,1],[0,0,75,0],[0,1,85,1]
  ]),
  // Palmer (Kasey): GW1:1A, GW6:1A = 2A
  mkPlayer("palmer_k", "Kasey Palmer", "hul", "MID", 4.5, [
    [0,1,80,1],[0,0,72,0],[0,0,68,0],[0,0,70,0],[0,0,65,0],[0,1,82,1],[0,0,62,0],[0,0,68,0]
  ]),

  // ========== EVERTON ==========
  // McNeil: GW1:1G, GW2:1G, GW3:1G+1A, GW5:1A, GW6:1G = 4G, 2A
  mkPlayer("mcneil", "Dwight McNeil", "eve", "MID", 5.5, [
    [1,0,88,2],[1,0,85,2],[1,1,90,3],[0,0,82,0],[0,1,85,1],[1,0,88,2],[0,0,80,0],[0,0,78,0]
  ]),
  // Beto: GW3:1G, GW6:1G = 2G
  mkPlayer("beto", "Beto", "eve", "FWD", 5.0, [
    [0,0,62,0],[0,0,58,0],[1,0,75,2],[0,0,55,0],[0,0,52,0],[1,0,78,2],[0,0,60,0],[0,0,58,0]
  ]),
  // Harrison: GW1:1A, GW2:1A, GW6:1A = 3A
  mkPlayer("harrison_j", "Jack Harrison", "eve", "MID", 4.5, [
    [0,1,82,1],[0,1,80,1],[0,0,72,0],[0,0,68,0],[0,0,65,0],[0,1,82,1],[0,0,68,0],[0,0,65,0]
  ]),
  // Tarkowski: GW1:1A, GW3:1A, GW6:1A = 3A (DEF)
  mkPlayer("tarkowski", "James Tarkowski", "eve", "DEF", 4.5, [
    [0,1,90,2],[0,0,90,0],[0,1,90,1],[0,0,90,1],[0,0,90,0],[0,1,90,1],[0,0,90,0],[0,0,90,0]
  ]),

  // ========== IPSWICH TOWN ==========
  // Delap: GW1:1G, GW2:1G, GW4:2G, GW6:1G, GW7:1G, GW8:1G = 7G
  mkPlayer("delap", "Liam Delap", "ips", "FWD", 5.5, [
    [1,0,88,2],[1,0,85,2],[0,0,78,0],[2,0,90,3],[0,0,72,0],[1,0,85,2],[1,0,85,2],[1,0,90,2]
  ]),
  // Hutchinson: GW1:1G, GW2:1G, GW4:1A, GW6:1G, GW7:1G = 4G, 1A
  mkPlayer("hutchinson", "Omari Hutchinson", "ips", "MID", 5.0, [
    [1,0,85,2],[1,0,82,2],[0,0,72,0],[0,1,82,1],[0,0,68,0],[1,0,85,2],[1,0,85,2],[0,0,78,0]
  ]),
  // Davis (Leif): GW1:1A, GW4:2A, GW6:1A, GW7:1A, GW8:1A = 6A (DEF)
  mkPlayer("davis_l", "Leif Davis", "ips", "DEF", 5.0, [
    [0,1,90,1],[0,0,88,0],[0,0,85,0],[0,2,90,3],[0,0,82,0],[0,1,90,1],[0,1,90,1],[0,1,90,2]
  ]),
  // Chaplin: GW1:1A, GW6:1A, GW7:1A = 3A
  mkPlayer("chaplin", "Conor Chaplin", "ips", "MID", 5.0, [
    [0,1,80,1],[0,0,72,0],[0,0,68,0],[0,0,75,0],[0,0,65,0],[0,1,82,1],[0,1,80,1],[0,0,72,0]
  ]),
  // Szmodics: GW4:1G = 1G
  mkPlayer("szmodics", "Sammie Szmodics", "ips", "MID", 4.5, [
    [0,0,40,0],[0,0,38,0],[0,0,35,0],[1,0,68,2],[0,0,42,0],[0,0,45,0],[0,0,40,0],[0,0,42,0]
  ]),

  // ========== FULHAM ==========
  // Muniz: GW1:1G, GW3:1G, GW5:1G, GW6:1A... wait
  // GW1: 1G, GW3: 1G, GW5: 1G, GW6: (Ipswich 2-1 Fulham - Muniz 1G), GW7: 1G, GW8: 1G = 6G
  // Wait let me recheck GW6: "Ipswich Town 2 – 1 Fulham" - "Rodrigo Muniz (18')" - yes 1G
  // GW4: Fulham listed in 0-0 Liverpool - no goal
  // So: GW1:1G, GW3:1G, GW5:1G, GW6:1G, GW7:1G, GW8:1G = 6G
  // Assists: none listed for Muniz
  // Wait, I previously had 5G. Let me recount:
  // GW1: Fulham 2-3 Chelsea - Muniz 1G ✓
  // GW3: Fulham 2-3 Palace - Muniz 1G ✓
  // GW5: Fulham 1-1 Man Utd - Muniz 1G ✓
  // GW6: Ipswich 2-1 Fulham - Muniz 1G ✓
  // GW7: Fulham 1-0 Hull - Muniz 1G ✓
  // GW8: Coventry 0-1 Fulham - Muniz 1G ✓
  // Total: 6G! Not 5. Let me fix this.
  mkPlayer("muniz", "Rodrigo Muniz", "ful", "FWD", 5.5, [
    [1,0,85,2],[0,0,72,0],[1,0,85,2],[0,0,78,0],[1,0,82,2],[1,0,85,2],[1,0,88,2],[1,0,85,2]
  ]),
  // Smith Rowe: GW1:1G = 1G
  mkPlayer("smithrowe", "Emile Smith Rowe", "ful", "MID", 5.5, [
    [1,0,72,2],[0,0,65,0],[0,0,60,0],[0,0,62,0],[0,0,58,0],[0,0,60,0],[0,0,62,0],[0,0,58,0]
  ]),
  // Robinson (Antonee): GW1:1A, GW3:1A, GW5:1A, GW6:1A = 4A (DEF)
  mkPlayer("robinson_a", "Antonee Robinson", "ful", "DEF", 5.0, [
    [0,1,90,1],[0,0,85,0],[0,1,90,1],[0,0,90,0],[0,1,88,1],[0,1,88,1],[0,0,90,0],[0,0,90,0]
  ]),
  // Iwobi: GW1:1A = 1A
  mkPlayer("iwobi", "Alex Iwobi", "ful", "MID", 5.5, [
    [0,1,75,1],[0,0,68,0],[0,0,62,0],[0,0,65,0],[0,0,60,0],[0,0,62,0],[0,0,65,0],[0,0,60,0]
  ]),
  // Pereira: GW3:1A, GW7:1A, GW8:1A = 3A
  mkPlayer("pereira", "Andreas Pereira", "ful", "MID", 6.0, [
    [0,0,82,0],[0,0,78,0],[0,1,85,1],[0,0,80,0],[0,0,75,0],[0,0,78,0],[0,1,85,1],[0,1,88,1]
  ]),
  // Traoré: GW3:1G = 1G
  mkPlayer("traore", "Adama Traoré", "ful", "MID", 4.5, [
    [0,0,45,0],[0,0,42,0],[1,0,68,2],[0,0,50,0],[0,0,48,0],[0,0,45,0],[0,0,42,0],[0,0,48,0]
  ]),

  // ========== SUNDERLAND ==========
  // Isidor: GW1:1G, GW2:1G, GW5:2G = 4G (wait: GW5 Man City 5-3 Sunderland - Isidor 2G)
  // So: GW1:1G, GW2:1G, GW5:2G = 4G
  mkPlayer("isidor", "Wilson Isidor", "sun", "FWD", 5.0, [
    [1,0,80,2],[0,0,68,0],[0,0,62,0],[0,0,60,0],[2,0,85,3],[0,0,58,0],[0,0,60,0],[0,0,65,0]
  ]),
  // Roberts: GW2:1A, GW3:1A = 2A; GW5:1G = 1G (total: 1G, 2A)
  mkPlayer("roberts_p", "Patrick Roberts", "sun", "MID", 4.5, [
    [0,0,68,0],[0,1,72,1],[0,1,78,1],[0,0,62,0],[1,0,80,2],[0,0,58,0],[0,0,60,0],[0,0,65,0]
  ]),
  // Rigg: GW1:1A, GW5:1A = 2A
  mkPlayer("rigg", "Chris Rigg", "sun", "MID", 4.5, [
    [0,1,75,1],[0,0,68,0],[0,0,62,0],[0,0,58,0],[0,1,78,1],[0,0,55,0],[0,0,58,0],[0,0,62,0]
  ]),
  // Cirkin: GW5:1A = 1A (DEF)
  mkPlayer("cirkin", "Dennis Cirkin", "sun", "DEF", 4.0, [
    [0,0,80,0],[0,0,75,0],[0,0,70,0],[0,0,68,0],[0,1,82,1],[0,0,72,0],[0,0,70,0],[0,0,75,0]
  ]),
  // Mundle: GW5:1A = 1A
  mkPlayer("mundle", "Romaine Mundle", "sun", "MID", 4.0, [
    [0,0,40,0],[0,0,38,0],[0,0,35,0],[0,0,32,0],[0,1,55,1],[0,0,35,0],[0,0,38,0],[0,0,40,0]
  ]),

  // ========== NOTTINGHAM FOREST ==========
  // Wood: GW2:1G, GW4:1G, GW6:1G, GW8:1G = 4G
  mkPlayer("wood", "Chris Wood", "nfo", "FWD", 6.0, [
    [0,0,85,0],[1,0,85,2],[0,0,80,0],[1,0,88,2],[0,0,72,0],[1,0,85,2],[0,0,78,0],[1,0,88,2]
  ]),
  // Gibbs-White: GW2:1A, GW4:1A, GW6:1A = 3A
  mkPlayer("gibbswhite", "Morgan Gibbs-White", "nfo", "MID", 6.5, [
    [0,0,85,0],[0,1,88,1],[0,0,82,0],[0,1,90,1],[0,0,78,0],[0,1,88,1],[0,0,80,0],[0,0,82,0]
  ]),
  // Hudson-Odoi: GW2:1G, GW4:1G = 2G
  mkPlayer("hudsonodoi", "Callum Hudson-Odoi", "nfo", "MID", 5.5, [
    [0,0,65,0],[1,0,78,2],[0,0,60,0],[1,0,82,2],[0,0,58,0],[0,0,62,0],[0,0,60,0],[0,0,65,0]
  ]),
  // Elanga: GW2:1A, GW4:1A, GW8:1A = 3A
  mkPlayer("elanga", "Anthony Elanga", "nfo", "MID", 5.5, [
    [0,0,78,0],[0,1,82,1],[0,0,72,0],[0,1,85,1],[0,0,68,0],[0,0,72,0],[0,0,70,0],[0,1,85,1]
  ]),

  // ========== COVENTRY CITY ==========
  // Wright: GW5:1G, GW6:2G, GW7:1G = 4G
  mkPlayer("wright", "Haji Wright", "cov", "FWD", 5.5, [
    [0,0,78,0],[0,0,72,0],[0,0,68,0],[0,0,65,0],[1,0,80,2],[2,0,88,3],[1,0,85,2],[0,0,72,0]
  ]),
  // Sakamoto: GW6:1G = 1G; GW5:1A, GW7:1A = 2A
  mkPlayer("sakamoto", "Tatsuhiro Sakamoto", "cov", "MID", 4.5, [
    [0,0,68,0],[0,0,62,0],[0,0,58,0],[0,0,55,0],[0,1,72,1],[1,0,80,2],[0,1,78,1],[0,0,65,0]
  ]),
  // Simms: GW6:1G = 1G
  mkPlayer("simms", "Ellis Simms", "cov", "FWD", 4.5, [
    [0,0,35,0],[0,0,32,0],[0,0,30,0],[0,0,28,0],[0,0,32,0],[1,0,62,2],[0,0,35,0],[0,0,38,0]
  ]),
  // Sheaf: GW6:1A = 1A
  mkPlayer("sheaf", "Ben Sheaf", "cov", "MID", 4.0, [
    [0,0,75,0],[0,0,70,0],[0,0,65,0],[0,0,62,0],[0,0,68,0],[0,1,78,1],[0,0,65,0],[0,0,70,0]
  ]),
  // Eccles: GW6:1A = 1A
  mkPlayer("eccles", "Josh Eccles", "cov", "MID", 4.0, [
    [0,0,60,0],[0,0,55,0],[0,0,52,0],[0,0,50,0],[0,0,55,0],[0,1,68,1],[0,0,52,0],[0,0,58,0]
  ]),
  // Torp: GW6:1A = 1A
  mkPlayer("torp", "Victor Torp", "cov", "MID", 4.0, [
    [0,0,45,0],[0,0,42,0],[0,0,40,0],[0,0,38,0],[0,0,42,0],[0,1,58,1],[0,0,40,0],[0,0,45,0]
  ]),
  // van Ewijk: GW6:1A = 1A (DEF)
  mkPlayer("vanewijk", "Milan van Ewijk", "cov", "DEF", 4.0, [
    [0,0,78,0],[0,0,72,0],[0,0,68,0],[0,0,65,0],[0,0,72,0],[0,1,80,1],[0,0,68,0],[0,0,75,0]
  ]),

  // ========== GOALKEEPERS ==========
  // Saves estimated based on shots faced (proportional to goals conceded)
  mkGK("raya", "David Raya", "ars", 5.5,
    [[0,0,90,1],[0,0,90,1],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1]],
    [1, 1, 3, 1, 5, 3, 1, 1]
  ),
  mkGK("ederson", "Ederson", "mci", 5.5,
    [[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0]],
    [3, 3, 1, 1, 4, 1, 3, 3]
  ),
  mkGK("verbruggen", "Bart Verbruggen", "bri", 4.5,
    [[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1],[0,0,90,1],[0,0,90,1],[0,0,90,0]],
    [1, 5, 3, 0, 1, 1, 0, 4]
  ),
  mkGK("alisson", "Alisson", "liv", 5.0,
    [[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,1]],
    [3, 3, 1, 0, 1, 5, 3, 1]
  ),
  mkGK("sanchez", "Robert Sánchez", "che", 4.5,
    [[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,0]],
    [5, 6, 4, 4, 5, 2, 0, 4]
  ),
  mkGK("flekken", "Mark Flekken", "bre", 4.5,
    [[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0]],
    [0, 3, 3, 4, 0, 4, 4, 3]
  ),
  mkGK("pickford", "Jordan Pickford", "eve", 4.5,
    [[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0]],
    [0, 3, 4, 0, 1, 4, 4, 4]
  ),
  mkGK("onana", "André Onana", "mun", 4.5,
    [[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0]],
    [4, 4, 4, 2, 3, 3, 3, 6]
  ),
  mkGK("palmer_gk", "Alex Palmer", "sun", 4.0,
    [[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1]],
    [4, 0, 3, 4, 8, 4, 4, 0]
  ),
  mkGK("valt", "Václav Hladký", "ips", 4.0,
    [[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0]],
    [3, 8, 4, 5, 3, 3, 5, 3]
  ),
  mkGK("sels", "Matz Sels", "nfo", 4.0,
    [[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0]],
    [2, 4, 0, 4, 3, 5, 3, 3]
  ),
  mkGK("pandurovic", "Ivor Pandurović", "hul", 4.0,
    [[0,0,90,1],[0,0,90,1],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0]],
    [0, 0, 0, 4, 4, 4, 3, 3]
  ),
  mkGK("kovar", "Jiří Kovář", "avl", 4.5,
    [[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,0]],
    [6, 2, 0, 3, 4, 4, 0, 3]
  ),
  mkGK("vicario", "Guglielmo Vicario", "tot", 4.5,
    [[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1]],
    [5, 4, 0, 0, 5, 3, 2, 0]
  ),
  mkGK("pope", "Aiden O'Neill", "cry", 4.0,
    [[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0]],
    [4, 7, 5, 5, 0, 2, 8, 4]
  ),
  mkGK("trafford", "James Trafford", "bou", 4.0,
    [[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1]],
    [3, 2, 4, 4, 2, 8, 0, 0]
  ),
  mkGK("hermann", "Max Hermansen", "lee", 4.0,
    [[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,1]],
    [0, 2, 2, 2, 0, 4, 2, 0]
  ),
  mkGK("johnson", "Joe Bryan", "cov", 4.0,
    [[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0]],
    [5, 3, 3, 8, 0, 3, 5, 3]
  ),
  mkGK("newcastle_gk", "Nick Pope", "new", 5.0,
    [[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1]],
    [4, 0, 4, 7, 3, 3, 2, 0]
  ),
  mkGK("fulham_gk", "Bernd Leno", "ful", 4.5,
    [[0,0,90,0],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,0],[0,0,90,0],[0,0,90,1],[0,0,90,1]],
    [5, 2, 5, 0, 2, 4, 0, 0]
  ),
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
    .filter(p => p.price >= 4.5 && p.price <= 6.5 && getTotalFPLPoints(p) > 25)
    .sort((a, b) => (getTotalFPLPoints(b) / b.price) - (getTotalFPLPoints(a) / a.price))
    .slice(0, limit);
}
