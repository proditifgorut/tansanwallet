import React from 'react';
import { Zap, Smartphone, Wifi, Car, Home, ShoppingCart, Gamepad2, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    { id: 'pulsa', icon: Smartphone, label: 'Pulsa', color: 'bg-blue-500' },
    { id: 'listrik', icon: Zap, label: 'PLN', color: 'bg-yellow-500' },
    { id: 'internet', icon: Wifi, label: 'Internet', color: 'bg-purple-500' },
    { id: 'parking', icon: Car, label: 'Parkir', color: 'bg-green-500' },
    { id: 'rent', icon: Home, label: 'Sewa', color: 'bg-red-500' },
    { id: 'shopping', icon: ShoppingCart, label: 'Belanja', color: 'bg-pink-500' },
    { id: 'games', icon: Gamepad2, label: 'Game', color: 'bg-indigo-500' },
    { id: 'food', icon: Coffee, label: 'F&B', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Pembayaran Cepat</h3>
      
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onActionClick(action.id)}
            className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
