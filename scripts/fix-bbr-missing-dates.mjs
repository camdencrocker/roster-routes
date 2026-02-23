#!/usr/bin/env node
/**
 * Fix BBR transactions with dateNorm: null by using date from trades.json or PST.
 * Run after parse-bbref-transactions, before merge.
 *
 * When BBR has no date (?), look up matching trade in trades.json by (teams, players).
 * If found, set dateNorm so the trade can be merged/audited.
 *
 * Run: node scripts/fix-bbr-missing-dates.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');

function normalizeName(n) {
  return (n || '').toLowerCase().replace(/['']/g, "'").trim();
}

function main() {
  const tradesData = JSON.parse(fs.readFileSync(path.join(DATA, 'trades.json'), 'utf8'));
  const ourTrades = tradesData.trades || [];

  const files = fs.readdirSync(DATA).filter((f) => f.endsWith('-transactions-bbref.json'));
  let fixed = 0;

  for (const f of files) {
    const filePath = path.join(DATA, f);
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const isArray = Array.isArray(raw);
    const arr = isArray ? raw : (raw.transactions || []);

    for (const tx of arr) {
      if (tx.type !== 'traded' || tx.dateNorm != null) continue;
      const team = tx.team;
      const teamTo = tx.teamTo || tx.team;
      if (!team || !teamTo) continue;

      const teams = new Set([team, teamTo].map((t) => t.toUpperCase()));
      const players = new Set((tx.players || []).map(normalizeName));

      for (const t of ourTrades) {
        const tTeams = new Set((t.teams || []).map((x) => x.toUpperCase()));
        if (tTeams.size !== teams.size || [...teams].some((x) => !tTeams.has(x))) continue;

        const tPlayers = new Set();
        for (const a of t.assets || []) {
          if (a.type === 'player' && a.name) tPlayers.add(normalizeName(a.name));
        }
        const matchCount = [...players].filter((p) => tPlayers.has(p)).length;
        if (matchCount < Math.min(players.size, 1)) continue;

        tx.dateNorm = t.date;
        tx.date = t.date;
        fixed++;
        console.log('Fixed:', f, tx.dateNorm, [team, teamTo].join('↔'), (tx.text || '').slice(0, 60));
        break;
      }
    }

    const out = isArray ? arr : { ...raw, transactions: arr };
    fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf8');
  }

  console.log('Fixed', fixed, 'BBR transactions with missing dates');
}

main();
