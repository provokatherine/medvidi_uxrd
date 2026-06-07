# Object Model — MEDvidi Clinical CRM (current state)

**Target:** The objects, their attributes, and their relationships mirror the
real-world domain they represent.

Sources: roles + scenarios spreadsheet (Numbers doc); screenshots of
prescription-issue workflows (Scenarios 1–3).

---

## Objects

- **Patient** — the person receiving care; the CRM's central record (system
  label: "Lead"); has demographics, contact info, state, and preferred
  pharmacies
- **Prescription (eRx)** — an electronic prescription binding one medication to
  one pharmacy per instance; carries a status lifecycle; immutable per pharmacy
  assignment
- **Medication** — the drug named in a prescription *(surfaced: implied by every
  eRx but not always stated explicitly)*
- **Pharmacy** — a dispensing location; can hold a primary or backup role
  relative to a patient — "backup pharmacy" is **not** a separate object; it is
  Pharmacy in a role on the Patient↔Pharmacy relationship
- **Appointment** — a scheduled clinical encounter linking patient, provider,
  and date; prescriptions are issued against it
- **Provider** — the clinician who prescribes and treats; appears as both actor
  (issues eRx, resolves tasks) and content object (profile viewable by staff)
- **Task** — a typed, prioritized, statused work item routed to support staff or
  a provider; the operational backbone of the prescription-issue workflows shown
  in the screenshots; currently carries multi-step instructions as free-text
  description
- **Insurance Claim** — a request to an insurer to cover medication cost; may
  require a Prior Authorization as a prerequisite
- **Prior Authorization** *(surfaced)* — an insurer pre-approval for a specific
  medication; may precede or travel alongside a claim
- **Medical Record** — the patient's consolidated clinical history; subject of
  subpoenas, PCP requests, and clinical letter requests
- **Letter** — a clinical or administrative document issued on behalf of a
  patient; subtype attribute carries: ESA, treatment, accommodation, discharge,
  clearance, EKG, good faith dispensing
- **Refund** — a financial reimbursement tied to a specific appointment; issued
  by the Refund team
- **Superbill** *(surfaced)* — a billing summary document the patient submits to
  their own insurer; distinct from a Refund (payment out vs. document for
  self-claim)
- **Phone Call** — a logged inbound or outbound call interaction linked to a
  patient; can trigger task creation

---

## Relationships

### Core matrix

| | Patient | Prescription | Medication | Pharmacy | Appointment | Provider | Task |
|---|---|---|---|---|---|---|---|
| **Patient** | — | has `1:many` | mediated via eRx | designates `many:many` *(primary/backup role on rel.)* | has `1:many` | treated by `many:1` | subject of `1:many` |
| **Prescription** | | — | specifies `many:1` | bound to `many:1` *(immutable)* | issued at `many:1` | written by `many:1` | subject of `1:many` |
| **Medication** | | | — | stocked by `many:many` | — | — | — |
| **Pharmacy** | | | | — | — | — | — |
| **Appointment** | | | | — | — | conducted by `many:1` | triggers `1:many` |
| **Provider** | | | | | | — | assigned `1:many` |
| **Task** | | | | | | | — |

**Notes:**
- **Prescription is immutable per pharmacy.** Moving a prescription is not a
  reroute or edit — it is cancel the old eRx + create a new one to the backup
  pharmacy. Two instances, not one edited record. Confirmed by Scenarios 1–3.
- **Primary/backup role lives on the Patient↔Pharmacy relationship**, not on
  the Pharmacy object itself.
- **Pharmacy stocks Medication** (many:many) is load-bearing: a backup
  substitution is only valid if that pharmacy carries the drug.

### Peripheral relationships

- Patient `1:many` → Insurance Claim
- Patient `1:1` → Medical Record
- Patient `1:many` → Letter
- Patient `1:many` → Refund
- Patient `1:many` → Superbill
- Patient `1:many` → Phone Call
- Insurance Claim `many:1` → Prior Authorization (PA may be required before claim)
- Insurance Claim `many:1` → Medication (claim covers a specific drug)
- Insurance Claim `many:1` → Pharmacy (claim initiated by a pharmacy)
- Refund `many:1` → Appointment
- Superbill `many:1` → Appointment
- Medical Record `1:many` → Letter (letters draw from or reference clinical record)

---

## CTAs

### Prescription issue workflow (Scenarios 1–3 in screenshots)

**Support Agent:**
- *Submit Prescription Issue* — creates a task when a pharmacy reports it can't fill
- *Cancel eRx* — requests cancellation of one or more prescriptions at the pharmacy
- *Assign Task to Provider* — escalates the prescription issue task to the prescribing provider
- *Send SMS to Patient* — notifies patient of re-prescription outcome
- *Close Task* — marks the prescription issue task resolved

**Provider:**
- *Re-prescribe / Accept* — issues a new eRx, typically to the backup pharmacy
- *Reject Re-prescription* (with note) — declines; triggers a new task back to support

**System (automatic):**
- Detects pharmacy no-response (> 5 min in "Cancel requested") → sets prescription
  status to "No response" → creates a new task for the support agent
- Tracks pharmacy approval of cancellation → sets prescription status to "Canceled"
- Propagates provider rejection note into the new task description

**Pre-existing (set before these CTAs run):**
- Patient has designated a preferred and backup pharmacy
- Appointment date, provider, and prescribed medications are already established

---

### Other team CTAs (from scenarios spreadsheet)

**Administrative Assistant:**
- *Verify Patient Identity* — confirm identity before any ePHI exchange
- *Reschedule Appointment* — update date/provider; change ZIP + preferred pharmacy if patient is in a different state
- *Contact Pharmacy* — resolve pharmacy issues (wrong name on file, out-of-stock, missing eRx)
- *Provision Patient on 3rd-party Platform* — DoseSpot, Questlab
- *Update Patient Information*

**Team Lead:**
- *Review Call Recording* — investigate low-rated calls

**Prior Authorization Agent:**
- *Submit Insurance Claim*
- *Submit Appeal or Additional Information*

**Medical Records:**
- *Reply to Subpoena*
- *Fulfill Medical Records Request*
- *Send Letter* — ESA, treatment, accommodation, discharge, clearance, EKG,
  good faith dispensing form

**Refund Team:**
- *Issue Refund*
- *Issue Superbill*
- *Appeal Dispute* — malicious chargebacks
- *Maintain Refund Report*

**Care Manager:**
- *Guide Patient on Medication Schedule / Adverse Reactions*

**Review Team:**
- *Analyze Patient Review*
- *Contact Patient for Positive Review*

**Tech Support:**
- *Assist Provider with Technical Issue*
- *Audit Care Quality*

**Sales Agent:**
- *Contact Patient for Sale*

---

## Permissions (separate layer)

| Role | Read | Edit / Act |
|---|---|---|
| Admin Assistant | Patient (full ePHI), Prescription, Pharmacy, Appointment, Provider | Update patient info, reschedule appointment, contact pharmacy |
| Customer Support Tier 1 | Patient (full ePHI), Prescription, Pharmacy, Provider, Task | Log pharmacy issue, share ePHI with pharmacy, create/close task |
| Prior Authorization | Patient (partial ePHI), Insurance Claim, Medication | Submit claim, submit appeal |
| Medical Records | Patient, Medical Record, Letter | Create/send letter, reply to subpoena |
| Refund Team | Patient, Appointment, Refund, Superbill | Issue refund, issue superbill, appeal dispute |
| Care Manager | Patient, Appointment, Provider | Guide patient |
| Provider | Patient (clinical ePHI), Prescription, Appointment, Task | Accept/reject re-prescription, create eRx |
| Sales | Patient (Lead History, State) | Contact patient |
| Tech Support | Patient (minimal), Appointment, Provider | Assist provider, audit care quality |
| Engineering | System logs | Platform maintenance |
| Finance | Appointment, Refund | Financial audit |

---

## Attributes

- **Patient**: First Name, Last Name, DOB, Gender, Email, Phone, Address/ZIP,
  State | metadata: Patient ID, Face Photos, Lead History (CRM activity log),
  Preferred Pharmacy (primary/backup), Discharge Date, Health Plan Number,
  Sex, Timezone

- **Prescription (eRx)**: Medication, Dosage, Quantity, Pharmacy, Prescriber,
  Appointment | metadata: status (`Active → Cancel requested → No response →
  Canceled manually` or `Canceled`), Date prescribed

- **Medication**: Name, Strength, Form | metadata: drug class

- **Pharmacy**: Name, Address, Phone | metadata: Pharmacy ID, role-on-patient
  (primary / backup)

- **Appointment**: Date, Provider, Patient | metadata: status (scheduled /
  completed / rescheduled)

- **Provider**: Name, Specialty, License | metadata: Provider ID, EHR task queue

- **Task**: Type (e.g. Prescription issue), Title, Description (currently
  carries multi-step instructions as free text), Rejection Reason, Pharmacy
  context, Backup pharmacy context, Medication list | metadata: Priority
  (Highest / High / Medium / Low), Status (pending → in progress → completed),
  Assignee (support team or Provider), Created by, Created at

- **Insurance Claim**: Patient, Medication, Pharmacy, Health Plan Number |
  metadata: status (submitted → approved / denied), Prior Auth required flag

- **Prior Authorization**: Patient, Medication, Insurance Company | metadata:
  status (requested → approved / denied)

- **Medical Record**: Patient, Clinical History, ICD Codes, Medications |
  metadata: last updated

- **Letter**: Patient, Letter Type, Content | metadata: Sent date, Sent by,
  Provider reference

- **Refund**: Patient, Appointment, Amount, Reason | metadata: status (pending
  → issued / denied), linked Refund Report entry

- **Superbill**: Patient, Appointment, Itemized Services, ICD/CPT codes |
  metadata: issued date

- **Phone Call**: Patient, Direction (inbound / outbound), Duration, Recording |
  metadata: date, rating, agent

---

## Judgment calls

1. **Patient = Lead.** MEDvidi's system label "Lead" maps to "Patient" in the
   real-world domain. The model uses "Patient." Confirm whether an unconverted
   prospect (before their first appointment) is a distinct object or just
   Patient at an early lifecycle status.

2. **Prescription is immutable per pharmacy.** Derived from the cancel +
   re-prescribe mechanism visible in Scenarios 1–3. Confirm: is there ever a
   path where an existing eRx is rerouted (edited in place) rather than
   cancelled and reissued?

3. **Letter subtypes are one object with a `type` attribute.** ESA, treatment,
   accommodation, discharge, clearance, EKG, and good faith dispensing letters
   are modeled as instances of Letter. Elevate any subtype to its own object if
   its attribute set or CTAs diverge significantly from the others.

4. **Prior Authorization as a standalone object.** If PA is always an internal
   step inside a claim submission, it may be a status on Insurance Claim rather
   than its own object. Confirm whether PA has an independent lifecycle (e.g.
   requested and tracked before a claim is even submitted).

5. **Superbill vs. Refund are separate objects.** Refund = MEDvidi pays the
   patient back. Superbill = MEDvidi provides a document so the patient can
   claim reimbursement from their own insurer. Confirm if this distinction holds
   in practice.

6. **Task carries informal checklists.** Screenshots show task descriptions like
   "Cancel initial prescription, assign task to provider, make sure prescription
   arrived at pharmacy" — multi-step instructions in free text. This is a
   current-state observation about implementation, not a model decision.
