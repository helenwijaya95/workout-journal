# TrainLog — Smart Workout Journal

A full-stack workout tracking app with AI-powered weekly training analysis. Log your sessions, visualise your consistency, and get personalised coaching insights — no personal trainer needed.

**Live demo:** https://trainlog-ai.vercel.app

---

## What it does

TrainLog helps self-coached fitness people track their training and understand their patterns over time. Log a workout in 30 seconds, then at the end of each week generate an AI debrief that analyses your sessions, flags overtraining, and gives you one concrete suggestion for next week.

Built for people who train consistently but don't have a personal trainer — runners, gym-goers, group fitness regulars.

---

## Tech stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 15 (App Router) |
| Language   | TypeScript              |
| Styling    | Tailwind CSS v4         |
| Database   | Supabase (Postgres)     |
| Auth       | Supabase Auth           |
| AI         | Google Gemini 2.5 Flash |
| Charts     | Recharts                |
| Deployment | Vercel                  |

---

## Features

- Log workouts in 30 seconds — type, duration, intensity, notes, date
- Workout history grouped by week with collapsible sections
- Weekly stats — sessions, total minutes, average intensity, total hours
- Bar chart showing session consistency over the last 8 weeks
- AI weekly debrief — highlights, overtraining flags, and next week suggestion
- Stale debrief detection — prompts regeneration when new workouts are added
- Edit and delete workouts with confirmation
- Row Level Security — users can only access their own data
- PWA — installable on iOS and Android, opens full screen
- Responsive design — mobile first

---

## Architecture decisions

**Supabase RLS over application-level auth checks**
Every table has Row Level Security policies so the database itself enforces data isolation. Even if application code had a bug, users could never access another user's data. Server Actions add an explicit `.eq('user_id', user.id)` filter as a second layer of defence.

**Server Actions over API routes**
Database operations run as Next.js Server Actions — no separate API layer needed. The Gemini API key never reaches the client bundle. `revalidatePath('/dashboard')` invalidates the Next.js cache after mutations so the UI always shows fresh data.

**Two Supabase clients**
`server.ts` uses `createServerClient` with Next.js `cookies()` for Server Components and Server Actions. `client.ts` uses `createBrowserClient` for Client Components. Using the wrong client in the wrong context causes silent auth failures — keeping them separate makes the boundary explicit.

**Gemini retry with exponential backoff**
The AI debrief action retries up to 3 times on recoverable errors (429, model busy, 503) with 1s, 2s, 4s delays. Non-recoverable errors (invalid API key, 404) throw immediately. This handles Gemini's free tier rate limits gracefully without user-visible failures.

**Stale debrief detection**
After generating a debrief, `total_sessions` is stored alongside the AI analysis. On load, the app compares this against the current workout count for that week. If they differ, a warning banner prompts the user to regenerate — preventing stale AI insights without auto-regenerating on every load (which would be expensive).

**Upsert over delete + insert**
Debrief regeneration uses Supabase's `.upsert()` with `onConflict: 'user_id,week_start'` instead of deleting the old row and inserting a new one. This eliminates the race condition where a duplicate key error could occur if the delete hadn't completed before the insert.

---

## Getting started

### Prerequisites

- Node.js 18+
- A Supabase project ([free tier](https://supabase.com))
- A Google Gemini API key ([free at Google AI Studio](https://aistudio.google.com))

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/workout-journal.git
cd workout-journal
npm install
```

### Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Database setup

Run these SQL scripts in your Supabase SQL Editor in order:

1. Create tables (`/sql/schema.sql`)
2. Enable RLS policies (`/sql/rls.sql`)

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout, PWA meta tags
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   ├── auth/actions.ts             # signIn, signUp, signOut Server Actions
│   └── dashboard/
│       ├── page.tsx                # Dashboard — fetches all data server-side
│       ├── actions.ts              # logWorkout, updateWorkout, deleteWorkout
│       ├── actions/
│       │   └── debrief.ts          # generateDebrief, regenerateDebrief
│       └── components/
│           ├── StatsCards.tsx      # Weekly and all-time stats
│           ├── DashboardTabs.tsx   # Log / History / Debrief tab switcher
│           ├── LogWorkoutForm.tsx  # Workout logging form
│           ├── WorkoutHistory.tsx  # Grouped history with edit/delete
│           ├── EditWorkoutModal.tsx# Edit and delete modal
│           ├── DebriefCard.tsx     # AI debrief display and generation
│           └── WorkoutChart.tsx    # Recharts bar chart
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   └── server.ts              # Server Supabase client
│   ├── workout-utils.ts           # groupWorkoutsByWeek, formatters
│   └── workout-config.ts          # Workout types, labels, emojis
├── types/
│   └── database.ts                # TypeScript types matching DB schema
└── components/
    └── ServiceWorkerRegistration.tsx # PWA service worker registration
public/
├── sw.js                          # Service worker — cache strategy
├── manifest.json                  # PWA manifest
└── icons/                         # PWA icons 192x192 and 512x512
```

---

## Key technical challenges

**Prism.js hydration mismatch in Next.js SSR**
`Prism.highlightElement()` mutates the DOM directly, causing React hydration mismatches. Fixed by switching to `Prism.highlight()` which returns an HTML string, then setting `innerHTML` manually via a ref. React controls the DOM; Prism only generates the string.

**Supabase middleware on Vercel**
The original middleware used `getUser()` which makes a network request on every request — too slow and sometimes timing out on Vercel's edge network. Switched to `getSession()` which reads the session from the cookie directly without a network call.

**Service worker type definitions**
TypeScript defaults `self` to `Window & typeof globalThis` in mixed environments. Added `/// <reference lib="webworker" />` and cast `self as unknown as ServiceWorkerGlobalScope` to get correct type definitions for service worker APIs.

---

## Roadmap

- [ ] Onboarding flow — fitness goal and weekly target after signup
- [ ] Loading skeletons on dashboard
- [ ] Edit/delete confirmation with undo instead of modal
- [ ] Intensity trends line chart alongside session count
- [ ] PWA offline page with cached last-known data
- [ ] Export workout history as CSV

---

## License

MIT
