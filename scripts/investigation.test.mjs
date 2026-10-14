import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const topics=JSON.parse(readFileSync('src/user-messages.json')).normal_view.topics;
const ledger=JSON.parse(readFileSync('literature/investigation-questions.json')).questions;
test('missing evidence stays open rather than false',()=>{assert.ok(topics.some(t=>t.answer===null)); for(const t of topics) assert.equal(t.answer_label,t.answer===null?'Open':t.answer?'Yes, reported in this test':'No, reported in this test');});
test('answered questions have exact scope and filed proof',()=>{for(const q of ledger.filter(q=>q.answer!==null)){assert.equal(typeof q.answer,'boolean');assert.ok(q.scope.form&&q.scope.cancer_model&&q.scope.comparison&&q.scope.endpoint&&q.sources.length);}for(const t of topics){let q=ledger.find(q=>q.topic_id===t.id);assert.equal(q.question,t.question);assert.equal(q.answer,t.answer);}});
test('both requested original documents remain bundled into every renderer',()=>{let web=readFileSync('src/Corpus.jsx','utf8'),stage=readFileSync('scripts/prepare-apple.mjs','utf8');for(const name of ['MASTER-CANCER-DETRIMENT-MATRIX.md','TRUTH-FILTER.md']){assert.ok(web.includes(name));assert.ok(stage.includes(name));}});
