# Got GRIP? — OutSystems Handover

## Purpose

This document translates the current vanilla JS prototype into OutSystems Reactive Web architecture. It covers the full data model, all server and client actions, every screen, reusable blocks, and flags open discovery items where the OutSystems implementation path is unknown.

Read `SPEC.md` for game rules and `ARCHITECTURE.md` for the current tech rationale before reading this document.

---

## Current Implementation → OutSystems Mapping

| Current file | OutSystems equivalent |
|---|---|
| `data/experience.json` + `data/foundation.json` + `data/intelligence.json` | **Scenario** entity (bootstrapped) |
| `src/js/scenarios.js` | **GetRoundScenarios** Server Action |
| `src/js/scoring.js` | **SubmitAnswer** + **FinalizeGameSession** Server Actions |
| `src/js/game.js` | **GameScreen** Client Actions |
| `src/js/results.js` | **ResultsScreen** + **ComputeBlindSpot** Server Action |
| `src/js/leaderboard.js` | **GetLeaderboard** / **SubmitToLeaderboard** Server Actions |
| `src/js/app.js` | Screen navigation (OutSystems handles this natively) |

---

## Data Model

### Static Entities

Static entities are OutSystems enums — fixed records, no runtime edits.

---

**Domain**

The three solution domains. Used as Identifier references across all other entities.

| Identifier | Label | Color | BackgroundColor |
|---|---|---|---|
| Experience | Experience | #FF4D4D | #FFF0EC |
| Foundation | Foundation | #3626EF | #EEEEFF |
| Intelligence | Intelligence | #6B3FA0 | #F3EEFA |

---

**Difficulty**

Scenario difficulty levels. Stores the timer duration so it can be tuned without a deployment.

| Identifier | Label | TimerSeconds (Integer) |
|---|---|---|
| Easy | Easy | 30 |
| Medium | Medium | 30 |
| Hard | Hard | 30 |

*(All currently 30s per product decision. Keeping separate records allows per-difficulty tuning later.)*

---

### Entities

---

**Scenario**

One record per game scenario. Bootstrapped from the existing JSON files (31 records at launch).

| Attribute | Type | Mandatory | Notes |
|---|---|---|---|
| Id | Integer (AutoNumber) | Yes | PK |
| ScenarioCode | Text(10) | Yes | Original JSON id: E1, F3, T1, etc. Unique. |
| ScenarioText | Text(2000) | Yes | The question shown to the player |
| DomainId | Domain Identifier | Yes | The correct answer |
| Why | Text(2000) | Yes | Explanation shown in the results accordion |
| DifficultyId | Difficulty Identifier | Yes | |
| Decoy1DomainId | Domain Identifier | No | First plausible wrong domain (used for analytics) |
| Decoy2DomainId | Domain Identifier | No | Second plausible wrong domain |
| IsActive | Boolean | Yes | Default True. Allows disabling without deleting. |

> **Note on decoys:** The `decoys` field from the JSON captures which wrong domains were considered plausible when the scenario was written. Storing them as `Decoy1DomainId` / `Decoy2DomainId` enables future analytics: e.g. "which domain do people most commonly confuse with Foundation?" Not required for the game to function.

---

**GameSession**

One record per completed round. Stats are written in full when the round ends.

| Attribute | Type | Mandatory | Notes |
|---|---|---|---|
| Id | Integer (AutoNumber) | Yes | PK |
| StartedAt | DateTime | Yes | Set when session is created |
| CompletedAt | DateTime | No | Set when FinalizeGameSession is called |
| TotalScore | Integer | No | Sum of all answer points (0–1800) |
| CorrectAnswers | Integer | No | Count of correct answers (0–12) |
| AccuracyPct | Decimal(5,2) | No | 0.00–100.00 |
| AvgSpeedSeconds | Decimal(5,2) | No | Average ms per answer / 1000 |
| ExperienceAccuracyPct | Decimal(5,2) | No | 0.00–100.00 |
| FoundationAccuracyPct | Decimal(5,2) | No | 0.00–100.00 |
| IntelligenceAccuracyPct | Decimal(5,2) | No | 0.00–100.00 |
| PlayerName | Text(30) | No | Null = did not opt in to leaderboard |

> The leaderboard is simply a filtered view of GameSession where PlayerName is not null, sorted by TotalScore descending.

---

**GameAnswer**

One record per question answered within a round. 12 records per completed GameSession.

| Attribute | Type | Mandatory | Notes |
|---|---|---|---|
| Id | Integer (AutoNumber) | Yes | PK |
| GameSessionId | GameSession Identifier | Yes | FK |
| ScenarioId | Scenario Identifier | Yes | FK |
| SelectedDomainId | Domain Identifier | No | Null = player timed out |
| IsCorrect | Boolean | Yes | |
| Points | Integer | Yes | 100–150 if correct, 0 if wrong or timed out |
| TimeSpentMs | Integer | Yes | Milliseconds from scenario display to answer (or full timer if timed out) |
| AnswerOrder | Integer | Yes | 1–12, position within the round |

---

## Business Logic

### Server Actions

---

**GetRoundScenarios**

Selects 12 scenarios for a round: 4 per domain, balanced by difficulty.

- Input: none
- Output: `Scenarios` — List of Scenario (12 records)

Logic:
1. Query all active Scenarios grouped by Domain
2. From each domain pool, select 4 records attempting: 1 Easy, 2 Medium, 1 Hard (fill remaining slots randomly if a difficulty has fewer than needed)
3. Combine the 12 records and randomize order
4. Return the list

> **Discovery D1 — Random selection in OutSystems.** See Discoveries section.

---

**CreateGameSession**

- Input: none
- Output: `GameSessionId` (Long Integer)

Logic: Create a GameSession record with `StartedAt = CurrDateTime()`. Return the new Id.

---

**SubmitAnswer**

Called immediately when the player taps a domain button or the timer expires.

- Input: `GameSessionId`, `ScenarioId`, `SelectedDomainId` (nullable), `TimeSpentMs`, `AnswerOrder`
- Output: `IsCorrect` (Boolean), `Points` (Integer)

Logic:
```
Fetch Scenario by ScenarioId

IsCorrect = (SelectedDomainId is not null) AND (SelectedDomainId = Scenario.DomainId)

If IsCorrect:
  TimerMs = Scenario.DifficultyId.TimerSeconds * 1000
  Points = 100 + Floor((TimerMs - TimeSpentMs) / TimerMs * 50)
Else:
  Points = 0

Create GameAnswer record with all inputs + IsCorrect + Points
Return IsCorrect, Points
```

> Scoring range: 100 (answered at last possible moment) to 150 (answered instantly). Max round score: 12 × 150 = 1800.

---

**FinalizeGameSession**

Called after the 12th answer is submitted, before navigating to the Results screen.

- Input: `GameSessionId`
- Output: `GameSession` (full record with computed stats)

Logic:
```
Fetch all 12 GameAnswers for this session (with Scenario details)

TotalScore          = Sum(GameAnswer.Points)
CorrectAnswers      = Count where IsCorrect = True
AccuracyPct         = CorrectAnswers / 12 * 100
AvgSpeedSeconds     = Sum(TimeSpentMs) / 12 / 1000

For each Domain (Experience, Foundation, Intelligence):
  DomainAnswers     = GameAnswers where Scenario.DomainId = Domain
  DomainCorrect     = Count where IsCorrect = True
  DomainAccuracyPct = DomainCorrect / 4 * 100

CompletedAt = CurrDateTime()

Update GameSession with all computed values
Return updated GameSession
```

---

**ComputeBlindSpot**

Pure logic action — no database access. Determines the results insight message.

- Input: `ExperienceAccuracyPct`, `FoundationAccuracyPct`, `IntelligenceAccuracyPct` (all Decimal)
- Output: `BlindSpotKey` (Text) — one of: `"experience"`, `"foundation"`, `"intelligence"`, `"balanced"`, `"low_overall"`

Logic:
```
Min = Minimum(E, F, I)
Max = Maximum(E, F, I)
Avg = (E + F + I) / 3

If (Max - Min) <= 15 → return "balanced"
If Avg < 50         → return "low_overall"
Return the domain identifier with the lowest accuracy
```

Insight text per key (display on ResultsScreen):

| Key | Text |
|---|---|
| `experience` | "You're user-focused, which is great. But some scenarios need deeper technical fixes or real AI capabilities." |
| `foundation` | "Solid engineering instinct, but not every problem needs a platform fix. Some need design thinking, some genuinely need AI reasoning." |
| `intelligence` | "You see AI everywhere. That's ambitious, but some problems need better design or stronger architecture before agents can help." |
| `balanced` | "Well-rounded perspective. You can tell the difference between a design fix, a platform problem, and a genuine AI opportunity." |
| `low_overall` | "Harder than it looks, right? That's the point. Knowing where each solution fits separates good implementation from expensive mistakes." |

---

**SubmitToLeaderboard**

- Input: `GameSessionId`, `PlayerName` (Text)
- Output: none

Logic: Validate PlayerName is not empty, trim whitespace, truncate to 30 characters, update `GameSession.PlayerName`.

---

**GetLeaderboard**

- Input: `TopN` (Integer, default 10)
- Output: List of GameSession (PlayerName, TotalScore, AccuracyPct, ExperienceAccuracyPct, FoundationAccuracyPct, IntelligenceAccuracyPct, CompletedAt)

Logic: Aggregate on GameSession where `PlayerName is not null`, ordered by `TotalScore DESC`, limited to `TopN`.

---

**GetLeaderboardPreview**

- Input: none
- Output: List of 3 records (PlayerName, TotalScore)

Logic: Same as GetLeaderboard with TopN = 3, return only name and score.

---

### Client Actions

Client actions run in the browser. Use JavaScript nodes where OutSystems has no native equivalent.

---

**StartTimer**

Starts the per-scenario countdown. Called when a new scenario is displayed.

- Input: `TimerSeconds` (Integer)
- Output: none (updates `TimerProgress` local variable, fires `OnTimerExpired` when done)

Implementation: JavaScript node calling `setInterval` or `requestAnimationFrame` every ~50ms, computing `elapsed / totalMs` and updating the screen's `TimerProgress` local variable. When `TimerProgress` reaches 0, calls `OnTimerExpired`.

> **Discovery D2 — Client-side countdown timer.** See Discoveries section.

---

**StopTimer**

Cancels the interval started by StartTimer. Call on answer selection and on screen destroy.

> **Discovery D2** — same as above.

---

**OnDomainSelected**

Handles a player tapping one of the three domain buttons.

- Input: `SelectedDomainId`

Logic:
1. If `IsAnswering = True`, exit (prevent double-tap)
2. Set `IsAnswering = True`
3. Call `StopTimer`
4. Disable domain buttons
5. Call `SubmitAnswer` server action with current scenario data and `TimeSpentMs`
6. Show feedback animation (correct flash or wrong shake) — see **Discovery D4**
7. Wait 600ms (JavaScript `setTimeout` node)
8. Call `AdvanceScenario`

---

**OnTimerExpired**

Called by `StartTimer` when time runs out.

Logic:
1. If `IsAnswering = True`, exit
2. Set `IsAnswering = True`
3. Disable domain buttons
4. Call `SubmitAnswer` with `SelectedDomainId = null`, `TimeSpentMs = TimerSeconds * 1000`
5. Show expired animation
6. Wait 600ms
7. Call `AdvanceScenario`

---

**AdvanceScenario**

Moves to the next question or ends the round.

Logic:
1. Increment `CurrentScenarioIndex`
2. If `CurrentScenarioIndex >= 12`:
   - Call `FinalizeGameSession`
   - Navigate to ResultsScreen with `GameSessionId`
3. Else:
   - Reset `IsAnswering = False`
   - Reset timer bar to full
   - Update displayed scenario from `Scenarios[CurrentScenarioIndex]`
   - Call `StartTimer`
   - Enable domain buttons

---

## Screens

---

### LandingScreen

Entry point. Shows the game title, domain overview, start button, and leaderboard preview if scores exist.

**Data Actions:**
- On screen load: `GetLeaderboardPreview` → drives the leaderboard list (visible only if result is not empty)

**Local Variables:** none

**Widgets:**
- Game title: "Got GRIP?" (styled heading, "GRIP" in dark blue)
- Tagline text
- Three `DomainPill` blocks (Experience, Foundation, Intelligence)
- Start button → navigate to BriefingScreen
- Leaderboard preview list (conditional: hide if no entries)

---

### BriefingScreen

Rules explanation. Can be skipped by returning players (optional enhancement — track in Local Storage via JavaScript node).

**Data Actions:** none

**Widgets:**
- Headline text
- Three domain explanation cards (colored left-border containers)
- CTA text: "Tap the right color. Beat the clock. 12 scenarios."
- "Got GRIP?" button → call `CreateGameSession`, store returned `GameSessionId` in local variable, navigate to GameScreen

---

### GameScreen

The core game round. All 12 scenarios shown sequentially.

**Input Parameters:**
- `GameSessionId` (Long Integer)

**Local Variables:**

| Name | Type | Initial |
|---|---|---|
| Scenarios | List of Scenario | (empty) |
| CurrentScenarioIndex | Integer | 0 |
| CurrentScore | Integer | 0 |
| TimerProgress | Decimal | 1.0 |
| IsAnswering | Boolean | False |

**Data Actions:**
- On initialize: call `GetRoundScenarios` → populate `Scenarios` local variable

**On After Fetch:** call `StartTimer` for the first scenario

**Widgets:**
- Score display: `CurrentScore`
- Progress label: `CurrentScenarioIndex + 1` / 12
- `TimerBar` block (input: `TimerProgress`)
- Scenario card: `Scenarios[CurrentScenarioIndex].ScenarioText`
- Three `DomainButton` blocks (Experience / Foundation / Intelligence), `IsDisabled` driven by `IsAnswering`

**Client Actions wired to buttons:**
- Each `DomainButton` OnClick → `OnDomainSelected(DomainId)`

---

### ResultsScreen

Shows full round stats, domain breakdown, spider diagram, blind spot insight, and question review.

**Input Parameters:**
- `GameSessionId` (Long Integer)

**Data Actions:**
- On initialize: fetch `GameSession` by Id + all `GameAnswers` with Scenario details (single aggregate or two)

**On After Fetch:**
- Call `ComputeBlindSpot` with the three domain accuracy values
- Set insight text from the returned key
- Trigger score count-up animation (Discovery D6)
- Trigger domain breakdown bar animations

**Widgets:**
- Score: animated count-up from 0 → `TotalScore`, with "/ 1800" suffix
- Accuracy %: `AccuracyPct`
- Avg speed: `AvgSpeedSeconds`s
- Three `BreakdownBar` blocks (one per domain)
- Spider diagram — **Discovery D3**
- Insight text (fade-in after 500ms)
- Question review list: one `AnswerReviewItem` block per `GameAnswer`, in `AnswerOrder` sequence
- "Add to Leaderboard" button → show name input modal → call `SubmitToLeaderboard`
- "Play Again" button → navigate to BriefingScreen

---

## Blocks (Reusable Web Blocks)

---

**DomainPill**

A colored badge representing a domain.

| Input | Type |
|---|---|
| DomainId | Domain Identifier |
| ShowDescription | Boolean |

Renders: a pill with the domain's `Color` background (or light `BackgroundColor`), label, and optional one-line description.

Used on: LandingScreen, BriefingScreen.

---

**TimerBar**

The draining horizontal timer bar.

| Input | Type |
|---|---|
| Progress | Decimal (0.0–1.0) |

Renders: a full-width bar whose filled portion is `Progress * 100%` wide.
Color: green (`Progress > 0.5`), yellow (`Progress 0.25–0.5`), red (`Progress < 0.25`). Apply via conditional CSS classes.

> **Discovery D4** applies to the color class switching.

---

**DomainButton**

One of the three answer buttons on GameScreen.

| Input | Type |
|---|---|
| DomainId | Domain Identifier |
| IsDisabled | Boolean |

| Event | Description |
|---|---|
| OnClick | Bubbles DomainId up to parent screen |

Renders: a full-height button with the domain's background color and label.

---

**BreakdownBar**

Domain accuracy bar on ResultsScreen.

| Input | Type |
|---|---|
| DomainId | Domain Identifier |
| Correct | Integer |
| Total | Integer |

Renders: domain label (colored), animated horizontal bar (`Correct / Total * 100%` wide), count label (`Correct/Total`).

> **Discovery D5** applies to the fill animation.

---

**AnswerReviewItem**

Expandable accordion item in the question review list.

| Input | Type |
|---|---|
| GameAnswer | GameAnswer (with Scenario) |
| AnswerOrder | Integer |

**Local Variable:** `IsExpanded` (Boolean, default False)

Renders when collapsed:
- Status icon (✓ green / ✗ red)
- Truncated scenario text (~85 chars)
- Answer badge(s): correct domain pill; if wrong, show "picked domain → correct domain"
- Expand chevron (›)

Renders when expanded (additional content):
- Full scenario text
- "Why [Domain]?" label with contextual note for wrong/timed-out answers
- The `Scenario.Why` explanation text

Toggle: clicking the summary row flips `IsExpanded`. Conditionally show/hide expanded content using an If widget.

> **Discovery D5** applies to smooth animated expand/collapse.

---

**ScoreCounter**

Animates a number from 0 to a target value on render.

| Input | Type |
|---|---|
| TargetScore | Integer |

> **Discovery D6** — requires a JavaScript node.

---

## Discoveries

These items have no confirmed OutSystems implementation path. Each needs a spike or research task before the team can estimate.

---

**D1 — Random scenario selection**

The game selects 4 random scenarios per domain per round with no session repeats. OutSystems Aggregates do not support `ORDER BY RAND()` or equivalent natively.

Options to research:
- Fetch all active scenarios (≤60 records), shuffle server-side using a List manipulation approach, slice the first N per domain
- Use SQL node with `NEWID()` (SQL Server) or `RANDOM()` (other DBs) — check if the OS environment supports SQL nodes
- Store a randomly generated `SortKey` on each scenario record and re-randomize periodically

---

**D2 — Client-side countdown timer**

The timer must drain smoothly over 30 seconds, update a progress variable roughly every 50ms, and fire an event on expiry — all while the user can interact with the screen.

Research:
- JavaScript node in a Client Action using `setInterval` or `requestAnimationFrame` that calls `$public.Module.Action` to update a local variable
- Confirm how to cancel the interval (store the interval ID in a JavaScript variable or hidden input)
- Confirm the Local Variable update triggers a UI re-render in OutSystems Reactive without full screen refresh

---

**D3 — Spider / radar diagram**

The results screen shows a three-axis radar chart of domain accuracy (0–100% per axis). The current prototype draws this as raw SVG in JavaScript.

Options to research:
- OutSystems Forge components: search for "radar chart", "spider chart", or "chart" components
- Embed Chart.js or similar via a JavaScript node — confirm CSP policy allows external libraries or bundle via a resource
- Replicate the SVG approach inside an HTML widget (OutSystems allows raw HTML widgets — confirm they accept inline SVG)

---

**D4 — CSS animation class toggling**

The current game applies and removes CSS animation classes dynamically (slide-in, shake on wrong, green flash on correct, timer color change). OutSystems widgets don't expose direct class manipulation.

Options to research:
- `RunJavaScript` client action with `document.querySelector(...).classList.add/remove(...)` — assess reliability given OutSystems may regenerate DOM IDs
- Use the `ExtendedProperties` / `Style` attributes on widgets to conditionally apply classes via local boolean variables (no animation, just state)
- Assess whether animations are strictly required or if color/icon changes alone are sufficient for the booth context

---

**D5 — Animated expand/collapse in list items**

Each `AnswerReviewItem` should animate open smoothly when expanded. The current prototype uses the native HTML `<details>/<summary>` element with a CSS keyframe.

Options to research:
- Toggle an If widget (no animation — may be acceptable)
- JavaScript node targeting the item's container with CSS `max-height` transition
- OutSystems Forge accordion components

---

**D6 — Score count-up animation**

The score animates from 0 to the final value when the results screen loads.

Research:
- JavaScript node in the `On After Fetch` event using `requestAnimationFrame`, targeting the score element by a known ID or attribute
- Confirm OutSystems Reactive re-renders don't interrupt an in-progress JS animation

---

**D7 — Scenario data bootstrapping**

31 scenarios exist in JSON files and need to be loaded into the OutSystems database.

Options:
- **Bootstrap Timer**: a one-time server-side timer action that creates Scenario records on first deployment if the table is empty
- **Import screen**: a developer-only screen to paste or upload JSON
- **Manual entry**: use the OutSystems Service Center data editor or a custom back-office screen
- **Excel/CSV import**: if the team uses an OutSystems Excel import pattern

Recommendation: ask the OS team which pattern they prefer for seeding static reference data.

---

**D8 — Phase 2 backend leaderboard (external)**

The spec mentions AWS API Gateway + DynamoDB as an alternative to the OutSystems database for the leaderboard. If the leaderboard stays in OutSystems, no discovery needed.

If an external backend is used:
- OutSystems REST API consumption is well-documented — the team should be familiar
- Confirm auth approach (API key in header) and whether the API Gateway endpoint is available at build time

---

## CSS / Theme Notes

The brand uses CSS custom properties (variables). OutSystems themes use CSS files attached to the application. All variables from `src/css/variables.css` should be added to the OutSystems theme CSS:

```css
:root {
  --bg-cream: #FCF5EF;
  --domain-experience: #FF4D4D;
  --domain-foundation: #3626EF;
  --domain-intelligence: #6B3FA0;
  --text-primary: #1A1715;
  --correct: #2ECC71;
  --incorrect: #E74C3C;
  --dark-blue: #0F238C;
  /* … full list in src/css/variables.css */
}
```

Typography: headings use Tahoma (bold), body uses Arial. Both are system fonts — no web font loading required.

Minimum tap target size: 48px height on all interactive elements (critical for booth/tablet use).

---

## Questions for the OutSystems Team

Before starting development, align on:

1. **Target OutSystems edition**: Reactive Web? (assumed yes — Traditional Web is not appropriate for this interaction model)
2. **Deployment environment**: Personal environment, development tenant, or shared platform?
3. **D1 (random selection)**: What is the team's preferred pattern for randomizing server-side lists?
4. **D7 (bootstrapping)**: How does the team prefer to seed static scenario data?
5. **D3 (spider diagram)**: Is there an approved charting library or Forge component already in use?
6. **D8 (leaderboard)**: Does the leaderboard stay in OutSystems DB, or is the AWS backend still in scope?
7. **Animations**: Are the entry/feedback animations (D4, D5, D6) in scope for v1, or is functional-first acceptable for the first conference?
