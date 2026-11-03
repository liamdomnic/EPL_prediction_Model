import { FPLPlayer } from '../data/fplData';
import { gw9MatchEvents } from '../data/gw9Results';

// Custom FPL Scoring System for GW9
// Goal: 6 points
// Assist: 4 points
// Clean Sheet (DEF/GK): 6 points
// Base appearance: 2 points

export interface PlayerGW9Stats {
  playerId: string;
  playerName: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  goals: number;
  assists: number;
  cleanSheet: boolean;
  played: boolean;
  gw9Points: number;
  breakdown: {
    basePoints: number;
    goalPoints: number;
    assistPoints: number;
    cleanSheetPoints: number;
    total: number;
  };
}

// Calculate GW9 points for a player
export function calculatePlayerGW9Points(
  player: FPLPlayer,
  goals: number,
  assists: number,
  cleanSheet: boolean,
  played: boolean
): PlayerGW9Stats {
  if (!played) {
    return {
      playerId: player.name,
      playerName: player.name,
      team: player.team,
      position: player.position,
      goals: 0,
      assists: 0,
      cleanSheet: false,
      played: false,
      gw9Points: 0,
      breakdown: {
        basePoints: 0,
        goalPoints: 0,
        assistPoints: 0,
        cleanSheetPoints: 0,
        total: 0
      }
    };
  }

  const basePoints = 2; // Base appearance points
  const goalPoints = goals * 6; // 6 points per goal
  const assistPoints = assists * 4; // 4 points per assist
  
  // Clean sheet: 6 points for DEF and GK only
  const cleanSheetPoints = (cleanSheet && (player.position === 'DEF' || player.position === 'GK')) ? 6 : 0;
  
  const total = basePoints + goalPoints + assistPoints + cleanSheetPoints;

  return {
    playerId: player.name,
    playerName: player.name,
    team: player.team,
    position: player.position,
    goals,
    assists,
    cleanSheet,
    played: true,
    gw9Points: total,
    breakdown: {
      basePoints,
      goalPoints,
      assistPoints,
      cleanSheetPoints,
      total
    }
  };
}

// Calculate GW9 points for all players
export function calculateAllGW9Points(players: FPLPlayer[]): Map<string, PlayerGW9Stats> {
  const playerStats = new Map<string, PlayerGW9Stats>();

  // Initialize all players with 0 points
  players.forEach(player => {
    playerStats.set(player.name, calculatePlayerGW9Points(player, 0, 0, false, false));
  });

  // Process each match
  gw9MatchEvents.forEach(match => {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;

    // Mark all players from both teams as played
    players.forEach(player => {
      if (player.team === homeTeam || player.team === awayTeam) {
        const stats = playerStats.get(player.name)!;
        stats.played = true;
        stats.breakdown.basePoints = 2;
      }
    });

    // Process goals
    match.goals.forEach(goal => {
      if (goal.type === 'goal') {
        const player = players.find(p => p.name === goal.player && p.team === goal.team);
        if (player) {
          const stats = playerStats.get(player.name)!;
          stats.goals += 1;
          stats.breakdown.goalPoints += 6;
          stats.breakdown.total += 6;
        }
      }
    });

    // Process assists
    match.assists.forEach(assist => {
      const player = players.find(p => p.name === assist.player && p.team === assist.team);
      if (player) {
        const stats = playerStats.get(player.name)!;
        stats.assists += 1;
        stats.breakdown.assistPoints += 4;
        stats.breakdown.total += 4;
      }
    });

    // Process clean sheets
    if (match.homeCleanSheet) {
      players.forEach(player => {
        if (player.team === homeTeam && (player.position === 'DEF' || player.position === 'GK')) {
          const stats = playerStats.get(player.name)!;
          stats.cleanSheet = true;
          stats.breakdown.cleanSheetPoints += 6;
          stats.breakdown.total += 6;
        }
      });
    }

    if (match.awayCleanSheet) {
      players.forEach(player => {
        if (player.team === awayTeam && (player.position === 'DEF' || player.position === 'GK')) {
          const stats = playerStats.get(player.name)!;
          stats.cleanSheet = true;
          stats.breakdown.cleanSheetPoints += 6;
          stats.breakdown.total += 6;
        }
      });
    }
  });

  return playerStats;
}

// Get top GW9 performers
export function getTopGW9Performers(players: FPLPlayer[], limit: number = 20): PlayerGW9Stats[] {
  const allStats = calculateAllGW9Points(players);
  const statsArray = Array.from(allStats.values());
  
  return statsArray
    .filter(s => s.played)
    .sort((a, b) => b.gw9Points - a.gw9Points)
    .slice(0, limit);
}

// Get GW9 stats for a specific player
export function getPlayerGW9Stats(playerName: string, players: FPLPlayer[]): PlayerGW9Stats | null {
  const allStats = calculateAllGW9Points(players);
  return allStats.get(playerName) || null;
}

// Update FPL player with GW9 stats
export function updatePlayerWithGW9(player: FPLPlayer, players: FPLPlayer[]): FPLPlayer {
  const stats = getPlayerGW9Stats(player.name, players);
  if (stats) {
    return {
      ...player,
      gw9Points: stats.gw9Points,
      gw9Goals: stats.goals,
      gw9Assists: stats.assists,
      gw9CleanSheet: stats.cleanSheet
    };
  }
  return player;
}
