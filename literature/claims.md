# Claim ledger

Each row is one sentence. Grade is required. Source ids point at `sources.md`. Review status: `seed` means the row was filed at house bootstrap and has not had a second-pass evidence audit.

Status key: `seed` | `reviewed` | `disputed` | `retired`

| ID | Claim | Grade | Source ids | Chapter | Status |
|----|-------|-------|------------|---------|--------|
| C-001 | Many tumors convert glucose to lactate even when oxygen is present (aerobic glycolysis / Warburg phenotype). | shown | S-001 S-002 | §04 | seed |
| C-002 | High tumor glucose uptake is used clinically in FDG-PET imaging. | shown | S-002 | §04 | seed |
| C-003 | HIF-1α, PI3K/AKT/mTOR, MYC, and PKM2 are recurrent drivers of aerobic glycolysis programs. | mechanism | S-002 S-003 | §04 | seed |
| C-004 | “Cancer is sugar” as a complete cause statement. | metaphor | S-002 | §04 | seed |
| C-005 | Cutting dietary sugar is a demonstrated cancer treatment in this house. | not-supported | — | §04 | seed |
| C-006 | HIF-1α is marked by PHDs in oxygen and removed through VHL. | mechanism | S-003 S-004 | §05 | seed |
| C-007 | VHL loss stabilizes HIF in oxygen (classic clear cell kidney cancer path). | mechanism | S-004 | §05 | seed |
| C-008 | SDH or FH loss raises succinate or fumarate and can block PHDs (pseudohypoxia). | mechanism | S-005 | §05 | seed |
| C-009 | IDH mutations can produce 2-hydroxyglutarate and disturb alpha-ketoglutarate enzymes including PHDs. | mechanism | S-005 | §05 | seed |
| C-010 | PI3K/AKT/mTOR and ROS can raise or stabilize HIF without a drop in environmental oxygen. | mechanism | S-003 | §05 | seed |
| C-011 | Planned intermittent hypoxia training is the same object as obstructive sleep apnea. | not-supported | S-006 S-007 | §06 | seed |
| C-012 | Tumor cyclic hypoxia is a training protocol with a benefit lane. | not-supported | S-008 | §06 | seed |
| C-013 | Zero environmental hypoxia is a single neutral that means “does nothing and causes no effect.” | not-supported | S-003 S-008 | §06 | seed |
| C-014 | Type 2 diabetes is associated with higher incidence of several solid cancers (including liver, pancreas, endometrium, colorectal, breast). | association | S-009 | §07 | seed |
| C-015 | Insulin and IGF-1 signaling can drive PI3K/AKT/mTOR programs that also appear in tumor metabolism. | mechanism | S-002 S-009 | §07 | seed |
| C-016 | “Cancer is a type of diabetes.” | metaphor | S-009 | §07 | seed |
| C-017 | Small human pilots have reported glucose-handling changes after clove extract. | shown | S-010 | §08 | seed |
| C-018 | Clove extract or eugenol is a licensed diabetes medicine. | not-supported | — | §08 | seed |
| C-019 | Eugenol or clove extracts show metabolic and inflammatory marks in animal and cell work. | mechanism | S-011 | §08 | seed |
| C-020 | Clove oil or eugenol is a demonstrated human cancer treatment. | not-supported | — | §08 | seed |
| C-021 | Intermittent hypoxia training is a demonstrated cancer treatment. | not-supported | — | §06 | seed |

## How to add a row

1. One sentence.
2. One grade.
3. At least one source id, or an explicit em dash if the claim is the absence of support.
4. Point at a chapter.
5. Start at `seed`. Move to `reviewed` only after a second reader checks the source.
