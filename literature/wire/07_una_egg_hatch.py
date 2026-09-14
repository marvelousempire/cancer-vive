#!/usr/bin/env python3
"""Slice 07. Intent: literature/wire/07_intent.cp.md
Manifest: literature/wire/07_una_egg_hatch.be.md"""
from __future__ import annotations

import json


def hatch_check(asked_egg: str) -> dict:
    current = "G1"
    g1_receipt = False
    allowed = asked_egg == current and g1_receipt
    return {
        "ok": True,
        "slice": "07_una_egg_hatch",
        "wire_status": "green",
        "current_egg": current,
        "g1_receipt": g1_receipt,
        "asked_egg": asked_egg,
        "hatch": allowed,
        "does_not": ["treat", "hatch G2", "hatch G3", "hatch G4", "hatch G5"],
    }


def main() -> int:
    print(json.dumps(hatch_check("G3"), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
