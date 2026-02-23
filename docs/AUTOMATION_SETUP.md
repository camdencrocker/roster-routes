# Set-and-Forget Automation

One-time setup. After that, GitHub Actions runs automatically.

---

## What Runs Automatically

| When | What |
|------|------|
| **Daily** (10am UTC) | Fetch BBR transactions for current season → saves HTML + JSON |
| **June 20–30** | Fetch draft trades from Pro Sports Transactions → merge into `trades.json` |
| **On push** | Updates are committed back to the repo (if any files changed) |

---

## One-Time Setup

1. **Push the workflow** to your repo:
   ```bash
   git add .github/workflows/update-data.yml
   git commit -m "Add data update automation"
   git push
   ```

2. **That’s it.** The workflow runs on the schedule above.

---

## Manual Run

To run it immediately:

1. GitHub repo → **Actions** → **Update Data**
2. **Run workflow**

---

## Caveats

- **BBR transactions:** Fetch + parse only. The JSON is saved to `app/data/SEASON-transactions-bbref.json`. A script to merge new trades into `trades.json` is not included yet.
- **Draft:** Pro Sports Transactions may return 403 from GitHub’s IPs. If the draft fetch fails, run locally after draft night:
  ```bash
  node scripts/fetch-draft-trades.mjs 2026
  node scripts/merge-draft-picks-into-trades.mjs app/data/draft-picks-2026-raw.json
  ```
- **Player careers:** Not in the workflow (many requests). Run locally when needed:
  ```bash
  node scripts/fetch-player-careers-bbref.mjs
  ```

---

## Manual Steps (When Automation Fails)

| If | Do this |
|----|---------|
| Draft fetch got 403 | Run `node scripts/fetch-draft-trades.mjs YEAR` locally, then merge |
| Need fresh player careers | Run `node scripts/fetch-player-careers-bbref.mjs` |
| Need to add a trade | Follow `app/data/HOW_TO_ADD_TRADES.md` |
