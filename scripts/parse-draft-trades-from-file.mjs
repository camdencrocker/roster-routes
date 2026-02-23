/**
 * Parse draft trades from a LOCAL HTML file (no fetch).
 * Use when the fetch script gets 403.
 *
 * Step 1: Open https://www.prosportstransactions.com/basketball/DraftTrades/Years/YYYY.htm
 *         in your browser and Save As → app/data/YYYY-draft-trades.htm
 * Step 2: Run: node scripts/parse-draft-trades-from-file.mjs [input.htm] [output.json]
 *
 * Examples:
 *   node scripts/parse-draft-trades-from-file.mjs
 *     → reads app/data/2025-draft-trades.htm, writes app/data/draft-picks-2025-raw.json
 *   node scripts/parse-draft-trades-from-file.mjs app/data/2024-draft-trades.htm app/data/draft-picks-2024-raw.json
 *
 * Output: app/data/draft-picks-YYYY-raw.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_INPUT = path.join(__dirname, '../app/data/2025-draft-trades.htm');
const DEFAULT_OUTPUT = path.join(__dirname, '../app/data/draft-picks-2025-raw.json');

/** Split "Team Traded ... on 2021-01-16 | Team Traded ... on 2024-06-26" into [{ date, summary }, ...] */
function parseTradeChain(tradeText) {
  if (!tradeText || !tradeText.trim() || tradeText.trim() === '&nbsp;') return [];
  const segments = tradeText.split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
  const chain = [];
  const dateAtEnd = /^(.*?)\s+on\s+(\d{4}-\d{2}-\d{2})\s*$/;
  for (const seg of segments) {
    if (!seg || seg === '&nbsp;') continue;
    const m = seg.match(dateAtEnd);
    if (m) {
      chain.push({ date: m[2], summary: m[1].trim() });
    } else {
      chain.push({ date: null, summary: seg });
    }
  }
  return chain;
}

function parseDraftTable(html, year = 2025) {
  const picks = [];
  const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const rowRegex = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
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
    const tradeChain = parseTradeChain(tradeText);
    if (pickNumber >= 1 && pickNumber <= 60) {
      picks.push({
        year: parseInt(year, 10),
        round,
        pickNumber,
        teamAtDraft: team,
        draftedPlayerName: player || undefined,
        tradeSummary: tradeText || undefined,
        tradeChain: tradeChain.length ? tradeChain : undefined,
      });
    }
  }
  return picks;
}

const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_INPUT;
const yearFromName = path.basename(inputPath).match(/(\d{4})/);
const year = yearFromName ? yearFromName[1] : '2025';
const dataDir = path.join(__dirname, '../app/data');
const outputPath = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(dataDir, `draft-picks-${year}-raw.json`);

if (!fs.existsSync(inputPath)) {
  console.error('File not found:', inputPath);
  console.error('Save the draft page from your browser to: app/data/YYYY-draft-trades.htm');
  console.error('Then run: node scripts/parse-draft-trades-from-file.mjs [input.htm] [output.json]');
  process.exit(1);
}

const html = fs.readFileSync(inputPath, 'utf8');
const picks = parseDraftTable(html, year);
console.log('Parsed', picks.length, 'picks from', inputPath);

const output = {
  source: 'file:' + inputPath,
  fetchedAt: new Date().toISOString(),
  note: 'Double-check against trades.json before merging; some trades may already exist.',
  picks,
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log('Wrote', outputPath);
