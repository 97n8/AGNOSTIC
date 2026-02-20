## LogicCommons

This repo contains two Vite + React projects:

- `./` — a lightweight React sandbox app (Vite + TypeScript)
- `PublicLogic OS Component Library (4)/` — the exported PublicLogic OS component bundle

### View it locally

#### App (root)

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173/`).

#### Component library bundle

```bash
cd "PublicLogic OS Component Library (4)"
npm install
npm run dev
```

Open `http://localhost:3000/` (the bundle’s `vite.config.ts` uses port 3000).

### Publish it (GitHub Pages)

This repo includes a GitHub Actions workflow that deploys the component bundle to GitHub Pages on every push to `main`:

- Workflow: `.github/workflows/pages.yml`
- Public URL (default): `https://97n8.github.io/LogicCommons/`

First time only: in GitHub repo settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

### Quality checks

From the repo root:

```bash
npm run verify
```

This runs root lint + builds for both projects.
