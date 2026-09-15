# Changelog

## 0.6.0 — 2026-09-15

### Wired

- W-019 ivermectin and W-020 hydroxychloroquine are now executable Cancer Vive research variables, not literature-only cards
- Added machine-readable `prescription_variables.json`
- Added Slice 11 intent → Bootstrap English → Python router → JSON receipt path
- Slice 11 resolves `ivermectin`, `hydroxychloroquine`, `HCQ`, and preserved operator alias `hydroxychloride`
- Slice 11 calls Slice 06 for evidence grading instead of inventing a second grading system
- Slice 06 now recognizes prescription research lanes: investigational, established non-oncology, off-label/ungraded, and unsupported oncology-treatment claim
- Smoke test expanded from 5 to 13 checks and passed 13/13 before commit
- Added runnable Cancer Vive CLI commands to the wire README, Drive, and Smoke docs
- Added Historia LEDGER-0009

### Safety invariants

- W-019 and W-020 both return `dose_available=false`
- W-019 and W-020 both return `established_cancer_treatment=false`
- Actual use remains clinician-owned and disclose-if-using
- Research/trial presence is not converted into proof of efficacy

## 0.5.0 — 2026-09-14

### Added

- Watch variable W-019: ivermectin
- Watch variable W-020: hydroxychloroquine (HCQ), normalized from operator dictation “hydroxychloride” with the original phrase preserved
- Current NCI / ClinicalTrials.gov evidence handles for ivermectin oncology studies and hydroxychloroquine oncology studies
- Prescription-drug rule: presence in the variable cabinet means track and grade, not take or prescribe

### Notes

- Ivermectin has active/in-development oncology research, including metastatic triple-negative breast-cancer and solid-tumor immune-checkpoint studies; Cancer Vive records that as investigational, not established treatment
- Hydroxychloroquine appears in oncology trials, including breast-cancer research; Cancer Vive records that as investigational, not established treatment
- No dosing protocol was created for either drug
- Existing or contemplated prescription-drug use stays clinician-owned and belongs on the medication disclosure list

## 0.4.0 — 2026-09-13

### Added

- Florida statute stack (458.324 / 459.0125, 766.103, 381.026, 456.41)
- UNA decision gates for the 1 cm breast window
- De-identified harvest bay (age 41, 1 female child; no birth month)
- Claims C-032–C-038 and sources S-018–S-022
- Historia LEDGER-0007
- Handbook chapters previously named in the TOC if they were still missing from main

### Notes

- Radiation and chemotherapy stay split objects
- Statutes are briefings, not legal advice and not a refusal script
- Public tree omits birth month, brand names, weight, blood type, and personal names

## 0.3.0 — 2026-09-13

### Added

- Handbook §10 Watch Scale — Baseline and Movement
- Literature watch cards W-001–W-006 (clove forms + insulin-overlap card)
- Claims C-023, C-025, C-026, C-027, C-028
- Sources S-012–S-015
- Historia LEDGER-0004

### Notes

- Watch-position is evidence-position, not a kill or cure rating
- Human cancer-outcome lane for cloves stays closed (C-020, C-027)
- Status on new cards is `seed`

## 0.2.0 — 2026-09-13

### Added

- Front matter i–vii in Architecture of Truth order
- Handbook chapters §01–§09 (Accord through Open Questions)
- Literature claim ledger (C-001–C-021) and source appendix (S-001–S-011)
- Housekeeper brief and corpus allowlist (bootstrap, not yet registered in agent-housekeeper)
- Bishop session-worker cards: researcher, evidence-librarian, writer
- Historia LEDGER-0001 (opening session), LEDGER-0002 (house structure), LEDGER-0003 (handbook landing)

### Notes

- README tree from 0.1.0 now has matching files
- Sole-write authority remains pending OR-045 registration
- S-010 clove human evidence is filed as a small open-label pilot, not as a medicine

## 0.1.0 — 2026-09-13

### Added

- Empty public repo seeded as a Concise Perspective research house
- README map, DECLARATION, housekeeper.pointer.json
