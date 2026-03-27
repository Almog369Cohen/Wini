import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Plus, Trash2, Send, Upload, BookOpen, Sparkles, MessageSquare, ThumbsUp, ThumbsDown, Copy, RefreshCw } from "lucide-react";

type Audience = "wedding" | "course" | "brand";
type ContentType = "caption" | "hook" | "reel_script" | "story" | "carousel";
type InputType = "topic" | "image" | "competitor_post";

interface TrainingExample {
  id: string;
  content: string;
  audience: Audience;
  contentType: ContentType;
  isGoodExample: boolean;
  notes?: string;
  createdAt: string;
}

interface BotRule {
  id: string;
  category: string;
  rule: string;
  isActive: boolean;
}

interface Generation {
  id: string;
  inputType: InputType;
  inputText: string;
  audience: Audience;
  contentType: ContentType;
  generatedContent: string;
  hook?: string;
  cta?: string;
  hashtags?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

const AUDIENCE_LABELS: Record<Audience, string> = {
  wedding: "חתונות 💒",
  course: "קורסי DJ 🎧",
  brand: "מותג 🎵",
};

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  caption: "כיתוב",
  hook: "הוק",
  reel_script: "תסריט ריל",
  story: "סטורי",
  carousel: "קרוסלה",
};

const DEFAULT_RULES: Omit<BotRule, "id">[] = [
  { category: "tone", rule: "טון ישיר, בטוח, מקצועי — לא מתחנף ולא נואש", isActive: true },
  { category: "tone", rule: "גברי אבל חם. פרימיום אבל אנושי.", isActive: true },
  { category: "words_avoid", rule: "לא להשתמש ב: 'מטורף', 'מושלם', 'הכי טוב', 'חד פעמי', 'מבצע מטורף'", isActive: true },
  { category: "words_use", rule: "להשתמש ב: 'חוויה', 'אנרגיה', 'דיוק', 'הובלה', 'ביטחון', 'תחושה'", isActive: true },
  { category: "structure", rule: "הוק חזק בשורה ראשונה. ערך באמצע. קריאה לפעולה בסוף.", isActive: true },
  { category: "cta", rule: "קריאות לפעולה סלקטיביות: 'בדיקת התאמה', 'שיחת היכרות', 'להבין אם זה מתאים'", isActive: true },
  { category: "emoji", rule: "1-2 אימוג'ים מקסימום. לא ילדותי.", isActive: true },
  { category: "general", rule: "כל תוכן חייב לתת ערך אמיתי — לא רק 'תראו אותי'", isActive: true },
  { category: "general", rule: "AI נראה? בסדר. אבל ערך אמיתי — חובה.", isActive: true },
];

export default function ContentBotTrainer() {
  const [activeTab, setActiveTab] = useState("create");

  // Training examples state
  const [examples, setExamples] = useState<TrainingExample[]>([]);
  const [newExample, setNewExample] = useState("");
  const [exampleAudience, setExampleAudience] = useState<Audience>("wedding");
  const [exampleType, setExampleType] = useState<ContentType>("caption");
  const [exampleIsGood, setExampleIsGood] = useState(true);

  // Rules state
  const [rules, setRules] = useState<BotRule[]>(
    DEFAULT_RULES.map((r, i) => ({ ...r, id: `rule-${i}` }))
  );
  const [newRule, setNewRule] = useState("");
  const [newRuleCategory, setNewRuleCategory] = useState("general");

  // Generation state
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [inputType, setInputType] = useState<InputType>("topic");
  const [inputText, setInputText] = useState("");
  const [genAudience, setGenAudience] = useState<Audience>("wedding");
  const [genContentType, setGenContentType] = useState<ContentType>("caption");
  const [isGenerating, setIsGenerating] = useState(false);

  // Add training example
  const addExample = () => {
    if (!newExample.trim()) return;
    const example: TrainingExample = {
      id: `ex-${Date.now()}`,
      content: newExample.trim(),
      audience: exampleAudience,
      contentType: exampleType,
      isGoodExample: exampleIsGood,
      createdAt: new Date().toISOString(),
    };
    setExamples(prev => [example, ...prev]);
    setNewExample("");
  };

  // Add rule
  const addRule = () => {
    if (!newRule.trim()) return;
    const rule: BotRule = {
      id: `rule-${Date.now()}`,
      category: newRuleCategory,
      rule: newRule.trim(),
      isActive: true,
    };
    setRules(prev => [...prev, rule]);
    setNewRule("");
  };

  // Generate content
  const generateContent = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);

    // Build context from rules and examples
    const activeRules = rules.filter(r => r.isActive).map(r => r.rule);
    const goodExamples = examples.filter(e => e.isGoodExample && e.audience === genAudience);
    const badExamples = examples.filter(e => !e.isGoodExample);

    // For now, generate locally. In production, this calls Claude API.
    const audienceContext = genAudience === "wedding"
      ? "הקהל: זוגות מתחתנים. הם מחפשים שקט נפשי, חוויה מדויקת, ספק שאפשר לסמוך עליו."
      : genAudience === "course"
        ? "הקהל: תלמידי DJ מתחילים. הם מחפשים ביטחון, דרך ברורה, מנטור אמיתי."
        : "הקהל: כללי. מיתוג אישי של DJ אלמוג כהן.";

    const prompt = `אתה כותב תוכן עבור DJ אלמוג כהן.

${audienceContext}

כללים:
${activeRules.map(r => `- ${r}`).join("\n")}

${goodExamples.length > 0 ? `דוגמאות טובות לסגנון:\n${goodExamples.slice(0, 5).map(e => `"${e.content}"`).join("\n")}` : ""}

${badExamples.length > 0 ? `דוגמאות לא טובות (לא לכתוב ככה):\n${badExamples.slice(0, 3).map(e => `"${e.content}"`).join("\n")}` : ""}

סוג תוכן: ${CONTENT_TYPE_LABELS[genContentType]}
נושא/קלט: ${inputText}

כתוב ${CONTENT_TYPE_LABELS[genContentType]} בעברית. כולל הוק בשורה ראשונה וקריאה לפעולה בסוף.`;

    // Simulate AI response (replace with actual API call)
    await new Promise(r => setTimeout(r, 1500));

    const mockContent = genAudience === "wedding"
      ? `רוב הזוגות בוחרים DJ לפי מחיר.\nהזוגות שבוחרים אותי — בוחרים לפי תחושה.\n\n${inputText}\n\nהמוזיקה בחתונה שלכם היא לא רקע.\nהיא מה שמחזיק את האנרגיה, את הרגש, את הזרימה של כל הערב.\n\nכשיש מישהו שמבין את זה — אתם מרגישים את ההבדל עוד לפני שהרחבה נפתחת.\n\n🎵 רוצים לבדוק התאמה? הקישור בביו.`
      : genAudience === "course"
        ? `"אני לא יודע מאיפה להתחיל"\n\nזה המשפט שאני שומע הכי הרבה מתלמידים חדשים.\n\n${inputText}\n\nהבעיה היא לא חוסר כישרון.\nהבעיה היא חוסר כיוון.\n\nכשיש מישהו שמסביר לך את זה בגובה העיניים, בלי סיבוכים — הכל משתנה.\n\n🎧 רוצה לבדוק אם הקורס מתאים לך? הקישור בביו.`
        : `${inputText}\n\nאני לא DJ שמנגן שירים.\nאני מוביל חוויה.\n\nכל אירוע, כל קהל, כל רגע — דורש הבנה אחרת.\n\n🎵`;

    const generation: Generation = {
      id: `gen-${Date.now()}`,
      inputType,
      inputText: inputText.trim(),
      audience: genAudience,
      contentType: genContentType,
      generatedContent: mockContent,
      hook: mockContent.split("\n")[0],
      cta: "בדיקת התאמה — הקישור בביו",
      hashtags: genAudience === "wedding" ? "#חתונה #DJ #אלמוגכהן #חתונה2026" : "#קורסDJ #ללמוד #אלמוגכהן",
      createdAt: new Date().toISOString(),
    };

    setGenerations(prev => [generation, ...prev]);
    setIsGenerating(false);
    setInputText("");
  };

  // Rate generation
  const rateGeneration = (id: string, rating: number) => {
    setGenerations(prev => prev.map(g => g.id === id ? { ...g, rating } : g));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1f1f21] flex items-center gap-2">
              <Sparkles className="text-[#059cc0]" size={28} />
              בוט תוכן — DJ אלמוג כהן
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              אמן את הבוט, ייצר תוכן, שפר עם הזמן
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[#059cc0] border-[#059cc0]">
              {examples.length} דוגמאות
            </Badge>
            <Badge variant="outline" className="text-[#03b28c] border-[#03b28c]">
              {rules.filter(r => r.isActive).length} כללים פעילים
            </Badge>
            <Badge variant="outline" className="text-purple-500 border-purple-500">
              {generations.length} יצירות
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="create">
              <Sparkles size={16} className="ml-1" /> יצירת תוכן
            </TabsTrigger>
            <TabsTrigger value="examples">
              <BookOpen size={16} className="ml-1" /> דוגמאות
            </TabsTrigger>
            <TabsTrigger value="rules">
              <MessageSquare size={16} className="ml-1" /> כללים
            </TabsTrigger>
            <TabsTrigger value="history">
              <Star size={16} className="ml-1" /> היסטוריה
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Create Content */}
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">מה אתה רוצה ליצור?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Input type selector */}
                <div className="flex gap-2">
                  {(["topic", "image", "competitor_post"] as InputType[]).map(t => (
                    <Button
                      key={t}
                      variant={inputType === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInputType(t)}
                      style={inputType === t ? { backgroundColor: "#059cc0" } : {}}
                    >
                      {t === "topic" ? "📝 נושא" : t === "image" ? "📸 תמונה" : "🔍 פוסט מתחרה"}
                    </Button>
                  ))}
                </div>

                {/* Audience selector */}
                <div className="flex gap-2">
                  {(Object.entries(AUDIENCE_LABELS) as [Audience, string][]).map(([key, label]) => (
                    <Button
                      key={key}
                      variant={genAudience === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGenAudience(key)}
                      style={genAudience === key ? { backgroundColor: "#03b28c" } : {}}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {/* Content type selector */}
                <div className="flex gap-2 flex-wrap">
                  {(Object.entries(CONTENT_TYPE_LABELS) as [ContentType, string][]).map(([key, label]) => (
                    <Button
                      key={key}
                      variant={genContentType === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGenContentType(key)}
                      className={genContentType === key ? "bg-[#1f1f21]" : ""}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {/* Input */}
                {inputType === "image" ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-500">גרור תמונה או סרטון לכאן</p>
                    <p className="text-xs text-gray-400 mt-1">או כתוב תיאור של מה שבתמונה למטה</p>
                  </div>
                ) : null}

                <Textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={
                    inputType === "topic" ? "כתוב נושא... למשל: 'למה רחבה לא נבנית רק משירים טובים'"
                      : inputType === "image" ? "תאר את התמונה/סרטון..."
                        : "הדבק פוסט של מתחרה כדי לקבל גרסה בסגנון שלך..."
                  }
                  className="min-h-[100px] text-right"
                  dir="rtl"
                />

                <Button
                  onClick={generateContent}
                  disabled={!inputText.trim() || isGenerating}
                  className="w-full py-6 text-lg font-bold"
                  style={{ backgroundColor: "#059cc0" }}
                >
                  {isGenerating ? (
                    <RefreshCw className="animate-spin ml-2" size={20} />
                  ) : (
                    <Sparkles className="ml-2" size={20} />
                  )}
                  {isGenerating ? "מייצר..." : "ייצר תוכן"}
                </Button>
              </CardContent>
            </Card>

            {/* Latest generation */}
            {generations.length > 0 && (
              <Card className="border-[#059cc0]/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="text-[#059cc0]" size={18} />
                      תוצר אחרון
                    </CardTitle>
                    <Badge>{AUDIENCE_LABELS[generations[0].audience]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed" dir="rtl">
                    {generations[0].generatedContent}
                  </div>

                  {generations[0].hashtags && (
                    <p className="text-xs text-[#059cc0]" dir="ltr">{generations[0].hashtags}</p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500 ml-2">דרג:</span>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => rateGeneration(generations[0].id, star)}
                          className="transition-transform hover:scale-125"
                        >
                          <Star
                            size={24}
                            className={
                              (generations[0].rating || 0) >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(generations[0].generatedContent)}
                      >
                        <Copy size={14} className="ml-1" /> העתק
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateContent}
                      >
                        <RefreshCw size={14} className="ml-1" /> ייצר שוב
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* TAB 2: Training Examples */}
          <TabsContent value="examples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">הוסף דוגמה</CardTitle>
                <p className="text-sm text-gray-500">העלה פוסטים שאתה אוהב (דוגמה טובה) או שאתה לא אוהב (דוגמה רעה)</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    variant={exampleIsGood ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExampleIsGood(true)}
                    className={exampleIsGood ? "bg-[#03b28c]" : ""}
                  >
                    <ThumbsUp size={14} className="ml-1" /> דוגמה טובה
                  </Button>
                  <Button
                    variant={!exampleIsGood ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExampleIsGood(false)}
                    className={!exampleIsGood ? "bg-red-500" : ""}
                  >
                    <ThumbsDown size={14} className="ml-1" /> דוגמה רעה
                  </Button>
                </div>

                <div className="flex gap-2">
                  {(Object.entries(AUDIENCE_LABELS) as [Audience, string][]).map(([key, label]) => (
                    <Button
                      key={key}
                      variant={exampleAudience === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExampleAudience(key)}
                      style={exampleAudience === key ? { backgroundColor: "#059cc0" } : {}}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                <Textarea
                  value={newExample}
                  onChange={e => setNewExample(e.target.value)}
                  placeholder="הדבק כאן טקסט של פוסט שאתה אוהב (או לא אוהב)..."
                  className="min-h-[80px]"
                  dir="rtl"
                />

                <Button onClick={addExample} disabled={!newExample.trim()} style={{ backgroundColor: "#059cc0" }}>
                  <Plus size={16} className="ml-1" /> הוסף דוגמה
                </Button>
              </CardContent>
            </Card>

            {/* Examples list */}
            <div className="space-y-2">
              {examples.length === 0 ? (
                <Card className="p-8 text-center">
                  <BookOpen className="mx-auto mb-2 text-gray-300" size={40} />
                  <p className="text-sm text-gray-500">אין דוגמאות עדיין</p>
                  <p className="text-xs text-gray-400">הוסף 10-20 דוגמאות כדי שהבוט ילמד את הסגנון שלך</p>
                </Card>
              ) : (
                examples.map(ex => (
                  <Card key={ex.id} className={`border-r-4 ${ex.isGoodExample ? "border-r-[#03b28c]" : "border-r-red-400"}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex gap-1 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {AUDIENCE_LABELS[ex.audience]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {ex.isGoodExample ? "✅ טוב" : "❌ רע"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-3" dir="rtl">{ex.content}</p>
                        </div>
                        <button
                          onClick={() => setExamples(prev => prev.filter(e => e.id !== ex.id))}
                          className="text-gray-300 hover:text-red-400 mr-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* TAB 3: Rules */}
          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">כללי הבוט</CardTitle>
                <p className="text-sm text-gray-500">הגדר איך הבוט כותב: טון, מילים, מבנה</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={newRuleCategory}
                    onChange={e => setNewRuleCategory(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="tone">🎤 טון</option>
                    <option value="words_use">✅ מילים לשימוש</option>
                    <option value="words_avoid">❌ מילים להימנע</option>
                    <option value="structure">📐 מבנה</option>
                    <option value="cta">📢 קריאה לפעולה</option>
                    <option value="emoji">😊 אימוג'ים</option>
                    <option value="hashtag"># האשטגים</option>
                    <option value="general">📝 כללי</option>
                  </select>
                  <Input
                    value={newRule}
                    onChange={e => setNewRule(e.target.value)}
                    placeholder="כתוב כלל חדש..."
                    className="flex-1"
                    dir="rtl"
                  />
                  <Button onClick={addRule} disabled={!newRule.trim()} style={{ backgroundColor: "#059cc0" }}>
                    <Plus size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {rules.map(rule => (
                <Card key={rule.id} className={`transition-opacity ${rule.isActive ? "" : "opacity-50"}`}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <button
                      onClick={() => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r))}
                      className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${rule.isActive ? "bg-[#03b28c]" : "bg-gray-300"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 mt-1 ${rule.isActive ? "translate-x-4" : ""}`} />
                    </button>
                    <p className="text-sm flex-1" dir="rtl">{rule.rule}</p>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {rule.category}
                    </Badge>
                    <button
                      onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))}
                      className="text-gray-300 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 4: History */}
          <TabsContent value="history" className="space-y-4">
            {generations.length === 0 ? (
              <Card className="p-12 text-center">
                <Sparkles className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="text-lg font-medium text-gray-500">אין יצירות עדיין</p>
                <p className="text-sm text-gray-400">לך לטאב "יצירת תוכן" וייצר את הפוסט הראשון</p>
              </Card>
            ) : (
              generations.map(gen => (
                <Card key={gen.id} className="border-r-4" style={{ borderRightColor: gen.rating && gen.rating >= 4 ? "#03b28c" : gen.rating && gen.rating <= 2 ? "#ef4444" : "#e5e7eb" }}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Badge>{AUDIENCE_LABELS[gen.audience]}</Badge>
                        <Badge variant="outline">{CONTENT_TYPE_LABELS[gen.contentType]}</Badge>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(gen.createdAt).toLocaleDateString("he-IL")}</span>
                    </div>

                    <p className="text-xs text-gray-500" dir="rtl">קלט: {gen.inputText}</p>

                    <div className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap" dir="rtl">
                      {gen.generatedContent}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} onClick={() => rateGeneration(gen.id, star)}>
                            <Star
                              size={18}
                              className={(gen.rating || 0) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(gen.generatedContent)}
                      >
                        <Copy size={12} className="ml-1" /> העתק
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
