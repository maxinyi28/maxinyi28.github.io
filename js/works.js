/* ========================================
   Works Data
   Add new works to the `works` array.
   Each work can have multiple images/videos.
   ======================================== */

const works = [
  // ==================== 2026 ====================
  {
    year: 2026,
    title: "Zine · 艺术家书创作",
    medium: "书籍设计 · InDesign",
    desc: "参与中国美术学院「回本（Breaking Even）」艺术家书展。使用 InDesign 制作 Zine，探索书籍作为艺术媒介的表达可能。",
    images: [],
    date: "2026.06",
  },
  {
    year: 2026,
    title: "身体工作坊 — 街舞即兴与身心放松",
    medium: "工作坊引导 · 身心实践",
    desc: "设计并引导身体律动工作坊，融合街舞即兴、身体敲击、节奏练习与引导放松。参与者反馈：身体觉知提升、情绪释放、安全感增强。",
    images: [],
    date: "2026.04",
  },
  {
    year: 2026,
    title: "英文字幕校对 · 纪录片《游荡自由》",
    medium: "翻译 · 校对",
    desc: "独立纪录片英文字幕校对，导演闵奥。",
    images: [],
    date: "2026.06",
  },

  // ==================== 2025 ====================
  {
    year: 2025,
    title: "Rolling Down the Hill 滚蛋行动",
    medium: "行为表演 · 影像 · 定格动画",
    desc: "与参与者在草坡上反复滚落，探索失控、共享节奏与重力下的身体互动。结合现场录像与手工卡纸拼贴定格动画。原创音乐作曲。",
    images: [],
    video: "https://youtu.be/BSE2M6z4fUE",
    date: "2025.03",
  },
  {
    year: 2025,
    title: "Shame to Sing a Song",
    medium: "行为表演 · 可穿戴乐器",
    desc: "开发可穿戴数据手套，手部动作实时控制不稳定电子声音，同时演奏长笛。探讨训练出的控制与失控之间的张力。曾在拼好展展出。",
    images: [],
    date: "2025",
  },
  {
    year: 2025,
    title: "Sound and Body Study",
    medium: "声音 · 行为表演",
    desc: "基于短文本和梦境片段创作声音作品。蒙眼即兴表演，仅依靠声音与身体感知。",
    images: [],
    video: "https://youtu.be/gITSYCHhno8",
    date: "2025",
  },
  {
    year: 2025,
    title: "无题 · Untitled",
    medium: "逐帧动画 · 1min 39sec",
    desc: "以梦境为灵感的手绘扫描动画，探索潜意识意象与心理体验。声音与 AI 合作创作。",
    images: [],
    video: "https://youtu.be/YZfuG1BNodY",
    date: "2025",
  },
  {
    year: 2025,
    title: "拼好展 · Patchwork Exhibition",
    medium: "展览策划",
    desc: "发起并策划群展，为工作室同学提供展陈机会。负责展览主题确立、前言写作、整体规划与协调。",
    images: [],
    date: "2025",
  },
  {
    year: 2025,
    title: "木旋 · Woodturning",
    medium: "数字制造 · 木材",
    desc: "木旋车床实践，作为数字制造与材料探索的一部分。",
    images: [],
    date: "2025",
  },
  {
    year: 2025,
    title: "展览：拉线开关",
    medium: "校园画作小展览",
    desc: "杭州",
    images: [],
    date: "2025.04",
  },
  {
    year: 2025,
    title: "展览：五月之初发生了什么？",
    medium: "群展",
    desc: "杭州",
    images: [],
    date: "2025.05",
  },
  {
    year: 2025,
    title: "展览：我是谁？艺术创作者的简介",
    medium: "群展",
    desc: "杭州",
    images: [],
    date: "2025.10",
  },

  // ==================== 2024 ====================
  {
    year: 2024,
    title: "邀您共舞 · Invitation to Dance",
    medium: "交互式创意编程 · Processing",
    desc: "声音反应粒子可视化程序，彩色球体随音乐实时舞动。鼠标交互改变光照氛围。配以诗意叙事文本探索算法中的意识。",
    images: [],
    date: "2024",
  },
  {
    year: 2024,
    title: "展览：浙南站",
    medium: "群展",
    desc: "杭州",
    images: [],
    date: "2024.11",
  },
  {
    year: 2024,
    title: "绘画 · Drawing",
    medium: "纸上作品 · 数字绘画",
    desc: "",
    images: [],
    date: "2024",
  },
  {
    year: 2024,
    title: "混合感官实验",
    medium: "跨媒介实践",
    desc: "探索感官交叉与身体感知的实验性创作。",
    images: [],
    date: "2024",
  },
  {
    year: 2024,
    title: "交互设计 · 3D 打印 · 虚拟感官",
    medium: "3D建模 · 数字制造",
    desc: "结合虚拟感官与交互设计的 3D 打印实践。",
    images: [],
    date: "2024",
  },
];

// Sort: newest first
works.sort((a, b) => {
  if (a.year !== b.year) return b.year - a.year;
  return (b.date || "").localeCompare(a.date || "");
});
