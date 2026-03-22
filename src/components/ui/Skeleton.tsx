import { motion } from 'framer-motion';

// ─── Base Skeleton Pulse ──────────────────────────────────────────

function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-cream-dark rounded-lg ${className}`}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ─── Dashboard Skeleton ───────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="w-10 h-10 rounded-full" />
          <div>
            <SkeletonPulse className="w-24 h-4 mb-1.5" />
            <SkeletonPulse className="w-36 h-3" />
          </div>
        </div>
        <SkeletonPulse className="w-8 h-8 rounded-lg" />
      </div>

      {/* Score Gauge */}
      <div className="bg-card rounded-2xl p-5 flex flex-col items-center">
        <SkeletonPulse className="w-40 h-20 rounded-xl mb-3" />
        <SkeletonPulse className="w-20 h-4" />
      </div>

      {/* Mini Rings */}
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl p-3 flex flex-col items-center">
            <SkeletonPulse className="w-10 h-10 rounded-full mb-2" />
            <SkeletonPulse className="w-12 h-3" />
          </div>
        ))}
      </div>

      {/* Victory Counter */}
      <div className="bg-card rounded-2xl p-4 flex items-center gap-4">
        <SkeletonPulse className="w-[78px] h-[78px] rounded-full" />
        <div className="flex-1">
          <SkeletonPulse className="w-28 h-4 mb-2" />
          <SkeletonPulse className="w-full h-2 rounded-full" />
        </div>
      </div>

      {/* Week Chart */}
      <div className="bg-card rounded-2xl p-4">
        <SkeletonPulse className="w-20 h-3 mb-3" />
        <div className="flex items-end gap-2 h-16">
          {[40, 65, 30, 80, 55, 70, 45].map((h, i) => (
            <SkeletonPulse key={i} className="flex-1 rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      {/* Mood + Quote */}
      <div className="bg-card rounded-2xl p-4">
        <SkeletonPulse className="w-full h-12 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Habit List Skeleton ──────────────────────────────────────────

export function HabitListSkeleton() {
  return (
    <div className="p-4 space-y-3" dir="rtl">
      <SkeletonPulse className="w-32 h-6 mb-4" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-2xl p-4 flex items-center gap-3">
          <SkeletonPulse className="w-12 h-12 rounded-xl" />
          <div className="flex-1">
            <SkeletonPulse className="w-28 h-4 mb-2" />
            <SkeletonPulse className="w-20 h-3" />
          </div>
          <SkeletonPulse className="w-10 h-10 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Generic Page Skeleton ────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="p-4 space-y-4" dir="rtl">
      <SkeletonPulse className="w-40 h-6 mb-2" />
      <SkeletonPulse className="w-64 h-4" />
      <div className="space-y-3 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-2xl p-4">
            <SkeletonPulse className="w-full h-16 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Card Skeleton ────────────────────────────────────────────────

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-card rounded-2xl p-4 space-y-2.5">
      <SkeletonPulse className="w-24 h-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse key={i} className={`h-3 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  );
}

export { SkeletonPulse };
