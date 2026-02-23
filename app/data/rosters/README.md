# Rosters

Roster files power the **“2025 Thunder”** (and future team) entry points. Each file is a JSON snapshot of a team’s roster so we can list players and link each to their trade tree.

## What we need from you (OKC or any team)

**Required per player:**

| Field   | Description |
|--------|-------------|
| `nbaId` | NBA’s numeric player ID (e.g. `1628983`). **Required** — this is how we link to trades in `trades.json`. Find IDs on [nba.com/stats](https://www.nba.com/stats) (player URL or API) or Basketball-Reference. |
| `name`  | Display name (e.g. `Shai Gilgeous-Alexander`). |

**Optional (for display only):**

- `position` — e.g. `G`, `F`, `C`
- `jersey` — jersey number

We do **not** need: contract details, salary, or birth date (unless you want them for a future feature).

## File format

Save as `app/data/rosters/<slug>.json`, e.g. `okc-2025.json`:

```json
{
  "id": "okc-2025",
  "team": "OKC",
  "season": "2024-25",
  "label": "2025 Thunder",
  "players": [
    { "nbaId": "1628983", "name": "Shai Gilgeous-Alexander" },
    { "nbaId": "1631093", "name": "Chet Holmgren" },
    { "nbaId": "1631114", "name": "Jalen Williams" }
  ]
}
```

- `id`: unique slug (used in code).
- `team`: 3-letter team code (OKC, BOS, etc.).
- `season`: optional, e.g. `2024-25`.
- `label`: short title for the UI (e.g. “2025 Thunder”).
- `players`: array of `{ nbaId, name }` (and optional fields).

## How to “upload”

1. **Option A — Replace the file:** Edit `app/data/rosters/okc-2025.json` and add/remove players. Use real `nbaId`s so each player links to their trade tree.
2. **Option B — New roster:** Copy the file, change `id`, `team`, `label`, and `players`. Register the new roster in `app/data/rosters/index.ts` (see below).

There is no in-app upload UI yet; roster data lives in the repo.

## Finding nbaIds

- **nba.com:** Go to [NBA Stats](https://www.nba.com/stats), open a player, URL often has the id (e.g. `.../player/1628983/...`).
- **Basketball-Reference:** Player page URL or their API/source data often includes it.
- **Our data:** Search `app/data/trades.json` or `app/data/players.ts` for the player’s name; the `nbaId` is there if they’ve been in a trade we have.
