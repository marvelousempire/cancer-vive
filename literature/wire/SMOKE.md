# Smoke test

Not a clinic test. Not Embassy. Not I Speak.

From `cancer-vive`:

```bash
python3 literature/wire/smoke_test.py
```

Expect JSON. `ok` true. `passed` 13. `failed` empty.
G1 receipt stays false. Asking G3 does not hatch.
W-019 resolves from `ivermectin`.
W-020 resolves from `hydroxychloride` and `HCQ` to canonical `hydroxychloroquine`.
Both oncology-research lanes return `Investigate`.
Both prescription variables return `dose_available=false` and `established_cancer_treatment=false`.

Direct Slice 11 smoke:

```bash
python3 literature/wire/11_prescription_variable_router.py ivermectin
python3 literature/wire/11_prescription_variable_router.py hydroxychloride
```

Expect `wire_status` green and a deterministic card receipt. This is an evidence-routing receipt, not a medication instruction.

AoT filter smoke, from ArchitectureOfTruth:

```bash
python3 applications/aot/slices/01_truth_filter.py \
  "1 cm breast mass" "biopsy-confirmed" \
  "Biopsy reported breast cancer. Mass listed as 1 cm."
```

Expect `filter` YES and `lane` fact.
