// 60 רעיונות תוכן מוכנים — מסודרים לפי קהל וסוג
// אלמוג יכול לבחור, לייצר, ולתזמן

export interface ContentIdea {
  id: number;
  topic: string;
  audience: 'wedding' | 'course' | 'brand';
  contentType: 'caption' | 'hook' | 'reel_script' | 'story' | 'carousel';
  angle: string;
  priority: 'high' | 'medium' | 'low';
  used: boolean;
}

export const CONTENT_IDEAS: ContentIdea[] = [
  // ===== חתונות — 20 רעיונות =====
  { id: 1, topic: "5 טעויות שזוגות עושים בבחירת DJ", audience: "wedding", contentType: "carousel", angle: "חינוכי — מראה מקצוענות", priority: "high", used: false },
  { id: 2, topic: "מה באמת קובע אם הרחבה תהיה מלאה", audience: "wedding", contentType: "caption", angle: "תובנה מעמיקה", priority: "high", used: false },
  { id: 3, topic: "הרגע שהחתן הסתכל על הכלה ברחבה", audience: "wedding", contentType: "reel_script", angle: "רגשי — מאחורי הקלעים", priority: "high", used: false },
  { id: 4, topic: "למה אני לא מתאים לכל חתונה", audience: "wedding", contentType: "caption", angle: "סינון — מושך נכונים", priority: "high", used: false },
  { id: 5, topic: "ההבדל בין DJ שמנגן ל-DJ שמוביל", audience: "wedding", contentType: "reel_script", angle: "מיצוב פרימיום", priority: "high", used: false },
  { id: 6, topic: "3 שאלות שאתם חייבים לשאול את ה-DJ שלכם", audience: "wedding", contentType: "carousel", angle: "ערך — עוזר לזוגות", priority: "medium", used: false },
  { id: 7, topic: "קבלת פנים vs רחבה — איך בונים מעבר מושלם", audience: "wedding", contentType: "caption", angle: "מאחורי הקלעים מקצועי", priority: "medium", used: false },
  { id: 8, topic: "השיר הראשון — איך לבחור נכון", audience: "wedding", contentType: "carousel", angle: "עצות לזוגות", priority: "medium", used: false },
  { id: 9, topic: "מה עושים כשהרחבה מתרוקנת", audience: "wedding", contentType: "reel_script", angle: "מקצועי — פתרון בעיות", priority: "medium", used: false },
  { id: 10, topic: "חתונה של 100 vs 500 — ההבדלים מבחינת DJ", audience: "wedding", contentType: "caption", angle: "תובנה מעשית", priority: "medium", used: false },
  { id: 11, topic: "הערב שהפלייליסט לא עבד — ומה עשיתי", audience: "wedding", contentType: "story", angle: "סיפור אישי", priority: "medium", used: false },
  { id: 12, topic: "מוזיקה מזרחית, לועזית, או שילוב — מה מתאים", audience: "wedding", contentType: "carousel", angle: "עצות מותאמות", priority: "low", used: false },
  { id: 13, topic: "5 סימנים שה-DJ שלכם מקצוען", audience: "wedding", contentType: "carousel", angle: "חינוכי", priority: "low", used: false },
  { id: 14, topic: "תזמון — מתי לפתוח, מתי להוריד, מתי לדחוף", audience: "wedding", contentType: "reel_script", angle: "מאחורי הקלעים", priority: "medium", used: false },
  { id: 15, topic: "ביקורת מזוג שהגיע בלי ציפיות", audience: "wedding", contentType: "caption", angle: "הוכחה חברתית", priority: "high", used: false },
  { id: 16, topic: "למה הפגישה הראשונה חשובה יותר מהמחיר", audience: "wedding", contentType: "caption", angle: "מיצוב", priority: "medium", used: false },
  { id: 17, topic: "מה לא אומרים לכם על DJ לחתונה", audience: "wedding", contentType: "reel_script", angle: "חשיפת אמת", priority: "high", used: false },
  { id: 18, topic: "הציוד שלי — ולמה זה פחות חשוב ממה שחושבים", audience: "wedding", contentType: "carousel", angle: "הפתעה — ערכים מעל ציוד", priority: "low", used: false },
  { id: 19, topic: "חתונה בקיץ vs חורף — טיפים מ-DJ", audience: "wedding", contentType: "story", angle: "עונתי רלוונטי", priority: "low", used: false },
  { id: 20, topic: "הרגע שאני יודע שהערב הצליח", audience: "wedding", contentType: "caption", angle: "אישי רגשי", priority: "medium", used: false },

  // ===== קורסי DJ — 20 רעיונות =====
  { id: 21, topic: "למה 90% מהמתחילים מפסיקים אחרי חודש", audience: "course", contentType: "caption", angle: "כאב — מנרמל קושי", priority: "high", used: false },
  { id: 22, topic: "3 דברים שהלוואי ידעתי כשהתחלתי", audience: "course", contentType: "carousel", angle: "ערך מניסיון אישי", priority: "high", used: false },
  { id: 23, topic: "ביטחון על הבמה — איך בונים אותו", audience: "course", contentType: "reel_script", angle: "חינוכי מעמיק", priority: "high", used: false },
  { id: 24, topic: "DJ בלי ציוד יקר — אפשרי?", audience: "course", contentType: "caption", angle: "מפיל חסמים", priority: "high", used: false },
  { id: 25, topic: "הפחד הכי גדול של DJ מתחיל", audience: "course", contentType: "reel_script", angle: "מנרמל ומחזק", priority: "high", used: false },
  { id: 26, topic: "מה לומדים בחודש הראשון", audience: "course", contentType: "carousel", angle: "מידע על הקורס", priority: "medium", used: false },
  { id: 27, topic: "תלמיד שהגיע בלי שום רקע — איפה הוא היום", audience: "course", contentType: "caption", angle: "סיפור הצלחה", priority: "high", used: false },
  { id: 28, topic: "ללמוד DJ לבד vs עם מנטור", audience: "course", contentType: "carousel", angle: "ערך — השוואה", priority: "medium", used: false },
  { id: 29, topic: "הטעות שעולה הכי הרבה כסף למתחילים", audience: "course", contentType: "caption", angle: "חינוכי מפתיע", priority: "medium", used: false },
  { id: 30, topic: "5 תרגילים שיהפכו אותך ל-DJ בטוח", audience: "course", contentType: "carousel", angle: "ערך מעשי", priority: "medium", used: false },
  { id: 31, topic: "איך לבנות סט ראשון בלי להיכנס לפאניקה", audience: "course", contentType: "reel_script", angle: "טיפ מעשי", priority: "medium", used: false },
  { id: 32, topic: "מה ההבדל בין DJ שמנגן למי שמבין מוזיקה", audience: "course", contentType: "caption", angle: "תובנה", priority: "low", used: false },
  { id: 33, topic: "קריאת קהל — הדבר שלא מלמדים ביוטיוב", audience: "course", contentType: "reel_script", angle: "ערך ייחודי", priority: "high", used: false },
  { id: 34, topic: "השאלה הראשונה שאני שואל כל תלמיד", audience: "course", contentType: "story", angle: "סקרנות", priority: "medium", used: false },
  { id: 35, topic: "מה גיל טוב להתחיל ללמוד DJ", audience: "course", contentType: "caption", angle: "שאלות נפוצות", priority: "low", used: false },
  { id: 36, topic: "הסיבה שאני מלמד — ולמה זה לא על הכסף", audience: "course", contentType: "caption", angle: "אישי מותגי", priority: "medium", used: false },
  { id: 37, topic: "מתי תדע שאתה מוכן לאירוע הראשון", audience: "course", contentType: "carousel", angle: "צ'קליסט", priority: "medium", used: false },
  { id: 38, topic: "תלמיד לפני ואחרי — התקדמות של 3 חודשים", audience: "course", contentType: "reel_script", angle: "הוכחה חברתית", priority: "high", used: false },
  { id: 39, topic: "ציוד ראשון — מה באמת צריך ומה מיותר", audience: "course", contentType: "carousel", angle: "עצות מעשיות", priority: "low", used: false },
  { id: 40, topic: "הדבר שמפריד DJ חובב ממקצוען", audience: "course", contentType: "caption", angle: "מיצוב", priority: "medium", used: false },

  // ===== מותג — 20 רעיונות =====
  { id: 41, topic: "למה בחרתי להיות DJ ולא משהו רגיל", audience: "brand", contentType: "caption", angle: "סיפור אישי", priority: "high", used: false },
  { id: 42, topic: "יום בחיים שלי — מאחורי הקלעים", audience: "brand", contentType: "reel_script", angle: "אותנטי", priority: "high", used: false },
  { id: 43, topic: "הרגע שידעתי שזה מה שאני רוצה לעשות", audience: "brand", contentType: "story", angle: "רגשי אישי", priority: "high", used: false },
  { id: 44, topic: "מה אני עושה בין אירועים", audience: "brand", contentType: "reel_script", angle: "מאחורי הקלעים", priority: "medium", used: false },
  { id: 45, topic: "הפילוסופיה שלי על מוזיקה ואנרגיה", audience: "brand", contentType: "caption", angle: "ערכי מותג", priority: "high", used: false },
  { id: 46, topic: "5 שירים שמשנים לי את מצב הרוח", audience: "brand", contentType: "carousel", angle: "אנושי מזדהה", priority: "medium", used: false },
  { id: 47, topic: "ההודעה שגרמה לי לדמוע", audience: "brand", contentType: "caption", angle: "רגשי הוכחה", priority: "high", used: false },
  { id: 48, topic: "DJ אלמוג כהן — מי אני ב-60 שניות", audience: "brand", contentType: "reel_script", angle: "הכרות מהירה", priority: "high", used: false },
  { id: 49, topic: "הדבר שהכי מפחיד אותי בעבודה הזאת", audience: "brand", contentType: "caption", angle: "פגיעות אותנטית", priority: "medium", used: false },
  { id: 50, topic: "3 ערכים שמובילים אותי", audience: "brand", contentType: "carousel", angle: "ערכי מותג", priority: "medium", used: false },
  { id: 51, topic: "האירוע שהכי השפיע עליי", audience: "brand", contentType: "caption", angle: "סיפור אישי", priority: "medium", used: false },
  { id: 52, topic: "מה אנשים לא מבינים על DJ", audience: "brand", contentType: "reel_script", angle: "שבירת סטריאוטיפים", priority: "medium", used: false },
  { id: 53, topic: "סט אימון — כך אני מתכונן לאירוע", audience: "brand", contentType: "reel_script", angle: "מקצועיות", priority: "low", used: false },
  { id: 54, topic: "התגובה שאני מחכה לה בסוף כל אירוע", audience: "brand", contentType: "story", angle: "רגשי", priority: "medium", used: false },
  { id: 55, topic: "למה אני בוחר לעבוד רק עם זוגות שמתאימים", audience: "brand", contentType: "caption", angle: "סלקטיביות", priority: "high", used: false },
  { id: 56, topic: "השראה — מי השפיע עליי כ-DJ", audience: "brand", contentType: "carousel", angle: "עומק אישי", priority: "low", used: false },
  { id: 57, topic: "מה הייתי אומר לעצמי בגיל 18", audience: "brand", contentType: "caption", angle: "רפלקטיבי", priority: "medium", used: false },
  { id: 58, topic: "שגרת בוקר של DJ — מפתיע?", audience: "brand", contentType: "reel_script", angle: "יום יומי", priority: "low", used: false },
  { id: 59, topic: "החזון שלי — לאן אני לוקח את זה", audience: "brand", contentType: "caption", angle: "שאיפות", priority: "medium", used: false },
  { id: 60, topic: "תודה — לקהל, לתלמידים, לזוגות", audience: "brand", contentType: "story", angle: "הכרת תודה אותנטית", priority: "low", used: false },
];

// פונקציות עזר
export function getIdeasByAudience(audience: ContentIdea['audience']): ContentIdea[] {
  return CONTENT_IDEAS.filter(i => i.audience === audience);
}

export function getUnusedIdeas(): ContentIdea[] {
  return CONTENT_IDEAS.filter(i => !i.used);
}

export function getHighPriorityIdeas(): ContentIdea[] {
  return CONTENT_IDEAS.filter(i => i.priority === 'high' && !i.used);
}

export function markAsUsed(id: number): void {
  const idea = CONTENT_IDEAS.find(i => i.id === id);
  if (idea) idea.used = true;
}
