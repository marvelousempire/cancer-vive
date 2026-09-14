#!/usr/bin/env python3
"""Slice 02. Intent: literature/wire/02_intent.cp.md
Manifest: literature/wire/02_g1_egg.be.md"""
from __future__ import annotations

import json

EGGS = ("G1", "G2", "G3", "G4", "G5")
NAMES = {
    "G1": "surgery",
    "G2": "pathology",
    "G3": "radiation",
    "G4": "systemic",
    "G5": "genetics",
}


def gate(current: str = "G1", asked: str = "G3") -> dict:
    current = current.upper()
    asked = asked.upper()
    open_egg = "G1"
    blocked = [egg for egg in EGGS if egg != open_egg]
    hatch = asked == open_egg
    return {
        "ok": True,
        "slice": "02_g1_egg",
        "wire_status": "green",
        "law": "ApproveOneGateAtATime",
        "current_egg": open_egg,
        "current_name": NAMES[open_egg],
        "asked_egg": asked,
        "asked_name": NAMES.get(asked, asked),
        "hatch": hatch,
        "next_blocked": blocked,
        "reason": "G1 has no receipt yet. Later eggs stay closed."
        if not hatch
        else "G1 is the open egg.",
        "does_not": ["treat", "refuse G3", "fuse eggs"],
    }


def main() -> int:
    receipt = gate("G1", "G3")
    print(json.dumps(receipt, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
