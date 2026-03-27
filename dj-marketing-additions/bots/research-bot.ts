// בוט מחקר — Research Bot
// חוקר מתחרים, מנתח טרנדים, מזין את בוט היוצר בהקשר

import Anthropic from '@anthropic-ai/sdk';
import { buildBrandContext } from './prompts/brand-core';
import type { CompetitorData, BotConfig } from './bot-config';
import { DEFAULT_CONFIG } from './bot-config';

export class ResearchBot {
  private client: Anthropic;
  private config: BotConfig;
  private competitors: CompetitorData[] = [];

  constructor(config?: Partial<BotConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.client = new Anthropic({ apiKey: this.config.apiKey });
  }

  // טעינת נתוני מתחרים (מ-DB או מקובץ)
  loadCompetitors(competitors: CompetitorData[]) {
    this.competitors = competitors;
  }

  // ניתוח מתחרה בודד — מה הוא עושה, מה חסר
  async analyzeCompetitor(competitor: CompetitorData): Promise<{
    summary: string;
    contentStyle: string;
    gaps: string[];
    opportunities: string[];
  }> {
    const prompt = `נתח את המתחרה הזה של DJ אלמוג כהן:

שם: ${competitor.name}
אינסטגרם: ${competitor.instagramHandle}
התמחות: ${competitor.specialization}
סגנון תוכן: ${competitor.contentStyle}
מסרים מרכזיים: ${competitor.mainMessages}
חוזקות: ${competitor.strengths}
חולשות: ${competitor.weaknesses}

ה-DNA של DJ אלמוג כהן:
${buildBrandContext()}

---

ענה בJSON:
{
  "summary": "סיכום קצר של המתחרה",
  "contentStyle": "תיאור סגנון התוכן שלו",
  "gaps": ["פער 1 שאלמוג יכול לנצל", "פער 2"],
  "opportunities": ["הזדמנות 1", "הזדמנות 2"]
}`;

    const message = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 1024,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { summary: text, contentStyle: '', gaps: [], opportunities: [] };
    }
    return JSON.parse(jsonMatch[0]);
  }

  // ניתוח שוק כללי — מה כולם עושים ואיפה הפער
  async analyzeMarket(): Promise<{
    commonPatterns: string[];
    overusedMessages: string[];
    missingTopics: string[];
    positioningOpportunities: string[];
    contentRecommendations: string[];
  }> {
    const competitorSummaries = this.competitors.map(c =>
      `${c.name} (@${c.instagramHandle}): ${c.specialization}. מסרים: ${c.mainMessages}. חוזקות: ${c.strengths}. חולשות: ${c.weaknesses}.`
    ).join('\n');

    const prompt = `נתח את שוק ה-DJs הישראלי לחתונות ואירועים על בסיס המתחרים האלה:

${competitorSummaries}

ה-DNA של DJ אלמוג כהן:
${buildBrandContext()}

---

תן ניתוח שוק מפורט בJSON:
{
  "commonPatterns": ["דפוס 1 שחוזר אצל כולם", "דפוס 2"],
  "overusedMessages": ["מסר שכולם משתמשים בו ונשחק"],
  "missingTopics": ["נושא שאף אחד לא מדבר עליו"],
  "positioningOpportunities": ["איפה אלמוג יכול להיות שונה"],
  "contentRecommendations": ["המלצה 1 לתוכן", "המלצה 2"]
}`;

    const message = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 1536,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { commonPatterns: [], overusedMessages: [], missingTopics: [], positioningOpportunities: [], contentRecommendations: [] };
    }
    return JSON.parse(jsonMatch[0]);
  }

  // ייצור רעיונות תוכן מבוססי מחקר
  async generateContentIdeas(audience: 'wedding' | 'course', count: number = 10): Promise<{
    ideas: Array<{
      title: string;
      angle: string;
      hook: string;
      contentType: string;
      basedOn: string;
    }>;
  }> {
    const marketContext = this.competitors.length > 0
      ? `מתחרים שנותחו: ${this.competitors.map(c => `${c.name} (${c.specialization})`).join(', ')}`
      : 'אין עדיין נתוני מתחרים';

    const audienceLabel = audience === 'wedding' ? 'זוגות מתחתנים' : 'תלמידי DJ מתחילים';

    const prompt = `ייצר ${count} רעיונות תוכן מקוריים עבור DJ אלמוג כהן.

קהל: ${audienceLabel}
${marketContext}

${buildBrandContext()}

---

כללים:
- כל רעיון חייב להיות שונה ממה שמתחרים עושים
- כל רעיון חייב לתת ערך אמיתי (לא סתם "תראו אותי")
- מגוון סוגי תוכן: ריל, קרוסלה, סטורי, פוסט
- הוק חזק לכל רעיון

החזר JSON:
{
  "ideas": [
    {
      "title": "כותרת בעברית",
      "angle": "זווית ייחודית",
      "hook": "הוק לשורה ראשונה",
      "contentType": "reel/carousel/story/post",
      "basedOn": "על מה הרעיון מבוסס (פער, טרנד, תובנה)"
    }
  ]
}`;

    const message = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 2048,
      temperature: 0.8,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { ideas: [] };
    }
    return JSON.parse(jsonMatch[0]);
  }
}
