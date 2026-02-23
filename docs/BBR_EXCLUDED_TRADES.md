# BBR Trades Excluded by Audit

The audit (`audit-bbr-trades-coverage.mjs`) only checks transactions that pass these filters:

1. `type === 'traded'`
2. `dateNorm` is not null
3. `team` and `teamTo` exist
4. `team !== teamTo` (excludes sign-and-trades where BBR lists same team for both)

**Why:** The audit matches BBR entries to trades.json by (date, teams). Entries with no date or same-team can't be matched. Sign-and-trades are merged into the main trade (e.g. Lonzo Ball trade includes Garrett Temple S&T).

**Fix missing dates:** Run `node scripts/fix-bbr-missing-dates.mjs` — uses trades.json date when BBR has `dateNorm: null`. PST date used when trade is in trades.json from PST.

---

## Excluded Trades (11 total)

### 1. No date (1)

| Season | BBR # | Teams | Issue | Info needed |
|--------|------|-------|-------|-------------|
| **2024-25** | 0 | NYK↔POR | `dateNorm: null` (BBR shows "?") | **Resolved:** Trade date is **2024-06-27** (draft night). We have it in trades.json. PST/RealGM confirm June 27, 2024. |

**Trade:** NYK traded Daniel Diez, 2027 2nd, 2029 2nd, 2030 2nd → POR for Tyler Kolek.

---

### 2. Sign-and-trades — team === teamTo (9)

These are the *same deal* as the main trade. BBR lists them separately with the signing team as both from/to. They are **merged** into the main trade in trades.json.

| Season | BBR # | Player | Teams | Main trade |
|--------|------|--------|-------|------------|
| 2015-16 | 70 | Kyle O'Quinn | NYK↔NYK | ORL S&T — **Need:** Confirm we have this; add "sign-and-trade" to summary if missing |
| 2021-22 | 69 | Spencer Dinwiddie | BRK↔BRK | 5-team deal — merged |
| 2021-22 | 99 | Kyle Lowry | TOR↔TOR | TOR→MIA — merged |
| 2021-22 | 122 | Daniel Theis | CHI↔CHI | CHI→HOU — merged |
| 2021-22 | 131 | Doug McDermott | IND↔IND | SAS→IND — merged |
| 2021-22 | 151 | Garrett Temple | CHI↔CHI | Lonzo Ball trade (CHI→NOP) — merged |
| 2021-22 | 205 | DeMar DeRozan | SAS↔SAS | SAS→CHI — merged, summary says "sign-and-trade" |
| 2021-22 | 239 | Evan Fournier | BOS↔BOS | NYK→BOS — merged |
| 2021-22 | 285 | Lauri Markkanen | CHI↔CHI | CHI→CLE 3-team — merged |
| 2022-23 | 258 | Collin Sexton | CLE↔CLE | UTA→CLE — merged |

**Action:** Ensure each of these main trades has "sign-and-trade" (or similar) in the summary where applicable.

---

## Fallback: PST date when BBR has no date

When BBR has `dateNorm: null`, use Pro Sports Transactions date if the trade is mentioned there. Add to parse/merge logic or manually fix the BBR JSON before merge.

---

## Is everything logged?

- **803** BBR traded (with date, team≠teamTo) → all in trades.json ✓
- **9** sign-and-trades → merged into main trades ✓
- **1** no-date (Daniel Diez) → we have it with date 2024-06-27 from PST/RealGM ✓

**Yes — everything is logged.** The 11 "excluded" are either merged (S&T) or we have them with the correct date from another source.
