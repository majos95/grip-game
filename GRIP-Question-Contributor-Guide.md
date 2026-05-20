# Got GRIP? — Question Contributor Guide

## What Is This Game?

"Got GRIP?" is a timed classification game for our conference booth. Players read short business problem scenarios and classify each one into the right solution domain. The game reveals whether someone can tell the difference between a design problem, a systems problem, and an AI problem.

We need more scenarios. This document explains the three domains and what makes a good question so you can contribute.

---

## The Three Domains

Every scenario in the game has one correct domain. The player has to figure out which one.

### Experience (Red)

The application works technically. The data is correct. But people can't use it properly, don't trust it, or build workarounds. The fix is better design, not more technology.

Think: UX problems, adoption failures, workflow friction, trust issues with working systems.

### Foundation (Blue)

The systems are broken, disconnected, or can't keep up. Data is inconsistent, integrations are fragile, or the architecture doesn't scale. No amount of redesign or AI fixes bad plumbing.

Think: Data quality, integration gaps, legacy constraints, performance, architecture debt.

### Intelligence (Purple)

The task genuinely requires reasoning, natural language understanding, or pattern recognition over unstructured data at scale. An AI agent is the right tool, not a shortcut or a buzzword.

Think: Unstructured documents, multi-language input, complex triage, pattern detection across thousands of records.

---

## What Makes a Good Scenario?

A good scenario describes a **real business problem in 1-2 sentences**. The player reads it and decides which domain it belongs to.

The best scenarios have a **built-in misdirection**: the symptom points to one domain, but the root cause is in another. This is what makes classification challenging and educational.

Rules:
- Keep it under 200 characters
- Be concrete: include an industry, a role, or a number
- Describe the situation, not the solution
- Avoid giveaway words like "interface", "integration", or "AI" in the text
- At least two domains should feel plausible at first glance

---

## Example Scenarios

### Experience (Red) Examples

**"A hospital's patient intake form collects 47 fields. Nurses enter fake data in optional fields to get past validation during peak hours."**

Why this is a good question: Most people's instinct is Foundation (the validation rules are wrong) or Intelligence (auto-fill with AI). But the real problem is that the form doesn't adapt to context. During peak hours, nurses need a faster flow. This is a progressive disclosure and context-aware design problem.

Answer: Experience (Red)
Primary decoy: Intelligence ("AI could auto-fill the fields")

---

**"Your AI fraud detection catches 95% of fraudulent transactions. The fraud team still reviews every flagged case manually because they don't trust it."**

Why this is a good question: The model works at 95% accuracy. Almost everyone says Intelligence ("improve the model"). But the real issue is how confidence scores are presented to the fraud team. If they had clear explainability, confidence levels, and escalation criteria in their interface, they'd trust the automation. It's a UX problem in how AI results are communicated.

Answer: Experience (Red)
Primary decoy: Intelligence ("the model needs to be better")

---

**"A manufacturing quality control app flags defects accurately, but floor supervisors override 60% of flags without investigation."**

Why this is a good question: The detection is accurate. The problem isn't the system's judgment, it's that supervisors don't trust it or the cost of investigating every flag seems too high relative to how alerts are presented. Better alert prioritization and confidence visualization would change behavior.

Answer: Experience (Red)
Primary decoy: Intelligence ("the detection model has too many false positives")

---

### Foundation (Blue) Examples

**"An e-commerce platform's recommendation engine gives great suggestions on the website but terrible ones in the mobile app, using the same model."**

Why this is a good question: Same model, different results. Everyone's first instinct is Intelligence ("the model needs mobile-specific training"). But if the model is identical, the difference must be in the input data. The mobile app is likely sending incomplete or different user behavior data. The model is fine; the data pipeline from mobile is broken.

Answer: Foundation (Blue)
Primary decoy: Intelligence ("tune the model for mobile context")

---

**"A retail chain uses AI to personalize marketing emails. Open rates are high, but conversion is 0.3% because recommended products are often out of stock."**

Why this is a good question: The AI personalization clearly works (high open rates prove people are interested). The failure is downstream: inventory data is stale or disconnected from the marketing system. The agent recommends products that don't exist on the shelf. This is a data integration problem, not a model problem.

Answer: Foundation (Blue)
Primary decoy: Intelligence ("the recommendation model needs better product data")

---

**"Your HR department wants to use AI to screen CVs. Your historical hiring data shows you've only ever hired graduates from 4 universities."**

Why this is a good question: The instinct is to jump to bias in AI or to say the AI model needs correction. But the root cause is that the training data itself reflects a biased process. If you train on this data, you amplify the bias. The problem predates AI entirely. Fix the data and the hiring process, then consider automation.

Answer: Foundation (Blue)
Primary decoy: Intelligence ("use AI with bias correction algorithms")

---

### Intelligence (Purple) Examples

**"A law firm receives 200 contracts per week from different clients, each in a different template. Paralegals spend 4 hours per contract extracting key dates and clauses."**

Why this is a good question: Someone might say Foundation ("standardize the templates") or Experience ("build a better extraction form"). But the reality is that you can't control 200 different clients' templates. The task requires reading comprehension, entity extraction, and contextual judgment across varied document formats. This is what agents with document understanding are built for.

Answer: Intelligence (Purple)
Primary decoy: Foundation ("standardize contract templates across clients")

---

**"A construction company has 20 years of project post-mortems in PDF. New project managers keep repeating the same mistakes because nobody reads the archives."**

Why this is a good question: The decoy is Foundation ("digitize and structure the archives into a database"). That sounds reasonable, but structuring 20 years of free-text PDFs into a database is itself an AI task. And even if you did, the real value is contextual retrieval: surfacing relevant lessons when a new project starts, matching past failures to current conditions. This is a retrieval-augmented generation (RAG) use case.

Answer: Intelligence (Purple)
Primary decoy: Foundation ("build a structured knowledge base")

---

**"A customer service team handles product returns. Each case requires cross-checking warranty terms, purchase dates, damage photos, and policy exceptions. 25 minutes per case."**

Why this is a good question: The decoy is Experience ("streamline the returns interface"). But the core task is multimodal: analyzing damage photos, reading warranty policy documents, checking dates, and applying policy exceptions that vary per case. An agent can combine vision and language understanding to recommend a decision in seconds.

Answer: Intelligence (Purple)
Primary decoy: Experience ("redesign the returns workflow UI")
