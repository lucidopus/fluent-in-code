# fluent-in-code

Personal DSA mastery tracker. Blind 75 → NeetCode 150 → beyond. FSRS spaced repetition. Pattern-first navigation. Built so re-opening a problem six weeks later makes the pattern, the insight, and the code click immediately.

This is a tracker, not a problem-solving platform. Solve on LeetCode/NeetCode; capture the interview-shape walkthrough here.

## Stack

- Next.js 15 (App Router, RSC by default)
- MongoDB Atlas
- Tailwind v4 + shadcn/ui
- iron-session single-password auth
- FSRS-4.5 (vendored, on-write recalc)
- Monaco editor (lazy-loaded)
- Vercel hosting

## Setup

### 1. Provision MongoDB

Create an Atlas cluster (free M0 is plenty for personal use) and grab the connection string.

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Generate a session secret:

```bash
openssl rand -base64 48
```

Generate a password hash (bcrypt, 12 rounds):

```bash
npm run hash
# Enter your password when prompted, copy the output into APP_PASSWORD_HASH
```

Fill in `.env.local`:

```
MONGODB_URI=mongodb+srv://...
APP_PASSWORD_HASH=\$2b\$12\$...   # NOTE: every $ must be escaped as \$
SESSION_SECRET=<48 random chars>
NEXT_PUBLIC_TIMEZONE=America/New_York
```

**Escape every `$` in `APP_PASSWORD_HASH` as `\$`.** Next.js's `@next/env` runs `dotenv-expand` over your env values, which interprets `$VAR` as variable references. Bcrypt hashes contain three `$` characters; without escaping, those segments get eaten and bcrypt receives a mangled value. Quoting (single or double) does NOT prevent expansion in this version of dotenv-expand — only `\$` works.

If you see "Server misconfigured: APP_PASSWORD_HASH appears mangled" on login, this is what happened.

### 3. Install + seed

```bash
npm install
npm run seed
```

Seeds Blind 75 + NeetCode 150 (NC150 is a superset; Blind 75 problems are tagged with both lists). Idempotent — safe to re-run; never touches your `attempts` or `fsrs` state.

### 4. Run

```bash
npm run dev
```

Visit `http://localhost:3000`. Log in with your password.

## Daily ritual

1. Home page shows **Due today** (FSRS scheduler) and a 365-day heatmap.
2. Click a problem → detail page → **Deep log** to capture the full interview shape:
   - Restate the problem
   - Brute force + complexity (or mark "N/A — direct construction")
   - Optimal + complexity + the insight that unlocked it
   - Code (Monaco editor)
   - Self-score 1–10 → drives FSRS scheduling
   - Optional: duration, where you stalled, think-out-loud transcript
3. Record a YouTube explainer, paste the URL on the detail page. Teaching it locks it in.
4. As stability grows, click **Mark as mastered** to retire from the queue.

Quick Log is for re-solves you don't need to re-document — score 1–10, status auto-bumps, FSRS recalculates.

## Scripts

- `npm run dev` — local dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run seed` — upsert Blind 75 + NeetCode 150 (idempotent)
- `npm run export` — dump entire DB to `backups/<timestamp>.json`
- `npm run hash` — bcrypt-hash a password for `APP_PASSWORD_HASH`

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo into Vercel.
3. Set the same env vars in Vercel project settings (`MONGODB_URI`, `APP_PASSWORD_HASH`, `SESSION_SECRET`, `NEXT_PUBLIC_TIMEZONE`).
4. **Pin the region.** Vercel project region should match your Atlas cluster region (e.g., both us-east-1) — DSA-tracker latency is 95% Mongo round-trips.
5. After first deploy, run `npm run seed` against the production `MONGODB_URI` from your local machine (the script reads `.env.local`).

## Architecture quick-ref

- `app/` — App Router pages. Server components by default; client islands marked `"use client"`.
- `app/login/` — public, single-password form.
- `app/problems/[lcNumber]/` — detail page + Deep Log form + server actions.
- `lib/mongo.ts` — Mongo client singleton, ensures indices on first call.
- `lib/session.ts` — iron-session config + `getSession()`/`requireAuth()` helpers.
- `lib/fsrs.ts` — FSRS-4.5 scheduler, vendored.
- `lib/queries/` — all reads. Indexes hygiene lives here.
- `lib/schemas/` — zod schemas for forms + DB doc types.
- `lib/data/{blind75,neetcode150}.ts` — curated lists, seed source.
- `lib/patterns.ts` — Pattern enum + display metadata. Edit here to rename/add patterns.
- `middleware.ts` — auth gate (cookie presence check).
- `components/ui/` — shadcn primitives.
- `components/` — app-specific components.

## Data model summary

**`problems`**: one doc per LC problem. Holds metadata, list memberships, FSRS state, videos array, denormalized `latest` (most-recent Deep Log), manual status, optional diagram URL + notes.

**`attempts`**: append-only history. Re-solves are first-class entries. Each carries the full interview shape (when Deep Log) plus self-score and FSRS rating snapshot.

`saveAttempt` writes both inside a Mongo transaction (Atlas gives you a replica set by default, no extra setup).

## What's not in v1 (yet)

- Speed Drill mode (timed re-code from blank editor against a problem prompt)
- Mock Interview button (random Due problem)
- Multi-select filters (Pattern × Status × Difficulty × Due)
- Export beyond JSON (CSV, Markdown notebooks, etc.)

These ship in v1.1 once the logging loop has real data.

## What this app does NOT do

- No LLMs, no AI, no external model calls. Pure CRUD tracker.
- No code execution. You solve on LeetCode; this stores the result.
- No automated transcription. Paste manually if you want a transcript.

## Security notes

- Single-password auth, bcrypt-12 hash, iron-session HTTP-only cookie. The bcrypt cost (~250ms per check) is the primary brute-force defense; in-memory rate limiting is a UX nicety, not a hardened control. On Vercel, the in-memory bucket resets on cold start and is per-instance. For one user this is fine; pick a strong password (>16 random characters) and don't reuse it.
- Middleware does cookie-presence redirect only. Real session verification happens inside server actions and pages via `requireAuth()`. The cookie is signed with `SESSION_SECRET`, so presence implies authenticity.
