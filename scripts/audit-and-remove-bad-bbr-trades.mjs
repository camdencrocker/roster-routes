#!/usr/bin/env node
/**
 * Remove BBR trades that came from 3-team transactions (wrong from/to).
 * Builds set of (date, team1, team2) from 3-team BBR transactions, then removes
 * matching bbr trades from trades.json.
 *
 * Run: node scripts/audit-and-remove-bad-bbr-trades.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');
const TRADES_PATH = path.join(DATA, 'trades.json');

function main() {
  const threeTeamKeys = new Set();
  const files = fs.readdirSync(DATA).filter((f) => f.endsWith('-transactions-bbref.json'));

  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
    for (const tx of data) {
      if (tx.type !== 'traded' || !tx.dateNorm) continue;
      const text = (tx.text || '').toLowerCase();
      if (!text.includes('3-team') && !text.includes('in a 3-team')) continue;
      const team = tx.team;
      const teamTo = tx.teamTo || tx.team;
      if (!team || !teamTo || team === teamTo) continue;
      const key = `${tx.dateNorm}|${[team, teamTo].sort().join(',')}`;
      threeTeamKeys.add(key);
    }
  }

  const tradesData = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));
  const before = tradesData.trades.length;
  const toRemove = [];

  for (const t of tradesData.trades) {
    if (!t.id || !t.id.includes('bbr-')) continue;
    const teams = [...(t.teams || [])].sort();
    if (teams.length < 2) continue;
    const key = `${t.date}|${teams.join(',')}`;
    if (threeTeamKeys.has(key)) {
      toRemove.push({ id: t.id, date: t.date, teams: teams.join(',') });
    }
  }

  const removeIds = new Set(toRemove.map((r) => r.id));
  const KEEP_MANUALLY_FIXED = ['2021-22-bbr-0613'];
  for (const id of KEEP_MANUALLY_FIXED) {
    removeIds.delete(id);
  }

  tradesData.trades = tradesData.trades.filter((t) => !removeIds.has(t.id));
  tradesData.lastUpdated = new Date().toISOString().slice(0, 10);

  fs.writeFileSync(TRADES_PATH, JSON.stringify(tradesData, null, 2), 'utf8');

  console.log('Removed', toRemove.length, 'BBR trades from 3-team transactions');
  console.log('Kept 2021-22-bbr-0613 (Celtics/Nuggets/Spurs - manually corrected)');
  console.log('Before:', before, 'After:', tradesData.trades.length);
}

main();
