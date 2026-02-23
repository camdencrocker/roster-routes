/**
 * Roster snapshots (e.g. 2025 Thunder). Used for team/roster entry points.
 * Add new rosters under app/data/rosters/<slug>.json and register here.
 */
import okc2025 from './okc-2025.json';

export type RosterPlayer = {
  nbaId: string;
  name: string;
  position?: string;
  jersey?: string;
};

export type Roster = {
  id: string;
  team: string;
  season?: string;
  label: string;
  players: RosterPlayer[];
};

const rosters: Roster[] = [
  okc2025 as Roster,
];

export function getRoster(id: string): Roster | undefined {
  return rosters.find((r) => r.id === id);
}

export function listRosters(): Roster[] {
  return rosters;
}
