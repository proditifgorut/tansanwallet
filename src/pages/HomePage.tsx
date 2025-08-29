import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import WalletCard from '../components/WalletCard';
import MarketOverview from '../components/MarketOverview';
import AIInsights from '../components/AIInsights';
import QuickActions from '../components/QuickActions';
import TransactionHistory from '../components/TransactionHistory';
import { mockWalletBalance, mockUser, generateMockMarketData, generateMockAIInsights, generateMockTransactions } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [marketData] = useState(generateMockMarketData());
  const [aiInsights] = useState(generateMockAIInsights());
  const [transactions] = useState(generateMockTransactions());
  const { session } = useAuth();

  const handleActionClick = (action: string) => {
    alert(`${action} feature will be implemented`);
  };

  const userDisplayName = session?.user?.user_metadata?.name || mockUser.name.split(' ')[0];
  const userAvatar = session?.user?.user_metadata?.avatar_url || mockUser.avatar;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {session ? (
              <div className="flex items-center space-x-3">
                <img
                  src={userAvatar}
                  alt={userDisplayName}
                  className="w-10 h-10 rounded-full border-2 border-electric-200"
                />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Halo, {userDisplayName}! 👋
                  </h1>
                  <p className="text-sm text-gray-500">Selamat datang kembali</p>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-lg font-semibold text-gray-900">TansanWallet</h1>
                <p className="text-sm text-gray-500">Your Smart Financial Companion</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              {session ? (
                <Link 
                  to="/notifications"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-electric-500 text-white text-sm font-medium rounded-full hover:bg-electric-600 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 space-y-6 py-6">
        <WalletCard
          balance={mockWalletBalance}
          showBalance={showBalance}
          onToggleBalance={() => setShowBalance(!showBalance)}
          onTopUp={() => handleActionClick('Top Up')}
          onSend={() => handleActionClick('Send Money')}
          onPay={() => handleActionClick('Pay Bills')}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AIInsights insights={aiInsights} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickActions onActionClick={handleActionClick} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MarketOverview marketData={marketData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TransactionHistory transactions={transactions} />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
