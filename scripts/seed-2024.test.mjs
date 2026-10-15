import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const content=JSON.parse(readFileSync('src/user-messages.json'));
const topic=content.normal_view.topics.find(t=>t.id==='dandelion-oil');
const question=JSON.parse(readFileSync('literature/investigation-questions.json')).questions.find(t=>t.topic_id==='dandelion-oil');
const audit=JSON.parse(readFileSync('literature/seed2024-source-review.json'));
test('2024 selected extract findings do not close missing oil or human proof',()=>{
 assert.equal(topic.answer,null); assert.equal(question.answer,null);
 assert.equal(audit.independent_reader,false);
 assert.match(topic.study_details.find(r=>r.heading==='The 2024 seed study: what was tested').text,/does not test the pure seed oils/);
 assert.match(topic.study_details.find(r=>r.heading==='What this study cannot answer').text,/No tumor-bearing mice or people/);
 assert.match(topic.study_details.find(r=>r.heading==='What was read').text,/full paper and the 1992 castor report are still missing/);
});
test('Table3 ratios support FaDu Yes but reject all-cancer selectivity',()=>{
 assert.equal(question.followup_questions.find(q=>q.id==='seed2024-fadu-selectivity').answer,true);
 assert.equal(question.followup_questions.find(q=>q.id==='seed2024-all-cancer-selectivity').answer,false);
 assert.ok(794.65/347.40>2 && 578.15/274.60>2);
 assert.ok(794.65/974.90<1 && 578.15/633.95<1);
 assert.match(topic.study_details.find(r=>r.heading==='Were all cancer cells more sensitive?').text,/monkey kidneys/);
 assert.match(topic.study_details.find(r=>r.heading==='Did throat cancer cells show a stronger effect?').text,/0.82 and 0.91/);
});
test('all six primary table rows and health comparator remain distinct',()=>{
 assert.equal(audit.table3.length,6);
 assert.match(audit.table3[0][1],/794.65/);
 assert.match(audit.table3[1][1],/578.15/);
 assert.match(audit.table3[2][1],/480.55/);
 assert.match(audit.table3[5][1],/264.15/);
 assert.match(topic.study_details.find(r=>r.heading==='What the other plants showed').text,/milk thistle result is not a dandelion result/);
 assert.match(topic.study_details.find(r=>r.heading==='Setup, control and repeat gaps').text,/repeat count, final DMSO level or a matched DMSO-only control/);
 assert.match(topic.study_details.find(r=>r.heading==='How to read the cell numbers').text,/not doses for people/);
});
