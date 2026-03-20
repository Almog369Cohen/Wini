import { useEffect, useState } from 'react';

interface ResultData {
  originalText: string;
  translatedText: string;
}

export default function ResultPopup() {
  const [data, setData] = useState<ResultData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.electronAPI.onResultData((resultData) => {
      setData(resultData);
    });
  }, []);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClose = () => {
    window.electronAPI.closeResult();
  };

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl bg-white/95 backdrop-blur-lg p-4">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl bg-white/95 backdrop-blur-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Translation
        </span>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Original text */}
        {data.originalText && (
          <div>
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
              Original
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              {data.originalText}
            </div>
          </div>
        )}

        {/* Translated text */}
        <div>
          <div className="text-[10px] font-medium text-blue-500 uppercase tracking-wide mb-1">
            Translated
          </div>
          <div className="text-sm text-gray-900 font-medium leading-relaxed">
            {data.translatedText}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-100">
        <button
          onClick={handleCopy}
          className="flex-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy Translation'}
        </button>
        <button
          onClick={handleClose}
          className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium py-2 px-4 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
