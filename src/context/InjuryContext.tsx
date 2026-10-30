import { createContext, useContext, useState, ReactNode } from 'react';

export interface InjuredPlayer {
  playerId: string;
  playerName: string;
  teamId: string;
  position: string;
  injuryDate: string;
  expectedReturn?: string;
  injuryType?: string;
  notes?: string;
}

interface InjuryContextType {
  injuredPlayers: InjuredPlayer[];
  addInjury: (player: InjuredPlayer) => void;
  removeInjury: (playerId: string) => void;
  isPlayerInjured: (playerId: string) => boolean;
  getInjuredPlayer: (playerId: string) => InjuredPlayer | undefined;
}

const InjuryContext = createContext<InjuryContextType | undefined>(undefined);

export function InjuryProvider({ children }: { children: ReactNode }) {
  const [injuredPlayers, setInjuredPlayers] = useState<InjuredPlayer[]>([
    // Initial injury: João Pedro
    {
      playerId: 'joao_pedro',
      playerName: 'João Pedro',
      teamId: 'che',
      position: 'FWD',
      injuryDate: new Date().toISOString().split('T')[0],
      injuryType: 'Unknown',
      notes: 'Currently injured - excluded from predictions'
    }
  ]);

  const addInjury = (player: InjuredPlayer) => {
    setInjuredPlayers(prev => {
      // Prevent duplicates
      if (prev.some(p => p.playerId === player.playerId)) {
        return prev;
      }
      return [...prev, player];
    });
  };

  const removeInjury = (playerId: string) => {
    setInjuredPlayers(prev => prev.filter(p => p.playerId !== playerId));
  };

  const isPlayerInjured = (playerId: string) => {
    return injuredPlayers.some(p => p.playerId === playerId);
  };

  const getInjuredPlayer = (playerId: string) => {
    return injuredPlayers.find(p => p.playerId === playerId);
  };

  return (
    <InjuryContext.Provider value={{
      injuredPlayers,
      addInjury,
      removeInjury,
      isPlayerInjured,
      getInjuredPlayer
    }}>
      {children}
    </InjuryContext.Provider>
  );
}

export function useInjuries() {
  const context = useContext(InjuryContext);
  if (context === undefined) {
    throw new Error('useInjuries must be used within an InjuryProvider');
  }
  return context;
}
