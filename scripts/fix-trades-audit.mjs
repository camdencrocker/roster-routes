#!/usr/bin/env node
/**
 * Apply TRADES_AUDIT fixes: duplicate IDs, drafted_player, team codes, placeholder nbaIds.
 * Run: node scripts/fix-trades-audit.mjs
 * Backs up trades.json to trades.json.bak before writing.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRADES_PATH = path.join(__dirname, '../app/data/trades.json');

const data = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));

// 1. Fix duplicate IDs (keep first; add a, b, c to subsequent)
const seen = {};
for (const t of data.trades) {
  const prev = seen[t.id] ?? 0;
  seen[t.id] = prev + 1;
  if (prev > 0) t.id = t.id + ['a', 'b', 'c'][prev - 1];
}

// 2. Fix drafted_player mismatches (TRADES_AUDIT §1)
function fixAsset(asset, trade) {
  if (asset.type !== 'pick' || !asset.drafted_player) return;
  const d = asset.drafted_player;
  const desc = (asset.description || '').toLowerCase();

  // 2012-13-001: 2013 1st (#12) → Steven Adams; 2014 1st (#21) → Mitch McGary
  if (trade.id === '2012-13-001') {
    if (desc.includes('#12') && desc.includes('steven adams')) { d.name = 'Steven Adams'; d.pickNumber = 12; }
    if (desc.includes('#21') && desc.includes('mitch mcgary')) { d.name = 'Mitch McGary'; d.pickNumber = 21; }
  }

  // 2014-15-001: 2019 1st (#13) → Tyler Herro; 2021 1st (#18) → Tre Mann
  if (trade.id === '2014-15-001' || trade.id.startsWith('2014-15-001')) {
    if (desc.includes('#13') && desc.includes('tyler herro')) { d.name = 'Tyler Herro'; d.pickNumber = 13; }
    if (desc.includes('#18') && (desc.includes('tre mann') || desc.includes('mann'))) { d.name = 'Tre Mann'; d.pickNumber = 18; }
  }

  // Vince Williams Jr: pickNumber 47 (not 17)
  if (d.name === 'Vince Williams Jr' && d.pickNumber === 17) d.pickNumber = 47;

  // Tyrese Proctor: pickNumber 49 (not 19)
  if (d.name === 'Tyrese Proctor' && d.pickNumber === 19) d.pickNumber = 49;

  // Yannick Nzosa: provenance says #54, not CLE #24 (MarJon Beauchamp)
  if (d.name === 'Yannick Nzosa' && asset.description?.includes('CLE #24')) {
    asset.description = '2022 2nd (#54 - Yannick Nzosa)';
    d.pickNumber = 54;
  }

  // 2024 HOU #3 Reed Sheppard vs Tyler Smith #33 – description says #3 Reed Sheppard but drafted_player is Tyler Smith; provenance says #33-Tyler Smith → this is the #33 pick
  if (d.name === 'Tyler Smith' && desc.includes('#3') && desc.includes('reed sheppard')) {
    asset.description = '2024 2nd (HOU #33 - Tyler Smith)';
    d.pickNumber = 33;
  }
}

for (const t of data.trades) {
  for (const a of t.assets || []) fixAsset(a, t);
}

// 3. Team code replacements (TRADES_AUDIT §2)
const TEAM_FIX = {
  MIK: 'PHX', KHY: 'DET', GAR: 'POR', SHA: 'LAC', SUN: 'PHX', ALE: 'GSW',
  JAR: 'UTA', KEV: 'CLE', DEI: 'DET', ISA: 'DET', KEN: 'HOU', NIC: 'ATL',
  "DE'": 'ATL', GUI: 'NYK',
};

function fixTeams(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(fixTeams);
  } else if (obj && typeof obj === 'object') {
    if (obj.teams) obj.teams = obj.teams.map(t => TEAM_FIX[t] || t);
    if (obj.from && TEAM_FIX[obj.from]) obj.from = TEAM_FIX[obj.from];
    if (obj.to && TEAM_FIX[obj.to]) obj.to = TEAM_FIX[obj.to];
    for (const k of Object.keys(obj)) fixTeams(obj[k]);
  }
}

fixTeams(data);

// 4. SWA → correct team per trade (from summary)
const SWA_MAP = {
  '2018-19-006': 'NOP', '2018-19-007': 'CHI', '2018-19-013': 'DEN',
  '2019-20-006': 'LAC', '2020-21-008': 'LAC', '2021-22-010': 'MIL', '2021-22-011': 'HOU',
};
for (const t of data.trades) {
  const swaTeam = SWA_MAP[t.id];
  if (swaTeam && t.teams?.includes('SWA')) {
    t.teams = t.teams.map(x => x === 'SWA' ? swaTeam : x);
    for (const a of t.assets || []) {
      if (a.from === 'SWA') a.from = swaTeam;
      if (a.to === 'SWA') a.to = swaTeam;
    }
  }
}

// 5. Placeholder nbaIds → real IDs (known mappings)
const NBAID_FIX = {
  'name-brian-roberts': '203148',
  'name-george-hill': '201588',
  'name-jason-smith': '201160',
  'name-tobias-harris': '202699',
  'name-mikal-bridges': '1628969',
  'name-wilson-chandler': '201163',
};
for (const t of data.trades) {
  for (const a of t.assets || []) {
    if (a.type === 'player' && a.nbaId?.startsWith('name-') && NBAID_FIX[a.nbaId]) {
      a.nbaId = NBAID_FIX[a.nbaId];
    }
  }
}

// Backup and write
fs.writeFileSync(TRADES_PATH + '.bak', JSON.stringify(JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8')), null, 2), 'utf8');
data.lastUpdated = new Date().toISOString().slice(0, 10);
fs.writeFileSync(TRADES_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log('Fix complete. Backup: trades.json.bak');
