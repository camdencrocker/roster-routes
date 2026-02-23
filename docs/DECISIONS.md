# Roster Routes — Design Decisions & Context

**Source of truth.** Persistent record so context is never lost. Update this file when making significant changes. `.cursor/rules/decisions.mdc` mirrors the key constraints for AI.

---

## Current Constants (as of last update)

| Constant | Value | Where |
|----------|-------|-------|
| CARD_WIDTH | 148 | page.tsx, AssetCard.tsx |
| CARD_H | 168 | page.tsx, AssetCard.tsx |
| HEADSHOT_SIZE | 80 | AssetCard.tsx |
| leafWidth | 260 (desktop) / 200 (mobile) | page.tsx |

---

## AssetCard — Draft Node Layout (Picks That Conveyed)

**Structure (top to bottom):**
1. **Top quadrant:** Year (left) | Round (right) — **glued above the picture, never overlay**
2. **Center:** Circular headshot (80px)
3. **Bottom quadrant:** Pick (left) | #N (right) — **glued below the picture, never overlay**

**Rules:**
- Year/round and Pick/# must stay in their bands above and below the picture. **Never overlay text on the picture.**
- All player node sizes must be the same (Bledsoe, Missi, drafted picks — all 148×168).
- Drafted player headshots same size as regular players (80px).
- Do NOT increase node size when changing picture size.
- If changing picture size only, leave bands exactly where they are.

---

## User Preferences (Do NOT Violate)

- **No overlay:** No info or text overlapping the player picture.
- **Uniform nodes:** All player-style nodes same dimensions.
- **Minimal changes:** When asked to change one thing (e.g. picture size), change only that — don't move bands, overlay text, or resize nodes.
- **Tight layout:** Reduce wasted space; user finds excessive spacing frustrating.

---

## Data & Conventions

- **Direct tree first:** Default `showFullTrade = true` — full tree loads by default.
- **Date nodes:** Show full teams (e.g. "OKC ↔ DEN", "4-team: NOP, MIL, OKC, DEN").
- **Player path:** Uses full teams on date nodes, not focal.from → focal.to.

---

## Persistence

- **MASTER_TODO.md** — Single task list (never lose when closing Cursor). Add items there. All other todo/docs merged into it.
- **docs/DECISIONS.md** — This file; design decisions and context.
- **.cursor/rules/** — AI rules; update when constants or conventions change.
