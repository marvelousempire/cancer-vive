import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import matrix from "../literature/MASTER-CANCER-DETRIMENT-MATRIX.md?raw";
import filter from "../literature/TRUTH-FILTER.md?raw";
import claims from "../literature/claims.md?raw";
import sources from "../literature/sources.md?raw";
import { content, expertContent } from "./data.js";

const u = content.ui;
const documents = [
  { id: "sources", label: u.citations, content: sources },
  { id: "claims", label: u.claims, content: claims }
];

export default function Corpus({ initial = "sources" }) {
  const [selected,setSelected] = useState(initial);
  const record = documents.find((item)=>item.id===selected) ?? documents[0];
  return <section className="corpus" aria-label={u.study_records}>
    <p>{u.sources_description}</p>
    <details className="expert-details">
      <summary>{u.expert}</summary><p>{expertContent.study_records}</p>
      <div className="corpus-tabs" role="group" aria-label={u.study_records}>{documents.map((item)=><button type="button" key={item.id} aria-pressed={selected===item.id} onClick={()=>setSelected(item.id)}>{item.label}</button>)}</div>
      <article className="corpus-document" key={record.id}>
        <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{a:({href,children})=>/^https?:\/\//i.test(href ?? "") ? <a href={href} target="_blank" rel="noreferrer">{children}</a> : <span>{children}</span>}}>{record.content}</Markdown>
      </article>
    </details>
  </section>;
}

export function ResearchDocuments() { return <section><h2>Research method and full matrix</h2>{[{title:"Full cancer detriment matrix",text:matrix},{title:"Original eight-review Truth Filter",text:filter}].map(doc=><details className="expert-details" key={doc.title}><summary>{doc.title} · Expert details</summary><article className="corpus-document"><Markdown remarkPlugins={[remarkGfm]} skipHtml>{doc.text}</Markdown></article></details>)}</section>; }
