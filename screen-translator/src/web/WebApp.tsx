import { useState, useCallback, useRef, useEffect } from 'react';
import { installWebAPI, startWebCapture, webEmit } from './webAPI';
import { extractText } from '../modules/ocr/ocrService';
import { translateText, LANGUAGE_NAMES } from '../modules/translation/translationService';
import type { HistoryEntry } from '../shared/types';

// Install web polyfill before anything else
installWebAPI();

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'he', name: 'Hebrew', flag: '\u{1F1EE}\u{1F1F1}' },
  { code: 'es', name: 'Spanish', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'fr', name: 'French', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'de', name: 'German', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'it', name: 'Italian', flag: '\u{1F1EE}\u{1F1F9}' },
  { code: 'pt', name: 'Portuguese', flag: '\u{1F1E7}\u{1F1F7}' },
  { code: 'ru', name: 'Russian', flag: '\u{1F1F7}\u{1F1FA}' },
  { code: 'ja', name: 'Japanese', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'ko', name: 'Korean', flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'zh', name: 'Chinese', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'ar', name: 'Arabic', flag: '\u{1F1F8}\u{1F1E6}' },
];

type View = 'home' | 'capturing' | 'selecting' | 'processing' | 'result' | 'history' | 'settings';

interface ResultData {
  originalText: string;
  translatedText: string;
  sourceLang?: string;
  confidence?: number;
}

export default function WebApp() {
  const [view, setView] = useState<View>('home');
  const [targetLang, setTargetLang] = useState(() => {
    try {
      const s = localStorage.getItem('screen-translator-settings');
      return s ? JSON.parse(s).targetLang || 'en' : 'en';
    } catch { return 'en'; }
  });
  const [result, setResult] = useState<ResultData | null>(null);
  const [processingStep, setProcessingStep] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  // Selection state
  const [selection, setSelection] = useState({ startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem('screen-translator-history');
      setHistory(raw ? JSON.parse(raw) : []);
    } catch { setHistory([]); }
  };

  const handleCapture = useCallback(async () => {
    setView('capturing');
    setProcessingStep('Choose a screen to share...');

    const dataUrl = await startWebCapture();
    if (!dataUrl) {
      setView('home');
      return;
    }

    setScreenshot(dataUrl);
    setView('selecting');
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSelection({
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      endX: e.clientX - rect.left,
      endY: e.clientY - rect.top,
      isDragging: true,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selection.isDragging) return;
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSelection(prev => ({
      ...prev,
      endX: e.clientX - rect.left,
      endY: e.clientY - rect.top,
    }));
  };

  const handleMouseUp = async () => {
    if (!selection.isDragging || !screenshot || !imgRef.current) return;
    setSelection(prev => ({ ...prev, isDragging: false }));

    const rect = imgRef.current.getBoundingClientRect();
    const img = imgRef.current;
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const x = Math.min(selection.startX, selection.endX) * scaleX;
    const y = Math.min(selection.startY, selection.endY) * scaleY;
    const width = Math.abs(selection.endX - selection.startX) * scaleX;
    const height = Math.abs(selection.endY - selection.startY) * scaleY;

    if (width < 10 || height < 10) return;

    setView('processing');

    try {
      // Crop region
      setProcessingStep('Cropping region...');
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      const imgEl = new Image();
      await new Promise<void>((resolve, reject) => {
        imgEl.onload = () => resolve();
        imgEl.onerror = reject;
        imgEl.src = screenshot;
      });
      ctx.drawImage(imgEl, x, y, width, height, 0, 0, width, height);
      const croppedDataUrl = canvas.toDataURL('image/png');

      // OCR
      setProcessingStep('Reading text (loading OCR engine)...');
      const ocrResult = await extractText(croppedDataUrl, true);

      if (!ocrResult.text.trim()) {
        setResult({
          originalText: '',
          translatedText: 'No text detected in selected area. Try selecting a larger region.',
        });
        setView('result');
        return;
      }

      // Translate
      setProcessingStep('Translating...');
      const translation = await translateText(ocrResult.text, targetLang, ocrResult.detectedLang);

      const resultData: ResultData = {
        originalText: ocrResult.text,
        translatedText: translation.translatedText,
        sourceLang: translation.sourceLang || ocrResult.detectedLang,
        confidence: ocrResult.confidence,
      };

      setResult(resultData);
      setView('result');

      // Save to history
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalText: ocrResult.text,
        translatedText: translation.translatedText,
        sourceLang: translation.sourceLang || ocrResult.detectedLang || 'auto',
        targetLang,
        confidence: ocrResult.confidence,
      };
      const current = JSON.parse(localStorage.getItem('screen-translator-history') || '[]');
      current.unshift(entry);
      if (current.length > 200) current.length = 200;
      localStorage.setItem('screen-translator-history', JSON.stringify(current));
      setHistory(current);
    } catch (err) {
      console.error('Processing failed:', err);
      setResult({
        originalText: '',
        translatedText: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      });
      setView('result');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLangChange = (lang: string) => {
    setTargetLang(lang);
    const s = JSON.parse(localStorage.getItem('screen-translator-settings') || '{}');
    localStorage.setItem('screen-translator-settings', JSON.stringify({ ...s, targetLang: lang }));
  };

  const selRect = {
    x: Math.min(selection.startX, selection.endX),
    y: Math.min(selection.startY, selection.endY),
    w: Math.abs(selection.endX - selection.startX),
    h: Math.abs(selection.endY - selection.startY),
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800">Screen Translator</h1>
          </div>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => { setView('home'); }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                view === 'home' || view === 'capturing' || view === 'selecting' || view === 'processing' || view === 'result'
                  ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Translate
            </button>
            <button
              onClick={() => { setView('history'); loadHistory(); }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                view === 'history' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setView('settings')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                view === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* ─── Home ─── */}
        {view === 'home' && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Translate any text on your screen</h2>
            <p className="text-gray-500 mb-2 max-w-md mx-auto">
              Capture a screenshot, select a region with text, and get instant translation.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Translating to: <strong className="text-blue-500">{LANGUAGE_NAMES[targetLang]}</strong>
            </p>
            <button
              onClick={handleCapture}
              className="rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold px-10 py-4 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              Capture Screen
            </button>
            <p className="text-xs text-gray-400 mt-4">
              You'll be asked to share your screen, then select a text region
            </p>
          </div>
        )}

        {/* ─── Capturing ─── */}
        {view === 'capturing' && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">{processingStep}</p>
            <p className="text-sm text-gray-400 mt-2">A browser dialog will appear — choose a screen to share</p>
          </div>
        )}

        {/* ─── Selecting region ─── */}
        {view === 'selecting' && screenshot && (
          <div className="animate-fadeIn">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-700">Drag to select a region with text to translate</p>
              <p className="text-xs text-gray-400 mt-1">Draw a rectangle around the text you want to translate</p>
            </div>
            <div
              className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 cursor-crosshair select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <img
                ref={imgRef}
                src={screenshot}
                alt="Screenshot"
                className="w-full h-auto block"
                draggable={false}
              />
              {/* Selection overlay */}
              {selection.isDragging && selRect.w > 2 && selRect.h > 2 && (
                <>
                  {/* Dimmed area */}
                  <div className="absolute inset-0 bg-black/30 pointer-events-none"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${selRect.x}px ${selRect.y}px, ${selRect.x}px ${selRect.y + selRect.h}px, ${selRect.x + selRect.w}px ${selRect.y + selRect.h}px, ${selRect.x + selRect.w}px ${selRect.y}px, ${selRect.x}px ${selRect.y}px)`,
                    }}
                  />
                  {/* Selection border */}
                  <div
                    className="absolute border-2 border-blue-500 border-dashed pointer-events-none"
                    style={{
                      left: selRect.x,
                      top: selRect.y,
                      width: selRect.w,
                      height: selRect.h,
                    }}
                  />
                  {/* Size label */}
                  <div
                    className="absolute bg-blue-500 text-white text-xs px-2 py-0.5 rounded pointer-events-none"
                    style={{
                      left: selRect.x + selRect.w / 2,
                      top: selRect.y - 24,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {Math.round(selRect.w)} x {Math.round(selRect.h)}
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={handleCapture}
                className="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-6 py-2.5 transition-colors"
              >
                Recapture
              </button>
              <button
                onClick={() => setView('home')}
                className="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm font-medium px-6 py-2.5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ─── Processing ─── */}
        {view === 'processing' && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-700 font-medium text-lg">{processingStep}</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment on first run while OCR loads...</p>
          </div>
        )}

        {/* ─── Result ─── */}
        {view === 'result' && result && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <div className="rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Translation</span>
                  {result.sourceLang && (
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                      {LANGUAGE_NAMES[result.sourceLang] || result.sourceLang}
                    </span>
                  )}
                  {result.confidence != null && result.confidence > 0 && (
                    <span className={`text-xs rounded-full px-2 py-0.5 ${
                      result.confidence >= 80 ? 'text-green-600 bg-green-50' :
                      result.confidence >= 50 ? 'text-amber-600 bg-amber-50' :
                      'text-red-500 bg-red-50'
                    }`}>
                      {Math.round(result.confidence)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="px-5 py-4 space-y-4">
                {result.originalText && (
                  <div className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Detected Text</span>
                      <button
                        onClick={() => handleCopy(result.originalText)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-gray-600 transition-all"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                      {result.originalText}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs font-medium text-blue-500 uppercase tracking-wide">
                    {result.originalText ? 'Translation' : 'Result'}
                  </span>
                  <div className="text-base text-gray-900 font-medium mt-1 leading-relaxed">
                    {result.translatedText}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-100">
                <button
                  onClick={() => handleCopy(result.translatedText)}
                  className={`flex-1 rounded-xl text-sm font-semibold py-2.5 transition-all ${
                    copied ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy Translation'}
                </button>
                <button
                  onClick={handleCapture}
                  className="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2.5 px-4 transition-colors"
                >
                  New Capture
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── History ─── */}
        {view === 'history' && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Translation History
                <span className="ml-2 text-sm font-normal text-gray-400">({history.length})</span>
              </h2>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    localStorage.setItem('screen-translator-history', '[]');
                    setHistory([]);
                  }}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-white shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">No translations yet</p>
                <p className="text-xs text-gray-300 mt-1">Capture a screen region to start translating</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div key={entry.id} className="group rounded-xl bg-white shadow-sm border border-gray-100 px-4 py-3 hover:shadow-md transition-shadow">
                    <p className="text-xs text-gray-400 truncate mb-0.5">{entry.originalText}</p>
                    <p className="text-sm text-gray-800 font-medium">{entry.translatedText}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300">
                          {LANGUAGE_NAMES[entry.sourceLang] || entry.sourceLang}
                          {' \u2192 '}
                          {LANGUAGE_NAMES[entry.targetLang] || entry.targetLang}
                        </span>
                        <span className="text-xs text-gray-300">{formatTime(entry.timestamp)}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(entry.translatedText)}
                          className="rounded bg-blue-50 hover:bg-blue-100 text-blue-500 text-xs px-2 py-0.5"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => {
                            const updated = history.filter(e => e.id !== entry.id);
                            localStorage.setItem('screen-translator-history', JSON.stringify(updated));
                            setHistory(updated);
                          }}
                          className="rounded bg-red-50 hover:bg-red-100 text-red-400 text-xs px-2 py-0.5"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Settings ─── */}
        {view === 'settings' && (
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-800">Settings</h2>
              </div>
              <div className="px-5 py-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Translate to
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      className={`rounded-xl px-3 py-3 text-left transition-all ${
                        targetLang === lang.code
                          ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-lg mb-0.5">{lang.flag}</div>
                      <div className="text-xs font-medium">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">Screen Translator v0.1.0 — Web Pilot</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
