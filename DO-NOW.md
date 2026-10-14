# Cancer Vive handoff

## Current work

Version 0.9.1 carries the separate Tauri Mac Console and native SwiftUI Mac app. No earlier Mac or Swift owner existed in Cancer Vive. The owner paths, routes and build targets are in product.identity.json and suit-stack.manifest.json.

All three use src/user-messages.json. Its 71 prose blocks pass enforced ClarifyThat board-grade-5. Claims stay seed pending a second scientific reader. Public bundles contain topics, lessons, claims and source records. They omit dated private case files.

## Proven before merge

- Web button navigation, comparison, three-topic limit, Escape, table, theme and saved menu state work in the live 0.8.0 app after reconnecting the browser tool.
- The separate Mac 0.9.0 draft app launches. Its search and comparison work.
- Native SwiftUI 0.9.0 draft launches after fixing resource staging and version metadata. Native search, details, source opening, comparison and Escape work.
- Six Node tests, a Rust exact-link refusal test, native content/search/filter/compare/refusal tests, source integrity and Ground Zero pass. Both Apple builds succeed.

These draft observations do not prove the final merged build. Finish the release steps below and bind new captures to that exact commit.

## Release steps

1. Run make check, make web, make mac and make native. Native must stage all resources before xcodegen generate. This fixes the missing-file incident caught at first launch.
2. Push the branch to Gitea. Pass CI and merge the exact head. Let Gitea's configured mirror copy to GitHub. Wait for Pages.
3. From clean merged main, rerun both Apple builds. Read version and release.json from the new artifacts. Verify signatures and copy the exact apps to ~/Applications. Quit the prior apps before replacing them, then launch both again.
4. Build a local Web artifact with VITE_BASE_PATH=/ and VITE_OUT_DIR=.build/local-web/<main-sha>. Register only cancer-vive through the existing Make Doors static-server manager at loopback port 4188 after a bounded free-port check. Do not repair VPN or change router/DNS state. Prove http://cancer-vive.localhost/ serves that exact release.
5. Drive all five routes, search, filters, comparison, three-item refusal, details, sources, theme, saved state and empty results on each real target. Save captures, hashes, exact commit and target results to ~/.nephew/run/cancer-vive-three-apps-20261014/receipt.json.
6. Save and read back a SymB bundle of this branch only. Leave a signed Nephew witness.

Local installed apps are the requested Apple target. App Store, TestFlight and notarized public Apple downloads are separate release scopes. Do not claim those from local signing.

## Source fixes and recovery

Rust 1.96.1 with release symbol stripping can emit a load table rejected on macOS 27. The exact dylib load error was confirmed. The final Console check also caught a linker-only signature with no resource seal. Its bundle config now requests local ad-hoc signing, and both Makefile targets verify the full signature before install. The product release profile keeps stripping off; no OS guard is bypassed. Primary report: https://github.com/rust-lang/rust/issues/157750.

The native body uses SwiftUI, native search/pickers/tables/sheets/links and a pinned Father Apple contract package. It is not a webview, and it does not claim full Briefcase Framework infrastructure adoption. Tauri carries the bundled React app and Rust owns source opening. Exact source URLs are parsed from checked JSON and Markdown; credential and local-file links are refused.

For later shared content edits, update the language receipt first. Run node scripts/prepare-apple.mjs --write to refresh the exact source-link policy, generated fallback words and native resources. Then run all target builds. A saved-state or source edit must not close with only Web proof.
