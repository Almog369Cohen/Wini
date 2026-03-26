# Manus Skills Reference — DJ Almog Cohen

These are the 4 Manus skills configured for this project.
Claude Code references these when building features.

---

## Skill 1: Almog Cohen Brand Core
**Purpose:** Brand identity layer used by all other skills.
**Key rules:**
- Premium, sharp, emotionally intelligent, not cheesy
- Colors: Blue #059cc0, Green #03b28c, Dark Gray #1f1f21, White #ffffff
- Tone: direct, confident, intelligent, grounded, masculine but warm
- Never: cheap wedding language, hype, generic clichés, desperate sales
- CTA style: selective ("בדיקת התאמה", "שיחת היכרות")

## Skill 2: Almog Weddings Lead Engine
**Purpose:** Marketing for wedding couples.
**Target:** Couples who want premium, emotional, precise DJ experience
**Core message:** "אני לא בא רק לנגן. אני בא להחזיק את האנרגיה של הערב שלכם."
**Content pillars:** Authority, Proof, Emotional Connection, Filtering
**CTA:** בדיקת התאמה לחתונה | בדיקת תאריך | שיחת היכרות

## Skill 3: Almog DJ Academy Lead Engine
**Purpose:** Marketing for DJ students.
**Target:** Beginners who need confidence, structure, practical teaching
**Core message:** "אני לא מלמד רק ציוד. אני עוזר לך באמת להתחיל לנגן, להבין, ולהרגיש בטוח."
**Content pillars:** Authority, Proof, Emotional Connection, Call to Action
**CTA:** בדיקת התאמה ללימודים | קבלת פרטים על הקורס

## Skill 4: Almog Content Analyzer & Copy Engine
**Purpose:** Analyze uploaded media → generate copy.
**Rules:**
- Never create empty hype
- Content must feel mature, sharp, useful
- AI visible is OK, but real value is required
- Every output connects visual content to real human pain/desire/insight
- Returns: what's happening, audience fit, 3 angles, best angle, hooks, caption, CTA

---

## Data Already Loaded in Codebase
All brand data is in `src/data/brandCore.ts`:
- `BRAND_CORE` — identity, values, tone, colors
- `WEDDING_AUDIENCE` — pains, desires, triggers, objections, CTAs
- `DJ_COURSE_AUDIENCE` — same structure for students
- `MESSAGE_MAP` — wedding messages + course messages
