import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const topics=JSON.parse(readFileSync('src/user-messages.json')).normal_view.topics;
const ledger=JSON.parse(readFileSync('literature/investigation-questions.json')).questions;
test('missing evidence stays open rather than false',()=>{assert.ok(topics.some(t=>t.answer===null)); for(const t of topics) assert.equal(t.answer_label,t.answer===null?'Open':t.answer?'Yes, reported in this test':'No, reported in this test');});
test('answered questions have exact scope and filed proof',()=>{for(const q of ledger.filter(q=>q.answer!==null)){assert.equal(typeof q.answer,'boolean');assert.ok(q.scope.form&&q.scope.cancer_model&&q.scope.comparison&&q.scope.endpoint&&q.sources.length);}for(const t of topics){let q=ledger.find(q=>q.topic_id===t.id);assert.equal(q.question,t.question);assert.equal(q.answer,t.answer);}});
test('both requested original documents remain bundled into every renderer',()=>{let web=readFileSync('src/Corpus.jsx','utf8'),stage=readFileSync('scripts/prepare-apple.mjs','utf8');for(const name of ['MASTER-CANCER-DETRIMENT-MATRIX.md','TRUTH-FILTER.md']){assert.ok(web.includes(name));assert.ok(stage.includes(name));}});
test('negative answers name the failed benefit rather than an absent study',()=>{
 for(const id of ['turmeric','zinc','hcq']){const t=topics.find(t=>t.id===id),q=ledger.find(q=>q.topic_id===id);assert.equal(t.answer,false);assert.ok(q.proof?.read_level);assert.ok(q.original_question);assert.equal(q.broader_question_state,'open');}
 assert.match(ledger.find(q=>q.topic_id==='hcq').scope.endpoint,/survival/);
 assert.match(ledger.find(q=>q.topic_id==='zinc').scope.cancer_model,/B16F10/);
});
test('source concerns and unmatched forms cannot acquire a Yes',()=>{
 for(const id of ['ivermectin','castor-oil','comfrey','dmso','spike-proteins','hydrogen-peroxide','wormwood','magnesium'])assert.equal(topics.find(t=>t.id===id).answer,null);
 assert.match(topics.find(t=>t.id==='ivermectin').research,/2026/);
 assert.match(ledger.find(q=>q.topic_id==='ivermectin').review_state,/disputed/);
 assert.match(ledger.find(q=>q.topic_id==='capsaicin').proof.read_level,/abstract/);
});
