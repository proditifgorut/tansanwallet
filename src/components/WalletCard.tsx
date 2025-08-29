import React from 'react';
import { Eye, EyeOff, Plus, Send, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletCardProps {
  balance: {
    idr: number;
    usd: number;
  };
  showBalance: boolean;
  onToggleBalance: () => void;
  onTopUp: () => void;
  onSend: () => void;
  onPay: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  showBalance,
  onToggleBalance,
  onTopUp,
  onSend,
  onPay,
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-electric-500 to-primary-600 rounded-2xl p-6 text-white shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold opacity-90">Saldo TansanWallet</h3>
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-2xl font-bold">
              {showBalance ? formatCurrency(balance.idr, 'IDR') : '••••••••'}
            </p>
            <button
              onClick={onToggleBalance}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-sm opacity-80 mt-1">
            USD: {showBalance ? formatCurrency(balance.usd, 'USD') : '••••'}
          </p>
        </div>
        <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">T</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTopUp}
          className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center space-y-1 hover:bg-white/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs font-medium">Top Up</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSend}
          className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center space-y-1 hover:bg-white/30 transition-colors"
        >
          <Send className="w-5 h-5" />
          <span className="text-xs font-medium">Kirim</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPay}
          className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center space-y-1 hover:bg-white/30 transition-colors"
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-xs font-medium">Bayar</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WalletCard;
