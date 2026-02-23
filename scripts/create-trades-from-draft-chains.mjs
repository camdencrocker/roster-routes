/**
 * Create Trade entries in trades.json from draft-picks-*-raw.json tradeChain data.
 * Parses "Team Traded • Player A • Player B to OtherTeam for • Player C • pick..." into
 * full Trade objects with player assets so those players get nodes in the tree.
 *
 * Run: node scripts/create-trades-from-draft-chains.mjs
 *   (reads all app/data/draft-picks-*-raw.json, app/data/trades.json, app/data/players.ts)
 * Or: node scripts/create-trades-from-draft-chains.mjs app/data/draft-picks-2021-raw.json
 *
 * Writes: trades.json (appends new trades), app/data/players-from-draft-trades.json (players
 * not in PLAYERS so search can find them).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../app/data');
const TRADES_PATH = path.join(DATA_DIR, 'trades.json');
const PLAYERS_TS_PATH = path.join(DATA_DIR, 'players.ts');
const PLAYERS_FROM_TRADES_PATH = path.join(DATA_DIR, 'players-from-draft-trades.json');

// Team name (as on prosportstransactions) → abbrev
const TEAM_ABBREV = {
  Hawks: 'ATL', Celtics: 'BOS', Nets: 'BKN', Hornets: 'CHA', Bulls: 'CHI', Cavaliers: 'CLE',
  Mavericks: 'DAL', Nuggets: 'DEN', Pistons: 'DET', Warriors: 'GSW', Rockets: 'HOU',
  Pacers: 'IND', Clippers: 'LAC', Lakers: 'LAL', Grizzlies: 'MEM', Heat: 'MIA',
  Bucks: 'MIL', Timberwolves: 'MIN', Pelicans: 'NOP', Knicks: 'NYK', Thunder: 'OKC',
  Magic: 'ORL', '76ers': 'PHI', Sixers: 'PHI', Suns: 'PHX', 'Trail Blazers': 'POR', Blazers: 'POR',
  Kings: 'SAC', Spurs: 'SAS', Raptors: 'TOR', Jazz: 'UTA', Wizards: 'WAS',
};

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'unknown';
}

function normalizeName(s) {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/['']/g, "'");
}

/** Heuristic: is this item a player name (not a pick/cash/TPE/rights)? */
function isPlayerName(item) {
  const lower = item.toLowerCase();
  if (lower.includes('round pick') || lower.includes('draft pick') || lower.includes('first round') || lower.includes('second round')) return false;
  if (lower.includes('cash') || lower.includes('consideration') || lower.includes('exception')) return false;
  if (lower.includes('rights to ') || lower.startsWith('rights to ')) return false;
  if (/\$\d|million|\.\d+m/i.test(lower)) return false;
  if (lower.includes('protected') || lower.includes('unprotected') || lower.includes('#\d+')) return false;
  if (lower.includes('swap') && lower.includes('pick')) return false;
  if (/^\d{4}\s/.test(item.trim())) return false;
  return true;
}

/** Parse one trade summary into { fromTeam, toTeam, sentItems[], receivedItems[] }. */
function parseSummary(summary) {
  const clean = (summary || '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').trim();
  // "Warriors  Traded • D'Angelo Russell • Jacob Evans to Timberwolves for • Andrew Wiggins • first round pick..."
  const forIdx = clean.indexOf(' for ');
  if (forIdx === -1) return null;
  const afterTradedIdx = clean.indexOf(' Traded ');
  if (afterTradedIdx === -1) return null;
  const fromTeam = clean.slice(0, afterTradedIdx).trim();
  const afterTraded = clean.slice(afterTradedIdx + 8); // after " Traded "
  const beforeFor = afterTraded.slice(0, afterTraded.indexOf(' for '));
  const receivedStr = afterTraded.slice(afterTraded.indexOf(' for ') + 6).trim();
  // Use last " to " before " for " so "Rights to X" / "X to Y" in item text don't break
  const lastTo = beforeFor.lastIndexOf(' to ');
  if (lastTo === -1) return null;
  const toTeam = beforeFor.slice(lastTo + 4).trim();
  const sentStr = beforeFor.slice(0, lastTo).trim();

  const splitBullets = (s) => s.split(/\s*•\s*/).map((x) => x.trim()).filter(Boolean);
  const sentItems = splitBullets(sentStr);
  const receivedItems = splitBullets(receivedStr);

  return { fromTeam, toTeam, sentItems, receivedItems };
}

/** Build name→id from app/data/players.ts. */
function loadNameToId() {
  const map = new Map();
  if (!fs.existsSync(PLAYERS_TS_PATH)) return map;
  const content = fs.readFileSync(PLAYERS_TS_PATH, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
    const fullNameDouble = line.match(/fullName:\s*"([^"]+)"/);
    const fullNameSingle = line.match(/fullName:\s*'([^']*)'/);
    const fullName = fullNameDouble ? fullNameDouble[1] : (fullNameSingle ? fullNameSingle[1] : null);
    if (idMatch && fullName) {
      const key = normalizeName(fullName);
      if (!map.has(key)) map.set(key, idMatch[1]);
    }
  }
  return map;
}

/** Collect all (date, summary) from draft-picks-*-raw.json, dedupe. */
function collectChains(rawPaths) {
  const seen = new Set();
  const out = [];
  for (const p of rawPaths) {
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    for (const pick of raw.picks || []) {
      const chain = pick.tradeChain || [];
      for (const t of chain) {
        if (!t.date || !t.summary) continue;
        const key = `${t.date}|${t.summary.trim()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ date: t.date, summary: t.summary });
      }
    }
  }
  return out;
}

/** Next trade id by season (e.g. 2020-21-001). */
function nextTradeId(trades, date) {
  const y = date.slice(0, 4);
  const nextYear = String(Number(y) + 1).slice(-2);
  const season = `${y}-${nextYear}`;
  const prefix = `${season}-`;
  const sameSeason = trades.filter((t) => t.id && t.id.startsWith(prefix));
  const nums = sameSeason.map((t) => parseInt(t.id.slice(-3), 10)).filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

/** Check if we already have a trade on this date with these two teams. */
function tradeExists(trades, date, fromAbbrev, toAbbrev) {
  const teamsSet = (t1, t2) => new Set([t1, t2].sort());
  const want = teamsSet(fromAbbrev, toAbbrev);
  for (const t of trades) {
    if (t.date !== date) continue;
    const have = teamsSet(...(t.teams || []));
    if (have.size === want.size && [...have].every((x) => want.has(x))) return true;
  }
  return false;
}

function main() {
  const rawGlob = process.argv[2]
    ? [path.resolve(process.argv[2])]
    : [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
        .map((y) => path.join(DATA_DIR, `draft-picks-${y}-raw.json`))
        .filter((p) => fs.existsSync(p));

  if (rawGlob.length === 0) {
    console.error('No draft-picks-*-raw.json files found. Run parse-draft-trades-from-file.mjs first.');
    process.exit(1);
  }

  const nameToId = loadNameToId();
  const chains = collectChains(rawGlob);
  const data = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));
  const trades = data.trades || [];
  const newPlayers = []; // { id, fullName, teamAbbreviation }
  const newTrades = [];
  const existingIds = new Set(trades.flatMap((t) => (t.assets || []).filter((a) => a.type === 'player').map((a) => a.nbaId)));

  for (const { date, summary } of chains) {
    const parsed = parseSummary(summary);
    if (!parsed) continue;

    const fromAbbrev = TEAM_ABBREV[parsed.fromTeam] || parsed.fromTeam.slice(0, 3).toUpperCase();
    const toAbbrev = TEAM_ABBREV[parsed.toTeam] || parsed.toTeam.slice(0, 3).toUpperCase();

    if (tradeExists(trades, date, fromAbbrev, toAbbrev)) continue;
    // Also skip if we're about to add it
    const alreadyAdded = newTrades.some(
      (t) => t.date === date && new Set([...(t.teams || [])]).has(fromAbbrev) && new Set([...(t.teams || [])]).has(toAbbrev)
    );
    if (alreadyAdded) continue;

    const assets = [];

    for (const item of parsed.sentItems) {
      if (!isPlayerName(item)) continue;
      const n = normalizeName(item);
      const nbaId = nameToId.get(n) || `name-${slugify(item)}`;
      if (!nameToId.has(n) && !existingIds.has(nbaId)) {
        newPlayers.push({ id: nbaId, fullName: item.trim(), teamAbbreviation: toAbbrev });
        existingIds.add(nbaId);
      }
      assets.push({ type: 'player', name: item.trim(), nbaId, from: fromAbbrev, to: toAbbrev });
    }
    for (const item of parsed.receivedItems) {
      if (!isPlayerName(item)) continue;
      const n = normalizeName(item);
      const nbaId = nameToId.get(n) || `name-${slugify(item)}`;
      if (!nameToId.has(n) && !existingIds.has(nbaId)) {
        newPlayers.push({ id: nbaId, fullName: item.trim(), teamAbbreviation: fromAbbrev });
        existingIds.add(nbaId);
      }
      assets.push({ type: 'player', name: item.trim(), nbaId, from: toAbbrev, to: fromAbbrev });
    }

    if (assets.length === 0) continue;

    const season = `${date.slice(0, 4)}-${String(Number(date.slice(0, 4)) + 1).slice(-2)}`;
    const id = nextTradeId([...trades, ...newTrades], date);
    newTrades.push({
      id,
      date,
      season,
      teams: [fromAbbrev, toAbbrev],
      summary: `From draft chain: ${parsed.fromTeam} ↔ ${parsed.toTeam}`,
      assets,
    });
  }

  if (newTrades.length === 0) {
    console.log('No new trades to add (all chains already present or no player assets).');
    return;
  }

  const dedupedNewPlayers = [];
  const byId = new Map();
  for (const p of newPlayers) {
    if (!byId.has(p.id)) {
      byId.set(p.id, p);
      dedupedNewPlayers.push(p);
    }
  }

  const existingFromFile = fs.existsSync(PLAYERS_FROM_TRADES_PATH)
    ? JSON.parse(fs.readFileSync(PLAYERS_FROM_TRADES_PATH, 'utf8'))
    : [];
  const mergedPlayers = [...existingFromFile];
  for (const p of dedupedNewPlayers) {
    if (!mergedPlayers.some((e) => e.id === p.id)) mergedPlayers.push(p);
  }

  data.trades = [...trades, ...newTrades].sort((a, b) => a.date.localeCompare(b.date));
  fs.writeFileSync(TRADES_PATH, JSON.stringify(data, null, 2));
  fs.writeFileSync(PLAYERS_FROM_TRADES_PATH, JSON.stringify(mergedPlayers, null, 2));

  console.log('Added', newTrades.length, 'trades from draft chains.');
  console.log('Wrote', TRADES_PATH);
  console.log('Players-from-draft-trades:', mergedPlayers.length, 'total;', dedupedNewPlayers.length, 'new this run.');
  console.log('Wrote', PLAYERS_FROM_TRADES_PATH);
}

main();
