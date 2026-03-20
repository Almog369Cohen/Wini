import type { OcrResult } from '../../shared/types';

/**
 * OCR Service abstraction.
 * Currently uses Tesseract.js - can be swapped for cloud OCR later.
 */

let tesseractWorker: Awaited<ReturnType<typeof createWorker>> | null = null;

async function createWorker() {
  const Tesseract = await import('tesseract.js');
  const worker = await Tesseract.createWorker('eng');
  return worker;
}

async function getWorker() {
  if (!tesseractWorker) {
    tesseractWorker = await createWorker();
  }
  return tesseractWorker;
}

export async function extractText(imageDataUrl: string): Promise<OcrResult> {
  try {
    const worker = await getWorker();
    const result = await worker.recognize(imageDataUrl);

    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
    };
  } catch (error) {
    console.error('OCR failed:', error);
    return {
      text: '',
      confidence: 0,
    };
  }
}

export async function terminateOcr(): Promise<void> {
  if (tesseractWorker) {
    await tesseractWorker.terminate();
    tesseractWorker = null;
  }
}
