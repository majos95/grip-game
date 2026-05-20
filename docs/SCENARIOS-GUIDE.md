# GRIP Game — Scenario Writing Guide

## What Makes a Good Scenario

A GRIP scenario is a short business problem that belongs to one domain but *sounds like* it could belong to another. The game tests whether people can identify root causes versus symptoms.

### The Formula

**Symptom** (what they see) points to Domain A.
**Root cause** (what's actually wrong) points to Domain B.
The correct answer is always the root cause.

### Rules

1. **Max 2 sentences.** If it takes more, the scenario is too complex. Players have 10-14 seconds.
2. **Include specifics.** Numbers, roles, industries, tools. "A hospital" is better than "an organization." "73% drop-off" is better than "high drop-off."
3. **No solution-vocabulary in the text.** Don't say "integration", "user experience", "AI", "design", or "agent" in the scenario. Describe the situation, not the category. If the scenario text contains the answer, it's too easy.
4. **At least two domains must feel plausible.** If everyone immediately knows the answer, it won't generate interesting scores.
5. **The correct answer must be defensible.** Booth staff will need to explain "why" if someone disagrees. If you can't write a clear 1-sentence justification, the scenario is too ambiguous.
6. **Don't make any domain look bad.** Avoid scenarios that imply "AI is useless" or "design doesn't matter." Each domain is the right answer for its scenarios.

### Difficulty Levels

| Level | Definition | Example Quality |
|-------|-----------|----------------|
| **easy** | Correct answer is clear after 3 seconds of thought. One decoy is plausible, the other is a stretch. | "The app crashes under load" is obviously Foundation. |
| **medium** | Two domains feel equally plausible on first read. Root cause vs. symptom distinction is the key. | "Adjusters maintain personal spreadsheets despite the dashboard having all the data." Experience (trust/UX), but Foundation (data quality) feels plausible too. |
| **hard** | Gut instinct points to the wrong answer. Requires thinking about what's actually broken versus what seems broken. These are the trick scenarios. | "AI chatbot resolves 70% of queries but NPS dropped." Instinct says Intelligence (fix the model). Answer is Experience (conversational UX). |

### Distribution Target

The scenario bank should grow over time. Minimum viable bank:

| Domain | Easy | Medium | Hard | Total |
|--------|------|--------|------|-------|
| Experience | 3 | 4 | 3 | 10 |
| Foundation | 3 | 4 | 3 | 10 |
| Intelligence | 3 | 4 | 3 | 10 |
| **Total** | **9** | **12** | **9** | **30** |

With 30 scenarios and 12 per round, players can play 2-3 times before seeing repeats.

Ideal bank size for a 2-day conference: 45-60 scenarios (15-20 per domain).

## JSON Format

Each scenario is an object in the relevant domain's JSON file.

```json
{
  "id": "E1",
  "scenario": "A logistics company built a real-time shipment tracker. Drivers call dispatch instead of using it because they say 'it takes too many taps to update a status.'",
  "domain": "experience",
  "why": "The tech works. Drivers reject it because the interaction design doesn't match their context (driving, gloves, rushed). Form factor and UX problem.",
  "decoys": ["foundation", "intelligence"],
  "difficulty": "medium"
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique. Prefix: E (Experience), F (Foundation), I (Intelligence), T (Trick). Tricks go in the file matching their correct domain. |
| `scenario` | string | The text shown to the player. Max 2 sentences. No solution-vocabulary. |
| `domain` | string | Correct answer. One of: "experience", "foundation", "intelligence". |
| `why` | string | 1-2 sentence explanation. Shown in post-game review. Used by booth staff to justify the answer. |
| `decoys` | array | The two wrong-but-plausible domains. Used for analytics (which wrong answer do people pick?). |
| `difficulty` | string | One of: "easy", "medium", "hard". Determines timer duration and round balancing. |

### ID Convention

- Experience: E1, E2, E3...
- Foundation: F1, F2, F3...
- Intelligence: I1, I2, I3...
- Tricks: T1, T2, T3... (placed in the file matching their correct domain)

### Adding New Scenarios

1. Write the scenario following the rules above.
2. Classify it and write the "why."
3. Identify the two decoy domains and confirm at least one is genuinely plausible.
4. Assign a difficulty level.
5. Add it to the correct JSON file.
6. Test: read it to a colleague without context and see if they hesitate. If they get it instantly, it's too easy (unless tagged as easy). If they argue the answer is wrong, it might be too ambiguous.

### Review Checklist

Before adding a scenario to the bank:

- [ ] Max 2 sentences?
- [ ] Includes concrete specifics (numbers, roles, industry)?
- [ ] No solution-vocabulary (design, integration, AI, agent, UX)?
- [ ] At least two domains feel plausible?
- [ ] "Why" explanation is clear and defensible?
- [ ] Difficulty tag matches actual difficulty?
- [ ] Not too similar to an existing scenario?
