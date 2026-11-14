"""Project the exact sealed public Matrix Markdown into read-only searchable rows.

Never infer efficacy from text or use patient/private data.
"""
import hashlib
import json
import re
from pathlib import Path

SOURCE = "public-docs/MASTER-CANCER-DETRIMENT-MATRIX.md"
COLUMNS = [
    "Item / variable", "Key form or constituent",
    "Cancer-relevant rationale currently filed", "Evidence in Cancer Vive",
    "Human oncology evidence", "Established cancer treatment in this repo?",
    "Important form / safety boundary", "Current Cancer Vive position"
]

def parse_matrix(raw):
    text = raw.decode("utf-8")
    if text.count("## Master matrix") != 1:
        raise ValueError("Expected exactly one Master matrix section")
    part = text.split("## Master matrix", 1)[1].split("\n## ", 1)[0]
    lines = [line.strip() for line in part.splitlines() if line.strip().startswith("|")]
    if len(lines) < 5:
        raise ValueError("Approved Matrix table has too few records")
    def cells(line):
        return [c.strip() for c in re.split(r"(?<!\\)\|", line.strip().strip("|"))]
    if cells(lines[0]) != COLUMNS:
        raise ValueError("Master Matrix column headings changed; review before publishing")
    if not all(re.fullmatch(r"[-:\s]+", c) for c in cells(lines[1])):
        raise ValueError("Matrix separator row missing")
    rows = []
    for line in lines[2:]:
        rawcells = cells(line)
        if len(rawcells) != 8:
            raise ValueError("Matrix source row does not have eight columns: " + line[:75])
        clean = [re.sub(r"\*\*(.*?)\*\*", r"\1", s).replace(r"\|", "|") for s in rawcells]
        if not clean[0] or not clean[1]:
            raise ValueError("Matrix item and form are required")
        rows.append(clean)
    if len(rows) < 20:
        raise ValueError("Unexpected missing filed items")
    if len({r[0] for r in rows}) != len(rows):
        raise ValueError("Ambiguous duplicate Matrix item label; retain distinctions")
    return rows

def build_matrix(root, destination):
    source = root / "public-researchthat" / SOURCE
    raw = source.read_bytes()
    rows = parse_matrix(raw)
    record = {
        "schema":"researchthat.matrix-public-readonly/v1",
        "source":SOURCE,
        "source_sha256":hashlib.sha256(raw).hexdigest(),
        "columns":COLUMNS,
        "rows":rows,
        "private_records_included":False
    }
    (destination/"public-matrix.json").write_text(json.dumps(record,ensure_ascii=False,separators=(",",":")))
    return len(rows)
