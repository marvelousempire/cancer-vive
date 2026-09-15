# LEDGER-0009 — Prescription variable wire — 2026-09-15

## Operator instruction

“Wire it.”

Referent: Cancer Vive variables W-019 ivermectin and W-020 hydroxychloroquine, added in LEDGER-0008.

## Gap found

The two cards existed in `literature/watch-cards.md`, but the executable Watch grader had no prescription-specific evidence lanes and no callable identity router for W-019/W-020. The variables were documented but not end-to-end callable.

## Wire installed

1. Extended Slice 06 with four evidence lanes: `investigational`, `established-non-oncology`, `off-label-ungraded`, and `oncology-claim-not-supported`.
2. Added `prescription_variables.json` as the machine-readable variable cabinet for W-019 and W-020.
3. Added Slice 11 intent ticket, Bootstrap English manifest, and Python router.
4. Preserved aliases `HCQ` and operator phrase `hydroxychloride` for W-020 while preventing evidence inheritance to any other compound.
5. Wired Slice 11 into Slice 06 so prescription variables use the same Factor × Form × Lane grading machinery.
6. Expanded the board smoke test from 5 checks to 13 checks.
7. Added direct run commands to `README.md`, `DRIVE.md`, and `SMOKE.md`.

## Tested receipt

Local execution of the exact Slice 11 files against the existing Slice 02, 05, and 07 functions produced:

- `ok: true`
- `passed: 13`
- `total: 13`
- `failed: []`
- ivermectin → W-019 → `Investigate`
- hydroxychloride → hydroxychloroquine → W-020 → `Investigate`
- HCQ → hydroxychloroquine → W-020
- `dose_available: false` for both variables
- `established_cancer_treatment: false` for both variables

## Boundary

This wire tracks identity, evidence lane, band, watch position, disclosure state, and research handles. It does not create a dose, prescription, self-start instruction, or substitution for clinician-owned cancer care.

## Changed objects

- `literature/wire/06_watch_card_grader.py`
- `literature/wire/prescription_variables.json`
- `literature/wire/11_intent.cp.md`
- `literature/wire/11_prescription_variable_router.be.md`
- `literature/wire/11_prescription_variable_router.py`
- `literature/wire/smoke_test.py`
- `literature/wire/README.md`
- `literature/wire/DRIVE.md`
- `literature/wire/SMOKE.md`
- `CHANGELOG.md`
- this ledger

Status: tested locally; ready for one atomic main-branch commit.
