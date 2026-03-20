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
} from 'electron';
import path from 'path';
import fs from 'fs';

// ─── State ───────────────────────────────────────────────────────────────────

let overlayWindow: BrowserWindow | null = null;
let resultWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = !app.isPackaged;
const RENDERER_URL = isDev
  ? 'http://localhost:5173'
  : `file://${path.join(__dirname, '../renderer/index.html')}`;

// ─── Settings persistence ────────────────────────────────────────────────────

interface AppSettings {
  targetLang: string;
  shortcut: string;
}

const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json');

function loadSettings(): AppSettings {
  const defaults: AppSettings = {
    targetLang: 'en',
    shortcut: 'CommandOrControl+Shift+T',
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

function saveSettings(settings: AppSettings) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

let settings = loadSettings();

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
  data: { originalText: string; translatedText: string }
) {
  const POPUP_WIDTH = 400;
  const POPUP_HEIGHT = 300;

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

// ─── Tray ────────────────────────────────────────────────────────────────────

function createTray() {
  // Use a simple text-based tray icon (on macOS it shows in menu bar)
  // In production you'd use a proper icon file
  tray = new Tray(createTrayIcon());
  tray.setToolTip('Screen Translator');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Capture & Translate',
      accelerator: settings.shortcut.replace('CommandOrControl', 'CmdOrCtrl'),
      click: triggerCapture,
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: createSettingsWindow,
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

function createTrayIcon() {
  // Create a simple 16x16 tray icon programmatically
  const { nativeImage } = require('electron');
  // Simple "T" icon as a data URL
  const size = 16;
  const canvas = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect x="2" y="2" width="12" height="3" rx="1" fill="black"/>
    <rect x="6" y="2" width="4" height="12" rx="1" fill="black"/>
  </svg>`;
  const base64 = Buffer.from(canvas).toString('base64');
  const icon = nativeImage.createFromDataURL(`data:image/svg+xml;base64,${base64}`);
  icon.setTemplateImage(true);
  return icon;
}

// ─── Capture logic ───────────────────────────────────────────────────────────

function triggerCapture() {
  // Check permission first on macOS
  if (process.platform === 'darwin') {
    const status = systemPreferences.getMediaAccessStatus('screen');
    if (status !== 'granted') {
      createPermissionWindow();
      return;
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

  if (sources.length === 0) {
    return null;
  }

  const source = sources[0];
  const fullImage = source.thumbnail;

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
  // Register global shortcut
  globalShortcut.register(settings.shortcut, triggerCapture);

  // Create tray
  createTray();

  // ─── IPC handlers ───────────────────────────────────────────────────────

  ipcMain.handle('region-selected', async (_event, region) => {
    if (overlayWindow) {
      overlayWindow.close();
      overlayWindow = null;
    }

    const imageDataUrl = await captureScreen(region);

    if (!imageDataUrl) {
      return { error: 'Failed to capture screen' };
    }

    return { imageDataUrl };
  });

  ipcMain.on('show-result', (_event, data) => {
    createResultWindow(data.x, data.y, {
      originalText: data.originalText,
      translatedText: data.translatedText,
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

  // Settings IPC
  ipcMain.handle('get-settings', () => settings);

  ipcMain.handle('save-settings', (_event, newSettings: Partial<AppSettings>) => {
    settings = { ...settings, ...newSettings };
    saveSettings(settings);

    // Re-register shortcut if changed
    globalShortcut.unregisterAll();
    globalShortcut.register(settings.shortcut, triggerCapture);

    return settings;
  });

  ipcMain.handle('get-target-lang', () => settings.targetLang);

  // Permission IPC
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

  ipcMain.on('close-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.close();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // Keep app running in tray
});
