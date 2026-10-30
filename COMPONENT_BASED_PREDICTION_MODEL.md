# Component-Based Prediction Model - Implementation Guide

## Overview

The FPL prediction system has been upgraded to a **component-based architecture** following FPL best practices. Instead of predicting total points directly, we now predict individual components (minutes, goals, assists, clean sheets, bonus) and then calculate FPL points using official scoring rules.

## Architecture

### Core Philosophy
```
Player Performance → Components → FPL Points
     ↓                ↓              ↓
  Features      Predictions     Summation
```

### Key Components Predicted
1. **Expected Minutes** - Most critical factor
2. **Start Probability** - Likelihood of playing
3. **Expected Goals (xG)** - Attacking output
4. **Expected Assists (xA)** - Creative output
5. **Expected Clean Sheets** - Defensive output (DEF/GK)
6. **Expected Bonus** - BPS-based bonus points
7. **Expected Saves** - Goalkeeper saves
8. **Expected Cards** - Disciplinary risk

## Implementation Details

### 1. Component Prediction Engine (`src/utils/componentPredictionEngine.ts`)

#### Key Functions

**`predictStartProbability(player, isKeyPlayer)`**
- Base probability: 70%
- Adjustments based on:
  - FPL points (high performers more likely to start)
  - Position (GKs rarely rotated)
  - Price (premium players more likely starters)
- Returns: 0.3 to 0.95

**`predictMinutes(player, startProbability)`**
- If start probability < 50%: 0 minutes (benched)
- Base: 90 × start probability
- Adjustments:
  - GKs: 90 or 0 (no partial games)
  - Key players: +5 minutes
  - Low performers: -15 minutes
- Returns: 0-90 minutes

**`predictGoals(player, opponent, isHome, formFactor)`**
- Base xG by position:
  - FWD: 0.4 per 90
  - MID: 0.15 per 90
  - DEF: 0.05 per 90
- Adjustments:
  - Team attacking strength
  - Opponent defensive weakness
  - Home/away factor (±15%)
  - Form factor
  - Player quality (FPL points, price)
- Returns: Expected goals (0.0 - 1.5+)

**`predictAssists(player, opponent, isHome, formFactor)`**
- Base xA by position:
  - MID: 0.25 per 90
  - FWD: 0.15 per 90
  - DEF: 0.1 per 90
- Similar adjustments as goals
- Returns: Expected assists (0.0 - 1.0+)

**`predictCleanSheet(player, opponent, isHome)`**
- Only for DEF/GK
- Base probability: 30%
- Adjustments:
  - Team defensive strength
  - Opponent attacking weakness
  - Home/away factor
  - Historical clean sheet rates (from pattern analysis)
- Returns: 0.0 - 0.8

**`predictBonus(player, expectedMinutes)`**
- Only if minutes ≥ 60
- Based on FPL points (proxy for influence)
- Position adjustments (DEF/MID slightly higher)
- Returns: 0.0 - 3.0

**`predictSaves(player, opponent)`**
- Only for GK
- Based on opponent's attacking strength
- Average save rate: 70%
- Returns: Expected saves (0 - 10+)

### 2. FPL Points Calculation

After predicting components, we calculate FPL points using **official scoring rules**:

```typescript
// Appearance points
if (expectedMinutes >= 60) expectedPoints += 2;
else if (expectedMinutes > 0) expectedPoints += 1;

// Goals (position-dependent)
if (GK) expectedPoints += expectedGoals * 10;
if (DEF) expectedPoints += expectedGoals * 6;
if (MID) expectedPoints += expectedGoals * 5;
if (FWD) expectedPoints += expectedGoals * 4;

// Assists (3 points each)
expectedPoints += expectedAssists * 3;

// Clean sheets
if (GK || DEF) expectedPoints += expectedCleanSheet * 4;
if (MID) expectedPoints += expectedCleanSheet * 1;

// Saves (GK only, 1pt per 3 saves)
if (GK) expectedPoints += (expectedSaves / 3);

// Bonus
expectedPoints += expectedBonus;

// Cards (negative)
expectedPoints -= expectedCards;
```

### 3. Integration with Injury System

The prediction engine is fully integrated with the injury management system:

```typescript
// In squadOptimizer.ts
export function calculateBestSquad(injuredPlayerIds: string[] = []): BestSquadResult {
  const allPlayers = getAllGW9Players(injuredPlayerIds);
  // ... rest of optimization
}

// In componentPredictionEngine.ts
export function getFixturePredictions(
  homeTeamId: string,
  awayTeamId: string,
  injuredPlayerIds: string[] = []
): PlayerPrediction[] {
  const homePlayers = fplPlayers.filter(
    p => p.teamId === homeTeamId && !injuredPlayerIds.includes(p.id)
  );
  // ... predictions for available players only
}
```

**Reactive Updates:**
- When injury status changes via `InjuryContext`
- All components using `useInjuries()` hook re-render
- Predictions automatically recalculate
- Best XI updates immediately
- Top 20 list updates immediately

## Data Sources Used

### What We Have ✅
1. **GW1-8 Match Results** - Goals, assists, clean sheets
2. **FPL Player Database** - Points, prices, positions
3. **Team Statistics** - Goals scored/conceded, home/away splits
4. **Pattern Analysis** - Clean sheet rates, high-scoring games, draw-prone teams
5. **Injury Data** - Current injury status via context

### What We Don't Have (But Could Add) ⚠️
1. **xG/xA Data** - Would improve goal/assist predictions
2. **Minutes Data** - Currently estimated, could use actual minutes
3. **Set-piece Takers** - Would improve bonus predictions
4. **BPS Data** - Would improve bonus predictions
5. **Betting Odds** - Would improve fixture difficulty
6. **Multiple Seasons** - Currently only GW1-8 data

## Prediction Factors by Position

### Forwards (FWD)
- **Most Important:** Expected minutes, xG, opponent defense
- **Key Factors:**
  - Start probability (25% weight)
  - Goal threat (20% weight)
  - Assist potential (15% weight)
  - Team attack strength (15% weight)
  - Home/away (10% weight)
  - Starter status (5% weight)

### Midfielders (MID)
- **Most Important:** Expected minutes, xG, xA, opponent defense
- **Key Factors:**
  - Start probability (25% weight)
  - Goal threat (20% weight)
  - Assist potential (15% weight)
  - Team attack strength (15% weight)
  - Home/away (10% weight)
  - Starter status (10% weight)

### Defenders (DEF)
- **Most Important:** Expected minutes, clean sheet probability, opponent attack
- **Key Factors:**
  - Start probability (25% weight)
  - Clean sheet probability (25% weight)
  - Team defense strength (20% weight)
  - Opponent attack weakness (15% weight)
  - Attacking threat (10% weight)
  - Home/away (5% weight)

### Goalkeepers (GK)
- **Most Important:** Expected minutes, clean sheet probability, saves
- **Key Factors:**
  - Start probability (30% weight)
  - Clean sheet probability (30% weight)
  - Team defense strength (20% weight)
  - Opponent attack weakness (15% weight)
  - Home/away (5% weight)

## Best XI Optimization

### Constraints
1. **Budget:** £100m maximum
2. **Squad Size:** 11 players
3. **Formation:** One of 7 valid formations
   - 3-5-2, 3-4-3, 4-4-2, 4-3-3, 4-5-1, 5-4-1, 5-3-2
4. **Team Limit:** Max 3 players per team
5. **Position Requirements:**
   - 1 GK
   - 3-5 DEF
   - 3-5 MID
   - 1-3 FWD

### Optimization Strategy
1. **Multi-Strategy Approach:**
   - Points-first: Maximize expected points
   - Value-first: Maximize points per £m
   - Balanced: 60% points + 40% value

2. **Formation Testing:**
   - Try all 7 formations
   - For each formation, try all 3 strategies
   - Total: 21 combinations tested

3. **Selection Algorithm:**
   - Sort players by composite score
   - Select position by position (GK → DEF → MID → FWD)
   - Check constraints at each step
   - Backtrack if constraints violated

4. **Captain Selection:**
   - Captain: Highest expected points (2x multiplier)
   - Vice-captain: Second-highest expected points

### Start Probability Filter
Players with start probability < 60% are excluded from Best XI consideration to ensure we're picking players who will actually play.

## Injury System Integration

### Context-Based Architecture
```typescript
// InjuryContext.tsx
interface InjuryContextType {
  injuredPlayers: InjuredPlayer[];
  addInjury: (player: InjuredPlayer) => void;
  removeInjury: (playerId: string) => void;
  isPlayerInjured: (playerId: string) => boolean;
}

// Usage in components
const { injuredPlayers } = useInjuries();
const injuredPlayerIds = injuredPlayers.map(p => p.playerId);
const squad = calculateBestSquad(injuredPlayerIds);
```

### Reactive Flow
1. User adds/removes injury via UI
2. `InjuryContext` state updates
3. All components using `useInjuries()` re-render
4. Predictions recalculate with updated injury list
5. Best XI updates automatically
6. Top 20 list updates automatically

### Benefits
- ✅ Single source of truth for injury data
- ✅ Automatic propagation across all components
- ✅ No manual refresh needed
- ✅ Type-safe with TypeScript
- ✅ Easy to add/remove injuries

## Performance Metrics

### Prediction Accuracy Indicators
1. **Confidence Score:** 0.0 - 1.0
   - Based on: start probability, player quality, price
   - Higher = more reliable prediction

2. **Component Breakdown:**
   - Shows individual component predictions
   - Helps understand what drives the total points
   - Useful for debugging and improvement

3. **Factor Analysis:**
   - Each prediction includes factor weights
   - Shows what influenced the prediction
   - Transparent decision-making

## Future Enhancements

### High Priority
1. **xG/xA Integration**
   - Import from Understat or similar
   - Would significantly improve goal/assist predictions
   
2. **Minutes Data**
   - Use actual minutes from previous games
   - Better start probability predictions

3. **Set-piece Takers**
   - Track penalty/corner/free-kick takers
   - Improve bonus predictions

### Medium Priority
4. **BPS Data**
   - Import official BPS scores
   - Better bonus predictions

5. **Fixture Difficulty Ratings**
   - Use betting odds or xG-based FDR
   - Better opponent strength assessment

6. **Multi-Season Data**
   - Train on 3-4 seasons of data
   - Better baseline predictions

### Low Priority
7. **Teammate Cannibalization**
   - Model how teammates affect each other's output
   - More realistic predictions for stacked teams

8. **Rotation Risk Modeling**
   - Track fixture congestion
   - Better minutes predictions for busy periods

## Best Practices Applied

✅ **Component-based prediction** - Predict building blocks, not total points  
✅ **Position-specific models** - Different factors for each position  
✅ **Minutes-first approach** - Most important factor modeled carefully  
✅ **Official scoring rules** - Accurate FPL points calculation  
✅ **Constraint satisfaction** - All FPL rules enforced  
✅ **Multi-strategy optimization** - Test multiple approaches  
✅ **Injury integration** - Reactive to injury updates  
✅ **Transparent factors** - Show what drives predictions  
✅ **Confidence scoring** - Indicate prediction reliability  
✅ **Type safety** - Full TypeScript implementation  

## Conclusion

The component-based prediction model provides:
- **More accurate predictions** by modeling individual components
- **Better interpretability** by showing what drives predictions
- **Flexible architecture** that can incorporate new data sources
- **Reactive injury management** that updates all predictions automatically
- **Robust optimization** that respects all FPL constraints

This implementation follows FPL best practices and provides a solid foundation for further improvements as more data becomes available.
