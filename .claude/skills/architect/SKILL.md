---
name: architect
description: >-
  Brainstorm and recommend the optimal information architecture for a product
  given an extracted object model. Use when the user wants to know: what should
  be the primary navigation unit, how should the UI be structured around real
  interaction patterns, which object is the entry point vs. context, or whether
  the current IA matches how users actually work. Triggers on phrases like
  "design the IA", "what should the product be built around", "brainstorm the
  structure", "what's the right entry point", "optimize the IA", "architect
  the product", "what should be at the centre".
---

# IA Architect

Given an extracted object model, find the optimal information architecture for
the product — which object is the primary entry point, how others nest as
context, and why.

## Fixed target

> **The IA matches how actors actually trigger and progress through work —
> not how the domain is modelled in the real world.**

An ER model mirrors reality. An IA mirrors behaviour. These are different
optimizations; this skill does the second. A patient-centric ER model does not
imply a patient-centric IA.

## Theoretical grounding

The analysis draws on four converging frameworks. Each asks a distinct question
about the same objects:

| Framework | Question it answers | Applied in |
|---|---|---|
| **Jobs-to-be-Done** (Singer, Intercom) | What job triggers the session? The object that answers that job is the entry point. | Step 1 — Trigger column |
| **OOUX** (Sophia Prater) | Which object accumulates the most CTAs and passes SIP (Structure, Instances, Purpose) with a Purpose as a work focal point? | Step 1 — CTA density + SIP pre-filter |
| **Contextual Design** (Beyer & Holtzblatt) | What appears at the top of the consolidated sequence model — i.e. the first step across all users? | Step 1 — Trigger; Step 3 — stress test |
| **Activity Theory** (Engeström) | What is the shared work object the whole team acts upon over time, and what crosses team boundaries as work progresses? | Step 1 — Lifecycle + cross-team handoff columns |

These frameworks converge: the Primary object is the one that **triggers work sessions,
carries the lifecycle, accumulates actions, and crosses teams**. Domain importance alone
does not make an object primary.

**Navigation naming note:** Noun-based labels are empirically faster to navigate than verb
phrases (10.6 s vs. 19.8 s median — NNG research). A work-centric IA does not mean verb
navigation. The primary object should be named as a noun: "Tasks" not "Resolve Issues."

## Scope

In: an object model (from `/extract`) + scenario/CTA source → IA recommendation.
Out: visual design, component spec, navigation implementation, copy.

If no object model exists in the `models/` directory, stop immediately and
tell the user to run `/extract` first.

## Inputs

1. Read the existing object model from `models/`.
2. Read the original scenario source if still available (same file used by
   `/extract`) — it carries the raw actor behaviour that the model abstracts.

## Process

### Progress lines — emit before each step

- `[Architect] Reading model…`
- `[Architect] Step 1 — Entry object analysis…`
- `[Architect] Step 2 — IA candidates…`
- `[Architect] Step 3 — Stress test…`
- `[Architect] Collecting forks…`
- `[Architect] Asking forks…` *(only if AskUserQuestion called)*
- `[Architect] Writing recommendation…`

---

### Step 1 — Entry object analysis

**SIP pre-filter:** Before scoring, eliminate objects that fail the Purpose test.
An object passes SIP if it has **Structure** (defined content schema), **Instances**
(many discrete instances, not a singleton), and **Purpose** (is a focal point of
actor goals — not just consulted as a lookup). Objects that fail Purpose are
Reference objects and cannot be Primary. Apply this as a filter, not a score.

For **every object that passes SIP**, score it on four dimensions:

| Dimension | Framework | What to look for |
|---|---|---|
| **Trigger job** | JTBD | What job does the actor perform when they interact with this object? Does a session *begin* because this object has something to do? Write the job in one phrase: "resolve a reported issue", "look up patient history", "check drug stock." Jobs that start sessions = Primary trigger. |
| **CTA density** | OOUX | Count CTAs in the model that live directly on this object. High count = natural action focal point. |
| **Lifecycle ownership** | Activity Theory / OOUX | Does this object carry a status that advances as work progresses (pending → resolved)? Lifecycle owners are natural case objects. |
| **Cross-team handoff** | Contextual Design | Does this object pass between teams as work advances? If yes, it is the shared work unit — it must surface at every handoff boundary. |

Classify each object:

- **Primary** — triggers sessions, action-dense, owns the lifecycle, crosses teams.
  The IA should centre on this.
- **Context** — looked up to inform action on the Primary; few direct CTAs; stable
  while work happens. Surfaces as a panel or tab within the Primary screen.
- **Reference** — failed SIP Purpose, or: static catalogue data consulted rarely.
  Accessible via global search, not primary navigation.

Produce a scored table. Be explicit when an object that looks "important" in
the domain model scores as Context in the IA (e.g. Patient may be central to
the ER model but Context in the IA if actors never start from it).

---

### Step 2 — IA candidates

Generate exactly **three** structural alternatives. Name each by its primary
object (e.g. "Task-centric", "Patient-centric", "Document-centric").

For each candidate write:

- **Entry point**: What the actor sees on load; what they navigate to first.
- **Context placement**: How Primary objects surface their Context objects
  (sidebar, tab, drawer, embedded panel, separate route).
- **Serves well**: Name one actor group whose workflow maps cleanly onto this
  structure.
- **Serves poorly**: Name one actor group for whom this structure adds friction.
- **Structural risk**: The one thing that breaks or becomes awkward if this IA
  is chosen at scale.

Do not invent candidates to fill the quota — if only two are genuinely
distinct, say so and explain why the third collapses into one of them.

---

### Step 3 — Stress test

Select the **3 most common or highest-stakes scenarios** from the source
(or from the CTA list in the model). Walk each scenario through each IA
candidate using the Contextual Design stress-test method:

- Count navigation steps from load to first meaningful action.
- Note whether the required context (patient info, prescription status,
  prior notes) is visible without an extra lookup.
- Flag any step where the actor must hold information in their head because
  the IA does not surface it ("mental load" — a Contextual Design breakdown marker).

Summarise as a matrix:

| Scenario | Candidate A | Candidate B | Candidate C |
|---|---|---|---|
| <scenario> | N steps — <friction note> | … | … |

---

### Step 4 — Recommendation

State the recommended IA. No hedging. Support it with:

1. The entry object analysis result that drove the choice — name the framework(s)
   that confirm it (JTBD: session trigger; OOUX: CTA density; Activity Theory:
   lifecycle + cross-team; Contextual Design: sequence model head).
2. The stress-test result that confirms it.
3. The one real trade-off it makes — name who is underserved and state the
   mitigation (a secondary entry point, a search shortcut, a role-specific
   default view).

Produce a **containment / hierarchy diagram** in Mermaid showing how objects
nest in the recommended IA. This is not an ER diagram — it shows the UI
hierarchy: what is a screen, what is a panel, what is a tab, what is a
linked record.

---

## Gates — when to stop and use AskUserQuestion

1. **Two candidates are genuinely tied** on friction and serve different but
   equally important actor groups. Ask which actor group is the product's
   primary user before recommending.
2. **A structural assumption is unconfirmed.** If the recommendation requires
   something not in the model (e.g. "tasks always belong to exactly one
   patient") and it cannot be inferred, ask before proceeding.

Outside these gates, reason to a conclusion. Do not ask permission to have an
opinion.

---

## Output format

```
# IA Recommendation — <product name>

**Target:** The IA matches how actors actually trigger and progress through work.

## Entry object scoring

| Object | SIP Purpose? | Trigger job | CTA density | Lifecycle? | Cross-team? | Classification |
|---|---|---|---|---|---|---|
| … | Pass / Ref | "<job phrase>" | N | Y/N | Y/N | Primary / Context / Reference |

Key insight: <one sentence naming the Primary object, the trigger job that
confirms it, and why the obvious domain-central object scores as Context instead>

## IA candidates

### Option A — <Object>-centric
- **Entry point**: …
- **Context placement**: …
- **Serves well**: …
- **Serves poorly**: …
- **Structural risk**: …

### Option B — <Object>-centric
…

### Option C — <Object>-centric
…

## Stress test

| Scenario | Option A | Option B | Option C |
|---|---|---|---|
| … | N steps — note | … | … |

## Recommendation

**Option [X] — <Object>-centric**

<Two-sentence rationale. First sentence: entry object score + which frameworks
confirm it. Second sentence: stress-test result.>

Trade-off: <who is underserved> — mitigated by <what>.

## Proposed UI hierarchy

```mermaid
graph TD
  Home["Home — <Primary object> queue / list"]
  Home --> PrimaryRecord["<Primary> record"]
  PrimaryRecord --> ContextA["<Context object A> panel"]
  PrimaryRecord --> ContextB["<Context object B> tab"]
  PrimaryRecord --> Actions["CTAs: <list>"]
  Home --> GlobalSearch["Global search → <Reference/Context object>"]
  GlobalSearch --> ContextRecord["<Context> record"]
  ContextRecord --> LinkedPrimary["Linked <Primary objects>"]
```
```
