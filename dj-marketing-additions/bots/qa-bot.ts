// בוט בודק איכות — QA Bot
// מונע תוכן רדוד, גנרי, או לא מותגי
// כל תוכן שנוצר עובר דרך הבוט הזה לפני פרסום

import Anthropic from '@anthropic-ai/sdk';
import { QA_SYSTEM_PROMPT, QA_CHECK_PROMPT, MIN_SCORE, type QAResult } from './prompts/qa-checks';
import type { BotConfig } from './bot-config';
import { DEFAULT_CONFIG } from './bot-config';

export class QABot {
  private client: Anthropic;
  private config: BotConfig;

  constructor(config?: Partial<BotConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.client = new Anthropic({ apiKey: this.config.apiKey });
  }

  // בדיקת איכות תוכן
  async check(content: string, audience: string): Promise<QAResult> {
    const message = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 1024,
      temperature: 0.3, // נמוך יותר לבדיקה עקבית
      system: QA_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: QA_CHECK_PROMPT(content, audience),
      }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // חילוץ JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // אם לא הצליח לפרסר — ציון ברירת מחדל
      return {
        scores: { value: 5, hook: 5, brand_tone: 5, audience_fit: 5, cta: 5, originality: 5, depth: 5 },
        average: 5,
        pass: false,
        verdict: 'לא הצלחתי לנתח — צריך בדיקה ידנית',
        improvements: ['לבדוק ידנית'],
        strengths: [],
      };
    }

    const result: QAResult = JSON.parse(jsonMatch[0]);

    // חישוב ממוצע אם לא קיים
    if (!result.average) {
      const scores = Object.values(result.scores);
      result.average = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    // קביעת עבר/נכשל
    result.pass = result.average >= MIN_SCORE;

    return result;
  }

  // בניית משוב לבוט היוצר
  buildFeedback(result: QAResult): string {
    const weakAreas = Object.entries(result.scores)
      .filter(([_, score]) => score < 7)
      .map(([area, score]) => {
        const labels: Record<string, string> = {
          value: 'ערך אמיתי',
          hook: 'הוק',
          brand_tone: 'טון מותג',
          audience_fit: 'התאמה לקהל',
          cta: 'קריאה לפעולה',
          originality: 'מקוריות',
          depth: 'עומק',
        };
        return `- ${labels[area] || area}: ציון ${score}/10`;
      });

    let feedback = `ציון כללי: ${result.average.toFixed(1)}/10 — ${result.pass ? 'עבר' : 'נכשל'}\n`;

    if (weakAreas.length > 0) {
      feedback += `\nאזורים חלשים:\n${weakAreas.join('\n')}\n`;
    }

    if (result.improvements.length > 0) {
      feedback += `\nשיפורים נדרשים:\n${result.improvements.map(i => `- ${i}`).join('\n')}\n`;
    }

    if (result.rewrite_suggestion) {
      feedback += `\nהצעת שכתוב: ${result.rewrite_suggestion}`;
    }

    return feedback;
  }
}
