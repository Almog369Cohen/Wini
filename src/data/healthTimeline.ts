import type { Milestone, HabitCategory } from '../types';

export const smokingMilestones: Milestone[] = [
  {
    id: 'smoke-20min',
    title: '20 דקות',
    description: 'הדופק ולחץ הדם מתחילים לחזור לנורמה',
    timeRequired: 20,
    category: 'smoking',
    icon: '❤️',
  },
  {
    id: 'smoke-8h',
    title: '8 שעות',
    description: 'רמת הפחמן החד-חמצני בדם יורדת לחצי, רמת החמצן חוזרת לנורמה',
    timeRequired: 480,
    category: 'smoking',
    icon: '🫁',
  },
  {
    id: 'smoke-24h',
    title: '24 שעות',
    description: 'הסיכון להתקף לב מתחיל לרדת. הגוף מנקה את עצמו מפחמן חד-חמצני',
    timeRequired: 1440,
    category: 'smoking',
    icon: '💪',
  },
  {
    id: 'smoke-48h',
    title: '48 שעות',
    description: 'קצות העצבים מתחילים להתחדש. חוש הטעם והריח משתפרים',
    timeRequired: 2880,
    category: 'smoking',
    icon: '👃',
  },
  {
    id: 'smoke-72h',
    title: '72 שעות',
    description: 'סמפונות הריאות נרגעים. הנשימה קלה יותר. רמת האנרגיה עולה',
    timeRequired: 4320,
    category: 'smoking',
    icon: '🌬️',
  },
  {
    id: 'smoke-2w',
    title: 'שבועיים',
    description: 'זרימת הדם משתפרת. ההליכה נעשית קלה יותר',
    timeRequired: 20160,
    category: 'smoking',
    icon: '🚶',
  },
  {
    id: 'smoke-1m',
    title: 'חודש',
    description: 'השיעול פוחת, הריאות מתחילות לתפקד טוב יותר. עייפות ובעיות נשימה פוחתות',
    timeRequired: 43200,
    category: 'smoking',
    icon: '🌿',
  },
  {
    id: 'smoke-3m',
    title: '3 חודשים',
    description: 'זרימת הדם משתפרת משמעותית. תפקוד הריאות עולה עד 30%',
    timeRequired: 129600,
    category: 'smoking',
    icon: '🏃',
  },
  {
    id: 'smoke-6m',
    title: '6 חודשים',
    description: 'סינוסים פחות סתומים. פחות עייפות. שיעול כמעט נעלם',
    timeRequired: 259200,
    category: 'smoking',
    icon: '✨',
  },
  {
    id: 'smoke-1y',
    title: 'שנה',
    description: 'הסיכון למחלות לב יורד לחצי בהשוואה למעשן. חסכת סכום משמעותי!',
    timeRequired: 525600,
    category: 'smoking',
    icon: '🎉',
  },
];

export const genericMilestones: Milestone[] = [
  {
    id: 'gen-1d',
    title: 'יום אחד',
    description: 'הצעד הראשון! הגוף כבר מתחיל להסתגל',
    timeRequired: 1440,
    category: 'other',
    icon: '🌱',
  },
  {
    id: 'gen-3d',
    title: '3 ימים',
    description: 'שיא הדחפים הפיזיים. מכאן זה רק הולך ומשתפר!',
    timeRequired: 4320,
    category: 'other',
    icon: '💪',
  },
  {
    id: 'gen-1w',
    title: 'שבוע',
    description: 'המוח מתחיל ליצור נתיבים עצביים חדשים. הדחפים נחלשים',
    timeRequired: 10080,
    category: 'other',
    icon: '🧠',
  },
  {
    id: 'gen-2w',
    title: 'שבועיים',
    description: 'ההרגל החדש מתחיל להיבנות. המוטיבציה חוזרת',
    timeRequired: 20160,
    category: 'other',
    icon: '🌿',
  },
  {
    id: 'gen-1m',
    title: 'חודש',
    description: 'מחקרים מראים שאחרי חודש ההרגל החדש נטמע. כל הכבוד!',
    timeRequired: 43200,
    category: 'other',
    icon: '🌳',
  },
  {
    id: 'gen-3m',
    title: '3 חודשים',
    description: 'ההרגל הישן כמעט לא חלק מהזהות שלך יותר',
    timeRequired: 129600,
    category: 'other',
    icon: '🏔️',
  },
  {
    id: 'gen-6m',
    title: 'חצי שנה',
    description: 'אתה כבר אדם אחר. השינוי הזה הפך לחלק ממי שאתה',
    timeRequired: 259200,
    category: 'other',
    icon: '⭐',
  },
  {
    id: 'gen-1y',
    title: 'שנה!',
    description: 'שנה שלמה! הוכחת שאתה חזק יותר מכל הרגל',
    timeRequired: 525600,
    category: 'other',
    icon: '🎉',
  },
];

export const alcoholMilestones: Milestone[] = [
  { id: 'alc-6h', title: '6 שעות', description: 'תסמיני גמילה ראשונים עשויים להופיע. הגוף מתחיל להסתגל', timeRequired: 360, category: 'alcohol', icon: '⏰' },
  { id: 'alc-24h', title: '24 שעות', description: 'רמת הסוכר בדם מתייצבת. הגוף מתחיל לנקות רעלים', timeRequired: 1440, category: 'alcohol', icon: '💪' },
  { id: 'alc-72h', title: '72 שעות', description: 'שיא תסמיני הגמילה חולף. מכאן זה משתפר', timeRequired: 4320, category: 'alcohol', icon: '🌅' },
  { id: 'alc-1w', title: 'שבוע', description: 'איכות השינה משתפרת משמעותית. יותר אנרגיה', timeRequired: 10080, category: 'alcohol', icon: '😴' },
  { id: 'alc-2w', title: 'שבועיים', description: 'רירית הקיבה מתחילה להתחדש. העיכול משתפר', timeRequired: 20160, category: 'alcohol', icon: '🫁' },
  { id: 'alc-1m', title: 'חודש', description: 'שומן הכבד מתחיל להצטמצם. העור נראה בריא יותר', timeRequired: 43200, category: 'alcohol', icon: '✨' },
  { id: 'alc-3m', title: '3 חודשים', description: 'לחץ הדם יורד. תפקוד הכבד משתפר משמעותית', timeRequired: 129600, category: 'alcohol', icon: '❤️' },
  { id: 'alc-1y', title: 'שנה', description: 'הסיכון למחלות לב, כבד וסרטן יורד בחדות. גוף חדש!', timeRequired: 525600, category: 'alcohol', icon: '🎉' },
];

export const sugarMilestones: Milestone[] = [
  { id: 'sug-1d', title: 'יום אחד', description: 'רמת הסוכר בדם מתחילה להתייצב', timeRequired: 1440, category: 'sugar', icon: '📉' },
  { id: 'sug-3d', title: '3 ימים', description: 'שיא הדחפים לסוכר. הגוף מחפש את המנה שלו', timeRequired: 4320, category: 'sugar', icon: '💪' },
  { id: 'sug-1w', title: 'שבוע', description: 'חוש הטעם מתחיל להשתנות. אוכל רגיל נהיה יותר טעים', timeRequired: 10080, category: 'sugar', icon: '👅' },
  { id: 'sug-2w', title: 'שבועיים', description: 'רמות האנרגיה מתייצבות. פחות קריסות אנרגיה אחרי ארוחות', timeRequired: 20160, category: 'sugar', icon: '⚡' },
  { id: 'sug-1m', title: 'חודש', description: 'העור נקי יותר. הדלקות בגוף יורדות. השינה טובה יותר', timeRequired: 43200, category: 'sugar', icon: '✨' },
  { id: 'sug-3m', title: '3 חודשים', description: 'ירידה במשקל, שיפור בריכוז, מצב רוח יציב', timeRequired: 129600, category: 'sugar', icon: '🏃' },
  { id: 'sug-1y', title: 'שנה', description: 'סיכון מופחת לסוכרת, מחלות לב ובעיות שיניים', timeRequired: 525600, category: 'sugar', icon: '🎉' },
];

export const caffeineMilestones: Milestone[] = [
  { id: 'caf-12h', title: '12 שעות', description: 'כאב ראש מגמילה עשוי להתחיל. זה נורמלי ויעבור', timeRequired: 720, category: 'caffeine', icon: '🤕' },
  { id: 'caf-24h', title: '24 שעות', description: 'שיא כאב הראש. שתה הרבה מים ונח', timeRequired: 1440, category: 'caffeine', icon: '💧' },
  { id: 'caf-3d', title: '3 ימים', description: 'הגוף מתחיל להסתגל. כאב הראש פוחת', timeRequired: 4320, category: 'caffeine', icon: '💪' },
  { id: 'caf-1w', title: 'שבוע', description: 'איכות השינה משתפרת דרמטית. ערנות טבעית חוזרת', timeRequired: 10080, category: 'caffeine', icon: '😴' },
  { id: 'caf-2w', title: 'שבועיים', description: 'לחץ הדם יורד. חרדה ועצבנות פוחתים', timeRequired: 20160, category: 'caffeine', icon: '😌' },
  { id: 'caf-1m', title: 'חודש', description: 'אנרגיה יציבה לאורך כל היום בלי ups and downs', timeRequired: 43200, category: 'caffeine', icon: '⚡' },
  { id: 'caf-3m', title: '3 חודשים', description: 'השיניים לבנות יותר. העיכול תקין. שינה מושלמת', timeRequired: 129600, category: 'caffeine', icon: '🦷' },
];

export function getMilestonesForCategory(category: HabitCategory): Milestone[] {
  switch (category) {
    case 'smoking': return smokingMilestones;
    case 'alcohol': return alcoholMilestones;
    case 'sugar': return sugarMilestones;
    case 'caffeine': return caffeineMilestones;
    default: return genericMilestones;
  }
}
