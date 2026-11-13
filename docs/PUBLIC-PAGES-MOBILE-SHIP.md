> **Release correction — November 13:** Pages now has separate **Build**, **Deploy**, and **Verify public website** jobs. The verified launch means all three pass, followed by a real mobile interaction test. If a job fails, use its own log and summary; don't use green pull-request checks as proof of publishing. [Incident lessons and root-cause boundaries](LESSONS-PAGES-RELEASE-20261113.md).\n\n# Public Cancer Vive / ResearchTHAT Pages — how to ship and prove the mobile interface

**Updated:** November 13, 2026. **Public URL:** https://marvelousempire.github.io/cancer-vive/

## What is actually being published

Cancer Vive is the registered GitHub Pages *carrier* for a public-only snapshot produced from ResearchTHAT. The public-facing heading remains **ResearchTHAT**, as approved. This is not a separate live research database. ResearchTHAT's sealed `public-researchthat/` 13-file research artifact is checked before the Cancer Vive carrier applies a mobile-only interface layer.

Source paths:
- `public-researchthat-carrier.json`: existing ResearchTHAT source and asset hashes;
- `scripts/build-researchthat-pages.py`: verifies those hashes, copies the checked files, then adds mobile-only JS/CSS to built `dist`;
- `scripts/public-mobile-menu.js` and `scripts/public-mobile-menu.css`: public mobile navigation and header;
- `.github/workflows/pages.yml`: push-to-`main` GitHub Pages release;
- `scripts/verify-live-pages.py`: independent HTTPS readback of the *published URL*, mobile assets and public data.

**Important distinction:** `public-researchthat/index.html` in GitHub does **not** contain the mobile overlay. The build applies it only to `dist/index.html`. Reading the checked source directory does not prove the published page includes it.

## What caused the repeated "merged but not visible" reports

PR #11 added a menu while leaving the existing rails and header visible. PR #12 reduced mobile clutter. PR #13 condensed the phone header to **ResearchTHAT | Sections | Options**, moving Subject, Appearance and Refresh behind Options. All three were merged to the GitHub source. Their pre-merge evidence jobs showed only that source and builds passed; **there was no independent post-deploy assertion of what visitors could actually download**.

A source merge, an Actions build, a Pages artifact upload, a deployment job and a real browser view are five different states. Do not conflate them. An unchanged screen may reflect a deployment issue, browser cache, a selector failing to match the real shell, or the page still showing the old controls; determine which from evidence before another visual patch.

## Operator shipping sequence

1. Inspect the current `main`, current public URL and all active Pages workflows/settings. Preserve a way to restore the prior deployed commit.
2. Change only the existing public carrier layer unless an approved ResearchTHAT owner modification is necessary. Do not directly edit sealed research-data files, source hashes or the private application.
3. Keep the public ResearchTHAT name, 27 cancer topics, 118 Elements, current citations, evidence grades, clinical cautions and pending Diabetes public review.
4. Run `npm run check:content && npm run check:suits && npm test && python3 scripts/test_researchthat_pages.py`. Build with `npm run build`; verify `dist/index.html` references `public-mobile-menu.js` and `public-mobile-menu.css`.
5. Merge the reviewed GitHub Pages carrier change to `main` only after checks succeed; this is explicitly the public hosting carrier, **not** authority to overwrite upstream Gitea ResearchTHAT.
6. Confirm the GitHub Pages *deploy job* actually finishes, not merely the pull-request evidence workflow. A separate `verify_live` job runs `python3 scripts/verify-live-pages.py --url https://marvelousempire.github.io/cancer-vive/ --attempts 18 --delay 5` **after the Deploy job succeeds**, writing its own job summary. This prevents a live HTTP failure from being confused with the Pages deployment itself. It compares served mobile files byte-for-byte to the source and checks public data and title. Failure means "not live verified" even if deployment claimed success.
7. Open the public URL on a narrow phone viewport (320, 375, 390, 430 CSS pixels) and actually tap: Sections; Evidence, Learn, Questions, Sources, Elements; Options; Subject; Appearance; Refresh; Search; Read evidence; Close; Compare. Ensure the menu and controls work in the current mobile Safari session, no duplicated header remains, and no unwanted horizontal scrolling exists.
8. Confirm private studies/food pages show the public limitation, Diabetes remains pending review, public sources are accessible, and the 27 topics and 118 Elements are preserved.
9. Record the source commit, deploy workflow run, live HTTP proof, phone/browser screenshot, click results, outstanding failures and rollback SHA in Issue #10. A real phone test is a separate step from live asset proof.

## Status and refusal language

- **Merged:** code reached GitHub `main` only.
- **Built:** release output created and tested, not necessarily published.
- **Deployed:** Pages deployment action reported success.
- **Live files verified:** `verify-live-pages.py` checked the actual public URL, title, overlay hashes and public dataset.
- **Mobile UX verified:** person or browser automation exercised the running menu, header and reading flows. HTTP-only checks cannot certify this.

If direct public HTTPS access is unavailable from a session, do not claim a mobile visual fix is complete. Use the GitHub Actions deployment and post-deploy check as a separate readback; if that status is inaccessible, state the limitation explicitly. Do not recommend a URL query parameter as evidence of an updated deployed file; it can only influence how some caches handle the request.

## Reuse

Apply the existing AI Skills Library `skills/methodology/release-documentation-freshness/SKILL.md` and `checklists/post-ship-live-verification.md` to this release. The landing-page-deployment skill covers *temporary waiting pages* and is not a replacement for this actual application release process. skillTHAT is the foundry for a new capability packet only if a genuinely new reusable capability is needed, not for duplicating an existing shipping checklist.
