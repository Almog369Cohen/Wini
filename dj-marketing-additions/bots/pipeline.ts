// Pipeline — מחבר את 3 הבוטים יחד
// Research → Content → QA → (loop if fail) → Ready

import { ContentBot } from './content-bot';
import { QABot } from './qa-bot';
import { ResearchBot } from './research-bot';
import { MAX_RETRIES } from './prompts/qa-checks';
import type { ContentRequest, ContentResult, TrainingExample, CompetitorData, BotConfig } from './bot-config';

export interface PipelineResult {
  content: ContentResult;
  qaScore: number;
  qaVerdict: string;
  qaStrengths: string[];
  qaImprovements: string[];
  attempts: number;
  passed: boolean;
}

export class ContentPipeline {
  private contentBot: ContentBot;
  private qaBot: QABot;
  private researchBot: ResearchBot;

  constructor(config?: Partial<BotConfig>) {
    this.contentBot = new ContentBot(config);
    this.qaBot = new QABot(config);
    this.researchBot = new ResearchBot(config);
  }

  // טעינת דוגמאות אימון
  loadTrainingExamples(examples: TrainingExample[]) {
    this.contentBot.addTrainingExamples(examples);
  }

  // טעינת נתוני מתחרים
  loadCompetitors(competitors: CompetitorData[]) {
    this.researchBot.loadCompetitors(competitors);
  }

  // הצינור המלא: ייצור → בדיקה → שיפור → בדיקה → אישור/דחייה
  async generate(request: ContentRequest): Promise<PipelineResult> {
    let attempts = 0;
    let content: ContentResult | null = null;
    let lastQAFeedback = '';

    while (attempts < MAX_RETRIES + 1) {
      attempts++;

      // ייצור תוכן (או שיפור אם יש משוב)
      if (attempts === 1 || !content) {
        content = await this.contentBot.generate(request);
      } else {
        content = await this.contentBot.generateWithQAFeedback(
          request,
          lastQAFeedback,
          content.content,
        );
      }

      // בדיקת איכות
      const qaResult = await this.qaBot.check(content.content, request.audience);

      content.qaScore = qaResult.average;
      content.qaVerdict = qaResult.verdict;
      content.qaImprovements = qaResult.improvements;

      if (qaResult.pass) {
        return {
          content,
          qaScore: qaResult.average,
          qaVerdict: qaResult.verdict,
          qaStrengths: qaResult.strengths,
          qaImprovements: qaResult.improvements,
          attempts,
          passed: true,
        };
      }

      // לא עבר — בניית משוב לניסיון הבא
      lastQAFeedback = this.qaBot.buildFeedback(qaResult);
    }

    // מיצינו ניסיונות — מחזיר עם סימון "לא עבר"
    return {
      content: content!,
      qaScore: content!.qaScore || 0,
      qaVerdict: content!.qaVerdict || 'לא עבר אחרי מספר ניסיונות',
      qaStrengths: [],
      qaImprovements: content!.qaImprovements || ['צריך בדיקה ידנית'],
      attempts,
      passed: false,
    };
  }

  // ייצור batch — כמה פוסטים בבת אחת
  async generateBatch(requests: ContentRequest[]): Promise<PipelineResult[]> {
    const results: PipelineResult[] = [];
    for (const request of requests) {
      const result = await this.generate(request);
      results.push(result);
    }
    return results;
  }

  // ייצור רעיונות מבוססי מחקר → ייצור תוכן → בדיקה
  async generateFromResearch(audience: 'wedding' | 'course', count: number = 5): Promise<PipelineResult[]> {
    // שלב 1: ייצור רעיונות מחקריים
    const ideas = await this.researchBot.generateContentIdeas(audience, count);

    // שלב 2: ייצור תוכן לכל רעיון + בדיקת איכות
    const requests: ContentRequest[] = ideas.ideas.map(idea => ({
      inputType: 'topic' as const,
      inputText: `${idea.title}\nזווית: ${idea.angle}\nהוק מוצע: ${idea.hook}\nמבוסס על: ${idea.basedOn}`,
      audience,
      contentType: (idea.contentType === 'reel' ? 'reel_script'
        : idea.contentType === 'carousel' ? 'carousel'
        : idea.contentType === 'story' ? 'story'
        : 'caption') as any,
      platform: 'instagram' as const,
    }));

    return this.generateBatch(requests);
  }

  // ניתוח שוק
  async analyzeMarket() {
    return this.researchBot.analyzeMarket();
  }

  // ניתוח מתחרה בודד
  async analyzeCompetitor(competitor: CompetitorData) {
    return this.researchBot.analyzeCompetitor(competitor);
  }
}

// שימוש מהיר
export async function quickGenerate(
  apiKey: string,
  topic: string,
  audience: 'wedding' | 'course' | 'brand' = 'wedding',
): Promise<PipelineResult> {
  const pipeline = new ContentPipeline({ apiKey });
  return pipeline.generate({
    inputType: 'topic',
    inputText: topic,
    audience,
    contentType: 'caption',
    platform: 'instagram',
  });
}
