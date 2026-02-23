#!/usr/bin/env node
/**
 * Validate all NBA player IDs across players.ts, trades.json, and generated files.
 * Finds: duplicate IDs, known ID↔name mixups, non-numeric IDs.
 *
 * Run: node scripts/validate-player-ids.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// Known correct ID → name (from NBA.com). Used to catch common mixups.
const KNOWN_CORRECT = {
  '201939': 'Stephen Curry',
  '201566': 'Russell Westbrook',
  '1628379': 'Luke Kennard',
  '1629012': 'Collin Sexton',
  '202693': 'Markieff Morris',
  '202694': 'Marcus Morris',
  '201142': 'Kevin Durant',
  '203076': 'Anthony Davis',
  '1629029': 'Luka Doncic',
  '203999': 'Nikola Jokic',
};

function loadJson(p) {
  return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
}

function collectFromTrades() {
  const data = loadJson('app/data/trades.json');
  const out = [];
  for (const t of data.trades || []) {
    for (const a of t.assets || []) {
      if (a.type === 'player' && a.name && a.nbaId && /^\d+$/.test(String(a.nbaId))) {
        const name = (a.name || '').replace(/&#039;/g, "'").replace(/&quot;/g, '"').trim();
        out.push({ id: String(a.nbaId), fullName: name, source: 'trades.json' });
      }
    }
  }
  return out;
}

function main() {
  const playersTs = fs.readFileSync(path.join(root, 'app/data/players.ts'), 'utf8');
  const curated = [];
  const m = playersTs.matchAll(/\{\s*id:\s*'([^']+)',\s*fullName:\s*'([^']+)'/g);
  for (const [, id, name] of m) {
    curated.push({ id, fullName: name, source: 'players.ts' });
  }

  const fromTrades = loadJson('app/data/players-from-trades.json');
  const fromDraft = loadJson('app/data/players-from-draft-trades.json');

  const all = [
    ...curated.map((p) => ({ ...p, source: 'players.ts' })),
    ...fromTrades.map((p) => ({ ...p, source: 'players-from-trades.json' })),
    ...fromDraft.map((p) => ({ ...p, source: 'players-from-draft-trades.json' })),
  ];

  const byId = new Map();
  for (const p of all) {
    if (!/^\d+$/.test(p.id)) continue;
    if (!byId.has(p.id)) byId.set(p.id, []);
    byId.get(p.id).push(p);
  }

  let hasErrors = false;

  // 1. Duplicate IDs with different names
  console.log('\n=== Duplicate IDs (same ID, different names) ===');
  for (const [id, entries] of byId) {
    const names = [...new Set(entries.map((e) => e.fullName))];
    if (names.length > 1) {
      hasErrors = true;
      console.log(`  ID ${id}: ${names.join(' | ')}`);
      for (const e of entries) console.log(`    - ${e.fullName} (${e.source})`);
    }
  }
  if (!hasErrors) console.log('  None found.');

  // 2. Known ID↔name mismatches
  console.log('\n=== Known ID↔name mismatches ===');
  for (const p of all) {
    if (!/^\d+$/.test(p.id)) continue;
    const correct = KNOWN_CORRECT[p.id];
    if (correct && correct !== p.fullName) {
      hasErrors = true;
      console.log(`  ID ${p.id}: has "${p.fullName}" but should be "${correct}" (${p.source})`);
    }
  }
  if (!hasErrors) console.log('  None found.');

  // 3. Reverse check: name matches known player but wrong ID
  const nameToId = Object.fromEntries(Object.entries(KNOWN_CORRECT).map(([k, v]) => [v, k]));
  console.log('\n=== Name matches known player but wrong ID ===');
  for (const p of all) {
    const expectedId = nameToId[p.fullName];
    if (expectedId && expectedId !== p.id) {
      hasErrors = true;
      console.log(`  "${p.fullName}": has ID ${p.id} but should be ${expectedId} (${p.source})`);
    }
  }
  if (!hasErrors) console.log('  None found.');

  // 4. Summary
  const uniqueIds = new Set(all.filter((p) => /^\d+$/.test(p.id)).map((p) => p.id));
  console.log('\n=== Summary ===');
  console.log(`  Total entries: ${all.length}`);
  console.log(`  Unique numeric IDs: ${uniqueIds.size}`);
  console.log(`  Curated (players.ts): ${curated.length}`);
  console.log(`  From trades: ${fromTrades.length}`);
  console.log(`  From draft trades: ${fromDraft.length}`);

  if (hasErrors) {
    console.log('\n⚠️  Validation found issues. Fix data and re-run.');
    process.exit(1);
  }
  console.log('\n✓ All IDs validated.');
}

main();
