#!/usr/bin/env node
/**
 * Parse BBR player index HTML (alphabetical A–Z) into a master player list.
 * Reads: app/data/player-index/*.html
 * Writes: app/data/player-index.json
 *
 * Run: node scripts/parse-player-index.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_DIR = path.join(__dirname, '../app/data/player-index');
const OUTPUT_PATH = path.join(__dirname, '../app/data/player-index.json');

function parseFile(html) {
  const players = [];
  const rowRegex = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
  const rows = html.match(rowRegex) || [];
  for (const row of rows) {
    const bbrefMatch = row.match(/data-append-csv="([^"]+)"/);
    const linkMatch = row.match(/<a href="\/players\/[^/]+\/([^"]+\.html)">([^<]*)<\/a>/);
    const yearMinMatch = row.match(/data-stat="year_min"[^>]*>([^<]*)</);
    const yearMaxMatch = row.match(/data-stat="year_max"[^>]*>([^<]*)</);
    const posMatch = row.match(/data-stat="pos"[^>]*>([^<]*)</);
    if (!bbrefMatch || !linkMatch) continue;
    const bbrefId = bbrefMatch[1];
    const name = (linkMatch[2] || '').trim();
    const hallOfFame = /data-stat="player"[^>]*>[\s\S]*?<\/a>\s*\*/.test(row);
    const active = /<strong>[\s\S]*<a href=.*players.*<\/a>[\s\S]*<\/strong>/.test(row);
    players.push({
      bbrefId,
      name,
      yearMin: yearMinMatch ? parseInt(yearMinMatch[1], 10) : null,
      yearMax: yearMaxMatch ? parseInt(yearMaxMatch[1], 10) : null,
      pos: posMatch ? posMatch[1].trim() : null,
      active,
      hallOfFame,
    });
  }
  return players;
}

function main() {
  const files = fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith('.html'));
  if (files.length === 0) {
    console.error('No HTML files in', INPUT_DIR);
    process.exit(1);
  }

  const all = [];
  const seen = new Set();
  for (const f of files.sort()) {
    const html = fs.readFileSync(path.join(INPUT_DIR, f), 'utf8');
    const players = parseFile(html);
    for (const p of players) {
      if (!seen.has(p.bbrefId)) {
        seen.add(p.bbrefId);
        all.push(p);
      }
    }
    console.log(f, '→', players.length, 'players');
  }

  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const foundLetters = allLetters.filter((l) =>
    files.some((f) => f.toLowerCase().includes(`starting with ${l.toLowerCase()} `)),
  );
  const missingLetters = allLetters.filter((l) => !foundLetters.includes(l));
  // X: no NBA/ABA players ever had last names starting with X
  const output = {
    source: 'Basketball Reference player index (A–Z)',
    parsedAt: new Date().toISOString(),
    totalPlayers: all.length,
    lettersCovered: foundLetters.length,
    missingLetters: missingLetters.filter((l) => l !== 'X'),
    note: 'X has no players on BBR.',
    players: all,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
  console.log('\nTotal:', all.length, 'unique players');
  console.log('Wrote', OUTPUT_PATH);
  if (output.missingLetters.length) {
    console.log('Missing letters (save these pages):', output.missingLetters.join(', '));
  }
}

main();
