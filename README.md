# Got GRIP?

A timed classification game for conference booth engagement. Players read short business problem scenarios and classify each into one of three solution domains: **Experience** (UX/Design), **Foundation** (Core Systems), or **Intelligence** (Agentic AI). Speed + accuracy = score. Results reveal blind spots.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node)

## Running locally

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser. The dev server hot-reloads on file changes — edit any file in `src/` or `data/` and the browser updates immediately.

## Building for production

```bash
npm run build
```

Outputs a single self-contained `dist/index.html` with all CSS, JS, and scenario data inlined. No server required — the file works opened directly in a browser (`file://`) or served from any static host (GitHub Pages, S3, Netlify, etc.).

To preview the production build locally before deploying:

```bash
npm run preview
```

Opens a local server at **http://localhost:4173** serving the built file.

## Manual testing checklist

There is no automated test suite. Use this checklist to verify a build before a conference:

**Landing screen**
- [ ] Three domain pills show correct colors (red / blue / purple)
- [ ] "Start" button navigates to briefing

**Briefing screen**
- [ ] Three domain descriptions display correctly
- [ ] "Got GRIP?" button starts the game

**Game round**
- [ ] 12 scenarios appear, progress counter updates (1/12 → 12/12)
- [ ] Timer bar drains over ~30 seconds; turns yellow then red
- [ ] Correct tap: green ring on button, green flash on card
- [ ] Wrong tap: red ring on selected button, correct domain highlighted, card shakes
- [ ] Timeout: card fades out, auto-advances after 600 ms
- [ ] Score increments only on correct answers
- [ ] All 12 results are recorded (check console if needed)

**Results screen**
- [ ] Score animates up from 0; shows `X / 1800`
- [ ] Accuracy % and average speed display
- [ ] Domain breakdown bars animate to correct widths (Experience / Foundation / Intelligence)
- [ ] Spider diagram renders with three labelled axes
- [ ] Blind spot insight text fades in
- [ ] Question review list shows all 12 questions with correct/wrong indicators
- [ ] "Add to Leaderboard" opens the name entry modal
- [ ] Submitting a name saves to localStorage; leaderboard preview appears on landing screen
- [ ] "Play Again" returns to briefing

**Leaderboard**
- [ ] Play multiple times; leaderboard preview on landing shows top 3 in descending score order

## Adding scenarios

Edit the JSON files in `data/`. Each file is one domain:

| File | Domain |
|---|---|
| `data/experience.json` | Experience (red) |
| `data/foundation.json` | Foundation (blue) |
| `data/intelligence.json` | Intelligence (purple) |

See `docs/SCENARIOS-GUIDE.md` for the JSON schema and writing guidelines.

## Project structure

```
grip-game/
├── data/
│   ├── experience.json        # Red domain scenarios
│   ├── foundation.json        # Blue domain scenarios
│   └── intelligence.json      # Purple domain scenarios
├── docs/
│   ├── SPEC.md                # Game rules, scoring, UX, brand
│   ├── ARCHITECTURE.md        # Tech decisions and module responsibilities
│   └── SCENARIOS-GUIDE.md     # How to write and add scenarios
├── src/
│   ├── index.html             # All 4 screens + leaderboard modal
│   ├── css/
│   │   ├── variables.css      # Brand tokens (colors, fonts, radii)
│   │   ├── layout.css         # Screen positioning, game layout
│   │   ├── components.css     # All component styles
│   │   └── animations.css     # Keyframes and feedback states
│   └── js/
│       ├── app.js             # State machine, screen transitions, event wiring
│       ├── game.js            # Round lifecycle: timer, answer handling, transitions
│       ├── scenarios.js       # JSON loading, randomization, difficulty balancing
│       ├── scoring.js         # Score calculation, domain accuracy stats
│       ├── results.js         # Spider diagram, breakdown bars, question review
│       └── leaderboard.js     # localStorage (Phase 1); async interface ready for backend swap
├── dist/                      # Production build output (single index.html)
├── package.json
└── vite.config.js
```

## Deploying to GitHub Pages

1. Run `npm run build`
2. Push the `dist/index.html` to a `gh-pages` branch (or configure GitHub Actions to do it on push to `main`)
3. Enable GitHub Pages in repository Settings, pointing to the `gh-pages` branch
4. (Optional) Add a custom domain via a CNAME file in `dist/`

## Scenario bank

| Domain | Scenarios | Target for 2-day conference |
|---|---|---|
| Experience (red) | 10 | 15–20 |
| Foundation (blue) | 11 | 15–20 |
| Intelligence (purple) | 10 | 15–20 |
| **Total** | **31** | **45–60** |

Current bank supports multiple unique rounds per session. See `docs/SCENARIOS-GUIDE.md` to contribute more.
