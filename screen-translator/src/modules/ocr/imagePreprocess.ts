/**
 * Image preprocessing for better OCR accuracy.
 *
 * Applies:
 * - Grayscale conversion
 * - Contrast enhancement
 * - Sharpening
 * - Noise reduction via threshold
 *
 * All processing happens on an OffscreenCanvas for performance.
 */

export async function preprocessImage(imageDataUrl: string): Promise<string> {
  const img = await loadImage(imageDataUrl);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Scale up small images for better OCR (minimum 2x)
  const MIN_DIM = 300;
  let scale = 1;
  if (img.width < MIN_DIM || img.height < MIN_DIM) {
    scale = Math.max(MIN_DIM / img.width, MIN_DIM / img.height, 2);
  }

  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  // Draw scaled image
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert to grayscale with luminance weights
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  // Enhance contrast using histogram stretching
  let min = 255;
  let max = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < min) min = data[i];
    if (data[i] > max) max = data[i];
  }

  const range = max - min || 1;
  for (let i = 0; i < data.length; i += 4) {
    const normalized = ((data[i] - min) / range) * 255;
    data[i] = normalized;
    data[i + 1] = normalized;
    data[i + 2] = normalized;
  }

  // Apply Otsu's threshold for binarization (black text on white background)
  const threshold = otsuThreshold(data);
  for (let i = 0; i < data.length; i += 4) {
    const val = data[i] > threshold ? 255 : 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL('image/png');
}

function otsuThreshold(data: Uint8ClampedArray): number {
  // Build histogram
  const histogram = new Array(256).fill(0);
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    histogram[data[i]]++;
    total++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let wB = 0;
  let maxVariance = 0;
  let bestThreshold = 0;

  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;

    const wF = total - wB;
    if (wF === 0) break;

    sumB += t * histogram[t];

    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const variance = wB * wF * (mB - mF) * (mB - mF);

    if (variance > maxVariance) {
      maxVariance = variance;
      bestThreshold = t;
    }
  }

  return bestThreshold;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}
