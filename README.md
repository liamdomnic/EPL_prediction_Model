# EPL Match Predictor

A statistical match prediction model for the English Premier League based on GW1-8 data from the 2025/26 season.

## Features

- **Match Prediction**: Select any two teams to predict match outcomes
- **League Table**: View comprehensive team statistics and standings
- **Statistical Model**: Uses Poisson distribution for probability calculations
- **Key Metrics**:
  - Expected goals for each team
  - Win/Draw/Loss probabilities
  - Over 2.5 goals probability
  - Both teams to score probability
  - Most likely scoreline
  - Prediction confidence meter

## Model Methodology

### Data Sources
- 80 matches from GW1-8 (2025/26 season)
- Home and away performance metrics
- Recent form (last 5 games)
- Attack and defense strength ratings

### Prediction Factors

1. **Attack Strength**: Goals scored per game relative to league average
2. **Defense Strength**: Goals conceded per game relative to league average
3. **Home Advantage**: Historical home vs away performance differential
4. **Recent Form**: Points earned in last 5 games (normalized to 0.85-1.15 multiplier)
5. **Poisson Distribution**: Calculates probability of each possible scoreline

### Expected Goals Calculation

**Home Team Expected Goals:**
```
Base = Home Attack Strength × (2 - Away Defense Strength)
Adjusted = Base × Home Advantage × Form Factor × League Average (1.5)
```

**Away Team Expected Goals:**
```
Base = Away Attack Strength × (2 - Home Defense Strength)
Adjusted = Base × 0.85 × Form Factor × League Average (1.2)
```

### Probability Calculation

Uses Poisson distribution to calculate the probability of every possible scoreline (0-0 to 7-7), then aggregates:
- **Home Win**: Sum of probabilities where home goals > away goals
- **Draw**: Sum of probabilities where home goals = away goals
- **Away Win**: Sum of probabilities where home goals < away goals
- **Over 2.5**: Sum of probabilities where total goals > 2.5
- **BTTS**: Sum of probabilities where both teams score > 0

## Technical Implementation

### Files Structure

```
src/
├── data/
│   └── matchResults.ts       # All GW1-8 match data
├── utils/
│   ├── teamStats.ts          # Team statistics calculator
│   └── predictionEngine.ts   # Poisson-based prediction model
└── App.tsx                   # Main UI component
```

### Key Components

1. **matchResults.ts**: Stores all 80 match results with team names and scores
2. **teamStats.ts**: Calculates comprehensive team statistics including:
   - Overall, home, and away records
   - Goals scored/conceded per game
   - Attack/defense strength ratings
   - Recent form tracking
3. **predictionEngine.ts**: Implements the prediction model using:
   - Poisson probability distribution
   - Form factor calculation
   - Home advantage adjustment
   - Expected goals prediction

## Usage

1. **Match Predictor Tab**:
   - Select home team from dropdown
   - Select away team from dropdown
   - Click "Predict Match"
   - View detailed prediction with probabilities and expected goals

2. **League Table Tab**:
   - View all 20 teams ranked by points
   - See comprehensive stats: Played, Wins, Draws, Losses, Goals For/Against
   - View recent form (last 5 games) with color-coded indicators
   - Top 4 highlighted in blue, bottom 3 in red

## Model Accuracy Considerations

### Strengths
- Based on actual match data from current season
- Accounts for home advantage (significant factor in EPL)
- Incorporates recent form momentum
- Uses statistically sound Poisson distribution
- Calculates attack/defense strength relative to league average

### Limitations
- Small sample size (only 8 games per team)
- Doesn't account for injuries/suspensions
- Doesn't consider head-to-head history
- Doesn't factor in tactical matchups
- Form can be volatile over short periods

## Future Enhancements

Potential improvements:
- Add more gameweeks as season progresses
- Incorporate player availability data
- Add head-to-head historical data
- Include xG (expected goals) data if available
- Implement machine learning models for comparison
- Add confidence intervals for predictions

## Build & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Data Source

All match data is from the 2025/26 Premier League season, Gameweeks 1-8, as provided by the user.

---

**Disclaimer**: This is a statistical model for educational purposes. Football matches are inherently unpredictable, and no model can guarantee accurate predictions. Use responsibly.
