# Roster Routes – Agent Context

**What we're building:** Follow the draft-and-trade path of every NBA player. A Next.js app that visualizes NBA trade trees: how players were acquired, what they were traded for, and how those assets flowed through later trades.

---

## Agent Domains

| Domain | Scope | Rules |
|--------|-------|-------|
| **Data** | trades.json, schema, scripts, player data | `.cursor/rules/data.mdc` |
| **Tree** | trade tree viz, nodes, edges, layout | `.cursor/rules/tree.mdc`, `.cursor/rules/trade-tree-layout.mdc` |

---

## Key Files

- **Data:** `app/data/trades.json`, `trade-schema.ts`, `trades-loader.ts`, `HOW_TO_ADD_TRADES.md`
- **Tree:** `app/page.tsx` (React Flow), `UniversalCard`, `AssetCard`
- **Scripts:** `scripts/` – fetch BBR, parse draft trades, merge into trades

---

## Avoiding Crashes (Error Code 5)

- **Run little by little** – Break large edits into smaller steps. Apply changes incrementally.
- **Commit often** – Save progress to git so you can recover.
- **All context lives in repo** – Rules in `.cursor/rules/` and this file persist across restarts.
