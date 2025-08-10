# Markdown Generator

A modern, minimal Markdown editor with real-time preview and utilities. Built with Next.js, React, Tailwind CSS, and Radix UI.

- Live Markdown editing with side-by-side preview
- Multiple documents via tabs
- Quick copy/download actions
- Light/Dark theme with system preference
- Extra tool: HTML → Markdown converter

## Tech stack
- Next.js 15, React 19, TypeScript
- Tailwind CSS, tailwindcss-animate
- Radix UI primitives, lucide-react

## Routes
- `/` — Main Markdown editor (tabs, preview, copy, download, fullscreen)
- `/html-to-md` — Paste HTML and convert to Markdown, then copy the output

## Getting started (localhost)
Prerequisites:
- Node.js 18+ (or 20+ recommended)
- pnpm (recommended). You can also use npm or yarn.

Install dependencies:
```sh
pnpm install
```

Start the dev server:
```sh
pnpm dev
```

Open the app:
- http://localhost:3000

Build for production:
```sh
pnpm build
pnpm start
```

Lint:
```sh
pnpm lint
```

## How to use
- Editor (on `/`):
  - Create a new document with the “New Tab” button.
  - Type on the left; see live preview on the right.
  - Copy Markdown or download as `.md` from the editor pane.
  - Copy plain text (Markdown → text) from the preview pane.
  - Toggle fullscreen preview to focus on output.
- HTML → Markdown (on `/html-to-md`):
  - Paste HTML on the left, click Convert, then copy Markdown from the right.

## Project structure (high level)
- `app/page.tsx` — Thin wrapper around the editor
- `app/(editor)/` — Editor feature (split layout, tabs, panes)
  - `_components/` — `EditorPane`, `PreviewPane`, `Tabs`
  - `EditorApp.tsx` — Feature orchestrator
  - `constants.ts`, `types.ts`
- `app/html-to-md/page.tsx` — HTML → Markdown tool
- `components/` — Reusable UI (buttons, textarea, toast, theme, etc.)
- `lib/convert.ts` — Markdown/Text/HTML utilities
- `app/layout.tsx` — App shell, theme provider, global toaster

More details: see `docs/structure.md`.

## Configuration notes
- Path alias `@/*` is enabled (see `tsconfig.json`).
- Tailwind is configured via `tailwind.config.ts` and `app/globals.css`.
- Theme is provided by `next-themes` in `app/layout.tsx`.

## Troubleshooting
- Port already in use: stop the other process or run with a different port: `PORT=3001 pnpm dev`.
- pnpm missing: install with `npm i -g pnpm` or use `npm install && npm run dev`.
- Type errors after dependency changes: try a clean install (`rm -rf node_modules .next && pnpm install`).

---
Happy writing! ✍️
