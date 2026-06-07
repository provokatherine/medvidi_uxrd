---
name: extract
description: >-
  Build an OOUX object model (a mental model) from scenarios or raw user input.
  Use when the user wants to map a domain into objects, relationships, CTAs, and
  attributes; turn user stories / situations / behaviours into an information
  architecture; run the ORCA process; or produce an object map. Triggers on
  phrases like "model this domain", "OOUX", "object map", "build the mental
  model", "extract objects/relationships", "ORCA". Extractor only — it does not
  review or audit an existing product.
---

# OOUX Extract

Build an object model from scenarios or raw input by running the ORCA process.
The output is the **mental model**: the objects of a domain, how they relate,
what can be done with them, and what they are made of.

## Fixed target

This never changes and is not inferred per run. Everything the skill produces
is in service of one goal:

> **The objects, their attributes, and their relationships mirror the structure
> of the real-world domain they represent.**

State this target once at the top of every artifact so the standard is auditable.

## Scope

In: scenarios or raw input → object model. Out: reviewing a live product,
diffing against an existing IA, evaluating flow, copywriting. This skill builds
the *ideal* model only.

## Inputs

- A scenario/situation-behaviour artifact if one exists — read it.
- Otherwise raw situations, user stories, or behaviours the user pastes in.

## Gates — when to stop and use AskUserQuestion

Do **not** guess past these. Use the `AskUserQuestion` tool when:

1. **Target behaviour is not described.** A scenario names an actor and a wish
   ("a support agent wants to help the patient...") but not the desired end
   state or who/what enacts it. Ask before deriving any CTA.
2. **Input is raw and ambiguous.** Competing readings of what an object is, who
   acts, or what "done" means. Ask to refine before modelling.
3. **A CTA design has a genuine fork.** When two action designs both drive the
   behaviour but trade efficiency against a real constraint (e.g. bundling
   steps vs. keeping a clinical/legal action explicit and audited), ask rather
   than assume.

Outside these gates, extract first. After completing all four ORCA rounds,
collect every genuine modelling fork you encountered, then ask them — see
"Judgment calls" below.

## Process — ORCA

Run the rounds in order. Each is a distinct discipline; do not collapse them.

### Progress — emit a status line before each step

Before starting each step, emit a single line so the user can follow along:

- `[Extract] Reading inputs…`
- `[Extract] Round 1 — Objects…`
- `[Extract] Round 2 — Relationships…`
- `[Extract] Round 3 — CTAs…`
- `[Extract] Round 4 — Attributes…`
- `[Extract] Collecting judgment calls…`
- `[Extract] Asking judgment calls…` *(only if AskUserQuestion is called)*
- `[Extract] Writing artifact…`

Emit the line in plain text **before** doing the work for that step — do not
batch or defer updates to the end.

### 1. Objects — noun foray
Pull the nouns from the source text. Keep only true objects: things with
instances, structured content, recognizable to users. Discard nouns that are
really attributes (belong *to* an object) or CTAs (are actions). Surface objects
the domain requires even if absent from the sentence (e.g. a prescription
implies a prescriber and a medication), and mark them as surfaced.

Watch for **roles masquerading as objects**: "backup pharmacy" is not a new
object — it is the *Pharmacy* object in a role on a relationship. One kind of
thing in two roles keeps the model matched to the real world.

### 2. Relationships — systematic pairwise matrix
Build a matrix of **every object × every object** and check each cell
deliberately. This is the discipline — checking every pair, not free-associating
the obvious arrows. The systematic pass surfaces load-bearing relationships the
obvious ones miss (e.g. *Pharmacy stocks Medication* matters the moment a
prescription must move to a backup that may not carry the drug).

For each existing relationship, name the link and set **cardinality** (1:1,
1:many, many:many). Note when a relationship is **immutable per instance** (e.g.
an eRx is bound to one pharmacy for its lifetime — changing pharmacy means a new
instance, not an edit), and when a role lives on the relationship rather than on
an object (primary/backup).

### 3. CTAs — generative design, not decomposition
CTAs are **not** a function of behaviour + permission. They are the action set,
brainstormed to **drive the target behaviour most efficiently**.

- Start from the underlying mechanism (the literal steps the behaviour requires),
  then design the CTAs that reach that outcome with the least friction.
- Push **mechanical, system-capable steps to the system** — do not assume a
  human CTA for work software can do. Setting a pre-chosen backup pharmacy, or
  linking a cancellation to a follow-up task, can be system work.
- Keep a step a **discrete human CTA** when a real constraint demands it
  (explicit confirmation, audit, legal requirement, mandatory actor). When
  efficiency and such a constraint conflict, that is a gate — ask.
- Group CTAs by **actor**, and note which steps the system handles and which
  are pre-existing (not a CTA here).

**Permissions are a separate, decoupled layer.** Record who may perform each CTA
(view / edit / delete) separately; do not fold permissions into CTA derivation.

### 4. Attributes — core content + metadata
For each object, list its attributes: **core content** (what the object *is*)
and **metadata** (status, dates, ids, classifications). A lifecycle status
belongs here when a CTA changes state (e.g. eRx status: active → cancelled).

## Judgment calls — resolve before writing

After completing all four ORCA rounds, before writing the artifact:

1. **Collect** every genuine modelling fork: decisions where two designs are
   both defensible but produce structurally different models, and where the
   right answer depends on domain context only the user holds. Minor calls with
   a clear default do not qualify — make the call yourself and note it inline
   in the artifact.

2. **Formulate** each fork as a question with 2–4 concrete options. Option text
   must be self-contained — the user should not need to read the draft model to
   understand the choice.

3. **Call `AskUserQuestion`** with up to 4 questions per call. If there are more
   than 4, chain a second call after the first resolves.

4. **Incorporate the answers** into the artifact. Write the artifact once, after
   all questions are resolved. Do not write a draft and then revise it.

## Output format

Emit the object model as Markdown with these sections. (Approved generic
OOUX object-map format; this is the load-bearing artifact.)

```
# Object Model — <domain / scenario name>

**Target:** The objects, their attributes, and their relationships mirror the
real-world domain they represent.

## Objects
- <Object> — <one line>; mark (surfaced) if not in the source text

## Relationships
| | A | B | C |
|---|---|---|---|
| A | — | <verb> `card` | ... |
...
- Notes: immutable-per-instance, roles-on-relationship, etc.

## CTAs
- <Actor> → <CTA>, <CTA>
- System: <mechanical steps handled automatically>
- Pre-existing: <state set beforehand, not a CTA here>

## Permissions (separate layer)
- <Actor>: <view/edit/delete on which objects>

## Attributes
- <Object>: <core content> | metadata: <status, dates, ids>
```

## Reference

A fully worked example (the eRx backup-pharmacy scenario) is in
`references/example.md`.
