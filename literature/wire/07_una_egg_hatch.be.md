# Ticket 07 — UNA egg hatch check

Kitchen station: UNA desk
Waiter writes this before the cook starts.

Current egg is G1.
G1 receipt is false.
Ask whether G3 may hatch.
Return false.
Do not hatch G2, G3, G4, or G5.

Intention = enforce one-egg law ; Expected Result = one receipt with hatch=false.

Does not: treat, hatch any egg, invent a receipt.
Done when: the slice prints current_egg=G1, asked_egg, hatch=false.
