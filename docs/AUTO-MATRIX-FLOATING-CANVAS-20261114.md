# ResearchTHAT public appearance and Matrix first-screen correction · 2026-11-14

Source: the real ACT V5 handbook `handbook/03-experience-and-controls.md` and `docs/ACT-V5-DESIGN-CONTRACT.md`. Borrow only these form principles: continuous canvas; rails floating with zero separating panels, borders or shadows; visible focus and real control boundaries; one clear entry action and secondary tools on demand. **This is still the ACT V3 ResearchTHAT public product, not an ACT V5 migration.**

Requested changes and source locations:
- `scripts/public-system-auto.js`: first open uses **Auto** and resolves light/dark from `prefers-color-scheme`. A legacy `cancer-vive.theme.v1=color` must not silently force blue Color for returning people; explicit new selections persist under `researchthat.appearance.v2`. Color remains available as an intentional choice.
- `scripts/public-matrix.js`: clicking Matrix opens **all 24 approved items** without focusing Search, avoiding the phone keyboard covering the list. The list is loaded early from the same sealed public Matrix projection. Search, A–Z, full record, full table, and Back remain available.
- `scripts/public-borderless-study.css`: rails, footer, navigation and grouped shell panels have transparent backgrounds with no dividing borders or shadows. Keep actual button and icon controls, accessible focus outlines, and the original mounted work.
- The builder and live verifier check the new exact versioned CSS and JS; built and hosted Chrome tests must check system light/dark switching, all Matrix items before typing, no auto keyboard focus, and zero rail borders.

**Public release success requires** a passing PR evidence CI, merge of exact head, passing GitHub Pages Build and Deploy jobs, published byte-for-byte asset verification, and live mobile Chrome interaction test. Physical iPhone visual acceptance is separate. ResearchTHAT private app code must be carried through the primary Gitea source and independently deployed; no direct GitHub-only candidate is an installed private app.
