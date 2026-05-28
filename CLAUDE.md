# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server on port 3000
npm run build    # Production build → dist/
npm run preview  # Preview the production build
```

There is no lint, test, or typecheck setup. The project is plain JavaScript (JSX), not TypeScript.

### Environment notes

- `package.json` has `"type": "module"`. Any standalone Node scripts at the repo root **must use `.cjs`** if they use `require()` (see `lessons-31-60.cjs` and `lessons-61-90.cjs` for the pattern).
- The user runs Node from a non-PATH install at `/tmp/node-v20.18.1-darwin-arm64/bin/node`. Use that full path when invoking Node scripts from bash.
- Deploy is GitHub → Vercel auto-deploy on push to `main`. `vercel.json` rewrites all routes to `index.html` — required for React Router direct-URL navigation. Touching that file can break deep links.

## Architecture

**NourishMind** is a mobile-first, frontend-only PWA. **There is no backend.** Every piece of user data lives in `localStorage` and is never sent anywhere.

### The state pattern (most important thing to understand)

Every domain (profile, food log, biometrics, lessons, streaks, journey, points, weight log, milestones-seen) follows the same pattern:

1. A single storage key constant in `src/utils/storageKeys.js` (`KEYS.X`) — all keys are `nm_*` prefixed.
2. A custom hook in `src/hooks/` that wraps `useLocalStorage(KEYS.X, defaultShape)` and exposes domain operations (`addFood`, `completeLesson`, `updateDay`, etc.).
3. Pages call the hook directly. No global store, no context provider, no reducer. The `useLocalStorage` hook in `src/hooks/useLocalStorage.js` syncs to `localStorage` on every `setValue` call.

When adding a new domain, follow this pattern exactly — don't introduce Redux, Zustand, or Context for it.

### Routing and the onboarding gate

`src/App.jsx` reads `KEYS.ONBOARDED`. If false, **every** route renders `OnboardingPage` (no AppShell, no nav). Once true, all routes render inside `AppShell` (which provides the bottom tab nav). This is a hard gate — pages assume `profile` exists by the time they render.

Routes: `/` (Dashboard), `/log`, `/explore`, `/lessons`, `/lessons/:day`, `/track`, `/progress`.

### Lessons: gated progression + milestone celebrations

- `src/data/lessonData.js` is a flat array of all 90 lesson objects (`{ id, day, title, scripture, prayer, content, quiz, challenge, theme }`). Lessons 31–60 and 61–90 were appended via the root-level `.cjs` scripts; the file is too large to read in full in one go.
- Day N is locked until Day N-1's quiz is submitted (see `useLessons.isUnlocked` — checks `completedLessons.includes(day - 1)`).
- **Milestones** at Days 21, 31, 45, 60, 75, 90 (configured in `src/data/milestones.js`) trigger `MilestoneCelebration` — a full-screen modal with CSS confetti, themed gradient, badge, headline, message, scripture. Seen milestones are stored in `KEYS.MILESTONES_SEEN` (`number[]`) so they fire once per day; revisiting a previously-completed milestone the user never saw (e.g. completed before the feature existed) will still trigger it once.
- When extending `lessonData.js` via scripts, use the existing pattern: find `src.lastIndexOf('  },\n]')` and inject the new entries before the closing `]`.

### Food system: traffic light + personalized range

- `src/data/foodDatabase.js` holds ~280 foods, each tagged green/yellow/orange (`src/utils/trafficLight.js` defines the categories: ~1–3 / 3–5 / 5+ cal per gram).
- The app never sets a single calorie *target*. `src/utils/calorieCalc.js` computes a **calorie range** (`calorieMin`/`calorieMax`) from Mifflin-St Jeor BMR × activity multiplier, then adjusted by goal (lose: −500 to −300; maintain: ±100; gain: +200 to +400). The dashboard's "in range" stat depends on this — preserve the min/max shape if you touch the profile schema.
- `useProfile` stores `bmi`, `goalWeightLbs`, and `goal` (`lose` | `maintain` | `gain`). Goal-specific UI (goal weight input on weight-loss path, Strength Tracker on muscle-building path) checks `profile.goal` directly.

### Brand and typography

`tailwind.config.js` defines:
- `font-brand` (Cinzel) — apply to **all `h1` page headers** (the `PageHeader` component already does this).
- `font-display` (Playfair Display) — apply to **scripture quotes** and similar italic display text.
- `font-sans` (Inter) — default body.
- `brand.*` colors: `primary` `#4B2E83`, `secondary` `#A88FCF`, `gold` `#D4AF37`, `sage` `#5E6B5A`, `mist` `#E8EFE9`, `pale` `#f3eeff`.
- `traffic.green/yellow/orange` for the food system.

Fonts are loaded via Google Fonts `<link>` in `index.html`.

### Mobile UX expectations

- 44px minimum touch targets, sticky headers with `bg-white/95 backdrop-blur`, bottom sheets for forms (see `src/components/ui/BottomSheet.jsx`), 5-tab fixed bottom nav.
- The `pb-8`/`pb-4` on page roots is intentional — leaves room above the bottom nav. Don't strip it.

### What lives where

- `src/pages/` — one file per route, owns layout for that screen.
- `src/components/{layout,ui,onboarding,dashboard,foodlog,foodexplorer,lessons,biometrics,progress,celebration}/` — feature-scoped components.
- `src/hooks/` — one hook per domain (see state pattern above).
- `src/utils/` — pure functions only (date helpers, calorie math, storage keys, traffic-light config).
- `src/data/` — static content (food database, lessons, milestones).
