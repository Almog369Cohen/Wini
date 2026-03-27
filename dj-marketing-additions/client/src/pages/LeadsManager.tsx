import { useState, useEffect } from "react";
import { load, save } from "../lib/storage";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: "instagram" | "facebook" | "website" | "referral" | "whatsapp" | "other";
  type: "wedding" | "course" | "other";
  status: "new" | "contacted" | "meeting" | "proposal" | "closed_won" | "closed_lost";
  eventDate?: string;
  budget?: string;
  notes: string;
  createdAt: string;
  lastContact?: string;
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

const card = "bg-white rounded-2xl shadow-sm border p-4";
const btnOutline = "px-3 py-1.5 rounded-lg border text-sm font-medium";
const btnPrimary = "px-4 py-2 rounded-xl text-white font-medium text-sm bg-[#059cc0]";
const input = "w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#059cc0]/30";

const SOURCE_LABELS: Record<string, string> = { instagram: "אינסטגרם", facebook: "פייסבוק", website: "אתר", referral: "המלצה", whatsapp: "וואטסאפ", other: "אחר" };
const TYPE_LABELS: Record<string, string> = { wedding: "חתונה 💒", course: "קורס 🎧", other: "אחר" };
const STATUS_LABELS: Record<string, string> = { new: "חדש", contacted: "נוצר קשר", meeting: "פגישה", proposal: "הצעת מחיר", closed_won: "נסגר ✅", closed_lost: "אבד ❌" };
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  meeting: "bg-purple-100 text-purple-700",
  proposal: "bg-orange-100 text-orange-700",
  closed_won: "bg-green-100 text-green-700",
  closed_lost: "bg-red-100 text-red-700",
};

const PIPELINE_ORDER: Lead["status"][] = ["new", "contacted", "meeting", "proposal", "closed_won", "closed_lost"];

export default function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>(() => load("dj_leads", []));
  const [tab, setTab] = useState<"pipeline" | "list" | "add">("pipeline");
  const [filterType, setFilterType] = useState<"all" | "wedding" | "course" | "other">("all");

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState<Lead["source"]>("instagram");
  const [type, setType] = useState<Lead["type"]>("wedding");
  const [eventDate, setEventDate] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => { save("dj_leads", leads); }, [leads]);

  const filteredLeads = filterType === "all" ? leads : leads.filter(l => l.type === filterType);

  const addLead = () => {
    if (!name.trim() || !phone.trim()) return;
    const lead: Lead = {
      id: genId(), name, phone, email, source, type, status: "new",
      eventDate: eventDate || undefined, budget: budget || undefined,
      notes, createdAt: new Date().toISOString(),
    };
    setLeads(prev => [lead, ...prev]);
    setName(""); setPhone(""); setEmail(""); setNotes(""); setEventDate(""); setBudget("");
    setTab("pipeline");
  };

  const updateStatus = (id: string, status: Lead["status"]) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, lastContact: new Date().toISOString() } : l));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const activeLeads = leads.filter(l => !["closed_won", "closed_lost"].includes(l.status));
  const wonLeads = leads.filter(l => l.status === "closed_won");
  const conversionRate = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f1f21]">👥 ניהול לידים</h1>
          <p className="text-sm text-gray-500 mt-1">{activeLeads.length} פעילים | {wonLeads.length} נסגרו</p>
        </div>
        <button onClick={() => setTab("add")} className={btnPrimary}>+ ליד חדש</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className={`${card} text-center`}><p className="text-xl font-bold text-[#059cc0]">{leads.length}</p><p className="text-[10px] text-gray-500">סה"כ</p></div>
        <div className={`${card} text-center`}><p className="text-xl font-bold text-yellow-500">{activeLeads.length}</p><p className="text-[10px] text-gray-500">פעילים</p></div>
        <div className={`${card} text-center`}><p className="text-xl font-bold text-[#03b28c]">{wonLeads.length}</p><p className="text-[10px] text-gray-500">נסגרו</p></div>
        <div className={`${card} text-center`}><p className="text-xl font-bold text-purple-500">{conversionRate}%</p><p className="text-[10px] text-gray-500">המרה</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 mb-4 shadow-sm">
        {([["pipeline", "🔄 פייפליין"], ["list", "📋 רשימה"], ["add", "➕ הוסף"]] as const).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === k ? "bg-[#059cc0] text-white" : "text-gray-500"}`}>{v}</button>
        ))}
      </div>

      {/* ===== PIPELINE ===== */}
      {tab === "pipeline" && (
        <div className="space-y-4">
          {PIPELINE_ORDER.map(status => {
            const statusLeads = filteredLeads.filter(l => l.status === status);
            if (statusLeads.length === 0 && ["closed_won", "closed_lost"].includes(status)) return null;
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span>
                  <span className="text-xs text-gray-400">{statusLeads.length}</span>
                </div>
                {statusLeads.length === 0 ? (
                  <div className="bg-gray-100 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">ריק</p></div>
                ) : statusLeads.map(lead => (
                  <div key={lead.id} className={`${card} mb-2`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-sm">{lead.name}</p>
                      <span className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleDateString("he-IL")}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{TYPE_LABELS[lead.type]}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{SOURCE_LABELS[lead.source]}</span>
                      {lead.eventDate && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">📅 {lead.eventDate}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mb-2" dir="ltr">{lead.phone}</p>
                    {lead.notes && <p className="text-xs text-gray-600 mb-2">{lead.notes}</p>}
                    <div className="flex gap-1 flex-wrap">
                      {status !== "closed_won" && status !== "closed_lost" && (
                        <>
                          {PIPELINE_ORDER.filter(s => s !== status && s !== "closed_lost").map(s => (
                            <button key={s} onClick={() => updateStatus(lead.id, s)} className={`text-[10px] px-2 py-1 rounded-lg ${STATUS_COLORS[s]}`}>{STATUS_LABELS[s]}</button>
                          ))}
                        </>
                      )}
                      <button onClick={() => deleteLead(lead.id)} className="text-[10px] px-2 py-1 rounded-lg bg-red-50 text-red-400">🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== LIST ===== */}
      {tab === "list" && (
        <div className="space-y-3">
          <div className="flex gap-2 mb-2">
            {(["all", "wedding", "course", "other"] as const).map(f => (
              <button key={f} onClick={() => setFilterType(f)} className={`${btnOutline} ${filterType === f ? "bg-[#059cc0] text-white border-[#059cc0]" : "text-gray-600 border-gray-200"}`}>
                {f === "all" ? "הכל" : TYPE_LABELS[f]}
              </button>
            ))}
          </div>
          {filteredLeads.map(lead => (
            <div key={lead.id} className={`${card} border-r-4`} style={{ borderRightColor: lead.status === "closed_won" ? "#03b28c" : lead.status === "closed_lost" ? "#ef4444" : "#059cc0" }}>
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">{lead.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status]}`}>{STATUS_LABELS[lead.status]}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1" dir="ltr">{lead.phone} {lead.email && `| ${lead.email}`}</p>
              <div className="flex gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{TYPE_LABELS[lead.type]}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{SOURCE_LABELS[lead.source]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== ADD ===== */}
      {tab === "add" && (
        <div className={card}>
          <h2 className="font-bold text-[#1f1f21] mb-4">ליד חדש</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">שם *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="שם הליד" className={input} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">טלפון *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="050-0000000" className={input} dir="ltr" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">אימייל</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className={input} dir="ltr" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">מקור</label>
              <div className="flex gap-2 flex-wrap">
                {(Object.entries(SOURCE_LABELS) as [Lead["source"], string][]).map(([k, v]) => (
                  <button key={k} onClick={() => setSource(k)} className={`${btnOutline} ${source === k ? "bg-[#059cc0] text-white border-[#059cc0]" : "text-gray-600 border-gray-200"}`}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">סוג</label>
              <div className="flex gap-2">
                {(Object.entries(TYPE_LABELS) as [Lead["type"], string][]).map(([k, v]) => (
                  <button key={k} onClick={() => setType(k)} className={`${btnOutline} ${type === k ? "bg-[#03b28c] text-white border-[#03b28c]" : "text-gray-600 border-gray-200"}`}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">תאריך אירוע</label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className={input} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">תקציב</label>
              <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="למשל: 5,000-8,000" className={input} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">הערות</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="פרטים נוספים..." className={`${input} min-h-[80px] resize-none`} />
            </div>
            <button onClick={addLead} disabled={!name.trim() || !phone.trim()} className={`w-full py-3 rounded-xl text-white font-bold ${!name.trim() || !phone.trim() ? "bg-gray-300" : "bg-[#059cc0]"}`}>
              + הוסף ליד
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
