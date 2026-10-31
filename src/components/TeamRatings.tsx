import { getAllTeamStats } from '../utils/teamStats';

export function TeamRatings() {
  const allTeams = getAllTeamStats();
  
  // Calculate ratings on a scale of 1-10
  const maxAttack = Math.max(...allTeams.map(t => t.xgPerGame));
  const maxDefense = Math.max(...allTeams.map(t => t.xgAgainstPerGame));
  
  const teamsWithRatings = allTeams.map(team => {
    // Attack rating: Higher xG per game = better attack (scale 1-10)
    const attackRating = (team.xgPerGame / maxAttack) * 10;
    
    // Defense rating: Lower xG against = better defense (scale 1-10, inverted)
    const defenseRating = ((maxDefense - team.xgAgainstPerGame) / maxDefense) * 10;
    
    // Overall rating: Average of attack and defense
    const overallRating = (attackRating + defenseRating) / 2;
    
    return {
      ...team,
      attackRating: Math.round(attackRating * 10) / 10,
      defenseRating: Math.round(defenseRating * 10) / 10,
      overallRating: Math.round(overallRating * 10) / 10,
    };
  });
  
  // Sort by overall rating
  teamsWithRatings.sort((a, b) => b.overallRating - a.overallRating);
  
  // Get color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-500';
    if (rating >= 6) return 'bg-blue-500';
    if (rating >= 4) return 'bg-yellow-500';
    if (rating >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getRatingTextColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-blue-600';
    if (rating >= 4) return 'text-yellow-600';
    if (rating >= 2) return 'text-orange-600';
    return 'text-red-600';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">⚔️ Team Attack & Defense Ratings</h2>
      <p className="text-sm text-gray-600 mb-6">
        Ratings calculated from Expected Goals (xG) data. Scale: 1-10 (10 = best)
      </p>
      
      <div className="space-y-4">
        {teamsWithRatings.map((team, idx) => (
          <div key={team.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-gray-300'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-lg">{team.name}</div>
                  <div className="text-xs text-gray-500">
                    {team.played} games • {team.points} pts
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getRatingTextColor(team.overallRating)}`}>
                  {team.overallRating}
                </div>
                <div className="text-xs text-gray-500">Overall</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Attack Rating */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700">🎯 Attack</span>
                  <span className={`text-sm font-bold ${getRatingTextColor(team.attackRating)}`}>
                    {team.attackRating}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getRatingColor(team.attackRating)}`}
                    style={{ width: `${team.attackRating * 10}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {team.xgPerGame} xG/game • {team.goalsFor} goals
                </div>
              </div>
              
              {/* Defense Rating */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700">🛡️ Defense</span>
                  <span className={`text-sm font-bold ${getRatingTextColor(team.defenseRating)}`}>
                    {team.defenseRating}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getRatingColor(team.defenseRating)}`}
                    style={{ width: `${team.defenseRating * 10}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {team.xgAgainstPerGame} xGA/game • {team.goalsAgainst} conceded
                </div>
              </div>
            </div>
            
            {/* Additional Stats */}
            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100">
              <div className="text-center">
                <div className="text-xs text-gray-500">Shots/G</div>
                <div className="font-bold text-sm">{team.shotsPerGame}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">SoT/G</div>
                <div className="font-bold text-sm">{team.shotsOnTargetPerGame}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Acc%</div>
                <div className="font-bold text-sm">{team.shootingAccuracy}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Form</div>
                <div className="font-bold text-sm">{team.formPoints}/15</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-semibold text-gray-700 mb-2">Rating Scale:</div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>8-10: Elite</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span>6-7.9: Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span>4-5.9: Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span>2-3.9: Below Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span>1-1.9: Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
