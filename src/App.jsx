import React, { useEffect, useMemo, useState } from "react";
import { content, evidenceItems, evidenceClasses, mechanismLabels, navItems } from "./data.js";
import FrameworkShell from "./FrameworkShell.jsx";
import DiabetesView from "./DiabetesView.jsx";
import ResearchIntegrationPanel from "./ResearchIntegrationPanel.jsx";
import Corpus, { ResearchDocuments } from "./Corpus.jsx";
import design from "../design-dna.profile.json";

const palette = design.domains.paint.palette;
const themeColors = Object.fromEntries(Object.entries(palette.light).map(([role, color]) => ["--" + role, `light-dark(${color}, ${palette.dark[role]})`]));
const u = content.ui;
const release = __RELEASE__;
const validView = (value) => navItems.some((item) => item.id === value) ? value : "dashboard";
const currentView = () => validView(window.location.hash.slice(1));

function EvidenceBadge({ kind }) {
  return <span className={"evidence-badge evidence-" + kind}>{evidenceClasses[kind]?.label ?? kind}</span>;
}

export function SourceLinks({ sources }) {
  return <div className="source-links">{sources.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>;
}

function TopicDetails({ item }) {
  return <>
    <dl>
      <div><dt>{u.research}</dt><dd>{item.research}</dd></div>
      <div><dt>{u.human}</dt><dd>{item.human}</dd></div>
      <div><dt>{u.next_step}</dt><dd>{item.next_step}</dd></div>
    </dl>
    <h4>{u.sources}</h4>
    <SourceLinks sources={item.sources} />
    <details className="expert-details"><summary>{u.expert}</summary><p>{u.form}: {item.form}</p>{item.expert_view?.identity && <p>{item.expert_view.identity}</p>}<div className="refs">{item.refs.map((ref) => <code key={ref}>{ref}</code>)}</div></details>
  </>;
}

function CompareModal({ ids, onClose }) {
  const selected = evidenceItems.filter((item) => ids.includes(item.id));
  useEffect(() => {
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const controls = [...document.querySelectorAll('.compare-modal button, .compare-modal a, .compare-modal summary')].filter(node => node.getClientRects().length && !node.disabled);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    document.querySelector(".compare-modal button")?.focus();
    return () => { document.removeEventListener("keydown", onKey); previous?.focus?.(); };
  }, [onClose]);
  if (!selected.length) return null;
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <section className="compare-modal" role="dialog" aria-modal="true" aria-label={u.compare} onMouseDown={(e) => e.stopPropagation()}>
      <div className="modal-head"><h2>{u.compare}</h2><button className="icon-button" onClick={onClose} aria-label={u.close}>×</button></div>
      <div className="compare-grid">{selected.map((item) => <article className="compare-column" key={item.id}>
        <EvidenceBadge kind={item.grade} /><h3>{item.name}</h3><h4>{item.question}</h4><strong>{item.answer_label}</strong><p>{item.research}</p>
        <div className="compare-field"><span>{u.caution}</span><p>{item.caution}</p></div>
        <TopicDetails item={item} />
      </article>)}</div>
    </section>
  </div>;
}

function Dashboard({ onNavigate }) {
  const h = content.home;
  return <>
    <section className="hero-panel">
      <div className="hero-copy"><p className="eyebrow">{h.eyebrow}</p><h1>{h.title}</h1><p className="hero-text">{h.intro}</p>
        <div className="hero-actions"><button className="primary-button" onClick={() => onNavigate("mechanisms")}>{h.browse}</button><button className="secondary-button" onClick={() => onNavigate("education")}>{h.spike}</button></div>
      </div>
      <div className="rule-card"><h2>{h.proof_title}</h2><p>{h.proof_intro}</p>{h.proof_steps.map((step) => <div className="proof-step" key={step.title}><strong>{step.title}</strong><p>{step.text}</p></div>)}</div>
    </section>
    <section className="section-block"><h2>{h.head}</h2><div className="evidence-grid">{h.choices.map((choice) => <article className="evidence-card" key={choice.title}><h3>{choice.title}</h3><p>{choice.text}</p><button className="quiet-button" onClick={() => onNavigate(choice.route, choice.query ?? "")}>{choice.button}</button></article>)}</div></section>
  </>;
}

function Topics({ compareIds, toggleCompare, initialQuery }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [grade, setGrade] = useState("all");
  const [layout, setLayout] = useState("cards");
  const filtered = useMemo(() => evidenceItems.filter((item) => {
    const text = [item.question, item.name, item.form, item.summary, item.research, item.human, item.caution, item.next_step].join(" ").toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase())) && (category === "all" || item.tags.includes(category)) && (grade === "all" || item.grade === grade);
  }), [query, category, grade]);
  const selected = (id) => compareIds.includes(id);
  const atLimit = (id) => !selected(id) && compareIds.length >= 3;
  return <section className="section-block view-section">
    <div className="section-head"><h1 className="view-title">{content.pages.topics_title}</h1><p>{content.pages.topics_intro}</p></div>
    <div className="filter-panel">
      <label className="field field-wide"><span>{u.search}</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={u.search_placeholder} /></label>
      <label className="field"><span>{u.filter}</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">{u.all_topics}</option>{Object.entries(mechanismLabels).map(([id,label]) => <option value={id} key={id}>{label}</option>)}</select></label>
      <label className="field"><span>{u.proof}</span><select value={grade} onChange={(e) => setGrade(e.target.value)}><option value="all">{u.all_proof}</option>{Object.entries(evidenceClasses).map(([id,entry]) => <option value={id} key={id}>{entry.label}</option>)}</select></label>
      <div className="view-toggle" aria-label={u.details}><button className={layout === "cards" ? "active" : ""} onClick={() => setLayout("cards")}>{u.cards}</button><button className={layout === "table" ? "active" : ""} onClick={() => setLayout("table")}>{u.table}</button></div>
    </div>
    <div className="result-line" aria-live="polite"><strong>{filtered.length}</strong> {u.of} {evidenceItems.length} {u.results}. {u.select_limit}</div>
    {!filtered.length && <p role="status">{u.empty}</p>}
    {layout === "cards" ? <div className="evidence-grid">{filtered.map((item) => <article className={"evidence-card class-" + item.grade} key={item.id}>
      <div className="card-head"><EvidenceBadge kind={item.grade} /><button className={"compare-toggle " + (selected(item.id) ? "selected" : "")} disabled={atLimit(item.id)} onClick={() => toggleCompare(item.id)} aria-label={(selected(item.id) ? u.remove : u.add) + ": " + item.name}>{selected(item.id) ? u.selected : u.add}</button></div>
      <h3>{item.name}</h3><h4>{item.question}</h4><strong>{u.answer}: {item.answer_label}</strong><p className="topic-summary">{item.research}</p><SourceLinks sources={item.sources} />

      {item.id === "spike-proteins" && <a className="quiet-button" href="#education">{content.home.spike}</a>}
      <details className="topic-details"><summary>{u.read_more}</summary><TopicDetails item={item} /><div className="caution-box"><strong>{u.caution}</strong><p>{item.caution}</p></div></details>
    </article>)}</div> : <div className="table-wrap"><table className="matrix-table"><thead><tr><th>{u.topic}</th><th>{u.summary}</th><th>{u.evidence}</th><th>{u.caution}</th><th>{u.compare}</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.question}<br/><strong>{item.answer_label}</strong><p>{item.research}</p><SourceLinks sources={item.sources}/></td><td><EvidenceBadge kind={item.grade} /></td><td>{item.caution}</td><td><button className="table-compare" disabled={atLimit(item.id)} onClick={() => toggleCompare(item.id)} aria-label={(selected(item.id) ? u.remove : u.add) + ": " + item.name}>{selected(item.id) ? u.selected : "+"}</button></td></tr>)}</tbody></table></div>}
  </section>;
}

function QuickView() {
  return <section className="section-block view-section"><div className="section-head"><h1 className="view-title">{content.pages.quick_title}</h1><p>{content.pages.quick_intro}</p></div>
    <div className="table-wrap"><table className="matrix-table"><thead><tr><th>{u.topic}</th><th>{u.summary}</th><th>{u.evidence}</th><th>{u.caution}</th></tr></thead><tbody>{evidenceItems.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.question}<br/><strong>{item.answer_label}</strong><p>{item.research}</p><SourceLinks sources={item.sources}/></td><td><EvidenceBadge kind={item.grade} /></td><td>{item.caution}</td></tr>)}</tbody></table></div>
  </section>;
}

function Education() {
  return <section className="section-block view-section"><div className="section-head"><h1 className="view-title">{content.pages.learn_title}</h1><p>{content.pages.learn_intro}</p></div>
    {content.lessons.map((lesson,index) => <details className="lesson" key={lesson.id} open={index === 0}><summary>{lesson.title}</summary><p>{lesson.intro}</p>{lesson.sections.map((section) => <section key={section.heading}><h3>{section.heading}</h3><p>{section.text}</p><SourceLinks sources={section.sources} /></section>)}</details>)}
  </section>;
}

function Questions() {
  return <section className="section-block view-section"><div className="section-head"><h1 className="view-title">{content.pages.questions_title}</h1><p>{content.pages.questions_intro}</p></div>
    <div className="evidence-grid">{content.questions.map((question) => <article className="evidence-card" key={question.heading}><h3>{question.heading}</h3><p>{question.text}</p></article>)}</div>
    <ResearchDocuments /><h2>{u.sources}</h2><p>{content.pages.sources_intro}</p><Corpus initial="sources" />
  </section>;
}

export default function App() {
  const [view,setView] = useState(currentView);
  const [initialQuery,setInitialQuery] = useState("");
  const [theme,setTheme] = useState(() => { try { const saved=localStorage.getItem("cancer-vive.theme.v1"); return ["auto","light","dark"].includes(saved) ? saved : "auto"; } catch { return "auto"; } });
  const [subject,setSubject] = useState(() => { try { return localStorage.getItem("cancer-vive.subject.v1") === "diabetes" ? "diabetes" : "cancer"; } catch { return "cancer"; } });
  const [compareIds,setCompareIds] = useState([]);
  const [compareOpen,setCompareOpen] = useState(false);
  useEffect(() => { const handle=() => setView(currentView()); window.addEventListener("hashchange",handle); return () => window.removeEventListener("hashchange",handle); },[]);
  const navigate = (next,query="") => { const target=validView(next); setInitialQuery(query); setView(target); window.location.hash=target; window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"}); };
  const changeTheme = (choice) => { setTheme(choice); try { localStorage.setItem("cancer-vive.theme.v1",choice); } catch {} };
  const changeSubject = (next) => { const safe = next === "diabetes" ? "diabetes" : "cancer"; setSubject(safe); setCompareIds([]); setCompareOpen(false); setInitialQuery(""); try { localStorage.setItem("cancer-vive.subject.v1",safe); } catch {} };
  const toggleCompare = (id) => setCompareIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 3 ? [...current,id] : current);
  return <div className={"theme-root theme-" + theme} style={themeColors}><FrameworkShell activeView={view} onNavigate={navigate} subject={subject}><div className="site-shell">
    <div className="subject-control"><label htmlFor="subject-select">Explore a condition</label><select id="subject-select" value={subject} onChange={(e)=>changeSubject(e.target.value)}><option value="cancer">Cancer Vive · Cancer</option><option value="diabetes">Diabetes Vive · Diabetes</option></select><span role="status" aria-live="polite">{subject === "cancer" ? "Cancer evidence explorer" : "Diabetes education and evidence explorer"}</span></div>
    <div className="theme-control" role="group" aria-label={u.theme}>{["auto","light","dark"].map((choice) => <button key={choice} type="button" aria-pressed={theme===choice} onClick={() => changeTheme(choice)}>{u[choice]}</button>)}</div>
    {subject === "cancer" ? <><p className="site-note">{u.scope}</p>
    <main className="page">
      {view === "dashboard" && <Dashboard onNavigate={navigate} />}
      {view === "mechanisms" && <Topics key={initialQuery} initialQuery={initialQuery} compareIds={compareIds} toggleCompare={toggleCompare} />}
      {view === "matrix" && <QuickView />}
      {view === "education" && <Education />}
      {view === "research" && <Questions />}
    </main>
    {view === "research" && <ResearchIntegrationPanel />}
    {!!compareIds.length && <div className="compare-tray"><strong>{compareIds.length} {u.selected}</strong><div className="compare-actions"><button className="quiet-button" onClick={() => setCompareIds([])}>{u.clear}</button><button className="primary-button" onClick={() => setCompareOpen(true)}>{u.compare}</button></div><div className="compare-chips">{compareIds.map((id) => <button className="compare-chip" key={id} aria-label={u.remove + ": " + evidenceItems.find((item)=>item.id===id)?.name} onClick={()=>toggleCompare(id)}>{evidenceItems.find((item)=>item.id===id)?.name} ×</button>)}</div></div>}
    {compareOpen && <CompareModal ids={compareIds} onClose={() => setCompareOpen(false)} />}
    <footer className="footer"><span>{content.pages.footer}</span><span>{u.checked}</span><span>{u.version} {release.version}{release.dirty ? " · " + u.draft : ""}</span></footer>
    <details className="expert-details release-details"><summary>{u.code}</summary><p>{release.commit}</p><a href="https://github.com/marvelousempire/cancer-vive" target="_blank" rel="noreferrer">{u.code} ↗</a></details></> : <DiabetesView view={view} navigate={navigate} />}
  </div></FrameworkShell></div>;
}
