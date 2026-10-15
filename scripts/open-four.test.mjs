import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const topics=JSON.parse(readFileSync('src/user-messages.json')).normal_view.topics;
const ledger=JSON.parse(readFileSync('literature/investigation-questions.json')).questions;
const audit=JSON.parse(readFileSync('literature/open-question-review-20261015.json'));
test('new scoped findings cannot silently close four unmatched product questions',()=>{
 for(const id of ['dandelion-oil','castor-oil','comfrey','hydrogen-peroxide']){assert.equal(topics.find(t=>t.id===id).answer,null);assert.equal(ledger.find(t=>t.topic_id===id).answer,null);}
 assert.equal(audit.main_questions_still_open,4);assert.equal(audit.independent_reader,false);
});
test('observed combined-care response is separate from incremental efficacy',()=>{
 const followups=ledger.find(t=>t.topic_id==='hydrogen-peroxide').followup_questions;
 assert.equal(followups.find(q=>q.id==='gel-observed-local-response').answer,true);
 assert.equal(followups.find(q=>q.id==='gel-added-clinical-benefit').answer,null);
 const t=topics.find(t=>t.id==='hydrogen-peroxide');const row=t.study_details.find(r=>r.heading==='Did the gel add benefit beyond rays?');assert.match(row.text,/no separate rays-only group/);assert.match(row.text,/not a survival gain/);
 assert.match(t.study_details.find(r=>r.heading==='Did tumors respond in the human gel trial?').text,/before the three-month response scan/);
});
test('mechanism endpoint and tissue fields cannot become independent animal efficacy proof',()=>{
 const t=topics.find(t=>t.id==='hydrogen-peroxide');assert.match(t.expert_view.identity,/one xenograft\/condition/);assert.match(t.expert_view.identity,/not independent animals/);
 assert.match(t.study_details.find(r=>r.heading==='Did the gel reduce low-oxygen tumor areas?').text,/two of six/);
 assert.match(t.study_details.find(r=>r.heading==='What is the phase 2 study waiting to answer?').text,/no posted results/);
});
test('abstract-only oil lead and ground-root DNA harm retain their read and endpoint limits',()=>{
 assert.match(audit.read_levels['S-100'],/abstract only/i);
 const t=topics.find(t=>t.id==='comfrey');assert.match(t.study_details.find(r=>r.heading==='Did ground root raise liver DNA changes?').text,/not of tumor shrinkage/);
 assert.match(topics.find(t=>t.id==='dandelion-oil').study_details.find(r=>r.heading==='A new oil lead, with a full-paper gap').text,/full methods, control and repeat counts were not checked/i);
});
