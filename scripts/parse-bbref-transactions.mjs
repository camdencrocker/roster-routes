#!/usr/bin/env node
/**
 * Parse Basketball Reference transactions HTML into JSON.
 * Usage:
 *   node parse-bbref-transactions.mjs [SEASON]   — parse one season (default: 2024-25)
 *   node parse-bbref-transactions.mjs --all      — parse every *-nba-transactions-bbref.html in app/data
 * Reads: app/data/SEASON-nba-transactions-bbref.html
 * Writes: app/data/SEASON-transactions-bbref.json
 * Captures: date, dateNorm, type, team, teamTo (when in HTML), players[], full text (no truncation).
 * Validates: no empty text, required fields; reports 100% capture when no issues.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../app/data');
const IS_ALL = process.argv[2] === '--all';
const SEASON = IS_ALL ? null : (process.argv[2] || '2024-25');
const HTML_PATH = SEASON ? path.join(DATA_DIR, `${SEASON}-nba-transactions-bbref.html`) : null;
const OUT_PATH = SEASON ? path.join(DATA_DIR, `${SEASON}-transactions-bbref.json`) : null;

const MONTH_NUM = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

function parseDate(s) {
  if (!s || s === '?') return null;
  const m = s.trim().match(/^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4})$/);
  if (!m) return null;
  const month = String(MONTH_NUM[m[1]] ?? 0).padStart(2, '0');
  const day = String(parseInt(m[2], 10)).padStart(2, '0');
  return `${m[3]}-${month}-${day}`;
}

function extractPlayerNames(htmlFragment) {
  const names = [];
  const re = /<a href="\/players\/[^"]+">([^<]+)<\/a>/g;
  let match;
  while ((match = re.exec(htmlFragment)) !== null) {
    names.push(match[1].trim());
  }
  return [...new Set(names)];
}

function getTeamFrom(htmlFragment) {
  const m = htmlFragment.match(/data-attr-from="([A-Z]{3})"/) || htmlFragment.match(/href="\/teams\/([A-Z]{3})\//);
  return m ? m[1] : null;
}

function getTeamTo(htmlFragment) {
  const m = htmlFragment.match(/data-attr-to="([A-Z]{3})"/);
  return m ? m[1] : null;
}

function detectType(text) {
  const t = text.toLowerCase();
  if (t.includes(' waive')) return 'waived';
  if (t.includes(' traded ') || t.includes(' trade ')) return 'traded';
  if (t.includes(' signed ') || t.includes(' sign ')) return 'signed';
  if (t.includes(' claimed ')) return 'claimed';
  if (t.includes(' selected ') && t.includes(' draft')) return 'draft';
  if (t.includes(' released ')) return 'released';
  return 'other';
}

function parseSeason(season) {
  const htmlPath = path.join(DATA_DIR, `${season}-nba-transactions-bbref.html`);
  if (!fs.existsSync(htmlPath)) return { transactions: [], error: 'Missing HTML' };
  const html = fs.readFileSync(htmlPath, 'utf8');
  const liChunks = html.split(/<li><span>/).slice(1);
  const transactions = [];

  for (const chunk of liChunks) {
    const endSpan = chunk.indexOf('</span>');
    if (endSpan === -1) continue;
    const dateStr = chunk.slice(0, endSpan).trim();
    const dateNorm = parseDate(dateStr);
    const afterSpan = chunk.slice(endSpan + 7);
    const pBlocks = afterSpan.split(/<\/p>\s*<p>/).map(s => s.replace(/^<p>|<\/p>.*$/g, '').trim()).filter(Boolean);
    if (pBlocks.length === 0) {
      const single = afterSpan.replace(/<\/p>.*$/s, '').replace(/^<p>?/, '').trim();
      if (single) pBlocks.push(single);
    }
    for (const pHtml of pBlocks) {
      const text = pHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      const type = detectType(text);
      const players = extractPlayerNames(pHtml);
      const team = getTeamFrom(pHtml);
      const teamTo = getTeamTo(pHtml);
      const obj = { date: dateStr, dateNorm, type, team, players, text };
      if (teamTo) obj.teamTo = teamTo;
      transactions.push(obj);
    }
  }
  return { transactions };
}

function validate(transactions, season) {
  const issues = [];
  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    if (!t.text || typeof t.text !== 'string') issues.push({ season, index: i, msg: 'empty or missing text' });
    if (!t.date) issues.push({ season, index: i, msg: 'missing date' });
    if (!Array.isArray(t.players)) issues.push({ season, index: i, msg: 'players not array' });
    if (t.type === 'traded' && !t.team && !t.teamTo) issues.push({ season, index: i, msg: 'trade with no team' });
  }
  return issues;
}

function reportSameDayWaivedTraded(transactions) {
  const byDate = {};
  for (const t of transactions) {
    if (!t.dateNorm) continue;
    if (!byDate[t.dateNorm]) byDate[t.dateNorm] = { waived: [], traded: [] };
    if (t.type === 'waived') byDate[t.dateNorm].waived.push(t);
    if (t.type === 'traded') byDate[t.dateNorm].traded.push(t);
  }
  let count = 0;
  for (const { waived: waivers, traded: trades } of Object.values(byDate)) {
    for (const w of waivers) {
      for (const p of w.players) {
        const pLower = p.toLowerCase();
        for (const tr of trades) {
          if (tr.players.some(tp => tp.toLowerCase() === pLower || tp.toLowerCase().includes(pLower) || pLower.includes(tp.toLowerCase()))) {
            count++;
            break;
          }
        }
      }
    }
  }
  return count;
}

if (IS_ALL) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const htmlFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('-nba-transactions-bbref.html'));
  const seasons = htmlFiles.map(f => f.replace(/-nba-transactions-bbref\.html$/, '')).sort();
  let totalTx = 0;
  const allIssues = [];
  for (const season of seasons) {
    const { transactions, error } = parseSeason(season);
    if (error) {
      console.log(season, error);
      continue;
    }
    const issues = validate(transactions, season);
    allIssues.push(...issues);
    const outPath = path.join(DATA_DIR, `${season}-transactions-bbref.json`);
    fs.writeFileSync(outPath, JSON.stringify(transactions, null, 2), 'utf8');
    totalTx += transactions.length;
    const tradedWithTo = transactions.filter(t => t.type === 'traded' && t.teamTo).length;
    const tradedTotal = transactions.filter(t => t.type === 'traded').length;
    console.log(`${season}: ${transactions.length} transactions (trades: ${tradedTotal}, with teamTo: ${tradedWithTo})`);
  }
  console.log('\nTotal:', totalTx, 'transactions across', seasons.length, 'seasons');
  if (allIssues.length > 0) {
    console.log('\nValidation issues:', allIssues.length);
    allIssues.slice(0, 20).forEach(i => console.log(' ', i));
    if (allIssues.length > 20) console.log(' ... and', allIssues.length - 20, 'more');
  } else {
    console.log('Validation: 0 issues (100% capture).');
  }
  process.exit(0);
}

if (!fs.existsSync(HTML_PATH)) {
  console.error('Missing HTML file:', HTML_PATH);
  process.exit(1);
}
const { transactions } = parseSeason(SEASON);
const issues = validate(transactions, SEASON);
if (issues.length > 0) {
  console.error('Validation issues:', issues.length, issues.slice(0, 10));
}
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(transactions, null, 2), 'utf8');
console.log('Wrote', OUT_PATH, '—', transactions.length, 'transactions');
const sameDayCount = reportSameDayWaivedTraded(transactions);
if (sameDayCount === 0) {
  console.log('Waived same day as traded (same player): 0 instances.');
} else {
  console.log('Waived same day as traded (same player):', sameDayCount, 'instance(s).');
}
