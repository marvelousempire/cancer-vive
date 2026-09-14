# Ticket 05 — G2 gate lock

Kitchen station: egg desk
Waiter writes this before the cook starts.

Print current_egg=G1.
Print g1_receipt=false.
Print g2_hatched=false.
Print g2_yolks_empty=true.
Do not open G2.
Do not fill DCIS, grade, margins, nodes, ER, PR, HER2.

Intention = lock the G2 gate ; Expected Result = one receipt showing G2 closed and yolks empty.

Does not: treat, hatch G2, invent pathology, name an operation not filed.
Done when: the slice prints g2_hatched=false and g2_yolks_empty=true.
