import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X, Send, Lightbulb, Bug, Wrench, MessageCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { FeedbackItem } from '../../hooks/useFeedback';

interface FeedbackButtonProps {
  userName: string;
  userId: string;
  onSubmit: (userId: string, userName: string, type: FeedbackItem['type'], message: string) => Promise<boolean>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const FEEDBACK_TYPES: { type: FeedbackItem['type']; label: string; emoji: string; color: string; lightBg: string; darkBg: string; Icon: typeof Lightbulb }[] = [
  { type: 'idea', label: 'רעיון חדש', emoji: '💡', color: '#059669', lightBg: '#d1fae5', darkBg: 'rgba(5,150,105,0.15)', Icon: Lightbulb },
  { type: 'improvement', label: 'שיפור', emoji: '🔧', color: '#0891b2', lightBg: '#cffafe', darkBg: 'rgba(8,145,178,0.15)', Icon: Wrench },
  { type: 'bug', label: 'באג / תקלה', emoji: '🐛', color: '#dc2626', lightBg: '#fee2e2', darkBg: 'rgba(220,38,38,0.15)', Icon: Bug },
  { type: 'other', label: 'אחר', emoji: '💬', color: '#7c3aed', lightBg: '#ede9fe', darkBg: 'rgba(124,58,237,0.15)', Icon: MessageCircle },
];

export default function FeedbackButton({ userName, userId, onSubmit, showToast }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedbackItem['type']>('idea');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSending(true);
    await onSubmit(userId, userName, selectedType, message.trim());
    setSending(false);
    showToast('תודה על הפידבק! 🙏');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-40 w-12 h-12 rounded-full bg-sage text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
        style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="שלח רעיון או פידבק"
      >
        <MessageSquarePlus size={22} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[100] flex items-end justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-t-3xl p-5"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-text">שלח פידבק</h2>
                <button onClick={() => setIsOpen(false)} className="p-1">
                  <X size={20} className="text-text-light" />
                </button>
              </div>

              <p className="text-sm text-text-light mb-4">
                היי {userName}! יש לך רעיון, שיפור, או משהו שאפשר לתקן?
              </p>

              {/* Type selector */}
              <div className="flex gap-2 mb-4">
                {FEEDBACK_TYPES.map(ft => (
                  <button
                    key={ft.type}
                    onClick={() => setSelectedType(ft.type)}
                    className="flex-1 py-2 px-1 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1"
                    style={{
                      backgroundColor: selectedType === ft.type ? (isDark ? ft.darkBg : ft.lightBg) : 'transparent',
                      color: selectedType === ft.type ? ft.color : (isDark ? '#9a9aa0' : '#9ca3af'),
                      border: `2px solid ${selectedType === ft.type ? ft.color : 'transparent'}`,
                    }}
                  >
                    <span className="text-base">{ft.emoji}</span>
                    {ft.label}
                  </button>
                ))}
              </div>

              {/* Message */}
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="ספר לנו מה חשבת..."
                className="w-full bg-cream/50 rounded-xl p-4 text-sm text-text border border-cream-dark focus:border-sage focus:outline-none resize-none h-28 mb-4"
                autoFocus
              />

              <button
                onClick={handleSubmit}
                disabled={!message.trim() || sending}
                className="w-full bg-sage text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {sending ? (
                  <span>שולח...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>שלח פידבק</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-text-light/50 text-center mt-3">
                הפידבק שלך עוזר לנו לשפר את Wini לכולם
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
