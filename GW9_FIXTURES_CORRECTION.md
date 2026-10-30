# GW9 Fixtures Update - Correction Log

## Date: 2026/27 Season

### Fixtures Updated

The following GW9 fixtures have been corrected in `src/data/teams.ts`:

| Home Team | Away Team | Team IDs |
|-----------|-----------|----------|
| Chelsea | Manchester United | che vs mun |
| AFC Bournemouth | Leeds United | bou vs lee |
| Brentford | Nottingham Forest | bre vs nfo |
| Coventry City | Sunderland | cov vs sun |
| Hull City | Ipswich Town | hul vs ips |
| Manchester City | Brighton & Hove Albion | mci vs bri |
| Tottenham Hotspur | Crystal Palace | tot vs cry |
| Aston Villa | Fulham | avl vs ful |
| Liverpool | Arsenal | liv vs ars |
| Newcastle United | Everton | new vs eve |

### Previous Fixtures (Removed)

The following incorrect fixtures were replaced:
- Liverpool vs Manchester City
- Brighton vs Arsenal
- Chelsea vs Newcastle
- Leeds vs Brentford
- Aston Villa vs Tottenham
- Everton vs Bournemouth
- Ipswich vs Hull
- Man United vs Crystal Palace
- Fulham vs Nottingham Forest
- Sunderland vs Coventry

### Impact

✅ **Top 15 FPL Picks** - Now calculated based on correct GW9 fixtures
✅ **Match Predictions** - Will show accurate predictions for real matchups
✅ **FPL Recommendations** - Player rankings reflect actual GW9 schedule

### Key Matchups to Watch

1. **Liverpool vs Arsenal** - Title contenders clash
2. **Manchester City vs Brighton** - City looking to maintain form
3. **Chelsea vs Manchester United** - Big six battle
4. **Tottenham vs Crystal Palace** - London derby
5. **Newcastle vs Everton** - European race implications

### Build Status

✅ Build successful
- All fixtures correctly mapped
- FPL predictions recalculated
- UI updated with correct data

### Files Modified

1. `src/data/teams.ts` - Updated `upcomingFixtures` array with correct GW9 matchups

### Verification

The system now correctly displays:
- Top 15 FPL picks based on actual GW9 fixtures
- Match predictions for each real fixture
- Player rankings using position-specific models
- Team strength analysis for each matchup
