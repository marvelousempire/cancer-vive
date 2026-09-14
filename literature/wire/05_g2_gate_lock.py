#!/usr/bin/env python3
"""Slice 05. Intent: literature/wire/05_intent.cp.md
Manifest: literature/wire/05_g2_gate_lock.be.md"""
from __future__ import annotations

import json


def gate_lock() -> dict:
    return {
        "ok": True,
        "slice": "05_g2_gate_lock",
        "wire_status": "green",
        "current_egg": "G1",
        "g1_receipt": False,
        "g2_hatched": False,
        "g2_yolks_empty": True,
        "g2_yolks": {
            "invasive_vs_dcis": None,
            "grade": None,
            "excision_size": None,
            "margins": None,
            "nodes": None,
            "er": None,
            "pr": None,
            "her2": None,
        },
        "open_condition": "exact operation name plus specimen left the room",
        "does_not": ["treat", "hatch G2", "invent pathology"],
    }


def main() -> int:
    print(json.dumps(gate_lock(), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
