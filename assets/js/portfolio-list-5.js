window.NW_PORTFOLIO=(window.NW_PORTFOLIO||[]).concat([
  {
    "id":"thomastone",
    "title":"THOMASTONE",
    "client":"THOMASTONE / 토마스톤",
    "subtitle":"AI Oral Healthcare Corporate Website & Dynamic News Experience",
    "scope":"Imweb · Custom Code · Responsive UI · News Collection · Dynamic Loading",
    "filters":["develop","branding"],
    "thumbnail":"https://cdn.imweb.me/upload/S20260219b829e728b3f2e/df99c31030165.png",
    "detailUrl":"portfolio-thomastone.html",
    "liveUrl":"https://thomastone.co.kr/"
  },
  {
    "id":"recelleclore",
    "title":"RECELLÉCLORE",
    "client":"RECELLÉCLORE / 리셀에클로",
    "subtitle":"Dermocosmetic Brand Commerce, Recell LAB & Review Content System",
    "scope":"Branding · Package · Imweb · Custom Code · Photography · Recell LAB · Review · Blog Collection · Commerce",
    "filters":["develop","branding"],
    "thumbnail":"https://cdn.imweb.me/upload/S20260219b829e728b3f2e/7df64ceed4164.png",
    "detailUrl":"portfolio-recelleclore.html",
    "liveUrl":"https://recelleclore.co.kr/"
  },
  {
    "id":"nineworks-crm",
    "title":"NINEWORKS CRM",
    "client":"NINEWORKS / Internal Project",
    "subtitle":"Internal Work Management & Client Operations System",
    "scope":"Service Planning · UX/UI · CRM · Calendar · Client · Request · Sales · Firebase",
    "filters":["system"],
    "thumbnail":"assets/nineworks-crm-cover.svg",
    "detailUrl":"portfolio-detail.html?work=nineworks-crm"
  }
]);

(() => {
  const hiddenBeforeDoctorTips = new Set([
    'ouga',
    'hollys',
    'cocos-matcha',
    '1616-brunch-coffee',
    'seolgadang',
    'puur',
    'beauness-dailyb',
    'mayer',
    'eat',
    '1plan',
    'blondy',
    'breeze-coffee',
    'cafood',
    'dev-coffee'
  ]);

  window.NW_PORTFOLIO.forEach((project) => {
    if (!project || !hiddenBeforeDoctorTips.has(project.id)) return;
    project.filters = (Array.isArray(project.filters) ? project.filters : [])
      .filter((filter) => filter !== 'package');
  });

  const steapin = {
    id: 'steapin',
    title: '스테아핀',
    client: '스테아핀',
    subtitle: 'Health Supplement Package & Product Visual Design',
    scope: 'Package Design · Product Visual',
    filters: ['branding', 'package', 'content'],
    thumbnail: 'https://cdn.imweb.me/upload/S2025061194bb8d274d3cd/d4505e36cb0ba.jpg'
  };

  if (!window.NW_PORTFOLIO.some((project) => project?.id === steapin.id)) {
    const healthdIndex = window.NW_PORTFOLIO.findIndex((project) => project?.id === 'healthd');
    const insertAt = healthdIndex >= 0 ? healthdIndex + 1 : window.NW_PORTFOLIO.length;
    window.NW_PORTFOLIO.splice(insertAt, 0, steapin);
  }
})();
