#!/usr/bin/env python3
"""Slice 03. Intent: literature/wire/03_intent.cp.md
Manifest: literature/wire/03_g1_tissue_receipt.be.md"""
from __future__ import annotations

import json

FILED = [
    "biopsy named breast cancer",
    "size about 1 cm on biopsy",
    "surgery named as next step",
    "care site Mount Sinai Medical Center Miami Beach",
    "disclose list: vape, red wine, past low iron, past low magnesium",
]

MISSING_G1 = [
    "exact operation name",
    "laterality",
    "operation date",
    "specimen left the room",
    "sentinel node part of this egg",
    "458.324 chart note for this egg",
    "766.103 consent scoped to this procedure",
]

MISSING_G2 = [
    "invasive vs DCIS",
    "grade",
    "excision size",
    "margins",
    "nodes",
    "ER",
    "PR",
    "HER2",
]


def inventory() -> dict:
    return {
        "ok": True,
        "slice": "03_g1_tissue_receipt",
        "wire_status": "green",
        "current_egg": "G1",
        "g1_receipt": False,
        "g2_hatched": False,
        "biopsy_is_not_g2": True,
        "filed": FILED,
        "missing_g1": MISSING_G1,
        "missing_g2": MISSING_G2,
        "reason": "G1 has no named operation and no specimen receipt. G2 tissue report is a later egg.",
        "does_not": ["treat", "hatch G2", "invent pathology"],
    }


def main() -> int:
    print(json.dumps(inventory(), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
