# Cancer evidence closeout — 2026-10-06

This is the current source-audit queue. A row is **open** until an exact paper or registry record, its population/model, form, endpoint, and limits are recorded. This file is a work queue, not clinical guidance.

| Order | Subject | Evidence task | Close receipt |
|---|---|---|---|
| 1 | Turmeric, culinary form vs curcumin ± piperine | Identify exact cancer mechanism, pharmacology, breast-cancer, and human outcome sources; grade each form separately | Source IDs and claim rows, with intervention and endpoint distinguished |
| 2 | Clove, eugenol, extract, oil | Replace class-level S-011 with exact cell/animal papers; recheck S-010's glucose pilot and keep it outside the oncology lane | Paper-level sources and corrected C-017/C-019/C-020 |
| 3 | Black seed and thymoquinone | Verify exact preclinical and human adjunct studies and the forms used | Source IDs, population, endpoint, limits |
| 4 | Cuban oregano | Verify botanical identity, material used, cell/animal findings | Exact paper IDs and species/form boundary |
| 5 | Ivermectin and hydroxychloroquine | Read current trial registry records and results; separate study existence from efficacy | Dated registry snapshot, trial state, outcome evidence or explicit absence |
| 6 | Remaining matrix items | Audit each claimed mechanism and safety statement against exact primary or authoritative sources | Source-linked claims with status review |

## Gates

1. Run `node scripts/check-evidence.mjs`; it checks claim IDs, source IDs, matrix references, and prints the number still awaiting second review. A green link check is **not** a scientific review.
2. A second reader checks each paper, population, form, comparison, endpoint, limitations, and whether it addresses cancer in humans. Record its source URL and review date. Keep unsupported or disputed claims visible.
3. The public explorer must render the same evidence grade, form boundary, and uncertainty as the canonical literature. Verify its actual build and browser behavior before release.
4. The repository visibility issue #1 and Headquarters commissioning issue #2 remain separately open. Do not close either with a content-only PR. Because the repository is public, review public materials for sensitive case details before any new publication or visibility change.
5. GitHub is a review mirror. Canonical Gitea adoption, exact head readback, and deployment receipts remain separate from this branch.

## Scope

Cancer Vive owns cancer evidence. Nephew training, DecantThat video intake, and shared orchestration belong in their respective owner repositories after this evidence work is resolved.
