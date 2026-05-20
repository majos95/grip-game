# GRIP Game — Architecture

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Language | Vanilla JS (ES6+) | No framework overhead for a game this size. State machine + DOM manipulation is sufficient. |
| Styling | Vanilla CSS with custom properties | Design tokens in variables.css. No Tailwind, no preprocessor. |
| Bundler | Vite | Zero-config, fast dev server, outputs single HTML for production. |
| Data | Static JSON files | Scenarios don't change at runtime. Loaded at startup, inlined at build. |
| Hosting | GitHub Pages | Free, custom domain, SSL, deploy on push. |
| Spider Diagram | Inline SVG | Scales cleanly, styleable with CSS, no chart library dependency. |

## Project Structure

```
/grip-game/
├── README.md
├── package.json
├── vite.config.js
├── docs/
│   ├── SPEC.md                    # Game rules, scoring, UX
│   ├── ARCHITECTURE.md            # This file
│   └── SCENARIOS-GUIDE.md         # How to write scenarios
├── data/
│   ├── experience.json            # Red domain scenarios
│   ├── foundation.json            # Blue domain scenarios
│   └── intelligence.json          # Purple domain scenarios (tricks included)
├── src/
│   ├── index.html                 # Entry point, screen containers
│   ├── css/
│   │   ├── variables.css          # Brand tokens, colors, typography
│   │   ├── layout.css             # Grid, responsive, screen states
│   │   ├── components.css         # Cards, buttons, timer, spider
│   │   └── animations.css         # Pop, shake, drain, transitions
│   ├── js/
│   │   ├── app.js                 # State machine, screen transitions
│   │   ├── game.js                # Round lifecycle: start, next, end
│   │   ├── scoring.js             # Points, speed bonus, domain accuracy
│   │   ├── scenarios.js           # Load, randomize, balance difficulty
│   │   ├── results.js             # Pattern detection, spider SVG render
│   │   └── leaderboard.js         # Stub: localStorage now, backend later
│   └── assets/
│       └── (sound files if added)
└── dist/                          # Build output
```

## Key Decisions

### Why Vanilla JS, Not React

The game is a linear state machine with 6 screens. React's component model, virtual DOM diffing, and lifecycle management add complexity without value here. The state object is flat. The DOM updates are infrequent (once per scenario, ~every 10 seconds). CSS transitions handle all animation. A 500-line vanilla JS app is easier to debug at a conference booth than a React app with build issues.

If the game grows into a full product (CMS, analytics dashboard, multi-language), reconsider. For the PoC and conference use: vanilla.

### Why Separate JS Files (Not One Big File)

Separation by concern, not by feature. Each file has one job:

- `app.js` knows about screens and transitions. It doesn't know about scoring.
- `game.js` knows about the round lifecycle. It doesn't know about rendering.
- `scoring.js` is pure functions. No DOM, no state, no side effects. Testable in isolation.
- `scenarios.js` handles data loading and selection logic. Could be swapped for an API call later.
- `results.js` owns the SVG spider diagram and pattern detection. Isolated for iteration.
- `leaderboard.js` is a stub with a clean interface. Swap localStorage for a backend without touching other files.

Vite bundles everything into a single file for production. The separation is a development convenience, not a runtime cost.

### Why Three JSON Files, Not One

- Each domain's scenarios are maintained independently
- You can add 5 new Intelligence scenarios without opening the Experience file
- The selection algorithm explicitly pulls N from each domain, so separate files match the data access pattern
- File size stays small and readable

### Why Vite Inlines Everything

The production output must be a single `index.html` that works:
- On GitHub Pages
- Opened as a local file (file://)
- Offline (no CDN dependencies)
- On a tablet at a booth with flaky conference WiFi

Vite's `vite-plugin-singlefile` (or equivalent config) inlines all CSS, JS, and JSON into one HTML file. Zero external requests at runtime.

### Leaderboard: localStorage Now, Backend Later

The PoC leaderboard uses localStorage. This means:
- Scores persist on one device only
- No cross-device leaderboard
- Clearing browser data loses scores

This is fine for testing. For the conference, you'll want a backend. The `leaderboard.js` interface is designed for this:

```javascript
// Current (localStorage)
export async function submitScore(name, score, domainAccuracy) { ... }
export async function getTopScores(limit) { ... }
export async function getTotalParticipants() { ... }

// Future (API)
// Same interface, different implementation.
// Swap the file, nothing else changes.
```

Recommended backend when ready: AWS API Gateway + Lambda + DynamoDB (you have credits) or Supabase (faster setup, free tier sufficient for a conference).

### Agent Interaction: Anthropic API Direct

The post-game agent screen calls the Anthropic API directly from the browser. This is acceptable because:
- The API key is scoped and rate-limited
- The feature is optional (not part of core game)
- Conference use only (not public-facing long-term)

For a production version, proxy through a backend to hide the API key. For the PoC, direct calls with a restricted key are fine.

## Build and Deploy

### Development

```bash
npm install
npm run dev        # Starts Vite dev server on localhost:5173
```

### Production Build

```bash
npm run build      # Outputs single index.html to dist/
```

### GitHub Pages Deploy

Option A: Manual
- Copy `dist/index.html` to the `gh-pages` branch
- Push

Option B: GitHub Action (recommended)
- On push to `main`, build and deploy to Pages automatically
- Standard `peaceiris/actions-gh-pages` action works

### Custom Domain

- Add CNAME file to `dist/` (or configure in GitHub repo settings)
- DNS: CNAME record pointing to `<username>.github.io`
- SSL: automatic via GitHub
