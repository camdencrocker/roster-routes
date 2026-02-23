#!/usr/bin/env node
/**
 * Audit BBR transactions for unusual or unparseable text.
 * Logs items that may need manual review.
 *
 * Run: node scripts/audit-bbref-unusual-text.mjs
 * Output: docs/BBR_UNUSUAL_TEXT_AUDIT.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '../app/data');
const OUT = path.join(__dirname, '../docs/BBR_UNUSUAL_TEXT_AUDIT.md');

function audit() {
  const files = fs.readdirSync(DATA).filter((f) => f.endsWith('-transactions-bbref.json'));
  const issues = [];

  for (const f of files) {
    const season = f.replace(/-transactions-bbref\.json$/, '');
    const data = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
    const arr = Array.isArray(data) ? data : (data.transactions || []);

    for (let i = 0; i < arr.length; i++) {
      const tx = arr[i];
      const text = (tx.text || '').trim();
      const type = tx.type || 'unknown';

      // Empty or missing text
      if (!text) {
        issues.push({ season, index: i, type, reason: 'empty text', text: '(none)' });
        continue;
      }

      // HTML entities left in
      if (/&[a-z]+;|&#\d+;|&nbsp;|&quot;|&#039;/.test(text) && text.length < 500) {
        issues.push({ season, index: i, type, reason: 'HTML entities in text', text: text.slice(0, 120) });
      }

      // Unusual placeholders
      if (/\?\?|TBD|unknown|TBA|to be determined/i.test(text)) {
        issues.push({ season, index: i, type, reason: 'placeholder/TBD in text', text: text.slice(0, 120) });
      }

      // Very long (possible truncation or concatenation)
      if (text.length > 400) {
        issues.push({ season, index: i, type, reason: 'very long text (' + text.length + ' chars)', text: text.slice(0, 100) + '...' });
      }

      // Traded but doesn't match "traded X to Y for Z"
      if (type === 'traded') {
        const hasTo = /\btraded\s+.+\s+to\s+/i.test(text);
        const hasFor = /\bfor\s+.+/i.test(text);
        if (!hasTo) {
          issues.push({ season, index: i, type, reason: "traded but no 'traded X to Y' pattern", text: text.slice(0, 150) });
        }
        if (!hasFor && !/3-team|4-team|5-team|multi-team|in a \d+-team/i.test(text)) {
          issues.push({ season, index: i, type, reason: "traded but no 'for' clause (may be multi-team)", text: text.slice(0, 150) });
        }
      }

      // Multi-team mentioned but might be misparsed
      if (/3-team|4-team|5-team|in a \d+-team|three-team|four-team|five-team/i.test(text) && type === 'traded') {
        const clauseCount = (text.match(/traded\s+.+?\s+to\s+/gi) || []).length;
        if (clauseCount < 2) {
          issues.push({ season, index: i, type, reason: 'multi-team mentioned but single clause', text: text.slice(0, 150) });
        }
      }

      // Non-ASCII beyond common (apostrophes, accents in names)
      const nonAscii = text.replace(/[\x00-\x7F]/g, '');
      if (nonAscii.length > 5 && !/^[\u00C0-\u024F\u1E00-\u1EFF\s]+$/.test(nonAscii)) {
        issues.push({ season, index: i, type, reason: 'unusual non-ASCII chars', text: text.slice(0, 100) });
      }

      // Missing players for traded
      if (type === 'traded' && (!tx.players || tx.players.length === 0)) {
        issues.push({ season, index: i, type, reason: 'traded but no players extracted', text: text.slice(0, 120) });
      }

      // Missing date
      if (!tx.dateNorm && !tx.date) {
        issues.push({ season, index: i, type, reason: 'missing date', text: text.slice(0, 100) });
      }
    }
  }

  return issues;
}

function main() {
  const issues = audit();
  const lines = [
    '# BBR Unusual Text Audit',
    '',
    'Generated: ' + new Date().toISOString().slice(0, 10),
    '',
    'Total issues: ' + issues.length,
    '',
    '## Issues',
    '',
  ];

  const byReason = {};
  for (const i of issues) {
    const r = i.reason;
    if (!byReason[r]) byReason[r] = [];
    byReason[r].push(i);
  }

  for (const [reason, items] of Object.entries(byReason)) {
    lines.push('### ' + reason + ' (' + items.length + ')');
    lines.push('');
    for (const it of items.slice(0, 15)) {
      lines.push('- **' + it.season + '** #' + it.index + ': `' + (it.text || '').replace(/`/g, "'").slice(0, 100) + (it.text && it.text.length > 100 ? '...' : '') + '`');
    }
    if (items.length > 15) {
      lines.push('- ... and ' + (items.length - 15) + ' more');
    }
    lines.push('');
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.log('Audit complete. Issues:', issues.length);
  console.log('Wrote', OUT);
}

main();
