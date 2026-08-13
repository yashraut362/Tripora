# Hello World Cleanup Design

**Date:** 2026-08-13  
**Status:** Approved for planning after user review

## Goal

Strip the Expo starter scaffold down to a minimal, runnable Hello World app while keeping Expo Router and project configuration intact.

## Success criteria

- App starts with `npx expo start` and shows centered "Hello World" text.
- No starter demo screens, tabs, themed helpers, or unused source folders remain.
- Expo config (`app.json`, `package.json`, `tsconfig.json`) still supports a runnable project.
- Required asset paths referenced by `app.json` remain (icons/splash) so builds do not break.

## Architecture

Keep Expo Router file-based routing under `src/app/`.

| Keep | Role |
|------|------|
| `src/app/_layout.tsx` | Root layout: `Slot` (or equivalent) only |
| `src/app/index.tsx` | Single screen: centered "Hello World" |

No other routes. No custom components, hooks, constants, or global CSS for this milestone.

## Removals

Delete starter application code and tooling that is unused after the Hello World reduction:

- `src/app/explore.tsx`
- Entire `src/components/` (including `ui/`)
- Entire `src/hooks/`
- Entire `src/constants/`
- `src/global.css` (if present and unused)
- `scripts/reset-project.js` and the `reset-project` npm script

Do **not** delete Expo project scaffolding: `app.json`, `package.json`, `tsconfig.json`, `AGENTS.md`, `CLAUDE.md`, `.gitignore`, `.vscode/`, `LICENSE`, `README.md`, or asset files still referenced by `app.json`.

## Dependencies

Trim `package.json` dependencies that become unused after removing starter UI (examples: `@expo/ui`, `expo-glass-effect`, `expo-image`, `expo-symbols`, `expo-web-browser`, and similar demo-only packages), while retaining packages required by Expo Router and a basic RN screen (`expo`, `expo-router`, `react`, `react-native`, safe-area/screens/gesture/reanimated as required by the current Expo 57 template runtime).

Exact keep/remove list is finalized during implementation against import graph and Expo 57 docs—not by guessing from memory alone.

## UI

- One screen, default system background.
- Centered `Text` with content `Hello World`.
- No themes, splash overlays, tabs, or branding beyond the existing Expo icon/splash assets already in `app.json`.

## Out of scope

- Redesigning brand assets or `app.json` marketing metadata.
- Adding navigation, state, or product features.
- Switching away from Expo Router to a single `App.tsx`.

## Verification

1. Typecheck / start the app without missing-module errors.
2. Confirm only `_layout.tsx` and `index.tsx` exist under `src/app/`.
3. Confirm deleted folders are gone and the home screen renders "Hello World".
