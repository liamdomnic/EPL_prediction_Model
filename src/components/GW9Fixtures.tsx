import { useState } from 'react';
import { upcomingFixtures } from '../data/teams';
import { getFixturePredictions } from '../utils/componentPredictionEngine';
import { fplPlayers } from '../data/fplDatabase';
import { teams } from '../data/teams';
import { BestSquadDisplay } from './BestSquadDisplay';
import { useInjuries } from '../context/InjuryContext';

export function GW9Fixtures() {
  const [selectedFixture, setSelectedFixture] = useState<number | null>(null);
  const { injuredPlayers } = useInjuries();
  const injuredPlayerIds = injuredPlayers.map(p => p.playerId);

  // Get all players from all GW9 fixtures and rank them (excluding injured players)
  const allGW9Players = upcomingFixtures.flatMap(fixture => {
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
    }).filter((p): p is NonNullable<typeof p> => p !== null);
  });

  // Sort by predicted points and get top 20
  const top20Players = allGW9Players
    .sort((a, b) => b.prediction.expectedPoints - a.prediction.expectedPoints)
    .slice(0, 20);

  return (
    <div className="space-y-8">
      {/* Best XI Squad */}
      <BestSquadDisplay />

      {/* Top 20 FPL Picks */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">🏆</span>
              Top 20 FPL Picks for GW9
            </h2>
            <p className="text-purple-100 text-sm mt-2">
              Highest predicted FPL points across all fixtures
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">GW9</div>
            <div className="text-purple-200 text-sm mt-1">10 Fixtures</div>
          </div>
        </div>

        {/* Top 20 Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {top20Players.map((player, idx) => {
            const team = teams.find(t => t.id === player.player.teamId);
            const rankColors = [
              'bg-yellow-400 text-yellow-900', // 1st
              'bg-gray-300 text-gray-800',     // 2nd
              'bg-orange-400 text-orange-900', // 3rd
            ];
            
            return (
              <div
                key={player.player.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => {
                  const fixtureIdx = upcomingFixtures.findIndex(f => 
                    (f.homeTeam === player.player.teamId || f.awayTeam === player.player.teamId)
                  );
                  if (fixtureIdx >= 0) setSelectedFixture(fixtureIdx);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx < 3 ? rankColors[idx] : 'bg-white/20 text-white'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-base">{player.player.name}</div>
                      <div className="text-xs text-purple-200">
                        {team?.shortName} • {player.player.position}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{player.prediction.expectedPoints}</div>
                    <div className="text-xs text-purple-200">pts</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-purple-200">
                    <span>{player.fixture}</span>
                    <span className="font-semibold text-white">£{player.player.price}m</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {player.player.position === 'FWD' || player.player.position === 'MID' ? (
                      <>
                        <span className="text-green-300">⚽ {player.prediction.expectedGoals.toFixed(2)} xG</span>
                        <span className="text-blue-300">🎯 {player.prediction.expectedAssists.toFixed(2)} xA</span>
                      </>
                    ) : (
                      <span className="text-purple-300">🧤 {Math.round(player.prediction.expectedCleanSheet * 100)}% CS</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-purple-200 pt-2 border-t border-white/10">
                    <span>⏱️ {player.prediction.expectedMinutes} min</span>
                    <span>📊 {Math.round(player.prediction.startProbability * 100)}% start</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GW9 Fixtures List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5 text-white">
          <h3 className="text-2xl font-bold">📅 Gameweek 9 Fixtures</h3>
          <p className="text-blue-100 text-sm mt-1">Click any fixture to see detailed predictions</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {upcomingFixtures.map((fixture, idx) => {
            const homeTeam = teams.find(t => t.id === fixture.homeTeam);
            const awayTeam = teams.find(t => t.id === fixture.awayTeam);
            const predictions = getFixturePredictions(fixture.homeTeam, fixture.awayTeam, injuredPlayerIds);
            const ranked = predictions.map(prediction => {
              const player = fplPlayers.find(p => p.id === prediction.playerId);
              if (!player) return null;
              const isHome = player.teamId === fixture.homeTeam;
              return {
                player,
                prediction,
                isHome,
                fixture: `${homeTeam?.shortName} vs ${awayTeam?.shortName}`
              };
            }).filter((p): p is NonNullable<typeof p> => p !== null);
            const topPlayer = ranked[0];
            
            return (
              <div
                key={idx}
                className={`p-5 hover:bg-gray-50 transition-all cursor-pointer ${
                  selectedFixture === idx ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => setSelectedFixture(selectedFixture === idx ? null : idx)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2"
                        style={{ 
                          backgroundColor: homeTeam?.color, 
                          color: homeTeam?.textColor,
                          borderColor: 'white'
                        }}
                      >
                        {homeTeam?.shortName.slice(0, 3)}
                      </div>
                      <span className="font-semibold text-base">{homeTeam?.name}</span>
                    </div>
                    <span className="text-gray-400 text-lg font-bold">vs</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-base">{awayTeam?.name}</span>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2"
                        style={{ 
                          backgroundColor: awayTeam?.color, 
                          color: awayTeam?.textColor,
                          borderColor: 'white'
                        }}
                      >
                        {awayTeam?.shortName.slice(0, 3)}
                      </div>
                    </div>
                  </div>
                  
                  {topPlayer && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Top Pick</div>
                      <div className="font-bold text-base text-green-600">
                        {topPlayer.player.name} ({topPlayer.prediction.expectedPoints}pts)
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedFixture === idx && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ranked.slice(0, 6).map((player, pIdx) => (
                        <div
                          key={player.player.id}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-400 w-6">{pIdx + 1}</span>
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ 
                                backgroundColor: teams.find(t => t.id === player.player.teamId)?.color,
                                color: teams.find(t => t.id === player.player.teamId)?.textColor
                              }}
                            >
                              {player.player.position[0]}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{player.player.name}</div>
                              <div className="text-xs text-gray-500">
                                {teams.find(t => t.id === player.player.teamId)?.shortName} • £{player.player.price}m
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-base text-green-600">
                              {player.prediction.expectedPoints}
                            </div>
                            <div className="text-xs text-gray-500">pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
