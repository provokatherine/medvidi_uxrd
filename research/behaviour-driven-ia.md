# Research: Behaviour-Driven Information Architecture

**Question:** What established methodologies, frameworks, or heuristics exist for designing
information architecture that is driven by user behaviour and work patterns — not by domain
object structure?

Specifically: (1) How do you identify the right primary object / entry point? (2) How do you
evaluate IA alternatives against real workflows? (3) What are the established critiques of
entity-centric IA in enterprise/CRM software and what alternatives are proposed?

---

## Convergence finding

Four major frameworks converge on the same answer from different directions:

> **The entry point in an IA is defined by what triggers a work session — not by what is most
> important in the data model.**

A Patient is the most important entity in a healthcare CRM data model. But no support agent
opens the CRM thinking "I need to work on a patient." They open it thinking "I have a task to
resolve." The Task triggers the session; the Patient is context.

---

## Framework 1: Jobs-to-be-Done (JTBD)

**Key principle:** The job that triggers a session determines what appears on the home screen
and in primary navigation.

Ryan Singer (Intercom): "By looking at how jobs coexist and compete on the same screen,
designers can become sensitive to priority and hierarchy in an interface." The primary job gets
the big button; secondary jobs get the small link.

**Applied to IA:** If the job is "resolve a reported prescription issue," the home screen should
present a queue of open prescription issues — not a list of patients. The patient is accessed as
context while doing the job, not as a destination.

**Entity-centric IA as a JTBD failure:** "Website IA frequently reflects the company's internal
departments or product lists, not the actual goals users are trying to achieve." Entity-centric
navigation answers "what exists?" JTBD navigation answers "what are you trying to do right now?"

**Practical tool:** Job maps — the steps of a job become the structural logic of the IA.
Step 1 of the job = step 1 of the screen. If the steps require navigating to three different
entities to execute one job, the IA is broken.

**Sources:**
- Ryan Singer, "Thinking of interfaces as sets of jobs" (Medium)
- Intercom Blog, "Designing for clarity: How we restructured Intercom's information architecture"
- MRX Sivo Insights, "How JTBD Helps Mobile UX Teams Improve Navigation"

---

## Framework 2: OOUX — Object-Oriented UX (Sophia Prater, 2015)

**Key principle:** Primary objects are those users interact with most frequently and that
represent the primary value of the product. Importance in the domain model ≠ importance in the
IA.

**SIP validation:** Every object candidate must pass: Structure (has defined content schema),
Instances (has multiple discrete instances, not a singleton), Purpose (serves a user goal as a
focal point). Objects that fail the Purpose test are Reference or Context objects regardless of
their domain importance.

**CTA density as a proxy for primacy:** Objects that accumulate the most calls-to-action are
the focal points of work. Count CTAs per object to find the natural primary.

**Heterarchies over hierarchies:** OOUX explicitly rejects rigid hierarchy. Objects can be
ranked differently by actor group, scenario, and use case. "Situational prioritization" means
the same object can be Primary for one team (Task for support agents) and Context for another
(Task for a Provider who just prescribes and doesn't manage queues).

**Navigation naming:** Noun-based navigation labels are significantly easier to use than
verb-based. NNG research: median 10.6 seconds to find a page with noun labels vs. 19.8 seconds
with verb labels. Work-centric IA does not imply verb navigation — "Tasks" (noun) is the right
label, not "Resolve Issues" (verb phrase).

**Sources:**
- Sophia Prater, ooux.com; A List Apart, "Object-Oriented UX"
- LogRocket Blog, "Object-oriented UX (OOUX): A structured approach to UX design"
- MetriFi, "Usability test: Noun-based labels make websites nearly twice as easy to navigate"
- InfoQ Podcast, "Object-Oriented UX (OOUX) with Sophia Prater"

---

## Framework 3: Contextual Design (Beyer & Holtzblatt)

**Key principle:** The "work unit" emerges from consolidating five work models across users.
The IA should mirror that consolidated work structure — not the data structure.

**The five models:**
- **Flow model** — who communicates with whom; reveals social structure of the work unit
- **Sequence model** — steps to complete a task including triggers, loops, and breakdowns;
  the first step in the consolidated sequence model = the entry point of the IA
- **Artifact model** — structure of information objects users create or reference; directly
  maps to information grouping in navigation
- **Cultural model** — policy constraints affecting work
- **Physical model** — environment supporting work

**Applied to entry point selection:** Consolidate sequence models across all actors. The thing
that appears at the top of the most consolidated sequences — the trigger step across most
users — is the right entry point. For MEDvidi agents, that trigger is "I have a task to work on."

**Stress testing:** Walk the top-3 scenarios through candidate IA structures and count navigation
steps from load to first meaningful action. Flag any step where required context (patient info,
prescription status) is not visible without an extra lookup.

**Sources:**
- Beyer & Holtzblatt, Contextual Design (1997); 2nd ed. chapter in Encyclopedia of HCI
- ScienceDirect, "Contextual Design Model Overview"
- ResearchGate, "Contextual Design: Using Customer Work Models to Drive Systems Design"

---

## Framework 4: Activity Theory (Vygotsky → Leontiev → Engeström)

**Key principle:** The unit of analysis is the activity system — a group of people sharing a
common object and motive over time, plus the tools they need to act on that object.

**The "object" of activity ≠ the domain object:** In Activity Theory, "object" means the
shared thing the team is working toward — in MEDvidi, that's "a resolved patient issue." The
Task/Issue object in the CRM is the digital representation of that shared object. The Patient is
a mediating artefact, not the object of activity.

**Interface as mediating artefact:** "A computer is typically not an object of activity but
rather a mediating artifact — people interact with the world through computers." The interface
should support the activity's progression, not display domain entities.

**Division of labour maps to handoff:** The handoff moments between teams (support → provider
→ pharmacy) are the moments where the shared work object (Task) crosses system boundaries. The
IA must surface the shared work object at every handoff point.

**Applied to navigation:** Structure the IA around activity phases (intake, resolution, escalation,
closure) with the shared work object (Task) as the thread through all phases.

**Sources:**
- Engeström, "Learning by Expanding" (1987); Encyclopedia of HCI 2nd ed., Activity Theory chapter
- OpenEdition Journals, "Activity theory as a supportive framework in navigation design"
- NCSU Design School, "Unpacking Activity Theory"

---

## Framework 5: Enterprise UX / CRM-specific patterns

**Core critique:** "Many enterprise UX problems stem from UIs that mirror the data model too
closely, resulting in endless sequences of reports showing table contents and forms exposing
every column, regardless of relevance. Users are then forced to mentally assemble the task
themselves."

**The cost:** Entity-centric IA causes context-switching overhead estimated at 20–40% of
productive time. In enterprise software at scale, "saving someone 15 clicks a day could mean
saving a company millions per year."

**Established alternatives:**

| Pattern | Description | When it wins |
|---|---|---|
| **Work queue** | Home screen = queue of actionable items; entity info surfaces as context within the work item | High-volume processing, homogeneous tasks (support, approvals) |
| **Case management** | A Case (= Task/Issue) is the primary navigation object; all entities (customer, product, document) are panels within the case | Multi-step, multi-team work with a defined lifecycle |
| **Activity stream** | Chronological feed of events; actor picks up from the feed | Async, monitoring-heavy roles |
| **Role-based dashboard** | Home screen is personalized to the actor's primary job | Multiple distinct roles with non-overlapping primary tasks |

**Case management vs. record management:**
- Record management (entity-centric): navigate to Customer → see all their interactions →
  find the relevant issue → act. Works when the actor's job is "know everything about this customer."
- Case management (issue-centric): navigate to Case → see the customer as context within it → act.
  Works when the actor's job is "resolve this specific issue." MEDvidi support agents are case managers.

**Salesforce's pivot:** Salesforce Headless 360 decouples execution from interface, enabling
workflows to run inside Slack/Teams/WhatsApp without opening Salesforce. This is the logical
endpoint of work-first IA: the work object (notification, task) finds the actor, not the reverse.

**Sources:**
- Traust, "Task-Centered Enterprise UX Design"
- Traust, "Enterprise UX Design for Complex Workflows"
- CXToday, "Salesforce Headless 360 and the Future of CRM Interfaces"
- UX Mastery, "Object-focused vs Task-focused Design"

---

## Synthesis: How to find the primary object

These four frameworks converge on a four-question scoring rubric:

| Question | Framework | What to look for |
|---|---|---|
| **What triggers the session?** | JTBD | The job the actor is hired to do; the object associated with that job is the entry point |
| **What has the most CTAs?** | OOUX | Count direct CTAs per object; the action-densest object is the natural focal point |
| **What has a lifecycle?** | Activity Theory / OOUX | The object that advances through states as work progresses; lifecycle owners are natural case objects |
| **What crosses teams?** | Contextual Design flow model | The object that is handed off between teams defines the shared work unit; it must surface at every transition |

An object is **Primary** if it scores high on all four. An object is **Context** if it scores high
on content richness but low on CTAs and does not cross teams. An object is **Reference** if it
fails SIP Purpose — consulted, not acted upon.

---

## Implications for MEDvidi

Applying all four frameworks to the MEDvidi model:

- **JTBD trigger:** Support agents open the CRM to "resolve an assigned task." Task triggers.
- **CTA density:** Task accumulates CTAs from every team (create, assign, escalate, close).
- **Lifecycle owner:** Task has the richest status progression (Pending → In Progress → On Hold → Completed).
- **Cross-team handoff:** Task is the shared work object passed between Support, Provider, Pharmacy, MedOps.
- **Case management pattern match:** MEDvidi operations = case management. Every agent is resolving a case, not browsing patient records.

**Verdict from all five frameworks:** Task is the Primary object. Patient is Context. The IA
should be Task-centric.
