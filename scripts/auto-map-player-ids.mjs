#!/usr/bin/env node
/**
 * Auto-map placeholder player IDs to NBA IDs using:
 * 1. Basketball-GM roster (name + imgURL → ID)
 * 2. stats.nba.com commonallplayers (multiple seasons)
 *
 * Run: node scripts/auto-map-player-ids.mjs
 *   Fetches data, builds name→ID map, adds new mappings to player-id-mappings.json,
 *   then runs apply-player-id-mappings.mjs.
 *
 * Rate limit: 2.5s between stats.nba.com requests. Run locally.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');
const MAPPINGS_PATH = path.join(DATA, 'player-id-mappings.json');
const TRADES_PATH = path.join(DATA, 'trades.json');
const DELAY_MS = 2500;

const NBA_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.nba.com/',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
};

/** Normalize name for matching: lowercase, collapse spaces, remove accents, handle Jr./III/etc. */
function normalizeForMatch(name) {
  if (!name || typeof name !== 'string') return '';
  let s = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[öòó]/gi, 'o')
    .replace(/[üùú]/gi, 'u')
    .replace(/[äàá]/gi, 'a')
    .replace(/[ëèé]/gi, 'e')
    .replace(/[ïìí]/gi, 'i')
    .replace(/[ñ]/gi, 'n')
    .replace(/[ç]/gi, 'c')
    .replace(/\s*(jr\.?|sr\.?|iii?|iv)\s*$/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  // "Last, First" -> "first last"
  const comma = s.indexOf(',');
  if (comma > 0) {
    const last = s.slice(0, comma).trim();
    const first = s.slice(comma + 1).trim();
    s = `${first} ${last}`.trim();
  }
  return s;
}

/** Build slug from name (matches our placeholder format). */
function toSlug(name) {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

async function fetchBasketballGMRoster() {
  const url = 'https://raw.githubusercontent.com/alexnoob/BasketBall-GM-Rosters/master/2024-25.NBA.Roster.json';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Basketball-GM: ${res.status}`);
  const data = await res.json();
  const map = new Map();
  for (const p of data.players || []) {
    const name = p.name;
    if (!name) continue;
    const imgURL = p.imgURL || '';
    const m = imgURL.match(/nba\.com[^/]*\/(\d+)\.png/);
    if (m) {
      const id = m[1];
      const norm = normalizeForMatch(name);
      if (norm && !map.has(norm)) map.set(norm, id);
    }
  }
  return map;
}

async function fetchCommonAllPlayers(season) {
  const url = `https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=${season}&IsOnlyCurrentSeason=0`;
  const res = await fetch(url, { headers: NBA_HEADERS });
  if (!res.ok) return new Map();
  const json = await res.json();
  const rows = json.resultSets?.[0]?.rowSet || [];
  const headers = json.resultSets?.[0]?.headers || [];
  const pidIdx = headers.indexOf('PERSON_ID');
  const firstLastIdx = headers.indexOf('DISPLAY_FIRST_LAST');
  const lastFirstIdx = headers.indexOf('DISPLAY_LAST_COMMA_FIRST');
  if (pidIdx === -1) return new Map();
  const map = new Map();
  for (const row of rows) {
    const id = String(row[pidIdx]);
    const name = (firstLastIdx >= 0 ? row[firstLastIdx] : null) || (lastFirstIdx >= 0 ? row[lastFirstIdx] : null);
    if (!id || !name || !/^\d+$/.test(id)) continue;
    const norm = normalizeForMatch(name);
    if (norm && !map.has(norm)) map.set(norm, id);
  }
  return map;
}

async function main() {
  console.log('Auto-mapping player IDs...\n');

  const nameToId = new Map();

  // 1. Basketball-GM roster
  console.log('1. Fetching Basketball-GM roster...');
  try {
    const bgm = await fetchBasketballGMRoster();
    for (const [k, v] of bgm) nameToId.set(k, v);
    console.log(`   Got ${bgm.size} name→ID entries\n`);
  } catch (e) {
    console.warn('   Failed:', e.message, '\n');
  }

  // 2. NBA commonallplayers (multiple seasons)
  const seasons = ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17', '2015-16', '2014-15', '2013-14', '2012-13', '2011-12', '2010-11'];
  console.log('2. Fetching stats.nba.com commonallplayers...');
  for (const season of seasons) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
    try {
      const m = await fetchCommonAllPlayers(season);
      let added = 0;
      for (const [k, v] of m) {
        if (!nameToId.has(k)) {
          nameToId.set(k, v);
          added++;
        }
      }
      console.log(`   ${season}: +${added} new (total ${nameToId.size})`);
    } catch (e) {
      console.warn(`   ${season}: ${e.message}`);
    }
  }

  // 3. Collect unmapped placeholders from trades
  const trades = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));
  const mappings = JSON.parse(fs.readFileSync(MAPPINGS_PATH, 'utf8'));
  const unmapped = new Map();
  for (const t of trades.trades || []) {
    for (const a of t.assets || []) {
      if (a.type === 'player' && a.nbaId?.startsWith('name-') && !mappings[a.nbaId]) {
        unmapped.set(a.nbaId, a.name);
      }
    }
    for (const a of t.assets || []) {
      if (a.type === 'pick' && a.drafted_player?.nbaId?.startsWith?.('name-') && !mappings[a.drafted_player.nbaId]) {
        unmapped.set(a.drafted_player.nbaId, a.drafted_player.name);
      }
    }
  }

  // 4. Match unmapped to nameToId
  let matched = 0;
  for (const [placeholderId, name] of unmapped) {
    const norm = normalizeForMatch(name);
    const id = nameToId.get(norm);
    if (id && /^\d+$/.test(id)) {
      mappings[placeholderId] = id;
      matched++;
    }
  }

  fs.writeFileSync(MAPPINGS_PATH, JSON.stringify(mappings, null, 2), 'utf8');
  console.log(`\n3. Matched ${matched} of ${unmapped.size} unmapped placeholders.`);
  console.log('   Updated', MAPPINGS_PATH);

  // 5. Apply mappings
  console.log('\n4. Applying mappings to trades.json...');
  const { execSync } = await import('child_process');
  execSync('node scripts/apply-player-id-mappings.mjs', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
