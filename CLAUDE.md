# CLAUDE.md — Wini

## Project Overview

Wini is a Hebrew-language mobile-first PWA for quitting harmful habits and building positive ones. It provides habit tracking, journaling, SOS crisis support (breathing exercises, craving timers), dopamine activity management, milestone celebrations, and emotional self-reflection tools.

The entire UI is in **Hebrew** with **RTL layout**. All user-facing text must be written in Hebrew.

## Tech Stack

- **Framework**: React 19 + TypeScript 5.9 (strict mode)
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 (with Vite plugin, custom theme in `src/index.css`)
- **Animations**: Framer Motion
- **Icons**: lucide-react
- **Dates**: date-fns
- **State**: localStorage via custom hooks (no Redux/Context)
- **Deployment**: GitHub Pages (base path `/Wini/`)

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Type-check (tsc -b) then build with Vite
npm run lint       # ESLint (flat config, TS + React rules)
npm run preview    # Preview production build
```

There is no test framework configured. No CI/CD pipelines exist.

## Project Structure

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

## Architecture & Patterns

### State Management
- All persistent state lives in **localStorage**, accessed through custom hooks wrapping `useLocalStorage`.
- `App.tsx` orchestrates all hooks and passes data/callbacks as props to page components.
- Each feature area (habits, journal, dopamine, inner space) has an isolated hook managing its own state.
- No global state management library — keep it this way.

### Data Flow
1. `App.tsx` calls all custom hooks
2. Hooks read/write localStorage and expose state + update functions
3. Components receive data as props and call update callbacks
4. Changes auto-persist to localStorage

### Component Conventions
- Functional components only, no class components
- PascalCase filenames matching component names
- Props interfaces defined per-component (or inline)
- All shared types in `src/types/index.ts`
- Framer Motion `AnimatePresence` for page transitions

### Routing
- Simple state-based routing in `App.tsx` (no react-router)
- 7 pages: `dashboard`, `habits`, `journal`, `sos`, `milestones`, `inner-space`, `settings`
- Page type defined as union type in `types/index.ts`

## Styling Conventions

- **Tailwind CSS v4** utility classes directly in JSX — no CSS modules or styled-components
- Custom color palette defined in `src/index.css` via `@theme`: cream, sage, sea, sand, coral
- **Mobile-first**: design for small screens, use responsive classes for larger
- **RTL**: `direction: rtl` is set globally; use logical properties where applicable
- iOS-specific fixes in `index.css` for safe-area-inset and overflow scrolling

## Code Conventions

- **TypeScript strict mode** — no `any` types, no unused variables/parameters
- **camelCase** for functions, hooks, variables
- **PascalCase** for components and type/interface names
- **UPPER_SNAKE_CASE** for constant arrays
- Use `type` keyword for type-only imports
- Memoize expensive computations with `useMemo`
- Keep components focused — extract sub-components when a file exceeds ~200 lines

## Key Files to Understand First

1. `src/types/index.ts` — all data models
2. `src/App.tsx` — app orchestration and routing
3. `src/hooks/useLocalStorage.ts` — foundation for all state
4. `src/Layout.tsx` — navigation structure

## Important Notes

- All user-facing strings are in **Hebrew** — maintain this convention
- The app is a **PWA** with a manifest in `public/` — respect service worker and manifest config
- Base path is `/Wini/` for GitHub Pages — configured in `vite.config.ts`
- No backend — the app is fully client-side with localStorage persistence
