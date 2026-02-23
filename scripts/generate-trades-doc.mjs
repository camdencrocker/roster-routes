#!/usr/bin/env node
/**
 * Generate docs/TRADES_NEEDING_PLAYER_IDS.md from trades with unmapped players.
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
      teams: (t.teams || []).join(' ↔ '),
      summary: (t.summary || '').slice(0, 80) + (t.summary?.length > 80 ? '…' : ''),
      unmappedPlayers: unmapped,
    });
  }
}

fuckedUpTrades.sort((a, b) => b.date.localeCompare(a.date));

const lines = [];
lines.push('# Trades With Unmapped Player IDs');
lines.push('');
lines.push('**Total trades affected:** ' + fuckedUpTrades.length);
lines.push('');
lines.push('**Fix:** Add entries to `app/data/player-id-mappings.json` in format:');
lines.push('```json');
lines.push('"placeholderId": "nbaId"');
lines.push('```');
lines.push('Then run: `node scripts/apply-player-id-mappings.mjs`');
lines.push('');
lines.push('**NBA ID lookup:** Basketball Reference or NBA Stats. Use numeric ID when available.');
lines.push('');
lines.push('---');
lines.push('');

fuckedUpTrades.slice(0, 200).forEach((t) => {
  lines.push('## ' + t.id + ' | ' + t.date + ' | ' + t.teams);
  lines.push('');
  t.unmappedPlayers.forEach((p) => {
    lines.push('- **' + p.name + '** — `' + p.placeholderId + '` → need NBA ID');
  });
  lines.push('');
});

if (fuckedUpTrades.length > 200) {
  lines.push('... and ' + (fuckedUpTrades.length - 200) + ' more trades.');
  lines.push('');
  lines.push('Full JSON: run `node scripts/list-trades-with-unmapped-players.mjs > docs/TRADES_NEEDING_PLAYER_IDS.json`');
}

fs.writeFileSync(path.join(__dirname, '../docs/TRADES_NEEDING_PLAYER_IDS.md'), lines.join('\n'), 'utf8');
console.log('Wrote docs/TRADES_NEEDING_PLAYER_IDS.md');
