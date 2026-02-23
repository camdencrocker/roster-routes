# How to Add Trades

Edit **`app/data/trades.json`** to add trades. Each trade goes in the `trades` array.

## Trade Format

```json
{
  "id": "2025-26-002",
  "date": "2025-08-01",
  "season": "2025-26",
  "teams": ["ATL", "NYK"],
  "summary": "Optional one-line summary",
  "assets": [
    {
      "type": "player",
      "name": "Player Full Name",
      "nbaId": "1234567",
      "from": "ATL",
      "to": "NYK"
    },
    {
      "type": "pick",
      "description": "2026 1st (NYK)",
      "from": "NYK",
      "to": "ATL",
      "protection": "Top 5 protected"
    },
    {
      "type": "cash",
      "amount": "$1.5M",
      "from": "ATL",
      "to": "NYK"
    }
  ]
}
```

## Protection Rule

**Always include `protection` on picks when the source mentions it.** Examples:
- `"Top 5 protected"`, `"Protected 1-14"`, `"Unprotected"`
- `"Swap option"`, `"Swap Option: NOP/MIL"`
- `"Conditional: Most favorable of NOP/MIL"`
- `"Did not convey"`, `"Resolved"` (for outcome)

## Asset Types

| type   | Required fields        | Optional |
|--------|------------------------|----------|
| player | name, nbaId, from, to  | -        |
| pick   | description, from, to  | protection |
| cash   | from, to               | amount   |
| tpe    | description, from, to  | -        |
| other  | description, from, to  | -        |

**Signing Rights:** Assets like “Steven Adams (Signing Rights)” or “Jared Butler (Signing Rights)” use `type: "other"` with `description: "Player Name (Signing Rights)"`. They are **not** player nodes with headshots — they represent the rights to sign a drafted or overseas player. The app shows the player name, “Signing Rights,” and team flow (e.g. NOP → MEM).

## Trade exceptions (TPE)

When a team sends out more salary than it receives, it can generate a Trade Player Exception. The app shows these on the trade date node.

- **One TPE:** `"tradeExceptionGenerated": { "player": "Player Name", "amount": 5426400 }` (amount in dollars).
- **Multiple TPEs:** `"tradeExceptionsGenerated": [ { "player": "Dario Saric", "amount": 5426400 }, { "player": "Jonas Valanciunas", "amount": 4968600 } ]`.

## ID Format

- Use `{season}-{number}`: `2025-26-001`, `2025-26-002`, etc.
- Or `{year}-{month}-{day}-{team1}-{team2}`: `2025-08-01-LAL-BKN`

## Team Abbreviations

ATL, BOS, BKN, CHA, CHI, CLE, DAL, DEN, DET, GSW, HOU, IND, LAC, LAL, MEM, MIA, MIL, MIN, NOP, NYK, OKC, ORL, PHI, PHX, POR, SAC, SAS, TOR, UTA, WAS

## Finding NBA IDs

- Search on [nba.com/stats](https://www.nba.com/stats) or [basketball-reference.com](https://www.basketball-reference.com)
- URL often has it: `nba.com/player/1626156`

## Headshots

- By default the app uses the NBA CDN: `cdn.nba.com/headshots/nba/latest/1040x760/{nbaId}.png`. If that fails, a placeholder is shown.
- **Optional name-based API:** For players with `name-*` ids (e.g. from draft-chain trades), set `NEXT_PUBLIC_HEADSHOT_API_BASE` to a headshot API base URL that serves images at `GET /players/:lastName/:firstName` (e.g. [nba-headshot-api](https://github.com/iNaesu/nba-headshot-api)).
- **Missing headshots:** You can upload headshots for players who don’t have one. Add an optional `"img"` field to the player asset with a direct image URL (e.g. path to your uploaded file or a CDN URL). Example: `"img": "https://yoursite.com/headshots/201161.png"`.
- In future we’ll ask when we need headshots for specific players.

## Data strategy: do we need every trade ever?

**No.** You don’t need a database of every player or every trade in history, and there’s no realistic way to scrape “every single trade ever” reliably (ToS, rate limits, normalization). The app is designed around a **curated** flat list in `trades.json`:

- **Trade trees** are built from this list: for a player, we use their earliest trade as the root, then for each asset in that trade we find the *next* trade (by date) that asset was in. That gives a real branching tree without hand-building each path.
- **Scope:** Focus on recent seasons (e.g. last 5–10 years) or key historical trades. Add trades manually or via a small, targeted scraper; gaps are fine.
- **Optional scraping:** If you scrape at all, limit it (e.g. one source, recent seasons, rate-limited) and prefer existing datasets (e.g. Kaggle, GitHub) or paid APIs over large-scale scraping.

## After Adding

Save the file. The app will pick up new trades on refresh. No build step needed for JSON.

---

## Tabled for later

- **Signing Rights → actual signings:** Steven Adams was signed by the Pelicans; we could show that (e.g. “signed by NOP”) using an **NBA contracts API** — fetch contract/signing dates and surface them in the UI.
- **Tyrese Proctor:** Missing draft # in data; add/fix when back.
- **All Trades screen** (see `TABLED_ALL_TRADES.md`): Team-based layout, click players → trade trees, filter by team + year.
- **Thank You / Sources page:** Finish page content (sources list, copy) at `/thanks`.
