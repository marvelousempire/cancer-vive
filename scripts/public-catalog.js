/* ResearchTHAT mobile catalog. Read-only projection of filed Matrix records. */
(() => {
  "use strict";
  if (window.__researchCatalogInstalled) return;
  const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  const key=s=>String(s||"").toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"");
  const foodNames=["cloves","fenugreek","turmeric","curcumin","dandelion","ginger","garlic","strawberr","broccoli","green tea","black seed","flax","mushroom","cinnamon","saffron","pomegranate","grape","olive","onion","beet","carrot"];
  const kind=row=>foodNames.some(x=>key(row[0]).includes(x))?"Food or ingredient mention":"Research item";
  let started=false;
  function mount(){
    if(started)return true;
    const root=document.querySelector(".research-domain");
    const main=root?.querySelector(".layout main");
    if(!main)return false;
    started=true;window.__researchCatalogInstalled=true;
    const outer=node("section","research-catalog");
    outer.setAttribute("aria-label","Research catalog");
    const header=node("div","research-catalog-heading");
    header.append(node("h1",null,"Explore the research catalog"),node("p",null,"Browse filed items and their documented research connections. Search is optional."));
    const search=node("input","research-catalog-search");
    search.type="search";search.placeholder="Try an ingredient, breast, or two terms…";
    search.setAttribute("aria-label","Search catalog items, forms and evidence");
    const toolbar=node("div","research-catalog-toolbar");
    const grid=node("button","research-catalog-choice","Grid");
    const list=node("button","research-catalog-choice","List");
    const filter=node("button","research-catalog-choice","Filter");
    [grid,list,filter].forEach(b=>{b.type="button";toolbar.append(b)});
    const filters=node("div","research-catalog-filters");
    filters.hidden=true;
    const types=[["all","All filed items"],["food","Food mentions"],["research","Research"],["recipes","Recipes"]];
    const chips=new Map();
    let type="all",layout="grid",detail=null,rows=null;
    for(const [value,label] of types){
      const b=node("button","research-catalog-chip",label);b.type="button";
      b.addEventListener("click",()=>{type=value;detail=null;draw();});
      chips.set(value,b);filters.append(b);
    }
    const tally=node("p","research-catalog-count","Loading filed research records…");
    tally.setAttribute("role","status");
    const entries=node("div","research-catalog-cards");
    const reader=node("article","research-catalog-reader");reader.hidden=true;
    const caution=node("p","research-catalog-caution","A mention or laboratory finding is not proof of a treatment. Sources and form limits matter.");
    outer.append(header,search,toolbar,filters,tally,entries,reader,caution);
    const phone=main.querySelector(".public-phone-nav");
    if(phone)phone.after(outer);else main.prepend(outer);
    root.classList.add("research-catalog-ready");
    // Catalog owns the landing only. Other ResearchThat rooms retain their real controls.
    document.addEventListener("click",event=>{
      const target=event.target.closest?.('[data-public-room],.side [data-room],.footer-rail .build-path button');
      if(!target)return;
      const room=(target.dataset.publicRoom||target.dataset.room||target.getAttribute("aria-label")||target.textContent||"").toLowerCase().trim();
      const evidence=room==="topics"||room==="evidence"||room.includes("evidence");
      queueMicrotask(()=>root.classList.toggle("research-catalog-ready",evidence));
    },true);
    const fieldNames=["Item / variable","Form or constituent","Research rationale","Evidence","Human cancer research","Established treatment?","Safety and form limits","Current research position"];
    const sourceUrl=window.ResearchThatMatrixData?.source?.startsWith("http")?window.ResearchThatMatrixData.source:
      (window.ResearchThatMatrixData ? null : "./public-docs/MASTER-CANCER-DETRIMENT-MATRIX.md");
    function matches(row,terms){const text=key(row.join(" "));return terms.every(t=>text.includes(t));}
    function visible(){
      const terms=key(search.value).trim().split(/\s+/).filter(Boolean);
      return (rows||[]).filter(r=>(type==="all"||type==="research"||(type==="food"&&kind(r)==="Food or ingredient mention"))&&type!=="recipes"&&matches(r,terms));
    }
    function openRecord(row){
      detail=row;reader.replaceChildren();
      const back=node("button","research-catalog-back","← All items");back.type="button";
      back.addEventListener("click",()=>{detail=null;draw();});
      reader.append(back,node("h2",null,row[0]),node("p","research-catalog-subtitle",kind(row)));
      for(let i=1;i<row.length;i++){
        const section=node("section","research-catalog-field");
        section.append(node("h3",null,fieldNames[i]),node("p",null,row[i]||"Not filed"));
        reader.append(section);
      }
      const relations=node("section","research-catalog-field");
      relations.append(node("h3",null,"Recipes and ingredient relationships"),node("p",null,"No verified recipe-to-ingredient relationship is included in this public Matrix. Future approved recipe records must identify each ingredient and source before appearing here."));
      reader.append(relations);
      if(sourceUrl){const a=node("a","research-catalog-source","Read the original Matrix");a.href=sourceUrl;a.target="_blank";a.rel="noopener noreferrer";reader.append(a);}
      draw();back.focus({preventScroll:true});reader.scrollIntoView({block:"start"});
    }
    function draw(){
      if(!rows)return;
      const result=visible();
      grid.setAttribute("aria-pressed",String(layout==="grid"));
      list.setAttribute("aria-pressed",String(layout==="list"));
      filter.setAttribute("aria-expanded",String(!filters.hidden));
      for(const [k,b] of chips)b.setAttribute("aria-pressed",String(type===k));
      entries.classList.toggle("as-list",layout==="list");
      reader.hidden=!detail;entries.hidden=!!detail;
      tally.hidden=!!detail;search.hidden=!!detail;toolbar.hidden=!!detail;filters.hidden=!!detail||filters.hidden;
      if(detail)return;
      tally.textContent=result.length+" matching filed items · "+rows.length+" Matrix records";
      entries.replaceChildren();
      if(!result.length){
        const empty=node("div","research-catalog-empty");
        empty.append(node("strong",null,type==="recipes"?"No verified recipes in this published Matrix":"No direct filed match"),node("p",null,type==="recipes"?"The recipe inventory is not published in this source. No example recipes have been substituted.":"No single filed record matches every term. Try the words separately; shared keywords do not establish a medical relationship."));
        entries.append(empty);return;
      }
      for(const row of result){
        const b=node("button","research-catalog-card");b.type="button";
        b.append(node("span","research-catalog-kind",kind(row)),node("strong",null,row[0]),node("span","research-catalog-form",row[1]),node("span","research-catalog-more","View profile →"));
        b.addEventListener("click",()=>openRecord(row));entries.append(b);
      }
    }
    grid.addEventListener("click",()=>{layout="grid";draw();});
    list.addEventListener("click",()=>{layout="list";draw();});
    filter.addEventListener("click",()=>{filters.hidden=!filters.hidden;filter.setAttribute("aria-expanded",String(!filters.hidden));});
    search.addEventListener("input",()=>{detail=null;draw();});
    function accept(data){
      if(data?.schema!=="researchthat.matrix-public-readonly/v1"||!Array.isArray(data.rows)||!data.rows.length||
         !data.rows.every(r=>Array.isArray(r)&&r.length===8))throw Error("The published Matrix did not pass its source check.");
      rows=data.rows;draw();
    }
    if(window.ResearchThatMatrixData){try{accept(window.ResearchThatMatrixData);}catch(e){tally.textContent=e.message;}}
    else fetch("./public-matrix.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Matrix unavailable");return r.json();}).then(accept).catch(()=>{tally.textContent="Catalog data unavailable. Open Matrix or retry when connected.";});
    return true;
  }
  if(!mount()){
    const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener("DOMContentLoaded",()=>{if(mount())observer.disconnect();},{once:true});
  }
})();