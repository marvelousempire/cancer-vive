import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import overview from "../README.md?raw";
import matrix from "../literature/MASTER-CANCER-DETRIMENT-MATRIX.md?raw";
import claims from "../literature/claims.md?raw";
import sources from "../literature/sources.md?raw";
import watch from "../literature/watch-cards.md?raw";

// Vite imports these files at build time. A main-branch content edit ships on the next Pages build.
const documents = [
  { id: "overview", label: "Overview", content: overview },
  { id: "matrix", label: "Master matrix", content: matrix },
  { id: "claims", label: "Claim ledger", content: claims },
  { id: "sources", label: "Source ledger", content: sources },
  { id: "watch", label: "Watch cards", content: watch }
];

export default function Corpus({ initial = "matrix" }) {
  const [selected, setSelected] = useState(initial);
  const document = documents.find((entry) => entry.id === selected) || documents[0];
  return (
    <section className="corpus" aria-label="Cancer Vive source documents">
      <div className="corpus-intro">
        <p className="eyebrow">From the repository</p>
        <h2>Read the research here.</h2>
        <p>These are the repository files included in this site build. “Seed” means a claim still needs a second evidence review. A trial listing does not establish treatment benefit.</p>
      </div>
      <div className="corpus-tabs" role="group" aria-label="Research document">
        {documents.map((entry) => <button key={entry.id} type="button" aria-pressed={selected === entry.id} onClick={() => setSelected(entry.id)}>{entry.label}</button>)}
      </div>
      <article className="corpus-document" key={document.id}>
        <Markdown remarkPlugins={[remarkGfm]} skipHtml
          components={{
            a: ({ href, children }) => {
              const safe = href && (/^(https?:\/\/|mailto:)/i.test(href) || /^(?![a-z]+:)[^#]/i.test(href));
              if (!safe) return <span>{children}</span>;
              const target = href.startsWith("http") ? href : "https://github.com/marvelousempire/cancer-vive/blob/main/" + href.replace(/^\.\//, "");
              return <a href={target} target="_blank" rel="noreferrer">{children}</a>;
            }
          }}>{document.content}</Markdown>
      </article>
    </section>
  );
}
