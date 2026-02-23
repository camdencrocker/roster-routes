'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import PlayerSearch from './PlayerSearch';
import Footer from './Footer';

export default function CoverPage({
  onSelect,
  onAllTrades,
}: {
  onSelect: (player: any) => void;
  onAllTrades: () => void;
}) {
  return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Subtle grid / gradient background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center">
        {/* Logo / title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8">
          Roster Routes
        </h1>
        {/* Hero search — larger, centered */}
        <div className="w-full max-w-xl mb-8">
          <PlayerSearch onSelect={onSelect} variant="hero" />
        </div>

        {/* Hero suggestions */}
        <p className="text-zinc-500 text-sm mb-3">Try a route we polished</p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => onSelect({ id: '1629029', label: 'Luka Dončić', team: 'DAL', img: '1629029' })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors text-sm font-medium"
          >
            Luka Dončić → The draft-night trade
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Secondary CTA */}
        <button
          type="button"
          onClick={onAllTrades}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-colors text-sm font-medium"
        >
          Browse all trades
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <Footer />
    </div>
  );
}
