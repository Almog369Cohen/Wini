#!/usr/bin/env npx tsx
// הרצת הבוטים — סקריפט CLI
// שימוש: ANTHROPIC_API_KEY=sk-... npx tsx bots/run.ts

import { ContentPipeline, quickGenerate } from './pipeline';
import { TRAINING_EXAMPLES } from '../data/training-examples/examples';
import { COMPETITORS } from '../data/competitors/competitors';

const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('❌ חסר ANTHROPIC_API_KEY');
  console.error('שימוש: ANTHROPIC_API_KEY=sk-... npx tsx bots/run.ts');
  process.exit(1);
}

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function main() {
  const pipeline = new ContentPipeline({ apiKey: API_KEY! });
  pipeline.loadTrainingExamples(TRAINING_EXAMPLES);
  pipeline.loadCompetitors(COMPETITORS);

  switch (command) {
    case 'generate': {
      const topic = args[1] || 'למה רחבה טובה לא נבנית רק משירים';
      const audience = (args[2] || 'wedding') as 'wedding' | 'course' | 'brand';
      console.log(`\n🎵 מייצר תוכן...`);
      console.log(`📝 נושא: ${topic}`);
      console.log(`👥 קהל: ${audience}\n`);

      const result = await pipeline.generate({
        inputType: 'topic',
        inputText: topic,
        audience,
        contentType: 'caption',
        platform: 'instagram',
      });

      console.log('━'.repeat(50));
      console.log(result.content.content);
      console.log('━'.repeat(50));
      console.log(`\n⭐ ציון: ${result.qaScore.toFixed(1)}/10`);
      console.log(`${result.passed ? '✅ עבר' : '❌ נכשל'}: ${result.qaVerdict}`);
      console.log(`🔄 ניסיונות: ${result.attempts}`);
      if (result.qaStrengths.length > 0) {
        console.log(`💪 חוזקות: ${result.qaStrengths.join(', ')}`);
      }
      if (result.qaImprovements.length > 0) {
        console.log(`📌 לשפר: ${result.qaImprovements.join(', ')}`);
      }
      console.log(`\n#️⃣ ${result.content.hashtags.join(' ')}`);
      break;
    }

    case 'research': {
      const audience = (args[1] || 'wedding') as 'wedding' | 'course';
      const count = parseInt(args[2] || '5');
      console.log(`\n🔍 מייצר ${count} רעיונות מחקריים לקהל ${audience}...\n`);

      const results = await pipeline.generateFromResearch(audience, count);
      for (const [i, result] of results.entries()) {
        console.log(`\n--- רעיון ${i + 1} ---`);
        console.log(result.content.hook);
        console.log(`⭐ ${result.qaScore.toFixed(1)}/10 ${result.passed ? '✅' : '❌'}`);
      }
      break;
    }

    case 'market': {
      console.log('\n📊 מנתח שוק...\n');
      const analysis = await pipeline.analyzeMarket();
      console.log('דפוסים נפוצים:', analysis.commonPatterns.join('\n  - '));
      console.log('\nמסרים נשחקים:', analysis.overusedMessages.join('\n  - '));
      console.log('\nנושאים חסרים:', analysis.missingTopics.join('\n  - '));
      console.log('\nהזדמנויות:', analysis.positioningOpportunities.join('\n  - '));
      console.log('\nהמלצות:', analysis.contentRecommendations.join('\n  - '));
      break;
    }

    case 'batch': {
      const audience = (args[1] || 'wedding') as 'wedding' | 'course';
      console.log(`\n📦 מייצר 5 פוסטים לקהל ${audience}...\n`);

      const topics = audience === 'wedding'
        ? [
          'טעויות שזוגות עושים בבחירת DJ',
          'מה באמת בונה רחבה טובה',
          'למה קריאת קהל חשובה יותר מפלייליסט',
          'ההבדל בין DJ שמנגן ל-DJ שמוביל חוויה',
          'מה זוגות לא יודעים על בניית ערב',
        ]
        : [
          'מה מתחילים עושים לא נכון',
          'למה ללמוד DJ מרגיש טכני מדי בהתחלה',
          'איך בונים ביטחון בעמדה',
          'מה אני הייתי עושה אם הייתי מתחיל מאפס',
          'למה רוב הקורסים לא באמת מלמדים',
        ];

      for (const [i, topic] of topics.entries()) {
        console.log(`\n--- פוסט ${i + 1}: ${topic} ---`);
        const result = await pipeline.generate({
          inputType: 'topic',
          inputText: topic,
          audience,
          contentType: 'caption',
          platform: 'instagram',
        });
        console.log(`⭐ ${result.qaScore.toFixed(1)}/10 ${result.passed ? '✅' : '❌'} (${result.attempts} ניסיונות)`);
        console.log(`הוק: ${result.content.hook}`);
      }
      break;
    }

    case 'quick': {
      const topic = args.slice(1).join(' ') || 'למה DJ טוב לא מספיק';
      console.log(`\n⚡ ייצור מהיר: "${topic}"\n`);
      const result = await quickGenerate(API_KEY!, topic);
      console.log(result.content.content);
      console.log(`\n⭐ ${result.qaScore.toFixed(1)}/10 ${result.passed ? '✅' : '❌'}`);
      break;
    }

    default:
      console.log(`
🎵 DJ אלמוג כהן — מערכת בוטים

פקודות:
  generate [נושא] [audience]  — ייצור פוסט בודד
  research [audience] [count]  — רעיונות מבוססי מחקר
  market                       — ניתוח שוק
  batch [audience]             — 5 פוסטים
  quick [נושא]                — ייצור מהיר

דוגמאות:
  npx tsx bots/run.ts generate "טעויות שזוגות עושים" wedding
  npx tsx bots/run.ts research course 10
  npx tsx bots/run.ts market
  npx tsx bots/run.ts batch wedding
  npx tsx bots/run.ts quick למה DJ טוב לא מספיק
      `);
  }
}

main().catch(console.error);
