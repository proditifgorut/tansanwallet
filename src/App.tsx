import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import HomePage from './pages/HomePage';
import InvestPage from './pages/InvestPage';
import QRPage from './pages/QRPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const activeTab = location.pathname.substring(1) || 'home';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNavigation activeTab={activeTab} />
    </div>
  );
};

function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2500); // Splash screen duration

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible || authLoading) {
    return <SplashPage />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="invest" element={<InvestPage />} />
        <Route path="qr" element={<QRPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
