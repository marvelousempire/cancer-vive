/* ResearchTHAT catalog: one source-backed reading canvas; no invented foods or recipes. */
(() => {
 "use strict";
 if (window.__researchCatalogInstalled) return;
 const create=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
 const norm=value=>String(value||"").toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"");
 const FIELDS=["Item / variable","Form or constituent","Research question / rationale","Filed evidence","Human cancer research","Established treatment in this record?","Safety and form limits","Current research position"];
 const SOURCE_PUBLIC="./public-docs/MASTER-CANCER-DETRIMENT-MATRIX.md";
 const SOURCE_APP="https://github.com/marvelousempire/researchTHAT/blob/main/public-inputs/cancer-20261020/literature/MASTER-CANCER-DETRIMENT-MATRIX.md";
 const sourceUrl=window.ResearchThatMatrixData?SOURCE_APP:SOURCE_PUBLIC;
 function init(){
  const root=document.querySelector(".research-domain"),main=root?.querySelector(".layout main");
  if(!main)return false;
  window.__researchCatalogInstalled=true;
  const section=create("section","research-catalog");section.setAttribute("aria-label","Explore ResearchTHAT evidence");
  const header=create("div","research-catalog-heading");
  header.append(create("h1",null,"Explore the evidence"),create("p",null,"Start with a research question. Read what was found and what is still unknown."));
  const search=create("input","research-catalog-search");search.type="search";search.placeholder="Search a topic, ingredient or research term";
  search.setAttribute("aria-label","Search published Matrix records and their evidence");
  const toolbar=create("div","research-catalog-toolbar");
  const grid=create("button","research-catalog-choice","Grid"),list=create("button","research-catalog-choice","List"),filter=create("button","research-catalog-choice","Filter");
  for(const control of [grid,list,filter]){control.type="button";toolbar.append(control)}
  const filters=create("div","research-catalog-filters");filters.hidden=true;
  const types=[["all","All research"],["food","Food forms mentioned"],["care","Established care noted"],["recipes","Recipes"]];
  const options=new Map();let type="all",layout="grid",detail=null,rows=null;
  for(const [id,label] of types){const b=create("button","research-catalog-chip",label);b.type="button";
   b.addEventListener("click",()=>{type=id;detail=null;draw()});options.set(id,b);filters.append(b)}
  const count=create("p","research-catalog-count","Loading published research…");count.setAttribute("role","status");
  const entries=create("div","research-catalog-cards"),reader=create("article","research-catalog-reader");reader.hidden=true;
  const caution=create("p","research-catalog-caution","Research mentions are not food profiles or treatment recommendations. Each entry keeps its original form and limits.");
  section.append(header,search,toolbar,filters,count,entries,reader,caution);
  const phone=main.querySelector(".public-phone-nav");if(phone)phone.after(section);else main.prepend(section);
  root.classList.add("research-catalog-ready");
  // The static carrier may replace its duplicate public list; the real ACT
  // product must retain its authenticated research workspace and instruments.
  if(!window.ResearchThatMatrixData)root.classList.add("research-catalog-public");
  document.addEventListener("click",event=>{
   const target=event.target.closest?.('[data-public-room],.side [data-room],.footer-rail .build-path button');if(!target)return;
   const room=(target.dataset.publicRoom||target.dataset.room||target.getAttribute("aria-label")||target.textContent||"").toLowerCase().trim();
   const current=room==="topics"||room==="evidence"||room.includes("evidence");
   queueMicrotask(()=>root.classList.toggle("research-catalog-ready",current));
  },true);
  let openFilters=false,priorFocus=null,priorPosition=0;
  const hasFoodForm=row=>/\b(food|culinary|edible)\b/i.test(row[1]);
  const hasEstablishedCare=row=>/^yes\b/i.test(row[5]);
  const matching=()=>{
   const terms=norm(search.value).trim().split(/\s+/).filter(Boolean);
   return (rows||[]).filter(row=>(
    type==="all"||(type==="food"&&hasFoodForm(row))||(type==="care"&&hasEstablishedCare(row))
   )&&type!=="recipes"&&terms.every(term=>norm(row.join(" ")).includes(term)));
  };
  function showRecord(row){
   detail=row;priorFocus=document.activeElement;priorPosition=window.scrollY;
   reader.replaceChildren();
   const back=create("button","research-catalog-back","← Back to results");back.type="button";
   back.addEventListener("click",()=>{detail=null;draw();window.scrollTo({top:priorPosition,behavior:"instant"});
    if(priorFocus?.isConnected)priorFocus.focus({preventScroll:true});});
   reader.append(back,create("p","research-catalog-kind","Filed research record"),create("h2",null,row[0]));
   const intro=create("section","research-catalog-summary");
   intro.append(create("h3",null,"What is being studied?"),create("p",null,row[2]||"Question not filed"),
                create("h3",null,"What does the evidence say?"),create("p",null,row[3]||"Evidence not filed"));
   reader.append(intro);
   const limits=create("section","research-catalog-limits");
   limits.append(create("h3",null,"Important limits"),create("p",null,row[6]||"No limits filed"));
   reader.append(limits);
   const exact=create("details","research-catalog-evidence");
   const summary=create("summary",null,"Human evidence, exact forms and full record");exact.append(summary);
   for(const i of [1,4,5,7]){
    const block=create("section","research-catalog-field");block.append(create("h3",null,FIELDS[i]),create("p",null,row[i]||"Not filed"));exact.append(block);
   }
   reader.append(exact);
   const relations=create("details","research-catalog-evidence");
   relations.append(create("summary",null,"Recipes and relationships"),
    create("p",null,"This published Matrix does not include verified ingredient-to-recipe links. No recipe has been invented. A shared word does not establish a medical connection."));
   reader.append(relations);
   const link=create("a","research-catalog-source","Read the complete original Matrix");
   link.href=sourceUrl;link.target="_blank";link.rel="noopener noreferrer";reader.append(link);
   draw();reader.scrollIntoView({block:"start"});back.focus({preventScroll:true});
  }
  function draw(){
   if(!rows)return;
   const result=matching();grid.setAttribute("aria-pressed",String(layout==="grid"));list.setAttribute("aria-pressed",String(layout==="list"));
   filter.setAttribute("aria-expanded",String(openFilters));filters.hidden=!openFilters||!!detail;
   for(const [id,b] of options)b.setAttribute("aria-pressed",String(id===type));
   entries.classList.toggle("as-list",layout==="list");reader.hidden=!detail;entries.hidden=!!detail;
   search.hidden=!!detail;toolbar.hidden=!!detail;count.hidden=!!detail;
   if(detail)return;
   count.textContent=result.length+" of "+rows.length+" published Matrix records";
   entries.replaceChildren();
   if(!result.length){
    const empty=create("div","research-catalog-empty");
    empty.append(create("strong",null,type==="recipes"?"No verified recipes in this source":"No matching research records"),
     create("p",null,type==="recipes"?"The published Matrix has no ingredient-to-recipe inventory. Recipe profiles will appear only after approved source records exist.":"Try fewer words or clear the filter. A keyword match alone does not prove a connection."));
    entries.append(empty);return;
   }
   for(const row of result){
    const card=create("button","research-catalog-card");card.type="button";
    const symbol=create("span","research-catalog-symbol","▤");symbol.setAttribute("aria-hidden","true");
    const heading=create("span","research-catalog-card-head");heading.append(symbol,create("span","research-catalog-kind","Research record"));
    card.append(heading,create("strong",null,row[0]),create("span","research-catalog-form",row[2]||row[1]),
       create("span","research-catalog-more","Read evidence →"));
    card.addEventListener("click",()=>showRecord(row));entries.append(card);
   }
  }
  grid.addEventListener("click",()=>{layout="grid";draw()});list.addEventListener("click",()=>{layout="list";draw()});
  filter.addEventListener("click",()=>{openFilters=!openFilters;draw()});
  search.addEventListener("input",()=>{detail=null;draw()});
  function accept(data){
   if(data?.schema!=="researchthat.matrix-public-readonly/v1"||
      !Array.isArray(data.columns)||data.columns.length!==8||
      !Array.isArray(data.rows)||data.rows.length<20||
      data.rows.some(row=>!Array.isArray(row)||row.length!==8))
       throw Error("The published Matrix did not pass its source check.");
   rows=data.rows;draw();
  }
  if(window.ResearchThatMatrixData){try{accept(window.ResearchThatMatrixData)}catch(e){count.textContent=e.message}}
  else fetch("./public-matrix.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Matrix unavailable");return r.json()})
   .then(accept).catch(()=>{count.textContent="Research records unavailable. Try again when connected.";});
  return true;
 }
 if(!init()){
  const observer=new MutationObserver(()=>{if(init())observer.disconnect()});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("DOMContentLoaded",()=>{if(init())observer.disconnect()},{once:true});
 }
})();
