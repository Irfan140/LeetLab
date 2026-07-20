# LeetLab

LeetLab is a mobile-first coding practice app built with Expo, React Native, Supabase, and Expo Router. It lets users sign in, browse algorithm problems, write solutions on their phone, submit code against hidden test cases, and track their progress over time.

## Features

- Supabase OAuth sign-in with GitHub and Google.
- Searchable problem list with difficulty filters and topic tags.
- Problem detail pages with descriptions, examples, constraints, hints, submissions, and locked solutions.
- Mobile code editor with starter code for JavaScript, Python, and Java.
- Server-side submission flow through Expo API routes and CodeBox execution.
- Per-user solved count, submission history, and activity heatmap.
- Supabase schema for problems, submissions, test case results, and solved markers.

## Tech Stack

- Expo SDK 55
- React Native 0.83
- Expo Router
- TypeScript
- Supabase Auth and Postgres
- Zustand
- PrismJS
- CodeBox execution API

## Project Structure

```text
src/app/                 Expo Router routes, tabs, auth flow, and API routes
src/app/api/             Submission and code-run API handlers
src/components/          Code editor and activity heatmap UI
src/hooks/               Auth, insets, and tab bar helpers
src/lib/                 Supabase, auth, judging, problem, and theme logic
supabase/migrations/     Database schema
supabase/seed.sql        Seed data for coding problems
assets/images/           App logo, icons, and visual assets
```

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CODEBOX_TOKEN=your-codebox-token
```

Optional, when a device cannot reach the Expo host:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:8081
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

Run on a target platform:

```bash
npm run android
npm run ios
npm run web
```

Build a preview Android app with EAS:

```bash
npm run build:dev
```

## Supabase Setup

Apply the migrations in `supabase/migrations`, then seed the starter problems with `supabase/seed.sql`. The database stores public problem metadata separately from hidden test cases and reference solutions, while submissions and solved progress are scoped to the authenticated user through RLS policies.

For OAuth redirects, add the app redirect URI from Expo Auth Session plus these patterns in Supabase Authentication URL Configuration:

```text
exp://**
mobleet://**
```

## Notes

Code submission requires `CODEBOX_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` because the judging route reads hidden test cases, runs code through CodeBox, stores test-case results, and marks accepted submissions as solved.
