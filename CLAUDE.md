# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repo implements the LINE公式アカウント向け AI自動応答システム described in [要件定義書.md](要件定義書.md) (requirements: FAQ auto-response, owner escalation notification, mobile-friendly admin screen, broadcast messaging — see that file for full functional/non-functional requirements, architecture, and scope boundaries). The implementation design (directory layout, data model, feature order) is tracked in the approved plan; ask the user before assuming it has changed.

## Stack & commands

- Next.js (TypeScript, App Router, Tailwind CSS) on Vercel, with Neon (PostgreSQL, DB) and the Claude API (FAQ answer generation).
  - Originally planned around Supabase; switched to Neon because the user's Supabase free tier ran out. Same relational schema, different host — see 要件定義書.md revision history.
- `npm install` — install dependencies
- `npm run dev` — start the local dev server
- `npm run build` — production build
- `npm run lint` — lint

## Directory layout

- `src/app/api/line-webhook/` — receives LINE Messaging API webhooks (FR-01, FR-02)
- `src/app/api/broadcast/` — broadcast sending API (FR-04)
- `src/app/admin/` — admin screens: login, dashboard, FAQ management, inquiry history, broadcast (FR-03, FR-04)
- `src/lib/` — `line.ts` (LINE client), `claude.ts` (Claude API calls), `db.ts` (Neon/PostgreSQL client), `auth.ts` (admin login)

## Working conventions

- **Do not test in the browser.** The user tests manually. Never launch a browser tool, take screenshots, or otherwise drive the UI yourself to verify a feature works.
- **Always surface the local URL** after starting or changing anything the user would check in a browser (dev server, new route/page, admin screen change, etc.), so they can open it themselves.
- **Implement one feature at a time.** Do not build multiple features in a single pass. Finish and hand back the current feature (per the FR items in 要件定義書.md, e.g. FR-01, FR-02, ...) before starting the next one, even if the remaining work is obvious.
- **This is also a learning project for a beginner.** Before/while doing each piece of work (creating a file, choosing a library, setting up a service, writing a config), explain in plain terms why it's needed and what role it plays in the overall project — not just what the code does. Favor a short explanation over silently doing the work.

@AGENTS.md
