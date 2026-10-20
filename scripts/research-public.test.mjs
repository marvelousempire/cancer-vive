import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read = p => readFileSync(new URL('../'+p,import.meta.url),'utf8');
const additions = JSON.parse(read('src/research-additions.json'));
const pin = JSON.parse(read('research-public-sync.json'));
const receipt = JSON.parse(read('literature/research-additions-language.json'));
const hash = s => createHash('sha256').update(s).digest('hex');
test('public additions bind to the reviewed content bytes and all three topics',()=>{
 assert.equal(hash(read('src/research-additions.json')),pin.public_sha256);
 assert.equal(receipt.content_sha256,pin.public_sha256);
 assert.equal(receipt.status,'pass');
 assert.equal(receipt.profile,'board-grade-5');
 assert.deepEqual(additions.topics.map(t=>t.id),['aloe-vera','vitamin-b1','benfotiamine']);
 for(const t of additions.topics){
  assert.equal(t.answer,null);assert.equal(t.review_status,'clinical-review-pending');
  assert.ok(t.study_details.length>=3);assert.ok(t.caution);
  const text=[...['summary','research','human','caution','next_step'].map(k=>t[k]),...t.study_details.map(d=>d.text)].join(' ');
  assert.equal(receipt.blocks.find(b=>b.id===t.id).text_sha256,hash(text));
  assert.equal(receipt.blocks.find(b=>b.id===t.id).status,'pass');
  for(const s of [...t.sources,...t.study_details.flatMap(d=>d.sources)]){
   const u=new URL(s.url);assert.equal(u.protocol,'https:');assert.equal(u.username,'');assert.equal(u.password,'');
  }
 }
});
test('food B1 is distinct from benfotiamine and patient outcomes stay limited',()=>{
 const b1=additions.topics[1],benfo=additions.topics[2];
 assert.match(JSON.stringify(b1),/A food B1 tag does not mean/);
 assert.match(JSON.stringify(benfo),/no control group/);
 assert.match(JSON.stringify(benfo),/healthy-cell safety range/);
 assert.match(JSON.stringify(additions.topics[0]),/full trial.*tables/i);
});
test('the public renderer includes new topics and review limits without a private API',()=>{
 assert.match(read('src/data.js'),/\.\.\.additions.topics/);
 assert.match(read('src/App.jsx'),/clinical-review-pending/);
 assert.doesNotMatch(read('src/data.js'),/fetch\(|\/api\//);
 assert.match(read('index.html'),/<title>ResearchThat/);
});
