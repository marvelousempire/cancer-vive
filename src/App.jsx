import React, { useMemo, useState } from "react";
import { evidenceItems, evidenceClasses, mechanismLabels, researchQueue } from "./data.js";
import FrameworkShell from "./FrameworkShell.jsx";
import Corpus from "./Corpus.jsx";

const REPO = "https://github.com/marvelousempire/cancer-vive";
const LINKS = {
  matrix: REPO + "/blob/main/literature/MASTER-CANCER-DETRIMENT-MATRIX.md",
  claims: REPO + "/blob/main/literature/claims.md",
  sources: REPO + "/blob/main/literature/sources.md",
  watch: REPO + "/blob/main/literature/watch-cards.md"
};

const views = [
  ["dashboard", "Dashboard"],
  ["matrix", "Matrix"],
  ["mechanisms", "Mechanisms"],
  ["research", "Research queue"]
];

function EvidenceBadge({ kind }) {
  return <span className={"evidence-badge evidence-" + kind}>{evidenceClasses[kind]?.label ?? kind}</span>;
}

function Metric({ value, label, detail }) {
  return (
    <article className="metric">
      <span className="metric-value">{value}</span>
      <strong>{label}</strong>
      <p>{detail}</p>
    </article>
  );
}

function CompareTray({ ids, onRemove, onClear, onOpen }) {
  if (!ids.length) return null;
  return (
    <div className="compare-tray">
      <div>
        <span className="compare-kicker">Comparison set</span>
        <strong>{ids.length} selected</strong>
      </div>
      <div className="compare-actions">
        <button className="quiet-button" onClick={onClear}>Clear</button>
        <button className="primary-button" onClick={onOpen}>Compare</button>
      </div>
      <div className="compare-chips">
        {ids.map((id) => {
          const item = evidenceItems.find((candidate) => candidate.id === id);
          return (
            <button className="compare-chip" key={id} onClick={() => onRemove(id)}>
              {item?.short} <span>×</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompareModal({ ids, onClose }) {
  const selected = ids.map((id) => evidenceItems.find((item) => item.id === id)).filter(Boolean);
  if (!selected.length) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="compare-modal" role="dialog" aria-modal="true" aria-label="Evidence comparison" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="eyebrow">Side-by-side</p>
            <h2>Compare without collapsing the forms.</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close comparison">×</button>
        </div>
        <div className="compare-grid">
          {selected.map((item) => (
            <article className="compare-column" key={item.id}>
              <EvidenceBadge kind={item.evidenceClass} />
              <h3>{item.name}</h3>
              <p className="muted">{item.constituent}</p>
              <div className="compare-field"><span>Corpus evidence</span><strong>{item.evidence}</strong></div>
              <div className="compare-field"><span>Human oncology</span><p>{item.human}</p></div>
              <div className="compare-field"><span>Why it is here</span><p>{item.rationale}</p></div>
              <div className="compare-field"><span>Boundary</span><p>{item.boundary}</p></div>
              <div className="tag-row">
                {item.mechanisms.map((key) => <span className="tag" key={key}>{mechanismLabels[key]}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const counts = Object.keys(evidenceClasses).reduce((acc, key) => {
    acc[key] = evidenceItems.filter((item) => item.evidenceClass === key).length;
    return acc;
  }, {});

  const mechanismCounts = Object.entries(mechanismLabels)
    .map(([key, label]) => ({ key, label, count: evidenceItems.filter((item) => item.mechanisms.includes(key)).length }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Cancer Vive · evidence explorer</p>
          <h1>Explore the claims. See the evidence and the gaps.</h1>
          <p className="hero-text">
            Explore cancer-relevant substances, mechanisms, human evidence, safety boundaries, and open research work
            with each source and open review visible. A mechanism or trial listing is not a proven treatment.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onNavigate("matrix")}>Open master matrix</button>
            <a className="secondary-button" href={LINKS.sources} target="_blank" rel="noreferrer">Open source ledger ↗</a>
          </div>
        </div>
        <div className="hero-orbit">
          <div className="orbit-core">
            <span>{evidenceItems.length}</span>
            <strong>variables</strong>
          </div>
          <div className="orbit-note orbit-one">mechanisms</div>
          <div className="orbit-note orbit-two">human evidence</div>
          <div className="orbit-note orbit-three">boundaries</div>
        </div>
      </section>

      <Corpus initial="overview" />

      <section className="metrics-grid">
        <Metric value={counts.human} label="Human oncology" detail="Human cancer studies or trials exist for the named context." />
        <Metric value={counts.preclinical} label="Preclinical" detail="Cell, animal, or pathway signal is present in the corpus." />
        <Metric value={counts.audit} label="Needs source audit" detail="The variable exists, but paper-level oncology sourcing is incomplete." />
        <Metric value={counts.harm} label="Harm concern" detail="Safety concerns are material regardless of anticancer claims." />
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Evidence ladder</p>
            <h2>Progress is explicit.</h2>
          </div>
          <p>No item jumps from a mechanism or trial listing to an established treatment claim.</p>
        </div>
        <div className="evidence-ladder">
          {["Idea", "Mechanism", "Cells", "Animals", "Human safety", "Oncology signal", "Controlled outcome", "Established treatment"].map((step, index) => (
            <div className="ladder-cell" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block two-column">
        <div>
          <div className="section-head compact">
            <div><p className="eyebrow">Mechanism map</p><h2>Where the corpus is dense.</h2></div>
          </div>
          <div className="mechanism-bars">
            {mechanismCounts.map((row) => (
              <div className="mechanism-bar-row" key={row.key}>
                <div className="mechanism-bar-label"><span>{row.label}</span><strong>{row.count}</strong></div>
                <div className="mechanism-bar-track"><span style={{ width: ((row.count / evidenceItems.length) * 100) + "%" }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rule-card">
          <p className="eyebrow">Operating rule</p>
          <h2>Form matters.</h2>
          <p>Food, extract, oil, purified compound, and prescription drug are separate research objects.</p>
          <p>Evidence does not inherit automatically from one form to another.</p>
          <a href={LINKS.matrix} target="_blank" rel="noreferrer">Read the canonical matrix ↗</a>
        </div>
      </section>
    </>
  );
}

function Mechanisms({ compareIds, toggleCompare }) {
  const [query, setQuery] = useState("");
  const [mechanism, setMechanism] = useState("all");
  const [evidenceClass, setEvidenceClass] = useState("all");
  const [layout, setLayout] = useState("cards");

  const filtered = useMemo(() => evidenceItems.filter((item) => {
    const haystack = [item.name, item.constituent, item.evidence, item.human, item.rationale, item.boundary].join(" ").toLowerCase();
    const textOk = !query.trim() || haystack.includes(query.trim().toLowerCase());
    const mechOk = mechanism === "all" || item.mechanisms.includes(mechanism);
    const evidenceOk = evidenceClass === "all" || item.evidenceClass === evidenceClass;
    return textOk && mechOk && evidenceOk;
  }), [query, mechanism, evidenceClass]);

  return (
    <section className="section-block view-section">
      <div className="section-head">
        <div><p className="eyebrow">Mechanism explorer</p><h1 className="view-title">Explore each variable by mechanism and evidence.</h1></div>
        <p>Search and filter substances by mechanism, form, human evidence, and safety boundary. Select up to three items for direct comparison.</p>
      </div>

      <div className="filter-panel">
        <label className="field field-wide">
          <span>Search corpus</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="cloves, curcumin, immune, trial, oil…" />
        </label>
        <label className="field">
          <span>Mechanism</span>
          <select value={mechanism} onChange={(e) => setMechanism(e.target.value)}>
            <option value="all">All mechanisms</option>
            {Object.entries(mechanismLabels).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Evidence class</span>
          <select value={evidenceClass} onChange={(e) => setEvidenceClass(e.target.value)}>
            <option value="all">All evidence</option>
            {Object.entries(evidenceClasses).map(([key, value]) => <option value={key} key={key}>{value.label}</option>)}
          </select>
        </label>
        <div className="view-toggle" aria-label="Layout">
          <button className={layout === "cards" ? "active" : ""} onClick={() => setLayout("cards")}>Cards</button>
          <button className={layout === "table" ? "active" : ""} onClick={() => setLayout("table")}>Table</button>
        </div>
      </div>

      <div className="result-line"><strong>{filtered.length}</strong> of {evidenceItems.length} variables</div>

      {layout === "cards" ? (
        <div className="evidence-grid">
          {filtered.map((item) => {
            const selected = compareIds.includes(item.id);
            return (
              <article className={"evidence-card class-" + item.evidenceClass} key={item.id}>
                <div className="card-head">
                  <EvidenceBadge kind={item.evidenceClass} />
                  <button
                    className={"compare-toggle " + (selected ? "selected" : "")}
                    disabled={!selected && compareIds.length >= 3}
                    onClick={() => toggleCompare(item.id)}
                  >
                    {selected ? "Selected ✓" : "Compare +"}
                  </button>
                </div>
                <h3>{item.name}</h3>
                <p className="muted">{item.constituent}</p>
                <div className="evidence-statement"><span>Corpus evidence</span><strong>{item.evidence}</strong></div>
                <dl>
                  <div><dt>Why it is here</dt><dd>{item.rationale}</dd></div>
                  <div><dt>Human oncology</dt><dd>{item.human}</dd></div>
                  <div><dt>Boundary</dt><dd>{item.boundary}</dd></div>
                </dl>
                <div className="tag-row">{item.mechanisms.map((key) => <span className="tag" key={key}>{mechanismLabels[key]}</span>)}</div>
                {!!item.refs.length && <div className="refs"><span>Filed refs</span>{item.refs.map((ref) => <code key={ref}>{ref}</code>)}</div>}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="matrix-table">
            <thead><tr><th>Variable</th><th>Evidence</th><th>Human oncology</th><th>Boundary</th><th></th></tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong><span>{item.constituent}</span></td>
                  <td><EvidenceBadge kind={item.evidenceClass} /><p>{item.evidence}</p></td>
                  <td>{item.human}</td>
                  <td>{item.boundary}</td>
                  <td><button className="table-compare" onClick={() => toggleCompare(item.id)}>{compareIds.includes(item.id) ? "✓" : "+"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Matrix() {
  const mechanisms = Object.entries(mechanismLabels).filter(([key]) => !["source-audit", "harm"].includes(key));
  return (
    <section className="section-block view-section">
      <div className="section-head">
        <div><p className="eyebrow">Master matrix</p><h1 className="view-title">Variables × biological questions.</h1></div>
        <p>This matrix crosses every filed variable against the mechanism lanes in the current corpus. A marked cell means the lane is filed, not that a human treatment effect is established.</p>
      </div>

      <Corpus initial="matrix" />

      <div className="mechanism-matrix">
        <div className="matrix-header-row">
          <span>Variable</span>
          {mechanisms.map(([key, label]) => <span key={key}>{label}</span>)}
          <span>Human lane</span>
        </div>
        {evidenceItems.map((item) => (
          <div className="matrix-data-row" key={item.id}>
            <strong>{item.short}</strong>
            {mechanisms.map(([key]) => (
              <span className={item.mechanisms.includes(key) ? "matrix-dot active" : "matrix-dot"} key={key}>
                {item.mechanisms.includes(key) ? "●" : "·"}
              </span>
            ))}
            <span><EvidenceBadge kind={item.evidenceClass} /></span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResearchQueue() {
  return (
    <section className="section-block view-section">
      <div className="section-head">
        <div><p className="eyebrow">Research queue</p><h1 className="view-title">Make uncertainty actionable.</h1></div>
        <p>The queue exists to strengthen the corpus, not to manufacture certainty where the source record is thin.</p>
      </div>

      <div className="queue">
        {researchQueue.map((row) => (
          <article className="queue-row" key={row.priority}>
            <span className="queue-number">{String(row.priority).padStart(2, "0")}</span>
            <div><h3>{row.item}</h3><p>{row.work}</p></div>
            <span className="queue-state">Open research</span>
          </article>
        ))}
      </div>

      <Corpus initial="claims" />

      <div className="source-dock">
        <div><p className="eyebrow">Canonical files</p><h2>Go to the evidence, not the decoration.</h2></div>
        <div className="source-links">
          <a href={LINKS.matrix} target="_blank" rel="noreferrer">Master matrix ↗</a>
          <a href={LINKS.claims} target="_blank" rel="noreferrer">Claim ledger ↗</a>
          <a href={LINKS.sources} target="_blank" rel="noreferrer">Source ledger ↗</a>
          <a href={LINKS.watch} target="_blank" rel="noreferrer">Watch cards ↗</a>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [view, setView] = useState("dashboard");
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem("cancer-vive.theme.v1") || "auto"; } catch { return "auto"; } });
  const setThemeChoice = (choice) => { setTheme(choice); try { localStorage.setItem("cancer-vive.theme.v1", choice); } catch {} };
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const navigate = (next) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCompare = (id) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  return (
    <div className={"theme-root theme-" + theme}>
    <FrameworkShell activeView={view} onNavigate={navigate}>
      <div className="site-shell">
      <div className="theme-control" role="group" aria-label="Color theme">{["auto", "light", "dark"].map((choice) => <button type="button" key={choice} aria-pressed={theme === choice} onClick={() => setThemeChoice(choice)}>{choice[0].toUpperCase() + choice.slice(1)}</button>)}</div>
      <main className="page">
        {view === "dashboard" && <Dashboard onNavigate={navigate} />}
        {view === "matrix" && <Matrix />}
        {view === "mechanisms" && <Mechanisms compareIds={compareIds} toggleCompare={toggleCompare} />}
        {view === "research" && <ResearchQueue />}
      </main>

      <CompareTray
        ids={compareIds}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
        onOpen={() => setCompareOpen(true)}
      />
      {compareOpen && <CompareModal ids={compareIds} onClose={() => setCompareOpen(false)} />}

      <footer className="footer">
        <span>Cancer Vive · public research projection</span>
        <span>Framework rails · React · Vite · GitHub Pages</span>
        <span>Research interface, not treatment advice</span>
      </footer>
      </div>
    </FrameworkShell>
    </div>
  );
}
