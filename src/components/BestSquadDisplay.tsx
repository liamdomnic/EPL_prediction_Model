import { calculateBestSquad } from '../utils/squadOptimizer';
import { teams } from '../data/teams';
import { useInjuries } from '../context/InjuryContext';

export function BestSquadDisplay() {
  const { injuredPlayers } = useInjuries();
  const injuredPlayerIds = injuredPlayers.map(p => p.playerId);
  const squad = calculateBestSquad(injuredPlayerIds);

  const getTeamBadge = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white/20 shadow-md"
        style={{ backgroundColor: team.color, color: team.textColor }}
      >
        {team.shortName.slice(0, 3)}
      </div>
    );
  };

  const budgetUsed = squad.totalPrice;
  const budgetRemaining = 100 - budgetUsed;
  const budgetPercentage = (budgetUsed / 100) * 100;

  const PlayerCard = ({ 
    player, 
    position, 
    isCaptain = false, 
    isViceCaptain = false 
  }: { 
    player: typeof squad.gk; 
    position: string;
    isCaptain?: boolean;
    isViceCaptain?: boolean;
  }) => {
    const team = teams.find(t => t.id === player.player.teamId);
    const isDefOrGk = position === 'GK' || position === 'DEF';
    
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all relative ${
        isCaptain ? 'ring-2 ring-yellow-400 shadow-lg' : isViceCaptain ? 'ring-2 ring-gray-300' : ''
      }`}>
        {isCaptain && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
            C
          </div>
        )}
        {isViceCaptain && (
          <div className="absolute -top-2 -right-2 bg-gray-300 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
            VC
          </div>
        )}
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getTeamBadge(player.player.teamId)}
            <div>
              <div className="font-bold text-base">{player.player.name}</div>
              <div className="text-xs text-purple-200">
                {team?.shortName} • {position}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{player.prediction.expectedPoints}</div>
            <div className="text-xs text-purple-200">pts</div>
          </div>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-purple-200">
            <span>{player.fixture}</span>
            <span className="font-semibold text-white">£{player.player.price}m</span>
          </div>
          
          <div className="flex items-center justify-between">
            {isDefOrGk ? (
              <span className="text-purple-300">🧤 {Math.round(player.prediction.expectedCleanSheet * 100)}% CS</span>
            ) : (
              <>
                <span className="text-green-300">⚽ {player.prediction.expectedGoals.toFixed(2)} xG</span>
                <span className="text-blue-300">🎯 {player.prediction.expectedAssists.toFixed(2)} xA</span>
              </>
            )}
          </div>
          
          <div className="flex items-center justify-between text-purple-200 pt-2 border-t border-white/10">
            <span>⏱️ {player.prediction.expectedMinutes} min</span>
            <span>📊 {Math.round(player.prediction.startProbability * 100)}% start</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-xl p-6 text-white shadow-2xl">
      {/* Header with Budget Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-4xl">⭐</span>
            Best XI Squad for GW9
          </h2>
          <p className="text-emerald-100 text-sm mt-2">
            Optimized formation • Maximum budget utilization
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold">{squad.totalPoints}</div>
          <div className="text-emerald-200 text-sm">Total Expected Points</div>
        </div>
      </div>

      {/* Budget Meter - PROMINENT DISPLAY */}
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-emerald-100">💰 Budget Utilization</div>
          <div className="text-right">
            <div className="text-2xl font-bold">£{budgetUsed.toFixed(1)}m</div>
            <div className="text-xs text-emerald-200">of £100.0m</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full bg-white/20 rounded-full h-4 overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
              budgetPercentage >= 95 ? 'bg-green-400' :
              budgetPercentage >= 85 ? 'bg-yellow-400' :
              'bg-orange-400'
            }`}
            style={{ width: `${budgetPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-lg">
            {budgetPercentage.toFixed(1)}%
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-emerald-200">
          <span>Remaining: £{budgetRemaining.toFixed(1)}m</span>
          <span className={budgetPercentage >= 95 ? 'text-green-300 font-bold' : ''}>
            {budgetPercentage >= 95 ? '✓ Excellent budget usage!' : 
             budgetPercentage >= 85 ? '✓ Good budget usage' : 
             '⚠ Could use more budget'}
          </span>
        </div>
      </div>

      {/* Formation Badge */}
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 text-center">
        <div className="text-sm text-emerald-100 mb-1">Selected Formation</div>
        <div className="text-4xl font-bold">{squad.formation.name}</div>
        <div className="text-sm text-emerald-200 mt-2">
          {squad.formation.gk} GK • {squad.formation.def} DEF • {squad.formation.mid} MID • {squad.formation.fwd} FWD
        </div>
      </div>

      {/* Captain & Vice Captain */}
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-5 mb-6">
        <div className="text-sm font-semibold text-emerald-100 mb-4">👑 Captaincy</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-400/20 rounded-lg p-4 border-2 border-yellow-400">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-400 text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                C
              </div>
              <div>
                <div className="font-bold text-lg">{squad.captain.player.name}</div>
                <div className="text-sm text-emerald-200">
                  {teams.find(t => t.id === squad.captain.player.teamId)?.shortName} • {squad.captain.player.position}
                </div>
              </div>
            </div>
            <div className="text-base">
              <span className="text-yellow-300 font-bold">{squad.captain.prediction.expectedPoints}</span>
              <span className="text-emerald-200"> × 2 = </span>
              <span className="text-yellow-300 font-bold text-lg">{(squad.captain.prediction.expectedPoints * 2).toFixed(1)}</span>
              <span className="text-emerald-200"> pts</span>
            </div>
          </div>
          
          <div className="bg-gray-300/20 rounded-lg p-4 border-2 border-gray-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gray-300 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                VC
              </div>
              <div>
                <div className="font-bold text-lg">{squad.viceCaptain.player.name}</div>
                <div className="text-sm text-emerald-200">
                  {teams.find(t => t.id === squad.viceCaptain.player.teamId)?.shortName} • {squad.viceCaptain.player.position}
                </div>
              </div>
            </div>
            <div className="text-base">
              <span className="text-gray-300 font-bold">{squad.viceCaptain.prediction.expectedPoints}</span>
              <span className="text-emerald-200"> pts (backup captain)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Display */}
      <div className="space-y-5">
        {/* Goalkeeper */}
        <div>
          <div className="text-sm font-semibold text-emerald-100 mb-3 flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">GK</span>
            Goalkeeper
          </div>
          <div className="grid grid-cols-1 gap-3">
            <PlayerCard 
              player={squad.gk} 
              position="GK" 
              isCaptain={squad.captain.player.id === squad.gk.player.id}
              isViceCaptain={squad.viceCaptain.player.id === squad.gk.player.id}
            />
          </div>
        </div>

        {/* Defenders */}
        <div>
          <div className="text-sm font-semibold text-emerald-100 mb-3 flex items-center gap-2">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">DEF</span>
            Defenders ({squad.defenders.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {squad.defenders.map((player, idx) => (
              <PlayerCard 
                key={idx} 
                player={player} 
                position="DEF"
                isCaptain={squad.captain.player.id === player.player.id}
                isViceCaptain={squad.viceCaptain.player.id === player.player.id}
              />
            ))}
          </div>
        </div>

        {/* Midfielders */}
        <div>
          <div className="text-sm font-semibold text-emerald-100 mb-3 flex items-center gap-2">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">MID</span>
            Midfielders ({squad.midfielders.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {squad.midfielders.map((player, idx) => (
              <PlayerCard 
                key={idx} 
                player={player} 
                position="MID"
                isCaptain={squad.captain.player.id === player.player.id}
                isViceCaptain={squad.viceCaptain.player.id === player.player.id}
              />
            ))}
          </div>
        </div>

        {/* Forwards */}
        <div>
          <div className="text-sm font-semibold text-emerald-100 mb-3 flex items-center gap-2">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">FWD</span>
            Forwards ({squad.forwards.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {squad.forwards.map((player, idx) => (
              <PlayerCard 
                key={idx} 
                player={player} 
                position="FWD"
                isCaptain={squad.captain.player.id === player.player.id}
                isViceCaptain={squad.viceCaptain.player.id === player.player.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Team Distribution */}
      <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-5">
        <div className="text-sm font-semibold text-emerald-100 mb-3">📊 Team Distribution</div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(squad.teamDistribution).map(([teamId, count]) => {
            const team = teams.find(t => t.id === teamId);
            if (!team) return null;
            return (
              <div key={teamId} className="bg-white/10 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getTeamBadge(teamId)}
                  <span className="text-sm font-bold">{team.shortName}</span>
                </div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-emerald-200">players</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">{squad.allPlayers.length}</div>
            <div className="text-xs text-emerald-200 mt-1">Players</div>
          </div>
          <div>
            <div className="text-3xl font-bold">£{squad.totalPrice.toFixed(1)}m</div>
            <div className="text-xs text-emerald-200 mt-1">Total Cost</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {(squad.totalPoints / squad.allPlayers.length).toFixed(1)}
            </div>
            <div className="text-xs text-emerald-200 mt-1">Avg Points</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {Math.max(...squad.allPlayers.map(p => p.prediction.expectedPoints))}
            </div>
            <div className="text-xs text-emerald-200 mt-1">Top Score</div>
          </div>
        </div>
      </div>

      {/* Constraints Info */}
      <div className="mt-6 bg-white/5 rounded-lg p-4 text-sm text-emerald-200">
        <div className="font-semibold mb-2">✓ All Constraints Applied:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div>✓ Max 3 players per team</div>
          <div>✓ Budget: £100m (Used: £{squad.totalPrice.toFixed(1)}m - {budgetPercentage.toFixed(1)}%)</div>
          <div>✓ Formation: {squad.formation.name}</div>
          <div>✓ Captain: {squad.captain.player.name} (2x points)</div>
        </div>
      </div>
    </div>
  );
}
