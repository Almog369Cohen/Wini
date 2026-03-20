import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  screen,
  desktopCapturer,
  systemPreferences,
  Tray,
  Menu,
  shell,
  nativeImage,
} from 'electron';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// ─── State ───────────────────────────────────────────────────────────────────

let overlayWindow: BrowserWindow | null = null;
let resultWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let historyWindow: BrowserWindow | null = null;
let onboardingWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = !app.isPackaged;
const RENDERER_URL = isDev
  ? 'http://localhost:5173'
  : `file://${path.join(__dirname, '../renderer/index.html')}`;

// ─── Settings persistence ────────────────────────────────────────────────────

interface AppSettings {
  targetLang: string;
  shortcut: string;
  onboardingDone: boolean;
}

const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json');
const HISTORY_PATH = path.join(app.getPath('userData'), 'history.json');

function loadSettings(): AppSettings {
  const defaults: AppSettings = {
    targetLang: 'en',
    shortcut: 'CommandOrControl+Shift+T',
    onboardingDone: false,
  };
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
      return { ...defaults, ...JSON.parse(raw) };
    }
  } catch {
    // ignore corrupt file
  }
  return defaults;
}

function saveSettings(s: AppSettings) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(s, null, 2));
}

let settings = loadSettings();

// ─── History persistence ─────────────────────────────────────────────────────

interface HistoryEntry {
  id: string;
  timestamp: number;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  confidence: number;
}

function loadHistory(): HistoryEntry[] {
  try {
    if (fs.existsSync(HISTORY_PATH)) {
      return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8'));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveHistory(entries: HistoryEntry[]) {
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(entries, null, 2));
}

let history: HistoryEntry[] = loadHistory();

// ─── Windows ─────────────────────────────────────────────────────────────────

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.size;

  overlayWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  overlayWindow.loadURL(`${RENDERER_URL}#/overlay`);
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setAlwaysOnTop(true, 'screen-saver');

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

function createResultWindow(
  x: number,
  y: number,
  data: { originalText: string; translatedText: string; sourceLang?: string; confidence?: number }
) {
  const POPUP_WIDTH = 400;
  const POPUP_HEIGHT = 320;

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenW, height: screenH } = primaryDisplay.size;

  let popupX = Math.min(x + 10, screenW - POPUP_WIDTH - 10);
  let popupY = Math.min(y + 10, screenH - POPUP_HEIGHT - 10);
  popupX = Math.max(popupX, 10);
  popupY = Math.max(popupY, 10);

  resultWindow = new BrowserWindow({
    x: popupX,
    y: popupY,
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  resultWindow.loadURL(`${RENDERER_URL}#/result`);

  resultWindow.webContents.on('did-finish-load', () => {
    resultWindow?.webContents.send('result-data', data);
  });

  resultWindow.on('closed', () => {
    resultWindow = null;
  });
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 420,
    height: 360,
    frame: false,
    transparent: true,
    resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  settingsWindow.loadURL(`${RENDERER_URL}#/settings`);

  settingsWindow.webContents.on('did-finish-load', () => {
    settingsWindow?.webContents.send('settings-data', settings);
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function createHistoryWindow() {
  if (historyWindow) {
    historyWindow.focus();
    return;
  }

  historyWindow = new BrowserWindow({
    width: 480,
    height: 560,
    frame: false,
    transparent: true,
    resizable: true,
    titleBarStyle: 'hidden',
    minWidth: 360,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  historyWindow.loadURL(`${RENDERER_URL}#/history`);

  historyWindow.on('closed', () => {
    historyWindow = null;
  });
}

function createOnboardingWindow() {
  if (onboardingWindow) {
    onboardingWindow.focus();
    return;
  }

  onboardingWindow = new BrowserWindow({
    width: 520,
    height: 600,
    frame: false,
    transparent: true,
    resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  onboardingWindow.loadURL(`${RENDERER_URL}#/onboarding`);

  onboardingWindow.on('closed', () => {
    onboardingWindow = null;
  });
}

// ─── Tray ────────────────────────────────────────────────────────────────────

function createTray() {
  tray = new Tray(createTrayIcon());
  tray.setToolTip('Screen Translator');
  updateTrayMenu();
}

function updateTrayMenu() {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Capture & Translate',
      accelerator: settings.shortcut.replace('CommandOrControl', 'CmdOrCtrl'),
      click: triggerCapture,
    },
    { type: 'separator' },
    {
      label: 'History',
      click: createHistoryWindow,
    },
    {
      label: 'Settings',
      click: createSettingsWindow,
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit(),
    },
  ]);

  tray.setContextMenu(contextMenu);
}

function createTrayIcon() {
  const size = 16;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect x="2" y="2" width="12" height="3" rx="1" fill="black"/>
    <rect x="6" y="2" width="4" height="12" rx="1" fill="black"/>
  </svg>`;
  const base64 = Buffer.from(svg).toString('base64');
  const icon = nativeImage.createFromDataURL(`data:image/svg+xml;base64,${base64}`);
  icon.setTemplateImage(true);
  return icon;
}

// ─── Capture logic ───────────────────────────────────────────────────────────

function triggerCapture() {
  if (process.platform === 'darwin') {
    try {
      const status = systemPreferences.getMediaAccessStatus('screen');
      if (status !== 'granted') {
        createPermissionWindow();
        return;
      }
    } catch (err) {
      console.warn('Could not check screen permission:', err);
    }
  }

  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
    return;
  }
  if (resultWindow) {
    resultWindow.close();
    resultWindow = null;
  }
  createOverlayWindow();
}

function createPermissionWindow() {
  const permWin = new BrowserWindow({
    width: 440,
    height: 320,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  permWin.loadURL(`${RENDERER_URL}#/permission`);
}

async function captureScreen(region: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const scaleFactor = primaryDisplay.scaleFactor;

  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: primaryDisplay.size.width * scaleFactor,
      height: primaryDisplay.size.height * scaleFactor,
    },
  });

  if (sources.length === 0) return null;

  const fullImage = sources[0].thumbnail;

  const cropped = fullImage.crop({
    x: Math.round(region.x * scaleFactor),
    y: Math.round(region.y * scaleFactor),
    width: Math.round(region.width * scaleFactor),
    height: Math.round(region.height * scaleFactor),
  });

  return cropped.toDataURL();
}

// ─── App lifecycle ───────────────────────────────────────────────────────────

app.whenReady().then(() => {
  globalShortcut.register(settings.shortcut, triggerCapture);
  createTray();

  // Show onboarding on first launch
  if (!settings.onboardingDone) {
    createOnboardingWindow();
  }

  // ─── IPC: Capture ─────────────────────────────────────────────────────

  ipcMain.handle('region-selected', async (_event, region) => {
    if (overlayWindow) {
      overlayWindow.close();
      overlayWindow = null;
    }

    const imageDataUrl = await captureScreen(region);
    if (!imageDataUrl) return { error: 'Failed to capture screen' };
    return { imageDataUrl };
  });

  ipcMain.on('show-result', (_event, data) => {
    createResultWindow(data.x, data.y, {
      originalText: data.originalText,
      translatedText: data.translatedText,
      sourceLang: data.sourceLang,
      confidence: data.confidence,
    });
  });

  ipcMain.on('overlay-cancel', () => {
    if (overlayWindow) {
      overlayWindow.close();
      overlayWindow = null;
    }
  });

  ipcMain.on('close-result', () => {
    if (resultWindow) {
      resultWindow.close();
      resultWindow = null;
    }
  });

  // ─── IPC: Settings ────────────────────────────────────────────────────

  ipcMain.handle('get-settings', () => settings);

  ipcMain.handle('save-settings', (_event, newSettings: Partial<AppSettings>) => {
    settings = { ...settings, ...newSettings };
    saveSettings(settings);

    globalShortcut.unregisterAll();
    globalShortcut.register(settings.shortcut, triggerCapture);
    updateTrayMenu();

    return settings;
  });

  ipcMain.handle('get-target-lang', () => settings.targetLang);

  // ─── IPC: History ─────────────────────────────────────────────────────

  ipcMain.handle('get-history', () => history);

  ipcMain.handle('add-history-entry', (_event, entry: {
    originalText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    confidence: number;
  }) => {
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...entry,
    };
    history.unshift(newEntry);
    // Keep max 200 entries
    if (history.length > 200) {
      history = history.slice(0, 200);
    }
    saveHistory(history);
    return newEntry;
  });

  ipcMain.handle('clear-history', () => {
    history = [];
    saveHistory(history);
  });

  ipcMain.handle('delete-history-entry', (_event, id: string) => {
    history = history.filter((e) => e.id !== id);
    saveHistory(history);
  });

  // ─── IPC: Permissions ─────────────────────────────────────────────────

  ipcMain.handle('check-screen-permission', () => {
    if (process.platform === 'darwin') {
      return systemPreferences.getMediaAccessStatus('screen');
    }
    return 'granted';
  });

  ipcMain.on('open-privacy-settings', () => {
    if (process.platform === 'darwin') {
      shell.openExternal(
        'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture'
      );
    }
  });

  // ─── IPC: Window ──────────────────────────────────────────────────────

  ipcMain.on('close-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.close();
  });

  ipcMain.on('open-history', () => {
    createHistoryWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // Keep app running in tray
});
