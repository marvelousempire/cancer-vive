# 06 — AoT / ELSE v1 / ScoreThat boundary and wiring plan

## CCK — capture, contract, key
**Capture:** The operator requested that the subject-switching Cancer Vive/Diabetes Vive application use AoT, ELSE v1 and ScoreThat.
**Contract:** Shared, source-bound evidence and reasoning with independent research and evaluation authority. The existing Vite site is a public browser bundle, not an authenticated server-side clinical system.
**Key:** Keep one UI template and disease-specific source corpora; distinguish published evidence from proposed scoring.

## Confirmed repository ownership
- **ScoreThat** — `marvelousempire/scorethat` — independent evidence research, provenance, uncertainty, calibration and shadow experimentation; see `README.md`, `src/typed-provenance.js`, `src/else-lab-client.js`. Research submissions do **not** mutate accepted ratings.
- **ELSE v1** — `marvelousempire/else` — independent evaluation app with roles, tokens, versioned evaluation requests and durable receipts. Existing `POST /v1/evaluations` requires `else.evaluation-request.v1` with `evidenceState: shadow-preview`. Separate researcher and producer routes are scoped; release/commissioning authority is explicit. The current formulas are sport/rating oriented, **not medically validated**.
- **AoT** — repo or canonical contract **not located or verified** in connected repositories; do not assume its expansion, endpoint or provenance. Acquire exact authority before coding against it.

## Safe initial wiring shipped in this feature
`src/research-integrations.json` is a machine-readable capability/status registry. `src/ResearchIntegrationPanel.jsx` exposes owners and guardrails in both subjects. This is **read-only reference wiring**, not a claim that a live AoT/ScoreThat/ELSE session or formula exists.

## Required implementation gates for actual work
1. Identify and read AoT's authoritative source; map its objects and handoff rules before adopting it.
2. Define condition-tagged observation → source → research finding → ScoreThat provenance/uncertainty receipt → ELSE shadow review. Never reverse or silently skip evidence gates.
3. Create a private API/BFF with server-side tokens, allowlisted endpoints and tenant/role separation. GitHub Pages cannot safely hold ELSE or ScoreThat secrets.
4. Add condition-specific, medically reviewed scoring contracts. Existing sport formulas must **never** be repurposed as glucose targets, risk estimates or patient ratings.
5. Apply privacy and informed-consent controls before ingesting patient information; current public pages remain stateless health education.
6. Require explicit source version, algorithm version, clinical review, refusal behavior, replay checks, receipt readback and human decision authority.
7. Build integration contract tests against independent services and clinically review all public output. Do not claim runtime commissioning until an actual signed grant and tested service exist.

## Smoke acceptance
- Cancer/Diabetes switch keeps one UI, navigation, contrast and original cancer claims untouched.
- Both condition views identify integration status accurately and never assert commissioned clinical authority.
- No browser bundle contains any secret or private observation.
- A failed upstream never promotes an unreviewed topic into a treatment assertion.

## GitTalk
Owner: `cancer-vive` application integration. Cross-owner contracts remain with AoT (pending identification), ScoreThat and ELSE. Request upstream owners to acknowledge the consuming app and provide exact release IDs, scoped schemas, and test fixtures before implementing API calls.
