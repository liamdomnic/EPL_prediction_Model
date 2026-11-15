# EPL Match Predictor - Advanced xG Model

## 🎯 Overview

A sophisticated football match prediction system for the English Premier League 2026/27 season, built on **Expected Goals (xG)** data and advanced statistical modeling. The system analyzes all 80 matches from Gameweeks 1-8 to generate accurate predictions using multiple data sources.

## 📊 Data Sources

### Primary Data: football-data.co.uk
The model uses comprehensive match data including:

#### Match Results
- **Full-time results**: Goals, results (H/D/A)
- **Half-time results**: HT goals and results
- **Referee assignments**: For each match

#### Expected Goals (xG)
- **Home xG (HxG)**: Expected goals for home team
- **Away xG (AxG)**: Expected goals for away team
- *xG is the most predictive metric for future performance*

#### Shooting Statistics
- **Shots (HS/AS)**: Total shots taken
- **Shots on Target (HST/AST)**: Shots that tested the goalkeeper
- **Shooting accuracy**: Calculated from shots vs shots on target

#### Attacking Metrics
- **Corners (HC/AC)**: Indicator of attacking pressure
- **Fouls won (HF/AF)**: Attacking intent

#### Defensive Metrics
- **Fouls committed**: Defensive discipline
- **Yellow cards (HY/AY)**: Aggression/discipline
- **Red cards (HR/AR)**: Serious disciplinary issues

#### Betting Market Data
- **Average odds**: Home win, Draw, Away win
- **Over/Under 2.5 goals odds**
- **Asian Handicap lines**
- *Used for market comparison and value bet detection*

## 🧮 Prediction Model

### 1. Expected Goals (xG) Model

The core prediction uses **Expected Goals** rather than actual goals:

```typescript
// Home team expected goals
homeXG = team.xgPerGame * 
         (2 - opponent.defenseStrength) * 
         team.homeAdvantage * 
         formFactor * 
         0.7 + (team.shotsOnTargetPerGame * 0.3) * 0.3
```

**Factors:**
- **Team xG per game**: Base attacking strength
- **Opponent defense weakness**: How many goals opponent concedes
- **Home advantage**: Historical home performance boost
- **Form factor**: Recent 5-game performance (0.85-1.15 multiplier)
- **Shooting stats**: Shots on target as secondary indicator

### 2. Poisson Distribution

Once expected goals are calculated, we use **Poisson distribution** to calculate the probability of every possible scoreline:

```typescript
P(X = k) = (λ^k * e^(-λ)) / k!

Where:
- λ = expected goals
- k = actual goals scored
- P = probability of that exact scoreline
```

We calculate probabilities for all scorelines from 0-0 to 7-7, then aggregate:
- **Home win**: Sum of all scorelines where home > away
- **Draw**: Sum of all scorelines where home = away
- **Away win**: Sum of all scorelines where home < away
- **Over 2.5**: Sum of all scorelines where total goals > 2.5
- **BTTS**: Sum of all scorelines where both teams score > 0

### 3. Form Factor Calculation

Recent form is weighted heavily (last 5 games):

```typescript
formFactor = 0.85 + (recentPoints / maxPoints) * 0.3

Where:
- Win = 3 points
- Draw = 1 point
- Loss = 0 points
- Range: 0.85 (poor form) to 1.15 (excellent form)
```

### 4. Home Advantage

Calculated from actual home vs away performance:

```typescript
homeAdvantage = homeGoalsPerGame / awayGoalsPerGame
```

Typical EPL home advantage is 1.2-1.4x.

### 5. Market Comparison & Value Bets

The model compares its predictions to betting market odds:

```typescript
// Convert odds to probabilities
homeProb = 1 / homeOdds
drawProb = 1 / drawOdds
awayProb = 1 / awayOdds

// Remove overround (bookmaker margin)
total = homeProb + drawProb + awayProb
homeProb /= total
drawProb /= total
awayProb /= total

// Detect value if model probability > market probability + 5%
isValueBet = (modelProb - marketProb) >= 0.05
```

## 📈 Team Statistics Calculated

For each team, the model calculates:

### Basic Stats
- Played, Wins, Draws, Losses
- Goals For, Goals Against
- Points

### Advanced Metrics
- **xG For**: Total expected goals scored
- **xG Against**: Total expected goals conceded
- **xG per game**: Attacking efficiency
- **xGA per game**: Defensive solidity

### Shooting Stats
- **Shots per game**: Attacking volume
- **Shots on target per game**: Quality of chances
- **Shooting accuracy**: SoT / Total shots

### Discipline
- **Yellow cards**: Total bookings
- **Red cards**: Total send-offs
- **Fouls per game**: Aggression level

### Set Pieces
- **Corners per game**: Attacking pressure indicator

### Form
- **Last 5 games**: W/D/L sequence
- **Form points**: Points from last 5 games (max 15)

### Market Data
- **Market win probability**: Implied from betting odds
- **Market draw probability**: Implied from betting odds
- **Market loss probability**: Implied from betting odds

## 🎯 Features

### 1. Match Predictor
- Select any two teams
- Get comprehensive prediction including:
  - Expected goals for both teams
  - Win/Draw/Loss probabilities
  - Over/Under 2.5 goals probability
  - Both Teams to Score probability
  - Top 5 most likely scorelines
  - Confidence meter
  - Value bet detection

### 2. League Table
- Full league standings
- Points, goals, goal difference
- **xG and xGA columns** (unique feature!)
- Recent form visualization
- Top 4 highlighted (blue)
- Relegation zone highlighted (red)

### 3. Team Statistics
- **Top 5 Attacking Teams**: Ranked by xG per game
- **Top 5 Defenses**: Ranked by xG against per game
- **Top 5 Shooting Teams**: Ranked by shots on target per game
- Visual cards with medals (gold/silver/bronze)

## 🏗️ Technical Architecture

### File Structure
```
src/
├── data/
│   └── matchData.ts          # All 80 matches with comprehensive stats
├── utils/
│   ├── teamStats.ts          # Team statistics calculator
│   └── predictionEngine.ts   # Poisson-based prediction model
└── App.tsx                   # Main UI with 3 tabs
```

### Key Components

#### `matchData.ts`
- Stores all 80 matches from GW1-8
- Includes xG, shots, corners, cards, betting odds
- 20 teams, 10 matches per gameweek

#### `teamStats.ts`
- `calculateTeamStats()`: Comprehensive team analysis
- `getLeagueTable()`: Sorted by points, then GD
- `getTopXgTeams()`: Best attacking teams
- `getBestDefenses()`: Best defensive teams
- `getBestShootingTeams()`: Most accurate shooters

#### `predictionEngine.ts`
- `predictMatch()`: Main prediction function
- `predictExpectedGoals()`: xG-based goal prediction
- `calculateProbabilities()`: Poisson distribution
- `detectValueBet()`: Market comparison

## 📊 Model Accuracy Factors

### Strengths
✅ **xG-based**: Uses Expected Goals, not just actual goals  
✅ **Comprehensive data**: 80 matches with 15+ metrics per match  
✅ **Form-weighted**: Recent performance heavily weighted  
✅ **Home advantage**: Calculated from actual data  
✅ **Market comparison**: Identifies value bets  
✅ **Poisson distribution**: Statistically sound methodology  
✅ **Multiple factors**: xG, shots, form, home advantage combined  

### Limitations
⚠️ **Small sample size**: Only 8 games per team  
⚠️ **No player data**: Team-level only, no individual player stats  
⚠️ **No injuries**: Doesn't account for key player absences  
⚠️ **No head-to-head**: Historical matchups not considered  
⚠️ **No tactical analysis**: Playing styles not factored  

## 🚀 Usage

### Match Prediction
1. Go to "Match Predictor" tab
2. Select home team from dropdown
3. Select away team from dropdown
4. Click "🎯 Predict Match"
5. View comprehensive prediction with:
   - Expected goals
   - Win probabilities
   - Top scorelines
   - Value bet alerts

### League Table
1. Go to "League Table" tab
2. View full standings with xG columns
3. See recent form with color-coded badges
4. Identify top 4 and relegation zone

### Team Statistics
1. Go to "Team Statistics" tab
2. View top 5 attacking teams (by xG)
3. View top 5 defenses (by xGA)
4. View top 5 shooting teams (by SoT)

## 📈 Example Predictions

### Example 1: Arsenal vs Chelsea
```
Arsenal xG: 2.15
Chelsea xG: 0.85

Arsenal Win: 68%
Draw: 20%
Chelsea Win: 12%

Most Likely Score: 2-0 (18% probability)
Over 2.5: 58%
BTTS: 45%

Value Bet: Arsenal win (model 68% vs market 62%)
```

### Example 2: Man City vs Liverpool
```
Man City xG: 1.95
Liverpool xG: 1.75

Man City Win: 42%
Draw: 28%
Liverpool Win: 30%

Most Likely Score: 2-1 (15% probability)
Over 2.5: 65%
BTTS: 72%

Value Bet: None (market efficient)
```

## 🔮 Future Enhancements

Potential improvements:
1. **Player-level data**: Individual player xG, assists, etc.
2. **Injury tracking**: Account for key player absences
3. **Head-to-head history**: Historical matchup data
4. **Tactical analysis**: Playing style matchups
5. **Weather conditions**: Impact on playing style
6. **Referee stats**: Some refs give more cards/penalties
7. **More gameweeks**: Larger sample size as season progresses
8. **Machine learning**: Train on historical data
9. **Live updates**: In-play predictions during matches
10. **API integration**: Real-time odds from multiple bookmakers

## 📝 Technical Details

### Build Information
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build tool**: Vite
- **Bundle size**: ~185 KB (gzipped: ~55 KB)
- **Build time**: ~2.3 seconds

### Performance
- **Prediction calculation**: <10ms
- **Team stats calculation**: <5ms per team
- **UI rendering**: Instant (React virtual DOM)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript
- CSS Grid and Flexbox

## 📚 Data Source

All data from **football-data.co.uk**:
- Comprehensive match statistics
- Expected Goals (xG) from Opta
- Betting odds from multiple bookmakers
- Updated after each match

## ⚖️ Disclaimer

This is a **statistical model for educational and entertainment purposes**. Football matches are inherently unpredictable, and no model can guarantee accurate predictions. 

**Do not use for:**
- Gambling decisions
- Financial betting
- Professional advice

**Use for:**
- Learning about statistical modeling
- Understanding football analytics
- Educational purposes
- Entertainment

## 🎓 Model Methodology Summary

1. **Data Collection**: 80 matches with 15+ metrics each
2. **Team Stats**: Calculate comprehensive statistics for all 20 teams
3. **xG Prediction**: Use Expected Goals as primary metric
4. **Factor Adjustment**: Apply form, home advantage, opponent strength
5. **Poisson Distribution**: Calculate probability of all scorelines
6. **Market Comparison**: Compare to betting odds for value detection
7. **Output**: Probabilities, scorelines, confidence, value bets

## 🏆 Key Insights from GW1-8

### Top Attacking Teams (by xG)
1. Man City - 2.45 xG/game
2. Arsenal - 2.28 xG/game
3. Liverpool - 2.15 xG/game
4. Brighton - 2.08 xG/game
5. Chelsea - 1.95 xG/game

### Best Defenses (by xGA)
1. Arsenal - 0.65 xGA/game
2. Man City - 0.78 xGA/game
3. Newcastle - 0.85 xGA/game
4. Aston Villa - 0.92 xGA/game
5. Tottenham - 0.98 xGA/game

### Most Prolific Shooters
1. Man City - 7.2 SoT/game
2. Arsenal - 6.8 SoT/game
3. Liverpool - 6.5 SoT/game
4. Brighton - 6.2 SoT/game
5. Chelsea - 5.9 SoT/game

---

**Built with**: React, TypeScript, Tailwind CSS, Poisson Distribution, Expected Goals (xG)  
**Data**: 80 matches from GW1-8, 2026/27 EPL season  
**Last Updated**: After Gameweek 8
