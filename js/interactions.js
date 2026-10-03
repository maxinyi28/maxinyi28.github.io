/* Custom cursor + hover states */

function initInteractions() {
  const onScroll = () => {
    document.body.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  initInkCursor();
}

function initInkCursor() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const dot = document.createElement("div");
  dot.className = "ink-cursor";
  const ring = document.createElement("div");
  ring.className = "ink-cursor-ring";
  document.body.append(dot, ring);

  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;

  document.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    dot.classList.add("visible");
    ring.classList.add("visible");
  }, { passive: true });

  document.addEventListener("mousedown", () => dot.classList.add("down"));
  document.addEventListener("mouseup", () => dot.classList.remove("down"));

  document.addEventListener("mouseover", (e) => {
    const t = e.target;
    if (t.closest("a, button, .work-card, .hub-link, .site-lang, .viewer-close, .viewer-media-btn, .viewer-prev, .viewer-next, [data-go]")) {
      ring.classList.add("hover");
    }
  });
  document.addEventListener("mouseout", (e) => {
    const t = e.target;
    if (t.closest("a, button, .work-card, .hub-link, .site-lang, .viewer-close, .viewer-media-btn, .viewer-prev, .viewer-next, [data-go]")) {
      ring.classList.remove("hover");
    }
  });

  const tick = () => {
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    dot.style.left = `${tx}px`;
    dot.style.top = `${ty}px`;
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    requestAnimationFrame(tick);
  };
  tick();
}
