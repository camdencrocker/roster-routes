/**
 * Central place for player headshot URLs.
 * - Numeric nbaId → NBA CDN
 * - Optional name-based API (e.g. nba-headshot-api on GitHub) for name-* ids / fallback
 */

const NBA_CDN = 'https://cdn.nba.com/headshots/nba/latest/1040x760';
const FALLBACK_LOGO = `${NBA_CDN}/logoman.png`;

/** Base URL for a name-based headshot API (GET /players/:lastName/:firstName returns image). */
export const HEADSHOT_API_BASE =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_HEADSHOT_API_BASE
    ? process.env.NEXT_PUBLIC_HEADSHOT_API_BASE.replace(/\/$/, '')
    : '';

function slugForUrl(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/** Build URL for name-based API (e.g. nba-players.herokuapp.com/players/wiggins/andrew). */
function nameApiUrl(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, -1).join(' ') || lastName;
  return `${HEADSHOT_API_BASE}/players/${slugForUrl(lastName)}/${slugForUrl(firstName)}`;
}

/**
 * Returns the best headshot URL for a player.
 * @param img - Explicit URL or path (e.g. /headshots/foo.png) or NBA id string
 * @param id - Player id (nbaId or name-* slug)
 * @param name - Full name (used when id is name-* and HEADSHOT_API_BASE is set)
 */
export function getHeadshotUrl(
  img?: string | null,
  id?: string | null,
  name?: string | null
): string {
  if (img) {
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return `${NBA_CDN}/${img}.png`;
  }
  if (id && /^\d+$/.test(String(id))) {
    return `${NBA_CDN}/${id}.png`;
  }
  if (HEADSHOT_API_BASE && id?.startsWith('name-') && name) {
    return nameApiUrl(name);
  }
  if (id) return `${NBA_CDN}/${id}.png`;
  return FALLBACK_LOGO;
}

export function getHeadshotFallback(): string {
  return FALLBACK_LOGO;
}
