import { useMemo } from 'react';
import { format, subDays, startOfDay } from 'date-fns';
import { he } from 'date-fns/locale';
import type { JournalEntry } from '../../types';

interface MoodChartProps {
  entries: JournalEntry[];
}

export default function MoodChart({ entries }: MoodChartProps) {
  const dailyData = useMemo(() => {
    const days = 14;
    const today = startOfDay(new Date());
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - 1 - i);
      const dateStr = date.toDateString();
      const dayEntries = entries.filter(
        (e) => new Date(e.date).toDateString() === dateStr
      );
      return {
        date,
        falls: dayEntries.filter((e) => e.type === 'fall').length,
        victories: dayEntries.filter((e) => e.type === 'victory').length,
      };
    });
  }, [entries]);

  const hasData = dailyData.some((d) => d.falls > 0 || d.victories > 0);
  if (!hasData) {
    return (
      <div className="text-center py-6">
        <p className="text-xs text-text-light">
          צריך לפחות כמה רשומות כדי להציג מגמות
        </p>
      </div>
    );
  }

  const maxVal = Math.max(1, ...dailyData.map((d) => Math.max(d.falls, d.victories)));
  const chartH = 80;
  const chartW = dailyData.length * 40;

  const fallPoints = dailyData
    .map((d, i) => `${i * 40 + 20},${chartH - (d.falls / maxVal) * chartH}`)
    .join(' ');

  const victoryPoints = dailyData
    .map((d, i) => `${i * 40 + 20},${chartH - (d.victories / maxVal) * chartH}`)
    .join(' ');

  return (
    <div>
      <h3 className="text-xs text-text-light mb-2">מגמת נפילות וניצחונות - 14 ימים</h3>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartW} ${chartH + 25}`}
          className="w-full min-w-[300px]"
          style={{ maxWidth: chartW }}
        >
          {/* Grid */}
          {[0, 0.5, 1].map((v) => (
            <line
              key={v}
              x1="0" y1={chartH - v * chartH}
              x2={chartW} y2={chartH - v * chartH}
              stroke="#e8e0d0" strokeWidth="0.5"
            />
          ))}

          {/* Victory line */}
          <polyline
            fill="none" stroke="#5b8a72" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            points={victoryPoints}
          />

          {/* Fall line */}
          <polyline
            fill="none" stroke="#c97b63" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="4 2"
            points={fallPoints}
          />

          {/* Points and labels */}
          {dailyData.map((d, i) => (
            <g key={i}>
              {d.victories > 0 && (
                <circle cx={i * 40 + 20} cy={chartH - (d.victories / maxVal) * chartH} r="3" fill="#5b8a72" />
              )}
              {d.falls > 0 && (
                <circle cx={i * 40 + 20} cy={chartH - (d.falls / maxVal) * chartH} r="3" fill="#c97b63" />
              )}
              <text x={i * 40 + 20} y={chartH + 14} textAnchor="middle" fontSize="8" fill="#6b6b6b">
                {format(d.date, 'd/M', { locale: he })}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-sage rounded" />
          <span className="text-[9px] text-text-light">ניצחונות</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-coral rounded" style={{ borderTop: '1px dashed #c97b63' }} />
          <span className="text-[9px] text-text-light">נפילות</span>
        </div>
      </div>
    </div>
  );
}
