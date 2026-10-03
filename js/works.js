/* ========================================
   works.js — 作品列表 + 项目页 viewer
   ======================================== */

function portfolioWorks() {
  return PORTFOLIO_IDS.map((id) => works.find((w) => w.id === id)).filter(Boolean);
}

function visibleWorks() {
  return works.filter((w) => w.visible !== false);
}

function filteredWorks() {
  return portfolioWorks();
}

function threadLabel(key) {
  const th = THREADS[key];
  if (!th) return "";
  return LANG === "zh" ? th.zh : th.en;
}

function WField(w, key) {
  const val = w[key];
  if (!val) return "";
  if (typeof val === "object" && (val.en || val.zh)) {
    return LANG === "zh" ? (val.zh || val.en) : val.en;
  }
  return val;
}

function projectSection(num, labelKey, body) {
  if (!body) return "";
  return `
    <section class="proj-section">
      <header class="proj-section-head">
        <span class="proj-num">${num}</span>
        <h4>${ui(labelKey)}</h4>
      </header>
      <div class="proj-section-body">${body}</div>
    </section>`;
}

function viewerProjectHTML(w) {
  const blocks = [];

  blocks.push(projectSection("01", "proj_title", `
    <p class="viewer-desc">${WField(w, "desc") || ui("coming")}</p>`));

  blocks.push(projectSection("02", "proj_question", `
    <p class="proj-quote">${WField(w, "question") || ui("coming")}</p>`));

  const processBody = w.processSteps && w.processSteps.length
    ? `<div class="viewer-process-steps">
        ${w.processSteps.map((step, i) => {
          const imgs = (step.images || []).map((src) =>
            `<button type="button" class="process-thumb" data-src="${src}" aria-label="${WField(step, "title")}"><img src="${src}" alt="" loading="lazy" /></button>`
          ).join("");
          return `<article class="process-step">
            <div class="process-step-num">${String(i + 1).padStart(2, "0")}</div>
            <div class="process-step-body">
              <h5>${WField(step, "title")}</h5>
              <p>${WField(step, "text")}</p>
              ${imgs ? `<div class="process-step-images">${imgs}</div>` : ""}
            </div>
          </article>`;
        }).join("")}
      </div>`
    : WField(w, "process")
      ? `<p class="viewer-detail">${WField(w, "process")}</p>`
      : `<p class="muted">${ui("coming")}</p>`;

  blocks.push(projectSection("03", "proj_process", processBody));

  blocks.push(projectSection("04", "proj_work", `
    <p class="muted proj-work-note">${ui("proj_work_note")}</p>`));

  blocks.push(projectSection("05", "proj_reflection", `
    <p class="viewer-detail">${WField(w, "reflection") || ui("coming")}</p>`));

  const extra = [];
  if (w.venue) extra.push(`<p class="viewer-venue">${WField(w, "venue")}</p>`);
  if (w.detail && !w.question) extra.push(`<p class="viewer-detail">${WField(w, "detail")}</p>`);
  if (w.credits) extra.push(`<p class="viewer-credits">${WField(w, "credits")}</p>`);
  if (w.links && w.links.length) {
    extra.push(`<div class="viewer-links">${w.links.map((l) =>
      `<a href="${l.url}" target="_blank" rel="noopener">${LANG === "zh" ? (l.labelZh || l.label) : l.label}</a>`
    ).join("")}</div>`);
  }
  if (extra.length) blocks.push(extra.join(""));

  return blocks.join("");
}

function cardSeed(id) {
  return id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

function cardLayout(seed) {
  const rng = typeof mulberry32 === "function" ? mulberry32(seed) : (() => {
    let a = seed;
    return () => {
      a = (a * 16807) % 2147483647;
      return (a - 1) / 2147483646;
    };
  })();
  const spans = [3, 3, 4, 4, 4, 5, 5, 6];
  const span = spans[Math.floor(rng() * spans.length)];
  const spanM = span >= 5 ? 3 : span <= 3 ? 2 : 3;
  const ratios = ["1 / 1", "4 / 3", "3 / 4", "5 / 4", "6 / 5"];
  return {
    span,
    spanM,
    rot: ((rng() - 0.5) * 4).toFixed(2),
    shiftY: Math.round((rng() - 0.5) * 36),
    ratio: ratios[Math.floor(rng() * ratios.length)],
    shape: Math.floor(rng() * 5),
  };
}

function cardHTML(w) {
  const title = LANG === "zh" ? w.title.zh : w.title.en;
  const desc = LANG === "zh" ? w.desc?.zh : w.desc?.en;
  const glyph = w.glyph || "◌";
  const thread = w.thread ? `<span class="work-thread">${threadLabel(w.thread)}</span>` : "";
  const seed = cardSeed(w.id);
  const layout = cardLayout(seed);
  const style = `--span:${layout.span};--span-m:${layout.spanM};--rot:${layout.rot}deg;--shift-y:${layout.shiftY}px;--cover-ratio:${layout.ratio}`;
  return `
    <article class="work-card${w.draft ? " draft" : ""}" data-id="${w.id}" data-draft-label="${ui("draft_label")}" data-shape="${layout.shape}" style="${style}" tabindex="0" aria-label="${title || w.id}">
      ${cardScribbleSVG(240, 200, seed, layout.shape)}
      <div class="work-cover"><span class="cover-glyph">${glyph}</span></div>
      <div class="work-body">
        ${thread}
        <div class="work-meta">${w.date || w.year || ""}</div>
        <h3>${title || ""}</h3>
        ${desc ? `<p class="work-desc">${desc}</p>` : ""}
      </div>
    </article>`;
}

function renderWorks() {
  const grid = document.getElementById("worksGrid");
  if (!grid) return;
  const list = filteredWorks();
  if (!list.length) {
    grid.innerHTML = `<div class="works-empty">${ui("empty")}</div>`;
    return;
  }

  grid.innerHTML = `<div class="works-chapter-grid">${list.map((w) => cardHTML(w)).join("")}</div>`;

  initWorkCardScribbles(grid);

  grid.querySelectorAll(".work-card").forEach((el) => {
    const open = () => {
      const i = list.findIndex((w) => w.id === el.dataset.id);
      openViewer(i);
    };
    el.addEventListener("click", open);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
}

/* ---------------- Viewer ---------------- */

let viewerList = [];
let viewerIndex = 0;
let viewerMediaIndex = 0;

function viewerMediaItems(w) {
  const items = [];
  if (w.video) items.push({ type: "video", src: w.video });
  (w.gallery || []).forEach((src) => items.push({ type: "image", src }));
  (w.processSteps || []).forEach((step) => {
    (step.images || []).forEach((src) => {
      if (!items.some((m) => m.src === src)) items.push({ type: "image", src });
    });
  });
  if (!items.length && w.cover) items.push({ type: "image", src: w.cover });
  return items;
}

function embedUrl(url) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

function renderViewer() {
  const w = viewerList[viewerIndex];
  const stage = document.getElementById("viewerStage");
  const cap = document.getElementById("viewerCaption");
  const layout = document.querySelector(".viewer-layout");
  const prev = document.getElementById("viewerPrev");
  const next = document.getElementById("viewerNext");
  const mediaItems = viewerMediaItems(w);
  if (viewerMediaIndex >= mediaItems.length) viewerMediaIndex = 0;
  const media = mediaItems[viewerMediaIndex] || null;

  const mainTitle = LANG === "zh" ? w.title.zh : w.title.en;
  const capTitle = mainTitle || "—";
  if (media && media.type === "video") {
    stage.innerHTML = `<iframe src="${embedUrl(media.src)}" title="${capTitle}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else if (media && media.type === "image") {
    stage.innerHTML = `<img src="${media.src}" alt="${capTitle}" />`;
  } else {
    stage.innerHTML = `<div class="stage-glyph">${w.glyph || "◌"}</div>`;
  }

  const metaParts = [
    w.thread ? threadLabel(w.thread) : "",
    w.date || w.year,
    WField(w, "medium"),
  ].filter(Boolean).join(" · ");

  const mediaNav = mediaItems.length > 1
    ? `<div class="viewer-media-nav">
        <button class="viewer-media-btn" id="viewerMediaPrev" aria-label="${ui("gallery_prev")}">‹</button>
        <span class="viewer-media-count">${viewerMediaIndex + 1} / ${mediaItems.length}</span>
        <button class="viewer-media-btn" id="viewerMediaNext" aria-label="${ui("gallery_next")}">›</button>
      </div>`
    : "";

  cap.innerHTML = `
    <h3>${capTitle}</h3>
    ${metaParts ? `<div class="viewer-meta">${metaParts}</div>` : ""}
    <div class="proj-sections">${viewerProjectHTML(w)}</div>
    ${mediaNav}`;

  if (mediaItems.length > 1) {
    document.getElementById("viewerMediaPrev").addEventListener("click", () => viewerMediaStep(-1, mediaItems.length));
    document.getElementById("viewerMediaNext").addEventListener("click", () => viewerMediaStep(1, mediaItems.length));
  }

  cap.querySelectorAll(".process-thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.src;
      const idx = mediaItems.findIndex((m) => m.type === "image" && m.src === src);
      if (idx >= 0) {
        viewerMediaIndex = idx;
        renderViewer();
        return;
      }
      stage.innerHTML = `<img src="${src}" alt="${mainTitle}" />`;
    });
  });

  prev.classList.toggle("viewer-nav-hidden", viewerList.length <= 1);
  next.classList.toggle("viewer-nav-hidden", viewerList.length <= 1);
  if (layout) layout.classList.toggle("viewer-expanded", true);
}

function viewerMediaStep(dir, len) {
  viewerMediaIndex = (viewerMediaIndex + dir + len) % len;
  renderViewer();
}

function openViewer(i, list) {
  viewerList = list || filteredWorks();
  viewerIndex = i;
  viewerMediaIndex = 0;
  const v = document.getElementById("viewer");
  v.classList.add("open");
  v.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderViewer();
  if (typeof refreshViewerMotion === "function") refreshViewerMotion();
}

function closeViewer() {
  const v = document.getElementById("viewer");
  v.classList.remove("open");
  v.setAttribute("aria-hidden", "true");
  document.getElementById("viewerStage").innerHTML = "";
  document.body.style.overflow = "";
}

function viewerStep(dir) {
  viewerIndex = (viewerIndex + dir + viewerList.length) % viewerList.length;
  viewerMediaIndex = 0;
  renderViewer();
  if (typeof refreshViewerMotion === "function") refreshViewerMotion();
}

function initWorks() {
  const viewer = document.getElementById("viewer");
  document.getElementById("viewerClose").addEventListener("click", closeViewer);
  document.getElementById("viewerPrev").addEventListener("click", () => viewerStep(-1));
  document.getElementById("viewerNext").addEventListener("click", () => viewerStep(1));
  viewer.addEventListener("click", (e) => {
    if (e.target === viewer) closeViewer();
  });
  document.addEventListener("keydown", (e) => {
    if (!viewer.classList.contains("open")) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowLeft") viewerStep(-1);
    if (e.key === "ArrowRight") viewerStep(1);
  });
  document.querySelectorAll(".nav-logo").forEach((a) => {
    a.addEventListener("click", closeViewer);
  });
}
