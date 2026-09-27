# Breast treatment decision window


Closed: do not treat surgery + radiation + chemotherapy as one object.
Closed: this file is not a refusal script and not a finding of bad faith.
Closed: this repository does not treat, prescribe, or delay the named operation.

```
SURGERY  ->  PATHOLOGY  ->  RADIATION?  ->  SYSTEMIC TREATMENT?  ->  GENETICS?
   this week      after tissue      local             whole body        later
                  is out            neighborhood      only if pathology says
```

Rule: keep each treatment decision separate and record the evidence supporting it before later decisions are treated as settled.
Decision record = written name of the step + why + what the tissue or scan showed + what happens if they wait to decide the NEXT decision.

## Named window (de-identified)

Operator-filed marks, 2026-09-13:

- Female, age 41, female heir teen
- Dense breast tissue
- Last year: 1 cm finding called a benign / nonmalignant cyst
- This week: biopsy named breast cancer, still described as about 1 cm
- Surgery next week; radiation mentioned after
- Past low iron; past low magnesium
- Daily vape; heavy red wine
- Paternal aunt breast cancer (survived); paternal grandmother breast cancer (outcome not filed)
- Care site named: Mount Sinai Medical Center, Miami Beach

Not filed in this repository: exact operation name, DCIS vs invasive, grade, nodes, ER / PR / HER2.
House language: heir teen, not child.

## Decision points

### Surgery (current recorded step)
- Shell: remove the biopsied 1 cm mass.
- Record: operation name; what pathology will print; disclose list for anesthesia (vape, wine, prior low iron/magnesium, every pill / tea / oil / extract already in the repository).
- Closed: spice or homeopathy as a substitute.

### Pathology
- Shell: tissue report.
- Record: DCIS vs invasive; grade; margins; nodes; ER / PR / HER2.
- Until this record is filled, chemo is not treated as already true.

### Radiation (local)
- Shell: energy aimed at the breast neighborhood after the lump is out, usually when the breast is kept.
- Not chemotherapy.
- At 41, radiation-omission evidence built for older low-risk patients does not automatically apply.
- Receipt questions: why this breast; what local-recurrence number they are using; is this a separate consent from surgery; can it wait on pathology.

### Systemic treatment (chemotherapy / endocrine therapy / none)
- Default: not hatched.
- A 1 cm finding does not mean chemotherapy is required.
- Opens only if pathology says the rest of the body needs a conversation.

### Genetics
- Later. Paternal aunt + paternal grandmother + age 41.
- Not the operating room.

## Recorded concern (not a finding)

"They will treat us like a number / practice bad faith." Keep on the opinion shelf. Do not promote it to a finding about the hospital. Do not use it to pre-refuse radiation before the tissue speaks.

## Florida receipts that freeze these records

See `literature/florida-statutes-breast-consent-stack.md`.

- 458.324 / 459.0125 — alternatives conversation + chart note.
- 766.103 — general understanding of this procedure, acceptable alternatives, substantial risks; written form is a presumption for that decision only.
- 381.026 — companion in the room; refuse a later decision; document the refusal; written summary on request.
