import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/', { replace: true });
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: signInError } = await signIn({ email, password });

    if (signInError) {
      setError(signInError.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };
  
  const setCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@admin.com');
      setPassword('admin');
    } else {
      setEmail('user@user.com');
      setPassword('admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-4 bg-electric-100 rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-electric-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang</h1>
          <p className="text-gray-500 mt-2">Masuk untuk mengelola keuangan Anda.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-md space-y-6"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative flex items-center" role="alert">
              <AlertCircle className="w-5 h-5 mr-2"/>
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-electric-400 transition"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-electric-400 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center text-sm">
             <p className="text-gray-500">Use default:</p>
             <div className="flex space-x-2">
                <button type="button" onClick={() => setCredentials('admin')} className="font-medium text-electric-500 hover:underline">Admin</button>
                <button type="button" onClick={() => setCredentials('user')} className="font-medium text-electric-500 hover:underline">User</button>
             </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-electric-500 text-white font-bold py-3 rounded-xl hover:bg-electric-600 transition-colors shadow-lg shadow-electric-500/30 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Masuk'}
          </motion.button>
          
          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <a href="#" className="font-medium text-electric-500 hover:underline">
              Daftar Sekarang
            </a>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default LoginPage;
