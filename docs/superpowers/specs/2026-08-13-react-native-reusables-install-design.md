# React Native Reusables install — design

**Date:** 2026-08-13  
**Status:** Approved  
**App:** Tripora (Expo 57 + Expo Router + NativeWind v4)

## Goal

Wire [React Native Reusables](https://reactnativereusables.com/docs/installation) into the existing Tripora project and verify with a Button/Text smoke test on the home screen.

## Approach

**Manual foundation + CLI `add`** — do not run `init` (would scaffold a new app). Configure theme, utils, PortalHost, and `components.json` by hand, then:

```bash
npx @react-native-reusables/cli@latest add button
```

## Layout & paths

Keep existing `@/*` → `./src/*` alias.

| Piece | Path |
| --- | --- |
| UI components | `src/components/ui/` |
| `cn` helper | `src/lib/utils.ts` |
| Theme tokens (JS) | `src/lib/theme.ts` |
| CLI config | `components.json` (repo root) |
| CSS variables | `global.css` |
| Tailwind theme map | `tailwind.config.js` |
| Portal + ThemeProvider | `src/app/_layout.tsx` |

## Dependencies

```bash
npx expo install tailwindcss-animate class-variance-authority clsx tailwind-merge @rn-primitives/portal
```

Button CLI add may pull additional `@rn-primitives/*` packages.

## Theme wiring

1. Expand `global.css` with shadcn CSS variables under `:root` and `.dark:root` (NativeWind dark selector).
2. Extend `tailwind.config.js`: `darkMode: 'class'`, semantic colors mapped to `hsl(var(--…))`, `tailwindcss-animate` plugin, content remains `./src/**/*.{js,jsx,ts,tsx}`.
3. Add `src/lib/theme.ts` with `THEME` + `NAV_THEME` mirroring CSS vars for React Navigation.
4. Add `src/lib/utils.ts` with `cn` (`clsx` + `tailwind-merge`).
5. Add root `components.json` (new-york style, aliases to `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`).
6. Set `inlineRem: 16` on `withNativeWind` in `metro.config.js`.

## Root layout

- Keep `import "../../global.css"`.
- Wrap app in React Navigation `ThemeProvider` with `NAV_THEME[colorScheme]`.
- Render `<PortalHost />` as the last child (required for overlays later).
- Preserve existing `<Stack />`.

## Smoke test

- CLI add `button` (brings `Text` as needed).
- Update `src/app/index.tsx` to render a primary `Button` wrapping RNR `Text`.
- Restart Metro with `--clear` so NativeWind picks up new theme classes.

## Out of scope

- Custom Tripora brand palette
- Dark-mode toggle UI
- Extra components beyond Button/Text
- Replacing existing `src/components/*` themed helpers

## Success criteria

1. `npx @react-native-reusables/cli@latest doctor` reports a healthy setup (or only expected warnings).
2. Home screen shows a styled RNR Button (not unstyled black text).
3. Future `cli add <component>` works without further foundation work.
