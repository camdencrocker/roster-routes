# Why "Unmapped" Players? What Do You Need to Provide?

## What "unmapped" means

When trades are imported from Basketball Reference (BBR) or other sources, the merge script extracts **player names** from the transaction text. To link a player to their trade tree, we need a **numeric NBA ID** (e.g. `202695` for Kawhi Leonard).

- **If we have the ID** (from existing trades or `player-id-mappings.json`): the player’s tree loads when you search.
- **If we don’t**: we use a placeholder like `name-kawhi_leonard`. The search uses `202695` (from `players.ts`), but trades are indexed by `name-kawhi_leonard`, so the lookup fails → "Coming Soon".

"Unmapped" = placeholder ID in trades, no mapping to a real NBA ID yet.

---

## What we need from you

**Nothing, ideally.** The goal is to fix this in code, not by hand.

Options:

1. **Auto-resolve from NBA API** – Script that fetches player IDs from stats.nba.com or similar and fills `player-id-mappings.json`.
2. **Auto-resolve from player-index** – `player-index.json` has BBR IDs (`bbrefId`); we’d need a BBR→NBA ID mapping or API.
3. **Manual mappings** – You add entries to `player-id-mappings.json` when you notice a broken tree. Format: `"name-slug": "nbaId"`.

Right now we’re using option 3 for high-profile players (e.g. Kawhi). A proper fix is option 1 or 2 so new trades get IDs automatically.

---

## Kawhi trade fix (done)

The Kawhi Leonard trade (SAS↔TOR, 2018-07-18) was wrong: **Keldon Johnson** was listed as a player, but he was actually a **2019 1st round pick** that became Keldon Johnson at #29.

**Fixed:** Replaced the Keldon player asset with a pick asset that has `drafted_player: { name: "Keldon Johnson", nbaId: "1629640", pickNumber: 29 }`. The tree now shows the pick and who was drafted with it.

---

## Summary

| Term | Meaning |
|------|---------|
| **Unmapped** | Player in trades has `name-xxx` placeholder, no mapping to numeric NBA ID |
| **Your input** | Optional: add mappings for players whose trees you care about. Long-term: automate via API or BBR mapping |
| **Kawhi trade** | Fixed: Keldon shown as drafted pick, not player |
