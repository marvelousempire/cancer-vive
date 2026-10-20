import React, { useEffect, useMemo, useState } from "react";
import designDNA from "../design-dna.profile.json";
import { content, navItems } from "./data.js";

const STATES = ["hidden","icon","expanded"];
const STORAGE_KEY = designDNA.domains.behavior.storage_key;

const sourceItems = [
  { id:"research", label:content.ui.sources, icon:"S" },
  { id:"education", label:content.ui.learn, icon:"?" }
];
const menuNames = {top:content.ui.top_menu,left:content.ui.side_menu,right:content.ui.sources_menu,bottom:content.ui.bottom_menu};
const menuActions = {hidden:content.ui.menu_show_icons,icon:content.ui.menu_show_names,expanded:content.ui.menu_hide};

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
    <aside className={"framework-rail rail-"+edge+" state-"+state} data-edge={edge} data-state={state} aria-label={menuNames[edge]}>
      <div className="framework-rail-body">
        {brand ? <div className="framework-rail-brand"><span>RT</span><strong>ResearchThat</strong><small>{content.ui.learn}</small></div> : null}
        <div className={"framework-rail-items "+(horizontal?"horizontal":"vertical")}>
          {items.map((item,index)=><RailButton item={item} state={state} onNavigate={onNavigate} key={index+":"+(item.id||item.href)}/>)}
        </div>
      </div>
      <button
        className="framework-rail-lip"
        onClick={()=>setState(nextState(state))}
        aria-label={menuNames[edge]+": "+menuActions[state]}
        title={menuActions[state]}
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
      if(stored && typeof stored === "object"){
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
        <div className="framework-stage-context"><span>{active?.icon}</span><strong>{active?.label}</strong></div>
        {children}
      </div>
    </div>
  );
}
