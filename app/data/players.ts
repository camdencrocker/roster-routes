/**
 * Static NBA player list for instant search. No API calls, no blocks.
 * Source: curated + players-from-trades.json (auto-generated from trades.json).
 * Years active from player-index.json (Basketball Reference).
 * Headshots: https://cdn.nba.com/headshots/nba/latest/1040x760/{id}.png
 */
import playersFromDraftTradesData from './players-from-draft-trades.json';
import playersFromTradesData from './players-from-trades.json';
import playerIndexData from './player-index.json';

const playersFromDraftTrades = playersFromDraftTradesData as { id: string; fullName: string; teamAbbreviation: string }[];
const playersFromTrades = playersFromTradesData as { id: string; fullName: string; teamAbbreviation: string }[];

type PlayerIndexEntry = { name: string; yearMin: number; yearMax: number };
const playerIndex = (playerIndexData as { players: PlayerIndexEntry[] }).players ?? [];
const yearsByName = new Map<string, string>(
  playerIndex.map((p) => [p.name, `${p.yearMin}–${p.yearMax}`])
);

/** Prefer numeric NBA id over "name-xxx" for deduplication. */
function isNumericId(id: string): boolean {
  return /^\d+$/.test(id);
}

export const PLAYERS: { id: string; fullName: string; teamAbbreviation: string }[] = [
  { id: '2544', fullName: 'LeBron James', teamAbbreviation: 'LAL' },
  { id: '1629029', fullName: 'Luka Doncic', teamAbbreviation: 'DAL' },
  { id: '203999', fullName: 'Nikola Jokic', teamAbbreviation: 'DEN' },
  { id: '201566', fullName: 'Stephen Curry', teamAbbreviation: 'GSW' },
  { id: '1629027', fullName: 'Trae Young', teamAbbreviation: 'ATL' },
  { id: '203110', fullName: 'Giannis Antetokounmpo', teamAbbreviation: 'MIL' },
  { id: '1628369', fullName: 'Jayson Tatum', teamAbbreviation: 'BOS' },
  { id: '1630162', fullName: 'Anthony Edwards', teamAbbreviation: 'MIN' },
  { id: '1629629', fullName: 'Cam Reddish', teamAbbreviation: 'LAL' },
  { id: '202331', fullName: 'Paul George', teamAbbreviation: 'PHI' },
  { id: '1627734', fullName: 'Domantas Sabonis', teamAbbreviation: 'SAC' },
  { id: '203506', fullName: 'Victor Oladipo', teamAbbreviation: 'HOU' },
  { id: '1628995', fullName: 'Kevin Knox', teamAbbreviation: 'POR' },
  { id: '203468', fullName: 'CJ McCollum', teamAbbreviation: 'NOP' },
  { id: '1630557', fullName: 'Corey Kispert', teamAbbreviation: 'WAS' },
  { id: '1627749', fullName: 'Dejounte Murray', teamAbbreviation: 'NOP' },
  { id: '1628969', fullName: 'Mikal Bridges', teamAbbreviation: 'NYK' },
  { id: '202681', fullName: 'Kyrie Irving', teamAbbreviation: 'DAL' },
  { id: '203915', fullName: 'Spencer Dinwiddie', teamAbbreviation: 'LAL' },
  { id: '1627827', fullName: 'Dorian Finney-Smith', teamAbbreviation: 'BKN' },
  { id: '203524', fullName: 'Solomon Hill', teamAbbreviation: 'FA' },
  { id: '1630596', fullName: 'Evan Mobley', teamAbbreviation: 'CLE' },
  { id: '203944', fullName: 'Julius Randle', teamAbbreviation: 'NYK' },
  { id: '203497', fullName: 'Rudy Gobert', teamAbbreviation: 'MIN' },
  { id: '1626167', fullName: 'Myles Turner', teamAbbreviation: 'IND' },
  { id: '203500', fullName: 'Draymond Green', teamAbbreviation: 'GSW' },
  { id: '1628374', fullName: 'Lauri Markkanen', teamAbbreviation: 'UTA' },
  { id: '1628366', fullName: 'Lonzo Ball', teamAbbreviation: 'CHI' },
  { id: '1631105', fullName: 'Jalen Duren', teamAbbreviation: 'DET' },
  { id: '1627732', fullName: 'Ben Simmons', teamAbbreviation: 'BKN' },
  { id: '1630178', fullName: 'Tyrese Haliburton', teamAbbreviation: 'IND' },
  { id: '1631094', fullName: 'Paolo Banchero', teamAbbreviation: 'ORL' },
  { id: '1631093', fullName: 'Chet Holmgren', teamAbbreviation: 'OKC' },
  { id: '1631124', fullName: 'Victor Wembanyama', teamAbbreviation: 'SAS' },
  { id: '1630163', fullName: 'LaMelo Ball', teamAbbreviation: 'CHA' },
  { id: '1627783', fullName: 'Pascal Siakam', teamAbbreviation: 'IND' },
  { id: '1628983', fullName: 'Shai Gilgeous-Alexander', teamAbbreviation: 'OKC' },
  { id: '1626157', fullName: 'Karl-Anthony Towns', teamAbbreviation: 'MIN' },
  { id: '1626164', fullName: 'Devin Booker', teamAbbreviation: 'PHX' },
  { id: '1629023', fullName: 'Jaren Jackson Jr', teamAbbreviation: 'MEM' },
  { id: '1628368', fullName: "De'Aaron Fox", teamAbbreviation: 'SAS' },
  { id: '1629028', fullName: 'Deandre Ayton', teamAbbreviation: 'POR' },
  { id: '203076', fullName: 'Anthony Davis', teamAbbreviation: 'LAL' },
  { id: '203954', fullName: 'Joel Embiid', teamAbbreviation: 'PHI' },
  { id: '201142', fullName: 'Kevin Durant', teamAbbreviation: 'PHX' },
  { id: '1628378', fullName: 'Donovan Mitchell', teamAbbreviation: 'CLE' },
  { id: '203081', fullName: 'Damian Lillard', teamAbbreviation: 'MIL' },
  { id: '1628379', fullName: 'Collin Sexton', teamAbbreviation: 'UTA' },
  { id: '1628389', fullName: 'Bam Adebayo', teamAbbreviation: 'MIA' },
  { id: '202710', fullName: 'Jimmy Butler', teamAbbreviation: 'MIA' },
  { id: '202691', fullName: 'Zion Williamson', teamAbbreviation: 'NOP' },
  { id: '1630177', fullName: 'Scottie Barnes', teamAbbreviation: 'TOR' },
  { id: '1628381', fullName: 'John Collins', teamAbbreviation: 'LAC' },
  { id: '1630169', fullName: 'Franz Wagner', teamAbbreviation: 'ORL' },
  { id: '1631096', fullName: 'Jabari Smith Jr', teamAbbreviation: 'HOU' },
  { id: '1631123', fullName: 'Scoot Henderson', teamAbbreviation: 'POR' },
  { id: '1631218', fullName: 'Brandon Miller', teamAbbreviation: 'CHA' },
  { id: '1631127', fullName: 'Amen Thompson', teamAbbreviation: 'HOU' },
  { id: '1631122', fullName: 'Ausar Thompson', teamAbbreviation: 'DET' },
  { id: '1631245', fullName: 'Alex Sarr', teamAbbreviation: 'WAS' },
  { id: '1631246', fullName: 'Zaccharie Risacher', teamAbbreviation: 'ATL' },
  { id: '203078', fullName: 'Bradley Beal', teamAbbreviation: 'PHX' },
  { id: '203382', fullName: 'Aron Baynes', teamAbbreviation: 'FA' },
  { id: '1630559', fullName: 'Austin Reaves', teamAbbreviation: 'LAL' },
  { id: '1628973', fullName: 'Jalen Brunson', teamAbbreviation: 'NYK' },
  { id: '202695', fullName: 'Kawhi Leonard', teamAbbreviation: 'LAC' },
  { id: '201935', fullName: 'James Harden', teamAbbreviation: 'LAC' },
  { id: '1627742', fullName: 'Brandon Ingram', teamAbbreviation: 'NOP' },
  { id: '1626156', fullName: "D'Angelo Russell", teamAbbreviation: 'LAL' },
  { id: '1641714', fullName: 'Kobe Bufkin', teamAbbreviation: 'BKN' },
  { id: '1629312', fullName: 'Haywood Highsmith', teamAbbreviation: 'BKN' },
  { id: '1627777', fullName: 'Georges Niang', teamAbbreviation: 'UTA' },
  { id: '202685', fullName: 'Jonas Valanciunas', teamAbbreviation: 'DEN' },
  { id: '203967', fullName: 'Dario Saric', teamAbbreviation: 'SAC' },
  { id: '203482', fullName: 'Kelly Olynyk', teamAbbreviation: 'SAS' },
  { id: '1631116', fullName: 'Malaki Branham', teamAbbreviation: 'WAS' },
  { id: '1631104', fullName: 'Blake Wesley', teamAbbreviation: 'WAS' },
  { id: '1629008', fullName: 'Michael Porter Jr', teamAbbreviation: 'BKN' },
  { id: '1629661', fullName: 'Cameron Johnson', teamAbbreviation: 'DEN' },
  { id: '203471', fullName: 'Dennis Schroder', teamAbbreviation: 'SAC' },
  { id: '1628380', fullName: 'Zach Collins', teamAbbreviation: 'CHI' },
  { id: '1626181', fullName: 'Norman Powell', teamAbbreviation: 'MIA' },
  { id: '203937', fullName: 'Kyle Anderson', teamAbbreviation: 'UTA' },
  { id: '201567', fullName: 'Kevin Love', teamAbbreviation: 'UTA' },
  { id: '1629130', fullName: 'Duncan Robinson', teamAbbreviation: 'DET' },
  { id: '1630333', fullName: 'Simone Fontecchio', teamAbbreviation: 'MIA' },
  { id: '204001', fullName: 'Kristaps Porzingis', teamAbbreviation: 'ATL' },
  { id: '1629611', fullName: 'Terance Mann', teamAbbreviation: 'BKN' },
  { id: '1629014', fullName: 'Anfernee Simons', teamAbbreviation: 'BOS' },
  { id: '201950', fullName: 'Jrue Holiday', teamAbbreviation: 'POR' },
  { id: '1629673', fullName: 'Jordan Poole', teamAbbreviation: 'NOP' },
  { id: '1630180', fullName: 'Saddiq Bey', teamAbbreviation: 'NOP' },
  { id: '1631192', fullName: 'Cam Whitmore', teamAbbreviation: 'WAS' },
  { id: '1631173', fullName: 'David Roddy', teamAbbreviation: 'ATL' },
  { id: '203991', fullName: 'Clint Capela', teamAbbreviation: 'HOU' },
  { id: '1630224', fullName: 'Jalen Green', teamAbbreviation: 'PHX' },
  { id: '1628415', fullName: 'Dillon Brooks', teamAbbreviation: 'PHX' },
  { id: '1630643', fullName: 'Jay Huff', teamAbbreviation: 'IND' },
  { id: '1626192', fullName: 'Pat Connaughton', teamAbbreviation: 'CHA' },
  { id: '1626830', fullName: 'Vasilije Micić', teamAbbreviation: 'MIL' },
  { id: '1629638', fullName: 'Nickeil Alexander-Walker', teamAbbreviation: 'ATL' },
  { id: '1630171', fullName: 'Isaac Okoro', teamAbbreviation: 'CHI' },
  { id: '1630240', fullName: 'Justinian Jessup', teamAbbreviation: 'MEM' },
  { id: '1629667', fullName: 'Jalen McDaniels', teamAbbreviation: 'SAC' },
  { id: '1641746', fullName: 'Aleksandar Vezenkov', teamAbbreviation: 'TOR' },
  { id: '1630558', fullName: 'Davion Mitchell', teamAbbreviation: 'TOR' },
  { id: '1630166', fullName: 'Deni Avdija', teamAbbreviation: 'POR' },
  { id: '1627763', fullName: 'Malcolm Brogdon', teamAbbreviation: 'WAS' },
  { id: '1626204', fullName: 'Larry Nance Jr', teamAbbreviation: 'ATL' },
  { id: '1630700', fullName: 'Dyson Daniels', teamAbbreviation: 'ATL' },
  { id: '203942', fullName: 'DeMar DeRozan', teamAbbreviation: 'SAC' },
  { id: '1630537', fullName: 'Chris Duarte', teamAbbreviation: 'CHI' },
  { id: '203084', fullName: 'Harrison Barnes', teamAbbreviation: 'SAS' },
  { id: '1627739', fullName: 'Kris Dunn', teamAbbreviation: 'LAC' },
  { id: '201566', fullName: 'Russell Westbrook', teamAbbreviation: 'UTA' },
  { id: '1630593', fullName: 'Ziaire Williams', teamAbbreviation: 'BKN' },
  { id: '1631102', fullName: 'Mark Williams', teamAbbreviation: 'PHX' },
  { id: '1629012', fullName: 'Collin Sexton', teamAbbreviation: 'CHA' },
  { id: '203994', fullName: 'Jusuf Nurkic', teamAbbreviation: 'UTA' },
  { id: '1626196', fullName: 'Josh Richardson', teamAbbreviation: 'MIA' },
  { id: '1630184', fullName: 'Kira Lewis Jr', teamAbbreviation: 'IND' },
  { id: '1626199', fullName: 'Devonte Graham', teamAbbreviation: 'SAS' },
  { id: '202339', fullName: 'Eric Bledsoe', teamAbbreviation: 'FA' },
  { id: '202693', fullName: 'Markieff Morris', teamAbbreviation: 'FA' },
  { id: '1630527', fullName: 'Brandon Boston Jr', teamAbbreviation: 'NOP' },
  { id: '1630530', fullName: 'Trey Murphy III', teamAbbreviation: 'NOP' },
  { id: '1631172', fullName: 'Ousmane Dieng', teamAbbreviation: 'MIL' },
  { id: '203476', fullName: 'Gorgui Dieng', teamAbbreviation: 'BOS' },
];

/** Curated PLAYERS + draft trades + all players from trades.json (so search finds everyone). */
const _curatedIds = new Set(PLAYERS.map((p) => p.id));
const _draftIds = new Set(playersFromDraftTrades.map((p) => p.id));
const raw = [
  ...PLAYERS,
  ...playersFromDraftTrades.filter((p) => !_curatedIds.has(p.id)),
  ...playersFromTrades.filter((p) => !_curatedIds.has(p.id) && !_draftIds.has(p.id)),
];

/** Dedupe by fullName: prefer numeric NBA id over "name-xxx". Add yearsActive from player-index. */
const byName = new Map<string, { id: string; fullName: string; teamAbbreviation: string; yearsActive?: string }>();
for (const p of raw) {
  const existing = byName.get(p.fullName);
  const yearsActive = yearsByName.get(p.fullName);
  const candidate = { ...p, yearsActive };
  if (!existing) {
    byName.set(p.fullName, candidate);
  } else if (isNumericId(candidate.id) && !isNumericId(existing.id)) {
    byName.set(p.fullName, candidate); // replace name-xxx with numeric id
  }
  // else keep existing (first wins for same id type)
}

export const ALL_PLAYERS = [...byName.values()];
