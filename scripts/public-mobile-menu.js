/* Public-only phone menu. The existing ResearchTHAT frame remains the page owner. */
(() => {
  "use strict";
  const rooms = [
    ["topics", "Evidence"], ["learn", "Learn"], ["questions", "Questions"],
    ["sources", "Sources"], ["elements", "Elements"],
    ["studies", "Private studies"], ["foods", "Food library"], ["engine", "Engine receipts"]
  ];
  let installed = false;
  function init() {
    if (installed) return true;
    const root = document.querySelector(".research-domain");
    const main = root?.querySelector(".layout main");
    if (!main) return false;
    installed = true;
    const nav = document.createElement("nav");
    nav.className = "public-phone-nav";
    nav.setAttribute("aria-label", "Public research sections");
    const details = document.createElement("details");
    details.className = "public-phone-menu";
    const summary = document.createElement("summary");
    summary.textContent = "☰ Browse sections";
    const list = document.createElement("div");
    list.className = "public-phone-menu-list";
    for (const [id, name] of rooms) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = name;
      button.dataset.publicRoom = id;
      button.addEventListener("click", () => {
        // Reuse ResearchTHAT's existing navigation, never reimplement its pages.
        const pageButtons = [...document.querySelectorAll(".pages button")];
        const ownerPage = pageButtons.find((item) => item.textContent.trim() === name ||
          item.getAttribute("data-room") === id || item.getAttribute("data-page") === id);
        const ownerRoom = root.querySelector('.side [data-room="' + id + '"]');
        const target = ownerPage || ownerRoom;
        if (!target) {
          summary.textContent = "☰ Browse sections";
          return;
        }
        target.click();
        details.open = false;
        summary.textContent = "☰ Browse sections · " + name;
        main.scrollIntoView({behavior: "instant", block: "start"});
        summary.focus({preventScroll: true});
      });
      list.append(button);
    }
    details.addEventListener("toggle", () => {
      summary.setAttribute("aria-expanded", String(details.open));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && details.open) {
        details.open = false;
        summary.focus();
      }
    });
    document.addEventListener("pointerdown", (event) => {
      if (details.open && !details.contains(event.target)) details.open = false;
    });
    details.append(summary, list);
    nav.append(details);
    main.prepend(nav);
    return true;
  }
  if (!init()) {
    const observer = new MutationObserver(() => { if (init()) observer.disconnect(); });
    observer.observe(document.documentElement, {childList: true, subtree: true});
    document.addEventListener("DOMContentLoaded", () => { if (init()) observer.disconnect(); }, {once:true});
  }
})();
