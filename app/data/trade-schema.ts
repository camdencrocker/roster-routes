/**
 * Schema for the flat trade database.
 * Add trades to data/trades.json - see HOW_TO_ADD_TRADES.md
 */

export type AssetType = 'player' | 'pick' | 'cash' | 'tpe' | 'other';

export interface PlayerAsset {
  type: 'player';
  name: string;
  nbaId: string; // For headshots: cdn.nba.com/headshots/.../nbaId.png
  /** Optional image URL override (e.g. ESPN) when NBA CDN has no headshot */
  img?: string;
  from: string;  // Team abbrev (e.g. LAL)
  to: string;    // Team abbrev (e.g. BKN)
}

export interface PickAsset {
  type: 'pick';
  description: string; // e.g. "2027 1st (LAL)", "2025 2nd (BKN)"
  from: string;
  to: string;
  protection?: string; // e.g. "Top 5 protected", "unprotected"
  /** When pick conveyed: show as player node */
  drafted_player?: { name: string; nbaId?: string; pickNumber: number };
  /** Optional: how the pick was acquired (from draft transactions source) — full text */
  pickProvenance?: string;
  /** Optional: each trade in the pick's chain, with date, for sorting/display */
  pickProvenanceTrades?: { date: string | null; summary: string }[];
}

export interface CashAsset {
  type: 'cash';
  amount?: string; // e.g. "$1.5M"
  from: string;
  to: string;
}

export interface TPEAsset {
  type: 'tpe';
  description: string; // e.g. "TPE from Solomon Hill"
  from: string;
  to: string;
}

export interface OtherAsset {
  type: 'other';
  description: string;
  from: string;
  to: string;
}

export type TradeAsset = PlayerAsset | PickAsset | CashAsset | TPEAsset | OtherAsset;

/** When a team sends out more salary than it receives, it can generate a Trade Player Exception (TPE). */
export interface TradeExceptionGenerated {
  player: string;   // e.g. "Jonas Valanciunas"
  amount: number;   // in dollars, e.g. 9900000 for $9.9M
}

export interface Trade {
  id: string;           // Unique, e.g. "2025-26-001"
  date: string;         // YYYY-MM-DD
  season: string;       // e.g. "2025-26"
  teams: string[];      // All teams involved, e.g. ["LAL", "BKN"]
  summary?: string;     // Optional one-liner
  assets: TradeAsset[];
  /** Optional: one TPE generated (backward compat). */
  tradeExceptionGenerated?: TradeExceptionGenerated;
  /** Optional: multiple TPEs (e.g. both sides in a 2-team trade). */
  tradeExceptionsGenerated?: TradeExceptionGenerated[];
}

export interface TradesDatabase {
  version: number;
  lastUpdated?: string; // ISO date
  trades: Trade[];
}
