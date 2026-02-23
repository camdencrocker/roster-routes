/**
 * Enrich trades.json: add drafted_player to 2025 picks that have "#NN - Player Name"
 * in description but no drafted_player. Does not duplicate — only adds where missing.
 * Run: node scripts/enrich-2025-draft-picks.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRADES_PATH = path.join(__dirname, '../app/data/trades.json');

// Match "2025 1st/2nd ... #NN - Player Name" and capture pickNumber and name
const PICK_DESC_REGEX = /#(\d+)\s*-\s*([^"]+?)\s*$/;

function enrichTrades() {
  const raw = fs.readFileSync(TRADES_PATH, 'utf8');
  const data = JSON.parse(raw);
  let added = 0;
  for (const trade of data.trades || []) {
    for (const asset of trade.assets || []) {
      if (asset.type !== 'pick') continue;
      if (asset.drafted_player) continue;
      const desc = asset.description || '';
      if (!desc.includes('2025') || !desc.includes('#')) continue;
      const m = desc.match(PICK_DESC_REGEX);
      if (!m) continue;
      const pickNumber = parseInt(m[1], 10);
      const name = m[2].trim().replace(/\)\s*$/, ''); // trim trailing ")" from description
      asset.drafted_player = { name, pickNumber };
      added++;
    }
  }
  fs.writeFileSync(TRADES_PATH, JSON.stringify(data, null, 2));
  return added;
}

const added = enrichTrades();
console.log('Added drafted_player to', added, '2025 pick(s).');
