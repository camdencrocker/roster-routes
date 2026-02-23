# Team Branding: Historical Accuracy

When displaying team logos or branding (e.g. for badges, cards, or future logo assets), **the team must match the season exactly**.

## Requirement
- Charlotte Hornets (1988–2002) ≠ Charlotte Hornets (2014–present) — different franchises
- New Orleans Hornets (2002–2013) → New Orleans Pelicans (2013–present)
- Charlotte Bobcats (2004–2014) → Charlotte Hornets (2014–present)
- Seattle SuperSonics → Oklahoma City Thunder (2008)
- Vancouver Grizzlies → Memphis Grizzlies (2001)
- New Jersey Nets → Brooklyn Nets (2012)
- etc.

## Implementation
- Need a mapping: `(teamAbbrev, season/year)` → correct franchise identity for that era
- Use this when rendering team badges, logos, or names so the displayed brand matches the trade date

---
_For when we add team logos or refine team display._
