// בוט בודק איכות — מסנן תוכן רדוד
// 7 קריטריונים, ציון 1-10, ציון מינימום 7

export interface QAResult {
  score: number;
  passed: boolean;
  checks: QACheck[];
  verdict: string;
  strengths: string[];
  improvements: string[];
}

export interface QACheck {
  name: string;
  score: number; // 0-10
  passed: boolean;
  note: string;
}

const BANNED_WORDS = [
  'מטורף', 'מושלם', 'הכי טוב', 'חד פעמי', 'מבצע מטורף',
  'מהרו', 'הזדמנות אחרונה', 'רק היום', 'בום', 'וואו',
  'פצצה', 'משגע', 'אש', 'רצח', 'חיים שלי',
];

const GOOD_WORDS = [
  'חוויה', 'אנרגיה', 'דיוק', 'הובלה', 'ביטחון', 'תחושה',
  'מבין', 'קהל', 'זרימה', 'רגש', 'תזמון', 'מדויק',
  'נוכחות', 'עומק', 'הבנה', 'כיוון', 'התקדמות', 'תרגול',
];

const SELECTIVE_CTAS = [
  'בדיקת התאמה', 'שיחת היכרות', 'בדיקת תאריך',
  'להבין אם זה מתאים', 'קבלת פרטים', 'הקישור בביו',
  'לבדוק אם', 'להבין איזה',
];

const DESPERATE_CTAS = [
  'הזמן עכשיו', 'מהר לפני', 'הירשם', 'קנה עכשיו',
  'אל תפספס', 'רק היום', 'מבצע', '50%', 'הנחה',
];

export function checkQuality(content: string, audience: 'wedding' | 'course' | 'brand'): QAResult {
  const checks: QACheck[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];
  const lines = content.split('\n').filter(l => l.trim());
  const firstLine = lines[0] || '';

  // 1. ערך אמיתי
  const hasInsight = lines.some(l =>
    l.includes('כי ') || l.includes('למה ') || l.includes('ההבדל') ||
    l.includes('הטעות') || l.includes('הבעיה') || l.includes('מה ש')
  );
  const hasListItems = lines.some(l => /^\d\./.test(l.trim()));
  const valueScore = (hasInsight ? 4 : 0) + (hasListItems ? 2 : 0) + (content.length > 150 ? 2 : 0) + (lines.length >= 4 ? 2 : 0);
  const valueFinal = Math.min(10, Math.max(1, valueScore));
  checks.push({ name: 'ערך אמיתי', score: valueFinal, passed: valueFinal >= 6, note: hasInsight ? 'יש תובנה' : 'חסרה תובנה' });
  if (valueFinal >= 8) strengths.push('ערך אמיתי חזק');
  if (valueFinal < 6) improvements.push('להוסיף תובנה או זווית חדשה');

  // 2. הוק
  const hookLength = firstLine.length;
  const hookHasQuestion = firstLine.includes('?');
  const hookHasQuote = firstLine.includes('"');
  const hookHasDots = firstLine.includes('...');
  let hookScore = 5;
  if (hookLength > 15 && hookLength < 80) hookScore += 2;
  if (hookHasQuestion || hookHasQuote) hookScore += 2;
  if (hookHasDots) hookScore += 1;
  if (hookLength < 10) hookScore -= 3;
  hookScore = Math.min(10, Math.max(1, hookScore));
  checks.push({ name: 'הוק', score: hookScore, passed: hookScore >= 6, note: hookScore >= 7 ? 'עוצר גלילה' : 'חלש' });
  if (hookScore >= 8) strengths.push('הוק חזק');
  if (hookScore < 6) improvements.push('שורה ראשונה צריכה לעצור גלילה');

  // 3. טון מותג
  let toneScore = 6;
  let bannedFound = 0;
  let goodFound = 0;
  for (const word of BANNED_WORDS) {
    if (content.includes(word)) { toneScore -= 2; bannedFound++; }
  }
  for (const word of GOOD_WORDS) {
    if (content.includes(word)) { goodFound++; }
  }
  if (goodFound >= 3) toneScore += 2;
  if (goodFound >= 1) toneScore += 1;
  const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu) || []).length;
  if (emojiCount > 3) { toneScore -= 2; }
  if (content.includes('!!!')) toneScore -= 2;
  toneScore = Math.min(10, Math.max(1, toneScore));
  checks.push({ name: 'טון מותג', score: toneScore, passed: toneScore >= 6, note: bannedFound > 0 ? `${bannedFound} מילים אסורות` : 'טון תקין' });
  if (bannedFound > 0) improvements.push('להסיר מילים אסורות');
  if (toneScore >= 8) strengths.push('טון מותגי חזק');

  // 4. התאמה לקהל
  let audienceScore = 5;
  if (audience === 'wedding') {
    const weddingWords = ['חתונה', 'זוג', 'ערב', 'רחבה', 'אירוע', 'חתן', 'כלה', 'קהל'];
    for (const w of weddingWords) { if (content.includes(w)) audienceScore += 1; }
  } else if (audience === 'course') {
    const courseWords = ['תלמיד', 'ללמוד', 'מתחיל', 'קורס', 'ביטחון', 'תרגול', 'ציוד', 'מורה'];
    for (const w of courseWords) { if (content.includes(w)) audienceScore += 1; }
  }
  audienceScore = Math.min(10, Math.max(1, audienceScore));
  checks.push({ name: 'התאמה לקהל', score: audienceScore, passed: audienceScore >= 5, note: audienceScore >= 7 ? 'מותאם' : 'צריך התאמה' });
  if (audienceScore >= 8) strengths.push('מדבר ישירות לקהל');

  // 5. CTA
  let ctaScore = 3;
  for (const cta of SELECTIVE_CTAS) { if (content.includes(cta)) { ctaScore += 3; break; } }
  for (const cta of DESPERATE_CTAS) { if (content.includes(cta)) { ctaScore -= 3; break; } }
  if (content.includes('בביו')) ctaScore += 2;
  ctaScore = Math.min(10, Math.max(1, ctaScore));
  checks.push({ name: 'CTA', score: ctaScore, passed: ctaScore >= 5, note: ctaScore >= 7 ? 'סלקטיבי' : 'צריך שיפור' });
  if (ctaScore < 5) improvements.push('להוסיף קריאה לפעולה סלקטיבית');

  // 6. רדידות
  const isShallow = content.length < 80 && !hasInsight;
  const isJustShowOff = content.includes('תראו') && !hasInsight;
  const shallowScore = isShallow || isJustShowOff ? 2 : 9;
  checks.push({ name: 'לא רדוד', score: shallowScore, passed: shallowScore >= 5, note: shallowScore < 5 ? 'תוכן רדוד!' : 'יש עומק' });
  if (shallowScore < 5) improvements.push('התוכן רדוד — צריך ערך אמיתי');

  // 7. קלישאות
  const clicheCount = bannedFound + (content.includes('!!!') ? 1 : 0) + (emojiCount > 4 ? 1 : 0);
  const clicheScore = Math.max(1, 10 - clicheCount * 3);
  checks.push({ name: 'בלי קלישאות', score: clicheScore, passed: clicheScore >= 6, note: clicheCount > 0 ? `${clicheCount} קלישאות` : 'נקי' });
  if (clicheScore >= 9) strengths.push('שפה נקייה בלי קלישאות');

  // ציון כללי
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0) / checks.length;
  const roundedScore = Math.round(totalScore * 10) / 10;
  const passed = roundedScore >= 7 && !checks.some(c => c.score <= 2);

  return {
    score: roundedScore,
    passed,
    checks,
    verdict: passed ? 'עובר — מוכן לפרסום' : 'נכשל — צריך שיפור',
    strengths,
    improvements,
  };
}
