import { useState, useEffect } from "react";
import { generateContent, type GenerationInput } from "../lib/content-generator";
import { checkQuality } from "../lib/qa-checker";
import { load, save, KEYS, type StoredExample, type StoredRule, type StoredGeneration } from "../lib/storage";

type Audience = "wedding" | "course" | "brand";
type ContentType = "caption" | "hook" | "reel_script" | "story" | "carousel";

const AUDIENCE_LABELS: Record<Audience, string> = { wedding: "חתונות 💒", course: "קורסי DJ 🎧", brand: "מותג 🎵" };
const CONTENT_LABELS: Record<ContentType, string> = { caption: "כיתוב", hook: "הוק", reel_script: "תסריט ריל", story: "סטורי", carousel: "קרוסלה" };
const RULE_CATEGORIES = ["טון", "מילים לשימוש", "מילים להימנע", "מבנה", "קריאה לפעולה", "אימוג'ים", "האשטגים", "כללי"];

const DEFAULT_RULES: Omit<StoredRule, "id">[] = [
  { category: "טון", rule: "טון ישיר, בטוח, מקצועי — לא מתחנף ולא נואש", isActive: true },
  { category: "טון", rule: "גברי אבל חם. פרימיום אבל אנושי.", isActive: true },
  { category: "מילים להימנע", rule: "לא: מטורף, מושלם, הכי טוב, חד פעמי, מבצע מטורף, מהרו", isActive: true },
  { category: "מילים לשימוש", rule: "כן: חוויה, אנרגיה, דיוק, הובלה, ביטחון, תחושה", isActive: true },
  { category: "מבנה", rule: "הוק חזק בשורה ראשונה. ערך באמצע. קריאה לפעולה בסוף.", isActive: true },
  { category: "קריאה לפעולה", rule: "סלקטיבי: בדיקת התאמה, שיחת היכרות, להבין אם זה מתאים", isActive: true },
  { category: "אימוג'ים", rule: "1-2 אימוג'ים מקסימום. לא ילדותי.", isActive: true },
  { category: "כללי", rule: "כל תוכן חייב לתת ערך אמיתי — לא רק 'תראו אותי'", isActive: true },
  { category: "כללי", rule: "AI נראה? בסדר. אבל ערך אמיתי — חובה.", isActive: true },
];

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

export default function ContentBotTrainer() {
  const [tab, setTab] = useState<"create" | "examples" | "rules" | "history">("create");

  // Create tab state
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState<Audience>("wedding");
  const [contentType, setContentType] = useState<ContentType>("caption");
  const [inputType, setInputType] = useState<"topic" | "image" | "competitor_post">("topic");
  const [lastResult, setLastResult] = useState<StoredGeneration | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Examples state
  const [examples, setExamples] = useState<StoredExample[]>(() => load(KEYS.EXAMPLES, []));
  const [newExText, setNewExText] = useState("");
  const [newExAudience, setNewExAudience] = useState<Audience>("wedding");
  const [newExIsGood, setNewExIsGood] = useState(true);

  // Rules state
  const [rules, setRules] = useState<StoredRule[]>(() => {
    const saved = load<StoredRule[]>(KEYS.RULES, []);
    return saved.length > 0 ? saved : DEFAULT_RULES.map((r, i) => ({ ...r, id: `r-${i}` }));
  });
  const [newRuleText, setNewRuleText] = useState("");
  const [newRuleCat, setNewRuleCat] = useState("כללי");

  // History state
  const [generations, setGenerations] = useState<StoredGeneration[]>(() => load(KEYS.GENERATIONS, []));
  const [historyFilter, setHistoryFilter] = useState<Audience | "all">("all");

  // Save to localStorage
  useEffect(() => { save(KEYS.EXAMPLES, examples); }, [examples]);
  useEffect(() => { save(KEYS.RULES, rules); }, [rules]);
  useEffect(() => { save(KEYS.GENERATIONS, generations); }, [generations]);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateContent({ topic, audience, contentType, inputType });
      const qa = checkQuality(result.content, audience);
      const gen: StoredGeneration = {
        id: genId(),
        inputType, inputText: topic, audience, contentType,
        content: result.content, hook: result.hook, cta: result.cta, hashtags: result.hashtags,
        qaScore: qa.score, qaVerdict: qa.verdict, passed: qa.passed,
        createdAt: new Date().toISOString(),
      };
      setLastResult(gen);
      setGenerations(prev => [gen, ...prev]);
      setIsGenerating(false);
    }, 800);
  };

  const rateGeneration = (id: string, rating: number) => {
    setGenerations(prev => prev.map(g => g.id === id ? { ...g, rating } : g));
    if (lastResult?.id === id) setLastResult({ ...lastResult, rating });
  };

  const addExample = () => {
    if (!newExText.trim()) return;
    setExamples(prev => [{ id: genId(), content: newExText.trim(), audience: newExAudience, contentType: "caption", isGoodExample: newExIsGood, createdAt: new Date().toISOString() }, ...prev]);
    setNewExText("");
  };

  const addRule = () => {
    if (!newRuleText.trim()) return;
    setRules(prev => [...prev, { id: genId(), category: newRuleCat, rule: newRuleText.trim(), isActive: true }]);
    setNewRuleText("");
  };

  const filteredHistory = historyFilter === "all" ? generations : generations.filter(g => g.audience === historyFilter);

  // Styles
  const btnPrimary = "px-4 py-2 rounded-xl text-white font-medium text-sm";
  const btnOutline = "px-3 py-1.5 rounded-lg border text-sm font-medium";
  const card = "bg-white rounded-2xl shadow-sm border p-4";
  const input = "w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#059cc0]/30";

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f1f21]">🤖 בוט תוכן — DJ אלמוג כהן</h1>
          <p className="text-sm text-gray-500 mt-1">אמן, ייצר, בדוק, שפר</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-[#059cc0]/10 text-[#059cc0] font-medium">{examples.length} דוגמאות</span>
          <span className="text-xs px-2 py-1 rounded-full bg-[#03b28c]/10 text-[#03b28c] font-medium">{rules.filter(r => r.isActive).length} כללים</span>
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600 font-medium">{generations.length} יצירות</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 mb-4 shadow-sm">
        {([["create", "✨ יצירה"], ["examples", "📚 דוגמאות"], ["rules", "📋 כללים"], ["history", "📊 היסטוריה"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? "bg-[#059cc0] text-white" : "text-gray-500 hover:bg-gray-100"}`}>{label}</button>
        ))}
      </div>

      {/* ===== TAB: CREATE ===== */}
      {tab === "create" && (
        <div className="space-y-4">
          <div className={card}>
            <h2 className="font-bold text-[#1f1f21] mb-3">מה לייצר?</h2>

            {/* Audience */}
            <div className="flex gap-2 mb-3">
              {(Object.entries(AUDIENCE_LABELS) as [Audience, string][]).map(([k, v]) => (
                <button key={k} onClick={() => setAudience(k)} className={`${btnOutline} ${audience === k ? "bg-[#03b28c] text-white border-[#03b28c]" : "text-gray-600 border-gray-200"}`}>{v}</button>
              ))}
            </div>

            {/* Content type */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {(Object.entries(CONTENT_LABELS) as [ContentType, string][]).map(([k, v]) => (
                <button key={k} onClick={() => setContentType(k)} className={`${btnOutline} ${contentType === k ? "bg-[#1f1f21] text-white border-[#1f1f21]" : "text-gray-600 border-gray-200"}`}>{v}</button>
              ))}
            </div>

            {/* Input type */}
            <div className="flex gap-2 mb-3">
              {([["topic", "📝 נושא"], ["image", "📸 תמונה"], ["competitor_post", "🔍 מתחרה"]] as const).map(([k, v]) => (
                <button key={k} onClick={() => setInputType(k)} className={`${btnOutline} ${inputType === k ? "bg-[#059cc0] text-white border-[#059cc0]" : "text-gray-600 border-gray-200"}`}>{v}</button>
              ))}
            </div>

            {/* Input */}
            <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={inputType === "topic" ? "כתוב נושא... למשל: טעויות שזוגות עושים בבחירת DJ" : inputType === "image" ? "תאר מה בתמונה/סרטון..." : "הדבק פוסט של מתחרה..."} className={`${input} min-h-[100px] resize-none mb-3`} />

            <button onClick={handleGenerate} disabled={!topic.trim() || isGenerating} className={`w-full py-3 rounded-xl text-white font-bold text-lg ${!topic.trim() || isGenerating ? "bg-gray-300" : "bg-[#059cc0] hover:bg-[#048aab]"} transition-colors`}>
              {isGenerating ? "⏳ מייצר..." : "✨ ייצר תוכן"}
            </button>
          </div>

          {/* Result */}
          {lastResult && (
            <div className={`${card} border-[#059cc0]/20`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#1f1f21]">✨ תוצר</h3>
                <div className="flex gap-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#03b28c]/10 text-[#03b28c]">{AUDIENCE_LABELS[lastResult.audience]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${lastResult.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    ⭐ {lastResult.qaScore}/10 {lastResult.passed ? "✅" : "❌"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed mb-3" dir="rtl">
                {lastResult.content}
              </div>

              <p className="text-xs text-[#059cc0] mb-3" dir="ltr">{lastResult.hashtags.join(" ")}</p>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500 ml-2">דרג:</span>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => rateGeneration(lastResult.id, s)} className="text-2xl transition-transform hover:scale-125">
                      {(lastResult.rating || 0) >= s ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(lastResult.content)} className={`${btnOutline} text-gray-600 border-gray-200`}>📋 העתק</button>
                  <button onClick={handleGenerate} className={`${btnOutline} text-[#059cc0] border-[#059cc0]`}>🔄 חדש</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== TAB: EXAMPLES ===== */}
      {tab === "examples" && (
        <div className="space-y-4">
          <div className={card}>
            <h2 className="font-bold text-[#1f1f21] mb-3">הוסף דוגמה</h2>
            <div className="flex gap-2 mb-2">
              <button onClick={() => setNewExIsGood(true)} className={`${btnOutline} ${newExIsGood ? "bg-[#03b28c] text-white border-[#03b28c]" : "text-gray-600"}`}>👍 טובה</button>
              <button onClick={() => setNewExIsGood(false)} className={`${btnOutline} ${!newExIsGood ? "bg-red-500 text-white border-red-500" : "text-gray-600"}`}>👎 רעה</button>
              {(Object.entries(AUDIENCE_LABELS) as [Audience, string][]).map(([k, v]) => (
                <button key={k} onClick={() => setNewExAudience(k)} className={`${btnOutline} ${newExAudience === k ? "bg-[#059cc0] text-white border-[#059cc0]" : "text-gray-600 border-gray-200"}`}>{v}</button>
              ))}
            </div>
            <textarea value={newExText} onChange={e => setNewExText(e.target.value)} placeholder="הדבק טקסט של פוסט שאתה אוהב (או לא אוהב)..." className={`${input} min-h-[80px] resize-none mb-2`} />
            <button onClick={addExample} disabled={!newExText.trim()} className={`${btnPrimary} ${!newExText.trim() ? "bg-gray-300" : "bg-[#059cc0]"}`}>+ הוסף</button>
          </div>

          {examples.length === 0 ? (
            <div className={`${card} text-center py-8`}>
              <p className="text-4xl mb-2">📚</p>
              <p className="text-gray-500">הוסף 10-20 דוגמאות כדי שהבוט ילמד את הסגנון שלך</p>
            </div>
          ) : examples.map(ex => (
            <div key={ex.id} className={`${card} border-r-4 ${ex.isGoodExample ? "border-r-[#03b28c]" : "border-r-red-400"}`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-1 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{AUDIENCE_LABELS[ex.audience]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ex.isGoodExample ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{ex.isGoodExample ? "✅ טוב" : "❌ רע"}</span>
                </div>
                <button onClick={() => setExamples(prev => prev.filter(e => e.id !== ex.id))} className="text-gray-300 hover:text-red-400 text-lg">×</button>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">{ex.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* ===== TAB: RULES ===== */}
      {tab === "rules" && (
        <div className="space-y-4">
          <div className={card}>
            <h2 className="font-bold text-[#1f1f21] mb-3">הוסף כלל</h2>
            <div className="flex gap-2 mb-2">
              <select value={newRuleCat} onChange={e => setNewRuleCat(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                {RULE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={newRuleText} onChange={e => setNewRuleText(e.target.value)} placeholder="כתוב כלל..." className={`${input} flex-1`} />
              <button onClick={addRule} disabled={!newRuleText.trim()} className={`${btnPrimary} ${!newRuleText.trim() ? "bg-gray-300" : "bg-[#059cc0]"}`}>+</button>
            </div>
          </div>

          {rules.map(rule => (
            <div key={rule.id} className={`${card} flex items-center gap-3 ${rule.isActive ? "" : "opacity-50"}`}>
              <button onClick={() => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r))} className={`w-10 h-6 rounded-full flex-shrink-0 transition-colors ${rule.isActive ? "bg-[#03b28c]" : "bg-gray-300"}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow mx-1 mt-1 transition-transform ${rule.isActive ? "translate-x-4" : ""}`} />
              </button>
              <p className="text-sm flex-1">{rule.rule}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex-shrink-0">{rule.category}</span>
              <button onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))} className="text-gray-300 hover:text-red-400">×</button>
            </div>
          ))}
        </div>
      )}

      {/* ===== TAB: HISTORY ===== */}
      {tab === "history" && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-2">
            {(["all", "wedding", "course", "brand"] as const).map(f => (
              <button key={f} onClick={() => setHistoryFilter(f)} className={`${btnOutline} ${historyFilter === f ? "bg-[#059cc0] text-white border-[#059cc0]" : "text-gray-600 border-gray-200"}`}>
                {f === "all" ? "הכל" : AUDIENCE_LABELS[f]}
              </button>
            ))}
          </div>

          {filteredHistory.length === 0 ? (
            <div className={`${card} text-center py-12`}>
              <p className="text-4xl mb-2">✨</p>
              <p className="text-gray-500">אין יצירות עדיין</p>
            </div>
          ) : filteredHistory.map(gen => (
            <div key={gen.id} className={`${card} border-r-4`} style={{ borderRightColor: gen.passed ? "#03b28c" : "#ef4444" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{AUDIENCE_LABELS[gen.audience]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${gen.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>⭐ {gen.qaScore}/10</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(gen.createdAt).toLocaleDateString("he-IL")}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">קלט: {gen.inputText}</p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap line-clamp-4 mb-2">{gen.content}</div>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => rateGeneration(gen.id, s)} className="text-lg">{(gen.rating || 0) >= s ? "⭐" : "☆"}</button>
                  ))}
                </div>
                <button onClick={() => navigator.clipboard.writeText(gen.content)} className={`${btnOutline} text-gray-500 border-gray-200 text-xs`}>📋 העתק</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
