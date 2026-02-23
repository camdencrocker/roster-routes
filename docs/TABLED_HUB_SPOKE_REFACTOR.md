# Hub & Spoke Multi-Sport Architecture — tabled (do later)

Refactor the app structure to support multiple sports (NBA, NFL, MLB, NHL) with a high-level Landing Page. Essential for SEO Sitelinks.

---

## 1. Action Plan

### 1.1 Move NBA Logic
- Move current contents of `app/page.tsx` (NBA trade tree interface) to `app/nba/page.tsx`
- Ensure all imports (components, utils) still resolve correctly

### 1.2 Create New Landing Page (`app/page.tsx`)
- **Design:** Sleek, "Command Center" style landing page
- **Hero Section:** "Roster Routes: The Ultimate Transaction Visualizer."
- **The Grid:** 2x2 (mobile) or 1x4 (desktop) interactive cards:
  - [🏀 NBA] → Links to `/nba`
  - [🏈 NFL] → Links to `/nfl` (Coming Soon)
  - [⚾ MLB] → Links to `/mlb` (Coming Soon)
  - [🏒 NHL] → Links to `/nhl` (Coming Soon)
- **Aesthetic:** Use existing zinc-950 dark theme. Cards should glow or scale up slightly on hover to feel premium.

### 1.3 Implement Shared Layout
- Main Navbar (if we have one) should adapt to show which "League Mode" the user is currently in.

### Outcome
User lands on rosterroutes.com → picks a league → enters that specific "Search Engine." Clear URL structure (`/nba`, `/nfl`) helps search engines generate Sitelinks.

---

## 2. "Other Ideas" for the Landing Page

Since this is the "Front Door," avoid 4 boring buttons. Three ideas to make it sticky:

### Idea A: The "Trending Trades" Ticker
- **What:** Scrolling text bar (like ESPN) at the bottom of the landing page
- **Content:** "Trending: Luka Doncic Tree (+400 views) ... Kyrie Irving Tree (+200 views)..."
- **Why:** Makes the site feel alive; shows users what others are looking at

### Idea B: "On This Day" in History
- **What:** Small box under the 4 buttons: "On this day in 2018: The Clippers traded Blake Griffin to Detroit."
- **Why:** Gives people a reason to visit the homepage every day, even without a specific search

### Idea C: The "Omni-Search" (Cmd+K)
- **What:** Big Search Bar on landing page: "Search any player across history..."
- **How it works:** Type "Tom Brady" → auto-redirect to NFL. Type "LeBron" → NBA.
- **Why:** Removes the extra click for lazy users who want to type a name instantly

---

## 3. How to Get Google Sitelinks ("Hanging Links")

You cannot build these directly—Google's algorithm awards them. This structure is the recipe:

1. **Build the structure:** `rosterroutes.com/nba`, `rosterroutes.com/nfl`, `rosterroutes.com/about`
2. **Put clear text links** to these pages in footer and navbar
3. **Once Google sees** users land on homepage and click "NBA," it will automatically create that "hanging link" shortcut on your search result

---

_Do not implement yet; tabled for later. Add/remove items as scope changes._
