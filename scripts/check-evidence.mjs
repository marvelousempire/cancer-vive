#!/usr/bin/env node
// Cancer Vive evidence integrity check. Run: node scripts/check-evidence.mjs
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export function checkPublicContent(raw, receipt, knownClaims) {
  const errors = [];
  const data = JSON.parse(raw);
  const hash = createHash('sha256').update(raw).digest('hex');
  if (receipt.content_sha256 !== hash) errors.push('public copy changed after language review');
  if (receipt.tool !== 'ClarifyThat' || receipt.mode !== 'enforced' || receipt.profile !== 'board-grade-5' || receipt.status !== 'pass') errors.push('language review must pass the enforced board-grade-5 profile');
  if (!receipt.blocks?.length || receipt.blocks.some(block => block.status !== 'pass')) errors.push('a public text block has no passing language review');
  const topics = data.normal_view?.topics ?? [];
  const seen = new Set();
  for (const topic of topics) {
    if (seen.has(topic.id)) errors.push(`duplicate topic ${topic.id}`);
    seen.add(topic.id);
    if (!topic.question || !topic.answer_label || ![true,false,null].includes(topic.answer)) errors.push(`${topic.id} needs a valid Boolean question`);
    if (topic.answer === null && topic.answer_label !== "Open") errors.push(`${topic.id} must keep an unanswered question open`);
    for (const key of ['summary', 'research', 'human', 'caution', 'next_step']) if (!topic[key]?.trim()) errors.push(`${topic.id} is missing ${key}`);
    if (!data.normal_view.grades[topic.grade]) errors.push(`${topic.id} has an unknown proof label`);
    if (!topic.refs?.length) errors.push(`${topic.id} has no claim references`);
    for (const ref of topic.refs ?? []) if (!knownClaims.has(ref)) errors.push(`${topic.id} cites missing ${ref}`);
    if (!topic.sources?.length || topic.sources.some(source => !/^https:\/\//.test(source.url))) errors.push(`${topic.id} needs named HTTPS sources`);
  }
  return errors;
}

export function main() {

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
const raw = readFileSync(new URL('../src/user-messages.json', import.meta.url), 'utf8');
const receipt = JSON.parse(readFileSync(new URL('../literature/language-review.json', import.meta.url), 'utf8'));
errors.push(...checkPublicContent(raw, receipt, claimIds));
console.log(JSON.stringify({claims: claimRows.length, sources: sourceRows.length, pending_second_review: claimRows.filter(r => r[6] === 'seed').length, errors}, null, 2));
if (errors.length) process.exitCode = 1;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
