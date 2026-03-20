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
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isDragging: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
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
      startX: e.clientX,
      startY: e.clientY,
      endX: e.clientX,
      endY: e.clientY,
      isDragging: true,
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!selection.isDragging) return;
      setSelection((prev) => ({
        ...prev,
        endX: e.clientX,
        endY: e.clientY,
      }));
    },
    [selection.isDragging]
  );

  const handleMouseUp = useCallback(async () => {
    if (!selection.isDragging) return;

    setSelection((prev) => ({ ...prev, isDragging: false }));

    const region = getRegion();

    // Ignore tiny selections (accidental clicks)
    if (region.width < 10 || region.height < 10) {
      window.electronAPI.cancelOverlay();
      return;
    }

    setIsProcessing(true);

    try {
      // Capture the selected region
      const result = await window.electronAPI.regionSelected(region);

      if (result.error || !result.imageDataUrl) {
        console.error('Capture failed:', result.error);
        window.electronAPI.cancelOverlay();
        return;
      }

      // Run OCR on the captured image
      const ocrResult = await extractText(result.imageDataUrl);

      if (!ocrResult.text.trim()) {
        // No text found - show result with message
        window.electronAPI.showResult({
          x: region.x + region.width,
          y: region.y,
          originalText: '',
          translatedText: 'No text detected in selected area.',
        });
        return;
      }

      // Translate the extracted text
      const translation = await translateText(ocrResult.text, 'en');

      window.electronAPI.showResult({
        x: region.x + region.width,
        y: region.y,
        originalText: ocrResult.text,
        translatedText: translation.translatedText,
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

  // Handle Escape key to cancel
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.electronAPI.cancelOverlay();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const region = getRegion();

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 cursor-crosshair select-none"
      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Selection rectangle */}
      {selection.isDragging && region.width > 0 && region.height > 0 && (
        <div
          className="absolute border-2 border-blue-400 bg-blue-400/10"
          style={{
            left: region.x,
            top: region.y,
            width: region.width,
            height: region.height,
          }}
        />
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl bg-black/70 px-6 py-3 text-white text-sm font-medium">
            Processing...
          </div>
        </div>
      )}

      {/* Help text */}
      {!selection.isDragging && !isProcessing && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="rounded-xl bg-black/70 px-5 py-2.5 text-white text-sm font-medium">
            Drag to select area · Press Esc to cancel
          </div>
        </div>
      )}
    </div>
  );
}
