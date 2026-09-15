#!/usr/bin/env python3
"""Slice 11: route Cancer Vive prescription-drug research variables.

Intent: literature/wire/11_intent.cp.md
Manifest: literature/wire/11_prescription_variable_router.be.md

This slice is an evidence router. It does not prescribe, dose, or convert a research
variable into a cancer treatment.
"""
from __future__ import annotations

import argparse
import json
from importlib.machinery import SourceFileLoader
from pathlib import Path

HERE = Path(__file__).resolve().parent
REGISTRY_PATH = HERE / "prescription_variables.json"
LANE_ALIASES = {
    "oncology": "oncology_research",
    "oncology-research": "oncology_research",
    "research": "oncology_research",
    "non-oncology": "established_non_oncology",
    "established-non-oncology": "established_non_oncology",
    "self-start": "off_label_self_start",
    "off-label": "off_label_self_start",
    "treatment-claim": "cancer_treatment_claim",
    "cancer-treatment-claim": "cancer_treatment_claim",
}


def _normal(value: str) -> str:
    return " ".join(value.strip().lower().replace("_", " ").split())


def load_registry(path: Path = REGISTRY_PATH) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _index(registry: dict) -> dict[str, tuple[str, dict]]:
    index: dict[str, tuple[str, dict]] = {}
    for card_id, card in registry["variables"].items():
        for name in {card["canonical_name"], *card.get("aliases", [])}:
            index[_normal(name)] = (card_id, card)
    return index


def resolve_variable(requested_name: str, registry: dict | None = None) -> tuple[str, dict]:
    registry = registry or load_registry()
    match = _index(registry).get(_normal(requested_name))
    if not match:
        raise KeyError(f"unknown prescription research variable: {requested_name}")
    return match


def route_variable(requested_name: str, lane: str = "oncology_research") -> dict:
    registry = load_registry()
    card_id, card = resolve_variable(requested_name, registry)
    lane_key = LANE_ALIASES.get(lane.strip().lower(), lane.strip().lower().replace("-", "_"))
    lane_record = card.get("lanes", {}).get(lane_key)
    if lane_record is None:
        return {
            "ok": False,
            "slice": "11_prescription_variable_router",
            "wire_status": "red",
            "card_id": card_id,
            "canonical_name": card["canonical_name"],
            "requested_name": requested_name,
            "reason": f"unsupported lane: {lane}",
            "allowed_lanes": sorted(card.get("lanes", {})),
            "does_not": ["prescribe", "dose", "recommend self-start", "replace standard care"],
        }

    grader = SourceFileLoader("cv_watch_grader", str(HERE / "06_watch_card_grader.py")).load_module()
    graded = grader.grade_card(
        card["canonical_name"],
        "prescription drug",
        lane_record["grader_lane"],
    )
    return {
        "ok": True,
        "slice": "11_prescription_variable_router",
        "wire_status": "green",
        "card_id": card_id,
        "requested_name": requested_name,
        "canonical_name": card["canonical_name"],
        "normalized_from_alias": _normal(requested_name) != _normal(card["canonical_name"]),
        "category": card["category"],
        "lane": lane_key,
        "grader_lane": lane_record["grader_lane"],
        "band": graded["band"],
        "watch_position": graded["watch_position"],
        "research_state": lane_record["research_state"],
        "action": lane_record["action"],
        "established_cancer_treatment": card["established_cancer_treatment"],
        "dose_available": card["dose_available"],
        "clinical_owner_required_for_use": registry["safety_boundary"]["clinical_owner_required_for_use"],
        "disclose_if_using": True,
        "evidence_handles": card.get("evidence_handles", []),
        "normalization_note": card.get("normalization_note"),
        "does_not": [
            "prescribe",
            "dose",
            "recommend self-start",
            "replace standard care",
            "treat trial presence as proof of efficacy",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Route one Cancer Vive prescription research variable.")
    parser.add_argument("variable", help="ivermectin, hydroxychloroquine, HCQ, or hydroxychloride")
    parser.add_argument("--lane", default="oncology_research")
    args = parser.parse_args()
    try:
        receipt = route_variable(args.variable, args.lane)
    except KeyError as exc:
        receipt = {
            "ok": False,
            "slice": "11_prescription_variable_router",
            "wire_status": "red",
            "reason": str(exc),
            "does_not": ["guess a drug identity", "prescribe", "dose"],
        }
    print(json.dumps(receipt, indent=2))
    return 0 if receipt["ok"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
