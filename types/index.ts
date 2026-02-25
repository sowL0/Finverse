// ─── Asset Types ─────────────────────────────────────────────────────────────

export type AssetType = 'stock' | 'crypto';

export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change24h: number;        // percentage
  changeAmount: number;     // dollar amount
  currency: 'USD';
  logoUrl?: string;
}

export interface BasketAsset extends Asset {
  addedAt: string;          // ISO date
  sparkline: number[];      // last 7 data points for mini chart
}

// ─── Basket Types ─────────────────────────────────────────────────────────────

export interface Basket {
  id: string;
  name: string;
  emoji: string;
  assets: BasketAsset[];
  createdAt: string;
  totalValueUSD: number;
  totalChangePercent: number;
  totalChangeAmount: number;
  isPublic: boolean;
}

// ─── User / Profile Types ─────────────────────────────────────────────────────

export type AnalystLevel = 'Observer' | 'Analyst I' | 'Analyst II' | 'Senior Analyst' | 'Elite Analyst';
export type UserRole = 'user' | 'verified_analyst' | 'admin';

export interface CredibilityScore {
  total: number;            // 0–1000
  postQuality: number;
  peerVotes: number;
  historicalAccuracy: number;
  engagementQuality: number;
  reportPenalty: number;
}

export interface ExpertBasket {
  id: string;
  name: string;
  emoji: string;
  returnPercent: number;
  period: string;           // e.g. "Son 12 ay"
  assetCount: number;
  tickers: string[];
  isLocked: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  handle: string;
  bio: string;
  avatarUrl?: string;
  title: string;
  location: string;
  age?: number;
  role: UserRole;
  analystLevel: AnalystLevel;
  isVerified: boolean;
  credibility: CredibilityScore;
  followerCount: number;
  followingCount: number;
  basketCount: number;
  yearlyReturn: number;
  expertBaskets: ExpertBasket[];
  joinedAt: string;
}

// ─── Currency ─────────────────────────────────────────────────────────────────

export type Currency = 'USD' | 'TRY';
