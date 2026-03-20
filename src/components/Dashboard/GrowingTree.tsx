import { motion } from 'framer-motion';

interface GrowingTreeProps {
  daysSinceStart: number;
}

export default function GrowingTree({ daysSinceStart }: GrowingTreeProps) {
  // Tree grows through stages: seed(0), sprout(1-3), sapling(4-14), young(15-30), mature(31+)
  const stage =
    daysSinceStart === 0
      ? 'seed'
      : daysSinceStart <= 3
        ? 'sprout'
        : daysSinceStart <= 14
          ? 'sapling'
          : daysSinceStart <= 30
            ? 'young'
            : 'mature';

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <motion.svg
        viewBox="0 0 200 200"
        className="w-40 h-40"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Ground */}
        <ellipse cx="100" cy="175" rx="60" ry="8" fill="#059cc0" opacity="0.3" />

        {stage === 'seed' && (
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
            <circle cx="100" cy="168" r="6" fill="#059cc0" />
            <text x="100" y="150" textAnchor="middle" fontSize="12" fill="#6b6b6b">
              זרע חדש
            </text>
          </motion.g>
        )}

        {stage === 'sprout' && (
          <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: '100%', transformOrigin: '100px 170px' }}>
            <line x1="100" y1="170" x2="100" y2="145" stroke="#03b28c" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="93" cy="142" rx="8" ry="5" fill="#059cc0" transform="rotate(-20 93 142)" />
            <ellipse cx="107" cy="142" rx="8" ry="5" fill="#059cc0" transform="rotate(20 107 142)" />
          </motion.g>
        )}

        {stage === 'sapling' && (
          <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: '100%', transformOrigin: '100px 170px' }}>
            <line x1="100" y1="170" x2="100" y2="115" stroke="#03b28c" strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="140" x2="80" y2="125" stroke="#03b28c" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="100" y1="130" x2="120" y2="118" stroke="#03b28c" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="75" cy="120" r="12" fill="#059cc0" opacity="0.8" />
            <circle cx="125" cy="113" r="10" fill="#059cc0" opacity="0.8" />
            <circle cx="100" cy="108" r="14" fill="#03b28c" opacity="0.6" />
          </motion.g>
        )}

        {stage === 'young' && (
          <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: '100%', transformOrigin: '100px 170px' }}>
            <line x1="100" y1="170" x2="100" y2="90" stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="140" x2="70" y2="115" stroke="#8B7355" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="125" x2="130" y2="100" stroke="#8B7355" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="110" x2="78" y2="88" stroke="#8B7355" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="65" cy="108" r="16" fill="#059cc0" opacity="0.7" />
            <circle cx="135" cy="93" r="14" fill="#03b28c" opacity="0.7" />
            <circle cx="73" cy="82" r="13" fill="#059cc0" opacity="0.6" />
            <circle cx="100" cy="78" r="18" fill="#03b28c" opacity="0.6" />
            <circle cx="115" cy="70" r="12" fill="#059cc0" opacity="0.7" />
          </motion.g>
        )}

        {stage === 'mature' && (
          <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: '100%', transformOrigin: '100px 170px' }}>
            {/* Trunk */}
            <path d="M95 170 Q93 140 90 120 Q88 100 95 85" stroke="#8B7355" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M105 170 Q107 140 110 120 Q112 100 105 85" stroke="#8B7355" strokeWidth="7" fill="none" strokeLinecap="round" />
            {/* Branches */}
            <line x1="92" y1="130" x2="60" y2="100" stroke="#8B7355" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="108" y1="125" x2="140" y2="95" stroke="#8B7355" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="95" y1="105" x2="65" y2="75" stroke="#8B7355" strokeWidth="3" strokeLinecap="round" />
            <line x1="105" y1="100" x2="130" y2="70" stroke="#8B7355" strokeWidth="3" strokeLinecap="round" />
            {/* Foliage */}
            <circle cx="55" cy="92" r="18" fill="#03b28c" opacity="0.7" />
            <circle cx="145" cy="88" r="16" fill="#059cc0" opacity="0.7" />
            <circle cx="60" cy="70" r="16" fill="#059cc0" opacity="0.6" />
            <circle cx="135" cy="63" r="15" fill="#03b28c" opacity="0.7" />
            <circle cx="100" cy="65" r="22" fill="#03b28c" opacity="0.65" />
            <circle cx="80" cy="55" r="18" fill="#059cc0" opacity="0.6" />
            <circle cx="120" cy="52" r="17" fill="#03b28c" opacity="0.65" />
            <circle cx="100" cy="45" r="16" fill="#059cc0" opacity="0.5" />
            {/* Flowers/fruits */}
            <circle cx="70" cy="65" r="3" fill="#059cc0" opacity="0.8" />
            <circle cx="125" cy="55" r="3" fill="#059cc0" opacity="0.8" />
            <circle cx="95" cy="50" r="3" fill="#e05c4d" opacity="0.7" />
          </motion.g>
        )}
      </motion.svg>

      <p className="text-xs text-text-light mt-1">
        {stage === 'seed' && 'העץ שלך מחכה לצמוח...'}
        {stage === 'sprout' && 'הנבט הראשון בוקע!'}
        {stage === 'sapling' && 'השתיל שלך גדל יפה'}
        {stage === 'young' && 'העץ שלך מתחזק'}
        {stage === 'mature' && 'העץ שלך פורח!'}
      </p>
    </div>
  );
}
