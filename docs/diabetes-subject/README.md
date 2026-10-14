# Diabetes subject — one template, two complete subject views

## 01 — Contract
Keep Cancer Vive and Diabetes Vive in the same React/Vite shell, theme palette, five-route navigation, evidence cards, matrix and sources. Do not duplicate the site's theme or overwrite any cancer-specific research. Selecting **Diabetes** in the subject selector swaps all five page bodies immediately; selecting **Cancer** restores existing content. Persist the selection in localStorage. Reset comparison state on mode change. Keep the choice keyboard accessible and visually labeled.

## 02 — Diabetes scope and evidence
Diabetes includes types 1, 2 and gestational diabetes; diagnosis and A1C; CGM; insulin and other medicines; food and movement; prediabetes prevention; kidney risk; hypoglycemia; and diabetic ketoacidosis. Source each published card individually to NIDDK or CDC education resources. These are linked educational summaries, **not** independently adjudicated systematic evidence reviews. No patient-specific dosing, cure claims, inferred glucose targets or automatic clinical decisions. Do not reuse cancer claim IDs or claim that a diabetes topic has passed the original cancer-specific ClarifyThat review.

## 03 — Integration
The dropdown belongs to the shared shell stage and is visible on every route, including on narrow viewports. The original Cancer Vive raw record documents remain cancer-only. Diabetes data lives in `src/diabetes-content.json`, and the alternate body is `src/DiabetesView.jsx`. This is a multi-subject architecture, not a find-and-replace copy of oncology content.

## 04 — Acceptance matrix
- Cancer is default on a new device; all five legacy routes work and retain original cancer text.
- Switching to Diabetes preserves the rail layout, theme controls, route name and responsive card styling while replacing hero, topics, matrix, lessons and questions.
- Switching back restores cancer content without leaking diabetes selections.
- Diabetes search, category filter, cards/table choice and three-item comparison work.
- Every diabetes card exposes its human-evidence limit, caution, next question and external HTTPS source.
- Keyboard users can reach the labeled selector; the current subject is always explicit.
- `npm run check:content`, `npm test` and `npm run build` pass before any release; run browser and native desktop/mobile smoke tests before claiming deployment complete.
- A clinical editorial review and a diabetes-specific evidence provenance/gating receipt are release gates before treating this as clinically validated or production health guidance.

## 05 — Ownership
Cancer Vive remains the initial canonical repository and first subject. Future disease/condition modules should use the same content contract and a clinical editorial gate. Do not copy patient notes into public bundles.
