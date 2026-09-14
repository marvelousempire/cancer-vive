#!/usr/bin/env python3
"""Slice 10. Intent: literature/wire/10_intent.cp.md
Manifest: literature/wire/10_exponential_backoff.be.md

Wait grows by two each try. Cap holds the ceiling.
Retry-After wins when present.
Does not treat. Does not hatch Protection Gate 1.
"""
from __future__ import annotations

import json
import random
from typing import Callable


def next_delay(
    attempt: int,
    base: float = 1.0,
    cap: float = 64.0,
    retry_after: float | None = None,
    jitter: bool = False,
) -> float:
    if retry_after is not None:
        wait = float(retry_after)
    else:
        wait = min(float(cap), float(base) * (2 ** int(attempt)))
    if jitter:
        wait = wait * (0.5 + random.random())
    return wait


def should_retry(status: int | None, remaining: int | None = None) -> bool:
    if remaining == 0:
        return True
    return status in (403, 429)


def github_secondary_delay(
    attempt: int,
    retry_after: float | None = None,
    cap: float = 960.0,
) -> float:
    # GitHub: if Retry-After missing, wait at least one minute, then grow.
    return next_delay(attempt, base=60.0, cap=cap, retry_after=retry_after)


def run_with_backoff(
    fn: Callable[[], dict],
    max_tries: int = 5,
    base: float = 1.0,
    cap: float = 64.0,
    sleeper: Callable[[float], None] | None = None,
) -> dict:
    tries = []
    last: dict = {}
    for attempt in range(max_tries):
        last = fn()
        status = last.get("status")
        remaining = last.get("remaining")
        retry_after = last.get("retry_after")
        ok = bool(last.get("ok"))
        wait = next_delay(attempt, base=base, cap=cap, retry_after=retry_after)
        row = {
            "attempt": attempt,
            "ok": ok,
            "status": status,
            "wait_seconds": wait if (not ok and should_retry(status, remaining)) else 0.0,
        }
        tries.append(row)
        if ok:
            return {"ok": True, "tries": tries, "result": last}
        if not should_retry(status, remaining):
            return {"ok": False, "tries": tries, "result": last, "stop": "not retryable"}
        if attempt == max_tries - 1:
            break
        if sleeper is not None:
            sleeper(row["wait_seconds"])
    return {"ok": False, "tries": tries, "result": last, "stop": "max tries"}


def schedule(base: float = 1.0, cap: float = 64.0, tries: int = 7) -> list[dict]:
    rows = []
    for n in range(tries):
        rows.append(
            {
                "attempt": n,
                "wait_seconds": next_delay(n, base=base, cap=cap),
                "github_secondary_seconds": github_secondary_delay(n),
            }
        )
    return rows


def main() -> int:
    receipt = {
        "ok": True,
        "slice": "10_exponential_backoff",
        "wire_status": "green",
        "formula": "W(n) = min(C, B * 2^n); if R present, W = R",
        "schedule": schedule(),
        "retry_after_wins": next_delay(3, retry_after=12),
        "cap_holds": next_delay(20, base=1.0, cap=64.0),
        "does_not": [
            "treat",
            "hatch Protection Gate 1",
            "claim Embassy",
            "claim I Speak",
            "sleep in this print",
        ],
    }
    print(json.dumps(receipt, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
