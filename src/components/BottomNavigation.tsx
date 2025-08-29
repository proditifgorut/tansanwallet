import React from 'react';
import { Link } from 'react-router-dom';
import { Home, TrendingUp, QrCode, Bell, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  const tabs = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'invest', path: '/invest', icon: TrendingUp, label: 'Invest' },
    { id: 'qr', path: '/qr', icon: QrCode, label: 'Scan' },
    { id: 'notifications', path: '/notifications', icon: Bell, label: 'Alerts' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
  ];

  const currentTab = activeTab === '' ? 'home' : activeTab;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {tabs.map(({ id, path, icon: Icon, label }) => (
            <Link
              key={id}
              to={path}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 w-1/5 ${
                currentTab === id
                  ? 'text-electric-500 bg-electric-50'
                  : 'text-gray-500 hover:text-electric-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${currentTab === id ? 'text-electric-500' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
