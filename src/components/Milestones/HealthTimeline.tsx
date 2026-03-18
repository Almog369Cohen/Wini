import { motion } from 'framer-motion';
import { differenceInMinutes } from 'date-fns';
import type { Milestone } from '../../types';

interface HealthTimelineProps {
  milestones: Milestone[];
  startDate: string;
}

export default function HealthTimeline({ milestones, startDate }: HealthTimelineProps) {
  const minutesElapsed = differenceInMinutes(new Date(), new Date(startDate));

  return (
    <div className="space-y-3">
      {milestones.map((m, i) => {
        const reached = minutesElapsed >= m.timeRequired;
        const progress = Math.min(1, minutesElapsed / m.timeRequired);

        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
              reached
                ? 'bg-sage/10 border border-sage/20'
                : 'bg-cream/30 border border-cream-dark'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
                reached ? 'bg-sage/20' : 'bg-cream-dark'
              }`}
            >
              {reached ? m.icon : '🔒'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-sm font-medium ${
                    reached ? 'text-sage' : 'text-text-light'
                  }`}
                >
                  {m.title}
                </h3>
                {reached && (
                  <span className="text-[10px] bg-sage/20 text-sage px-2 py-0.5 rounded-full">
                    הושג!
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  reached ? 'text-text' : 'text-text-light'
                }`}
              >
                {m.description}
              </p>
              {!reached && (
                <div className="mt-2">
                  <div className="h-1 bg-cream-dark rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-sand rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    />
                  </div>
                  <span className="text-[9px] text-text-light">
                    {(progress * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
