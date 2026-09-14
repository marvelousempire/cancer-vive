#!/usr/bin/env python3
"""Slice 06. Intent: literature/wire/06_intent.cp.md
Manifest: literature/wire/06_watch_card_grader.be.md"""
from __future__ import annotations

import json

BANDS = {
    "shown": ("Investigate", 0.35),
    "association": ("Watch", 0.10),
    "mechanism": ("Investigate", 0.05),
    "metaphor": ("Not-supported", 0.00),
    "not-supported": ("Not-supported", 0.00),
    "harm-flag": ("Harm-flag", -0.18),
}


def grade_card(factor: str, form: str, lane: str) -> dict:
    band, pos = BANDS.get(lane, ("Watch", 0.00))
    return {
        "ok": True,
        "slice": "06_watch_card_grader",
        "wire_status": "green",
        "factor": factor,
        "form": form,
        "lane": lane,
        "band": band,
        "watch_position": pos,
        "does_not": ["treat", "fuse forms", "score a person", "hatch G2"],
    }


def main() -> int:
    print(json.dumps(grade_card("black seed oil", "oil", "mechanism"), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
