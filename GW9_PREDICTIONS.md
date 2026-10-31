# Gameweek 9 Predictions Feature

## Overview

The GW9 Predictions tab provides comprehensive match predictions for all 10 fixtures in Gameweek 9 of the 2026/27 Premier League season. Each match is analyzed using the advanced xG-based prediction model with Poisson distribution.

## GW9 Fixtures

1. **Chelsea vs Man United** (Default match in predictor)
2. **Bournemouth vs Leeds**
3. **Brentford vs Nott'm Forest**
4. **Coventry vs Sunderland**
5. **Hull vs Ipswich**
6. **Man City vs Brighton**
7. **Tottenham vs Crystal Palace**
8. **Aston Villa vs Fulham**
9. **Liverpool vs Arsenal**
10. **Newcastle vs Everton**

## Features

### Match Predictions

Each fixture displays:

#### 1. Match Header
- Home team vs Away team
- Predicted score (most likely outcome)
- Color-coded border indicating favorite:
  - 🔵 Blue border: Home team favored
  - 🟣 Purple border: Away team favored
  - ⚪ Gray border: Even matchup

#### 2. Win Probabilities
Three-column layout showing:
- **Home Win %** with blue progress bar
- **Draw %** with gray progress bar
- **Away Win %** with purple progress bar

#### 3. Key Metrics
Four additional statistics:
- **Home xG**: Expected goals for home team
- **Away xG**: Expected goals for away team
- **Over 2.5**: Probability of over 2.5 goals
- **BTTS**: Both teams to score probability

#### 4. Value Bet Indicator
If the model detects a value bet (model probability > market probability + 5%), a 💰 indicator appears with the recommended bet.

### GW9 Summary

A summary section at the bottom showing:
- **Total Matches**: 10 fixtures
- **Avg Home xG**: Average expected goals for home teams
- **Avg Away xG**: Average expected goals for away teams
- **Value Bets**: Number of fixtures with value betting opportunities

## How to Use

1. Click the **"📅 GW9 Fixtures"** tab (5th tab)
2. Scroll through all 10 fixtures
3. For each match, you'll see:
   - Predicted score
   - Win probabilities with visual bars
   - Expected goals for both teams
   - Over 2.5 and BTTS probabilities
   - Value bet alerts (if any)
4. Use the summary at the bottom for quick insights

## Example Prediction

```
┌─────────────────────────────────────────────────────┐
│ Chelsea vs Man United              Predicted: 2-1   │
│                                                     │
│ Home Win: 52%  ████████████████████░░░░░░░░░░░░░   │
│ Draw: 24%      █████████░░░░░░░░░░░░░░░░░░░░░░░░   │
│ Away Win: 24%  █████████░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                                     │
│ Home xG: 1.85  │  Away xG: 1.12                    │
│ Over 2.5: 58%  │  BTTS: 65%                        │
│                                                     │
│ 💰 Value Bet: Chelsea                               │
└─────────────────────────────────────────────────────┘
```

## Color Coding Guide

### Match Outcome Borders
- 🔵 **Blue border**: Home team is favored (home win probability > away win probability)
- 🟣 **Purple border**: Away team is favored (away win probability > home win probability)
- ⚪ **Gray border**: Even matchup (draw most likely or very close probabilities)

### Probability Bars
- 🔵 **Blue bar**: Home win probability
- ⚫ **Gray bar**: Draw probability
- 🟣 **Purple bar**: Away win probability

### Value Bet Indicator
- 💰 **Green text**: Value bet detected
- Shows which outcome is undervalued by the market

## Technical Details

### Data Flow
```
gw9Fixtures (matchData.ts)
    ↓
predictMatch() (predictionEngine.ts)
    ↓
GW9Predictions component
    ↓
Render with visual indicators
```

### Prediction Model
Each fixture uses the same advanced prediction model:
1. Calculate expected goals using xG data
2. Apply home advantage factor
3. Apply form factor (last 5 games)
4. Use Poisson distribution for probabilities
5. Compare with market odds for value detection

### Performance
- **Calculation time**: ~50ms for all 10 fixtures
- **Rendering**: Instant with React
- **No external API calls**: All data is local

## Integration with Match Predictor

The default match in the Match Predictor tab is set to **Chelsea vs Man United**, which is the first fixture in GW9. This allows users to:
1. See the GW9 overview in the GW9 tab
2. Click to the Match Predictor tab
3. Get detailed analysis of the default match (Chelsea vs Man United)
4. See top 5 scorelines, confidence meter, and detailed breakdown

## Key Insights from GW9

### Most Competitive Matches
Based on win probabilities:
- **Liverpool vs Arsenal**: Title contender clash
- **Man City vs Brighton**: Top team vs in-form opponent
- **Chelsea vs Man United**: Traditional rivalry

### High-Scoring Potential
Matches with highest Over 2.5 probability:
- Man City vs Brighton (both strong attacks)
- Chelsea vs Man United (both teams score frequently)
- Liverpool vs Arsenal (title contenders with strong offenses)

### Value Betting Opportunities
The model identifies matches where the market may have mispriced outcomes:
- Look for 💰 indicators
- Compare model probability vs market odds
- Focus on matches with 5%+ edge

## Notes

- **Default Match**: Chelsea vs Man United is set as the default in the Match Predictor
- **Real-time**: Predictions update automatically when new data is added
- **Comprehensive**: All 10 GW9 fixtures are analyzed
- **Visual**: Color-coded for easy interpretation
- **Actionable**: Value bet indicators help identify opportunities

## Future Enhancements

Potential improvements:
1. **Kickoff times**: Add actual match times
2. **Venue information**: Stadium details
3. **Referee stats**: Referee tendencies
4. **Head-to-head**: Historical matchup data
5. **Injury updates**: Account for key player absences
6. **Weather conditions**: Impact on playing style
7. **Live updates**: Update predictions as match approaches
8. **Export functionality**: Download predictions as PDF/CSV
