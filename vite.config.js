import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const base = process.env.VITE_BASE_PATH || "/cancer-vive/";
const version = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).version;
const commit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const dirty = Boolean(execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim());
const release = { version, commit, dirty };

export default defineConfig({
  base,
  define: { __RELEASE__: JSON.stringify(release) },
  plugins: [react(), { name: "cancer-vive-release-record", generateBundle() { this.emitFile({ type: "asset", fileName: "release.json", source: JSON.stringify(release, null, 2) + "\n" }); } }],
  build: { outDir: process.env.VITE_OUT_DIR || "dist", emptyOutDir: true }
});
