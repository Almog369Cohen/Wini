import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Image,
  Type,
  X,
  Heart,
  Star,
  Sun,
  Shield,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { ReinforcementItem } from '../../types';
import { getRandomQuote } from '../../data/quotes1000';

const CATEGORIES = [
  { id: 'why' as const, label: 'למה אני עושה את זה', emoji: '🎯', icon: Star },
  { id: 'strength' as const, label: 'הכוח שלי', emoji: '💪', icon: Shield },
  { id: 'future' as const, label: 'העתיד שלי', emoji: '🌅', icon: Sun },
  { id: 'love' as const, label: 'מה שאני אוהב', emoji: '❤️', icon: Heart },
];

export default function ReinforcementGallery() {
  const [items, setItems] = useLocalStorage<ReinforcementItem[]>('wini-reinforcement', []);
  const [showAdd, setShowAdd] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<ReinforcementItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add form state
  const [addType, setAddType] = useState<'quote' | 'image'>('quote');
  const [addText, setAddText] = useState('');
  const [addCategory, setAddCategory] = useState<'why' | 'strength' | 'future' | 'love'>('why');
  const [addImage, setAddImage] = useState<string | null>(null);

  const filteredItems = activeCategory
    ? items.filter(i => i.category === activeCategory)
    : items;

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAddImage(reader.result as string);
      setAddType('image');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (addType === 'quote' && !addText.trim()) return;
    if (addType === 'image' && !addImage) return;

    const item: ReinforcementItem = {
      id: crypto.randomUUID(),
      type: addType,
      content: addType === 'quote' ? addText.trim() : addImage!,
      category: addCategory,
      dateAdded: new Date().toISOString(),
    };

    setItems(prev => [...prev, item]);
    setShowAdd(false);
    setAddText('');
    setAddImage(null);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setViewItem(null);
  };

  const breakingQuote = getRandomQuote('breaking');

  return (
    <div className="space-y-4">
      {/* Emergency quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-coral/10 rounded-2xl p-4 border border-coral/20"
      >
        <p className="text-sm font-medium text-coral mb-1">💫 תזכורת לרגע הזה</p>
        <p className="text-text text-sm leading-relaxed">"{breakingQuote.text}"</p>
      </motion.div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            !activeCategory ? 'bg-sage text-white' : 'bg-card text-text-light border border-cream-dark'
          }`}
        >
          הכל ({items.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = items.filter(i => i.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                activeCategory === cat.id ? 'bg-sage text-white' : 'bg-card text-text-light border border-cream-dark'
              }`}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Items grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">🖼️</p>
          <p className="text-text-light text-sm">
            הוסף תמונות ומשפטים שיחזקו אותך ברגעי שבירה
          </p>
          <p className="text-text-light text-xs mt-1">
            תמונה של מי שאתה אוהב, משפט שמחזק, חלום שלך
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setViewItem(item)}
              className="bg-card rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
            >
              {item.type === 'image' ? (
                <div className="aspect-square">
                  <img
                    src={item.content}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square p-3 flex items-center justify-center bg-sage/5">
                  <p className="text-sm text-text text-center leading-relaxed line-clamp-5">
                    "{item.content}"
                  </p>
                </div>
              )}
              <div className="p-2 flex items-center gap-1">
                <span className="text-xs">
                  {CATEGORIES.find(c => c.id === item.category)?.emoji}
                </span>
                <span className="text-[10px] text-text-light">
                  {CATEGORIES.find(c => c.id === item.category)?.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAdd(true)}
        className="w-full bg-sage text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        הוסף חיזוק
      </motion.button>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200] flex items-end justify-center"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="bg-cream rounded-t-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text">הוסף חיזוק</h3>
                <button onClick={() => setShowAdd(false)}>
                  <X size={24} className="text-text-light" />
                </button>
              </div>

              {/* Type selector */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setAddType('quote')}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium ${
                    addType === 'quote' ? 'bg-sage text-white' : 'bg-card text-text-light border border-cream-dark'
                  }`}
                >
                  <Type size={16} />
                  משפט
                </button>
                <button
                  onClick={() => { setAddType('image'); fileInputRef.current?.click(); }}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium ${
                    addType === 'image' ? 'bg-sage text-white' : 'bg-card text-text-light border border-cream-dark'
                  }`}
                >
                  <Image size={16} />
                  תמונה
                </button>
              </div>

              {/* Content */}
              {addType === 'quote' ? (
                <textarea
                  value={addText}
                  onChange={e => setAddText(e.target.value)}
                  placeholder="כתוב משפט שמחזק אותך..."
                  className="w-full h-24 bg-card rounded-xl p-3 text-right resize-none border border-cream-dark focus:border-sage focus:outline-none text-sm"
                  dir="rtl"
                />
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddImage}
                  />
                  {addImage ? (
                    <div className="relative rounded-xl overflow-hidden mb-2">
                      <img src={addImage} alt="" className="w-full h-48 object-cover" />
                      <button
                        onClick={() => { setAddImage(null); setAddType('quote'); }}
                        className="absolute top-2 left-2 bg-black/50 rounded-full p-1"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 bg-card rounded-xl border-2 border-dashed border-cream-dark flex flex-col items-center justify-center gap-2 text-text-light"
                    >
                      <Image size={32} />
                      <span className="text-sm">בחר תמונה</span>
                    </button>
                  )}
                </div>
              )}

              {/* Category */}
              <p className="text-sm font-medium text-text mt-4 mb-2">קטגוריה</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setAddCategory(cat.id)}
                    className={`p-2 rounded-xl text-sm flex items-center gap-2 ${
                      addCategory === cat.id
                        ? 'bg-sage/10 border-2 border-sage text-sage'
                        : 'bg-card border border-cream-dark text-text-light'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSave}
                disabled={addType === 'quote' ? !addText.trim() : !addImage}
                className="w-full bg-sage text-white py-3 rounded-xl font-semibold disabled:opacity-40"
              >
                שמור
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View modal */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4"
            onClick={() => setViewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
              className="bg-cream rounded-2xl overflow-hidden max-w-sm w-full"
            >
              {viewItem.type === 'image' ? (
                <img src={viewItem.content} alt="" className="w-full" />
              ) : (
                <div className="p-8 flex items-center justify-center min-h-[200px] bg-sage/5">
                  <p className="text-lg text-text text-center leading-relaxed">
                    "{viewItem.content}"
                  </p>
                </div>
              )}
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-text-light">
                  {CATEGORIES.find(c => c.id === viewItem.category)?.emoji}{' '}
                  {CATEGORIES.find(c => c.id === viewItem.category)?.label}
                </span>
                <button
                  onClick={() => handleDelete(viewItem.id)}
                  className="text-red-400 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
