'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '../Footer';

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans pb-12">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-block text-sm text-zinc-400 hover:text-white font-mono mb-10 transition-colors"
        >
          ← Back to Roster Routes
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Thank You
        </h1>
        <p className="text-zinc-400 mb-10">
          Roster Routes wouldn’t exist without these sources. We don’t guarantee
          their accuracy; report errors via Report a problem.
        </p>

        <ul className="space-y-6">
          <li>
            <a
              href="https://www.prosportstransactions.com/basketball/DraftTrades/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-zinc-300 underline underline-offset-2 transition-colors"
            >
              Pro Sports Transactions
            </a>
            <p className="text-zinc-500 text-sm mt-1">
              Draft trade history — who held each pick and how it moved.
            </p>
          </li>
          <li>
            <a
              href="https://www.basketball-reference.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-zinc-300 underline underline-offset-2 transition-colors"
            >
              Basketball Reference
            </a>
            <p className="text-zinc-500 text-sm mt-1">
              Trade transactions, player history, and transaction logs.
            </p>
          </li>
          <li>
            <a
              href="https://www.nba.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-zinc-300 underline underline-offset-2 transition-colors"
            >
              NBA
            </a>
            <p className="text-zinc-500 text-sm mt-1">
              Player IDs and headshots (cdn.nba.com).
            </p>
          </li>
        </ul>

        <p className="text-zinc-500 text-sm mt-12">
          © 2025–26 Roster Routes. Data from third-party sources; we don’t
          guarantee accuracy.
        </p>
      </div>

      <Footer />
    </div>
  );
}
