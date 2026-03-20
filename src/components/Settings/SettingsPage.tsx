import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash2, Info, LogOut, Moon, Sun } from 'lucide-react';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsPageProps {
  onExport: () => void;
  onImport: (data: string) => void;
  onReset: () => void;
  onSignOut: () => Promise<void>;
  userPhotoURL?: string | null;
  userDisplayName?: string | null;
  userEmail?: string | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export default function SettingsPage({
  onExport,
  onImport,
  onReset,
  onSignOut,
  userPhotoURL,
  userDisplayName,
  userEmail,
  showToast,
}: SettingsPageProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = ev.target?.result as string;
          JSON.parse(data); // validate
          onImport(data);
          showToast('הנתונים יובאו בהצלחה');
        } catch {
          showToast('קובץ לא תקין', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 max-w-lg mx-auto"
    >
      <h1 className="text-2xl font-bold text-text mb-5">הגדרות</h1>

      <div className="space-y-3">
        {/* Dark mode toggle */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative w-5 h-5">
                <motion.div
                  initial={false}
                  animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? -90 : 0, scale: isDark ? 0.5 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Sun size={20} className="text-sand" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 90, scale: isDark ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Moon size={20} className="text-sand" />
                </motion.div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text">מצב כהה</p>
                <p className="text-[11px] text-text-light">{isDark ? 'מופעל' : 'כבוי'}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none"
              style={{ backgroundColor: isDark ? 'var(--color-sage)' : 'var(--color-cream-dark)' }}
              aria-label="Toggle dark mode"
            >
              <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                initial={false}
                animate={{ left: isDark ? '2px' : '22px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        {/* User account */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-4">
            {userPhotoURL ? (
              <img src={userPhotoURL} alt="" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center text-sage font-bold">
                {userDisplayName?.[0] || '?'}
              </div>
            )}
            <div className="text-right flex-1">
              <p className="text-sm font-medium text-text">{userDisplayName || 'משתמש'}</p>
              <p className="text-[11px] text-text-light">{userEmail}</p>
            </div>
          </div>
          <div className="h-px bg-cream-dark mx-4" />
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-coral/5 transition-colors"
          >
            <LogOut size={16} className="text-coral" />
            <span className="text-sm text-coral">התנתק</span>
          </button>
        </div>

        {/* Data management */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <h2 className="text-xs font-semibold text-text-light px-4 pt-4 pb-2">
            ניהול נתונים
          </h2>

          <button
            onClick={onExport}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-cream/50 transition-colors"
          >
            <Download size={18} className="text-sage" />
            <div className="text-right">
              <p className="text-sm font-medium text-text">ייצוא נתונים</p>
              <p className="text-[11px] text-text-light">שמירת גיבוי של כל הנתונים כקובץ JSON</p>
            </div>
          </button>

          <div className="h-px bg-cream-dark mx-4" />

          <button
            onClick={handleImport}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-cream/50 transition-colors"
          >
            <Upload size={18} className="text-sage" />
            <div className="text-right">
              <p className="text-sm font-medium text-text">ייבוא נתונים</p>
              <p className="text-[11px] text-text-light">שחזור נתונים מקובץ גיבוי</p>
            </div>
          </button>

          <div className="h-px bg-cream-dark mx-4" />

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-coral/5 transition-colors"
          >
            <Trash2 size={18} className="text-coral" />
            <div className="text-right">
              <p className="text-sm font-medium text-coral">איפוס כל הנתונים</p>
              <p className="text-[11px] text-text-light">מחיקת כל ההרגלים, היומן וההישגים</p>
            </div>
          </button>
        </div>

        {/* About */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <h2 className="text-xs font-semibold text-text-light px-4 pt-4 pb-2">
            אודות
          </h2>

          <div className="flex items-center gap-3 px-4 py-3.5">
            <Info size={18} className="text-sage" />
            <div className="text-right">
              <p className="text-sm font-medium text-text">Wini v1.0</p>
              <p className="text-[11px] text-text-light">
                אפליקציה אישית לגמילה ובניית הרגלים חיוביים
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-sage/5 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-sage mb-2">טיפים</h3>
          <ul className="text-xs text-text-light space-y-1.5 list-disc list-inside">
            <li>עשה צ'ק-אין יומי כדי לעקוב אחרי הדחפים</li>
            <li>הוסף סיבות להרגלים - הן יופיעו ב-SOS</li>
            <li>השתמש בתרגיל הנשימה כשהדחף חזק</li>
            <li>גבה את הנתונים שלך מדי פעם</li>
          </ul>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="איפוס כל הנתונים"
        message="פעולה זו תמחק את כל ההרגלים, רשומות היומן וההישגים. אי אפשר לשחזר אחרי מחיקה."
        confirmText="מחק הכל"
        cancelText="ביטול"
        variant="danger"
        onConfirm={() => {
          onReset();
          setShowResetConfirm(false);
          showToast('כל הנתונים נמחקו');
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </motion.div>
  );
}
