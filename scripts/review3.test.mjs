import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const n=JSON.parse(readFileSync('src/user-messages.json')).normal_view;
const find=id=>n.topics.find(t=>t.id===id);
test('oil cannot inherit the separate root result or a human stage',()=>{
 const t=find('dandelion-oil');assert.equal(t.answer,null);
 assert.match(t.study_details.find(r=>r.heading==='A separate root question has an answer').text,/Yes/);
 assert.match(t.study_details.find(r=>r.heading==='What was tested').text,/four mice per group/);
 assert.match(t.study_details.find(r=>r.heading==='What was tested').text,/not two separate animals/);
 assert.match(t.study_details.find(r=>r.heading==='Cancer type and stage').text,/No human cancer stage/);
});
test('breast radiation trials stay bound to their distinct node and surgery groups',()=>{
 const t=find('radiation');assert.equal(t.answer,true);
 assert.match(t.study_details.find(r=>r.heading==='A newer trial asked a narrower question').text,/more nodes removed/);
 assert.match(t.study_details.find(r=>r.heading==='If positive nodes became negative').text,/does not cover nodes that still had cancer/);
 assert.match(t.study_details.find(r=>r.heading==='Cancer type and stage').text,/nodes alone do not mean stage IV/);
 assert.match(t.expert_view.identity,/81.4%vs81.9%/);
});
test('stage care and harm lessons cannot promise all cases cured',()=>{
 const stage=n.lessons.find(l=>l.id==='cancer-stages');assert.ok(stage.sections.length>=9);
 const harm=n.lessons.find(l=>l.id==='radiation-care');assert.ok(harm.sections.length>=18);
 assert.match(harm.sections.find(r=>r.heading==='Lung scars: a real gap').text,/do not erase fixed scars/);
 assert.match(harm.sections.find(r=>r.heading==='What counts as solved?').text,/has not been shown/);
 const audit=JSON.parse(readFileSync('literature/third-source-audit-20261015.json'));assert.equal(audit.independent_reader,false);
});
test('all filed items including leaf and resin remain in the shared matrix data',()=>{
 assert.equal(n.topics.length,24);
 for(const id of ['dandelion-oil','cuban-oregano','shilajit','radiation','chemotherapy'])assert.ok(find(id)?.sources.length);
 for(const t of n.topics){assert.ok(t.form);assert.ok(t.study_details.some(r=>r.heading==='Cancer type and stage'&&r.sources?.length));}
});
