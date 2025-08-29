import React, { useState } from 'react';
import { QrCode, Scan, CreditCard, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const QRPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'scan' | 'generate'>('scan');

  const generateQRCode = () => {
    // In a real app, this would generate an actual QR code
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIj5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">QRIS Payment</h1>
          <p className="text-sm text-gray-500">Scan atau buat kode QR untuk pembayaran</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveMode('scan')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeMode === 'scan'
                  ? 'text-electric-600 bg-electric-50 border-b-2 border-electric-500'
                  : 'text-gray-500 hover:text-electric-500'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>Scan QR</span>
            </button>
            <button
              onClick={() => setActiveMode('generate')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeMode === 'generate'
                  ? 'text-electric-600 bg-electric-50 border-b-2 border-electric-500'
                  : 'text-gray-500 hover:text-electric-500'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Buat QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {activeMode === 'scan' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Camera View Placeholder */}
            <div className="bg-black rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-white rounded-xl opacity-50"></div>
              <div className="absolute inset-8 border border-white rounded-lg"></div>
              <div className="h-64 flex items-center justify-center">
                <div className="text-white">
                  <Scan className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-medium">Arahkan kamera ke QR Code</p>
                  <p className="text-sm opacity-80 mt-2">Pastikan kode QR berada dalam frame</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center space-y-2"
              >
                <CreditCard className="w-6 h-6 text-electric-500" />
                <span className="text-xs font-medium text-gray-700">Bayar Merchant</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center space-y-2"
              >
                <UserPlus className="w-6 h-6 text-electric-500" />
                <span className="text-xs font-medium text-gray-700">Transfer Teman</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center space-y-2"
              >
                <QrCode className="w-6 h-6 text-electric-500" />
                <span className="text-xs font-medium text-gray-700">Galeri</span>
              </motion.button>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Tips Scan QR:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-electric-500 rounded-full"></div>
                  <span>Pastikan pencahayaan cukup terang</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-electric-500 rounded-full"></div>
                  <span>Jaga jarak 10-30 cm dari kode QR</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-electric-500 rounded-full"></div>
                  <span>Pastikan kode QR dalam kondisi bersih</span>
                </li>
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* QR Code Display */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <img 
                  src={generateQRCode()} 
                  alt="QR Code" 
                  className="w-40 h-40 rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kode QR Anda</h3>
              <p className="text-sm text-gray-500">Tunjukkan kode ini untuk menerima pembayaran</p>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <img
                  src="https://ui-avatars.com/api/?name=Budi+Santoso&background=3b82f6&color=fff"
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Budi Santoso</h4>
                  <p className="text-sm text-gray-500">+62 812-3456-7890</p>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Nominal (Opsional)</h3>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Rp</span>
                <input
                  type="number"
                  placeholder="0"
                  className="flex-1 text-2xl font-bold text-gray-900 outline-none"
                />
              </div>
              <div className="flex space-x-2 mt-3">
                {[50000, 100000, 250000].map((amount) => (
                  <button
                    key={amount}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-electric-100 hover:text-electric-600 transition-colors"
                  >
                    {amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Bagikan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-electric-500 text-white py-3 rounded-xl font-medium hover:bg-electric-600 transition-colors"
              >
                Simpan QR
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QRPage;
