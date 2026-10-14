# cancer-vive Operating Rules

- Read local source docs before changing behavior.
- Keep generated AI_AGENT_RULES summaries compact; do not copy secrets or full histories into prompt context.
- Preserve hand-authored binder pages. Refresh only missing or generated sections.

## Required Output Closeout

Every substantive Nephew or core-agent response must end with this exact closeout schema, especially PR status, blocker, CI, deploy, handoff, or "not shipped" reports:

```text
Before: <one line describing what was happening>
After: <one line describing what is true now>
Change: <what changed>; <how it was verified>
Next action: <exact command, file, or decision if any>
MOIC: 070195134533 _Nephew_
```

Rules:

- Print the labels exactly as `Before:`, `After:`, `Change:`, `Next action:`, and `MOIC:`.
- Do not bury the fields in prose or bullets when reporting status.
- If there is no follow-up, write `Next action: None`.
- Name the real pipeline stage: local, committed, pushed, PR'd, merged, deployed, or blocked.
- Machine-readable JSON responses must carry equivalent `response_signature` metadata instead of a prose footer.
