#!/usr/bin/env node
/**
 * Fetch player career stats from Basketball Reference LEAGUE pages (not individual player pages).
 * One page per season = ~15 requests total instead of 300+. No manual saving.
 *
 * Run: node scripts/fetch-player-careers.mjs
 *   Fetches NBA_2016 through NBA_2025 per_game pages, parses team + games per player.
 *   Writes to app/data/player-careers.json. Keyed by BBR id (e.g. hardeja01).
 *
 * We build nbaId mapping from trades.json + players.ts (by matching player name).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');
const CACHE_PATH = path.join(DATA, 'player-careers.json');
// Sports Reference: ≤20 req/min. 5s = 12/min — extra safe to avoid blocks.
const DELAY_MS = 5000;

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Seasons to fetch (BR uses NBA_YYYY where YYYY = start year of season)
const SEASONS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

function normalizeName(name) {
  return (name || '')
    .replace(/[^a-zA-Z0-9\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function buildNameToNbaId() {
  const map = new Map();
  const trades = JSON.parse(fs.readFileSync(path.join(DATA, 'trades.json'), 'utf8'));
  for (const t of trades.trades || []) {
    for (const a of t.assets || []) {
      if (a.type === 'player' && a.nbaId && /^\d+$/.test(a.nbaId)) {
        map.set(normalizeName(a.name), a.nbaId);
      }
    }
  }
  const playersTs = fs.readFileSync(path.join(DATA, 'players.ts'), 'utf8');
  const m = playersTs.matchAll(/fullName:\s*['"]([^'"]+)['"][^}]*id:\s*['"](\d+)['"]/g);
  for (const x of m) map.set(normalizeName(x[1]), x[2]);
  const m2 = playersTs.matchAll(/id:\s*['"](\d+)['"][^}]*fullName:\s*['"]([^'"]+)['"]/g);
  for (const x of m2) map.set(normalizeName(x[2]), x[1]);
  return map;
}

function parsePerGameTable(html) {
  const tableMatch = html.match(/<table[^>]*id="per_game_stats"[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return [];
  const tbody = tableMatch[1].match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1] || '';
  const rows = [];
  const trSplits = tbody.split(/<tr[^>]*>/i).filter(Boolean);
  for (const tr of trSplits) {
    if (!tr.includes('</tr>')) continue;
    const trContent = tr.replace(/<\/tr>[\s\S]*$/, '');
    if (/class="[^"]*thead[^"]*"/i.test(trContent)) continue;
    const playerLink = trContent.match(/<a[^>]*href="\/players\/[^/]+\/([^"]+\.html)"[^>]*>([^<]+)<\/a>/i);
    if (!playerLink) continue;
    const bbrefId = playerLink[1].replace('.html', '');
    const name = (playerLink[2] || '').trim();
    const teamMatch = trContent.match(/data-stat="team_name_abbr"[^>]*>[\s\S]*?>([^<]+)</i) || trContent.match(/data-stat="tm"[^>]*>[\s\S]*?>([^<]+)</i);
    const team = (teamMatch?.[1] || '').replace(/<[^>]+>/g, '').trim();
    const gpMatch = trContent.match(/data-stat="games"[^>]*>([^<]+)</i) || trContent.match(/data-stat="g"[^>]*>([^<]+)</i);
    const gp = parseInt((gpMatch?.[1] || '').replace(/<[^>]+>/g, ''), 10) || 0;
    if (team && !['TOT', '2TM', '3TM', '4TM'].includes(team)) {
      rows.push({ bbrefId, name, team, gp });
    }
  }
  return rows;
}

async function fetchSeason(season) {
  const url = `https://www.basketball-reference.com/leagues/NBA_${season}_per_game.html`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return [];
  const html = await res.text();
  const label = `${season - 1}-${String(season).slice(-2)}`;
  return parsePerGameTable(html).map((r) => ({ ...r, season: label }));
}

async function main() {
  console.log('fetch-player-careers-bbref: starting...');
  const nameToNbaId = buildNameToNbaId();
  console.log('Name→nbaId map:', nameToNbaId.size, 'entries');

  const byBbref = {};
  const bbrefToName = {};
  for (let i = 0; i < SEASONS.length; i++) {
    const s = SEASONS[i];
    const label = `${s - 1}-${String(s).slice(-2)}`;
    console.log(`[${i + 1}/${SEASONS.length}] Fetching ${label}...`);
    await new Promise((r) => setTimeout(r, DELAY_MS));
    const rows = await fetchSeason(s);
    for (const { bbrefId, name, team, gp, season } of rows) {
      if (!byBbref[bbrefId]) byBbref[bbrefId] = [];
      byBbref[bbrefId].push({ season, team, gp });
      bbrefToName[bbrefId] = name;
    }
  }

  const cache = { players: {}, byBbrefId: {}, lastUpdated: new Date().toISOString().slice(0, 10) };
  if (fs.existsSync(CACHE_PATH)) {
    const existing = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    cache.players = existing.players || {};
  }

  for (const [bbrefId, stints] of Object.entries(byBbref)) {
    cache.byBbrefId[bbrefId] = stints;
    const name = bbrefToName[bbrefId];
    const nbaId = name ? nameToNbaId.get(normalizeName(name)) : null;
    if (nbaId) cache.players[nbaId] = stints;
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  const withNbaId = Object.keys(cache.players).length;
  console.log('Done. Stored', Object.keys(byBbref).length, 'players. Matched to nbaId:', withNbaId);
  console.log('Cache:', CACHE_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
