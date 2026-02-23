#!/usr/bin/env node
/**
 * Merge BBR transaction JSON into trades.json.
 * Reads all *-transactions-bbref.json, filters type=traded, parses, dedupes, merges.
 *
 * Run: node scripts/merge-bbref-transactions-into-trades.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');

function buildNameToNbaId() {
  const map = new Map();
  const trades = JSON.parse(fs.readFileSync(path.join(DATA, 'trades.json'), 'utf8'));
  const mappings = JSON.parse(fs.readFileSync(path.join(DATA, 'player-id-mappings.json'), 'utf8'));

  for (const t of trades.trades || []) {
    for (const a of t.assets || []) {
      if (a.type === 'player' && a.name && a.nbaId) {
        const key = normalizeName(a.name);
        if (!map.has(key) || /^\d+$/.test(String(a.nbaId))) {
          map.set(key, a.nbaId);
        }
      }
    }
  }
  for (const [nameSlug, nbaId] of Object.entries(mappings)) {
    if (nameSlug.startsWith('name-') && typeof nbaId === 'string' && /^\d+$/.test(nbaId)) {
      const name = nameSlug.replace(/^name-/, '').replace(/-/g, ' ');
      map.set(normalizeName(name), nbaId);
    }
  }
  return map;
}

function normalizeName(name) {
  return (name || '')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .trim()
    .toLowerCase();
}

function slugify(name) {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function parseTradeText(text, players) {
  const sentParts = [];
  const receivedParts = [];
  if (!text) return { sent: sentParts, received: receivedParts };

  const t = text.toLowerCase();
  const toMatch = t.match(/\btraded\s+(.+?)\s+to\s+(?:the\s+)?/i);
  const forMatch = t.match(/\bfor\s+(.+?)(?:\.|$)/i);
  const sentStr = toMatch ? toMatch[1] : '';
  const receivedStr = forMatch ? forMatch[1] : '';

  if (Array.isArray(players) && players.length > 0) {
    for (const p of players) {
      const pNorm = normalizeName(p);
      const pLower = p.toLowerCase();
      if (sentStr.toLowerCase().includes(pLower) || sentStr.toLowerCase().includes(pNorm)) {
        sentParts.push(p);
      } else if (receivedStr.toLowerCase().includes(pLower) || receivedStr.toLowerCase().includes(pNorm)) {
        receivedParts.push(p);
      } else {
        receivedParts.push(p);
      }
    }
  }
  return { sent: sentParts, received: receivedParts };
}

/** Extract pick descriptions from a string like "a 2028 1st round draft pick" or "a 2024 1st round draft pick (Isaiah Collier was later selected)" */
function extractPicksFromStr(str) {
  if (!str || typeof str !== 'string') return [];
  const picks = [];
  const re = /(\d{4})\s*(1st|2nd)\s*round\s*draft\s*pick(?:\s*\(([^)]+)\s*(?:was later selected|was later chosen)\))?/gi;
  let m;
  while ((m = re.exec(str)) !== null) {
    const drafted = m[3]?.trim();
    picks.push({
      description: drafted ? `${m[1]} ${m[2]} (${drafted})` : `${m[1]} ${m[2]}`,
      drafted,
    });
  }
  return picks;
}

function parseSeasonFromFilename(f) {
  const m = f.match(/^(\d{4})-(\d{2})-transactions-bbref\.json$/);
  if (!m) return null;
  const start = parseInt(m[1], 10);
  const end = parseInt(m[2], 10);
  return `${start}-${String(end).padStart(2, '0')}`;
}

function tradeKey(t) {
  const teams = [...new Set([t.team, t.teamTo].filter(Boolean))].sort();
  const players = [...(t.players || [])].sort();
  return `${t.dateNorm}|${teams.join(',')}|${players.join(',')}`;
}

function main() {
  const nameToNbaId = buildNameToNbaId();
  const existingTrades = JSON.parse(fs.readFileSync(path.join(DATA, 'trades.json'), 'utf8'));
  const existingIds = new Set((existingTrades.trades || []).map((t) => t.id));
  const existingKeys = new Set();
  for (const t of existingTrades.trades || []) {
    const date = t.date;
    const teams = [...(t.teams || [])].sort().join(',');
    const assets = (t.assets || []).filter((a) => a.type === 'player').map((a) => a.name).sort();
    existingKeys.add(`${date}|${teams}|${assets.join(',')}`);
  }

  const files = fs.readdirSync(DATA).filter((f) => f.endsWith('-transactions-bbref.json'));
  const allBbrTrades = [];
  for (const f of files) {
    const season = parseSeasonFromFilename(f);
    if (!season) continue;
    const data = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
    for (const tx of data) {
      if (tx.type !== 'traded' || !tx.team || !tx.dateNorm) continue;
      if ((tx.text || '').toLowerCase().includes('3-team') || (tx.text || '').toLowerCase().includes('in a 3-team')) continue;
      const teamTo = tx.teamTo || tx.team;
      if (tx.team === teamTo) continue;
      const { sent, received } = parseTradeText(tx.text, tx.players || []);
      allBbrTrades.push({
        dateNorm: tx.dateNorm,
        season,
        team: tx.team,
        teamTo,
        sent,
        received,
        text: tx.text,
      });
    }
  }

  const seen = new Map();
  let bbrCount = 0;
  for (const b of allBbrTrades) {
    const teams = [b.team, b.teamTo].sort();
    const allPlayers = [...new Set([...b.sent, ...b.received])].sort();
    const key = `${b.dateNorm}|${teams.join(',')}|${allPlayers.join(',')}`;
    if (seen.has(key)) continue;
    seen.set(key, true);

    if (existingKeys.has(key)) continue;

    const assets = [];
    for (const p of b.sent) {
      const nbaId = nameToNbaId.get(normalizeName(p)) || `name-${slugify(p)}`;
      assets.push({ type: 'player', name: p, nbaId, from: b.team, to: b.teamTo });
    }
    for (const p of b.received) {
      const nbaId = nameToNbaId.get(normalizeName(p)) || `name-${slugify(p)}`;
      assets.push({ type: 'player', name: p, nbaId, from: b.teamTo, to: b.team });
    }
    // Pick-for-pick: if no players, parse picks from text
    if (assets.length === 0) {
      const toMatch = (b.text || '').match(/\btraded\s+(.+?)\s+to\s+(?:the\s+)?/i);
      const forMatch = (b.text || '').match(/\bfor\s+(.+?)(?:\.|$)/i);
      const sentStr = toMatch ? toMatch[1] : '';
      const receivedStr = forMatch ? forMatch[1] : '';
      const sentPicks = extractPicksFromStr(sentStr);
      const receivedPicks = extractPicksFromStr(receivedStr);
      for (const p of sentPicks) {
        assets.push({ type: 'pick', description: p.description, from: b.team, to: b.teamTo });
      }
      for (const p of receivedPicks) {
        assets.push({ type: 'pick', description: p.description, from: b.teamTo, to: b.team });
      }
    }
    if (assets.length === 0) continue;

    bbrCount++;
    const id = `${b.season}-bbr-${String(bbrCount).padStart(4, '0')}`;

    const summary = b.text?.slice(0, 80).replace(/\s+/g, ' ').trim() || `${b.team} ↔ ${b.teamTo}`;
    existingTrades.trades.push({
      id,
      date: b.dateNorm,
      season: b.season,
      teams,
      summary,
      assets,
    });
    existingKeys.add(key);
  }

  existingTrades.lastUpdated = new Date().toISOString().slice(0, 10);
  existingTrades.trades.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  fs.writeFileSync(path.join(DATA, 'trades.json'), JSON.stringify(existingTrades, null, 2), 'utf8');
  console.log('Merged BBR trades into trades.json. Total trades:', existingTrades.trades.length);
}

main();
