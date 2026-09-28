import React, { useEffect, useMemo, useState } from "react";
import designDNA from "../design-dna.profile.json";

const STATES = ["hidden","icon","expanded"];
const STORAGE_KEY = designDNA.domains.behavior.storage_key;

const navItems = [
  { id:"dashboard", label:"Dashboard", icon:"⌂" },
  { id:"matrix", label:"Matrix", icon:"▦" },
  { id:"mechanisms", label:"Mechanisms", icon:"⌬" },
  { id:"research", label:"Research queue", icon:"≡" }
];

const sourceItems = [
  { label:"Master matrix source", icon:"M", href:"https://github.com/marvelousempire/cancer-vive/blob/main/literature/MASTER-CANCER-DETRIMENT-MATRIX.md" },
  { label:"Claims ledger", icon:"C", href:"https://github.com/marvelousempire/cancer-vive/blob/main/literature/claims.md" },
  { label:"Source ledger", icon:"S", href:"https://github.com/marvelousempire/cancer-vive/blob/main/literature/sources.md" },
  { label:"Watch cards", icon:"W", href:"https://github.com/marvelousempire/cancer-vive/blob/main/literature/watch-cards.md" },
  { label:"GitHub repository", icon:"↗", href:"https://github.com/marvelousempire/cancer-vive" }
];

function nextState(state){ return STATES[(STATES.indexOf(state)+1)%STATES.length]; }
function sizeFor(edge,state){
  if(edge==="left"||edge==="right") return state==="hidden"?12:state==="icon"?62:220;
  return state==="hidden"?12:state==="icon"?58:86;
}

function RailButton({item,state,onNavigate}){
  const content=<><span className="framework-rail-icon" aria-hidden="true">{item.icon}</span><span className="framework-rail-label">{item.label}</span></>;
  if(item.href) return <a className="framework-rail-item" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>{content}</a>;
  return <button className="framework-rail-item" onClick={()=>onNavigate(item.id)} aria-label={item.label}>{content}</button>;
}

function EdgeRail({edge,state,setState,items,onNavigate,brand}){
  const horizontal=edge==="top"||edge==="bottom";
  return (
    <aside className={"framework-rail rail-"+edge+" state-"+state} data-edge={edge} data-state={state} aria-label={edge+" rail"}>
      <div className="framework-rail-body">
        {brand ? <div className="framework-rail-brand"><span>CV</span><strong>Cancer Vive</strong><small>Evidence Explorer</small></div> : null}
        <div className={"framework-rail-items "+(horizontal?"horizontal":"vertical")}>
          {items.map((item)=><RailButton item={item} state={state} onNavigate={onNavigate} key={item.id||item.href}/>)}
        </div>
      </div>
      <button
        className="framework-rail-lip"
        onClick={()=>setState(nextState(state))}
        aria-label={edge+" rail: "+state+". Change rail state"}
        title={edge+" rail · "+state+" → "+nextState(state)}
      >
        <span>{state==="hidden"?"＋":state==="icon"?"◫":"−"}</span>
      </button>
    </aside>
  );
}

export default function FrameworkShell({activeView,onNavigate,children}){
  const defaults=designDNA.domains.rails;
  const [rails,setRails]=useState(()=>({
    top:defaults.top.default_state,
    right:defaults.right.default_state,
    bottom:defaults.bottom.default_state,
    left:defaults.left.default_state
  }));

  useEffect(()=>{
    try{
      const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
      if(stored && STATES.every(()=>true)){
        setRails((current)=>Object.fromEntries(Object.entries(current).map(([edge,value])=>[edge,STATES.includes(stored[edge])?stored[edge]:value])));
      }
    }catch{}
  },[]);

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY,JSON.stringify(rails)); }catch{}
  },[rails]);

  const setEdge=(edge)=>(state)=>setRails((current)=>({...current,[edge]:state}));
  const insets=useMemo(()=>({
    "--rail-top-inset":sizeFor("top",rails.top)+"px",
    "--rail-right-inset":sizeFor("right",rails.right)+"px",
    "--rail-bottom-inset":sizeFor("bottom",rails.bottom)+"px",
    "--rail-left-inset":sizeFor("left",rails.left)+"px"
  }),[rails]);

  const active=navItems.find((item)=>item.id===activeView);

  return (
    <div className="framework-shell" style={insets} data-top-state={rails.top} data-right-state={rails.right} data-bottom-state={rails.bottom} data-left-state={rails.left}>
      <EdgeRail edge="top" state={rails.top} setState={setEdge("top")} items={navItems} onNavigate={onNavigate} brand />
      <EdgeRail edge="left" state={rails.left} setState={setEdge("left")} items={navItems} onNavigate={onNavigate} />
      <EdgeRail edge="right" state={rails.right} setState={setEdge("right")} items={sourceItems} onNavigate={onNavigate} />
      <EdgeRail edge="bottom" state={rails.bottom} setState={setEdge("bottom")} items={[...navItems, ...sourceItems]} onNavigate={onNavigate} />
      <div className="framework-stage">
        <div className="framework-stage-context"><span>{active?.icon}</span><strong>{active?.label}</strong><small>React · Vite · Framework Design DNA</small></div>
        {children}
      </div>
    </div>
  );
}
