/* Pages-only appearance adapter. The initial setting is Auto, ignoring the
   old color-default storage key. Future explicit user choices use a new key. */
(() => {
 "use strict";
 const KEY="researchthat.appearance.v2";
 const modes=new Set(["auto","light","dark","color"]);
 const system=matchMedia("(prefers-color-scheme: dark)");
 let palette=null,choice="auto",select=null,root=null;
 try {const saved=localStorage.getItem(KEY);if(modes.has(saved))choice=saved;} catch {}
 const effective=()=>choice==="auto"?(system.matches?"dark":"light"):choice;
 const apply=()=>{
   if(!palette||!root)return;
   const mode=effective(),tokens=palette[mode];
   if(!tokens)return;
   const review=root.closest(".review");
   for(const el of [root,review,document.documentElement].filter(Boolean)){
     for(const [key,value] of Object.entries(tokens))el.style.setProperty("--"+key,value);
     el.style.colorScheme=mode==="dark"?"dark":"light";
   }
   root.dataset.researchAppearance=choice;
   if(select&&select.value!==choice)select.value=choice;
 };
 const find=()=>{
   root=document.querySelector(".research-domain");
   select=root?.querySelector("#theme")||null;
   if(!select)return false;
   select.value=choice;
   // User action is the only event that saves an override.
   select.addEventListener("change",()=>{
     if(!modes.has(select.value))return;
     choice=select.value;
     try{localStorage.setItem(KEY,choice);}catch{}
     apply();
   });
   apply();
   return true;
 };
 fetch("./research-paint.json",{cache:"no-store"}).then(r=>{
   if(!r.ok)throw Error("Appearance palette unavailable");
   return r.json();
 }).then(value=>{palette=value;apply();}).catch(()=>{});
 system.addEventListener("change",()=>{if(choice==="auto")apply();});
 if(!find()){
   const obs=new MutationObserver(()=>{if(find())obs.disconnect();});
   obs.observe(document.documentElement,{childList:true,subtree:true});
 }
 window.addEventListener("pageshow",apply);
})();
