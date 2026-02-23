'use client';

import React from 'react';
import Link from 'next/link';

/** Optional: set authorName to show "© 2025–26 Your Name. Roster Routes." */
export default function Footer({ authorName }: { authorName?: string }) {
  const copyright = authorName
    ? `© 2025–26 ${authorName}. Roster Routes.`
    : '© 2025–26 Roster Routes.';

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 py-2 px-4 flex items-center justify-between bg-black/80 border-t border-white/5 text-zinc-500 text-xs font-sans backdrop-blur-sm"
      role="contentinfo"
    >
      <span className="truncate">{copyright}</span>
      <nav className="flex items-center gap-4 shrink-0">
        <a
          href="mailto:?subject=Roster Routes – Report a Problem"
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Report a Problem
        </a>
        <Link
          href="/thanks"
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Thank You
        </Link>
      </nav>
    </footer>
  );
}
