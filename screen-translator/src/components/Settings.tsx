import { useEffect, useState } from 'react';
import type { AppSettings } from '../shared/types';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'Hebrew' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
];

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.electronAPI.onSettingsData((data) => {
      setSettings(data);
    });
    // Also try to fetch directly
    window.electronAPI.getSettings().then(setSettings);
  }, []);

  const handleLanguageChange = async (lang: string) => {
    if (!settings) return;
    const updated = await window.electronAPI.saveSettings({ targetLang: lang });
    setSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  if (!settings) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-white/95 backdrop-blur-xl">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-800">Settings</h1>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-5 space-y-6">
        {/* Target Language */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Translate to
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  settings.targetLang === lang.code
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Shortcut display */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Keyboard Shortcut
          </label>
          <div className="flex items-center gap-1.5">
            {settings.shortcut
              .replace('CommandOrControl', '⌘')
              .split('+')
              .map((key, i) => (
                <kbd
                  key={i}
                  className="inline-block rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 border border-gray-200"
                >
                  {key.trim()}
                </kbd>
              ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100">
        <div className="text-[10px] text-gray-400 text-center">
          {saved ? '✓ Saved' : 'Screen Translator v0.1.0'}
        </div>
      </div>
    </div>
  );
}
