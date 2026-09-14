# Smoke test

Not a clinic test. Not Embassy. Not I Speak.

From `cancer-vive`:

```bash
python3 literature/wire/smoke_test.py
```

Expect JSON. `ok` true. `passed` 5. `failed` empty.
G1 receipt stays false. Asking G3 does not hatch.

AoT filter smoke, from ArchitectureOfTruth:

```bash
python3 applications/aot/slices/01_truth_filter.py \
  "1 cm breast mass" "biopsy-confirmed" \
  "Biopsy reported breast cancer. Mass listed as 1 cm."
```

Expect `filter` YES and `lane` fact.
