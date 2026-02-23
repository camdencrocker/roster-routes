# Copy-Paste Prompt: Celtics Side of Kevin Garnett Trade Tree

**Use this in a new Cursor project or chat.** Paste the entire block below to give full context.

---

## WHERE TO CREATE

**Option A:** Create a new folder `kg-celtics-tree/` inside this repo (sibling to `app/`). Code lives in that folder only. Do not touch `app/`, `MASTER_TODO.md`, or any existing files.

**Option B:** Create a completely new project folder outside this repo (e.g. `~/dev/kg-celtics-tree`). Open it as a new Cursor project.

---

## FULL PROMPT (copy everything below this line)

---

Build a **standalone visualization of the Celtics side of the Kevin Garnett trade tree**. This is separate from Roster Routes — do not use or modify any existing Roster Routes code.

### What to build

A single-page app that shows the **Boston Celtics** branch of the July 31, 2007 Kevin Garnett trade. The tree should show:

- **Root:** Celtics acquire Kevin Garnett, Paul Pierce, Ray Allen, and draft picks (2007 1st, 2008 1st, 2009 1st)
- **Branches:** How those assets flowed through subsequent trades — e.g. KG + Pierce to Brooklyn → picks → Jayson Tatum, Jaylen Brown, etc.
- **Style:** Similar to the CHILLIEBW infographic (dark background, color-coded nodes, clear branching with arrows). Reference: a detailed "KEVIN GARNETT TRADE TREE" diagram with "BOSTON CELTICS ACQUIRING" on the right side, tracking players and picks through many years.

### Tech

- **React + React Flow** (`@xyflow/react`) — same approach as Roster Routes for nodes/edges
- **Next.js** or **Vite + React** — your choice
- **Tailwind CSS** for styling
- **Static data** — a JSON file with the trade tree structure (no backend needed)

### Data structure (suggested)

Each trade has: `id`, `date`, `teams`, `assets` (players + picks). Each asset can have `drafted_player` if a pick conveyed. Link trades by shared `nbaId` (player) or pick lineage. Example shape:

```json
{
  "trades": [
    {
      "id": "2007-kg",
      "date": "2007-07-31",
      "teams": ["BOS", "MIN"],
      "assets": [
        { "type": "player", "name": "Kevin Garnett", "nbaId": "708", "from": "MIN", "to": "BOS" },
        { "type": "player", "name": "Paul Pierce", "nbaId": "1718", "from": "BOS", "to": "BOS" },
        { "type": "pick", "description": "2009 1st", "from": "MIN", "to": "BOS" }
      ]
    }
  ]
}
```

You'll need to research and encode the full Celtics branch. Key branches from the infographic:
- KG + Pierce → Brooklyn (2013) → picks → Tatum (2017), Brown (2016), etc.
- Ray Allen → various
- Picks flowing to Smart, Williams, Pritchard, etc.

### Layout rules (from Roster Routes — use as reference)

- **Orthogonal edges only** — 90-degree turns, no diagonals
- **Tight spacing** — nodes close together, minimal wasted space
- **Date nodes** between trade tiers
- **Player nodes** — circular headshot, name, team badge
- **Pick nodes** — compact label like "2017 1st (BOS)"

### Design constraints

- Dark theme (black/dark gray background)
- All player nodes same size
- Year/round and Pick/# for drafted picks: bands above and below the headshot, never overlay on the picture
- Headshots from NBA CDN: `https://cdn.nba.com/headshots/nba/latest/1040x760/{nbaId}.png`

### Scope

- **Celtics side only** — ignore the Minnesota Timberwolves branch
- **Standalone** — no search, no "browse all trades," just this one tree
- **Static** — data in JSON, no API calls except headshots

### Output

A runnable app. `npm install` and `npm run dev` should work. The tree renders on load. No auth, no backend.

---

## ADDITIONAL CONTEXT (if the AI asks)

- **Roster Routes** is a Next.js app that does full trade trees with player search. This project is a stripped-down, single-tree version.
- **React Flow** uses `position` for node placement; you'll need layout logic to compute x,y for each node based on tree structure.
- **Node types:** `player`, `pick`, `date`. Use custom node components.
- **Edges:** StepEdge for 90° bends, or simple lines. Connect: asset node → date node → next trade's assets.

---

## END OF PROMPT
