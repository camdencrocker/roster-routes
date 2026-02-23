'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ALL_PLAYERS } from './data/players';
import { getHeadshotUrl, getHeadshotFallback } from './headshots';

type PlayerSearchProps = {
  onSelect: (player: any) => void;
  variant?: 'default' | 'hero';
};

export default function PlayerSearch({ onSelect, variant = 'default' }: PlayerSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lower = query.toLowerCase().trim();
    const filtered = ALL_PLAYERS.filter(
      (p) =>
        (p.fullName ?? '').toLowerCase().includes(lower) ||
        (p.teamAbbreviation ?? '').toLowerCase().includes(lower)
    ).slice(0, 20);

    setResults(
      filtered.map((p) => ({
        id: p.id,
        label: p.fullName,
        sublabel: (p as { yearsActive?: string }).yearsActive ?? p.teamAbbreviation,
        img: p.id,
      }))
    );
    setIsOpen(true);
  }, [query]);

  const isHero = variant === 'hero';

  return (
    <div className="relative w-full">
      {/* SEARCH BAR INPUT */}
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isHero ? "Search any NBA player…" : "Search player…"}
          className={`w-full bg-neutral-900/80 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md transition-all shadow-xl group-hover:border-white/20 ${
            isHero
              ? 'py-4 pl-14 pr-5 text-lg md:text-xl'
              : 'py-3 pl-12 pr-4'
          }`}
        />
        <Search
          className={`absolute text-gray-500 group-hover:text-white transition-colors ${
            isHero ? 'left-5 top-4' : 'left-4 top-3.5'
          }`}
          size={isHero ? 22 : 18}
        />
      </div>

      {/* DROPDOWN RESULTS */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((player) => (
            <button
              key={player.id}
              onClick={() => {
                onSelect(player);
                setQuery('');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-4 p-3 hover:bg-white/10 transition-colors text-left group border-b border-white/5 last:border-0"
            >
              {/* FACE CIRCLE */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-black border border-white/10 relative">
                <img 
                  src={getHeadshotUrl(player.img, player.id, player.label)} 
                  alt={player.label}
                  className="w-full h-full object-cover scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = getHeadshotFallback(); }}
                />
              </div>
              
              {/* TEXT INFO */}
              <div>
                <div className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">{player.label}</div>
                <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider group-hover:text-gray-400">
                    {player.sublabel}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* NO RESULTS STATE */}
      {isOpen && query.length >= 2 && results.length === 0 && (
         <div className="absolute top-full mt-2 w-full bg-neutral-900 border border-white/10 rounded-xl p-4 text-center z-50">
            <p className="text-gray-500 text-xs">No players found for "{query}"</p>
         </div>
      )}
    </div>
  );
}