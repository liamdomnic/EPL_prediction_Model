import { useState } from "react";
import {
  players,
  getTotalFPLPoints,
  getPlayersByFPL,
  getTopScorers,
  getTopAssisters,
  getBestValue,
  getDifferentials,
  getInFormPlayers,
  calculateGWPoints,
  type Player,
  type Position,
} from "../data/players";
import { teams, type Team } from "../data/teams";

function TeamBadge({ teamId, size = "sm" }: { teamId: string; size?: "sm" | "md" }) {
  const team: Team | undefined = teams.find((t: Team) => t.id === teamId);
  if (!team) return null;
  const sizeClasses = size === "sm" ? "w-5 h-5 text-[7px]" : "w-7 h-7 text-[9px]";
  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold shadow-sm border border-white/20 flex-shrink-0`}
      style={{ backgroundColor: team.color, color: team.textColor }}
    >
      {team.shortName.slice(0, 3)}
    </div>
  );
}

function PositionBadge({ position }: { position: Position }) {
  const colors: Record<Position, string> = {
    GK: "bg-yellow-400 text-yellow-900",
    DEF: "bg-green-500 text-white",
    MID: "bg-blue-500 text-white",
    FWD: "bg-red-500 text-white",
  };
  return (
    <span className={`${colors[position]} text-[10px] font-bold px-1.5 py-0.5 rounded`}>
      {position}
    </span>
  );
}

function PlayerRow({ player, rank }: { player: Player; rank?: number }) {
  const fplPoints = getTotalFPLPoints(player);

  return (
    <div className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
      {rank !== undefined && (
        <span className="text-xs font-bold text-gray-400 w-5 text-center">{rank}</span>
      )}
      <TeamBadge teamId={player.teamId} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800 text-sm truncate">{player.name}</span>
          <PositionBadge position={player.position} />
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
          <span className="text-green-600 font-medium">{player.totalGoals}G</span>
          <span className="text-blue-600 font-medium">{player.totalAssists}A</span>
          {(player.position === "GK" || player.position === "DEF") && (
            <span className="text-purple-600 font-medium">{player.totalCleanSheets}CS</span>
          )}
          <span>£{player.price}m</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-indigo-700 text-sm">{fplPoints}</div>
        <div className="text-[10px] text-gray-400">pts</div>
      </div>
    </div>
  );
}

// === FPL LEADERBOARD ===
export function FPLLeaderboard() {
  const [posFilter, setPosFilter] = useState<Position | "ALL">("ALL");
  const topPlayers: Player[] = posFilter === "ALL" ? getPlayersByFPL().slice(0, 20) : getPlayersByFPL(posFilter).slice(0, 15);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">🏆 FPL Points Leaderboard</h2>
        <p className="text-indigo-200 text-sm">Official FPL scoring • After GW8</p>
      </div>
      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos: Position | "ALL") => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                posFilter === pos ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {pos === "ALL" ? "All" : pos}
            </button>
          ))}
        </div>
      </div>
      <div className="px-2 pb-4 space-y-0.5 max-h-[600px] overflow-y-auto">
        {topPlayers.map((player: Player, idx: number) => (
          <PlayerRow key={player.id} player={player} rank={idx + 1} />
        ))}
      </div>
    </div>
  );
}

// === TOP SCORERS ===
export function TopScorers() {
  const scorers: Player[] = getTopScorers(10);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">⚽ Golden Boot Race</h2>
        <p className="text-green-200 text-sm">Top goalscorers GW1-GW8</p>
      </div>
      <div className="p-4 space-y-2">
        {scorers.map((player: Player, idx: number) => (
          <div key={player.id} className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-lg">
            <span className="text-lg w-7 text-center">
              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span className="text-sm text-gray-400 font-bold">{idx + 1}</span>}
            </span>
            <TeamBadge teamId={player.teamId} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 text-sm">{player.name}</span>
                <PositionBadge position={player.position} />
              </div>
              <div className="text-xs text-gray-500 mt-0.5 flex gap-1">
                {player.gwStats.map((g, i: number) => (
                  <span key={i} className={g.goals > 0 ? "text-green-600 font-bold" : "text-gray-300"}>
                    {g.goals > 0 ? g.goals : "·"}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{player.totalGoals}</div>
              <div className="text-[10px] text-gray-400">goals</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === TOP ASSISTERS ===
export function TopAssisters() {
  const assisters: Player[] = getTopAssisters(10);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">🎯 Playmaker Rankings</h2>
        <p className="text-blue-200 text-sm">Top assist providers GW1-GW8</p>
      </div>
      <div className="p-4 space-y-2">
        {assisters.map((player: Player, idx: number) => (
          <div key={player.id} className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-lg">
            <span className="text-lg w-7 text-center">
              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span className="text-sm text-gray-400 font-bold">{idx + 1}</span>}
            </span>
            <TeamBadge teamId={player.teamId} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 text-sm">{player.name}</span>
                <PositionBadge position={player.position} />
              </div>
              <div className="text-xs text-gray-500 mt-0.5 flex gap-1">
                {player.gwStats.map((g, i: number) => (
                  <span key={i} className={g.assists > 0 ? "text-blue-600 font-bold" : "text-gray-300"}>
                    {g.assists > 0 ? g.assists : "·"}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{player.totalAssists}</div>
              <div className="text-[10px] text-gray-400">assists</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === VALUE PICKS ===
export function ValuePicks() {
  const picks: Player[] = getBestValue(12);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">💰 Best Value Picks</h2>
        <p className="text-amber-200 text-sm">Highest FPL points per £million</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {picks.map((player: Player, idx: number) => {
            const ptsPerMil = (getTotalFPLPoints(player) / player.price).toFixed(1);
            return (
              <div key={player.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}</span>
                <TeamBadge teamId={player.teamId} />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-800 text-xs truncate block">{player.name}</span>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <PositionBadge position={player.position} />
                    <span>£{player.price}m</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-600 text-sm">{ptsPerMil}</div>
                  <div className="text-[10px] text-gray-400">pts/£m</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// === DIFFERENTIAL PICKS ===
export function DifferentialPicks() {
  const diffs: Player[] = getDifferentials(8);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-600 to-rose-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">🎲 Differential Picks</h2>
        <p className="text-pink-200 text-sm">Budget players delivering big returns</p>
      </div>
      <div className="p-4 space-y-2">
        {diffs.map((player: Player, idx: number) => (
          <div key={player.id} className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-lg">
            <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}</span>
            <TeamBadge teamId={player.teamId} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 text-sm">{player.name}</span>
                <PositionBadge position={player.position} />
              </div>
              <div className="text-xs text-gray-500">
                {player.totalGoals}G {player.totalAssists}A • £{player.price}m
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-pink-600">{getTotalFPLPoints(player)} pts</div>
              <div className="text-[10px] text-green-600">
                {(getTotalFPLPoints(player) / player.price).toFixed(1)} pts/£m
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === IN-FORM PLAYERS ===
export function InFormPlayers() {
  const [posFilter, setPosFilter] = useState<Position | "ALL">("ALL");
  const allInForm = getInFormPlayers(20);
  const inForm: Player[] = posFilter === "ALL" ? allInForm : allInForm.filter(p => p.position === posFilter).slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">🔥 Hot Form (GW6-GW8)</h2>
        <p className="text-orange-200 text-sm">Best performers in last 3 gameweeks</p>
      </div>
      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos: Position | "ALL") => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                posFilter === pos ? "bg-orange-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {pos === "ALL" ? "All" : pos}
            </button>
          ))}
        </div>
      </div>
      <div className="px-2 pb-4 space-y-0.5">
        {inForm.slice(0, 10).map((player: Player, idx: number) => {
          const recentPts = [6, 7, 8].reduce((s: number, gw: number) => s + calculateGWPoints(player, gw).total, 0);
          return (
            <div key={player.id} className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-lg">
              <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}</span>
              <TeamBadge teamId={player.teamId} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 text-sm">{player.name}</span>
                  <PositionBadge position={player.position} />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Last 3 GWs: <span className="text-orange-600 font-bold">{recentPts} pts</span>
                </div>
              </div>
              <div className="flex gap-1">
                {[6, 7, 8].map((gw: number) => {
                  const pts = calculateGWPoints(player, gw).total;
                  return (
                    <span
                      key={gw}
                      className={`w-7 h-6 rounded text-[10px] font-bold flex items-center justify-center ${
                        pts >= 8 ? "bg-green-100 text-green-700" : pts >= 4 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {pts}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === GW POINTS BREAKDOWN WITH DETAILED SCORING ===
export function GWPointsBreakdown() {
  const [selectedGW, setSelectedGW] = useState(8);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const gwData = players
    .map((p: Player) => ({
      player: p,
      ...calculateGWPoints(p, selectedGW),
    }))
    .filter(d => d.total > 2)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">📊 GW{selectedGW} Points Breakdown</h2>
        <p className="text-violet-200 text-sm">Detailed FPL scoring per player per gameweek</p>
      </div>
      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((gw: number) => (
            <button
              key={gw}
              onClick={() => { setSelectedGW(gw); setSelectedPlayer(null); }}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                selectedGW === gw ? "bg-violet-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {gw}
            </button>
          ))}
        </div>
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="mx-4 mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TeamBadge teamId={selectedPlayer.teamId} size="md" />
              <div>
                <span className="font-bold text-gray-800">{selectedPlayer.name}</span>
                <PositionBadge position={selectedPlayer.position} />
              </div>
            </div>
            <button onClick={() => setSelectedPlayer(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
          </div>
          <div className="space-y-1">
            {calculateGWPoints(selectedPlayer, selectedGW).breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className={`font-bold ${item.pts > 0 ? "text-green-600" : "text-red-600"}`}>
                  {item.pts > 0 ? "+" : ""}{item.pts}
                </span>
              </div>
            ))}
            <div className="border-t pt-1 mt-2 flex justify-between font-bold">
              <span>Total GW{selectedGW} Points</span>
              <span className="text-indigo-700">{calculateGWPoints(selectedPlayer, selectedGW).total}</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-2 pb-4 space-y-0.5 max-h-[500px] overflow-y-auto">
        {gwData.slice(0, 20).map(({ player, total, breakdown }, idx: number) => (
          <button
            key={player.id}
            onClick={() => setSelectedPlayer(player)}
            className="w-full flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
          >
            <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}</span>
            <TeamBadge teamId={player.teamId} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 text-sm">{player.name}</span>
                <PositionBadge position={player.position} />
              </div>
              <div className="text-xs text-gray-500">
                {player.gwStats[selectedGW - 1].goals > 0 && <span className="text-green-600 font-bold">{player.gwStats[selectedGW - 1].goals}G </span>}
                {player.gwStats[selectedGW - 1].assists > 0 && <span className="text-blue-600 font-bold">{player.gwStats[selectedGW - 1].assists}A </span>}
                {player.gwStats[selectedGW - 1].cleanSheet && <span className="text-purple-600 font-bold">CS </span>}
                {player.gwStats[selectedGW - 1].minutes}min
              </div>
            </div>
            <div className={`font-bold text-sm px-2 py-1 rounded ${
              total >= 10 ? "bg-green-100 text-green-700" :
              total >= 6 ? "bg-blue-100 text-blue-700" :
              total >= 3 ? "bg-gray-100 text-gray-700" : "bg-gray-50 text-gray-500"
            }`}>
              {total} pts
            </div>
          </button>
        ))}
      </div>
      <div className="px-4 pb-3 text-center">
        <p className="text-[10px] text-gray-400">Click any player to see detailed points breakdown</p>
      </div>
    </div>
  );
}

// === PLAYER DETAIL CARD ===
export function PlayerDetailCard() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(players[0]);
  const posPlayers = getPlayersByFPL(selectedPlayer.position);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">🔍 Player Deep Dive</h2>
        <p className="text-teal-200 text-sm">Full GW-by-GW FPL breakdown</p>
      </div>
      <div className="p-4">
        <select
          value={selectedPlayer.id}
          onChange={(e) => {
            const found = players.find(p => p.id === e.target.value);
            if (found) setSelectedPlayer(found);
          }}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:outline-none text-gray-800 font-medium mb-4"
        >
          {players.map((p: Player) => (
            <option key={p.id} value={p.id}>{p.name} ({p.position} - {teams.find(t => t.id === p.teamId)?.shortName})</option>
          ))}
        </select>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-700">{selectedPlayer.totalGoals}</p>
            <p className="text-[10px] text-green-600">Goals</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-blue-700">{selectedPlayer.totalAssists}</p>
            <p className="text-[10px] text-blue-600">Assists</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-purple-700">{selectedPlayer.totalCleanSheets}</p>
            <p className="text-[10px] text-purple-600">Clean Sheets</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-indigo-700">{getTotalFPLPoints(selectedPlayer)}</p>
            <p className="text-[10px] text-indigo-600">FPL Pts</p>
          </div>
        </div>

        {/* GW-by-GW Breakdown */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-700 text-sm">GW-by-GW Points</h3>
          <div className="grid grid-cols-8 gap-1 mb-3">
            {[1,2,3,4,5,6,7,8].map((gw: number) => {
              const { total } = calculateGWPoints(selectedPlayer, gw);
              return (
                <div key={gw} className={`text-center p-1.5 rounded ${
                  total >= 10 ? "bg-green-100" : total >= 6 ? "bg-blue-100" : total >= 3 ? "bg-gray-100" : "bg-red-50"
                }`}>
                  <p className="text-[10px] text-gray-500">GW{gw}</p>
                  <p className="font-bold text-sm">{total}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed latest GW */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-bold text-gray-600 text-xs mb-2">GW8 Detailed Breakdown</h4>
            {calculateGWPoints(selectedPlayer, 8).breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-xs py-0.5">
                <span className="text-gray-600">{item.label}</span>
                <span className={`font-bold ${item.pts > 0 ? "text-green-600" : "text-red-600"}`}>
                  {item.pts > 0 ? "+" : ""}{item.pts}
                </span>
              </div>
            ))}
            <div className="border-t mt-1 pt-1 flex justify-between font-bold text-sm">
              <span>Total</span>
              <span className="text-indigo-700">{calculateGWPoints(selectedPlayer, 8).total} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === FPL TEAM BUILDER ===
export function FPLTeamBuilder() {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [posFilter, setPosFilter] = useState<Position | "ALL">("ALL");
  const budget = 100.0;

  const togglePlayer = (id: string) => {
    setSelectedPlayers((prev: string[]) =>
      prev.includes(id) ? prev.filter((p: string) => p !== id) : [...prev, id]
    );
  };

  const selectedPlayerObjects: Player[] = selectedPlayers
    .map((id: string) => players.find((p: Player) => p.id === id)!)
    .filter(Boolean);

  const totalCost: number = selectedPlayerObjects.reduce((sum: number, p: Player) => sum + p.price, 0);
  const totalPoints: number = selectedPlayerObjects.reduce((sum: number, p: Player) => sum + getTotalFPLPoints(p), 0);
  const remaining: number = budget - totalCost;

  const byPos: Record<Position, Player[]> = {
    GK: selectedPlayerObjects.filter((p: Player) => p.position === "GK"),
    DEF: selectedPlayerObjects.filter((p: Player) => p.position === "DEF"),
    MID: selectedPlayerObjects.filter((p: Player) => p.position === "MID"),
    FWD: selectedPlayerObjects.filter((p: Player) => p.position === "FWD"),
  };

  const filteredPlayers: Player[] = posFilter === "ALL" ? players : players.filter((p: Player) => p.position === posFilter);
  const sortedFiltered: Player[] = [...filteredPlayers].sort((a: Player, b: Player) => getTotalFPLPoints(b) - getTotalFPLPoints(a));

  const isValid = byPos.GK.length >= 1 && byPos.GK.length <= 2 &&
    byPos.DEF.length >= 3 && byPos.DEF.length <= 5 &&
    byPos.MID.length >= 3 && byPos.MID.length <= 5 &&
    byPos.FWD.length >= 1 && byPos.FWD.length <= 3 &&
    selectedPlayers.length >= 11 && selectedPlayers.length <= 15 &&
    totalCost <= budget;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">👥 FPL Team Builder</h2>
        <p className="text-emerald-200 text-sm">Build your squad • 15 players • £100m budget</p>
      </div>

      <div className="bg-gray-50 px-6 py-3 border-b flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Players:</span>
          <span className={`font-bold text-sm ${selectedPlayers.length >= 11 && selectedPlayers.length <= 15 ? "text-green-600" : "text-red-600"}`}>
            {selectedPlayers.length}/15
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Budget:</span>
          <span className={`font-bold text-sm ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
            £{totalCost.toFixed(1)}m / £100m
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Total Pts:</span>
          <span className="font-bold text-sm text-indigo-600">{totalPoints}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Squad:</span>
          <span className="text-xs">
            <span className={byPos.GK.length >= 1 ? "text-green-600" : "text-red-500"}>{byPos.GK.length}GK</span>
            {" "}
            <span className={byPos.DEF.length >= 3 ? "text-green-600" : "text-red-500"}>{byPos.DEF.length}DEF</span>
            {" "}
            <span className={byPos.MID.length >= 3 ? "text-green-600" : "text-red-500"}>{byPos.MID.length}MID</span>
            {" "}
            <span className={byPos.FWD.length >= 1 ? "text-green-600" : "text-red-500"}>{byPos.FWD.length}FWD</span>
          </span>
        </div>
        {isValid && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">✓ Valid</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="border-r p-4">
          <h3 className="font-bold text-gray-700 mb-3 text-sm">Your Squad</h3>
          {selectedPlayers.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Click players on the right to build your squad</p>
          ) : (
            <div className="space-y-1">
              {(["GK", "DEF", "MID", "FWD"] as Position[]).map((pos: Position) => {
                const posPlayers = byPos[pos];
                if (posPlayers.length === 0) return null;
                return (
                  <div key={pos}>
                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{pos}</div>
                    {posPlayers.map((p: Player) => (
                      <div key={p.id} className="flex items-center gap-2 py-1 px-2 bg-gray-50 rounded mb-1">
                        <TeamBadge teamId={p.teamId} />
                        <span className="text-xs font-medium text-gray-700 flex-1 truncate">{p.name}</span>
                        <span className="text-[10px] text-gray-500">£{p.price}m</span>
                        <span className="text-[10px] font-bold text-indigo-600">{getTotalFPLPoints(p)}pts</span>
                        <button onClick={() => togglePlayer(p.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-3 flex-wrap">
            {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos: Position | "ALL") => (
              <button
                key={pos}
                onClick={() => setPosFilter(pos)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  posFilter === pos ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {pos === "ALL" ? "All" : pos}
              </button>
            ))}
          </div>
          <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
            {sortedFiltered.slice(0, 30).map((player: Player) => {
              const isSelected = selectedPlayers.includes(player.id);
              return (
                <button
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded text-left transition-all ${
                    isSelected ? "bg-emerald-50 border border-emerald-200" : "hover:bg-gray-50"
                  }`}
                >
                  <TeamBadge teamId={player.teamId} />
                  <span className="text-xs font-medium text-gray-700 flex-1 truncate">{player.name}</span>
                  <PositionBadge position={player.position} />
                  <span className="text-[10px] text-gray-500">£{player.price}m</span>
                  <span className="text-[10px] font-bold text-indigo-600 w-8 text-right">{getTotalFPLPoints(player)}</span>
                  {isSelected && <span className="text-emerald-600 text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// === STATS OVERVIEW ===
export function FPLStatsOverview() {
  const totalGoals: number = players.reduce((sum: number, p: Player) => sum + p.totalGoals, 0);
  const totalAssists: number = players.reduce((sum: number, p: Player) => sum + p.totalAssists, 0);
  const topScorer: Player | undefined = getTopScorers(1)[0];
  const topAssister: Player | undefined = getTopAssisters(1)[0];
  const topFPL: Player | undefined = getPlayersByFPL().slice(0, 1)[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-4 shadow text-center">
        <p className="text-3xl font-bold text-green-600">{totalGoals}</p>
        <p className="text-xs text-gray-500">Total Goals</p>
        <p className="text-[10px] text-gray-400 mt-1">Top: {topScorer?.name} ({topScorer?.totalGoals})</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow text-center">
        <p className="text-3xl font-bold text-blue-600">{totalAssists}</p>
        <p className="text-xs text-gray-500">Total Assists</p>
        <p className="text-[10px] text-gray-400 mt-1">Top: {topAssister?.name} ({topAssister?.totalAssists})</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow text-center">
        <p className="text-3xl font-bold text-indigo-600">{topFPL ? getTotalFPLPoints(topFPL) : 0}</p>
        <p className="text-xs text-gray-500">Top FPL Points</p>
        <p className="text-[10px] text-gray-400 mt-1">{topFPL?.name}</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow text-center">
        <p className="text-3xl font-bold text-purple-600">{(totalGoals / 80).toFixed(2)}</p>
        <p className="text-xs text-gray-500">Goals/Match</p>
        <p className="text-[10px] text-gray-400 mt-1">220 goals in 80 matches</p>
      </div>
    </div>
  );
}

// === FPL SCORING RULES ===
export function FPLScoringRules() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">📋 FPL Scoring System</h2>
        <p className="text-gray-300 text-sm">Official Fantasy Premier League points</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-gray-800 mb-2 text-sm">⚽ Goals Scored</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Goalkeeper</span><span className="font-bold text-green-600">+10 pts</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Defender</span><span className="font-bold text-green-600">+6 pts</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Midfielder</span><span className="font-bold text-green-600">+5 pts</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Forward</span><span className="font-bold text-green-600">+4 pts</span></div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2 text-sm">🎯 Assists</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">All positions</span><span className="font-bold text-blue-600">+3 pts</span></div>
          </div>
          <h3 className="font-bold text-gray-800 mb-2 mt-4 text-sm">🛡️ Clean Sheet</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">GK / DEF</span><span className="font-bold text-purple-600">+4 pts</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Midfielder</span><span className="font-bold text-purple-600">+1 pt</span></div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2 text-sm">🧤 Goalkeeper</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Per 3 saves</span><span className="font-bold text-green-600">+1 pt</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Penalty save</span><span className="font-bold text-green-600">+5 pts</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Per 2 goals conceded</span><span className="font-bold text-red-600">-1 pt</span></div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2 text-sm">⏱️ General</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Played 60+ min</span><span className="font-bold text-green-600">+2 pts</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Played &lt;60 min</span><span className="font-bold text-green-600">+1 pt</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Yellow card</span><span className="font-bold text-red-600">-1 pt</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Red card</span><span className="font-bold text-red-600">-3 pts</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Own goal</span><span className="font-bold text-red-600">-2 pts</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Penalty missed</span><span className="font-bold text-red-600">-2 pts</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Bonus (BPS)</span><span className="font-bold text-amber-600">+1-3 pts</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
