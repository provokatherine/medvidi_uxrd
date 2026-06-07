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

## Inputs — interview first

Do not wait for the user to paste scenarios upfront. Open with a structured
interview using `AskUserQuestion`, one question at a time:

1. **Domain + actors** — what system or domain are we modelling, and who are
   the main people using it?
2. **Scenarios** — for each major actor: walk me through what they are trying
   to accomplish (one concrete situation per question).
3. **Friction** — what blocks, complicates, or goes wrong in that scenario?

Proceed to ORCA once you have at least one scenario per major actor. If a file
or screenshots are shared, read them before asking anything — extract what you
can, then ask only for what is still missing.

## Step-validation gates

After each ORCA round, **stop and present what you have** using `AskUserQuestion`
before moving to the next round. Show the user the extracted output and ask:
- Are any objects here wrong or not real? (after Objects)
- Does the nesting and priority look right? (after Nested Objects Matrix)
- Are any relationships missing or mis-labelled? (after Relationships)
- Are any actor actions missing or should they be system-handled? (after CTAs)

Deliver Attributes and the final diagram without a further gate — by that point
the model is stable enough. Do **not** ask about every judgment call; flag them
in the artifact and move on.

## Process — ORCA

Run the rounds in order. Each is a distinct discipline; do not collapse them.

### 1. Objects — noun foray + disqualifying tests
Pull the nouns from the source text. Keep only true objects: things with
instances, structured content, recognizable to users. Discard nouns that are
really attributes (belong *to* an object) or CTAs (are actions). Surface objects
the domain requires even if absent from the sentence (e.g. a prescription
implies a prescriber and a medication), and mark them as surfaced.

After the initial foray, apply two disqualifying tests to every candidate:

**Test 1 — Status-as-object.** If the noun names a lifecycle state that another
object passes through (e.g. "Refund" = a terminal state of a payment record,
"Cancellation" = a prescription status), discard it as an object. Record it as a
status value in that object's metadata instead.

**Test 2 — Group-as-object.** If the noun names a collection of other objects
rather than a thing with its own structure and lifecycle (e.g. "Medical History"
= a view over appointments + prescriptions + documents, "Inbox" = a list of
messages), discard it as an object. Its contents are already captured as other
objects or attributes; the grouping is a UI concern, not a domain object.

Watch for **roles masquerading as objects**: "backup pharmacy" is not a new
object — it is the *Pharmacy* object in a role on a relationship. One kind of
thing in two roles keeps the model matched to the real world.

> **Step gate:** Present the surviving object list. Ask the user to confirm,
> remove, or add before proceeding.

### 1b. Nested objects matrix — priority and hierarchy
Build a matrix of every surviving object × every surviving object. For each
cell ask: "Does the row object contain or display the column object within its
own detail view?" Mark containment; leave the rest empty.

Read the matrix for priority:

- **Key objects** — appear in many rows as containers; users navigate to them
  directly. These lead the model and the diagram.
- **Component objects** — appear primarily as nested content inside other
  objects; real but secondary.
- **Candidates for demotion** — appear nested in only one object, have no
  standalone CTAs, no meaningful lifecycle separate from the parent → demote to
  attribute or relationship, remove from object list.

> **Step gate:** Present the nesting matrix and the resulting priority order.
> Ask the user whether the hierarchy looks right before proceeding.

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

> **Step gate:** Present the relationship matrix. Ask the user whether any links
> are missing, mislabelled, or have the wrong cardinality before proceeding.

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

> **Step gate:** Present CTAs grouped by actor. Ask the user whether any actions
> are missing or should be handled by the system instead of a human before
> proceeding.

### 4. Attributes — core content + metadata
For each object, list its attributes: **core content** (what the object *is*)
and **metadata** (status, dates, ids, classifications). A lifecycle status
belongs here when a CTA changes state (e.g. eRx status: active → cancelled).

## Output format

Emit the object model as Markdown with these sections. (Approved generic
OOUX object-map format; this is the load-bearing artifact.)

```
# Object Model — <domain / scenario name>

**Target:** The objects, their attributes, and their relationships mirror the
real-world domain they represent.

## Schema
[mandatory Mermaid diagram — see below]

## Objects
- <Object> — <one line>; mark (surfaced) if not in the source text
- Key objects listed first (highest nesting depth in the nested objects matrix)

## Nested Objects Matrix
| | A | B | C |
|---|---|---|---|
| A | — | contains | — |
...
- Key: B appears within A's detail view

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

## Judgment calls
- <any assumption or modelling decision flagged for the user>
```

### Mandatory diagram

Always produce a Mermaid `flowchart` diagram and render it before delivering
the artifact. Embed it in the `## Schema` section as a fenced `mermaid` block.

Rules for the diagram:
- Order nodes by priority: key objects first (top or left), component objects
  below or to the right.
- Group objects into named subgraphs by domain cluster (e.g. Clinical,
  Operations, Patient Record).
- Use `==>` for immutable relationships, `-->` for structural, `-.->` for
  optional/escalation/logging, `<-->` for bidirectional roles.
- Include an edge key as a blockquote below the diagram.
- Style key objects visually distinct (darker fill) from component objects.

Render using `npx @mermaid-js/mermaid-cli` with
`-p <puppeteer-config-with-no-sandbox>` when running in a headless environment.
Save the SVG alongside the markdown and send it to the user.

## Reference

A fully worked example (the eRx backup-pharmacy scenario) is in
`references/example.md`.
