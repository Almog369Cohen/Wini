import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    if (standalone) return;

    // Check iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show after 2nd visit or 30 seconds
    const visitCount = parseInt(localStorage.getItem('wini-visit-count') || '0') + 1;
    localStorage.setItem('wini-visit-count', String(visitCount));
    const dismissed = localStorage.getItem('wini-pwa-dismissed');

    if (!dismissed && visitCount >= 2) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('wini-pwa-dismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-20 inset-x-0 z-30 px-4"
          dir="rtl"
        >
          <div className="bg-card rounded-2xl shadow-2xl border border-cream-dark p-4 max-w-md mx-auto">
            <button
              onClick={handleDismiss}
              className="absolute top-3 left-3 p-1 text-text-light"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-11 h-11 bg-sage/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone size={22} className="text-sage" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-text mb-0.5">
                  התקן את Wini
                </h3>
                <p className="text-xs text-text-light mb-3">
                  {isIOS
                    ? 'לחץ על כפתור השיתוף ← "הוסף למסך הבית"'
                    : 'הוסף למסך הבית לגישה מהירה ותזכורות'}
                </p>

                {!isIOS && deferredPrompt ? (
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-2 bg-sage text-white px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    <Download size={14} />
                    <span>התקן עכשיו</span>
                  </button>
                ) : isIOS ? (
                  <div className="flex items-center gap-2 text-xs text-sage font-medium">
                    <span>⬆️</span>
                    <span>שיתוף → הוסף למסך הבית</span>
                  </div>
                ) : (
                  <button
                    onClick={handleDismiss}
                    className="text-xs text-text-light underline"
                  >
                    אולי אחר כך
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
