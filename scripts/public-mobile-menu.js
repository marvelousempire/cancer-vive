/* Cancer Vive public carrier: mobile-only presentation, original ResearchTHAT actions. */
(() => {
  "use strict";
  const rooms = [
    ["topics", "Evidence"], ["learn", "Learn"], ["questions", "Questions"],
    ["sources", "Sources"], ["elements", "Elements"],
    ["studies", "Private studies"], ["foods", "Food library"], ["engine", "Engine receipts"]
  ];
  const normalize = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
  const pageMatch = (button,id,label) => {
    const identifiers = [button.dataset.room,button.dataset.page,button.dataset.id].filter(Boolean);
    if (identifiers.includes(id)) return true;
    const target = normalize(button.getAttribute("aria-label") || button.textContent);
    return target === normalize(label) || (id === "engine" && target === "engine receipts");
  };
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

    const line = document.createElement("div");
    line.className = "public-phone-line";
    const name = document.createElement("strong");
    name.className = "public-phone-brand";
    name.textContent = "ResearchTHAT";
    const details = document.createElement("details");
    details.className = "public-phone-menu";
    const summary = document.createElement("summary");
    summary.textContent = "Sections";
    summary.setAttribute("aria-expanded", "false");
    const list = document.createElement("div");
    list.className = "public-phone-menu-list";
    const section = document.createElement("span");
    section.className = "public-phone-current";
    section.textContent = "Evidence";
    section.setAttribute("aria-live","polite");
    const options = document.createElement("button");
    options.type = "button";
    options.className = "public-phone-options";
    options.textContent = "Options";
    options.setAttribute("aria-controls","public-phone-settings");
    options.setAttribute("aria-expanded","false");
    const settings = root.querySelector(".top");
    if (settings) settings.id = "public-phone-settings";
    options.addEventListener("click", () => {
      const open = document.documentElement.classList.toggle("public-phone-options-open");
      options.setAttribute("aria-expanded", String(open));
      options.textContent = open ? "Close options" : "Options";
      if (open && settings) settings.scrollIntoView({block:"start"});
    });
    function findOwner(id,label) {
      const ownerPages = [...document.querySelectorAll(".pages button")];
      const page = ownerPages.find(button => pageMatch(button,id,label));
      const legacy = root.querySelector('.side [data-room="' + id + '"]');
      return page || legacy || null;
    }
    for (const [id,label] of rooms) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.publicRoom = id;
      button.addEventListener("click", () => {
        const target = findOwner(id,label);
        if (!target) {
          list.setAttribute("data-unavailable",id);
          return;
        }
        target.click();
        details.open = false;
        section.textContent = label;
        summary.textContent = "Sections";
        requestAnimationFrame(() => nav.scrollIntoView({block:"start"}));
        summary.focus({preventScroll:true});
      });
      list.append(button);
    }
    const tools = document.createElement("button");
    tools.type = "button";
    tools.className = "public-phone-tools-toggle";
    tools.textContent = "More site tools";
    tools.setAttribute("aria-expanded","false");
    tools.addEventListener("click", () => {
      const open = document.documentElement.classList.toggle("public-phone-tools-open");
      tools.setAttribute("aria-expanded",String(open));
      tools.textContent = open ? "Fewer site tools" : "More site tools";
      details.open = false;
    });
    list.append(tools);
    details.append(summary,list);
    line.append(name,details,options);
    nav.append(section);
    nav.append(line);
    main.prepend(nav);

    details.addEventListener("toggle", () => summary.setAttribute("aria-expanded",String(details.open)));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && details.open) { details.open = false; summary.focus(); }
    });
    document.addEventListener("pointerdown", event => {
      if (details.open && !details.contains(event.target)) details.open = false;
    });

    // Reduce duplicate shell navigation only after its real buttons exist.
    // Keep the owner controls in the DOM; delegate clicks to them.
    const refresh = () => {
      const matched = rooms.slice(0,5).every(([id,label]) => !!findOwner(id,label));
      document.documentElement.classList.toggle("public-phone-menu-ready",matched);
      const active = [...document.querySelectorAll(".pages button")]
        .find(button => button.getAttribute("aria-current") === "page" ||
                        button.getAttribute("aria-pressed") === "true");
      if (active) {
        const item = rooms.find(([id,label]) => pageMatch(active,id,label));
        if (item) section.textContent = item[1];
      }
    };
    refresh();
    const observer = new MutationObserver(refresh);
    // Navigation may mount asynchronously; do not watch the entire document
    // and trigger on our own live menu updates.
    const pages = document.querySelector(".pages");
    if (pages) observer.observe(pages,{childList:true,subtree:true,attributes:true,attributeFilter:["aria-current","aria-pressed"]});
    else {
      const timer = window.setInterval(() => {
        const currentPages = document.querySelector(".pages");
        if (currentPages) {
          window.clearInterval(timer);
          observer.observe(currentPages,{childList:true,subtree:true,attributes:true,attributeFilter:["aria-current","aria-pressed"]});
          refresh();
        }
      },500);
      window.setTimeout(() => window.clearInterval(timer),15000);
    }
    return true;
  }
  if (!init()) {
    const observer = new MutationObserver(() => { if (init()) observer.disconnect(); });
    observer.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener("DOMContentLoaded",() => { if (init()) observer.disconnect(); },{once:true});
  }
})();
