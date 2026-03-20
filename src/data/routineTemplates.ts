import type { Routine } from '../types';

export const ROUTINE_TEMPLATES: Routine[] = [
  // ========== MORNING ROUTINES (שגרות בוקר) ==========
  {
    id: 'tpl-m1', name: 'שגרת בוקר מנצחת', type: 'morning', emoji: '🌅', isTemplate: true, createdAt: '',
    steps: [
      { id: 'm1s1', title: 'שתה כוס מים', emoji: '💧', duration: '1 דקה' },
      { id: 'm1s2', title: '5 נשימות עמוקות', emoji: '🧘', duration: '2 דקות' },
      { id: 'm1s3', title: 'כתוב 3 דברים שאתה אסיר תודה עליהם', emoji: '🙏', duration: '3 דקות' },
      { id: 'm1s4', title: 'מתיחות קלות', emoji: '🤸', duration: '5 דקות' },
      { id: 'm1s5', title: 'הגדר כוונה ליום', emoji: '🎯', duration: '2 דקות' },
      { id: 'm1s6', title: 'ארוחת בוקר בריאה', emoji: '🥣', duration: '15 דקות' },
    ],
  },
  {
    id: 'tpl-m2', name: 'בוקר מהיר ואנרגטי', type: 'morning', emoji: '⚡', isTemplate: true, createdAt: '',
    steps: [
      { id: 'm2s1', title: 'שטוף פנים במים קרים', emoji: '🧊', duration: '1 דקה' },
      { id: 'm2s2', title: '10 כפיפות בטן / סקוואטים', emoji: '💪', duration: '2 דקות' },
      { id: 'm2s3', title: 'משפט מוטיבציה - אמור בקול', emoji: '🗣️', duration: '30 שניות' },
      { id: 'm2s4', title: 'תכנן את 3 המשימות החשובות ביותר', emoji: '📋', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-m3', name: 'בוקר רגוע ומיינדפול', type: 'morning', emoji: '🧘', isTemplate: true, createdAt: '',
    steps: [
      { id: 'm3s1', title: 'שב בשקט 2 דקות - רק תנשום', emoji: '🌬️', duration: '2 דקות' },
      { id: 'm3s2', title: 'תה חם בשקט מוחלט', emoji: '🍵', duration: '10 דקות' },
      { id: 'm3s3', title: 'כתוב זרימת מחשבות - מה שעולה', emoji: '📝', duration: '5 דקות' },
      { id: 'm3s4', title: 'מתיחת יוגה קלה', emoji: '🧘', duration: '10 דקות' },
      { id: 'm3s5', title: 'הגדר כוונה רכה ליום', emoji: '🌸', duration: '1 דקה' },
    ],
  },
  {
    id: 'tpl-m4', name: 'בוקר של יום קשה', type: 'morning', emoji: '🌧️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'm4s1', title: 'תגיד לעצמך: "היום יהיה בסדר"', emoji: '💛', duration: '30 שניות' },
      { id: 'm4s2', title: 'שתה מים חמים עם לימון', emoji: '🍋', duration: '3 דקות' },
      { id: 'm4s3', title: 'תנועה עדינה - הליכה במקום', emoji: '🚶', duration: '3 דקות' },
      { id: 'm4s4', title: 'בחר דבר אחד קטן שתעשה היום', emoji: '✅', duration: '1 דקה' },
      { id: 'm4s5', title: 'שלח הודעה למישהו שאוהב אותך', emoji: '💌', duration: '2 דקות' },
    ],
  },
  {
    id: 'tpl-m5', name: 'בוקר פרודוקטיבי', type: 'morning', emoji: '🚀', isTemplate: true, createdAt: '',
    steps: [
      { id: 'm5s1', title: 'מקלחת קרה 30 שניות', emoji: '🚿', duration: '1 דקה' },
      { id: 'm5s2', title: 'ארוחת בוקר עשירה בחלבון', emoji: '🥚', duration: '10 דקות' },
      { id: 'm5s3', title: 'סקירת יומן ומשימות', emoji: '📋', duration: '5 דקות' },
      { id: 'm5s4', title: 'בלוק פוקוס ראשון - 25 דקות', emoji: '⏱️', duration: '25 דקות' },
      { id: 'm5s5', title: 'הפסקה קצרה - 5 דקות אוויר', emoji: '🌳', duration: '5 דקות' },
    ],
  },
  {
    id: 'tpl-m6', name: 'בוקר סוף שבוע', type: 'morning', emoji: '☀️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'm6s1', title: 'קום בלי שעון מעורר', emoji: '😴', duration: '' },
      { id: 'm6s2', title: 'מתיחות ארוכות בהנאה', emoji: '🤸', duration: '10 דקות' },
      { id: 'm6s3', title: 'ארוחת בוקר מפנקת', emoji: '🥞', duration: '20 דקות' },
      { id: 'm6s4', title: 'תכנן פעילות מהנה אחת להיום', emoji: '🎯', duration: '5 דקות' },
      { id: 'm6s5', title: 'התקשר לחבר או בן משפחה', emoji: '📞', duration: '10 דקות' },
    ],
  },

  // ========== NIGHT ROUTINES (שגרות לילה) ==========
  {
    id: 'tpl-n1', name: 'שגרת לילה מרגיעה', type: 'night', emoji: '🌙', isTemplate: true, createdAt: '',
    steps: [
      { id: 'n1s1', title: 'כבה מסכים 30 דקות לפני השינה', emoji: '📵', duration: '30 דקות' },
      { id: 'n1s2', title: 'כתוב מה הלך טוב היום', emoji: '📝', duration: '3 דקות' },
      { id: 'n1s3', title: 'הכן בגדים למחר', emoji: '👕', duration: '3 דקות' },
      { id: 'n1s4', title: 'תרגיל נשימה 4-7-8', emoji: '😮‍💨', duration: '3 דקות' },
      { id: 'n1s5', title: 'קרא 10 דקות', emoji: '📖', duration: '10 דקות' },
      { id: 'n1s6', title: 'סלח לעצמך על היום - היית מספיק טוב', emoji: '💛', duration: '1 דקה' },
    ],
  },
  {
    id: 'tpl-n2', name: 'לילה של שחרור', type: 'night', emoji: '🕯️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'n2s1', title: 'אמבטיה או מקלחת חמה', emoji: '🛁', duration: '15 דקות' },
      { id: 'n2s2', title: 'כתוב מה מעיק עליך - שחרר לדף', emoji: '📝', duration: '5 דקות' },
      { id: 'n2s3', title: 'מדיטציית סריקת גוף', emoji: '🧘', duration: '10 דקות' },
      { id: 'n2s4', title: 'תה צמחים', emoji: '🍵', duration: '5 דקות' },
      { id: 'n2s5', title: 'מוזיקה רגועה', emoji: '🎵', duration: '10 דקות' },
    ],
  },
  {
    id: 'tpl-n3', name: 'לילה של סיכום', type: 'night', emoji: '📊', isTemplate: true, createdAt: '',
    steps: [
      { id: 'n3s1', title: 'סכם את היום ב-3 משפטים', emoji: '📝', duration: '3 דקות' },
      { id: 'n3s2', title: 'מה למדתי היום?', emoji: '💡', duration: '2 דקות' },
      { id: 'n3s3', title: 'תכנן את המשימה הראשונה של מחר', emoji: '📋', duration: '2 דקות' },
      { id: 'n3s4', title: 'הודה על דבר אחד', emoji: '🙏', duration: '1 דקה' },
      { id: 'n3s5', title: 'שים טלפון במצב טיסה', emoji: '✈️', duration: '30 שניות' },
    ],
  },
  {
    id: 'tpl-n4', name: 'לילה אחרי יום קשה', type: 'night', emoji: '🫂', isTemplate: true, createdAt: '',
    steps: [
      { id: 'n4s1', title: 'תגיד: "עשיתי את המיטב שלי היום"', emoji: '💛', duration: '30 שניות' },
      { id: 'n4s2', title: 'כתוב 3 דברים שכן הצלחת', emoji: '✅', duration: '3 דקות' },
      { id: 'n4s3', title: 'חיבוק עצמי - חבק את עצמך 20 שניות', emoji: '🫂', duration: '1 דקה' },
      { id: 'n4s4', title: 'שמע שיר שאוהב', emoji: '🎧', duration: '4 דקות' },
      { id: 'n4s5', title: 'נשימות עמוקות עד שנרדם', emoji: '🌬️', duration: '5 דקות' },
    ],
  },

  // ========== CRISIS ROUTINES (תוכניות חירום) ==========
  {
    id: 'tpl-c1', name: 'תוכנית חירום - דחף פוגע', type: 'crisis', emoji: '🆘', isTemplate: true, createdAt: '',
    steps: [
      { id: 'c1s1', title: 'עצור. נשום. 5 נשימות עמוקות', emoji: '🛑', duration: '1 דקה' },
      { id: 'c1s2', title: 'שתה כוס מים קרים', emoji: '💧', duration: '1 דקה' },
      { id: 'c1s3', title: 'ספר לעצמך למה התחלת את המסע', emoji: '💭', duration: '2 דקות' },
      { id: 'c1s4', title: 'צא להליכה קצרה - אפילו 5 דקות', emoji: '🚶', duration: '5 דקות' },
      { id: 'c1s5', title: 'התקשר למישהו שאתה סומך עליו', emoji: '📞', duration: '5 דקות' },
      { id: 'c1s6', title: 'פתח את גלריית החיזוקים', emoji: '🛡️', duration: '3 דקות' },
      { id: 'c1s7', title: 'כתוב מה אתה מרגיש - זה יעבור', emoji: '✍️', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-c2', name: 'דחף חזק - 5 דקות הצלה', type: 'crisis', emoji: '⏰', isTemplate: true, createdAt: '',
    steps: [
      { id: 'c2s1', title: 'ספור לאחור מ-10', emoji: '🔢', duration: '15 שניות' },
      { id: 'c2s2', title: 'שפוך מים קרים על הפנים', emoji: '🧊', duration: '30 שניות' },
      { id: 'c2s3', title: '20 קפיצות במקום', emoji: '🦘', duration: '1 דקה' },
      { id: 'c2s4', title: 'תגיד בקול: "אני חזק יותר מהדחף"', emoji: '🗣️', duration: '15 שניות' },
      { id: 'c2s5', title: 'חכה 3 דקות - הדחף יחלוף', emoji: '⏳', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-c3', name: 'התקף חרדה - הארקה', type: 'crisis', emoji: '🌍', isTemplate: true, createdAt: '',
    steps: [
      { id: 'c3s1', title: '5 דברים שאתה רואה', emoji: '👀', duration: '1 דקה' },
      { id: 'c3s2', title: '4 דברים שאתה נוגע', emoji: '✋', duration: '1 דקה' },
      { id: 'c3s3', title: '3 דברים שאתה שומע', emoji: '👂', duration: '1 דקה' },
      { id: 'c3s4', title: '2 דברים שאתה מריח', emoji: '👃', duration: '30 שניות' },
      { id: 'c3s5', title: 'דבר אחד שאתה טועם', emoji: '👅', duration: '30 שניות' },
      { id: 'c3s6', title: 'נשימה מרגיעה 4-4-4', emoji: '🌬️', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-c4', name: 'רגע של כעס - הרגעה', type: 'crisis', emoji: '🌋', isTemplate: true, createdAt: '',
    steps: [
      { id: 'c4s1', title: 'עצור - אל תגיב עכשיו', emoji: '🛑', duration: '30 שניות' },
      { id: 'c4s2', title: 'נשום 10 נשימות ארוכות', emoji: '🌬️', duration: '2 דקות' },
      { id: 'c4s3', title: 'סחוט כדור לחץ או מגבת', emoji: '✊', duration: '1 דקה' },
      { id: 'c4s4', title: 'צא מהחדר לדקה', emoji: '🚪', duration: '1 דקה' },
      { id: 'c4s5', title: 'שאל: "מה באמת כואב לי כאן?"', emoji: '💭', duration: '2 דקות' },
      { id: 'c4s6', title: 'כתוב מה הרגשת - אל תשלח', emoji: '📝', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-c5', name: 'נפילה קרתה - מה עכשיו', type: 'crisis', emoji: '🔄', isTemplate: true, createdAt: '',
    steps: [
      { id: 'c5s1', title: 'נשום. זה בסדר. אתה בן אדם', emoji: '💛', duration: '1 דקה' },
      { id: 'c5s2', title: 'כתוב מה הוביל לזה', emoji: '📝', duration: '3 דקות' },
      { id: 'c5s3', title: 'תזכור: נפילה אחת לא מוחקת התקדמות', emoji: '💪', duration: '1 דקה' },
      { id: 'c5s4', title: 'שתה מים, אכול משהו בריא', emoji: '💧', duration: '5 דקות' },
      { id: 'c5s5', title: 'הגדר את הצעד הבא שלך', emoji: '🎯', duration: '2 דקות' },
      { id: 'c5s6', title: 'שלח לעצמך הודעת חיזוק', emoji: '💌', duration: '1 דקה' },
    ],
  },
  {
    id: 'tpl-c6', name: 'שעמום מסוכן - הסחת דעת', type: 'crisis', emoji: '🎯', isTemplate: true, createdAt: '',
    steps: [
      { id: 'c6s1', title: 'קום מהמקום שאתה יושב', emoji: '🧍', duration: '10 שניות' },
      { id: 'c6s2', title: 'שטוף כלים או סדר משהו', emoji: '🧹', duration: '5 דקות' },
      { id: 'c6s3', title: 'שלח הודעה מצחיקה לחבר', emoji: '😂', duration: '2 דקות' },
      { id: 'c6s4', title: 'עשה 10 שכיבות סמיכה', emoji: '💪', duration: '1 דקה' },
      { id: 'c6s5', title: 'שים שיר אנרגטי ורקוד', emoji: '💃', duration: '4 דקות' },
    ],
  },

  // ========== MOTIVATION (מוטיבציה) ==========
  {
    id: 'tpl-mv1', name: 'בוסט מוטיבציה', type: 'motivation', emoji: '🔥', isTemplate: true, createdAt: '',
    steps: [
      { id: 'mv1s1', title: 'קרא את הסיבות שלך לגמילה', emoji: '📜', duration: '2 דקות' },
      { id: 'mv1s2', title: 'תסתכל כמה זמן כבר עברת', emoji: '⏱️', duration: '1 דקה' },
      { id: 'mv1s3', title: 'הקשב לשיר שנותן לך כוח', emoji: '🎵', duration: '4 דקות' },
      { id: 'mv1s4', title: 'עשה 20 קפיצות במקום', emoji: '🦘', duration: '1 דקה' },
      { id: 'mv1s5', title: 'כתוב ניצחון אחד קטן מהיום', emoji: '🏆', duration: '2 דקות' },
    ],
  },
  {
    id: 'tpl-mv2', name: 'חזרה למסלול', type: 'motivation', emoji: '🧭', isTemplate: true, createdAt: '',
    steps: [
      { id: 'mv2s1', title: 'קרא מחדש את ה"למה" שלך', emoji: '❓', duration: '2 דקות' },
      { id: 'mv2s2', title: 'דמיין את עצמך בעוד שנה - חופשי', emoji: '🔮', duration: '3 דקות' },
      { id: 'mv2s3', title: 'כתוב 5 דברים שהשתפרו מאז שהתחלת', emoji: '📈', duration: '3 דקות' },
      { id: 'mv2s4', title: 'הגדר יעד קטן לשבוע הקרוב', emoji: '🎯', duration: '2 דקות' },
      { id: 'mv2s5', title: 'שתף מישהו בהתקדמות שלך', emoji: '📱', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-mv3', name: 'חגיגת הצלחה קטנה', type: 'motivation', emoji: '🎉', isTemplate: true, createdAt: '',
    steps: [
      { id: 'mv3s1', title: 'רשום את ההישג שלך', emoji: '🏆', duration: '1 דקה' },
      { id: 'mv3s2', title: 'תן לעצמך מחמאה בקול', emoji: '🗣️', duration: '30 שניות' },
      { id: 'mv3s3', title: 'פנק את עצמך במשהו בריא', emoji: '🎁', duration: '5 דקות' },
      { id: 'mv3s4', title: 'שתף את ההצלחה עם חבר', emoji: '💬', duration: '3 דקות' },
      { id: 'mv3s5', title: 'הגדר את האתגר הבא', emoji: '🏔️', duration: '2 דקות' },
    ],
  },
  {
    id: 'tpl-mv4', name: 'כשהמוטיבציה נעלמת', type: 'motivation', emoji: '🕳️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'mv4s1', title: 'קבל את זה - זה נורמלי', emoji: '🤷', duration: '30 שניות' },
      { id: 'mv4s2', title: 'עשה את הדבר הכי קטן שאפשר', emoji: '🐜', duration: '2 דקות' },
      { id: 'mv4s3', title: 'תזכור את הרגע הכי גאה שלך', emoji: '⭐', duration: '2 דקות' },
      { id: 'mv4s4', title: 'שים טיימר ל-10 דקות - רק 10', emoji: '⏰', duration: '10 דקות' },
      { id: 'mv4s5', title: 'תגמל את עצמך אחרי ש-10 הדקות עברו', emoji: '🎁', duration: '5 דקות' },
    ],
  },

  // ========== ENERGY (אנרגיה) ==========
  {
    id: 'tpl-e1', name: 'טעינת אנרגיה מהירה', type: 'energy', emoji: '⚡', isTemplate: true, createdAt: '',
    steps: [
      { id: 'e1s1', title: 'קום ונער את הגוף', emoji: '🕺', duration: '30 שניות' },
      { id: 'e1s2', title: '30 קפיצות ג\'ק', emoji: '🦘', duration: '1 דקה' },
      { id: 'e1s3', title: 'שתה כוס מים קרים', emoji: '💧', duration: '30 שניות' },
      { id: 'e1s4', title: 'שיר אנרגטי בפול ווליום', emoji: '🔊', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-e2', name: 'אנרגיה לאחר הצהריים', type: 'energy', emoji: '☕', isTemplate: true, createdAt: '',
    steps: [
      { id: 'e2s1', title: 'צא לאוויר צח ל-5 דקות', emoji: '🌳', duration: '5 דקות' },
      { id: 'e2s2', title: 'אכול חטיף בריא', emoji: '🍎', duration: '5 דקות' },
      { id: 'e2s3', title: '10 מתיחות לגב ולצוואר', emoji: '🤸', duration: '3 דקות' },
      { id: 'e2s4', title: 'שטוף פנים במים קרים', emoji: '🧊', duration: '1 דקה' },
      { id: 'e2s5', title: 'הליכה מהירה 5 דקות', emoji: '🚶‍♂️', duration: '5 דקות' },
    ],
  },
  {
    id: 'tpl-e3', name: 'אימון בוקר 15 דקות', type: 'energy', emoji: '🏋️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'e3s1', title: 'חימום - ריצה במקום', emoji: '🏃', duration: '2 דקות' },
      { id: 'e3s2', title: '15 סקוואטים', emoji: '🦵', duration: '2 דקות' },
      { id: 'e3s3', title: '10 שכיבות סמיכה', emoji: '💪', duration: '2 דקות' },
      { id: 'e3s4', title: 'פלאנק 30 שניות', emoji: '🧱', duration: '1 דקה' },
      { id: 'e3s5', title: '15 כפיפות בטן', emoji: '🔥', duration: '2 דקות' },
      { id: 'e3s6', title: 'קפיצות ג\'ק 1 דקה', emoji: '🦘', duration: '1 דקה' },
      { id: 'e3s7', title: 'מתיחות וקירור', emoji: '🧘', duration: '5 דקות' },
    ],
  },
  {
    id: 'tpl-e4', name: 'יום עם אנרגיה נמוכה', type: 'energy', emoji: '🪫', isTemplate: true, createdAt: '',
    steps: [
      { id: 'e4s1', title: 'שתה 2 כוסות מים', emoji: '💧', duration: '2 דקות' },
      { id: 'e4s2', title: 'צא לשמש ל-10 דקות', emoji: '☀️', duration: '10 דקות' },
      { id: 'e4s3', title: 'מתיחות עדינות', emoji: '🤸', duration: '5 דקות' },
      { id: 'e4s4', title: 'אכול ארוחה מזינה', emoji: '🥗', duration: '15 דקות' },
      { id: 'e4s5', title: 'נמנום קצר - מקסימום 20 דקות', emoji: '😴', duration: '20 דקות' },
    ],
  },

  // ========== CALM (הרגעה) ==========
  {
    id: 'tpl-cl1', name: 'הרגעה ב-5 דקות', type: 'calm', emoji: '🌊', isTemplate: true, createdAt: '',
    steps: [
      { id: 'cl1s1', title: 'שב נוח וכוף עיניים', emoji: '😌', duration: '30 שניות' },
      { id: 'cl1s2', title: 'נשימה 4-7-8 (שאיפה-עצירה-נשיפה)', emoji: '🌬️', duration: '2 דקות' },
      { id: 'cl1s3', title: 'סרוק את הגוף - שחרר מתחים', emoji: '🧘', duration: '2 דקות' },
      { id: 'cl1s4', title: 'חייך - גם אם לא בא לך', emoji: '😊', duration: '30 שניות' },
    ],
  },
  {
    id: 'tpl-cl2', name: 'מדיטציה מודרכת', type: 'calm', emoji: '🧘', isTemplate: true, createdAt: '',
    steps: [
      { id: 'cl2s1', title: 'מצא מקום שקט ונוח', emoji: '🪑', duration: '1 דקה' },
      { id: 'cl2s2', title: 'התמקד בנשימה - 3 דקות', emoji: '🌬️', duration: '3 דקות' },
      { id: 'cl2s3', title: 'סריקת גוף מהרגליים לראש', emoji: '🦶', duration: '5 דקות' },
      { id: 'cl2s4', title: 'דמיין מקום שמרגיע אותך', emoji: '🏝️', duration: '3 דקות' },
      { id: 'cl2s5', title: 'חזור לאט לחדר', emoji: '🌅', duration: '2 דקות' },
    ],
  },
  {
    id: 'tpl-cl3', name: 'הפסקת שקט', type: 'calm', emoji: '🤫', isTemplate: true, createdAt: '',
    steps: [
      { id: 'cl3s1', title: 'סגור את כל המסכים', emoji: '📵', duration: '30 שניות' },
      { id: 'cl3s2', title: 'שב בשקט מוחלט - 3 דקות', emoji: '🤫', duration: '3 דקות' },
      { id: 'cl3s3', title: 'שתה תה לאט, טעם כל לגימה', emoji: '🍵', duration: '5 דקות' },
      { id: 'cl3s4', title: 'הסתכל מהחלון - שים לב לפרטים', emoji: '🪟', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-cl4', name: 'לפני שינה - שחרור דאגות', type: 'calm', emoji: '☁️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'cl4s1', title: 'כתוב את כל הדאגות על דף', emoji: '📝', duration: '5 דקות' },
      { id: 'cl4s2', title: 'ליד כל דאגה כתוב: "מחר"', emoji: '📅', duration: '2 דקות' },
      { id: 'cl4s3', title: 'סגור את המחברת - סגרת את היום', emoji: '📕', duration: '30 שניות' },
      { id: 'cl4s4', title: 'מתיחות רצפה עדינות', emoji: '🧘', duration: '5 דקות' },
      { id: 'cl4s5', title: 'נשימות איטיות - 4 שניות שאיפה, 6 נשיפה', emoji: '🌙', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-cl5', name: 'ניהול לחץ', type: 'calm', emoji: '🎈', isTemplate: true, createdAt: '',
    steps: [
      { id: 'cl5s1', title: 'זהה מה מלחיץ אותך - שם את זה', emoji: '🏷️', duration: '1 דקה' },
      { id: 'cl5s2', title: 'על סקאלה 1-10 כמה חזק?', emoji: '📊', duration: '30 שניות' },
      { id: 'cl5s3', title: '10 נשימות סרעפתיות', emoji: '🌬️', duration: '2 דקות' },
      { id: 'cl5s4', title: 'מתח ושחרר כל קבוצת שרירים', emoji: '💪', duration: '5 דקות' },
      { id: 'cl5s5', title: 'שאל: "מה בשליטתי?"', emoji: '🎯', duration: '2 דקות' },
      { id: 'cl5s6', title: 'עשה דבר אחד קטן שבשליטתך', emoji: '✅', duration: '5 דקות' },
    ],
  },

  // ========== FOCUS (פוקוס) ==========
  {
    id: 'tpl-f1', name: 'כניסה לפוקוס עמוק', type: 'focus', emoji: '🎯', isTemplate: true, createdAt: '',
    steps: [
      { id: 'f1s1', title: 'סגור כל הטאבים חוץ מהנחוץ', emoji: '🖥️', duration: '1 דקה' },
      { id: 'f1s2', title: 'טלפון על שקט בחדר אחר', emoji: '📵', duration: '30 שניות' },
      { id: 'f1s3', title: 'כתוב את המשימה הספציפית', emoji: '📝', duration: '1 דקה' },
      { id: 'f1s4', title: '3 נשימות עמוקות', emoji: '🌬️', duration: '1 דקה' },
      { id: 'f1s5', title: 'שים טיימר ל-25 דקות - פומודורו', emoji: '🍅', duration: '25 דקות' },
      { id: 'f1s6', title: 'הפסקה 5 דקות - קום, שתה, נשום', emoji: '☕', duration: '5 דקות' },
    ],
  },
  {
    id: 'tpl-f2', name: 'לימודים - סשן אפקטיבי', type: 'focus', emoji: '📚', isTemplate: true, createdAt: '',
    steps: [
      { id: 'f2s1', title: 'הכן את כל החומרים מראש', emoji: '📋', duration: '3 דקות' },
      { id: 'f2s2', title: 'כתוב "מה אני רוצה ללמוד עכשיו"', emoji: '🎯', duration: '1 דקה' },
      { id: 'f2s3', title: 'סשן 1 - 25 דקות', emoji: '📖', duration: '25 דקות' },
      { id: 'f2s4', title: 'הפסקה - 5 דקות תנועה', emoji: '🚶', duration: '5 דקות' },
      { id: 'f2s5', title: 'סשן 2 - 25 דקות', emoji: '📖', duration: '25 דקות' },
      { id: 'f2s6', title: 'סכם ב-3 נקודות מה למדת', emoji: '✍️', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-f3', name: 'ריסט מנטלי - 10 דקות', type: 'focus', emoji: '🔄', isTemplate: true, createdAt: '',
    steps: [
      { id: 'f3s1', title: 'עצור את מה שאתה עושה', emoji: '⏸️', duration: '10 שניות' },
      { id: 'f3s2', title: 'קום ומתח את הגוף', emoji: '🤸', duration: '2 דקות' },
      { id: 'f3s3', title: 'שטוף פנים', emoji: '💦', duration: '1 דקה' },
      { id: 'f3s4', title: 'הסתכל לרחוק 20 שניות (עיניים)', emoji: '👀', duration: '30 שניות' },
      { id: 'f3s5', title: 'כתוב את הדבר הבא שצריך לעשות', emoji: '📝', duration: '1 דקה' },
      { id: 'f3s6', title: 'חזור למשימה עם אנרגיה חדשה', emoji: '🚀', duration: '30 שניות' },
    ],
  },

  // ========== SOCIAL (חיבור חברתי) ==========
  {
    id: 'tpl-s1', name: 'יציאה מבידוד', type: 'social', emoji: '🤝', isTemplate: true, createdAt: '',
    steps: [
      { id: 's1s1', title: 'שלח הודעה ל-3 אנשים שחשובים לך', emoji: '💬', duration: '5 דקות' },
      { id: 's1s2', title: 'התקשר לאחד מהם', emoji: '📞', duration: '10 דקות' },
      { id: 's1s3', title: 'קבע מפגש לשבוע הקרוב', emoji: '📅', duration: '3 דקות' },
      { id: 's1s4', title: 'צא מהבית - אפילו לחנות', emoji: '🚶', duration: '15 דקות' },
    ],
  },
  {
    id: 'tpl-s2', name: 'חיזוק מערכת יחסים', type: 'social', emoji: '❤️', isTemplate: true, createdAt: '',
    steps: [
      { id: 's2s1', title: 'שלח מחמאה כנה למישהו', emoji: '💌', duration: '2 דקות' },
      { id: 's2s2', title: 'הקשב למישהו - באמת הקשב', emoji: '👂', duration: '10 דקות' },
      { id: 's2s3', title: 'שאל "מה שלומך?" ותחכה לתשובה', emoji: '🤗', duration: '5 דקות' },
      { id: 's2s4', title: 'עשה טובה קטנה למישהו', emoji: '🎁', duration: '10 דקות' },
    ],
  },
  {
    id: 'tpl-s3', name: 'כשמרגישים בודדים', type: 'social', emoji: '🫂', isTemplate: true, createdAt: '',
    steps: [
      { id: 's3s1', title: 'תדע - הרגשת בדידות היא זמנית', emoji: '💛', duration: '30 שניות' },
      { id: 's3s2', title: 'כתוב 3 אנשים שאוהבים אותך', emoji: '📝', duration: '1 דקה' },
      { id: 's3s3', title: 'שלח הודעה לאחד מהם', emoji: '📱', duration: '2 דקות' },
      { id: 's3s4', title: 'צא להליכה במקום ציבורי', emoji: '🚶', duration: '15 דקות' },
      { id: 's3s5', title: 'חייך למישהו זר', emoji: '😊', duration: '10 שניות' },
      { id: 's3s6', title: 'כתוב מכתב לעצמך העתידי', emoji: '✉️', duration: '5 דקות' },
    ],
  },

  // ========== GROWTH (צמיחה אישית) ==========
  {
    id: 'tpl-g1', name: 'סיכום שבועי', type: 'growth', emoji: '📊', isTemplate: true, createdAt: '',
    steps: [
      { id: 'g1s1', title: 'מה היה הרגע הטוב ביותר השבוע?', emoji: '⭐', duration: '2 דקות' },
      { id: 'g1s2', title: 'מה היה הרגע הקשה ביותר?', emoji: '🌧️', duration: '2 דקות' },
      { id: 'g1s3', title: 'מה למדתי על עצמי?', emoji: '💡', duration: '3 דקות' },
      { id: 'g1s4', title: 'מה אני רוצה לשפר בשבוע הבא?', emoji: '📈', duration: '2 דקות' },
      { id: 'g1s5', title: 'הגדר 3 מטרות קטנות לשבוע הבא', emoji: '🎯', duration: '3 דקות' },
      { id: 'g1s6', title: 'תן לעצמך ציון מ-1 עד 10', emoji: '🏅', duration: '1 דקה' },
    ],
  },
  {
    id: 'tpl-g2', name: 'יומן הכרת תודה', type: 'growth', emoji: '🙏', isTemplate: true, createdAt: '',
    steps: [
      { id: 'g2s1', title: '3 דברים שאני אסיר תודה עליהם', emoji: '🙏', duration: '3 דקות' },
      { id: 'g2s2', title: 'אדם אחד שהשפיע עליי לטובה', emoji: '👤', duration: '2 דקות' },
      { id: 'g2s3', title: 'דבר אחד בגוף שלי שאני מעריך', emoji: '💪', duration: '1 דקה' },
      { id: 'g2s4', title: 'הזדמנות שקיבלתי היום', emoji: '🌟', duration: '1 דקה' },
      { id: 'g2s5', title: 'שלח תודה למישהו', emoji: '💌', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-g3', name: 'זיהוי דפוסים', type: 'growth', emoji: '🔍', isTemplate: true, createdAt: '',
    steps: [
      { id: 'g3s1', title: 'מתי נפלתי הכי הרבה השבוע?', emoji: '⏰', duration: '2 דקות' },
      { id: 'g3s2', title: 'מה היה הטריגר המרכזי?', emoji: '🎯', duration: '2 דקות' },
      { id: 'g3s3', title: 'מה עזר לי להתגבר?', emoji: '🛡️', duration: '2 דקות' },
      { id: 'g3s4', title: 'איזה שעות בוקר/צהריים/ערב היו הכי קשות?', emoji: '📊', duration: '2 דקות' },
      { id: 'g3s5', title: 'תכנן אסטרטגיה אחת חדשה לשבוע הבא', emoji: '🧠', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-g4', name: 'הגדרת מטרות', type: 'growth', emoji: '🏔️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'g4s1', title: 'מה אני רוצה להשיג בחודש הקרוב?', emoji: '📅', duration: '3 דקות' },
      { id: 'g4s2', title: 'למה זה חשוב לי?', emoji: '❤️', duration: '2 דקות' },
      { id: 'g4s3', title: 'מה הצעד הראשון הכי קטן?', emoji: '👣', duration: '2 דקות' },
      { id: 'g4s4', title: 'מה יכול לעצור אותי? איך אתמודד?', emoji: '🧱', duration: '3 דקות' },
      { id: 'g4s5', title: 'מי יכול לעזור לי?', emoji: '🤝', duration: '2 דקות' },
      { id: 'g4s6', title: 'כתוב התחייבות לעצמך', emoji: '✍️', duration: '2 דקות' },
    ],
  },
  {
    id: 'tpl-g5', name: 'טיפוח ביטחון עצמי', type: 'growth', emoji: '👑', isTemplate: true, createdAt: '',
    steps: [
      { id: 'g5s1', title: 'כתוב 5 דברים טובים על עצמך', emoji: '⭐', duration: '3 דקות' },
      { id: 'g5s2', title: 'תזכור הצלחה מהעבר - חווה אותה מחדש', emoji: '🏆', duration: '3 דקות' },
      { id: 'g5s3', title: 'עמוד ישר, כתפיים לאחור, חייך', emoji: '🧍', duration: '1 דקה' },
      { id: 'g5s4', title: 'אמור: "אני ראוי לחיים טובים"', emoji: '🗣️', duration: '30 שניות' },
      { id: 'g5s5', title: 'עשה דבר אחד שמפחיד אותך קצת', emoji: '🦁', duration: '10 דקות' },
    ],
  },
  {
    id: 'tpl-g6', name: 'מכתב לעצמי', type: 'growth', emoji: '✉️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'g6s1', title: 'כתוב מכתב לעצמך לפני חודש', emoji: '📝', duration: '5 דקות' },
      { id: 'g6s2', title: 'מה היית רוצה לספר לו?', emoji: '💬', duration: '5 דקות' },
      { id: 'g6s3', title: 'כתוב מכתב לעצמך בעוד חודש', emoji: '🔮', duration: '5 דקות' },
      { id: 'g6s4', title: 'מה אתה מאחל לעצמך?', emoji: '🌟', duration: '3 דקות' },
    ],
  },

  // ========== BODY (גוף) ==========
  {
    id: 'tpl-b1', name: 'יוגה בוקר 10 דקות', type: 'body', emoji: '🧘', isTemplate: true, createdAt: '',
    steps: [
      { id: 'b1s1', title: 'תנוחת ילד - נשימות', emoji: '🧒', duration: '1 דקה' },
      { id: 'b1s2', title: 'חתול-פרה (cat-cow)', emoji: '🐱', duration: '1 דקה' },
      { id: 'b1s3', title: 'כלב מביט למטה', emoji: '🐕', duration: '1 דקה' },
      { id: 'b1s4', title: 'לוחם 1 (שני הצדדים)', emoji: '⚔️', duration: '2 דקות' },
      { id: 'b1s5', title: 'עץ (שני הצדדים)', emoji: '🌳', duration: '2 דקות' },
      { id: 'b1s6', title: 'שאוואסנה - מנוחה', emoji: '😌', duration: '3 דקות' },
    ],
  },
  {
    id: 'tpl-b2', name: 'הליכה מודעת', type: 'body', emoji: '🚶', isTemplate: true, createdAt: '',
    steps: [
      { id: 'b2s1', title: 'צא מהבית', emoji: '🚪', duration: '1 דקה' },
      { id: 'b2s2', title: 'לך 5 דקות - שים לב לצעדים', emoji: '👣', duration: '5 דקות' },
      { id: 'b2s3', title: 'עצור - הסתכל סביב, מה יפה?', emoji: '🌸', duration: '2 דקות' },
      { id: 'b2s4', title: 'לך עוד 5 דקות - הקשב לצלילים', emoji: '👂', duration: '5 דקות' },
      { id: 'b2s5', title: 'עצור - נשום 3 נשימות עמוקות', emoji: '🌬️', duration: '1 דקה' },
      { id: 'b2s6', title: 'חזור הביתה - שים לב מה השתנה בתחושה', emoji: '🏠', duration: '5 דקות' },
    ],
  },
  {
    id: 'tpl-b3', name: 'מתיחות למשרד / מחשב', type: 'body', emoji: '💻', isTemplate: true, createdAt: '',
    steps: [
      { id: 'b3s1', title: 'סיבובי צוואר - 10 לכל כיוון', emoji: '🔄', duration: '1 דקה' },
      { id: 'b3s2', title: 'הרמת כתפיים לאוזניים ושחרור', emoji: '🤷', duration: '1 דקה' },
      { id: 'b3s3', title: 'מתיחת חזה - ידיים מאחורי הגב', emoji: '🙌', duration: '1 דקה' },
      { id: 'b3s4', title: 'סיבוב פלג גוף עליון', emoji: '🔄', duration: '1 דקה' },
      { id: 'b3s5', title: 'מתיחת שורש כף יד', emoji: '✋', duration: '1 דקה' },
      { id: 'b3s6', title: 'עמידה ומתיחת רגליים', emoji: '🦵', duration: '2 דקות' },
    ],
  },
  {
    id: 'tpl-b4', name: 'תזונה מודעת', type: 'body', emoji: '🥗', isTemplate: true, createdAt: '',
    steps: [
      { id: 'b4s1', title: 'שתה כוס מים לפני הארוחה', emoji: '💧', duration: '1 דקה' },
      { id: 'b4s2', title: 'שים לב לצלחת - צבעים, ריחות', emoji: '👀', duration: '1 דקה' },
      { id: 'b4s3', title: 'אכול לאט - לעוס 20 פעמים', emoji: '🍽️', duration: '15 דקות' },
      { id: 'b4s4', title: 'עצור באמצע - עדיין רעב?', emoji: '🤔', duration: '1 דקה' },
      { id: 'b4s5', title: 'הודה על האוכל', emoji: '🙏', duration: '30 שניות' },
    ],
  },
  {
    id: 'tpl-b5', name: 'ריצה ראשונה / חזרה לריצה', type: 'body', emoji: '🏃', isTemplate: true, createdAt: '',
    steps: [
      { id: 'b5s1', title: 'חימום - הליכה מהירה', emoji: '🚶‍♂️', duration: '5 דקות' },
      { id: 'b5s2', title: 'ריצה קלה 2 דקות', emoji: '🏃', duration: '2 דקות' },
      { id: 'b5s3', title: 'הליכה 1 דקה', emoji: '🚶', duration: '1 דקה' },
      { id: 'b5s4', title: 'ריצה קלה 2 דקות', emoji: '🏃', duration: '2 דקות' },
      { id: 'b5s5', title: 'הליכה 1 דקה', emoji: '🚶', duration: '1 דקה' },
      { id: 'b5s6', title: 'ריצה קלה 2 דקות', emoji: '🏃', duration: '2 דקות' },
      { id: 'b5s7', title: 'קירור - הליכה ומתיחות', emoji: '🧘', duration: '5 דקות' },
    ],
  },

  // ========== MORE SPECIALIZED ==========
  {
    id: 'tpl-sp1', name: 'לפני פגישה מלחיצה', type: 'calm', emoji: '🤵', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp1s1', title: 'תנוחת כוח - 2 דקות', emoji: '🦸', duration: '2 דקות' },
      { id: 'sp1s2', title: '5 נשימות מרגיעות', emoji: '🌬️', duration: '1 דקה' },
      { id: 'sp1s3', title: 'דמיין שזה הולך טוב', emoji: '🔮', duration: '2 דקות' },
      { id: 'sp1s4', title: 'תגיד: "אני מוכן"', emoji: '💪', duration: '10 שניות' },
      { id: 'sp1s5', title: 'חייך - זה משנה את האנרגיה', emoji: '😊', duration: '10 שניות' },
    ],
  },
  {
    id: 'tpl-sp2', name: 'יצירתיות - שחרור חסימה', type: 'focus', emoji: '🎨', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp2s1', title: 'שרבט 2 דקות - בלי חשיבה', emoji: '✏️', duration: '2 דקות' },
      { id: 'sp2s2', title: 'שמע שיר שמעולם לא שמעת', emoji: '🎧', duration: '4 דקות' },
      { id: 'sp2s3', title: 'כתוב 10 רעיונות מטורפים', emoji: '💡', duration: '5 דקות' },
      { id: 'sp2s4', title: 'בחר את הכי פחות הגיוני ופתח אותו', emoji: '🤪', duration: '5 דקות' },
      { id: 'sp2s5', title: 'התחל ליצור - בלי שיפוט', emoji: '🎨', duration: '15 דקות' },
    ],
  },
  {
    id: 'tpl-sp3', name: 'דיגיטל דטוקס ערב', type: 'calm', emoji: '📵', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp3s1', title: 'שים את הטלפון בחדר אחר', emoji: '📱', duration: '30 שניות' },
      { id: 'sp3s2', title: 'קח ספר או מחברת', emoji: '📖', duration: '1 דקה' },
      { id: 'sp3s3', title: 'קרא או כתוב 20 דקות', emoji: '📝', duration: '20 דקות' },
      { id: 'sp3s4', title: 'שוחח עם מישהו פנים אל פנים', emoji: '👥', duration: '15 דקות' },
      { id: 'sp3s5', title: 'צא למרפסת - הסתכל על השמיים', emoji: '🌃', duration: '5 דקות' },
    ],
  },
  {
    id: 'tpl-sp4', name: 'עידוד עצמי יומי', type: 'growth', emoji: '💪', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp4s1', title: 'הסתכל במראה ותן מחמאה', emoji: '🪞', duration: '1 דקה' },
      { id: 'sp4s2', title: '3 אפירמציות בקול רם', emoji: '🗣️', duration: '2 דקות' },
      { id: 'sp4s3', title: 'כתוב הישג אחד מאתמול', emoji: '🏆', duration: '1 דקה' },
      { id: 'sp4s4', title: 'תגיד תודה לגוף שלך', emoji: '🙏', duration: '1 דקה' },
      { id: 'sp4s5', title: 'צחק - אפילו מאולץ. 30 שניות', emoji: '😂', duration: '30 שניות' },
    ],
  },
  {
    id: 'tpl-sp5', name: 'התמודדות עם כישלון', type: 'growth', emoji: '🌱', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp5s1', title: 'הכר בכאב - "כואב לי וזה בסדר"', emoji: '💔', duration: '1 דקה' },
      { id: 'sp5s2', title: 'מה הייתי אומר לחבר הכי טוב שלי?', emoji: '💛', duration: '3 דקות' },
      { id: 'sp5s3', title: 'כתוב מה למדת מזה', emoji: '📝', duration: '3 דקות' },
      { id: 'sp5s4', title: 'מצא את הגרעין החיובי', emoji: '🔍', duration: '2 דקות' },
      { id: 'sp5s5', title: 'הגדר צעד אחד קדימה', emoji: '👣', duration: '2 דקות' },
      { id: 'sp5s6', title: 'אמור: "אני לומד ומתפתח"', emoji: '🌱', duration: '30 שניות' },
    ],
  },
  {
    id: 'tpl-sp6', name: 'מיקוד לפני החלטה', type: 'focus', emoji: '⚖️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp6s1', title: 'כתוב את ההחלטה בדיוק', emoji: '📝', duration: '2 דקות' },
      { id: 'sp6s2', title: 'רשום 3 יתרונות', emoji: '✅', duration: '3 דקות' },
      { id: 'sp6s3', title: 'רשום 3 חסרונות', emoji: '❌', duration: '3 דקות' },
      { id: 'sp6s4', title: 'שאל: "מה יקרה בעוד שנה?"', emoji: '🔮', duration: '2 דקות' },
      { id: 'sp6s5', title: 'בחר - ותתחייב', emoji: '🎯', duration: '1 דקה' },
    ],
  },
  {
    id: 'tpl-sp7', name: 'הרגעה מהירה - 2 דקות', type: 'calm', emoji: '🫧', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp7s1', title: 'שים יד על הלב', emoji: '🫀', duration: '10 שניות' },
      { id: 'sp7s2', title: 'שאיפה 4 שניות', emoji: '🌬️', duration: '4 שניות' },
      { id: 'sp7s3', title: 'עצירה 4 שניות', emoji: '⏸️', duration: '4 שניות' },
      { id: 'sp7s4', title: 'נשיפה 4 שניות - חזור 5 פעמים', emoji: '💨', duration: '1 דקה' },
      { id: 'sp7s5', title: 'חייך והמשך', emoji: '😊', duration: '10 שניות' },
    ],
  },
  {
    id: 'tpl-sp8', name: 'בניית הרגל חדש', type: 'growth', emoji: '🔨', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp8s1', title: 'בחר הרגל אחד ספציפי', emoji: '🎯', duration: '2 דקות' },
      { id: 'sp8s2', title: 'הקטן אותו למינימום (2 דקות ביום)', emoji: '🐜', duration: '1 דקה' },
      { id: 'sp8s3', title: 'קשר אותו להרגל קיים', emoji: '🔗', duration: '2 דקות' },
      { id: 'sp8s4', title: 'הכן את הסביבה מראש', emoji: '🏠', duration: '3 דקות' },
      { id: 'sp8s5', title: 'עשה את ההרגל עכשיו - פעם ראשונה', emoji: '🚀', duration: '2 דקות' },
      { id: 'sp8s6', title: 'סמן V - התחלת!', emoji: '✅', duration: '10 שניות' },
    ],
  },
  {
    id: 'tpl-sp9', name: 'שבירת דחיינות', type: 'focus', emoji: '⏰', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp9s1', title: 'בחר את המשימה שאתה דוחה', emoji: '📋', duration: '1 דקה' },
      { id: 'sp9s2', title: 'מה הצעד הכי קטן שאפשר?', emoji: '🐜', duration: '1 דקה' },
      { id: 'sp9s3', title: 'שים טיימר ל-5 דקות בלבד', emoji: '⏱️', duration: '5 דקות' },
      { id: 'sp9s4', title: 'עשה רק את הצעד הזה', emoji: '👣', duration: '5 דקות' },
      { id: 'sp9s5', title: 'בא לך להמשיך? תמשיך. לא? סיימת', emoji: '✅', duration: '1 דקה' },
    ],
  },
  {
    id: 'tpl-sp10', name: 'הפסקת צהריים מחדשת', type: 'energy', emoji: '🌤️', isTemplate: true, createdAt: '',
    steps: [
      { id: 'sp10s1', title: 'קום מהשולחן', emoji: '🧍', duration: '10 שניות' },
      { id: 'sp10s2', title: 'אכול ארוחה בלי מסך', emoji: '🍽️', duration: '15 דקות' },
      { id: 'sp10s3', title: 'הליכה קצרה בחוץ', emoji: '🚶', duration: '10 דקות' },
      { id: 'sp10s4', title: 'שוחח עם מישהו על משהו לא עבודה', emoji: '💬', duration: '5 דקות' },
      { id: 'sp10s5', title: 'מתיחות 2 דקות', emoji: '🤸', duration: '2 דקות' },
    ],
  },
];
