// בוט יוצר תוכן — Content Bot
// מייצר תוכן מותאם על בסיס כללים + דוגמאות + מחקר

import Anthropic from '@anthropic-ai/sdk';
import { buildBrandContext } from './prompts/brand-core';
import { WEDDING_CONTEXT } from './prompts/wedding';
import { COURSE_CONTEXT } from './prompts/course';
import type { ContentRequest, ContentResult, TrainingExample, BotConfig } from './bot-config';
import { DEFAULT_CONFIG, CONTENT_TYPE_LABELS } from './bot-config';

export class ContentBot {
  private client: Anthropic;
  private config: BotConfig;
  private trainingExamples: TrainingExample[] = [];

  constructor(config?: Partial<BotConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.client = new Anthropic({ apiKey: this.config.apiKey });
  }

  // הוספת דוגמאות אימון
  addTrainingExamples(examples: TrainingExample[]) {
    this.trainingExamples.push(...examples);
  }

  // בניית הקשר מדוגמאות
  private buildExamplesContext(audience: string): string {
    const good = this.trainingExamples.filter(e => e.isGoodExample && e.audience === audience);
    const bad = this.trainingExamples.filter(e => !e.isGoodExample);

    let context = '';
    if (good.length > 0) {
      context += `\n\nדוגמאות טובות לסגנון (כתוב ככה):\n`;
      context += good.slice(0, 5).map((e, i) => `${i + 1}. "${e.content}"`).join('\n');
    }
    if (bad.length > 0) {
      context += `\n\nדוגמאות רעות (לא לכתוב ככה!):\n`;
      context += bad.slice(0, 3).map((e, i) => `${i + 1}. "${e.content}"${e.notes ? ` (למה רע: ${e.notes})` : ''}`).join('\n');
    }
    return context;
  }

  // בניית הקשר לפי קהל
  private getAudienceContext(audience: string): string {
    switch (audience) {
      case 'wedding': return WEDDING_CONTEXT;
      case 'course': return COURSE_CONTEXT;
      default: return 'הקהל: כללי. מיתוג אישי של DJ אלמוג כהן. חוויה, אנרגיה, מקצוענות.';
    }
  }

  // ייצור תוכן
  async generate(request: ContentRequest): Promise<ContentResult> {
    const brandContext = buildBrandContext();
    const audienceContext = this.getAudienceContext(request.audience);
    const examplesContext = this.buildExamplesContext(request.audience);

    const inputLabel = request.inputType === 'topic' ? 'נושא'
      : request.inputType === 'competitor_post' ? 'פוסט מתחרה (כתוב גרסה שלך, שונה לגמרי)'
      : request.inputType === 'image' ? 'תיאור תמונה/סרטון'
      : 'טרנד';

    const prompt = `${brandContext}

${audienceContext}
${examplesContext}

---

סוג התוכן: ${CONTENT_TYPE_LABELS[request.contentType]}
פלטפורמה: ${request.platform}
${inputLabel}: ${request.inputText}

כתוב ${CONTENT_TYPE_LABELS[request.contentType]} בעברית.

חוקים:
- הוק חזק בשורה הראשונה
- ערך אמיתי באמצע
- קריאה לפעולה סלקטיבית בסוף
- מקסימום 1-2 אימוגים
- פסקאות קצרות
- לא רדוד, לא גנרי, לא הייפ ריק

החזר JSON:
{
  "content": "הטקסט המלא",
  "hook": "השורה הראשונה בלבד",
  "cta": "הקריאה לפעולה",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}`;

    const message = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // חילוץ JSON מהתשובה
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        content: responseText,
        hook: responseText.split('\n')[0],
        cta: 'בדיקת התאמה',
        hashtags: [],
        audience: request.audience,
        contentType: request.contentType,
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      content: parsed.content,
      hook: parsed.hook,
      cta: parsed.cta,
      hashtags: parsed.hashtags || [],
      audience: request.audience,
      contentType: request.contentType,
    };
  }

  // ייצור עם שיפור מבוט בודק
  async generateWithQAFeedback(
    request: ContentRequest,
    feedback: string,
    previousContent: string,
  ): Promise<ContentResult> {
    const modifiedRequest = {
      ...request,
      inputText: `${request.inputText}

---
הגרסה הקודמת נכשלה בבדיקת איכות:
"${previousContent}"

הערות הבודק:
${feedback}

כתוב גרסה חדשה ומשופרת שמתקנת את הבעיות.`,
    };

    return this.generate(modifiedRequest);
  }
}
