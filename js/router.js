/* ========================================
   router.js — hash 路由切换 section
   ======================================== */

const SECTION_ORDER = ["landing", "works", "practice", "experience", "context", "about"];

function getSection() {
  const h = location.hash.slice(1).split("/")[0];
  // legacy redirects
  if (h === "statement" || h === "therapy") return h === "statement" ? "about" : "context";
  return SECTION_ORDER.includes(h) ? h : "landing";
}

function showSection(name) {
  SECTION_ORDER.forEach((s) => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle("active", s === name);
  });
  document.body.dataset.section = name;
  document.body.classList.toggle("route-landing", name === "landing");
  document.dispatchEvent(new CustomEvent("section-change", { detail: name }));
  window.scrollTo(0, 0);
}

function goTo(name) {
  if (name !== getSection()) history.pushState(null, "", "#" + name);
  showSection(name);
}

document.querySelector(".nav-logo").addEventListener("click", (e) => {
  e.preventDefault();
  goTo("landing");
});

window.addEventListener("hashchange", () => showSection(getSection()));
if (!location.hash || location.hash === "#") history.replaceState(null, "", "#landing");
showSection(getSection());
