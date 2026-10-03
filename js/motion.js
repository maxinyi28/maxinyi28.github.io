/* ========================================
   motion.js — visible motion for hash-routed Inkwell site
   Tier A: section enter · hub pill · scroll reveals · Lenis
   ======================================== */

let lenis = null;
let motionReady = false;

function motionReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function markMotionState() {
  const root = document.documentElement;
  if (motionReduced()) {
    root.dataset.motion = "reduced";
    return;
  }
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    root.dataset.motion = "off";
    return;
  }
  root.dataset.motion = "on";
}

function initMotion() {
  markMotionState();

  if (document.documentElement.dataset.motion !== "on") {
    initHeroLineDraw(document.getElementById("landing"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (typeof Lenis !== "undefined") {
    if (lenis) lenis.destroy();

    lenis = new Lenis({
      duration: 1.25,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis", "lenis-smooth");
  }

  motionReady = true;
  refreshMotion();

  document.addEventListener("section-change", () => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => refreshMotion());
  });
}

function refreshMotion() {
  if (!motionReady || typeof gsap === "undefined") {
    if (document.querySelector(".section.active")?.id === "landing") {
      replayLandingCssMotion();
    }
    return;
  }

  ScrollTrigger.getAll().forEach((st) => st.kill());
  initSectionEnter();
  initScrollReveals();
  ScrollTrigger.refresh();
}

function replayLandingCssMotion() {
  const landing = document.getElementById("landing");
  const hero = landing?.querySelector(".landing-hero");
  if (!hero) return;
  hero.classList.remove("is-live");
  void hero.offsetWidth;
  hero.classList.add("is-live");
  initHeroLineDraw(landing);
}

function initSectionEnter() {
  const section = document.querySelector(".section.active");
  if (!section) return;

  if (section.id === "landing") {
    replayLandingCssMotion();
    return;
  }

  const container = section.querySelector(".container");
  if (!container) return;

  const head = container.querySelectorAll(
    ":scope > .eyebrow, :scope > .section-title, :scope > .title-line, :scope > .page-lead, :scope > .sub-nav"
  );
  const blocks = container.querySelectorAll(":scope > .sub-block");
  const cards = section.querySelectorAll(".work-card");

  gsap.set([...head, ...blocks, ...cards], { opacity: 0, y: 52 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out", clearProps: "opacity,transform" } });
  tl.to(head, { opacity: 1, y: 0, duration: 0.85, stagger: 0.11 });
  if (cards.length) {
    tl.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, "-=0.35");
  }
  tl.to(blocks, { opacity: 1, y: 0, duration: 0.85, stagger: 0.16 }, cards.length ? "-=0.25" : "-=0.2");
}

function initScrollReveals() {
  const section = document.querySelector(".section.active");
  if (!section || section.id === "landing") return;

  const stmtPs = section.querySelectorAll(".stmt-p");
  if (stmtPs.length) {
    gsap.set(stmtPs, { opacity: 0, y: 32 });
    ScrollTrigger.batch(stmtPs, {
      start: "top 82%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.18,
          duration: 0.75,
          ease: "power3.out",
        }),
    });
  }

  section.querySelectorAll(".about-intro").forEach((p, i) => {
    if (i === 0) return;
    gsap.set(p, { opacity: 0, y: 28 });
    ScrollTrigger.create({
      trigger: p,
      start: "top 85%",
      once: true,
      onEnter: () => gsap.to(p, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }),
    });
  });
}

function refreshViewerMotion() {
  if (motionReduced() || typeof gsap === "undefined") return;
  const sections = document.querySelectorAll("#viewer .proj-section");
  if (!sections.length) return;
  gsap.fromTo(
    sections,
    { opacity: 0, x: 36 },
    {
      opacity: 1,
      x: 0,
      duration: 0.65,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "opacity,transform",
    }
  );
}

function motionScrollTo(el, opts = {}) {
  if (!el) return;
  const offset =
    -(parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 64) - 24;

  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.35, ...opts });
  } else {
    el.scrollIntoView({ behavior: motionReduced() ? "auto" : "smooth", block: "start" });
  }
}
