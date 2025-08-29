export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

export interface WalletBalance {
  idr: number;
  usd: number;
}

export interface Transaction {
  id: string;
  type: 'topup' | 'withdraw' | 'transfer' | 'payment' | 'qris';
  amount: number;
  currency: string;
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
  recipient?: string;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h?: number;
  marketCap?: number;
  category: 'crypto' | 'stock' | 'forex' | 'gold';
}

export interface AIInsight {
  id: string;
  type: 'buy' | 'sell' | 'hold' | 'warning' | 'opportunity';
  asset: string;
  title: string;
  description: string;
  confidence: number;
  timestamp: Date;
}

export interface Alert {
  id: string;
  asset: string;
  type: 'price' | 'technical' | 'news';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  read: boolean;
}

export interface Portfolio {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  assets: {
    crypto: number;
    stocks: number;
    forex: number;
    gold: number;
  };
}
