# CLAUDE.md — Wini

## Project Overview | סקירת הפרויקט

Wini is a Hebrew-language mobile-first PWA for quitting harmful habits and building positive ones. It provides habit tracking, journaling, SOS crisis support (breathing exercises, craving timers), dopamine activity management, milestone celebrations, and emotional self-reflection tools.

The entire UI is in **Hebrew** with **RTL layout**. All user-facing text must be written in Hebrew.

> **בעברית:** Wini היא אפליקציית ווב (PWA) בעברית, מותאמת למובייל, שעוזרת לגמילה מהרגלים מזיקים ובניית הרגלים חיוביים. האפליקציה כוללת מעקב הרגלים, יומן רגעים, תמיכה במצבי SOS (תרגילי נשימה, טיימר לדחפים), ניהול פעילויות דופמין, חגיגות אבני דרך וכלי רפלקציה רגשית.
> כל הממשק בעברית עם כיוון **RTL** (ימין לשמאל). כל טקסט שהמשתמש רואה חייב להיכתב בעברית.

---

## Tech Stack | סטאק טכנולוגי

- **Framework**: React 19 + TypeScript 5.9 (strict mode)
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 (with Vite plugin, custom theme in `src/index.css`)
- **Animations**: Framer Motion
- **Icons**: lucide-react
- **Dates**: date-fns
- **State**: localStorage via custom hooks (no Redux/Context)
- **Deployment**: GitHub Pages (base path `/Wini/`)

> **בעברית — מה זה אומר בפועל?**
> - **React** — ספריית JavaScript לבניית ממשקי משתמש. כל מה שאתה רואה על המסך נבנה מ"קומפוננטות" (רכיבים) של React.
> - **TypeScript** — שפה שמוסיפה "טיפוסים" (types) על JavaScript. זה כמו לומר לקוד מראש "המשתנה הזה הוא מספר, לא טקסט" — מונע באגים.
> - **Vite** — כלי שמריץ את הפרויקט בפיתוח ובונה אותו לפרודקשן. מאוד מהיר.
> - **Tailwind CSS** — במקום לכתוב CSS בקבצים נפרדים, כותבים קלאסים ישירות ב-HTML: `className="bg-blue-500 text-white p-4"`.
> - **Framer Motion** — ספרייה לאנימציות חלקות (מעברי דפים, אפקטים ויזואליים).
> - **localStorage** — אחסון בדפדפן. המידע נשמר גם אחרי סגירת הדפדפן, בלי שרת.
> - **PWA** — Progressive Web App — אפשר "להתקין" את האתר על מסך הבית של הטלפון כמו אפליקציה רגילה.

---

## Commands | פקודות

```bash
npm run dev        # Start dev server | הפעלת שרת פיתוח
npm run build      # Type-check (tsc -b) then build with Vite | בדיקת טיפוסים ובנייה
npm run lint       # ESLint (flat config, TS + React rules) | בדיקת איכות קוד
npm run preview    # Preview production build | תצוגה מקדימה של הבנייה
```

There is no test framework configured. No CI/CD pipelines exist.

> **בעברית:**
> - `npm run dev` — מריץ את האפליקציה על המחשב שלך לפיתוח. פותחים בדפדפן ורואים שינויים בזמן אמת.
> - `npm run build` — בונה גרסה "סופית" מוכנה להעלאה לאינטרנט. קודם בודק שאין שגיאות TypeScript.
> - `npm run lint` — סורק את הקוד ומחפש בעיות (משתנים לא בשימוש, שגיאות סגנון וכו').
> - `npm run preview` — מציג את הגרסה הבנויה כאילו היא באוויר.
> - אין כרגע מערכת טסטים (בדיקות אוטומטיות) ואין CI/CD (בנייה אוטומטית בענן).

---

## Project Structure | מבנה הפרויקט

```
src/
├── App.tsx              # Root component, routing, state orchestration
├── Layout.tsx           # Bottom nav bar, SOS button, page container
├── main.tsx             # React DOM mount point (StrictMode)
├── index.css            # Tailwind v4 theme (custom colors, RTL, PWA fixes)
├── types/index.ts       # All TypeScript interfaces and type unions
├── components/
│   ├── Dashboard/       # Landing page with tree visualization, daily stats
│   ├── Habits/          # Add/list/track habits and streaks
│   ├── Journal/         # Moment logging, mood charts, heatmaps
│   ├── SOS/             # Crisis support, breathing exercises, craving timer
│   ├── Milestones/      # Achievement tracking, health timeline
│   ├── InnerSpace/      # Reflections, letters to self, emotional needs
│   ├── Settings/        # Data export/import/reset
│   └── ui/              # Shared: Toast, Confetti, ConfirmDialog
├── hooks/
│   ├── useLocalStorage.ts   # Generic localStorage wrapper
│   ├── useHabits.ts         # Habit CRUD, streak calculation
│   ├── useJournal.ts        # Entry logging, analytics/insights
│   ├── useDopamine.ts       # Activity logging, streaks
│   ├── useInnerSpace.ts     # Reflections, letters, emotional needs
│   └── useToast.ts          # Toast notification state
└── data/
    ├── quotes.ts            # Hebrew motivational quotes (daily rotation)
    ├── reflections.ts       # Reflection prompts
    ├── activities.ts        # Pre-defined dopamine activities
    └── healthTimeline.ts    # Milestone templates
```

> **בעברית — הסבר על כל תיקייה:**
> - **`App.tsx`** — הקובץ הראשי. כמו "המנהל" שמחליט איזה דף להציג ומעביר מידע לכל הרכיבים.
> - **`Layout.tsx`** — התבנית הקבועה: סרגל ניווט תחתון עם 5 כפתורים + כפתור SOS בולט.
> - **`main.tsx`** — נקודת ההפעלה. שורה אחת שאומרת "תתחיל להריץ את React".
> - **`index.css`** — הגדרות עיצוב: צבעים מותאמים, RTL, תיקונים ל-iOS.
> - **`types/index.ts`** — כל ה"צורות" של המידע: מה זה הרגל? מה זה רשומת יומן? מוגדר פה.
> - **`components/`** — כל מה שהמשתמש רואה. כל תיקייה = דף או אזור באפליקציה.
>   - `Dashboard` = דף הבית עם העץ הגדל, `Habits` = ניהול הרגלים, `Journal` = יומן רגעים, `SOS` = מצב חירום, `Milestones` = אבני דרך, `InnerSpace` = מרחב פנימי (רפלקציה), `Settings` = הגדרות.
>   - `ui/` = רכיבים משותפים שחוזרים בכל הדפים (הודעות Toast, אפקט קונפטי, דיאלוג אישור).
> - **`hooks/`** — "ווים" (Hooks) = פונקציות שמנהלות מידע ולוגיקה. כל hook אחראי על תחום אחד.
>   - `useLocalStorage` = שומר ומשחזר מידע מהדפדפן. כל שאר ה-hooks משתמשים בו.
>   - `useHabits` = יצירה/עריכה/מחיקה של הרגלים + חישוב רצפים (streaks).
>   - `useJournal` = שמירת רגעים (נפילות/ניצחונות) + ניתוח מגמות ותובנות.
> - **`data/`** — מידע סטטי (לא משתנה): ציטוטים, פעילויות דופמין, תבניות אבני דרך.

---

## Architecture & Patterns | ארכיטקטורה ודפוסי עבודה

### State Management | ניהול מצב
- All persistent state lives in **localStorage**, accessed through custom hooks wrapping `useLocalStorage`.
- `App.tsx` orchestrates all hooks and passes data/callbacks as props to page components.
- Each feature area (habits, journal, dopamine, inner space) has an isolated hook managing its own state.
- No global state management library — keep it this way.

> **בעברית:**
> - כל המידע נשמר ב-**localStorage** של הדפדפן (כמו "מיני דאטאבייס" מקומי). הגישה אליו דרך hooks מותאמים.
> - `App.tsx` הוא "המנצח" — הוא מפעיל את כל ה-hooks ומעביר את המידע וה-callbacks (פונקציות עדכון) לכל רכיב.
> - כל תחום (הרגלים, יומן, דופמין, מרחב פנימי) מנוהל ב-hook נפרד ומבודד — אחד לא משפיע על השני.
> - אין ספריית state management גלובלית (כמו Redux) — וזה בכוונה, לשמור על פשטות.

### Data Flow | זרימת מידע
1. `App.tsx` calls all custom hooks
2. Hooks read/write localStorage and expose state + update functions
3. Components receive data as props and call update callbacks
4. Changes auto-persist to localStorage

> **בעברית:**
> 1. `App.tsx` מפעיל את כל ה-hooks (כמו "להדליק את כל המנועים").
> 2. כל hook קורא ושומר מידע ב-localStorage, וחושף את המידע + פונקציות לעדכון.
> 3. הרכיבים מקבלים את המידע כ-props (פרמטרים) ומשתמשים ב-callbacks כדי לעדכן.
> 4. כל שינוי נשמר אוטומטית ב-localStorage — בלי כפתור "שמור".

### Component Conventions | מוסכמות רכיבים
- Functional components only, no class components
- PascalCase filenames matching component names
- Props interfaces defined per-component (or inline)
- All shared types in `src/types/index.ts`
- Framer Motion `AnimatePresence` for page transitions

> **בעברית:**
> - רק רכיבים פונקציונליים (functions), לא class — זה הסטנדרט המודרני של React.
> - שמות קבצים ב-PascalCase (כל מילה מתחילה באות גדולה): `DailyCheckIn.tsx`, `HabitList.tsx`.
> - לכל רכיב מוגדר interface (צורה) עבור ה-props שהוא מקבל.
> - כל הטיפוסים המשותפים מרוכזים בקובץ אחד: `src/types/index.ts`.
> - מעברים בין דפים מונפשים עם `AnimatePresence` של Framer Motion.

### Routing | ניווט
- Simple state-based routing in `App.tsx` (no react-router)
- 7 pages: `dashboard`, `habits`, `journal`, `sos`, `milestones`, `inner-space`, `settings`
- Page type defined as union type in `types/index.ts`

> **בעברית:**
> - הניווט בין דפים מנוהל ב-state פשוט ב-`App.tsx` — אין ספריית router חיצונית.
> - יש 7 דפים: דשבורד, הרגלים, יומן, SOS, אבני דרך, מרחב פנימי, הגדרות.
> - סוג הדף מוגדר כ-union type (אחד מתוך רשימה סגורה) ב-`types/index.ts`.

---

## Styling Conventions | מוסכמות עיצוב

- **Tailwind CSS v4** utility classes directly in JSX — no CSS modules or styled-components
- Custom color palette defined in `src/index.css` via `@theme`: cream, sage, sea, sand, coral
- **Mobile-first**: design for small screens, use responsive classes for larger
- **RTL**: `direction: rtl` is set globally; use logical properties where applicable
- iOS-specific fixes in `index.css` for safe-area-inset and overflow scrolling

> **בעברית:**
> - כל העיצוב מתבצע עם **Tailwind** — קלאסים קצרים ישירות ב-JSX כמו `className="bg-sage-100 p-4 rounded-xl"`.
> - פלטת צבעים מותאמת אישית (בהשראת טבע): cream (קרם), sage (מרווה ירוק), sea (ים), sand (חול), coral (אלמוג).
> - **Mobile-first** — מעצבים קודם למסך קטן (טלפון), ואז מוסיפים התאמות למסכים גדולים.
> - **RTL** — כיוון ימין לשמאל מוגדר גלובלית. צריך לשים לב ל-margin/padding שיהיו בכיוון הנכון.
> - יש תיקונים ספציפיים ל-iOS (למשל safe-area-inset — כדי לא להסתיר תוכן מאחורי ה-notch).

---

## Code Conventions | מוסכמות קוד

- **TypeScript strict mode** — no `any` types, no unused variables/parameters
- **camelCase** for functions, hooks, variables
- **PascalCase** for components and type/interface names
- **UPPER_SNAKE_CASE** for constant arrays
- Use `type` keyword for type-only imports
- Memoize expensive computations with `useMemo`
- Keep components focused — extract sub-components when a file exceeds ~200 lines

> **בעברית:**
> - **מצב strict** — TypeScript בודק הכל בקפדנות. אסור להשתמש ב-`any` (טיפוס "כל דבר") ואסור להשאיר משתנים שלא בשימוש.
> - **שמות פונקציות** ב-camelCase: `addHabit`, `getStreakDays`, `useLocalStorage`.
> - **שמות רכיבים וטיפוסים** ב-PascalCase: `HabitList`, `JournalEntry`, `MomentType`.
> - **קבועים** באותיות גדולות עם קו תחתון: `HABIT_CATEGORIES`, `WITHDRAWAL_SYMPTOMS`.
> - **ייבוא טיפוסים** עם `import type { ... }` — זה מוודא שהם נמחקים בבנייה ולא תופסים מקום.
> - **`useMemo`** — כשיש חישוב כבד (למשל ניתוח סטטיסטיקות יומן), עוטפים ב-`useMemo` כדי שלא יחושב מחדש בכל רנדור.
> - **קומפוננטה שגדלה מדי** (מעל 200 שורות) — לפצל לקומפוננטות קטנות יותר.

---

## Key Files to Understand First | קבצים מרכזיים להתחלה

1. `src/types/index.ts` — all data models
2. `src/App.tsx` — app orchestration and routing
3. `src/hooks/useLocalStorage.ts` — foundation for all state
4. `src/Layout.tsx` — navigation structure

> **בעברית:**
> אם אתה רוצה להבין את הפרויקט, תתחיל מהקבצים האלה בסדר הזה:
> 1. **`types/index.ts`** — כל מודלי המידע. תבין מה זה "הרגל", "רשומת יומן", "רפלקציה" וכו'.
> 2. **`App.tsx`** — הרכיב הראשי. תראה איך הכל מחובר — hooks, ניווט, העברת מידע.
> 3. **`useLocalStorage.ts`** — הבסיס של כל ניהול המידע. hook פשוט שכל שאר ה-hooks בנויים עליו.
> 4. **`Layout.tsx`** — מבנה הניווט. תבין איך המשתמש עובר בין דפים.

---

## Important Notes | הערות חשובות

- All user-facing strings are in **Hebrew** — maintain this convention
- The app is a **PWA** with a manifest in `public/` — respect service worker and manifest config
- Base path is `/Wini/` for GitHub Pages — configured in `vite.config.ts`
- No backend — the app is fully client-side with localStorage persistence

> **בעברית:**
> - כל הטקסטים שהמשתמש רואה הם **בעברית** — חובה לשמור על זה בכל תוספת חדשה.
> - האפליקציה היא **PWA** — אפשר להתקין אותה על מסך הבית. יש manifest ב-`public/` — לא לשבור אותו.
> - הנתיב הבסיסי הוא `/Wini/` כי האפליקציה מתארחת ב-GitHub Pages — מוגדר ב-`vite.config.ts`.
> - **אין שרת (backend)** — הכל רץ בדפדפן של המשתמש. כל המידע נשמר ב-localStorage בלבד.

---

## Glossary | מילון מונחים

| מונח | הסבר בעברית |
|------|-------------|
| **Component** | רכיב — חלק ויזואלי באפליקציה (כפתור, טופס, דף שלם) |
| **Hook** | וו — פונקציה שמנהלת state או לוגיקה בתוך רכיב |
| **Props** | פרמטרים שרכיב מקבל מהרכיב שמעליו |
| **State** | מצב — מידע שמשתנה ומשפיע על מה שמוצג על המסך |
| **localStorage** | אחסון מקומי בדפדפן — נשאר גם אחרי סגירה |
| **PWA** | אפליקציית ווב מתקדמת — אפשר להתקין כמו אפליקציה רגילה |
| **RTL** | Right-To-Left — כיוון ימין לשמאל (עברית, ערבית) |
| **Strict Mode** | מצב קפדני — TypeScript לא מרשה קיצורי דרך או טיפוסים עמומים |
| **Callback** | פונקציה שנשלחת כפרמטר ומופעלת מאוחר יותר (למשל: "מה לעשות בלחיצה") |
| **Memoize** | לזכור תוצאה של חישוב כדי לא לחזור עליו מיותר |
| **Union Type** | טיפוס שאומר "אחד מתוך רשימה": `type Page = 'dashboard' | 'habits' | 'journal'` |
| **Interface** | הגדרת "צורה" של אובייקט: אילו שדות יש לו ומאיזה טיפוס |
