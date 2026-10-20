# ResearchThat public cancer reading site

This repository keeps the public site at its existing Cancer Vive URL.
ResearchThat owns new research content. The October 20 refresh adds Aloe Vera,
Vitamin B1 and benfotiamine to the public matrix, search and comparison.
Sources and open clinical-review gaps stay visible. See [current release scope](DO-NOW.md).

The earlier app and project records below retain their original scope.

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

The public wording lives in `src/user-messages.json`. The full claim and source records stay in `literature/`. Raw records open only in closed Expert details. No dated private case notes are shipped in the client.

Every topic gives the tested form, the human-study limit, a visible caution, a useful next step, and source links. Learn includes spike proteins, sugar, product forms, and oxygen claims.

Before release, run the installed ClarifyThat tool in enforced `board-grade-5` mode on the public prose. Save a receipt in `literature/language-review.json` with the exact JSON SHA-256 and each checked block. Short labels need a manual review; exact drug and source names are preserved. A language pass is not a scientific review. The content gate rejects stale or failed receipts and missing claims or cautions.

Run `npm run check:content`, `npm test`, and `npm run build`. A clean release emits `dist/release.json` with its exact version and commit. Confirm that record on Pages, then check the real topic search, source links, comparison, and Learn page.

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

## Three app targets

`product.identity.json` and `suit-stack.manifest.json` name the Web, separate Mac Console, and native SwiftUI targets. All three read the same public text and have the same five routes. The Apple apps bundle the topics, lessons and full public source records for offline reading. They do not bundle dated private case notes. Source links open in a browser and need a connection.

Run `npm install --ignore-scripts --no-package-lock` at the root and in `apps/cancer-vive-desktop`. Initialize the pinned native contract package with `git submodule update --init`. Use `make web`, `make mac`, and `make native`. `make native` refreshes resources before generating the Xcode project; this order is required when a new resource is added. Open `interface/swift/CancerViveNative.xcodeproj` in Xcode for the real native target.

Mac app: `apps/cancer-vive-desktop/src-tauri/target/release/bundle/macos/Cancer Vive.app`. Native app: `.build/native-derived/Build/Products/Release/Cancer Vive Native.app`. Install the exact tested artifacts into `~/Applications`, then drive the real apps. Keep each target's version, source commit, content hashes, actions and captures in its release receipt. Local builds can use local signing. A notarized public Apple download uses the protected release route and is not implied by a local install.

Desktop link opening is limited to exact checked source URLs. The policy is parsed from the public JSON and Markdown source ledger, not from user input. Credential URLs and local files are refused. Native links use those same bundled records. Rust release symbol stripping is disabled because Rust 1.96.1 can emit load tables rejected by macOS 27; see rust-lang/rust#157750.
