/* Read-only Matrix explorer: all claims come from the exact verified Matrix source. */
(() => {
  "use strict";
  const FIELDS=[
    ["Item / variable","Item / variable"],
    ["Key form or constituent","Form or constituent"],
    ["Cancer-relevant rationale currently filed","Research question / rationale"],
    ["Evidence in Cancer Vive","Evidence"],
    ["Human oncology evidence","Human research"],
    ["Established cancer treatment in this repo?","Established treatment?"],
    ["Important form / safety boundary","Safety and form limits"],
    ["Current Cancer Vive position","Current research position"]
  ];
  let installed=false;
  const make=(tag,cls,text)=>{
    const n=document.createElement(tag);if(cls)n.className=cls;
    if(text!==undefined)n.textContent=text;return n;
  };
  function init(){
    if(installed)return true;
    const root=document.querySelector(".research-domain");
    const main=root?.querySelector(".layout main");
    const guide=main?.querySelector(".public-learning-guide");
    if(!root||!main||!guide)return false;
    installed=true;
    const screen=make("section","public-matrix");
    screen.hidden=true;
    screen.setAttribute("aria-label","Master Cancer Detriment Matrix");
    const top=make("div","public-matrix-head");
    const back=make("button","public-matrix-back","← Back to research");
    back.type="button";
    const title=make("h1",null,"Research Matrix");
    const description=make("p","public-matrix-help","Search the filed items. Read the exact research position, human evidence and safety limits. A lab result is not proof of a cancer treatment.");
    top.append(back,title,description);
    const controls=make("div","public-matrix-controls");
    const search=make("input","public-matrix-search");
    search.type="search";search.placeholder="Find an item or form…";
    search.setAttribute("aria-label","Search Matrix items and forms");
    const sort=make("button","public-matrix-sort","A–Z");
    sort.type="button";sort.setAttribute("aria-pressed","false");
    const listMode=make("button","public-matrix-view","All items");
    listMode.type="button";listMode.setAttribute("aria-pressed","true");
    const tableMode=make("button","public-matrix-view","Full table");
    tableMode.type="button";tableMode.setAttribute("aria-pressed","false");
    controls.append(search,sort,listMode,tableMode);
    const count=make("p","public-matrix-count");count.setAttribute("role","status");
    const items=make("div","public-matrix-items");
    const reader=make("article","public-matrix-detail");
    reader.hidden=true;
    const tableArea=make("div","public-matrix-table-wrap");
    tableArea.hidden=true;tableArea.tabIndex=0;
    tableArea.setAttribute("role","region");
    tableArea.setAttribute("aria-label","Full Matrix comparison table. Scroll horizontally for more columns.");
    const source=make("a","public-matrix-source","Read original Matrix document");
    source.href="./public-docs/MASTER-CANCER-DETRIMENT-MATRIX.md";
    source.target="_blank";source.rel="noopener noreferrer";
    screen.append(top,controls,count,items,reader,tableArea,source);
    main.prepend(screen);
    let data=null,selected=null,mode="items",az=false,previousFocus=null,previousScroll=0;
    const escapeHTML=v=>String(v);
    function rows(){
      const q=search.value.toLocaleLowerCase().trim();
      const all=data?.rows||[];
      const found=all.filter(r=>[r[0],r[1]].join(" ").toLocaleLowerCase().includes(q));
      if(az)found.sort((a,b)=>a[0].localeCompare(b[0]));
      return found;
    }
    function showItem(row){
      selected=row;
      items.hidden=true;tableArea.hidden=true;controls.hidden=true;reader.hidden=false;
      reader.replaceChildren();
      const backItem=make("button","public-matrix-back","← All items");
      backItem.type="button";
      backItem.addEventListener("click",()=>{
        selected=null;reader.hidden=true;controls.hidden=false;render();search.focus();
      });
      reader.append(backItem,make("h2",null,row[0]));
      for(let i=1;i<FIELDS.length;i++){
        const group=make("section","public-matrix-field");
        group.append(make("h3",null,FIELDS[i][1]),make("p",null,row[i]||"Not filed"));
        reader.append(group);
      }
      backItem.focus();
      reader.scrollIntoView({block:"start"});
    }
    function render(){
      if(!data)return;
      reader.hidden=true;items.hidden=mode!=="items";tableArea.hidden=mode!=="table";
      listMode.setAttribute("aria-pressed",String(mode==="items"));
      tableMode.setAttribute("aria-pressed",String(mode==="table"));
      sort.setAttribute("aria-pressed",String(az));
      const matches=rows();
      count.textContent=matches.length+" of "+data.rows.length+" filed items";
      items.replaceChildren();
      if(!matches.length)items.append(make("p",null,"No matching items. Try another name or form."));
      for(const row of matches){
        const button=make("button","public-matrix-item");
        button.type="button";
        const name=make("strong",null,row[0]);
        const form=make("span",null,row[1]);
        const arrow=make("span","public-matrix-arrow","→");
        arrow.setAttribute("aria-hidden","true");
        button.append(name,form,arrow);
        button.addEventListener("click",()=>showItem(row));
        items.append(button);
      }
      tableArea.replaceChildren();
      const tbl=make("table","public-matrix-table");
      const tr=make("tr");for(const [label] of FIELDS){const th=make("th",null,label);th.scope="col";tr.append(th);}
      const thead=make("thead");thead.append(tr);tbl.append(thead);
      const tbody=make("tbody");
      for(const row of matches){const record=make("tr");row.forEach(cell=>record.append(make("td",null,cell)));tbody.append(record);}
      tbl.append(tbody);tableArea.append(tbl);
    }
    async function load(){
      if(data)return;
      count.textContent="Loading Matrix…";
      const response=await fetch("./public-matrix.json",{cache:"no-store"});
      if(!response.ok)throw Error("The public Matrix is unavailable.");
      const result=await response.json();
      if(result.schema!=="researchthat.matrix-public-readonly/v1"||result.columns.length!==8||
         !Array.isArray(result.rows)||!result.rows.length||result.rows.some(row=>row.length!==8))
        throw Error("The approved Matrix did not pass its format check.");
      data=result;render();
    }
    const open=()=>{
      previousFocus=document.activeElement;previousScroll=window.scrollY;
      screen.hidden=false;root.classList.add("public-matrix-open");
      reader.hidden=true;selected=null;controls.hidden=false;mode="items";search.value="";
      screen.scrollIntoView({block:"start"});
      load().catch(e=>{count.textContent=e.message;items.replaceChildren();});
      search.focus({preventScroll:true});
    };
    const close=()=>{
      screen.hidden=true;root.classList.remove("public-matrix-open");
      window.scrollTo({top:previousScroll,behavior:"instant"});
      if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
    };
    back.addEventListener("click",close);
    search.addEventListener("input",()=>{selected=null;render();});
    sort.addEventListener("click",()=>{az=!az;render();});
    listMode.addEventListener("click",()=>{mode="items";selected=null;render();});
    tableMode.addEventListener("click",()=>{mode="table";selected=null;render();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!screen.hidden){e.preventDefault();close();}});
    function addEntrance(parent,first=false){
      const b=make("button","public-matrix-launch","Matrix");
      b.type="button";b.setAttribute("aria-label","Open Research Matrix");
      b.addEventListener("click",open);
      if(first)parent.prepend(b);else parent.append(b);
      return b;
    }
    const guideActions=guide.querySelector(".public-learning-actions");
    if(guideActions)addEntrance(guideActions,true);
    const phoneNav=main.querySelector(".public-phone-nav");
    if(phoneNav){
      const tray=make("div","public-matrix-quick");
      tray.append(make("span",null,"Research Matrix"));
      addEntrance(tray);
      phoneNav.append(tray);
    }
    return true;
  }
  if(!init()){
    const observer=new MutationObserver(()=>{if(init())observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener("DOMContentLoaded",()=>{if(init())observer.disconnect();},{once:true});
  }
})();
