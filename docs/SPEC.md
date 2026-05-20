# Got GRIP? — Game Specification

## Overview

"Got GRIP?" is a timed classification game for conference booth engagement. Players read short business problem scenarios and classify each into one of three solution domains. Speed and accuracy determine the score. Results reveal blind spots in how the player thinks about technology solutions.

The game name "GRIP" is used as a verb (as in "having a grip on things"), not as an acronym.

## The Three Domains

### Experience (Red)
**Color:** #FF4D4D
**What it means:** The problem is in how the application serves its users. The tech works, the data is correct, but people can't use it, don't trust it, or work around it. The fix is design, research, and rethinking the interaction.
**Maps to:** UX/UI Design services

### Foundation (Blue)
**Color:** #3626EF
**What it means:** The problem is in the systems layer. Data is inconsistent, systems don't connect, architecture can't scale, or business logic is broken. No amount of AI or redesign fixes bad plumbing.
**Maps to:** Core Systems / OutSystems platform engineering

### Intelligence (Purple)
**Color:** #6B3FA0
**What it means:** The problem genuinely requires reasoning, language understanding, pattern recognition, or dynamic decision-making over unstructured data at scale. An agent is the right tool, not a shortcut.
**Maps to:** Agentic AI services

## Game Flow

### Screen 1: Landing
- Game title: "Got GRIP?"
- Brief explanation of the three domains with color indicators
- "Start" button
- Leaderboard preview (top 3 scores) if leaderboard is active

### Screen 2: Pre-Game Briefing
Quick explanation screen (skippable for repeat players):

"Every business problem has a right solution layer. Can you spot which one?"

- **Experience (Red):** The app works, but users struggle. The fix is design.
- **Foundation (Blue):** The systems are broken or disconnected. Fix the plumbing.
- **Intelligence (Purple):** This needs reasoning or language at scale. An agent fits.

"Tap the right color. Beat the clock. 12 scenarios. Got GRIP?"

### Screen 3: Game Round (12 scenarios)
- Scenarios appear one at a time
- Countdown timer per scenario (8-10 seconds depending on difficulty)
- Three colored buttons always visible at bottom
- Immediate feedback on tap (green/red flash), then next scenario
- Score counter updating in real time
- Progress: "4 / 12"
- Timer expires = wrong, auto-advances

### Screen 4: Results
- Total score, accuracy %, average speed
- Three-axis spider diagram (accuracy per domain)
- Blind spot insight text
- CTAs: leaderboard opt-in, play again, go deeper (future)

## Scenario Selection Per Round

12 scenarios per round:
- 4 Experience, 4 Foundation, 4 Intelligence
- 4 easy, 5 medium, 3 hard
- Randomized order, no repeats in session
- Trick scenarios count toward their true domain

## Timing

- Easy: 10 seconds
- Medium: 9 seconds
- Hard: 8 seconds
- Transition between scenarios: 600ms
- Total round: 90-120 seconds

## Scoring

Per scenario:
- Correct: 100 + floor((time_remaining / total_time) * 50) = max 150
- Wrong: 0
- Expired: 0

Round max: 1,800 (12 x 150)

Domain accuracy: correct_in_domain / total_in_domain

## Results Analysis

### Spider Diagram
Three axes at 120 degrees. Domain accuracy (0-100%) per axis.
White stroke (2-3px, no fill) connecting points.
Grid rings at 25%, 50%, 75%, 100%.
Background: #FCF5EF.

### Blind Spot Detection

```
weakest = min(all three)
strongest = max(all three)
average = mean(all three)

if strongest - weakest <= 15: "balanced"
else if average < 50: "low_overall"
else: weakest domain is the blind spot
```

Insights:
- **Weak Experience:** "You're user-focused, which is great. But some scenarios need deeper technical fixes or real AI capabilities."
- **Weak Foundation:** "Solid engineering instinct, but not every problem needs a platform fix. Some need design thinking, some genuinely need AI reasoning."
- **Weak Intelligence:** "You see AI everywhere. That's ambitious, but some problems need better design or stronger architecture before agents can help."
- **Balanced:** "Well-rounded perspective. You can tell the difference between a design fix, a platform problem, and a genuine AI opportunity."
- **Low overall:** "Harder than it looks, right? That's the point. Knowing where each solution fits separates good implementation from expensive mistakes."

## Leaderboard

Data: name, score, accuracy, domain_scores, timestamp.
Top 10 by score. Aggregate stats: total players, avg accuracy, most misclassified domain.
Phase 1: localStorage. Phase 2: AWS API Gateway + DynamoDB.
Opt-in only. Runs full conference duration.

## Brand

### Colors (CSS custom properties)
```css
:root {
  --bg-cream: #FCF5EF;
  --bg-light-gray: #F7F0EB;
  --domain-experience: #FF4D4D;
  --domain-foundation: #3626EF;
  --domain-intelligence: #6B3FA0;
  --domain-experience-bg: #FFF0EC;
  --domain-foundation-bg: #EEEEFF;
  --domain-intelligence-bg: #F3EEFA;
  --text-primary: #1A1715;
  --text-secondary: #53504E;
  --text-muted: #A19D9B;
  --border: #D4CDC9;
  --correct: #2ECC71;
  --incorrect: #E74C3C;
  --team-blue: #3626EF;
  --dark-blue: #0F238C;
  --white: #FFFFFF;
}
```

### Typography
- Headings: Tahoma, Arial, sans-serif (bold)
- Body: Arial, Helvetica, sans-serif (regular)
- Scenario text: 16-18px

### Responsive
Primary: mobile 390px. Secondary: tablet 768px. Tertiary: desktop.
All tap targets min 48px.

## Animations

| Element | Animation | Duration |
|---------|-----------|----------|
| Scenario entry | Slide in / fade up | 300ms ease-out |
| Timer bar | Linear drain, green > yellow > red | Per scenario |
| Correct | Green flash + scale 1.02x | 300ms |
| Wrong | Red flash + shake | 300ms |
| Expired | Fade + dim | 300ms |
| Scenario exit | Slide left / fade down | 200ms |
| Score counter | Count up | 1.5s |
| Spider diagram | Draw axis by axis | 1s |
| Insight text | Fade in | 500ms |

## Post-Game Agent (Future)

Stub the interface:
```javascript
async function getAgentInsight(gameResults, intakeAnswers, freeText) {
  return { domain, recommendation, blindSpot, specialistRoute }
}
```
Flow: structured intake (3-4 taps) > free-text > agent output.
Not part of leaderboard.

## Data Files

`/data/experience.json`, `/data/foundation.json`, `/data/intelligence.json`
See `SCENARIOS-GUIDE.md` for schema.
Imported at build time via Vite. Not fetched at runtime.
