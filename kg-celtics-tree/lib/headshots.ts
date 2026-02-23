/** Headshot URLs — pattern from Roster Routes app/headshots.ts */
const NBA_CDN = "https://cdn.nba.com/headshots/nba/latest/1040x760";
const FALLBACK = `${NBA_CDN}/logoman.png`;

export function getHeadshotUrl(nbaId: string | undefined): string {
  if (!nbaId || !/^\d+$/.test(nbaId)) return FALLBACK;
  return `${NBA_CDN}/${nbaId}.png`;
}

export function getHeadshotFallback(): string {
  return FALLBACK;
}
