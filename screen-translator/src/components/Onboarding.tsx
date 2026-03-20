import { useState } from 'react';
import type { AppSettings } from '../shared/types';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

type Step = 'welcome' | 'language' | 'shortcut' | 'permission' | 'done';

export default function Onboarding() {
  const [step, setStep] = useState<Step>('welcome');
  const [selectedLang, setSelectedLang] = useState('en');
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');

  const handleSelectLanguage = async (lang: string) => {
    setSelectedLang(lang);
    await window.electronAPI.saveSettings({ targetLang: lang } as Partial<AppSettings>);
  };

  const handleCheckPermission = async () => {
    const status = await window.electronAPI.checkScreenPermission();
    setPermissionStatus(status);
    if (status === 'granted') {
      setStep('done');
    }
  };

  const handleFinish = async () => {
    await window.electronAPI.saveSettings({ onboardingDone: true } as Partial<AppSettings>);
    window.electronAPI.closeWindow();
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{
            width:
              step === 'welcome' ? '20%' :
              step === 'language' ? '40%' :
              step === 'shortcut' ? '60%' :
              step === 'permission' ? '80%' : '100%',
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
        {/* ─── Welcome ─── */}
        {step === 'welcome' && (
          <div className="text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
              <span className="text-3xl">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              Welcome to Screen Translator
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Instantly translate text from any area on your screen.
              Select a region, and get translations in seconds.
            </p>
            <button
              onClick={() => setStep('language')}
              className="mt-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-8 py-3 transition-colors"
            >
              Get Started
            </button>
          </div>
        )}

        {/* ─── Language selection ─── */}
        {step === 'language' && (
          <div className="w-full space-y-4 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-800">Choose your language</h2>
              <p className="text-xs text-gray-400 mt-1">
                Which language do you want to translate to?
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto px-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`rounded-xl px-3 py-3 text-left transition-all ${
                    selectedLang === lang.code
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-lg mb-0.5">{lang.flag}</div>
                  <div className="text-xs font-medium">{lang.name}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('shortcut')}
              className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-3 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* ─── Shortcut ─── */}
        {step === 'shortcut' && (
          <div className="text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Your shortcut</h2>
              <p className="text-xs text-gray-400 mt-1">
                Press this from anywhere to start translating
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {['⌘', 'Shift', 'T'].map((key, i) => (
                <kbd key={i} className="inline-block rounded-lg bg-gray-100 border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm">
                  {key}
                </kbd>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              A transparent overlay will appear — just drag to select an area
            </p>
            <button
              onClick={() => setStep('permission')}
              className="w-full max-w-xs rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-3 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* ─── Permission ─── */}
        {step === 'permission' && (
          <div className="text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Screen recording access</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
                To read text from your screen, we need screen recording permission.
                Your screen content is never stored or sent anywhere — OCR happens locally on your device.
              </p>
            </div>

            {permissionStatus === 'granted' ? (
              <div className="rounded-xl bg-green-50 px-4 py-2 text-green-600 text-sm font-medium">
                Permission granted!
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => window.electronAPI.openPrivacySettings()}
                  className="w-full max-w-xs rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-3 transition-colors"
                >
                  Open System Settings
                </button>
                <button
                  onClick={handleCheckPermission}
                  className="w-full max-w-xs rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-3 transition-colors"
                >
                  Check Again
                </button>
              </div>
            )}

            <button
              onClick={() => setStep('done')}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {permissionStatus === 'granted' ? 'Continue' : 'Skip for now'}
            </button>
          </div>
        )}

        {/* ─── Done ─── */}
        {step === 'done' && (
          <div className="text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">You're all set!</h2>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Screen Translator is running in your menu bar.
              Press <kbd className="inline rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-600">⌘ Shift T</kbd> anytime to translate text from your screen.
            </p>
            <button
              onClick={handleFinish}
              className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-8 py-3 transition-colors"
            >
              Start Translating
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
