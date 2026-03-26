#!/bin/bash
# Run this from inside ~/dj-almog-marketing/

mkdir -p .manus/{tasks,outputs,plans,templates,logs,project-setup}
touch .manus/outputs/.gitkeep .manus/plans/.gitkeep .manus/logs/.gitkeep

# README
cat > README.md << 'EOF'
# Marketing - DJ ALMOG COHEN

ריפו שיווקי ל-DJ אלמוג כהן.
מנוהל על ידי Manus (שיווק) בסנכרון עם Claude Code (פיתוח).
EOF

# PROTOCOL
cat > .manus/PROTOCOL.md << 'EOF'
# פרוטוקול סנכרון — Manus ↔ Claude Code

## מה זה?
התיקייה הזו היא הגשר בין Manus (שיווק) ל-Claude Code (פיתוח).
שני ה-AI עובדים דרך Git — כותבים קבצים, דוחפים, והשני קורא.

## איך זה עובד
Manus כותב משימה ב-tasks/ ← Claude Code קורא ובונה ← שומר תוצר ב-outputs/ ← Manus קורא ומפעיל

## חוקים
1. לא למחוק קבצים של הצד השני
2. לעדכן STATUS.md כשמתחילים או מסיימים עבודה
3. משימה אחת לקובץ
4. לפני כתיבה: git pull — אחרי כתיבה: git push

## ריפוים
- שיווק (Manus): Almog369Cohen/dj-almog-marketing
- מערכת (Claude Code): Almog369Cohen/Wini
EOF

# ROLES
cat > .manus/ROLES.md << 'EOF'
# חלוקת תפקידים

## Manus — המוח השיווקי
- מחקר שוק ומתחרים
- אסטרטגיית תוכן ורעיונות
- ניתוח אינסטגרם
- כתיבת קופי (כיתובים, הוקים, סקריפטים)
- תכנון קמפיינים
- תבניות הודעות WhatsApp
- פרופיל קהלים ומפת מסרים

## Claude Code — המוח ההנדסי
- מערכת CRM
- מנוע אוטומציות
- חיבור WhatsApp דרך GREEN-API
- בונה טפסים
- דשבורד שיווק
- אוטומציית אינסטגרם
- חיבורי API
- ממשק משתמש
EOF

# STATUS
cat > .manus/STATUS.md << 'EOF'
# מצב מערכת — DJ אלמוג כהן

עדכון אחרון: 2026-03-26

## ממתין ל-Manus
1. לקרוא PROTOCOL.md ו-ROLES.md
2. להתחיל מהמשימה: tasks/2026-03-26-content-ideas-60.md
3. לשמור תוצר ב-outputs/
4. לעדכן את הקובץ הזה
EOF

# MANUS SKILLS
cat > .manus/templates/manus-skills.md << 'EOF'
# סקילים של Manus — DJ אלמוג כהן

## סקיל 1: זהות המותג
- פרימיום, חד, אינטליגנטי רגשית, לא קיטשי
- צבעים: כחול #059cc0, ירוק #03b28c, אפור כהה #1f1f21, לבן #ffffff
- טון: ישיר, בטוח, גברי אבל חם
- קריאה לפעולה: סלקטיבית ("בדיקת התאמה", "שיחת היכרות")

## סקיל 2: מנוע לידים לחתונות
- קהל: זוגות שרוצים חוויית DJ פרימיום
- מסר: "אני לא בא רק לנגן. אני בא להחזיק את האנרגיה של הערב שלכם."
- עמודי תוכן: סמכות, הוכחה, חיבור רגשי, סינון

## סקיל 3: מנוע לידים לקורסים
- קהל: מתחילים שצריכים ביטחון ומבנה
- מסר: "אני לא מלמד רק ציוד. אני עוזר לך באמת להתחיל לנגן ולהרגיש בטוח."
- עמודי תוכן: סמכות, הוכחה, חיבור רגשי, הנעה לפעולה

## סקיל 4: מנתח תוכן ומנוע קופי
- מקבל תמונה/סרטון ← מייצר קופי
- חובה: ערך אמיתי, טון בוגר, לא הייפ ריק
EOF

# TASK 1: Content Ideas
cat > .manus/tasks/2026-03-26-content-ideas-60.md << 'EOF'
# משימה: ייצור 60 רעיונות תוכן

דחיפות: גבוהה
סטטוס: ממתין

צריך 60 רעיונות — 30 לחתונות, 30 לקורסי DJ.
פורמט JSON, עברית בלבד, טון בוגר.

כל רעיון צריך: id, category, title, caption, hashtags, platforms, contentType, audience, viralScore, shootingTips

קטגוריות: wedding_highlight, event_recap, behind_scenes, tip_advice, testimonial, promotion, trending, engagement, personal_brand

חתונות (30): 8 סמכות, 8 הוכחה, 7 חיבור רגשי, 7 סינון
קורסים (30): 8 סמכות, 8 הוכחה, 7 חיבור רגשי, 7 הנעה לפעולה

שמור ב: .manus/outputs/2026-03-26-content-ideas-60.json
EOF

# TASK 2: IG Flows
cat > .manus/tasks/2026-03-26-ig-keywords-flows.md << 'EOF'
# משימה: 10 זרימות אינסטגרם

דחיפות: גבוהה
סטטוס: ממתין

צריך 10 זרימות keyword → auto-DM (מחליף ManyChat).

5 לחתונות: מאורסים, DJ לחתונה, תאריך פנוי, הצעת מחיר, חתונה
3 לקורסים: קורס DJ, ללמוד, מתחיל
2 למותג: ציוד, פודקאסט

כל זרימה: keyword, 3 תגובות, הודעת DM, 2 הודעות מעקב, שאלות סינון
עברית בלבד, טון פרימיום, בלי דרישת עקיבה.

שמור ב: .manus/outputs/2026-03-26-ig-flows.json
EOF

# TASK 3: WA Sequences
cat > .manus/tasks/2026-03-26-wa-sequence-optimize.md << 'EOF'
# משימה: שיפור רצפי WhatsApp

דחיפות: בינונית
סטטוס: ממתין

צריך רצפי הודעות WhatsApp לכל קהל:
- רצף חתונה: 5 הודעות (יום 0, 1, 3, 5, 10)
- רצף קורס: 5 הודעות
- רצף השכרת ציוד: 2 הודעות
- הודעות לפי שינוי סטטוס (7 מעברים)

עברית, מקסימום 500 תווים, 1-2 אימוגי, טון פרימיום.
משתנים: {{name}}, {{eventDate}}, {{eventType}}, {{date}}, {{time}}

שמור ב: .manus/outputs/2026-03-26-wa-sequences.json
EOF

# PROJECT SETUP
cat > .manus/project-setup/MANUS-PROJECT-SETUP.md << 'EOF'
# הגדרת פרויקט Manus

שם: Marketing - DJ ALMOG COHEN
ריפו: Almog369Cohen/dj-almog-marketing

הפרומפט הראשון ל-Manus:

אתה עובד על פרויקט שיווק ל-DJ אלמוג כהן.
ריפו: Almog369Cohen/dj-almog-marketing

קרא:
1. .manus/PROTOCOL.md
2. .manus/ROLES.md
3. .manus/STATUS.md
4. .manus/templates/manus-skills.md

התחל מהמשימה: .manus/tasks/2026-03-26-content-ideas-60.md
שמור תוצר ב: .manus/outputs/
עדכן: .manus/STATUS.md
EOF

# Commit and push
git add -A
git commit -m "Initial setup: Marketing DJ Almog Cohen sync infrastructure"
git branch -M main
git push -u origin main

echo ""
echo "=============================="
echo "הריפו מוכן! עכשיו חבר את Manus."
echo "=============================="
