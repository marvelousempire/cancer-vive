import React from "react";
import registry from "./research-integrations.json";

export default function ResearchIntegrationPanel() {
  return <section className="section-block" aria-label="Research and reasoning system boundaries">
    <div className="section-head"><h2>Research and reasoning systems</h2><p>{registry.disclosure}</p></div>
    <div className="evidence-grid">{registry.systems.map(system=><article className="evidence-card" key={system.id}>
      <h3>{system.name}</h3><p>{system.role}</p><p><strong>Integration status:</strong> {system.status === "reference-only" ? "Repository contract identified; no live service connected" : "Owner and contract verification required"}</p>
      <details className="topic-details"><summary>Authority, allowed actions and safeguards</summary><p>{system.allowed}</p><p><strong>Not permitted:</strong> {system.blocked}</p></details>
      {system.reference && <div className="source-links"><a href={system.reference} target="_blank" rel="noreferrer">View owning repository ↗</a></div>}
    </article>)}</div>
  </section>;
}
