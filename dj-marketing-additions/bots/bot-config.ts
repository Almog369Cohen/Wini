// הגדרות משותפות לכל הבוטים

export interface BotConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export const DEFAULT_CONFIG: BotConfig = {
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  model: 'claude-sonnet-4-20250514',
  maxTokens: 2048,
  temperature: 0.7,
};

export type Audience = 'wedding' | 'course' | 'brand';
export type ContentType = 'caption' | 'hook' | 'reel_script' | 'story' | 'carousel';
export type InputType = 'topic' | 'image' | 'competitor_post' | 'trend';

export interface ContentRequest {
  inputType: InputType;
  inputText: string;
  audience: Audience;
  contentType: ContentType;
  platform: 'instagram' | 'tiktok' | 'facebook' | 'youtube';
}

export interface ContentResult {
  content: string;
  hook: string;
  cta: string;
  hashtags: string[];
  audience: Audience;
  contentType: ContentType;
  qaScore?: number;
  qaVerdict?: string;
  qaImprovements?: string[];
}

export interface CompetitorData {
  name: string;
  instagramHandle: string;
  website?: string;
  followers?: number;
  avgLikes?: number;
  avgComments?: number;
  engagementRate?: number;
  specialization: string;
  contentStyle: string;
  mainMessages: string;
  strengths: string;
  weaknesses: string;
  positioningGaps: string;
}

export interface TrainingExample {
  content: string;
  audience: Audience;
  contentType: ContentType;
  isGoodExample: boolean;
  notes?: string;
}

export const AUDIENCE_LABELS: Record<Audience, string> = {
  wedding: 'חתונות',
  course: 'קורסי DJ',
  brand: 'מותג',
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  caption: 'כיתוב',
  hook: 'הוק',
  reel_script: 'תסריט ריל',
  story: 'סטורי',
  carousel: 'קרוסלה',
};
