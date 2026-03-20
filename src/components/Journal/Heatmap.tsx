import { useMemo } from 'react';
import { format, subDays, startOfDay } from 'date-fns';
import { he } from 'date-fns/locale';
import type { JournalEntry } from '../../types';

interface HeatmapProps {
  entries: JournalEntry[];
  days?: number;
}

export default function Heatmap({ entries, days = 90 }: HeatmapProps) {
  const data = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - 1 - i);
      const dateStr = date.toDateString();
      const dayEntries = entries.filter(
        (e) => new Date(e.date).toDateString() === dateStr
      );
      const falls = dayEntries.filter((e) => e.type === 'fall').length;
      const victories = dayEntries.filter((e) => e.type === 'victory').length;
      return {
        date,
        key: format(date, 'yyyy-MM-dd'),
        falls,
        victories,
        total: falls + victories,
      };
    });
  }, [entries, days]);

  const weeks = useMemo(() => {
    const result: (typeof data)[] = [];
    let week: typeof data = [];
    const firstDay = data[0]?.date.getDay() ?? 0;
    for (let i = 0; i < firstDay; i++) {
      week.push({ date: new Date(0), key: `pad-${i}`, falls: 0, victories: 0, total: 0 });
    }
    data.forEach((d) => {
      week.push(d);
      if (week.length === 7) {
        result.push(week);
        week = [];
      }
    });
    if (week.length > 0) result.push(week);
    return result;
  }, [data]);

  const getColor = (day: { falls: number; victories: number; total: number; key: string }) => {
    if (day.key.startsWith('pad-')) return 'transparent';
    if (day.total === 0) return '#dceee9';
    const ratio = day.victories / day.total;
    if (ratio >= 0.8) return '#03b28c';      // mostly victories
    if (ratio >= 0.6) return '#059cc0';
    if (ratio >= 0.4) return '#3ab3cf';      // mixed
    if (ratio >= 0.2) return '#059cc0';
    return '#e05c4d';                         // mostly falls
  };

  const dayLabels = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  return (
    <div>
      <h3 className="text-xs text-text-light mb-3">מפת ימים - {days} ימים אחרונים</h3>

      <div className="flex gap-0.5">
        <div className="flex flex-col gap-0.5 ml-1">
          {dayLabels.map((d, i) => (
            <div key={i} className="w-3 h-3 flex items-center justify-center">
              <span className="text-[7px] text-text-light">{i % 2 === 0 ? d : ''}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-0.5 overflow-x-auto flex-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day) => (
                <div
                  key={day.key}
                  className="w-3 h-3 rounded-[2px] transition-colors"
                  style={{ backgroundColor: getColor(day) }}
                  title={
                    day.key.startsWith('pad-')
                      ? ''
                      : `${format(day.date, 'd MMM', { locale: he })} - ${day.victories} ניצחונות, ${day.falls} נפילות`
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 mt-3">
        <span className="text-[9px] text-text-light">נפילות</span>
        <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: '#e05c4d' }} />
        <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: '#059cc0' }} />
        <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: '#3ab3cf' }} />
        <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: '#059cc0' }} />
        <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: '#03b28c' }} />
        <span className="text-[9px] text-text-light">ניצחונות</span>
        <div className="w-px h-3 bg-cream-dark mx-1" />
        <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: '#dceee9' }} />
        <span className="text-[9px] text-text-light">ריק</span>
      </div>
    </div>
  );
}
