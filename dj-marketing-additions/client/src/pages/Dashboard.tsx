import { useState } from "react";
import { load, KEYS, type StoredGeneration, type StoredExample, type StoredCompetitor } from "../lib/storage";

const card = "bg-white rounded-2xl shadow-sm border p-4";

export default function Dashboard() {
  const generations = load<StoredGeneration[]>(KEYS.GENERATIONS, []);
  const examples = load<StoredExample[]>(KEYS.EXAMPLES, []);
  const competitors = load<StoredCompetitor[]>(KEYS.COMPETITORS, []);
  const leads = load<any[]>("dj_leads", []);

  const passedCount = generations.filter(g => g.passed).length;
  const avgScore = generations.length > 0
    ? (generations.reduce((s, g) => s + g.qaScore, 0) / generations.length).toFixed(1)
    : "—";
  const ratedCount = generations.filter(g => g.rating && g.rating >= 4).length;

  const recentGenerations = generations.slice(0, 5);

  // Quick actions
  const quickActions = [
    { icon: "✨", label: "ייצר תוכן", page: "trainer" },
    { icon: "📅", label: "תכנון תוכן", page: "planner" },
    { icon: "👥", label: "ניהול לידים", page: "leads" },
    { icon: "🔍", label: "מחקר מתחרים", page: "research" },
    { icon: "📊", label: "ניתוח ביצועים", page: "analytics" },
    { icon: "💡", label: "60 רעיונות", page: "ideas" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1f1f21]">🎵 DJ אלמוג כהן</h1>
        <p className="text-sm text-gray-500 mt-1">מערכת שיווק ותוכן</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`${card} bg-gradient-to-br from-[#059cc0]/10 to-[#059cc0]/5`}>
          <p className="text-3xl font-bold text-[#059cc0]">{generations.length}</p>
          <p className="text-xs text-gray-500 mt-1">תכנים שנוצרו</p>
        </div>
        <div className={`${card} bg-gradient-to-br from-[#03b28c]/10 to-[#03b28c]/5`}>
          <p className="text-3xl font-bold text-[#03b28c]">{passedCount}</p>
          <p className="text-xs text-gray-500 mt-1">עברו בדיקת איכות</p>
        </div>
        <div className={`${card} bg-gradient-to-br from-purple-100 to-purple-50`}>
          <p className="text-3xl font-bold text-purple-600">{avgScore}</p>
          <p className="text-xs text-gray-500 mt-1">ציון ממוצע</p>
        </div>
        <div className={`${card} bg-gradient-to-br from-orange-100 to-orange-50`}>
          <p className="text-3xl font-bold text-orange-500">{leads.length}</p>
          <p className="text-xs text-gray-500 mt-1">לידים</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="font-bold text-[#1f1f21] mb-3">פעולות מהירות</h2>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {quickActions.map(action => (
          <button
            key={action.page}
            onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: action.page }))}
            className={`${card} text-center hover:shadow-md transition-shadow cursor-pointer`}
          >
            <p className="text-2xl mb-1">{action.icon}</p>
            <p className="text-xs font-medium text-gray-700">{action.label}</p>
          </button>
        ))}
      </div>

      {/* System Status */}
      <h2 className="font-bold text-[#1f1f21] mb-3">סטטוס המערכת</h2>
      <div className={`${card} mb-6`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#03b28c]" />
              <span className="text-sm">בוט תוכן</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#03b28c]/10 text-[#03b28c]">פעיל</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#03b28c]" />
              <span className="text-sm">בוט בדיקת איכות</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#03b28c]/10 text-[#03b28c]">פעיל</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#03b28c]" />
              <span className="text-sm">מחקר מתחרים</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#03b28c]/10 text-[#03b28c]">{competitors.length} מתחרים</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#03b28c]" />
              <span className="text-sm">דוגמאות אימון</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#03b28c]/10 text-[#03b28c]">{examples.length} דוגמאות</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-sm">פרסום אוטומטי (Buffer)</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">דורש חיבור</span>
          </div>
        </div>
      </div>

      {/* Recent Content */}
      <h2 className="font-bold text-[#1f1f21] mb-3">תוכן אחרון</h2>
      {recentGenerations.length === 0 ? (
        <div className={`${card} text-center py-8`}>
          <p className="text-4xl mb-2">✨</p>
          <p className="text-gray-500 text-sm">עדיין לא נוצר תוכן</p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "trainer" }))}
            className="mt-3 px-4 py-2 bg-[#059cc0] text-white rounded-xl text-sm font-medium"
          >
            ייצר תוכן ראשון
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {recentGenerations.map(gen => (
            <div key={gen.id} className={`${card} border-r-4`} style={{ borderRightColor: gen.passed ? "#03b28c" : "#ef4444" }}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${gen.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  ⭐ {gen.qaScore}/10
                </span>
                <span className="text-xs text-gray-400">{new Date(gen.createdAt).toLocaleDateString("he-IL")}</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{gen.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
