# Public ResearchTHAT: beginner-first, borderless study presentation

**Design candidate:** November 14, 2026. **Target:** Existing https://marvelousempire.github.io/cancer-vive/ public ResearchTHAT projection (ACT V3-based shell).

## Why this exists
The founder reported that visitors cannot easily understand where to begin, what to learn or how to interpret research. Previous technical UI fixes made the menus usable, but the landing experience remained dense and unfamiliar. The next change is **a readable first step**, not another new application or a rewritten evidence database.

## Existing design skills reused
- AI Skills Library `skills/visual/design/ux/ui-ux-pro-max/SKILL.md` for human-first UI design and readable type;
- `skills/marketing/site-architecture/SKILL.md` for meaningful navigation and clear hierarchy;
- `skills/marketing/onboarding-cro/SKILL.md` for first-use clarity and one clear next action;
- `skills/engineering/ship-flow/SKILL.md` and `checklists/post-ship-live-verification.md` for actual Pages acceptance.

These already exist. Do not create a duplicate design skill or copy their rules into a second source owner. skillTHAT is only necessary if a missing, distinct capability is identified and justified.

## Public reader experience
- Heading: **Explore one question at a time.**
- One short description of what this site lets someone do.
- Two explicit actions: **Explore research questions** (focus the real search) and **Learn how to read the research** (open the real Learn page).
- One visible clinical disclaimer: research is not medical advice. Evidence grades do not automatically establish treatment efficacy.
- An expandable explanation of evidence labels that keeps cell/animal findings distinct from human results.
- Hide repetitive technical heading/status lines from the visual first screen, while retaining the live status text for screen readers.
- Do not change the cancer question, answer, evidence grade, citations, study context, cautions, source URLs, public/private permission, or pending Diabetes review. The 27 public topics and 118 Elements stay intact.

## Borderless study-surface experiment
On the public page, remove visible borders and hard container shadows from **noninteractive** surfaces including headings, cards, panels, section frames, information chips and other chrome. Keep visual borders on **icons and buttons**, plus the accessibility focus outline. Use spacing, typography, backgrounds and alignment rather than boxes to establish hierarchy. No edits to the original sealed ACT V3 or ResearchTHAT source; the public output adds `scripts/public-learning-guide.js`, `scripts/public-learning-guide.css` and `scripts/public-borderless-study.css` after verifying the 13 original source files.

## Acceptance
- Generate `dist` through `scripts/build-researchthat-pages.py`, preserving exactly the approved 13 ResearchTHAT producer files and all source hash rules;
- Check that generated HTML references each teaching/paint asset and that the live URL serves matching exact bytes;
- Run real Chrome tests against generated **and** published Pages URL at a phone size. Check readable introductory heading; Explore focuses search; Learn switches pages; explanation opens; no repeated technical headline; panels and chips have 0px borders; buttons retain 1px borders; ACT owner top icon bank stays hidden on phone; desktop shell remains usable;
- Confirm original research cards, source records and study limitations still open as before;
- Capture screenshot artifact in GitHub Actions, with a separate real iPhone Safari human acceptance step before claiming the appearance is accepted by visitors.

This is a public presentation experiment, not a scientific content review or a proven native ACT change.
