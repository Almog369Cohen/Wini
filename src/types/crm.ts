// CRM Types for DJ Almog Cohen Business System

export type LeadStatus =
  | 'new'           // ליד חדש
  | 'no_answer'     // לא ענה
  | 'call_scheduled' // נקבעה שיחה
  | 'quote_sent'    // הצעת מחיר נשלחה
  | 'contract_sent' // חוזה נשלח
  | 'signed'        // חתם
  | 'cancelled';    // בוטל

export type EventType =
  | 'wedding'       // חתונה
  | 'bar_mitzvah'   // בר מצווה
  | 'henna'         // חינה
  | 'private_event' // אירוע פרטי
  | 'corporate'     // אירוע עסקי
  | 'course'        // קורס
  | 'mentoring'     // ליווי
  | 'equipment_rental'; // השכרת ציוד

export type LeadSource =
  | 'instagram'
  | 'facebook'
  | 'whatsapp'
  | 'website'
  | 'referral'
  | 'form'
  | 'phone'
  | 'responder'     // רב מסר
  | 'organic'
  | 'other';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  eventType?: EventType;
  eventDate?: string; // ISO date
  source: LeadSource;
  notes?: string;
  amount?: number;
  venue?: string;
  guestCount?: number;
  callDate?: string; // ISO date - מועד שיחה
  requests?: string; // בקשות לקוח
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  lastContactAt?: string; // ISO timestamp
  followUpCount: number;
  tags: string[];
}

export interface Customer {
  id: string;
  leadId?: string; // Reference to original lead
  name: string;
  phone: string;
  email?: string;
  eventType: EventType;
  eventDate: string;
  address?: string;
  amount: number;
  invoiceSent: boolean;
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  source: LeadSource;
  notes?: string;
  createdAt: string;
  lastContactAt?: string;
}

// Equipment Rental (Fix Mix)
export interface EquipmentRental {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  rentalDate: string;
  returnDate: string;
  items: string;
  extras?: string;
  delivery: 'pickup' | 'delivery';
  deliveryAddress?: string;
  receiptNumber?: string;
  idPhoto?: string; // URL
  status: 'pending' | 'active' | 'returned' | 'overdue';
  notes?: string;
  createdAt: string;
}

// Dashboard KPIs
export interface CRMStats {
  totalLeads: number;
  newLeadsThisMonth: number;
  conversionRate: number; // percentage
  totalRevenue: number;
  expectedRevenue: number;
  upcomingEvents: number;
  leadsByStatus: Record<LeadStatus, number>;
  leadsByEventType: Record<EventType, number>;
  leadsBySource: Record<LeadSource, number>;
  monthlyLeads: { month: string; count: number }[];
}

// Status display info
export const LEAD_STATUS_INFO: Record<LeadStatus, { label: string; color: string; emoji: string; order: number }> = {
  new: { label: 'ליד חדש', color: '#059cc0', emoji: '🆕', order: 0 },
  no_answer: { label: 'לא ענה', color: '#f59e0b', emoji: '📵', order: 1 },
  call_scheduled: { label: 'נקבעה שיחה', color: '#8b5cf6', emoji: '📞', order: 2 },
  quote_sent: { label: 'הצעת מחיר נשלחה', color: '#06b6d4', emoji: '📄', order: 3 },
  contract_sent: { label: 'חוזה נשלח', color: '#f97316', emoji: '📝', order: 4 },
  signed: { label: 'חתם', color: '#03b28c', emoji: '✅', order: 5 },
  cancelled: { label: 'בוטל', color: '#ef4444', emoji: '❌', order: 6 },
};

export const EVENT_TYPE_INFO: Record<EventType, { label: string; emoji: string }> = {
  wedding: { label: 'חתונה', emoji: '💒' },
  bar_mitzvah: { label: 'בר מצווה', emoji: '🎉' },
  henna: { label: 'חינה', emoji: '🎊' },
  private_event: { label: 'אירוע פרטי', emoji: '🎈' },
  corporate: { label: 'אירוע עסקי', emoji: '🏢' },
  course: { label: 'קורס DJ', emoji: '🎧' },
  mentoring: { label: 'ליווי', emoji: '🎓' },
  equipment_rental: { label: 'השכרת ציוד', emoji: '🔊' },
};

export const LEAD_SOURCE_INFO: Record<LeadSource, { label: string; emoji: string }> = {
  instagram: { label: 'אינסטגרם', emoji: '📸' },
  facebook: { label: 'פייסבוק', emoji: '👤' },
  whatsapp: { label: 'וואטסאפ', emoji: '💬' },
  website: { label: 'אתר', emoji: '🌐' },
  referral: { label: 'הפניה', emoji: '🤝' },
  form: { label: 'טופס', emoji: '📋' },
  phone: { label: 'טלפון', emoji: '📱' },
  responder: { label: 'רב מסר', emoji: '📨' },
  organic: { label: 'אורגני', emoji: '🌱' },
  other: { label: 'אחר', emoji: '📌' },
};
