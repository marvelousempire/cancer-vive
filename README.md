# Cancer Vive

Cancer Vive is a cancer-focused research repository.

Its subject is evidence about factors, mechanisms, exposures, interventions, substances, and clinical variables that may cause detriment to cancer cells or tumors, alter cancer progression, or materially affect cancer treatment response. Claims stay separated by evidence strength so an interesting mechanism is not quietly promoted into a proven treatment.

This repository is not medical advice, a treatment protocol, or a substitute for oncology care.


## Public web projection

Cancer Vive includes a governed React/Vite public evidence explorer deployed through GitHub Pages.

- projection manifest: `projection.manifest.json`
- renderer: React
- build adapter: `projection.vite`
- carrier: GitHub Pages
- app source: `src/`
- deploy workflow: `.github/workflows/pages.yml`

The web interface is a projection of the research corpus. Markdown and JSON research files remain canonical.

## Scope

Cancer Vive keeps material directly tied to cancer, including:

- cancer metabolism, glucose handling, insulin signaling, and the Warburg effect;
- hypoxia, pseudohypoxia, tumor oxygenation, and related mechanisms;
- candidate compounds, foods, extracts, and prescription-drug research variables;
- breast-cancer-specific pathology, surgery, radiation, systemic-treatment, genetics, and consent context;
- claim grades, source records, evidence handles, and unresolved research questions;
- factors that may worsen outcomes when they are needed to understand the cancer evidence correctly.

## Out of scope

Generic ecosystem governance, staff/session machinery, application orchestration, and unrelated workflow plumbing do not live here. They belong in their own repositories.

## Start here

| File | Purpose |
|---|---|
| [literature/claims.md](literature/claims.md) | Cancer-related claims and evidence grades |
| [literature/sources.md](literature/sources.md) | Source ledger |
| [literature/MASTER-CANCER-DETRIMENT-MATRIX.md](literature/MASTER-CANCER-DETRIMENT-MATRIX.md) | Master comparison matrix for all filed cancer-relevant substances and variables |
| [literature/watch-cards.md](literature/watch-cards.md) | Research variables and evidence-position cards |
| [literature/prescription_variables.json](literature/prescription_variables.json) | Machine-readable prescription-drug research variables |
| [literature/harvest-breast-1cm-preop.md](literature/harvest-breast-1cm-preop.md) | Breast-cancer-specific recorded context |
| [literature/breast-treatment-decision-window.md](literature/breast-treatment-decision-window.md) | Separated breast treatment decision points |
| [literature/florida-statutes-breast-consent-stack.md](literature/florida-statutes-breast-consent-stack.md) | Cancer-care consent and patient-rights references |

## Evidence grades

| Grade | Meaning |
|---|---|
| shown | Human measurement that can be checked |
| association | Linked in populations; causation not settled |
| mechanism | Laboratory, animal, or pathway evidence |
| metaphor | Useful language that is not a diagnosis or treatment claim |
| not-supported | Current evidence in this repository does not support the claim |

The repository should remain narrow: cancer subject matter first, supporting evidence second, infrastructure somewhere else.

## Cross-repo continuation

System-level continuation and ownership map:

- Nephew handoff: `marvelousempire/nephew:docs/handoffs/2026-09-28-design-dna-control-plane-gittalk.md`
- GitTalk packet: `marvelousempire/nephew:data/gittalk/design-dna-control-plane.packet.json`
- Correlation: `GITTALK-DESIGN-DNA-CONTROL-PLANE-20260928-001`

Read that handoff before changing the shared Design DNA rail/lip, Vite projection, Automata timeline, WordPress adapter, or consumer contract. This repository owns only its named layer; do not fork the cross-repo authority map here.
