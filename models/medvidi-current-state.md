# Object Model — MEDvidi Support Operations (current state)

**Target:** The objects, their attributes, and their relationships mirror the
real-world domain they represent.

Sources: roles + scenarios spreadsheet (Numbers doc, 12 teams, 35 scenarios);
screenshots of prescription-issue workflows (Scenarios 1–2).

---

## Objects

- **Patient** — the person receiving care; central record in the CRM; the CRM
  label "Lead" is not a separate domain object — it maps to Patient (for
  identity and contact) or Visit (for the clinical encounter) or Payment (for
  the transaction), depending on which data is referenced
- **Visit** — one scheduled clinical encounter linking patient, provider, and
  date; the CRM's "Lead" is one successful visit; prescriptions are issued at
  a visit
- **Payment** *(surfaced)* — the financial transaction associated with a visit;
  distinct from Refund (which is a reversal); the third thing the CRM "Lead"
  maps to
- **Prescription (eRx)** — an electronic prescription binding one medication
  to one pharmacy per instance; status lifecycle is carried as attributes;
  immutable per pharmacy assignment
- **Medication** *(surfaced)* — the drug named in a prescription; relevant when
  a pharmacy cannot stock it and a backup must carry the same drug
- **Pharmacy** — a dispensing location; a patient may designate primary and
  backup roles — "backup pharmacy" is not a separate object; it is Pharmacy in
  a role on the Patient↔Pharmacy relationship
- **Provider** — the clinician who prescribes and treats; appears as both actor
  (issues eRx, resolves tasks) and content object (profile viewable by staff)
- **Task** — a typed, prioritized, statused work item routed to a support team
  or a provider; types: Prescription Issue, Refund, Care Quality Audit,
  Discharge, Tech Issue; one object with a Type attribute
- **Document** — any clinical record or outbound correspondence; one object
  with a Type attribute covering: Medical Records, ESA Letter, Treatment
  Letter, Accommodation Letter, Discharge Letter, Clearance Letter, EKG Letter,
  Good Faith Dispensing form, Superbill; each type may have different recipients
  and permissions but the same structural schema
- **Insurance Claim** — a request to an insurer to cover medication cost;
  includes Prior Authorization tracking as a status on the claim
- **Health Plan** *(surfaced)* — the patient's insurance coverage; referenced
  by Insurance Claims
- **Refund** — a financial reversal tied to a specific visit; issued by the
  Refund team; distinct from Payment (reversal vs. original charge) and from a
  Superbill Document (document for self-claim vs. payment out)
- **Call** — a logged inbound or outbound phone interaction linked to a
  patient; carries a rating; auditable by Team Leads and MedOps
- **Review** *(surfaced)* — an online patient review about MEDvidi on external
  platforms; tracked and responded to by the Review Team

---

## Relationships

### Core matrix

| | Patient | Visit | Prescription | Medication | Pharmacy | Provider | Task |
|---|---|---|---|---|---|---|---|
| **Patient** | — | has `1:many` | has `1:many` | mediated via eRx | designates `many:many` *(primary/backup role on rel.)* | treated by `many:1` | subject of `1:many` |
| **Visit** | | — | generates `1:many` | — | at one *(immutable per instance)* | conducted by `many:1` | triggers `1:many` |
| **Prescription** | | | — | specifies `many:1` | bound to `many:1` *(immutable per instance)* | written by `many:1` | referenced by `many:1` |
| **Medication** | | | | — | stocked by `many:many` | — | — |
| **Pharmacy** | | | | | — | — | — |
| **Provider** | | | | | | — | assigned `1:many` |
| **Task** | | | | | | | — |

**Notes:**
- **Prescription is immutable per pharmacy.** Moving an eRx is not a reroute
  — it is cancel old + create new to the backup pharmacy. Two instances.
- **Primary/backup role lives on the Patient↔Pharmacy relationship**, not on
  the Pharmacy object itself.
- **Pharmacy stocks Medication** (many:many) is load-bearing: a backup is only
  valid if that pharmacy carries the drug.
- **CRM "Lead" maps to Visit** (one successful visit = one Lead record); not
  modelled as a separate object.

### Peripheral relationships

- Patient `1:many` → Payment
- Patient `1:many` → Document
- Patient `1:many` → Insurance Claim
- Patient `1:1` → Health Plan *(or 1:many over time)*
- Patient `1:many` → Refund
- Patient `1:many` → Call
- Patient `1:many` → Review
- Payment `many:1` → Visit
- Document `many:1` → Patient
- Document `many:1` → Visit *(optional; document may reference the encounter)*
- Document `many:1` → Provider *(optional; author or referenced clinician)*
- Insurance Claim `many:1` → Health Plan
- Insurance Claim `many:1` → Visit
- Insurance Claim `many:1` → Medication *(claim covers a specific drug)*
- Insurance Claim `many:1` → Pharmacy *(claim may be initiated by pharmacy)*
- Refund `many:1` → Visit
- Call `many:1` → Patient

---

## CTAs

### Prescription issue workflow (Scenarios 1–2 in screenshots)

**Support Agent:**
- *Submit Prescription Issue* — creates a Prescription Issue Task when a
  pharmacy reports it can't fill
- *Cancel eRx* — requests cancellation of one or more prescriptions at the
  pharmacy; sets status to "Cancel requested"
- *Assign Task to Provider* — escalates the task to the prescribing provider
- *Send SMS to Patient* — notifies patient of re-prescription outcome
- *Close Task* — marks the prescription issue task resolved

**Provider:**
- *Re-prescribe / Accept* — issues a new eRx, typically to the backup pharmacy
- *Reject Re-prescription* (with mandatory note) — declines; triggers a new
  task back to support

**System (automatic):**
- Detects pharmacy no-response (> 5 min in "Cancel requested") → sets
  prescription status to "No response" → escalates Task to in-progress
- Tracks pharmacy approval of cancellation → sets status to "Canceled"
- Records provider rejection note into the new Task description
- Logs all status transitions as timestamped events on the patient timeline

**Pre-existing (not CTAs here):**
- Patient has designated a preferred and backup pharmacy
- Appointment date, provider, and prescribed medications are established

---

### Other team CTAs (from roles + scenarios spreadsheet)

**Administrative Assistants:**
- *Verify Patient Identity* — confirm identity before any ePHI exchange
  (system aids: surfaces face photo, DOB, address for comparison)
- *Reschedule Visit* — update date/provider; change ZIP + preferred pharmacy
  if patient is in a different state
- *Contact Pharmacy* — resolve pharmacy issues (wrong name, out of stock,
  missing eRx)
- *Provision Patient on External Platform* — DoseSpot, Questlab (manual
  trigger; system executes)
- *Update Patient Information* — name, address/ZIP, state, preferred pharmacy
- *Review Call Recording* *(Team Lead)* — investigate low-rated calls

**TIER 1 (Customer Support):**
- *Verify Patient Identity*
- *Reschedule Visit* (including state change: ZIP update + new preferred
  pharmacy)
- *Log Prescription Issue* → creates Prescription Issue Task
- *Relay Patient Info to Pharmacy* — ICD codes, medication names, ePHI bundle

**Prior Authorization:**
- *Verify Patient Identity*
- *Submit Insurance Claim* — links Visit, Health Plan, Documents
- *Submit Appeal / Provide Additional Information* — responds to insurer denial

**Sales:**
- *Verify Patient Identity*
- *Initiate Sales Outreach* — log contact attempt on Patient

**Medical Records:**
- *Verify Patient Identity*
- *Release Medical Records* — respond to patient / PCP / subpoena request
  (Document type: Medical Records)
- *Send Document* — type selected from: ESA Letter, Treatment Letter,
  Accommodation Letter, EKG Letter, Clearance Letter, Good Faith Dispensing
  form, Discharge Letter, Superbill

**Refund Team:**
- *Issue Refund* — linked to Visit
- *Send Superbill* — patient-requested Document for insurance self-claim
- *File Refund Appeal* — flag malicious dispute, submit appeal
- *Log Refund Report Entry*

**Care Managers:**
- *Verify Patient Identity*
- *Log Outreach Note* — medication schedule guidance, adverse reactions,
  suicidal ideation check-in; recorded against patient record

**Review Team:**
- *Log Review Analysis* — sentiment, platform, patient reference
- *Send Review Request Outreach* — contact patient to leave a positive review

**Tech Support:**
- *Route Provider Tech Issue* — links to Provider and Task; escalates to
  Engineering if system-level

**MedOps:**
- *Run Care Quality Audit* — creates Task type: Care Audit; reads full patient
  record

**Engineering:**
- *Debug Platform Issue* — reads production environment data; reads full
  patient record for context

**Finance Team:**
- *Run Financial Audit* — reads Appointment and Payment data for
  salary/revenue discrepancy analysis

---

## Permissions (separate layer)

Derived from ePHI Read / Write columns in the scenarios spreadsheet.

| Role | ePHI Read | ePHI Write | Notes |
|---|---|---|---|
| Administrative Assistants | Address/ZIP, DOB, Face Photos, Full Name, Appointment Date, Medical Documents, Patient ID, Phone Number | Full Name, Appointment Date, ZIP | No write on clinical data |
| TIER 1 | Address/ZIP, DOB, Face Photos, Full Name, Appointment Date, Medical Documents | Appointment Date, ZIP | Same clinical read as AA; no clinical write |
| Prior Authorization | Address/ZIP, DOB, Face Photos, Full Name, Appointment Date, Health Plan Number, Medical Documents | — | Read-only |
| Sales | Face Photos, Full Name, DOB, Address/ZIP | — | Minimal ePHI; no write |
| Medical Records | Address/ZIP, DOB, Full Name, Appointment Date, Medical Documents, Discharge Date | — | Write access is document issuance, not ePHI fields |
| Refund Team | Appointment Date, Full Name, Medical Documents, DOB, Face Photos | — | Read-only |
| Care Managers | Address/ZIP, DOB, Full Name, Appointment Date, Medical Documents | — | Read-only |
| Review Team | Full Name, Appointment Date | — | Minimal ePHI |
| Tech Support | Address/ZIP, DOB, Full Name, Appointment Date | — | Read-only; routing role |
| MedOps | Full patient record (all ePHI fields) | — | Audit role; broadest read access |
| Engineering | Full patient record (all ePHI fields) | — | Production debugging; read-only |
| Finance Team | Appointment Date, Discharge Date | — | Financial fields only; no clinical ePHI |

---

## Attributes

- **Patient**: First Name, Last Name, DOB, Gender/Sex, Email, Phone,
  Address/ZIP, State, Face Photo, Patient ID, Health Plan Number, Preferred
  Pharmacy (primary / backup) | metadata: status (Active / Discharged),
  Discharge Date, Timezone, created date

- **Visit**: Date, Time, Type | metadata: status (Scheduled / Completed /
  Rescheduled / Cancelled), Provider (ref), Pharmacy (ref, immutable),
  Patient (ref)

- **Payment**: Amount, Method | metadata: status (Paid / Refunded / Disputed),
  Visit (ref), Patient (ref), date

- **Prescription (eRx)**: Medication (ref), Dosage, Quantity, ICD codes,
  Pharmacy (ref, immutable), Prescriber (ref), Visit (ref) | metadata: status
  (`Active → Cancel requested → No response → Canceled manually` or
  `Canceled`), Date prescribed

- **Medication**: Name, Strength, Form | metadata: drug class

- **Pharmacy**: Name, Chain, Address, Phone, Fax | metadata: Pharmacy ID,
  role-on-patient (primary / backup)

- **Provider**: Name, Specialty, State license(s) | metadata: Provider ID,
  status (Active / Inactive)

- **Task**: Type (Prescription Issue | Refund | Care Audit | Discharge |
  Tech Issue), Title, Description (currently carries multi-step instructions
  as free text), Priority | metadata: status (Pending → In Progress →
  On Hold | Completed), assigned team, created date, closed date,
  Patient (ref), Visit (ref, optional), Prescription (ref, optional),
  rejection reason (optional)

- **Document**: Type (Medical Records | ESA Letter | Treatment Letter |
  Accommodation Letter | Discharge Letter | Clearance Letter | EKG Letter |
  Good Faith Dispensing | Superbill), Content | metadata: sent/issued date,
  Patient (ref), Visit (ref, optional), Provider (ref, optional)

- **Insurance Claim**: Claim number, Submitted date, Denial reason, Appeal
  notes | metadata: status (Submitted | Prior Auth Required | Approved |
  Denied | Appealed), Health Plan (ref), Visit (ref), Medication (ref)

- **Health Plan**: Plan name, Plan/Member number | metadata: Patient (ref)

- **Refund**: Amount, Reason, Dispute flag | metadata: status (Pending |
  Issued | Appealed), Visit (ref), Patient (ref)

- **Call**: Date, Direction (Inbound / Outbound), Duration, Recording
  reference | metadata: rating, agent, Patient (ref), Provider (ref, optional)

- **Review**: Platform, Content, Sentiment | metadata: date, Patient (ref),
  analyst notes
