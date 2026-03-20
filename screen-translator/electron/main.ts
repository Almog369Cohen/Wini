import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  screen,
  desktopCapturer,
  systemPreferences,
  nativeImage,
} from 'electron';
import path from 'path';

let overlayWindow: BrowserWindow | null = null;
let resultWindow: BrowserWindow | null = null;

const isDev = !app.isPackaged;
const RENDERER_URL = isDev
  ? 'http://localhost:5173'
  : `file://${path.join(__dirname, '../renderer/index.html')}`;

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

function createResultWindow(x: number, y: number, data: {
  originalText: string;
  translatedText: string;
}) {
  const POPUP_WIDTH = 380;
  const POPUP_HEIGHT = 280;

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenW, height: screenH } = primaryDisplay.size;

  // Position near selection, but keep on screen
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

function triggerCapture() {
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

  // Crop to selected region, accounting for scale factor
  const cropped = fullImage.crop({
    x: Math.round(region.x * scaleFactor),
    y: Math.round(region.y * scaleFactor),
    width: Math.round(region.width * scaleFactor),
    height: Math.round(region.height * scaleFactor),
  });

  return cropped.toDataURL();
}

app.whenReady().then(() => {
  // Register global shortcut
  globalShortcut.register('CommandOrControl+Shift+T', triggerCapture);

  // Handle region selection from overlay
  ipcMain.handle('region-selected', async (_event, region: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    // Close overlay
    if (overlayWindow) {
      overlayWindow.close();
      overlayWindow = null;
    }

    // Capture the selected region
    const imageDataUrl = await captureScreen(region);

    if (!imageDataUrl) {
      return { error: 'Failed to capture screen' };
    }

    return { imageDataUrl };
  });

  // Handle showing result popup
  ipcMain.on('show-result', (_event, data: {
    x: number;
    y: number;
    originalText: string;
    translatedText: string;
  }) => {
    createResultWindow(data.x, data.y, {
      originalText: data.originalText,
      translatedText: data.translatedText,
    });
  });

  // Handle overlay cancel
  ipcMain.on('overlay-cancel', () => {
    if (overlayWindow) {
      overlayWindow.close();
      overlayWindow = null;
    }
  });

  // Handle result close
  ipcMain.on('close-result', () => {
    if (resultWindow) {
      resultWindow.close();
      resultWindow = null;
    }
  });

  // Check screen recording permission on macOS
  if (process.platform === 'darwin') {
    const hasPermission = systemPreferences.getMediaAccessStatus('screen');
    if (hasPermission !== 'granted') {
      console.log('Screen recording permission not granted. Status:', hasPermission);
    }
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // Keep app running even when all windows are closed (no-op)
});
