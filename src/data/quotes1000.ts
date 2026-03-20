import type { MotivationalQuote, QuoteCategory } from '../types';

// Temporary starter set - full 1000 quotes will be added
export const quotes1000: MotivationalQuote[] = [
  // Morning (1-20)
  { id: 1, text: 'בוקר חדש, הזדמנות חדשה. היום אתה בוחר בעצמך.', category: 'morning' },
  { id: 2, text: 'כל בוקר שאתה קם בלי ההרגל הישן - אתה גיבור.', category: 'morning' },
  { id: 3, text: 'השמש זורחת בשבילך גם היום. תן לאור להיכנס.', category: 'morning' },
  { id: 4, text: 'הגוף שלך התעורר חזק יותר מאתמול. תרגיש את זה.', category: 'morning' },
  { id: 5, text: 'היום הזה לא יחזור. תעשה ממנו משהו שתהיה גאה בו.', category: 'morning' },
  { id: 6, text: 'אתה לא צריך להיות מושלם. רק צריך להתחיל.', category: 'morning' },
  { id: 7, text: 'תנשום עמוק. היום הוא מתנה.', category: 'morning' },
  { id: 8, text: 'כל יום שעובר אתה קרוב יותר לחופש.', category: 'morning' },
  { id: 9, text: 'הבוקר הזה הוא הוכחה שאתה יכול. אתה כבר כאן.', category: 'morning' },
  { id: 10, text: 'תתחיל את היום עם חיוך. אתה ראוי לזה.', category: 'morning' },

  // Afternoon (11-20)
  { id: 11, text: 'אמצע היום - אתה עדיין כאן, עדיין חזק, עדיין בוחר נכון.', category: 'afternoon' },
  { id: 12, text: 'הרגע הזה עובר. הכוח שלך נשאר.', category: 'afternoon' },
  { id: 13, text: 'תזכור למה התחלת. התשובה היא תמיד שווה את המאמץ.', category: 'afternoon' },
  { id: 14, text: 'כל שעה שעוברת בלי ההרגל הישן - הגוף שלך מודה לך.', category: 'afternoon' },
  { id: 15, text: 'אתה עושה את הדבר הקשה ביותר - משנה את עצמך. גאווה.', category: 'afternoon' },
  { id: 16, text: 'תשתה מים, תנשום, תמשיך. אתה יכול.', category: 'afternoon' },
  { id: 17, text: 'הדחף הזה? הוא רק אורח. הוא יעבור.', category: 'afternoon' },
  { id: 18, text: 'חצי יום עבר. חצי ניצחון. תמשיך.', category: 'afternoon' },
  { id: 19, text: 'אתה לא לבד במסע הזה. גם אם זה מרגיש ככה.', category: 'afternoon' },
  { id: 20, text: 'כל רגע של התנגדות הוא רגע של חופש.', category: 'afternoon' },

  // Evening (21-30)
  { id: 21, text: 'עוד יום שלם. עוד ניצחון. לילה טוב, לוחם.', category: 'evening' },
  { id: 22, text: 'הערב הזה שייך לך. תנוח, מגיע לך.', category: 'evening' },
  { id: 23, text: 'תסתכל אחורה על היום - כמה רגעים של כוח היו לך.', category: 'evening' },
  { id: 24, text: 'השינה תרפא, הלילה יעבור, ומחר תהיה חזק יותר.', category: 'evening' },
  { id: 25, text: 'תודה לעצמך. עשית דבר אמיתי היום.', category: 'evening' },
  { id: 26, text: 'סגור את היום ברוגע. מחר ממשיכים.', category: 'evening' },
  { id: 27, text: 'הלילה הזה שייך לגרסה החדשה שלך.', category: 'evening' },
  { id: 28, text: 'תן לגוף לנוח. הוא עבד קשה היום - בשבילך.', category: 'evening' },
  { id: 29, text: 'כל ערב בלי ההרגל הישן הוא ערב של ניצחון שקט.', category: 'evening' },
  { id: 30, text: 'לפני שנרדם - תגיד לעצמך: עשיתי טוב היום.', category: 'evening' },

  // Breaking moments (31-50)
  { id: 31, text: 'עצור. תנשום. זה רק דחף - הוא יעבור תוך 3 דקות.', category: 'breaking' },
  { id: 32, text: 'אתה לא רוצה את זה באמת. אתה רוצה את מה שאחרי.', category: 'breaking' },
  { id: 33, text: 'הרגע הזה הוא המבחן. ואתה כבר הוכחת שאתה יכול.', category: 'breaking' },
  { id: 34, text: 'תזכור את הבוקר אחרי. את ההרגשה של גאווה.', category: 'breaking' },
  { id: 35, text: 'הדחף משקר לך. הוא אומר שזה יעזור, אבל זה לא.', category: 'breaking' },
  { id: 36, text: 'זה כואב עכשיו כי אתה גדל. כאב גדילה.', category: 'breaking' },
  { id: 37, text: 'תספור עד 10. ואז עוד 10. הדחף כבר נחלש.', category: 'breaking' },
  { id: 38, text: 'אתה חזק יותר מהדחף הזה. הוכחת את זה כבר.', category: 'breaking' },
  { id: 39, text: 'דקה אחת. רק דקה אחת של התנגדות. אתה יכול.', category: 'breaking' },
  { id: 40, text: 'המוח שלך מנסה לרמות אותך. אל תיתן לו.', category: 'breaking' },
  { id: 41, text: 'תחשוב על מי שאתה אוהב. הם גאים בך עכשיו.', category: 'breaking' },
  { id: 42, text: 'כל פעם שאתה אומר לא - אתה בונה שריר של רצון.', category: 'breaking' },
  { id: 43, text: 'הרגע הכי קשה הוא גם הרגע הכי חשוב. תחזיק.', category: 'breaking' },
  { id: 44, text: 'תשאל את עצמך: מה הגרסה הטובה שלי הייתה עושה?', category: 'breaking' },
  { id: 45, text: 'זה לא קל. אבל קל זה לא מה שהביא אותך לכאן.', category: 'breaking' },
  { id: 46, text: 'הגוף שלך צועק, אבל הנשמה שלך יודעת את האמת.', category: 'breaking' },
  { id: 47, text: 'עוד 5 דקות. רק 5 דקות. ואז הדחף יחלש.', category: 'breaking' },
  { id: 48, text: 'אתה לא מוותר על משהו. אתה מרוויח הכל.', category: 'breaking' },
  { id: 49, text: 'הכאב הזה הוא המחיר של חופש. ואתה משלם אותו.', category: 'breaking' },
  { id: 50, text: 'תנשום. תשתה מים. תצא החוצה. הדחף יעבור.', category: 'breaking' },

  // Victory (51-65)
  { id: 51, text: 'ניצחת! כל ניצחון קטן בונה את הניצחון הגדול.', category: 'victory' },
  { id: 52, text: 'מגיע לך להרגיש גאווה. כי מה שעשית זה לא פשוט.', category: 'victory' },
  { id: 53, text: 'תזכור את הרגע הזה. אתה חזק יותר ממה שחשבת.', category: 'victory' },
  { id: 54, text: 'כל יום נקי הוא מתנה שאתה נותן לעצמך.', category: 'victory' },
  { id: 55, text: 'הגוף שלך מתחיל להבריא. אתה עושה את זה!', category: 'victory' },
  { id: 56, text: 'שבוע! חודש! לא משנה כמה - כל רגע נספר.', category: 'victory' },
  { id: 57, text: 'אתה מוכיח לעצמך שאתה יכול לשנות. וזה הכל.', category: 'victory' },
  { id: 58, text: 'תחגוג. לא משנה כמה קטן הניצחון - הוא שלך.', category: 'victory' },
  { id: 59, text: 'כל דחף שעברת הפך אותך לאדם חזק יותר.', category: 'victory' },
  { id: 60, text: 'אתה לא רק מפסיק הרגל. אתה בונה חיים חדשים.', category: 'victory' },

  // Motivation (61-75)
  { id: 61, text: 'השינוי לא קורה ביום אחד. אבל יום אחד הוא ההתחלה.', category: 'motivation' },
  { id: 62, text: 'אתה לא צריך מוטיבציה. אתה צריך החלטה.', category: 'motivation' },
  { id: 63, text: 'הדרך הכי ארוכה מתחילה בצעד אחד. ואתה כבר צועד.', category: 'motivation' },
  { id: 64, text: 'כשיהיה לך קשה, תזכור למה התחלת.', category: 'motivation' },
  { id: 65, text: 'אתה לא חלש כי זה קשה. אתה חזק כי אתה ממשיך.', category: 'motivation' },
  { id: 66, text: 'המסע הזה הוא שלך. ואתה הולך אותו בגבורה.', category: 'motivation' },
  { id: 67, text: 'תפסיק לחכות לרגע הנכון. הרגע הנכון הוא עכשיו.', category: 'motivation' },
  { id: 68, text: 'אתה לא מנסה. אתה עושה. יש הבדל.', category: 'motivation' },
  { id: 69, text: 'כל בחירה טובה היום בונה את המחר שאתה רוצה.', category: 'motivation' },
  { id: 70, text: 'אל תחכה להרגיש מוכן. תתחיל, וההרגשה תבוא.', category: 'motivation' },

  // Self compassion (71-85)
  { id: 71, text: 'נפלת? קום. נפילה היא לא כישלון, היא חלק מהדרך.', category: 'self_compassion' },
  { id: 72, text: 'תהיה עדין עם עצמך. אתה עושה משהו קשה מאוד.', category: 'self_compassion' },
  { id: 73, text: 'אתה לא ההרגל שלך. אתה האדם שבוחר להשתנות.', category: 'self_compassion' },
  { id: 74, text: 'גם ביום קשה, אתה ראוי לאהבה. במיוחד ביום קשה.', category: 'self_compassion' },
  { id: 75, text: 'תסלח לעצמך. ואז תמשיך קדימה.', category: 'self_compassion' },
  { id: 76, text: 'אתה לא שבור. אתה בשיקום. וזה דבר אמיץ.', category: 'self_compassion' },
  { id: 77, text: 'הביקורת הפנימית? היא לא אתה. היא רק רעש.', category: 'self_compassion' },
  { id: 78, text: 'תתייחס לעצמך כמו שהיית מתייחס לחבר הכי טוב שלך.', category: 'self_compassion' },
  { id: 79, text: 'לא משנה מה היה אתמול. היום אתה מתחיל מחדש.', category: 'self_compassion' },
  { id: 80, text: 'אתה אנושי. ואנושיות פירושה גם לטעות וגם לקום.', category: 'self_compassion' },

  // Growth (81-90)
  { id: 81, text: 'כאב הגמילה הוא כאב גדילה. הגוף שלך מתרפא.', category: 'growth' },
  { id: 82, text: 'אתה לא אותו אדם שהתחיל. כל יום שינה אותך.', category: 'growth' },
  { id: 83, text: 'הפרפר לא יכול לחזור להיות זחל. גם אתה לא.', category: 'growth' },
  { id: 84, text: 'כל משבר שעברת הפך אותך לחזק יותר וחכם יותר.', category: 'growth' },
  { id: 85, text: 'הצמיחה קורית בדיוק במקום שבו הכי כואב.', category: 'growth' },
  { id: 86, text: 'אתה לומד להכיר את עצמך מחדש. וזה יפה.', category: 'growth' },
  { id: 87, text: 'כל יום בלי ההרגל הוא יום שבו אתה צומח.', category: 'growth' },
  { id: 88, text: 'השינוי הפנימי תמיד קורה לפני שהעולם רואה אותו.', category: 'growth' },
  { id: 89, text: 'אתה לא רק עוזב הרגל. אתה הופך לאדם חדש.', category: 'growth' },
  { id: 90, text: 'הזרעים שאתה שותל היום יפרחו. תן להם זמן.', category: 'growth' },

  // Strength (91-100)
  { id: 91, text: 'הכוח שלך לא נמדד בימים. הוא נמדד ברגעים שאמרת לא.', category: 'strength' },
  { id: 92, text: 'אתה לוחם. גם אם אף אחד לא רואה את המלחמה.', category: 'strength' },
  { id: 93, text: 'הגבורה האמיתית היא לעשות את הדבר הנכון כשהכי קשה.', category: 'strength' },
  { id: 94, text: 'אתה כבר הוכחת שאתה יכול. עכשיו תוכיח שוב.', category: 'strength' },
  { id: 95, text: 'כל פעם שאמרת לא לדחף - בנית שריר של רצון.', category: 'strength' },
  { id: 96, text: 'אתה חזק. גם כשזה לא מרגיש ככה.', category: 'strength' },
  { id: 97, text: 'הכוח הפנימי שלך גדול מכל דחף.', category: 'strength' },
  { id: 98, text: 'כל רגע קשה הוא הוכחה שאתה חי ונלחם.', category: 'strength' },

  // New beginning (99-110)
  { id: 99, text: 'היום הוא יום ראשון לשארית חייך. תבחר בחכמה.', category: 'new_beginning' },
  { id: 100, text: 'כל רגע הוא התחלה חדשה. לא צריך לחכות לינואר.', category: 'new_beginning' },
  { id: 101, text: 'הדף הבא ריק. אתה כותב את הסיפור שלך.', category: 'new_beginning' },
  { id: 102, text: 'נפלת? מעולה. עכשיו אתה יודע מה לא לעשות.', category: 'new_beginning' },
  { id: 103, text: 'כל שקיעה היא הבטחה של זריחה חדשה.', category: 'new_beginning' },
  { id: 104, text: 'אתה לא מתחיל מאפס. אתה מתחיל מניסיון.', category: 'new_beginning' },
  { id: 105, text: 'התחלה חדשה לא אומרת שכישלת. אומרת שלא ויתרת.', category: 'new_beginning' },
  { id: 106, text: 'היום אתה בוחר מחדש. וזו הבחירה הכי אמיצה.', category: 'new_beginning' },
  { id: 107, text: 'העבר לא שווה כלום מול ההחלטה שלך עכשיו.', category: 'new_beginning' },
  { id: 108, text: 'כל יום חדש הוא צ׳אנס חדש. תנצל אותו.', category: 'new_beginning' },
];

export function getQuotesByCategory(category: QuoteCategory): MotivationalQuote[] {
  return quotes1000.filter(q => q.category === category);
}

export function getRandomQuote(category?: QuoteCategory): MotivationalQuote {
  const pool = category ? getQuotesByCategory(category) : quotes1000;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getTimeBasedQuotes(): MotivationalQuote[] {
  const hour = new Date().getHours();
  let category: QuoteCategory;
  if (hour >= 5 && hour < 12) category = 'morning';
  else if (hour >= 12 && hour < 18) category = 'afternoon';
  else category = 'evening';
  return getQuotesByCategory(category);
}
