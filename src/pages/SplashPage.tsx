import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const SplashPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-electric-500 to-primary-600 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
          <ShieldCheck className="w-12 h-12 text-gold-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-wider">TansanWallet</h1>
        <p className="mt-2 text-lg opacity-80">Your Smart Financial Companion</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-10 text-center"
      >
        <p className="text-sm opacity-60">Secure & Intelligent</p>
      </motion.div>
    </div>
  );
};

export default SplashPage;
