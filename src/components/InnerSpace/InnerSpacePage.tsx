import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Mail, Map, Feather } from 'lucide-react';
import type { InnerSpaceData, Page } from '../../types';
import ReflectionCards from './ReflectionCards';
import NeedsMap from './NeedsMap';
import LetterWriter from './LetterWriter';
import JourneyMap from './JourneyMap';

type InnerTab = 'reflect' | 'needs' | 'letter' | 'journey';

interface InnerSpacePageProps {
  data: InnerSpaceData;
  addReflection: (promptId: string, answer: string) => void;
  toggleNeed: (needId: string) => void;
  setNeedNote: (needId: string, note: string) => void;
  addLetter: (content: string, type: 'past' | 'future', openDate?: string) => void;
  setJourneyStage: (stage: number) => void;
  onNavigate?: (page: Page) => void;
}

export default function InnerSpacePage({
  data,
  addReflection,
  toggleNeed,
  setNeedNote,
  addLetter,
  setJourneyStage,
  onNavigate,
}: InnerSpacePageProps) {
  const [tab, setTab] = useState<InnerTab>('reflect');

  const tabs: { id: InnerTab; label: string; Icon: typeof Heart }[] = [
    { id: 'reflect', label: 'שיקוף', Icon: Brain },
    { id: 'needs', label: 'צרכים', Icon: Heart },
    { id: 'letter', label: 'מכתב', Icon: Mail },
    { id: 'journey', label: 'מסע', Icon: Map },
  ];

  return (
    <motion.div
      key="innerspace"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 pt-6 max-w-lg mx-auto"
    >
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-text">המרחב שלי</h1>
        <p className="text-xs text-text-light mt-1">מקום בטוח להבין את עצמך</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-card rounded-xl p-1 shadow-sm mb-5">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[11px] transition-all ${
              tab === id ? 'bg-sage/10 text-sage font-medium' : 'text-text-light'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'reflect' && (
        <ReflectionCards
          reflections={data.reflections}
          journeyStage={data.journeyStage}
          onAnswer={addReflection}
        />
      )}

      {tab === 'needs' && (
        <NeedsMap
          selectedNeeds={data.emotionalNeeds}
          needNotes={data.needNotes}
          onToggle={toggleNeed}
          onNote={setNeedNote}
        />
      )}

      {tab === 'letter' && (
        <LetterWriter
          letters={data.letters}
          onWrite={addLetter}
        />
      )}

      {tab === 'journey' && (
        <JourneyMap
          currentStage={data.journeyStage}
          onSetStage={setJourneyStage}
          reflectionCount={data.reflections.length}
          needsCount={data.emotionalNeeds.length}
        />
      )}

      {/* Farewell Letter CTA */}
      {onNavigate && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => onNavigate('farewell')}
          className="w-full mt-4 bg-card rounded-2xl shadow-sm p-4 flex items-center gap-3 text-right border border-cream-dark"
        >
          <div className="w-11 h-11 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
            <Feather size={20} className="text-sage" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text">מכתב פרידה להרגל</p>
            <p className="text-[11px] text-text-light">כתוב מכתב פרידה ושחרר בשלום</p>
          </div>
          <span className="text-sage text-xs font-medium">התחל →</span>
        </motion.button>
      )}

      <div className="h-6" />
    </motion.div>
  );
}
