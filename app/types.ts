export interface Asset {
  id: string;
  type: 'Player' | 'Pick' | 'Cash';
  name: string;
  details?: string; // e.g., "2018 1st Round (Top 5 Protected)"
  imgUrl?: string;
  value?: number; // Win Shares or Approximate Value
}

export interface TradeNode {
  id: string;
  team: string; // "DAL" or "ATL"
  date: string;
  assetsReceived: Asset[];
  assetsSent: Asset[];
  children?: TradeNode[]; // What these assets turned into later
}