# Cancer Vive inverse colors

Version 0.9.2 makes Light white with blue text, and Dark the same blue with white text. Auto follows the system. One color palette lives in design-dna.profile.json. Web and Mac read it directly; the native build bundles it and uses native SwiftUI colors.

Release scope: public Web, local Web door, separate installed Mac Console and native SwiftUI Mac. Same owners and build routes as suit-stack.manifest.json.

Run make check, make mac and make native. Merge the checked branch through Gitea, then build from clean merged main and install both exact artifacts. Prove Light, Dark, Auto and saved choices in the real targets. Save exact version, commit, hashes and captures in ~/.nephew/run/cancer-vive-inverse-20261014/receipt.json. The receipt is the live closeout record.

Prior release 0.9.1 passed all three app targets. Its proof is ~/.nephew/run/cancer-vive-three-apps-20261014/receipt.json. This change alters colors only. The existing 71-block ClarifyThat receipt remains valid. Scientific claims that await a second reader remain labeled.
