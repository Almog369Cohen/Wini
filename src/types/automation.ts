// Automation Engine Types

export type TriggerType =
  | 'lead_created'
  | 'status_changed'
  | 'form_submitted'
  | 'calcom_booking'
  | 'instagram_comment'
  | 'scheduled'
  | 'manual';

export type ActionType =
  | 'send_whatsapp'
  | 'send_whatsapp_file'
  | 'update_lead_status'
  | 'create_lead'
  | 'create_customer'
  | 'send_instagram_dm'
  | 'reply_instagram_comment'
  | 'add_tag'
  | 'wait'
  | 'condition';

export interface AutomationTrigger {
  type: TriggerType;
  config: Record<string, unknown>;
  // e.g., { status: 'new' } for status_changed
  // e.g., { keyword: 'מאורסים', postId: '...' } for instagram_comment
  // e.g., { schedule: '0 10 * * *' } for scheduled
}

export interface AutomationAction {
  id: string;
  type: ActionType;
  config: Record<string, unknown>;
  // e.g., { template: 'welcome', phone: '{{lead.phone}}' } for send_whatsapp
  // e.g., { message: '...', recipientId: '{{contact.igId}}' } for send_instagram_dm
  // e.g., { duration: 3600000 } for wait (1 hour in ms)
  // e.g., { field: 'status', operator: 'equals', value: 'new' } for condition
  nextActionId?: string; // for sequential execution
  trueActionId?: string; // for condition branches
  falseActionId?: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  isActive: boolean;
  isTemplate: boolean;
  category: 'leads' | 'whatsapp' | 'instagram' | 'scheduling' | 'custom';
  emoji: string;
  runCount: number;
  lastRunAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationLog {
  id: string;
  automationId: string;
  automationName: string;
  triggeredBy: string; // description of what triggered it
  status: 'success' | 'failed' | 'skipped';
  actions: {
    actionId: string;
    type: ActionType;
    status: 'success' | 'failed' | 'skipped';
    result?: string;
    error?: string;
  }[];
  timestamp: string;
}

// Pre-built automation templates
export const AUTOMATION_TEMPLATES: Omit<Automation, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'lastRunAt'>[] = [
  {
    name: 'וולקאם ליד חדש',
    description: 'שליחת הודעת ברוכים הבאים בוואטסאפ כשנכנס ליד חדש',
    trigger: { type: 'lead_created', config: {} },
    actions: [{
      id: 'a1',
      type: 'send_whatsapp',
      config: {
        template: 'welcome',
        message: 'היי {{lead.name}}! 👋\nתודה שפנית אליי.\nאני אלמוג כהן, DJ לאירועים.\nאשמח לשמוע עוד על האירוע שלכם!\nמתי נוח לדבר? 🎵',
      },
    }],
    isActive: false,
    isTemplate: true,
    category: 'leads',
    emoji: '👋',
  },
  {
    name: 'תזכורת ליד - לא ענה',
    description: 'שליחת תזכורת יומית ללידים שלא ענו',
    trigger: { type: 'scheduled', config: { schedule: '0 10 * * *', description: 'כל יום ב-10:00' } },
    actions: [{
      id: 'a1',
      type: 'condition',
      config: { field: 'status', operator: 'equals', value: 'no_answer' },
      trueActionId: 'a2',
    }, {
      id: 'a2',
      type: 'send_whatsapp',
      config: {
        template: 'reminder',
        message: 'היי {{lead.name}} 😊\nניסיתי ליצור קשר ולא הצלחתי.\nאשמח לדבר על האירוע שלכם!\nאפשר לחזור אליי כשנוח 🎵',
      },
    }],
    isActive: false,
    isTemplate: true,
    category: 'leads',
    emoji: '🔔',
  },
  {
    name: 'חוזה נשלח - הודעת WhatsApp',
    description: 'שליחת הודעה + קובץ חוזה כשהסטטוס משתנה לחוזה נשלח',
    trigger: { type: 'status_changed', config: { toStatus: 'contract_sent' } },
    actions: [{
      id: 'a1',
      type: 'send_whatsapp',
      config: {
        template: 'contract',
        message: 'היי {{lead.name}}! 📝\nשלחתי לך את החוזה.\nאשמח שתעבור על הפרטים ונסגור!\nיש שאלות? אני כאן 🎵',
      },
    }, {
      id: 'a2',
      type: 'send_whatsapp_file',
      config: {
        fileUrl: '{{lead.contractUrl}}',
        fileName: 'חוזה - {{lead.name}}.pdf',
      },
    }],
    isActive: false,
    isTemplate: true,
    category: 'whatsapp',
    emoji: '📝',
  },
  {
    name: 'נקבעה שיחה - Cal.com',
    description: 'עדכון סטטוס ושליחת אישור כשנקבעת שיחה דרך Cal.com',
    trigger: { type: 'calcom_booking', config: { event: 'BOOKING_CREATED' } },
    actions: [{
      id: 'a1',
      type: 'update_lead_status',
      config: { status: 'call_scheduled' },
    }, {
      id: 'a2',
      type: 'send_whatsapp',
      config: {
        template: 'call_confirmed',
        message: 'מעולה {{lead.name}}! 📞\nהשיחה נקבעה ל-{{booking.date}} בשעה {{booking.time}}.\nאדבר איתכם בקרוב! 🎵',
      },
    }],
    isActive: false,
    isTemplate: true,
    category: 'scheduling',
    emoji: '📅',
  },
  {
    name: 'לקוח חתם - מעבר ללקוחות',
    description: 'יצירת רשומת לקוח והודעת ברכה כשליד חותם',
    trigger: { type: 'status_changed', config: { toStatus: 'signed' } },
    actions: [{
      id: 'a1',
      type: 'create_customer',
      config: {},
    }, {
      id: 'a2',
      type: 'send_whatsapp',
      config: {
        template: 'signed',
        message: 'מזל טוב {{lead.name}}! 🎉\nשמח שסגרנו!\nאני כבר מתחיל להתכונן לאירוע שלכם.\nנהיה בקשר! 🎵',
      },
    }],
    isActive: false,
    isTemplate: true,
    category: 'leads',
    emoji: '🎉',
  },
  {
    name: 'אינסטגרם - keyword מאורסים',
    description: 'תגובה אוטומטית + DM כשמישהו מגיב "מאורסים" על פוסט',
    trigger: { type: 'instagram_comment', config: { keyword: 'מאורסים' } },
    actions: [{
      id: 'a1',
      type: 'reply_instagram_comment',
      config: {
        replies: ['בשעה טובה! 🎉', 'מזל טוב אהובים! 💕', 'איזה כיף, שיהיה במזל! ✨'],
      },
    }, {
      id: 'a2',
      type: 'send_instagram_dm',
      config: {
        message: 'איזה כיף שאתם בדרך לחתונה! 💒\nהכנתי לכם כמה דברים שיעזרו לכם בדרך:\n\n🎵 בדיקת התאמה לאירוע\n📋 טיפים לבחירת DJ\n📞 שיחת היכרות\n\nמעוניינים? 😊',
      },
    }, {
      id: 'a3',
      type: 'create_lead',
      config: {
        source: 'instagram',
        eventType: 'wedding',
      },
    }],
    isActive: false,
    isTemplate: true,
    category: 'instagram',
    emoji: '📸',
  },
  {
    name: 'טופס חדש - יצירת ליד',
    description: 'יצירת ליד חדש ושליחת וולקאם כשמוגש טופס',
    trigger: { type: 'form_submitted', config: {} },
    actions: [{
      id: 'a1',
      type: 'create_lead',
      config: {},
    }, {
      id: 'a2',
      type: 'send_whatsapp',
      config: {
        template: 'form_welcome',
        message: 'היי {{lead.name}}! 🎵\nקיבלתי את הפרטים שלך.\nאני אלמוג כהן, ואשמח לדבר על האירוע!\nאחזור אליך בהקדם 😊',
      },
    }],
    isActive: false,
    isTemplate: true,
    category: 'leads',
    emoji: '📋',
  },
  {
    name: 'Follow-up אוטומטי - 3 ימים',
    description: 'שליחת הודעת follow-up 3 ימים אחרי שליחת הצעת מחיר',
    trigger: { type: 'status_changed', config: { toStatus: 'quote_sent' } },
    actions: [{
      id: 'a1',
      type: 'wait',
      config: { duration: 259200000, description: '3 ימים' },
      nextActionId: 'a2',
    }, {
      id: 'a2',
      type: 'send_whatsapp',
      config: {
        template: 'followup',
        message: 'היי {{lead.name}} 😊\nרציתי לבדוק אם הספקת לעבור על ההצעה.\nאשמח לענות על כל שאלה!\nמה אומרים? 🎵',
      },
    }],
    isActive: false,
    isTemplate: true,
    category: 'leads',
    emoji: '🔄',
  },
];
