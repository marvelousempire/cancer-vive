/* Public ResearchTHAT learning entrance: no changes to research facts or privileges. */
(() => {
  "use strict";
  let mounted = false;
  function init() {
    if (mounted) return true;
    const root = document.querySelector(".research-domain");
    const main = root?.querySelector(".layout main");
    const intro = main?.querySelector(".intro");
    if (!root || !main || !intro) return false;
    mounted = true;
    const guide = document.createElement("section");
    guide.className = "public-learning-guide";
    guide.setAttribute("aria-label", "Start learning");
    const eyebrow = document.createElement("p");
    eyebrow.className = "public-learning-eyebrow";
    eyebrow.textContent = "PUBLIC RESEARCH LIBRARY";
    const heading = document.createElement("h1");
    heading.textContent = "Explore research questions";
    const description = document.createElement("p");
    description.textContent = "Read what studies found, what remains uncertain, and where the evidence came from.";
    const actions = document.createElement("div");
    actions.className = "public-learning-actions";
    const browse = document.createElement("button");
    browse.type = "button";
    browse.className = "public-learning-primary";
    browse.textContent = "Browse questions";
    browse.addEventListener("click", () => {
      const search = root.querySelector("#query");
      if (search && !search.closest("[hidden]")) {
        search.scrollIntoView({block:"center"});
        search.focus({preventScroll:true});
      } else {
        const topics = [...document.querySelectorAll(".footer-rail .build-path button")]
          .find(button => (button.getAttribute("aria-label") || button.textContent).trim() === "Evidence");
        topics?.click();
        requestAnimationFrame(() => root.querySelector("#query")?.focus());
      }
    });
    const learn = document.createElement("button");
    learn.type = "button";
    learn.className = "public-learning-secondary";
    learn.textContent = "Learn to read evidence";
    learn.addEventListener("click", () => {
      const owner = [...document.querySelectorAll(".footer-rail .build-path button")]
        .find(button => (button.getAttribute("aria-label") || button.textContent).trim() === "Learn");
      const fallback = root.querySelector('.side [data-room="learn"]');
      (owner || fallback)?.click();
    });
    actions.append(browse,learn);
    const note = document.createElement("p");
    note.className = "public-learning-caution";
    note.textContent = "Research is not medical advice. Study results have limits.";
    const explanation = document.createElement("details");
    explanation.className = "public-learning-explanation";
    const summary = document.createElement("summary");
    summary.textContent = "How do I read the evidence labels?";
    const answer = document.createElement("p");
    answer.textContent = "A label describes the kind and strength of available evidence. Research in cells or animals is not the same as evidence that a treatment works in people. Open a record to read its caution and original sources.";
    explanation.append(summary,answer);
    guide.append(eyebrow,heading,description,actions,note,explanation);
    intro.before(guide);
    root.classList.add("public-learning-ready");
    return true;
  }
  if (!init()) {
    const observer = new MutationObserver(() => {if (init()) observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener("DOMContentLoaded",()=>{if (init()) observer.disconnect();},{once:true});
  }
})();
