import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { evidenceItems, mechanismLabels } from "./data.js";
import "./styles.css";

const REPO = "https://github.com/marvelousempire/cancer-vive";
const MATRIX = REPO + "/blob/main/literature/MASTER-CANCER-DETRIMENT-MATRIX.md";
const CLAIMS = REPO + "/blob/main/literature/claims.md";
const SOURCES = REPO + "/blob/main/literature/sources.md";

function App() {
  const [query, setQuery] = useState("");
  const [mechanism, setMechanism] = useState("all");
  const [tone, setTone] = useState("all");

  const mechanisms = Object.keys(mechanismLabels);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return evidenceItems.filter((item) => {
      const queryMatch =
        !normalized ||
        [item.name, item.constituent, item.evidence, item.rationale, item.human, item.boundary]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const mechanismMatch = mechanism === "all" || item.mechanisms.includes(mechanism);
      const toneMatch = tone === "all" || item.tone === tone;
      return queryMatch && mechanismMatch && toneMatch;
    });
  }, [query, mechanism, tone]);

  const humanCount = evidenceItems.filter((item) => item.tone === "human").length;
  const harmCount = evidenceItems.filter((item) => item.tone === "harm").length;
  const auditCount = evidenceItems.filter((item) => item.tone === "audit").length;

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="nav">
          <a className="brand" href="#top" aria-label="Cancer Vive home">
            <span className="brand-mark">CV</span>
            <span>
              <strong>Cancer Vive</strong>
              <small>Evidence Explorer</small>
            </span>
          </a>
          <div className="nav-links">
            <a href={MATRIX} target="_blank" rel="noreferrer">Matrix</a>
            <a href={CLAIMS} target="_blank" rel="noreferrer">Claims</a>
            <a href={SOURCES} target="_blank" rel="noreferrer">Sources</a>
          </div>
        </nav>

        <div className="hero-grid" id="top">
          <section className="hero-copy">
            <p className="eyebrow">Research corpus · not treatment advice</p>
            <h1>Follow the evidence. Keep the forms separate.</h1>
            <p className="hero-text">
              Cancer Vive compares cancer-relevant substances, mechanisms, human evidence,
              and safety boundaries without quietly turning a mechanism into a cure.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#explorer">Explore the matrix</a>
              <a className="button ghost" href={REPO} target="_blank" rel="noreferrer">View repository</a>
            </div>
          </section>

          <aside className="signal-panel" aria-label="Evidence summary">
            <div className="signal-kicker">Current corpus</div>
            <div className="signal-number">{evidenceItems.length}</div>
            <div className="signal-label">filed variables</div>
            <div className="signal-grid">
              <div><strong>{humanCount}</strong><span>human oncology lanes</span></div>
              <div><strong>{auditCount}</strong><span>source-audit lanes</span></div>
              <div><strong>{harmCount}</strong><span>harm-flag lanes</span></div>
            </div>
          </aside>
        </div>
      </header>

      <main>
        <section className="ladder-section">
          <div className="section-heading">
            <p className="eyebrow">Evidence ladder</p>
            <h2>No skipped steps.</h2>
          </div>
          <div className="ladder" aria-label="Evidence progression">
            {["Idea", "Mechanism", "Cells", "Animals", "Human safety", "Oncology signal", "Controlled outcome", "Established treatment"].map((step, index) => (
              <div className="ladder-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="explorer" id="explorer">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Master detriment matrix</p>
              <h2>Compare what is actually filed.</h2>
            </div>
            <p className="section-note">
              “Human oncology evidence” means a human cancer study or trial exists for the named context.
              It does not mean an established cancer treatment.
            </p>
          </div>

          <div className="filter-bar">
            <label className="search">
              <span>Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="cloves, turmeric, immune, safety…"
              />
            </label>

            <label>
              <span>Mechanism</span>
              <select value={mechanism} onChange={(event) => setMechanism(event.target.value)}>
                <option value="all">All mechanisms</option>
                {mechanisms.map((key) => (
                  <option key={key} value={key}>{mechanismLabels[key]}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Evidence posture</span>
              <select value={tone} onChange={(event) => setTone(event.target.value)}>
                <option value="all">All evidence</option>
                <option value="human">Human oncology</option>
                <option value="investigate">Investigate</option>
                <option value="audit">Needs source audit</option>
                <option value="supportive">Supportive physiology</option>
                <option value="harm">Harm concern</option>
              </select>
            </label>
          </div>

          <div className="result-row">
            <span>{visible.length} of {evidenceItems.length} variables</span>
            {(query || mechanism !== "all" || tone !== "all") && (
              <button className="text-button" onClick={() => { setQuery(""); setMechanism("all"); setTone("all"); }}>
                Clear filters
              </button>
            )}
          </div>

          <div className="cards">
            {visible.map((item) => (
              <article className={"evidence-card tone-" + item.tone} key={item.id}>
                <div className="card-top">
                  <div>
                    <p className="card-id">{item.id}</p>
                    <h3>{item.name}</h3>
                  </div>
                  <span className="status-pill">{item.status}</span>
                </div>

                <p className="constituent">{item.constituent}</p>

                <div className="evidence-strip">
                  <span>Evidence in corpus</span>
                  <strong>{item.evidence}</strong>
                </div>

                <dl className="card-details">
                  <div>
                    <dt>Why it is here</dt>
                    <dd>{item.rationale}</dd>
                  </div>
                  <div>
                    <dt>Human oncology lane</dt>
                    <dd>{item.human}</dd>
                  </div>
                  <div>
                    <dt>Boundary</dt>
                    <dd>{item.boundary}</dd>
                  </div>
                </dl>

                <div className="tag-row">
                  {item.mechanisms.map((key) => (
                    <span className="tag" key={key}>{mechanismLabels[key]}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {visible.length === 0 && (
            <div className="empty-state">
              <strong>No variables match those filters.</strong>
              <span>The corpus remains stubbornly literal.</span>
            </div>
          )}
        </section>

        <section className="boundary-section">
          <div>
            <p className="eyebrow">Operating rule</p>
            <h2>Form matters.</h2>
          </div>
          <div className="boundary-copy">
            <p>
              Food, extract, oil, purified compound, and prescription drug are separate research objects.
              Evidence does not automatically transfer between them.
            </p>
            <p>
              Cancer Vive records research positions. It does not provide dosing, self-start instructions,
              or a substitute for oncology care.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <span>Cancer Vive · public research interface</span>
        <a href={REPO} target="_blank" rel="noreferrer">Canonical source on GitHub ↗</a>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
