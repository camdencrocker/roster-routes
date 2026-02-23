'use client';
import React from 'react';
import { X, TrendingUp, Trash2, Minus, ArrowRightLeft } from 'lucide-react';
import { getHeadshotUrl, getHeadshotFallback } from './headshots';

function inferFromTo(teamsStr: string, toTeam: string): { from: string; to: string } | null {
  const teams = (teamsStr ?? '').match(/\b([A-Z]{3})\b/g) ?? [];
  const to = (toTeam ?? '').trim();
  const other = teams.find((t: string) => t !== to);
  return other && to ? { from: other, to } : null;
}

function TradeSummaryView({ trade, onClose }: { trade: any; onClose: () => void }) {
  const assets = trade.assets ?? [];
  const packageSent = trade.packageSent ?? [];
  const teamsStr = trade.teamsTrading ?? '';
  const root = trade.root as { from?: string; to?: string; team?: string; label?: string } | null | undefined;
  const rootTo = root?.to ?? root?.team;
  const rootFrom = root?.from;
  const rootMove = root?.label && rootTo
    ? (rootFrom ? { from: rootFrom, to: rootTo, label: root.label }
      : (() => {
          const teams = (trade.teamsTrading ?? '').match(/\b([A-Z]{3})\b/g) ?? [];
          const other = teams.find((t: string) => t !== rootTo);
          return other ? { from: other, to: rootTo, label: root.label } : null;
        })())
    : null;
  const withFromTo = (a: any) => {
    let from = a.from ?? (a.team && inferFromTo(teamsStr, a.team)?.from);
    let to = a.to ?? a.team ?? (a.team && inferFromTo(teamsStr, a.team)?.to);
    if (!from && to) from = inferFromTo(teamsStr, to)?.from ?? '';
    if (!to && from) to = teamsStr.match(/\b([A-Z]{3})\b/g)?.find((t: string) => t !== from) ?? '';
    return { ...a, from: from ?? a.from, to: to ?? a.to, label: a.label ?? a.description ?? '—' };
  };
  const allMoves = [
    ...(rootMove ? [rootMove] : []),
    ...packageSent.map(withFromTo),
    ...assets.map(withFromTo),
  ];
  const teamsFromMoves = new Set<string>(allMoves.flatMap((a: any) => [a.from, a.to]).filter(Boolean));
  const teamsFromStr = (trade.teamsTrading ?? '').match(/\b([A-Z]{3})\b/g) ?? [];
  teamsFromStr.forEach((t: string) => teamsFromMoves.add(t));
  const teams = Array.from(teamsFromMoves).sort();

  const byTeam = teams.map((team) => {
    const sent = allMoves.filter((m: any) => m.from === team);
    const received = allMoves.filter((m: any) => m.to === team);
    return { team, sent, received };
  });

  const multiExceptions = (trade.tradeExceptions ?? []) as { player?: string; amount?: number }[];
  const singleException = (trade.tradeExceptionGenerated as { player?: string; amount?: number } | undefined) ?? null;
  const hasExceptions = singleException || multiExceptions.length > 0;

  const focalPlayer = trade.focalPlayer as { label?: string; id?: string } | null | undefined;

  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-[400px] bg-neutral-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-[2000] flex flex-col transition-transform animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/10 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <ArrowRightLeft className="text-zinc-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-tight">{trade.date}</h2>
            <p className="text-zinc-400 font-mono text-xs mt-0.5">{trade.teamsTrading || 'Trade'}</p>
            {focalPlayer?.label && (
              <p className="text-zinc-500 font-mono text-xs mt-1">Involving {focalPlayer.label}</p>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {trade.summary && (
          <p className="text-zinc-400 text-sm leading-relaxed">{trade.summary}</p>
        )}
        <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Assets by team</p>
        {byTeam.map(({ team, sent, received }) => (
          <div key={team} className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="font-mono font-bold text-white text-sm mb-2">{team}</div>
            {sent.length > 0 && (
              <div className="text-xs text-zinc-400 mb-1 space-y-1">
                <span className="text-red-400/90">Sent:</span>
                {sent.map((m: any, i: number) => (
                  <div key={i} className="ml-2">
                    {m.label}
                    {m.restriction && <div className="text-zinc-500 mt-0.5 text-[11px]">{m.restriction}</div>}
                  </div>
                ))}
              </div>
            )}
            {received.length > 0 && (
              <div className="text-xs text-zinc-400 space-y-1">
                <span className="text-emerald-400/90">Received:</span>
                {received.map((m: any, i: number) => (
                  <div key={i} className="ml-2">
                    {m.label}
                    {m.restriction && <div className="text-zinc-500 mt-0.5 text-[11px]">{m.restriction}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {hasExceptions && (
          <>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider pt-2">Exceptions created</p>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
              {multiExceptions.length > 0
                ? multiExceptions.map((ex: any, i: number) => (
                    <div key={i} className="text-xs text-zinc-300">
                      {ex.player ?? 'Team'} — ${ex.amount != null ? (ex.amount / 1e6).toFixed(2) + 'M' : '—'} TPE
                    </div>
                  ))
                : singleException && (
                    <div className="text-xs text-zinc-300">
                      {singleException.player ?? 'Team'} — ${singleException.amount != null ? (singleException.amount / 1e6).toFixed(2) + 'M' : '—'} TPE
                    </div>
                  )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SidePanel({ player, onClose, onDelete, onCollapseTree }: { player: any; onClose: () => void; onDelete?: () => void; onCollapseTree?: (nodeId: string) => void }) {
  if (!player) return null;

  if (player.type === 'trade') {
    return <TradeSummaryView trade={player} onClose={onClose} />;
  }

  // Fake stats generator if data missing (for demo purposes)
  const stats = player.stats || { ppg: '12.4', reb: '4.1', ast: '3.2' };

  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-[400px] bg-neutral-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-[2000] flex flex-col transition-transform animate-in slide-in-from-right duration-300">
      
      {/* HEADER */}
      <div className="p-6 border-b border-white/10 flex justify-between items-start">
         <div className="flex gap-4">
           <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
               <img
                 src={getHeadshotUrl(player.img, player.id, player.label)}
                 className="w-full h-full object-cover"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = getHeadshotFallback();
                 }}
               />
           </div>
            <div>
               <h2 className="text-2xl font-black text-white leading-none">{player.label}</h2>
               <p className="text-gray-400 font-mono text-sm mt-1">{player.team} • {player.type === 'star' ? 'Star' : 'Role Player'}</p>
            </div>
         </div>
         <div className="flex gap-2">
            {onDelete && (
                <button onClick={onDelete} className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors">
                    <Trash2 size={18} />
                </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
            </button>
         </div>
      </div>

      {/* STATS GRID */}
      <div className="p-6 grid grid-cols-3 gap-4">
         <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">PPG</div>
            <div className="text-xl font-bold text-white">{stats.ppg}</div>
         </div>
         <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">REB</div>
            <div className="text-xl font-bold text-white">{stats.reb}</div>
         </div>
         <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">AST</div>
            <div className="text-xl font-bold text-white">{stats.ast}</div>
         </div>
      </div>

      {/* TRADE NOTE */}
      <div className="px-6">
         <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
             <TrendingUp className="text-blue-400 shrink-0" size={24} />
             <div>
                 <h3 className="font-bold text-blue-200 text-sm">Transaction Note</h3>
                 <p className="text-xs text-blue-100/70 mt-1 leading-relaxed">
                     {player.note || player.draftInfo || 'Acquired via trade transaction.'}
                 </p>
             </div>
         </div>
      </div>

      {/* COLLAPSE TRADE TREE — only when this node has children */}
      {player.hasChildren && player.nodeId && onCollapseTree && (
        <div className="mt-auto p-6 border-t border-white/10">
          <button
            onClick={() => {
              onCollapseTree(player.nodeId);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-zinc-300 hover:text-white font-mono text-sm transition-colors"
          >
            <Minus size={18} />
            Collapse trade tree
          </button>
        </div>
      )}
    </div>
  );
}