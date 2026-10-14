import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkPublicContent } from './check-evidence.mjs';
const raw = readFileSync(new URL('../src/user-messages.json', import.meta.url), 'utf8');
const receipt = JSON.parse(readFileSync(new URL('../literature/language-review.json', import.meta.url), 'utf8'));
const claims = new Set([...readFileSync(new URL('../literature/claims.md', import.meta.url), 'utf8').matchAll(/C-\d{3}/g)].map(x => x[0]));
test('reviewed public content has valid proof, risks, and source links', () => assert.deepEqual(checkPublicContent(raw, receipt, claims), []));
test('a copy edit cannot reuse an old language receipt', () => assert.ok(checkPublicContent(raw + '\n', receipt, claims).includes('public copy changed after language review')));
test('a failed text block refuses release', () => {
  const failed = structuredClone(receipt); failed.blocks[0].status = 'fail';
  assert.ok(checkPublicContent(raw, failed, claims).some(x => x.includes('no passing language review')));
});
test('a missing claim or caution refuses release', () => {
  const changed = JSON.parse(raw); changed.normal_view.topics[0].caution = ''; changed.normal_view.topics[0].refs = ['C-999'];
  const errors = checkPublicContent(JSON.stringify(changed), receipt, claims);
  assert.ok(errors.some(x => x.includes('missing caution'))); assert.ok(errors.some(x => x.includes('missing C-999')));
});
