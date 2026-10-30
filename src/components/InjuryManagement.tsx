import { useState } from 'react';
import { useInjuries } from '../context/InjuryContext';
import { fplPlayers } from '../data/fplDatabase';
import { teams } from '../data/teams';

export function InjuryManagement() {
  const { injuredPlayers, addInjury, removeInjury } = useInjuries();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [injuryType, setInjuryType] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddInjury = () => {
    if (!selectedPlayer) return;

    const player = fplPlayers.find(p => p.id === selectedPlayer);
    if (!player) return;

    addInjury({
      playerId: player.id,
      playerName: player.name,
      teamId: player.teamId,
      position: player.position,
      injuryDate: new Date().toISOString().split('T')[0],
      injuryType: injuryType || 'Unknown',
      expectedReturn: expectedReturn || undefined,
      notes: notes || undefined
    });

    // Reset form
    setSelectedPlayer('');
    setInjuryType('');
    setExpectedReturn('');
    setNotes('');
    setShowAddForm(false);
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : teamId;
  };

  const getTeamColor = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.color : '#666';
  };

  const availablePlayers = fplPlayers.filter(
    p => !injuredPlayers.some(ip => ip.playerId === p.id)
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">🏥</span>
            Injury Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track injured players and exclude them from predictions
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          {showAddForm ? '✕ Cancel' : '+ Add Injury'}
        </button>
      </div>

      {/* Add Injury Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Add New Injury</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player *
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a player...</option>
                {availablePlayers.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({getTeamName(player.teamId)} - {player.position})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Injury Type
                </label>
                <input
                  type="text"
                  value={injuryType}
                  onChange={(e) => setInjuryType(e.target.value)}
                  placeholder="e.g., Hamstring, Knee, Ankle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Return
                </label>
                <input
                  type="date"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional information about the injury..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAddInjury}
              disabled={!selectedPlayer}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Injury
            </button>
          </div>
        </div>
      )}

      {/* Injured Players List */}
      {injuredPlayers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-lg font-medium">No injured players</p>
          <p className="text-sm mt-2">All players are fit and available for selection</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">
              Currently Injured ({injuredPlayers.length})
            </h3>
            <span className="text-sm text-gray-500">
              These players are excluded from predictions
            </span>
          </div>

          {injuredPlayers.map(player => (
            <div
              key={player.playerId}
              className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: getTeamColor(player.teamId) }}
                    >
                      {player.position}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{player.playerName}</h4>
                      <p className="text-sm text-gray-600">{getTeamName(player.teamId)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">Injury Date:</span>
                      <span className="ml-2 font-medium text-gray-700">
                        {new Date(player.injuryDate).toLocaleDateString()}
                      </span>
                    </div>
                    {player.injuryType && (
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 font-medium text-gray-700">
                          {player.injuryType}
                        </span>
                      </div>
                    )}
                    {player.expectedReturn && (
                      <div>
                        <span className="text-gray-500">Expected Return:</span>
                        <span className="ml-2 font-medium text-gray-700">
                          {new Date(player.expectedReturn).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {player.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      {player.notes}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeInjury(player.playerId)}
                  className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                  title="Mark as fit"
                >
                  <span>✓</span>
                  <span className="hidden md:inline">Fit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Injured players are automatically excluded from Top 20 picks</li>
              <li>They won't appear in Best XI squad recommendations</li>
              <li>Click the green "Fit" button when a player returns</li>
              <li>Add new injuries using the "+ Add Injury" button</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
