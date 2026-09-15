# Drive

This board is the driver. The cars that actually run today are command-line slices.

## Command 1 — Architecture of Truth filter

Repo: `marvelousempire/ArchitectureOfTruth`

```bash
python applications/aot/slices/01_truth_filter.py \
  "1 cm breast mass" \
  "biopsy-confirmed" \
  "Biopsy reported breast cancer. Mass listed as 1 cm."
```

Prints a JSON receipt. Lane and grade. Does not treat. Does not hatch G2.

## Command 2 — United Node Assembly machine

Repo: `marvelousempire/philosophy-semantic-node-framework`

```bash
python apps/united-node-assembly/main.py
```

Prints egg id, Primary Intent, then a receipt for a sample paragraph.
Does not open a window. Does not listen to a microphone.

## Command 3 — Cancer Vive prescription research variable wire

Repo: `marvelousempire/cancer-vive`

```bash
python3 literature/wire/11_prescription_variable_router.py ivermectin
python3 literature/wire/11_prescription_variable_router.py hydroxychloride
```

Each command prints one JSON receipt with card id, canonical name, evidence lane, band, watch position, research state, disclosure state, and evidence handles.
The wire has no dose field with a usable dose, cannot mark either variable as an established cancer treatment, and requires clinician ownership for actual use.

Smoke all Cancer Vive board invariants:

```bash
python3 literature/wire/smoke_test.py
```

Expected: `ok` true and 13/13 checks passed.

## Not a drive yet

- I Speak live ear
- Live Embassy HTTP
- Electron / Hello desk
- G1 surgery receipt
- cancer-vive as a full running application

Slice 11 is a working Cancer Vive CLI wire. It does not pretend the full application exists.
Those dark surfaces stay dark until their own receipt lands.
