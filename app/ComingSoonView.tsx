'use client';

import { getHeadshotUrl, getHeadshotFallback } from './headshots';

export default function ComingSoonView({
  player,
}: {
  player: { id: string; label: string; img?: string };
}) {
  const headshot = getHeadshotUrl(player.img, player.id, player.label);
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
      <img
        src={headshot}
        alt={player.label}
        className="w-48 h-48 rounded-2xl object-cover object-top ring-2 ring-white/20"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getHeadshotFallback();
        }}
      />
      <h1 className="text-2xl font-bold">{player.label}</h1>
      <p className="text-zinc-400">Trade tree coming soon</p>
    </div>
  );
}
