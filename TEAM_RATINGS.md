# Team Ratings Feature

## Overview

The Team Ratings section provides a comprehensive analysis of all 20 EPL teams' attacking and defensive capabilities, calculated using Expected Goals (xG) data from the first 8 gameweeks of the 2026/27 season.

## Rating System

### Attack Rating (1-10 scale)
Calculated based on:
- **Expected Goals per game (xG)**: Primary metric
- **Total goals scored**: Secondary validation
- **Shots on target per game**: Supporting metric

Formula:
```
Attack Rating = (Team xG per game / Max xG per game in league) × 10
```

### Defense Rating (1-10 scale)
Calculated based on:
- **Expected Goals Against per game (xGA)**: Primary metric
- **Total goals conceded**: Secondary validation
- **Clean sheets**: Supporting metric

Formula:
```
Defense Rating = ((Max xGA per game - Team xGA per game) / Max xGA per game) × 10
```

### Overall Rating (1-10 scale)
Simple average of Attack and Defense ratings:
```
Overall Rating = (Attack Rating + Defense Rating) / 2
```

## Rating Scale

| Rating | Category | Color |
|--------|----------|-------|
| 8.0-10.0 | Elite | 🟢 Green |
| 6.0-7.9 | Good | 🔵 Blue |
| 4.0-5.9 | Average | 🟡 Yellow |
| 2.0-3.9 | Below Average | 🟠 Orange |
| 1.0-1.9 | Poor | 🔴 Red |

## Features

### Team Cards
Each team card displays:
- **Ranking position** (1-20 based on overall rating)
- **Team name** and basic stats (games played, points)
- **Overall rating** with color coding
- **Attack rating** with visual progress bar
- **Defense rating** with visual progress bar
- **Additional stats**: Shots/game, Shots on target/game, Shooting accuracy, Form points

### Visual Indicators
- **Progress bars**: Visual representation of ratings (0-100%)
- **Color coding**: Quick identification of team quality
- **Medal system**: Gold (1st), Silver (2nd), Bronze (3rd) for top 3 teams

### Sorting
Teams are automatically sorted by overall rating (highest to lowest), making it easy to identify the strongest and weakest teams in the league.

## How to Use

1. Navigate to the **"⚔️ Team Ratings"** tab
2. Scroll through all 20 teams
3. Compare attack and defense ratings using visual bars
4. Use the color coding to quickly identify team strengths
5. Check additional stats for deeper analysis

## Example Interpretation

**High Attack + High Defense (e.g., 8.5/9.2)**
- Elite team with strong offense and solid defense
- Likely title contender
- Example: Arsenal, Manchester City

**High Attack + Low Defense (e.g., 8.2/3.5)**
- Strong attacking team but vulnerable defensively
- Can score goals but may concede frequently
- Often involved in high-scoring games

**Low Attack + High Defense (e.g., 3.2/7.8)**
- Defensive-minded team that struggles to score
- May draw many low-scoring games
- Relies on counter-attacks or set pieces

**Low Attack + Low Defense (e.g., 2.8/3.1)**
- Struggling team at both ends
- Likely in relegation battle
- Needs improvement in both attack and defense

## Data Sources

All ratings are calculated from:
- **Expected Goals (xG)**: From football-data.co.uk
- **Actual goals**: Match results from GW1-8
- **Shooting statistics**: Shots and shots on target
- **Form**: Last 5 match results

## Technical Details

### Component Location
`src/components/TeamRatings.tsx`

### Data Processing
1. Fetch all team statistics using `getAllTeamStats()`
2. Calculate attack rating based on xG per game
3. Calculate defense rating based on xG against per game
4. Calculate overall rating as average
5. Sort teams by overall rating
6. Render with visual indicators

### Performance
- **Calculation time**: <5ms
- **Rendering**: Instant with React
- **Data updates**: Real-time when new match data is added

## Future Enhancements

Potential improvements:
1. **Home/Away splits**: Separate ratings for home and away performance
2. **Form weighting**: Adjust ratings based on recent form
3. **Head-to-head**: Specific ratings for team matchups
4. **Trend analysis**: Show how ratings change over time
5. **Comparison tool**: Side-by-side comparison of two teams
6. **Export functionality**: Download ratings as CSV/PDF

## Integration with Predictions

The team ratings directly inform the match prediction model:
- **Attack rating** → Expected goals for that team
- **Defense rating** → Expected goals against that team
- **Overall rating** → General team strength indicator

When predicting a match, the model uses these ratings to:
1. Calculate expected goals for both teams
2. Adjust for home/away factors
3. Apply form corrections
4. Generate probability distributions

## Notes

- Ratings are **relative to the league**, not absolute
- A rating of 10 means the team is the **best in the league** in that category
- Ratings are **recalculated** after each gameweek with new data
- Small sample size (8 games) means ratings may fluctuate early in the season
- As more data is collected, ratings become more stable and reliable
