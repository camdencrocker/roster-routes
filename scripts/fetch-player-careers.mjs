#!/usr/bin/env node
/**
 * Fetch player career stats (team stints, games played) and cache locally.
 * Sources: stats.nba.com (primary), Basketball Reference (fallback from saved HTML).
 *
 * Run: node scripts/fetch-player-careers.mjs
 *   Fetches all numeric nbaIds from trades.json + players.ts + player-id-mappings.
 *   Writes to app/data/player-careers.json.
 *
 * Run: node scripts/fetch-player-careers.mjs --bbref app/data/player-page.html
 *   Parse a saved BBR player page, add to cache. (Key by nbaId from data-nba-id in HTML, or manually.)
 *
 * Rate limit: 2.5s between stats.nba.com requests (unofficial; run locally—cloud IPs may be blocked).
 * See docs/SCRAPING_RULES_AND_APIS.md for full rules.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');
const CACHE_PATH = path.join(DATA, 'player-careers.json');
const TRADES_PATH = path.join(DATA, 'trades.json');
const DELAY_MS = 2500;

const NBA_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.nba.com/',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

function collectNbaIds() {
  const ids = new Set();

  const trades = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));
  for (const t of trades.trades || []) {
    for (const a of t.assets || []) {
      if (a.type === 'player' && a.nbaId && /^\d+$/.test(a.nbaId)) ids.add(a.nbaId);
    }
  }

  const playersTs = fs.readFileSync(path.join(DATA, 'players.ts'), 'utf8');
  const playerIdMatches = playersTs.matchAll(/id:\s*['"](\d+)['"]/g);
  for (const m of playerIdMatches) ids.add(m[1]);

  if (fs.existsSync(path.join(DATA, 'player-id-mappings.json'))) {
    const mappings = JSON.parse(fs.readFileSync(path.join(DATA, 'player-id-mappings.json'), 'utf8'));
    for (const v of Object.values(mappings)) {
      if (typeof v === 'string' && /^\d+$/.test(v)) ids.add(v);
    }
  }

  return [...ids].sort((a, b) => Number(a) - Number(b));
}

async function fetchNbaCareer(nbaId, signal) {
  const url = `https://stats.nba.com/stats/playercareerstats/?PerMode=Totals&PlayerID=${nbaId}&LeagueID=00`;
  const res = await fetch(url, { headers: NBA_HEADERS, signal });
  if (!res.ok) return null;
  const json = await res.json();
  const resultSets = json.resultSets || [];
  const seasonTotals = resultSets.find((r) => r.name === 'SeasonTotalsRegularSeason');
  if (!seasonTotals || !seasonTotals.headers || !seasonTotals.rowSet) return null;
  const headers = seasonTotals.headers;
  const rows = seasonTotals.rowSet;
  const idx = (k) => headers.indexOf(k);
  const gp = idx('GP');
  const team = idx('TEAM_ABBREVIATION');
  const season = idx('SEASON_ID');
  if (gp === -1 || team === -1 || season === -1) return null;
  const seasons = rows.map((r) => ({
    season: r[season] || '',
    team: r[team] || '',
    gp: Number(r[gp]) || 0,
  }));
  return { nbaId, seasons };
}

function parseBbrefPerGame(html) {
  const tableMatch = html.match(/<table[^>]*id="per_game"[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return null;
  const tbody = tableMatch[1].match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1] || '';
  const nbaIdMatch = html.match(/data-nba-id="(\d+)"/i) || html.match(/nba\.com\/player\/(\d+)/i);
  const rows = [];
  const trSplits = tbody.split(/<tr[^>]*>/i).filter(Boolean);
  for (const tr of trSplits) {
    if (!tr.includes('</tr>')) continue;
    const seasonMatch = tr.match(/data-stat="season"[^>]*>([^<]+)</);
    const teamMatch = tr.match(/data-stat="tm"[^>]*>([^<]+)</);
    const gpMatch = tr.match(/data-stat="g"[^>]*>([^<]+)</);
    if (seasonMatch && teamMatch && gpMatch) {
      const team = teamMatch[1].trim();
      if (team && team !== 'TOT') {
        rows.push({
          season: seasonMatch[1].trim(),
          team,
          gp: parseInt(gpMatch[1], 10) || 0,
        });
      }
    }
  }
  return { nbaId: nbaIdMatch?.[1] || null, seasons: rows };
}

async function main() {
  console.log('fetch-player-careers: starting...');
  const args = process.argv.slice(2);
  const bbrefFile = args.find((a) => a === '--bbref') && args[args.indexOf('--bbref') + 1];

  if (bbrefFile) {
    const htmlPath = path.isAbsolute(bbrefFile) ? bbrefFile : path.join(process.cwd(), bbrefFile);
    if (!fs.existsSync(htmlPath)) {
      console.error('File not found:', htmlPath);
      process.exit(1);
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    const parsed = parseBbrefPerGame(html);
    if (!parsed || parsed.seasons.length === 0) {
      console.error('No per_game table found. Save a BBR player page (e.g. players/j/jamesle01.html).');
      process.exit(1);
    }
    const cache = fs.existsSync(CACHE_PATH)
      ? JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
      : { players: {}, lastUpdated: '' };
    const key = parsed.nbaId || `bbref-${path.basename(htmlPath, '.html')}`;
    cache.players[key] = parsed.seasons;
    cache.lastUpdated = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
    console.log('Added', key, 'from BBR:', parsed.seasons.length, 'team seasons');
    return;
  }

  const ids = collectNbaIds();
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : null;
  const idsToFetch = limit ? ids.slice(0, limit) : ids;

  if (args.includes('--test')) {
    console.log('Testing stats.nba.com with player 201935 (James Harden)...');
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 15000);
    try {
      const career = await fetchNbaCareer('201935', controller.signal);
      if (career) console.log('Success:', career.seasons.length, 'seasons');
      else console.log('No data returned');
    } catch (e) {
      console.error('Error:', e.message);
      process.exit(1);
    }
    return;
  }

  console.log('Found', ids.length, 'unique numeric nbaIds. Fetching', idsToFetch.length);

  let cache = { players: {}, lastUpdated: '' };
  if (fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  }

  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < idsToFetch.length; i++) {
    const nbaId = idsToFetch[i];
    if (cache.players[nbaId] && Array.isArray(cache.players[nbaId]) && cache.players[nbaId].length > 0) {
      skipped++;
      continue;
    }
    console.log(`[${i + 1}/${idsToFetch.length}] Fetching ${nbaId}...`);
    await new Promise((r) => setTimeout(r, DELAY_MS));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const career = await fetchNbaCareer(nbaId, controller.signal);
      if (career && career.seasons.length > 0) {
        cache.players[nbaId] = career.seasons;
        fetched++;
        console.log(`  OK: ${career.seasons.length} seasons`);
      } else {
        failed++;
        console.log(`  Failed: no data`);
      }
    } catch (err) {
      failed++;
      console.log(`  Error: ${err.message || err}`);
    } finally {
      clearTimeout(timeout);
    }
  }

  cache.lastUpdated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  console.log('\nDone. Fetched:', fetched, 'Skipped (cached):', skipped, 'Failed:', failed);
  console.log('Cache:', CACHE_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
