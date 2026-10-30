# EPL Prediction Model - Comprehensive Documentation

## Overview

This system provides two types of predictions:
1. **Match Score Predictions** - Poisson-based statistical model for predicting match outcomes
2. **FPL Player Performance Predictions** - Position-specific player ranking system for Fantasy Premier League

---

## 1. Match Score Prediction Model

### Methodology: Poisson Distribution

The match prediction engine uses a **Poisson distribution model** to calculate the probability of different scorelines.

#### Key Components:

**Attack & Defense Ratings**
- Each team has an attack strength (goals scored relative to league average)
- Each team has a defense strength (goals conceded relative to league average)
- Values above 1.0 indicate above-average performance

**Expected Goals (xG) Calculation**
```
Home xG = Home Attack × Away Defense × League Home Avg × Form Factor × Home Advantage
Away xG = Away Attack × Home Defense × League Away Avg × Form Factor × Away Penalty
```

**Poisson Distribution**
- Uses the formula: P(X=k) = (λ^k × e^-λ) / k!
- Calculates probability of every possible scoreline (0-0 through 8-8)
- Aggregates into Win/Draw/Loss probabilities

**Form & Context Factors**
- Recent form (last 5 games) adjusts xG by up to ±15%
- Home advantage provides team-specific multipliers
- League averages: Home 1.49 goals/game, Away 1.26 goals/game

---

## 2. FPL Player Performance Prediction Model

### Position-Specific Prediction Engines

The FPL predictor uses **different models for each position** based on what drives points for that role.

### FORWARDS (FWD) - Goal Scoring Model

**Factors & Weights:**
1. **Opponent Defensive Weakness (30%)**
   - Measures opponent's defensive stability
   - Weak defense = higher goal probability
   - Based on opponent's goals conceded and defensive player quality

2. **Player Current Form (25%)**
   - Actual FPL points from recent games
   - Higher points = better form
   - Normalized to 0-2.0 scale

3. **Player Quality/Price (15%)**
   - Price as proxy for talent level
   - Higher-priced players generally perform better
   - Accounts for ownership and captaincy potential

4. **Team Attacking Strength (15%)**
   - Does the player's team create chances?
   - Based on team's attacking players' combined points
   - Strong team attack = more opportunities

5. **Home/Away Advantage (10%)**
   - Home teams score ~20% more goals
   - Away teams face ~15% penalty
   - Historical EPL home advantage data

6. **Minutes/Role Consistency (5%)**
   - Key players (>40 pts) get 1.2x multiplier
   - Regular starters (20-40 pts) get 1.0x
   - Rotation risks (<20 pts) get 0.8x

**Output Metrics:**
- Predicted FPL points
- Goal probability (%)
- Assist probability (%)
- Match difficulty rating (1-5 scale)
- Confidence score (35-92%)

---

### MIDFIELDERS (MID) - Attacking Contribution Model

**Factors & Weights:**
1. **Opponent Defensive Weakness (25%)**
   - Similar to forwards but slightly lower weight
   - Midfielders score less but assist more

2. **Player Current Form (25%)**
   - Same as forwards
   - Critical for predicting goal/assist involvement

3. **Player Quality/Price (15%)**
   - Same methodology as forwards

4. **Team Attacking Strength (15%)**
   - Same as forwards
   - Team's creative output matters for assists

5. **Home/Away Advantage (10%)**
   - Home +15%, Away -12%
   - Slightly less impact than forwards

6. **Minutes/Role Consistency (10%)**
   - Higher weight than forwards
   - Midfielders need consistent minutes for assists

**Output Metrics:**
- Predicted FPL points
- Goal probability (%)
- Assist probability (%)
- Match difficulty rating
- Confidence score

---

### DEFENDERS (DEF) - Clean Sheet & Attacking Threat Model

**Factors & Weights:**
1. **Opponent Attacking Weakness (25%)**
   - Measures opponent's attacking threat
   - Weak attack = higher clean sheet probability
   - Based on opponent's goals scored and attacking player quality

2. **Own Team Defensive Strength (25%)**
   - How strong is the player's own defense?
   - Based on team's defensive players' combined points
   - Strong defense = more clean sheets

3. **Player Current Form (20%)**
   - Same methodology as attackers
   - Important for predicting bonus points and attacking returns

4. **Clean Sheet Probability (15%)**
   - Derived from opponent attack weakness × own team defense
   - Directly adds 4 points per clean sheet
   - Most important factor for DEF points

5. **Attacking Threat from Defense (10%)**
   - Does this defender score/assist?
   - High-point defenders (>25 pts) get 1.3x multiplier
   - Accounts for set-piece threats and overlapping runs

6. **Home/Away Advantage (5%)**
   - Home +10%, Away -8%
   - Lower impact than attackers

**Output Metrics:**
- Predicted FPL points
- Clean sheet probability (%)
- Goal probability (%) (for attacking defenders)
- Assist probability (%)
- Match difficulty rating
- Confidence score

---

### GOALKEEPERS (GK) - Shot-Stopping & Clean Sheet Model

**Factors & Weights:**
1. **Opponent Attacking Weakness (30%)**
   - Highest weight for goalkeepers
   - Weak opponent attack = clean sheet likely
   - Critical for the 4-point clean sheet bonus

2. **Own Team Defensive Strength (30%)**
   - Equally important as opponent weakness
   - Strong defense in front = fewer shots faced
   - Based on team's defensive stability

3. **Player Current Form (20%)**
   - Recent FPL points
   - Indicates shot-stopping ability and bonus point potential

4. **Clean Sheet Probability (15%)**
   - Derived from opponent attack × own defense
   - Directly adds 4 points per clean sheet
   - Most important single factor for GK points

5. **Home/Away Advantage (5%)**
   - Home +8%, Away -6%
   - Lowest impact among all positions

**Output Metrics:**
- Predicted FPL points
- Clean sheet probability (%)
- Match difficulty rating
- Confidence score

---

## 3. Team Strength Metrics

### Calculated from FPL Data

**Attack Rating**
- Average points of all forwards and midfielders
- Higher rating = stronger attacking threat
- Used to predict goals scored

**Defense Rating**
- Average points of all defenders and goalkeepers
- Higher rating = stronger defensive stability
- Used to predict clean sheets and goals conceded

**Overall Rating**
- Average points of entire squad
- Used for match difficulty calculations

---

## 4. Match Difficulty Rating

### 1-5 Scale Calculation

```
Match Difficulty = 5 - ((Own Strength - Opponent Strength) / 10 + Base)

Where Base = 2.5 for home games, 2.0 for away games
```

**Interpretation:**
- **1.0-2.4**: Easy fixture (favorable matchup)
- **2.5-3.4**: Medium difficulty (average matchup)
- **3.5-5.0**: Hard fixture (tough matchup)

---

## 5. Confidence Score

### Calculation Method

```
Confidence = Base + Quality Bonus

Where:
- Base = 85% for high-point players (>30 pts)
       = 65% for medium-point players (15-30 pts)
       = 45% for low-point players (<15 pts)
- Quality Bonus = +5% for expensive players (>£7.0m)
```

**Range:** 35% - 92%

---

## 6. Data Sources

### Official FPL Data (2026/27 Season)

All player data comes from the **official Fantasy Premier League** database:
- Player names and team assignments
- Current season FPL points
- Player prices (£m)
- Position classifications (GK/DEF/MID/FWD)

### Match Results Data (GW1-GW8)

Goal scorers and assist providers from actual match results:
- 80 matches across 8 gameweeks
- 220 total goals scored
- 2.75 goals per match average

---

## 7. Model Limitations

### Known Constraints

1. **No Injury Data**: Model doesn't account for injuries or suspensions (handled separately)
2. **No Fixture Congestion**: Doesn't consider teams playing multiple games
3. **No Weather Conditions**: Environmental factors not included
4. **No Managerial Changes**: Tactical shifts not accounted for
5. **No Transfer Impact**: New signings not fully integrated
6. **Historical Bias**: Model favors established players over emerging talent

---

## 8. Usage Recommendations

### For Match Predictions

1. **Use for entertainment and analysis**, not gambling
2. Check team news and lineups before match day
3. Consider injuries and suspensions
4. Look at head-to-head history
5. Monitor weather conditions

### For FPL Predictions

1. **Check the detailed factor breakdown** for each player
2. Prioritize players with high confidence scores (>70%)
3. Consider match difficulty when choosing captain
4. Look for favorable fixtures (difficulty < 2.5)
5. Balance your squad with different price points
6. Monitor form trends over last 3-5 gameweeks

---

## 9. Technical Implementation

### Technologies Used

- **React** with TypeScript for UI
- **Tailwind CSS** for styling
- **Poisson Distribution** for match predictions
- **Weighted Factor Analysis** for FPL predictions
- **Monte Carlo Simulation** for season projections

---

**Disclaimer**: This model is for entertainment and educational purposes. FPL decisions should consider multiple factors beyond statistical predictions. Past performance does not guarantee future results.
