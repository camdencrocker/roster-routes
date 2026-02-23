#!/usr/bin/env node
/**
 * Fetch draft trades from Pro Sports Transactions for a given year.
 * 1 request. May 403 from cloud/CI — run locally if needed.
 *
 * Run: node scripts/fetch-draft-trades.mjs [YEAR]
 *   Default YEAR = current year. Output: app/data/draft-picks-YEAR-raw.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');
const YEAR = parseInt(process.argv[2] || String(new Date().getFullYear()), 10);
const DRAFT_URL = `https://www.prosportstransactions.com/basketball/DraftTrades/Years/${YEAR}.htm`;
const OUT_PATH = path.join(DATA, `draft-picks-${YEAR}-raw.json`);

async function fetchDraftTrades() {
  const res = await fetch(DRAFT_URL, {
    headers: { 'User-Agent': 'RosterRoutes/1.0 (personal project; rate-limited)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${DRAFT_URL}`);
  return res.text();
}

function parseDraftTable(html) {
  const picks = [];
  const rowRegex = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
  const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const rows = html.match(rowRegex) || [];
  for (const row of rows) {
    const cells = row.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi);
    if (!cells || cells.length < 4) continue;
    const text = cells.map((c) => stripTags(c));
    const pickMatch = text[1]?.match(/^(\d)-(\d+)$/);
    if (!pickMatch) continue;
    const round = parseInt(pickMatch[1], 10);
    const pickNumber = parseInt(pickMatch[2], 10);
    const team = text[2] || '';
    const player = text[text.length - 1] || '';
    const tradeText = text.slice(3, -1).join(' | ');
    if (pickNumber >= 1 && pickNumber <= 60) {
      picks.push({
        year: YEAR,
        round,
        pickNumber,
        teamAtDraft: team,
        draftedPlayerName: player || undefined,
        tradeSummary: tradeText || undefined,
      });
    }
  }
  return picks;
}

async function main() {
  console.log('Fetching', YEAR, 'draft trades from PST...');
  const html = await fetchDraftTrades();
  const picks = parseDraftTable(html);
  console.log('Parsed', picks.length, 'picks');

  fs.mkdirSync(DATA, { recursive: true });
  const output = {
    source: DRAFT_URL,
    fetchedAt: new Date().toISOString(),
    note: 'Run merge-draft-picks-into-trades.mjs to enrich trades.json.',
    picks,
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log('Wrote', OUT_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
