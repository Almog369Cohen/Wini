import { useEffect, useState } from 'react';
import { LANGUAGE_NAMES } from '../modules/translation/translationService';

interface ResultData {
  originalText: string;
  translatedText: string;
  sourceLang?: string;
  confidence?: number;
}

export default function ResultPopup() {
  const [data, setData] = useState<ResultData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.electronAPI.onResultData((resultData) => {
      setData(resultData);
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.electronAPI.closeResult();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleCopy = () => {
    if (!data) return;
    window.electronAPI.copyToClipboard(data.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyOriginal = () => {
    if (!data?.originalText) return;
    window.electronAPI.copyToClipboard(data.originalText);
  };

  const handleClose = () => window.electronAPI.closeResult();

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-white/95 backdrop-blur-xl p-4">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
      </div>
    );
  }

  const hasOriginal = data.originalText.trim().length > 0;
  const sourceLangName = data.sourceLang ? LANGUAGE_NAMES[data.sourceLang] || data.sourceLang : null;

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
           style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Translation
          </span>
          {sourceLangName && (
            <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              {sourceLangName}
            </span>
          )}
          {data.confidence != null && data.confidence > 0 && (
            <span className={`text-[10px] rounded-full px-2 py-0.5 ${
              data.confidence >= 80 ? 'text-green-600 bg-green-50' :
              data.confidence >= 50 ? 'text-amber-600 bg-amber-50' :
              'text-red-500 bg-red-50'
            }`}>
              {Math.round(data.confidence)}%
            </span>
          )}
        </div>
        <button onClick={handleClose}
          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <span className="text-gray-400 text-xs leading-none">×</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {hasOriginal && (
          <div className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                Detected Text
              </span>
              <button onClick={handleCopyOriginal}
                className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 hover:text-gray-600 transition-all">
                Copy
              </button>
            </div>
            <div className="text-[13px] text-gray-500 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">
              {data.originalText}
            </div>
          </div>
        )}

        <div>
          <div className="text-[10px] font-medium text-blue-500 uppercase tracking-wide mb-1">
            {hasOriginal ? 'Translation' : 'Result'}
          </div>
          <div className="text-[14px] text-gray-900 font-medium leading-relaxed">
            {data.translatedText}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <button onClick={handleCopy}
          className={`flex-1 rounded-xl text-xs font-semibold py-2.5 transition-all ${
            copied ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}>
          {copied ? 'Copied!' : 'Copy Translation'}
        </button>
        <button onClick={() => window.electronAPI.openHistory()}
          className="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-medium py-2.5 px-3 transition-colors">
          History
        </button>
        <button onClick={handleClose}
          className="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-medium py-2.5 px-3 transition-colors">
          Done
        </button>
      </div>
    </div>
  );
}
