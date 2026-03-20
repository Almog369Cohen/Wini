import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn();
    } catch {
      setError('שגיאה בהתחברות. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-cream to-cream-dark px-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-center max-w-sm w-full"
      >
        {/* Logo */}
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-3xl font-bold text-sage mb-2">Wini</h1>
        <p className="text-text-light text-sm mb-8">המסע שלך לחיים טובים יותר</p>

        {/* Google Sign In Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-card border border-cream-dark rounded-xl px-6 py-3.5 shadow-sm hover:shadow-md transition-all disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-sage border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          <span className="text-sm font-medium text-text">
            {loading ? 'מתחבר...' : 'התחבר עם Google'}
          </span>
        </motion.button>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-coral text-xs mt-3"
          >
            {error}
          </motion.p>
        )}

        <p className="text-[10px] text-text-light/60 mt-6">
          ההתחברות מאובטחת דרך Google
        </p>
      </motion.div>
    </motion.div>
  );
}
