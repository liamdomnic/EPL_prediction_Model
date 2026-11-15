# GW9 Predictions vs Actual Results - Summary

## Quick Overview

| Match | Prediction | Actual | Result |
|-------|-----------|--------|--------|
| Chelsea vs Man United | Home Win (59.92%) | Chelsea 2-0 Man United | ✅ |
| Bournemouth vs Leeds | Home Win (50.79%) | Bournemouth 2-0 Leeds | ✅ |
| Brentford vs Nott'm Forest | Home Win (53.74%) | Brentford 2-0 Nott'm Forest | ✅ |
| Coventry vs Sunderland | Home Win (51.04%) | Coventry 3-1 Sunderland | ✅ |
| Hull vs Ipswich | Away Win (42.93%) | Hull 2-2 Ipswich | ❌ |
| Man City vs Brighton | Home Win (59%) | Man City 0-1 Brighton | ❌ |
| Tottenham vs Crystal Palace | Home Win (42.6%) | Tottenham 2-0 Crystal Palace | ✅ |
| Aston Villa vs Fulham | Home Win (43.4%) | Aston Villa 1-1 Fulham | ❌ |
| Liverpool vs Arsenal | Away Win (51.55%) | *Pending* | ⏳ |
| Newcastle vs Everton | Home Win (41.44%) | *Pending* | ⏳ |

## Accuracy Score

**Current: 5/8 = 62.5%** (excluding 2 pending matches)

## Detailed Breakdown

### ✅ Correct Predictions (5 matches)

1. **Chelsea 2-0 Man United**
   - Predicted: Home Win 59.92%
   - Confidence: High
   - Analysis: Model correctly identified Chelsea dominance

2. **Bournemouth 2-0 Leeds**
   - Predicted: Home Win 50.79%
   - Confidence: Medium-High
   - Analysis: Accurate home victory prediction

3. **Brentford 2-0 Nott'm Forest**
   - Predicted: Home Win 53.74%
   - Confidence: Medium-High
   - Analysis: Strong home performance correctly predicted

4. **Coventry 3-1 Sunderland**
   - Predicted: Home Win 51.04%
   - Confidence: Medium
   - Analysis: Correct home win, though score was higher than expected (1-1)

5. **Tottenham 2-0 Crystal Palace**
   - Predicted: Home Win 42.6%
   - Confidence: Medium-Low
   - Analysis: Correct prediction despite lower confidence

### ❌ Incorrect Predictions (3 matches)

1. **Hull 2-2 Ipswich**
   - Predicted: Away Win 42.93%
   - Actual: Draw
   - Error Type: Failed to predict draw
   - Draw probability was: 23.98%

2. **Man City 0-1 Brighton**
   - Predicted: Home Win 59%
   - Actual: Away Win
   - Error Type: Major upset missed
   - This was the biggest prediction error

3. **Aston Villa 1-1 Fulham**
   - Predicted: Home Win 43.4%
   - Actual: Draw
   - Error Type: Failed to predict draw
   - Draw probability was: 22.12%

## Key Findings

### What Worked
- ✅ Home win predictions were 71% accurate (5/7)
- ✅ High confidence predictions (>50%) were 75% accurate
- ✅ Clear favorites were correctly identified

### What Failed
- ❌ Draw predictions: 0/2 (model didn't predict any draws as most likely)
- ❌ Upset detection: Man City vs Brighton was completely missed
- ❌ Close matchups: When probabilities were close, accuracy dropped

## Model Performance by Category

| Category | Predictions | Correct | Accuracy |
|----------|-------------|---------|----------|
| Home Win | 7 | 5 | 71% |
| Draw | 0 | 0 | N/A |
| Away Win | 1 | 0 | 0% |
| High Confidence (>50%) | 5 | 4 | 80% |
| Medium Confidence (40-50%) | 3 | 1 | 33% |

## Insights

1. **Home Bias**: Model heavily favors home wins (7/10 predictions)
2. **Draw Blindness**: Model rarely predicts draws as most likely outcome
3. **Upset Vulnerability**: Cannot predict major upsets (Man City loss)
4. **Confidence Correlation**: Higher confidence = better accuracy

## Recommendations

1. **Increase Draw Probability**: Add draw factor for evenly matched teams
2. **Reduce Home Bias**: Adjust home advantage multiplier
3. **Add Upset Detection**: Include momentum, injuries, fatigue factors
4. **Improve Close Matchups**: Better analysis when teams are evenly matched

## Next Steps

- Wait for Liverpool vs Arsenal and Newcastle vs Everton results
- Update final accuracy statistics
- Analyze patterns in remaining matches
- Implement model improvements for GW10
