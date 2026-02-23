/**
 * Fetch 2025 NBA draft trades from Pro Sports Transactions and output raw JSON.
 * Run: node scripts/import-draft-trades-2025.mjs
 * Output: app/data/draft-picks-2025-raw.json
 *
 * Double-check output against trades.json before merging — some trades may
 * already exist; use this to enrich (drafted_player, trade chain) not duplicate.
 *
 * Note: Site may return 403 when run from CI/some networks. Run from your machine
 * or copy-paste HTML into a local file and parse that instead.
 */

const DRAFT_URL = 'https://www.prosportstransactions.com/basketball/DraftTrades/Years/2025.htm';
const OUT_PATH = new URL('../app/data/draft-picks-2025-raw.json', import.meta.url);

async function fetchDraftTrades() {
  const res = await fetch(DRAFT_URL, {
    headers: { 'User-Agent': 'RosterRoutes/1.0 (personal project; rate-limited)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${DRAFT_URL}`);
  return res.text();
}

/**
 * Parse HTML table: pick (e.g. "1-15"), team, trade text, player drafted.
 * Structure may vary; adjust regex if the site layout changes.
 */
function parseDraftTable(html) {
  const picks = [];
  // Common pattern: row with pick number (1-15, 2-31, etc.), team name, trade details, player name
  const rowRegex = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
  const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const rows = html.match(rowRegex) || [];
  for (const row of rows) {
    const cells = row.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi);
    if (!cells || cells.length < 4) continue;
    const text = cells.map((c) => stripTags(c));
    // Expect: [row#, pick e.g. "1-15", team, ...trade..., player]
    const pickMatch = text[1]?.match(/^(\d)-(\d+)$/); // round-pickNumber
    if (!pickMatch) continue;
    const round = parseInt(pickMatch[1], 10);
    const pickNumber = parseInt(pickMatch[2], 10);
    const team = text[2] || '';
    const player = text[text.length - 1] || '';
    const tradeText = text.slice(3, -1).join(' | ');
    if (pickNumber >= 1 && pickNumber <= 60) {
      picks.push({
        year: 2025,
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
  console.log('Fetching', DRAFT_URL, '...');
  const html = await fetchDraftTrades();
  const picks = parseDraftTable(html);
  console.log('Parsed', picks.length, 'picks');
  const output = {
    source: DRAFT_URL,
    fetchedAt: new Date().toISOString(),
    note: 'Double-check against trades.json before merging; some trades may already exist.',
    picks,
  };
  const fs = await import('fs');
  const path = await import('path');
  const outDir = path.dirname(path.fileURLToPath(OUT_PATH));
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.fileURLToPath(OUT_PATH), JSON.stringify(output, null, 2));
  console.log('Wrote', path.fileURLToPath(OUT_PATH));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
