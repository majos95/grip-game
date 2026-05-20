# Got GRIP? — Booth Game Concept

## The Pitch

"Got GRIP?" is a timed classification game that tests whether you can spot where AI agents genuinely add value versus where the real fix is better UX or stronger core systems. It's fast, competitive, and reveals blind spots most teams don't know they have.

---

## The Three Domains

Each scenario in the game belongs to one of three problem domains. Players must classify correctly under time pressure.

### 1. Experience (UX/Design)
**Color:** Team Red (#FF4D4D)
**Booth specialist:** Design-focused team member
**The point:** The problem isn't technical. The application works, but people can't use it properly, don't trust it, or work around it. The fix is redesign, not more technology.

### 2. Foundation (Core Systems)
**Color:** Team Blue (#3626EF)
**Booth specialist:** OutSystems / platform engineering team member
**The point:** The problem is in the deterministic layer. Data is wrong, systems don't connect, the architecture can't scale, or business logic is broken. No amount of AI fixes bad plumbing.

### 3. Intelligence (Agentic AI)
**Color:** Purple (#6B3FA0)
**Booth specialist:** AI / agents team member
**The point:** This is where an agent genuinely adds value. The task requires reasoning, natural language understanding, dynamic decision-making, or working with unstructured data at scale. AI isn't a shortcut here, it's the right tool.

---

## Game Mechanic

### How It Works

1. **Scenarios appear on screen one at a time.** Each describes a real business problem in 1-2 sentences.
2. **Three colored buttons** (Red, Blue, Purple) are always visible at the bottom. The player taps the color that matches the right domain.
3. **Timer bar** runs across the top. Each scenario has a limited window (roughly 8-10 seconds). If time runs out, the scenario counts as wrong and the next one appears.
4. **Maximum 3 scenarios visible at a time** (they can stack/queue if the player is fast). New scenarios push in as old ones are answered or expire.
5. **Round length:** 12-15 scenarios total. Game takes roughly 90-120 seconds.
6. **Score:** Accuracy (correct domain) + speed bonus (faster = more points). Wrong answers score zero. Expired scenarios score zero.

### Scoring Formula

```
Per scenario:
  Correct answer: 100 points + speed bonus (max 50 points, scales linearly with remaining time)
  Wrong answer: 0 points
  Expired: 0 points

Total: sum of all scenario scores
Max possible: ~1800-2250 points (depending on scenario count)
```

### Leaderboard

- Runs across the full conference (not reset per day)
- Opt-in display only. After seeing their score, the player chooses whether to put their name on the board.
- Visible on the large booth screen
- Top 3 highlighted

---

## Pre-Game Screen

Before starting, a brief screen explains the three domains:

**"Every business problem has a right solution layer. Can you spot which one?"**

**Experience (Red):** The app works, but users struggle. The fix is design, not code.

**Foundation (Blue):** The systems are broken, disconnected, or can't scale. Fix the plumbing first.

**Intelligence (Purple):** This needs reasoning, language, or decisions at scale. An agent is the right call.

**"Tap the right color. Beat the clock. Got GRIP?"**

[Start Game]

---

## Scenario Bank

Each scenario is a short business problem. The player must decide: is this an Experience problem, a Foundation problem, or an Intelligence problem?

### Experience (Red) Scenarios

**E1.** "Customer service reps toggle between 6 different screens to handle a single support ticket."
*Why Experience:* The data and logic exist. The problem is the interface forcing users through a fragmented workflow. Consolidate the UI.

**E2.** "Users export data to Excel to do calculations your application already supports."
*Why Experience:* The feature exists but users either don't know about it or don't trust it. This is a discoverability and trust problem, not a tech problem.

**E3.** "Your onboarding form has a 73% drop-off rate at step 4 of 7."
*Why Experience:* The process works technically. Users abandon because the form is too long, confusing, or asks for information they don't have ready. Redesign the flow.

**E4.** "Warehouse staff print picking lists from the app and handwrite corrections on paper."
*Why Experience:* The app produces the output, but the format doesn't match how people actually work. They've created a workaround because the digital version isn't practical on the floor.

**E5.** "Managers approve expense reports but never use the dashboard that shows spending trends."
*Why Experience:* The dashboard exists, the data is there. Nobody uses it because it wasn't designed for how managers actually make decisions. Relevance and presentation problem.

**E6.** "Your mobile app has a 2-star rating. The #1 complaint: 'I can never find what I need.'"
*Why Experience:* The functionality exists. Navigation and information architecture are the problems.

**E7.** "New employees take 3 weeks to become productive in your CRM. The old version took 3 days."
*Why Experience:* The new CRM likely has more capabilities, but the learning curve signals a UX complexity problem. Simplify, don't add training.

### Foundation (Blue) Scenarios

**F1.** "Your sales team sees different revenue numbers depending on which report they open."
*Why Foundation:* Data inconsistency across systems. This is a single-source-of-truth and integration problem. No AI fixes conflicting data.

**F2.** "It takes 4 months to connect a new supplier to your procurement platform."
*Why Foundation:* Integration architecture. Each supplier connection is custom, no standard patterns. Platform and API layer problem.

**F3.** "Your application crashes when more than 200 users are active simultaneously."
*Why Foundation:* Scalability and architecture. The app wasn't built to handle load. Infrastructure and platform problem.

**F4.** "Finance closes the books 10 days late every quarter because data arrives from 3 systems manually."
*Why Foundation:* Systems don't talk to each other. The fix is integration and automated data flow, not smarter analysis.

**F5.** "Your customer portal still runs on a legacy system that the vendor stopped supporting 2 years ago."
*Why Foundation:* Technical debt and platform lifecycle. This needs migration or modernization, not AI.

**F6.** "Developers spend 60% of their time maintaining existing integrations instead of building new features."
*Why Foundation:* Architecture problem. Fragile integrations consuming engineering capacity. Fix the service layer.

**F7.** "Your order processing fails silently when a product code format changes upstream."
*Why Foundation:* System resilience and contract testing. Upstream changes shouldn't break downstream processes. Integration architecture problem.

### Intelligence (Purple) Scenarios

**I1.** "You receive 3,000 supplier invoices per month in 47 different formats. Staff manually enters each one."
*Why Intelligence:* Unstructured data at scale. An agent can parse, extract, and validate across formats. This is exactly where AI shines.

**I2.** "Your compliance team manually reviews every contract for regulatory risk. It takes 2 weeks per contract."
*Why Intelligence:* Natural language understanding over long documents with nuanced judgment. An agent can flag risks and surface relevant clauses.

**I3.** "Customers ask the same 50 questions in 200 different ways. Your FAQ page doesn't help."
*Why Intelligence:* Natural language variation. A conversational agent handles the long tail of how people phrase things, where static content can't.

**I4.** "Your logistics planners spend 4 hours each morning manually optimizing delivery routes based on weather, traffic, and order priority."
*Why Intelligence:* Multi-variable dynamic optimization with changing inputs. An agent can process real-time signals and suggest optimized routes.

**I5.** "You have 15 years of maintenance logs in free-text format. Nobody can extract useful patterns from them."
*Why Intelligence:* Unstructured historical data. An agent can analyze, categorize, and surface patterns across thousands of text entries.

**I6.** "Your support team escalates 40% of tickets because they can't find the right knowledge base article fast enough."
*Why Intelligence:* The knowledge exists but retrieval over unstructured content is the bottleneck. An AI agent with RAG can match questions to answers contextually.

**I7.** "You need to classify incoming insurance claims by damage type, severity, and fraud risk using photos and free-text descriptions."
*Why Intelligence:* Multimodal input (images + text) with judgment calls. An agent combines vision and language understanding for triage.

### Trick Scenarios (Intentionally Ambiguous)

These scenarios have a "correct" answer but are designed to spark debate. They test whether the player is thinking critically or just pattern-matching.

**T1.** "Your chatbot answers customer questions but 30% of users say the answers are wrong."
*Correct: Experience (Red).* Most people will say Intelligence. But if the underlying knowledge is correct and the bot is surfacing wrong answers, the problem is likely how the conversation flow is designed, how answers are presented, or how confidence thresholds are set. It's a UX problem in the conversational interface.

**T2.** "You want to use AI to predict which customers will churn, but your customer data is spread across 4 systems with no unified ID."
*Correct: Foundation (Blue).* The instinct is Intelligence (it involves AI prediction). But you can't predict anything if your data isn't unified. Fix the foundation first.

**T3.** "A government agency needs to redact personal information from 50,000 scanned documents before public release."
*Correct: Intelligence (Purple).* Some might say Foundation (it's a data processing task). But scanned documents require OCR + entity recognition + contextual judgment about what constitutes PII in different contexts. Agent territory.

**T4.** "Your internal tool auto-generates reports, but managers rewrite 80% of the executive summary before sharing."
*Correct: Experience (Red).* Tempting to say Intelligence (auto-generate better summaries with AI). But the problem is that the report template doesn't match how managers communicate. Understanding what they change and why is a UX research task. Redesign the template.

**T5.** "Your ERP system takes 45 seconds to load a customer record."
*Correct: Foundation (Blue).* Obviously. But some people overthink it. Performance is a platform problem.

---

## Results Screen

After the game, the player sees:

### Score Summary
- Total points
- Accuracy percentage
- Average response time

### Domain Breakdown (Spider Diagram)
Three-axis spider/radar diagram showing accuracy per domain:
- Experience (Red axis)
- Foundation (Blue axis)
- Intelligence (Purple axis)

This reveals blind spots visually. A lopsided shape means the player over-indexes on one domain.

### Blind Spot Insight

Based on the shape, display one insight:

**Over-indexes on Intelligence (Purple dominant):**
"You see AI everywhere. That's ambitious, but some of these problems need better design or stronger architecture before agents can help. The smartest AI can't fix broken plumbing or a confusing interface."

**Over-indexes on Foundation (Blue dominant):**
"You've got a solid engineering instinct, but not every problem needs a platform fix. Some of these are design challenges, and some genuinely need AI reasoning. Don't underestimate either."

**Over-indexes on Experience (Red dominant):**
"You're user-focused, which is great. But some of these scenarios need deeper technical fixes or real AI capabilities. A beautiful interface on top of broken systems is still broken."

**Balanced (no strong skew):**
"You've got a well-rounded perspective. You can tell the difference between a design fix, a platform problem, and a genuine AI opportunity. That's rarer than you'd think."

**Low accuracy overall:**
"This stuff is harder than it looks, right? That's the point. Knowing where each solution fits is what separates good implementation from expensive mistakes. Let's talk about how to get it right."

### CTAs
- "Add your score to the leaderboard" (opt-in, enters name)
- "Talk to a specialist" (routes to the right color based on their weakest domain)
- "Go deeper with our AI advisor" (launches the optional agent interaction)

---

## Optional: Post-Game Agent Interaction

Not part of the leaderboard. For engaged visitors who want more.

### Flow

1. **Structured intake (3-4 quick taps):**
   - "What's your role?" (CTO / Product / Engineering / Business)
   - "How big is your dev team?" (1-10 / 10-50 / 50+)
   - "What's your biggest current challenge?" (Speed to market / Legacy modernization / Data quality / User adoption / AI adoption)

2. **Free-text input:**
   "Describe a specific problem you're trying to solve right now. Be as concrete as you can."

3. **Agent response:**
   The agent processes the game results + structured intake + free-text input and produces a personalized mini-assessment:
   - Which domain the problem likely falls into and why
   - One specific recommendation
   - One thing they might be overlooking
   - A prompt to continue the conversation with the right booth specialist

**Purpose:** Demonstrates that Team Resilience (Doppelganger) actually understands how to deploy agents in a real advisory context. The game is the hook. The agent is the proof.

---

## Leaderboard Display

Large screen at the booth, always visible.

Shows:
- Top 10 scores with names (opt-in only)
- Total participants count
- Average accuracy across all players
- Domain-level stats: "Most commonly misclassified domain: Intelligence (42% of players over-classify problems as AI)"

The aggregate stat is the conversation starter for passersby: "Did you know 42% of people at this conference think AI is the answer when it's actually a design problem?"

---

## Content Notes for Scenario Development

### What makes a good scenario:
- Concrete (specific numbers, roles, situations)
- Short (2 sentences max, readable in 5 seconds)
- Has a clear correct answer but plausible wrong ones
- Doesn't require domain expertise to understand the situation (just the classification)

### What to avoid:
- Abstract or theoretical framing ("What if a company wanted to...")
- Jargon-heavy scenarios that only OutSystems devs would understand
- Scenarios where the answer is genuinely 50/50 between domains (unless it's a deliberate trick question)
- Scenarios that make any domain look bad ("AI is useless here")

### Scenario balance per round:
- 4-5 Experience (Red)
- 4-5 Foundation (Blue)
- 4-5 Intelligence (Purple)
- 2-3 Trick scenarios
- Order is randomized per player
