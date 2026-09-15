# Ticket 11 — Prescription research variable router

Kitchen station: watch desk
Waiter writes this before the cook starts.

Take one spoken drug-variable name.
Resolve it to one canonical Cancer Vive card.
Preserve operator aliases without letting one chemical inherit another chemical's evidence.
Choose one explicit lane.
Call Slice 06 to grade that lane.
Return card id, canonical name, lane, band, watch-position, research state, disclosure state, and evidence handles.
Return `dose_available=false` and `established_cancer_treatment=false` for W-019 and W-020.
Require clinician ownership for actual use.

Intention = make the two prescription research variables callable ; Expected Result = one deterministic JSON receipt per request.

Does not: prescribe, dose, recommend self-start, replace standard care, convert trial presence into proof of efficacy.
Done when: `ivermectin`, `hydroxychloroquine`, `HCQ`, and the preserved operator alias `hydroxychloride` resolve deterministically and the smoke test proves the safety invariants.
