import { useState } from 'react'
import type { RepoCtx } from '../github'

type EmbedMode = 'iframe' | 'component' | 'standalone'

function buildPrompt(ctx: RepoCtx, tabLabel: string, mode: EmbedMode): string {
    const repo = `${ctx.owner}/${ctx.repo}`
    const appUrl = `https://${ctx.owner}.github.io/${ctx.repo}`

    const shared = `\
## Overview
LogicCommons is a GitHub-connected operations dashboard built with React 19, TypeScript 5.9, and Vite 7.
It exposes a single \`<App />\` component that manages its own auth (GitHub PAT stored in localStorage under
the key \`lc_gh_token\`), repo selection, and all page routing internally.

Current repo context: ${repo}

## Tech stack
- React 19  ·  TypeScript 5.9 (strict, noUncheckedIndexedAccess)
- Vite 7 dev server / production build
- Vitest 4 + @testing-library/react for tests
- CSS custom properties (--color-*, --space-*, --transition-fast, --font-mono tokens)
- GitHub REST API v3 — all calls go through \`api<T>(url, init?)\` in \`github.ts\`
  · Auth: \`Authorization: Bearer <token>\` from \`localStorage.getItem('lc_gh_token')\`
  · Error format: \`throw new Error(\`GitHub \${status}: \${body.slice(0,200)}\`)\`

## App structure
\`\`\`
APP/
  src/
    App.tsx          — slim 136-line routing/state shell
    helpers.ts       — NAV_PAGES, NAV_GROUPS, NAV_ICONS, utility fns
    hooks.ts         — useToasts(), useLiveData(ctx)
    github.ts        — all GitHub API calls + types
    index.css        — design tokens, reset, layout grid
    App.css          — component styles
    pages/           — 19 page components (one file each)
    components/      — shared: SignInPage, RepoPicker, CreateModal, CommandPalette, shared.tsx
\`\`\`

## Auth flow
1. If \`localStorage.getItem('lc_gh_token')\` is falsy → show \`<SignInPage />\`
2. After GitHub sign-in → show \`<RepoPicker />\` to pick owner/repo (sets \`RepoCtx\`)
3. Main shell renders: sidebar nav + topbar + page content

## CSS layout
\`\`\`css
.os-root    { display: grid; grid-template-columns: 220px 1fr; grid-template-rows: 48px 1fr; height: 100vh; }
.os-sidebar { grid-row: 1 / -1; }
.os-topbar  { grid-column: 2; }
.os-main    { grid-column: 2; overflow-y: auto; }
\`\`\`

## Navigation
NAV_GROUPS organises 19 pages into labeled sections:
  Overview: Dashboard, Today
  Work: Issues, PRs, Lists, Cases
  Infrastructure: CI, Pipeline, Branches, Files, Vault, Environments
  Governance: Labels, Registry, Projects, Playbooks, Tools, Prompt
  (unlabeled): Settings

Each page is a standalone React component in \`src/pages/\`.
`

    if (mode === 'iframe') {
        return `\
# Prompt — Add LogicCommons as a tab (iframe embed)

You are integrating LogicCommons as a tab called "${tabLabel}" inside an existing web-based tool suite.
Use an \`<iframe>\` to embed the deployed LogicCommons app.

${shared}

## Deployment URL
Deploy LogicCommons to a static host (Vercel / GitHub Pages / Netlify) and note its URL.
Example: ${appUrl}

## What to build

Add a new tab entry to your tool suite's tab bar:

\`\`\`tsx
{ id: 'logiccommons', label: '${tabLabel}', icon: '▦' }
\`\`\`

When that tab is active, render:

\`\`\`tsx
<iframe
  src="${appUrl}"
  title="${tabLabel}"
  style={{ width: '100%', height: '100%', border: 'none' }}
  allow="clipboard-write"
/>
\`\`\`

### Optional: pre-seed the token
If your tool suite already holds a GitHub token you can inject it into the iframe's localStorage
via \`postMessage\` after the frame loads:

\`\`\`ts
iframeRef.current?.contentWindow?.postMessage(
  { type: 'LC_SET_TOKEN', token: myGitHubToken },
  '${appUrl}'
)
\`\`\`

Then in LogicCommons \`main.tsx\` listen for the message:
\`\`\`ts
window.addEventListener('message', (e) => {
  if (e.data?.type === 'LC_SET_TOKEN') localStorage.setItem('lc_gh_token', e.data.token)
})
\`\`\`

## Checklist
- [ ] Deploy LogicCommons (npm run build → dist/ → static host)
- [ ] Add tab entry to host app's tab bar
- [ ] Render iframe when tab is active
- [ ] (Optional) forward GitHub token via postMessage
- [ ] Test: tab shows LogicCommons, auth works end-to-end
`
    }

    if (mode === 'component') {
        return `\
# Prompt — Add LogicCommons as a tab (React component embed)

You are integrating LogicCommons as a tab called "${tabLabel}" inside an existing React tool suite
by importing the \`<App />\` component directly (monorepo or published package).

${shared}

## What to build

### 1. Install / link LogicCommons
In a monorepo, add it as a workspace dependency:
\`\`\`json
// your-suite/package.json
{ "dependencies": { "logiccommons": "workspace:../LogicCommons/APP" } }
\`\`\`

Or publish LogicCommons to a private registry and install normally.

### 2. Add the tab entry
\`\`\`tsx
{ id: 'logiccommons', label: '${tabLabel}', icon: '▦' }
\`\`\`

### 3. Render inside your tab panel
\`\`\`tsx
import LogicCommons from 'logiccommons'

// Inside your tab panel (make sure this element fills the available height):
{activeTab === 'logiccommons' && (
  <div style={{ height: '100%', overflow: 'hidden' }}>
    <LogicCommons />
  </div>
)}
\`\`\`

### 4. CSS isolation
LogicCommons uses global CSS custom properties. Wrap it in a Shadow DOM or CSS layer to avoid
collisions with your suite's styles:
\`\`\`css
@layer logiccommons { /* import LC styles here */ }
\`\`\`

### 5. Shared auth (optional)
If your suite manages a GitHub token, set it before mounting:
\`\`\`ts
localStorage.setItem('lc_gh_token', suiteGitHubToken)
\`\`\`

## Checklist
- [ ] Link / install LogicCommons package
- [ ] Add tab entry to host suite's tab bar
- [ ] Mount \`<LogicCommons />\` when tab is active, inside a height-constrained div
- [ ] Resolve any CSS token conflicts (layer or shadow DOM)
- [ ] (Optional) forward GitHub token via localStorage before mount
- [ ] Run full build + tests for both packages: \`npm run build && npm test\`
`
    }

    // standalone
    return `\
# Prompt — Add LogicCommons as a standalone tab (new app shell)

You are building a new tool suite from scratch that includes LogicCommons as one of its tabs
(tab label: "${tabLabel}"). The suite will be a React + TypeScript app using the same stack.

${shared}

## What to build

### App shell structure
\`\`\`
suite/
  src/
    SuiteApp.tsx     — top-level shell with tab bar + tab panels
    tabs/
      LogicCommonsTab.tsx  — thin wrapper around LogicCommons <App />
      OtherTab.tsx         — your other tabs
\`\`\`

### SuiteApp.tsx (scaffold)
\`\`\`tsx
import { useState } from 'react'
import LogicCommonsTab from './tabs/LogicCommonsTab'
// import other tabs…

const TABS = [
  { id: 'logiccommons', label: '${tabLabel}', icon: '▦' },
  // add more tabs here
] as const
type TabId = (typeof TABS)[number]['id']

export default function SuiteApp() {
  const [active, setActive] = useState<TabId>('logiccommons')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <nav style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{ fontWeight: active === t.id ? 700 : 400 }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {active === 'logiccommons' && <LogicCommonsTab />}
      </div>
    </div>
  )
}
\`\`\`

### LogicCommonsTab.tsx
\`\`\`tsx
import LogicCommons from '../../../LogicCommons/APP/src/App'
import '../../../LogicCommons/APP/src/index.css'
import '../../../LogicCommons/APP/src/App.css'

export default function LogicCommonsTab() {
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <LogicCommons />
    </div>
  )
}
\`\`\`

### vite.config.ts for the suite
\`\`\`ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@lc': '../LogicCommons/APP/src' } },
})
\`\`\`

### package.json deps to add
\`\`\`json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.9.0",
    "vite": "^7.0.0",
    "vitest": "^4.0.0",
    "@testing-library/react": "^16.0.0"
  }
}
\`\`\`

## Checklist
- [ ] Scaffold suite app (\`npm create vite@latest suite -- --template react-ts\`)
- [ ] Create \`SuiteApp.tsx\` tab shell with tab bar
- [ ] Create \`LogicCommonsTab.tsx\` wrapping LogicCommons \`<App />\`
- [ ] Import LogicCommons CSS files in the tab wrapper
- [ ] Configure Vite alias to resolve LogicCommons source
- [ ] Add more tabs to TABS array as needed
- [ ] Run \`npm run build && npm test\` for the suite
`
}

export default function PromptPage({ ctx }: { ctx: RepoCtx }) {
    const [tabLabel, setTabLabel] = useState('LogicCommons')
    const [mode, setMode] = useState<EmbedMode>('iframe')
    const [copied, setCopied] = useState(false)

    const prompt = buildPrompt(ctx, tabLabel, mode)

    function handleCopy() {
        navigator.clipboard.writeText(prompt).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }).catch(() => {})
    }

    return (
        <section className="page-prompt">
            <div className="page-header">
                <h2>Integration Prompt</h2>
                <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
                    Copy this prompt into any AI coding assistant to embed LogicCommons as a tab in your tool suite.
                </p>
            </div>

            <div className="surface" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', fontSize: 'var(--text-sm)' }}>
                        Tab label
                        <input
                            className="form-input"
                            value={tabLabel}
                            onChange={e => setTabLabel(e.target.value)}
                            placeholder="LogicCommons"
                            style={{ width: '180px' }}
                        />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', fontSize: 'var(--text-sm)' }}>
                        Embed mode
                        <select className="picker-select" value={mode} onChange={e => setMode(e.target.value as EmbedMode)}>
                            <option value="iframe">iframe (simplest)</option>
                            <option value="component">React component (monorepo)</option>
                            <option value="standalone">Standalone shell (build from scratch)</option>
                        </select>
                    </label>
                    <button className="button primary" type="button" onClick={handleCopy}>
                        {copied ? '✓ Copied!' : 'Copy Prompt'}
                    </button>
                </div>
            </div>

            <pre className="prompt-block">{prompt}</pre>
        </section>
    )
}
