#!/usr/bin/env node
/**
 * List all players with placeholder nbaIds (name-*) in trades.json.
 * Use this to know who needs a real ID. Add mappings to app/data/player-id-mappings.json.
 *
 * Run: node scripts/list-placeholder-players.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/data/trades.json'), 'utf8'));

const seen = new Map();
for (const t of data.trades) {
  for (const a of t.assets || []) {
    if (a.type === 'player' && a.nbaId?.startsWith('name-')) {
      seen.set(a.nbaId, a.name);
    }
  }
}

const list = [...seen.entries()].sort((a, b) => a[0].localeCompare(b[0]));
console.log(JSON.stringify(list.map(([id, name]) => ({ name, placeholderId: id })), null, 2));
