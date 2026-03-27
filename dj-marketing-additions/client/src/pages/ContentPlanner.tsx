import { useState, useEffect } from "react";
import { CONTENT_IDEAS, type ContentIdea } from "../../../data/content-ideas";
import { load, save, KEYS } from "../lib/storage";

interface ScheduledPost {
  id: string;
  ideaId: number;
  topic: string;
  audience: string;
  contentType: string;
  scheduledDate: string;
  status: "draft" | "ready" | "published";
  content?: string;
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

const card = "bg-white rounded-2xl shadow-sm border p-4";
const btnOutline = "px-3 py-1.5 rounded-lg border text-sm font-medium";
const btnPrimary = "px-4 py-2 rounded-xl text-white font-medium text-sm bg-[#059cc0]";

const AUDIENCE_LABELS: Record<string, string> = { wedding: "חתונות 💒", course: "קורסי DJ 🎧", brand: "מותג 🎵" };
const TYPE_LABELS: Record<string, string> = { caption: "כיתוב", hook: "הוק", reel_script: "ריל", story: "סטורי", carousel: "קרוסלה" };
const PRIORITY_COLORS: Record<string, string> = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-gray-100 text-gray-600" };
const PRIORITY_LABELS: Record<string, string> = { high: "גבוה", medium: "בינוני", low: "נמוך" };

const DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export default function ContentPlanner() {
  const [scheduled, setScheduled] = useState<ScheduledPost[]>(() => load("dj_scheduled", []));
  const [filter, setFilter] = useState<"all" | "wedding" | "course" | "brand">("all");
  const [tab, setTab] = useState<"calendar" | "ideas" | "queue">("calendar");
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");

  useEffect(() => { save("dj_scheduled", scheduled); }, [scheduled]);

  const weekDates = getWeekDates();

  const filteredIdeas = CONTENT_IDEAS.filter(i =>
    (filter === "all" || i.audience === filter) && !i.used
  );

  const addToSchedule = (idea: ContentIdea, date: string) => {
    const post: ScheduledPost = {
      id: genId(),
      ideaId: idea.id,
      topic: idea.topic,
      audience: idea.audience,
      contentType: idea.contentType,
      scheduledDate: date,
      status: "draft",
    };
    setScheduled(prev => [...prev, post]);
    setSelectedIdea(null);
    setScheduleDate("");
  };

  const removeFromSchedule = (id: string) => {
    setScheduled(prev => prev.filter(p => p.id !== id));
  };

  const updateStatus = (id: string, status: ScheduledPost["status"]) => {
    setScheduled(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const STATUS_COLORS: Record<string, string> = { draft: "bg-gray-100 text-gray-600", ready: "bg-[#03b28c]/10 text-[#03b28c]", published: "bg-[#059cc0]/10 text-[#059cc0]" };
  const STATUS_LABELS: Record<string, string> = { draft: "טיוטה", ready: "מוכן", published: "פורסם" };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f1f21]">📅 תכנון תוכן</h1>
          <p className="text-sm text-gray-500 mt-1">{scheduled.length} פוסטים מתוכננים | {filteredIdeas.length} רעיונות זמינים</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 mb-4 shadow-sm">
        {([["calendar", "📅 לוח שנה"], ["ideas", "💡 רעיונות"], ["queue", "📋 תור פרסום"]] as const).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === k ? "bg-[#059cc0] text-white" : "text-gray-500"}`}>{v}</button>
        ))}
      </div>

      {/* ===== CALENDAR ===== */}
      {tab === "calendar" && (
        <div className="space-y-2">
          {weekDates.map((date, i) => {
            const dayPosts = scheduled.filter(p => p.scheduledDate === date);
            const isToday = date === new Date().toISOString().split("T")[0];
            return (
              <div key={date} className={`${card} ${isToday ? "border-[#059cc0] border-2" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isToday ? "text-[#059cc0]" : "text-[#1f1f21]"}`}>
                      יום {DAYS_HE[i]}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(date + "T12:00:00").toLocaleDateString("he-IL", { day: "numeric", month: "short" })}</span>
                    {isToday && <span className="text-xs px-2 py-0.5 rounded-full bg-[#059cc0] text-white">היום</span>}
                  </div>
                  <button
                    onClick={() => { setTab("ideas"); setScheduleDate(date); }}
                    className="text-xs text-[#059cc0] font-medium"
                  >+ הוסף</button>
                </div>
                {dayPosts.length === 0 ? (
                  <p className="text-xs text-gray-400">אין תוכן מתוכנן</p>
                ) : dayPosts.map(post => (
                  <div key={post.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[post.status]}`}>{STATUS_LABELS[post.status]}</span>
                    <p className="text-xs flex-1 truncate">{post.topic}</p>
                    <span className="text-[10px] text-gray-400">{AUDIENCE_LABELS[post.audience]}</span>
                    <button onClick={() => removeFromSchedule(post.id)} className="text-gray-300 hover:text-red-400 text-sm">×</button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== IDEAS ===== */}
      {tab === "ideas" && (
        <div className="space-y-3">
          {/* Filter */}
          <div className="flex gap-2 mb-2">
            {(["all", "wedding", "course", "brand"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`${btnOutline} ${filter === f ? "bg-[#059cc0] text-white border-[#059cc0]" : "text-gray-600 border-gray-200"}`}>
                {f === "all" ? "הכל" : AUDIENCE_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Schedule date picker */}
          {scheduleDate && (
            <div className={`${card} bg-[#059cc0]/5 border-[#059cc0]/20`}>
              <p className="text-sm font-medium text-[#059cc0] mb-1">בחר רעיון לתאריך: {new Date(scheduleDate + "T12:00:00").toLocaleDateString("he-IL")}</p>
              <button onClick={() => setScheduleDate("")} className="text-xs text-gray-500">ביטול</button>
            </div>
          )}

          {filteredIdeas.map(idea => (
            <div key={idea.id} className={`${card} hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[idea.priority]}`}>{PRIORITY_LABELS[idea.priority]}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{AUDIENCE_LABELS[idea.audience]}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{TYPE_LABELS[idea.contentType]}</span>
              </div>
              <p className="text-sm font-medium text-[#1f1f21] mb-1">{idea.topic}</p>
              <p className="text-xs text-gray-500 mb-2">זווית: {idea.angle}</p>
              <div className="flex gap-2">
                {scheduleDate ? (
                  <button onClick={() => addToSchedule(idea, scheduleDate)} className={btnPrimary}>📅 הוסף לתאריך</button>
                ) : (
                  <>
                    <button
                      onClick={() => { setSelectedIdea(idea); }}
                      className={`${btnOutline} text-[#059cc0] border-[#059cc0]`}
                    >📅 תזמן</button>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "trainer" }))}
                      className={`${btnOutline} text-[#03b28c] border-[#03b28c]`}
                    >✨ ייצר</button>
                  </>
                )}
              </div>
              {selectedIdea?.id === idea.id && (
                <div className="mt-2 flex gap-2 items-center">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="px-2 py-1 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => scheduleDate && addToSchedule(idea, scheduleDate)}
                    disabled={!scheduleDate}
                    className={`${btnPrimary} ${!scheduleDate ? "opacity-50" : ""}`}
                  >אשר</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== QUEUE ===== */}
      {tab === "queue" && (
        <div className="space-y-3">
          {scheduled.length === 0 ? (
            <div className={`${card} text-center py-12`}>
              <p className="text-4xl mb-2">📋</p>
              <p className="text-gray-500">אין תוכן בתור</p>
              <button onClick={() => setTab("ideas")} className={`mt-3 ${btnPrimary}`}>בחר רעיונות</button>
            </div>
          ) : (
            [...scheduled].sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)).map(post => (
              <div key={post.id} className={card}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[post.status]}`}>{STATUS_LABELS[post.status]}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{AUDIENCE_LABELS[post.audience]}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(post.scheduledDate + "T12:00:00").toLocaleDateString("he-IL")}</span>
                </div>
                <p className="text-sm font-medium mb-2">{post.topic}</p>
                <div className="flex gap-2">
                  {post.status === "draft" && (
                    <button onClick={() => updateStatus(post.id, "ready")} className={`${btnOutline} text-[#03b28c] border-[#03b28c]`}>✅ סמן מוכן</button>
                  )}
                  {post.status === "ready" && (
                    <button onClick={() => updateStatus(post.id, "published")} className={`${btnOutline} text-[#059cc0] border-[#059cc0]`}>📤 סמן פורסם</button>
                  )}
                  <button onClick={() => removeFromSchedule(post.id)} className={`${btnOutline} text-red-400 border-red-200`}>🗑 הסר</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
