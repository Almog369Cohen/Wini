import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  type: 'idea' | 'bug' | 'improvement' | 'other';
  message: string;
  timestamp: string;
  sent: boolean;
}

// Google Apps Script Web App URL - set this after deploying the script
function getFeedbackEndpoint(): string {
  try {
    return localStorage.getItem('wini-feedback-endpoint') || '';
  } catch {
    return '';
  }
}

export function useFeedback() {
  const [feedbacks, setFeedbacks] = useLocalStorage<FeedbackItem[]>('wini-feedbacks', []);

  const submitFeedback = useCallback(async (
    userId: string,
    userName: string,
    type: FeedbackItem['type'],
    message: string,
  ) => {
    const item: FeedbackItem = {
      id: crypto.randomUUID(),
      userId,
      userName,
      type,
      message,
      timestamp: new Date().toISOString(),
      sent: false,
    };

    // Save locally first
    setFeedbacks(prev => [...prev, item]);

    // Try to send to endpoint
    const endpoint = getFeedbackEndpoint();
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: item.userId,
            userName: item.userName,
            type: item.type,
            message: item.message,
            timestamp: item.timestamp,
          }),
        });
        // Mark as sent
        setFeedbacks(prev =>
          prev.map(f => f.id === item.id ? { ...f, sent: true } : f)
        );
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, [setFeedbacks]);

  const setEndpoint = useCallback((url: string) => {
    try {
      localStorage.setItem('wini-feedback-endpoint', url);
    } catch {
      // Storage full or unavailable
    }
  }, []);

  return {
    feedbacks,
    submitFeedback,
    setEndpoint,
    hasEndpoint: !!getFeedbackEndpoint(),
  };
}
