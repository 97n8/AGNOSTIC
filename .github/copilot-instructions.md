# Copilot Instructions — LogicCommons

## Project overview

LogicCommons is a React + TypeScript app that provides a GitHub-connected operations dashboard. The canonical app lives in the `APP/` directory.

## Quick start

```bash
cd APP
npm ci          # install dependencies (from lockfile)
npm run dev     # start Vite dev server (http://localhost:5173)
```

## Common commands

All commands run from the `APP/` directory:

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (tsc) + production build (vite) |
| `npm run lint` | ESLint (flat config, ESLint 9+) |
| `npm test` | Run Vitest (42 tests, jsdom environment) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run preview` | Preview production build locally |

### Full CI check (matches GitHub Actions)

```bash
cd APP && npm ci && npm run lint && npx tsc -b --noEmit && npm run build && npm test
```

## Project structure

```
APP/                          ← canonical app (Vite + React + TypeScript)
  src/
    App.tsx                   ← single-file app with 11 inline pages
    App.css                   ← all styles
    App.test.tsx              ← 42 Vitest + Testing Library tests
    github.ts                 ← GitHub API client (Contents, Variables, Environments)
    index.css                 ← base/reset styles
    main.tsx                  ← React entry point
  eslint.config.js            ← ESLint 9+ flat config
  vitest.config.ts            ← Vitest config (globals: true, jsdom)
  package.json
PublicLogic OS Component Library (4)/  ← component library (managed separately)
scripts/vercel-build.mjs      ← Vercel deploy build script
.github/workflows/
  app-build.yml               ← CI: lint, type-check, build, test on every PR
  pages.yml                   ← GitHub Pages deploy
```

## Conventions

- **All app work happens in `APP/`** — don't modify root files unless touching CI or deploy config.
- **Tests live next to source** — use `*.test.tsx` / `*.test.ts` naming.
- **ESLint 9+ flat config** — uses `defineConfig` and `globalIgnores` from `eslint/config`.
- **`eslint-plugin-react-refresh` 0.5+** — named export: `import { reactRefresh } from 'eslint-plugin-react-refresh'`.
- **TypeScript strict mode** — the component library has `noUncheckedIndexedAccess: true`.
- **Toast pattern for errors** — `catch (e) { toast(\`Failed: ${e instanceof Error ? e.message : 'unknown'}\`, 'error') }`.
- **Token guard before writes** — check `gh.hasToken()` before GitHub API write operations.

## Tech stack

- React 19, TypeScript 5.9, Vite 7, Vitest 4
- `@testing-library/react` + `jsdom` for tests
- Node 20 (CI)
- Vercel for deploy, GitHub Actions for CI
