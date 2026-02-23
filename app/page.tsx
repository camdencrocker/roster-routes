'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  ReactFlow, ReactFlowProvider, Controls, 
  useNodesState, useEdgesState, Handle, Position, useReactFlow,
  EdgeProps, Node, Edge, BaseEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PlayerSearch from './PlayerSearch';
import DownloadBtn from './DownloadBtn'; 
import SidePanel from './SidePanel';
import ComingSoonView from './ComingSoonView';
import CoverPage from './CoverPage';
import Footer from './Footer';
import AllTradesView from './AllTradesView';
import TradeListView from './TradeListView';
import { getTradesForPlayer, buildTreeFromFlatTrades } from './data/trades-loader';
import { UniversalCard } from './UniversalCard';
import { AssetCard } from './AssetCard';
import { getHeadshotUrl, getHeadshotFallback } from './headshots';
import { TRADE_HISTORY } from './tradeData';

const getHistoricalColor = (team: string, year: number) => {
  if (team === 'ATL') {
    if (year < 2007) return '#E03A3E';
    if (year >= 2007 && year < 2015) return '#002B5C';
    if (year >= 2015 && year < 2020) return '#C1D32F';
    return '#E03A3E';
  }
  if (team === 'OKC' || team === 'SEA') {
    if (year < 2008) return '#00653A';
    return '#007AC1';
  }
  const modernColors: Record<string, string> = {
    'WAS': '#002B5C', 'NYK': '#F58426', 'DAL': '#00538C',
    'LAC': '#C8102E', 'BKN': '#000000', 'MIA': '#98002E',
    'LAL': '#552583', 'POR': '#E03A3E', 'NOP': '#0C2340',
    'MIL': '#00471B', 'DEN': '#0E2240', 'CHA': '#1D1160',
    'PHX': '#1D1160', 'GSW': '#1D428A', 'BOS': '#007A33',
    'CLE': '#860038', 'IND': '#002D62', 'MEM': '#5D76A9',
    'MIN': '#0C2340', 'SAS': '#C4CED4', 'TOR': '#CE1141',
    'UTA': '#002B5C', 'ORL': '#0077C0', 'PHI': '#006BB6',
    'SAC': '#5A2D81', 'DET': '#C8102E', 'HOU': '#CE1141',
    'CHO': '#1D1160',
  };
  return modernColors[team] || '#475569';
};

/** Normalize pick label to compact format: "2031 2nd (DEN)" — no ROUND PICK. */
function normalizePickLabel(desc: string | undefined): string {
  if (!desc || typeof desc !== 'string') return desc ?? 'Pick';
  const yearMatch = desc.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : '';
  const pickNumMatch = desc.match(/#\s*(\d{1,2})\b/);
  const round = pickNumMatch ? (Number(pickNumMatch[1]) <= 30 ? '1st' : '2nd') : (/1\s*st|first/i.test(desc) ? '1st' : '2nd');
  const teamMatch = desc.match(/\b([A-Z]{3})\b/);
  const team = teamMatch ? teamMatch[1] : '';
  if (year && team) return `${year} ${round} (${team})`;
  if (year) return `${year} ${round}`;
  return desc.replace(/\s*round\s*pick\s*/gi, ' ').replace(/\s+/g, ' ').trim() || desc;
}

/** Show team abbreviations only (e.g. "DAL → ATL" instead of "DAL Mavericks → ATL Hawks"). */
function normalizeTeamsDisplay(s: string): string {
  if (!s || typeof s !== 'string') return s;
  let out = s.replace(/\s*NY\s+Knicks?\b/gi, ' NYK');
  out = out.replace(/\s+(Mavericks|Hawks|Nets|Celtics|76ers|Raptors|Bulls|Cavaliers|Pistons|Pacers|Bucks|Heat|Magic|Hornets|Wizards|Nuggets|Timberwolves|Thunder|Blazers|Jazz|Warriors|Clippers|Lakers|Suns|Kings|Spurs|Rockets|Grizzlies|Pelicans)\b/gi, '');
  return out.replace(/\s+/g, ' ').trim();
}

// Step edge: 90-degree angles (circuit board), 2px line
// Uses shared junctionY when provided (for trident) so all lines converge on same horizontal rail
function StepEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  data,
}: EdgeProps) {
  const stroke = (style?.stroke as string) || (data?.sourceColor as string) || 'rgba(255,255,255,0.35)';
  const strokeWidth = (style?.strokeWidth as number) ?? 2.25;
  const dashed = (style?.strokeDasharray as string) ?? undefined;

  const sharedJunctionY = data?.junctionY as number | undefined;
  const junctionY = sharedJunctionY != null
    ? sharedJunctionY
    : (sourceY + targetY) / 2;
  const path = `M ${sourceX},${sourceY} L ${sourceX},${junctionY} L ${targetX},${junctionY} L ${targetX},${targetY}`;

  return (
    <BaseEdge
      path={path}
      style={{
        stroke,
        strokeWidth,
        strokeDasharray: dashed,
      }}
    />
  );
}

// Direct edge: straight line only (no step). Use for single-branch vertical stack so lines never zig-zag.
function DirectEdge({ sourceX, sourceY, targetX, targetY, style = {}, data }: EdgeProps) {
  const stroke = (style?.stroke as string) || (data?.sourceColor as string) || 'rgba(255,255,255,0.35)';
  const strokeWidth = (style?.strokeWidth as number) ?? 2.25;
  const path = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  return <BaseEdge path={path} style={{ stroke, strokeWidth }} />;
}

const PlayerNode = ({ id, data }: any) => {
  const isDate = data.type === 'date';
  const isRouter = data.type === 'router';
  const isPick = data.type === 'pick';
  const isPackage = data.type === 'package';
  const isPackageItem = data.type === 'packageItem';
  const isSent = data.isSent;
  
  const imgSrc = getHeadshotUrl(data.img, data.id, data.label) || getHeadshotFallback();
  const teamColor = data.customColor || '#666';
  
  if (isRouter) {
    return (
      <div className="w-px h-px opacity-0 pointer-events-none">
        <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="right" type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      </div>
    );
  }

  if (data.type === 'teamLabel') {
    const team = (data as any).team ?? '';
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-white/25 bg-white/5 py-1.5 px-2 min-w-0">
        <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
        <Handle id="top" type="source" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
        <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">{team}</span>
      </div>
    );
  }

  if (isDate) {
    const rawTeams = (data as any).teamsDisplay ?? (data as any).teamsTrading ?? '';
    const teamsDisplay = normalizeTeamsDisplay(rawTeams);
    return (
      <div
        className="relative rounded-lg border border-white/20 bg-black/60 flex flex-col items-center justify-center min-h-0 py-2 px-3 w-full text-center cursor-pointer hover:bg-white/10 hover:border-white/30 transition-colors"
        title="Click for trade summary"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
      >
        <span className="text-base font-mono font-semibold text-zinc-200 uppercase tracking-wide whitespace-nowrap block text-center leading-tight">
          {data.label}
        </span>
        <span className="text-xs font-mono text-zinc-400 mt-0.5 block text-center leading-tight max-w-full line-clamp-2 break-words" title={rawTeams || undefined}>
          {teamsDisplay || '—'}
        </span>
        <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
        <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
      </div>
    );
  }

  if (isPackageItem) {
    const assetData = normalizeToAssetData(data, id);
    // Top row "same size as regular nodes": use full card (no compact). Else compact only for picks/cash.
    const useCompact = !(data as any).topRowSameSize && data.type !== 'player' && data.type !== 'star' && data.type !== 'other';
    return <AssetCard id={id} data={assetData} compact={useCompact} />;
  }

  if (isPick) {
    const assetData = normalizeToAssetData(data, id);
    return <AssetCard id={id} data={assetData} />;
  }

  if (data.assetLabel) {
    const assetData = normalizeToAssetData(data, id);
    return <AssetCard id={id} data={assetData} />;
  }

  const assetData = normalizeToAssetData(data, id);
  if (Array.isArray((data as any).waivedStack) && (data as any).waivedStack.length > 0) {
    return <AssetCard id={id} data={{ ...assetData, waivedStack: (data as any).waivedStack }} />;
  }
  return <AssetCard id={id} data={assetData} />;
};

function normalizeToAssetData(data: any, _id: string): import('./AssetCard').AssetCardData {
  const hasPortal = !!(data.portal || data.packageHint);
  const portal = data.portal ?? (data.packageHint ? { label: data.packageHint, targetTradeId: data.portalTargetTradeId || '' } : undefined);

  const hasDrafted = !!(data.drafted_player || (data.draftedName && data.draftedAt != null) || (data.playerLabel && data.draftPick != null));
  const extractImg = (v: any) => {
    if (!v) return undefined;
    if (typeof v === 'string' && v.startsWith('http')) {
      const m = v.match(/(\d+)\.png/);
      return m ? m[1] : v;
    }
    return typeof v === 'string' ? v : undefined;
  };
  const drafted_player = data.drafted_player ?? (data.draftedName && data.draftedAt != null
    ? { name: data.draftedName, img: extractImg(data.draftedImg) || extractImg(data.img), pickNumber: Number(data.draftedAt) }
    : data.playerLabel && data.draftPick != null
    ? { name: data.playerLabel, img: extractImg(data.playerImage) || extractImg(data.img), pickNumber: Number(data.draftPick) }
    : data.label && data.draftPick != null
    ? { name: data.label, img: extractImg(data.img), pickNumber: Number(data.draftPick) }
    : undefined);

  const hasBadge = !!(data.badge || data.status);
  const badge = data.badge ?? (data.status ? {
    label: data.status,
    variant: (data.status?.toUpperCase().includes('CONVERTED') || data.status?.toUpperCase().includes('DID NOT CONVEY') ? 'amber' : data.status === 'WAIVED' ? 'red' : 'zinc') as 'amber' | 'red' | 'zinc'
  } : undefined);

  const showTeamFlow = !!(data as any).showTeamFlow;
  const fromTeam = (data as any).from;
  const toTeam = (data as any).to;
  const rawTitle = data.assetLabel ?? data.assetTitle ?? data.label;
  const isPickType = (data as any).type === 'pick';
  const pickLabel = isPickType ? normalizePickLabel(typeof rawTitle === 'string' ? rawTitle : data.description) : undefined;
  return {
    label: pickLabel ?? data.label,
    subLabel: data.subLabel,
    fromTeam,
    toTeam,
    assetTitle: pickLabel ?? data.assetLabel ?? data.assetTitle,
    assetSub: data.assetSub,
    restriction: data.restriction ?? data.protection,
    footer: data.footer,
    footerSub: data.footerSub,
    customColor: data.customColor,
    isSent: data.isSent,
    hasChildren: data.hasChildren,
    collapsed: data.collapsed,
    onCollapse: data.onCollapse,
    onNavigateToTrade: data.onNavigateToTrade,
    suppressCollapseButton: data.suppressCollapseButton,
    img: data.img ?? (data.id && typeof data.id === 'string' && /^\d+$/.test(data.id) ? data.id : undefined),
    type: data.type,
    amount: data.amount,
    ...(hasPortal && portal ? { portal } : {}),
    ...(hasDrafted && drafted_player ? { drafted_player } : {}),
    ...(hasBadge && badge ? { badge } : {}),
    ...((data as any).teamBadge ? { teamBadge: (data as any).teamBadge } : {}),
    ...((data as any).teamBadgeColor ? { teamBadgeColor: (data as any).teamBadgeColor } : {}),
    ...((data as any).topRowSameSize ? { topRowSameSize: true } : {}),
    ...((data as any).topRowAlign ? { topRowAlign: true } : {}),
    ...((data as any).suppressTeamFlow ? { suppressTeamFlow: true } : {}),
    ...((data as any).cardW != null ? { cardW: (data as any).cardW } : {}),
    ...((data as any).cardH != null ? { cardH: (data as any).cardH } : {}),
  };
}

const nodeTypes = { player: PlayerNode };
const edgeTypes = { straight: StepEdge, direct: DirectEdge };

export default function TradeTreeApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [currentTrade, setCurrentTrade] = useState<any>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  return (
    <ReactFlowProvider>
      <TradeTreeInner 
        nodes={nodes} setNodes={setNodes} onNodesChange={onNodesChange}
        edges={edges} setEdges={setEdges} onEdgesChange={onEdgesChange}
        currentTrade={currentTrade} setCurrentTrade={setCurrentTrade}
        selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer}
        collapsedIds={collapsedIds} setCollapsedIds={setCollapsedIds}
      />
    </ReactFlowProvider>
  );
}

function TradeTreeInner({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, currentTrade, setCurrentTrade, selectedPlayer, setSelectedPlayer, collapsedIds, setCollapsedIds }: any) {
  const { fitView } = useReactFlow();
  const [isMobile, setIsMobile] = useState(false);
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [showTradeList, setShowTradeList] = useState<{ id: string; label: string; img?: string } | null>(null);
  const [showComingSoon, setShowComingSoon] = useState<{ id: string; label: string; img?: string } | null>(null);
  /** When set, buildTree uses this instead of TRADE_HISTORY (tree built from flat trades.json). */
  const [flatTreeMap, setFlatTreeMap] = useState<Record<string, any[]> | null>(null);
  /** When viewing a flat-derived tree, which player and which trade index (0 = most recent). */
  const [flatTreePlayerId, setFlatTreePlayerId] = useState<string | null>(null);
  const [flatTreeTradeIndex, setFlatTreeTradeIndex] = useState(0);
  /** Direct mode: only assets between focal's teams. Full: show all assets in trade. */
  const [showFullTrade, setShowFullTrade] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCollapseToggle = useCallback((nodeId: string, isCollapsed: boolean) => {
    setCollapsedIds((prev: Set<string>) => {
      const next = new Set(prev);
      isCollapsed ? next.add(nodeId) : next.delete(nodeId);
      return next;
    });
  }, []);

  const extractYear = useCallback((dateStr: string | undefined): number | null => {
    if (!dateStr) return null;
    const match = dateStr.match(/(19|20)\d{2}/);
    return match ? Number(match[0]) : null;
  }, []);

  // Layout: tight for readability, no overlap. See .cursor/rules/trade-tree-layout.mdc
  const leafWidth = isMobile ? 200 : 260; // min space per leaf; must be >= CARD_WIDTH (148) + buffer
  const pickWidth = isMobile ? 180 : 200;
  const siblingGap = isMobile ? 52 : 70; // tighter so branches (e.g. Ingram) don’t push tree off-screen
  const topRowGap = isMobile ? 44 : 56;

  const historySource = flatTreeMap ?? TRADE_HISTORY;
  const hasHistory = useCallback((id: string) => !!historySource[id], [historySource]);

  const maxBranchWidth = leafWidth * 1.6; // cap so one branch (e.g. Ingram) doesn’t blow out the layout
  const measureSubtreeDepth = useCallback((tradeData: any, parentId: string | null = null): number => {
    if (parentId && collapsedIds.has(parentId)) return 0;
    const ch = tradeData.assets || [];
    let maxChild = 0;
    for (const asset of ch) {
      if ((asset.type === 'player' || asset.type === 'star' || asset.type === 'pick') && hasHistory(asset.id)) {
        const next = historySource[asset.id][0];
        maxChild = Math.max(maxChild, measureSubtreeDepth(next, asset.id));
      }
    }
    return 1 + maxChild;
  }, [collapsedIds, hasHistory, historySource]);

  const measureTradeWidth = useCallback((tradeData: any, parentId: string | null = null): number => {
    if (parentId && collapsedIds.has(parentId)) return leafWidth;

    const children = tradeData.assets || [];
    if (children.length === 0) return leafWidth;

    const childWidths = children.map((asset: any) => {
      if (hasHistory(asset.id)) {
        const nextTrade = historySource[asset.id][0];
        return measureTradeWidth(nextTrade, asset.id);
      }
      return leafWidth;
    });

    const total =
      childWidths.reduce((sum: number, w: number) => sum + w, 0) +
      Math.max(0, children.length - 1) * siblingGap;

    return Math.min(maxBranchWidth, Math.max(leafWidth, total));
  }, [collapsedIds, hasHistory, historySource, leafWidth, maxBranchWidth, siblingGap]);

  const handleNavigateToTrade = useCallback((tradeId: string) => {
    const next = historySource[tradeId]?.[0];
    if (next) {
      setCurrentTrade(next);
      setCollapsedIds(new Set());
    }
  }, [historySource, setCurrentTrade, setCollapsedIds]);

  const buildTree = useCallback((
    tradeData: any,
    startX: number,
    startY: number,
    parentId: string | null = null,
    level: number = 0,
    parentTradeDate: string | null = null,
    parentColor: string | null = null,
    onNavigateToTrade?: (tradeId: string) => void,
    parentAssetId?: string,
    rootIsFirstTrade?: boolean,
    parentBranchIndex?: number,
    parentBranchOuter?: 'left' | 'right',
    compactVertical?: boolean,
    parentDraftedPlayerId?: string,
    colorReferenceYear?: number,
    directTeamsFromParent?: { from: string; to: string } | null
  ) => {
    let genNodes: any[] = [];
    let genEdges: any[] = [];
    
    if (parentId && collapsedIds.has(parentId)) return { nodes: [], edges: [] };

    const tradeYear = parseInt(tradeData.date.split(',')[1]?.trim()) || 2020;
    const refYear = colorReferenceYear ?? tradeYear;
    const isMultiTeamTrade = (tradeData as any).numTeams && (tradeData as any).numTeams > 2;
    const rootColor = getHistoricalColor(tradeData.root?.team ?? 'NYK', refYear);

    // Structure: Top = Origin (focal asset), Middle = Date/Event, Bottom = Received assets only. Never put focal and "traded for" on same row.
    const allAssets = tradeData.assets || [];
    const rootId = tradeData.root?.id != null ? String(tradeData.root.id) : '';
    const skipRootAsDuplicate = !!(parentId && rootId && (
      (parentAssetId != null && String(parentAssetId) === rootId) ||
      (parentDraftedPlayerId != null && String(parentDraftedPlayerId) === rootId)
    ));
    // One node per asset: don't show the same asset again in the bottom row (parent asset or root when we're skipping root).
    let bottomRowAssets = allAssets.filter((a: any) => {
      if (parentAssetId != null && String(a?.id) === String(parentAssetId)) return false;
      if (skipRootAsDuplicate && String(a?.id) === rootId) return false;
      return true;
    });
    // Direct mode: only show assets that moved between focal's from/to teams (e.g. MIL↔NOP for Bledsoe).
    let directTeams: { from: string; to: string } | null = null;
    if (!showFullTrade) {
      if (directTeamsFromParent != null) {
        directTeams = directTeamsFromParent;
      } else {
        const focalAsset = [...(tradeData.assets || []), ...(tradeData.packageSent || [])].find(
          (a: any) => String(a?.id) === rootId
        );
        let focalFrom = focalAsset?.from ?? (tradeData.root as any)?.from;
        let focalTo = focalAsset?.to ?? (tradeData.root as any)?.to ?? tradeData.root?.team;
        if (!focalFrom || !focalTo) {
          const teamsStr = String(tradeData.teamsTrading ?? '');
          const arrowMatch = teamsStr.match(/([A-Z]{3})\s*[→↔]\s*([A-Z]{3})/);
          if (arrowMatch) {
            focalFrom = focalFrom ?? arrowMatch[1];
            focalTo = focalTo ?? arrowMatch[2];
          }
        }
        if (focalFrom && focalTo) {
          directTeams = { from: String(focalFrom).trim(), to: String(focalTo).trim() };
        }
      }
      if (directTeams) {
        const inDirect = (a: any) => {
          let f = (a.from ?? '').trim();
          let t = (a.to ?? a.team ?? '').trim();
          if (!f && t) f = t === directTeams!.from ? directTeams!.to : t === directTeams!.to ? directTeams!.from : '';
          if (!t && f) t = f === directTeams!.from ? directTeams!.to : f === directTeams!.to ? directTeams!.from : '';
          const betweenTeams = (f === directTeams!.from || f === directTeams!.to) && (t === directTeams!.from || t === directTeams!.to);
          // Also include assets that went TO focal's origin team (e.g. Lillard to MIL when Jrue went MIL→POR)
          const toFocalOrigin = t === directTeams!.from;
          return betweenTeams || toFocalOrigin;
        };
        bottomRowAssets = bottomRowAssets.filter(inDirect);
      }
    }
    // When direct mode filters out all bottom assets, skip this trade entirely to avoid orphan lines
    if (bottomRowAssets.length === 0) {
      return { nodes: [], edges: [] };
    }
    const pkgSentRaw = tradeData.packageSent || [];
    const pkgSent = directTeams ? pkgSentRaw.filter((p: any) => {
      let f = (p.from ?? '').trim();
      let t = (p.to ?? p.team ?? '').trim();
      if (!f && t) f = t === directTeams!.from ? directTeams!.to : t === directTeams!.to ? directTeams!.from : '';
      if (!t && f) t = f === directTeams!.from ? directTeams!.to : f === directTeams!.to ? directTeams!.from : '';
      return (f === directTeams!.from || f === directTeams!.to) && (t === directTeams!.from || t === directTeams!.to);
    }) : pkgSentRaw;
    const tradeId = tradeData.id || parentId || 'root';
    const EDGE_NEUTRAL = 'rgba(255,255,255,0.35)'; // visible but not harsh
    const SIDECAR_CARD_WIDTH = 148; // Tighter nodes to reduce wasted space
    const CARD_WIDTH = SIDECAR_CARD_WIDTH;
    const tridentSpacing = isMobile ? 200 : 220;

    // Layout Rule 1: Rank separation. Tighter values to reduce scroll; compact when showFullTrade off.
    const useTightVertical = !showFullTrade || !!compactVertical;
    const RANK_GAP = useTightVertical ? 10 : 48; // reduced from 80 — less vertical gap between rows
    const CARD_H = 168;
    const DATE_NODE_HEIGHT = useTightVertical ? 18 : 24; // reduced from 32

    // Layout Rule 2: Date node at vertical midpoint.
    // 1-for-1: date exactly between higher node (Lonzo) and lower node (Okoro).
    // Multi-asset: date at midpoint between higher row and where the line breaks horizontal (junction).
    const originRowY = startY;
    let topRowItems: any[] = tradeData.root ? [tradeData.root, ...pkgSent] : [];
    const isSingleBranch = topRowItems.length === 1 && allAssets.length === 1;
    const _maxTopH = topRowItems.length === 0 ? CARD_H : Math.max(CARD_H, ...topRowItems.map((i: any) => (i.type === 'pick' && i.drafted_player) ? CARD_H : i.type === 'pick' ? 88 : i.type === 'cash' ? 88 : CARD_H));
    const topCardBottom = originRowY + _maxTopH;
    const originRowCenterY = originRowY + _maxTopH / 2;
    const hasOwnTopRowForLayout = topRowItems.length > 0 && !skipRootAsDuplicate;
    const actualTopRowBottomForLayout = hasOwnTopRowForLayout ? topCardBottom : originRowY;
    // "Card above" = top row center when we have our own top row (root or origin); else parent's result row center.
    const hasOwnTopRow = topRowItems.length > 0 && !(parentId && parentAssetId != null && tradeData.root != null && String(parentAssetId) === String(tradeData.root.id));
    const cardAboveCenterY = hasOwnTopRow ? originRowCenterY : startY - 6 - CARD_H / 2;
    const JUNCTION_OFFSET = 32; // vertical gap from date to where line goes horizontal to bottom row
    let dateNodeCenterY: number;
    let actualTopRowBottom: number | null = null; // set in top-row block, used to refine date node Y
    if (isSingleBranch) {
      // True midpoint between top row center and bottom row center.
      // resultRowY = dateNodeCenterY + DATE_NODE_HEIGHT/2 + RANK_GAP, cardBelowCenterY = resultRowY + CARD_H/2.
      // dateNodeCenterY = (cardAboveCenterY + cardBelowCenterY) / 2 => dateNodeCenterY = cardAboveCenterY + (DATE_NODE_HEIGHT/2 + RANK_GAP + CARD_H/2).
      const halfDatePlusGapPlusHalfCard = DATE_NODE_HEIGHT / 2 + RANK_GAP + CARD_H / 2;
      dateNodeCenterY = cardAboveCenterY + halfDatePlusGapPlusHalfCard;
    } else {
      // Multi-asset: uniform row spacing — same RANK_GAP between row 1→2 and row 2→3.
      // resultRowY = top row bottom + RANK_GAP; date/junction fit in that gap.
      const resultRowYMulti = actualTopRowBottomForLayout + RANK_GAP;
      const junctionYMulti = resultRowYMulti - JUNCTION_OFFSET;
      dateNodeCenterY = (actualTopRowBottomForLayout + junctionYMulti) / 2;
    }
    const resultRowY = isSingleBranch
      ? dateNodeCenterY + DATE_NODE_HEIGHT / 2 + RANK_GAP
      : actualTopRowBottomForLayout + RANK_GAP;

    const dateNodeId = `date-${tradeId}`;

    // Layout Rule 3 + Vertical Snap: for single-branch, all nodes must share the same center X so edges are vertical (no diagonal).
    // nodeOrigin [0.5, 0.5] means position = node CENTER — so we pass centerX for x, not left edge.
    const centerX = startX;
    const DATE_NODE_WIDTH = 260;

    // —— Middle Node: Date (2 lines: date + teams). Click opens side panel with trade summary. ——
    genNodes.push({
      id: dateNodeId,
      type: 'player',
      position: { x: centerX, y: dateNodeCenterY },
      style: { width: 180, minWidth: 180, height: DATE_NODE_HEIGHT },
        data: {
          type: 'date',
          label: tradeData.date,
          teamsDisplay: tradeData.teamsTrading ?? '',
          tradeSummary: {
          id: tradeData.id,
          date: tradeData.date,
          teamsTrading: tradeData.teamsTrading,
          summary: tradeData.summary,
          assets: tradeData.assets ?? [],
          packageSent: tradeData.packageSent ?? [],
          root: tradeData.root ?? null,
          tradeExceptionGenerated: tradeData.tradeExceptionGenerated,
          tradeExceptions: tradeData.tradeExceptions,
          focalPlayer: tradeData.root ? { label: tradeData.root.label, id: tradeData.root.id } : null,
        },
        tradeException: tradeData.tradeExceptionGenerated,
        tradeExceptions: tradeData.tradeExceptions,
        source: tradeData.source,
      },
      draggable: false,
      zIndex: 120,
      selectable: true,
    });

    // —— Top Node(s): Origin — the asset we are tracking (and optionally package sent with) ——
    // When recursing from an asset that IS the root (or a pick that became this root player), skip duplicate root node.
    const edgeFromParentType = 'straight'; // orthogonal only — no diagonal lines from parent to date
    const edgeStroke = EDGE_NEUTRAL;
    const edgeStrokeWidth = 2.25;
    if (topRowItems.length === 0 || skipRootAsDuplicate) {
      // No top row: use startY as top of gap so date node positioning still applies
      actualTopRowBottom = originRowY;
      if (level > 0 && parentId) {
        const junctionY = startY - RANK_GAP / 2 - (parentBranchIndex ?? 0) * 14;
        genEdges.push({
          id: `e-${parentId}-${dateNodeId}`,
          source: parentId,
          target: dateNodeId,
          type: edgeFromParentType,
          data: { sourceColor: edgeStroke, junctionY },
          style: { stroke: edgeStroke, strokeWidth: edgeStrokeWidth },
          zIndex: 1,
        });
      }
    } else {
      // Sort so "dead" lines (waived / 0 GP, etc.) drift toward the ends visually.
      topRowItems = [...topRowItems].sort((a, b) => {
        const aDead = typeof a.status === 'string' && (a.status.toUpperCase().startsWith('WAIVED') || a.status === '0 GP');
        const bDead = typeof b.status === 'string' && (b.status.toUpperCase().startsWith('WAIVED') || b.status === '0 GP');
        if (aDead === bDead) return 0;
        return aDead ? 1 : -1;
      });

      // Put focal player (root) at center of top row so "the player we're looking at" is always the centered one.
      const root = tradeData.root ? topRowItems.find((t: any) => t.id === tradeData.root?.id) : null;
      if (root && topRowItems.length > 1) {
        const others = topRowItems.filter((t: any) => t.id !== root.id);
        const leftCount = Math.floor((others.length + 1) / 2);
        topRowItems = [...others.slice(0, leftCount), root, ...others.slice(leftCount)];
      }

      const topRowSlotW = CARD_WIDTH + topRowGap;
      const singleParentX = centerX;
      const totalTopWidth = (topRowItems.length - 1) * topRowSlotW + CARD_WIDTH;
      let topCursorX =
        topRowItems.length === 1 ? singleParentX : centerX - totalTopWidth / 2 + CARD_WIDTH / 2;
      const PICK_W = 140;
      const PICK_H = 88;
      // Uniform card sizes for aesthetic consistency (no focal jump, no drafted-pick height variance)
      function getTopCardDim(item: any): { w: number; h: number } {
        if (item.type === 'cash') return { w: CARD_WIDTH, h: PICK_H };
        if (item.type === 'pick' && item.drafted_player) return { w: CARD_WIDTH, h: CARD_H };
        if (item.type === 'pick') return { w: CARD_WIDTH, h: PICK_H };
        return { w: CARD_WIDTH, h: CARD_H };
      }
      const maxTopH = Math.max(...topRowItems.map((i: any) => getTopCardDim(i).h));
      actualTopRowBottom = originRowY + maxTopH;
      const rowTopY = originRowY;
      const topRowCenterY = rowTopY + maxTopH / 2;
      const topRowNodeIds: string[] = [];
      topRowItems.forEach((item: any, idx: number) => {
        const itemId = item.id ?? `origin-${tradeId}-${idx}`;
        const nodeId = `node-${tradeId}-${itemId}`;
        topRowNodeIds.push(nodeId);
        const isFocal = item.id === tradeData.root?.id;
        const nodeX = topRowItems.length === 1 ? singleParentX : topCursorX;
        const playerImg = item.img ?? (item.id != null && /^\d+$/.test(String(item.id)) ? String(item.id) : undefined);
        const nodeType =
          (item.type === 'player' || item.type === 'star') && !isFocal
            ? 'packageItem'
            : item.type;
        const dimTop = getTopCardDim(item);
        const cardCenterY = topRowCenterY;
        genNodes.push({
          id: nodeId,
          type: 'player',
          position: { x: nodeX, y: cardCenterY },
          style: { width: dimTop.w, height: dimTop.h },
          data: {
            ...item,
            ...{ cardW: dimTop.w, cardH: dimTop.h },
            img: playerImg ?? item.img,
            fromTeam: item.from,
            toTeam: item.to,
            type: nodeType,
            level: level + 1,
            onCollapse: handleCollapseToggle,
            collapsed: collapsedIds.has(nodeId),
            hasChildren: (item.type === 'player' || item.type === 'star' || item.type === 'pick' || (idx === 0 && item.id === tradeData.root?.id)) && hasHistory(item.id),
            ...(isFocal && rootIsFirstTrade ? { suppressCollapseButton: true } : {}),
            ...(isFocal ? { suppressTeamFlow: true } : {}),
            customColor: getHistoricalColor(item.team || item.to || tradeData.root?.team || 'NYK', refYear),
            onNavigateToTrade: onNavigateToTrade ?? handleNavigateToTrade,
            showTeamFlow: false,
            teamBadge: (item.to || item.team) || undefined,
            teamBadgeColor: getHistoricalColor(item.to || item.team || 'NYK', refYear),
            topRowSameSize: !isFocal && topRowItems.length > 1,
            topRowAlign: topRowItems.length > 1,
          },
          draggable: false,
          zIndex: isFocal ? 200 : 150,
        });
        topCursorX += topRowSlotW;
      });

      // Horizontal edges connecting all top row assets — use Right/Left handles so lines are flat at node mid-height
      for (let i = 0; i < topRowNodeIds.length - 1; i++) {
        genEdges.push({
          id: `e-rail-${tradeId}-top-${i}`,
          source: topRowNodeIds[i],
          target: topRowNodeIds[i + 1],
          sourceHandle: 'right',
          targetHandle: 'left',
          type: 'direct',
          data: { sourceColor: EDGE_NEUTRAL },
          style: { stroke: EDGE_NEUTRAL, strokeWidth: 2 },
          zIndex: 0,
        });
      }

      // Single vertical from middle top node (focal) to date node — use bottom handle so line doesn't show above Luka.
      const midTopIdx = Math.floor(topRowNodeIds.length / 2);
      genEdges.push({
        id: `e-${topRowNodeIds[midTopIdx]}-${dateNodeId}`,
        source: topRowNodeIds[midTopIdx],
        target: dateNodeId,
        sourceHandle: 'bottom',
        targetHandle: 'topTarget',
        type: 'direct',
        data: { sourceColor: EDGE_NEUTRAL },
        style: { stroke: EDGE_NEUTRAL, strokeWidth: 2.25 },
        zIndex: 0,
      });

      if (level > 0 && parentId) {
        const junctionY = startY - RANK_GAP / 2 - (parentBranchIndex ?? 0) * 14;
        if (skipRootAsDuplicate) {
          genEdges.push({
            id: `e-${parentId}-${dateNodeId}`,
            source: parentId,
            target: dateNodeId,
            type: edgeFromParentType,
            data: { sourceColor: edgeStroke, junctionY },
            style: { stroke: edgeStroke, strokeWidth: edgeStrokeWidth },
            zIndex: 1,
          });
        } else {
          const originNodeId = `node-${tradeId}-${tradeData.root?.id ?? `origin-${tradeId}-0`}`;
          genEdges.push({
            id: `e-${parentId}-${originNodeId}`,
            source: parentId,
            target: originNodeId,
            type: edgeFromParentType,
            data: { sourceColor: edgeStroke, junctionY },
            style: { stroke: edgeStroke, strokeWidth: edgeStrokeWidth },
            zIndex: 1,
          });
        }
      }
    }

    // —— Bottom Node(s): Result — orthogonal lines: date → middle asset, rail connects all.
    const PICK_W_BOTTOM = 140;
    const PICK_H_BOTTOM = 88;
    function getCardDim(item: any): { w: number; h: number } {
      if (item.type === 'cash') return { w: PICK_W_BOTTOM, h: PICK_H_BOTTOM };
      if (item.type === 'pick' && !item.drafted_player) return { w: PICK_W_BOTTOM, h: PICK_H_BOTTOM };
      if (item.type === 'pick' && item.drafted_player) return { w: CARD_WIDTH, h: CARD_H };
      if (item.type === 'other' && /^\*?Conditions?:/i.test((item.description ?? item.label ?? '').toString())) return { w: 180, h: PICK_H_BOTTOM };
      return { w: CARD_WIDTH, h: CARD_H };
    }
    if (bottomRowAssets.length > 0) {
      const sortedAssets = [...bottomRowAssets].sort((a: any, b: any) => {
        const aDead = typeof a.status === 'string' && (a.status.toUpperCase().startsWith('WAIVED') || a.status === '0 GP');
        const bDead = typeof b.status === 'string' && (b.status.toUpperCase().startsWith('WAIVED') || b.status === '0 GP');
        if (aDead === bDead) return 0;
        return aDead ? 1 : -1;
      });

      const dims = sortedAssets.map((item: any) => getCardDim(item));
      const bottomRowTop = resultRowY;
      const maxBottomH = Math.max(...dims.map((d) => d.h), CARD_H);
      const isWaived = (i: number) => typeof sortedAssets[i].status === 'string' && sortedAssets[i].status.toUpperCase().startsWith('WAIVED');

      type ColumnDesc = { type: 'teamLabel'; team: string } | { type: 'asset'; idx: number } | { type: 'waivedStack'; indices: number[] };
      let columnList: ColumnDesc[] = [];
      let columnForAsset: number[] = new Array(sortedAssets.length).fill(-1);

      if (isMultiTeamTrade) {
        // Parse team order from "LAC ↔ MIA ↔ UTA" or "3-team: LAC, MIA, UTA"
        const teamsStr = (tradeData.teamsTrading ?? '') as string;
        const teamOrder = teamsStr.includes('\u2194')
          ? teamsStr.split(/\s*\u2194\s*/).map((s: string) => s.trim()).filter(Boolean)
          : (teamsStr.match(/\b([A-Z]{3})\b/g) ?? []);
        const getTeam = (a: any) => (a.to || a.team || '').trim();
        const groupMap: Record<string, number[]> = {};
        for (let j = 0; j < sortedAssets.length; j++) {
          const t = getTeam(sortedAssets[j]);
          if (!groupMap[t]) groupMap[t] = [];
          groupMap[t].push(j);
        }
        const orderedTeams = [...teamOrder];
        for (const t of Object.keys(groupMap)) {
          if (!orderedTeams.includes(t)) orderedTeams.push(t);
        }
        for (const team of orderedTeams) {
          const indices = groupMap[team] ?? [];
          if (indices.length === 0) continue;
          let k = 0;
          while (k < indices.length) {
            if (!isWaived(indices[k])) {
              columnList.push({ type: 'asset', idx: indices[k] });
              columnForAsset[indices[k]] = columnList.length - 1;
              k++;
            } else {
              const stack: number[] = [indices[k]];
              k++;
              while (k < indices.length && isWaived(indices[k])) {
                stack.push(indices[k]);
                k++;
              }
              columnList.push({ type: 'waivedStack', indices: stack });
              stack.forEach((i) => { columnForAsset[i] = columnList.length - 1; });
            }
          }
        }
      } else {
        const waivedStacks: number[][] = [];
        let i = 0;
        while (i < sortedAssets.length) {
          if (!isWaived(i)) { i++; continue; }
          const stack: number[] = [i];
          i++;
          while (i < sortedAssets.length && isWaived(i)) { stack.push(i); i++; }
          waivedStacks.push(stack);
        }
        const numNonWaived = sortedAssets.length - waivedStacks.flat().length;
        let nonWaivedCol = 0;
        for (let j = 0; j < sortedAssets.length; j++) {
          if (!isWaived(j)) {
            columnList.push({ type: 'asset', idx: j });
            columnForAsset[j] = nonWaivedCol++;
          } else {
            const stackIdx = waivedStacks.findIndex((s) => s.includes(j));
            if (columnForAsset[j] < 0) {
              columnList.push({ type: 'waivedStack', indices: waivedStacks[stackIdx] });
              waivedStacks[stackIdx].forEach((idx) => { columnForAsset[idx] = columnList.length - 1; });
            }
          }
        }
      }

      const numColumns = columnList.length;
      const slotW = CARD_WIDTH + topRowGap;
      const bottomCenterXsByColumn: number[] = new Array(numColumns);
      const totalSpan = (numColumns - 1) * slotW;
      const startX = centerX - totalSpan / 2;
      for (let c = 0; c < numColumns; c++) {
        bottomCenterXsByColumn[c] = startX + c * slotW;
      }
      const bottomCenterXs: number[] = sortedAssets.map((_, idx) => bottomCenterXsByColumn[columnForAsset[idx]]);

      const dateNode = genNodes.find((n: any) => n.id === dateNodeId);
      const junctionY = resultRowY - JUNCTION_OFFSET;
      let junctionX = centerX;
      if (dateNode) {
        const bottomSpanCenter = (Math.min(...bottomCenterXsByColumn) + Math.max(...bottomCenterXsByColumn)) / 2;
        // Keep date node directly under focal (center of top row), not under bottom row
        dateNode.position.x = hasOwnTopRow ? centerX : bottomSpanCenter;
        junctionX = dateNode.position.x;
        // Date node Y already set for uniform spacing (actualTopRowBottomForLayout + junctionY) / 2 — no overwrite
      }

      const bottomRowNodeIds: string[] = new Array(numColumns);
      for (let c = 0; c < numColumns; c++) {
        const col = columnList[c];
        const bottomNodeX = allAssets.length === 1 ? centerX : bottomCenterXsByColumn[c];
        if (col.type === 'asset') {
          const idx = col.idx;
          const item = sortedAssets[idx];
          const assetId = item.id ?? `asset-${tradeId}-${idx}`;
          const nodeId = `node-${tradeId}-${assetId}`;
          bottomRowNodeIds[c] = nodeId;
          const dim = dims[idx];
          const playerImg = (item.type === 'player' || item.type === 'star') && item.id != null && /^\d+$/.test(String(item.id)) ? String(item.id) : item.img;
          const teamBadge = (item.to || item.team) || undefined;
          const assetCenterY = bottomRowTop + maxBottomH / 2;
          genNodes.push({
            id: nodeId,
            type: 'player',
            position: { x: bottomNodeX, y: assetCenterY },
            style: { width: dim.w, height: dim.h },
            data: {
              ...item,
              ...{ cardW: dim.w, cardH: dim.h },
              img: playerImg ?? item.img,
              fromTeam: item.from,
              toTeam: item.to,
              type: item.type === 'pick' ? 'pick' : (item.type === 'cash' ? 'cash' : 'packageItem'),
              level: level + 1,
              onCollapse: handleCollapseToggle,
              collapsed: collapsedIds.has(nodeId),
              hasChildren: (item.type === 'player' || item.type === 'star' || item.type === 'pick') && hasHistory(item.id),
              customColor: getHistoricalColor(item.team || item.to || tradeData.root?.team || 'NYK', refYear),
              onNavigateToTrade: onNavigateToTrade ?? handleNavigateToTrade,
              showTeamFlow: false,
              teamBadge,
              teamBadgeColor: getHistoricalColor(item.to || item.team || 'NYK', refYear),
            },
            draggable: false,
            zIndex: 100,
          });
        } else if (col.type === 'waivedStack') {
          const stack = col.indices;
          const stackIdx = columnList.slice(0, c).filter((x: ColumnDesc) => x.type === 'waivedStack').length;
          const stackNodeId = `node-${tradeId}-waived-stack-${stackIdx}`;
          bottomRowNodeIds[c] = stackNodeId;
          const waivedItems = stack.map((idx: number) => sortedAssets[idx]);
          const waivedStackData = waivedItems.map((it: any) => {
            const normalized = normalizeToAssetData({ ...it, fromTeam: it.from, toTeam: it.to }, '');
            const displayName = normalized.label ?? it.label ?? it.name ?? (typeof it.description === 'string' ? (it.description.match(/^([^(]+?)\s*\(?/) ?? [])[1]?.trim() : null) ?? 'Unknown';
            return { ...normalized, label: displayName, description: it.description };
          });
          const waivedTeam = waivedItems[0]?.to || waivedItems[0]?.team || tradeData.root?.team || 'NYK';
          const waivedTeamColor = getHistoricalColor(waivedTeam, refYear);
          genNodes.push({
            id: stackNodeId,
            type: 'player',
            position: { x: bottomNodeX, y: bottomRowTop + CARD_H / 2 },
            style: { width: CARD_WIDTH, height: CARD_H },
            data: {
              label: `${waivedItems.length} Waived`,
              badge: { label: `${waivedItems.length} WAIVED`, variant: 'zinc' as const },
              waivedStack: waivedStackData,
              teamBadge: waivedTeam,
              teamBadgeColor: waivedTeamColor,
              level: level + 1,
              onCollapse: handleCollapseToggle,
              collapsed: collapsedIds.has(stackNodeId),
              customColor: waivedTeamColor,
              onNavigateToTrade: onNavigateToTrade ?? handleNavigateToTrade,
              ...(isMultiTeamTrade ? { showTeamFlow: true } : {}),
            },
            draggable: false,
            zIndex: 100,
          });
        }
      }

      // One trunk (date → junction) then one branch per result (junction → node) so lines aren’t stacked.
      const junctionNodeId = `junction-${tradeId}`;
      genNodes.push({
        id: junctionNodeId,
        type: 'player',
        position: { x: junctionX, y: junctionY },
        data: { type: 'router' },
        style: { width: 1, height: 1 },
        draggable: false,
        selectable: false,
        zIndex: 0,
      });
      genEdges.push({
        id: `e-${dateNodeId}-${junctionNodeId}`,
        source: dateNodeId,
        target: junctionNodeId,
        sourceHandle: 'bottom',
        targetHandle: 'topTarget',
        type: 'direct',
        data: { sourceColor: EDGE_NEUTRAL },
        style: { stroke: EDGE_NEUTRAL, strokeWidth: 2.25 },
        zIndex: 1,
      });
      const minRailX = Math.min(...bottomCenterXsByColumn);
      const maxRailX = Math.max(...bottomCenterXsByColumn);
      const leftRailId = `rail-left-${tradeId}`;
      const rightRailId = `rail-right-${tradeId}`;
      genNodes.push({
        id: leftRailId,
        type: 'player',
        position: { x: minRailX, y: junctionY },
        data: { type: 'router' },
        style: { width: 1, height: 1 },
        draggable: false,
        selectable: false,
        zIndex: 0,
      });
      genNodes.push({
        id: rightRailId,
        type: 'player',
        position: { x: maxRailX, y: junctionY },
        data: { type: 'router' },
        style: { width: 1, height: 1 },
        draggable: false,
        selectable: false,
        zIndex: 0,
      });
      // Connect rails directly to bottom nodes (vertical drops) — leftRail/rightRail are at column 0 and last column
      if (numColumns === 1) {
        const targetId = bottomRowNodeIds[0];
        if (targetId) {
          genEdges.push({
            id: `e-${junctionNodeId}-${targetId}`,
            source: junctionNodeId,
            target: targetId,
            targetHandle: 'topTarget',
            type: 'direct',
            data: { sourceColor: EDGE_NEUTRAL },
            style: { stroke: EDGE_NEUTRAL, strokeWidth: 2.25 },
            zIndex: 1,
          });
        }
      } else {
        const leftTargetId = bottomRowNodeIds[0];
        const rightTargetId = bottomRowNodeIds[numColumns - 1];
        if (leftTargetId) {
          genEdges.push({
            id: `e-${leftRailId}-${leftTargetId}`,
            source: leftRailId,
            target: leftTargetId,
            targetHandle: 'topTarget',
            type: 'direct',
            data: { sourceColor: EDGE_NEUTRAL },
            style: { stroke: EDGE_NEUTRAL, strokeWidth: 2.25 },
            zIndex: 1,
          });
        }
        if (rightTargetId && rightTargetId !== leftTargetId) {
          genEdges.push({
            id: `e-${rightRailId}-${rightTargetId}`,
            source: rightRailId,
            target: rightTargetId,
            targetHandle: 'topTarget',
            type: 'direct',
            data: { sourceColor: EDGE_NEUTRAL },
            style: { stroke: EDGE_NEUTRAL, strokeWidth: 2.25 },
            zIndex: 1,
          });
        }
        // Middle columns: drop nodes on rail (rail is leftRail→rightRail); drop→node vertical only — no junction→drop to avoid overlap
        for (let c = 1; c < numColumns - 1; c++) {
          const dropId = `rail-drop-${tradeId}-${c}`;
          const targetId = bottomRowNodeIds[c] ?? null;
          genNodes.push({
            id: dropId,
            type: 'player',
            position: { x: bottomCenterXsByColumn[c], y: junctionY },
            data: { type: 'router' },
            style: { width: 1, height: 1 },
            draggable: false,
            selectable: false,
            zIndex: 0,
          });
          if (targetId) {
            genEdges.push({
              id: `e-${dropId}-${targetId}`,
              source: dropId,
              target: targetId,
              targetHandle: 'topTarget',
              type: 'direct',
              data: { sourceColor: EDGE_NEUTRAL },
              style: { stroke: EDGE_NEUTRAL, strokeWidth: 2.25 },
              zIndex: 1,
            });
          }
        }
      }
      // Single horizontal rail (leftRail→rightRail) — use right/left handles so line stays horizontal
      genEdges.push({
        id: `e-${leftRailId}-${rightRailId}`,
        source: leftRailId,
        target: rightRailId,
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'direct',
        data: { sourceColor: EDGE_NEUTRAL },
        style: { stroke: EDGE_NEUTRAL, strokeWidth: 2.25 },
        zIndex: 1,
      });

      // Recurse: outer branches (Lonzo, rightmost) go diagonal outward for space; deeper trees start lower.
      const childWidths = sortedAssets.map((a: any) =>
        ((a.type === 'player' || a.type === 'pick') && hasHistory(a.id)) ? Math.max(leafWidth, measureTradeWidth(historySource[a.id][0], a.id)) : 0
      );
      const indicesLeftToRight = sortedAssets
        .map((_, i) => i)
        .filter((i) => childWidths[i] > 0)
        .sort((a, b) => bottomCenterXs[a] - bottomCenterXs[b]);
      const leftmostIdx = indicesLeftToRight[0] ?? -1;
      const rightmostIdx = indicesLeftToRight[indicesLeftToRight.length - 1] ?? -1;
      // Keep outer branches offset so child nodes don't overlap parent row.
      const outwardOffset = isMobile ? 100 : 140;

      const ROW_HEIGHT = CARD_H + RANK_GAP;
      const depths = new Map<number, number>();
      indicesLeftToRight.forEach((idx) => {
        const next = historySource[sortedAssets[idx].id][0];
        depths.set(idx, measureSubtreeDepth(next, sortedAssets[idx].id));
      });
      const byDepthAsc = [...indicesLeftToRight].sort((a, b) => (depths.get(a) ?? 0) - (depths.get(b) ?? 0));
      let depthYOffset = 0;
      const startYByIndex = new Map<number, number>();
      // One trade block ≈ top row + date + gap + bottom row. Tighter to reduce scroll.
      const VERTICAL_STEP = useTightVertical ? ROW_HEIGHT * 1.1 : ROW_HEIGHT * 1.45; // was 2.2 — less gap between branches
      byDepthAsc.forEach((idx) => {
        startYByIndex.set(idx, bottomRowTop + maxBottomH + RANK_GAP + depthYOffset);
        depthYOffset += (depths.get(idx) ?? 1) * VERTICAL_STEP;
      });

      let prevRight = -Infinity;
      const childPositions: number[] = new Array(sortedAssets.length);
      indicesLeftToRight.forEach((index) => {
        const parentX = bottomCenterXs[index];
        const w = childWidths[index];
        const minX = prevRight + siblingGap + w / 2;
        childPositions[index] = Math.max(minX, parentX);
        prevRight = childPositions[index] + w / 2;
      });

      sortedAssets.forEach((asset: any, index: number) => {
        const assetId = asset.id ?? `asset-${tradeId}-${index}`;
        const nodeId = `node-${tradeId}-${assetId}`;
        const childHasHistory = (asset.type === 'player' || asset.type === 'star' || asset.type === 'pick') && hasHistory(asset.id);
        const nextTradeForChild = childHasHistory ? historySource[asset.id][0] : null;
        if (childHasHistory && nextTradeForChild && !collapsedIds.has(nodeId)) {
          const parentX = bottomCenterXs[index];
          const isSimpleTrade = (nextTradeForChild.assets?.length ?? 0) <= 1; // e.g. Lonzo→Okoro: one asset, minimal space
          let childX = childPositions[index] ?? parentX;
          const useOutward = !isSimpleTrade && indicesLeftToRight.length >= 2;
          if (useOutward && index === leftmostIdx) childX = parentX - outwardOffset;
          else if (useOutward && index === rightmostIdx) childX = parentX + outwardOffset;
          else if (isSimpleTrade) childX = parentX; // straight under parent
          const baseChildY = bottomRowTop + maxBottomH + RANK_GAP;
          const childStartY = isSimpleTrade ? bottomRowTop + maxBottomH + RANK_GAP : (startYByIndex.get(index) ?? baseChildY);
          const outer = useOutward && index === leftmostIdx ? 'left' : useOutward && index === rightmostIdx ? 'right' : undefined;
          const assetColor = getHistoricalColor(asset.team || asset.to || tradeData.root?.team || 'NYK', refYear);
          const draftedId = asset.drafted_player?.nbaId ?? asset.drafted_player?.id;
          // Child trade's directTeams come from its own focal (e.g. Jrue in Lillard trade), not parent asset's from/to
          const { nodes: cNodes, edges: cEdges } = buildTree(nextTradeForChild, childX, childStartY, nodeId, level + 1, tradeData.date, assetColor, onNavigateToTrade ?? handleNavigateToTrade, asset.id, false, index, outer, isSimpleTrade, draftedId != null ? String(draftedId) : undefined, level === 0 ? tradeYear : refYear, undefined);
          genNodes = [...genNodes, ...cNodes];
          genEdges = [...genEdges, ...cEdges];
        }
      });

      // Focal player's next trade (e.g. Anthony Davis 2019→LAL then LAL→DAL): branch from date node to avoid long blank edge
      if (level === 0 && tradeData.focalNextTrade && !skipRootAsDuplicate && topRowItems.length > 0) {
        const focalNextY = bottomRowTop + maxBottomH + RANK_GAP;
        const { nodes: cNodes, edges: cEdges } = buildTree(
          tradeData.focalNextTrade,
          centerX,
          focalNextY,
          dateNodeId,
          level + 1,
          tradeData.date,
          rootColor,
          onNavigateToTrade ?? handleNavigateToTrade,
          tradeData.root?.id,
          false,
          undefined,
          undefined,
          undefined,
          undefined,
          level === 0 ? tradeYear : refYear,
          undefined
        );
        genNodes = [...genNodes, ...cNodes];
        genEdges = [...genEdges, ...cEdges];
      }
    }

    return { nodes: genNodes, edges: genEdges };
  }, [collapsedIds, extractYear, handleCollapseToggle, hasHistory, historySource, isMobile, leafWidth, measureSubtreeDepth, measureTradeWidth, pickWidth, siblingGap, topRowGap, showFullTrade]);

  useEffect(() => {
    if (currentTrade) {
      const { nodes: allNodes, edges: allEdges } = buildTree(currentTrade, 0, 0, null, 0, null, null, handleNavigateToTrade);
      setNodes(allNodes);
      setEdges(allEdges);
      setTimeout(() => fitView({ duration: 800, padding: { top: 0.15, left: 0.2, right: 0.2, bottom: 0.28 }, minZoom: 0.3 }), 100);
    }
  }, [collapsedIds, currentTrade, buildTree, setNodes, setEdges, fitView, showFullTrade]);

  const handleNodeClick = (_: any, node: any) => {
    if (node.data.type === 'router' || node.data.type === 'package' || node.data.type === 'packageItem') return;
    if (node.data.type === 'date') {
      const summary = (node.data as any).tradeSummary;
      if (summary) setSelectedPlayer({ type: 'trade', ...summary });
      return;
    }
    setSelectedPlayer(node.data);
  };

  const handleSelectPlayer = (result: any) => {
    setShowComingSoon(null);
    setShowTradeList(null);
    if (TRADE_HISTORY[result.id]) {
      setFlatTreePlayerId(null);
      setFlatTreeMap(null);
      setCurrentTrade(TRADE_HISTORY[result.id][0]);
      setCollapsedIds(new Set());
    } else if (getTradesForPlayer(result.id).length > 0) {
      setFlatTreePlayerId(result.id);
      setFlatTreeTradeIndex(0);
      const flat = buildTreeFromFlatTrades(result.id, 6, 0);
      if (flat) {
        setFlatTreeMap(flat.historyMap);
        setCurrentTrade(flat.rootTrade);
        setCollapsedIds(new Set());
      } else {
        setFlatTreePlayerId(null);
        setShowTradeList({ id: result.id, label: result.label, img: result.img });
      }
    } else {
      setFlatTreePlayerId(null);
      setFlatTreeMap(null);
      setShowComingSoon({ id: result.id, label: result.label, img: result.img });
    }
  };

  const totalFlatTrades = flatTreePlayerId ? getTradesForPlayer(flatTreePlayerId).length : 0;
  const canPrevTrade = totalFlatTrades > 1 && flatTreeTradeIndex > 0;
  const canNextTrade = totalFlatTrades > 1 && flatTreeTradeIndex < totalFlatTrades - 1;
  const handlePrevTrade = () => {
    if (!flatTreePlayerId || !canPrevTrade) return;
    const newIndex = flatTreeTradeIndex - 1;
    setFlatTreeTradeIndex(newIndex);
    setCollapsedIds(new Set());
    const flat = buildTreeFromFlatTrades(flatTreePlayerId, 6, newIndex);
    if (flat) {
      setFlatTreeMap(flat.historyMap);
      setCurrentTrade(flat.rootTrade);
    }
  };
  const handleNextTrade = () => {
    if (!flatTreePlayerId || !canNextTrade) return;
    const newIndex = flatTreeTradeIndex + 1;
    setFlatTreeTradeIndex(newIndex);
    setCollapsedIds(new Set());
    const flat = buildTreeFromFlatTrades(flatTreePlayerId, 6, newIndex);
    if (flat) {
      setFlatTreeMap(flat.historyMap);
      setCurrentTrade(flat.rootTrade);
    }
  };

  const handleDeleteNode = () => {
    if (!selectedPlayer) return;
    setNodes((nds: Node[]) => nds.filter((n: Node) => n.id !== selectedPlayer.id));
    setEdges((eds: Edge[]) => eds.filter((e: Edge) => e.source !== selectedPlayer.id && e.target !== selectedPlayer.id));
    setSelectedPlayer(null);
  };

  if (showAllTrades) {
    return (
      <div className="h-screen bg-black text-white relative overflow-hidden font-sans">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-8 z-50 w-[90%] md:w-96">
          <PlayerSearch onSelect={handleSelectPlayer} />
        </div>
        <AllTradesView
          onSelectPlayer={handleSelectPlayer}
          onBack={() => setShowAllTrades(false)}
        />
      </div>
    );
  }

  if (showTradeList) {
    return (
      <div className="h-screen bg-black text-white relative overflow-hidden font-sans">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-8 z-50 w-[90%] md:w-96">
          <PlayerSearch onSelect={handleSelectPlayer} />
        </div>
        <TradeListView
          player={showTradeList}
          onBack={() => setShowTradeList(null)}
        />
        <Footer />
      </div>
    );
  }

  if (showComingSoon) {
    return (
      <div className="h-screen bg-black text-white relative overflow-hidden font-sans">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-8 z-50 w-[90%] md:w-96">
          <PlayerSearch onSelect={handleSelectPlayer} />
        </div>
        <button
          onClick={() => setShowComingSoon(null)}
          className="absolute top-8 right-8 z-50 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-mono transition-colors"
        >
          ← Back
        </button>
        <ComingSoonView player={showComingSoon} />
        <Footer />
      </div>
    );
  }

  // Cover / landing when no player or tree selected
  if (!currentTrade && !flatTreePlayerId) {
    return (
      <CoverPage
        onSelect={handleSelectPlayer}
        onAllTrades={() => setShowAllTrades(true)}
      />
    );
  }

  const handleBackToCover = () => {
    setCurrentTrade(null);
    setFlatTreePlayerId(null);
    setFlatTreeMap(null);
    setFlatTreeTradeIndex(0);
    setNodes([]);
    setEdges([]);
    setSelectedPlayer(null);
    setCollapsedIds(new Set());
  };

  const treeTitle = currentTrade?.root?.label ?? null;

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden font-sans">
      <div className="absolute top-8 left-8 z-50 flex items-center gap-4 w-[calc(100%-8rem)] md:w-auto md:max-w-xl">
        <button
          type="button"
          onClick={handleBackToCover}
          className="shrink-0 text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors flex items-baseline gap-2"
        >
          <span>Roster Routes</span>
          {treeTitle && <span className="text-zinc-500 font-normal text-base truncate max-w-[180px] md:max-w-[240px]">· {treeTitle}</span>}
        </button>
        <div className="flex-1 min-w-0">
          <PlayerSearch onSelect={handleSelectPlayer} />
        </div>
      </div>
      
      <div className="absolute top-8 right-8 z-50 flex items-center gap-2">
        <button
          onClick={() => setShowAllTrades(true)}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          All Trades
        </button>
        <DownloadBtn />
      </div>

      <ReactFlow
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={[0.5, 0.5]}
        nodesDraggable={false}
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView 
        minZoom={0.1} 
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Controls className="bg-neutral-900 border-white/10 text-white fill-white rounded-xl overflow-hidden shadow-2xl" />
      </ReactFlow>

      {(currentTrade || flatTreePlayerId) && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-4 py-2 rounded-xl bg-neutral-900/95 border border-white/10 shadow-xl font-mono text-sm">
          {flatTreePlayerId && totalFlatTrades > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevTrade}
                disabled={!canPrevTrade}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                ← Prev
              </button>
              <span className="text-zinc-400 whitespace-nowrap">
                Trade {flatTreeTradeIndex + 1} of {totalFlatTrades}
              </span>
              <button
                type="button"
                onClick={handleNextTrade}
                disabled={!canNextTrade}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Next →
              </button>
            </>
          )}
          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showFullTrade}
              onChange={(e) => setShowFullTrade(e.target.checked)}
              className="rounded border-white/30 bg-transparent text-emerald-500 focus:ring-emerald-500/50"
            />
            <span className="text-xs">Show full trade</span>
          </label>
        </div>
      )}

      {selectedPlayer && (
        <SidePanel
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onDelete={handleDeleteNode}
          onCollapseTree={(nodeId) => {
            handleCollapseToggle(nodeId, true);
            setSelectedPlayer(null);
          }}
        />
      )}

      {/* Footer: slim bar at bottom so it doesn’t clash with trade pager (center) or controls (top-right) */}
      <Footer />
    </div>
  );
}