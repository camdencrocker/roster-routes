# Player careers cache

Stores team stints and games played per season for each player. See **docs/SCRAPING_RULES_AND_APIS.md** for rate limits and API options. Used to:
- Check if signing rights were used (did player ever play for the team they were traded to?)
- Check if player was waived (0 games for team they were traded to)
- Enrich trade trees with career context

## How to populate

```bash
# Fetch from stats.nba.com (all numeric nbaIds in trades.json + players.ts)
node scripts/fetch-player-careers.mjs
```

Runs ~2.5s between requests. Run locally (not from AWS—stats.nba.com may block cloud IPs). First run fetches all; later runs skip already-cached players. For a quick test: `node scripts/fetch-player-careers.mjs --limit 5`.

## Add from Basketball Reference (fallback)

1. Save a BBR player page (e.g. `https://www.basketball-reference.com/players/j/jamesle01.html`) as HTML.
2. Run:
   ```bash
   node scripts/fetch-player-careers.mjs --bbref app/data/lebron-career.html
   ```

Will parse the per-game table and add to cache. If the page has `data-nba-id`, uses that; otherwise keys by filename.

## Add from ESPN (future)

ESPN player pages (e.g. `https://www.espn.com/nba/player/_/id/1966/lebron-james`) have career stats tables. A parser could be added to extract team + games per season. Same output format as cache.

## Data format

```json
{
  "players": {
    "201935": [
      { "season": "2012-13", "team": "OKC", "gp": 78 },
      { "season": "2012-13", "team": "HOU", "gp": 78 }
    ]
  },
  "lastUpdated": "2026-02-11"
}
```

## Using in the app

```js
import playerCareers from './data/player-careers.json';

function didPlayerPlayForTeam(nbaId, teamAbbrev) {
  const seasons = playerCareers.players[nbaId] || [];
  return seasons.some((s) => s.team === teamAbbrev && s.gp > 0);
}
```
