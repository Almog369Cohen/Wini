export interface AlternativeActivity {
  title: string;
  description: string;
  duration: string;
  icon: string;
  dopamineType: 'physical' | 'mental' | 'social' | 'creative';
}

export const alternativeActivities: AlternativeActivity[] = [
  {
    title: '10 דקות הליכה',
    description: 'צא החוצה, נשום אוויר צח. תנועה משחררת אנדורפינים',
    duration: '10 דק\'',
    icon: '🚶',
    dopamineType: 'physical',
  },
  {
    title: 'מקלחת קרה',
    description: 'מקלחת קרה של 30 שניות מעלה דופמין ב-250%',
    duration: '2 דק\'',
    icon: '🚿',
    dopamineType: 'physical',
  },
  {
    title: '20 שכיבות סמיכה',
    description: 'תנועה פיזית אינטנסיבית מחליפה את הדחף',
    duration: '3 דק\'',
    icon: '💪',
    dopamineType: 'physical',
  },
  {
    title: 'תרגיל נשימה',
    description: 'שימוש בתרגיל נשימה מובנה להרגעת מערכת העצבים',
    duration: '5 דק\'',
    icon: '🌬️',
    dopamineType: 'mental',
  },
  {
    title: 'כתיבה חופשית',
    description: 'כתוב מה שעובר לך בראש, בלי סינון. שחרר את המחשבות',
    duration: '5 דק\'',
    icon: '✍️',
    dopamineType: 'creative',
  },
  {
    title: 'שתה כוס מים',
    description: 'לפעמים הגוף מבלבל צמא עם דחף. שתה לאט וברגיעה',
    duration: '1 דק\'',
    icon: '💧',
    dopamineType: 'physical',
  },
  {
    title: 'האזן לשיר אהוב',
    description: 'מוזיקה משחררת דופמין באופן טבעי',
    duration: '4 דק\'',
    icon: '🎵',
    dopamineType: 'mental',
  },
  {
    title: 'התקשר לחבר',
    description: 'שיחה עם מישהו קרוב יכולה לשנות את כל המצב רוח',
    duration: '10 דק\'',
    icon: '📱',
    dopamineType: 'social',
  },
  {
    title: 'צייר או שרבט',
    description: 'תן לידיים לעשות משהו. לא צריך להיות אמנות - רק שחרור',
    duration: '5 דק\'',
    icon: '🎨',
    dopamineType: 'creative',
  },
  {
    title: 'מתיחות קלות',
    description: 'מתיחות של 5 דקות משחררות מתח פיזי ומנטלי',
    duration: '5 דק\'',
    icon: '🧘',
    dopamineType: 'physical',
  },
];
