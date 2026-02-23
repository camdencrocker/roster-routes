#!/usr/bin/env node
/**
 * List placeholder players that are NOT yet in player-id-mappings.json.
 * These are the players whose trade trees won't load when searched.
 *
 * Run: node scripts/list-unmapped-placeholders.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tradesPath = path.join(__dirname, '../app/data/trades.json');
const mappingsPath = path.join(__dirname, '../app/data/player-id-mappings.json');

const trades = JSON.parse(fs.readFileSync(tradesPath, 'utf8'));
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

const seen = new Map(); // placeholderId -> { name, tradeIds[] }
for (const t of trades.trades) {
  for (const a of t.assets || []) {
    if (a.type === 'player' && a.nbaId?.startsWith('name-') && !mappings[a.nbaId]) {
      if (!seen.has(a.nbaId)) seen.set(a.nbaId, { name: a.name, tradeIds: [] });
      seen.get(a.nbaId).tradeIds.push(t.id);
    }
  }
}

const list = [...seen.entries()]
  .sort((a, b) => a[1].name.localeCompare(b[1].name))
  .map(([placeholderId, { name, tradeIds }]) => ({ name, placeholderId, tradeCount: tradeIds.length, exampleTrade: tradeIds[0] }));

console.log(JSON.stringify(list, null, 2));
console.error(`\nTotal unmapped: ${list.length}`);
