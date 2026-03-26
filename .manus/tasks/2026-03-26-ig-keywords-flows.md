# Task: Instagram Keyword Flows for Auto-DM

- **From:** Claude Code
- **To:** Manus
- **Priority:** high
- **Type:** data
- **Status:** pending

## Description
Create Instagram auto-DM flows (replacing ManyChat). Currently there's only 1 working flow with keyword "מאורסים" that got 5 sends and 80% CTR. We need more flows for both audiences.

## Current ManyChat Setup (being replaced)
- Keyword "מאורסים" → 3 random replies + DM with links
- Requires follow before sending link (high friction — losing people)
- No qualifying questions, no follow-up sequence
- 609 contacts, 496 unhandled messages

## What We Need
For each flow, provide:

```json
{
  "keyword": "מאורסים",
  "autoReplyOptions": [
    "תגובה 1 בעברית",
    "תגובה 2 בעברית",
    "תגובה 3 בעברית"
  ],
  "dmMessage": "הודעת DM ראשונה בעברית...",
  "followUpMessages": [
    { "delay": "1 day", "message": "הודעת פולואפ..." },
    { "delay": "3 days", "message": "הודעת פולואפ שנייה..." }
  ],
  "audience": "wedding | course",
  "goal": "lead_capture | engagement | trust",
  "qualifyingQuestions": ["שאלה מסננת 1?", "שאלה מסננת 2?"]
}
```

## Flows to Create

### Wedding Flows (5)
1. **"מאורסים"** — improved version of existing flow (no follow requirement!)
2. **"DJ לחתונה"** — for people asking about wedding DJ
3. **"תאריך פנוי"** — for people asking about availability
4. **"הצעת מחיר"** — for people asking about pricing
5. **"חתונה"** — generic wedding keyword

### Course Flows (3)
6. **"קורס DJ"** — for people interested in learning
7. **"ללמוד"** — broader learning keyword
8. **"מתחיל"** — for beginners

### Brand Flows (2)
9. **"ציוד"** — Fix Mix equipment rental
10. **"פודקאסט"** — podcast inquiries

## Rules
- NO follow requirement before sending info (removes friction)
- Include qualifying questions (when is the event? budget? experience level?)
- DM tone: premium but warm, per Brand Core rules
- Each flow should capture the contact as a lead in CRM
- Hebrew only
- CTAs: "בדיקת התאמה" style, not "book now!!!"

## Acceptance Criteria
- [ ] 10 flows with all fields
- [ ] Auto-reply options (3 per flow, varied)
- [ ] DM message with value + CTA
- [ ] Follow-up sequence (2 messages per flow)
- [ ] Qualifying questions
- [ ] Hebrew only

## Where to Put Output
Save to: `.manus/outputs/2026-03-26-ig-flows.json`
