import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const topics=JSON.parse(readFileSync('src/user-messages.json')).normal_view.topics;
const context=JSON.parse(readFileSync('literature/cancer-stage-context.json'));
test('each topic names sourced stage and survival scope without turning missing data into zero',()=>{
 assert.equal(context.records.length,topics.length);
 for(const t of topics){assert.ok(context.records.find(r=>r.topic_id===t.id));
 const stage=t.study_details.find(r=>r.heading==='Cancer type and stage');assert.ok(stage?.sources?.length,t.id);
 if(!['chemotherapy','hcq','turmeric','castor-oil','comfrey','radiation'].includes(t.id))assert.match(stage.text,/No human cancer stage was tested/);
 if(!['chemotherapy','hcq','radiation'].includes(t.id))assert.match(t.study_details.find(r=>r.heading==='Survival in people').text,/No human|did not measure|not a survival|No checked/);
 }
});
test('chemo rates name treatment comparison, time origin and separate toxicity',()=>{
 const t=topics.find(t=>t.id==='chemotherapy');assert.equal(t.grade,'human');assert.equal(t.answer,true);
 const rate=t.study_details.find(r=>r.heading==='Survival at one and two years');assert.match(rate.text,/random assignment/);assert.match(rate.text,/35%/);assert.match(rate.text,/22%/);assert.match(rate.text,/13 percentage points/);
 assert.match(t.expert_view.identity,/153\/405/);assert.match(t.expert_view.identity,/93.9/);assert.match(t.expert_view.identity,/nonadherence|Nonadherence/);
});
