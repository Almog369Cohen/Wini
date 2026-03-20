import { useEffect, useState } from 'react';
import type { HistoryEntry } from '../shared/types';
import { LANGUAGE_NAMES } from '../modules/translation/translationService';

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await window.electronAPI.getHistory();
    setEntries(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await window.electronAPI.deleteHistoryEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClear = async () => {
    await window.electronAPI.clearHistory();
    setEntries([]);
  };

  const handleCopy = (text: string) => {
    window.electronAPI.copyToClipboard(text);
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  const filtered = searchQuery.trim()
    ? entries.filter(
        (e) =>
          e.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.translatedText.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
           style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-gray-800">History</h1>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
            {entries.length}
          </span>
        </div>
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          {entries.length > 0 && (
            <button onClick={handleClear}
              className="text-[10px] text-red-400 hover:text-red-600 transition-colors px-2 py-1">
              Clear All
            </button>
          )}
          <button onClick={handleClose}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <span className="text-gray-400 text-xs leading-none">×</span>
          </button>
        </div>
      </div>

      {/* Search */}
      {entries.length > 3 && (
        <div className="px-4 py-2 border-b border-gray-50">
          <input
            type="text"
            placeholder="Search translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-gray-100 transition-colors"
          />
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 text-center">
              {searchQuery ? 'No matching translations' : 'No translations yet'}
            </p>
            {!searchQuery && (
              <p className="text-xs text-gray-300 mt-1">
                Use Cmd+Shift+T to capture and translate
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((entry) => (
              <div key={entry.id} className="group px-4 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Original text */}
                    <p className="text-[12px] text-gray-400 truncate mb-0.5">
                      {entry.originalText}
                    </p>
                    {/* Translated text */}
                    <p className="text-[13px] text-gray-800 font-medium leading-snug">
                      {entry.translatedText}
                    </p>
                    {/* Meta */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-300">
                        {LANGUAGE_NAMES[entry.sourceLang] || entry.sourceLang}
                        {' → '}
                        {LANGUAGE_NAMES[entry.targetLang] || entry.targetLang}
                      </span>
                      <span className="text-[10px] text-gray-300">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => handleCopy(entry.translatedText)}
                      className="rounded-md bg-blue-50 hover:bg-blue-100 text-blue-500 text-[10px] px-2 py-1 transition-colors">
                      Copy
                    </button>
                    <button onClick={() => handleDelete(entry.id)}
                      className="rounded-md bg-red-50 hover:bg-red-100 text-red-400 text-[10px] px-2 py-1 transition-colors">
                      Del
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
