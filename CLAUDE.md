# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm** (pnpm-lock.yaml present, pnpm-workspace.yaml configured).

- `pnpm dev` — start the React Router dev server with HMR (default http://localhost:5173)
- `pnpm build` — produce `build/client` (static assets) and `build/server` (SSR bundle)
- `pnpm start` — run the production server against the built output
- `pnpm typecheck` — runs `react-router typegen` first to regenerate `./.react-router/types` (route param/loader types live there), then `tsc`. Run this after editing `app/routes.ts` or any route's exported types.

No test runner or linter is configured. Don't invent commands — `tsc` via `pnpm typecheck` is the only correctness gate.

## What this app is

「爱开发」 — the **client-facing** app of a three-app freelance dev platform (alongside a programmer app and an admin backend, not in this repo). The product flow encoded in the UI:

1. Client describes a fuzzy idea to an AI (`/dashboard/chats` → `/dashboard/chats/:id`) which produces a project spec, estimated price, and duration.
2. Once confirmed, a human CS agent takes over and the spec turns into a project group (`/dashboard/messages/:id`).
3. The group is where the client, CS, and (eventually) the developer coordinate. Progress reports, image uploads, and milestone reviews all live as message types in the chat.

See `project.md` for the full business narrative — it's the source of truth for *why* the UI is shaped the way it is. `DESIGN.md` is an Apple-design analysis document, not the design system actually used by this app; do not treat it as a styling spec.

## Architecture

### Stack

- React Router v7 in **framework mode with SSR enabled** (`react-router.config.ts: ssr: true`). Routes are declared statically in `app/routes.ts`; `react-router typegen` writes per-route `+types/*.ts` files that route modules import (e.g. `import type { Route } from "./+types/home"`).
- React 19 + Vite 8. Path alias `~/*` → `app/*` (configured in `tsconfig.json` and resolved via `vite-tsconfig-paths`).
- Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — config lives in `app/app.css`).
- shadcn-style components in `app/components/ui` (radix-nova style, see `components.json`). When adding shadcn primitives, they go here. Use the `cn` helper from `~/lib/utils`.
- Animation: `motion` (Framer Motion successor) for component-level animation; `gsap` for the timeline-heavy intro animations (logo path draws, chat handoff transitions).
- Icons: `lucide-react`.

### Route structure

```
/                        routes/home.tsx               (marketing landing)
/login, /signup
/dashboard               layout: routes/dashboard/layout.tsx
  index                  routes/dashboard/home.tsx     (仪表盘)
  /chats                 routes/dashboard/chat.tsx     (AI input entry page)
    /:id                 routes/dashboard/chat/id.tsx  (one AI conversation + spec)
  /messages              routes/dashboard/messages.tsx (group list empty-state)
    /:id                 routes/dashboard/message/id.tsx (project group chat)
  /me                    routes/dashboard/me.tsx
```

### Dashboard layout — the non-obvious bit

`/dashboard/*` uses a **two-pane desktop layout that collapses to a phone-style stack on mobile**, and the same content powers both. The shared abstractions:

- **`SidebarNavContext`** (`app/components/page-kits/dashboard/sidebar-nav-context.tsx`) — single source of truth for which top-level section is active. `navItems` lists the 4 sections; each has a `collapseSecond` flag. Sections with `collapseSecond: false` (chats, messages) have a *second panel* (chat history list / group list); sections with `collapseSecond: true` (dashboard, me) don't. `activeItem` is derived from `useLocation()` — URL is authoritative, never set imperatively.
- **`SecondPanelContent`** (`second-panel-content.tsx`) — the second-panel JSX. Used in **three places**: the desktop second sidebar, the mobile left-side Sheet, and as the full-screen content of `/dashboard/messages` root on mobile. Accepts `onItemSelect` for the Sheet to auto-close after navigation.
- **`useIsMobile`** (`app/hooks/use-mobile.ts`) — breakpoint at 768px. Returns `false` during SSR; components that branch on it should expect a hydration tick.

The mobile rules implemented in `routes/dashboard/layout.tsx`:

- Bottom nav (`MobileBottomNav`) replaces the icon sidebar. **Hidden on detail pages** (`/:id`) — those get a back arrow in the header instead.
- Header gets a `PanelLeft` trigger that opens a left Sheet (`MobileSecondPanelSheet`) on any second-panel route except `/dashboard/messages` root (which renders the second panel full-screen).
- The content scroll container explicitly sets `bottom: calc(4rem + env(safe-area-inset-bottom))` when the bottom nav is shown so the fixed nav can't cover content (do not use `padding-bottom` on the outer wrapper — that interacts badly with `absolute inset-0` children).
- Routes that need to fill the visible content area use `min-h-full`, **not** `min-h-[calc(100dvh-4rem)]` (the latter doesn't know about the bottom nav).

### Conventions worth following

- Page composition pattern: routes import from `~/components/page-kits/<page>` for page-specific UI; the route file stays small. Heavy data tables (chat lists, group lists, message arrays) live in `data.ts` files next to their consumers.
- `"use client"` directives are present on components that use browser-only APIs (refs, window). The SSR runtime tolerates them; leave them where they exist.
- The `chats` and `messages` features each export an `index.ts` barrel — import composed components (`ChatRoom`, `getGroupById`) from the directory, not the individual files, when consuming from outside the feature.
- Path-aliased imports always — `~/components/...`, never relative paths that cross feature boundaries.
