# Task: Optimize WhatsApp Message Templates & Sequences

- **From:** Claude Code
- **To:** Manus
- **Priority:** medium
- **Type:** data
- **Status:** pending

## Description
Review and optimize the WhatsApp message templates currently in the system. The current templates are functional but generic. Need Manus to apply the Brand Core voice and create proper sequences for each lead stage.

## Current Templates (in `src/types/whatsapp.ts`)
1. ברוכים הבאים (welcome)
2. תזכורת - לא ענה (reminder)
3. אישור שיחה (confirmation)
4. שליחת חוזה (contract)
5. Follow-up (followup)
6. מזל טוב - חתם (signed confirmation)

## What's Needed

### 1. Improve Existing Templates
- Apply Brand Core tone (premium, confident, not desperate)
- Add personalization variables
- Create A/B variants for each template

### 2. Create New Sequences by Event Type
Each sequence = series of messages with timing:

**Wedding Lead Sequence:**
- Day 0: Welcome + value proposition
- Day 1: "5 things couples forget when choosing a DJ" (value)
- Day 3: "Here's how I work" (trust)
- Day 5: "Want to check if I'm available for your date?" (CTA)
- Day 10: Last follow-up

**Course Lead Sequence:**
- Day 0: Welcome + what to expect
- Day 1: "3 mistakes beginners make" (value)
- Day 3: Student success story (proof)
- Day 5: "Which track fits you?" (CTA)
- Day 10: Last follow-up

**Equipment Rental Sequence:**
- Day 0: Welcome + equipment list
- Day 1: Follow-up if no response

### 3. Status-Change Messages
For each status transition, write the WhatsApp message:
- ליד חדש → לא ענה
- לא ענה → (after 3 attempts) final message
- נקבעה שיחה → confirmation + reminder
- הצעת מחיר נשלחה → follow-up
- חוזה נשלח → instructions + urgency
- חתם → celebration + next steps

## Output Format
```json
{
  "templates": [
    {
      "name": "שם התבנית",
      "category": "welcome|reminder|contract|confirmation|followup|value|proof|custom",
      "audience": "wedding|course|rental|general",
      "message": "טקסט ההודעה עם {{name}} variables",
      "timing": "immediate | +1d | +3d | +5d | +10d",
      "triggerStatus": "new | no_answer | call_scheduled | quote_sent | contract_sent | signed"
    }
  ],
  "sequences": {
    "wedding": [...],
    "course": [...],
    "rental": [...]
  }
}
```

## Rules
- Hebrew only
- Max 500 characters per message
- 1-2 emojis per message (not more)
- Premium tone, not salesy
- Include clear CTA in every message
- Variables: {{name}}, {{eventDate}}, {{eventType}}, {{date}}, {{time}}

## Where to Put Output
Save to: `.manus/outputs/2026-03-26-wa-sequences.json`
