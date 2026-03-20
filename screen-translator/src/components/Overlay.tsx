import { useCallback, useEffect, useRef, useState } from 'react';
import type { Region } from '../shared/types';
import { extractText } from '../modules/ocr/ocrService';
import { translateText } from '../modules/translation/translationService';

interface SelectionState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isDragging: boolean;
}

export default function Overlay() {
  const [selection, setSelection] = useState<SelectionState>({
    startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const getRegion = useCallback((): Region => {
    const x = Math.min(selection.startX, selection.endX);
    const y = Math.min(selection.startY, selection.endY);
    const width = Math.abs(selection.endX - selection.startX);
    const height = Math.abs(selection.endY - selection.startY);
    return { x, y, width, height };
  }, [selection]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setSelection({
      startX: e.clientX, startY: e.clientY,
      endX: e.clientX, endY: e.clientY,
      isDragging: true,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    if (!selection.isDragging) return;
    setSelection((prev) => ({ ...prev, endX: e.clientX, endY: e.clientY }));
  }, [selection.isDragging]);

  const handleMouseUp = useCallback(async () => {
    if (!selection.isDragging) return;
    setSelection((prev) => ({ ...prev, isDragging: false }));

    const region = getRegion();

    if (region.width < 10 || region.height < 10) {
      window.electronAPI.cancelOverlay();
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Capture
      setProcessingStep('Capturing...');
      const result = await window.electronAPI.regionSelected(region);

      if (result.error || !result.imageDataUrl) {
        window.electronAPI.cancelOverlay();
        return;
      }

      // Step 2: OCR with preprocessing
      setProcessingStep('Reading text...');
      const ocrResult = await extractText(result.imageDataUrl, true);

      if (!ocrResult.text.trim()) {
        window.electronAPI.showResult({
          x: region.x + region.width,
          y: region.y,
          originalText: '',
          translatedText: 'No text detected in selected area.',
        });
        return;
      }

      // Step 3: Translate with auto-detected source language
      setProcessingStep('Translating...');
      let targetLang = 'en';
      try {
        targetLang = await window.electronAPI.getTargetLang();
      } catch {
        // fallback
      }

      const translation = await translateText(
        ocrResult.text,
        targetLang,
        ocrResult.detectedLang
      );

      // Step 4: Save to history
      try {
        await window.electronAPI.addHistoryEntry({
          originalText: ocrResult.text,
          translatedText: translation.translatedText,
          sourceLang: translation.sourceLang || ocrResult.detectedLang || 'auto',
          targetLang: translation.targetLang,
          confidence: ocrResult.confidence,
        });
      } catch {
        // history save is non-critical
      }

      // Show result
      window.electronAPI.showResult({
        x: region.x + region.width,
        y: region.y,
        originalText: ocrResult.text,
        translatedText: translation.translatedText,
        sourceLang: translation.sourceLang || ocrResult.detectedLang,
        confidence: ocrResult.confidence,
      });
    } catch (err) {
      console.error('Processing failed:', err);
      window.electronAPI.showResult({
        x: region.x + region.width,
        y: region.y,
        originalText: '',
        translatedText: 'Translation failed. Please try again.',
      });
    }
  }, [selection.isDragging, getRegion]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.electronAPI.cancelOverlay();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const region = getRegion();
  const showSelection = selection.isDragging && region.width > 2 && region.height > 2;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 select-none"
      style={{ cursor: 'crosshair' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {showSelection ? (
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="region-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect x={region.x} y={region.y} width={region.width} height={region.height} fill="black" />
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.4)" mask="url(#region-mask)" />
          <rect x={region.x} y={region.y} width={region.width} height={region.height}
            fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 3" />
        </svg>
      ) : (
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
      )}

      {showSelection && (
        <div className="absolute z-10 pointer-events-none"
          style={{ left: region.x + region.width / 2, top: region.y - 28, transform: 'translateX(-50%)' }}>
          <div className="rounded-md bg-blue-500 px-2 py-0.5 text-white text-[10px] font-mono whitespace-nowrap shadow-sm">
            {Math.round(region.width)} × {Math.round(region.height)}
          </div>
        </div>
      )}

      {!selection.isDragging && !isProcessing && (
        <>
          <div className="absolute w-px bg-white/30 pointer-events-none"
            style={{ left: mousePos.x, top: 0, height: '100%' }} />
          <div className="absolute h-px bg-white/30 pointer-events-none"
            style={{ top: mousePos.y, left: 0, width: '100%' }} />
        </>
      )}

      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="rounded-2xl bg-black/80 backdrop-blur-sm px-8 py-4 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white text-sm font-medium">{processingStep}</span>
          </div>
        </div>
      )}

      {!selection.isDragging && !isProcessing && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="rounded-xl bg-black/80 backdrop-blur-sm px-6 py-3 flex items-center gap-4">
            <span className="text-white text-sm font-medium">Drag to select area</span>
            <span className="text-white/40 text-sm">|</span>
            <span className="text-white/60 text-xs">
              Press <kbd className="inline-block rounded bg-white/20 px-1.5 py-0.5 text-white/80 text-[10px] font-mono">Esc</kbd> to cancel
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
