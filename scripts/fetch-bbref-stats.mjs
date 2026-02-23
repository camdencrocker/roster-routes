#!/usr/bin/env node
/**
 * Basketball Reference stats: fetch (scrape) a URL or parse a saved HTML file.
 *
 * Usage:
 *   node scripts/fetch-bbref-stats.mjs <URL_or_file> [--out=path.json] [--no-fetch]
 *
 * Examples:
 *   # Scrape (fetch) a player's page and parse per-game stats
 *   node scripts/fetch-bbref-stats.mjs "https://www.basketball-reference.com/players/j/jamesle01.html"
 *
 *   # Scrape the league per-game table (all players for one season)
 *   node scripts/fetch-bbref-stats.mjs "https://www.basketball-reference.com/leagues/NBA_2025_per_game.html"
 *
 *   # Parse a saved HTML file (no network – you "upload" by saving the page)
 *   node scripts/fetch-bbref-stats.mjs ./app/data/lebron-per-game.html --no-fetch
 *
 * Output: JSON array of stat rows (one per season for player page, one per player for league page).
 * Use --out=app/data/player-stats.json to write to a file.
 *
 * Rate limiting: If you pass a URL (scrape), the script waits 2s before fetching to be polite.
 * BR may block aggressive scraping; for many players, save HTML manually or add longer delays.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../app/data');

const DELAY_MS = 2000;
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function parseArgs() {
  const args = process.argv.slice(2);
  const input = args.find((a) => !a.startsWith('--'));
  const outPath = args.find((a) => a.startsWith('--out='))?.slice(6);
  const noFetch = args.includes('--no-fetch');
  return { input, outPath, noFetch };
}

async function getHtml(input, noFetch) {
  const isUrl = input.startsWith('http://') || input.startsWith('https://');
  if (isUrl && !noFetch) {
    console.error('Waiting', DELAY_MS / 1000, 's before fetch (be nice to BR)...');
    await new Promise((r) => setTimeout(r, DELAY_MS));
    const res = await fetch(input, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${input}`);
    return res.text();
  }
  const filePath = path.isAbsolute(input) ? input : path.join(process.cwd(), input);
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Find first table with id="per_game" (player or league page).
 * Parse <thead> for column keys (data-stat), <tbody> for rows (td data-stat).
 */
function parsePerGameTable(html) {
  const tableMatch = html.match(/<table[^>]*id="per_game"[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return null;
  const tableHtml = tableMatch[1];

  const thead = tableHtml.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i)?.[1] || '';
  const headers = [];
  const thRe = /<th[^>]*data-stat="([^"]+)"[^>]*>([\s\S]*?)<\/th>/gi;
  let m;
  while ((m = thRe.exec(thead)) !== null) headers.push(m[1]);
  if (headers.length === 0) {
    const thRe2 = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    while ((m = thRe2.exec(thead)) !== null) headers.push(m[1].replace(/<[^>]+>/g, '').trim() || `col_${headers.length}`);
  }

  const tbody = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1] || '';
  const rows = [];
  const trSplits = tbody.split(/<tr[^>]*>/i).filter(Boolean);
  for (const tr of trSplits) {
    if (tr.includes('</tr>')) {
      const trContent = tr.replace(/<\/tr>[\s\S]*$/, '');
      if (/class="[^"]*thead[^"]*"/i.test(trContent)) continue;
      const row = {};
      const tdRe = /<t[dh][^>]*data-stat="([^"]+)"[^>]*>([\s\S]*?)<\/t[dh]>/gi;
      while ((m = tdRe.exec(trContent)) !== null) {
        const val = m[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
        if (headers.includes(m[1])) row[m[1]] = val;
      }
      if (Object.keys(row).length > 0) rows.push(row);
    }
  }
  return { headers, rows };
}

async function main() {
  const { input, outPath, noFetch } = parseArgs();
  if (!input) {
    console.error('Usage: node fetch-bbref-stats.mjs <URL_or_file> [--out=path.json] [--no-fetch]');
    process.exit(1);
  }

  let html;
  try {
    html = await getHtml(input, noFetch);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  const parsed = parsePerGameTable(html);
  if (!parsed || parsed.rows.length === 0) {
    console.error('No per_game table found in HTML. Save or fetch a page that contains "Per Game" stats.');
    process.exit(1);
  }

  const output = { source: input, rows: parsed.rows };
  const json = JSON.stringify(output, null, 2);

  if (outPath) {
    const dest = path.isAbsolute(outPath) ? outPath : path.join(process.cwd(), outPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, json, 'utf8');
    console.log('Wrote', parsed.rows.length, 'rows to', dest);
  } else {
    console.log(json);
  }
}

main();
