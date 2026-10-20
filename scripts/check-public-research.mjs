import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export function checkResearchAdditions(raw,pin,receipt,base){
 const errors=[];const data=JSON.parse(raw);const hash=s=>createHash('sha256').update(s).digest('hex');
 if(hash(raw)!==pin.public_sha256||hash(raw)!==receipt.content_sha256)errors.push('public additions changed after review');
 if(receipt.status!=='pass'||receipt.mode!=='enforced'||receipt.profile!=='board-grade-5')errors.push('additions language gate is missing');
 const ids=new Set(base.normal_view.topics.map(t=>t.id));
 for(const topic of data.topics){
  if(ids.has(topic.id))errors.push('duplicate topic '+topic.id);ids.add(topic.id);
  if(topic.answer!==null||topic.review_status!=='clinical-review-pending'||!topic.answer_label.startsWith('Open'))errors.push('review gap must stay Open');
  if(!base.normal_view.grades[topic.grade])errors.push('unknown proof label');
  for(const key of ['question','summary','research','human','caution','next_step','form'])if(!topic[key]?.trim())errors.push('missing '+key);
  if(!topic.refs?.length||!topic.sources?.length||!topic.study_details?.length)errors.push('missing proof');
  const urls=new Set();
  for(const ref of topic.refs??[]){if(!pin.references[ref])errors.push('unresolved reference '+ref);else urls.add(pin.references[ref]);}
  for(const s of [...(topic.sources??[]),...(topic.study_details??[]).flatMap(d=>d.sources??[])]){
   try {const url=new URL(s.url);if(url.protocol!=='https:'||url.username||url.password||!s.label||!urls.has(s.url))errors.push('unfiled or unsafe source');}catch{errors.push('invalid source');}
  }
  for(const url of urls)if(!topic.sources.some(s=>s.url===url))errors.push('reference lacks public link');
  if(topic.study_details.some(d=>!d.heading||!d.text||!d.sources?.length))errors.push('missing study detail');
  const prose=[...['summary','research','human','caution','next_step'].map(k=>topic[k]),...topic.study_details.map(d=>d.text)].join(' ');
  const block=receipt.blocks.find(b=>b.id===topic.id);if(block?.status!=='pass'||block?.text_sha256!==hash(prose))errors.push('stale topic wording review');
 }
 if(JSON.stringify(data.topics.map(t=>t.id))!==JSON.stringify(pin.topic_ids))errors.push('unexpected topic inventory');
 return errors;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
 const errors=checkResearchAdditions(read('src/research-additions.json'),JSON.parse(read('research-public-sync.json')),JSON.parse(read('literature/research-additions-language.json')),JSON.parse(read('src/user-messages.json')));
 console.log(JSON.stringify({research_additions:3,errors}));if(errors.length)process.exitCode=1;
}
