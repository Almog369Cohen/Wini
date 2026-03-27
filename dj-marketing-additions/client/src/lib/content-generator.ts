// מחולל תוכן מקומי — לא צריך API חיצוני
// משתמש בתבניות + כללי מותג + דוגמאות לייצר תוכן מדויק

export interface GenerationInput {
  topic: string;
  audience: 'wedding' | 'course' | 'brand';
  contentType: 'caption' | 'hook' | 'reel_script' | 'story' | 'carousel';
  inputType: 'topic' | 'image' | 'competitor_post';
}

export interface GenerationOutput {
  content: string;
  hook: string;
  cta: string;
  hashtags: string[];
  qaScore: number;
  qaVerdict: string;
  passed: boolean;
}

// תבניות הוקים לפי קהל
const WEDDING_HOOKS = [
  (topic: string) => `רוב הזוגות ${topic}. אבל זה לא מה שבאמת קובע.`,
  (topic: string) => `${topic}?\n\nהנה מה שאף DJ לא יגיד לכם.`,
  (topic: string) => `שאלו אותי: "${topic}?"\nהתשובה שלי תפתיע אתכם.`,
  (topic: string) => `חתונה טובה לא קורית במקרה.\n${topic}.`,
  (topic: string) => `הטעות הכי גדולה שזוגות עושים?\n${topic}.`,
  (topic: string) => `אם ${topic} — אתם כנראה עושים את זה לא נכון.`,
  (topic: string) => `3 דברים שזוגות שוכחים כש${topic}:`,
  (topic: string) => `${topic}.\nוזה בדיוק מה שמפריד חתונה רגילה ממדהימה.`,
];

const COURSE_HOOKS = [
  (topic: string) => `"${topic}"\n\nזה המשפט שאני שומע הכי הרבה מתלמידים.`,
  (topic: string) => `${topic}?\n\nהנה האמת שאף מורה לא אומר.`,
  (topic: string) => `אם ${topic} — אתה לא לבד.`,
  (topic: string) => `3 דברים שמתחילים עושים לא נכון כש${topic}:`,
  (topic: string) => `${topic}.\nוזה בדיוק מה שעוצר אותך מלהתקדם.`,
  (topic: string) => `הפחד מ${topic}? כל DJ עבר אותו.\nההבדל הוא מה עשו עם זה.`,
  (topic: string) => `מה הייתי עושה אם הייתי מתחיל מאפס?\n${topic}.`,
  (topic: string) => `${topic}.\nלא בגלל כישרון. בגלל כיוון.`,
];

const BRAND_HOOKS = [
  (topic: string) => `אני לא מתאים לכל אירוע. ${topic}.`,
  (topic: string) => `${topic}.\nזה מה שמבדיל אותי מ-99% מהדיג'יים.`,
  (topic: string) => `${topic}?\nאני חושב על זה אחרת.`,
  (topic: string) => `שאלו אותי למה ${topic}.\nהנה התשובה.`,
];

// גוף תוכן לפי קהל
const WEDDING_BODIES = [
  `כי מה שבאמת קובע אם הערב שלכם ירגיש חי או שטוח — זה לא הפלייליסט.\nזה מישהו שיודע לקרוא את החדר.\n\nמתי לפתוח. מתי לעצור. מתי לדחוף.\nומתי לתת לרגע לנשום.\n\nDJ שמבין את זה — לא רק מנגן.\nהוא מוביל חוויה.`,
  `כי חתונה היא לא רק שירים.\nהיא זרימה. אנרגיה. תזמון.\n\nהיא הרגע שהחתן מסתכל על הכלה ברחבה.\nהיא המעבר בין קבלת פנים לטירוף.\nהיא השקט לפני הריקוד האחרון.\n\nכשמישהו מבין את המבנה הזה — הכל מרגיש נכון.`,
  `כי הרחבה שלכם לא צריכה להיות הכי רועשת.\nהיא צריכה להיות הכי מדויקת.\n\nהמוזיקה הנכונה, ברגע הנכון, לקהל שלכם.\nלא העתקה של חתונה אחרת.\nחוויה שנבנתה בדיוק בשבילכם.`,
  `כי ההבדל בין ערב טוב לערב בלתי נשכח — הוא לא בציוד.\nהוא בהבנה.\n\nלהבין מתי הקהל מוכן.\nלהבין איזה שיר יפתח את הרגש.\nלהבין מתי לגעת ומתי לעזוב.\n\nזה לא משהו שלומדים מפלייליסט.`,
];

const COURSE_BODIES = [
  `הבעיה אף פעם לא הייתה כישרון.\nהבעיה הייתה שאף אחד לא הסביר את זה בגובה העיניים.\n\nללמוד DJ זה לא "להבין כפתורים".\nזה ללמוד לשמוע אחרת. להרגיש תזמון.\nלבנות ביטחון צעד אחרי צעד.\n\nוזה? כל אחד יכול.\nעם הכיוון הנכון.`,
  `כי רוב הקורסים מלמדים ציוד.\nאבל אף אחד לא מלמד אותך איך להרגיש בטוח.\n\nאיך לעמוד מול קהל בלי לקפוא.\nאיך לבחור את השיר הבא כשאתה לחוץ.\nאיך לבנות סט שמרגיש טבעי.\n\nזה מה שמשנה את המשחק.`,
  `כי ביטחון לא בא מלדעת הכל.\nביטחון בא מלתרגל את הדבר הנכון, בצורה הנכונה, עם מישהו שמבין.\n\nלא עוד טוטוריאל ביוטיוב.\nלא עוד "תלמד לבד".\n\nליווי אמיתי. התקדמות אמיתית.`,
  `כי אתה לא צריך עוד מידע.\nאתה צריך מישהו שיראה לך מה לעשות עם המידע.\n\nמישהו שעבר את זה.\nשמבין את הפחד.\nשיודע בדיוק איפה אתה נתקע ולמה.\n\nוזה בדיוק מה שאני עושה.`,
];

const WEDDING_CTAS = [
  '🎵 רוצים לבדוק התאמה? הקישור בביו.',
  '🎵 בדיקת התאמה לחתונה — בביו.',
  '🎵 שיחת היכרות? הקישור בביו.',
  '🎵 בדיקת תאריך — בביו.',
  '🎵 להבין אם זה מתאים לכם — הקישור בביו.',
];

const COURSE_CTAS = [
  '🎧 בדיקת התאמה ללימודים — בביו.',
  '🎧 רוצה לבדוק אם הקורס מתאים לך? בביו.',
  '🎧 להבין איזה מסלול מתאים — הקישור בביו.',
  '🎧 קבלת פרטים — בביו.',
];

const BRAND_CTAS = [
  '🎵 בדיקת התאמה — בביו.',
  '🎵 רוצים לדעת יותר? הקישור בביו.',
];

const WEDDING_HASHTAGS = ['#חתונה', '#DJ', '#חתונה2026', '#אלמוגכהן', '#חתונהישראלית', '#רחבה', '#מוזיקה', '#אירועים'];
const COURSE_HASHTAGS = ['#קורסDJ', '#ללמודDJ', '#אלמוגכהן', '#DJ', '#מוזיקה', '#תקליטן', '#ביטחון', '#התחלה'];
const BRAND_HASHTAGS = ['#אלמוגכהן', '#DJ', '#מוזיקה', '#חוויה', '#אנרגיה', '#מותג', '#תקליטן'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// בדיקת איכות
function qaCheck(content: string, audience: string): { score: number; verdict: string; passed: boolean } {
  let score = 5;
  const issues: string[] = [];

  // בדיקת אורך
  if (content.length > 100) score += 1;
  if (content.length > 200) score += 0.5;
  if (content.length < 50) { score -= 2; issues.push('קצר מדי'); }

  // בדיקת הוק (שורה ראשונה)
  const firstLine = content.split('\n')[0];
  if (firstLine.length > 20 && firstLine.length < 80) score += 1;
  if (firstLine.includes('?') || firstLine.includes('.') || firstLine.includes('"')) score += 0.5;

  // בדיקת מילים אסורות
  const banned = ['מטורף', 'מושלם', 'הכי טוב', 'מבצע', 'מהרו', 'חד פעמי', '🔥🔥', '!!!'];
  for (const word of banned) {
    if (content.includes(word)) { score -= 2; issues.push(`מילה אסורה: ${word}`); }
  }

  // בדיקת מילים טובות
  const good = ['חוויה', 'אנרגיה', 'דיוק', 'הובלה', 'ביטחון', 'תחושה', 'מבין', 'קהל'];
  let goodCount = 0;
  for (const word of good) {
    if (content.includes(word)) goodCount++;
  }
  if (goodCount >= 2) score += 1;

  // בדיקת CTA
  if (content.includes('בביו') || content.includes('התאמה') || content.includes('היכרות')) score += 0.5;

  // בדיקת אימוג'ים (לא יותר מ-3)
  const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu) || []).length;
  if (emojiCount > 3) { score -= 1; issues.push('יותר מדי אימוג\'ים'); }

  // בדיקת שורות ריקות (מבנה)
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length >= 4) score += 0.5;

  score = Math.max(1, Math.min(10, score));

  return {
    score: Math.round(score * 10) / 10,
    verdict: issues.length > 0 ? issues.join(', ') : 'תוכן איכותי',
    passed: score >= 7,
  };
}

export function generateContent(input: GenerationInput): GenerationOutput {
  const { topic, audience, contentType, inputType } = input;

  // בחר הוק
  const hooks = audience === 'wedding' ? WEDDING_HOOKS : audience === 'course' ? COURSE_HOOKS : BRAND_HOOKS;
  const hook = pick(hooks)(topic);

  // בחר גוף
  const bodies = audience === 'wedding' ? WEDDING_BODIES : audience === 'course' ? COURSE_BODIES : WEDDING_BODIES;
  const body = pick(bodies);

  // בחר CTA
  const ctas = audience === 'wedding' ? WEDDING_CTAS : audience === 'course' ? COURSE_CTAS : BRAND_CTAS;
  const cta = pick(ctas);

  // בחר האשטגים
  const allHashtags = audience === 'wedding' ? WEDDING_HASHTAGS : audience === 'course' ? COURSE_HASHTAGS : BRAND_HASHTAGS;
  const hashtags = pickN(allHashtags, 5);

  // הרכב תוכן
  const content = `${hook}\n\n${body}\n\n${cta}`;

  // בדיקת איכות
  const qa = qaCheck(content, audience);

  // אם לא עובר — נסה שוב (עד 3 פעמים)
  if (!qa.passed) {
    const hook2 = pick(hooks)(topic);
    const body2 = pick(bodies);
    const content2 = `${hook2}\n\n${body2}\n\n${cta}`;
    const qa2 = qaCheck(content2, audience);
    if (qa2.score > qa.score) {
      return {
        content: content2,
        hook: hook2,
        cta,
        hashtags,
        qaScore: qa2.score,
        qaVerdict: qa2.verdict,
        passed: qa2.passed,
      };
    }
  }

  return {
    content,
    hook,
    cta,
    hashtags,
    qaScore: qa.score,
    qaVerdict: qa.verdict,
    passed: qa.passed,
  };
}

// ייצור מהיר — שורה אחת
export function quickGenerate(topic: string, audience: 'wedding' | 'course' | 'brand' = 'wedding'): GenerationOutput {
  return generateContent({ topic, audience, contentType: 'caption', inputType: 'topic' });
}
