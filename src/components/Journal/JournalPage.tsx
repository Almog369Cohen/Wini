import { useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, BarChart3, Lightbulb, ThumbsDown, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import type { JournalEntry, MomentType, WithdrawalSymptom, HourlyStats } from '../../types';
import MomentLogger from './MomentLogger';
import HourlyPattern from './HourlyPattern';
import MoodChart from './MoodChart';
import Heatmap from './Heatmap';

interface JournalPageProps {
  entries: JournalEntry[];
  addEntry: (data: {
    type: MomentType;
    mood: number;
    cravingIntensity: number;
    note: string;
    triggers?: string[];
    whatHelped?: string;
    symptoms?: WithdrawalSymptom[];
  }) => JournalEntry;
  hourlyStats: HourlyStats[];
  hardHours: number[];
  strongHours: number[];
  insights: string[];
  todaySummary: { falls: number; victories: number; total: number };
}

type JournalTab = 'log' | 'patterns' | 'insights';

export default function JournalPage({
  entries,
  addEntry,
  hourlyStats,
  hardHours,
  strongHours,
  insights,
  todaySummary,
}: JournalPageProps) {
  const [tab, setTab] = useState<JournalTab>('log');

  return (
    <motion.div
      key="journal"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 max-w-lg mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">הרגעים שלי</h1>
        {todaySummary.total > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-0.5 text-sage">
              <Trophy size={12} /> {todaySummary.victories}
            </span>
            <span className="flex items-center gap-0.5 text-coral">
              <ThumbsDown size={12} /> {todaySummary.falls}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-card rounded-xl p-1 shadow-sm mb-5">
        {([
          { id: 'log' as const, label: 'רשום רגע', Icon: PenLine },
          { id: 'patterns' as const, label: 'דפוסים', Icon: BarChart3 },
          { id: 'insights' as const, label: 'טיפים', Icon: Lightbulb },
        ]).map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs transition-all ${
              tab === id ? 'bg-sage/10 text-sage font-medium' : 'text-text-light'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Log tab */}
      {tab === 'log' && (
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-5 shadow-sm">
            <MomentLogger onSubmit={addEntry} />
          </div>

          {/* Recent moments */}
          {entries.length > 0 && (
            <div className="bg-card rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs text-text-light font-semibold mb-3">רגעים אחרונים</h3>
              <div className="space-y-2.5">
                {entries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-start gap-3 rounded-xl p-3 ${
                      entry.type === 'fall' ? 'bg-coral/5' : 'bg-sage/5'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        entry.type === 'fall' ? 'bg-coral/15' : 'bg-sage/15'
                      }`}
                    >
                      {entry.type === 'fall' ? (
                        <ThumbsDown size={14} className="text-coral" />
                      ) : (
                        <Trophy size={14} className="text-sage" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${
                          entry.type === 'fall' ? 'text-coral' : 'text-sage'
                        }`}>
                          {entry.type === 'fall' ? 'נפילה' : 'ניצחון'}
                        </span>
                        <span className="text-[10px] text-text-light">
                          {format(new Date(entry.date), 'HH:mm · EEEE', { locale: he })}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-xs text-text mt-0.5 line-clamp-2">{entry.note}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-text-light">
                          דחף: {entry.cravingIntensity}/10
                        </span>
                        {entry.whatHelped && (
                          <span className="text-[10px] text-sage">
                            עזר: {entry.whatHelped}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Patterns tab */}
      {tab === 'patterns' && (
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-4 shadow-sm">
            <HourlyPattern
              stats={hourlyStats}
              hardHours={hardHours}
              strongHours={strongHours}
            />
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-sm">
            <MoodChart entries={entries} />
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-sm">
            <Heatmap entries={entries} />
          </div>
        </div>
      )}

      {/* Insights tab */}
      {tab === 'insights' && (
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-text mb-4 text-center">
            מה הנתונים אומרים
          </h3>
          <div className="space-y-3">
            {insights.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 bg-sage/5 rounded-xl p-3"
              >
                <div className="w-6 h-6 rounded-full bg-sage/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb size={12} className="text-sage" />
                </div>
                <p className="text-sm text-text leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats summary */}
          {entries.length > 0 && (
            <div className="mt-5 pt-4 border-t border-cream-dark">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-text">{entries.length}</p>
                  <p className="text-[10px] text-text-light">רגעים סה"כ</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-sage">
                    {entries.filter((e) => e.type === 'victory').length}
                  </p>
                  <p className="text-[10px] text-text-light">ניצחונות</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-coral">
                    {entries.filter((e) => e.type === 'fall').length}
                  </p>
                  <p className="text-[10px] text-text-light">נפילות</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="h-6" />
    </motion.div>
  );
}
