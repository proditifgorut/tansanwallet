import React, { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockPortfolio, generateMockMarketData } from '../utils/mockData';

const InvestPage: React.FC = () => {
  const [marketData] = useState(generateMockMarketData());
  const [activeTab, setActiveTab] = useState('portfolio');

  const chartData = [
    { name: 'Jan', value: 120000000 },
    { name: 'Feb', value: 118000000 },
    { name: 'Mar', value: 122000000 },
    { name: 'Apr', value: 125000000 },
    { name: 'May', value: 123000000 },
    { name: 'Jun', value: 125750000 },
  ];

  const portfolioData = [
    { name: 'Crypto', value: mockPortfolio.assets.crypto, color: '#f59e0b' },
    { name: 'Saham', value: mockPortfolio.assets.stocks, color: '#3b82f6' },
    { name: 'Forex', value: mockPortfolio.assets.forex, color: '#10b981' },
    { name: 'Emas', value: mockPortfolio.assets.gold, color: '#f59e0b' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: 'portfolio', label: 'Portofolio', icon: BarChart3 },
    { id: 'market', label: 'Pasar', icon: TrendingUp },
    { id: 'watchlist', label: 'Watchlist', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Investment Center</h1>
          <p className="text-sm text-gray-500">Analisis dan kelola investasi Anda</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === id
                    ? 'text-electric-600 bg-electric-50 border-b-2 border-electric-500'
                    : 'text-gray-500 hover:text-electric-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {activeTab === 'portfolio' && (
          <>
            {/* Portfolio Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-electric-500 to-primary-600 rounded-2xl p-6 text-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">Total Portofolio</h3>
                  <p className="text-3xl font-bold">
                    {formatCurrency(mockPortfolio.totalValue)}
                  </p>
                  <div className={`flex items-center space-x-1 mt-2 ${
                    mockPortfolio.dayChangePercent >= 0 ? 'text-green-200' : 'text-red-200'
                  }`}>
                    {mockPortfolio.dayChangePercent >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {formatCurrency(Math.abs(mockPortfolio.dayChange))} 
                      ({Math.abs(mockPortfolio.dayChangePercent).toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <Coins className="w-8 h-8 opacity-80" />
              </div>
            </motion.div>

            {/* Portfolio Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performa 6 Bulan</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0891b2" 
                    strokeWidth={3} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Asset Allocation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alokasi Aset</h3>
              <div className="flex items-center justify-center mb-4">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {portfolioData.map((asset) => (
                  <div key={asset.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: asset.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(asset.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'market' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Pasar Global</h3>
            {marketData.map((asset, index) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{asset.symbol}</h4>
                    <p className="text-xs text-gray-500">{asset.name}</p>
                    <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {asset.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${asset.price.toLocaleString()}
                    </p>
                    <div className={`flex items-center space-x-1 ${
                      asset.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.changePercent24h >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span className="text-sm font-medium">
                        {Math.abs(asset.changePercent24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'watchlist' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Watchlist Kosong</h3>
            <p className="text-gray-500 mb-6">Tambahkan aset untuk dipantau di sini</p>
            <button className="bg-electric-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-electric-600 transition-colors">
              Tambah Aset
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InvestPage;
