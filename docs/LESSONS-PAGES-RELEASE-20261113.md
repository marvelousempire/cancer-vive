# Lesson: GitHub merge is not a live mobile release (November 13, 2026)

**Incident:** The public ResearchTHAT site at https://marvelousempire.github.io/cancer-vive/ remained crowded, while PRs #11, #12 and #13 had merged with passing source checks. A new post-deployment verifier arrived in PR #14, but the deploy job lacked its script until PR #15. The operator reported continuing failures afterward. The latest failed job log has not been retrievable through the available GitHub integration; the exact newest failure cause is **unconfirmed**.

## What the source proves
1. `public-researchthat/index.html` is the sealed ResearchTHAT producer. It intentionally does **not** include the mobile overlay. `scripts/build-researchthat-pages.py` copies the sealed tree into `dist`, then injects `public-mobile-menu.js` and `public-mobile-menu.css` into the published HTML.
2. The PR evidence workflow is not the Pages workflow. Green tests and GitHub `main` do not prove what a visitor receives.
3. The first mobile change introduced an additional navigation menu but did not remove duplicate navigation. Subsequent CSS fixes targeted specific owner-framework elements, which have not been independently observed on the actual phone.
4. PR #14's live-verification command was placed in the Pages `deploy` job. That job had no checkout, so the verification script was unavailable. PR #15 repaired that confirmed defect, but there is **no captured proof of the new failure's exact cause**.
5. Combining `actions/deploy-pages` and an after-the-fact HTTP verifier in one job made a red workflow ambiguous: GitHub could have published successfully while the HTTP check failed.

## Repair made and release design
The Pages workflow now maintains three separate stages:
- **Build**: source checks, sealed ResearchTHAT research, generated `dist` and uploaded Pages artifact.
- **Deploy**: GitHub Pages' deployment action alone, with its own success/failure result.
- **Verify live**: separate job, runs only after a successful deployment; checks the real public URL, exact mobile assets, research content count and private-data boundary, then writes a readable job summary with failures. This job does not modify the deployed site.

Each stage may succeed or fail independently. A successful deployment with a failed HTTP verification is reported as **deployed, live verification failed**—not incorrectly described as a build failure or a proven mobile experience.

## Mandatory follow-through
- Identify the latest Pages push-run ID and the red job. Read the **last 25 meaningful log lines**, not just the PR check status.
- If Build fails, fix exact seal, content or generation errors. Do not weaken medical-evidence or privacy checks.
- If Deploy fails, investigate Pages configuration, permissions, environment, and provider responses. Do not alter content or UI to solve hosting failures.
- If Verify live fails, compare the exact requested URL, HTTP response, release/asset versions, time of deployment, and returned file hashes. Investigate propagation, caching and wrong published source. No new CSS patch without a real browser inspection.
- If all three pass, independently drive the public page on 320/375/390/430px phones: one ResearchTHAT header, Sections, Options, Cancer evidence, search, sources, comparison, Elements and return paths. The header still is **not proven visually** by HTTP-only checks.
- Update `docs/PUBLIC-PAGES-MOBILE-SHIP.md`, Issue #10, and AI Skills Library `ship-flow` lessons using the exact failed step and observed repair. Keep the old failure as a dated historical record.
- Do not promise a fixed interface or claim success merely because the change merged.

## Evidence
- PR #11, #12, #13: mobile interface changes merged; user reported unchanged/crowded live page.
- PR #14: post-deploy verifier added, but no source checkout in that job.
- PR #15: source checkout added; the operator subsequently reported another failure.
- This release change: separate deploy and verification jobs, with a job summary. The latest actual deployment/real iPhone behavior still requires independent verification.

## Confirmed mobile navigation selector mismatch — November 13 follow-up

A source inspection of the actual published owner bundle `public-researchthat/research-frame.js` found that ACT renders page navigation as `<nav class="build-path">` inside the `footer-rail`, with button labels and `aria-current=page`. Earlier Cancer Vive mobile JS looked for `.pages button`, and the CSS tried to hide `.review .pages`. **Those targets do not describe the actual owner frame.** The custom menu could therefore fail to resolve owner page destinations, leaving the original page navigation visible and the header crowded, even when correct mobile files were deployed.

**Correction:** use `.footer-rail .build-path button` to find and delegate ACT's real page actions, observe `.footer-rail .build-path` for selection updates, and only hide the redundant row once all public page links resolve. Add an automated regression check asserting the actual selector is used. Bump mobile asset URL version to `20261113d`. The original ResearchTHAT data, evidence and owner frame remain unmodified.

**Proof boundary:** This explains a confirmed mismatch in the source code; it does not by itself establish whether the Pages deployment succeeded or that an iPhone rendered the revised header correctly. Both require independent evidence.
