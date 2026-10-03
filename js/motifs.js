/* Floating frames from Untitled (Dream) animation */

const MOTIF_ITEMS = [
  { src: "assets/motifs/spiral.png", className: "dream-motif--spiral", rot: "-6deg" },
  { src: "assets/motifs/prince.png", className: "dream-motif--prince", rot: "4deg" },
  { src: "assets/motifs/eye.png", className: "dream-motif--eye", rot: "0deg" },
  { src: "assets/motifs/hand.png", className: "dream-motif--hand", rot: "12deg" },
];

function initMotifs() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let layer = document.getElementById("dreamMotifs");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "dreamMotifs";
    layer.className = "dream-motifs";
    layer.setAttribute("aria-hidden", "true");
    document.body.prepend(layer);
  }

  layer.innerHTML = MOTIF_ITEMS.map((m) =>
    `<div class="dream-motif ${m.className}" style="--rot:${m.rot}"><img src="${m.src}" alt="" /></div>`
  ).join("");
}

document.addEventListener("DOMContentLoaded", initMotifs);
