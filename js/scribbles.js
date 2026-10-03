/* ========================================
   scribbles.js — 不规则手绘线生成器
   参考 Jonathan Calugi 的一笔连续线条气质
   ======================================== */

// 确定性伪随机（同 seed 每次一致）
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 横向流动线
function scribblePath(w, h, opts = {}) {
  const { amp = 10, step = 6, jitter = 3, freq = 0.018, seed = 7 } = opts;
  const rng = mulberry32(seed);
  const y0 = h / 2;
  let d = `M 0 ${(y0 + (rng() - 0.5) * jitter * 2).toFixed(1)}`;
  for (let x = step; x <= w + step; x += step) {
    const y =
      y0 +
      amp * Math.sin(x * freq + seed) +
      amp * 0.55 * Math.sin(x * freq * 2.7 + seed * 2) +
      amp * 0.25 * Math.sin(x * freq * 5.1 + seed * 3) +
      (rng() - 0.5) * jitter * 2;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

// 竖直流动线（时间线用）
function scribblePathV(h, w = 10, opts = {}) {
  const { amp = 3, step = 6, jitter = 1.6, freq = 0.02, seed = 11 } = opts;
  const rng = mulberry32(seed);
  const x0 = w / 2;
  let d = `M ${(x0 + (rng() - 0.5) * jitter * 2).toFixed(1)} 0`;
  for (let y = step; y <= h + step; y += step) {
    const x =
      x0 +
      amp * Math.sin(y * freq + seed) +
      amp * 0.6 * Math.sin(y * freq * 2.3 + seed * 2) +
      (rng() - 0.5) * jitter * 2;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

// 不规则圆角边框（作品卡片 hover 用）
function scribbleRect(w, h, opts = {}) {
  const { jitter = 3, seed = 23 } = opts;
  const rng = mulberry32(seed);
  const j = () => (rng() - 0.5) * jitter * 2;
  const pts = [];
  const along = (x0, y0, x1, y1, n, px, py) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push([x0 + (x1 - x0) * t + px * j(), y0 + (y1 - y0) * t + py * j()]);
    }
  };
  along(0, 0, w, 0, 20, 0, 1);   // 上边
  along(w, 0, w, h, 20, -1, 0);  // 右边
  along(w, h, 0, h, 20, 0, -1);  // 下边
  along(0, h, 0, 0, 20, 1, 0);   // 左边
  return "M " + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ") + " Z";
}

// 包成内联 SVG（pathLength=1 便于 stroke 绘制动画；vector-effect 保持线宽一致）
function scribbleSVG(viewBox, d, stroke = "var(--ink)", cls = "", sw = 1.4) {
  return `<svg class="scribble ${cls}" viewBox="${viewBox}" preserveAspectRatio="none" fill="none"
    stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path pathLength="1" vector-effect="non-scaling-stroke" d="${d}"></path>
  </svg>`;
}

// Hero 一笔连续线 — 抽象人形 + 梦的逻辑（参考 Jonathan Calugi / 无题动画）
function heroLineSVG(seed = 7) {
  const d = scribblePath(1000, 44, { amp: 14, jitter: 4, freq: 0.012, seed });
  return `<svg class="scribble hero-scribble-svg" viewBox="0 0 1000 44" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path class="hero-scribble-glow" vector-effect="non-scaling-stroke" d="${d}"
      stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.22"/>
    <path class="hero-scribble-base" vector-effect="non-scaling-stroke" d="${d}"
      stroke="var(--accent)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="hero-scribble-spark" vector-effect="non-scaling-stroke" d="${d}"
      stroke="var(--cream)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
  </svg>`;
}

function hubLinkScribbleSVG(seed) {
  const w = 220;
  const h = 52;
  const d = scribbleRect(w, h, { jitter: 3.4, seed });
  return `<svg class="hub-scribble" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path class="hub-scribble-path" vector-effect="non-scaling-stroke" d="${d}" fill="none" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

const HUB_SCRIBBLE_SEEDS = {
  about: 11,
  works: 19,
  practice: 27,
  experience: 33,
  context: 41,
};

function drawHubScribble(link, path, len) {
  if (typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.killTweensOf(path);
    gsap.set(path, { opacity: 1, strokeDashoffset: len });
    gsap.to(path, { strokeDashoffset: 0, duration: 0.75, ease: "sine.inOut" });
  } else {
    path.style.opacity = "1";
    path.style.transition = "stroke-dashoffset 0.75s cubic-bezier(0.22, 1, 0.36, 1)";
    path.style.strokeDashoffset = "0";
  }
}

function hideHubScribble(path, len) {
  if (typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.killTweensOf(path);
    gsap.to(path, { strokeDashoffset: len, opacity: 0, duration: 0.45, ease: "sine.inOut" });
  } else {
    path.style.strokeDashoffset = `${len}`;
    path.style.opacity = "0";
  }
}

function initHubLinkScribbles(root) {
  root.querySelectorAll(".hub-link").forEach((link) => {
    const path = link.querySelector(".hub-scribble-path");
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.style.opacity = "0";

    link.onmouseenter = () => drawHubScribble(link, path, len);
    link.onmouseleave = () => hideHubScribble(path, len);
  });
}

function landingTitleMarkup() {
  return t("Holding a<br>Place for…", "占位符<br>留给……");
}

let heroLineGsapCtx = null;

function heroPathLength(path) {
  return path.getTotalLength() || 1000;
}

function prepHeroStroke(path, len, offset, opacity) {
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${offset}`;
  path.style.opacity = String(opacity);
}

function drawHeroPathsGsap(mount, base, glow, spark) {
  const len = heroPathLength(base);
  const glowLen = glow ? heroPathLength(glow) : 0;
  const sparkLen = spark ? heroPathLength(spark) : 0;

  gsap.set(mount, { opacity: 1 });
  gsap.set(base, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.55 });
  if (glow) gsap.set(glow, { strokeDasharray: glowLen, strokeDashoffset: glowLen, opacity: 0.08 });
  if (spark) {
    gsap.set(spark, {
      strokeDasharray: `${sparkLen * 0.035} ${sparkLen}`,
      strokeDashoffset: sparkLen,
      opacity: 0,
    });
  }

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.2, defaults: { ease: "sine.inOut" } });

  tl.to(base, { strokeDashoffset: 0, opacity: 1, duration: 2.8 })
    .to(glow, { strokeDashoffset: 0, opacity: 0.2, duration: 2.8 }, 0);

  if (spark) {
    tl.to(spark, { strokeDashoffset: -sparkLen * 0.4, opacity: 0.35, duration: 2.2, ease: "sine.inOut" }, 0.4)
      .to(spark, { opacity: 0, duration: 0.6 }, "-=0.3");
  }

  tl.to({}, { duration: 1.6 })
    .to(mount, { opacity: 0.2, duration: 0.7 })
    .add(() => {
      gsap.set(base, { strokeDashoffset: len, opacity: 0.55 });
      if (glow) gsap.set(glow, { strokeDashoffset: glowLen, opacity: 0.08 });
      if (spark) gsap.set(spark, { strokeDashoffset: sparkLen, opacity: 0 });
    })
    .to(mount, { opacity: 1, duration: 0.5 });

  return tl;
}

function initHeroLineDraw(root) {
  heroLineGsapCtx?.revert();
  heroLineGsapCtx = null;

  const scope = root?.querySelector ? root : document;
  const mount = scope.querySelector("#heroLineMount");
  if (!mount) return;

  const base = mount.querySelector(".hero-scribble-base");
  const glow = mount.querySelector(".hero-scribble-glow");
  const spark = mount.querySelector(".hero-scribble-spark");
  if (!base) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    const len = heroPathLength(base);
    prepHeroStroke(base, len, 0, 1);
    if (glow) glow.style.opacity = "0";
    if (spark) spark.style.opacity = "0";
    return;
  }

  function startDraw() {
    if (typeof gsap !== "undefined") {
      heroLineGsapCtx = gsap.context(() => {
        drawHeroPathsGsap(mount, base, glow, spark);
      }, mount);
    } else {
      const len = heroPathLength(base);
      prepHeroStroke(base, len, 0, 1);
    }
  }

  startDraw();
}

function heroFigurePath() {
  return [
    "M 420 560",
    "C 360 560, 320 500, 330 430",
    "C 340 360, 390 310, 420 270",
    "C 450 230, 470 170, 440 110",
    "C 420 60, 380 30, 400 20",
    "C 420 30, 450 70, 445 120",
    "C 440 170, 410 210, 400 250",
    "C 390 290, 420 330, 460 350",
    "C 500 370, 540 400, 520 450",
    "C 500 500, 440 520, 380 500",
    "C 320 480, 280 430, 300 370",
    "C 320 310, 380 290, 420 300",
    "C 460 310, 490 350, 480 400",
    "C 470 450, 430 480, 400 490",
    "C 370 500, 350 530, 380 550",
    "C 400 560, 420 560, 420 560",
  ].join(" ");
}

function titleLineSVG(seed = 7) {
  return scribbleSVG("0 0 480 28", scribblePath(480, 28, { amp: 8, jitter: 2.5, freq: 0.022, seed }), "var(--accent)", "title-line", 1.2);
}

// 多种闪电环形状：每张作品形态不同
function lightningFramePath(w, h, opts = {}) {
  const { seed = 23, shape = 0 } = opts;
  const rng = mulberry32(seed);
  const cx = w / 2;
  const cy = h / 2;

  if (shape === 1) {
    // 尖刺星形
    const spikes = 9 + Math.floor(rng() * 5);
    const pts = [];
    for (let i = 0; i < spikes; i++) {
      const a = (i / spikes) * Math.PI * 2 + rng() * 0.15;
      const rIn = 0.55 + rng() * 0.12;
      const rOut = 0.95 + rng() * 0.35;
      pts.push([cx + Math.cos(a) * (w * 0.38) * rOut, cy + Math.sin(a) * (h * 0.38) * rOut]);
      const a2 = a + Math.PI / spikes;
      pts.push([cx + Math.cos(a2) * (w * 0.38) * rIn, cy + Math.sin(a2) * (h * 0.38) * rIn]);
    }
    return "M " + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ") + " Z";
  }

  if (shape === 2) {
    // 开放弧：像一道闪电绕半圈，不闭合
    const steps = 18 + Math.floor(rng() * 8);
    const start = Math.PI * (0.15 + rng() * 0.4);
    const sweep = Math.PI * (1.1 + rng() * 0.6);
    let d = "";
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const a = start + sweep * t;
      const bolt = (i % 2 === 0 ? 1 : -1) * (0.08 + rng() * 0.22);
      const r = 0.72 + bolt + rng() * 0.1;
      const x = cx + Math.cos(a) * w * 0.42 * r;
      const y = cy + Math.sin(a) * h * 0.42 * r;
      d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  }

  if (shape === 3) {
    // 歪斜菱形闪电
    const pts = [];
    const corners = [
      [0.5, 0.08], [0.92, 0.5], [0.5, 0.92], [0.08, 0.5],
    ].map(([u, v]) => [u + (rng() - 0.5) * 0.08, v + (rng() - 0.5) * 0.08]);
    for (let c = 0; c < 4; c++) {
      const [ax, ay] = corners[c];
      const [bx, by] = corners[(c + 1) % 4];
      const segs = 3 + Math.floor(rng() * 3);
      for (let i = 0; i < segs; i++) {
        const t = i / segs;
        const jx = (rng() - 0.5) * 0.12;
        const jy = (rng() - 0.5) * 0.12;
        pts.push([(ax + (bx - ax) * t + jx) * w, (ay + (by - ay) * t + jy) * h]);
      }
    }
    return "M " + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ") + " Z";
  }

  if (shape === 4) {
    // 不规则三角环 + 折角
    const verts = 5 + Math.floor(rng() * 3);
    const pts = [];
    for (let i = 0; i < verts; i++) {
      const a = (i / verts) * Math.PI * 2 - Math.PI / 2 + (rng() - 0.5) * 0.35;
      const r = 0.7 + rng() * 0.45;
      pts.push([cx + Math.cos(a) * w * 0.4 * r, cy + Math.sin(a) * h * 0.4 * r]);
      if (rng() > 0.4) {
        const a2 = a + 0.2 + rng() * 0.25;
        const r2 = r * (0.55 + rng() * 0.25);
        pts.push([cx + Math.cos(a2) * w * 0.4 * r2, cy + Math.sin(a2) * h * 0.4 * r2]);
      }
    }
    return "M " + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ") + " Z";
  }

  // shape 0：松散椭圆环
  const steps = 22 + Math.floor(rng() * 10);
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2 - Math.PI * 0.55;
    const baseR = 0.78 + rng() * 0.38;
    const bolt = i % 3 === 1 ? 0.22 + rng() * 0.28 : i % 3 === 2 ? -(0.1 + rng() * 0.16) : rng() * 0.08 - 0.04;
    const rScale = baseR + bolt;
    const wobble = (rng() - 0.5) * 0.12;
    pts.push([
      cx + Math.cos(a + wobble) * w * 0.42 * rScale,
      cy + Math.sin(a + wobble) * h * 0.42 * rScale,
    ]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const prev = pts[i - 1];
    if (i % 4 === 0) {
      const midX = (prev[0] + p[0]) / 2 + (rng() - 0.5) * 18;
      const midY = (prev[1] + p[1]) / 2 + (rng() - 0.5) * 14;
      d += ` L ${midX.toFixed(1)} ${midY.toFixed(1)} L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    } else {
      d += ` L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    }
  }
  return `${d} Z`;
}

function cardScribbleSVG(w, h, seed, shape = 0) {
  const d = lightningFramePath(w, h, { seed, shape });
  return `<svg class="scribble card-scribble" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path class="card-scribble-glow" vector-effect="non-scaling-stroke" d="${d}"
      stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
    <path class="card-scribble-path" vector-effect="non-scaling-stroke" d="${d}"
      stroke="var(--accent-2)" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="card-scribble-spark" vector-effect="non-scaling-stroke" d="${d}"
      stroke="var(--cream)" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
  </svg>`;
}

const cardSparkLoops = new WeakMap();

function prepCardStroke(path, len, offset, opacity) {
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${offset}`;
  path.style.opacity = String(opacity);
}

function drawCardScribble(card, paths) {
  const { base, glow, spark } = paths;
  const len = base.getTotalLength() || 1000;
  const glowLen = glow?.getTotalLength() || len;
  const sparkLen = spark?.getTotalLength() || len;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  cardSparkLoops.get(card)?.kill();
  cardSparkLoops.delete(card);

  if (typeof gsap !== "undefined" && !reduced) {
    gsap.killTweensOf([base, glow, spark]);
    gsap.set(base, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
    if (glow) gsap.set(glow, { strokeDasharray: glowLen, strokeDashoffset: glowLen, opacity: 0 });
    if (spark) {
      gsap.set(spark, {
        strokeDasharray: `${sparkLen * 0.07} ${sparkLen}`,
        strokeDashoffset: sparkLen,
        opacity: 0,
      });
    }

    gsap.to(base, { strokeDashoffset: 0, opacity: 0.95, duration: 2.1, ease: "sine.inOut" });
    if (glow) {
      gsap.to(glow, { strokeDashoffset: 0, opacity: 0.14, duration: 2.4, ease: "sine.inOut" }, 0.12);
    }
    if (spark) {
      gsap.to(spark, { opacity: 0.55, duration: 0.8, ease: "sine.out" }, 0.9);
      const loop = gsap.to(spark, {
        strokeDashoffset: -sparkLen * 0.55,
        duration: 3.2,
        ease: "none",
        repeat: -1,
      });
      cardSparkLoops.set(card, loop);
    }
    card.classList.add("is-scribble-live");
    return;
  }

  prepCardStroke(base, len, 0, 1);
  if (glow) prepCardStroke(glow, glowLen, 0, 0.2);
  if (spark) prepCardStroke(spark, sparkLen, 0, 0);
  card.classList.add("is-scribble-live");
}

function hideCardScribble(card, paths) {
  const { base, glow, spark } = paths;
  const len = base.getTotalLength() || 1000;
  const glowLen = glow?.getTotalLength() || len;
  const sparkLen = spark?.getTotalLength() || len;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  cardSparkLoops.get(card)?.kill();
  cardSparkLoops.delete(card);
  card.classList.remove("is-scribble-live");

  if (typeof gsap !== "undefined" && !reduced) {
    gsap.killTweensOf([base, glow, spark]);
    if (spark) gsap.set(spark, { opacity: 0 });
    gsap.to(base, { strokeDashoffset: len, opacity: 0, duration: 0.9, ease: "sine.inOut" });
    if (glow) {
      gsap.to(glow, { strokeDashoffset: glowLen, opacity: 0, duration: 0.8, ease: "sine.inOut" }, 0.06);
    }
    return;
  }

  prepCardStroke(base, len, len, 0);
  if (glow) prepCardStroke(glow, glowLen, glowLen, 0);
  if (spark) prepCardStroke(spark, sparkLen, sparkLen, 0);
}

function initWorkCardScribbles(root = document) {
  root.querySelectorAll(".work-card").forEach((card) => {
    const base = card.querySelector(".card-scribble-path");
    if (!base || card.dataset.scribbleReady === "1") return;

    const glow = card.querySelector(".card-scribble-glow");
    const spark = card.querySelector(".card-scribble-spark");
    const paths = { base, glow, spark };
    const len = base.getTotalLength() || 1000;

    prepCardStroke(base, len, len, 0);
    if (glow) prepCardStroke(glow, glow.getTotalLength() || len, glow.getTotalLength() || len, 0);
    if (spark) prepCardStroke(spark, spark.getTotalLength() || len, spark.getTotalLength() || len, 0);

    const show = () => drawCardScribble(card, paths);
    const hide = () => hideCardScribble(card, paths);

    card.addEventListener("mouseenter", show);
    card.addEventListener("mouseleave", hide);
    card.addEventListener("focusin", show);
    card.addEventListener("focusout", (e) => {
      if (!card.contains(e.relatedTarget)) hide();
    });

    card.dataset.scribbleReady = "1";
  });
}

function initInkDraw(root = document) {
  root.querySelectorAll(".scribble-draw path, .hero-figure path").forEach((p) => {
    if (p.closest(".hero-line-live")) return;
    p.style.strokeDasharray = "1";
    p.style.strokeDashoffset = "1";
    requestAnimationFrame(() => {
      p.style.transition = "stroke-dashoffset 2.8s cubic-bezier(0.22, 1, 0.36, 1)";
      p.style.strokeDashoffset = "0";
    });
  });
}
