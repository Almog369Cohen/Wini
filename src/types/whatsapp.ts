// WhatsApp (GREEN-API) Types

export interface WhatsAppConfig {
  idInstance: string;
  apiTokenInstance: string;
  phoneNumber: string; // The connected WhatsApp number
  isConnected: boolean;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'welcome' | 'reminder' | 'contract' | 'confirmation' | 'followup' | 'custom';
  message: string;
  variables: string[]; // e.g., ['{{lead.name}}', '{{lead.eventDate}}']
  emoji: string;
  createdAt: string;
}

export interface WhatsAppMessage {
  id: string;
  chatId: string; // e.g., 972551234567@c.us
  direction: 'outgoing' | 'incoming';
  type: 'text' | 'file';
  content: string;
  fileName?: string;
  fileUrl?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  leadId?: string;
  leadName?: string;
  automationId?: string; // Which automation triggered this
  timestamp: string;
}

// GREEN-API endpoint helpers
export const GREEN_API_BASE = 'https://api.green-api.com';

export function getGreenApiUrl(idInstance: string, method: string, apiToken: string): string {
  return `${GREEN_API_BASE}/waInstance${idInstance}/${method}/${apiToken}`;
}

export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  // Israeli numbers: convert 05X to 9725X
  if (cleaned.startsWith('05')) {
    cleaned = '972' + cleaned.slice(1);
  }
  // Ensure it starts with country code
  if (!cleaned.startsWith('972')) {
    cleaned = '972' + cleaned;
  }
  return cleaned + '@c.us';
}

// Default templates
export const DEFAULT_WHATSAPP_TEMPLATES: Omit<WhatsAppTemplate, 'id' | 'createdAt'>[] = [
  {
    name: 'ברוכים הבאים',
    category: 'welcome',
    message: 'היי {{name}}! 👋\nתודה שפנית אליי.\nאני אלמוג כהן, DJ לאירועים וחתונות.\nאשמח לשמוע עוד על האירוע שלכם!\nמתי נוח לדבר? 🎵',
    variables: ['{{name}}'],
    emoji: '👋',
  },
  {
    name: 'תזכורת - לא ענה',
    category: 'reminder',
    message: 'היי {{name}} 😊\nניסיתי ליצור קשר ולא הצלחתי.\nאשמח לדבר על האירוע שלכם!\nאפשר לחזור אליי כשנוח 🎵',
    variables: ['{{name}}'],
    emoji: '🔔',
  },
  {
    name: 'אישור שיחה',
    category: 'confirmation',
    message: 'מעולה {{name}}! 📞\nהשיחה נקבעה ל-{{date}} בשעה {{time}}.\nאדבר איתכם בקרוב! 🎵',
    variables: ['{{name}}', '{{date}}', '{{time}}'],
    emoji: '📅',
  },
  {
    name: 'שליחת חוזה',
    category: 'contract',
    message: 'היי {{name}}! 📝\nשלחתי לך את החוזה.\nאשמח שתעבור על הפרטים ונסגור!\nיש שאלות? אני כאן 🎵',
    variables: ['{{name}}'],
    emoji: '📝',
  },
  {
    name: 'Follow-up',
    category: 'followup',
    message: 'היי {{name}} 😊\nרציתי לבדוק אם הספקת לעבור על ההצעה.\nאשמח לענות על כל שאלה!\nמה אומרים? 🎵',
    variables: ['{{name}}'],
    emoji: '🔄',
  },
  {
    name: 'מזל טוב - חתם',
    category: 'confirmation',
    message: 'מזל טוב {{name}}! 🎉\nשמח שסגרנו!\nאני כבר מתחיל להתכונן לאירוע שלכם.\nנהיה בקשר! 🎵',
    variables: ['{{name}}'],
    emoji: '🎉',
  },
];
