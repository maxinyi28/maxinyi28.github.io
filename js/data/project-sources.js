/* ========================================
   Project Sources — 艺术项目 folder mapping
   Desktop source: /Users/xinyima/Desktop/艺术项目
   Website media:   works/{work-id}/
   ======================================== */

const PROJECT_ROOT = "/Users/xinyima/Desktop/艺术项目";

const PROJECT_SOURCES = {
  "rolling-down-the-hill": {
    folder: "滚蛋行动",
    note: "Performance video + stop-motion frames",
  },
  "shame-to-sing-a-song": {
    folder: "声音项目/shoutao",
    alt: "拼好展/总结（给公众号",
    note: "Interactive glove + flute · Teensy 4.0 · 羞于歌唱 · exhibition photos in 拼好展",
  },
  "sound-and-body-study": {
    folder: "声音项目/诗歌",
    alt: "声音项目/声音课",
    note: "Dream archive, poems, blindfolded ~7min performance — NOT the glove project",
  },
  "untitled-animation": {
    folder: "k",
    note: "Hand-drawn keyframes + final frames",
  },
  "patchwork-exhibition": {
    folder: "拼好展",
    note: "Installation, poster, curatorial docs",
  },
  zine: {
    folder: "书",
    note: "Artist book, marbling, binding",
  },
  "body-workshop": {
    folder: "舞/街舞文化研究与即兴实践",
    note: "Workshop photos + practice screenshots",
  },
  woodturning: {
    folder: "木旋",
    note: "Woodturning process photos",
  },
  "3d-print-interaction": {
    folder: "虚拟感官，交互设计，3d打印",
    note: "3D models + final documentation",
  },
  "mixed-sensory": {
    folder: "混合感官实验",
    note: "Sensory experiments + 新尝试",
  },
  "invitation-to-dance": {
    folder: "编程结课",
    alt: "影像序列/2025编程课",
    note: "Processing sketch + color video frames",
  },
  drawing: {
    folder: "画",
    note: "Works on paper + digital drawing",
  },
  "exhibition-may": {
    folder: "2025五月之初",
    note: "Group show 五月之初发生了什么",
  },
  "exhibition-pull-switch": {
    folder: null,
    note: "No dedicated folder yet — add to 艺术项目 if you have photos",
  },
  "exhibition-who-am-i": {
    folder: null,
    note: "No dedicated folder yet",
  },
  "exhibition-zhenan": {
    folder: null,
    note: "No dedicated folder yet",
  },
  "subtitle-proofread": {
    folder: null,
    note: "Documentary subtitle work — text-based",
  },
};

function projectPath(workId) {
  const src = PROJECT_SOURCES[workId];
  if (!src || !src.folder) return null;
  return `${PROJECT_ROOT}/${src.folder}`;
}
