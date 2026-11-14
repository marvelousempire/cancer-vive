/* Public ResearchTHAT: the default is OS Auto, not the former Color preset.
   v3 intentionally ignores legacy v1/v2 values. Only explicit new choices persist. */
(() => {
  "use strict";
  const KEY="researchthat.appearance.v3";
  const modes=new Set(["auto","light","dark","color"]);
  const system=matchMedia("(prefers-color-scheme: dark)");
  let choice="auto",palette=null,root=null,select=null,observer=null,applying=false;
  try {
    const saved=localStorage.getItem(KEY);
    if(modes.has(saved))choice=saved;
  } catch {}
  const effective=()=>choice==="auto"?(system.matches?"dark":"light"):choice;
  const apply=()=>{
    if(!root||!palette||applying)return;
    const tokens=palette[effective()];
    if(!tokens)return;
    applying=true;
    const review=root.closest(".review");
    const surfaces=[
      document.documentElement,document.body,document.getElementById("root"),
      review,root,root.querySelector(".layout main")
    ].filter(Boolean);
    const mode=effective();
    for(const el of surfaces){
      for(const [name,value] of Object.entries(tokens)){
        if(name!=="bg"&&name!=="surface"&&name!=="surface-2"&&name!=="surface-3"&&name!=="soft"&&name!=="line"&&name!=="muted"&&name!=="rail-bg"&&name!=="blue"&&name!=="amber"&&name!=="rose"&&name!=="violet"&&name!=="mint"&&name!=="mint-strong"&&name!=="line-strong")continue;
        el.style.setProperty("--"+name,value);
      }
      el.style.colorScheme=mode==="dark"?"dark":"light";
    }
    if(review){
      review.dataset.researchSystemAppearance=mode;
      review.style.setProperty("--bg",tokens.bg);
      review.style.setProperty("--soft",tokens.soft);
    }
    document.documentElement.dataset.researchSystemAppearance=mode;
    root.dataset.researchAppearance=choice;
    root.dataset.researchResolvedAppearance=mode;
    if(select&&select.value!==choice)select.value=choice;
    applying=false;
  };
  const connect=()=>{
    const foundRoot=document.querySelector(".research-domain");
    const foundSelect=foundRoot?.querySelector("#theme");
    if(!foundRoot||!foundSelect)return false;
    root=foundRoot;
    if(select!==foundSelect){
      select=foundSelect;
      select.value=choice;
      select.addEventListener("change",()=>{
        if(!modes.has(select.value))return;
        choice=select.value;
        try{localStorage.setItem(KEY,choice);}catch{}
        apply();
      });
    }
    apply();
    return true;
  };
  fetch("./research-paint.json",{cache:"no-store"}).then(r=>{
    if(!r.ok)throw Error("Appearance palette unavailable");
    return r.json();
  }).then(p=>{palette=p;connect();apply();}).catch(()=>{});
  system.addEventListener("change",()=>{if(choice==="auto")apply();});
  // ACT can update its canvas class or inline variables after a view changes.
  // Reconcile to the chosen appearance without modifying owner data or behavior.
  const startObserver=()=>{
    if(observer)return;
    observer=new MutationObserver(records=>{
      if(applying)return;
      if(!root){connect();return;}
      const affected=records.some(r=>r.target===root||r.target===root.closest(".review")||
        (r.type==="childList"&&!root.isConnected));
      if(affected)connect();
    });
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["class","style"]});
  };
  if(!connect()){
    const wait=new MutationObserver(()=>{if(connect()){wait.disconnect();startObserver();}});
    wait.observe(document.documentElement,{childList:true,subtree:true});
  }else startObserver();
  window.addEventListener("pageshow",()=>{connect();apply();});
})();
