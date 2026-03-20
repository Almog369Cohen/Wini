import { useEffect, useState } from 'react';

export default function PermissionPrompt() {
  const [status, setStatus] = useState<string>('checking');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const result = await window.electronAPI.checkScreenPermission();
    setStatus(result);
  };

  const handleOpenSettings = () => {
    window.electronAPI.openPrivacySettings();
  };

  const handleRetry = async () => {
    setStatus('checking');
    // Small delay to let OS update permission state
    await new Promise((r) => setTimeout(r, 1000));
    const result = await window.electronAPI.checkScreenPermission();
    setStatus(result);
    if (result === 'granted') {
      window.electronAPI.closeWindow();
    }
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-800">Permission Required</h1>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-5 space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-700 font-medium">
            Screen Translator needs screen recording access to capture text from your screen.
          </p>
          <p className="text-xs text-gray-400">
            Go to System Settings → Privacy & Security → Screen Recording, and enable Screen
            Translator. Then click "Check Again".
          </p>
        </div>

        {/* Status */}
        <div className="text-center">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
              status === 'granted'
                ? 'bg-green-50 text-green-600'
                : status === 'checking'
                  ? 'bg-gray-50 text-gray-500'
                  : 'bg-red-50 text-red-500'
            }`}
          >
            {status === 'granted'
              ? 'Permission granted'
              : status === 'checking'
                ? 'Checking...'
                : 'Not granted'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-100">
        <button
          onClick={handleOpenSettings}
          className="flex-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2.5 transition-colors"
        >
          Open System Settings
        </button>
        <button
          onClick={handleRetry}
          className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium py-2.5 px-4 transition-colors"
        >
          Check Again
        </button>
      </div>
    </div>
  );
}
