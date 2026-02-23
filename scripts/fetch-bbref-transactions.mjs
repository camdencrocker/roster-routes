#!/usr/bin/env node
/**
 * Fetch BBR transactions for current season, parse, save JSON.
 * 1 request total. 5s delay before fetch (Sports Reference: ≤20 req/min).
 *
 * Run: node scripts/fetch-bbref-transactions.mjs
 *   Fetches NBA_YYYY_transactions.html, saves HTML + JSON.
 *
 * Run: node scripts/fetch-bbref-transactions.mjs 2024-25
 *   Explicit season.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');
const DELAY_MS = 5000;
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function getCurrentSeason() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  // NBA season: Oct–Jun. July+ = next season.
  const nbaYear = month >= 7 ? year + 1 : year;
  return `${nbaYear - 1}-${String(nbaYear).slice(-2)}`;
}

async function main() {
  const season = process.argv[2] || getCurrentSeason();
  const [startYear] = season.split('-').map(Number);
  const nbaYear = startYear + 1;
  const url = `https://www.basketball-reference.com/leagues/NBA_${nbaYear}_transactions.html`;

  console.log('Fetching', season, 'transactions from BBR...');
  console.log('Waiting', DELAY_MS / 1000, 's (rate limit)...');
  await new Promise((r) => setTimeout(r, DELAY_MS));

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) {
    console.error('HTTP', res.status, url);
    process.exit(1);
  }
  const html = await res.text();

  fs.mkdirSync(DATA, { recursive: true });
  const htmlPath = path.join(DATA, `${season}-nba-transactions-bbref.html`);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Saved', htmlPath);

  execSync(`node "${path.join(__dirname, 'parse-bbref-transactions.mjs')}" "${season}"`, {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
