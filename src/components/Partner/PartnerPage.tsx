import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, MessageCircle, Send, Heart, UserPlus, Check } from 'lucide-react';
import type { Habit } from '../../types';
import ShareCard from './ShareCard';

interface PartnerPageProps {
  habits: Habit[];
  userName?: string;
  todayVictories: number;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function PartnerPage({ habits, userName = '', todayVictories, showToast }: PartnerPageProps) {
  const [partnerName, setPartnerName] = useState(() => {
    return localStorage.getItem('wini-partner-name') || '';
  });
  const [editingPartner, setEditingPartner] = useState(false);
  const [partnerInput, setPartnerInput] = useState(partnerName);
  const [dailyMessage, setDailyMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const activeHabits = habits.filter(h => h.isActive);
  const maxStreak = activeHabits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

  const shareText = `\u05d4\u05d9! \u05d0\u05e0\u05d9 \u05de\u05e9\u05ea\u05de\u05e9 \u05d1-Wini \u05db\u05d3\u05d9 \u05dc\u05e9\u05e0\u05d5\u05ea \u05d4\u05e8\u05d2\u05dc\u05d9\u05dd. \u05d4\u05e0\u05d4 \u05d4\u05d4\u05ea\u05e7\u05d3\u05de\u05d5\u05ea \u05e9\u05dc\u05d9: ${maxStreak} \u05d9\u05de\u05d9\u05dd \u05e8\u05e6\u05d5\u05e4\u05d9\u05dd, ${todayVictories} \u05e0\u05d9\u05e6\u05d7\u05d5\u05e0\u05d5\u05ea \u05d4\u05e9\u05d1\u05d5\u05e2! \uD83D\uDCAA`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ההתקדמות שלי ב-Wini',
          text: shareText,
        });
        showToast('שותף בהצלחה!');
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  }, [shareText, showToast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      showToast('הועתק ללוח!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      showToast('שגיאה בהעתקה', 'error');
    });
  }, [shareText, showToast]);

  const handleSavePartner = useCallback(() => {
    localStorage.setItem('wini-partner-name', partnerInput.trim());
    setPartnerName(partnerInput.trim());
    setEditingPartner(false);
    if (partnerInput.trim()) {
      showToast(`${partnerInput.trim()} נשמר כשותף לאחריות`);
    }
  }, [partnerInput, showToast]);

  const handleWhatsAppSOS = useCallback(() => {
    const message = partnerName
      ? `${partnerName}, אני צריך/ה תמיכה עכשיו. אני במאבק עם הרגל ואשמח למילה טובה. 🙏`
      : 'היי, אני צריך/ה תמיכה עכשיו. אני במאבק עם הרגל ואשמח למילה טובה. 🙏';
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }, [partnerName]);

  const handleShareDailyUpdate = useCallback(() => {
    const message = dailyMessage.trim()
      || `עדכון יומי מ-Wini:\n${maxStreak} ימים רצופים, ${todayVictories} ניצחונות היום.\n${activeHabits.length} הרגלים פעילים. 💪`;

    if (navigator.share) {
      navigator.share({
        title: 'עדכון יומי - Wini',
        text: message,
      }).catch(() => {
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      });
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
    setDailyMessage('');
    showToast('העדכון נשלח!');
  }, [dailyMessage, maxStreak, todayVictories, activeHabits.length, showToast]);

  const handleSmsSOS = useCallback(() => {
    const message = partnerName
      ? `${partnerName}, אני צריך/ה תמיכה עכשיו. אני במאבק עם הרגל ואשמח למילה טובה.`
      : 'היי, אני צריך/ה תמיכה עכשיו. אני במאבק עם הרגל ואשמח למילה טובה.';
    window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
  }, [partnerName]);

  return (
    <motion.div
      key="partner"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 pb-8 max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="text-4xl mb-2"
        >
          👥
        </motion.div>
        <h1 className="text-2xl font-bold text-text">שותף לאחריות</h1>
        <p className="text-sm text-text-light mt-1">שתף את המסע שלך ובקש תמיכה</p>
      </div>

      {/* Section A: Share Progress */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-base font-bold text-text mb-3 flex items-center gap-2">
          <Share2 size={16} className="text-sage" />
          שתף את ההתקדמות שלך
        </h2>

        {/* Share Card */}
        <div className="mb-4">
          <ShareCard
            userName={userName || 'משתמש Wini'}
            streak={maxStreak}
            victories={todayVictories}
            habitsCount={activeHabits.length}
          />
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="bg-sage text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-sage-dark transition-colors shadow-sm"
          >
            <Share2 size={16} />
            שתף
          </button>
          <button
            onClick={handleCopy}
            className="bg-card border border-sage/20 text-sage rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-sage/5 transition-colors shadow-sm"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'הועתק!' : 'העתק טקסט'}
          </button>
        </div>
      </motion.div>

      {/* Partner name section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-4 shadow-sm mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-text flex items-center gap-2">
            <UserPlus size={14} className="text-sage" />
            השותף שלי
          </h3>
          {partnerName && !editingPartner && (
            <button
              onClick={() => { setEditingPartner(true); setPartnerInput(partnerName); }}
              className="text-xs text-sage"
            >
              ערוך
            </button>
          )}
        </div>

        {editingPartner || !partnerName ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={partnerInput}
              onChange={(e) => setPartnerInput(e.target.value)}
              placeholder="שם השותף לאחריות"
              className="flex-1 bg-cream rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-light/50 outline-none focus:ring-2 focus:ring-sage/30"
              dir="rtl"
            />
            <button
              onClick={handleSavePartner}
              className="bg-sage text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-sage-dark transition-colors"
            >
              שמור
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-sage/10 rounded-xl p-3">
            <Heart size={14} className="text-sage" />
            <span className="text-sm font-medium text-text">{partnerName}</span>
          </div>
        )}
      </motion.div>

      {/* Section B: Request Support */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-base font-bold text-text mb-3 flex items-center gap-2">
          <MessageCircle size={16} className="text-coral" />
          בקש תמיכה
        </h2>

        {/* SOS buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleWhatsAppSOS}
            className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl p-3.5 flex flex-col items-center gap-2 hover:bg-[#25D366]/20 transition-colors"
          >
            <span className="text-2xl">💬</span>
            <div className="text-center">
              <p className="text-xs font-medium text-[#25D366]">WhatsApp</p>
              <p className="text-[9px] text-text-light">שלח SOS בוואטסאפ</p>
            </div>
          </button>
          <button
            onClick={handleSmsSOS}
            className="bg-sea/10 border border-sea/20 rounded-xl p-3.5 flex flex-col items-center gap-2 hover:bg-sea/20 transition-colors"
          >
            <span className="text-2xl">📱</span>
            <div className="text-center">
              <p className="text-xs font-medium text-sea">SMS</p>
              <p className="text-[9px] text-text-light">שלח הודעת תמיכה</p>
            </div>
          </button>
        </div>

        {/* Daily update */}
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
            <Send size={14} className="text-sage" />
            שלח עדכון יומי
          </h3>
          <textarea
            value={dailyMessage}
            onChange={(e) => setDailyMessage(e.target.value)}
            placeholder={`עדכון יומי מ-Wini:\n${maxStreak} ימים רצופים, ${todayVictories} ניצחונות היום.\n${activeHabits.length} הרגלים פעילים. 💪`}
            className="w-full bg-cream rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-light/40 outline-none focus:ring-2 focus:ring-sage/30 resize-none h-24 mb-3"
            dir="rtl"
          />
          <button
            onClick={handleShareDailyUpdate}
            className="w-full bg-sage text-white rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-sage-dark transition-colors"
          >
            <Send size={14} />
            שלח עדכון
            {partnerName ? ` ל${partnerName}` : ''}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
