# Worked example — eRx backup-pharmacy transfer

Source scenario:

> A support agent wants to help the patient get their prescription sent to a
> backup pharmacy.

This example shows the ORCA process end to end, including where the skill
**stopped to ask** (the target behaviour was not described) and how the answers
reshaped the model.

## Gate hit: target behaviour undescribed → AskUserQuestion

The sentence gives an actor and a wish but no end state. Asking surfaced the real
behaviour:

> Agent **cancels** the previous eRx → **transfers a task** to the provider →
> the **provider resends** the eRx to a backup pharmacy that the **patient chose
> beforehand**.

And the CTA-design fork (bundle vs. discrete) resolved to: **keep cancel and
escalate as discrete agent actions** (cancellation stays explicit/auditable;
the provider resending is a hard constraint, not an efficiency choice).

## Object Model — eRx backup-pharmacy transfer

**Target:** The objects, their attributes, and their relationships mirror the
real-world domain they represent.

### Objects
- **Patient** — the person receiving care
- **eRx** — the electronic prescription
- **Pharmacy** — a dispensing location
- **Medication** — the drug an eRx points to
- **Task** — the hand-off the agent assigns to the provider
- **Provider** — the prescriber (actor; object if a profile is viewable)
- *Support Agent* — actor/role (drives CTAs; not a content object)

Note: "backup pharmacy" is **not** an object — it is *Pharmacy* in a role on the
Patient↔Pharmacy relationship.

### Relationships
| | Patient | eRx | Pharmacy | Medication | Task |
|---|---|---|---|---|---|
| **Patient** | — | has `1:many` | designates `many:many` *(primary/backup)* | mediated (via eRx) | — |
| **eRx** | | — | bound to `many:1` *(immutable)* | for `many:1` | subject of `1:many` |
| **Pharmacy** | | | — | stocks `many:many` | — |
| **Medication** | | | | — | — |
| **Task** | | | | | assigned to Provider `many:1` |

Notes:
- **eRx is immutable per pharmacy.** Moving a prescription is not a reroute/edit;
  it is *cancel the old eRx + issue a new one* — likely two eRx instances.
- **Pharmacy stocks Medication** is load-bearing: the backup is only valid if it
  carries the drug. The systematic matrix surfaced it; the obvious arrows missed it.

### CTAs
- **Agent** → *Cancel eRx*, *Transfer task to provider* (kept discrete)
- **Provider** → *Resend eRx* (to the backup pharmacy)
- **System**: links the cancellation to the created/assigned task
- **Pre-existing**: the patient designated the backup pharmacy beforehand — not a
  CTA in this behaviour

### Permissions (separate layer)
- **Agent**: cancel eRx + escalate (create/transfer task)
- **Provider**: resend eRx

### Attributes
- **Patient**: name, DOB, contact, insurance | metadata: designated pharmacies (primary/backup)
- **eRx**: medication, dosage, quantity, refills, prescriber, bound pharmacy | metadata: status (active → cancelled), date written
- **Pharmacy**: name, address, phone, stocked medications | metadata: id, role-on-patient (primary/backup)
- **Medication**: name, strength, form | metadata: class
- **Task**: type, subject (eRx), assignee (provider) | metadata: status, created-by (agent)

### Judgment calls
- Treated "cancel + resend" as **two eRx instances** (you cannot un-cancel an eRx),
  making eRx immutable-per-pharmacy with a status lifecycle.
- **Provider** included as an actor; promote to a full object only if a provider
  profile is something users view.
