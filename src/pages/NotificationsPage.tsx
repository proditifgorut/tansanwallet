import React, { useState } from 'react';
import { Bell, TrendingUp, AlertTriangle, Info, Clock, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateMockAlerts } from '../utils/mockData';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const NotificationsPage: React.FC = () => {
  const [alerts, setAlerts] = useState(generateMockAlerts());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price': return <TrendingUp className="w-5 h-5" />;
      case 'technical': return <AlertTriangle className="w-5 h-5" />;
      case 'news': return <Info className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-700';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const filteredAlerts = filter === 'unread' 
    ? alerts.filter(alert => !alert.read)
    : alerts;

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notifikasi</h1>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-electric-500 text-sm font-medium hover:text-electric-600"
              >
                Tandai Semua
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'text-electric-600 border-b-2 border-electric-500'
                  : 'text-gray-500 hover:text-electric-500'
              }`}
            >
              Semua ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'text-electric-600 border-b-2 border-electric-500'
                  : 'text-gray-500 hover:text-electric-500'
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-md mx-auto px-4 py-6">
        {filteredAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'unread' ? 'Tidak Ada Notifikasi Baru' : 'Tidak Ada Notifikasi'}
            </h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'Semua notifikasi sudah dibaca' 
                : 'Notifikasi akan muncul di sini'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => markAsRead(alert.id)}
                className={`rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-md ${
                  alert.read 
                    ? 'bg-white border-gray-100' 
                    : getAlertColor(alert.priority)
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-full ${
                      alert.read ? 'bg-gray-100' : 'bg-white/50'
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-sm">{alert.asset}</h4>
                        {!alert.read && (
                          <div className="w-2 h-2 bg-electric-500 rounded-full"></div>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{alert.title}</h3>
                      <p className="text-sm opacity-80 mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-2 text-xs opacity-70">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true, locale: id })}
                        </span>
                        <span className="px-2 py-1 bg-white/30 rounded-full font-medium">
                          {alert.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
