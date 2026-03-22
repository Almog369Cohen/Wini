/**
 * Haptic feedback utility for mobile PWA
 * Uses navigator.vibrate() with predefined patterns
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'select' | 'toggle';

const HAPTIC_PATTERNS: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [30, 50, 60],
  error: [50, 30, 50, 30, 80],
  select: 15,
  toggle: 20,
};

export function haptic(style: HapticStyle = 'light'): void {
  if (!('vibrate' in navigator)) return;

  try {
    const pattern = HAPTIC_PATTERNS[style];
    navigator.vibrate(pattern);
  } catch {
    // Silently fail - vibrate not supported in some browsers
  }
}

/**
 * Wrap an onClick handler to add haptic feedback
 */
export function withHaptic<T extends (...args: unknown[]) => unknown>(
  fn: T,
  style: HapticStyle = 'light'
): T {
  return ((...args: unknown[]) => {
    haptic(style);
    return fn(...args);
  }) as T;
}
