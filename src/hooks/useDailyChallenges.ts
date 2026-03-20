import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type ChallengeCategory = 'body' | 'soul' | 'social' | 'habit' | 'fun';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  emoji: string;
  xpReward: number;
}

interface ChallengeDay {
  date: string; // YYYY-MM-DD
  completed: string[]; // challenge IDs
}

interface ChallengesData {
  days: Record<string, ChallengeDay>;
  streak: number;
  lastCompletedAllDate?: string; // YYYY-MM-DD
}

const CATEGORY_META: Record<ChallengeCategory, { label: string; emoji: string; color: string }> = {
  body: { label: 'גוף', emoji: '💪', color: 'bg-blue-100 text-blue-700' },
  soul: { label: 'נפש', emoji: '🧘', color: 'bg-purple-100 text-purple-700' },
  social: { label: 'חברתי', emoji: '🤝', color: 'bg-pink-100 text-pink-700' },
  habit: { label: 'הרגל', emoji: '🎯', color: 'bg-amber-100 text-amber-700' },
  fun: { label: 'כיף', emoji: '🎨', color: 'bg-green-100 text-green-700' },
};

const CHALLENGE_POOL: Challenge[] = [
  // גוף (body) - 13
  { id: 'b1', title: 'שתה 10 כוסות מים', description: 'שמור על הגוף רוווי לאורך כל היום', category: 'body', emoji: '💧', xpReward: 10 },
  { id: 'b2', title: 'עשה 20 סקוואטים', description: 'אימון קצר שמחזק את הרגליים', category: 'body', emoji: '🏋️', xpReward: 10 },
  { id: 'b3', title: 'לך 15 דקות ברגל', description: 'טיול קצר שמאוורר את הראש', category: 'body', emoji: '🚶', xpReward: 10 },
  { id: 'b4', title: 'מתח את הגוף 5 דקות', description: 'מתיחות קלות שמשחררות מתח', category: 'body', emoji: '🤸', xpReward: 10 },
  { id: 'b5', title: 'עשה 10 שכיבות סמיכה', description: 'חיזוק פלג גוף עליון', category: 'body', emoji: '💪', xpReward: 10 },
  { id: 'b6', title: 'רקוד לשיר אחד', description: 'תנועה חופשית שמשמחת', category: 'body', emoji: '💃', xpReward: 10 },
  { id: 'b7', title: 'עשה 30 קפיצות', description: 'ג\'אמפינג ג\'ק שמעלה את הדופק', category: 'body', emoji: '🦘', xpReward: 10 },
  { id: 'b8', title: 'לך במדרגות במקום מעלית', description: 'בחר מדרגות לפחות פעם אחת היום', category: 'body', emoji: '🪜', xpReward: 10 },
  { id: 'b9', title: 'שב ישר ל-30 דקות', description: 'שפר את היציבה שלך', category: 'body', emoji: '🧍', xpReward: 10 },
  { id: 'b10', title: 'אכול פרי או ירק', description: 'הוסף מנה אחת של ירוקים היום', category: 'body', emoji: '🥦', xpReward: 10 },
  { id: 'b11', title: 'שתה כוס מים עכשיו', description: 'התחל את האתגר ברגע הזה', category: 'body', emoji: '🥤', xpReward: 10 },
  { id: 'b12', title: 'התעמל 10 דקות', description: 'אימון קצר בבית', category: 'body', emoji: '🏃', xpReward: 10 },
  { id: 'b13', title: 'לך לישון לפני חצות', description: 'שינה טובה מתחילה בשעה סבירה', category: 'body', emoji: '😴', xpReward: 10 },

  // נפש (soul) - 13
  { id: 's1', title: 'כתוב 3 דברים שאתה מודה עליהם', description: 'הכרת תודה משנה את הפרספקטיבה', category: 'soul', emoji: '🙏', xpReward: 10 },
  { id: 's2', title: 'תרגל נשימה עמוקה 3 דקות', description: 'שלוש דקות של שקט ונשימה', category: 'soul', emoji: '🌬️', xpReward: 10 },
  { id: 's3', title: 'קרא 10 דקות', description: 'ספר, מאמר או כל דבר שמעניין אותך', category: 'soul', emoji: '📖', xpReward: 10 },
  { id: 's4', title: 'כתוב מכתב לעצמך', description: 'מכתב עידוד לעצמך העתידי', category: 'soul', emoji: '✉️', xpReward: 10 },
  { id: 's5', title: 'שב בשקט 5 דקות', description: 'רק לשבת, לנשום ולהיות', category: 'soul', emoji: '🧘', xpReward: 10 },
  { id: 's6', title: 'כתוב ביומן מה הרגשת היום', description: 'תעד את הרגשות שלך', category: 'soul', emoji: '📝', xpReward: 10 },
  { id: 's7', title: 'הקשב לפודקאסט מעורר השראה', description: '10 דקות של תוכן שמזין את הנפש', category: 'soul', emoji: '🎧', xpReward: 10 },
  { id: 's8', title: 'סלח למישהו בלב', description: 'שחרר כעס או טינה ישנים', category: 'soul', emoji: '💚', xpReward: 10 },
  { id: 's9', title: 'חשוב על הצלחה שהיתה לך', description: 'היזכר ברגע שבו הצלחת', category: 'soul', emoji: '⭐', xpReward: 10 },
  { id: 's10', title: 'עשה 5 דקות מדיטציה', description: 'התחל ביום בראש שקט', category: 'soul', emoji: '🕯️', xpReward: 10 },
  { id: 's11', title: 'כתוב משפט חיובי על עצמך', description: 'אמירה חיובית שמחזקת', category: 'soul', emoji: '💬', xpReward: 10 },
  { id: 's12', title: 'צא לטבע ל-10 דקות', description: 'שקט, ירוק ואוויר צח', category: 'soul', emoji: '🌳', xpReward: 10 },
  { id: 's13', title: 'הסתכל על שקיעה או זריחה', description: 'רגע של קסם טבעי', category: 'soul', emoji: '🌅', xpReward: 10 },

  // חברתי (social) - 12
  { id: 'c1', title: 'שלח הודעה נחמדה למישהו', description: 'הפתע מישהו עם מילה טובה', category: 'social', emoji: '💌', xpReward: 10 },
  { id: 'c2', title: 'התקשר לחבר', description: 'שיחה קצרה שמחזקת קשר', category: 'social', emoji: '📞', xpReward: 10 },
  { id: 'c3', title: 'עשה מעשה טוב לזר', description: 'חסד קטן שמשנה את היום', category: 'social', emoji: '🌟', xpReward: 10 },
  { id: 'c4', title: 'אמור תודה למישהו', description: 'הכר תודה למישהו שעוזר לך', category: 'social', emoji: '🤗', xpReward: 10 },
  { id: 'c5', title: 'הקשב למישהו בלי להפריע', description: '5 דקות של הקשבה מלאה', category: 'social', emoji: '👂', xpReward: 10 },
  { id: 'c6', title: 'שתף מישהו במה שעובר עליך', description: 'פתיחות מחזקת קשרים', category: 'social', emoji: '💭', xpReward: 10 },
  { id: 'c7', title: 'חייך ל-5 אנשים זרים', description: 'חיוך מדבק ומשמח', category: 'social', emoji: '😊', xpReward: 10 },
  { id: 'c8', title: 'עזור למישהו במשהו קטן', description: 'החזק דלת, עזור לשאת שקית', category: 'social', emoji: '🤲', xpReward: 10 },
  { id: 'c9', title: 'כתוב ביקורת חיובית', description: 'על מסעדה, חנות או שירות', category: 'social', emoji: '⭐', xpReward: 10 },
  { id: 'c10', title: 'שלח שיר למישהו שאתה אוהב', description: 'מוזיקה מחברת בין אנשים', category: 'social', emoji: '🎵', xpReward: 10 },
  { id: 'c11', title: 'ספר למישהו מחמאה כנה', description: 'מילה טובה שמחזקת', category: 'social', emoji: '💐', xpReward: 10 },
  { id: 'c12', title: 'הזמן חבר לקפה או טיול', description: 'יוזמה חברתית שמחזקת', category: 'social', emoji: '☕', xpReward: 10 },

  // הרגל (habit) - 12
  { id: 'h1', title: 'עשה את הגרסה הקטנה של ההרגל שלך', description: 'גם צעד קטן נחשב להתקדמות', category: 'habit', emoji: '🎯', xpReward: 10 },
  { id: 'h2', title: 'זהה טריגר אחד היום', description: 'שים לב מה מעורר אצלך דחפים', category: 'habit', emoji: '🔍', xpReward: 10 },
  { id: 'h3', title: 'כתוב ביומן', description: 'תעד את היום והרגשות שלך', category: 'habit', emoji: '📓', xpReward: 10 },
  { id: 'h4', title: 'עשה 5 דקות מדיטציה', description: 'התמקד בנשימה ובהווה', category: 'habit', emoji: '🧘‍♂️', xpReward: 10 },
  { id: 'h5', title: 'תכנן את מחר', description: 'הכן רשימת משימות ליום הבא', category: 'habit', emoji: '📋', xpReward: 10 },
  { id: 'h6', title: 'עשה צ\'ק-אין להרגל שלך', description: 'דווח על ההתקדמות היום', category: 'habit', emoji: '✅', xpReward: 10 },
  { id: 'h7', title: 'סדר מקום אחד בבית', description: 'שולחן, מגירה או ארון', category: 'habit', emoji: '🧹', xpReward: 10 },
  { id: 'h8', title: 'בחר פעולת החלפה לדחף', description: 'מה תעשה במקום ההרגל הישן?', category: 'habit', emoji: '🔄', xpReward: 10 },
  { id: 'h9', title: 'הסר טריגר אחד מהסביבה', description: 'הרחק פיתוי אחד', category: 'habit', emoji: '🚫', xpReward: 10 },
  { id: 'h10', title: 'ספור לעצמך למה אתה עושה את זה', description: 'היזכר במוטיבציה שלך', category: 'habit', emoji: '💡', xpReward: 10 },
  { id: 'h11', title: 'שתף מישהו בהתקדמות שלך', description: 'אחריותיות חברתית מחזקת', category: 'habit', emoji: '📢', xpReward: 10 },
  { id: 'h12', title: 'תגמל את עצמך על ההתקדמות', description: 'בחר פרס קטן שמשמח אותך', category: 'habit', emoji: '🎁', xpReward: 10 },

  // כיף (fun) - 12
  { id: 'f1', title: 'שמע שיר שאתה אוהב', description: 'מוזיקה שמעלה את מצב הרוח', category: 'fun', emoji: '🎵', xpReward: 10 },
  { id: 'f2', title: 'צא החוצה ל-5 דקות', description: 'שנה אווירה ונשום אוויר צח', category: 'fun', emoji: '🌤️', xpReward: 10 },
  { id: 'f3', title: 'צייר משהו', description: 'ציור חופשי, בלי שיפוט', category: 'fun', emoji: '🎨', xpReward: 10 },
  { id: 'f4', title: 'בשל משהו חדש', description: 'נסה מתכון שלא ניסית', category: 'fun', emoji: '🍳', xpReward: 10 },
  { id: 'f5', title: 'צפה בסרטון מצחיק', description: 'צחוק הוא התרופה הטובה ביותר', category: 'fun', emoji: '😂', xpReward: 10 },
  { id: 'f6', title: 'צלם תמונה יפה', description: 'שים לב ליופי שסביבך', category: 'fun', emoji: '📸', xpReward: 10 },
  { id: 'f7', title: 'נגן שיר או נגינה', description: 'מוזיקה מהלב', category: 'fun', emoji: '🎸', xpReward: 10 },
  { id: 'f8', title: 'כתוב סיפור קצר', description: 'תן לדמיון לזרום', category: 'fun', emoji: '✍️', xpReward: 10 },
  { id: 'f9', title: 'שחק משחק', description: 'לוח, קלפים או נייד', category: 'fun', emoji: '🎮', xpReward: 10 },
  { id: 'f10', title: 'למד משהו חדש', description: '10 דקות על נושא שמעניין אותך', category: 'fun', emoji: '🧠', xpReward: 10 },
  { id: 'f11', title: 'סדר פלייליסט חדש', description: 'אוסף שירים למצב רוח מסוים', category: 'fun', emoji: '🎶', xpReward: 10 },
  { id: 'f12', title: 'עשה דבר אחד ספונטני', description: 'שבור שגרה בפעולה אחת', category: 'fun', emoji: '🎲', xpReward: 10 },
];

function getDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Seeded random for consistent daily selection
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function pickDailyChallenges(dateStr: string): Challenge[] {
  const rng = seededRandom(dateSeed(dateStr));

  // Pick one from each of 3 different categories
  const categories: ChallengeCategory[] = ['body', 'soul', 'social', 'habit', 'fun'];

  // Shuffle categories
  const shuffled = [...categories];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selectedCategories = shuffled.slice(0, 3);

  const result: Challenge[] = [];
  for (const cat of selectedCategories) {
    const pool = CHALLENGE_POOL.filter(c => c.category === cat);
    const idx = Math.floor(rng() * pool.length);
    result.push(pool[idx]);
  }

  return result;
}

const DEFAULT_DATA: ChallengesData = {
  days: {},
  streak: 0,
};

export function useDailyChallenges() {
  const [data, setData] = useLocalStorage<ChallengesData>('wini-challenges', DEFAULT_DATA);
  const today = getDateString();

  const todayChallenges = useMemo(() => pickDailyChallenges(today), [today]);

  const todayCompleted = useMemo(() => {
    return data.days[today]?.completed || [];
  }, [data, today]);

  const completeChallenge = useCallback((challengeId: string) => {
    setData(prev => {
      const dayData = prev.days[today] || { date: today, completed: [] };
      if (dayData.completed.includes(challengeId)) return prev;

      const newCompleted = [...dayData.completed, challengeId];
      const allDone = newCompleted.length >= 3;

      // Calculate streak
      let newStreak = prev.streak;
      let newLastCompleteDate = prev.lastCompletedAllDate;

      if (allDone) {
        newLastCompleteDate = today;
        // Check if yesterday was also completed
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

        if (prev.lastCompletedAllDate === yesterdayStr || prev.streak === 0) {
          newStreak = prev.streak + 1;
        } else if (prev.lastCompletedAllDate !== today) {
          newStreak = 1;
        }
      }

      return {
        ...prev,
        days: {
          ...prev.days,
          [today]: { date: today, completed: newCompleted },
        },
        streak: newStreak,
        lastCompletedAllDate: newLastCompleteDate,
      };
    });
  }, [setData, today]);

  const streak = useMemo(() => {
    // If today is fully done, use stored streak
    if (todayCompleted.length >= 3) return data.streak;
    // If yesterday was last full day, streak is still alive
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    if (data.lastCompletedAllDate === yesterdayStr) return data.streak;
    if (data.lastCompletedAllDate === today) return data.streak;
    return 0;
  }, [data, todayCompleted, today]);

  const xpEarned = useMemo(() => {
    const base = todayCompleted.length * 10;
    const bonus = todayCompleted.length >= 3 ? 20 : 0;
    return base + bonus;
  }, [todayCompleted]);

  return {
    todayChallenges,
    completeChallenge,
    todayCompleted,
    streak,
    xpEarned,
    categoryMeta: CATEGORY_META,
  };
}
