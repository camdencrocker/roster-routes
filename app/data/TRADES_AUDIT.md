# Trades audit – questions and issues

Review of `trades.json` (and related usage). Items that don’t make sense, are inconsistent, or need a decision.

---

## Applied 2026-02-11 (fix-trades-audit.mjs)

- **Duplicate IDs:** 7 duplicate trade IDs fixed (2020-21-002a/b, 2020-21-003a/b, 2020-21-004a, 2021-22-002a, 2021-22-003a, 2021-22-004a, 2021-22-005a)
- **drafted_player:** Steven Adams #12, Mitch McGary #21, Tyler Herro #13, Tre Mann #18, Vince Williams Jr #47, Tyrese Proctor #49, Yannick Nzosa #54, Tyler Smith #33
- **Team codes:** MIK→PHX, KHY→DET, GAR→POR, SHA→LAC, SUN→PHX, ALE→GSW, JAR→UTA, KEV→CLE, DEI→DET, ISA→DET, KEN→HOU, NIC→ATL, DE'→ATL, GUI→NYK, SWA→correct team per trade
- **Placeholder nbaIds:** Brian Roberts, George Hill, Jason Smith, Tobias Harris, Mikal Bridges, Wilson Chandler → real IDs

---

## 1. Draft pick: `description` vs `drafted_player` mismatch

The **description** (e.g. "2013 1st (OKC #12 - Steven Adams)") should match **drafted_player** (who was actually taken with that pick and the pick number). Several entries don’t.

| Trade / Pick | description says | drafted_player says | Fix |
|--------------|------------------|---------------------|-----|
| 2012-13-001 | 2013 1st (OKC #12 - **Steven Adams**) | **Pierre Jackson**, 12 | OKC #12 was Steven Adams. Pierre Jackson was #42. → `drafted_player`: Steven Adams, 12. |
| 2012-13-001 | 2014 1st (OKC #21 - **Mitch McGary**) | **Thanasis Antetokounmpo**, 21 | OKC #21 was Mitch McGary. Thanasis was #51. Provenance refers to #51. → `drafted_player`: Mitch McGary, 21. |
| 2014-15-001 | 2019 1st (MIA #13 - **Tyler Herro**) | **Jaylen Nowell**, 13 | MIA #13 was Tyler Herro. Jaylen Nowell was #43 (provenance is about that 2nd). → `drafted_player`: Tyler Herro, 13. |
| 2014-15-001 | 2021 1st (MIA #18 - **Tre Mann**) | **Sharife Cooper**, 18 | MIA #18 was Tre Mann. Sharife Cooper was #48 (provenance). → `drafted_player`: Tre Mann, 18. |
| (same chain elsewhere) | 2021 1st (MIA #18 - Tre Mann) | Sharife Cooper, 18 | Same fix: Tre Mann, 18. |
| 2024 1st (HOU #3) in HOU/BKN trade | #3 - Reed Sheppard | Tyler Smith, 3 | Provenance says #**33**-Tyler Smith. So this is the **#33** pick, not #3. → description: e.g. "2024 2nd (HOU #33 - Tyler Smith)" and `drafted_player`: Tyler Smith, **33**. |
| 2022 1st (CLE #24 - MarJon Beauchamp) | CLE #24 | Yannick Nzosa, 24 | Provenance says #**54**-Yannick Nzosa. So this is the 2nd-round #54 pick, not CLE 1st #24. → Either change to 2022 2nd (#54 - Yannick Nzosa) and pickNumber 54, or split into correct pick assets. |
| 2023 2nd (HOU #47 - Vince Williams Jr) | #47 | Vince Williams Jr, **17** | Vince Williams Jr was drafted #47. → pickNumber: **47**. |
| 2025 2nd (CLE #49 - Tyrese Proctor) | #49 | Tyrese Proctor, **19** | Proctor was #49. → pickNumber: **49**. |
| 2025 2nd (#42 - Maxime Raynaud) | #42 | Maxime Raynaud, 42 | OK. |
| 2025 1st (#12 - Noa Essengue) provenance | — | Maxime Raynaud, **12** elsewhere | If that pick is #12, drafted player is Noa Essengue (2025). If it’s the #42 pick, player is Maxime Raynaud. Align description / pickNumber / name. |

---

## 2. Non‑standard team codes (draft / swap chains)

These show up in **teams** or **from/to** and aren’t in the standard 30-team list (ATL, BOS, …).

- **GUI** – 2015-16-001: “76ers ↔ Guillermo ‘Willy’ Hernangomez to Knicks”. Likely placeholder for “rights to Hernangomez” (e.g. international team or “NYK” if that’s where he went).
- **SWA** – Used in many “swap” / draft-chain trades (e.g. “swap 2021 second round picks with Pelicans”).
- **MIK** – “76ers ↔ Mikal Bridges to **Suns**” → probably should be **PHX**.
- **KHY** – “76ers ↔ **Khyri Thomas** to Pistons” → probably **DET**.
- **GAR** – “Kings ↔ **Gary Trent Jr.** to Blazers” → probably **POR**.
- **SHA** – “Hornets ↔ **Shai** Gilgeous-Alexander to Clippers” → probably **LAC**.
- **SUN** – “Bucks ↔ **Suns**” → should be **PHX**.
- **ALE** – “Pelicans ↔ **Alen** Smailagic to Warriors” → probably **GSW**.
- **JAR** – “Pacers ↔ **Jarrell** Brantley” → likely **UTA** (Jazz).
- **KEV** – “Pistons ↔ **Kevin** Porter Jr. to Cavaliers” → probably **CLE**.
- **DEI** – “Mavericks ↔ **Deividas** Sirvydis to Pistons” → probably **DET**.
- **DE'** – “Pelicans ↔ **De’Andre** Hunter … to Hawks” → probably **ATL** (typo/truncation).
- **NIC** – “Nets ↔ **Nickeil** Alexander-Walker … to Hawks” → probably **ATL** (or NOP depending on chain).
- **ISA** – “Rockets ↔ **Isaiah** Stewart … to Pistons” → probably **DET**.
- **KEN** – “Kings ↔ **Kenyon** Martin Jr. to Rockets” → probably **HOU**.

**Question:** Are these intentional “pseudo-teams” for draft-chain links (so a pick has a stable id to attach the next trade to)? If yes, consider documenting that in HOW_TO_ADD_TRADES. If the app should only show real teams, consider replacing with the actual NBA team code (e.g. PHX, DET, POR).

---

## 3. Placeholder / invalid `nbaId`s

Many assets use `nbaId` like `"name-rights"`, `"name-brian-roberts"`, `"name-trey-burke"`, etc. These are not real NBA IDs (numeric). Effects:

- **Headshots:** NBA CDN won’t have an image; app will fall back to placeholder.
- **Linking:** `trades-loader` indexes by `nbaId` for player-type assets. So all “name-*” placeholders group together by that string, not by a real player. Search/linking by real player id won’t find these unless you also key by something else.

**Question:** Do you want to (a) keep these as-is for draft-chain-only links, (b) replace with real `nbaId`s where possible (e.g. Brian Roberts, Trey Burke have real IDs), or (c) use a different field (e.g. `draftRightsId`) for chain links so `nbaId` is only for real players?

---

## 4. Trades that look like stubs or placeholders

- **2015-16-001** (PHI ↔ GUI): Single asset `type: "player"`, `name: "rights"`, `nbaId: "name-rights"`. Summary says “Guillermo ‘Willy’ Hernangomez to Knicks”. So this is really “rights to Hernangomez” and might be better as `type: "other"` with description “Willy Hernangomez (Signing Rights)” and from/to PHI → NYK (and teams including NYK, not GUI), unless GUI is intentional for the chain.
- **2016-17-003** (POR ↔ MIA): Brian Roberts with `nbaId: "name-brian-roberts"`. Real nbaId for Brian Roberts is **203148**. Same idea for other “name-*” players: if the trade is a real player move, using the real nbaId improves search and headshots.

---

## 5. Duplicate or repeated draft-chain trades

Some draft chains appear in multiple trades (e.g. “2021 1st (MIA #18 - Tre Mann)” with Sharife Cooper appears in 2014-15-001 and again in another trade). That’s expected if the same pick is an asset in two different trade records, but the **drafted_player** should be consistent in both (Tre Mann, 18).

---

## 6. Summary of suggested data fixes (if you want them applied)

1. **Clear description vs drafted_player fixes** (no ambiguity):
   - 2012-13-001: 2013 1st → Steven Adams, 12. 2014 1st → Mitch McGary, 21.
   - 2014-15-001 (and duplicate): 2019 1st → Tyler Herro, 13. 2021 1st → Tre Mann, 18.
   - Vince Williams Jr: pickNumber 47 where it’s 17.
   - Tyrese Proctor: pickNumber 49 where it’s 19.
   - Yannick Nzosa: description/pick should be 2022 2nd (#54) and pickNumber 54 (or keep as 1st and fix to MarJon Beauchamp, 24 – depends which pick this asset is).
   - 2024 HOU pick that became Tyler Smith: description and pickNumber 33 (not #3 / Reed Sheppard).

2. **Team codes:** Replace pseudo-codes (MIK→PHX, KHY→DET, GAR→POR, SHA→LAC, SUN→PHX, ALE→GSW, JAR→UTA, KEV→CLE, DEI→DET, ISA→DET, KEN→HOU, NIC/DE'→ATL or as per chain) if you want only standard teams in the UI.

3. **Placeholder nbaIds:** Optionally replace with real NBA IDs for well-known players (e.g. Brian Roberts 203148) and use `type: "other"` for “rights” where there’s no real player asset.

If you tell me which of these you want (e.g. “fix only the drafted_player and pickNumber mismatches” or “also normalize team codes”), I can apply the edits to `trades.json` next.
