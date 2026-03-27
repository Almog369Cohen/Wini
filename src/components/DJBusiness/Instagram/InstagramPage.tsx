import { useState } from 'react';

interface InstagramPageProps {
  showToast: (msg: string) => void;
}

interface FlowTemplate {
  id: string;
  name: string;
  trigger: string;
  description: string;
  steps: string[];
  isActive: boolean;
}

const DEFAULT_FLOWS: FlowTemplate[] = [
  {
    id: '1',
    name: 'ליד חתונה מאינסטגרם',
    trigger: 'הודעת DM עם מילת מפתח: חתונה / תאריך / DJ',
    description: 'אוטומציה ללכידת ליד מ-DM באינסטגרם',
    steps: ['זיהוי מילת מפתח', 'שליחת הודעה אוטומטית', 'בקשת פרטים (שם, תאריך, מקום)', 'הוספה ל-CRM', 'שליחת לינק לבדיקת התאמה'],
    isActive: true,
  },
  {
    id: '2',
    name: 'ליד קורס מאינסטגרם',
    trigger: 'הודעת DM עם מילת מפתח: קורס / ללמוד / DJ מתחיל',
    description: 'אוטומציה ללכידת ליד לקורס DJ',
    steps: ['זיהוי מילת מפתח', 'שליחת הודעה: ״היי! רוצה לשמוע על הקורס?״', 'בקשת פרטים (שם, גיל, ניסיון)', 'שליחת מידע על הקורס', 'הוספה ל-CRM'],
    isActive: true,
  },
  {
    id: '3',
    name: 'תגובה לסטורי — Engagement',
    trigger: 'תגובה על סטורי',
    description: 'אוטומציה ליצירת אינטראקציה עם עוקבים',
    steps: ['זיהוי תגובה', 'שליחת תודה + שאלה', 'המשך שיחה אם מגיב', 'סינון — ליד רלוונטי?', 'הוספה לרשימה'],
    isActive: false,
  },
  {
    id: '4',
    name: 'ברוכים הבאים — עוקב חדש',
    trigger: 'עוקב חדש',
    description: 'הודעת פתיחה אוטומטית לעוקב חדש',
    steps: ['זיהוי עוקב חדש', 'המתנה 2 שעות', 'שליחת הודעת ברוכים הבאים', 'הצגת שירותים + קישור'],
    isActive: false,
  },
  {
    id: '5',
    name: 'תגובה אוטומטית לפוסט',
    trigger: 'תגובה על פוסט עם מילת מפתח',
    description: 'שליחת DM אוטומטי למי שמגיב על פוסטים',
    steps: ['מעקב אחרי תגובות', 'זיהוי מילת מפתח (מחיר, פרטים, מעוניין)', 'שליחת DM עם מידע', 'לכידת ליד'],
    isActive: false,
  },
];

const card = 'bg-white rounded-2xl shadow-sm border p-4';
const btnOutline = 'px-3 py-1.5 rounded-lg border text-sm font-medium';

export default function InstagramPage({ showToast }: InstagramPageProps) {
  const [flows, setFlows] = useState<FlowTemplate[]>(DEFAULT_FLOWS);
  const [selectedFlow, setSelectedFlow] = useState<FlowTemplate | null>(null);

  const toggleFlow = (id: string) => {
    setFlows(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
    const flow = flows.find(f => f.id === id);
    showToast(flow?.isActive ? 'אוטומציה כובתה' : 'אוטומציה הופעלה');
  };

  const activeCount = flows.filter(f => f.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f1f21]">📱 אינסטגרם & אוטומציות</h1>
          <p className="text-sm text-gray-500 mt-1">{activeCount} אוטומציות פעילות</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={`${card} text-center`}>
          <p className="text-xl font-bold text-[#059cc0]">{flows.length}</p>
          <p className="text-[10px] text-gray-500">אוטומציות</p>
        </div>
        <div className={`${card} text-center`}>
          <p className="text-xl font-bold text-[#03b28c]">{activeCount}</p>
          <p className="text-[10px] text-gray-500">פעילות</p>
        </div>
        <div className={`${card} text-center`}>
          <p className="text-xl font-bold text-purple-500">0</p>
          <p className="text-[10px] text-gray-500">לידים השבוע</p>
        </div>
      </div>

      {/* Connection status */}
      <div className={`${card} mb-4 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <div>
              <p className="font-bold text-sm">חיבור אינסטגרם</p>
              <p className="text-xs text-gray-500">ManyChat / Meta API</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">דורש חיבור</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          חבר את חשבון האינסטגרם שלך דרך ManyChat או Meta Business API כדי להפעיל אוטומציות
        </p>
      </div>

      {/* Flows list */}
      <h2 className="font-bold text-[#1f1f21] mb-3">תבניות אוטומציה</h2>
      <div className="space-y-3">
        {flows.map(flow => (
          <div key={flow.id} className={`${card} ${flow.isActive ? 'border-[#03b28c]/30' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFlow(flow.id)}
                  className={`w-10 h-6 rounded-full flex-shrink-0 transition-colors ${flow.isActive ? 'bg-[#03b28c]' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow mx-1 mt-1 transition-transform ${flow.isActive ? 'translate-x-4' : ''}`} />
                </button>
                <p className="font-bold text-sm">{flow.name}</p>
              </div>
              <button
                onClick={() => setSelectedFlow(selectedFlow?.id === flow.id ? null : flow)}
                className="text-xs text-[#059cc0]"
              >
                {selectedFlow?.id === flow.id ? 'סגור' : 'פרטים'}
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-1">{flow.description}</p>
            <p className="text-[10px] text-gray-400">טריגר: {flow.trigger}</p>

            {selectedFlow?.id === flow.id && (
              <div className="mt-3 bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-700 mb-2">שלבים:</p>
                {flow.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#059cc0]/10 text-[#059cc0] text-[10px] flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                    <p className="text-xs text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
