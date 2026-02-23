/**
 * Load player career data (team stints, games played). Cache from fetch-player-careers.mjs.
 */
import playerCareersData from './player-careers.json';

type SeasonStint = { season: string; team: string; gp: number };

const playerCareers = playerCareersData as {
  players: Record<string, SeasonStint[]>;
  lastUpdated: string;
};

export function getPlayerCareers(nbaId: string): SeasonStint[] {
  return playerCareers.players[nbaId] || [];
}

/** Did this player ever play for this team (games > 0)? */
export function didPlayerPlayForTeam(nbaId: string, teamAbbrev: string): boolean {
  const seasons = getPlayerCareers(nbaId);
  return seasons.some((s) => s.team === teamAbbrev && s.gp > 0);
}

/** Games played for a specific team. */
export function getGamesForTeam(nbaId: string, teamAbbrev: string): number {
  const seasons = getPlayerCareers(nbaId);
  return seasons.filter((s) => s.team === teamAbbrev).reduce((sum, s) => sum + s.gp, 0);
}
