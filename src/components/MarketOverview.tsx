import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { MarketData } from '../types';

interface MarketOverviewProps {
  marketData: MarketData[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ marketData }) => {
  const formatPrice = (price: number, category: string) => {
    if (category === 'forex' || category === 'stock') {
      return price.toLocaleString('id-ID');
    }
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crypto': return 'bg-orange-100 text-orange-600';
      case 'stock': return 'bg-blue-100 text-blue-600';
      case 'forex': return 'bg-green-100 text-green-600';
      case 'gold': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
        <button className="text-electric-500 text-sm font-medium">Lihat Semua</button>
      </div>
      
      <div className="space-y-3">
        {marketData.slice(0, 6).map((asset, index) => (
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(asset.category)}`}>
                  {asset.category.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{asset.symbol}</h4>
                  <p className="text-xs text-gray-500">{asset.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {asset.category === 'forex' || asset.category === 'stock' ? 'Rp ' : '$'}
                  {formatPrice(asset.price, asset.category)}
                </p>
                <div className={`flex items-center space-x-1 ${
                  asset.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {asset.changePercent24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(asset.changePercent24h).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;
