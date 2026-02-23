import { NextResponse } from 'next/server';
import { PLAYERS } from '../../data/players';

/**
 * Instant search - uses static player list. No external API, no blocks, no timeouts.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const lower = q.toLowerCase();
  const filtered = PLAYERS.filter(
    (p) =>
      p.fullName.toLowerCase().includes(lower) ||
      p.teamAbbreviation.toLowerCase().includes(lower)
  ).slice(0, 20);

  return NextResponse.json(filtered);
}
