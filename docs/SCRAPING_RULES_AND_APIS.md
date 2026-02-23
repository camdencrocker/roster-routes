# Scraping Rules & API Options

How to responsibly fetch NBA data without getting banned.

---

## Basketball Reference (Sports Reference)

**Official pages:** [Data Use](https://www.sports-reference.com/data_use.html), [Bot Traffic](https://www.sports-reference.com/bot-traffic.html), [Terms of Use](https://www.sports-reference.com/termsofuse.html)

### Rules

| Rule | Limit |
|------|-------|
| **Rate limit** | ≤20 requests/minute (BBR, et al.); ≤10/minute for FBref/Stathead |
| **Penalty** | IP blocked for up to **24 hours** if exceeded |
| **robots.txt** | `Crawl-delay: 3` (3 seconds between requests) |

### ToS restrictions (summary)

- No automated access that “adversely impacts site performance”
- No building databases/archives that compete with or substitute for SR
- No using their data to train AI/LLMs
- Aggressive spidering violates ToS; they will block IPs

### Our usage

- **`fetch-player-careers-bbref.mjs`** – Fetches league per-game pages (1 request per season ≈ 10 total). Uses **≥3s delay** between requests to stay under 20/min.
- **Manual save** – Saving individual player pages in a browser and parsing locally is low-impact and avoids rate limits.

### Recommended delay

Use **≥3 seconds** between requests to stay under 20/min. 3.5s gives a safety margin.

---

## stats.nba.com (NBA official)

**Official:** [NBA.com Terms of Use](https://www.nba.com/termsofuse), [Stats Help](https://www.nba.com/stats/help) (NBASTATS@NBA.com)

### Rules

- **No public API** – stats.nba.com is for the NBA.com Stats UI, not for third-party apps
- **robots.txt** – `Disallow: /api/*` for general crawlers
- **Terms** – NBA content may not be reproduced, republished, etc. without permission
- **Unofficial use** – Libraries like `nba_api` use the same endpoints; not officially supported

### Experience

- Timeouts and blocks are common
- Cloud/AWS IPs often blocked
- Typical advice: **2+ second delay** between requests, browser-like headers, retries with backoff

### Our usage

- **`fetch-player-careers.mjs`** – Uses stats.nba.com with 2.5s delay. Run locally, not from cloud; may still fail.

---

## API alternatives (legal, stable)

### 1. BALLDONTLIE (recommended)

- **URL:** https://balldontlie.io/
- **Docs:** https://docs.balldontlie.io/
- **Pricing:** [Free tier](https://www.balldontlie.io/#pricing) – 5 req/min, basic endpoints. Paid plans from $9.99/mo.
- **Data:** Players, teams, games, stats, season averages, box scores, standings, leaders
- **Pros:** Legal, documented, predictable
- **Cons:** Free tier is 5 req/min (≈12s between requests); full access needs paid plan

### 2. ESPN API (unofficial but widely used)

- **Base URL:** `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/`
- **Auth:** None
- **Data:** Scores, teams, players, box scores, standings, schedules
- **Pros:** Free, no key
- **Cons:** Undocumented, may change

### 3. Paid options (from Sports Reference)

- **Sports Info Solutions** – https://www.sportsinfosolutions.com/
- **Sports Direct / Gracenote** – https://content.sportsdirectinc.com/
- **Spotrac** – http://www.spotrac.com/ (contract data)
- **Sports Reference custom data** – $1,000 minimum per request

---

## Checklist for our scripts

- [ ] BBR: ≥3s delay between requests
- [ ] BBR: Prefer league pages over many player pages
- [ ] stats.nba.com: Use only when necessary; run locally
- [ ] Include `User-Agent` (browser-like)
- [ ] Cache results locally; avoid re-fetching
- [ ] Consider BALLDONTLIE or ESPN for long-term, compliant data
