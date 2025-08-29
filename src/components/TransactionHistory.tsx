import React from 'react';
import { ArrowUpRight, ArrowDownLeft, QrCode, CreditCard, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup': return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case 'withdraw': return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      case 'transfer': return <Repeat className="w-5 h-5 text-blue-600" />;
      case 'payment': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'qris': return <QrCode className="w-5 h-5 text-orange-600" />;
      default: return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

    if (type === 'topup') return `+${formatted}`;
    if (type === 'withdraw') return `-${formatted}`;
    return formatted;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Riwayat Transaksi</h3>
        <button className="text-electric-500 text-sm font-medium">Lihat Semua</button>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {transaction.type === 'topup' ? 'Top Up' : 
                     transaction.type === 'qris' ? 'QRIS Payment' :
                     transaction.type}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {format(transaction.date, 'dd MMM yyyy, HH:mm', { locale: id })}
                  </p>
                  {transaction.recipient && (
                    <p className="text-xs text-gray-600">ke {transaction.recipient}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'topup' ? 'text-green-600' : 
                  transaction.type === 'withdraw' ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status === 'completed' ? 'Berhasil' :
                   transaction.status === 'pending' ? 'Pending' : 'Gagal'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
