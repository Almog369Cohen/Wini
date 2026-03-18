export interface ReflectionPrompt {
  id: string;
  question: string;
  subtext: string;
  stage: number; // 0-4: which journey stage
  category: 'understand' | 'feel' | 'grow' | 'dream';
}

export const reflectionPrompts: ReflectionPrompt[] = [
  // Stage 0 - הכרה (Recognition)
  {
    id: 'r01',
    question: 'מה אתה מרגיש ברגע הזה, ממש עכשיו?',
    subtext: 'אין תשובה נכונה או לא נכונה. פשוט תן לזה לצאת.',
    stage: 0,
    category: 'feel',
  },
  {
    id: 'r02',
    question: 'מתי פעם הראשונה שהתחלת עם ההרגל הזה? מה קרה אז בחיים שלך?',
    subtext: 'לפעמים ההתחלה מגלה הרבה על הסיבה.',
    stage: 0,
    category: 'understand',
  },
  {
    id: 'r03',
    question: 'איזה רגש אתה מנסה להרגיע כשאתה נופל להרגל?',
    subtext: 'כעס? בדידות? חרדה? שעמום? פחד? עצב?',
    stage: 0,
    category: 'feel',
  },

  // Stage 1 - הבנה (Understanding)
  {
    id: 'r04',
    question: 'איזה צורך ההרגל הזה ממלא לך? מה אתה מקבל ממנו?',
    subtext: 'כל הרגל נותן משהו. הקשב בכנות.',
    stage: 1,
    category: 'understand',
  },
  {
    id: 'r05',
    question: 'ממה אתה בורח כשאתה נופל? מה אתה לא רוצה להרגיש?',
    subtext: 'הבריחה היא לא הבעיה - היא סימפטום. מה מאחוריה?',
    stage: 1,
    category: 'understand',
  },
  {
    id: 'r06',
    question: 'אם היית מדבר עם הילד שהיית - מה היית אומר לו?',
    subtext: 'לפעמים החסך שלנו הוא ילד שלא קיבל מספיק.',
    stage: 1,
    category: 'feel',
  },
  {
    id: 'r07',
    question: 'מה הייתה התקופה הכי טובה בחיים שלך? מה היה שונה אז?',
    subtext: 'זה יכול לגלות מה באמת חסר לך.',
    stage: 1,
    category: 'understand',
  },

  // Stage 2 - קבלה (Acceptance)
  {
    id: 'r08',
    question: 'מה אתה מוכן לסלוח לעצמך היום?',
    subtext: 'גמילה דורשת חמלה עצמית, לא שיפוט.',
    stage: 2,
    category: 'grow',
  },
  {
    id: 'r09',
    question: 'אם ההרגל הזה היה אדם - מה היית אומר לו בפרידה?',
    subtext: 'לפעמים צריך להיפרד כדי לשחרר.',
    stage: 2,
    category: 'feel',
  },
  {
    id: 'r10',
    question: 'מה הדבר שהכי מפחיד אותך בלהצליח?',
    subtext: 'כן, גם הצלחה יכולה להפחיד. זה נורמלי.',
    stage: 2,
    category: 'understand',
  },

  // Stage 3 - בנייה (Building)
  {
    id: 'r11',
    question: 'מה עושה אותך באמת שמח? לא רגע של הנאה - שמחה אמיתית?',
    subtext: 'הדופמין הבריא מגיע ממשמעות, לא מבריחה.',
    stage: 3,
    category: 'dream',
  },
  {
    id: 'r12',
    question: 'איך נראה יום מושלם שלך - בלי ההרגל הישן?',
    subtext: 'תאר את היום מרגע שאתה קם עד שאתה הולך לישון.',
    stage: 3,
    category: 'dream',
  },
  {
    id: 'r13',
    question: 'מי האדם שאתה רוצה להיות? תאר אותו.',
    subtext: 'לא מושלם - אמיתי.',
    stage: 3,
    category: 'grow',
  },

  // Stage 4 - חירות (Freedom)
  {
    id: 'r14',
    question: 'מה למדת על עצמך במסע הזה?',
    subtext: 'הגמילה היא לא רק ויתור - היא גילוי.',
    stage: 4,
    category: 'grow',
  },
  {
    id: 'r15',
    question: 'מה תגיד למישהו שרק מתחיל את המסע שלך?',
    subtext: 'הניסיון שלך שווה זהב.',
    stage: 4,
    category: 'grow',
  },
];

export const emotionalNeeds = [
  { id: 'pain', label: 'שיכוך כאב', emoji: '💔', description: 'ההרגל מרגיע כאב פנימי' },
  { id: 'stress', label: 'בריחה מלחץ', emoji: '😫', description: 'כשהעולם לוחץ מדי' },
  { id: 'boredom', label: 'מילוי שעמום', emoji: '😶', description: 'כשאין מה לעשות עם עצמי' },
  { id: 'loneliness', label: 'בדידות', emoji: '🫂', description: 'כשאני מרגיש לבד' },
  { id: 'anxiety', label: 'הרגעת חרדה', emoji: '😰', description: 'כשהחרדה מציפה' },
  { id: 'belonging', label: 'שייכות חברתית', emoji: '👥', description: 'כדי להרגיש חלק מקבוצה' },
  { id: 'reward', label: 'תגמול עצמי', emoji: '🎁', description: 'מגיע לי משהו טוב' },
  { id: 'control', label: 'תחושת שליטה', emoji: '🎯', description: 'הדבר האחד שאני שולט בו' },
  { id: 'identity', label: 'חלק מהזהות', emoji: '🪞', description: 'ככה אני, זה אני' },
  { id: 'numbness', label: 'אלחוש', emoji: '😶‍🌫️', description: 'לא רוצה להרגיש כלום' },
];

export const journeyStages = [
  { stage: 0, name: 'הכרה', description: 'אני מכיר בזה שיש בעיה ורוצה להשתנות', emoji: '🌑' },
  { stage: 1, name: 'הבנה', description: 'אני מבין למה אני עושה את זה ומה מאחורי ההרגל', emoji: '🌒' },
  { stage: 2, name: 'קבלה', description: 'אני מקבל את עצמי עם החולשות וסולח', emoji: '🌓' },
  { stage: 3, name: 'בנייה', description: 'אני בונה חיים חדשים עם הרגלים בריאים', emoji: '🌔' },
  { stage: 4, name: 'חירות', description: 'אני חופשי. ההרגל לא שולט בי יותר', emoji: '🌕' },
];
