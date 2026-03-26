// Forms Builder Types

export type FieldType = 'text' | 'phone' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox' | 'number' | 'file';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select type
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  order: number;
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  emoji: string;
  isActive: boolean;
  isTemplate: boolean;
  category: 'wedding' | 'course' | 'rental' | 'podcast' | 'mailing' | 'custom';
  // Automation config
  autoCreateLead: boolean;
  autoEventType?: import('./crm').EventType;
  autoSendWhatsApp: boolean;
  whatsAppTemplateId?: string;
  // Stats
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, unknown>; // field id → value
  leadId?: string; // if auto-created lead
  createdAt: string;
  source?: string; // referrer URL
}

// Pre-built form templates
export const FORM_TEMPLATES: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'submissionCount'>[] = [
  {
    name: 'טופס ליד חתונות',
    description: 'טופס לזוגות מתעניינים בשירות DJ לחתונה',
    emoji: '💒',
    isActive: false,
    isTemplate: true,
    category: 'wedding',
    autoCreateLead: true,
    autoEventType: 'wedding',
    autoSendWhatsApp: true,
    fields: [
      { id: 'name', type: 'text', label: 'שם מלא', placeholder: 'שם החתן והכלה', required: true, order: 0 },
      { id: 'phone', type: 'phone', label: 'טלפון', placeholder: '050-1234567', required: true, order: 1 },
      { id: 'email', type: 'email', label: 'אימייל', placeholder: 'email@example.com', required: false, order: 2 },
      { id: 'eventDate', type: 'date', label: 'תאריך החתונה', required: true, order: 3 },
      { id: 'venue', type: 'text', label: 'מקום האירוע / אולם', placeholder: 'שם האולם', required: false, order: 4 },
      { id: 'guestCount', type: 'select', label: 'מספר מוזמנים', required: false, options: ['עד 100', '100-200', '200-300', '300-400', '400+'], order: 5 },
      { id: 'budget', type: 'select', label: 'תקציב משוער', required: false, options: ['עד 5,000₪', '5,000-8,000₪', '8,000-12,000₪', '12,000₪+'], order: 6 },
      { id: 'notes', type: 'textarea', label: 'ספרו לי על החתונה שלכם', placeholder: 'סגנון מוזיקה, בקשות מיוחדות...', required: false, order: 7 },
    ],
  },
  {
    name: 'טופס הרשמה לקורס DJ',
    description: 'טופס לתלמידים מתעניינים בקורסי DJ',
    emoji: '🎧',
    isActive: false,
    isTemplate: true,
    category: 'course',
    autoCreateLead: true,
    autoEventType: 'course',
    autoSendWhatsApp: true,
    fields: [
      { id: 'name', type: 'text', label: 'שם מלא', placeholder: 'השם שלך', required: true, order: 0 },
      { id: 'phone', type: 'phone', label: 'טלפון', placeholder: '050-1234567', required: true, order: 1 },
      { id: 'email', type: 'email', label: 'אימייל', placeholder: 'email@example.com', required: false, order: 2 },
      { id: 'age', type: 'number', label: 'גיל', required: false, order: 3 },
      { id: 'experience', type: 'select', label: 'רמת ניסיון', required: true, options: ['מתחיל לגמרי', 'ניסיון קצת', 'בינוני', 'מתקדם'], order: 4 },
      { id: 'goal', type: 'select', label: 'מה המטרה שלך?', required: true, options: ['תחביב', 'קריירה כ-DJ', 'שדרוג מיומנויות', 'לנגן באירועים'], order: 5 },
      { id: 'equipment', type: 'checkbox', label: 'יש לי ציוד DJ', required: false, order: 6 },
      { id: 'notes', type: 'textarea', label: 'ספר לי קצת על עצמך', placeholder: 'מה מושך אותך בעולם ה-DJ?', required: false, order: 7 },
    ],
  },
  {
    name: 'טופס השכרת ציוד - Fix Mix',
    description: 'טופס להשכרת ציוד קול ותאורה',
    emoji: '🔊',
    isActive: false,
    isTemplate: true,
    category: 'rental',
    autoCreateLead: true,
    autoEventType: 'equipment_rental',
    autoSendWhatsApp: true,
    fields: [
      { id: 'name', type: 'text', label: 'שם מלא', required: true, order: 0 },
      { id: 'phone', type: 'phone', label: 'טלפון', required: true, order: 1 },
      { id: 'rentalDate', type: 'date', label: 'תאריך ההשכרה', required: true, order: 2 },
      { id: 'returnDate', type: 'date', label: 'תאריך החזרה', required: true, order: 3 },
      { id: 'eventType', type: 'select', label: 'סוג האירוע', required: true, options: ['חתונה', 'בר מצווה', 'מסיבה פרטית', 'אירוע עסקי', 'אחר'], order: 4 },
      { id: 'items', type: 'textarea', label: 'פרטי הציוד הנדרש', placeholder: 'רמקולים, תאורה, מיקרופונים...', required: true, order: 5 },
      { id: 'delivery', type: 'select', label: 'משלוח / איסוף עצמי', required: true, options: ['איסוף עצמי', 'משלוח'], order: 6 },
      { id: 'address', type: 'text', label: 'כתובת למשלוח', placeholder: 'רלוונטי רק אם בחרת משלוח', required: false, order: 7 },
      { id: 'notes', type: 'textarea', label: 'הערות נוספות', required: false, order: 8 },
    ],
  },
  {
    name: 'טופס פודקאסט',
    description: 'טופס למשתתפים פוטנציאליים בפודקאסט',
    emoji: '🎙️',
    isActive: false,
    isTemplate: true,
    category: 'podcast',
    autoCreateLead: false,
    autoSendWhatsApp: false,
    fields: [
      { id: 'name', type: 'text', label: 'שם מלא', required: true, order: 0 },
      { id: 'phone', type: 'phone', label: 'טלפון', required: true, order: 1 },
      { id: 'email', type: 'email', label: 'אימייל', required: false, order: 2 },
      { id: 'topic', type: 'text', label: 'נושא שהיית רוצה לדבר עליו', required: true, order: 3 },
      { id: 'bio', type: 'textarea', label: 'ביוגרפיה קצרה', placeholder: 'ספר קצת על עצמך ומה אתה עושה', required: true, order: 4 },
      { id: 'social', type: 'text', label: 'קישור לרשת חברתית', placeholder: 'אינסטגרם / לינקדאין / אתר', required: false, order: 5 },
    ],
  },
  {
    name: 'טופס רשימת תפוצה',
    description: 'הרשמה לרשימת תפוצה לפי תחום עניין',
    emoji: '📨',
    isActive: false,
    isTemplate: true,
    category: 'mailing',
    autoCreateLead: false,
    autoSendWhatsApp: false,
    fields: [
      { id: 'name', type: 'text', label: 'שם מלא', required: true, order: 0 },
      { id: 'phone', type: 'phone', label: 'טלפון', required: true, order: 1 },
      { id: 'email', type: 'email', label: 'אימייל', required: false, order: 2 },
      { id: 'interest', type: 'select', label: 'תחום עניין', required: true, options: ['גדלים בתחום המוזיקה', 'מבצעים והטבות', 'הפצת מוזיקה מקורית', 'חבילות מוזיקה ל-DJs'], order: 3 },
      { id: 'city', type: 'text', label: 'עיר', required: false, order: 4 },
    ],
  },
];
