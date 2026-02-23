# Basketball Reference stats (scrape or save)

You can get BR stats **without manually typing or uploading stats**. Two options:

---

## Option 1: Scrape (script fetches the page)

The script will **download** the BR page for you, then parse it.

```bash
# One player’s per-game stats (career table)
node scripts/fetch-bbref-stats.mjs "https://www.basketball-reference.com/players/j/jamesle01.html" --out=app/data/player-stats-lebron.json

# League-wide per-game stats (all players, one season) – one URL = full roster of stats
node scripts/fetch-bbref-stats.mjs "https://www.basketball-reference.com/leagues/NBA_2025_per_game.html" --out=app/data/league-per-game-2024-25.json
```

- The script waits **2 seconds** before each fetch to be polite to BR.
- Basketball Reference may block or throttle heavy scraping (many requests in a short time). For **one or a few URLs** this is usually fine. For hundreds of player pages, use Option 2 or add longer delays.

---

## Option 2: Save the page, then run the script (no fetch)

You “upload” by **saving the webpage** as HTML (e.g. File → Save Page As → “Web Page, Complete” or “HTML Only”), then run the parser on the file. No stats to type; the script reads the saved HTML.

1. Open the BR page (e.g. [LeBron per-game](https://www.basketball-reference.com/players/j/jamesle01.html) or [2024-25 per game](https://www.basketball-reference.com/leagues/NBA_2025_per_game.html)).
2. Save the page to `app/data/` (e.g. `lebron-per-game.html` or `NBA_2025_per_game.html`).
3. Run:

```bash
node scripts/fetch-bbref-stats.mjs ./app/data/lebron-per-game.html --no-fetch --out=app/data/player-stats-lebron.json
```

- **No network** after you’ve saved the page. Good if you want to avoid any scraping or rate limits.
- You can save **one league per-game page** per season and get all players for that season in one go.

---

## Output

Both options produce the same JSON shape:

```json
{
  "source": "https://... or path to file",
  "rows": [
    { "season": "2024-25", "age": "40", "tm": "LAL", "g": "71", "pts": "25.7", ... },
    ...
  ]
}
```

Column keys match BR’s `data-stat` attributes (e.g. `pts`, `trb`, `ast`, `g`, `mp`). Use this in your app (e.g. side panel stats) or merge into your existing data.

---

## Summary

| Approach | You do | Script does |
|----------|--------|-------------|
| **Scrape** | Run script with a URL | Fetches page, parses, writes JSON |
| **Save then parse** | Save BR page as HTML | Reads file, parses, writes JSON (no fetch) |

So: **you don’t need to upload or type stats**. Either let the script scrape a URL or save the page and run the script on the file.
