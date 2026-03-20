import { useMemo } from 'react';
import type { HourlyStats } from '../../types';

interface HourlyPatternProps {
  stats: HourlyStats[];
  hardHours: number[];
  strongHours: number[];
}

export default function HourlyPattern({ stats, hardHours, strongHours }: HourlyPatternProps) {
  const maxValue = useMemo(
    () => Math.max(1, ...stats.map((s) => Math.max(s.falls, s.victories))),
    [stats]
  );

  const hasData = stats.some((s) => s.falls > 0 || s.victories > 0);

  if (!hasData) {
    return (
      <div className="text-center py-6">
        <p className="text-xs text-text-light">
          תעד רגעים כדי לגלות את הדפוס השעתי שלך
        </p>
      </div>
    );
  }

  const barHeight = 60;

  return (
    <div>
      <h3 className="text-xs text-text-light mb-3">דפוס שעתי - מתי אתה נופל ומתי מנצח?</h3>

      {/* Chart */}
      <div className="overflow-x-auto">
        <div className="flex items-end gap-[2px] min-w-[500px]" style={{ height: barHeight + 30 }}>
          {stats.map((s) => {
            const fallH = s.falls > 0 ? (s.falls / maxValue) * barHeight : 0;
            const victoryH = s.victories > 0 ? (s.victories / maxValue) * barHeight : 0;
            const isHard = hardHours.includes(s.hour);
            const isStrong = strongHours.includes(s.hour);

            return (
              <div key={s.hour} className="flex-1 flex flex-col items-center gap-[1px]">
                {/* Bars */}
                <div className="flex gap-[1px] items-end" style={{ height: barHeight }}>
                  {/* Falls */}
                  <div
                    className="w-[7px] rounded-t-sm transition-all"
                    style={{
                      height: fallH || 0,
                      backgroundColor: isHard ? '#e05c4d' : '#e05c4d80',
                      minHeight: s.falls > 0 ? 3 : 0,
                    }}
                    title={`נפילות: ${s.falls}`}
                  />
                  {/* Victories */}
                  <div
                    className="w-[7px] rounded-t-sm transition-all"
                    style={{
                      height: victoryH || 0,
                      backgroundColor: isStrong ? '#03b28c' : '#03b28c80',
                      minHeight: s.victories > 0 ? 3 : 0,
                    }}
                    title={`ניצחונות: ${s.victories}`}
                  />
                </div>
                {/* Hour label */}
                <span
                  className={`text-[8px] ${
                    isHard
                      ? 'text-coral font-bold'
                      : isStrong
                        ? 'text-sage font-bold'
                        : 'text-text-light'
                  }`}
                >
                  {s.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-coral" />
          <span className="text-[9px] text-text-light">נפילות</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-sage" />
          <span className="text-[9px] text-text-light">ניצחונות</span>
        </div>
      </div>

      {/* Insights badges */}
      <div className="flex flex-wrap gap-2 mt-3">
        {hardHours.length > 0 && (
          <div className="flex items-center gap-1 bg-coral/10 text-coral px-2.5 py-1 rounded-full text-[10px]">
            <span>⚠️</span>
            <span>שעות סיכון: {hardHours.map((h) => `${h}:00`).join(', ')}</span>
          </div>
        )}
        {strongHours.length > 0 && (
          <div className="flex items-center gap-1 bg-sage/10 text-sage px-2.5 py-1 rounded-full text-[10px]">
            <span>💪</span>
            <span>שעות כוח: {strongHours.map((h) => `${h}:00`).join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
