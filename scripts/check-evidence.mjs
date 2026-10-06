#!/usr/bin/env node
// Cancer Vive evidence integrity check. Run: node scripts/check-evidence.mjs
import { readFileSync } from 'node:fs';

const claims = readFileSync(new URL('../literature/claims.md', import.meta.url), 'utf8');
const sources = readFileSync(new URL('../literature/sources.md', import.meta.url), 'utf8');
const matrix = readFileSync(new URL('../literature/MASTER-CANCER-DETRIMENT-MATRIX.md', import.meta.url), 'utf8');
const claimRows = [...claims.matchAll(/^\| (C-\d{3}) \| (.+) \| (shown|association|mechanism|metaphor|not-supported) \| (.+) \| (.+) \| (seed|reviewed|disputed|retired) \|$/gm)];
const sourceRows = [...sources.matchAll(/^\| (S-\d{3}) \| (.+) \| (.+) \| (.+) \|$/gm)];
const errors = [];
const ids = (rows, label) => {
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row[1])) errors.push(`duplicate ${label} ${row[1]}`);
    seen.add(row[1]);
  }
  return seen;
};
const claimIds = ids(claimRows, 'claim');
const sourceIds = ids(sourceRows, 'source');
for (const row of claimRows) {
  const refs = [...row[4].matchAll(/S-\d{3}/g)].map(m => m[0]);
  if (refs.length === 0 && row[4].trim() !== '—') errors.push(`${row[1]} has no source or explicit absence marker`);
  for (const ref of refs) if (!sourceIds.has(ref)) errors.push(`${row[1]} cites missing ${ref}`);
}
for (const row of sourceRows) {
  for (const ref of row[4].match(/C-\d{3}/g) ?? []) if (!claimIds.has(ref)) errors.push(`${row[1]} points to missing ${ref}`);
}
for (const ref of matrix.match(/C-\d{3}|S-\d{3}/g) ?? []) {
  if (ref.startsWith('C-') && !claimIds.has(ref)) errors.push(`matrix points to missing ${ref}`);
  if (ref.startsWith('S-') && !sourceIds.has(ref)) errors.push(`matrix points to missing ${ref}`);
}
console.log(JSON.stringify({claims: claimRows.length, sources: sourceRows.length, pending_second_review: claimRows.filter(r => r[6] === 'seed').length, errors}, null, 2));
if (errors.length) process.exitCode = 1;
