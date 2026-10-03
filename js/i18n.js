/* ========================================
   i18n.js
   ======================================== */

const URL_LANG = new URLSearchParams(location.search).get("lang");
let LANG = URL_LANG === "zh" ? "zh" : (localStorage.getItem("lang") === "zh" ? "zh" : "en");

function t(en, zh) {
  return LANG === "zh" ? zh : en;
}

const UI = {
  logo: { en: "Xinyi Ma", zh: "马欣仪" },

  hub_works:      { en: "Works",      zh: "作品" },
  hub_practice:   { en: "Practice",   zh: "实践" },
  hub_experience: { en: "Experience", zh: "经历" },
  hub_context:    { en: "Context",    zh: "脉络" },
  hub_about:      { en: "About",      zh: "关于" },

  works_eyebrow:     { en: "Works",      zh: "作品" },
  works_title:       { en: "Projects",   zh: "项目" },
  works_lead: {
    en: "Featured projects — content in progress.",
    zh: "精选项目，内容持续更新中。",
  },
  practice_eyebrow:  { en: "Practice",   zh: "实践" },
  practice_title:    { en: "Practice",   zh: "实践" },
  exp_eyebrow:       { en: "Experience", zh: "经历" },
  exp_title:         { en: "Experience", zh: "经历" },
  context_eyebrow:   { en: "Context",    zh: "脉络" },
  context_title:     { en: "Context",    zh: "脉络" },
  about_eyebrow:     { en: "About",      zh: "关于" },
  about_title:       { en: "About",      zh: "关于" },

  sub_projects:    { en: "Projects",          zh: "项目" },
  sub_movement:    { en: "Movement",          zh: "身体 / 动作" },
  sub_sound:       { en: "Sound",             zh: "声音" },
  sub_dream:       { en: "Dream / Inner Image", zh: "梦境 / 内在意象" },
  sub_making:      { en: "Making",            zh: "制作" },
  sub_care:        { en: "Care / Community",  zh: "照护 / 社群" },
  sub_community:   { en: "Community",         zh: "社群" },
  sub_technology:  { en: "Technology",        zh: "技术" },
  sub_education:   { en: "Education",         zh: "教育" },
  sub_professional:{ en: "Professional",      zh: "职业" },
  sub_technical:   { en: "Technical",         zh: "技术能力" },
  sub_exhibition:  { en: "Exhibition / Project", zh: "展览 / 项目" },
  sub_fragments:   { en: "Fragments",         zh: "碎片" },
  sub_bio:         { en: "Bio",               zh: "简介" },
  sub_statement:   { en: "Statement",         zh: "陈述" },
  sub_cv:          { en: "CV",                zh: "简历" },
  sub_contact:     { en: "Contact",           zh: "联系" },

  langs:   { en: "Languages", zh: "语言" },
  coming:  { en: "Coming soon.", zh: "内容完善中。" },
  cv_soon: { en: "CV will be added here later.", zh: "简历稍后更新。" },

  landing_line: {
    en: "From fleeting intuitions and dream images — toward body, sound, and wearable interaction.",
    zh: "从转瞬即逝的直觉与梦境图像——走向身体、声音与可穿戴互动。",
  },
  landing_eyebrow: {
    en: "Xinyi Ma · Hangzhou / Qingdao",
    zh: "马欣仪 · 杭州 / 青岛",
  },
  side_left: {
    en: "How do intangible experiences become embodied?",
    zh: "无形的经验，如何化为可感的身体经验？",
  },

  proj_title:       { en: "Title",       zh: "标题" },
  proj_question:    { en: "Question",    zh: "问题" },
  proj_process:     { en: "Process",     zh: "过程" },
  proj_work:        { en: "Work",        zh: "作品" },
  proj_reflection:  { en: "Reflection",  zh: "反思" },
  proj_work_note: {
    en: "Final work shown in the panel on the left — use arrows to browse images or video.",
    zh: "最终作品在左侧面板展示——可用箭头浏览图片或视频。",
  },

  gallery_prev: { en: "Previous", zh: "上一张" },
  gallery_next: { en: "Next", zh: "下一张" },
  process_label: { en: "Process · ", zh: "过程 · " },
  process_steps_label: { en: "Making", zh: "制作过程" },
  draft_label: { en: "In progress", zh: "进行中" },

  empty: { en: "No works yet.", zh: "暂无作品。" },
  img_soon: { en: "Image coming soon", zh: "图片待上传" },
};

function ui(key) {
  const entry = UI[key];
  if (!entry) return key;
  return entry[LANG];
}

function setLang(l) {
  LANG = l;
  localStorage.setItem("lang", l);
  document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
}

setLang(LANG);
