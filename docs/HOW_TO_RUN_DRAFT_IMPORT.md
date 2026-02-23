# How to run the draft import (step by step)

Same flow works for **any year** (2010–2025+): save page → parse from file → merge into trades.

---

## 2025 (or any year) – full flow

1. **Save the page** from your browser to a file (e.g. Downloads or `app/data/`).
   - URL: **https://www.prosportstransactions.com/basketball/DraftTrades/Years/YYYY.htm**  
     (replace YYYY with 2025, 2024, 2023, … 2010).
   - Save As → **“Webpage, HTML only”** (or “Webpage, Complete”).
2. **Parse** (creates raw JSON):
   ```bash
   cd /Users/camdencrocker/roster-routes
   node scripts/parse-draft-trades-from-file.mjs "/path/to/YYYY Draft Pick Transactions.htm" app/data/draft-picks-YYYY-raw.json
   ```
   Example for 2024:
   ```bash
   node scripts/parse-draft-trades-from-file.mjs "/Users/camdencrocker/Downloads/2024 NBA Draft Pick Transactions.htm" app/data/draft-picks-2024-raw.json
   ```
3. **Merge** into `trades.json` (enriches picks; no new trades added):
   ```bash
   node scripts/merge-draft-picks-into-trades.mjs app/data/draft-picks-YYYY-raw.json
   ```
   Example for 2024:
   ```bash
   node scripts/merge-draft-picks-into-trades.mjs app/data/draft-picks-2024-raw.json
   ```

Done. Repeat for 2010, 2011, … 2024 (and future drafts).

---

## Option A: Run the fetch script (no paste, 2025 only)

1. Open **Terminal** (or Cursor’s terminal).
2. Go to your project folder:
   ```bash
   cd /Users/camdencrocker/roster-routes
   ```
3. Run:
   ```bash
   node scripts/import-draft-trades-2025.mjs
   ```
4. If it works: you’ll see `Wrote .../app/data/draft-picks-2025-raw.json`. Done.
5. If you see **HTTP 403**: use Option B (paste/save page).

---

## Option B: Paste/save the page, then run the parser

### Step 1: Open the page in your browser

Go to:

**https://www.prosportstransactions.com/basketball/DraftTrades/Years/2025.htm**

### Step 2: Save the page to your project

- **Chrome / Edge:** Right‑click the page → **Save as** → choose **“Webpage, Complete”** or **“Webpage, HTML only”**.
- **Safari:** **File → Save As** → save as **“Page Source”** or **“Web Archive”** (if you only get “Web Archive”, use that; the parser will try to read it).
- **Firefox:** Right‑click → **Save Page As** → **“Web Page, HTML only”**.

Save the file **into your project** at:

**`app/data/2025-draft-trades.htm`**

So the full path is:  
`/Users/camdencrocker/roster-routes/app/data/2025-draft-trades.htm`

(If the browser names it `2025.htm`, rename it to `2025-draft-trades.htm` or use that name in Step 4.)

### Step 3: Open Terminal

Same as Option A: open Terminal (or Cursor terminal) and go to the project folder:

```bash
cd /Users/camdencrocker/roster-routes
```

### Step 4: Run the “from file” script

```bash
node scripts/parse-draft-trades-from-file.mjs
```

That reads **`app/data/2025-draft-trades.htm`** and writes **`app/data/draft-picks-2025-raw.json`**.

If you saved the file under a different name (e.g. `2025.htm`), run:

```bash
node scripts/parse-draft-trades-from-file.mjs app/data/2025.htm
```

### Step 5: Merge into trades (no manual comparing)

```bash
node scripts/merge-draft-picks-into-trades.mjs
```

That reads **`app/data/draft-picks-2025-raw.json`** and updates **`trades.json`**: fills `drafted_player` and `pickProvenance` for matching 2025 picks. No new trades are added.

### Step 6 (optional): Check the result

Open **`app/data/draft-picks-2025-raw.json`** to see the `picks` array. Open **`trades.json`** and search for `drafted_player` or `pickProvenance` to confirm picks were enriched.

---

## Quick reference

| What            | Where |
|-----------------|--------|
| Page URL (any year) | https://www.prosportstransactions.com/basketball/DraftTrades/Years/**YYYY**.htm |
| Paste/save file | Anywhere (e.g. Downloads or **`app/data/YYYY-draft-trades.htm`**) |
| Raw JSON        | **`app/data/draft-picks-YYYY-raw.json`** (created by parse script) |
| Parse (from file) | `node scripts/parse-draft-trades-from-file.mjs [input.htm] [output.json]` |
| Merge into trades | `node scripts/merge-draft-picks-into-trades.mjs [draft-picks-YYYY-raw.json]` |
| Fetch (2025, may 403) | `node scripts/import-draft-trades-2025.mjs` |
