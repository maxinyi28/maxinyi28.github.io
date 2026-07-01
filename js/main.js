/* ========================================
   Xinyi Ma · Portfolio — Main
   Masonry grid, filter, lightbox
   ======================================== */

const masonry = document.getElementById("masonry");
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightbox-content");
const lightboxCaption = document.getElementById("lightbox-caption");
let currentFilter = "all";

// ==================== Render ====================

function render(filter) {
  const filtered = filter === "all"
    ? works
    : works.filter((w) => String(w.year) === filter);

  masonry.innerHTML = filtered
    .map((work, i) => {
      const hasImage = work.images && work.images.length > 0;
      const hasVideo = work.video && work.video.length > 0;
      const imgSrc = hasImage ? work.images[0] : "";
      const isImg = imgSrc.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i);

      return `
        <div class="masonry-item ${hasVideo ? "video-thumb" : ""}" data-index="${i}" data-year="${work.year}">
          ${
            hasImage
              ? isImg
                ? `<img src="${imgSrc}" alt="${work.title}" loading="lazy" />`
                : `<div class="placeholder-img"><span>📷 ${imgSrc}</span></div>`
              : hasVideo
              ? `<div class="placeholder-img" style="background:linear-gradient(135deg,#e8e0d8,#d4c8bc)">
                   <span class="play-indicator">&#9654;</span>
                   <span style="position:absolute;bottom:12px;font-size:0.75rem;color:#666;">点击预览视频</span>
                 </div>`
              : `<div class="placeholder-img"><span>✧</span></div>`
          }
          <div class="item-info">
            <div class="item-title">${work.title}</div>
            <div class="item-meta">${work.date || work.year}</div>
            <div class="item-medium">${work.medium}</div>
          </div>
        </div>
      `;
    })
    .join("");

  // Attach click listeners
  document.querySelectorAll(".masonry-item").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = parseInt(el.dataset.index, 10);
      const work = filtered[idx];
      openLightbox(work);
    });
  });
}

// ==================== Lightbox ====================

function openLightbox(work) {
  const hasImages = work.images && work.images.length > 0;

  if (hasImages) {
    lightboxContent.innerHTML = work.images
      .map((src) => {
        const isVideo = src.match(/\.(mp4|webm|mov)$/i);
        return isVideo
          ? `<video controls><source src="${src}" /></video>`
          : `<img src="${src}" alt="${work.title}" />`;
      })
      .join("");
  } else if (work.video) {
    const youtubeId = extractYoutubeId(work.video);
    if (youtubeId) {
      lightboxContent.innerHTML = `<div style="position:relative;width:100%;max-width:720px;aspect-ratio:16/9;">
        <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1"
          style="position:absolute;inset:0;width:100%;height:100%;"
          frameborder="0" allow="autoplay;encrypted-media" allowfullscreen></iframe>
      </div>`;
    } else {
      lightboxContent.innerHTML = `<video controls><source src="${work.video}" /></video>`;
    }
  } else {
    lightboxContent.innerHTML = `<div style="color:white;padding:40px;text-align:center;">
      <p style="font-size:1.2rem;">${work.title}</p>
      <p style="margin-top:12px;color:rgba(255,255,255,0.6);">${work.desc || ""}</p>
    </div>`;
  }

  lightboxCaption.textContent = `${work.title} · ${work.medium}`;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightboxContent.innerHTML = "";
  lightboxCaption.textContent = "";
  document.body.style.overflow = "";
}

function extractYoutubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// Close lightbox on backdrop click
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ==================== Filter ====================

document.querySelectorAll(".year-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".year-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.year;
    render(currentFilter);
  });
});

// ==================== Init ====================

render("all");
