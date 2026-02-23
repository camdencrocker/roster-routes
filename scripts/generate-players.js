#!/usr/bin/env node
/**
 * Generates app/data/players.json from Basketball-GM roster.
 * Run: node scripts/generate-players.js
 * Requires network. Update periodically (e.g. monthly).
 */
const fs = require('fs');
const path = require('path');

const TID_TO_ABBREV = {
  0: 'ATL', 1: 'BOS', 2: 'BKN', 3: 'CHA', 4: 'CHI', 5: 'CLE', 6: 'DAL',
  7: 'DEN', 8: 'DET', 9: 'GSW', 10: 'HOU', 11: 'IND', 12: 'LAC', 13: 'LAL',
  14: 'MEM', 15: 'MIA', 16: 'MIL', 17: 'MIN', 18: 'NOP', 19: 'NYK',
  20: 'OKC', 21: 'ORL', 22: 'PHI', 23: 'PHX', 24: 'POR', 25: 'SAC',
  26: 'SAS', 27: 'TOR', 28: 'UTA', 29: 'WAS', '-2': 'DRF',
};

async function main() {
  const url = 'https://raw.githubusercontent.com/alexnoob/BasketBall-GM-Rosters/master/2024-25.NBA.Roster.json';
  const res = await fetch(url);
  const data = await res.json();
  const players = data.players || [];

  const out = [];
  const seen = new Set();

  for (const p of players) {
    const imgURL = p.imgURL || '';
    const match = imgURL.match(/(\d+)\.png$/);
    if (!match) continue; // Skip ESPN or non-NBA headshots
    const id = match[1];
    if (seen.has(id)) continue;
    seen.add(id);

    const tid = p.tid != null ? String(p.tid) : '-2';
    const teamAbbreviation = TID_TO_ABBREV[tid] || 'TBD';
    if (teamAbbreviation === 'DRF') continue; // Skip draft-only

    out.push({
      id,
      fullName: p.name || 'Unknown',
      teamAbbreviation,
    });
  }

  const dir = path.join(__dirname, '..', 'app', 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'players.json'),
    JSON.stringify(out, null, 0),
    'utf8'
  );
  console.log(`Wrote ${out.length} players to app/data/players.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
