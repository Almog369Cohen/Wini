// localStorage wrapper for all bot data

const PREFIX = 'dj-almog-';

function getKey(key: string): string {
  return `${PREFIX}${key}`;
}

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(getKey(key));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(getKey(key), JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function remove(key: string): void {
  localStorage.removeItem(getKey(key));
}

// Storage keys
export const KEYS = {
  EXAMPLES: 'bot-examples',
  RULES: 'bot-rules',
  GENERATIONS: 'bot-generations',
  COMPETITORS: 'competitors',
  CONTENT_IDEAS: 'content-ideas',
  SETTINGS: 'bot-settings',
} as const;

// Types
export interface StoredExample {
  id: string;
  content: string;
  audience: 'wedding' | 'course' | 'brand';
  contentType: string;
  isGoodExample: boolean;
  notes?: string;
  createdAt: string;
}

export interface StoredRule {
  id: string;
  category: string;
  rule: string;
  isActive: boolean;
}

export interface StoredGeneration {
  id: string;
  inputType: string;
  inputText: string;
  audience: 'wedding' | 'course' | 'brand';
  contentType: string;
  content: string;
  hook: string;
  cta: string;
  hashtags: string[];
  qaScore: number;
  qaVerdict: string;
  passed: boolean;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export interface StoredCompetitor {
  id: string;
  name: string;
  instagramHandle: string;
  website?: string;
  specialization: string;
  followers?: number;
  avgLikes?: number;
  engagementRate?: number;
  mainMessages: string;
  strengths: string;
  weaknesses: string;
  positioningGaps: string;
  contentStyle: string;
  createdAt: string;
}
