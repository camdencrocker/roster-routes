#!/usr/bin/env node
/**
 * Build waived-zerogp-index.json from BBR transactions.
 * Used by trades-loader to show "WAIVED" and "0 GP" badges on player nodes.
 *
 * Waived: player was waived within 1–3 calendar days of being traded (from BBR).
 * 0 GP: player-careers shows gp=0 for that team+season (spent season but never played).
 *
 * Run: node scripts/build-waived-zerogp-index.mjs
 * Output: app/data/waived-zerogp-index.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');

function normalizeName(name) {
  return (name || '')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .trim()
    .toLowerCase();
}

function daysBetween(d1, d2) {
  const a = new Date(d1 + 'T12:00:00').getTime();
  const b = new Date(d2 + 'T12:00:00').getTime();
  return Math.abs(Math.round((b - a) / (24 * 60 * 60 * 1000)));
}

function dateToSeason(dateStr) {
  const [y, m] = (dateStr || '').split('-').map(Number);
  if (!y || !m) return null;
  if (m >= 7) return `${y}-${String((y % 100) + 1).padStart(2, '0')}`;
  return `${y - 1}-${String(y % 100).padStart(2, '0')}`;
}

function main() {
  const waivedSet = new Set();

  // 1. Collect waived transactions from BBR
  const files = fs.readdirSync(DATA).filter((f) => f.endsWith('-transactions-bbref.json'));
  const waivedTxs = [];
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
    const arr = Array.isArray(data) ? data : (data.transactions || []);
    for (const tx of arr) {
      if (tx.type !== 'waived' || !tx.dateNorm || !tx.players?.length) continue;
      for (const p of tx.players) {
        waivedTxs.push({ player: normalizeName(p), waivedDate: tx.dateNorm });
      }
    }
  }

  // 2. Load trades, for each player asset check if waived within 1–3 days
  const tradesData = JSON.parse(fs.readFileSync(path.join(DATA, 'trades.json'), 'utf8'));
  for (const t of tradesData.trades || []) {
    const tradeDate = t.date;
    if (!tradeDate) continue;
    for (const a of t.assets || []) {
      if (a.type !== 'player' || !a.name) continue;
      const key = `${normalizeName(a.name)}|${tradeDate}`;
      if (waivedSet.has(key)) continue;
      for (const w of waivedTxs) {
        if (w.player === normalizeName(a.name) && daysBetween(tradeDate, w.waivedDate) <= 3) {
          waivedSet.add(key);
          break;
        }
      }
    }
  }

  // 3. Build 0 GP set from player-careers (nbaId|team|season where gp=0)
  const zerogpSet = new Set();
  const careersPath = path.join(DATA, 'player-careers.json');
  if (fs.existsSync(careersPath)) {
    const careers = JSON.parse(fs.readFileSync(careersPath, 'utf8'));
    for (const [nbaId, stints] of Object.entries(careers.players || {})) {
      for (const s of stints) {
        if (s.gp === 0 && s.team && s.season) {
          zerogpSet.add(`${nbaId}|${s.team}|${s.season}`);
        }
      }
    }
  }

  const out = {
    waived: Array.from(waivedSet),
    zerogpFormat: 'nbaId|team|season',
    zerogp: Array.from(zerogpSet),
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
  fs.writeFileSync(path.join(DATA, 'waived-zerogp-index.json'), JSON.stringify(out, null, 2), 'utf8');
  console.log('Built waived-zerogp-index.json:', out.waived.length, 'waived,', out.zerogp.length, '0 GP stints');
}

main();
