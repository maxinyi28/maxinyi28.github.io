/* ========================================
   main.js — 站点信息架构
   HOME → Works / Practice / Experience / Context / About
   ======================================== */

function rule() {
  return titleLineSVG();
}

const HUB_LINKS = [
  { key: "about", label: "hub_about" },
  { key: "works", label: "hub_works" },
  { key: "practice", label: "hub_practice" },
  { key: "experience", label: "hub_experience" },
  { key: "context", label: "hub_context" },
];

function pageHead(eyebrowKey, titleEn, titleZh) {
  return `
    <div class="eyebrow">${ui(eyebrowKey)}</div>
    <h2 class="section-title">${t(titleEn, titleZh)}</h2>
    ${rule()}`;
}

function subNav(items) {
  return `<nav class="sub-nav" aria-label="${t("On this page", "本页")}">${items
    .map((it) => `<a class="sub-nav-link" href="#${it.id}">${ui(it.label)}</a>`)
    .join("")}</nav>`;
}

function subBlock(id, labelKey, body) {
  return `
    <section class="sub-block" id="${id}">
      <header class="sub-block-head">
        <span class="sub-block-mark">↓</span>
        <h3 class="sub-block-title">${ui(labelKey)}</h3>
      </header>
      <div class="sub-block-body">${body}</div>
    </section>`;
}

/* ---------------- Landing ---------------- */

const HUB_FLOAT_MAP = {
  about: "nw",
  works: "se",
  practice: "sw",
  experience: "ne",
  context: "h",
};

function hubFloatVariant(key) {
  return HUB_FLOAT_MAP[key] || "h";
}

function landingLineMarkup() {
  if (LANG === "zh") {
    return `
      <span class="line-row"><span class="line-cap">从</span>转瞬即逝的直觉与<span class="line-em">梦境图像</span></span>
      <span class="line-row line-row--b"><span class="line-break" aria-hidden="true">——</span><span class="line-cap">走向</span><span class="line-em">身体</span>、<span class="line-em">声音</span>与<span class="line-em">可穿戴互动</span>。</span>`;
  }
  return `
    <span class="line-row"><span class="line-cap">From</span> fleeting intuitions and <span class="line-em">dream images</span></span>
    <span class="line-row line-row--b"><span class="line-break" aria-hidden="true">—</span><span class="line-cap">toward</span> <span class="line-em">body</span>, <span class="line-em">sound</span>, and <span class="line-em">wearable interaction</span>.</span>`;
}

function renderLanding() {
  const root = document.getElementById("landing");
  if (!root) return;

  const sideLeft = root.querySelector("#landingSideLeft");
  const sideRight = root.querySelector("#landingSideRight");
  const eyebrow = root.querySelector("#landingEyebrow");
  const title = root.querySelector("#landingTitle");
  const tagline = root.querySelector("#landingTagline");
  const heroMount = root.querySelector("#heroLineMount");
  const hubNav = root.querySelector("#hubNav");

  if (sideLeft) sideLeft.textContent = ui("side_left");
  if (sideRight) sideRight.textContent = t("Holding a Place for… · 2026", "为……留一处 · 2026");
  if (eyebrow) eyebrow.textContent = ui("landing_eyebrow");
  if (title) title.innerHTML = landingTitleMarkup();
  if (tagline) tagline.innerHTML = landingLineMarkup();

  if (heroMount && typeof heroLineSVG === "function") {
    try {
      heroMount.innerHTML = heroLineSVG();
    } catch (err) {
      console.warn("[landing] hero line fallback", err);
    }
  }

  if (hubNav) {
    hubNav.setAttribute("aria-label", t("Site", "站点"));
    hubNav.innerHTML = HUB_LINKS.map(
      (item) => {
        const seed = HUB_SCRIBBLE_SEEDS[item.key] || 23;
        return `<a class="hub-link" href="#${item.key}" data-go="${item.key}" data-float="${hubFloatVariant(item.key)}">
          ${hubLinkScribbleSVG(seed)}
          <span class="hub-link-text">${ui(item.label)}</span>
        </a>`;
      }
    ).join("");
    initHubLinkScribbles(root);
  }

  requestAnimationFrame(() => initHeroLineDraw(root));
}

/* ---------------- Works → Projects ---------------- */

function renderWorksSection() {
  document.getElementById("works").innerHTML = `
    <div class="container">
      ${pageHead("works_eyebrow", "Works", "作品")}
      <p class="page-lead">${ui("works_lead")}</p>
      ${subNav([{ id: "sub-projects", label: "sub_projects" }])}
      ${subBlock("sub-projects", "sub_projects", `<div class="works-grid" id="worksGrid"></div>`)}
    </div>`;
}

function practiceBlock(id, labelKey, section) {
  const introRaw = section?.intro;
  const intro =
    typeof introRaw === "string"
      ? introRaw
      : LANG === "zh"
        ? introRaw?.zh || section?.introZh || ""
        : introRaw?.en || "";
  const items = (section?.items || [])
    .map((item) => `<li>${LANG === "zh" ? item.zh || item.en : item.en}</li>`)
    .join("");
  const body =
    intro || items
      ? `${intro ? `<p class="practice-text">${intro}</p>` : ""}${
          items ? `<ul class="practice-list">${items}</ul>` : ""
        }`
      : `<p class="muted">${ui("coming")}</p>`;
  return subBlock(id, labelKey, body);
}

/* ---------------- Practice ---------------- */

function renderPractice() {
  const p = profile.practice;
  const keys = [
    { id: "sub-movement", label: "sub_movement", data: p.movement },
    { id: "sub-sound", label: "sub_sound", data: p.sound },
    { id: "sub-dream", label: "sub_dream", data: p.dream },
    { id: "sub-making", label: "sub_making", data: p.making },
    { id: "sub-care", label: "sub_care", data: p.care },
  ];

  const blocks = keys.map((k) => practiceBlock(k.id, k.label, k.data)).join("");

  const lead = LANG === "zh" ? p.leadZh || p.lead : p.lead;
  document.getElementById("practice").innerHTML = `
    <div class="container">
      ${pageHead("practice_eyebrow", "Practice", "实践")}
      ${lead ? `<p class="page-lead">${lead}</p>` : ""}
      ${subNav(keys.map((k) => ({ id: k.id, label: k.label })))}
      ${blocks}
    </div>`;
}

/* ---------------- Experience ---------------- */

function renderExperience() {
  const edu = (profile.education || [])
    .map(
      (e) => `
    <div class="edu-item">
      <div class="edu-year">${e.period}</div>
      <div class="edu-main">
        <div class="edu-name">${t(e.name, e.nameZh)}</div>
        <div class="edu-desc">${t(e.degree, e.degreeZh)}${
          e.note ? " · " + t(e.note, e.noteZh || e.note) : ""
        }</div>
      </div>
    </div>`
    )
    .join("");

  function timelineItems(list, withLine) {
    return list
      .map((e, i) => {
        const points = LANG === "zh" && e.pointsZh ? e.pointsZh : e.points;
        const line = withLine
          ? scribbleSVG(
              "0 0 12 120",
              scribblePathV(120, 12, { amp: 2, seed: 30 + i * 5 }),
              "var(--accent)",
              "timeline-line"
            )
          : "";
        return `
        <div class="tl-item${withLine ? "" : " flat"}">
          ${line}
          <div class="tl-head">
            <span class="tl-org">${t(e.org, e.orgZh || e.org)}</span>
            <span class="tl-time">${e.period}</span>
            <span class="tl-role">${t(e.role, e.roleZh)}</span>
          </div>
          <div class="tl-body"><ul>${points.map((p) => `<li>${p}</li>`).join("")}</ul></div>
        </div>`;
      })
      .join("");
  }

  const exp = profile.experience || [];
  const professional = timelineItems(
    exp.filter((e) => e.kind === "professional"),
    true
  );
  const exhibition = timelineItems(
    exp.filter((e) => e.kind === "exhibition"),
    false
  );
  const community = timelineItems(
    exp.filter((e) => e.kind === "community"),
    false
  );

  const skillList = LANG === "zh" ? profile.skillsZh || [] : profile.skills || [];
  const skills = skillList.map((s) => `<span class="skill-chip">${s}</span>`).join("");

  document.getElementById("experience").innerHTML = `
    <div class="container">
      ${pageHead("exp_eyebrow", "Experience", "经历")}
      ${subNav([
        { id: "sub-education", label: "sub_education" },
        { id: "sub-professional", label: "sub_professional" },
        { id: "sub-technical", label: "sub_technical" },
        { id: "sub-community-exp", label: "sub_community" },
        { id: "sub-exhibition", label: "sub_exhibition" },
      ])}
      ${subBlock(
        "sub-education",
        "sub_education",
        edu ? `<div class="edu-list">${edu}</div>` : `<p class="muted">${ui("coming")}</p>`
      )}
      ${subBlock(
        "sub-professional",
        "sub_professional",
        professional || `<p class="muted">${ui("coming")}</p>`
      )}
      ${subBlock(
        "sub-technical",
        "sub_technical",
        skills ? `<div class="skill-chips">${skills}</div>` : `<p class="muted">${ui("coming")}</p>`
      )}
      ${subBlock(
        "sub-community-exp",
        "sub_community",
        community || `<p class="muted">${ui("coming")}</p>`
      )}
      ${subBlock(
        "sub-exhibition",
        "sub_exhibition",
        exhibition || `<p class="muted">${ui("coming")}</p>`
      )}
    </div>`;
}

/* ---------------- Context ---------------- */

function renderContext() {
  const c = profile.context || {};
  const lead = LANG === "zh" ? c.leadZh || c.lead : c.lead;
  const fragments = (c.fragments || [])
    .map(
      (n) => `
    <article class="ctx-fragment">
      <time class="ctx-date">${n.date || ""}</time>
      <h4>${LANG === "zh" && n.titleZh ? n.titleZh : n.title}</h4>
      <p>${LANG === "zh" && n.textZh ? n.textZh : n.text}</p>
    </article>`
    )
    .join("");

  document.getElementById("context").innerHTML = `
    <div class="container">
      ${pageHead("context_eyebrow", "Context", "语境")}
      ${lead ? `<p class="page-lead">${lead}</p>` : ""}
      ${subNav([{ id: "sub-fragments", label: "sub_fragments" }])}
      ${subBlock(
        "sub-fragments",
        "sub_fragments",
        fragments
          ? `<div class="ctx-fragments">${fragments}</div>`
          : `<p class="muted">${ui("coming")}</p>`
      )}
    </div>`;
}

/* ---------------- About ---------------- */

function renderAbout() {
  const introParas = LANG === "zh" && profile.introZh?.length ? profile.introZh : profile.intro || [];
  const intro = introParas.length
    ? introParas
        .map(
          (p, i) =>
            `<p class="about-intro"${i > 0 ? ' style="margin-top:1.25em"' : ""}>${p}</p>`
        )
        .join("")
    : `<p class="muted">${ui("coming")}</p>`;

  const st = profile.statement || {};
  const stmtParas = LANG === "zh" ? st.paragraphsZh || [] : st.paragraphs || [];
  const paragraphs = stmtParas.length
    ? stmtParas
        .map(
          (p, i) =>
            `<p class="stmt-p"${i > 0 ? ' style="margin-top:1.25em"' : ""}>${p}</p>`
        )
        .join("")
    : `<p class="muted">${ui("coming")}</p>`;

  const gh = profile.github || "https://github.com/maxinyi28";
  const role =
    profile.role || profile.roleZh
      ? `<p class="about-role">${t(profile.role || "", profile.roleZh || "")}</p>`
      : "";

  document.getElementById("about").innerHTML = `
    <div class="container">
      ${pageHead("about_eyebrow", "About", "关于")}
      ${subNav([
        { id: "sub-bio", label: "sub_bio" },
        { id: "sub-statement", label: "sub_statement" },
        { id: "sub-cv", label: "sub_cv" },
        { id: "sub-contact", label: "sub_contact" },
      ])}
      ${subBlock(
        "sub-bio",
        "sub_bio",
        `
        <div class="about-grid">
          <aside class="about-sidebar">
            <h2>${t(profile.name, profile.nameZh)}</h2>
            ${role}
            <p class="about-loc">${t(profile.location, profile.locationZh)}</p>
          </aside>
          <div class="about-main">
            ${intro}
          </div>
        </div>`
      )}
      ${subBlock(
        "sub-statement",
        "sub_statement",
        `
        <h4 class="ctx-subhead">${t(st.title || "Artist Statement", st.titleZh || "艺术家陈述")}</h4>
        <div class="stmt-main">${paragraphs}</div>`
      )}
      ${subBlock("sub-cv", "sub_cv", `<p class="muted">${ui("cv_soon")}</p>`)}
      ${subBlock(
        "sub-contact",
        "sub_contact",
        `
        <div class="contact-block">
          <a href="mailto:${profile.email}">${profile.email}</a>
          ${
            profile.phone
              ? `<a href="tel:${String(profile.phone).replace(/\s/g, "")}">${profile.phone}</a>`
              : ""
          }
          ${
            profile.website
              ? `<a href="${profile.website}" target="_blank" rel="noopener">${profile.website.replace(/^https?:\/\//, "")}</a>`
              : ""
          }
          <a href="${gh}" target="_blank" rel="noopener">GitHub</a>
        </div>`
      )}
    </div>`;
}

/* ---------------- Footer ---------------- */

function renderFooter() {
  document.getElementById("footer").innerHTML = `
    <div class="footer-inner">
      <div>
        <div class="footer-name">${t(profile.name, profile.nameZh)}</div>
        <div class="footer-meta">${t(
          "Hangzhou / Qingdao",
          "杭州 / 青岛"
        )}</div>
      </div>
      <div class="footer-links">
        <a href="mailto:${profile.email}">${profile.email}</a>
        ${
          profile.website
            ? `<a href="${profile.website}" target="_blank" rel="noopener">${profile.website.replace(/^https?:\/\//, "")}</a>`
            : ""
        }
        <a href="${profile.github || "https://github.com/maxinyi28"}" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>`;
}

function renderNav() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = ui(el.dataset.i18n);
  });
  const tg = document.getElementById("langToggle");
  if (tg) tg.textContent = LANG === "en" ? "中文" : "EN";
}

function renderAll() {
  try {
    renderLanding();
    renderWorksSection();
    renderPractice();
    renderExperience();
    renderContext();
    renderAbout();
    renderFooter();
    renderWorks();
    renderNav();
    const v = document.getElementById("viewer");
    if (v && v.classList.contains("open")) renderViewer();
  } catch (err) {
    console.error("[portfolio] renderAll failed:", err);
  }
}

function bindDelegation() {
  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) {
      e.preventDefault();
      goTo(go.dataset.go);
      return;
    }
    const sub = e.target.closest(".sub-nav-link");
    if (sub) {
      e.preventDefault();
      const target = document.querySelector(sub.getAttribute("href"));
      if (target) motionScrollTo(target);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  initWorks();
  bindDelegation();
  initInteractions();
  initMotion();
  if (typeof replayLandingCssMotion === "function") replayLandingCssMotion();
  document.getElementById("langToggle").addEventListener("click", () => {
    setLang(LANG === "en" ? "zh" : "en");
    renderAll();
    refreshMotion();
  });
});
