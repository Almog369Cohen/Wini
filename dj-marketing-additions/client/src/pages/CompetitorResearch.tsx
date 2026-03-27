import { useState, useEffect } from "react";
import { load, save, KEYS, type StoredCompetitor } from "../lib/storage";

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

const SAMPLE_COMPETITORS: StoredCompetitor[] = [
  { id: "c1", name: "DJ ישראלי 1", instagramHandle: "@israeli_dj_1", specialization: "חתונות פרימיום", followers: 15000, avgLikes: 350, engagementRate: 2.3, mainMessages: "האנרגיה שלנו, המסיבה שלכם", strengths: "תוכן ויזואלי חזק", weaknesses: "גנרי, אפס ערך", positioningGaps: "לא מדבר על חוויה רגשית", contentStyle: "קליפים מרחבות עם אורות", createdAt: new Date().toISOString() },
  { id: "c2", name: "DJ ישראלי 2", instagramHandle: "@israeli_dj_2", specialization: "חתונות + בר מצווה", followers: 8000, avgLikes: 120, engagementRate: 1.5, mainMessages: "שירותיות, מחיר הוגן", strengths: "אותנטי, מראה עבודה", weaknesses: "נראה זול, אין מיצוב", positioningGaps: "לא מדבר על קריאת קהל", contentStyle: "לפני/אחרי, מאחורי הקלעים", createdAt: new Date().toISOString() },
  { id: "c3", name: "DJ ישראלי 3", instagramHandle: "@israeli_dj_3", specialization: "אירועים יוקרתיים", followers: 22000, avgLikes: 500, engagementRate: 2.1, mainMessages: "לוקסוס, VIP, חוויה", strengths: "מיצוב פרימיום, ציוד יוקרתי", weaknesses: "מנותק, לא אנושי", positioningGaps: "רק יוקרה בלי רגש", contentStyle: "וידאו מקצועי, ציוד יקר", createdAt: new Date().toISOString() },
  { id: "c4", name: "DJ ישראלי 4", instagramHandle: "@israeli_dj_4", specialization: "חתונות דתיות", followers: 5000, avgLikes: 200, engagementRate: 4.0, mainMessages: "מוזיקה מזרחית, אנרגיה", strengths: "נישה ברורה, קהל נאמן", weaknesses: "קהל מוגבל", positioningGaps: "לא מלמד, לא חדשני", contentStyle: "הופעות חיות, קהל קופץ", createdAt: new Date().toISOString() },
  { id: "c5", name: "DJ ישראלי 5", instagramHandle: "@israeli_dj_5", specialization: "קורסי DJ + חתונות", followers: 12000, avgLikes: 180, engagementRate: 1.5, mainMessages: "למד DJ, תהיה מקצוען", strengths: "תוכן חינוכי, מגוון", weaknesses: "פיזור, לא ברור מה העיקרי", positioningGaps: "לא מדבר על חוויה, רק על ציוד", contentStyle: "טיפים, שיעורים קצרים", createdAt: new Date().toISOString() },
];

const INSIGHTS = [
  { category: "מיצוב", text: "רוב ה-DJs ממצבים עצמם על מחיר או ניסיון. מעטים מדברים על חוויה רגשית.", priority: "high" as const },
  { category: "תוכן", text: "80% מהתוכן = קליפים מרחבות. כמעט אף אחד לא נותן ערך אמיתי.", priority: "high" as const },
  { category: "פער", text: "אין DJ ישראלי שמשלב תוכן מקצועי + מותג חזק + חינוך.", priority: "high" as const },
  { category: "קהל", text: "שוק חתונות הפרימיום צומח. זוגות מוכנים לשלם יותר עבור חוויה.", priority: "medium" as const },
  { category: "טרנד", text: "רילסים 15-30 שניות מקבלים פי 3 מעורבות מתוכן ארוך.", priority: "medium" as const },
  { category: "פער", text: "אף מתחרה לא משתמש ב-AI או טכנולוגיה כנקודת מבדלת.", priority: "high" as const },
  { category: "מסר", text: "המילים הנפוצות ביותר: 'אנרגיה', 'מסיבה', 'מטורף'. חסר: 'חוויה', 'דיוק', 'הובלה'.", priority: "medium" as const },
];

const btnOutline = "px-3 py-1.5 rounded-lg border text-sm font-medium";
const btnPrimary = "px-4 py-2 rounded-xl text-white font-medium text-sm bg-[#059cc0]";
const card = "bg-white rounded-2xl shadow-sm border p-4";
const input = "w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#059cc0]/30";

export default function CompetitorResearch() {
  const [competitors, setCompetitors] = useState<StoredCompetitor[]>(() => {
    const saved = load<StoredCompetitor[]>(KEYS.COMPETITORS, []);
    return saved.length > 0 ? saved : SAMPLE_COMPETITORS;
  });
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<"list" | "insights" | "manus">("list");

  // Form
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [spec, setSpec] = useState("");

  useEffect(() => { save(KEYS.COMPETITORS, competitors); }, [competitors]);

  const addCompetitor = () => {
    if (!name.trim() || !handle.trim()) return;
    setCompetitors(prev => [...prev, { id: genId(), name, instagramHandle: handle, specialization: spec, mainMessages: "", strengths: "", weaknesses: "", positioningGaps: "", contentStyle: "", createdAt: new Date().toISOString() }]);
    setName(""); setHandle(""); setSpec(""); setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f1f21]">🔍 מחקר מתחרים</h1>
          <p className="text-sm text-gray-500 mt-1">{competitors.length} מתחרים במעקב</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className={btnPrimary}>+ הוסף מתחרה</button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className={`${card} mb-4`}>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="שם" className={input} />
            <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="@instagram" className={input} dir="ltr" />
            <input value={spec} onChange={e => setSpec(e.target.value)} placeholder="התמחות" className={input} />
          </div>
          <div className="flex gap-2">
            <button onClick={addCompetitor} disabled={!name.trim()} className={btnPrimary}>הוסף</button>
            <button onClick={() => setShowAdd(false)} className={`${btnOutline} text-gray-600`}>ביטול</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className={`${card} text-center`}><p className="text-xl font-bold text-[#059cc0]">{competitors.length}</p><p className="text-[10px] text-gray-500">מתחרים</p></div>
        <div className={`${card} text-center`}><p className="text-xl font-bold text-[#03b28c]">{INSIGHTS.filter(i => i.priority === "high").length}</p><p className="text-[10px] text-gray-500">תובנות חשובות</p></div>
        <div className={`${card} text-center`}><p className="text-xl font-bold text-purple-500">{INSIGHTS.filter(i => i.category === "פער").length}</p><p className="text-[10px] text-gray-500">פערי מיצוב</p></div>
        <div className={`${card} text-center`}><p className="text-xl font-bold text-orange-500">{competitors.reduce((s, c) => s + (c.followers || 0), 0).toLocaleString()}</p><p className="text-[10px] text-gray-500">עוקבי מתחרים</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 mb-4 shadow-sm">
        {([["list", "👥 מתחרים"], ["insights", "💡 תובנות"], ["manus", "🤖 משימות Manus"]] as const).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === k ? "bg-[#059cc0] text-white" : "text-gray-500"}`}>{v}</button>
        ))}
      </div>

      {/* Competitors list */}
      {tab === "list" && (
        <div className="space-y-3">
          {competitors.map(comp => (
            <div key={comp.id} className={`${card} hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#059cc0] to-[#03b28c] flex items-center justify-center text-white font-bold">{comp.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{comp.name}</p>
                  <p className="text-xs text-gray-500" dir="ltr">{comp.instagramHandle}</p>
                </div>
                {comp.followers && <div className="text-left"><p className="text-sm font-bold">{comp.followers.toLocaleString()}</p><p className="text-[10px] text-gray-500">עוקבים</p></div>}
                {comp.engagementRate && <div className="text-left"><p className="text-sm font-bold text-[#03b28c]">{comp.engagementRate}%</p><p className="text-[10px] text-gray-500">מעורבות</p></div>}
                <button onClick={() => setCompetitors(prev => prev.filter(c => c.id !== comp.id))} className="text-gray-300 hover:text-red-400">×</button>
              </div>
              {comp.specialization && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{comp.specialization}</span>}
              {comp.strengths && <p className="text-xs text-gray-600 mt-2">💪 {comp.strengths}</p>}
              {comp.weaknesses && <p className="text-xs text-gray-600">⚠️ {comp.weaknesses}</p>}
              {comp.positioningGaps && <p className="text-xs text-[#059cc0]">🎯 {comp.positioningGaps}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {tab === "insights" && (
        <div className="space-y-3">
          {INSIGHTS.map((ins, i) => (
            <div key={i} className={`${card} border-r-4 ${ins.priority === "high" ? "border-r-[#059cc0]" : "border-r-gray-300"}`}>
              <div className="flex gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{ins.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${ins.priority === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{ins.priority === "high" ? "חשוב" : "בינוני"}</span>
              </div>
              <p className="text-sm">{ins.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Manus tasks */}
      {tab === "manus" && (
        <div className="space-y-3">
          <div className={`${card} bg-purple-50/50 border-purple-200`}>
            <h3 className="font-bold text-purple-700 mb-3">🤖 מה Manus יכול לעשות עם Meta</h3>
            {[
              "לנתח 20-30 DJs ישראלים באינסטגרם",
              "למשוך נתוני עוקבים ומעורבות מ-Meta",
              "לזהות פערי מיצוב ותוכן",
              "ליצור דוח מתחרים מפורט",
              "לנתח קמפיינים של מתחרים ב-Meta Ads",
              "להציע קמפיינים אופטימליים",
              "לנטר ביצועי קמפיינים בזמן אמת",
              "לנתח תגובות ו-DMs לזיהוי לידים",
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg mb-1">
                <span className="text-sm">{["🔍", "📊", "🎯", "📋", "💰", "🚀", "📈", "💬"][i]}</span>
                <p className="text-sm flex-1">{task}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">ממתין</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
