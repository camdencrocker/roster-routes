/**
 * Loads and indexes trades from trades.json.
 * Trade trees can be built from this flat DB by linking trades that share
 * an asset (player) chronologically — no need for a separate "every trade ever" scrape.
 */
import type { Trade, PlayerAsset, TradeAsset } from './trade-schema';
import tradesData from './trades.json';

// Waived (within 1–3 days of trade) and 0 GP (spent season but never played) — from build-waived-zerogp-index.mjs
import waivedZerogpData from './waived-zerogp-index.json';
const waivedSet = new Set((waivedZerogpData as { waived?: string[] }).waived || []);
const zerogpSet = new Set((waivedZerogpData as { zerogp?: string[] }).zerogp || []);

function normalizeName(name: string): string {
  return (name || '')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .trim()
    .toLowerCase();
}

function dateToSeason(dateStr: string): string | null {
  const parts = (dateStr || '').split('-').map(Number);
  if (parts.length < 2) return null;
  const [y, m] = parts;
  if (m >= 7) return `${y}-${String((y % 100) + 1).padStart(2, '0')}`;
  return `${y - 1}-${String(y % 100).padStart(2, '0')}`;
}

// Index once at module init
let cached: { trades: Trade[]; byPlayer: Map<string, Trade[]> } | null = null;

function load(): { trades: Trade[]; byPlayer: Map<string, Trade[]> } {
  if (cached) return cached;
  const trades: Trade[] = (tradesData as { trades?: Trade[] }).trades || [];
  const byPlayer = new Map<string, Trade[]>();

  for (const t of trades) {
    for (const a of t.assets) {
      if (a.type === 'player') {
        const pid = (a as PlayerAsset).nbaId;
        if (!byPlayer.has(pid)) byPlayer.set(pid, []);
        if (!byPlayer.get(pid)!.includes(t)) byPlayer.get(pid)!.push(t);
      }
    }
  }

  cached = { trades, byPlayer };
  return cached;
}

export function getTrades(): Trade[] {
  return load().trades;
}

export function getTradesForPlayer(nbaId: string): Trade[] {
  const list = load().byPlayer.get(nbaId) || [];
  return [...list].sort((a, b) => a.date.localeCompare(b.date));
}

export function getTradesBySeason(season: string): Trade[] {
  return load().trades.filter((t) => t.season === season);
}

export function getSeasons(): string[] {
  const seasons = new Set(load().trades.map((t) => t.season));
  return Array.from(seasons).sort().reverse();
}

/** Format YYYY-MM-DD to "Mon Day, Year" for tree display — short months (June, July kept) */
function formatTradeDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const months = 'Jan,Feb,Mar,Apr,May,June,July,Aug,Sep,Oct,Nov,Dec'.split(',');
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

type AssetNode = { id: string; label: string; img?: string; type: string; team: string; from?: string; to?: string; [k: string]: unknown };

export type TradeTreeNode = {
  id: string;
  date: string;
  root: { id: string; label: string; img: string; team: string };
  assets: AssetNode[];
  packageSent?: AssetNode[];
  teamsTrading?: string;
  /** Number of teams in the underlying trade (used for multi-team layout decisions). */
  numTeams?: number;
  tradeExceptionGenerated?: { player: string; amount: number };
  tradeExceptions?: { player: string; amount: number }[];
  /** If the focal player has another trade after this one, attach it as a branch. */
  focalNextTrade?: TradeTreeNode;
};

/** Convert a flat Trade (trades.json) into the tree-node shape buildTree expects. */
function tradeToTreeNode(trade: Trade, focalNbaId: string): TradeTreeNode {
  const focal = trade.assets.find((a) => a.type === 'player' && (a as PlayerAsset).nbaId === focalNbaId) as PlayerAsset | undefined;
  const rootTeam = focal?.to ?? trade.teams[0];
  const rootLabel = focal?.name ?? 'Unknown';
  const rootId = focal?.nbaId ?? focalNbaId;
  const rootImg = (focal as (PlayerAsset & { img?: string }) | undefined)?.img ?? rootId;
  const focalFrom = focal?.from;
  const tradeYear = new Date(trade.date + 'T12:00:00').getFullYear();

  const packageSent: AssetNode[] = [];
  const assets: AssetNode[] = [];

  function pushPlayer(p: PlayerAsset) {
    const node: AssetNode = { id: p.nbaId, label: p.name, img: (p as PlayerAsset & { img?: string }).img ?? p.nbaId, type: 'player' as const, team: p.to, from: p.from, to: p.to };
    // Status from trades.json, or from waived/0 GP index
    const existingStatus = (p as PlayerAsset & { status?: string }).status;
    if (existingStatus) {
      node.status = existingStatus;
    } else {
      const waivedKey = `${normalizeName(p.name)}|${trade.date}`;
      const season = dateToSeason(trade.date);
      const zerogpKey = season && /^\d+$/.test(p.nbaId) ? `${p.nbaId}|${p.to}|${season}` : null;
      const isWaived = waivedSet.has(waivedKey);
      const isZeroGp = zerogpKey && zerogpSet.has(zerogpKey);
      if (isWaived && isZeroGp) node.status = 'WAIVED / 0 GP';
      else if (isWaived) node.status = 'WAIVED';
      else if (isZeroGp) node.status = '0 GP';
    }
    return node;
  }
  function pushPick(pick: { description?: string; from?: string; to?: string; protection?: string; drafted_player?: { name: string; nbaId?: string; pickNumber: number } }, pickId: string) {
    const node: AssetNode = { id: pickId, label: pick.description ?? 'Pick', type: 'pick' as const, team: pick.to ?? '', description: pick.description, from: pick.from, to: pick.to, restriction: pick.protection };
    if (pick.drafted_player) {
      node.drafted_player = { ...pick.drafted_player, img: pick.drafted_player.nbaId };
      // Top of card: "2022 2nd" (year + round). Bottom shows "Drafted #N" only — no repetition.
      const yearFromDescMatch = (pick.description || '').match(/\b(19|20)\d{2}\b/);
      const yearForLabel = yearFromDescMatch
        ? Number(yearFromDescMatch[0])
        : (isFinite(tradeYear) ? tradeYear : undefined);
      if (yearForLabel) {
        const round = pick.drafted_player.pickNumber <= 30 ? '1st' : '2nd';
        node.assetTitle = `${yearForLabel} ${round}`;
      }
    }
    return node;
  }
  function pushCash(c: { description?: string; amount?: string; from?: string; to?: string }, cashId: string) {
    return { id: cashId, label: c.description ?? 'Cash', type: 'cash' as const, team: c.to ?? '', description: c.description, amount: c.amount, from: c.from, to: c.to };
  }
  function pushOther(o: { description?: string; from?: string; to?: string; status?: string }, otherId: string) {
    const raw = o.description ?? 'Other';
    const m = raw.match(/^(.+?)\s*\(([^)]+)\)/);
    const label = m ? m[1].trim() : raw;
    const sub = m ? m[2].trim() : undefined;
    return {
      id: otherId,
      label,
      subLabel: sub,
      type: 'other' as const,
      team: o.to ?? '',
      description: o.description,
      from: o.from,
      to: o.to,
      ...(o.status ? { status: o.status } : {}),
    };
  }

  trade.assets.forEach((a: TradeAsset, i: number) => {
    if (a.type === 'player') {
      const p = a as PlayerAsset;
      if (p.nbaId === focalNbaId) return;
      const node = pushPlayer(p);
      if (focalFrom && p.from === focalFrom) {
        packageSent.push(node);
      } else {
        assets.push(node);
      }
    } else if (a.type === 'pick') {
      const pick = a as { description?: string; from?: string; to?: string; protection?: string; drafted_player?: { name: string; nbaId?: string; pickNumber: number } };
      const node = pushPick(pick, `pick-${trade.id}-${i}`);
      if (focalFrom && pick.from === focalFrom) {
        packageSent.push(node);
      } else {
        assets.push(node);
      }
    } else if (a.type === 'cash') {
      const c = a as { description?: string; amount?: string; from?: string; to?: string };
      const node = pushCash(c, `cash-${trade.id}-${i}`);
      if (focalFrom && c.from === focalFrom) {
        packageSent.push(node);
      } else {
        assets.push(node);
      }
    } else if (a.type === 'other') {
      const o = a as { description?: string; from?: string; to?: string };
      const node = pushOther(o, `other-${trade.id}-${i}`);
      if (focalFrom && o.from === focalFrom) {
        packageSent.push(node);
      } else {
        assets.push(node);
      }
    }
  });

  const teamsTrading = trade.teams.length >= 4
    ? `${trade.teams.length}-team: ${trade.teams.join(', ')}`
    : trade.teams.length >= 2
      ? trade.teams.join(' \u2194 ')
      : trade.teams[0] ?? '';
  const tradeExceptionsGenerated = (trade as any).tradeExceptionsGenerated;
  const tradeExceptions = Array.isArray(tradeExceptionsGenerated)
    ? tradeExceptionsGenerated
    : (trade.tradeExceptionGenerated ? [trade.tradeExceptionGenerated] : []);
  return {
    id: trade.id,
    date: formatTradeDate(trade.date),
    // Use explicit img (e.g. custom headshot path) when available; fall back to nbaId.
    root: { id: rootId, label: rootLabel, img: rootImg, team: rootTeam, from: focalFrom, to: focal?.to ?? rootTeam },
    assets,
    ...(packageSent.length > 0 ? { packageSent } : {}),
    teamsTrading,
    numTeams: trade.teams.length,
    ...(trade.tradeExceptionGenerated ? { tradeExceptionGenerated: trade.tradeExceptionGenerated } : {}),
    ...(tradeExceptions.length > 0 ? { tradeExceptions } : {}),
    ...((trade as any).summary ? { summary: (trade as any).summary } : {}),
  };
}

/** Get the next trade (by date) for a player after a given date. */
function getNextTradeForPlayer(nbaId: string, afterDate: string): Trade | null {
  const list = getTradesForPlayer(nbaId).filter((t) => t.date > afterDate);
  return list.length > 0 ? list[0] : null;
}

export type FlatTreeResult = {
  rootTrade: TradeTreeNode;
  historyMap: Record<string, TradeTreeNode[]>;
};

/**
 * Build a trade tree from the flat DB: start from a player, use one of their trades
 * as root (by default the earliest recorded). rootIndex: 0 = earliest, 1 = second
 * earliest, etc. For each asset we find the next trade that asset was in (chronologically).
 */
export function buildTreeFromFlatTrades(
  nbaId: string,
  maxDepth = 6,
  rootIndex = 0
): FlatTreeResult | null {
  const trades = getTradesForPlayer(nbaId);
  if (trades.length === 0) return null;
  // 0 = earliest (first), 1 = second earliest, etc. Trades are sorted by date ascending.
  const index = Math.min(rootIndex, trades.length - 1);
  const tradeToUse = trades[index];

  const historyMap: Record<string, ReturnType<typeof tradeToTreeNode>[]> = {};
  const visited = new Set<string>();

  function build(trade: Trade, focalNbaId: string, depth: number, isRoot = false): TradeTreeNode {
    const key = `${trade.id}-${focalNbaId}`;
    if (visited.has(key) || depth > maxDepth) return tradeToTreeNode(trade, focalNbaId);
    visited.add(key);

    const node = tradeToTreeNode(trade, focalNbaId);
    if (!historyMap[focalNbaId]) historyMap[focalNbaId] = [];
    historyMap[focalNbaId] = [node];

    // Focal player's next trade: attach so it shows as a branch — EXCEPT when this is the root trade.
    // The root is the trade we're viewing; the focal's next trade is the next in nav (Trade 2, 3, etc.).
    // Showing it here would duplicate — user sees it when they click Prev/Next.
    const nextFocal = getNextTradeForPlayer(focalNbaId, trade.date);
    if (nextFocal && !isRoot) {
      node.focalNextTrade = build(nextFocal, focalNbaId, depth + 1, false);
    }

    // For each player asset in this trade, attach their next trade (if any).
    // For picks with drafted_player.nbaId (e.g. Tyler Kolek), attach that player's next trade too.
    for (const asset of node.assets) {
      const nbaIdForNext =
        asset.type === 'player'
          ? asset.id
          : asset.type === 'pick' && (asset as any).drafted_player?.nbaId
            ? (asset as any).drafted_player.nbaId
            : null;
      if (!nbaIdForNext) continue;
      const next = getNextTradeForPlayer(nbaIdForNext, trade.date);
      if (next) {
        const childNode = build(next, nbaIdForNext, depth + 1, false);
        if (!historyMap[asset.id]) historyMap[asset.id] = [];
        historyMap[asset.id] = [childNode];
      }
    }

    return node;
  }

  const rootTrade = build(tradeToUse, nbaId, 0, true);
  return { rootTrade, historyMap };
}
