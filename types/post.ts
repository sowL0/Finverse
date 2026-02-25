// ─── Post Types ───────────────────────────────────────────────────────────────

export type PostDirection = 'BULL' | 'BEAR' | 'NEUTRAL';
export type TimeHorizon = 'SHORT' | 'MEDIUM' | 'LONG';

export interface PostFormData {
  ticker: string;
  assetName: string;
  assetType: 'stock' | 'crypto';
  direction: PostDirection;
  thesis: string;
  supportingData: string;
  risks: string;
  counterarguments: string;
  conclusion: string;
  timeHorizon: TimeHorizon;
  priceTarget: string;
}

export interface PostFormErrors {
  ticker?: string;
  direction?: string;
  thesis?: string;
  supportingData?: string;
  risks?: string;
  conclusion?: string;
  timeHorizon?: string;
}

export interface AIQualityResult {
  score: number;           // 0–100
  feedback: string;
  suggestions: string[];
  isAcceptable: boolean;
}

// ─── Catalogue (same as basket, shared in production) ────────────────────────
export interface CatalogueItem {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  price: number;
  change24h: number;
}

export const ASSET_CATALOGUE: CatalogueItem[] = [
  { symbol: 'AAPL',  name: 'Apple Inc.',          type: 'stock',  price: 241.50,  change24h: 0.6  },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',         type: 'stock',  price: 134.80,  change24h: 2.8  },
  { symbol: 'PLTR',  name: 'Palantir Tech.',       type: 'stock',  price: 84.20,   change24h: 4.2  },
  { symbol: 'MSFT',  name: 'Microsoft',            type: 'stock',  price: 415.30,  change24h: 0.9  },
  { symbol: 'TSLA',  name: 'Tesla Inc.',           type: 'stock',  price: 342.70,  change24h: -1.2 },
  { symbol: 'META',  name: 'Meta Platforms',       type: 'stock',  price: 608.10,  change24h: -0.4 },
  { symbol: 'AMZN',  name: 'Amazon',               type: 'stock',  price: 228.30,  change24h: 1.1  },
  { symbol: 'GOOGL', name: 'Alphabet',             type: 'stock',  price: 196.40,  change24h: 0.7  },
  { symbol: 'JPM',   name: 'JPMorgan Chase',       type: 'stock',  price: 268.90,  change24h: 0.3  },
  { symbol: 'LMT',   name: 'Lockheed Martin',      type: 'stock',  price: 490.20,  change24h: -0.2 },
  { symbol: 'AAPL',  name: 'Apple Inc.',           type: 'stock',  price: 241.50,  change24h: 0.6  },
  { symbol: 'BTC',   name: 'Bitcoin',              type: 'crypto', price: 97400,   change24h: 2.1  },
  { symbol: 'ETH',   name: 'Ethereum',             type: 'crypto', price: 2840,    change24h: 1.8  },
  { symbol: 'SOL',   name: 'Solana',               type: 'crypto', price: 174.20,  change24h: 3.5  },
  { symbol: 'BNB',   name: 'BNB',                  type: 'crypto', price: 612.40,  change24h: 0.9  },
  { symbol: 'XRP',   name: 'Ripple',               type: 'crypto', price: 2.34,    change24h: -0.6 },
];
