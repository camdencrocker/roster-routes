# Roster Routes — MASTER TODO

**Everything that needs to be done.** One file. Never lose this. Add new items here when you say "add to todo list."

---

## Context (what's working / gaps)

**Working:** Trade tree, player search, draft picks with headshots, full trade view, Prev/Next, `/thanks`, footer. Data from `trades.json` + `trades-loader.ts`.

**Gaps:** No Report a Problem email, no ads, `reactflow` legacy in package.json (`@xyflow/react` is used).

**Commands:** `npm run build` | `npm run start`

**Ad placement:** Keep ads out of the tree. Good spots: top banner, above footer, right rail (desktop).

**Notes:** Copyright — you have it once the work is fixed. PST — no terms of use; credit them, scrape gently (rate limit, cache). Draft import — see `docs/HOW_TO_RUN_DRAFT_IMPORT.md` if 403.

---

## 🔴 PRIORITY 1: Ship It (Do First)

- [x] **Install Git** — Done (2.50.1)
- [ ] **Get business/project email** — Need real email for Report a Problem; can't ship without it
- [ ] **Report a Problem** — Set real email in `app/Footer.tsx` (`mailto:you@example.com?subject=Roster Routes – Report a Problem`)
- [ ] **Deploy** — Push to Vercel (or host of choice); confirm env if needed
- [ ] **Smoke test** — Open `/`, search a player, open trade tree, click Prev/Next, open `/thanks`

---

## 🟠 PRIORITY 2: Monetize

- [ ] Sign up for AdSense (1–2 days approval)
- [ ] Add AdSense script in `app/layout.tsx`
- [ ] Add one ad unit (banner above footer)
- [ ] Explore more monetization — Ko-fi, Buy Me a Coffee, sponsors, affiliate links, etc.
- [ ] Add Privacy page (if using personalized ads)

---

## 🟡 PRIORITY 3: Data & Polish

- [ ] **Polish many trades** — Lots added but need review; fix errors, fill gaps
- [ ] **Go over all NBA IDs** — Audit trades.json; fix wrong/missing nbaIds
- [ ] Fix placeholder nbaIds — ~56 players use `name-*`; fill `player-id-mappings.json` and run `apply-player-id-mappings.mjs`
- [ ] Upload more transaction histories — BBR, PST; add to data pipeline
- [ ] Upload/update player list — Expand player-index, players-from-trades
- [ ] Add 2–3 trades manually (use `HOW_TO_ADD_TRADES.md`)
- [ ] Run draft-chain script — Merge draft-picks-*-raw.json into trades.json
- [x] 2020 from Pro Sports Transactions — draft-picks-2020-raw.json exists (2010–2025 all present)
- [x] **BBR transactions → trades merge** — `merge-bbref-transactions-into-trades.mjs` (2-team). `parse-multi-team-bbref-trades.mjs` parses 3+/4+/5+ team trades from BBR text. Log: `docs/MULTI_TEAM_TRADES_LOG.md`
- [ ] Trade importer script (fetch/parse + de-dupe)
- [ ] Draft resolver script — Post-draft: match results to pending picks, fill `drafted_player` + status

---

## 🟢 PRIORITY 4: Formatting & Layout

- [ ] Smaller cards in dense mode — compact toggle or auto-detect; smaller CARD_WIDTH / CARD_H
- [ ] Collapse by default — for players with 5+ trades, collapse older branches
- [ ] Zoom / fit view — React Flow "fit view" after load; optional zoom controls
- [ ] Progressive disclosure — expand branches on click (e.g. "+3 more" chevron)
- [ ] Full vs Direct trade toggle — Full (all assets) vs Direct (simplified for 3+ team clutter)

---

## 🟢 PRIORITY 5: Player Images

- [ ] Set name-based headshot API (optional) — for draft-chain players with `name-*` ids
- [ ] Add `img` in data for wrong/missing headshots
- [ ] Upload missing headshots to `public/headshots/`
- [ ] Better fallback (second CDN or generic "no photo" instead of NBA logo)

---

## 🟢 PRIORITY 6: Pick Nodes & Tree UX

- [ ] Pick nodes: protection text expandable (chevron to expand/collapse)
- [ ] Pick schema for automation — Add `year`, `round`, `originalTeam`, optional `status` to pick assets
- [ ] Remove/add players from tree — Click node → button to remove or add back (persist per session or account)

---

## 🟢 PRIORITY 7: Stats

- [ ] Decide where stats show (tooltip vs SidePanel)
- [ ] Add server API route for player stats
- [ ] Add caching for external API
- [ ] Stats UI in SidePanel or tooltip (GP, PPG, etc.)

---

## 🟢 PRIORITY 8: UI & Content

- [ ] Homepage value prop — Make "Follow the draft-and-trade path of every NBA player" the clear headline
- [ ] Shareable URLs — `/trade/:id`, `/player/:slug` for direct links
- [ ] Copy link button — Copy current tree URL to clipboard
- [ ] Wire player search to player-index — Use 5,387-player index (optional)
- [ ] All Trades filter — Filter by season/team; permalinks
- [ ] **Overhaul Browse all trades** — Redesign the browse all trades function
- [x] Thank you / Sources page — Pro Sports Transactions, Basketball Reference, NBA (done)
- [ ] Thank You page: add RealGM, Spotrac (if used); "How we use this" per source; Report an error link
- [ ] Short disclaimer — "Data from third-party sources; we don't guarantee accuracy. Report errors via Report a problem."
- [ ] Data methodology link — Link to HOW_TO_ADD_TRADES or "how we build this" on Thank You

---

## 🟢 PRIORITY 9: Legal (If Needed)

- [ ] Terms of use (optional)
- [ ] Privacy policy (if collecting data or using personalized ads)

---

## 🟢 PRIORITY 10: Report / Feedback (Alternative to mailto)

- [ ] Dedicated `/report` or `/feedback` route with form (Formspree, Web3Forms, or form → Google Sheet)
- [ ] Confirm mailto opens with your email

---

## 🔵 CLEANUP

- [ ] Remove unused `reactflow` from package.json (use `@xyflow/react` only)
- [x] Consolidate docs — Merged into MASTER_TODO; deleted redundant files
- [ ] Finish 2020 trades block — Encode remaining 2020 trades from paste into `trades.json`

---

## ⚪ LATER / OPTIONAL

- [ ] Export tree as image — Download tree (html-to-image already in deps)
- [ ] Season filter — "Show only 2023–24 trades"
- [ ] Team filter — "Show only trades involving OKC"
- [ ] Dark/light mode toggle
- [ ] Keyboard shortcuts — Prev/Next with arrow keys
- [ ] "Last updated" — Show when trades.json was last updated
- [ ] Missing data notice — "Know a trade we're missing? Report it."
- [ ] Ko-fi / Buy Me a Coffee — Tip link on Thank You
- [ ] Auth & Account — Sign up, login, profile, saved trees, preferences (Create account, Login, Account page, Sign out, Forgot password, Email verification)
- [ ] Team + season view ("How did 2024 Thunder get that roster?")
- [ ] Wire BBRef transactions (waived within 1–3 days) into node badges
- [ ] Scraping etiquette — Rate limit, cache, credit source

---

## Reference

| Area | Files |
|------|-------|
| Layout | `app/page.tsx` — RANK_GAP, topRowGap, siblingGap, CARD_H, leafWidth |
| Headshots | `app/headshots.ts`, `app/AssetCard.tsx`, `app/data/trades.json` |
| Ads | `app/layout.tsx`, optional `app/ads/AdUnit.tsx` |
| Trades | `app/data/trades.json`, `scripts/create-trades-from-draft-chains.mjs` |
| Footer | `app/Footer.tsx` |

**Current constants:** CARD_WIDTH=148, CARD_H=168, HEADSHOT_SIZE=80

**APIs:** NBA CDN headshots, NBA Stats (stats.nba.com), BBRef, AdSense. nbasense.com for NBA API docs.

**Footer:** Optional `authorName` prop for `© 2025–26 Your Name. Roster Routes.`
