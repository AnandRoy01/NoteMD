# Project structure

This project uses a feature-first layout for the editor with small, focused components.

- `app/(editor)/EditorApp.tsx`: Main editor experience (tabs, layout split, footer)
- `app/(editor)/_components/EditorPane.tsx`: Markdown input editor with actions
- `app/(editor)/_components/PreviewPane.tsx`: Markdown preview with actions
- `app/(editor)/_components/Tabs.tsx`: Tabs bar UI
- `app/(editor)/constants.ts`: Initial markdown content
- `app/(editor)/types.ts`: Shared types for the editor feature
- `app/page.tsx`: Thin route-level wrapper that renders the editor app
- `app/layout.tsx`: App shell, theme provider, site header, and global toaster

Why this structure

- Separation of concerns: editing, previewing, and tab management are isolated.
- Reusability: actions/components can be reused in other routes.
- Testability: each piece can be unit-tested in isolation.
- Maintainability: page is a thin wrapper; feature logic lives under `(editor)`.

Notes

- The global `Toaster` moved from `app/page.tsx` to `app/layout.tsx`.
- `initialMarkdown` is centralized in `app/(editor)/constants.ts`.
