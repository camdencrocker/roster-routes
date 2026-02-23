'use client';

import React from 'react';
import { getTradesForPlayer } from './data/trades-loader';
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
        📋 {asset.description}
      </span>
    );
  }
  if (asset.type === 'cash') {
    return (
      <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400/90 text-xs">
        💵 {asset.amount || 'Cash'}
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-lg bg-white/5 text-xs">
      {asset.description} ({asset.from} → {asset.to})
    </span>
  );
}

export default function TradeListView({
  player,
  onBack,
}: {
  player: { id: string; label: string; img?: string };
  onBack: () => void;
}) {
  const trades = getTradesForPlayer(player.id);
  const headshot = getHeadshotUrl(player.img, player.id, player.label);

  return (
    <div className="h-full overflow-auto bg-black text-white p-6 pt-24">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-sm text-zinc-400 hover:text-white font-mono mb-6"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4 mb-8">
          <img
            src={headshot}
            alt={player.label}
            className="w-20 h-20 rounded-2xl object-cover object-top ring-2 ring-white/20"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getHeadshotFallback();
            }}
          />
          <div>
            <h1 className="text-2xl font-bold">{player.label}</h1>
            <p className="text-zinc-500 text-sm">
              {trades.length} trade{trades.length !== 1 ? 's' : ''} in database
            </p>
          </div>
        </div>

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
                  <tr key={trade.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono text-sm text-zinc-300 align-top">{trade.date}</td>
                    <td className="py-3 px-4 font-mono text-sm text-zinc-400 align-top">{trade.season}</td>
                    <td className="py-3 px-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {playerAssets.map((a, i) => (
                          <div key={i} className="flex flex-col items-center gap-0.5">
                            <img
                              src={getHeadshotUrl(a.img, a.nbaId, a.name)}
                              alt={a.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getHeadshotFallback();
                              }}
                            />
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
                          <AssetBadge key={i} asset={asset} />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
