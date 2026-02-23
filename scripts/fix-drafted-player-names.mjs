/**
 * One-time fix: trim trailing ")" from drafted_player.name in trades.json
 * (Enrich script captured it from descriptions like "2025 1st (LAL #22 - Drake Powell)".)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRADES_PATH = path.join(__dirname, '../app/data/trades.json');

const data = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));
let fixed = 0;
for (const trade of data.trades || []) {
  for (const asset of trade.assets || []) {
    if (asset.drafted_player?.name?.endsWith(')')) {
      asset.drafted_player.name = asset.drafted_player.name.replace(/\)\s*$/, '').trim();
      fixed++;
    }
  }
}
fs.writeFileSync(TRADES_PATH, JSON.stringify(data, null, 2));
console.log('Fixed', fixed, 'drafted_player name(s).');
