# 2024-25 BBRef transactions

- **Source:** Basketball Reference [2024-25 NBA Transactions](https://www.basketball-reference.com/leagues/NBA_2025_transactions.html) (saved as `2024-25-nba-transactions-bbref.html`).
- **Parsed data:** `2024-25-transactions-bbref.json` — one object per transaction (date, type, team, players, text). Regenerate with:
  ```bash
  node scripts/parse-bbref-transactions.mjs
  ```

## Waived within 1 / 2 / 3 days of traded

(Days = calendar days between trade date and waiver date.)

### Within 1 day (9)

| Player | Waived | Traded | Days |
|--------|--------|--------|------|
| Devonte' Graham | 2024-07-06 | 2024-07-06 | 0 |
| Jalen McDaniels | 2024-10-16 | 2024-10-15 | 1 |
| Mohamed Bamba | 2025-02-02 | 2025-02-01 | 1 |
| Daniel Theis | 2025-02-06 | 2025-02-05 | 1 |
| Reggie Jackson | 2025-02-06 | 2025-02-06 | 0 |
| Jaden Springer | 2025-02-06 | 2025-02-06 | 0 |
| Sidy Cissoko | 2025-02-06 | 2025-02-05 | 1 |
| Patrick Baldwin Jr. | 2025-02-07 | 2025-02-06 | 1 |
| Colby Jones | 2025-06-28 | 2025-06-28 | 0 |

### Within 2 days, not 1 (4)

| Player | Waived | Traded | Days |
|--------|--------|--------|------|
| Russell Westbrook | 2024-07-20 | 2024-07-18 | 2 |
| James Wiseman | 2025-02-08 | 2025-02-06 | 2 |
| Bones Hyland | 2025-02-08 | 2025-02-06 | 2 |
| Alex Len | 2025-02-08 | 2025-02-06 | 2 |

### Within 3 days, not 1–2 (2)

| Player | Waived | Traded | Days |
|--------|--------|--------|------|
| Sidy Cissoko | 2025-02-06 | 2025-02-03 | 3 |
| Josh Richardson | 2025-02-09 | 2025-02-06 | 3 |

**Total: 15 unique (player, waived date, traded date) within 3 days.** Use for trade trees (e.g. show "Waived" when the player was waived within 1–3 days of the trade).

## Using in the app

- Load `2024-25-transactions-bbref.json` and index by `dateNorm` and/or player name.
- For a trade on date D with player P, check if any transaction has `type === 'waived'` and `players` including P with waiver date within 1–3 days of D → show waived badge/status.
