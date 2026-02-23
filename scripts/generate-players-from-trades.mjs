#!/usr/bin/env node
/**
 * Generate app/data/players-from-trades.json from trades.json.
 * Run after adding trades to keep search in sync.
 *
 * Run: node scripts/generate-players-from-trades.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tradesPath = path.join(__dirname, '../app/data/trades.json');
const outPath = path.join(__dirname, '../app/data/players-from-trades.json');

const data = JSON.parse(fs.readFileSync(tradesPath, 'utf8'));
const seen = new Map();

for (const t of data.trades || []) {
  for (const a of t.assets || []) {
    if (a.type === 'player' && a.name) {
      const id = a.nbaId && /^\d+$/.test(String(a.nbaId)) ? String(a.nbaId) : (a.nbaId || `name-${(a.name || '').toLowerCase().replace(/['']/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`);
      const to = a.to || 'FA';
      const name = (a.name || '')
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();
      if (!seen.has(id) || /^\d+$/.test(id)) {
        seen.set(id, { id, fullName: name, teamAbbreviation: to });
      }
    }
  }
}

const arr = [...seen.values()].sort((a, b) => a.fullName.localeCompare(b.fullName));
fs.writeFileSync(outPath, JSON.stringify(arr, null, 2), 'utf8');
console.log('Wrote', arr.length, 'players to', outPath);
