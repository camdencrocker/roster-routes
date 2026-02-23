/**
 * Merge draft-picks-YYYY-raw.json into trades.json.
 * Enriches pick assets: drafted_player (name, pickNumber) and pickProvenance (trade chain).
 * Does NOT add new trades — only updates existing 2025 (or given year) picks.
 *
 * Run: node scripts/merge-draft-picks-into-trades.mjs
 *      (uses app/data/draft-picks-2025-raw.json by default)
 * Or:  node scripts/merge-draft-picks-into-trades.mjs app/data/draft-picks-2024-raw.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRADES_PATH = path.join(__dirname, '../app/data/trades.json');
const DEFAULT_RAW = path.join(__dirname, '../app/data/draft-picks-2025-raw.json');

const rawPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_RAW;
const rawFile = path.basename(rawPath);
const yearMatch = rawFile.match(/draft-picks-(\d{4})-raw/);
const year = yearMatch ? yearMatch[1] : '2025';

if (!fs.existsSync(rawPath)) {
  console.error('Raw file not found:', rawPath);
  console.error('Run parse-draft-trades-from-file.mjs first to create draft-picks-YYYY-raw.json');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
const picksByNumber = new Map();
for (const p of raw.picks || []) {
  picksByNumber.set(p.pickNumber, {
    name: p.draftedPlayerName || '',
    tradeSummary: p.tradeSummary && p.tradeSummary !== '&nbsp;' ? p.tradeSummary.trim() : undefined,
    tradeChain: Array.isArray(p.tradeChain) && p.tradeChain.length ? p.tradeChain : undefined,
  });
}

const data = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));
let updated = 0;
const pickDescRegex = /#(\d+)/;

for (const trade of data.trades || []) {
  for (const asset of trade.assets || []) {
    if (asset.type !== 'pick') continue;
    const desc = asset.description || '';
    if (!desc.includes(year)) continue;
    const m = desc.match(pickDescRegex);
    if (!m) continue;
    const pickNumber = parseInt(m[1], 10);
    const info = picksByNumber.get(pickNumber);
    if (!info || !info.name) continue;

    const prevName = asset.drafted_player?.name;
    asset.drafted_player = {
      ...(asset.drafted_player || {}),
      name: info.name,
      pickNumber,
    };
    if (info.tradeSummary) {
      asset.pickProvenance = info.tradeSummary;
    }
    if (info.tradeChain) {
      asset.pickProvenanceTrades = info.tradeChain;
    }
    if (prevName !== info.name || info.tradeSummary || info.tradeChain) updated++;
  }
}

fs.writeFileSync(TRADES_PATH, JSON.stringify(data, null, 2));
console.log('Merged', year, 'draft picks into trades.json; updated', updated, 'pick asset(s).');
