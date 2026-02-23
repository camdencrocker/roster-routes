#!/usr/bin/env node
/**
 * List trades that contain players with unmapped placeholder IDs.
 * Output: trades grouped by trade, with player names and placeholderIds that need mapping.
 *
 * Run: node scripts/list-trades-with-unmapped-players.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tradesPath = path.join(__dirname, '../app/data/trades.json');
const mappingsPath = path.join(__dirname, '../app/data/player-id-mappings.json');

const trades = JSON.parse(fs.readFileSync(tradesPath, 'utf8'));
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

const fuckedUpTrades = [];
for (const t of trades.trades) {
  const unmapped = [];
  for (const a of t.assets || []) {
    if (a.type === 'player' && a.nbaId?.startsWith('name-') && !mappings[a.nbaId]) {
      unmapped.push({ name: a.name, placeholderId: a.nbaId });
    }
  }
  if (unmapped.length > 0) {
    fuckedUpTrades.push({
      id: t.id,
      date: t.date,
      season: t.season,
      teams: t.teams?.join(' ↔ ') || '',
      summary: (t.summary || '').slice(0, 80) + (t.summary?.length > 80 ? '…' : ''),
      unmappedPlayers: unmapped,
    });
  }
}

// Sort by date desc
fuckedUpTrades.sort((a, b) => b.date.localeCompare(a.date));

console.log(JSON.stringify(fuckedUpTrades, null, 2));
console.error(`\nTrades with unmapped players: ${fuckedUpTrades.length}`);
