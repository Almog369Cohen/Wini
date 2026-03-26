// DJ Marketing Types

export type Platform = 'instagram' | 'tiktok' | 'facebook' | 'youtube';
export type ContentType = 'post' | 'story' | 'reel' | 'video';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'failed';
export type ContentCategory =
  | 'wedding_highlight'
  | 'event_recap'
  | 'behind_scenes'
  | 'tip_advice'
  | 'testimonial'
  | 'promotion'
  | 'trending'
  | 'engagement'
  | 'personal_brand';

export type Audience = 'wedding' | 'course' | 'brand';

export interface ContentTemplate {
  id: string;
  category: ContentCategory;
  title: string;
  caption: string;
  hashtags: string[];
  platforms: Platform[];
  contentType: ContentType;
  audience: Audience;
  emoji: string;
  viralScore: number; // 1-10 estimated virality
  bestTimeToPost?: string; // e.g. "19:00-21:00"
  shootingTips?: string;
}

export interface InstagramFlow {
  id: string;
  keyword: string;
  postIds: string[];
  autoReplyOptions: string[];
  dmMessage: string;
  isActive: boolean;
  stats: {
    sends: number;
    clicks: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BrandCore {
  name: string;
  tagline: string;
  positioning: string;
  values: string[];
  toneOfVoice: string[];
  colorPalette: { name: string; hex: string }[];
  visualRules: string[];
  messagingPrinciples: string[];
}

export interface AudienceProfile {
  targetProfile: string;
  pains: string[];
  desires: string[];
  triggers: string[];
  objections: string[];
  messagingAngles: string[];
  contentTypes: string[];
  ctaStyles: string[];
}

export interface MessageMapEntry {
  audience: string;
  pain: string;
  message: string;
  proof: string;
  cta: string;
}

export interface MessageMap {
  wedding: MessageMapEntry[];
  course: MessageMapEntry[];
}

export interface ScheduledPost {
  id: string;
  templateId?: string;
  caption: string;
  hashtags: string[];
  platforms: Platform[];
  contentType: ContentType;
  category: ContentCategory;
  scheduledDate: string; // ISO date
  scheduledTime: string; // HH:mm
  status: ContentStatus;
  imageUrl?: string; // local data URL or uploaded image
  videoScript?: string;
  notes?: string;
  createdAt: string;
  publishedAt?: string;
  bufferPostId?: string; // for Buffer API integration
}

export interface ContentCalendarDay {
  date: string; // YYYY-MM-DD
  posts: ScheduledPost[];
}

export interface MarketingStats {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  postsByPlatform: Record<Platform, number>;
  postsByCategory: Record<ContentCategory, number>;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface BufferConfig {
  accessToken: string;
  profileIds: Record<Platform, string>;
  isConnected: boolean;
}

export interface MarketingSettings {
  businessName: string;
  businessArea: string; // e.g. "חתונות ואירועים"
  targetAudience: string;
  weeklyPostGoal: number;
  autoHashtags: string[];
  bufferConfig?: BufferConfig;
}

export const PLATFORM_INFO: Record<Platform, { name: string; emoji: string; color: string; maxHashtags: number }> = {
  instagram: { name: 'אינסטגרם', emoji: '📸', color: '#E1306C', maxHashtags: 30 },
  tiktok: { name: 'טיקטוק', emoji: '🎵', color: '#000000', maxHashtags: 5 },
  facebook: { name: 'פייסבוק', emoji: '👤', color: '#1877F2', maxHashtags: 10 },
  youtube: { name: 'יוטיוב', emoji: '▶️', color: '#FF0000', maxHashtags: 15 },
};

export const CATEGORY_INFO: Record<ContentCategory, { name: string; emoji: string; description: string }> = {
  wedding_highlight: { name: 'הייליט חתונה', emoji: '💒', description: 'קטעים מחתונות ואירועים' },
  event_recap: { name: 'סיכום אירוע', emoji: '🎉', description: 'תיעוד אחרי אירוע' },
  behind_scenes: { name: 'מאחורי הקלעים', emoji: '🎬', description: 'הצצה לעבודה שלך' },
  tip_advice: { name: 'טיפ ועצה', emoji: '💡', description: 'טיפים לזוגות ולקוחות' },
  testimonial: { name: 'המלצה', emoji: '⭐', description: 'ביקורות והמלצות לקוחות' },
  promotion: { name: 'מבצע', emoji: '🔥', description: 'הצעות ומבצעים' },
  trending: { name: 'טרנד', emoji: '📈', description: 'תוכן שמתבסס על טרנדים' },
  engagement: { name: 'אינטראקציה', emoji: '💬', description: 'שאלות וסקרים לעוקבים' },
  personal_brand: { name: 'מיתוג אישי', emoji: '🎧', description: 'הסיפור שלך כתקליטן' },
};
