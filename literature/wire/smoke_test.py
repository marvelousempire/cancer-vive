#!/usr/bin/env python3
"""Smoke test for the cancer-vive board slices.

Ticket: prove the wire scripts print and the gates stay closed.
Expected: five checks pass. G1 receipt stays false. G3 does not hatch.
Does not treat. Does not claim Embassy. Does not claim I Speak.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from importlib.machinery import SourceFileLoader


def load(name: str):
    return SourceFileLoader(name, str(HERE / f"{name}.py")).load_module()


def main() -> int:
    s02 = load("02_g1_egg")
    s05 = load("05_g2_gate_lock")
    s07 = load("07_una_egg_hatch")
    r02 = s02.gate("G1", "G3")
    r05 = s05.gate_lock()
    r07 = s07.hatch_check("G3")
    rows = [
        ("02 G3 hatch is false", r02.get("hatch") is False),
        ("02 current egg is G1", r02.get("current_egg") == "G1"),
        ("05 G1 receipt is false", r05.get("g1_receipt") is False),
        ("05 G2 yolks empty", r05.get("g2_yolks_empty") is True),
        ("07 G3 hatch is false", r07.get("hatch") is False),
    ]
    failed = [name for name, ok in rows if not ok]
    receipt = {
        "ok": not failed,
        "slice": "smoke_test",
        "passed": sum(1 for _, ok in rows if ok),
        "total": len(rows),
        "failed": failed,
        "does_not": ["treat", "claim G1", "claim Embassy", "claim I Speak", "claim GUI"],
    }
    print(json.dumps(receipt, indent=2))
    return 0 if receipt["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
