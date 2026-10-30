# Injury Management System

## Overview

A comprehensive injury tracking system that allows you to manage player injuries and automatically excludes injured players from all FPL predictions and recommendations.

## Current Injuries

### 🏥 João Pedro (Chelsea - FWD)
- **Status**: Injured
- **Injury Date**: 2026-03-15
- **Expected Return**: TBD
- **Impact**: Excluded from Top 20 picks, Best XI squad, and all predictions

## Features

### 1. Injury Management Interface
Located in the FPL tab, the injury management system provides:

- **Visual Injury List**: All currently injured players displayed with team colors and positions
- **Add Injury Form**: Easy-to-use form to add new injuries with:
  - Player selection dropdown
  - Injury type (optional)
  - Expected return date (optional)
  - Additional notes (optional)
- **Quick Actions**: One-click buttons to mark players as "Fit" and remove them from the injury list

### 2. Automatic Exclusion
Injured players are automatically excluded from:

- ✅ **Top 20 FPL Picks**: Won't appear in the top 20 predictions for GW9
- ✅ **Best XI Squad**: Won't be selected in the optimized squad
- ✅ **Match Predictions**: Excluded from all player performance predictions
- ✅ **Team Rankings**: Won't affect team strength calculations

### 3. Real-Time Updates
- Changes to injury status immediately reflect across all predictions
- No need to refresh or recalculate manually
- All components stay synchronized through React Context

## How to Use

### Adding an Injury

1. Navigate to the **FPL Tab**
2. Click the **"+ Add Injury"** button in the Injury Management section
3. Select the player from the dropdown
4. (Optional) Add injury type, expected return date, and notes
5. Click **"Add Injury"**

The player will immediately be:
- Added to the injury list
- Excluded from all predictions
- Removed from Best XI considerations

### Marking a Player as Fit

1. Find the injured player in the injury list
2. Click the green **"✓ Fit"** button
3. The player will be:
  - Removed from the injury list
  - Re-included in all predictions
  - Available for Best XI selection

### Viewing Injury Details

Each injured player card shows:
- 🏷️ **Player name and team** (with team color badge)
- 📅 **Injury date**: When the injury was recorded
- 🩺 **Injury type**: Type of injury (if provided)
- 📆 **Expected return**: Return date (if provided)
- 📝 **Notes**: Additional information (if provided)

## Technical Implementation

### Architecture

```
InjuryContext (React Context)
    ↓
InjuryProvider (State Management)
    ↓
├── InjuryManagement (UI Component)
├── GW9Fixtures (Uses injuredPlayerIds)
├── BestSquadDisplay (Uses injuredPlayerIds)
└── MatchPredictorFPL (Uses injuredPlayerIds)
```

### Key Components

#### 1. InjuryContext.tsx
- Manages global injury state
- Provides `addInjury`, `removeInjury`, `isPlayerInjured` methods
- Stores injury details (player ID, name, team, position, dates, notes)

#### 2. InjuryManagement.tsx
- User interface for managing injuries
- Form to add new injuries
- List of current injuries with remove buttons
- Visual feedback and validation

#### 3. Updated Prediction Functions
- `rankPlayersForMatch()`: Now accepts `injuredPlayerIds` parameter
- `calculateBestSquad()`: Now accepts `injuredPlayerIds` parameter
- All prediction logic filters out injured players before calculations

### Data Flow

1. User adds injury via InjuryManagement component
2. InjuryContext updates state with new injury
3. All components using `useInjuries()` hook re-render
4. Prediction functions receive updated `injuredPlayerIds` array
5. Injured players are filtered out before ranking/selection
6. UI displays updated predictions without injured players

## Example Usage Scenarios

### Scenario 1: Adding a New Injury
```
User Action: Mark Haaland as injured
Result:
- Haaland added to injury list
- Removed from Top 20 picks
- Excluded from Best XI squad
- Other Man City players' predictions unchanged
```

### Scenario 2: Player Returns from Injury
```
User Action: Click "✓ Fit" on João Pedro
Result:
- João Pedro removed from injury list
- Reappears in Top 20 picks (if points warrant)
- Available for Best XI selection
- Chelsea's team strength recalculated
```

### Scenario 3: Multiple Injuries
```
User Action: Add 5 injuries across different teams
Result:
- All 5 players excluded from predictions
- Best XI squad recalculated with available players
- Top 20 list updated to show next best available players
- Team strength calculations adjusted for each affected team
```

## Benefits

### For FPL Managers
- ✅ **Accurate Predictions**: Only fit players are considered
- ✅ **Time Saving**: No manual filtering of injured players
- ✅ **Flexibility**: Easy to update as injury news changes
- ✅ **Transparency**: Clear visibility of who is excluded and why

### For Decision Making
- ✅ **Realistic Squad Building**: Best XI only includes available players
- ✅ **Better Transfer Decisions**: See who's actually available
- ✅ **Accurate Rankings**: Top 20 reflects actual available talent
- ✅ **Informed Captaincy**: Captain picks won't be injured players

## Future Enhancements

### Potential Features
1. **Injury Severity Levels**: Minor/Major/Long-term classifications
2. **Return Probability**: Percentage chance of playing next GW
3. **Historical Injury Data**: Track injury patterns over time
4. **News Integration**: Auto-populate from official Premier League injury news
5. **Injury Predictions**: ML-based return date estimates
6. **Fitness Tracking**: Monitor players returning from injury (match fitness)
7. **International Duty**: Track players away on international duty
8. **Suspensions**: Add suspension tracking alongside injuries

### Advanced Features
1. **Load Management**: Track players with heavy fixture congestion
2. **Rotation Risk**: Flag players likely to be rotated
3. **Form vs Fitness**: Distinguish between poor form and fitness issues
4. **Training Ground Injuries**: Track minor injuries from training
5. **International Injury Updates**: Track injuries during international breaks

## Current Limitations

- Manual entry required (no auto-sync with official sources)
- No injury severity classification yet
- No historical injury tracking
- No suspension tracking (separate system needed)
- No international duty tracking

## Integration Points

The injury system integrates with:

1. **Prediction Engine**: Filters injured players before calculations
2. **Best XI Optimizer**: Excludes injured players from squad selection
3. **Top 20 Rankings**: Removes injured players from leaderboard
4. **Team Strength**: Adjusts team ratings based on available players
5. **Match Predictions**: Only considers fit players for performance predictions

## Data Structure

### Injury Object
```typescript
interface InjuredPlayer {
  playerId: string;        // Unique player ID
  playerName: string;      // Display name
  teamId: string;         // Team identifier
  position: string;       // GK/DEF/MID/FWD
  injuryDate: string;     // ISO date string
  expectedReturn?: string; // Optional return date
  injuryType?: string;    // Optional injury description
  notes?: string;         // Optional additional info
}
```

### Context API
```typescript
interface InjuryContextType {
  injuredPlayers: InjuredPlayer[];
  addInjury: (player: InjuredPlayer) => void;
  removeInjury: (playerId: string) => void;
  isPlayerInjured: (playerId: string) => boolean;
  getInjuredPlayer: (playerId: string) => InjuredPlayer | undefined;
}
```

## Testing Checklist

- [x] Add injury via form
- [x] Remove injury via button
- [x] Verify injured player excluded from Top 20
- [x] Verify injured player excluded from Best XI
- [x] Verify predictions update immediately
- [x] Verify multiple injuries can be tracked
- [x] Verify team colors display correctly
- [x] Verify form validation works
- [x] Verify no duplicate injuries allowed
- [x] Verify build succeeds with no errors

## Support

For issues or feature requests related to the injury management system, please refer to the main project documentation.

---

**Last Updated**: 2026-03-15  
**Current Injuries**: 1 (João Pedro)  
**System Status**: ✅ Active and Operational
