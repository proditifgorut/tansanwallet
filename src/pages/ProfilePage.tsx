import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Bell, Globe, Eye, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { mockUser, mockWalletBalance } from '../utils/mockData';

const ProfilePage: React.FC = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-semibold mb-4">Anda harus login untuk melihat halaman ini.</h2>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-electric-500 text-white font-medium rounded-xl hover:bg-electric-600 transition-colors"
        >
          Ke Halaman Login
        </button>
      </div>
    );
  }

  const menuItems = [
    {
      section: 'Akun',
      items: [
        { icon: User, label: 'Edit Profil', action: 'edit-profile' },
        { icon: Shield, label: 'Keamanan & Privasi', action: 'security' },
        { icon: CreditCard, label: 'Metode Pembayaran', action: 'payment-methods' },
        { icon: Eye, label: 'Verifikasi KYC', action: 'kyc', status: 'Terverifikasi' },
      ]
    },
    {
      section: 'Pengaturan',
      items: [
        { icon: Bell, label: 'Notifikasi', action: 'notifications' },
        { icon: Globe, label: 'Bahasa', action: 'language', value: 'Indonesia' },
        { icon: Smartphone, label: 'Biometrik', action: 'biometric', status: 'Aktif' },
      ]
    }
  ];

  const handleMenuClick = (action: string) => {
    alert(`${action} feature will be implemented`);
  };

  const userData = {
    name: session.user.user_metadata?.name || 'Tansan User',
    email: session.user.email || '',
    phone: session.user.phone || mockUser.phone,
    avatar: session.user.user_metadata?.avatar_url || mockUser.avatar,
    kycStatus: mockUser.kycStatus,
    riskProfile: mockUser.riskProfile,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Profil</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-electric-500 to-primary-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center space-x-4">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-16 h-16 rounded-full border-3 border-white/20"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-sm opacity-80">{userData.email}</p>
            </div>
          </div>
        </motion.div>

        {menuItems.map((section, sectionIndex) => (
          <motion.div
            key={section.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (sectionIndex + 1) * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-gray-900">{section.section}</h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {section.items.map((item) => (
                <button
                  key={item.action}
                  onClick={() => handleMenuClick(item.action)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.status && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">{item.status}</span>
                    )}
                    {item.value && (
                      <span className="text-sm text-gray-500">{item.value}</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleLogout}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-center space-x-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Keluar</span>
          </button>
        </motion.div>

        <div className="text-center text-sm text-gray-500">
          TansanWallet v1.1.0
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
