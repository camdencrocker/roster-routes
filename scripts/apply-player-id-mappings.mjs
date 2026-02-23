#!/usr/bin/env node
/**
 * Apply player ID mappings from app/data/player-id-mappings.json to trades.json.
 * Replaces placeholder nbaIds (name-*) with real NBA IDs.
 *
 * Run: node scripts/apply-player-id-mappings.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');
const MAPPINGS_PATH = path.join(DATA, 'player-id-mappings.json');
const TRADES_PATH = path.join(DATA, 'trades.json');

const mappings = JSON.parse(fs.readFileSync(MAPPINGS_PATH, 'utf8'));
const data = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));

let applied = 0;
for (const t of data.trades) {
  for (const a of t.assets || []) {
    if (a.type === 'player' && a.nbaId?.startsWith('name-') && mappings[a.nbaId] && typeof mappings[a.nbaId] === 'string') {
      a.nbaId = mappings[a.nbaId];
      applied++;
    }
  }
}

data.lastUpdated = new Date().toISOString().slice(0, 10);
fs.writeFileSync(TRADES_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log('Applied', applied, 'player ID mappings.');
