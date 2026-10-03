/* ========================================
   Works Data — shell only, fill project by project
   Fields when ready:
     title, medium, desc, detail, process, processSteps,
     question, reflection, venue, credits,
     date, year, thread, glyph, draft,
     cover, gallery, video, links
   ======================================== */

const THREADS = {
  inner:  { en: "Inner / Dream", zh: "内在 / 梦" },
  body:   { en: "Body / Movement", zh: "身体 / 运动" },
  sound:  { en: "Sound / Media / Interaction", zh: "声音 / 媒介 / 交互" },
  others: { en: "With Others", zh: "与他人" },
};

const PORTFOLIO_IDS = [
  "body-workshop",
  "untitled-animation",
  "sound-and-body-study",
  "rolling-down-the-hill",
  "shame-to-sing-a-song",
  "zine",
  "woodturning",
  "invitation-to-dance",
];

const FEATURED_IDS = PORTFOLIO_IDS;

const works = [
  {
    id: "body-workshop",
    year: 2026,
    date: "2026.04",
    title: { en: "Body Workshop", zh: "身体工作坊" },
    glyph: "❋",
    thread: "body",
    draft: true,
  },
  {
    id: "untitled-animation",
    year: 2025,
    date: "2025.04",
    title: { en: "dreams", zh: "dreams" },
    glyph: "◐",
    thread: "inner",
    draft: true,
    video: "https://youtu.be/YZfuG1BNodY",
  },
  {
    id: "sound-and-body-study",
    year: 2025,
    date: "2025.05",
    title: { en: "Dream Archive × Poetry × Sound", zh: "梦档案 × 诗 × 声音" },
    glyph: "♪",
    thread: "inner",
    draft: true,
  },
  {
    id: "rolling-down-the-hill",
    year: 2025,
    date: "2025.03",
    title: { en: "Rolling Down the Hill", zh: "滚蛋行动" },
    glyph: "↯",
    thread: "body",
    draft: true,
  },
  {
    id: "shame-to-sing-a-song",
    year: 2025,
    date: "2025.06",
    title: { en: "Shame to Sing a Song", zh: "羞于歌唱" },
    glyph: "✹",
    thread: "sound",
    draft: true,
  },
  {
    id: "zine",
    year: 2026,
    date: "2026.06",
    title: { en: "Silver / Red · Vol. 1", zh: "Silver / Red · 第一册" },
    glyph: "📖",
    thread: "inner",
    draft: true,
  },
  {
    id: "woodturning",
    year: 2025,
    date: "2025.09",
    title: { en: "Wood Floor", zh: "木地板" },
    glyph: "◉",
    thread: "sound",
    draft: true,
  },
  {
    id: "invitation-to-dance",
    year: 2024,
    date: "2024.12",
    title: { en: "Invitation to Dance", zh: "邀您共舞" },
    glyph: "✦",
    thread: "sound",
    draft: true,
  },
];
