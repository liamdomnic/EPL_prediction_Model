import { upcomingFixtures, teams } from '../data/teams';
import { rankPlayersForMatch, type FPLPlayer } from '../data/fplDatabase';

interface Formation {
  name: string;
  gk: number;
  def: number;
  mid: number;
  fwd: number;
}

// All valid FPL formations (11 players total)
const FORMATIONS: Formation[] = [
  { name: "3-5-2", gk: 1, def: 3, mid: 5, fwd: 2 },
  { name: "3-4-3", gk: 1, def: 3, mid: 4, fwd: 3 },
  { name: "4-4-2", gk: 1, def: 4, mid: 4, fwd: 2 },
  { name: "4-3-3", gk: 1, def: 4, mid: 3, fwd: 3 },
  { name: "4-5-1", gk: 1, def: 4, mid: 5, fwd: 1 },
  { name: "5-4-1", gk: 1, def: 5, mid: 4, fwd: 1 },
  { name: "5-3-2", gk: 1, def: 5, mid: 3, fwd: 2 },
];

interface RankedPlayer {
  player: FPLPlayer;
  prediction: {
    predictedPoints: number;
    confidence: number;
    matchDifficulty: number;
    factors: { label: string; impact: string; value: number; weight: number }[];
    goalProb: number;
    assistProb: number;
    cleanSheetProb: number;
  };
  isHome: boolean;
  fixture: string;
}

export interface BestSquadResult {
  formation: Formation;
  totalPoints: number;
  gk: RankedPlayer;
  defenders: RankedPlayer[];
  midfielders: RankedPlayer[];
  forwards: RankedPlayer[];
  allPlayers: RankedPlayer[];
}

export function calculateBestSquad(): BestSquadResult {
  // Get all players from GW9 fixtures
  const allPlayers: RankedPlayer[] = upcomingFixtures.flatMap(fixture => {
    const ranked = rankPlayersForMatch(fixture.homeTeam, fixture.awayTeam);
    return ranked.map(r => ({
      ...r,
      fixture: `${teams.find(t => t.id === fixture.homeTeam)?.shortName} vs ${teams.find(t => t.id === fixture.awayTeam)?.shortName}`
    }));
  });

  // Group by position
  const gks = allPlayers.filter(p => p.player.position === "GK").sort((a, b) => b.prediction.predictedPoints - a.prediction.predictedPoints);
  const defs = allPlayers.filter(p => p.player.position === "DEF").sort((a, b) => b.prediction.predictedPoints - a.prediction.predictedPoints);
  const mids = allPlayers.filter(p => p.player.position === "MID").sort((a, b) => b.prediction.predictedPoints - a.prediction.predictedPoints);
  const fwds = allPlayers.filter(p => p.player.position === "FWD").sort((a, b) => b.prediction.predictedPoints - a.prediction.predictedPoints);

  let bestResult: BestSquadResult | null = null;
  let maxPoints = 0;

  // Try each formation
  for (const formation of FORMATIONS) {
    // Check if we have enough players for this formation
    if (gks.length < formation.gk || 
        defs.length < formation.def || 
        mids.length < formation.mid || 
        fwds.length < formation.fwd) {
      continue;
    }

    // Pick top players for each position
    const selectedGK = gks[0];
    const selectedDefs = defs.slice(0, formation.def);
    const selectedMids = mids.slice(0, formation.mid);
    const selectedFwds = fwds.slice(0, formation.fwd);

    // Calculate total points
    const totalPoints = 
      selectedGK.prediction.predictedPoints +
      selectedDefs.reduce((sum, p) => sum + p.prediction.predictedPoints, 0) +
      selectedMids.reduce((sum, p) => sum + p.prediction.predictedPoints, 0) +
      selectedFwds.reduce((sum, p) => sum + p.prediction.predictedPoints, 0);

    if (totalPoints > maxPoints) {
      maxPoints = totalPoints;
      bestResult = {
        formation,
        totalPoints: Math.round(totalPoints * 10) / 10,
        gk: selectedGK,
        defenders: selectedDefs,
        midfielders: selectedMids,
        forwards: selectedFwds,
        allPlayers: [selectedGK, ...selectedDefs, ...selectedMids, ...selectedFwds],
      };
    }
  }

  if (!bestResult) {
    // Fallback
    return {
      formation: FORMATIONS[2], // 4-4-2
      totalPoints: 0,
      gk: gks[0],
      defenders: defs.slice(0, 4),
      midfielders: mids.slice(0, 4),
      forwards: fwds.slice(0, 2),
      allPlayers: [gks[0], ...defs.slice(0, 4), ...mids.slice(0, 4), ...fwds.slice(0, 2)],
    };
  }

  return bestResult;
}
