import { useState } from "react";
import {
  fplPlayers,
  teamIds,
  getPlayersByTeam,
  rankPlayersForMatch,
  getTeamStrength,
  type FPLPlayer,
  type Position,
} from "../data/fplDatabase";
import { teams } from "../data/teams";

function TeamBadge({ teamId, size = "md" }: { teamId: string; size?: "sm" | "md" | "lg" }) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return null;
  const sizeClasses = size === "sm" ? "w-6 h-6 text-[8px]" : size === "lg" ? "w-14 h-14 text-sm" : "w-9 h-9 text-[10px]";
  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white/20 flex-shrink-0`}
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

// === MATCH PREDICTOR ===
export function MatchPredictorFPL() {
  const [homeTeam, setHomeTeam] = useState(teamIds[0]);
  const [awayTeam, setAwayTeam] = useState(teamIds[1]);
  const [posFilter, setPosFilter] = useState<Position | "ALL">("ALL");
  const [showFactors, setShowFactors] = useState<string | null>(null);

  const rankedPlayers = rankPlayersForMatch(homeTeam, awayTeam);
  const filteredPlayers = posFilter === "ALL" ? rankedPlayers : rankedPlayers.filter(r => r.player.position === posFilter);

  const homeTeamData = teams.find(t => t.id === homeTeam);
  const awayTeamData = teams.find(t => t.id === awayTeam);
  const homeStrength = getTeamStrength(homeTeam);
  const awayStrength = getTeamStrength(awayTeam);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">🏟️ Match Player Predictor</h2>
        <p className="text-emerald-200 text-sm">Select two teams to rank players by predicted FPL points</p>
      </div>

      {/* Team Selection */}
      <div className="p-6 bg-gray-50 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">🏠 Home Team</label>
            <select
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-sm font-medium"
            >
              {teamIds.map(id => {
                const t = teams.find(t => t.id === id);
                return <option key={id} value={id}>{t?.name || id}</option>;
              })}
            </select>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <TeamBadge teamId={homeTeam} size="lg" />
              <span className="text-2xl font-bold text-gray-400">VS</span>
              <TeamBadge teamId={awayTeam} size="lg" />
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
              <span>ATK: {homeStrength.attack.toFixed(1)} vs {awayStrength.attack.toFixed(1)}</span>
              <span>DEF: {homeStrength.defense.toFixed(1)} vs {awayStrength.defense.toFixed(1)}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">✈️ Away Team</label>
            <select
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-sm font-medium"
            >
              {teamIds.map(id => {
                const t = teams.find(t => t.id === id);
                return <option key={id} value={id}>{t?.name || id}</option>;
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Position Filter */}
      <div className="px-6 pt-4">
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                posFilter === pos
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {pos === "ALL" ? "All Positions" : pos}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked Players */}
      <div className="p-4 max-h-[700px] overflow-y-auto">
        <div className="space-y-2">
          {filteredPlayers.map(({ player, prediction, isHome }, idx) => (
            <div
              key={player.id}
              className={`rounded-lg border transition-all ${
                idx < 5 ? "border-emerald-200 bg-emerald-50/50" :
                idx < 10 ? "border-blue-200 bg-blue-50/30" :
                "border-gray-200 bg-white"
              } ${showFactors === player.id ? "ring-2 ring-emerald-400" : ""}`}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx < 3 ? "bg-yellow-400 text-yellow-900" :
                  idx < 5 ? "bg-emerald-500 text-white" :
                  idx < 10 ? "bg-blue-500 text-white" :
                  "bg-gray-200 text-gray-600"
                }`}>
                  {idx + 1}
                </div>

                {/* Team Badge */}
                <TeamBadge teamId={player.teamId} />

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 text-sm">{player.name}</span>
                    <PositionBadge position={player.position} />
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${isHome ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {isHome ? "HOME" : "AWAY"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 flex-wrap">
                    <span className="font-medium">FPL: {player.points}pts</span>
                    <span>£{player.price}m</span>
                    {player.position === "FWD" || player.position === "MID" ? (
                      <>
                        <span className="text-green-600">⚽ {prediction.goalProb}%</span>
                        <span className="text-blue-600">🎯 {prediction.assistProb}%</span>
                      </>
                    ) : (
                      <span className="text-purple-600">🧤 {prediction.cleanSheetProb}%</span>
                    )}
                  </div>
                </div>

                {/* Predicted Points */}
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-700">{prediction.predictedPoints}</div>
                  <div className="text-[10px] text-gray-500">pred. pts</div>
                </div>

                {/* Expand Factors */}
                <button
                  onClick={() => setShowFactors(showFactors === player.id ? null : player.id)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  {showFactors === player.id ? "▲" : "▼"}
                </button>
              </div>

              {/* Factors Breakdown */}
              {showFactors === player.id && (
                <div className="px-4 pb-3 border-t border-gray-100 pt-2">
                  <div className="mb-2 text-xs text-gray-600 font-medium">
                    Match Difficulty: {prediction.matchDifficulty.toFixed(1)}/5 
                    <span className="ml-2 text-gray-400">
                      ({prediction.matchDifficulty < 2.5 ? "Easy" : prediction.matchDifficulty < 3.5 ? "Medium" : "Hard"})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {prediction.factors.map((factor, i) => (
                      <div key={i} className="bg-gray-50 rounded px-3 py-2">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-gray-600 font-medium">{factor.label}</span>
                          <span className="text-gray-400">{(factor.weight * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{factor.impact}</span>
                          <span className="text-xs font-bold text-gray-800">
                            {factor.value > 1.1 ? "↑" : factor.value < 0.9 ? "↓" : "→"} {factor.value.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(player.position === "FWD" || player.position === "MID") && (
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                      <div className="font-medium text-blue-900 mb-1">Attacking Probabilities:</div>
                      <div className="flex gap-4">
                        <span className="text-green-700">Goal: {prediction.goalProb}%</span>
                        <span className="text-blue-700">Assist: {prediction.assistProb}%</span>
                      </div>
                    </div>
                  )}
                  {(player.position === "DEF" || player.position === "GK") && (
                    <div className="mt-3 p-2 bg-purple-50 rounded text-xs">
                      <div className="font-medium text-purple-900 mb-1">Defensive Probabilities:</div>
                      <div className="flex gap-4">
                        <span className="text-purple-700">Clean Sheet: {prediction.cleanSheetProb}%</span>
                        {player.position === "DEF" && prediction.goalProb > 0 && (
                          <span className="text-green-700">Goal: {prediction.goalProb}%</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-gray-50 border-t text-xs text-gray-500 flex flex-wrap gap-4">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-full"></span> Top 3</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Top 5</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Top 10</span>
        <span className="ml-auto">Model: Opponent Stats • Form • Quality • Team Strength • Home/Away • Role</span>
      </div>
    </div>
  );
}

// === TEAM COMPARISON ===
export function TeamComparison() {
  const [team1, setTeam1] = useState(teamIds[0]);
  const [team2, setTeam2] = useState(teamIds[1]);

  const team1Players = getPlayersByTeam(team1);
  const team2Players = getPlayersByTeam(team2);
  const strength1 = getTeamStrength(team1);
  const strength2 = getTeamStrength(team2);

  const team1Data = teams.find(t => t.id === team1);
  const team2Data = teams.find(t => t.id === team2);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">⚔️ Team vs Team</h2>
        <p className="text-indigo-200 text-sm">Compare squad strength and top performers</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            className="px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-sm font-medium"
          >
            {teamIds.map(id => <option key={id} value={id}>{teams.find(t => t.id === id)?.name}</option>)}
          </select>
          <select
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            className="px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-sm font-medium"
          >
            {teamIds.map(id => <option key={id} value={id}>{teams.find(t => t.id === id)?.name}</option>)}
          </select>
        </div>

        {/* Strength Comparison */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Attack</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-lg text-indigo-700">{strength1.attack.toFixed(1)}</span>
              <span className="text-gray-400">vs</span>
              <span className="font-bold text-lg text-purple-700">{strength2.attack.toFixed(1)}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Defense</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-lg text-indigo-700">{strength1.defense.toFixed(1)}</span>
              <span className="text-gray-400">vs</span>
              <span className="font-bold text-lg text-purple-700">{strength2.defense.toFixed(1)}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Overall</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-lg text-indigo-700">{strength1.overall.toFixed(1)}</span>
              <span className="text-gray-400">vs</span>
              <span className="font-bold text-lg text-purple-700">{strength2.overall.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Top Players Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TeamBadge teamId={team1} />
              <h3 className="font-bold text-gray-700 text-sm">{team1Data?.name}</h3>
            </div>
            <div className="space-y-1">
              {team1Players.slice(0, 8).map((p, i) => (
                <div key={p.id} className="flex items-center gap-2 py-1 px-2 bg-gray-50 rounded text-xs">
                  <span className="text-gray-400 w-4">{i + 1}</span>
                  <PositionBadge position={p.position} />
                  <span className="flex-1 font-medium text-gray-700 truncate">{p.name}</span>
                  <span className="text-indigo-600 font-bold">{p.points}pts</span>
                  <span className="text-gray-400">£{p.price}m</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TeamBadge teamId={team2} />
              <h3 className="font-bold text-gray-700 text-sm">{team2Data?.name}</h3>
            </div>
            <div className="space-y-1">
              {team2Players.slice(0, 8).map((p, i) => (
                <div key={p.id} className="flex items-center gap-2 py-1 px-2 bg-gray-50 rounded text-xs">
                  <span className="text-gray-400 w-4">{i + 1}</span>
                  <PositionBadge position={p.position} />
                  <span className="flex-1 font-medium text-gray-700 truncate">{p.name}</span>
                  <span className="text-purple-600 font-bold">{p.points}pts</span>
                  <span className="text-gray-400">£{p.price}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === TOP PERFORMERS BY TEAM ===
export function TopPerformersByTeam() {
  const [selectedTeam, setSelectedTeam] = useState(teamIds[0]);
  const players = getPlayersByTeam(selectedTeam);
  const teamData = teams.find(t => t.id === selectedTeam);
  const strength = getTeamStrength(selectedTeam);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">🌟 Top Performers by Team</h2>
        <p className="text-amber-200 text-sm">Best FPL assets from each squad</p>
      </div>
      <div className="p-6">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:outline-none text-gray-800 font-medium mb-4"
        >
          {teamIds.map(id => <option key={id} value={id}>{teams.find(t => t.id === id)?.name}</option>)}
        </select>

        <div className="flex items-center gap-3 mb-4">
          <TeamBadge teamId={selectedTeam} size="lg" />
          <div>
            <h3 className="font-bold text-gray-800">{teamData?.name}</h3>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>ATK: {strength.attack.toFixed(1)}</span>
              <span>DEF: {strength.defense.toFixed(1)}</span>
              <span>Overall: {strength.overall.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {players.slice(0, 12).map((p, i) => (
            <div key={p.id} className={`flex items-center gap-3 py-2 px-3 rounded-lg ${
              i < 3 ? "bg-amber-50 border border-amber-200" : "bg-gray-50"
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i < 3 ? "bg-amber-400 text-amber-900" : "bg-gray-200 text-gray-600"
              }`}>{i + 1}</span>
              <PositionBadge position={p.position} />
              <span className="flex-1 font-medium text-gray-800 text-sm">{p.name}</span>
              <div className="text-right">
                <span className="font-bold text-amber-700">{p.points}pts</span>
                <span className="text-xs text-gray-400 ml-2">£{p.price}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
