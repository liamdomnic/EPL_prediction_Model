import { useState } from 'react';
import { getFixturePredictions } from '../utils/componentPredictionEngine';
import { fplPlayers } from '../data/fplDatabase';
import { teams } from '../data/teams';
import { useInjuries } from '../context/InjuryContext';

export function MatchPredictorFPL() {
  const [homeTeam, setHomeTeam] = useState(teams[0].id);
  const [awayTeam, setAwayTeam] = useState(teams[1].id);
  const { injuredPlayers } = useInjuries();
  const injuredPlayerIds = injuredPlayers.map(p => p.playerId);

  const predictions = getFixturePredictions(homeTeam, awayTeam, injuredPlayerIds);
  const homeTeamData = teams.find(t => t.id === homeTeam);
  const awayTeamData = teams.find(t => t.id === awayTeam);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-6 py-5">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🏟️</span>
          Match Player Predictor
        </h2>
        <p className="text-emerald-200 text-sm mt-1">
          Select two teams to rank players by predicted FPL points
        </p>
      </div>

      {/* Team Selection */}
      <div className="p-6 bg-gray-50 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">🏠 Home Team</label>
            <select
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-sm font-medium"
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold border-4 border-white shadow-lg"
                style={{ backgroundColor: homeTeamData?.color, color: homeTeamData?.textColor }}
              >
                {homeTeamData?.shortName.slice(0, 3)}
              </div>
              <span className="text-3xl font-bold text-gray-400">VS</span>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold border-4 border-white shadow-lg"
                style={{ backgroundColor: awayTeamData?.color, color: awayTeamData?.textColor }}
              >
                {awayTeamData?.shortName.slice(0, 3)}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">✈️ Away Team</label>
            <select
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-sm font-medium"
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ranked Players */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {predictions.slice(0, 20).map((prediction, idx) => {
            const player = fplPlayers.find(p => p.id === prediction.playerId);
            if (!player) return null;
            
            const team = teams.find(t => t.id === player.teamId);
            const isHome = player.teamId === homeTeam;
            const isDefOrGk = player.position === 'GK' || player.position === 'DEF';

            return (
              <div
                key={player.id}
                className={`rounded-lg border transition-all ${
                  idx < 5 ? 'border-emerald-200 bg-emerald-50/50' :
                  idx < 10 ? 'border-blue-200 bg-blue-50/30' :
                  'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    idx < 3 ? 'bg-yellow-400 text-yellow-900' :
                    idx < 5 ? 'bg-emerald-500 text-white' :
                    idx < 10 ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>

                  {/* Team Badge */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md"
                    style={{ backgroundColor: team?.color, color: team?.textColor }}
                  >
                    {team?.shortName.slice(0, 3)}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-800 text-base">{player.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        player.position === 'GK' ? 'bg-yellow-400 text-yellow-900' :
                        player.position === 'DEF' ? 'bg-green-500 text-white' :
                        player.position === 'MID' ? 'bg-blue-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {player.position}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        isHome ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {isHome ? 'HOME' : 'AWAY'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span className="font-medium">FPL: {player.points}pts</span>
                      <span>£{player.price}m</span>
                      <span className="text-gray-400">Confidence: {Math.round(prediction.confidence * 100)}%</span>
                    </div>
                  </div>

                  {/* Predicted Points */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-700">{prediction.expectedPoints}</div>
                    <div className="text-xs text-gray-500">pred. pts</div>
                  </div>
                </div>

                {/* Component Breakdown */}
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-gray-500 mb-1">Minutes</div>
                      <div className="font-bold text-gray-800">{prediction.expectedMinutes} min</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-gray-500 mb-1">Start Prob</div>
                      <div className="font-bold text-gray-800">{Math.round(prediction.startProbability * 100)}%</div>
                    </div>
                    {isDefOrGk ? (
                      <div className="bg-gray-50 rounded p-2">
                        <div className="text-gray-500 mb-1">Clean Sheet</div>
                        <div className="font-bold text-purple-600">{Math.round(prediction.expectedCleanSheet * 100)}%</div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-gray-50 rounded p-2">
                          <div className="text-gray-500 mb-1">xG</div>
                          <div className="font-bold text-green-600">{prediction.expectedGoals.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <div className="text-gray-500 mb-1">xA</div>
                          <div className="font-bold text-blue-600">{prediction.expectedAssists.toFixed(2)}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 bg-gray-50 border-t text-xs text-gray-500 flex flex-wrap gap-4">
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-yellow-400 rounded-full"></span> Top 3</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Top 5</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Top 10</span>
        <span className="ml-auto">Component-based predictions • Injury-aware • Budget-optimized</span>
      </div>
    </div>
  );
}

export function TeamComparison() {
  const [team1, setTeam1] = useState(teams[0].id);
  const [team2, setTeam2] = useState(teams[1].id);

  const team1Data = teams.find(t => t.id === team1);
  const team2Data = teams.find(t => t.id === team2);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white px-6 py-5">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">⚔️</span>
          Team vs Team
        </h2>
        <p className="text-indigo-200 text-sm mt-1">Compare squad strength and top performers</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-sm font-medium"
          >
            {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
          <select
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-sm font-medium"
          >
            {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md"
                style={{ backgroundColor: team1Data?.color, color: team1Data?.textColor }}
              >
                {team1Data?.shortName.slice(0, 3)}
              </div>
              <h3 className="font-bold text-gray-700 text-lg">{team1Data?.name}</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p>Points: {team1Data?.points}</p>
              <p>Goals For: {team1Data?.goalsFor}</p>
              <p>Goals Against: {team1Data?.goalsAgainst}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md"
                style={{ backgroundColor: team2Data?.color, color: team2Data?.textColor }}
              >
                {team2Data?.shortName.slice(0, 3)}
              </div>
              <h3 className="font-bold text-gray-700 text-lg">{team2Data?.name}</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p>Points: {team2Data?.points}</p>
              <p>Goals For: {team2Data?.goalsFor}</p>
              <p>Goals Against: {team2Data?.goalsAgainst}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopPerformersByTeam() {
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const teamData = teams.find(t => t.id === selectedTeam);
  const teamPlayers = fplPlayers.filter(p => p.teamId === selectedTeam).sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-5">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🌟</span>
          Top Performers by Team
        </h2>
        <p className="text-amber-200 text-sm mt-1">Best FPL assets from each squad</p>
      </div>
      <div className="p-6">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:outline-none text-gray-800 font-medium mb-6"
        >
          {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold border-4 border-white shadow-lg"
            style={{ backgroundColor: teamData?.color, color: teamData?.textColor }}
          >
            {teamData?.shortName.slice(0, 3)}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-xl">{teamData?.name}</h3>
            <div className="flex gap-4 text-sm text-gray-500 mt-1">
              <span>Pts: {teamData?.points}</span>
              <span>GF: {teamData?.goalsFor}</span>
              <span>GA: {teamData?.goalsAgainst}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {teamPlayers.slice(0, 12).map((player, idx) => (
            <div key={player.id} className={`flex items-center gap-4 py-3 px-4 rounded-lg ${
              idx < 3 ? 'bg-amber-50 border-2 border-amber-200' : 'bg-gray-50'
            }`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                idx < 3 ? 'bg-amber-400 text-amber-900' : 'bg-gray-200 text-gray-600'
              }`}>{idx + 1}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                player.position === 'GK' ? 'bg-yellow-400 text-yellow-900' :
                player.position === 'DEF' ? 'bg-green-500 text-white' :
                player.position === 'MID' ? 'bg-blue-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {player.position}
              </span>
              <span className="flex-1 font-medium text-gray-800">{player.name}</span>
              <div className="text-right">
                <span className="font-bold text-amber-700 text-lg">{player.points}pts</span>
                <span className="text-xs text-gray-400 ml-2">£{player.price}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
