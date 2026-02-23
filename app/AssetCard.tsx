'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Ticket, ExternalLink, User } from 'lucide-react';
import { getHeadshotUrl, getHeadshotFallback } from './headshots';

type PortalData = {
  label: string;
  targetTradeId: string;
};

type DraftedPlayerData = {
  name: string;
  img?: string;
  pickNumber: number;
};

/** Parse year and round from assetTitle (e.g. "2024 1st") or pickNumber. */
function parseDraftOverlay(assetTitle?: string, pickNumber?: number): { year: string; round: string } {
  const m = (assetTitle || '').match(/^(\d{4})\s*(1st|2nd)$/i);
  if (m) return { year: m[1], round: m[2].toLowerCase() };
  const round = pickNumber != null ? (pickNumber <= 30 ? '1st' : '2nd') : '—';
  const yearMatch = (assetTitle || '').match(/\b(19|20)\d{2}\b/);
  return { year: yearMatch ? yearMatch[0] : '—', round };
}

type BadgeData = {
  label: string;
  variant?: 'amber' | 'green' | 'zinc' | 'red';
};

export type AssetCardData = {
  label: string;
  subLabel?: string;
  /** Team flow for multi-team trades: "FROM → TO" */
  fromTeam?: string;
  toTeam?: string;
  assetTitle?: string;
  assetSub?: string;
  img?: string;
  portal?: PortalData;
  drafted_player?: DraftedPlayerData;
  badge?: BadgeData;
  restriction?: string;
  footer?: string;
  footerSub?: string;
  customColor?: string;
  isSent?: boolean;
  hasChildren?: boolean;
  collapsed?: boolean;
  onCollapse?: (id: string, collapsed: boolean) => void;
  onNavigateToTrade?: (tradeId: string) => void;
  /** When true, hide the collapse button (e.g. focal on earliest trade). */
  suppressCollapseButton?: boolean;
  /** For cash nodes: display type and optional amount below "Cash Considerations" */
  type?: string;
  amount?: string;
  /** Multi-team trade: show which team this asset went to (e.g. "→ LAC") */
  teamBadge?: string;
  /** Hex color for team badge strip (destination team primary color) */
  teamBadgeColor?: string;
  /** For waived-stack node: list of waived assets to show as bullets */
  waivedStack?: Array<{ label?: string; name?: string; description?: string }>;
};

type AssetCardProps = {
  id: string;
  data: AssetCardData;
  /** Compact layout for sidecar/package items */
  compact?: boolean;
};

const BADGE_STYLES: Record<string, string> = {
  amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/50',
  green: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50',
  red: 'bg-red-500/20 text-red-400 border border-red-500/50',
  zinc: 'bg-zinc-700/50 text-zinc-300 border border-zinc-500/50',
};

function isTeamColorDark(hex: string): boolean {
  const m = hex.replace(/^#/, '').match(/.{2}/g);
  if (!m) return true;
  const [r, g, b] = m.map((x) => parseInt(x, 16));
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

function getImgSrc(img: string | undefined, id?: string, name?: string): string {
  return getHeadshotUrl(img, id, name) || getHeadshotFallback();
}

export function AssetCard({ id, data, compact = false }: AssetCardProps) {
  const hasPortal = !!data.portal;
  const hasDrafted = !!data.drafted_player;
  const hasBadge = !!data.badge;
  const isWaived =
    !!data.badge &&
    typeof data.badge.label === 'string' &&
    data.badge.label.toUpperCase().startsWith('WAIVED');

  const handlePortalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.portal?.targetTradeId && data.onNavigateToTrade) {
      data.onNavigateToTrade(data.portal.targetTradeId);
    }
  };

  // Pick (no drafted player): small compact box — font-mono like date node, not the big card
  const dataType = (data as any).type ?? data.type;
  const imgOrId = data.img ?? ((data as any).id && typeof (data as any).id === 'string' && /^\d+$/.test((data as any).id) ? (data as any).id : undefined);
  const isOtherType = dataType === 'other';
  const isConditionsPick = /^\*?Conditions?:/i.test((data.label ?? data.description ?? '').toString());
  const isPlayerStyle = hasDrafted || !!imgOrId || (isOtherType && !isConditionsPick);
  const usePlaceholderImg = isOtherType && !imgOrId && !hasDrafted;
  const teamBadge = data.teamBadge;
  // Conditions/conditional picks: render as compact pick node (not player-style)
  if (isConditionsPick) {
    const condLabel = (data.label ?? data.description ?? 'Conditions').toString().replace(/^\*+/, '').trim();
    const pickW = (data as any).cardW ?? 180;
    const pickH = (data as any).cardH ?? 88;
    return (
      <div
        className="flex flex-col rounded-[20px] border border-zinc-500/50 bg-black/90 shadow overflow-hidden"
        style={{ width: pickW, minWidth: pickW, height: pickH, minHeight: pickH }}
      >
        <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="top" type="source" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="right" type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
        <div className="flex-1 flex flex-col items-center justify-center py-2 px-3 text-center min-h-0">
          <div className="flex justify-center mb-1 text-zinc-500">
            <Ticket size={18} strokeWidth={2} aria-hidden />
          </div>
          <div className="text-sm font-mono font-bold text-zinc-200 leading-tight break-words">{condLabel}</div>
        </div>
      </div>
    );
  }
  if (dataType === 'pick' && !isPlayerStyle) {
    const pickLabel = data.assetTitle ?? data.label ?? 'Pick';
    const pickTeamColor = data.teamBadgeColor;
    const pickW = (data as any).cardW ?? 140;
    const pickH = (data as any).cardH ?? 88;
    return (
      <div
        className="flex flex-col rounded-[20px] border border-zinc-500/50 bg-black/90 shadow overflow-hidden"
        style={{ width: pickW, minWidth: pickW, height: pickH, minHeight: pickH }}
      >
        <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="top" type="source" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="right" type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
        {teamBadge && (
          <div
            className="w-full shrink-0 px-2 py-1 text-center text-xs font-mono font-bold uppercase border-b border-white/10"
            style={{
              backgroundColor: pickTeamColor || 'rgba(0,0,0,0.4)',
              color: pickTeamColor ? (isTeamColorDark(pickTeamColor) ? '#f1f5f9' : '#0f172a') : '#94a3b8',
            }}
          >
            → {teamBadge}
          </div>
        )}
        <div className="flex-1 flex flex-col items-center justify-center py-2 px-3 text-center min-h-0">
          <div className="flex justify-center mb-1 text-zinc-500">
            <Ticket size={18} strokeWidth={2} aria-hidden />
          </div>
          <div className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wide leading-tight break-words">{pickLabel}</div>
          {data.restriction && <div className="text-xs font-mono text-zinc-500 mt-1 leading-tight">{data.restriction}</div>}
        </div>
      </div>
    );
  }

  // Cash: small green box (same compact size as pick)
  if (dataType === 'cash') {
    const amountRaw = (data as any).amount ?? data.amount ?? data.label;
    const showAmount = amountRaw && typeof amountRaw === 'string' && !/value unknown|cash considerations/i.test(amountRaw) && amountRaw.trim() !== '';
    const cashTeamColor = data.teamBadgeColor;
    const cashW = (data as any).cardW ?? 140;
    const cashH = (data as any).cardH ?? 88;
    return (
      <div
        className="flex flex-col items-center justify-center rounded-[20px] border border-emerald-500/50 bg-emerald-950/80 shadow py-2 px-3"
        style={{ width: cashW, minWidth: cashW, height: cashH, minHeight: cashH }}
      >
        <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="top" type="source" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="right" type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
        {teamBadge && (
          <div
            className="w-full text-center text-xs font-mono font-bold uppercase mb-1 py-0.5 rounded-t-[20px]"
            style={{
              backgroundColor: cashTeamColor || 'rgba(0,0,0,0.4)',
              color: cashTeamColor ? (isTeamColorDark(cashTeamColor) ? '#f1f5f9' : '#0f172a') : '#86efac',
            }}
          >
            → {teamBadge}
          </div>
        )}
        <div className="text-base font-mono font-bold text-emerald-300 text-center leading-tight">Cash Considerations</div>
        {showAmount && <div className="text-sm font-mono text-emerald-400/90 mt-2">{amountRaw}</div>}
      </div>
    );
  }

  // Waived stack: one card — title "2 Waived", then bullet list of player names
  const waivedStack = (data as any).waivedStack as Array<{ label?: string; name?: string; description?: string }> | undefined;
  if (Array.isArray(waivedStack) && waivedStack.length > 0) {
    const titleLabel = `${waivedStack.length} Waived`;
    const waivedTeamBadge = (data as any).teamBadge as string | undefined;
    const waivedTeamColor = (data as any).teamBadgeColor as string | undefined;
    const getName = (item: { label?: string; name?: string; description?: string }) => {
      const l = (item?.label ?? (item as any)?.name ?? '').trim();
      if (l && !/^\d+\s+waived$/i.test(l)) return l;
      const desc = (item as any).description;
      if (typeof desc === 'string') {
        const m = desc.match(/^([^(]+?)\s*\(?/);
        if (m && m[1]) return m[1].trim();
      }
      return '—';
    };
    const names = waivedStack.map((item) => getName(item) || '—');
    const CARD_W = 148;
    const CARD_H = 168;
    return (
      <div
        className="rounded-2xl overflow-hidden shadow-2xl box-border flex flex-col bg-black/90 border border-white/10"
        style={{ width: CARD_W, minWidth: CARD_W, maxWidth: CARD_W, height: CARD_H, minHeight: CARD_H, maxHeight: CARD_H }}
      >
        <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
        <Handle id="top" type="source" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
        <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
        {waivedTeamBadge && (
          <div
            className="w-full px-2 py-1 text-center text-xs font-mono font-bold uppercase tracking-wider shrink-0 border-b border-white/20"
            style={{
              backgroundColor: waivedTeamColor || 'rgba(0,0,0,0.4)',
              color: waivedTeamColor ? (isTeamColorDark(waivedTeamColor) ? '#f1f5f9' : '#0f172a') : '#94a3b8',
            }}
          >
            → {waivedTeamBadge}
          </div>
        )}
        <div className="w-full px-3 py-1.5 text-center text-sm font-bold uppercase shrink-0 text-zinc-300 border-b border-white/10">
          {titleLabel}
        </div>
        <div className="flex-1 min-h-0 flex flex-col justify-center py-4 px-4">
          <ul className="list-disc list-inside text-base font-mono font-bold text-white leading-snug space-y-1 break-words">
            {names.map((name, k) => (
              <li key={k}>{name}</li>
            ))}
          </ul>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
        <Handle id="right" type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
      </div>
    );
  }

  // Compact: packageItem-style (small vertical card)
  if (compact) {
    const compactTeamBadge = data.teamBadge;
    const compactTeamColor = data.teamBadgeColor;
    const compactImg = (data as any).img ?? ((data as any).id && typeof (data as any).id === 'string' && /^\d+$/.test((data as any).id) ? (data as any).id : undefined);
    const dataId = (data as any).id;
    const dataName = data.label;
    const pImg = hasDrafted
      ? getImgSrc(data.drafted_player!.img, (data as any).drafted_player?.nbaId ?? dataId, data.drafted_player!.name)
      : getImgSrc(compactImg, dataId, dataName);

    return (
      <div
        className={`flex flex-col items-center rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/90 ${data.isSent ? 'opacity-60' : ''} ${
          isWaived ? 'opacity-40 grayscale' : ''
        }`}
        style={{ width: (data as any).cardW ?? 148, minWidth: (data as any).cardW ?? 148, height: (data as any).cardH ?? 168, minHeight: (data as any).cardH ?? 168 }}
      >
        <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="top" type="source" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
        <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
        {compactTeamBadge && (
          <div
            className="w-full px-2 py-1 text-center text-xs font-mono font-bold uppercase border-b border-white/20"
            style={{
              backgroundColor: compactTeamColor || 'rgba(0,0,0,0.4)',
              color: compactTeamColor ? (isTeamColorDark(compactTeamColor) ? '#f1f5f9' : '#0f172a') : '#94a3b8',
            }}
          >
            → {compactTeamBadge}
          </div>
        )}
        {hasBadge && (
          <div className={`w-full px-2 py-1 text-center text-xs font-bold uppercase ${BADGE_STYLES[data.badge!.variant || 'zinc']}`}>
            {data.badge!.label}
          </div>
        )}
        <div className="w-full flex justify-center pt-2 pb-1 shrink-0">
          {dataType === 'pick' && hasDrafted && data.drafted_player ? (() => {
            const { year, round } = parseDraftOverlay(data.assetTitle, data.drafted_player!.pickNumber);
            return (
              <div className="flex flex-col items-center shrink-0">
                <div className="flex justify-between w-full px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300">
                  <span>{year}</span>
                  <span>{round}</span>
                </div>
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border border-white/10">
                  {pImg && (
                    <img
                      src={pImg}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => ((e.target as HTMLImageElement).src = getHeadshotFallback())}
                      alt=""
                    />
                  )}
                </div>
                <div className="flex justify-between w-full px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300">
                  <span>Pick</span>
                  <span>#{data.drafted_player!.pickNumber}</span>
                </div>
              </div>
            );
          })() : (
            <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
              {pImg && (
                <img
                  src={pImg}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => ((e.target as HTMLImageElement).src = getHeadshotFallback())}
                  alt=""
                />
              )}
            </div>
          )}
        </div>
        <div className="w-full px-3 py-2 text-center border-t border-white/10 flex flex-col justify-center min-h-0 flex-1">
          <div className="min-h-[2.5rem] flex items-center justify-center" title={hasDrafted ? data.drafted_player!.name : data.label}>
            <div className="text-base font-mono font-bold text-white break-words leading-snug text-center w-full">
              {hasDrafted ? data.drafted_player!.name : data.label}
            </div>
          </div>
        </div>
        {hasPortal && (
          <button
            onClick={handlePortalClick}
            className="w-full py-2 px-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors shadow-none"
          >
            {data.portal!.label} <ExternalLink size={12} />
          </button>
        )}
        <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
      </div>
    );
  }

  // Full asset card: uniform size (matches Bledsoe and all player nodes)
  const PLAYER_CARD_WIDTH = (data as any).cardW ?? 148;
  const PLAYER_CARD_HEIGHT = (data as any).cardH ?? 168;
  const PICK_STRIP_HEIGHT = 24;
  const HEADSHOT_SIZE = 80; // Same size for Bledsoe and Missi

  return (
    <div
        className={`group relative rounded-[20px] overflow-hidden shadow-2xl transition-all box-border flex flex-col bg-black/90 border border-white/10 ${
          data.isSent ? 'opacity-60' : ''
        } ${isWaived ? 'opacity-40 grayscale' : ''}`}
      style={{
        width: PLAYER_CARD_WIDTH,
        minWidth: PLAYER_CARD_WIDTH,
        maxWidth: PLAYER_CARD_WIDTH,
        height: PLAYER_CARD_HEIGHT,
        minHeight: PLAYER_CARD_HEIGHT,
        maxHeight: PLAYER_CARD_HEIGHT,
      }}
    >
      <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
      <Handle id="top" type="source" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
      <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />

      {/* TOP: Team badge — filled with destination team primary color */}
      {data.teamBadge && (
        <div
          className="w-full px-1.5 py-0.5 text-center text-xs font-mono font-bold uppercase tracking-wider shrink-0 border-b border-white/20"
          style={{
            backgroundColor: data.teamBadgeColor || 'rgba(0,0,0,0.4)',
            color: data.teamBadgeColor ? (isTeamColorDark(data.teamBadgeColor) ? '#f1f5f9' : '#0f172a') : '#94a3b8',
          }}
        >
          → {data.teamBadge}
        </div>
      )}
      {hasBadge && (
        <div className={`w-full px-2 py-1 text-center text-xs font-bold uppercase shrink-0 ${BADGE_STYLES[data.badge!.variant || 'zinc']}`}>
          {data.badge!.label}
        </div>
      )}

      {/* Headshot: year/round top quadrant, picture, Pick/# bottom quadrant — bands glued above/below, no overlap */}
      {isPlayerStyle ? (
        <div className="w-full shrink-0 flex justify-center pt-0.5">
          {dataType === 'pick' && hasDrafted && data.drafted_player ? (() => {
            const { year, round } = parseDraftOverlay(data.assetTitle, data.drafted_player!.pickNumber);
            return (
            <div className="flex flex-col items-center shrink-0 w-full">
              {/* Top quadrant: year | round — glued above picture */}
              <div className="flex justify-between w-full px-1.5 py-0.5 h-4 items-center text-[10px] font-mono font-bold text-zinc-300 shrink-0">
                <span>{year}</span>
                <span>{round}</span>
              </div>
              {/* Center: picture only */}
              <div
                className="rounded-full overflow-hidden shrink-0 border border-white/10"
                style={{ width: HEADSHOT_SIZE, height: HEADSHOT_SIZE }}
              >
                <img
                  src={getImgSrc(data.drafted_player.img, (data as any).drafted_player?.nbaId ?? (data as any).id, data.drafted_player.name)}
                  className={`w-full h-full min-w-full min-h-full object-cover object-center ${data.isSent ? 'grayscale' : ''}`}
                  onError={(e) => ((e.target as HTMLImageElement).src = getHeadshotFallback())}
                  alt=""
                />
              </div>
              {/* Bottom quadrant: Pick | # — glued below picture */}
              <div className="flex justify-between w-full px-1.5 py-0.5 h-4 items-center text-[10px] font-mono font-bold text-zinc-300 shrink-0">
                <span>Pick</span>
                <span>#{data.drafted_player!.pickNumber}</span>
              </div>
            </div>
            );
          })() : (
            <div
              className="rounded-full overflow-hidden shrink-0 border border-white/10 flex items-center justify-center bg-neutral-900"
              style={{ width: HEADSHOT_SIZE, height: HEADSHOT_SIZE }}
            >
              {usePlaceholderImg ? (
                <User size={Math.round(HEADSHOT_SIZE * 0.45)} className="text-zinc-500" strokeWidth={1.5} aria-hidden />
              ) : (
                <img
                  src={getImgSrc(imgOrId, (data as any).id, data.label)}
                  className={`w-full h-full min-w-full min-h-full object-cover object-center ${data.isSent ? 'grayscale' : ''}`}
                  onError={(e) => ((e.target as HTMLImageElement).src = getHeadshotFallback())}
                  alt=""
                />
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Card body: name + "Drafted #N" (headshot is above) */}
      <div className={`flex flex-col flex-1 min-h-0 overflow-hidden ${isPlayerStyle ? '' : 'py-4 px-4'}`}>
        {data.isSent && (
          <div className="absolute top-0 left-0 right-0 bg-red-900/90 text-white text-lg py-1.5 text-center font-bold uppercase z-10 rounded-t-[20px]">
            TRADED
          </div>
        )}

        {isPlayerStyle ? (
          <>
            <div className="mt-0 min-h-[2rem] flex items-center justify-center px-2 w-full shrink-0" title={hasDrafted ? data.drafted_player!.name : data.label}>
              <div className="text-sm font-mono font-bold text-white text-center w-full line-clamp-2 leading-snug break-words py-0.5">
                {hasDrafted ? data.drafted_player!.name : data.label}
              </div>
            </div>
            {hasDrafted ? null : (
              <>
                {data.assetTitle && <div className="mt-1.5 text-zinc-500 font-mono text-xs px-4">{data.assetTitle}</div>}
                {data.subLabel && <div className="mt-0.5 text-zinc-500 font-mono text-xs px-4">{data.subLabel}</div>}
              </>
            )}
          </>
        ) : (
          <>
            {data.assetTitle && (
              <div className="w-full bg-black/40 border-b border-white/10 px-3 py-2 text-center rounded-t-[20px]">
                <div className="text-lg font-mono font-bold text-white">{data.assetTitle}</div>
                {data.assetSub && <div className="text-lg text-zinc-400 font-mono mt-0.5 uppercase">{data.assetSub}</div>}
              </div>
            )}
            <div className="min-h-[4rem] flex items-center justify-center py-2 px-3" title={data.label}>
              <div className="text-base text-white font-mono uppercase tracking-wide font-bold leading-snug text-center w-full line-clamp-3 break-words">
                {data.label}
              </div>
            </div>
            {data.subLabel && <div className="text-sm text-zinc-400 font-mono">{data.subLabel}</div>}
            {data.restriction && <div className="mt-2 text-sm font-mono text-zinc-400 text-center">{data.restriction}</div>}
            {(data.footer || data.footerSub) && (
              <div className="mt-2 pb-3 flex flex-col items-center gap-0.5 text-zinc-400 font-mono text-sm">
                {data.footer && <span>{data.footer}</span>}
                {data.footerSub && <span className="text-zinc-500">{data.footerSub}</span>}
              </div>
            )}
          </>
        )}
      </div>

      {/* BOTTOM: Portal Button */}
      {hasPortal && (
        <button
          onClick={handlePortalClick}
          className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-b-[20px] border-t border-violet-500/30"
        >
          {data.portal!.label} <ExternalLink size={14} />
        </button>
      )}

      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: '50%' }} />
      <Handle id="right" type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  );
}
