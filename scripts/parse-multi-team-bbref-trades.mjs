#!/usr/bin/env node
/**
 * Parse multi-team (3+, 4+, 5+ team) BBR transactions and add to trades.json.
 * BBR text explicitly states "the X traded Y to Z" for each leg.
 *
 * Run: node scripts/parse-multi-team-bbref-trades.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');

const TEAM_NAMES = {
  'atlanta hawks': 'ATL', 'boston celtics': 'BOS', 'brooklyn nets': 'BKN', 'charlotte hornets': 'CHA',
  'charlotte bobcats': 'CHO', 'chicago bulls': 'CHI', 'cleveland cavaliers': 'CLE',
  'dallas mavericks': 'DAL', 'denver nuggets': 'DEN', 'detroit pistons': 'DET',
  'golden state warriors': 'GSW', 'houston rockets': 'HOU', 'indiana pacers': 'IND',
  'los angeles clippers': 'LAC', 'los angeles lakers': 'LAL', 'memphis grizzlies': 'MEM',
  'miami heat': 'MIA', 'milwaukee bucks': 'MIL', 'minnesota timberwolves': 'MIN',
  'new orleans pelicans': 'NOP', 'new orleans hornets': 'NOH', 'new york knicks': 'NYK',
  'oklahoma city thunder': 'OKC', 'orlando magic': 'ORL', 'philadelphia 76ers': 'PHI',
  'phoenix suns': 'PHX', 'phoenix suns': 'PHO', 'portland trail blazers': 'POR',
  'sacramento kings': 'SAC', 'san antonio spurs': 'SAS', 'toronto raptors': 'TOR',
  'utah jazz': 'UTA', 'washington wizards': 'WAS', 'new jersey nets': 'NJN',
};

function teamToAbbrev(name) {
  if (!name) return null;
  const n = name.trim().toLowerCase().replace(/\s+/g, ' ');
  for (const [key, abbr] of Object.entries(TEAM_NAMES)) {
    if (n.includes(key) || key.includes(n)) return abbr;
  }
  if (n.length <= 4 && /^[a-z]{3}$/i.test(n)) return n.toUpperCase();
  return null;
}

function slugify(name) {
  return (name || '').trim().toLowerCase()
    .replace(/['']/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function parseClauses(text) {
  const clauses = [];
  const re = /the ([^;]+?) traded ([^;]+?) to (?:the )?([^;.]+?)(?:\s*;|\.|$)/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const fromName = m[1].trim();
    const itemsStr = m[2].trim();
    const toName = m[3].trim();
    const from = teamToAbbrev(fromName);
    const to = teamToAbbrev(toName);
    if (!from || !to || from === to) continue;
    clauses.push({ from, to, itemsStr, fromName, toName });
  }
  return clauses;
}

function extractPlayersFromItems(itemsStr, allPlayers) {
  const found = [];
  const lower = itemsStr.toLowerCase();
  const draftedMatch = itemsStr.match(/\(([^)]+)\s*(?:was later selected|was later chosen)/i);
  const draftedName = draftedMatch ? draftedMatch[1].trim().toLowerCase() : null;
  for (const p of allPlayers) {
    if (!p) continue;
    if (draftedName && p.toLowerCase().includes(draftedName)) continue;
    const pNorm = p.replace(/['']/g, '').trim();
    if (lower.includes(pNorm.toLowerCase()) || lower.includes(p.replace(/'/g, "'").toLowerCase())) {
      found.push(p);
    }
  }
  return found;
}

function extractPicksFromItems(itemsStr) {
  const picks = [];
  const re = /(\d{4})\s*(1st|2nd)\s*round\s*draft\s*pick(?:\s*\(([^)]+)\s*(?:was later selected|was later chosen))?/gi;
  let m;
  while ((m = re.exec(itemsStr)) !== null) {
    const year = m[1];
    const round = m[2];
    const drafted = m[3]?.trim();
    picks.push({ year, round, drafted, raw: m[0] });
  }
  return picks;
}

function buildNameToNbaId() {
  const map = new Map();
  const trades = JSON.parse(fs.readFileSync(path.join(DATA, 'trades.json'), 'utf8'));
  const mappings = JSON.parse(fs.readFileSync(path.join(DATA, 'player-id-mappings.json'), 'utf8'));
  for (const t of trades.trades || []) {
    for (const a of t.assets || []) {
      if (a.type === 'player' && a.name && a.nbaId) {
        const key = a.name.toLowerCase().trim();
        if (!map.has(key) || /^\d+$/.test(String(a.nbaId))) map.set(key, a.nbaId);
      }
    }
  }
  for (const [slug, nbaId] of Object.entries(mappings)) {
    if (slug.startsWith('name-') && typeof nbaId === 'string') {
      const name = slug.replace(/^name-/, '').replace(/_/g, ' ');
      map.set(name.toLowerCase(), nbaId);
    }
  }
  return map;
}

function main() {
  const nameToNbaId = buildNameToNbaId();
  const tradesData = JSON.parse(fs.readFileSync(path.join(DATA, 'trades.json'), 'utf8'));
  const existingKeys = new Set();
  for (const t of tradesData.trades || []) {
    const teams = [...(t.teams || [])].sort().join(',');
    const assets = (t.assets || []).filter(a => a.type === 'player').map(a => a.name).sort().join(',');
    existingKeys.add(`${t.date}|${teams}|${assets}`);
  }

  const files = fs.readdirSync(DATA).filter(f => f.endsWith('-transactions-bbref.json'));
  const seasonFromFile = (f) => {
    const m = f.match(/^(\d{4})-(\d{2})-transactions-bbref\.json$/);
    return m ? `${m[1]}-${m[2]}` : null;
  };

  let added = 0;
  const log = [];

  for (const f of files) {
    const season = seasonFromFile(f);
    if (!season) continue;
    const data = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));

    for (const tx of data) {
      if (tx.type !== 'traded' || !tx.dateNorm || !tx.text) continue;
      const text = tx.text.toLowerCase();
      if (!text.includes('3-team') && !text.includes('4-team') && !text.includes('5-team') &&
          !text.includes('in a 3-team') && !text.includes('in a 4-team')) continue;

      const clauses = parseClauses(tx.text);
      if (clauses.length < 2) continue;

      const allTeams = new Set();
      const assets = [];
      const allPlayers = tx.players || [];

      for (const c of clauses) {
        allTeams.add(c.from);
        allTeams.add(c.to);
        const players = extractPlayersFromItems(c.itemsStr, allPlayers);
        const picks = extractPicksFromItems(c.itemsStr);
        for (const p of players) {
          const nbaId = nameToNbaId.get(p.toLowerCase()) || nameToNbaId.get(p.toLowerCase().replace(/'/g, "'")) || `name-${slugify(p)}`;
          assets.push({ type: 'player', name: p, nbaId, from: c.from, to: c.to });
        }
        for (const p of picks) {
          const desc = p.drafted ? `${p.year} ${p.round} (${p.drafted})` : `${p.year} ${p.round}`;
          assets.push({ type: 'pick', description: desc, from: c.from, to: c.to });
        }
      }

      const teams = [...allTeams].sort();
      const assetsKey = assets.filter(a => a.type === 'player').map(a => a.name).sort().join(',');
      const key = `${tx.dateNorm}|${teams.join(',')}|${assetsKey}`;
      if (existingKeys.has(key)) continue;
      if (assets.length === 0) continue;

      const id = `${season}-multi-${String(added + 1).padStart(3, '0')}`;
      const summary = `Multi-team: ${teams.join(', ')}`;
      tradesData.trades.push({
        id,
        date: tx.dateNorm,
        season,
        teams,
        summary,
        assets,
      });
      existingKeys.add(key);
      added++;
      log.push({ date: tx.dateNorm, teams: teams.join(','), teamsCount: teams.length });
    }
  }

  tradesData.trades.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  tradesData.lastUpdated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(DATA, 'trades.json'), JSON.stringify(tradesData, null, 2), 'utf8');

  console.log('Added', added, 'multi-team trades');
  log.forEach(l => console.log(' ', l.date, l.teamsCount, 'teams:', l.teams));
}

main();
