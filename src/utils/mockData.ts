import { faker } from '@faker-js/faker';
import { MarketData, AIInsight, Alert, Transaction, Portfolio } from '../types';

export const generateMockMarketData = (): MarketData[] => {
  return [
    // Crypto
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43250.75,
      change24h: 1250.30,
      changePercent24h: 2.98,
      volume24h: 28500000000,
      marketCap: 847000000000,
      category: 'crypto'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2680.45,
      change24h: -45.20,
      changePercent24h: -1.66,
      volume24h: 12800000000,
      marketCap: 322000000000,
      category: 'crypto'
    },
    // Stocks
    {
      symbol: 'BBRI',
      name: 'Bank BRI',
      price: 4850,
      change24h: 75,
      changePercent24h: 1.57,
      category: 'stock'
    },
    {
      symbol: 'TLKM',
      name: 'Telkom Indonesia',
      price: 3420,
      change24h: -30,
      changePercent24h: -0.87,
      category: 'stock'
    },
    // Forex
    {
      symbol: 'USD/IDR',
      name: 'US Dollar / Indonesian Rupiah',
      price: 15750.50,
      change24h: 125.25,
      changePercent24h: 0.80,
      category: 'forex'
    },
    // Gold
    {
      symbol: 'XAU/USD',
      name: 'Gold',
      price: 2045.80,
      change24h: -12.30,
      changePercent24h: -0.60,
      category: 'gold'
    }
  ];
};

export const generateMockAIInsights = (): AIInsight[] => {
  return [
    {
      id: '1',
      type: 'opportunity',
      asset: 'BTC',
      title: 'Bitcoin Breaking Resistance',
      description: 'BTC is approaching a key resistance level at $44,000. Technical indicators suggest potential breakout.',
      confidence: 85,
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'warning',
      asset: 'USD/IDR',
      title: 'Rupiah Pressure Alert',
      description: 'USD/IDR showing signs of potential 2% correction based on recent economic indicators.',
      confidence: 72,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'buy',
      asset: 'XAU/USD',
      title: 'Gold Oversold Opportunity',
      description: 'Gold prices have reached oversold territory. Consider accumulation for medium-term hold.',
      confidence: 78,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ];
};

export const generateMockAlerts = (): Alert[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: faker.string.uuid(),
    asset: faker.helpers.arrayElement(['BTC', 'ETH', 'BBRI', 'USD/IDR', 'XAU/USD']),
    type: faker.helpers.arrayElement(['price', 'technical', 'news']) as 'price' | 'technical' | 'news',
    title: faker.lorem.sentence({ min: 3, max: 6 }),
    message: faker.lorem.sentence({ min: 8, max: 15 }),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high']) as 'low' | 'medium' | 'high',
    timestamp: faker.date.recent({ days: 2 }),
    read: faker.datatype.boolean()
  }));
};

export const generateMockTransactions = (): Transaction[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['topup', 'withdraw', 'transfer', 'payment', 'qris']) as Transaction['type'],
    amount: Number(faker.finance.amount({ min: 10000, max: 5000000, dec: 0 })),
    currency: 'IDR',
    description: faker.lorem.words({ min: 2, max: 5 }),
    date: faker.date.recent({ days: 30 }),
    status: faker.helpers.arrayElement(['pending', 'completed', 'failed']) as Transaction['status'],
    recipient: faker.datatype.boolean() ? faker.person.fullName() : undefined
  }));
};

export const mockPortfolio: Portfolio = {
  totalValue: 125750000,
  dayChange: 2450000,
  dayChangePercent: 1.98,
  assets: {
    crypto: 45000000,
    stocks: 38750000,
    forex: 25000000,
    gold: 17000000
  }
};

export const mockUser = {
  id: '1',
  name: 'Budi Santoso',
  email: 'budi.santoso@email.com',
  phone: '+62812345678',
  avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=3b82f6&color=fff',
  kycStatus: 'verified' as const,
  riskProfile: 'moderate' as const
};

export const mockWalletBalance = {
  idr: 2750000,
  usd: 185.50
};
