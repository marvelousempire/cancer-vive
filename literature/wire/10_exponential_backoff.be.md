# Ticket 10 — Exponential backoff

Kitchen station: wait clock
Waiter writes this before the cook starts.

A refused call comes back with 429 or with remaining = 0.
The cook does not hammer the door.
The cook waits.
The wait grows by two each try.
The wait never passes the cap.
If the door names Retry-After, that number wins.

```text
W(n) = min(C, B * 2^n)
If R is present, W = R
```

Intention = compute the next wait after a refused call ; Expected Result = one wait number and a stop after max tries.

Does not: treat, hatch Protection Gate 1, claim Embassy, claim I Speak, invent a receipt.
Done when: the slice prints a schedule and honors Retry-After.
