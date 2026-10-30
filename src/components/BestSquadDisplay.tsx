import { calculateBestSquad } from '../utils/squadOptimizer';
import { teams } from '../data/teams';

export function BestSquadDisplay() {
  const squad = calculateBestSquad();

  const getTeamBadge = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    return (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/20"
        style={{ backgroundColor: team.color, color: team.textColor }}
      >
        {team.shortName.slice(0, 3)}
      </div>
    );
  };

  const PlayerCard = ({ player, position }: { player: typeof squad.gk; position: string }) => {
    const team = teams.find(t => t.id === player.player.teamId);
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getTeamBadge(player.player.teamId)}
            <div>
              <div className="font-bold text-sm">{player.player.name}</div>
              <div className="text-xs text-purple-200">
                {team?.shortName} • {position}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{player.prediction.predictedPoints}</div>
            <div className="text-xs text-purple-200">pts</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-purple-200">{player.fixture}</span>
          <div className="flex gap-2">
            {player.player.position === 'FWD' || player.player.position === 'MID' ? (
              <>
                <span className="text-green-300">⚽{player.prediction.goalProb}%</span>
                <span className="text-blue-300">🎯{player.prediction.assistProb}%</span>
              </>
            ) : (
              <span className="text-purple-300">🧤{player.prediction.cleanSheetProb}%</span>
            )}
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-200">FPL: {player.player.points}pts</span>
            <span className="text-purple-200">£{player.player.price}m</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            ⭐ Best XI Squad for GW9
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            Optimized formation for maximum predicted points
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{squad.totalPoints}</div>
          <div className="text-emerald-200 text-sm">Total Points</div>
        </div>
      </div>

      {/* Formation Badge */}
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 text-center">
        <div className="text-sm text-emerald-100 mb-1">Selected Formation</div>
        <div className="text-3xl font-bold">{squad.formation.name}</div>
        <div className="text-xs text-emerald-200 mt-1">
          {squad.formation.gk} GK • {squad.formation.def} DEF • {squad.formation.mid} MID • {squad.formation.fwd} FWD
        </div>
      </div>

      {/* Squad Display */}
      <div className="space-y-4">
        {/* Goalkeeper */}
        <div>
          <div className="text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-xs">GK</span>
            Goalkeeper
          </div>
          <div className="grid grid-cols-1 gap-2">
            <PlayerCard player={squad.gk} position="GK" />
          </div>
        </div>

        {/* Defenders */}
        <div>
          <div className="text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
            <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">DEF</span>
            Defenders ({squad.defenders.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {squad.defenders.map((player, idx) => (
              <PlayerCard key={idx} player={player} position="DEF" />
            ))}
          </div>
        </div>

        {/* Midfielders */}
        <div>
          <div className="text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
            <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs">MID</span>
            Midfielders ({squad.midfielders.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {squad.midfielders.map((player, idx) => (
              <PlayerCard key={idx} player={player} position="MID" />
            ))}
          </div>
        </div>

        {/* Forwards */}
        <div>
          <div className="text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">FWD</span>
            Forwards ({squad.forwards.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {squad.forwards.map((player, idx) => (
              <PlayerCard key={idx} player={player} position="FWD" />
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{squad.allPlayers.length}</div>
            <div className="text-xs text-emerald-200">Players</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              £{squad.allPlayers.reduce((sum, p) => sum + p.player.price, 0).toFixed(1)}m
            </div>
            <div className="text-xs text-emerald-200">Total Cost</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {(squad.totalPoints / squad.allPlayers.length).toFixed(1)}
            </div>
            <div className="text-xs text-emerald-200">Avg Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.max(...squad.allPlayers.map(p => p.prediction.predictedPoints))}
            </div>
            <div className="text-xs text-emerald-200">Top Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
