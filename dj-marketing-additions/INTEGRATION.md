# מדריך שילוב — בוטים + פלטפורמת Manus

## מה קיים

### פלטפורמת Manus (manus-platform/)
- דשבורד עם סטטיסטיקות
- תכנון תוכן (4 עמודים)
- ניהול לידים (חתונות + קורסים)
- ניתוח מתחרים
- מסמכים וחשבוניות
- חתימות דיגיטליות
- **Stack:** React 19, tRPC, Drizzle ORM, MySQL

### מערכת בוטים (bots/)
- בוט מחקר — חוקר מתחרים, מנתח שוק
- בוט יוצר — מייצר תוכן מותאם
- בוט בודק — מסנן תוכן רדוד (7 קריטריונים, ציון 1-10)
- Pipeline — מחבר את שלושתם
- **Stack:** Claude API (Anthropic SDK), TypeScript

## איך לשלב

### שלב 1: להוסיף route ל-tRPC

להוסיף ל-`routers.ts`:

```typescript
import { ContentPipeline } from '../bots/pipeline';
import { TRAINING_EXAMPLES } from '../data/training-examples/examples';
import { COMPETITORS } from '../data/competitors/competitors';

// אתחול pipeline
const pipeline = new ContentPipeline({ apiKey: process.env.ANTHROPIC_API_KEY });
pipeline.loadTrainingExamples(TRAINING_EXAMPLES);
pipeline.loadCompetitors(COMPETITORS);

// הוספה ל-appRouter:
contentBot: router({
  generate: protectedProcedure
    .input(z.object({
      topic: z.string(),
      audience: z.enum(['wedding', 'course', 'brand']),
      contentType: z.enum(['caption', 'hook', 'reel_script', 'story', 'carousel']),
      platform: z.enum(['instagram', 'tiktok', 'facebook', 'youtube']),
      inputType: z.enum(['topic', 'image', 'competitor_post', 'trend']).default('topic'),
    }))
    .mutation(async ({ input }) => {
      return pipeline.generate({
        inputType: input.inputType,
        inputText: input.topic,
        audience: input.audience,
        contentType: input.contentType,
        platform: input.platform,
      });
    }),

  generateFromResearch: protectedProcedure
    .input(z.object({
      audience: z.enum(['wedding', 'course']),
      count: z.number().min(1).max(20).default(5),
    }))
    .mutation(async ({ input }) => {
      return pipeline.generateFromResearch(input.audience, input.count);
    }),

  analyzeMarket: protectedProcedure
    .query(async () => {
      return pipeline.analyzeMarket();
    }),
}),
```

### שלב 2: להוסיף דף ContentBotTrainer

כבר קיים ב-`ContentBotTrainer.tsx` — רק להוסיף route ב-App.tsx:
```typescript
import ContentBotTrainer from './pages/ContentBotTrainer';
// ...
<Route path="/bot-trainer" component={ContentBotTrainer} />
```

ולהוסיף לניווט ב-DashboardLayout.tsx:
```typescript
{ path: '/bot-trainer', label: 'אימון בוט', icon: Sparkles }
```

### שלב 3: להוסיף dependency

ב-package.json של הפרויקט:
```json
"@anthropic-ai/sdk": "^0.39.0"
```

### שלב 4: להוסיף env var

```
ANTHROPIC_API_KEY=sk-ant-...
```

## הרצה עצמאית (בלי הפלטפורמה)

```bash
cd bots
npm install
ANTHROPIC_API_KEY=sk-... npx tsx run.ts generate "טעויות שזוגות עושים" wedding
ANTHROPIC_API_KEY=sk-... npx tsx run.ts batch wedding
ANTHROPIC_API_KEY=sk-... npx tsx run.ts market
```

## תרשים זרימה

```
[משתמש בדשבורד]
       │
       ▼
[בוחר: נושא + קהל + סוג]
       │
       ▼
[tRPC: contentBot.generate]
       │
       ▼
[Research Bot] → מחקר + הקשר
       │
       ▼
[Content Bot] → ייצור תוכן
       │
       ▼
[QA Bot] → בדיקת 7 קריטריונים
       │
   ציון < 7? ──→ חוזר ל-Content Bot עם משוב
       │
   ציון >= 7? ──→ מוצג למשתמש
       │
       ▼
[משתמש מדרג 1-5 כוכבים]
       │
       ▼
[נשמר ב-DB → הבוט לומד]
```
