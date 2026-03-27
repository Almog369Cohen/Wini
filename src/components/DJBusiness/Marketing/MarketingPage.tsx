import { useState } from 'react';
import { generateContent, quickGenerate, type GenerationInput, type GenerationOutput } from '../../../../dj-marketing-additions/client/src/lib/content-generator';
import { checkQuality } from '../../../../dj-marketing-additions/client/src/lib/qa-checker';
import { CONTENT_IDEAS, type ContentIdea } from '../../../../dj-marketing-additions/data/content-ideas';

interface MarketingPageProps {
  showToast: (msg: string) => void;
}

type Audience = 'wedding' | 'course' | 'brand';
type ContentType = 'caption' | 'hook' | 'reel_script' | 'story' | 'carousel';
type Tab = 'create' | 'ideas' | 'planner';

const AUDIENCE_LABELS: Record<Audience, string> = { wedding: 'חתונות 💒', course: 'קורסי DJ 🎧', brand: 'מותג 🎵' };
const CONTENT_LABELS: Record<ContentType, string> = { caption: 'כיתוב', hook: 'הוק', reel_script: 'תסריט ריל', story: 'סטורי', carousel: 'קרוסלה' };
const PRIORITY_COLORS: Record<string, string> = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-600' };
const PRIORITY_LABELS: Record<string, string> = { high: 'גבוה', medium: 'בינוני', low: 'נמוך' };

export default function MarketingPage({ showToast }: MarketingPageProps) {
  const [tab, setTab] = useState<Tab>('create');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState<Audience>('wedding');
  const [contentType, setContentType] = useState<ContentType>('caption');
  const [result, setResult] = useState<GenerationOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filter, setFilter] = useState<'all' | Audience>('all');
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const output = generateContent({ topic, audience, contentType, inputType: 'topic' });
      setResult(output);
      setIsGenerating(false);
    }, 600);
  };

  const generateFromIdea = (idea: ContentIdea) => {
    setTopic(idea.topic);
    setAudience(idea.audience);
    setContentType(idea.contentType);
    setIsGenerating(true);
    setTimeout(() => {
      const output = generateContent({ topic: idea.topic, audience: idea.audience, contentType: idea.contentType, inputType: 'topic' });
      setResult(output);
      setIsGenerating(false);
      setUsedIds(prev => new Set([...prev, idea.id]));
      setTab('create');
    }, 600);
  };

  const filteredIdeas = CONTENT_IDEAS.filter(i =>
    (filter === 'all' || i.audience === filter) && !usedIds.has(i.id)
  );

  const btnOutline = 'px-3 py-1.5 rounded-lg border text-sm font-medium';

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24" dir="rtl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f1f21]">🤖 שיווק ותוכן</h1>
          <p className="text-sm text-gray-500 mt-1">ייצור תוכן, 60 רעיונות, תכנון</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-[#059cc0]/10 text-[#059cc0] font-medium">{60 - usedIds.size} רעיונות</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 mb-4 shadow-sm">
        {([['create', '✨ יצירה'], ['ideas', '💡 60 רעיונות'], ['planner', '📅 תכנון']] as const).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === k ? 'bg-[#059cc0] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{v}</button>
        ))}
      </div>

      {/* CREATE TAB */}
      {tab === 'create' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <h2 className="font-bold text-[#1f1f21] mb-3">מה לייצר?</h2>

            {/* Audience */}
            <div className="flex gap-2 mb-3">
              {(Object.entries(AUDIENCE_LABELS) as [Audience, string][]).map(([k, v]) => (
                <button key={k} onClick={() => setAudience(k)} className={`${btnOutline} ${audience === k ? 'bg-[#03b28c] text-white border-[#03b28c]' : 'text-gray-600 border-gray-200'}`}>{v}</button>
              ))}
            </div>

            {/* Content type */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {(Object.entries(CONTENT_LABELS) as [ContentType, string][]).map(([k, v]) => (
                <button key={k} onClick={() => setContentType(k)} className={`${btnOutline} ${contentType === k ? 'bg-[#1f1f21] text-white border-[#1f1f21]' : 'text-gray-600 border-gray-200'}`}>{v}</button>
              ))}
            </div>

            {/* Input */}
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="כתוב נושא... למשל: טעויות שזוגות עושים בבחירת DJ"
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#059cc0]/30 min-h-[100px] resize-none mb-3"
            />

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className={`w-full py-3 rounded-xl text-white font-bold text-lg ${!topic.trim() || isGenerating ? 'bg-gray-300' : 'bg-[#059cc0] hover:bg-[#048aab]'} transition-colors`}
            >
              {isGenerating ? '⏳ מייצר...' : '✨ ייצר תוכן'}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-white rounded-2xl shadow-sm border p-4 border-[#059cc0]/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#1f1f21]">✨ תוצר</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  ⭐ {result.qaScore}/10 {result.passed ? '✅' : '❌'}
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed mb-3" dir="rtl">
                {result.content}
              </div>

              <p className="text-xs text-[#059cc0] mb-3" dir="ltr">{result.hashtags.join(' ')}</p>

              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(result.content); showToast('הועתק!'); }} className={`${btnOutline} text-gray-600 border-gray-200`}>📋 העתק</button>
                <button onClick={handleGenerate} className={`${btnOutline} text-[#059cc0] border-[#059cc0]`}>🔄 חדש</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* IDEAS TAB */}
      {tab === 'ideas' && (
        <div className="space-y-3">
          <div className="flex gap-2 mb-2">
            {(['all', 'wedding', 'course', 'brand'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`${btnOutline} ${filter === f ? 'bg-[#059cc0] text-white border-[#059cc0]' : 'text-gray-600 border-gray-200'}`}>
                {f === 'all' ? `הכל (${filteredIdeas.length})` : AUDIENCE_LABELS[f]}
              </button>
            ))}
          </div>

          {filteredIdeas.map(idea => (
            <div key={idea.id} className="bg-white rounded-2xl shadow-sm border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[idea.priority]}`}>{PRIORITY_LABELS[idea.priority]}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{AUDIENCE_LABELS[idea.audience]}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{CONTENT_LABELS[idea.contentType]}</span>
              </div>
              <p className="text-sm font-medium text-[#1f1f21] mb-1">{idea.topic}</p>
              <p className="text-xs text-gray-500 mb-3">זווית: {idea.angle}</p>
              <button onClick={() => generateFromIdea(idea)} className="px-4 py-2 rounded-xl text-white font-medium text-sm bg-[#059cc0] hover:bg-[#048aab] transition-colors">
                ✨ ייצר מהרעיון
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PLANNER TAB */}
      {tab === 'planner' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow-sm border p-4 text-center">
            <p className="text-4xl mb-3">📅</p>
            <h3 className="font-bold text-[#1f1f21] mb-2">תכנון תוכן שבועי</h3>
            <p className="text-sm text-gray-500 mb-4">בחר רעיונות ותזמן אותם ללוח השנה</p>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(d => (
                <div key={d} className="text-center">
                  <p className="text-xs text-gray-400 mb-1">{d}</p>
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border flex items-center justify-center mx-auto">
                    <span className="text-xs text-gray-300">+</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setTab('ideas')} className="px-4 py-2 rounded-xl text-white font-medium text-sm bg-[#059cc0]">
              💡 בחר רעיונות מהבנק
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-2xl shadow-sm border p-3 text-center">
              <p className="text-xl font-bold text-[#059cc0]">{60 - usedIds.size}</p>
              <p className="text-[10px] text-gray-500">רעיונות זמינים</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-3 text-center">
              <p className="text-xl font-bold text-[#03b28c]">{usedIds.size}</p>
              <p className="text-[10px] text-gray-500">נוצרו</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-3 text-center">
              <p className="text-xl font-bold text-purple-500">0</p>
              <p className="text-[10px] text-gray-500">מתוכננים</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
