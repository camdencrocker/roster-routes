# Team / championship roster feature (idea)

**Idea:** “How did each NBA champion get that exact roster?” — For a given team and season (e.g. 2024 Lakers), show every player on the roster and how they got there: **draft**, **trade**, or **sign**.

**Why it fits:** Complements the current “follow one player’s route” view. Same data (trades, draft, moves); different entry point (team + year instead of player).

**What you’d need:**
- **Roster snapshot** per team per season (who was on the team). Source: BR, NBA.com, or manual.
- **Acquisition type** per player: drafted (year + pick), traded (link to trade), signed (FA, 2-way, etc.).
- **UI:** One view per “Team + Season” — list or grid of players, each with a small “Draft 2022 #12” or “Trade Jun 2023” chip that can link to the existing trade tree or a summary.

**Scope:** Start with one champion season (e.g. 2024 Celtics) as a pilot: build the roster list, tag each player’s acquisition, then add a “How we built this roster” page that links into your existing trees where relevant.

No code changes in this repo yet — this is a note for when you want to explore the feature.
