import { useState, useRef, useCallback, useEffect } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => void | Promise<void>;
  threshold?: number; // px to trigger
  maxPull?: number; // max pull distance
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 120,
}: PullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const scrollTop = containerRef.current?.scrollTop ?? window.scrollY;
    if (scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      if (diff > 0) {
        // Resistance effect - pull gets harder
        const distance = Math.min(diff * 0.5, maxPull);
        setPullDistance(distance);
      }
    },
    [isRefreshing, maxPull]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || isRefreshing) return;
    isPulling.current = false;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(30);
      }
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const el = containerRef.current ?? document;
    el.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true });
    el.addEventListener('touchmove', handleTouchMove as EventListener, { passive: true });
    el.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart as EventListener);
      el.removeEventListener('touchmove', handleTouchMove as EventListener);
      el.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / threshold, 1);

  return {
    containerRef,
    pullDistance,
    isRefreshing,
    progress,
    PullIndicator: () =>
      pullDistance > 10 || isRefreshing ? (
        <div
          className="flex justify-center overflow-hidden transition-all duration-200"
          style={{ height: isRefreshing ? 40 : pullDistance }}
        >
          <div
            className={`mt-2 w-6 h-6 rounded-full border-2 border-sage border-t-transparent ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${progress * 360}deg)`,
              opacity: progress,
            }}
          />
        </div>
      ) : null,
  };
}
