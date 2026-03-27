// נתוני מתחרים — מעודכן ידנית או דרך Manus
// Manus עם גישה ל-Meta ימלא את זה אוטומטית

import type { CompetitorData } from '../../bots/bot-config';

export const COMPETITORS: CompetitorData[] = [
  // מתחרים לדוגמה — Manus יחליף עם נתונים אמיתיים
  {
    name: 'DJ לדוגמה 1',
    instagramHandle: '@example_dj_1',
    specialization: 'חתונות פרימיום',
    contentStyle: 'קליפים מרחבות, אורות ועשן',
    mainMessages: 'האנרגיה שלנו, המסיבה שלכם',
    strengths: 'תוכן ויזואלי חזק, הרבה עוקבים',
    weaknesses: 'אפס ערך בתוכן, גנרי, כמו כולם',
    positioningGaps: 'לא מדבר על חוויה רגשית, רק על מסיבה',
  },
  {
    name: 'DJ לדוגמה 2',
    instagramHandle: '@example_dj_2',
    specialization: 'חתונות + בר מצווה',
    contentStyle: 'לפני/אחרי, מאחורי הקלעים',
    mainMessages: 'שירותיות, מחיר הוגן, ניסיון',
    strengths: 'אותנטי, מראה עבודה אמיתית',
    weaknesses: 'אין מיצוב ברור, נראה זול',
    positioningGaps: 'לא מדבר על קריאת קהל או הובלת אנרגיה',
  },
];

// Manus ימלא את הנתונים האמיתיים מ-Meta/Instagram
// תגיד ל-Manus:
// "חקור 20 DJs מובילים לחתונות בישראל באינסטגרם.
//  לכל אחד תן: שם, אינסטגרם, התמחות, סגנון תוכן,
//  מסרים מרכזיים, חוזקות, חולשות, פערי מיצוב.
//  שמור כ-JSON בפורמט של CompetitorData."
