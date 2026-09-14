#!/usr/bin/env python3
"""Slice 01. Intent: literature/wire/01_intent.cp.md
Manifest: literature/wire/01_call_aot_filter.be.md"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path


def call_aot(object_name: str, form: str, statement: str) -> dict:
    root = os.environ.get("AOT_ROOT", "")
    slice_path = Path(root) / "applications/aot/slices/01_truth_filter.py" if root else None
    if slice_path and slice_path.exists():
        proc = subprocess.run(
            [sys.executable, str(slice_path), object_name, form, statement],
            check=False,
            capture_output=True,
            text=True,
        )
        try:
            payload = json.loads(proc.stdout)
        except json.JSONDecodeError:
            payload = {"ok": False, "raw": proc.stdout, "err": proc.stderr}
        payload["wire_status"] = "green" if payload.get("ok") else "red"
        payload["plug"] = str(slice_path)
        return payload
    return {
        "ok": True,
        "slice": "01_call_aot_filter",
        "wire_status": "yellow",
        "reason": "AOT_ROOT not set or 01_truth_filter.py missing",
        "object": object_name,
        "form": form,
        "statement": statement,
        "plug": "marvelousempire/ArchitectureOfTruth applications/aot/slices/01_truth_filter.py",
        "law": "A paragraph is not a wire. Set AOT_ROOT to call Architecture of Truth.",
        "does_not": ["treat", "prescribe"],
    }


def main() -> int:
    receipt = call_aot(
        "1 cm breast mass",
        "biopsy-confirmed",
        "Biopsy reported breast cancer. Mass listed as 1 cm.",
    )
    print(json.dumps(receipt, indent=2))
    return 0 if receipt.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
