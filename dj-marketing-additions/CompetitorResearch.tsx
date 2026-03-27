import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, TrendingUp, Users, Eye, BarChart3, Target, ArrowUpRight, Instagram, Globe, Trash2 } from "lucide-react";

interface Competitor {
  id: string;
  name: string;
  instagramHandle: string;
  website?: string;
  followers: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  specialization: string;
  mainMessages: string;
  strengths: string;
  weaknesses: string;
  positioningGaps: string;
  contentStyle: string;
  lastAnalyzed: string;
}

interface CompetitorSnapshot {
  id: string;
  competitorId: string;
  date: string;
  followers: number;
  avgLikes: number;
  engagementRate: number;
}

interface MarketInsight {
  category: string;
  insight: string;
  relevance: "high" | "medium" | "low";
}

export default function CompetitorResearch() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Add competitor form state
  const [name, setName] = useState("");
  const [igHandle, setIgHandle] = useState("");
  const [website, setWebsite] = useState("");
  const [specialization, setSpecialization] = useState("");

  const [insights] = useState<MarketInsight[]>([
    { category: "מיצוב", insight: "רוב ה-DJs הישראלים ממצבים עצמם על מחיר או ניסיון. מעטים מדברים על חוויה רגשית.", relevance: "high" },
    { category: "תוכן", insight: "80% מהתוכן של DJs הוא קליפים מרחבות. כמעט אף אחד לא נותן ערך אמיתי.", relevance: "high" },
    { category: "קהל", insight: "שוק חתונות הפרימיום בישראל צומח. זוגות מוכנים לשלם יותר עבור חוויה.", relevance: "medium" },
    { category: "פער", insight: "אין DJ ישראלי שמשלב תוכן מקצועי + מותג אישי חזק + חינוך.", relevance: "high" },
    { category: "טרנד", insight: "רילסים קצרים (15-30 שניות) מקבלים פי 3 מעורבות מתוכן ארוך.", relevance: "medium" },
  ]);

  const addCompetitor = () => {
    if (!name.trim() || !igHandle.trim()) return;
    const competitor: Competitor = {
      id: `comp-${Date.now()}`,
      name: name.trim(),
      instagramHandle: igHandle.trim(),
      website: website.trim() || undefined,
      followers: 0,
      avgLikes: 0,
      avgComments: 0,
      engagementRate: 0,
      specialization: specialization.trim(),
      mainMessages: "",
      strengths: "",
      weaknesses: "",
      positioningGaps: "",
      contentStyle: "",
      lastAnalyzed: new Date().toISOString(),
    };
    setCompetitors(prev => [...prev, competitor]);
    setName("");
    setIgHandle("");
    setWebsite("");
    setSpecialization("");
    setShowAddForm(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1f1f21] flex items-center gap-2">
              <Search className="text-[#059cc0]" size={28} />
              מחקר מתחרים
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              מעקב אחרי DJs מתחרים, ניתוח תוכן, זיהוי הזדמנויות
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ backgroundColor: "#059cc0" }}
            >
              <Plus size={16} className="ml-1" />
              הוסף מתחרה
            </Button>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-600"
              title="Manus ינתח את המתחרים שלך דרך Meta"
            >
              <BarChart3 size={16} className="ml-1" />
              ניתוח Manus
            </Button>
          </div>
        </div>

        {/* Add Competitor Form */}
        {showAddForm && (
          <Card className="border-[#059cc0]/20">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">שם *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="DJ Example" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">אינסטגרם *</label>
                  <Input value={igHandle} onChange={e => setIgHandle(e.target.value)} placeholder="@dj_example" dir="ltr" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">אתר</label>
                  <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." dir="ltr" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">התמחות</label>
                  <Input value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="חתונות פרימיום" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addCompetitor} disabled={!name.trim() || !igHandle.trim()} style={{ backgroundColor: "#059cc0" }}>
                  הוסף
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>ביטול</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="mx-auto mb-1 text-[#059cc0]" size={20} />
              <p className="text-2xl font-bold">{competitors.length}</p>
              <p className="text-xs text-gray-500">מתחרים במעקב</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="mx-auto mb-1 text-[#03b28c]" size={20} />
              <p className="text-2xl font-bold">{insights.filter(i => i.relevance === "high").length}</p>
              <p className="text-xs text-gray-500">תובנות חשובות</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="mx-auto mb-1 text-purple-500" size={20} />
              <p className="text-2xl font-bold">{insights.filter(i => i.category === "פער").length}</p>
              <p className="text-xs text-gray-500">פערי מיצוב</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="mx-auto mb-1 text-orange-500" size={20} />
              <p className="text-2xl font-bold">
                {competitors.reduce((sum, c) => sum + c.followers, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">עוקבי מתחרים</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="competitors">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="competitors">
              <Users size={16} className="ml-1" /> מתחרים
            </TabsTrigger>
            <TabsTrigger value="insights">
              <TrendingUp size={16} className="ml-1" /> תובנות
            </TabsTrigger>
            <TabsTrigger value="manus-tasks">
              <BarChart3 size={16} className="ml-1" /> משימות Manus
            </TabsTrigger>
          </TabsList>

          {/* Competitors List */}
          <TabsContent value="competitors" className="space-y-3">
            {competitors.length === 0 ? (
              <Card className="p-12 text-center">
                <Search className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="text-lg font-medium text-gray-500">אין מתחרים עדיין</p>
                <p className="text-sm text-gray-400">הוסף 10-20 DJs מתחרים לניתוח</p>
                <p className="text-xs text-gray-400 mt-2">או תגיד ל-Manus לחקור אוטומטית דרך Meta</p>
              </Card>
            ) : (
              competitors.map(comp => (
                <Card key={comp.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCompetitor(comp)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#059cc0] to-[#03b28c] flex items-center justify-center text-white font-bold">
                        {comp.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#1f1f21]">{comp.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Instagram size={12} />
                          <span dir="ltr">{comp.instagramHandle}</span>
                          {comp.website && (
                            <>
                              <span>•</span>
                              <Globe size={12} />
                              <span>אתר</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">{comp.followers.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">עוקבים</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-[#03b28c]">{comp.engagementRate}%</p>
                        <p className="text-xs text-gray-500">מעורבות</p>
                      </div>
                      <Badge variant="outline">{comp.specialization || "כללי"}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-3">
            {insights.map((insight, i) => (
              <Card key={i} className={`border-r-4 ${insight.relevance === "high" ? "border-r-[#059cc0]" : insight.relevance === "medium" ? "border-r-[#03b28c]" : "border-r-gray-300"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-1">
                        <Badge variant="outline">{insight.category}</Badge>
                        <Badge className={insight.relevance === "high" ? "bg-red-100 text-red-700" : insight.relevance === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}>
                          {insight.relevance === "high" ? "חשוב" : insight.relevance === "medium" ? "בינוני" : "נמוך"}
                        </Badge>
                      </div>
                      <p className="text-sm" dir="rtl">{insight.insight}</p>
                    </div>
                    <ArrowUpRight className="text-gray-400 flex-shrink-0" size={16} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Manus Tasks */}
          <TabsContent value="manus-tasks" className="space-y-3">
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                  <BarChart3 size={20} />
                  מה Manus יכול לעשות עם Meta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { task: "לנתח 20-30 DJs ישראלים באינסטגרם", status: "ממתין", icon: "🔍" },
                  { task: "למשוך נתוני עוקבים ומעורבות מ-Meta", status: "ממתין", icon: "📊" },
                  { task: "לזהות פערי מיצוב ותוכן", status: "ממתין", icon: "🎯" },
                  { task: "ליצור דוח מתחרים מפורט", status: "ממתין", icon: "📋" },
                  { task: "לנתח קמפיינים של מתחרים ב-Meta Ads", status: "ממתין", icon: "💰" },
                  { task: "להציע קמפיינים אופטימליים על בסיס הנתונים", status: "ממתין", icon: "🚀" },
                  { task: "לנטר ביצועי קמפיינים בזמן אמת", status: "ממתין", icon: "📈" },
                  { task: "לנתח תגובות ו-DMs לזיהוי לידים", status: "ממתין", icon: "💬" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-sm flex-1">{item.task}</p>
                    <Badge variant="outline" className="text-purple-500 border-purple-300">{item.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">פרומפט ל-Manus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 font-mono" dir="rtl">
                  חקור 20 DJs מובילים לחתונות בישראל. לכל אחד תן: שם, אינסטגרם, עוקבים, ממוצע לייקים, אחוז מעורבות, התמחות, סגנון תוכן, מסרים מרכזיים, חוזקות, חולשות, פערי מיצוב. שמור ב-.manus/outputs/competitor-research.json
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigator.clipboard.writeText("חקור 20 DJs מובילים לחתונות בישראל. לכל אחד תן: שם, אינסטגרם, עוקבים, ממוצע לייקים, אחוז מעורבות, התמחות, סגנון תוכן, מסרים מרכזיים, חוזקות, חולשות, פערי מיצוב. שמור ב-.manus/outputs/competitor-research.json")}
                >
                  <Copy size={14} className="ml-1" /> העתק פרומפט
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function Copy(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  );
}
