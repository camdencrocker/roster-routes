'use client';

import React, { useState } from 'react';
import { getTrades, getSeasons } from './data/trades-loader';
import { getHeadshotUrl, getHeadshotFallback } from './headshots';
import type { Trade, TradeAsset, PlayerAsset } from './data/trade-schema';

function AssetBadge({ asset }: { asset: TradeAsset }) {
  if (asset.type === 'player') {
    const a = asset as PlayerAsset;
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 text-xs">
        <img
          src={getHeadshotUrl(a.img, a.nbaId, a.name)}
          alt=""
          className="w-5 h-5 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getHeadshotFallback();
          }}
        />
        {a.name} ({a.from} → {a.to})
      </span>
    );
  }
  if (asset.type === 'pick') {
    return (
      <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400/90 text-xs">
        📋 {asset.description} ({asset.from} → {asset.to})
      </span>
    );
  }
  if (asset.type === 'cash') {
    return (
      <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400/90 text-xs">
        💵 {asset.amount || 'Cash'} ({asset.from} → {asset.to})
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-lg bg-white/5 text-xs">
      {asset.description} ({asset.from} → {asset.to})
    </span>
  );
}

export default function AllTradesView({
  onSelectPlayer,
  onBack,
}: {
  onSelectPlayer?: (player: { id: string; label: string; img: string }) => void;
  onBack: () => void;
}) {
  const [season, setSeason] = useState<string>('');
  const seasons = getSeasons();
  const trades = season ? getTrades().filter((t) => t.season === season) : getTrades();

  return (
    <div className="h-full overflow-auto bg-black text-white p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-sm text-zinc-400 hover:text-white font-mono"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">All Trades</h1>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono"
          >
            <option value="">All seasons</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <p className="text-zinc-500 text-sm mb-4">
          {trades.length} trade{trades.length !== 1 ? 's' : ''}
          {season && ` in ${season}`}
        </p>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="py-3 px-4 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider w-24">Date</th>
                <th className="py-3 px-4 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider w-20">Season</th>
                <th className="py-3 px-4 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Headshots</th>
                <th className="py-3 px-4 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Assets</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade: Trade) => {
                const playerAssets = trade.assets.filter((a): a is PlayerAsset => a.type === 'player');
                return (
                  <tr
                    key={trade.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-sm text-zinc-300 align-top">{trade.date}</td>
                    <td className="py-3 px-4 font-mono text-sm text-zinc-400 align-top">{trade.season}</td>
                    <td className="py-3 px-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {playerAssets.map((a, i) => (
                          <div key={i} className="flex flex-col items-center gap-0.5">
                            {onSelectPlayer ? (
                              <button
                                onClick={() =>
                                  onSelectPlayer({
                                    id: a.nbaId,
                                    label: a.name,
                                    img: (a as PlayerAsset & { img?: string }).img ?? a.nbaId,
                                  })
                                }
                                className="rounded-full overflow-hidden ring-2 ring-transparent hover:ring-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                              >
                                <img
                                  src={getHeadshotUrl(a.img, a.nbaId, a.name)}
                                  alt={a.name}
                                  className="w-10 h-10 object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = getHeadshotFallback();
                                  }}
                                />
                              </button>
                            ) : (
                              <img
                                src={getHeadshotUrl(a.img, a.nbaId, a.name)}
                                alt={a.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = getHeadshotFallback();
                                }}
                              />
                            )}
                            <span className="text-[10px] text-zinc-500 max-w-[4rem] truncate text-center leading-tight">{a.name.split(' ').pop()}</span>
                          </div>
                        ))}
                        {playerAssets.length === 0 && (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        {trade.assets.map((asset, i) => (
                          <div key={i}>
                            {asset.type === 'player' && onSelectPlayer ? (
                              <button
                                onClick={() =>
                                  onSelectPlayer({
                                    id: (asset as PlayerAsset).nbaId,
                                    label: (asset as PlayerAsset).name,
                                    img: (asset as PlayerAsset & { img?: string }).img ?? (asset as PlayerAsset).nbaId,
                                  })
                                }
                                className="text-left"
                              >
                                <AssetBadge asset={asset} />
                              </button>
                            ) : (
                              <AssetBadge asset={asset} />
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {trades.length === 0 && (
          <p className="text-zinc-500 text-center py-12">
            No trades yet. Add trades to <code className="text-zinc-400">app/data/trades.json</code>
          </p>
        )}
      </div>
    </div>
  );
}
