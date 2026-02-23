#!/usr/bin/env node
/**
 * Audit BBR traded transactions vs trades.json.
 * Reads all *-transactions-bbref.json and logs every traded tx with status: have | missing.
 * Must not lose any trade — this script verifies coverage.
 *
 * Run: node scripts/audit-bbr-trades-coverage.mjs
 * Output: docs/BBR_TRADES_COVERAGE_AUDIT.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');
const OUT = path.join(__dirname, '../docs/BBR_TRADES_COVERAGE_AUDIT.md');

// Normalize to canonical: we use BKN/CHO in trades.json; BBR uses BRK/CHA
function normTeam(t) {
  if (!t) return t;
  const u = t.toUpperCase();
  if (u === 'BRK') return 'BKN';
  if (u === 'CHA') return 'CHO';
  return u;
}

function main() {
  const tradesData = JSON.parse(fs.readFileSync(path.join(DATA, 'trades.json'), 'utf8'));
  const ourTrades = tradesData.trades || [];

  // Build: for each (date, teams) do we have a trade?
  const ourByDate = new Map();
  ourTrades.forEach((t) => {
    const date = t.date;
    const teams = new Set((t.teams || []).map((x) => normTeam(x.toUpperCase())));
    if (!ourByDate.has(date)) ourByDate.set(date, []);
    ourByDate.get(date).push(teams);
  });

  const files = fs.readdirSync(DATA).filter((f) => f.endsWith('-transactions-bbref.json'));
  const results = [];
  let haveCount = 0;
  let missingCount = 0;

  for (const f of files) {
    const m = f.match(/^(\d{4})-(\d{2})-transactions-bbref\.json$/);
    if (!m) continue;
    const season = `${m[1]}-${m[2]}`;
    const data = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
    const arr = Array.isArray(data) ? data : (data.transactions || []);

    for (let i = 0; i < arr.length; i++) {
      const tx = arr[i];
      if (tx.type !== 'traded' || !tx.dateNorm) continue;
      const teamTo = tx.teamTo || tx.team;
      if (!tx.team || !teamTo || tx.team === teamTo) continue;

      const bbrTeams = new Set([normTeam(tx.team), normTeam(teamTo)].map((x) => x.toUpperCase()));
      const sameDate = ourByDate.get(tx.dateNorm) || [];
      const match = sameDate.some((oTeams) => {
        return [...bbrTeams].every((x) => oTeams.has(x.toUpperCase()));
      });

      const status = match ? 'have' : 'missing';
      if (match) haveCount++;
      else missingCount++;

      results.push({
        season,
        idx: i,
        date: tx.dateNorm,
        status,
        teams: [tx.team, teamTo].join('↔'),
        players: (tx.players || []).length,
        text: (tx.text || '').trim().slice(0, 150),
      });
    }
  }

  const lines = [
    '# BBR Trades Coverage Audit',
    '',
    'Generated: ' + new Date().toISOString().slice(0, 10),
    '',
    '| Status | Count |',
    '|--------|-------|',
    '| have   | ' + haveCount + ' |',
    '| missing| ' + missingCount + ' |',
    '',
    '## All BBR Traded Transactions (by reading files)',
    '',
    '| Season | # | Date | Status | Teams | Players | Text |',
    '|--------|---|------|--------|-------|---------|------|',
  ];

  for (const r of results) {
    const textEsc = (r.text || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    lines.push(`| ${r.season} | ${r.idx} | ${r.date} | ${r.status} | ${r.teams} | ${r.players} | ${textEsc} |`);
  }

  lines.push('');
  lines.push('## Missing Only');
  lines.push('');
  const missing = results.filter((r) => r.status === 'missing');
  for (const r of missing) {
    lines.push(`- **${r.season}** #${r.idx} ${r.date} ${r.teams} (${r.players} players) — ${r.text}`);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.log('Audit complete. have:', haveCount, 'missing:', missingCount);
  console.log('Wrote', OUT);
}

main();
