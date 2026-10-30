import { upcomingFixtures, teams } from '../data/teams';
import { fplPlayers, type FPLPlayer } from '../data/fplDatabase';
import { getFixturePredictions, type PlayerPrediction } from './componentPredictionEngine';

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

export interface RankedPlayer {
  player: FPLPlayer;
  prediction: PlayerPrediction;
  isHome: boolean;
  fixture: string;
}

export interface BestSquadResult {
  formation: Formation;
  totalPoints: number;
  totalPrice: number;
  gk: RankedPlayer;
  defenders: RankedPlayer[];
  midfielders: RankedPlayer[];
  forwards: RankedPlayer[];
  captain: RankedPlayer;
  viceCaptain: RankedPlayer;
  allPlayers: RankedPlayer[];
  teamDistribution: Record<string, number>;
}

const BUDGET = 100.0; // £100m
const MAX_PER_TEAM = 3;

// Get all players from GW9 fixtures
function getAllGW9Players(injuredPlayerIds: string[] = []): RankedPlayer[] {
  return upcomingFixtures.flatMap(fixture => {
    const predictions = getFixturePredictions(fixture.homeTeam, fixture.awayTeam, injuredPlayerIds);
    
    return predictions.map(prediction => {
      const player = fplPlayers.find(p => p.id === prediction.playerId);
      if (!player) return null;
      
      const isHome = player.teamId === fixture.homeTeam;
      return {
        player,
        prediction,
        isHome,
        fixture: `${teams.find(t => t.id === fixture.homeTeam)?.shortName} vs ${teams.find(t => t.id === fixture.awayTeam)?.shortName}`
      };
    }).filter((r): r is RankedPlayer => r !== null);
  });
}

// Check if adding a player violates team limit
function canAddPlayer(
  player: RankedPlayer,
  selectedPlayers: RankedPlayer[],
  teamDistribution: Record<string, number>
): boolean {
  const currentTeamCount = teamDistribution[player.player.teamId] || 0;
  return currentTeamCount < MAX_PER_TEAM;
}

// Calculate squad value score (points per £m)
function getValueScore(player: RankedPlayer): number {
  return player.prediction.expectedPoints / player.player.price;
}

// Smart selection: MAXIMIZES BUDGET USAGE while getting best points
function selectBestForPosition(
  candidates: RankedPlayer[],
  count: number,
  selectedPlayers: RankedPlayer[],
  remainingBudget: number,
  teamDistribution: Record<string, number>
): RankedPlayer[] {
  const selected: RankedPlayer[] = [];
  const localTeamDistribution = { ...teamDistribution };
  let localBudget = remainingBudget;
  
  // Filter valid candidates first
  const validCandidates = candidates.filter(p => 
    p.prediction.startProbability >= 0.6 &&
    canAddPlayer(p, selectedPlayers, localTeamDistribution) &&
    p.player.price <= localBudget
  );
  
  if (validCandidates.length === 0) return [];
  
  // Strategy: Pick highest points players that still leave room for other positions
  // Calculate minimum cost needed for remaining positions
  const positionsLeft = count - selected.length;
  
  // Sort by points per million (value) but prioritize high-point players
  const scored = validCandidates.map(p => ({
    player: p,
    // Weight: 80% points, 20% value (to maximize budget usage)
    compositeScore: (p.prediction.expectedPoints * 0.8) + (getValueScore(p) * 10 * 0.2)
  }));
  
  scored.sort((a, b) => b.compositeScore - a.compositeScore);
  
  for (const candidate of scored) {
    if (selected.length >= count) break;
    
    const p = candidate.player;
    
    // Check if we can still afford this player and have budget for remaining needs
    if (p.player.price > localBudget) continue;
    
    // Add player
    selected.push(p);
    localTeamDistribution[p.player.teamId] = (localTeamDistribution[p.player.teamId] || 0) + 1;
    localBudget -= p.player.price;
  }
  
  // If we couldn't fill with top picks, use cheapest available
  if (selected.length < count) {
    const remaining = candidates
      .filter(p => !selected.includes(p) && p.prediction.startProbability >= 0.5)
      .sort((a, b) => a.player.price - b.player.price);
    
    for (const p of remaining) {
      if (selected.length >= count) break;
      if (!canAddPlayer(p, [...selectedPlayers, ...selected], localTeamDistribution)) continue;
      if (p.player.price > localBudget) continue;
      
      selected.push(p);
      localTeamDistribution[p.player.teamId] = (localTeamDistribution[p.player.teamId] || 0) + 1;
      localBudget -= p.player.price;
    }
  }
  
  return selected;
}

// Try multiple strategies and pick the best - MAXIMIZE BUDGET
function tryBuildSquad(
  formation: Formation,
  gks: RankedPlayer[],
  defs: RankedPlayer[],
  mids: RankedPlayer[],
  fwds: RankedPlayer[],
  strategy: 'points' | 'value' | 'balanced'
): BestSquadResult | null {
  let teamDistribution: Record<string, number> = {};
  let remainingBudget = BUDGET;
  
  // Strategy-specific sorting - prioritize budget maximization
  let sortedGks = [...gks];
  let sortedDefs = [...defs];
  let sortedMids = [...mids];
  let sortedFwds = [...fwds];
  
  if (strategy === 'points') {
    // Maximize points while spending budget
    sortedGks.sort((a, b) => b.prediction.expectedPoints - a.prediction.expectedPoints);
    sortedDefs.sort((a, b) => b.prediction.expectedPoints - a.prediction.expectedPoints);
    sortedMids.sort((a, b) => b.prediction.expectedPoints - a.prediction.expectedPoints);
    sortedFwds.sort((a, b) => b.prediction.expectedPoints - a.prediction.expectedPoints);
  } else if (strategy === 'value') {
    // Best value (points per £m) - allows more premium picks
    sortedGks.sort((a, b) => getValueScore(b) - getValueScore(a));
    sortedDefs.sort((a, b) => getValueScore(b) - getValueScore(a));
    sortedMids.sort((a, b) => getValueScore(b) - getValueScore(a));
    sortedFwds.sort((a, b) => getValueScore(b) - getValueScore(a));
  } else {
    // Balanced: 70% points, 30% value - maximizes budget with good returns
    sortedGks.sort((a, b) => (b.prediction.expectedPoints * 0.7 + getValueScore(b) * 15 * 0.3) - 
                              (a.prediction.expectedPoints * 0.7 + getValueScore(a) * 15 * 0.3));
    sortedDefs.sort((a, b) => (b.prediction.expectedPoints * 0.7 + getValueScore(b) * 15 * 0.3) - 
                              (a.prediction.expectedPoints * 0.7 + getValueScore(a) * 15 * 0.3));
    sortedMids.sort((a, b) => (b.prediction.expectedPoints * 0.7 + getValueScore(b) * 15 * 0.3) - 
                              (a.prediction.expectedPoints * 0.7 + getValueScore(a) * 15 * 0.3));
    sortedFwds.sort((a, b) => (b.prediction.expectedPoints * 0.7 + getValueScore(b) * 15 * 0.3) - 
                              (a.prediction.expectedPoints * 0.7 + getValueScore(a) * 15 * 0.3));
  }
  
  // Select GK first (usually only 1-2 options)
  const selectedGKs = selectBestForPosition(sortedGks, formation.gk, [], remainingBudget, teamDistribution);
  if (selectedGKs.length < formation.gk) return null;
  
  selectedGKs.forEach(p => {
    teamDistribution[p.player.teamId] = (teamDistribution[p.player.teamId] || 0) + 1;
    remainingBudget -= p.player.price;
  });
  
  // Select Defenders
  const selectedDefs = selectBestForPosition(sortedDefs, formation.def, selectedGKs, remainingBudget, teamDistribution);
  if (selectedDefs.length < formation.def) return null;
  
  selectedDefs.forEach(p => {
    teamDistribution[p.player.teamId] = (teamDistribution[p.player.teamId] || 0) + 1;
    remainingBudget -= p.player.price;
  });
  
  // Select Midfielders
  const selectedMids = selectBestForPosition(sortedMids, formation.mid, [...selectedGKs, ...selectedDefs], remainingBudget, teamDistribution);
  if (selectedMids.length < formation.mid) return null;
  
  selectedMids.forEach(p => {
    teamDistribution[p.player.teamId] = (teamDistribution[p.player.teamId] || 0) + 1;
    remainingBudget -= p.player.price;
  });
  
  // Select Forwards
  const selectedFwds = selectBestForPosition(sortedFwds, formation.fwd, [...selectedGKs, ...selectedDefs, ...selectedMids], remainingBudget, teamDistribution);
  if (selectedFwds.length < formation.fwd) return null;
  
  selectedFwds.forEach(p => {
    teamDistribution[p.player.teamId] = (teamDistribution[p.player.teamId] || 0) + 1;
    remainingBudget -= p.player.price;
  });
  
  const allPlayers = [...selectedGKs, ...selectedDefs, ...selectedMids, ...selectedFwds];
  const totalPoints = allPlayers.reduce((sum, p) => sum + p.prediction.expectedPoints, 0);
  const totalPrice = allPlayers.reduce((sum, p) => sum + p.player.price, 0);
  
  // Select captain (highest predicted points) and vice-captain
  const sortedByPoints = [...allPlayers].sort((a, b) => b.prediction.expectedPoints - a.prediction.expectedPoints);
  const captain = sortedByPoints[0];
  const viceCaptain = sortedByPoints[1];
  
  return {
    formation,
    totalPoints: Math.round(totalPoints * 10) / 10,
    totalPrice: Math.round(totalPrice * 10) / 10,
    gk: selectedGKs[0],
    defenders: selectedDefs,
    midfielders: selectedMids,
    forwards: selectedFwds,
    captain,
    viceCaptain,
    allPlayers,
    teamDistribution,
  };
}

export function calculateBestSquad(injuredPlayerIds: string[] = []): BestSquadResult {
  const allPlayers = getAllGW9Players(injuredPlayerIds);
  
  // Group by position
  const gks = allPlayers.filter(p => p.player.position === "GK");
  const defs = allPlayers.filter(p => p.player.position === "DEF");
  const mids = allPlayers.filter(p => p.player.position === "MID");
  const fwds = allPlayers.filter(p => p.player.position === "FWD");
  
  let bestResult: BestSquadResult | null = null;
  let maxPoints = 0;
  
  // Try each formation with each strategy
  for (const formation of FORMATIONS) {
    for (const strategy of ['points', 'value', 'balanced'] as const) {
      const result = tryBuildSquad(formation, gks, defs, mids, fwds, strategy);
      
      if (result && result.totalPoints > maxPoints) {
        // Verify constraints
        const teamCounts: Record<string, number> = {};
        let valid = true;
        
        for (const p of result.allPlayers) {
          teamCounts[p.player.teamId] = (teamCounts[p.player.teamId] || 0) + 1;
          if (teamCounts[p.player.teamId] > MAX_PER_TEAM) {
            valid = false;
            break;
          }
        }
        
        if (valid && result.totalPrice <= BUDGET) {
          maxPoints = result.totalPoints;
          bestResult = result;
        }
      }
    }
  }
  
  // Fallback if no valid squad found
  if (!bestResult) {
    return {
      formation: FORMATIONS[2], // 4-4-2
      totalPoints: 0,
      totalPrice: 0,
      gk: gks[0],
      defenders: defs.slice(0, 4),
      midfielders: mids.slice(0, 4),
      forwards: fwds.slice(0, 2),
      captain: gks[0],
      viceCaptain: defs[0],
      allPlayers: [gks[0], ...defs.slice(0, 4), ...mids.slice(0, 4), ...fwds.slice(0, 2)],
      teamDistribution: {},
    };
  }
  
  return bestResult;
}
