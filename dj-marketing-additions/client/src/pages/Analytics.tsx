import { load, KEYS, type StoredGeneration } from "../lib/storage";

const card = "bg-white rounded-2xl shadow-sm border p-4";

const AUDIENCE_LABELS: Record<string, string> = { wedding: "חתונות 💒", course: "קורסי DJ 🎧", brand: "מותג 🎵" };

export default function Analytics() {
  const generations = load<StoredGeneration[]>(KEYS.GENERATIONS, []);
  const leads = load<any[]>("dj_leads", []);
  const scheduled = load<any[]>("dj_scheduled", []);

  // Content stats
  const total = generations.length;
  const passed = generations.filter(g => g.passed).length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
  const avgScore = total > 0 ? (generations.reduce((s, g) => s + g.qaScore, 0) / total).toFixed(1) : "0";
  const rated = generations.filter(g => g.rating);
  const avgRating = rated.length > 0 ? (rated.reduce((s, g) => s + (g.rating || 0), 0) / rated.length).toFixed(1) : "—";

  // By audience
  const byAudience = (["wedding", "course", "brand"] as const).map(aud => ({
    audience: aud,
    label: AUDIENCE_LABELS[aud],
    count: generations.filter(g => g.audience === aud).length,
    avgScore: generations.filter(g => g.audience === aud).length > 0
      ? (generations.filter(g => g.audience === aud).reduce((s, g) => s + g.qaScore, 0) / generations.filter(g => g.audience === aud).length).toFixed(1)
      : "—",
    passRate: generations.filter(g => g.audience === aud).length > 0
      ? Math.round((generations.filter(g => g.audience === aud && g.passed).length / generations.filter(g => g.audience === aud).length) * 100)
      : 0,
  }));

  // Score distribution
  const scoreBuckets = [
    { label: "1-3", count: generations.filter(g => g.qaScore >= 1 && g.qaScore < 4).length, color: "#ef4444" },
    { label: "4-5", count: generations.filter(g => g.qaScore >= 4 && g.qaScore < 6).length, color: "#f59e0b" },
    { label: "6-7", count: generations.filter(g => g.qaScore >= 6 && g.qaScore < 8).length, color: "#059cc0" },
    { label: "8-10", count: generations.filter(g => g.qaScore >= 8).length, color: "#03b28c" },
  ];
  const maxBucket = Math.max(...scoreBuckets.map(b => b.count), 1);

  // Leads stats
  const leadsByStatus: Record<string, number> = {};
  leads.forEach(l => { leadsByStatus[l.status] = (leadsByStatus[l.status] || 0) + 1; });

  // Content by week (last 4 weeks)
  const weeks: { label: string; count: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i * 7 + weekStart.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const count = generations.filter(g => {
      const d = new Date(g.createdAt);
      return d >= weekStart && d < weekEnd;
    }).length;
    weeks.push({
      label: `שבוע ${4 - i}`,
      count,
    });
  }
  const maxWeek = Math.max(...weeks.map(w => w.count), 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1f1f21]">📊 ניתוח ביצועים</h1>
        <p className="text-sm text-gray-500 mt-1">סטטיסטיקות תוכן, לידים, ואיכות</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`${card} bg-gradient-to-br from-[#059cc0]/10 to-[#059cc0]/5`}>
          <p className="text-3xl font-bold text-[#059cc0]">{total}</p>
          <p className="text-xs text-gray-500 mt-1">תכנים שנוצרו</p>
        </div>
        <div className={`${card} bg-gradient-to-br from-[#03b28c]/10 to-[#03b28c]/5`}>
          <p className="text-3xl font-bold text-[#03b28c]">{passRate}%</p>
          <p className="text-xs text-gray-500 mt-1">עברו QA</p>
        </div>
        <div className={`${card} bg-gradient-to-br from-purple-100 to-purple-50`}>
          <p className="text-3xl font-bold text-purple-600">{avgScore}</p>
          <p className="text-xs text-gray-500 mt-1">ציון ממוצע</p>
        </div>
        <div className={`${card} bg-gradient-to-br from-orange-100 to-orange-50`}>
          <p className="text-3xl font-bold text-orange-500">{avgRating}</p>
          <p className="text-xs text-gray-500 mt-1">דירוג ממוצע</p>
        </div>
      </div>

      {/* By Audience */}
      <h2 className="font-bold text-[#1f1f21] mb-3">לפי קהל</h2>
      <div className="space-y-2 mb-6">
        {byAudience.map(a => (
          <div key={a.audience} className={card}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{a.label}</span>
              <span className="text-sm font-bold text-[#059cc0]">{a.count} תכנים</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#059cc0] rounded-full transition-all" style={{ width: `${total > 0 ? (a.count / total) * 100 : 0}%` }} />
                </div>
              </div>
              <span className="text-xs text-gray-500">ציון: {a.avgScore}</span>
              <span className="text-xs text-gray-500">QA: {a.passRate}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Score Distribution */}
      <h2 className="font-bold text-[#1f1f21] mb-3">התפלגות ציונים</h2>
      <div className={`${card} mb-6`}>
        <div className="flex items-end gap-3 h-32">
          {scoreBuckets.map(bucket => (
            <div key={bucket.label} className="flex-1 flex flex-col items-center">
              <span className="text-xs font-bold mb-1">{bucket.count}</span>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{ height: `${(bucket.count / maxBucket) * 100}%`, backgroundColor: bucket.color, minHeight: bucket.count > 0 ? "8px" : "2px" }}
              />
              <span className="text-xs text-gray-500 mt-1">{bucket.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Production */}
      <h2 className="font-bold text-[#1f1f21] mb-3">ייצור שבועי</h2>
      <div className={`${card} mb-6`}>
        <div className="flex items-end gap-3 h-24">
          {weeks.map(week => (
            <div key={week.label} className="flex-1 flex flex-col items-center">
              <span className="text-xs font-bold mb-1">{week.count}</span>
              <div
                className="w-full rounded-t-lg bg-[#059cc0] transition-all"
                style={{ height: `${(week.count / maxWeek) * 100}%`, minHeight: week.count > 0 ? "8px" : "2px" }}
              />
              <span className="text-[10px] text-gray-500 mt-1">{week.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leads Summary */}
      <h2 className="font-bold text-[#1f1f21] mb-3">לידים</h2>
      <div className={`${card} mb-6`}>
        {leads.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">אין לידים עדיין</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#059cc0]">{leads.length}</p>
              <p className="text-xs text-gray-500">סה"כ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#03b28c]">{leadsByStatus["closed_won"] || 0}</p>
              <p className="text-xs text-gray-500">נסגרו</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">{scheduled.length}</p>
              <p className="text-xs text-gray-500">תוכן מתוכנן</p>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <h2 className="font-bold text-[#1f1f21] mb-3">טיפים לשיפור</h2>
      <div className="space-y-2">
        {total < 10 && (
          <div className={`${card} border-r-4 border-r-[#059cc0]`}>
            <p className="text-sm">💡 ייצר לפחות 10 תכנים כדי לקבל סטטיסטיקות מדויקות</p>
          </div>
        )}
        {passRate < 70 && total >= 5 && (
          <div className={`${card} border-r-4 border-r-yellow-400`}>
            <p className="text-sm">⚠️ אחוז ה-QA נמוך ({passRate}%). הוסף דוגמאות אימון טובות כדי לשפר</p>
          </div>
        )}
        {rated.length < total * 0.5 && total >= 5 && (
          <div className={`${card} border-r-4 border-r-purple-400`}>
            <p className="text-sm">⭐ דרג יותר תכנים — זה עוזר לבוט ללמוד את הטעם שלך</p>
          </div>
        )}
        {leads.length === 0 && (
          <div className={`${card} border-r-4 border-r-[#03b28c]`}>
            <p className="text-sm">👥 התחל להוסיף לידים כדי לעקוב אחרי ההמרות</p>
          </div>
        )}
      </div>
    </div>
  );
}
