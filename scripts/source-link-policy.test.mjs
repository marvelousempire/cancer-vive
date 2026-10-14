import test from 'node:test';
import assert from 'node:assert/strict';
import { sourceLinks } from './source-link-policy.mjs';
test('filed full citations remain usable in the desktop and native archives',()=>{
  const links=sourceLinks({normal_view:{}},'[Study](https://pubmed.ncbi.nlm.nih.gov/41376334/)');
  assert.ok(links.some(x=>x.url==='https://pubmed.ncbi.nlm.nih.gov/41376334/'));
  assert.ok(!links.some(x=>x.url==='https://unknown.example/'));
});
test('a credential URL or local-file source refuses policy generation',()=>{
  for(const url of ['https://secret@example.org/','file:///etc/passwd']) assert.throws(()=>sourceLinks({normal_view:{sources:[{label:'bad',url}]}},''));
});
